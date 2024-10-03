import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";
import OpenAI from "openai";

// Initialize OpenAI client with API key
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to scrape a page
const scrapePage = async (url) => {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  const content = $("body").html(); // Get the main HTML content
  return content;
};

// Split content into smaller chunks
const splitContent = (content, maxTokens = 1500) => {
  const chunks = [];
  let currentChunk = "";

  content.split(" ").forEach((word) => {
    // Create chunks until max token limit is reached
    if (currentChunk.length + word.length < maxTokens) {
      currentChunk += `${word} `;
    } else {
      chunks.push(currentChunk.trim());
      currentChunk = `${word} `;
    }
  });

  // Add the last chunk if it exists
  if (currentChunk.length > 0) chunks.push(currentChunk.trim());

  return chunks;
};

// Function to send data to OpenAI for analysis using OpenAI Node API client
const analyzeWithAI = async (data) => {
  try {
    const chunks = splitContent(data, 1500); // Split the content into chunks
    let combinedResponse = "";

    // Send each chunk to the OpenAI API separately
    for (const chunk of chunks) {
      const response = await client.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an AI assistant that helps structure raw HTML data into an organized book format for easy understanding.`,
          },
          {
            role: "user",
            content: `Here's a full page of the raw HTML data from a website. Please format and structure it into a readable and well-organized format: \n\n ${chunk}`,
          },
        ],
        max_tokens: 1500,
      });

      // Concatenate the response text
      combinedResponse += response.choices[0].message.content + "\n\n";
    }

    return combinedResponse;
  } catch (error) {
    console.error("AI Analysis error:", error);
    throw new Error("Failed to analyze data with AI.");
  }
};

// Main POST function for handling the API request
export async function POST(request) {
  const { url } = await request.json();
  if (!url)
    return NextResponse.json({ error: "URL is required." }, { status: 400 });

  try {
    // Initial page scrape
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Get basic info
    const title = $("title").text();
    const description = $('meta[name="description"]').attr("content");

    // Scrape navigation links
    const navLinks = [];
    $("nav a").each((_, element) => {
      const link = $(element).attr("href");
      if (link && link.startsWith("/")) navLinks.push(`${url}${link}`);
    });

    // Collect content for each link
    const pages = [
      {
        page: "Home",
        url: url,
        content: await scrapePage(url), // Initial page content
      },
    ];

    // Loop through navLinks and collect content
    for (const link of navLinks) {
      const pageName = link.split("/").pop(); // Extract page name
      const content = await scrapePage(link);
      pages.push({ page: pageName, url: link, content });
    }

    // Combine all page contents into a single string for AI analysis
    const combinedContent = pages
      .map((page) => `Page: ${page.page}\nContent: ${page.content}`)
      .join("\n\n");

    // Send combined content to the AI for analysis
    const aiResponse = await analyzeWithAI(combinedContent);

    return NextResponse.json({ title, description, pages, aiResponse });
  } catch (error) {
    console.error("Scraping error:", error);
    return NextResponse.json(
      { error: "Failed to scrape the website." },
      { status: 500 }
    );
  }
}
