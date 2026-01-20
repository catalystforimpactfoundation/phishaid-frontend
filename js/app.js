// ===============================
// PhishAID Frontend Logic
// ===============================

// CHANGE THIS ONLY WHEN BACKEND IS PUBLIC
const API_URL = "https://phishaid-api-1013270519404.asia-south1.run.app/check";

// DOM elements
const input = document.getElementById("urlInput");
const button = document.getElementById("checkBtn");
const loading = document.getElementById("loading");
const resultBox = document.getElementById("result");
const verdictEl = document.getElementById("verdict");
const scoreEl = document.getElementById("score");
const warningsEl = document.getElementById("warnings");

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
    // Abort if request takes too long
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 10000);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error("Server returned an error");
    }

    const data = await response.json();
    showResult(data);

  } catch (error) {
    alert("Unable to analyze the website. Please try again later.");
  } finally {
    loading.classList.add("hidden");
  }
});

// Display result
function showResult(data) {
  resultBox.classList.remove("hidden");

  if (data.verdict === "Legitimate") {
    resultBox.className = "safe";
  } else {
    resultBox.className = "phishing";
  }

  verdictEl.textContent = `Verdict: ${data.verdict}`;
  scoreEl.textContent = `Score: ${data.score}`;

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
