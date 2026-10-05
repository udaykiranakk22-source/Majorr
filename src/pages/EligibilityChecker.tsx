import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Shield,
  CheckCircle,
  XCircle,
  TrendingUp,
  AlertTriangle,
  IndianRupee,
  Target,
  Loader2,
  ArrowRight,
  Lightbulb,
  BarChart3,
  FileCheck,
} from "lucide-react";

const API_BASE = "http://localhost:3000";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    value
  );

const EMPLOYMENT_OPTIONS = [
  { value: "employed", label: "Employed" },
  { value: "self-employed", label: "Self-Employed" },
  { value: "retired", label: "Retired" },
  { value: "student", label: "Student" },
  { value: "unemployed", label: "Unemployed" },
];

const INCOME_BANDS = [
  { value: "under-2.5L", label: "Under 2.5 Lakhs" },
  { value: "2.5L-5L", label: "2.5 - 5 Lakhs" },
  { value: "5L-7.5L", label: "5 - 7.5 Lakhs" },
  { value: "7.5L-10L", label: "7.5 - 10 Lakhs" },
  { value: "10L-15L", label: "10 - 15 Lakhs" },
  { value: "15L-25L", label: "15 - 25 Lakhs" },
  { value: "over-25L", label: "Over 25 Lakhs" },
];

const LOAN_TYPES = [
  { value: "Home Loan", label: "Home Loan" },
  { value: "Education Loan", label: "Education Loan" },
  { value: "Gold Loan", label: "Gold Loan" },
  { value: "Vehicle Loan", label: "Vehicle Loan" },
  { value: "Personal Loan", label: "Personal Loan" },
  { value: "Business Loan", label: "Business Loan" },
  { value: "Agriculture Loan", label: "Agriculture Loan" },
];

interface RuleResult {
  rule: string;
  passed: boolean;
  reason?: string;
}

interface EligibilityResult {
  eligible: boolean;
  score: number;
  breakdown: Record<string, number>;
  rules: RuleResult[];
  overallResult: string;
  improvementActions?: string[];
  alternateSuggestions?: string[];
}

function getScoreColor(score: number): string {
  if (score >= 700) return "text-green-500";
  if (score >= 500) return "text-yellow-500";
  return "text-red-500";
}

function getScoreBgColor(score: number): string {
  if (score >= 700) return "bg-green-500";
  if (score >= 500) return "bg-yellow-500";
  return "bg-red-500";
}

function getScoreLabel(score: number): string {
  if (score >= 750) return "Excellent";
  if (score >= 700) return "Good";
  if (score >= 600) return "Fair";
  if (score >= 500) return "Below Average";
  return "Poor";
}

