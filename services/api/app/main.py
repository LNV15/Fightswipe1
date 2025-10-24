
import os
import hmac
import hashlib
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pymongo import MongoClient
from dotenv import load_dotenv
import stripe

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("MONGO_DB", "fightswipe")
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "")

stripe.api_key = STRIPE_SECRET_KEY

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

app = FastAPI(title="Fightswipe API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SignupBody(BaseModel):
    email: str
    password: str
    role: str = Field(default="fighter")  # fighter/trainer/gym

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/auth/signup")
def signup(body: SignupBody):
    users = db["users"]
    if users.find_one({"email": body.email}):
        raise HTTPException(status_code=409, detail="Email exists")
    users.insert_one({
        "email": body.email,
        "password_hash": body.password,  # NOTE: replace with proper hashing in prod!
        "role": body.role,
        "blocked": False
    })
    return {"ok": True}

class TopupIntentBody(BaseModel):
    amount_eur: int = Field(..., ge=1, le=100000)  # cents handled inside Stripe, here simple EUR units

@app.post("/wallet/topup-intent")
def create_topup_intent(body: TopupIntentBody):
    # amount in EUR -> convert to cents
    amount_cents = body.amount_eur * 100
    try:
        intent = stripe.PaymentIntent.create(
            amount=amount_cents,
            currency="eur",
            automatic_payment_methods={"enabled": True},
        )
        return {"client_secret": intent["client_secret"]}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/webhooks/stripe")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    if not STRIPE_WEBHOOK_SECRET:
        # In dev, accept all; in prod verify signature
        event = stripe.Event.construct_from({"type": "dev.event", "data": {}}, stripe.api_key)
    else:
        try:
            event = stripe.Webhook.construct_event(payload, sig_header, STRIPE_WEBHOOK_SECRET)
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    if event["type"] == "payment_intent.succeeded":
        # TODO: idempotent coin credit transaction using sessions/transactions
        # db.transactions.insert_one(...)
        pass

    return {"ok": True}
