Veil
Veil is a real-time anonymous Q&A platform designed for events, livestreams, and interactive sessions. It empowers audiences to ask questions without revealing their identity, and gives moderators full control to filter, highlight, and respond — all in a sleek, live-updating interface.

✨ Features
Anonymous Q&A – Attendees can ask questions without logging in

Live WebSocket Updates – See questions in real time without refresh

Moderator Dashboard – View, filter, answer, and hide questions

Audience Upvoting – Surface popular questions via likes

Poll Creation – Run simple polls to gather quick feedback

Room Codes – Easily join sessions using a 6-character code

Session Management – Organize and revisit rooms per event

🛠️ Tech Stack
Layer	Tech
Frontend	Next.js 14, TailwindCSS, Shadcn UI, Lucide Icons
Backend	NestJS (WebSocket + REST API)
Database	PostgreSQL (via Supabase)
Infra	Render (API), Vercel (Frontend)
Realtime	WebSockets (via socket.io)
Other	TypeScript, Turbo Monorepo, ESM Modules

🚀 Getting Started
1. Clone the Repository
bash
Copy
Edit
git clone https://github.com/cridiv/Veil.git
cd Veil
2. Install Dependencies
bash
Copy
Edit
npm install
Or with pnpm:

bash
Copy
Edit
pnpm install
3. Set Up Environment Variables
Create a .env file in the root and include:

env
Copy
Edit
# Supabase
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key

# Frontend use
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
Note: Be sure to also add these in Vercel and Render during deployment.

4. Run the App Locally
Run both backend and frontend in separate terminals:

Backend (NestJS)

bash
Copy
Edit
cd apps/api
npm run start:dev
Frontend (Next.js)

bash
Copy
Edit
cd apps/web
npm run dev
Visit: http://localhost:3000

🌐 Deployment
📡 Backend (Render)
Connect repo on Render

Set root directory to apps/api

Add environment variables

Build command:

bash
Copy
Edit
npm install && npm run build
Start command:

bash
Copy
Edit
npm run start:prod
🧑‍💻 Frontend (Vercel)
Connect repo on Vercel

Set root directory to apps/web

Add all .env variables

Deploy

🤝 Contributing
We welcome all contributions!

Fork the repo

Create a branch: git checkout -b feat/your-feature-name

Make changes and commit: git commit -m "feat: your feature"

Push the branch: git push origin feat/your-feature-name

Open a pull request 🎉

👨‍💻 Authors
Aderemi Ademola – Backend Lead, Realtime Systems (X: @cridiv)

Peters Joshua – Frontend Lead, UX Engineer (X: @joshpet77)

Oyedapo Kayode – Product Designer (X: @Kayode_96)

📜 License
This project is licensed under the MIT License.

Built to make questions speak louder than names. 🫶