function ScoreGauge({ score }: { score: number }) {
  const normalized = ((score - 300) / 600) * 100;
  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (normalized / 100) * circumference * 0.75;

  let strokeColor: string;
  if (score >= 700) strokeColor = "stroke-green-500";
  else if (score >= 500) strokeColor = "stroke-yellow-500";
  else strokeColor = "stroke-red-500";

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-48">
        <svg viewBox="0 0 160 160" className="w-full h-full -rotate-[135deg]">
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * 0.25}
            strokeLinecap="round"
          />
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            className={strokeColor}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-bold ${getScoreColor(score)}`}>
            {score}
          </span>
          <span className="text-sm text-muted-foreground">
            {getScoreLabel(score)}
          </span>
        </div>
      </div>
      <div className="flex justify-between w-full text-xs text-muted-foreground mt-1 px-4">
        <span>300</span>
        <span>500</span>
        <span>700</span>
        <span>900</span>
      </div>
    </div>
  );
}

export default function EligibilityChecker() {
  const [employmentStatus, setEmploymentStatus] = useState("");
  const [annualIncome, setAnnualIncome] = useState("");
  const [loanType, setLoanType] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [loanPurpose, setLoanPurpose] = useState("");
  const [age, setAge] = useState("");
  const [downPayment, setDownPayment] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EligibilityResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE}/check-eligibility`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employmentStatus,
          annualIncome,
          loanType,
          loanAmount: Number(loanAmount),
          loanPurpose,
          age: Number(age),
          downPayment: Number(downPayment),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data: EligibilityResult = await response.json();
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to check eligibility. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    employmentStatus && annualIncome && loanType && loanAmount && age;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Banner */}
      <section
        className="relative py-16 px-4"
        style={{
          background:
            "linear-gradient(135deg, hsl(var(--credit-lens-primary)) 0%, hsl(var(--credit-lens-secondary)) 100%)",
        }}
      >
        <div className="max-w-5xl mx-auto text-center text-white">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-10 h-10" />
            <h1 className="text-3xl md:text-4xl font-bold">
              Loan Eligibility Checker
            </h1>
          </div>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            Check your loan eligibility instantly without submitting a full
            application. Get your estimated CIBIL score and personalized
            recommendations.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 py-10 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5" style={{ color: "hsl(var(--credit-lens-primary))" }} />
                  Enter Your Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Employment Status */}
                  <div className="space-y-2">
                    <Label htmlFor="employmentStatus">Employment Status</Label>
                    <Select
                      value={employmentStatus}
                      onValueChange={setEmploymentStatus}
                    >
                      <SelectTrigger id="employmentStatus">
                        <SelectValue placeholder="Select employment status" />
                      </SelectTrigger>
                      <SelectContent>
                        {EMPLOYMENT_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Annual Income */}
                  <div className="space-y-2">
                    <Label htmlFor="annualIncome">
                      Annual Income Band (in Lakhs)
                    </Label>
                    <Select
                      value={annualIncome}
                      onValueChange={setAnnualIncome}
                    >
                      <SelectTrigger id="annualIncome">
                        <SelectValue placeholder="Select income band" />
                      </SelectTrigger>
                      <SelectContent>
                        {INCOME_BANDS.map((band) => (
                          <SelectItem key={band.value} value={band.value}>
                            {band.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Loan Type */}
                  <div className="space-y-2">
                    <Label htmlFor="loanType">Loan Type</Label>
                    <Select value={loanType} onValueChange={setLoanType}>
                      <SelectTrigger id="loanType">
                        <SelectValue placeholder="Select loan type" />
                      </SelectTrigger>
                      <SelectContent>
                        {LOAN_TYPES.map((lt) => (
                          <SelectItem key={lt.value} value={lt.value}>
                            {lt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Loan Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="loanAmount">Loan Amount (INR)</Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="loanAmount"
                        type="number"
                        placeholder="e.g. 2500000"
                        className="pl-9"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(e.target.value)}
                        min={0}
                      />
                    </div>
                    {loanAmount && Number(loanAmount) > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(Number(loanAmount))}
                      </p>
                    )}
                  </div>

                  {/* Loan Purpose */}
                  <div className="space-y-2">
                    <Label htmlFor="loanPurpose">Loan Purpose</Label>
                    <Input
                      id="loanPurpose"
                      type="text"
                      placeholder="e.g. Purchase of residential property"
                      value={loanPurpose}
                      onChange={(e) => setLoanPurpose(e.target.value)}
                    />
                  </div>

                  {/* Age */}
                  <div className="space-y-2">
                    <Label htmlFor="age">Age (years)</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="e.g. 30"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      min={18}
                      max={100}
                    />
                  </div>

                  {/* Down Payment */}
                  <div className="space-y-2">
                    <Label htmlFor="downPayment">Down Payment (INR)</Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="downPayment"
                        type="number"
                        placeholder="e.g. 500000"
                        className="pl-9"
                        value={downPayment}
                        onChange={(e) => setDownPayment(e.target.value)}
                        min={0}
                      />
                    </div>
                    {downPayment && Number(downPayment) > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(Number(downPayment))}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    className="w-full"
                    style={{
                      backgroundColor: "hsl(var(--credit-lens-primary))",
                    }}
                    disabled={!isFormValid || loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Checking Eligibility...
                      </>
                    ) : (
                      <>
                        <Target className="w-4 h-4 mr-2" />
                        Check Eligibility
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Results */}
          <div className="space-y-6">
            {!result && !loading && !error && (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <BarChart3
                    className="w-16 h-16 mb-4"
                    style={{ color: "hsl(var(--credit-lens-primary))", opacity: 0.4 }}
                  />
                  <h3 className="text-lg font-semibold mb-2">
                    Your Results Will Appear Here
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Fill in the form and click "Check Eligibility" to see your
                    estimated CIBIL score, eligibility status, and personalized
                    recommendations.
                  </p>
                </CardContent>
              </Card>
            )}

            {loading && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Loader2
                    className="w-12 h-12 animate-spin mb-4"
                    style={{ color: "hsl(var(--credit-lens-primary))" }}
                  />
                  <p className="text-muted-foreground">
                    Analyzing your eligibility...
                  </p>
                </CardContent>
              </Card>
            )}

            {error && (
              <Card className="border-red-300">
                <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                  <AlertTriangle className="w-10 h-10 text-red-500 mb-3" />
                  <h3 className="text-lg font-semibold text-red-600 mb-1">
                    Something went wrong
                  </h3>
                  <p className="text-sm text-muted-foreground">{error}</p>
                </CardContent>
              </Card>
            )}

            {result && (
              <>
                {/* CIBIL Score */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Shield className="w-5 h-5" style={{ color: "hsl(var(--credit-lens-primary))" }} />
                      Estimated CIBIL Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScoreGauge score={result.score} />
                  </CardContent>
                </Card>

                {/* Overall Verdict */}
                <Card
                  className={
                    result.eligible
                      ? "border-green-300 bg-green-50/50 dark:bg-green-950/20"
                      : "border-red-300 bg-red-50/50 dark:bg-red-950/20"
                  }
                >
                  <CardContent className="flex items-start gap-4 py-5">
                    {result.eligible ? (
                      <CheckCircle className="w-8 h-8 text-green-500 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-8 h-8 text-red-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h3
                        className={`text-lg font-bold ${
                          result.eligible ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"
                        }`}
                      >
                        {result.eligible ? "Eligible" : "Not Eligible"}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {result.overallResult}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Score Breakdown */}
                {result.breakdown &&
                  Object.keys(result.breakdown).length > 0 && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <BarChart3 className="w-5 h-5" style={{ color: "hsl(var(--credit-lens-primary))" }} />
                          Score Breakdown
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {Object.entries(result.breakdown).map(
                          ([factor, value]) => (
                            <div key={factor}>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="capitalize">
                                  {factor.replace(/([A-Z])/g, " $1").replace(/_/g, " ")}
                                </span>
                                <span className="font-medium">{value}%</span>
                              </div>
                              <Progress
                                value={value}
                                className="h-2"
                              />
                            </div>
                          )
                        )}
                      </CardContent>
                    </Card>
                  )}

                {/* Rule Evaluation */}
                {result.rules && result.rules.length > 0 && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <FileCheck className="w-5 h-5" style={{ color: "hsl(var(--credit-lens-primary))" }} />
                        Eligibility Rules
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {result.rules.map((rule, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-3 text-sm"
                          >
                            {rule.passed ? (
                              <Badge
                                variant="default"
                                className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 shrink-0"
                              >
                                Pass
                              </Badge>
                            ) : (
                              <Badge
                                variant="destructive"
                                className="shrink-0"
                              >
                                Fail
                              </Badge>
                            )}
                            <div>
                              <span className="font-medium">{rule.rule}</span>
                              {rule.reason && (
                                <p className="text-muted-foreground mt-0.5">
                                  {rule.reason}
                                </p>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Improvement Actions */}
                {!result.eligible &&
                  result.improvementActions &&
                  result.improvementActions.length > 0 && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <TrendingUp className="w-5 h-5 text-yellow-500" />
                          How to Improve Your Eligibility
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {result.improvementActions.map((action, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-sm"
                            >
                              <ArrowRight className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                {/* Alternate Suggestions */}
                {!result.eligible &&
                  result.alternateSuggestions &&
                  result.alternateSuggestions.length > 0 && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Lightbulb className="w-5 h-5 text-blue-500" />
                          Alternate Loan Suggestions
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {result.alternateSuggestions.map(
                            (suggestion, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2 text-sm"
                              >
                                <ArrowRight className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "hsl(var(--credit-lens-primary))" }} />
                                <span>{suggestion}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
