/**
 * Dataset Upload Import Serverless Endpoint
 * Ingests, validates, cleans, deduplicates, and formats user-uploaded reviews
 * with provenance: "user_upload", rejecting malformed or invalid records.
 */

function sanitizeText(val) {
  if (!val) return "";
  const str = String(val).trim();
  // Neutralize spreadsheet formula injection characters
  if (/^[=+\-@\t\r]/.test(str)) {
    return "'" + str;
  }
  return str;
}

function parseCSVAll(text, maxRows = 1000) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return { headers: [], rows: [] };

  const parseLine = (line) => {
    const result = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"' || char === "'") {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        result.push(cur.trim().replace(/^["']|["']$/g, ""));
        cur = "";
      } else {
        cur += char;
      }
    }
    result.push(cur.trim().replace(/^["']|["']$/g, ""));
    return result;
  };

  const headers = parseLine(lines[0]);
  const rows = [];
  const limit = Math.min(lines.length, maxRows + 1);

  for (let i = 1; i < limit; i++) {
    const values = parseLine(lines[i]);
    const rowObj = {};
    headers.forEach((h, idx) => {
      rowObj[h] = values[idx] !== undefined ? values[idx] : "";
    });
    rows.push(rowObj);
  }

  return { headers, rows };
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed. Use POST." });
    return;
  }

  try {
    const {
      productId,
      fileContent,
      fileType = "csv",
      columnMapping = {}
    } = req.body || {};

    if (!productId) {
      res.status(400).json({ error: "productId is required." });
      return;
    }

    if (!fileContent || typeof fileContent !== "string") {
      res.status(400).json({ error: "fileContent is required." });
      return;
    }

    const textCol = columnMapping.text;
    const ratingCol = columnMapping.rating;

    if (!textCol) {
      res.status(400).json({ error: "Column mapping for 'text' (Review Content) is required." });
      return;
    }

    let rawRows = [];

    if (fileType === "json") {
      try {
        const parsed = JSON.parse(fileContent);
        rawRows = Array.isArray(parsed) ? parsed : parsed.reviews || parsed.data || [];
      } catch (err) {
        res.status(400).json({ error: "Malformed JSON content: " + err.message });
        return;
      }
    } else {
      const csvData = parseCSVAll(fileContent, 1000);
      rawRows = csvData.rows;
    }

    if (rawRows.length === 0) {
      res.status(400).json({ error: "No records found in uploaded file." });
      return;
    }

    const acceptedReviews = [];
    const rejectedErrors = [];
    const seenSignatures = new Set();
    let duplicateCount = 0;

    const nowIso = new Date().toISOString();

    rawRows.forEach((row, index) => {
      const rowNum = index + 1;
      const rawText = row[textCol];

      if (!rawText || String(rawText).trim().length < 5) {
        rejectedErrors.push({ row: rowNum, reason: "Review text is missing or shorter than 5 characters." });
        return;
      }

      // Check rating
      let numRating = 4; // default neutral-positive if unmapped
      if (ratingCol && row[ratingCol] !== undefined && row[ratingCol] !== "") {
        const parsed = parseFloat(String(row[ratingCol]).replace(/[^0-9.]/g, ""));
        if (isNaN(parsed) || parsed < 1 || parsed > 5) {
          rejectedErrors.push({
            row: rowNum,
            reason: `Invalid rating '${row[ratingCol]}'. Must be between 1 and 5.`
          });
          return;
        }
        numRating = Math.round(parsed * 10) / 10;
      }

      const cleanText = sanitizeText(rawText);
      const cleanTitle = sanitizeText(columnMapping.title ? row[columnMapping.title] : "");
      const cleanAuthor = sanitizeText(columnMapping.author ? row[columnMapping.author] : "Community Reviewer");
      const cleanDate = sanitizeText(columnMapping.date ? row[columnMapping.date] : nowIso.split("T")[0]);

      // Deduplication check based on author + text snippet
      const signature = `${cleanAuthor.toLowerCase()}_${cleanText.substring(0, 50).toLowerCase().replace(/[^a-z0-9]/g, "")}`;
      if (seenSignatures.has(signature)) {
        duplicateCount++;
        return;
      }
      seenSignatures.add(signature);

      const reviewId = `usr-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}-${index}`;

      acceptedReviews.push({
        id: reviewId,
        productId,
        providerId: "user_upload",
        providerName: "User Dataset Upload",
        sourceType: "user_upload",
        provenance: "user_upload",
        author: cleanAuthor,
        rating: numRating,
        title: cleanTitle || `User Upload Review #${acceptedReviews.length + 1}`,
        text: cleanText,
        date: cleanDate,
        verifiedPurchase: Boolean(columnMapping.verified && String(row[columnMapping.verified]).toLowerCase().includes("true")),
        sentiment: numRating >= 4 ? "positive" : numRating === 3 ? "neutral" : "negative",
        aspects: ["User Data"],
        importedAt: nowIso,
        validationStatus: "valid"
      });
    });

    res.status(200).json({
      status: "success",
      productId,
      provenance: "user_upload",
      summary: {
        totalRows: rawRows.length,
        acceptedCount: acceptedReviews.length,
        rejectedCount: rejectedErrors.length,
        duplicateCount
      },
      rejectedErrors: rejectedErrors.slice(0, 10), // return first 10 for feedback
      acceptedReviews
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to import dataset: " + error.message });
  }
}
