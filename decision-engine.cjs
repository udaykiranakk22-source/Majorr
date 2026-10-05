/**
 * Credit Lens - Decision Engine
 *
 * Pure-function module for loan eligibility assessment.
 * No database access, no side effects, no external API calls.
 * Every decision is deterministic, traceable, and explainable.
 *
 * Architecture: Predict -> Explain -> Guide
 *   - Predict: Simulate CIBIL score, evaluate 6 rules, render verdict
 *   - Explain: Return specific rejection reasons with human-readable descriptions
 *   - Guide: Suggest score improvement actions + alternate loan options
 *
 * Engine Version: 1.0.0
 */

const ENGINE_VERSION = '1.0.0';

// ============================================================
// SECTION 1: CIBIL SCORE SIMULATION
// ============================================================

/**
 * Income band to numeric value mapping (annual income in Lakhs)
 * Used for decision rules that need numeric comparisons
 */
const INCOME_MAP = {
  'under-2.5L': 200000,
  '2.5L-5L': 375000,
  '5L-7.5L': 625000,
  '7.5L-10L': 875000,
  '10L-15L': 1250000,
  '15L-25L': 2000000,
  'over-25L': 3000000
};

/**
 * Simulate a CIBIL score (300-900) based on applicant profile.
 *
 * Real CIBIL scores come from TransUnion CIBIL bureau based on credit history.
 * Since we cannot access the bureau, we simulate a score using observable factors:
 *   - Employment status (stability indicator)
 *   - Income band (repayment capacity)
 *   - Age factor (credit history length proxy)
 *
 * This is a SIMULATION for demonstration purposes.
 * In production, this would be replaced by actual CIBIL API integration.
 *
 * @param {Object} applicant - Applicant profile data
 * @returns {Object} { score, breakdown, confidence }
 */
function simulateCIBILScore(applicant) {
  let baseScore = 600; // Neutral starting point
  const breakdown = [];

  // Factor 1: Employment Status (weight: 30%)
  const employmentScores = {
    'employed': 80,
    'self-employed': 60,
    'retired': 50,
    'student': 20,
    'unemployed': -50,
    'other': 10
  };
  const employmentImpact = employmentScores[applicant.employmentStatus] || 0;
  baseScore += employmentImpact;
  breakdown.push({
    factor: 'Employment Status',
    value: applicant.employmentStatus,
    impact: employmentImpact,
    description: `${applicant.employmentStatus} status contributes ${employmentImpact > 0 ? '+' : ''}${employmentImpact} points`
  });

  // Factor 2: Income Band (weight: 30%)
  const incomeScores = {
    'under-2.5L': -30,
    '2.5L-5L': 0,
    '5L-7.5L': 30,
    '7.5L-10L': 50,
    '10L-15L': 70,
    '15L-25L': 90,
    'over-25L': 100
  };
  const incomeImpact = incomeScores[applicant.annualIncome] || 0;
  baseScore += incomeImpact;
  breakdown.push({
    factor: 'Annual Income',
    value: applicant.annualIncome,
    impact: incomeImpact,
    description: `Income band ${applicant.annualIncome} contributes ${incomeImpact > 0 ? '+' : ''}${incomeImpact} points`
  });

  // Factor 3: Age-based credit history proxy (weight: 20%)
  if (applicant.dateOfBirth) {
    const age = calculateAge(applicant.dateOfBirth);
    let ageImpact = 0;
    if (age < 21) ageImpact = -20;
    else if (age < 25) ageImpact = 10;
    else if (age < 35) ageImpact = 40;
    else if (age < 50) ageImpact = 60;
    else if (age < 60) ageImpact = 50;
    else ageImpact = 30;

    baseScore += ageImpact;
    breakdown.push({
      factor: 'Age / Credit History Length',
      value: `${age} years`,
      impact: ageImpact,
      description: `Age ${age} (credit history proxy) contributes ${ageImpact > 0 ? '+' : ''}${ageImpact} points`
    });
  }

  // Factor 4: Existing relationship (weight: 10%)
  // If they have an employer listed, slight positive
  if (applicant.employerName && applicant.employerName.trim().length > 0) {
    baseScore += 20;
    breakdown.push({
      factor: 'Employer Stability',
      value: applicant.employerName,
      impact: 20,
      description: 'Named employer adds +20 points (stability indicator)'
    });
  }

  // Factor 5: Down payment provided (weight: 10%)
  if (applicant.downPayment && parseFloat(applicant.downPayment) > 0) {
    const dpImpact = Math.min(30, Math.floor(parseFloat(applicant.downPayment) / 10000));
    baseScore += dpImpact;
    breakdown.push({
      factor: 'Down Payment',
      value: `₹${parseFloat(applicant.downPayment).toLocaleString('en-IN')}`,
      impact: dpImpact,
      description: `Down payment of ₹${parseFloat(applicant.downPayment).toLocaleString('en-IN')} adds +${dpImpact} points`
    });
  }

  // Clamp to valid CIBIL range: 300-900
  const finalScore = Math.max(300, Math.min(900, Math.round(baseScore)));

  return {
    score: finalScore,
    breakdown,
    confidence: 'simulated',
    note: 'Score is simulated based on applicant profile. In production, this would use actual CIBIL bureau data.'
  };
}


