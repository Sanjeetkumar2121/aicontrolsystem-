# Advanced AI OSINT Analysis & Monitoring System

A state-of-the-art full-stack platform for real-time intelligence gathering, applying advanced AI and multi-agent systems to sift through global OSINT data streams.

## Advanced Features

- **Agentic AI Architecture**: A collaborative multi-agent system including specialized agents for Collection, Analysis, Verification, and Reporting.
- **Threat Detection Engine**: Statistical anomaly detection using Z-Score algorithms and multi-dimensional risk scoring.
- **Geo-Spatial Intelligence**: Real-time visualization of global events through regional heatmaps and geo-tagging.
- **Cognitive Analysis**:
  - **Sentiment & NER**: Deep extraction of emotional tone and named entities.
  - **Bot & Propaganda Detection**: Heuristic-based identification of automated amplification campaigns.
  - **Credibility Scoring**: Automated verification and credibility assessment of global data sources.
- **Multi-Language Sifting**: Support for monitoring and analyzing information domains in English, Hindi, Urdu, and other regional languages.
- **Executive Reporting**: Automated SITREP generation and intelligence briefs.

## Tech Stack

### AI & Agents
- **Multi-Agent System**: Python-based autonomous agents.
- **NLP**: spaCy (NER), Rule-based Sentiment & Classification.
- **Statistical Algorithms**: Z-Score anomaly detection.

### Frontend & Backend
- **Frontend**: React.js, Tailwind CSS v4, Recharts.
- **Backend**: FastAPI (Python), MongoDB (with In-Memory Failover).

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 18+
- MongoDB (Optional, system includes automatic mock fallback)

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Create a `.env` file (optional):
   ```env
   MONGO_URL=mongodb://localhost:27017
   DB_NAME=osint_db
   ```
4. Run the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```
5. (Optional) Run the mock data generator to see live data:
   ```bash
   python mock_generator.py
   ```

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## API Endpoints
- `GET /api/topics`: List all monitored topics.
- `POST /api/add-topic`: Add a new keyword.
- `GET /api/data`: Fetch processed OSINT data.
- `GET /api/alerts`: Fetch system alerts.
- `WS /api/ws`: Real-time data stream.
