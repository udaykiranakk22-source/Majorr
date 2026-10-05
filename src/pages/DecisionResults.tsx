import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Shield,
  Target,
  ArrowRight,
  Info,
  Scale,
  Loader2,
  Clock,
  FileText,
  IndianRupee,
  Building2,
  CalendarDays,
  User,
  Briefcase,
  ChevronRight,
} from "lucide-react";

const API_BASE = "http://localhost:3000";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value);

// --- Types ---

interface RuleResult {
  rule: string;
  passed: boolean;
  reason?: string;
  description?: string;
  actualValue?: string | number;
  threshold?: string | number;
}

interface ScoreBreakdown {
  [factor: string]: number;
}

interface ImprovementAction {
  action: string;
  impact?: string;
  timeline?: string;
  priority?: "High" | "Medium" | "Low";
}

interface AlternateSuggestion {
  loanType: string;
  suggestedAmount?: number;
  reason: string;
}

interface Application {
  id: string;
  applicantName?: string;
  loanType?: string;
  loanAmount?: number;
  tenure?: number;
  dateSubmitted?: string;
  employmentStatus?: string;
  annualIncome?: number;
}

interface Decision {
  score: number;
  breakdown: ScoreBreakdown;
  rules: RuleResult[];
  overallResult: string; // "approved" | "rejected" | "pending"
  improvementActions?: (string | ImprovementAction)[];
  alternateSuggestions?: (string | AlternateSuggestion)[];
  engineVersion?: string;
  confidence?: number;
}

interface DecisionResponse {
  application: Application;
  decision: Decision;
}

// --- Score helpers ---

function getScoreColor(score: number): string {
  if (score >= 750) return "text-green-600";
  if (score >= 650) return "text-yellow-600";
  if (score >= 500) return "text-orange-500";
  return "text-red-600";
}

function getScoreRingColor(score: number): string {
  if (score >= 750) return "stroke-green-500";
  if (score >= 650) return "stroke-yellow-500";
  if (score >= 500) return "stroke-orange-500";
  return "stroke-red-500";
}

function getScoreBgClass(score: number): string {
  if (score >= 750) return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
  if (score >= 650) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
  if (score >= 500) return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
  return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
}

function getScoreLabel(score: number): string {
  if (score >= 750) return "Excellent";
  if (score >= 700) return "Good";
  if (score >= 650) return "Fair";
  if (score >= 500) return "Below Average";
  return "Poor";
}

function getProgressColor(score: number): string {
  if (score >= 750) return "bg-green-500";
  if (score >= 650) return "bg-yellow-500";
  if (score >= 500) return "bg-orange-500";
  return "bg-red-500";
}

// --- Score Gauge ---