// ============================================================
// SECTION 2: DECISION RULES
// ============================================================

/**
 * Rule 1: CIBIL Score Threshold
 * Minimum score varies by loan type per RBI guidelines
 */
function ruleCIBILThreshold(cibilScore, loanType) {
  const thresholds = {
    'Personal Loan': 700,
    'Home Loan': 650,
    'Auto Loan': 650,
    'Education Loan': 600,
    'Gold Loan': 550
  };
  const threshold = thresholds[loanType] || 700;
  const passed = cibilScore >= threshold;

  return {
    ruleId: 'CIBIL_THRESHOLD',
    ruleName: 'CIBIL Score Minimum',
    passed,
    threshold,
    actual: cibilScore,
    severity: passed ? 'pass' : 'critical',
    reason: passed
      ? `CIBIL score ${cibilScore} meets minimum threshold of ${threshold} for ${loanType}`
      : `CIBIL score ${cibilScore} is below the minimum ${threshold} required for ${loanType}`,
    suggestion: passed ? null : `Improve your CIBIL score by at least ${threshold - cibilScore} points before reapplying`
  };
}

/**
 * Rule 2: Loan-to-Income Ratio
 * Loan amount should not exceed a multiple of annual income
 */
function ruleLoanToIncome(loanAmount, annualIncome, loanType) {
  const numericIncome = INCOME_MAP[annualIncome] || 0;

  // Maximum loan-to-income multipliers by loan type
  const maxMultipliers = {
    'Personal Loan': 3,
    'Home Loan': 6,
    'Auto Loan': 2,
    'Education Loan': 4,
    'Gold Loan': 1.5
  };
  const maxMultiplier = maxMultipliers[loanType] || 3;
  const maxLoanAmount = numericIncome * maxMultiplier;
  const ratio = numericIncome > 0 ? (loanAmount / numericIncome).toFixed(2) : 'N/A';
  const passed = loanAmount <= maxLoanAmount;

  return {
    ruleId: 'LOAN_TO_INCOME',
    ruleName: 'Loan-to-Income Ratio',
    passed,
    threshold: `${maxMultiplier}x annual income (₹${maxLoanAmount.toLocaleString('en-IN')})`,
    actual: `${ratio}x (₹${loanAmount.toLocaleString('en-IN')})`,
    severity: passed ? 'pass' : 'high',
    reason: passed
      ? `Loan amount ₹${loanAmount.toLocaleString('en-IN')} is within ${maxMultiplier}x income limit`
      : `Loan amount ₹${loanAmount.toLocaleString('en-IN')} exceeds ${maxMultiplier}x annual income cap of ₹${maxLoanAmount.toLocaleString('en-IN')}`,
    suggestion: passed ? null : `Reduce loan amount to ₹${maxLoanAmount.toLocaleString('en-IN')} or below, or provide additional income proof`
  };
}

/**
 * Rule 3: Employment Stability
 * Certain employment statuses are ineligible for certain loan types
 */
