// ===============================
// PhishAID Frontend Logic (FINAL)
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

// Domain intelligence
const domainInfoBox = document.getElementById("domainInfo");

// Rule table
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
  { id: 7, desc: "Domain age < 6 months", score: -15 },
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
  { id: 18, desc: "Mismatch domain & title", score: -10 },
  { id: 19, desc: "Free hosting provider", score: -10 },
  { id: 20, desc: "URL encoding abuse", score: -5 },

  { id: 21, desc: "Email-based phishing indicator", score: -10 },
  { id: 22, desc: "Brand impersonation", score: -15 },
  { id: 23, desc: "No WHOIS data", score: -10 },
  { id: 24, desc: "Suspicious SSL issuer", score: -10 },
  { id: 25, desc: "Abnormal request headers", score: -5 },
  { id: 26, desc: "Known phishing pattern", score: -20 },
  { id: 27, desc: "Suspicious JavaScript events", score: -5 },
  { id: 28, desc: "Clipboard hijacking attempt", score: -10 },
  { id: 29, desc: "Suspicious favicon domain", score: -5 },
  { id: 30, desc: "Overall anomaly score high", score: -20 }
];

// ===============================
// Helper: Normalize URL
// (FORCE http/https — as requested)
// ===============================
function normalizeUrl(url) {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    throw new Error("URL must include http:// or https://");
  }
  return url;
}

// ===============================
// Helper: Extract Domain Info
// ===============================
function extractDomainInfo(url) {
  const parsed = new URL(url);
  return {
    domain: parsed.hostname,
    protocol: parsed.protocol.replace(":", "").toUpperCase(),
    country: "Unknown (Demo)",
    registrar: "WHOIS lookup required",
    registration_date: "Not available (Academic Demo)",
    domain_age: "N/A"
  };
}

// ===============================
// Render Domain Intelligence
// ===============================
function showDomainInfo(url) {
  const info = extractDomainInfo(url);
  domainInfoBox.classList.remove("hidden");

  document.getElementById("infoDomain").textContent = info.domain;
  document.getElementById("infoProtocol").textContent = info.protocol;
  document.getElementById("infoCountry").textContent = info.country;
  document.getElementById("infoRegistrar").textContent = info.registrar;
  document.getElementById("infoRegDate").textContent = info.registration_date;
  document.getElementById("infoAge").textContent = info.domain_age;
}

// ===============================
// Render Rule Table (1–30)
// ===============================
function renderRuleTable(domain, triggeredRules = []) {
  ruleTableBody.innerHTML = "";
  ruleTableBox.classList.remove("hidden");

  RULES.forEach(rule => {
    const matched = triggeredRules.some(r => r.rule_id === rule.id);
    const status = matched ? "Suspicious" : "Safe";
    const score = matched ? rule.score : 0;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${domain}</td>
      <td>${rule.id}</td>
      <td>${rule.desc}</td>
      <td class="${matched ? "bad" : "good"}">${status}</td>
      <td>${score}</td>
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
    alert("Please enter a website URL with http:// or https://");
    return;
  }

  try {
    url = normalizeUrl(url);
  } catch (e) {
    alert(e.message);
    return;
  }

  // Reset UI
  loading.classList.remove("hidden");
  resultBox.classList.add("hidden");
  domainInfoBox.classList.add("hidden");
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
    alert("Unable to analyze the website. Please try again later.");
    console.error(err);
  } finally {
    loading.classList.add("hidden");
  }
});

// ===============================
// Render Final Result
// ===============================
function showResult(data, inputUrl) {
  resultBox.classList.remove("hidden");

  resultBox.className = data.verdict === "Legitimate" ? "safe" : "phishing";

  verdictEl.textContent = `Verdict: ${data.verdict}`;
  scoreEl.textContent = `Risk Score: ${data.score}`;

  // Warnings
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

  // Domain intelligence
  showDomainInfo(inputUrl);

  // Rule evaluation table
  renderRuleTable(
    new URL(inputUrl).hostname,
    data.rules_triggered || []
  );
}
