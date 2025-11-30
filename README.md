# Resume Bullet Point Improver

A production-ready Next.js 14 application that uses AI to transform your resume bullet points into impactful, professional statements using the Google X–Y–Z formula.

🌐 **[Live Demo](https://resume-ai-project1.vercel.app/)** | 📖 [Documentation](#how-it-works) | 🚀 [Quick Start](#local-setup)

## ✨ Features

- 🤖 **AI-Powered Improvements**: Uses advanced LLM models (OpenAI, Groq, or Hugging Face) to enhance resume bullets
- 📊 **X–Y–Z Formula**: Applies the Google X–Y–Z formula: "Accomplished X by doing Y resulting in Z"
- 📈 **Quantifiable Metrics**: Automatically adds realistic metrics (%, $, time, scale, volume)
- 🔒 **Secure**: All API calls happen server-side with no exposed keys
- 💾 **Persistent Storage**: Automatically saves all requests to Supabase database
- 🎨 **Modern UI**: Clean, responsive interface with loading states and error handling
- 🔄 **Multi-Provider Support**: Easily switch between different LLM providers

## 🛠 Tech Stack

- **Next.js 14** (App Router) - React framework with server-side rendering
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Supabase** - PostgreSQL database with real-time capabilities
- **Generic LLM Interface** - Supports OpenAI, Groq, and Hugging Face APIs

<a id="local-setup"></a>
## 🚀 Local Setup

Follow these steps to run the application locally:

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier works)
- An API key from one of the supported LLM providers (OpenAI, Groq, or Hugging Face)

### 1. Clone and Install

```bash
# Clone the repository (if applicable)
git clone <your-repo-url>
cd resume-ai

# Install dependencies
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

- **OpenAI**: Set `LLM_PROVIDER=openai` and provide your OpenAI API key ([Get API Key](https://platform.openai.com/api-keys))
- **Groq**: Set `LLM_PROVIDER=groq` and provide your Groq API key ([Get API Key](https://console.groq.com/keys)) - *Recommended for fast, free tier*
- **Hugging Face**: Set `LLM_PROVIDER=huggingface` and provide your Hugging Face API key ([Get API Key](https://huggingface.co/settings/tokens))

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

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

<a id="how-it-works"></a>
## 🔄 How It Works

The application follows a simple but powerful workflow:

1. **User Input**: User enters a resume bullet point in the textarea
2. **API Call**: Frontend sends the text to `/api/improve` endpoint via POST request
3. **AI Processing**: Server calls the configured LLM API (OpenAI/Groq/Hugging Face) with a specialized prompt that:
   - Applies the Google X–Y–Z formula
   - Adds quantifiable metrics
   - Uses strong action verbs
   - Ensures professional, concise output
4. **Response Cleaning**: Server removes any prefixes, quotation marks, or formatting artifacts
5. **Database Storage**: Input and output are automatically saved to Supabase `requests` table
6. **Display**: Clean, improved bullet point is returned and displayed to the user

### AI Prompt Strategy

The application uses a carefully crafted prompt that instructs the AI to:
- Follow the **X–Y–Z formula**: "Accomplished X by doing Y resulting in Z"
- Add **realistic, quantifiable metrics** (percentages, dollar amounts, time, scale, volume)
- Use **strong action verbs** and technical language
- Keep output to **one concise line**
- Return **only the bullet point** (no explanations or formatting)

## 🔒 Security

- ✅ All LLM API calls happen **server-side** (no API keys exposed to client)
- ✅ Environment variables are used for all secrets (`.env.local` is gitignored)
- ✅ Input validation on both client and server
- ✅ Error handling with graceful fallbacks
- ✅ Supabase uses Row Level Security (RLS) for database access

## 📝 Example

**Input:**
```
Worked on a project that increased sales
```

**Output:**
```
Developed and integrated Large Language Models (LLMs) to automate 30% of tasks, streamlining workflow for commercial real estate firm and reducing project cycle time by 25%.
```

## 🚢 Deployment

The application is deployed on Vercel and can be easily deployed by:

1. Connecting your GitHub repository to Vercel
2. Adding environment variables in Vercel dashboard
3. Deploying automatically on push to main branch

**Live Demo**: [https://resume-ai-project1.vercel.app/](https://resume-ai-project1.vercel.app/)

## 🛣 Roadmap

- [ ] User authentication and personal history
- [ ] Request history view with search/filter
- [ ] Multiple improvement variations per input
- [ ] Export functionality (PDF, DOCX)
- [ ] Bulk processing for multiple bullets
- [ ] Custom prompt templates
- [ ] Analytics dashboard

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

---

**Built with ❤️ using Next.js, TypeScript, and AI**




