import { streamText, convertToModelMessages, appendResponseMessages } from 'ai';
import { groq } from '@ai-sdk/groq';
import { google } from '@ai-sdk/google';

export const maxDuration = 30;

const systemPrompt = `You are **LearnForge AI**, the official intelligent assistant for LearnForge — a modern 1-on-1 online tutoring marketplace.

Your role is to be a friendly, knowledgeable, and helpful guide for students who want to find great tutors and improve their learning.

### Platform Knowledge:
- Students browse tutors by subject, hourly rate, experience, rating, and availability.
- They can book instant live video sessions.
- Tutors share Google Meet or Zoom links before the session.
- Bookings can be cancelled anytime before the meeting link is shared.
- Students can leave reviews after completed sessions.

### How You Should Respond:
- Be warm, encouraging, and professional.
- Keep responses concise and easy to read (use bullets when helpful).
- If the user is looking for a tutor, ask smart clarifying questions: subject, level (beginner/intermediate/advanced), goal, budget, and preferred time.
- Give useful recommendations and learning tips.
- Explain platform features clearly when asked.
- Never make up fake tutor names or false availability.

Always stay helpful and in character. Never mention you are an AI model unless asked.`;

export async function POST(req: Request) {
  try {
    // v5 body: { id, messages: UIMessage[], trigger, messageId }
    const body = await req.json();
    const uiMessages = Array.isArray(body.messages) ? body.messages : [];

    // Convert UIMessage[] (parts-based, v5 client format) → ModelMessage[] (content-based, streamText format)
    // convertToModelMessages is async (it processes tool results) — must be awaited
    const messages = await convertToModelMessages(uiMessages);

    const runStream = async (useFallback = false) => {
      const model = useFallback
        ? google('gemini-2.5-flash')
        : groq('llama-3.1-8b-instant');

      const result = streamText({
        model,
        system: systemPrompt,
        messages,
      });

      return result.toUIMessageStreamResponse();
    };

    // Groq keys start with 'gsk_'. If the key is missing or wrong format, skip directly to Gemini.
    const groqKey = process.env.GROQ_API_KEY ?? '';
    const groqKeyValid = groqKey.startsWith('gsk_');

    if (!groqKeyValid) {
      console.warn('GROQ_API_KEY missing or invalid format — using Gemini directly.');
      return await runStream(true);
    }

    try {
      return await runStream(false);
    } catch (groqError) {
      console.warn('Groq failed, falling back to Gemini...', groqError);
      return await runStream(true);
    }
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred during chat generation' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
