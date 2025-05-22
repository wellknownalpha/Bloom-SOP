Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.
Bloom-SOP
Clone

git clone https://github.com/yourusername/your-repo.git cd your-repo
Install deps

npm install
Create .env from template

cp .env.example .env
Run dev server

npm run dev

npm install

npm run dev # for development npm run build # for production

mkdir public
then move your favicon or images here

touch .env
Firebase config

NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
Genkit

GENKIT_API_KEY=your_genkit_api_key

NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXX

| What            | How to Get It                             | Notes                        |
| --------------- | ----------------------------------------- | ---------------------------- |
| `node_modules/` | `npm install`                             | Required to run the app      |
| `.next/`        | `npm run dev` or `npm run build`          | Build output, auto-generated |
| `public/`       | Manually add or copy from Firebase Studio | For favicons/images          |
| `.env`          | Manually create from `.env.example`       | Contains local secrets       |
