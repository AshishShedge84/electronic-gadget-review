/**
 * Dataset Upload Preview Serverless Endpoint
 * Safely parses CSV/JSON sample data, detects column headers, prevents formula injection,
 * and auto-infers column mappings for review ingestion.
 */

// Helper to sanitize cell values against formula injection (=, +, -, @, \t, \r)
function sanitizeCell(val) {
  if (typeof val !== "string") return val;
  const trimmed = val.trim();
  if (/^[=+\-@\t\r]/.test(trimmed)) {
    return "'" + trimmed;
  }
  return trimmed;
}

// Simple robust CSV parser for header + sample lines
function parseCSV(text, maxRows = 10) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return { headers: [], rows: [], totalCount: 0 };

  // Parse header
  const parseLine = (line) => {
    const result = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"' || char === "'") {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        result.push(sanitizeCell(cur.trim().replace(/^["']|["']$/g, "")));
        cur = "";
      } else {
        cur += char;
      }
    }
    result.push(sanitizeCell(cur.trim().replace(/^["']|["']$/g, "")));
    return result;
  };

  const headers = parseLine(lines[0]);
  const sampleRows = [];
  const limit = Math.min(lines.length, maxRows + 1);

  for (let i = 1; i < limit; i++) {
    const values = parseLine(lines[i]);
    const rowObj = {};
    headers.forEach((h, idx) => {
      rowObj[h] = values[idx] !== undefined ? values[idx] : "";
    });
    sampleRows.push(rowObj);
  }

  return {
    headers,
    rows: sampleRows,
    totalCount: lines.length - 1
  };
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
    const { fileContent, fileType = "csv", fileName = "dataset.csv" } = req.body || {};

    if (!fileContent || typeof fileContent !== "string") {
      res.status(400).json({ error: "fileContent is required and must be a text string." });
      return;
    }

    // Enforce 5MB limit on raw content payload
    if (fileContent.length > 5 * 1024 * 1024) {
      res.status(413).json({ error: "File size exceeds 5MB limit. Please provide a smaller dataset." });
      return;
    }

    let headers = [];
    let sampleRows = [];
    let totalCount = 0;

    if (fileType === "json" || fileName.endsWith(".json")) {
      try {
        const parsed = JSON.parse(fileContent);
        const dataArr = Array.isArray(parsed) ? parsed : parsed.reviews || parsed.data || [];
        if (!Array.isArray(dataArr) || dataArr.length === 0) {
          res.status(400).json({ error: "JSON file does not contain an array of review objects." });
          return;
        }

        totalCount = dataArr.length;
        headers = Object.keys(dataArr[0] || {});
        sampleRows = dataArr.slice(0, 8).map((row) => {
          const sanitized = {};
          for (const key of Object.keys(row)) {
            sanitized[key] = sanitizeCell(String(row[key]));
          }
          return sanitized;
        });
      } catch (jsonErr) {
        res.status(400).json({ error: "Invalid JSON format: " + jsonErr.message });
        return;
      }
    } else {
      // Default CSV
      const csvRes = parseCSV(fileContent, 8);
      headers = csvRes.headers;
      sampleRows = csvRes.rows;
      totalCount = csvRes.totalCount;
    }

    if (headers.length === 0) {
      res.status(400).json({ error: "No headers found. Ensure the dataset contains a valid header row." });
      return;
    }

    // Auto-infer recommended mapping
    const findMatch = (candidates) => {
      for (const cand of candidates) {
        const found = headers.find((h) => h.toLowerCase().replace(/[^a-z0-9]/g, "") === cand);
        if (found) return found;
      }
      return "";
    };

    const suggestedMapping = {
      text: findMatch(["review", "reviewtext", "text", "comment", "content", "feedback", "body", "desc", "comments"]),
      rating: findMatch(["rating", "stars", "score", "rate", "star", "overall"]),
      title: findMatch(["title", "headline", "summary", "subject", "reviewtitle"]),
      author: findMatch(["author", "user", "username", "reviewer", "name", "buyer"]),
      date: findMatch(["date", "reviewdate", "time", "timestamp", "createdat", "postedon"]),
      verified: findMatch(["verified", "verifiedpurchase", "isverified", "buyer", "verifiedbuyer"])
    };

    res.status(200).json({
      status: "success",
      fileName,
      fileType,
      totalCount,
      headers,
      sampleRows,
      suggestedMapping
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to process dataset preview: " + error.message });
  }
}