function ruleEmploymentStability(employmentStatus, loanType) {
  // Loan types that require employment
  const requiresEmployment = {
    'Personal Loan': ['employed', 'self-employed', 'retired'],
    'Home Loan': ['employed', 'self-employed'],
    'Auto Loan': ['employed', 'self-employed', 'retired'],
    'Education Loan': ['employed', 'self-employed', 'retired', 'student'],
    'Gold Loan': ['employed', 'self-employed', 'retired', 'student', 'unemployed', 'other']
  };

  const eligible = requiresEmployment[loanType] || ['employed', 'self-employed'];
  const passed = eligible.includes(employmentStatus);

  return {
    ruleId: 'EMPLOYMENT_STABILITY',
    ruleName: 'Employment Stability',
    passed,
    threshold: `Must be: ${eligible.join(', ')}`,
    actual: employmentStatus,
    severity: passed ? 'pass' : 'critical',
    reason: passed
      ? `Employment status '${employmentStatus}' is eligible for ${loanType}`
      : `Employment status '${employmentStatus}' is not eligible for ${loanType}. Requires: ${eligible.join(', ')}`,
    suggestion: passed ? null : 'Secure stable employment before applying, or consider loan types with fewer employment requirements'
  };
}

/**
 * Rule 4: Loan-to-Value (LTV) Ratio for Home and Auto loans
 * Down payment must meet minimum percentage of asset value
 */
function ruleLTVRatio(loanAmount, downPayment, propertyValue, loanType) {
  // LTV only applies to Home and Auto loans
  if (!['Home Loan', 'Auto Loan'].includes(loanType)) {
    return {
      ruleId: 'LTV_RATIO',
      ruleName: 'Loan-to-Value Ratio',
      passed: true,
      threshold: 'N/A',
      actual: 'N/A',
      severity: 'pass',
      reason: `LTV ratio check not applicable for ${loanType}`,
      suggestion: null
    };
  }

  const assetValue = propertyValue || (loanAmount + (downPayment || 0));
  const ltv = assetValue > 0 ? ((loanAmount / assetValue) * 100).toFixed(1) : 0;

  // RBI LTV limits
  const maxLTV = {
    'Home Loan': 80, // 80% max LTV for home loans (20% down payment)
    'Auto Loan': 85  // 85% max LTV for auto loans (15% down payment)
  };
  const limit = maxLTV[loanType] || 80;
  const passed = parseFloat(ltv) <= limit;

  return {
    ruleId: 'LTV_RATIO',
    ruleName: 'Loan-to-Value Ratio',
    passed,
    threshold: `Maximum ${limit}% LTV`,
    actual: `${ltv}% LTV`,
    severity: passed ? 'pass' : 'high',
    reason: passed
      ? `LTV ratio ${ltv}% is within the ${limit}% limit`
      : `LTV ratio ${ltv}% exceeds the maximum ${limit}% allowed. Increase your down payment.`,
    suggestion: passed ? null : `Increase down payment to at least ₹${Math.ceil(assetValue * (1 - limit / 100)).toLocaleString('en-IN')}`
  };
}

/**
 * Rule 5: Auto Loan Amount Cap
 * Auto loan amounts are capped based on income
 */
function ruleAutoLoanCap(loanAmount, annualIncome, loanType) {
  if (loanType !== 'Auto Loan') {
    return {
      ruleId: 'AUTO_LOAN_CAP',
      ruleName: 'Auto Loan Amount Cap',
      passed: true,
      threshold: 'N/A',
      actual: 'N/A',
      severity: 'pass',
      reason: `Auto loan cap not applicable for ${loanType}`,
      suggestion: null
    };
  }

  const numericIncome = INCOME_MAP[annualIncome] || 0;
  const maxAutoLoan = numericIncome * 2; // Max 2x annual income for auto loans
  const passed = loanAmount <= maxAutoLoan;

  return {
    ruleId: 'AUTO_LOAN_CAP',
    ruleName: 'Auto Loan Amount Cap',
    passed,
    threshold: `₹${maxAutoLoan.toLocaleString('en-IN')} (2x annual income)`,
    actual: `₹${loanAmount.toLocaleString('en-IN')}`,
    severity: passed ? 'pass' : 'medium',
    reason: passed
      ? `Auto loan amount ₹${loanAmount.toLocaleString('en-IN')} is within the 2x income cap`
      : `Auto loan amount ₹${loanAmount.toLocaleString('en-IN')} exceeds the cap of ₹${maxAutoLoan.toLocaleString('en-IN')}`,
    suggestion: passed ? null : `Reduce the auto loan amount to ₹${maxAutoLoan.toLocaleString('en-IN')} or consider a higher down payment`
  };
}

