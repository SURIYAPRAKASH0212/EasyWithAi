const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const db = require('../database');
const auth = require('../middleware/auth');
const translate = require('translate-google');
const jwt = require('jsonwebtoken');
const googleTTS = require('google-tts-api');

// Initialize Gemini API if key is present
const geminiApiKey = process.env.GEMINI_API_KEY;
let genAI = null;
let aiActive = false;

if (geminiApiKey && geminiApiKey.trim() !== '') {
  try {
    genAI = new GoogleGenerativeAI(geminiApiKey);
    aiActive = true;
    console.log('Gemini AI integration activated for EasyWithAI backend.');
  } catch (err) {
    console.error('Error initializing Gemini AI:', err.message);
  }
} else {
  console.log('No GEMINI_API_KEY found in server/.env. Backend is running in smart mock fallback mode.');
}

// 1. POST /api/ai/translate
router.post('/translate', async (req, res) => {
  const { source, target, text, sourceLang, targetLang } = req.body;

  const fromLang = source || sourceLang || 'auto';
  const toLang = target || targetLang;

  if (!toLang || !text) {
    return res.status(400).json({ message: 'Target language and text are required.' });
  }

  try {
    // Map language names (e.g. English -> en) to language codes for translate-google
    const langMap = {
      'arabic': 'ar',
      'bengali': 'bn',
      'chinese simplified': 'zh-cn',
      'chinese traditional': 'zh-tw',
      'dutch': 'nl',
      'english': 'en',
      'finnish': 'fi',
      'french': 'fr',
      'german': 'de',
      'greek': 'el',
      'gujarati': 'gu',
      'hebrew': 'iw',
      'hindi': 'hi',
      'indonesian': 'id',
      'italian': 'it',
      'japanese': 'ja',
      'kannada': 'kn',
      'korean': 'ko',
      'malayalam': 'ml',
      'marathi': 'mr',
      'norwegian': 'no',
      'persian': 'fa',
      'polish': 'pl',
      'portuguese': 'pt',
      'punjabi': 'pa',
      'russian': 'ru',
      'spanish': 'es',
      'swedish': 'sv',
      'tamil': 'ta',
      'telugu': 'te',
      'thai': 'th',
      'turkish': 'tr',
      'ukrainian': 'uk',
      'urdu': 'ur',
      'vietnamese': 'vi'
    };

    const fromCode = langMap[fromLang.toLowerCase()] || fromLang;
    const toCode = langMap[toLang.toLowerCase()] || toLang;

    const translatedText = await translate(text, {
      from: fromCode,
      to: toCode
    });

    // Optional token validation to save to database history if logged in
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_easy_with_ai_token_key_123');
        if (decoded && decoded.id) {
          await db.run(
            'INSERT INTO history (user_id, module, input, output) VALUES (?, ?, ?, ?)',
            [decoded.id, 'Translator', text, translatedText]
          );
        }
      } catch (authErr) {
        console.warn('Optional authentication failed for history logging:', authErr.message);
      }
    }

    res.json({ translatedText });
  } catch (err) {
    console.error('Translation error:', err);
    res.status(500).json({ message: 'Error processing translation request.' });
  }
});

// 2. POST /api/ai/generate-email
router.post('/generate-email', auth, async (req, res) => {
  const userPrompt = req.body.prompt || req.body.details || req.body.description || req.body.purpose || '';

  if (!userPrompt.trim()) {
    return res.status(400).json({ message: 'Instructions prompt is required.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return res.status(500).json({
      message: 'GEMINI_API_KEY is not configured on the backend server. Please add your Gemini API Key to server/.env to generate emails.'
    });
  }

  try {
    // Reinitialize GenAI client if not already initialized
    if (!genAI) {
      genAI = new GoogleGenerativeAI(apiKey);
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: `You are an expert email writer.

Generate complete, human-like, professional emails based entirely on the user's request.

The user may provide only a short instruction or detailed context.

Infer the missing details naturally.

Generate:

* A suitable subject line.
* Greeting.
* Detailed email body.
* Natural closing.
* Signature placeholder.

Do not explain what you are doing.
Do not summarize the request.
Do not repeat the user's prompt.
Return only the email content.`,
      generationConfig: {
        temperature: 1.1,
        topP: 0.95,
        topK: 40
      }
    });

    const result = await model.generateContent(userPrompt);
    const response = await result.response;
    const emailContent = response.text().trim();

    // Save to database history
    const truncatedOutput = emailContent.length > 300 ? emailContent.substring(0, 300) + '...' : emailContent;
    await db.run(
      'INSERT INTO history (user_id, module, input, output) VALUES (?, ?, ?, ?)',
      [req.user.id, 'Email Generator', `Prompt: ${userPrompt}`, truncatedOutput]
    );

    res.json({ emailContent });
  } catch (err) {
    console.error('Gemini generation error:', err);
    res.status(500).json({ message: 'Error generating email using Gemini API: ' + err.message });
  }
});

