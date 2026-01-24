# PhishAID 🛡️  
Rule-Based Phishing Detection Web Application

## 🌐 Live Demo
- Homepage: https://phishaid.online  
- Alternate: https://www.phishaid.online  

---

## 📌 Project Overview
**PhishAID** is an academic cybersecurity project designed to detect phishing websites
using a **transparent, rule-based detection engine**.

The system evaluates user-submitted URLs against predefined phishing indicators and
produces an explainable verdict (**Legitimate / Phishing**) along with risk warnings.

This project emphasizes **interpretability, early-stage detection, and infrastructure awareness**.

---

## 🧠 Problem Statement (Source)
PhishAID is inspired by **Problem Statement PS-02** from a national-level **AI Challenge** focusing on:

> *AI-based monitoring and detection of phishing domains and URLs, especially those
targeting Critical Sector Entities (CSEs).*

Key challenges addressed:
- Look-alike and typosquatting domains  
- Newly registered and parked phishing URLs  
- URL-level deception without page content  
- Early detection before active exploitation  

---

## 🎯 Objectives
- Detect phishing URLs using **rule-based heuristics**
- Provide **explainable security decisions**
- Avoid reliance on proprietary threat feeds
- Build a **browser-accessible academic tool**
- Demonstrate secure web infrastructure practices

---

## ⚙️ Methodology
PhishAID evaluates URLs using **30 security rules**, including:

- URL structure analysis  
- Suspicious keywords  
- IP-based URLs  
- HTTPS and certificate checks  
- URL length & entropy analysis  

Each triggered rule contributes to a cumulative **risk score**.
The final verdict is derived from the total score and rule outcomes.

---

## 🏗️ System Architecture
**High-level components:**
- User Browser
- Cloudflare CDN & SSL
- Cloudflare Pages (Frontend Hosting)
- Rule-Based Detection Engine

**Flow:**
1. User submits URL
2. Rules are evaluated
3. Score & warnings generated
4. Verdict displayed to the user

---

## 🧩 Technology Stack
| Layer | Technology |
|-----|-----------|
| Frontend | HTML, CSS, JavaScript |
| Hosting | Cloudflare Pages |
| CDN & Security | Cloudflare |
| Domain & DNS | Cloudflare DNS |
| Version Control | GitHub |
| Deployment | GitHub → Cloudflare CI/CD |

---

## 🌍 Infrastructure Highlights
- **Serverless hosting** (no fixed IP)
- **Global CDN distribution**
- **Automatic HTTPS**
- **DDoS protection**
- **Canonical redirect (SEO-friendly)**

---

## 🚧 Challenges Faced
- DNS propagation delays
- Custom domain verification
- SSL certificate provisioning
- Canonical redirect configuration
- Handling CNAME-based hosting without A records

All challenges were resolved through Cloudflare-based infrastructure optimization.

---

## 📚 Research Basis
PhishAID is supported by a literature review of **phishing detection research (2020–2025)**,
focusing on:
- URL-based detection
- Rule-based vs ML approaches
- Explainable security systems

Relevant research papers are listed on the website under **/research.html**.

---

## 🎓 Academic Context
- Developed as part of an academic curriculum
- Designed for semester evaluation & viva-voce
- Includes presentation material for external examiners
- Emphasizes documentation, transparency, and infrastructure understanding

---

## ⚠️ Disclaimer
This project is intended for **educational and research purposes only**.
Results are heuristic-based and should not be used as a sole security decision system.

---

## 👤 Author
**PhishAID**  
Cybersecurity Academic Project  
GitHub: https://github.com/catalystforimpactfoundation  

---

## 🚀 Future Enhancements
- ML-based phishing classifiers
- Continuous domain monitoring
- Browser extension
- Integration with certificate transparency logs
- Dataset-driven risk scoring

---

© 2026 PhishAID.online  
Academic & Security Research Project