/**
 * Rule 6: Minimum Loan Amount
 * Each loan type has a minimum amount
 */
function ruleMinimumAmount(loanAmount, loanType) {
  const minimums = {
    'Personal Loan': 50000,      // ₹50,000
    'Home Loan': 500000,         // ₹5,00,000
    'Auto Loan': 100000,         // ₹1,00,000
    'Education Loan': 100000,    // ₹1,00,000
    'Gold Loan': 25000           // ₹25,000
  };
  const minimum = minimums[loanType] || 50000;
  const passed = loanAmount >= minimum;

  return {
    ruleId: 'MINIMUM_AMOUNT',
    ruleName: 'Minimum Loan Amount',
    passed,
    threshold: `₹${minimum.toLocaleString('en-IN')}`,
    actual: `₹${loanAmount.toLocaleString('en-IN')}`,
    severity: passed ? 'pass' : 'low',
    reason: passed
      ? `Loan amount ₹${loanAmount.toLocaleString('en-IN')} meets the minimum ₹${minimum.toLocaleString('en-IN')}`
      : `Loan amount ₹${loanAmount.toLocaleString('en-IN')} is below the minimum ₹${minimum.toLocaleString('en-IN')} for ${loanType}`,
    suggestion: passed ? null : `Increase loan amount to at least ₹${minimum.toLocaleString('en-IN')}`
  };
}


// ============================================================
// SECTION 3: DECISION ORCHESTRATOR
// ============================================================

/**
 * Evaluate all 6 rules and produce a decision.
 *
 * Decision Matrix:
 *   - ALL rules pass                       -> approved
 *   - Any CRITICAL rule fails              -> rejected
 *   - Only non-critical rules fail         -> conditionally_approved
 *   - No data / invalid input              -> under_review
 *
 * @param {Object} application - Full loan application data
 * @returns {Object} Complete decision result
 */
function evaluateApplication(application) {
  const startTime = Date.now();

  // Step 1: Simulate CIBIL score
  const cibilResult = simulateCIBILScore(application);
  const cibilScore = cibilResult.score;

  const loanAmount = parseFloat(application.loanAmount) || 0;
  const downPayment = parseFloat(application.downPayment) || 0;
  const propertyValue = parseFloat(application.propertyValue) || 0;

  // Step 2: Evaluate all 6 rules
  const rules = [
    ruleCIBILThreshold(cibilScore, application.loanType),
    ruleLoanToIncome(loanAmount, application.annualIncome, application.loanType),
    ruleEmploymentStability(application.employmentStatus, application.loanType),
    ruleLTVRatio(loanAmount, downPayment, propertyValue, application.loanType),
    ruleAutoLoanCap(loanAmount, application.annualIncome, application.loanType),
    ruleMinimumAmount(loanAmount, application.loanType)
  ];

  const rulesPassed = rules.filter(r => r.passed);
  const rulesFailed = rules.filter(r => !r.passed);
  const hasCriticalFailure = rulesFailed.some(r => r.severity === 'critical');

  // Step 3: Determine final decision
  let decision;
  let decisionType;
  if (rulesFailed.length === 0) {
    decision = 'approved';
    decisionType = 'auto_approved';
  } else if (hasCriticalFailure) {
    decision = 'rejected';
    decisionType = 'auto_rejected';
  } else {
    decision = 'conditionally_approved';
    decisionType = 'conditional';
  }

  // Step 4: Generate rejection reasons
  const rejectionReasons = rulesFailed.map(r => ({
    ruleId: r.ruleId,
    ruleName: r.ruleName,
    severity: r.severity,
    reason: r.reason,
    suggestion: r.suggestion
  }));

  // Step 5: Generate score improvement actions
  const recommendedActions = generateImprovementActions(cibilScore, rulesFailed, application);

  // Step 6: Generate alternate loan suggestions
  const alternateSuggestions = generateAlternateSuggestions(application, cibilScore, rulesFailed);

  // Step 7: Calculate EMI (if approved or conditionally approved)
  let emiDetails = null;
  if (decision !== 'rejected') {
    emiDetails = calculateEMI(loanAmount, application.loanType, application.loanTenureMonths || 12);
  }

  // Step 8: Calculate reapply eligible date (if rejected)
  let reapplyDate = null;
  if (decision === 'rejected') {
    const date = new Date();
    date.setMonth(date.getMonth() + 3); // 3 months from now
    reapplyDate = date.toISOString().split('T')[0];
  }

  const processingTime = Date.now() - startTime;

  return {
    decision,
    decisionType,
    cibilScore,
    cibilBreakdown: cibilResult.breakdown,
    rulesEvaluated: rules,
    rulesPassed: rulesPassed.map(r => r.ruleId),
    rulesFailed: rulesFailed.map(r => r.ruleId),
    rejectionReasons,
    recommendedActions,
    alternateSuggestions,
    emiDetails,
    reapplyEligibleDate: reapplyDate,
    processingTimeMs: processingTime,
    engineVersion: ENGINE_VERSION,
    decisionSummary: generateDecisionSummary(decision, rulesFailed, cibilScore, application.loanType)
  };
}


