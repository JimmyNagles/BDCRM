// utils/pdfGenerator.js

import PDFDocument from "pdfkit";

const generatePDF = (scrapedData) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const chunks = [];

    // Collect data chunks as the PDF is generated
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => {
      const result = Buffer.concat(chunks);
      resolve(result);
    });

    doc.on("error", (err) => {
      reject(err);
    });

    // Add content to the PDF
    scrapedData.forEach((page, index) => {
      if (index !== 0) {
        doc.addPage();
      }

      doc
        .fontSize(16)
        .text(`Title: ${page.title || "N/A"}`, { underline: true });
      doc.moveDown();

      doc.fontSize(12).text(`URL: ${page.url}`);
      doc.moveDown();

      doc
        .fontSize(12)
        .text(`Meta Description: ${page.metaDescription || "N/A"}`);
      doc.moveDown();

      doc
        .fontSize(12)
        .text(`Content:\n${page.content || "No content available"}`, {
          align: "justify",
        });
      doc.moveDown();

      // Add any other fields you need
    });

    // Finalize the PDF and end the stream
    doc.end();
  });
};

export { generatePDF };
