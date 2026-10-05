import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  CheckCircle2,
  Target,
  TrendingUp,
  Clock,
  Shield,
  CreditCard,
  Calendar,
  Search,
  AlertTriangle,
  Info,
  Lightbulb,
  ArrowUpRight,
  ChevronRight,
  Zap,
} from "lucide-react";

interface ActionItem {
  id: string;
  title: string;
  impact: number;
  timeline: string;
  description: string;
}

interface ActionCategory {
  key: string;
  label: string;
  weight: string;
  icon: React.ReactNode;
  items: ActionItem[];
}

const ACTION_CATEGORIES: ActionCategory[] = [
  {
    key: "payment",
    label: "Payment History",
    weight: "35%",
    icon: <Clock className="h-4 w-4" />,
    items: [
      {
        id: "pay-emi-on-time",
        title: "Pay all EMIs on time",
        impact: 40,
        timeline: "3 months",
        description:
          "Payment history is the single most important factor in your CIBIL score. Even one missed EMI can drop your score by 50-100 points. Set calendar reminders for all EMI due dates and ensure sufficient balance in your account before the debit date.",
      },
      {
        id: "clear-overdue",
        title: "Clear overdue payments",
        impact: 50,
        timeline: "1 month",
        description:
          "Outstanding overdue payments are reported to CIBIL as Days Past Due (DPD). Clearing these immediately stops further negative reporting. Contact your lender to settle any overdue amounts and request an updated status report to CIBIL.",
      },
      {
        id: "setup-auto-debit",
        title: "Set up auto-debit for loan EMIs",
        impact: 15,
        timeline: "1 month",
        description:
          "Register for NACH (National Automated Clearing House) mandate or ECS (Electronic Clearing Service) for all your loan EMIs. This ensures payments are never missed due to forgetfulness. Most banks offer this through net banking or by visiting a branch.",
      },
      {
        id: "zero-dpd",
        title: "Maintain zero Days Past Due (DPD)",
        impact: 30,
        timeline: "6 months",
        description:
          "DPD is reported in your CIBIL report for each credit account. A consistent record of '000' (zero days past due) across all accounts for 6+ months significantly boosts your creditworthiness. Even a single DPD entry of 30+ days stays on your report for years.",
      },
    ],
  },
  {
    key: "utilization",
    label: "Credit Utilization",
    weight: "30%",
    icon: <CreditCard className="h-4 w-4" />,
    items: [
      {
        id: "utilization-below-30",
        title: "Keep credit utilization below 30%",
        impact: 35,
        timeline: "1 month",
        description:
          "Credit utilization ratio is calculated as your total outstanding balance divided by your total credit limit. For example, if your credit card limit is Rs. 1,00,000, try to keep your outstanding below Rs. 30,000. High utilization signals credit dependency to lenders.",
      },
      {
        id: "dont-max-cards",
        title: "Don't max out credit cards",
        impact: 25,
        timeline: "1 month",
        description:
          "Maxing out even one credit card can hurt your score, even if you pay the full bill. Lenders view this as a sign of financial stress. If you need to make a large purchase, consider splitting it across multiple cards or using a different payment method.",
      },
      {
        id: "request-limit-increase",
        title: "Request credit limit increase",
        impact: 20,
        timeline: "3 months",
        description:
          "A higher credit limit automatically lowers your utilization ratio without changing your spending. Contact your credit card issuer and request a limit enhancement. Most banks consider this after 6-12 months of good payment history. Note: this does not count as a new credit inquiry in most cases.",
      },
      {
        id: "distribute-spending",
        title: "Distribute spending across cards",
        impact: 10,
        timeline: "1 month",
        description:
          "If you hold multiple credit cards, spread your expenses across them rather than concentrating on one. This keeps individual utilization ratios low. For instance, instead of putting Rs. 40,000 on one card with a Rs. 50,000 limit, split it across two cards.",
      },
    ],
  },
  {
    key: "credit-age",
    label: "Credit Age",
    weight: "15%",
    icon: <Calendar className="h-4 w-4" />,
    items: [
      {
        id: "keep-oldest-account",
        title: "Keep oldest credit account open",
        impact: 20,
        timeline: "12 months",
        description:
          "The length of your credit history matters. Your oldest credit account demonstrates long-term creditworthiness. Even if you rarely use an old credit card, keep it active with a small recurring charge (like a mobile recharge) to prevent the bank from closing it due to inactivity.",
      },
      {
        id: "dont-close-old-cards",
        title: "Don't close old credit cards",
        impact: 15,
        timeline: "6 months",
        description:
          "Closing old credit cards reduces your average credit age and total available credit limit (which increases utilization ratio). If a card has an annual fee you want to avoid, ask the bank to downgrade to a no-fee variant rather than closing the account entirely.",
      },
      {
        id: "limit-new-applications",
        title: "Limit new credit applications",
        impact: 10,
        timeline: "6 months",
        description:
          "Each new credit account reduces your average credit age. Only apply for new credit when genuinely needed. If you opened multiple accounts recently, wait at least 12 months before applying for another one to let your average credit age recover.",
      },
    ],
  },
  {
    key: "credit-mix",
    label: "Credit Mix",
    weight: "10%",
    icon: <Shield className="h-4 w-4" />,
    items: [
      {
        id: "secured-unsecured-mix",
        title: "Maintain mix of secured and unsecured loans",
        impact: 15,
        timeline: "12 months",
        description:
          "CIBIL prefers borrowers who have experience managing different types of credit. Secured loans (home loan, car loan, gold loan) and unsecured loans (personal loan, credit card) demonstrate diverse credit management ability. However, don't take unnecessary loans just for mix - only borrow what you need.",
      },
      {
        id: "revolving-installment",
        title: "Have both revolving and installment credit",
        impact: 10,
        timeline: "12 months",
        description:
          "Revolving credit (credit cards) and installment credit (home loan, car loan EMIs) are treated differently. Having both types with a clean payment record shows lenders you can manage different repayment structures. Credit cards are the easiest form of revolving credit to maintain.",
      },
    ],
  },
  {
    key: "inquiries",
    label: "Credit Inquiries",
    weight: "10%",
    icon: <Search className="h-4 w-4" />,
    items: [
      {
        id: "limit-hard-inquiries",
        title: "Limit hard inquiries",
        impact: 10,
        timeline: "6 months",
        description:
          "Every time you apply for a loan or credit card, the lender makes a 'hard inquiry' on your CIBIL report. Multiple hard inquiries in a short period signal desperation for credit. Each hard inquiry can reduce your score by 5-10 points and stays on your report for 2 years.",
      },
      {
        id: "space-applications",
        title: "Space out loan applications (6+ months apart)",
        impact: 15,
        timeline: "6 months",
        description:
          "If you need to apply for multiple loans (e.g., a home loan and a car loan), space them at least 6 months apart. This prevents multiple inquiries from appearing in a short window. Research and compare offers online before submitting formal applications.",
      },
      {
        id: "pre-approved-offers",
        title: "Use pre-approved offers when available",
        impact: 5,
        timeline: "3 months",
        description:
          "Pre-approved loan and credit card offers from your existing bank typically involve a 'soft inquiry' that doesn't affect your CIBIL score. Check your net banking or mobile banking app for pre-approved offers before shopping around. These offers are based on your existing relationship and transaction history.",
      },
    ],
  },
];

