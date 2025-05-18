import { NextResponse } from "next/server";
import Together from "together-ai";
import { auth } from "@clerk/nextjs/server";

// Initialize Together AI client
const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY,
});

export async function POST(req) {
  try {
    // Get request body
    const body = await req.json();
    
    // Authenticate user
    const { userId } = auth(req);
    
    // Return error if not authenticated
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    // Extract data from request
    const userMessage = body.message;
    const chatHistory = body.chatHistory || [];

    // Add user message to history
    chatHistory.push({ role: "user", content: userMessage });

    // Define system prompt
    const systemPrompt = `You are GIVORA, an enthusiastic and creative gift recommendation assistant. Your specialty is suggesting thoughtful, personalized gift ideas based on occasions and preferences. 

For each recommendation, provide:
1) A descriptive name of the gift
2) Why it's a good match for the occasion/preferences
3) An estimated price range (be specific)
4) Where to find it (mention specific stores or websites)

Structure your response with 3-5 distinct gift ideas. Number each idea (e.g., "1. Custom Star Map"). 
Format price ranges in bold (e.g., $25-$50).

Be warm, friendly, and enthusiastic. Add occasional humor to make the experience fun.
Always consider the recipient's interests, the occasion, and any budget constraints mentioned.
Provide diverse options at different price points unless a specific budget is mentioned.

After your recommendations, briefly ask if the user would like more specific ideas.`;

    // Make API call to Together AI
    const response = await together.chat.completions.create({
      model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        ...chatHistory,
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    // Extract response
    const assistantMessage = response.choices[0].message.content;
    
    // Add assistant response to history
    chatHistory.push({ role: "assistant", content: assistantMessage });

    // Return response
    return NextResponse.json({ 
      message: assistantMessage,
      chatId: userId
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate gift ideas" },
      { status: 500 }
    );
  }
}