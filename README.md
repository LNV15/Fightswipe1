# Fightswipe Monorepo (API + Mobile + Admin)
Tech stack:
- **API**: FastAPI (Python) + MongoDB (with Docker)
- **Mobile**: React Native (Expo + EAS)
- **Admin**: Next.js (React)
- **Infra**: docker-compose (MongoDB), .env examples, Stripe webhook

## Repo structure
```
fightswipe/
  apps/
    mobile/            # Expo app
    admin/             # Next.js admin panel
  services/
    api/               # FastAPI backend
  infra/
    docker-compose.yml # MongoDB + API dev stack
  .editorconfig
  README.md
```

## Quickstart (Dev)

### 1) Infra (MongoDB + API)
```bash
cd infra
cp ../services/api/.env.example ../services/api/.env
docker compose up --build
# API will be on http://localhost:8000 (health: /health)
# Mongo on mongodb://localhost:27017
```

### 2) Admin (Next.js)
```bash
cd apps/admin
cp .env.example .env.local
npm i
npm run dev
# http://localhost:3000
```

### 3) Mobile (Expo)
```bash
cd apps/mobile
cp .env.example .env
npm i -g expo
npm i
npx expo start
```

## Stripe Webhook (local)
Use stripe CLI to forward events:
```bash
stripe listen --forward-to localhost:8000/webhooks/stripe
```

## Build & Release (Mobile with EAS)
```bash
cd apps/mobile
npm i -g eas-cli
eas login
eas init
eas build -p ios --profile production
eas build -p android --profile production
```

## Notes
- All keys are in `.env.example` files. Do not commit real secrets.
- API provides minimal endpoints to unblock mobile/admin integration:
  - `GET /health`
  - `POST /auth/signup`
  - `POST /wallet/topup-intent` (Stripe PaymentIntent stub)
  - `POST /webhooks/stripe` (idempotent stub)