const SCORE_BANDS = [
  { label: "Poor", min: 300, max: 499, color: "#ef4444", bg: "bg-red-100 text-red-800" },
  { label: "Fair", min: 500, max: 649, color: "#f59e0b", bg: "bg-amber-100 text-amber-800" },
  { label: "Good", min: 650, max: 749, color: "#3b82f6", bg: "bg-blue-100 text-blue-800" },
  { label: "Excellent", min: 750, max: 900, color: "#22c55e", bg: "bg-green-100 text-green-800" },
];

function getScoreBand(score: number) {
  return SCORE_BANDS.find((b) => score >= b.min && score <= b.max) || SCORE_BANDS[0];
}

function ScoreGauge({ score }: { score: number }) {
  const clampedScore = Math.max(300, Math.min(900, score));
  const percentage = ((clampedScore - 300) / 600) * 100;
  const band = getScoreBand(clampedScore);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Gauge */}
      <div className="relative w-64 h-36">
        <svg viewBox="0 0 200 110" className="w-full h-full">
          {/* Background arc segments */}
          {SCORE_BANDS.map((b, i) => {
            const startAngle = 180 + ((b.min - 300) / 600) * 180;
            const endAngle = 180 + ((b.max - 300) / 600) * 180;
            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;
            const r = 80;
            const cx = 100;
            const cy = 100;
            return (
              <path
                key={i}
                d={`M ${cx + r * Math.cos(startRad)} ${cy + r * Math.sin(startRad)} A ${r} ${r} 0 0 1 ${cx + r * Math.cos(endRad)} ${cy + r * Math.sin(endRad)}`}
                fill="none"
                stroke={b.color}
                strokeWidth="14"
                strokeLinecap="round"
                opacity={0.25}
              />
            );
          })}
          {/* Active arc up to current score */}
          {(() => {
            const startAngle = 180;
            const endAngle = 180 + (percentage / 100) * 180;
            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;
            const r = 80;
            const cx = 100;
            const cy = 100;
            const largeArc = endAngle - startAngle > 180 ? 1 : 0;
            return (
              <path
                d={`M ${cx + r * Math.cos(startRad)} ${cy + r * Math.sin(startRad)} A ${r} ${r} 0 ${largeArc} 1 ${cx + r * Math.cos(endRad)} ${cy + r * Math.sin(endRad)}`}
                fill="none"
                stroke={band.color}
                strokeWidth="14"
                strokeLinecap="round"
              />
            );
          })()}
          {/* Needle */}
          {(() => {
            const angle = 180 + (percentage / 100) * 180;
            const rad = (angle * Math.PI) / 180;
            const r = 60;
            const cx = 100;
            const cy = 100;
            return (
              <line
                x1={cx}
                y1={cy}
                x2={cx + r * Math.cos(rad)}
                y2={cy + r * Math.sin(rad)}
                stroke={band.color}
                strokeWidth="3"
                strokeLinecap="round"
              />
            );
          })()}
          {/* Center dot */}
          <circle cx="100" cy="100" r="5" fill={band.color} />
          {/* Score text */}
          <text x="100" y="88" textAnchor="middle" className="text-2xl font-bold" fill={band.color} fontSize="24">
            {clampedScore}
          </text>
        </svg>
      </div>
      {/* Band labels */}
      <div className="flex gap-3 flex-wrap justify-center">
        {SCORE_BANDS.map((b) => (
          <Badge
            key={b.label}
            variant={clampedScore >= b.min && clampedScore <= b.max ? "default" : "outline"}
            className={clampedScore >= b.min && clampedScore <= b.max ? b.bg : ""}
          >
            {b.label} ({b.min}-{b.max})
          </Badge>
        ))}
      </div>
    </div>
  );
}

