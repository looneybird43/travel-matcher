# Travel Matchmaker

An AI-powered travel recommendation tool. Answer 6 questions, get 3 personalized trip ideas you'd never have found on your own.

## Deploy to Vercel (5 minutes, free)

### Step 1 — Get an Anthropic API key
1. Go to https://console.anthropic.com
2. Sign up / log in
3. Go to **API Keys** → **Create Key**
4. Copy the key (starts with `sk-ant-...`)

### Step 2 — Put this code on GitHub
1. Go to https://github.com and create a free account if you don't have one
2. Click **New repository** → name it `travel-matcher` → **Create repository**
3. Upload all these files (drag & drop the whole folder)

### Step 3 — Deploy on Vercel
1. Go to https://vercel.com and sign up with your GitHub account
2. Click **Add New Project**
3. Import your `travel-matcher` repository
4. Before clicking Deploy, click **Environment Variables** and add:
   - Name: `ANTHROPIC_API_KEY`
   - Value: your key from Step 1
5. Click **Deploy**

### Done!
Vercel will give you a URL like `https://travel-matcher-abc123.vercel.app` — share it with anyone!

## Local development
```bash
npm install
echo "ANTHROPIC_API_KEY=your-key-here" > .env.local
npm run dev
```
Then open http://localhost:3000
