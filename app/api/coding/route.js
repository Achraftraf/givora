// api/coding/route.js
import { NextResponse } from "next/server";
import Together from "together-ai";
import { auth } from "@clerk/nextjs/server";
import { Readable } from "stream";

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
    const streamMode = body.stream || false;

    // Add user message to history
    chatHistory.push({ role: "user", content: userMessage });

    // Define system prompt with improved structure
    const systemPrompt = `You are GIVORA, an enthusiastic and creative gift recommendation assistant. Your specialty is suggesting thoughtful, personalized gift ideas based on occasions and preferences.

For each recommendation, provide:
1) A descriptive name of the gift
2) Why it's a good match for the occasion/preferences
3) An estimated price range (mark it in bold using **$XX-$YY** format)
4) Where to find it (mention specific stores or websites)

Structure your response with exactly 5 distinct gift ideas, numbered clearly as "1. Gift Name", "2. Gift Name", etc.

Format each gift idea consistently:
- Start with the number and gift name as a heading
- Include a brief description on why it's appropriate
- Include the price range in bold: **$XX-$YY**
- Include where to find it

Be warm, friendly, and enthusiastic. Add occasional humor to make the experience fun. Always consider the recipient's interests, the occasion, and any budget constraints mentioned. Provide diverse options at different price points unless a specific budget is mentioned.

After your recommendations, briefly ask if the user would like more specific ideas based on their reaction.`;

    // Handle streaming or normal response
    if (streamMode) {
      // Set up streaming response
      const response = await together.chat.completions.create({
        model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          ...chatHistory,
        ],
        max_tokens: 1500,
        temperature: 0.7,
        stream: true,
      });

      // Create a readable stream for the response
      const stream = new ReadableStream({
        async start(controller) {
          try {
            // Process each chunk from the streaming response
            for await (const chunk of response) {
              const content = chunk.choices[0]?.delta?.content || '';
              if (content) {
                // Stream the content in chunks
                const encoder = new TextEncoder();
                controller.enqueue(encoder.encode(content));
              }
            }
            controller.close();
          } catch (error) {
            console.error("Streaming error:", error);
            controller.error(error);
          }
        }
      });

      // Return the streaming response
      return new Response(stream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Transfer-Encoding': 'chunked',
        },
      });
    } else {
      // Non-streaming mode - regular response
      const response = await together.chat.completions.create({
        model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          ...chatHistory,
        ],
        max_tokens: 1500,
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
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate gift ideas" },
      { status: 500 }
    );
  }
}