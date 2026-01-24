// ===============================
// PhishAID Frontend Logic (FINAL)
// ===============================

// Backend API (keep this)
const API_URL = "https://phishaid-api-1013270519404.asia-south1.run.app/check";

// DOM elements
const input = document.getElementById("urlInput");
const button = document.getElementById("checkBtn");
const loading = document.getElementById("loading");
const resultBox = document.getElementById("result");
const verdictEl = document.getElementById("verdict");
const scoreEl = document.getElementById("score");
const warningsEl = document.getElementById("warnings");

// Safety check
if (!button) {
  console.error("Check button not found in DOM");
}

// Button click handler
button.addEventListener("click", async () => {
  const url = input.value.trim();

  if (!url) {
    alert("Please enter a website URL.");
    return;
  }

  // Reset UI
  loading.classList.remove("hidden");
  resultBox.classList.add("hidden");
  warningsEl.innerHTML = "";

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error("Server returned error");
    }

    const data = await response.json();
    showResult(data);

  } catch (error) {
    console.error(error);
    alert("Unable to analyze the website. Please try again later.");
  } finally {
    loading.classList.add("hidden");
  }
});

// Display result
function showResult(data) {
  resultBox.classList.remove("hidden");

  // IMPORTANT: keep base class + verdict class
  resultBox.className = "result-box";
  resultBox.classList.add(
    data.verdict === "Legitimate" ? "safe" : "phishing"
  );

  verdictEl.textContent = `Verdict: ${data.verdict}`;
  scoreEl.textContent = `Risk Score: ${data.score}`;

  warningsEl.innerHTML = "";

  if (!data.warnings || data.warnings.length === 0) {
    warningsEl.innerHTML = "<li>No phishing indicators found.</li>";
  } else {
    data.warnings.forEach(warning => {
      const li = document.createElement("li");
      li.textContent = warning;
      warningsEl.appendChild(li);
    });
  }
}
