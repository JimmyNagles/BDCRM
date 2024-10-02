// app/api/scrape/route.js
import { NextResponse } from "next/server";
import axios from "axios";
import cheerio from "cheerio";

export async function POST(request) {
  const { url } = await request.json();

  if (!url) {
    return NextResponse.json({ error: "URL is required." }, { status: 400 });
  }

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Extract desired information
    const title = $("title").text();
    const description = $('meta[name="description"]').attr("content");

    // Find navbar links as per your initial idea
    const navLinks = [];
    $("nav a").each((_, element) => {
      navLinks.push($(element).attr("href"));
    });

    // Return the scraped data
    return NextResponse.json({ title, description, navLinks });
  } catch (error) {
    console.error("Scraping error:", error);
    return NextResponse.json(
      { error: "Failed to scrape the website." },
      { status: 500 }
    );
  }
}
