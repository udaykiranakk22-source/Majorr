# Credit Lens - Walkthrough Video Script & Storyboard

## Project: Credit Lens - Intelligent Loan Eligibility Platform
## Team: A. Uday Kiran, T. Pavan Chandra, Y. Vignesh, M. Shiva Kumar
## Institute: JB Institute of Engineering & Technology
## Estimated Video Duration: 12-15 minutes

---

## PRE-RECORDING CHECKLIST

Before recording, ensure:
1. MySQL server is running
2. Backend is started: `node mysql-backend.cjs`
3. Frontend is started: `npm run dev`
4. Browser is open at `http://localhost:5173`
5. Create test accounts beforehand:
   - Regular user: `testuser@creditlens.in` / `Test@1234`
   - Admin user: `admin@creditlens.in` / `Admin@1234`
6. Screen resolution: 1920x1080 (Full HD)
7. Use Chrome/Edge browser in full-screen mode

---

## SCENE 1: TITLE SLIDE (0:00 - 0:30)

**[Show a title slide / PowerPoint slide with:]**

```
Credit Lens
Intelligent Loan Eligibility Platform

Capstone Project - B.Tech Information Technology
JB Institute of Engineering & Technology

Team Members:
  A. Uday Kiran
  T. Pavan Chandra
  Y. Vignesh
  M. Shiva Kumar

Guide: [Your Guide's Name]
```

**NARRATION:**
> "Namaste. We are a team of final-year B.Tech IT students from JB Institute of Engineering and Technology. Our capstone project is Credit Lens — an intelligent loan eligibility platform designed for the Indian banking system. Credit Lens helps customers check their loan eligibility, understand their CIBIL score, compare loan options, and get transparent, explainable decisions — all in one platform. Let us walk you through the application."

---

## SCENE 2: TECH STACK OVERVIEW (0:30 - 1:15)

**[Show a slide or diagram with the tech stack]**

```
Frontend:  React 18 + TypeScript + Vite
UI:        shadcn/ui + Tailwind CSS
Backend:   Node.js + Express.js
Database:  MySQL (mysql2)
Auth:      JWT + bcrypt
Logic:     Rule-based Decision Engine (deterministic)
```

**NARRATION:**
> "Credit Lens is built using a modern full-stack architecture. The frontend uses React 18 with TypeScript and Vite for fast development. We use shadcn/ui components with Tailwind CSS for a professional, responsive interface. The backend runs on Node.js with Express, connected to a MySQL database. Authentication is handled through JWT tokens with bcrypt password hashing. Importantly, all loan eligibility decisions are made by our custom rule-based decision engine — no external APIs or AI services are used. Every decision is fully deterministic and explainable, which is critical for transparency in banking."

---

## SCENE 3: LANDING PAGE & REGISTRATION (1:15 - 2:30)