function ScoreGauge({ score }: { score: number }) {
  const normalized = Math.max(0, Math.min(100, ((score - 300) / 600) * 100));
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const arcFraction = 0.75;
  const arcLength = circumference * arcFraction;
  const strokeDashoffset = arcLength - (normalized / 100) * arcLength;
  const ringColor = getScoreRingColor(score);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-52 h-52">
        <svg viewBox="0 0 160 160" className="w-full h-full -rotate-[135deg]">
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="currentColor"
            className="text-gray-200 dark:text-gray-700"
            strokeWidth="12"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            className={ringColor}
            strokeWidth="12"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-bold ${getScoreColor(score)}`}>{score}</span>
          <span className="text-sm text-muted-foreground mt-1">out of 900</span>
        </div>
      </div>
      <Badge className={`mt-2 ${getScoreBgClass(score)} border-0`}>
        {getScoreLabel(score)}
      </Badge>
    </div>
  );
}

// --- Priority badge ---

function PriorityBadge({ priority }: { priority?: string }) {
  if (!priority) return null;
  const map: Record<string, string> = {
    High: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    Low: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  };
  return (
    <Badge className={`${map[priority] || "bg-gray-100 text-gray-800"} border-0 text-xs`}>
      {priority} Priority
    </Badge>
  );
}

// --- Verdict helpers ---

function getVerdictGradient(result: string) {
  switch (result.toLowerCase()) {
    case "approved":
      return "from-green-600 to-emerald-700";
    case "rejected":
      return "from-red-600 to-rose-700";
    default:
      return "from-yellow-500 to-amber-600";
  }
}

function getVerdictIcon(result: string) {
  switch (result.toLowerCase()) {
    case "approved":
      return <CheckCircle2 className="h-16 w-16 text-white" />;
    case "rejected":
      return <XCircle className="h-16 w-16 text-white" />;
    default:
      return <AlertTriangle className="h-16 w-16 text-white" />;
  }
}

function getVerdictText(result: string) {
  switch (result.toLowerCase()) {
    case "approved":
      return "Loan Approved!";
    case "rejected":
      return "Loan Not Approved";
    default:
      return "Application Under Review";
  }
}

// --- Main Component ---

const DecisionResults = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<DecisionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchDecision = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/loan-decision/${id}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError("Application not found. Please check the application ID and try again.");
          } else {
            setError("Failed to load decision results. Please try again later.");
          }
          return;
        }
        const json: DecisionResponse = await res.json();
        setData(json);
      } catch {
        setError("Unable to connect to the server. Please check your connection and try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDecision();
  }, [id]);

  // --- No ID state ---
  if (!id) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-20">
          <Card className="max-w-md w-full text-center">
            <CardHeader>
              <div className="mx-auto mb-4 p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 w-fit">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle>No Application Selected</CardTitle>
              <CardDescription>
                To view your loan decision results, please submit a loan application first.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => navigate("/eligibility-checker")}
              >
                Check Loan Eligibility
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // --- Loading state ---
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            <p className="text-lg text-muted-foreground">Loading decision results...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // --- Error state ---
  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-20">
          <Card className="max-w-md w-full text-center">
            <CardHeader>
              <div className="mx-auto mb-4 p-3 rounded-full bg-red-100 dark:bg-red-900/30 w-fit">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle>Something Went Wrong</CardTitle>
              <CardDescription>
                {error || "An unexpected error occurred."}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
              <Button variant="outline" onClick={() => navigate("/eligibility-checker")}>
                Back to Eligibility Checker
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const { application, decision } = data;
  const isApproved = decision.overallResult.toLowerCase() === "approved";
  const isRejected = decision.overallResult.toLowerCase() === "rejected";
  const failedRules = decision.rules.filter((r) => !r.passed);
  const passedRules = decision.rules.filter((r) => r.passed);

  // Normalize improvement actions
  const improvementActions: ImprovementAction[] = (decision.improvementActions || []).map((a) =>
    typeof a === "string" ? { action: a } : a
  );

  // Normalize alternate suggestions
  const alternateSuggestions: AlternateSuggestion[] = (decision.alternateSuggestions || []).map(
    (s) => (typeof s === "string" ? { loanType: s, reason: s } : s)
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <Header />

      {/* Hero Section */}
      <section
        className={`bg-gradient-to-r ${getVerdictGradient(decision.overallResult)} text-white`}
      >
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <div className="flex justify-center mb-6">{getVerdictIcon(decision.overallResult)}</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            {getVerdictText(decision.overallResult)}
          </h1>
          <p className="text-lg opacity-90 max-w-xl mx-auto">
            {isApproved
              ? "Congratulations! Your loan application has been approved based on your credit profile."
              : isRejected
                ? "Unfortunately, your application did not meet the required criteria at this time."
                : "Your application is being reviewed. We will notify you once the assessment is complete."}
          </p>
          {application.id && (
            <p className="mt-4 text-sm opacity-75">Application ID: {application.id}</p>
          )}
        </div>
      </section>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-10 space-y-8">
        {/* Application Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Application Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {application.applicantName && (
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Applicant</p>
                    <p className="font-medium">{application.applicantName}</p>
                  </div>
                </div>
              )}
              {application.loanType && (
                <div className="flex items-start gap-3">
                  <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Loan Type</p>
                    <p className="font-medium">{application.loanType}</p>
                  </div>
                </div>
              )}
              {application.loanAmount != null && (
                <div className="flex items-start gap-3">
                  <IndianRupee className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Loan Amount</p>
                    <p className="font-medium">{formatCurrency(application.loanAmount)}</p>
                  </div>
                </div>
              )}
              {application.tenure != null && (
                <div className="flex items-start gap-3">
                  <CalendarDays className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Tenure</p>
                    <p className="font-medium">{application.tenure} months</p>
                  </div>
                </div>
              )}
              {application.id && (
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Application ID</p>
                    <p className="font-medium font-mono text-sm">{application.id}</p>
                  </div>
                </div>
              )}
              {application.dateSubmitted && (
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date Submitted</p>
                    <p className="font-medium">
                      {new Date(application.dateSubmitted).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* CIBIL Score Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              CIBIL Score Analysis
            </CardTitle>
            <CardDescription>
              Your credit score and the factors that contributed to it
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Score gauge */}
              <div className="flex flex-col items-center justify-center">
                <ScoreGauge score={decision.score} />
                {decision.confidence != null && (
                  <p className="text-sm text-muted-foreground mt-4">
                    Confidence: {Math.round(decision.confidence * 100)}%
                  </p>
                )}
              </div>

              {/* Score breakdown */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Score Breakdown
                </h3>
                {Object.entries(decision.breakdown).map(([factor, value]) => {
                  const absValue = Math.abs(value);
                  const maxContribution = 200;
                  const pct = Math.min(100, (absValue / maxContribution) * 100);
                  const isPositive = value >= 0;
                  return (
                    <div key={factor} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize">
                          {factor.replace(/([A-Z])/g, " $1").replace(/_/g, " ")}
                        </span>
                        <span
                          className={
                            isPositive
                              ? "text-green-600 font-medium"
                              : "text-red-600 font-medium"
                          }
                        >
                          {isPositive ? "+" : ""}
                          {value}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            isPositive ? "bg-green-500" : "bg-red-500"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rule Evaluation Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-blue-600" />
              Rule Evaluation
            </CardTitle>
            <CardDescription>
              {passedRules.length} of {decision.rules.length} rules passed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Progress
                value={(passedRules.length / Math.max(decision.rules.length, 1)) * 100}
                className="h-2"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {decision.rules.map((rule, idx) => (
                <Card
                  key={idx}
                  className={`border ${
                    rule.passed
                      ? "border-green-200 dark:border-green-800/50"
                      : "border-red-200 dark:border-red-800/50"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {rule.passed ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                          )}
                          <h4 className="font-semibold text-sm truncate">{rule.rule}</h4>
                        </div>
                        {rule.description && (
                          <p className="text-sm text-muted-foreground ml-7 mb-2">
                            {rule.description}
                          </p>
                        )}
                        {rule.reason && (
                          <p className="text-sm text-muted-foreground ml-7">{rule.reason}</p>
                        )}
                        {(rule.actualValue != null || rule.threshold != null) && (
                          <div className="ml-7 mt-2 flex flex-wrap gap-2">
                            {rule.actualValue != null && (
                              <Badge variant="outline" className="text-xs">
                                Actual: {rule.actualValue}
                              </Badge>
                            )}
                            {rule.threshold != null && (
                              <Badge variant="outline" className="text-xs">
                                Required: {rule.threshold}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                      <Badge
                        className={`flex-shrink-0 border-0 ${
                          rule.passed
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {rule.passed ? "Pass" : "Fail"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Rejected - Detailed Tabs */}
        {isRejected && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-600" />
                Understanding Your Decision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="why" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="why">Why Was I Rejected?</TabsTrigger>
                  <TabsTrigger value="improve">How to Improve</TabsTrigger>
                  <TabsTrigger value="alternatives">Alternative Options</TabsTrigger>
                </TabsList>

                {/* Why Rejected */}
                <TabsContent value="why" className="mt-6">
                  {failedRules.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No specific rule failures recorded.
                    </p>
                  ) : (
                    <Accordion type="single" collapsible className="w-full">
                      {failedRules.map((rule, idx) => (
                        <AccordionItem key={idx} value={`failed-${idx}`}>
                          <AccordionTrigger className="text-left">
                            <div className="flex items-center gap-2">
                              <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                              <span>{rule.rule}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="pl-6 space-y-3">
                              {rule.reason && <p className="text-muted-foreground">{rule.reason}</p>}
                              {rule.description && (
                                <p className="text-sm text-muted-foreground">{rule.description}</p>
                              )}
                              {(rule.actualValue != null || rule.threshold != null) && (
                                <div className="flex gap-4 flex-wrap">
                                  {rule.actualValue != null && (
                                    <div className="bg-red-50 dark:bg-red-950/30 rounded-lg px-4 py-2">
                                      <p className="text-xs text-muted-foreground">Your Value</p>
                                      <p className="font-semibold text-red-700 dark:text-red-400">
                                        {rule.actualValue}
                                      </p>
                                    </div>
                                  )}
                                  {rule.threshold != null && (
                                    <div className="bg-green-50 dark:bg-green-950/30 rounded-lg px-4 py-2">
                                      <p className="text-xs text-muted-foreground">Required</p>
                                      <p className="font-semibold text-green-700 dark:text-green-400">
                                        {rule.threshold}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </TabsContent>

                {/* How to Improve */}
                <TabsContent value="improve" className="mt-6">
                  {improvementActions.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No specific improvement actions available at this time.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {improvementActions.map((item, idx) => (
                        <Card key={idx} className="border-l-4 border-l-blue-500">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <TrendingUp className="h-4 w-4 text-blue-600 flex-shrink-0" />
                                  <h4 className="font-medium">{item.action}</h4>
                                </div>
                                <div className="flex flex-wrap gap-3 ml-6">
                                  {item.impact && (
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                      <Target className="h-3.5 w-3.5" />
                                      <span>Expected impact: {item.impact}</span>
                                    </div>
                                  )}
                                  {item.timeline && (
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                      <Clock className="h-3.5 w-3.5" />
                                      <span>Timeline: {item.timeline}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <PriorityBadge priority={item.priority} />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Alternative Options */}
                <TabsContent value="alternatives" className="mt-6">
                  {alternateSuggestions.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No alternative loan suggestions available.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {alternateSuggestions.map((alt, idx) => (
                        <Card key={idx}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Building2 className="h-5 w-5 text-blue-600 flex-shrink-0" />
                                  <h4 className="font-semibold">{alt.loanType}</h4>
                                </div>
                                {alt.suggestedAmount != null && (
                                  <p className="text-sm ml-7 mb-1">
                                    <span className="text-muted-foreground">Suggested Amount: </span>
                                    <span className="font-medium">
                                      {formatCurrency(alt.suggestedAmount)}
                                    </span>
                                  </p>
                                )}
                                <p className="text-sm text-muted-foreground ml-7">{alt.reason}</p>
                              </div>
                              <Button
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700 text-white flex-shrink-0"
                                onClick={() =>
                                  navigate("/eligibility-checker", {
                                    state: { loanType: alt.loanType, amount: alt.suggestedAmount },
                                  })
                                }
                              >
                                Apply for This
                                <ChevronRight className="ml-1 h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Approved - Next Steps */}
        {isApproved && (
          <>
            <Card className="border-green-200 dark:border-green-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <CheckCircle2 className="h-5 w-5" />
                  Next Steps
                </CardTitle>
                <CardDescription>
                  Complete the following to finalize your loan disbursement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "Submit Required Documents",
                      description:
                        "Upload identity proof, address proof, income documents, and property papers (if applicable) through the portal.",
                      icon: <FileText className="h-5 w-5 text-blue-600" />,
                    },
                    {
                      title: "Visit Your Nearest Branch",
                      description:
                        "Schedule an appointment at your nearest branch for document verification and loan agreement signing.",
                      icon: <Building2 className="h-5 w-5 text-blue-600" />,
                    },
                    {
                      title: "Loan Agreement & Disbursement",
                      description:
                        "After verification, the loan agreement will be shared. Upon signing, the loan amount will be disbursed to your account.",
                      icon: <IndianRupee className="h-5 w-5 text-blue-600" />,
                    },
                  ].map((step, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 rounded-lg bg-green-50/50 dark:bg-green-950/20">
                      <div className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm">
                        {step.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{step.title}</h4>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* EMI Breakdown Preview */}
            {application.loanAmount != null && application.tenure != null && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IndianRupee className="h-5 w-5 text-blue-600" />
                    EMI Estimate
                  </CardTitle>
                  <CardDescription>
                    Indicative EMI based on your approved loan parameters
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const principal = application.loanAmount!;
                    const months = application.tenure!;
                    const annualRate = 10.5; // Indicative rate
                    const monthlyRate = annualRate / 12 / 100;
                    const emi =
                      months > 0 && monthlyRate > 0
                        ? (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
                          (Math.pow(1 + monthlyRate, months) - 1)
                        : principal / Math.max(months, 1);
                    const totalPayable = emi * months;
                    const totalInterest = totalPayable - principal;

                    return (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                          <p className="text-sm text-muted-foreground mb-1">Monthly EMI</p>
                          <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                            {formatCurrency(Math.round(emi))}
                          </p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                          <p className="text-sm text-muted-foreground mb-1">Total Interest</p>
                          <p className="text-2xl font-bold">
                            {formatCurrency(Math.round(totalInterest))}
                          </p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                          <p className="text-sm text-muted-foreground mb-1">Total Payable</p>
                          <p className="text-2xl font-bold">
                            {formatCurrency(Math.round(totalPayable))}
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                  <p className="text-xs text-muted-foreground mt-4 text-center">
                    * Indicative rate of 10.5% p.a. Actual rate may vary based on final assessment.
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Decision Engine Transparency */}
        <Alert className="border-blue-200 dark:border-blue-800/50 bg-blue-50/50 dark:bg-blue-950/20">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800 dark:text-blue-300">
            Decision Transparency
          </AlertTitle>
          <AlertDescription className="text-blue-700/80 dark:text-blue-400/80">
            This decision was made by{" "}
            <span className="font-semibold">
              Credit Lens Decision Engine{" "}
              {decision.engineVersion ? `v${decision.engineVersion}` : "v1.0.0"}
            </span>
            . All decisions are rule-based, fully traceable, and comply with regulatory guidelines.
            No manual bias is involved in the assessment process.
          </AlertDescription>
        </Alert>

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-4 pb-4">
          <Button
            variant="outline"
            onClick={() => navigate("/eligibility-checker")}
          >
            <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
            New Application
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DecisionResults;
