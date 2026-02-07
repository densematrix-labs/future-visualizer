# AI Future Visualizer

🔮 Enter any product, website, or concept — AI predicts what it will look like in 10 years.

**Live Demo:** https://future-visualizer.demo.densematrix.ai

## Features

- **AI-Powered Predictions**: Uses LLM to generate creative visions of the future
- **Multi-language Support**: 7 languages (EN, ZH, JA, DE, FR, KO, ES)
- **Retro-Futuristic Design**: Cyberpunk aesthetic with neon colors and CRT effects
- **Token System**: Free trial + paid packages via Creem payment

## Tech Stack

- **Frontend**: React + Vite (TypeScript)
- **Backend**: Python FastAPI
- **AI**: LLM via llm-proxy.densematrix.ai
- **Payment**: Creem MoR
- **Deployment**: Docker + Nginx

## Development

### Prerequisites

- Node.js 20+
- Python 3.12+
- Docker (optional)

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp ../.env.example .env
# Edit .env with your keys
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Docker

```bash
docker compose up --build
```

## Testing

### Backend

```bash
cd backend
pip install pytest pytest-cov pytest-asyncio httpx
pytest --cov=app --cov-report=term-missing
```

### Frontend

```bash
cd frontend
npm test
npm run test:coverage
```

## API Endpoints

- `GET /health` - Health check
- `GET /metrics` - Prometheus metrics
- `POST /api/v1/visualize` - Generate future vision
- `GET /api/v1/tokens/status` - Get token status
- `POST /api/v1/checkout` - Create payment checkout
- `GET /api/v1/products` - List available products

## Environment Variables

| Variable | Description |
|----------|-------------|
| `LLM_PROXY_URL` | LLM proxy endpoint |
| `LLM_PROXY_KEY` | LLM proxy API key |
| `CREEM_API_KEY` | Creem API key |
| `CREEM_WEBHOOK_SECRET` | Creem webhook secret |
| `CREEM_PRODUCT_IDS` | JSON map of SKU to Creem product IDs |

## License

MIT