// ============================================================
// SECTION 4: EMI CALCULATOR
// ============================================================

/**
 * Calculate EMI using standard reducing balance formula:
 * EMI = P x r x (1+r)^n / ((1+r)^n - 1)
 *
 * Where:
 *   P = Principal loan amount
 *   r = Monthly interest rate (annual rate / 12 / 100)
 *   n = Number of monthly installments (tenure in months)
 *
 * @param {number} principal - Loan amount in INR
 * @param {string} loanType - Type of loan
 * @param {number} tenureMonths - Loan tenure in months
 * @returns {Object} EMI calculation details
 */
function calculateEMI(principal, loanType, tenureMonths) {
  // Indicative annual interest rates by loan type
  const interestRates = {
    'Personal Loan': 12.5,
    'Home Loan': 8.5,
    'Auto Loan': 9.5,
    'Education Loan': 10.0,
    'Gold Loan': 7.5
  };

  const annualRate = interestRates[loanType] || 12.0;
  const monthlyRate = annualRate / 12 / 100;
  const n = tenureMonths || 12;

  let emi;
  if (monthlyRate === 0) {
    emi = principal / n;
  } else {
    const factor = Math.pow(1 + monthlyRate, n);
    emi = (principal * monthlyRate * factor) / (factor - 1);
  }

  const totalPayment = emi * n;
  const totalInterest = totalPayment - principal;

  return {
    monthlyEMI: Math.round(emi),
    annualInterestRate: annualRate,
    tenureMonths: n,
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest),
    principal: principal,
    formula: 'EMI = P x r x (1+r)^n / ((1+r)^n - 1)'
  };
}


// ============================================================
// SECTION 5: SCORE IMPROVEMENT ACTIONS
// ============================================================

/**
 * Generate actionable improvement steps based on failed rules and CIBIL score
 */
function generateImprovementActions(cibilScore, failedRules, application) {
  const actions = [];

  // CIBIL score improvement actions
  if (cibilScore < 750) {
    if (cibilScore < 600) {
      actions.push({
        actionType: 'pay_debt',
        description: 'Clear any outstanding debts or overdue payments immediately. Late payments severely impact your credit score.',
        estimatedScoreImpact: 50,
        priority: 'high',
        timeframe: '3-6 months'
      });
      actions.push({
        actionType: 'fix_errors',
        description: 'Request your CIBIL report and dispute any errors or incorrect entries. Errors are surprisingly common.',
        estimatedScoreImpact: 30,
        priority: 'high',
        timeframe: '1-2 months'
      });
    }

    if (cibilScore < 700) {
      actions.push({
        actionType: 'reduce_utilization',
        description: 'Keep credit card utilization below 30% of your total credit limit. Pay bills before the statement date.',
        estimatedScoreImpact: 40,
        priority: 'high',
        timeframe: '2-3 months'
      });
    }

    actions.push({
      actionType: 'build_history',
      description: 'Maintain a mix of credit accounts (credit card + loan) and make all payments on time for at least 6 months.',
      estimatedScoreImpact: 30,
      priority: 'medium',
      timeframe: '6-12 months'
    });
  }

  // Employment-related improvements
  const employmentFailed = failedRules.find(r => r.ruleId === 'EMPLOYMENT_STABILITY');
  if (employmentFailed) {
    actions.push({
      actionType: 'maintain_employment',
      description: 'Secure stable employment (salaried or self-employed with ITR filing) before reapplying.',
      estimatedScoreImpact: 20,
      priority: 'high',
      timeframe: '3-6 months'
    });
  }

  // Income-related improvements
  const incomeFailed = failedRules.find(r => r.ruleId === 'LOAN_TO_INCOME');
  if (incomeFailed) {
    actions.push({
      actionType: 'increase_income',
      description: 'Either reduce the requested loan amount or wait until your income increases. Consider adding a co-applicant with additional income.',
      estimatedScoreImpact: 0,
      priority: 'medium',
      timeframe: 'Varies'
    });
  }

  return actions;
}


