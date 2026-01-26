// ===============================
// PhishAID Frontend Logic (FINAL v1.0 – FIXED)
// ===============================

// Backend API (Cloud Run)
const API_URL = "https://phishaid-api-1013270519404.asia-south1.run.app/check";

// ===============================
// DOM Elements
// ===============================
const input = document.getElementById("urlInput");
const button = document.getElementById("checkBtn");

const loading = document.getElementById("loading");
const resultBox = document.getElementById("result");

const verdictEl = document.getElementById("verdict");
const scoreEl = document.getElementById("score");
const warningsEl = document.getElementById("warnings");

const ruleTableBox = document.getElementById("ruleTableBox");
const ruleTableBody = document.getElementById("ruleTableBody");

// ===============================
// RULE DEFINITIONS (1–30)
// ===============================
const RULES = [
  { id: 1, desc: "Uses HTTPS protocol", score: -10 },
  { id: 2, desc: "Uses raw IP address", score: -30 },
  { id: 3, desc: "URL length suspicious", score: -5 },
  { id: 4, desc: "Contains @ symbol", score: -10 },
  { id: 5, desc: "Multiple subdomains", score: -10 },
  { id: 6, desc: "Suspicious TLD", score: -10 },
  { id: 7, desc: "Certificate age < 6 months", score: -15 },
  { id: 8, desc: "URL contains hyphen", score: -5 },
  { id: 9, desc: "Uses URL shortening", score: -20 },
  { id: 10, desc: "Contains login keywords", score: -10 },

  { id: 11, desc: "Form submits to external domain", score: -10 },
  { id: 12, desc: "No favicon", score: -5 },
  { id: 13, desc: "Missing DNS records", score: -5 },
  { id: 14, desc: "Suspicious redirect behavior", score: -10 },
  { id: 15, desc: "JavaScript obfuscation", score: -10 },
  { id: 16, desc: "Iframe usage", score: -5 },
  { id: 17, desc: "Popup abuse", score: -5 },
  { id: 18, desc: "Clone phishing (DOM similarity)", score: -10 },
  { id: 19, desc: "Free hosting provider", score: -10 },
  { id: 20, desc: "URL encoding abuse", score: -5 },

  { id: 21, desc: "Unicode / homoglyph detection", score: -10 },
  { id: 22, desc: "Typosquatting (edit-distance logic)", score: -15 },
  { id: 23, desc: "No WHOIS data", score: -10 },
  { id: 24, desc: "Suspicious SSL issuer", score: -10 },
  { id: 25, desc: "Abnormal request headers", score: -5 },
  { id: 26, desc: "Known phishing pattern", score: -20 },
  { id: 27, desc: "Suspicious JavaScript events", score: -5 },
  { id: 28, desc: "Clipboard hijacking attempt", score: -10 },
  { id: 29, desc: "Suspicious favicon domain", score: -5 },
  { id: 30, desc: "Semantic phishing intent (heuristic)", score: -20 }
];

// ===============================
// RESERVED RULES (v1.0)
// ===============================
const RESERVED_RULES = [
  11,12,13,14,15,16,17,
  19,20,
  23,
  25,
  27,28,29
];

// ===============================
// Rule → Warning Keyword Mapping
// ===============================
const RULE_WARNING_MAP = {
  1: "https",
  2: "ip",
  3: "length",
  4: "@",
  5: "subdomain",
  6: "tld",
  7: "age",
  8: "hyphen",
  9: "short",
  10: "login",

  18: "clone",
  21: "unicode",
  22: "typo",
  24: "ssl",
  26: "pattern",
  30: "semantic"
};

// ===============================
// Strict URL Validation
// ===============================
function normalizeUrl(url) {
  const lower = url.toLowerCase();
  if (!lower.startsWith("http://") && !lower.startsWith("https://")) {
    throw new Error("URL must include http:// or https://");
  }
  return url;
}

// ===============================
// Rule Table Renderer (FINAL)
// ===============================
function renderRuleTable(domain, warnings = []) {
  ruleTableBody.innerHTML = "";
  ruleTableBox.classList.remove("hidden");

  RULES.forEach(rule => {

    // Reserved rules
    if (RESERVED_RULES.includes(rule.id)) {
      const tr = document.createElement("tr");
      tr.classList.add("not-implemented");
      tr.innerHTML = `
        <td>${domain}</td>
        <td>${rule.id}</td>
        <td>${rule.desc}</td>
        <td>Reserved</td>
        <td>—</td>
      `;
      ruleTableBody.appendChild(tr);
      return;
    }

    // Implemented rules
    const keyword = RULE_WARNING_MAP[rule.id];
    const triggered = keyword
      ? warnings.some(w => w.toLowerCase().includes(keyword))
      : false;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${domain}</td>
      <td>${rule.id}</td>
      <td>${rule.desc}</td>
      <td class="${triggered ? "bad" : "good"}">
        ${triggered ? "Suspicious" : "Safe"}
      </td>
      <td>${triggered ? rule.score : 0}</td>
    `;
    ruleTableBody.appendChild(tr);
  });
}

// ===============================
// Button Click Handler
// ===============================
button.addEventListener("click", async () => {
  let url = input.value.trim();

  if (!url) {
    alert("Please enter a complete URL including http:// or https://");
    return;
  }

  try {
    url = normalizeUrl(url);
  } catch (e) {
    alert(e.message);
    return;
  }

  loading.classList.remove("hidden");
  resultBox.classList.add("hidden");
  ruleTableBox.classList.add("hidden");
  warningsEl.innerHTML = "";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    });

    if (!response.ok) throw new Error("Backend error");

    const data = await response.json();
    showResult(data, url);

  } catch (err) {
    alert("Analysis failed. Please try again.");
    console.error(err);
  } finally {
    loading.classList.add("hidden");
  }
});

// ===============================
// Final Result Renderer (FIXED)
// ===============================
function showResult(data, inputUrl) {
  resultBox.classList.remove("hidden");

  // 🔧 FIX: remove old verdict classes
  resultBox.classList.remove("safe", "phishing");
  resultBox.classList.add(data.verdict === "Legitimate" ? "safe" : "phishing");

  verdictEl.textContent = `Verdict: ${data.verdict}`;
  scoreEl.textContent = `Risk Score: ${data.score}`;

  warningsEl.innerHTML = "";
  if (!data.warnings || data.warnings.length === 0) {
    warningsEl.innerHTML = "<li>No phishing indicators found.</li>";
  } else {
    data.warnings.forEach(w => {
      const li = document.createElement("li");
      li.textContent = w;
      warningsEl.appendChild(li);
    });
  }

  renderRuleTable(
    new URL(inputUrl).hostname,
    data.warnings || []
  );
}
