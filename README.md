# PhishAID – Rule-Based Phishing Detection Backend (v1.0)

PhishAID is an **academic, rule-based phishing detection system** designed to identify malicious and deceptive websites using **transparent, explainable security rules** rather than opaque machine learning models.

This repository contains the **FastAPI backend** deployed on **Google Cloud Run**, which evaluates URLs against a predefined set of **30 phishing detection rules**.

---

## 🎯 Project Objectives

- Demonstrate **explainable cybersecurity logic**
- Avoid black-box machine learning decisions
- Provide deterministic and reproducible results
- Serve as an **academic demonstration project**
- Support future extension into advanced detection techniques

---

## 🧠 Detection Philosophy

PhishAID follows a **rule-based detection approach**, where each rule represents a known phishing indicator documented in cybersecurity research.

Rules are grouped into four categories:

| Category | Description |
|--------|-------------|
| **A** | URL & Transport-Level Analysis |
| **B** | Identity Deception (Homoglyph, Typosquatting) |
| **C** | Structural & Content Similarity |
| **D** | Semantic & Behavioral Intent |

Each triggered rule contributes a **negative risk score**, leading to a final verdict.

---

## 📜 Implemented Rules (v1.0)

### ✅ Category A – URL & Transport-Level Rules
- Rule 1: HTTPS usage
- Rule 2: Raw IP address usage
- Rule 3: Suspicious URL length
- Rule 4: `@` symbol in URL
- Rule 5: Excessive subdomains
- Rule 6: Suspicious TLDs
- Rule 7: Certificate age (< 6 months)
- Rule 8: Hyphenated domains
- Rule 9: URL shorteners
- Rule 10: Login-related keywords

### ✅ Category B – Identity Deception
- Rule 21: Unicode / ASCII homoglyph detection
- Rule 22: Typosquatting detection (edit distance + brand logic)

### ✅ Category C – Structural Anomalies
- Rule 18: Clone phishing (DOM similarity heuristic)

### ✅ Category D – Semantic Intent
- Rule 30: Semantic phishing intent (rule-based heuristic)

---

## ⏳ Defined but Not Implemented (Future Work)

The following rules are **part of the framework** but intentionally left unimplemented in v1.0 due to scope, browser execution requirements, or ethical constraints:

```

Rules: 11–17, 19, 20, 23, 25, 27, 28, 29

```

These include:
- Form behavior analysis
- JavaScript runtime inspection
- Clipboard hijacking
- Advanced hosting intelligence
- Browser-level event monitoring

> 📌 These rules are reserved for future versions and are clearly documented as such for academic transparency.

---

## 🧪 Example API Usage

### Endpoint
```

POST /check

````

### Request
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.amaz0n.com"}' \
  https://<cloud-run-service-url>/check
````

### Response

```json
{
  "domain": "www.amaz0n.com",
  "verdict": "Phishing",
  "score": -25,
  "warnings": [
    "Possible typosquatting detected",
    "Unicode homoglyph detected"
  ],
  "rules_triggered": [
    { "rule_id": 21 },
    { "rule_id": 22 }
  ]
}
```

---

## 🛠 Technology Stack

* **Backend Framework:** FastAPI
* **Language:** Python 3.10+
* **Deployment:** Google Cloud Run
* **Containerization:** Docker
* **Libraries:**

  * requests
  * beautifulsoup4
  * idna
  * dnspython
  * ssl / socket (standard library)

---

## ☁️ Deployment

The backend is containerized and deployed using **Google Cloud Run**.

Key characteristics:

* Stateless service
* HTTPS-only access
* Scales automatically
* No external APIs required

---

## 📚 Academic Disclaimer

> PhishAID is an **academic demonstration project**.
> It is **not intended to replace commercial anti-phishing systems**.

The purpose is to:

* Illustrate phishing detection logic
* Promote explainable cybersecurity systems
* Support academic learning and research

---

## 🚀 Future Enhancements

* Full HTML crawling and JavaScript analysis
* WHOIS-based domain age validation
* Browser-based behavioral monitoring
* Advanced semantic classification models
* Integration with threat intelligence feeds

---

## 👤 Author

**PhishAID Project**
Academic Cybersecurity Demonstration
© 2026 PhishAID.online

---

## 📄 License

This project is released for **educational and academic use only**.

```

---

## ✅ What this README achieves

✔ Matches your **actual backend implementation**  
✔ Honest about missing rules (no overclaiming)  
✔ Examiner-safe  
✔ Clean academic tone  
✔ Ready for GitHub & submission  

If you want, next I can:

- Write **Methodology chapter text**
- Write **Limitations & Future Work**
- Prepare **Viva questions + answers**
- Audit your frontend to match README claims

Just tell me 👍
```
