import { NextResponse } from "next/server";
import { scrapeWebsite } from "../../../utils/webScrapper";
import OpenAI from "openai";

export async function POST(request) {
  const { url, maxDepth = 2, maxPagesPerDomain = 20 } = await request.json();
  if (!url) {
    return NextResponse.json({ error: "URL is required." }, { status: 400 });
  }

  try {
    console.log(
      `Starting to scrape: ${url} with max depth: ${maxDepth} and max pages: ${maxPagesPerDomain}`
    );
    const scrapedPages = await scrapeWebsite(url, maxDepth, maxPagesPerDomain);
    console.log(`Scraped ${scrapedPages.length} pages`);

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Prepare the scraped data for the prompt
    const scrapedData = scrapedPages
      .map(
        (page) => `
      URL: ${page.url}
      Title: ${page.title}
      Content: ${page.content.substring(
        0,
        1000
      )} // Truncate content to manage token limit
    `
      )
      .join("\n\n");

    const prompt = `
      Analyze the following website data and provide a comprehensive overview in a book-like format. 
      Focus on understanding what the company or entity does, their main products or services, value proposition, and market position.
      
      Structure your response in the following format:
      
      [EXECUTIVE SUMMARY]
      A concise overview of the website and what the company does (3-4 sentences). Include the company's main offering and its primary value to customers.
      
      [COMPANY PROFILE]
      - Company Name: [Name]
      - Founded: [Year if available, otherwise "Not specified"]
      - Headquarters: [Location if available, otherwise "Not specified"]
      - Industry: [Primary industry]
      - Company Size: [If available, otherwise "Not specified"]
      - Mission Statement: [If available, otherwise provide a suggested mission based on the content]
      - Vision: [If available, otherwise provide a suggested vision based on the content]
      
      [PRODUCTS/SERVICES]
      Provide a detailed breakdown of each main product or service. For each, include:
      1. Name of product/service
      2. What it does:
         - Primary purpose and functionality
         - Key problems it solves for customers
      3. How it works:
         - Step-by-step explanation of the product/service process
         - Any unique technologies or methodologies used
      4. Key features and benefits
      5. Target users or use cases
      
      [VALUE PROPOSITION]
      Analyze and describe what makes this company unique or valuable to its customers. Include:
      - Unique Selling Points (USPs)
      - How they address customer pain points
      - Any innovative approaches or technologies they use
      
      [TARGET AUDIENCE]
      Identify and describe the company's primary target audience(s). Consider:
      - Demographics
      - Industry sectors (for B2B companies)
      - Specific needs or challenges this audience faces
      
      [COMPETITIVE LANDSCAPE]
      Provide insights on:
      - The company's position in the market
      - Main competitors (if mentioned or easily inferred)
      - How the company differentiates itself from competitors
      
      [TECHNOLOGY STACK]
      If applicable, discuss the technology or tools the company uses or provides:
      - Key technologies mentioned
      - Integration capabilities
      - Any proprietary technology or algorithms
      
      [CASE STUDIES OR USE CASES]
      If available, summarize any case studies or specific use cases mentioned:
      - Brief description of the problem
      - How the company's product/service was applied
      - Results or benefits achieved
      
      [PRICING MODEL]
      If available, describe the pricing structure:
      - Pricing tiers or plans
      - Any free trials or freemium offerings
      - Enterprise or custom pricing options
      
      [CUSTOMER SUPPORT AND RESOURCES]
      Examine how the company supports its customers:
      - Available support channels
      - Documentation or knowledge bases
      - Training or onboarding processes
      
      [ANALYSIS]
      Provide insights on:
      - Company's strengths
      - Potential areas for improvement
      - Overall market position
      - Growth opportunities
      - Potential challenges or threats
      
      [RECOMMENDATIONS]
      Suggest 3-5 actionable recommendations for the company to enhance its market position, improve its offerings, or address potential challenges.
      
      [CONCLUSION]
      Summarize the key points and provide a final assessment of the company's potential for success in its market.
      
      Website Data:
      ${scrapedData}
      
      Remember to base your analysis strictly on the provided website data. If information for any section is not available, state that it's not provided in the website content and offer a reasonable inference or suggestion based on the available information.
      `;

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o", // Using GPT-4 for more comprehensive analysis
      messages: [{ role: "user", content: prompt }],
    });

    const analysis = chatCompletion.choices[0].message.content;

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to process the website.", details: error.message },
      { status: 500 }
    );
  }
}