// ============================================================
// SECTION 6: ALTERNATE LOAN SUGGESTIONS
// ============================================================

/**
 * Suggest alternative loan types or amounts the applicant may qualify for
 */
function generateAlternateSuggestions(application, cibilScore, failedRules) {
  const suggestions = [];
  const numericIncome = INCOME_MAP[application.annualIncome] || 0;
  const loanAmount = parseFloat(application.loanAmount) || 0;

  // If amount is too high, suggest a lower amount
  const incomeFailed = failedRules.find(r => r.ruleId === 'LOAN_TO_INCOME');
  if (incomeFailed && numericIncome > 0) {
    const multiplier = application.loanType === 'Home Loan' ? 6 : 3;
    const maxEligible = numericIncome * multiplier;
    if (maxEligible >= 50000) {
      suggestions.push({
        type: 'reduced_amount',
        loanType: application.loanType,
        suggestedAmount: maxEligible,
        reason: `You may qualify for ₹${maxEligible.toLocaleString('en-IN')} based on your income`,
        eligibilityLikelihood: 'high'
      });
    }
  }

  // Suggest Gold Loan (lowest CIBIL requirement)
  if (cibilScore < 650 && application.loanType !== 'Gold Loan') {
    suggestions.push({
      type: 'alternate_product',
      loanType: 'Gold Loan',
      suggestedAmount: Math.min(loanAmount, numericIncome * 1.5),
      reason: 'Gold Loans have a lower CIBIL requirement (550) and are secured against gold collateral',
      eligibilityLikelihood: 'medium'
    });
  }

  // Suggest Education Loan (more lenient for students)
  if (application.employmentStatus === 'student' && application.loanType !== 'Education Loan') {
    suggestions.push({
      type: 'alternate_product',
      loanType: 'Education Loan',
      suggestedAmount: Math.min(loanAmount, numericIncome * 4),
      reason: 'Education Loans are available to students and have flexible repayment options',
      eligibilityLikelihood: 'medium'
    });
  }

  // Suggest Personal Loan if Home/Auto loan was rejected for LTV
  const ltvFailed = failedRules.find(r => r.ruleId === 'LTV_RATIO');
  if (ltvFailed && ['Home Loan', 'Auto Loan'].includes(application.loanType)) {
    const personalMax = numericIncome * 3;
    if (personalMax >= 50000 && cibilScore >= 700) {
      suggestions.push({
        type: 'alternate_product',
        loanType: 'Personal Loan',
        suggestedAmount: Math.min(loanAmount, personalMax),
        reason: 'A Personal Loan does not require down payment or collateral',
        eligibilityLikelihood: 'medium'
      });
    }
  }

  return suggestions;
}


// ============================================================
// SECTION 7: HELPERS
// ============================================================

/**
 * Calculate age from date of birth
 */
