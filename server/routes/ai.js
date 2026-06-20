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

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return res.status(500).json({
      message: 'GEMINI_API_KEY is not configured on the backend server. Please add your Gemini API Key to server/.env to analyze entities.'
    });
  }

  try {
    if (!genAI) {
      genAI = new GoogleGenerativeAI(apiKey);
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: `You are an expert Named Entity Recognition system.

Extract entities from the user's text and return ONLY valid JSON.

Schema:

{
  "persons": [],
  "organizations": [],
  "locations": [],
  "professions": [],
  "emails": [],
  "phones": [],
  "dates": [],
  "products": [],
  "events": [],
  "skills": [],
  "urls": []
}

Do not explain anything.
Do not add markdown.
Return only JSON.`
    });

    const result = await model.generateContent(text);
    const response = await result.response;
    let cleanText = response.text().trim();

    if (cleanText.includes('```')) {
      cleanText = cleanText.replace(/```json/gi, '').replace(/```/g, '').trim();
    }

    const entities = JSON.parse(cleanText);

    // Save to database history (save JSON representation)
    await db.run(
      'INSERT INTO history (user_id, module, input, output) VALUES (?, ?, ?, ?)',
      [req.user.id, 'Entity Recognition', text, JSON.stringify(entities)]
    );

    res.json({ entities });
  } catch (err) {
    console.error('Entity Recognition error:', err);
    res.status(500).json({ message: 'Error analyzing entities: ' + err.message });
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
