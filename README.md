# QuickTools

**QuickTools** is a modular web toolkit that integrates multiple utilities in one platform, including a Notepad, Voice tools, Camera capture, and an AI-powered “Ask” feature. It is built with modern technologies, designed for ease of use, and easily extendable.

---

## Tech Stack

- **Frontend:** React, TailwindCSS  
- **Backend:** FastAPI, SQLAlchemy  
- **Database:** SQLite (or any SQLAlchemy-supported database)  
- **Environment Variables:** `.env` for API keys and configuration

---

## Project Structure

quicktools/
├── frontend/ # React app
├── backend/ # FastAPI app
│ ├── app/
│ │ ├── routers/ # API routes
│ │ ├── models/ # Database models
│ │ ├── schemas/ # Pydantic schemas
│ │ ├── database.py # DB connection setup
│ │ └── main.py # FastAPI application entrypoint
├── .env # Environment variables (ignored by git)
├── .gitignore
└── README.md

- **Notepad:** Create and save notes.  
- **Camera:** Capture images using your device camera.  
- **Ask (AI):** Send questions to an AI model and store Q&A in the database.
