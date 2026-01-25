// ===============================
// PhishAID Frontend Logic (FINAL)
// ===============================

const API_URL =
  "https://phishaid-api-1013270519404.asia-south1.run.app/check";

// DOM Elements
const input = document.getElementById("urlInput");
const button = document.getElementById("checkBtn");
const loading = document.getElementById("loading");
const resultBox = document.getElementById("result");
const verdictEl = document.getElementById("verdict");
const scoreEl = document.getElementById("score");
const warningsEl = document.getElementById("warnings");

const ruleLogContainer = document.getElementById("ruleLogContainer");
const ruleLogBody = document.getElementById("ruleLogBody");

// ===============================
// ✅ ADD THIS BEFORE API CALL
// URL Normalization
// ===============================
function normalizeURL(value) {
  let url = value.trim();
  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }
  return url;
}

// ===============================
// Button Click Handler
// ===============================
button.addEventListener("click", async () => {
  if (!input.value.trim()) {
    alert("Please enter a website URL");
    return;
  }

  const url = normalizeURL(input.value);

  loading.classList.remove("hidden");
  resultBox.classList.add("hidden");
  ruleLogContainer.classList.add("hidden");
  warningsEl.innerHTML = "";
  ruleLogBody.innerHTML = "";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    });

    const data = await response.json();
    showResult(data, url);

  } catch (error) {
    alert("Unable to analyze the website.");
  } finally {
    loading.classList.add("hidden");
  }
});

// ===============================
// 2️⃣ UPDATED showResult()
// ===============================
function showResult(data, domain) {
  resultBox.classList.remove("hidden");

  resultBox.className =
    "result-box " +
    (data.verdict === "Legitimate" ? "safe" : "phishing");

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

  // ===============================
  // Rule Evaluation Table
  // ===============================
  ruleLogContainer.classList.remove("hidden");

  if (data.rules && data.rules.length > 0) {
    data.rules.forEach(rule => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${domain}</td>
        <td>${rule.rule_id}</td>
        <td>${rule.comment}</td>
        <td>${rule.remark}</td>
        <td>${rule.score}</td>
      `;
      ruleLogBody.appendChild(row);
    });
  } else {
    const row = document.createElement("tr");
    row.innerHTML =
      "<td colspan='5'>No phishing rules matched</td>";
    ruleLogBody.appendChild(row);
  }
}
