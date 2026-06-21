# EasyWithAI - AI-Powered Text Processing SaaS Dashboard

EasyWithAI is a modern, premium AI-powered SaaS dashboard built for text processing tasks. It integrates advanced Artificial Intelligence models and utility services to help users write emails, translate languages, extract entities, and convert text to speech. 

# Live Demo
https://easywithai-btmx.onrender.com



> [!NOTE]  
> **Educational & Study Purpose Disclaimer**  
> This project has been developed strictly for educational and study purposes. It serves as a portfolio piece showing integration between modern React/Vite frontends, Node.js/Express backends, SQLite databases, and the Google Gemini API.

---

## 🌟 Key Features

*   💬 **AI Email Generator**: An interactive natural-language email writer powered by the Google Gemini API (`gemini-2.5-flash`). Input instructions directly (e.g., requests, applications, complaints) to get professional, human-like responses with adjustable settings (`temperature: 1.1`, `topP: 0.95`, `topK: 40`). Supports instant copy, text file downloading, and version regeneration.
*   🌐 **Multi-Language Translator**: Translate text between 30+ languages dynamically using the Google Translate API. Includes a convenient clear-input button to reset source and translated text instantly.
*   🔍 **AI Named Entity Recognition (NER)**: Automatically analyze text to detect and extract key entities, categorizing them into *Persons*, *Organizations*, and *Locations* using Gemini LLM processing (with local heuristic fallbacks).
*   🔊 **Text-to-Speech (TTS)**: Convert generated drafts or translated texts into high-quality downloadable MP3 speech files powered by the Google TTS API.
*   📊 **Activity & History Logging**: Displays user logs, query metrics, and previous outputs in a beautiful Paginated History page. Data persists locally using a SQLite database.
*   🔒 **Secure Authentication**: Features fully functional JWT user signup, login, session validation, and account profile controls.
*   🎨 **Premium UI/UX Design**: Uses curated harmonized color palettes, sleek dark modes, subtle micro-animations (Framer Motion), and a layout designed for maximum readability.

---

## 🛠️ Technology Stack

### Frontend
*   **React 19** & **Vite** (Next-gen frontend build tool)
*   **TailwindCSS v4** (Modern utility-first styling)
*   **Lucide React** (Consistent premium icon set)
*   **Framer Motion** (Smooth fluid animations)
*   **React Hot Toast** (Reactive notification system)
*   **Axios** (Promise-based HTTP client)

### Backend
*   **Node.js** & **Express** (Robust backend API)
*   **SQLite3** (Lightweight, zero-config relational database)
*   **Google Generative AI SDK** (Direct integration with Gemini models)
*   **JSON Web Tokens (JWT)** & **BcryptJS** (Secure sessions and password hashing)
*   **Google TTS API** & **Translate Google** (Text synthesis and translations)

---

## ⚙️ Prerequisites

To run this project locally, you will need:
*   [Node.js](https://nodejs.org/) (v18.0.0 or higher)
*   [npm](https://www.npmjs.com/) (installed automatically with Node.js)
*   A **Google Gemini API Key** (You can obtain one for free from [Google AI Studio](https://aistudio.google.com/))

---

## 🚀 Installation & Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/SURIYAPRAKASH0212/EasyWithAi.git
    cd EasyWithAi
    ```

2.  **Install dependencies** for both the root project (frontend) and the server (backend):
    ```bash
    npm run install-all
    ```

3.  **Environment Configuration**:
    Create a `.env` file in the `server` directory:
    
    *   **File Path**: `server/.env`
    *   **Content**:
        ```env
        PORT=5000
        JWT_SECRET=your_super_secret_jwt_key_here
        GEMINI_API_KEY=your_gemini_api_key_here
        ```
        *Replace `your_gemini_api_key_here` with your actual Gemini API key starting with `AQ.`.*

---

## 💻 Running the Application

To run the frontend and backend servers concurrently, execute the following command from the root folder:

```bash
npm run dev
```

*   **Vite Frontend Dev Server**: Running on [http://localhost:5173](http://localhost:5173)
*   **Express API Server**: Running on [http://localhost:5000](http://localhost:5000)

---

## 📁 Project Structure

```text
EasyWithAI/
├── public/                 # Static assets (Favicons, vector icons)
├── server/                 # Express backend server
│   ├── middleware/         # Auth verification middleware
│   ├── routes/             # API routes (auth, history, AI services)
│   ├── database.js         # SQLite database connector & schema script
│   ├── database.sqlite     # Local SQLite database file (created on start)
│   ├── server.js           # Server entry point
│   └── .env                # Server environment variables (ignored by git)
├── src/                    # React frontend application
│   ├── api/                # API wrappers (axios configurations)
│   ├── components/         # Reusable layouts (Sidebar, Navbar, Loader)
│   ├── context/            # React Context (Auth & Theme settings)
│   ├── hooks/              # Custom helper hooks
│   ├── layouts/            # Dashboard layout configuration
│   ├── pages/              # View pages (Email Generator, Translator, NER, etc.)
│   └── App.jsx             # React routing and root component
├── package.json            # Root scripts and frontend packages
├── tailwind.config.js      # Styling configuration
└── README.md               # Project documentation
```

---

## 📄 License & Terms

This project is licensed under the **MIT License** - see below for details:

```text
MIT License

Copyright (c) 2026 SURIYAPRAKASH S

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

*This application is built solely for **study and non-commercial educational purposes**.*
