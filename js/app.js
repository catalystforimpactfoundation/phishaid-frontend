// ===============================
// PhishAID Frontend Logic
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

// ===============================
// Helper: Normalize URL
// ===============================
function normalizeUrl(url) {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return "https://" + url;
  }
  return url;
}

// ===============================
// Helper: Extract Domain Info
// ===============================
function extractDomainInfo(url) {
  try {
    const parsed = new URL(url);

    return {
      domain: parsed.hostname,
      protocol: parsed.protocol.replace(":", ""),
      country: "Unknown",
      registrar: "WHOIS lookup required",
      registration_date: "Not available (Academic Demo)",
      domain_age: "N/A"
    };
  } catch {
    return null;
  }
}

// ===============================
// Render Domain Intelligence
// ===============================
function showDomainInfo(inputUrl) {
  const info = extractDomainInfo(inputUrl);
  if (!info) return;

  domainInfoBox.classList.remove("hidden");

  document.getElementById("infoDomain").textContent = info.domain;
  document.getElementById("infoProtocol").textContent = info.protocol.toUpperCase();
  document.getElementById("infoCountry").textContent = info.country;
  document.getElementById("infoRegistrar").textContent = info.registrar;
  document.getElementById("infoRegDate").textContent = info.registration_date;
  document.getElementById("infoAge").textContent = info.domain_age;
}

// ===============================
// Button Click Handler
// ===============================
button.addEventListener("click", async () => {
  let url = input.value.trim();

  if (!url) {
    alert("Please enter a website URL.");
    return;
  }

  url = normalizeUrl(url);

  // Reset UI
  loading.classList.remove("hidden");
  resultBox.classList.add("hidden");
  domainInfoBox.classList.add("hidden");
  warningsEl.innerHTML = "";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    });

    if (!response.ok) {
      throw new Error("Backend error");
    }

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
// Render Result
// ===============================
function showResult(data, inputUrl) {
  resultBox.classList.remove("hidden");

  // Verdict styling
  if (data.verdict === "Legitimate") {
    resultBox.className = "safe";
  } else {
    resultBox.className = "phishing";
  }

  verdictEl.textContent = `Verdict: ${data.verdict}`;
  scoreEl.textContent = `Score: ${data.score}`;

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

  // Domain Intelligence
  showDomainInfo(inputUrl);
}
