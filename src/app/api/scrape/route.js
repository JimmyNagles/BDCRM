import { NextResponse } from "next/server";
import { scrapeWebsite } from "../../../utils/webScrapper";

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
    return NextResponse.json({ pages: scrapedPages });
  } catch (error) {
    console.error("Scraping error:", error);
    return NextResponse.json(
      { error: "Failed to scrape the website.", details: error.message },
      { status: 500 }
    );
  }
}
