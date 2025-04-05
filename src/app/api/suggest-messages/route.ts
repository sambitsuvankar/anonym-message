import { NextResponse } from 'next/server';
import { streamText } from 'ai';
import OpenAI from 'openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
// import { StreamingTextResponse } from 'ai/';
// import { streamText } from 'ai';
// import { createStreamableValue } from 'ai';

// Specify the runtime environment
export const runtime = 'edge';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    // Define the prompt for the AI model
    // const prompt =
    //   "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";
    const prompt = `You are a creativity engine. Generate three original, varied, and engaging open-ended questions within 15 to 20 words for a social messaging platform. Each question should be formatted as a single string and separated by '||'. Avoid repeating any previous style or phrasing.Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.`
    // Generate a streaming text response from the AI model
    const result = await streamText({
      model: google.chat('gemini-1.5-pro-latest'),
      prompt,
      temperature: 1.0, // ✅ Add this for variation
    });
    // console.log(result)
    // Convert the result to a streaming HTTP response
    return new Response(result.toDataStream());
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      // Handle OpenAI API errors
      const { name, status, headers, message } = error;
      return NextResponse.json({ name, status, headers, message }, { status });
    } else {
      // Handle general errors
      console.error('An unexpected error occurred:', error);
      throw error;
    }
  }
}
