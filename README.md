# Resume Bullet Point Improver

A minimal production-ready Next.js 14 application that uses AI to improve resume bullet points.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (PostgreSQL database)
- **Generic LLM Interface** (supports OpenAI, Groq, or Hugging Face)

## Features

- Single-page interface for improving resume bullet points
- Server-side AI processing (secure API key handling)
- Automatic storage of requests in Supabase
- Clean, modern UI with loading states

## Local Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Run the SQL from `supabase/schema.sql` to create the `requests` table:

```sql
CREATE TABLE IF NOT EXISTS requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  input_text TEXT NOT NULL,
  output_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_requests_created_at ON requests(created_at DESC);
```

4. Copy your Supabase project URL and anon key from Settings > API

### 3. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

2. Fill in your environment variables in `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# LLM (choose one provider)
LLM_PROVIDER=openai
LLM_API_KEY=your_openai_api_key

# Optional: Override default model
# LLM_MODEL=gpt-3.5-turbo
```

**LLM Provider Options:**

- **OpenAI**: Set `LLM_PROVIDER=openai` and provide your OpenAI API key
- **Groq**: Set `LLM_PROVIDER=groq` and provide your Groq API key
- **Hugging Face**: Set `LLM_PROVIDER=huggingface` and provide your Hugging Face API key

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── api/
│   │   └── improve/
│   │       └── route.ts          # API endpoint for improving bullets
│   ├── globals.css                # Global styles with Tailwind
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Main UI page
├── lib/
│   ├── llm.ts                     # Generic LLM interface
│   └── supabase.ts                # Supabase client setup
├── supabase/
│   └── schema.sql                 # Database schema
└── package.json
```

## How It Works

1. **User Input**: User enters a resume bullet point in the textarea
2. **API Call**: Frontend sends the text to `/api/improve` endpoint
3. **AI Processing**: Server calls the configured LLM API to improve the text
4. **Database Storage**: Input and output are saved to Supabase `requests` table
5. **Response**: Improved text is returned and displayed to the user

## Security

- All LLM API calls happen server-side (no API keys exposed to client)
- Environment variables are used for all secrets
- Input validation on both client and server

## Future Enhancements

- Authentication
- Request history view
- Multiple improvement options
- Export functionality