**[Open browser at http://localhost:5173]**

**ACTION:**
1. Show the landing page hero section with the Credit Lens branding
2. Scroll down to show the features overview, services section
3. Scroll back up and click "Get Started" or "Register"
4. Fill in registration form:
   - Name: `Rahul Sharma`
   - Email: `rahul.sharma@gmail.com`
   - Phone: `9876543210`
   - PAN: `ABCPS1234K`
   - Aadhaar: `1234-5678-9012`
   - Password: `Rahul@1234`
5. Submit and show success message
6. Login with the credentials

**NARRATION:**
> "This is the Credit Lens landing page. As you can see, it features a clean, professional design tailored for Indian banking customers. The hero section highlights our key features — CIBIL score simulation, explainable decisions, and smart loan suggestions. Let me register a new user. We collect standard KYC information required by Indian banks — PAN number, Aadhaar, phone number. Passwords are securely hashed using bcrypt before storing in the database. After registration, the user can log in with their credentials. JWT tokens handle session management with an automatic inactivity timeout for security."

---

## SCENE 4: FEATURE 1 — ELIGIBILITY CHECKER & CIBIL SCORE SIMULATION (2:30 - 5:00)

**[Navigate to /eligibility-checker]**

**ACTION:**
1. Show the eligibility checker page
2. Fill in the form:
   - Full Name: `Rahul Sharma`
   - Age: `32`
   - Employment Status: `Employed`
   - Annual Income Band: `7.5 - 10 Lakhs`
   - Loan Type: `Home Loan`
   - Requested Amount: `2500000` (25 Lakhs)
   - Existing EMIs: `5000`
3. Click "Check Eligibility"
4. **PAUSE** — Show the CIBIL Score Gauge (animated arc from 300-900)
5. Show the score breakdown (Employment, Income, Age factors)
6. Scroll down to show rule-by-rule evaluation results
7. Show improvement suggestions if any rules failed

**NARRATION:**
> "The Eligibility Checker is the core feature of Credit Lens. The user enters their personal and financial details — name, age, employment status, annual income band, loan type, requested amount, and any existing EMIs. When they click Check Eligibility, our system does two things simultaneously.

> First, it simulates a CIBIL score based on the applicant's profile. The score ranges from 300 to 900, following the actual CIBIL scoring range used in India. The score is calculated using a deterministic algorithm that considers employment status, income band, and age group. You can see the animated gauge showing the score with color coding — green for good, yellow for fair, and red for poor.

> Second, the decision engine evaluates the application against 6 specific rules — minimum age requirement, CIBIL score threshold, income sufficiency, debt-to-income ratio, employment stability, and loan amount limits. Each rule shows a clear pass or fail status with the exact reason. This transparency is what makes our system explainable — the applicant knows exactly why they were approved or rejected."

**[Now demonstrate a REJECTION case]**

**ACTION:**
1. Go back and fill the form again:
   - Age: `20`
   - Employment: `Student`
   - Income: `Under 2.5 Lakhs`
   - Loan Type: `Home Loan`
   - Amount: `5000000` (50 Lakhs)
2. Submit and show the rejection result
3. Point out which rules failed and the improvement suggestions

**NARRATION:**
> "Let me also demonstrate a rejection scenario. Here, a 20-year-old student with income under 2.5 Lakhs is requesting a 50 Lakh home loan. As expected, multiple rules fail — the CIBIL score is low due to student status, income is insufficient, and the loan amount exceeds the eligible limit. Notice how each failed rule clearly explains why it failed and what the applicant can do to improve. The system also suggests alternate loan types that the applicant might qualify for — this is our alternate loan suggestion feature."

---

## SCENE 5: FEATURE 2 — EXPLAINABLE DECISION ENGINE (5:00 - 6:30)

**[Navigate to /decision/:id — or show DecisionResults from a previous check]**

**ACTION:**
1. Click on "View Detailed Decision" from the eligibility result
2. Show the Decision Results page with:
   - Overall verdict (Approved/Rejected)
   - Score gauge
   - Rule-by-rule breakdown in accordion format
   - Each rule showing: Rule name, Pass/Fail, Actual value vs Required value, Explanation
3. Show the "Decision Transparency" section
4. Show alternate suggestions tab

**NARRATION:**
> "The Decision Results page provides a complete, transparent breakdown of the eligibility decision. This is our Explainable Decision Engine. Unlike black-box AI systems, every decision here can be traced to specific rules and thresholds. Each rule is displayed in an accordion panel showing the rule name, whether it passed or failed, the actual value from the applicant's profile versus the required threshold, and a human-readable explanation. This level of transparency is crucial for regulatory compliance — RBI guidelines require banks to explain why a loan application was rejected. For our viva defense, we can trace any decision back to the exact JavaScript logic in our decision-engine.cjs file."

---

## SCENE 6: FEATURE 3 — EMI CALCULATOR (6:30 - 8:00)

**[Navigate to /emi-calculator]**

**ACTION:**
1. Show the EMI Calculator page with loan type presets (Home, Education, Gold, Vehicle, Personal, Business)
2. Click "Home Loan" preset — rate auto-fills
3. Set Principal: `3000000` (30 Lakhs)
4. Adjust tenure slider to 20 years (240 months)
5. Show the EMI result with:
   - Monthly EMI amount
   - Total interest payable
   - Total payment
   - Visual pie chart breakdown (Principal vs Interest)
6. Switch to "Education Loan" preset and show different rates
7. Show the amortization schedule/breakdown tab

**NARRATION:**
> "The EMI Calculator helps users plan their loan repayment. It comes with preset interest rates for different loan types commonly offered by Indian banks — home loans, education loans, gold loans, vehicle loans, personal loans, and business loans. The user selects a loan type, enters the principal amount in Rupees, and adjusts the tenure using the slider. The calculator instantly shows the monthly EMI, total interest payable, and total payment using the standard reducing balance formula. The visual breakdown shows the proportion of principal versus interest. Users can compare different scenarios by changing the loan type or adjusting the tenure. All amounts are formatted in the Indian numbering system — Lakhs and Crores."

---

## SCENE 7: FEATURE 4 — LOAN COMPARISON DASHBOARD (8:00 - 9:30)

**[Navigate to /loan-comparison]**

**ACTION:**
1. Show the Loan Comparison page
2. Add Loan Option 1:
   - Name: "SBI Home Loan"
   - Type: Home Loan
   - Principal: 3000000
   - Interest Rate: 8.5%
   - Tenure: 240 months
   - Processing Fee: 0.5%
3. Click "Add Another Loan" and add Loan Option 2:
   - Name: "HDFC Home Loan"
   - Type: Home Loan
   - Principal: 3000000
   - Interest Rate: 8.75%
   - Tenure: 240 months
   - Processing Fee: 0.35%
4. Show the comparison table with all calculated values
5. Point out the "Best Deal" badge
6. Show the visual comparison charts

**NARRATION:**
> "The Loan Comparison Dashboard allows users to compare multiple loan offers side by side. For example, a user considering a home loan can enter offers from different banks — here we're comparing SBI and HDFC home loans. For each option, they enter the principal, interest rate, tenure, and processing fee. The system calculates the monthly EMI, total interest, total payment, and effective cost including processing fees. It automatically highlights the best deal based on the lowest effective cost. This helps users make informed decisions by seeing the real cost difference between loan offers, not just the advertised interest rate."

---

## SCENE 8: FEATURE 5 — SCORE IMPROVEMENT TRACKER (9:30 - 10:45)

**[Navigate to /score-improvement]**

**ACTION:**
1. Show the Score Improvement page
2. Enter current CIBIL score: `620`
3. Enter target score: `750`
4. Show the action items checklist with impact scores:
   - Pay all EMIs on time (+30 pts)
   - Reduce credit utilization below 30% (+25 pts)
   - Clear outstanding dues (+40 pts)
   - Maintain older credit accounts (+15 pts)
5. Check off some action items and show the projected score updating
6. Show the timeline estimate to reach the target score
7. Show tips and recommendations accordion

**NARRATION:**
> "The Score Improvement Tracker helps users plan how to improve their CIBIL score. The user enters their current score and their target score. The system generates a personalized action plan with specific steps — paying EMIs on time, reducing credit utilization, clearing outstanding dues, and maintaining credit history length. Each action item shows its estimated impact on the score in points. As the user checks off completed actions, the projected score updates in real time. The system also estimates a timeline to reach the target score. All recommendations follow actual CIBIL score improvement guidelines used by Indian credit bureaus."

---

## SCENE 9: FEATURE 6 — ADMIN DASHBOARD & AUDIT TRAIL (10:45 - 12:00)

**[Log out and log in as admin: admin@creditlens.in / Admin@1234]**
**[Navigate to /admin-dashboard]**

**ACTION:**
1. Show the Admin Dashboard with:
   - Summary cards: Total Applications, Approved, Rejected, Pending
   - Applications table with status badges
2. Click on an application to view details
3. Show the audit trail with timestamps
4. Demonstrate changing application status (Approve/Reject with notes)
5. Show the statistics tab with charts
6. Show the user management section

**NARRATION:**
> "The Admin Dashboard is the bank officer's control center. It shows a summary of all loan applications with counts for total, approved, rejected, and pending applications. The applications table shows each application with its status, applicant details, and loan amount. An admin can click on any application to view the full decision breakdown, review the rule results, and approve or reject the application with notes. Every action is logged in the audit trail with timestamps — who did what and when. This audit trail is critical for regulatory compliance and internal bank auditing. The dashboard also provides statistical overview with visual charts showing approval trends."

---

## SCENE 10: FEATURE 7 — DOCUMENT CHECKLIST GENERATOR (12:00 - 13:00)

**[Navigate to /document-checklist]**

**ACTION:**
1. Show the Document Checklist page
2. Select Loan Type: "Home Loan"
3. Select Employment Status: "Employed"
4. Click "Generate Checklist"
5. Show the generated checklist with categories:
   - Identity Documents (PAN, Aadhaar, Passport)
   - Income Documents (Salary slips, Form 16, ITR)
   - Property Documents (Sale deed, NOC, Property tax)
   - Bank Statements
6. Show the progress bar as documents are checked off
7. Show additional notes section

**NARRATION:**
> "The Document Checklist Generator creates a customized list of documents required for any loan type. The user selects their loan type and employment status, and the system generates the complete checklist organized by category — identity documents, income proofs, property documents for home loans, and bank statements. Each document shows whether it's mandatory or optional with a brief description. As the applicant checks off documents they have ready, the progress bar updates. The system also provides additional notes with tips — like how many months of bank statements are needed, or which ITR forms are accepted. This helps applicants prepare their documentation before visiting the bank."

---

## SCENE 11: SECURITY & TECHNICAL HIGHLIGHTS (13:00 - 14:00)

**[Show code snippets or a slide]**

**ACTION:**
1. Briefly show the backend code structure (mysql-backend.cjs)
2. Show JWT token generation code
3. Show bcrypt password hashing
4. Show the decision engine rules (decision-engine.cjs)
5. Show the database schema

**NARRATION:**
> "On the technical side, Credit Lens implements several security best practices. Passwords are hashed using bcrypt with salt rounds before storing in MySQL. Authentication uses JWT tokens with expiration times. The backend validates all inputs to prevent SQL injection and XSS attacks. The decision engine is completely rule-based and deterministic — given the same inputs, it will always produce the same output. This makes it auditable and testable. The entire application runs locally — no external API calls, no cloud dependencies — making it suitable for deployment in a bank's internal network."

---

## SCENE 12: CONCLUSION (14:00 - 14:45)

**[Show a closing slide]**

**NARRATION:**
> "To summarize, Credit Lens is a complete loan eligibility platform with seven key features — CIBIL Score Simulation, an Explainable Decision Engine, EMI Calculator, Loan Comparison Dashboard, Score Improvement Tracker, Admin Dashboard with Audit Trail, and Document Checklist Generator. The platform is built with transparency and explainability at its core, following RBI guidelines for the Indian banking system. Every decision can be traced, every action is audited, and every recommendation is backed by deterministic rules. Thank you for watching."

```
Credit Lens - Intelligent Loan Eligibility Platform

Key Features:
  1. CIBIL Score Simulation (300-900 range)
  2. Explainable Decision Engine (6 rules)
  3. EMI Calculator (Indian Rupee formatting)
  4. Loan Comparison Dashboard
  5. Score Improvement Tracker
  6. Admin Dashboard + Audit Trail
  7. Document Checklist Generator

Tech Stack: React + TypeScript + Node.js + MySQL
All decisions: Rule-based, Deterministic, Explainable

Thank You!
Team: A. Uday Kiran | T. Pavan Chandra | Y. Vignesh | M. Shiva Kumar
```

---

## RECORDING TIPS

1. **Screen Recording Tool**: Use OBS Studio (free) or built-in Windows Game Bar (Win+G)
2. **Resolution**: Record at 1920x1080 (1080p)
3. **Audio**: Use a quiet room, speak clearly and at moderate pace
4. **Browser**: Use Chrome/Edge, clear all bookmarks bar, use clean profile
5. **Mouse Movement**: Move mouse slowly and deliberately to each element
6. **Zoom In**: Use Ctrl+ to zoom into important sections (forms, results)
7. **Pause**: Pause 2-3 seconds on each important result so viewers can read
8. **Practice**: Do a dry run without recording first to ensure smooth flow
9. **Editing**: Use CapCut (free) or DaVinci Resolve to add title slides, trim pauses
10. **Split Recording**: Record each scene separately and combine in editing — easier to fix mistakes

## WHO NARRATES WHAT (Suggested Split)

| Scene | Narrator | Duration |
|-------|----------|----------|
| Scene 1-2: Title & Tech Stack | A. Uday Kiran | 1:15 |
| Scene 3-4: Landing Page & Eligibility Checker | T. Pavan Chandra | 3:45 |
| Scene 5-6: Decision Engine & EMI Calculator | Y. Vignesh | 3:00 |
| Scene 7-8: Loan Comparison & Score Improvement | M. Shiva Kumar | 2:15 |
| Scene 9-10: Admin Dashboard & Document Checklist | A. Uday Kiran | 2:15 |
| Scene 11-12: Technical Highlights & Conclusion | T. Pavan Chandra | 1:45 |

---