function calculateAge(dateOfBirth) {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

/**
 * Generate a human-readable decision summary
 */
function generateDecisionSummary(decision, failedRules, cibilScore, loanType) {
  if (decision === 'approved') {
    return `Your ${loanType} application has been approved. Your CIBIL score of ${cibilScore} and profile meet all eligibility criteria.`;
  }

  if (decision === 'conditionally_approved') {
    const issues = failedRules.map(r => r.ruleName).join(', ');
    return `Your ${loanType} application is conditionally approved. Minor issues found: ${issues}. Please review the recommendations below.`;
  }

  if (decision === 'rejected') {
    const criticalIssues = failedRules.filter(r => r.severity === 'critical').map(r => r.ruleName).join(', ');
    return `Your ${loanType} application could not be approved at this time. Key issues: ${criticalIssues}. Please review the improvement actions and consider alternate options below.`;
  }

  return `Your ${loanType} application requires manual review.`;
}

/**
 * Get the Indian states list for validation
 */
function getIndianStates() {
  return [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ];
}

/**
 * Validate PAN number format
 */
function validatePAN(pan) {
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
}

/**
 * Validate Aadhaar number format
 */
function validateAadhaar(aadhaar) {
  return /^\d{12}$/.test(aadhaar);
}

/**
 * Generate a document checklist based on loan type and employment
 */
function generateDocumentChecklist(loanType, employmentStatus) {
  const common = [
    { document: 'PAN Card', required: true, category: 'Identity' },
    { document: 'Aadhaar Card', required: true, category: 'Identity' },
    { document: 'Passport-size Photographs (2)', required: true, category: 'Identity' },
    { document: 'Address Proof (Utility Bill / Aadhaar)', required: true, category: 'Address' }
  ];

  const employmentDocs = {
    'employed': [
      { document: 'Last 3 months Salary Slips', required: true, category: 'Income' },
      { document: 'Form 16 / IT Returns (last 2 years)', required: true, category: 'Income' },
      { document: 'Bank Statements (last 6 months)', required: true, category: 'Financial' },
      { document: 'Employment / Offer Letter', required: false, category: 'Employment' }
    ],
    'self-employed': [
      { document: 'IT Returns (last 3 years)', required: true, category: 'Income' },
      { document: 'Business Registration / GST Certificate', required: true, category: 'Business' },
      { document: 'Profit & Loss Statement', required: true, category: 'Financial' },
      { document: 'Bank Statements (last 12 months)', required: true, category: 'Financial' },
      { document: 'CA Certificate', required: false, category: 'Financial' }
    ],
    'retired': [
      { document: 'Pension Statement', required: true, category: 'Income' },
      { document: 'Bank Statements (last 6 months)', required: true, category: 'Financial' }
    ],
    'student': [
      { document: 'Admission Letter / ID Card', required: true, category: 'Education' },
      { document: 'Co-applicant Income Proof', required: true, category: 'Income' },
      { document: 'Fee Structure', required: true, category: 'Education' }
    ]
  };

  const loanSpecificDocs = {
    'Home Loan': [
      { document: 'Property Documents / Sale Agreement', required: true, category: 'Property' },
      { document: 'Property Valuation Report', required: false, category: 'Property' },
      { document: 'Builder NOC / Approval Plan', required: true, category: 'Property' }
    ],
    'Auto Loan': [
      { document: 'Vehicle Proforma Invoice', required: true, category: 'Vehicle' },
      { document: 'Dealer Quotation', required: true, category: 'Vehicle' }
    ],
    'Education Loan': [
      { document: 'Admission Letter from Institution', required: true, category: 'Education' },
      { document: 'Fee Structure Breakdown', required: true, category: 'Education' },
      { document: 'Scholarship Details (if any)', required: false, category: 'Education' }
    ],
    'Gold Loan': [
      { document: 'Gold Purity Certificate', required: false, category: 'Collateral' }
    ]
  };

  return [
    ...common,
    ...(employmentDocs[employmentStatus] || employmentDocs['employed']),
    ...(loanSpecificDocs[loanType] || [])
  ];
}


// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  // Core functions
  simulateCIBILScore,
  evaluateApplication,
  calculateEMI,

  // Individual rules (for testing/documentation)
  ruleCIBILThreshold,
  ruleLoanToIncome,
  ruleEmploymentStability,
  ruleLTVRatio,
  ruleAutoLoanCap,
  ruleMinimumAmount,

  // Utilities
  generateDocumentChecklist,
  generateImprovementActions,
  generateAlternateSuggestions,
  validatePAN,
  validateAadhaar,
  getIndianStates,
  calculateAge,

  // Constants
  ENGINE_VERSION,
  INCOME_MAP
};