const INDIAN_TIPS = [
  {
    title: "Check CIBIL report annually for free",
    description:
      "Every Indian citizen is entitled to one free CIBIL report per year from cibil.com. Review it carefully for any errors in personal details, account information, or payment history. Regular monitoring helps you catch issues early.",
    icon: <Search className="h-5 w-5 text-blue-600" />,
  },
  {
    title: "Dispute errors on your CIBIL report",
    description:
      "If you find incorrect information on your CIBIL report (wrong account, incorrect payment status, identity mismatch), raise a dispute online at cibil.com. The bureau is required to investigate within 30 days. Correcting errors can instantly improve your score.",
    icon: <AlertTriangle className="h-5 w-5 text-amber-600" />,
  },
  {
    title: "Avoid being a guarantor for risky borrowers",
    description:
      "When you sign as a guarantor for someone's loan, their defaults and late payments can appear on YOUR CIBIL report. Only guarantee loans for people whose financial discipline you trust completely. If the borrower defaults, you are equally liable.",
    icon: <Shield className="h-5 w-5 text-red-600" />,
  },
  {
    title: "Maintain a CIBIL score above 750 for best rates",
    description:
      "Most Indian banks and NBFCs offer the lowest interest rates to borrowers with a CIBIL score of 750 or above. A score above 750 can save you lakhs in interest over the life of a home loan. Some premium credit cards also require a 750+ score for approval.",
    icon: <TrendingUp className="h-5 w-5 text-green-600" />,
  },
];

