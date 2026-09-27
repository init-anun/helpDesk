helpdesk/
├── frontend/                 # Next.js
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   ├── lib/
│   │   │   └── api.ts
│   │   └── types/
│   │       └── api.ts
│   ├── .env.local
│   ├── next.config.ts
│   └── package.json
│
├── backend/                  # FastAPI
│   ├── app/
│   │   ├── main.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   └── security.py
│   │   ├── db/
│   │   │   ├── database.py
│   │   │   └── models/
│   │   ├── schemas/
│   │   ├── api/
│   │   │   └── routes/
│   │   │       ├── auth.py
│   │   │       ├── users.py
│   │   │       └── tickets.py
│   │   └── services/
│   ├── .env
│   ├── requirements.txt
│   └── README.md
│
└── README.md