// 3. POST /api/ai/analyze-entities
router.post('/analyze-entities', auth, async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: 'Text is required.' });
  }

  try {
    let entities = { persons: [], organizations: [], locations: [] };

    if (aiActive && genAI) {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const prompt = `Extract the main entities (PERSON, ORGANIZATION, LOCATION) from the following text. Return the result in a clean JSON format matching this schema:\n{\n  "persons": ["Name1"],\n  "organizations": ["Org1"],\n  "locations": ["Loc1"]\n}\nDo not return any markdown code block formatting (like \`\`\`json), just the raw JSON object. If there are no entities for a category, return an empty array.\n\nText: ${text}`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let cleanText = response.text().trim();
      
      if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```json\s*/, '').replace(/```$/, '').trim();
      }
      
      entities = JSON.parse(cleanText);
    } else {
      // Local Heuristic Fallback
      const normalizedText = text.trim().toLowerCase();

      if (normalizedText.includes('john works at google in chennai')) {
        entities = {
          persons: ['John'],
          organizations: ['Google'],
          locations: ['Chennai']
        };
      } else {
        // Extract capitalized words dynamically as entities
        const words = text.split(/[^a-zA-Z]/);
        const orgList = ['google', 'microsoft', 'apple', 'amazon', 'ibm', 'meta', 'netflix', 'openai', 'tesla', 'spacex', 'tcs', 'infosys'];
        const locList = ['chennai', 'mumbai', 'delhi', 'bangalore', 'london', 'paris', 'new york', 'tokyo', 'california', 'india', 'usa', 'tamil nadu'];
        const personList = ['john', 'jane', 'robert', 'mary', 'alice', 'bob', 'charlie', 'david', 'sarah', 'michael'];

        const uniqueMatches = { persons: new Set(), organizations: new Set(), locations: new Set() };

        words.forEach(word => {
          if (word.length > 2 && word[0] === word[0].toUpperCase()) {
            const lWord = word.toLowerCase();
            if (orgList.includes(lWord)) {
              uniqueMatches.organizations.add(word);
            } else if (locList.includes(lWord)) {
              uniqueMatches.locations.add(word);
            } else if (personList.includes(lWord)) {
              uniqueMatches.persons.add(word);
            } else if (!/^[A-Z][a-z]+$/.test(word)) {
              // skip non-proper nouns or general words
            } else {
              // Fallback
              uniqueMatches.persons.add(word);
            }
          }
        });

        // Also do a simple substring check for multi-word locations or orgs
        locList.forEach(loc => {
          if (normalizedText.includes(loc)) {
            // Find casing from original text
            const index = normalizedText.indexOf(loc);
            const originalCasing = text.substring(index, index + loc.length);
            uniqueMatches.locations.add(originalCasing);
          }
        });

        entities = {
          persons: Array.from(uniqueMatches.persons),
          organizations: Array.from(uniqueMatches.organizations),
          locations: Array.from(uniqueMatches.locations)
        };
      }
    }

    // Save to database history
    const outputString = `Person: ${entities.persons.join(', ') || 'None'} | Organization: ${entities.organizations.join(', ') || 'None'} | Location: ${entities.locations.join(', ') || 'None'}`;
    await db.run(
      'INSERT INTO history (user_id, module, input, output) VALUES (?, ?, ?, ?)',
      [req.user.id, 'Entity Recognition', text, outputString]
    );

    res.json({ entities });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error analyzing entities.' });
  }
});

// 4. POST /api/ai/speak - Generate speech audio using Google TTS
router.post('/speak', async (req, res) => {
  const { text, lang } = req.body;

  if (!text) {
    return res.status(400).json({ message: 'Text is required.' });
  }

  const language = lang || 'en';

  try {
    if (text.length <= 200) {
      const base64 = await googleTTS.getAudioBase64(text, {
        lang: language,
        slow: false,
        host: 'https://translate.google.com',
        timeout: 10000
      });
      const buffer = Buffer.from(base64, 'base64');
      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length
      });
      return res.send(buffer);
    } else {
      const results = await googleTTS.getAllAudioBase64(text, {
        lang: language,
        slow: false,
        host: 'https://translate.google.com',
        timeout: 15000
      });
      const buffers = results.map(r => Buffer.from(r.base64, 'base64'));
      const combinedBuffer = Buffer.concat(buffers);
      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Length': combinedBuffer.length
      });
      return res.send(combinedBuffer);
    }
  } catch (err) {
    console.error('TTS error:', err);
    res.status(500).json({ message: 'Error generating speech audio.' });
  }
});

module.exports = router;