export default function ScoreImprovement() {
  const [currentScore, setCurrentScore] = useState(680);
  const [scoreInput, setScoreInput] = useState("680");
  const [targetScore, setTargetScore] = useState("750");
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());

  const allActions = useMemo(() => ACTION_CATEGORIES.flatMap((c) => c.items), []);

  const estimatedNewScore = useMemo(() => {
    let bonus = 0;
    for (const action of allActions) {
      if (completedActions.has(action.id)) {
        bonus += action.impact;
      }
    }
    // Diminishing returns: you can't just add up all points linearly to 900
    const raw = currentScore + bonus;
    return Math.min(900, raw);
  }, [currentScore, completedActions, allActions]);

  const targetScoreNum = parseInt(targetScore, 10) || 750;

  const progressTowardTarget = useMemo(() => {
    if (targetScoreNum <= currentScore) return 100;
    const needed = targetScoreNum - currentScore;
    const gained = estimatedNewScore - currentScore;
    return Math.min(100, Math.round((gained / needed) * 100));
  }, [currentScore, estimatedNewScore, targetScoreNum]);

  const completedCount = completedActions.size;
  const totalActions = allActions.length;

  function handleScoreUpdate() {
    const parsed = parseInt(scoreInput, 10);
    if (parsed >= 300 && parsed <= 900) {
      setCurrentScore(parsed);
    }
  }

  function toggleAction(id: string) {
    setCompletedActions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  const estimatedBand = getScoreBand(estimatedNewScore);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 text-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Target className="h-8 w-8" />
            <h1 className="text-3xl md:text-4xl font-bold">CIBIL Score Improvement Tracker</h1>
          </div>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Take control of your creditworthiness. Follow actionable steps to improve your CIBIL
            score and unlock better loan rates, higher credit limits, and faster approvals.
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-10 space-y-10">
        {/* Score Overview */}
        <section className="grid md:grid-cols-2 gap-6">
          {/* Score Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <TrendingUp className="h-5 w-5" />
                Your Current Score
              </CardTitle>
              <CardDescription>
                Enter your CIBIL score or use the default simulated score
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="score-input">CIBIL Score (300-900)</Label>
                  <Input
                    id="score-input"
                    type="number"
                    min={300}
                    max={900}
                    value={scoreInput}
                    onChange={(e) => setScoreInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleScoreUpdate()}
                    placeholder="Enter your score"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleScoreUpdate} className="bg-blue-600 hover:bg-blue-700">
                    Update
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="target-score">Target Score</Label>
                <Select value={targetScore} onValueChange={setTargetScore}>
                  <SelectTrigger id="target-score">
                    <SelectValue placeholder="Select target" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="650">650 (Good)</SelectItem>
                    <SelectItem value="700">700 (Good)</SelectItem>
                    <SelectItem value="750">750 (Excellent)</SelectItem>
                    <SelectItem value="800">800 (Excellent)</SelectItem>
                    <SelectItem value="850">850 (Excellent)</SelectItem>
                    <SelectItem value="900">900 (Excellent)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-2 border-t">
                <p className="text-sm text-gray-500 mb-1">Current Band</p>
                <Badge className={getScoreBand(currentScore).bg}>
                  {getScoreBand(currentScore).label}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Visual Gauge */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Zap className="h-5 w-5" />
                Score Gauge
              </CardTitle>
              <CardDescription>
                Visual representation of your current CIBIL score
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ScoreGauge score={currentScore} />
            </CardContent>
          </Card>
        </section>

        {/* Progress Tracker */}
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <CheckCircle2 className="h-5 w-5" />
              Progress Tracker
            </CardTitle>
            <CardDescription>
              Track your improvement actions and estimated score impact
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Actions Completed</p>
                <p className="text-3xl font-bold text-blue-700">
                  {completedCount}
                  <span className="text-lg text-gray-400">/{totalActions}</span>
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Estimated New Score</p>
                <p className="text-3xl font-bold" style={{ color: estimatedBand.color }}>
                  {estimatedNewScore}
                </p>
                {estimatedNewScore > currentScore && (
                  <p className="text-sm text-green-600 flex items-center justify-center gap-1">
                    <ArrowUpRight className="h-3 w-3" />+{estimatedNewScore - currentScore} points
                  </p>
                )}
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Target Score</p>
                <p className="text-3xl font-bold text-gray-700">{targetScoreNum}</p>
                <Badge className={getScoreBand(targetScoreNum).bg}>
                  {getScoreBand(targetScoreNum).label}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progress toward target</span>
                <span className="font-medium text-blue-700">{progressTowardTarget}%</span>
              </div>
              <Progress value={progressTowardTarget} className="h-3" />
              {progressTowardTarget >= 100 && (
                <p className="text-sm text-green-600 font-medium flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" />
                  Your estimated score meets or exceeds your target!
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Improvement Actions Tabs */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-blue-600" />
            Improvement Actions
          </h2>
          <p className="text-gray-600 mb-6">
            Complete these actions to improve your CIBIL score. Check off items as you complete them
            to see your estimated score improve.
          </p>

          <Tabs defaultValue="payment" className="w-full">
            <TabsList className="flex flex-wrap h-auto gap-1 bg-blue-50 p-1">
              {ACTION_CATEGORIES.map((cat) => (
                <TabsTrigger
                  key={cat.key}
                  value={cat.key}
                  className="flex items-center gap-1.5 text-xs sm:text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  {cat.icon}
                  <span className="hidden sm:inline">{cat.label}</span>
                  <span className="sm:hidden">{cat.label.split(" ")[0]}</span>
                  <Badge variant="outline" className="ml-1 text-[10px] px-1.5 py-0">
                    {cat.weight}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>

            {ACTION_CATEGORIES.map((cat) => (
              <TabsContent key={cat.key} value={cat.key}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-700">
                      {cat.icon}
                      {cat.label}
                    </CardTitle>
                    <CardDescription>
                      This factor accounts for {cat.weight} of your CIBIL score calculation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="multiple" className="space-y-2">
                      {cat.items.map((action) => {
                        const isCompleted = completedActions.has(action.id);
                        return (
                          <AccordionItem
                            key={action.id}
                            value={action.id}
                            className={`border rounded-lg px-4 ${isCompleted ? "bg-green-50 border-green-200" : "bg-white"}`}
                          >
                            <div className="flex items-center gap-3 py-3">
                              <Checkbox
                                id={action.id}
                                checked={isCompleted}
                                onCheckedChange={() => toggleAction(action.id)}
                                className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                              />
                              <div className="flex-1 min-w-0">
                                <label
                                  htmlFor={action.id}
                                  className={`font-medium cursor-pointer ${isCompleted ? "line-through text-gray-400" : "text-gray-900"}`}
                                >
                                  {action.title}
                                </label>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  <Badge
                                    variant="outline"
                                    className="text-green-700 border-green-300 bg-green-50 text-xs"
                                  >
                                    <ArrowUpRight className="h-3 w-3 mr-0.5" />+{action.impact} pts
                                  </Badge>
                                  <Badge variant="outline" className="text-blue-700 border-blue-300 bg-blue-50 text-xs">
                                    <Clock className="h-3 w-3 mr-0.5" />
                                    {action.timeline}
                                  </Badge>
                                </div>
                              </div>
                              <AccordionTrigger className="py-0 hover:no-underline">
                                <span className="sr-only">Details</span>
                              </AccordionTrigger>
                            </div>
                            <AccordionContent className="pb-4 pt-0 pl-9 text-gray-600 text-sm leading-relaxed">
                              {action.description}
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </section>

        {/* Indian CIBIL Tips */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Info className="h-6 w-6 text-blue-600" />
            CIBIL Tips for Indian Borrowers
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {INDIAN_TIPS.map((tip, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    {tip.icon}
                    {tip.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 leading-relaxed">{tip.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Disclaimer */}
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="py-4">
            <p className="text-sm text-amber-800 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                <strong>Disclaimer:</strong> The score improvement estimates shown here are
                approximations based on general CIBIL scoring factors. Actual score changes depend on
                your complete credit profile, existing accounts, and the specific actions taken. For
                the most accurate information, check your official CIBIL report at{" "}
                <a
                  href="https://www.cibil.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-medium"
                >
                  cibil.com
                </a>
                .
              </span>
            </p>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
