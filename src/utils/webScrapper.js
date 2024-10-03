import axios from "axios";
import * as cheerio from "cheerio";

// Function to extract the root domain from a URL
const getRootDomain = (url) => {
  const hostname = new URL(url).hostname;
  const parts = hostname.split(".").reverse();
  if (parts.length >= 2) {
    return parts[1] + "." + parts[0];
  } else {
    return hostname;
  }
};

const normalizeUrl = (baseUrl, path) => {
  const url = new URL(path, baseUrl);
  let href = url.href.replace(/([^:]\/)\/+/g, "$1");
  // Remove hash fragments
  href = href.split("#")[0];
  return href;
};

const getLinksFromPage = ($, baseUrl) => {
  const links = new Set();
  const baseRootDomain = getRootDomain(baseUrl);

  $("a").each((_, element) => {
    let href = $(element).attr("href");
    if (href) {
      // Remove hash fragments
      href = href.split("#")[0];

      // Skip empty hrefs after removing hash
      if (!href) return;

      // Normalize the URL
      const normalizedLink = normalizeUrl(baseUrl, href);

      // Check if the link is on the same root domain
      const linkRootDomain = getRootDomain(normalizedLink);
      if (linkRootDomain === baseRootDomain) {
        links.add(normalizedLink);
      }
    }
  });
  return Array.from(links);
};

const extractContent = ($) => {
  // Remove unwanted elements
  $("script, style, nav, header, footer").remove();

  // Extract title
  const title = $("title").text().trim() || $("h1").first().text().trim();

  // Extract meta description
  const metaDescription = $('meta[name="description"]').attr("content") || "";

  // Extract main content
  let content = "";
  $("main, #main-content, .main-content, article, body")
    .find("h1, h2, h3, h4, h5, h6, p, ul, ol")
    .each((_, element) => {
      const $el = $(element);
      const tagName = $el.prop("tagName").toLowerCase();

      if (tagName.match(/h[1-6]/)) {
        content += `\n\n${$el.text().trim()}\n`;
      } else if (tagName === "p") {
        content += `${$el.text().trim()}\n\n`;
      } else if (tagName === "ul" || tagName === "ol") {
        $el.find("li").each((_, li) => {
          content += `• ${$(li).text().trim()}\n`;
        });
        content += "\n";
      }
    });

  // Extract any specific sections or data points
  const productInfo = $(".product-info").text().trim();
  const highlights = $(".highlights").text().trim();

  // Extract structured data if available
  const structuredData = $('script[type="application/ld+json"]')
    .map((_, el) => {
      try {
        return JSON.parse($(el).html());
      } catch (e) {
        return null;
      }
    })
    .get()
    .filter(Boolean);

  return {
    title,
    metaDescription,
    content: content.trim(),
    productInfo,
    highlights,
    structuredData,
  };
};

const scrapePage = async (url) => {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const extractedContent = extractContent($);
    return {
      url,
      $,
      ...extractedContent,
    };
  } catch (error) {
    console.error(`Error scraping ${url}:`, error.message);
    return {
      url,
      $: null,
      title: "",
      metaDescription: "",
      content: "",
      productInfo: "",
      highlights: "",
      structuredData: [],
    };
  }
};

const scrapeWebsite = async (url, maxDepth = 2, maxPagesPerDomain = 20) => {
  const visited = new Set();
  const toVisit = [{ url, depth: 0 }];
  const results = [];

  while (toVisit.length > 0) {
    // Check if we've reached the max pages limit
    if (results.length >= maxPagesPerDomain) {
      console.log("Reached max pages limit");
      break;
    }

    const { url: currentUrl, depth } = toVisit.shift();

    // Skip if already visited or depth exceeded
    if (visited.has(currentUrl) || depth > maxDepth) continue;

    visited.add(currentUrl);
    console.log(`${toVisit.length} pages to visit. Scraping: ${currentUrl}`);

    // Scrape the current page
    const pageData = await scrapePage(currentUrl);
    results.push(pageData);

    // Don't proceed if depth limit reached or page limit exceeded
    if (depth >= maxDepth || results.length >= maxPagesPerDomain || !pageData.$)
      continue;

    // Extract links from the current page
    const links = getLinksFromPage(pageData.$, url);

    for (const link of links) {
      // Check if we have room to add more pages
      if (
        !visited.has(link) &&
        !toVisit.some((item) => item.url === link) && // Avoid duplicates
        results.length + toVisit.length < maxPagesPerDomain
      ) {
        toVisit.push({ url: link, depth: depth + 1 });
      }
    }

    // Implement a delay to be polite to the server
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return results;
};

export { scrapeWebsite };
