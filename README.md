Zaio Full-Stack AI Engineer Bootcamp Handbook

## About the Project
-This project: AI assistant that answers questions using information from a Zaio Full-Stack AI Engineer Bootcamp Handbook
-The handbook PDF is read and split into smaller pieces of text called chunks. These chunks are stored in ChromaDB.
-When a user asks a question, the system searches ChromaDB for information that is related to the question. The relevant information is then sent to Gemini to create an answer.
-The assistant must only use information from the handbook.

If the answer cannot be found, it returns:
`I could not find this information in the handbook.`

## Tools Used
- Node.js
- Express
- ChromaDB
- Gemini API
- PDF Parse
- Postman
- Supertest
- VS Code

## How the Project Works
1. The handbook PDF is loaded.
2. The text is extracted from the PDF.
3. The text is split into smaller chunks.
4. The chunks are stored in ChromaDB.
5. A user sends a question to the `/ask` API.
6. ChromaDB searches for related information.
7. The relevant information is sent to Gemini.
8. Gemini creates an answer using the handbook information.
9. The answer and source pages are returned as JSON.

## Project Files

### `app.js`
- receives the question;
- searches ChromaDB;
- sends the information to Gemini;
- returns the answer and source pages.

### `server.js`
server on port 4000.

### `processHandbook.js`
- reads the handbook PDF;
- extracts the text;
- splits the text into chunks;
- stores the chunks in ChromaDB.

### `api.test.js`
This file contains automated tests for the API.


### `testing_questions.md`
This file contains the testing results.

## `.env`: API/key holder
CHROMA_HOST=api.trychroma.com
CHROMA_API_KEY=your_chroma_key
CHROMA_TENANT=your_tenant_id
CHROMA_DATABASE=handbook-ai
GEMINI_API_KEY=your_gemini_key

## Live API
My API is deployed on Render.

Base URL:
Browser:
https://student-handbook-assistant.onrender.com

Postman:
POST https://student-handbook-assistant.onrender.com/ask

Main endpoint:
`POST /ask`