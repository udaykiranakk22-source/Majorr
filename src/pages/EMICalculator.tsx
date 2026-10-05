import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Calculator,
  IndianRupee,
  Clock,
  PieChart,
  TrendingUp,
  Home,
  GraduationCap,
  Car,
  Briefcase,
  Gem,
  Building2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from "lucide-react";

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const formatCompact = (value: number): string => {
  if (value >= 10000000) return `${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `${(value / 100000).toFixed(2)} L`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)} K`;
  return value.toString();
};

interface LoanPreset {
  label: string;
  rate: number;
  icon: React.ReactNode;
  color: string;
  defaultPrincipal: number;
  defaultTenure: number;
}

const LOAN_PRESETS: LoanPreset[] = [
  { label: "Home Loan", rate: 8.5, icon: <Home className="w-5 h-5" />, color: "bg-blue-100 text-blue-700", defaultPrincipal: 5000000, defaultTenure: 240 },
  { label: "Education Loan", rate: 10.5, icon: <GraduationCap className="w-5 h-5" />, color: "bg-purple-100 text-purple-700", defaultPrincipal: 1000000, defaultTenure: 60 },
  { label: "Vehicle Loan", rate: 9.5, icon: <Car className="w-5 h-5" />, color: "bg-green-100 text-green-700", defaultPrincipal: 800000, defaultTenure: 60 },
  { label: "Personal Loan", rate: 14, icon: <Briefcase className="w-5 h-5" />, color: "bg-orange-100 text-orange-700", defaultPrincipal: 500000, defaultTenure: 36 },
  { label: "Gold Loan", rate: 7.5, icon: <Gem className="w-5 h-5" />, color: "bg-yellow-100 text-yellow-700", defaultPrincipal: 300000, defaultTenure: 24 },
  { label: "Business Loan", rate: 12, icon: <Building2 className="w-5 h-5" />, color: "bg-red-100 text-red-700", defaultPrincipal: 2000000, defaultTenure: 60 },
];

interface AmortizationRow {
  month: number;
  emi: number;
  principalComponent: number;
  interestComponent: number;
  outstandingBalance: number;
}

const EMICalculator = () => {
  const [principal, setPrincipal] = useState(2500000);
  const [annualRate, setAnnualRate] = useState(8.5);
  const [tenureMonths, setTenureMonths] = useState(120);
  const [showAllRows, setShowAllRows] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>("Home Loan");

  const emiResult = useMemo(() => {
    const P = principal;
    const r = annualRate / 12 / 100;
    const n = tenureMonths;

    if (P <= 0 || r <= 0 || n <= 0) {
      return { emi: 0, totalPayment: 0, totalInterest: 0 };
    }

    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    return { emi, totalPayment, totalInterest };
  }, [principal, annualRate, tenureMonths]);

  const amortizationSchedule = useMemo((): AmortizationRow[] => {
    const r = annualRate / 12 / 100;
    const { emi } = emiResult;
    if (emi <= 0) return [];

    const schedule: AmortizationRow[] = [];
    let balance = principal;

    for (let month = 1; month <= tenureMonths; month++) {
      const interestComponent = balance * r;
      const principalComponent = emi - interestComponent;
      balance = Math.max(0, balance - principalComponent);

      schedule.push({
        month,
        emi,
        principalComponent,
        interestComponent,
        outstandingBalance: balance,
      });
    }

    return schedule;
  }, [principal, annualRate, tenureMonths, emiResult]);

  const displayedRows = showAllRows ? amortizationSchedule : amortizationSchedule.slice(0, 12);

  const principalPercent = emiResult.totalPayment > 0 ? (principal / emiResult.totalPayment) * 100 : 50;
  const interestPercent = 100 - principalPercent;

  const handlePresetClick = (preset: LoanPreset) => {
    setAnnualRate(preset.rate);
    setPrincipal(preset.defaultPrincipal);
    setTenureMonths(preset.defaultTenure);
    setActivePreset(preset.label);
  };

  const handlePrincipalInput = (val: string) => {
    const num = parseInt(val.replace(/[^0-9]/g, ""), 10);
    if (!isNaN(num)) {
      setPrincipal(Math.min(50000000, Math.max(100000, num)));
      setActivePreset(null);
    }
  };

  const handleRateInput = (val: string) => {
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setAnnualRate(Math.min(20, Math.max(5, num)));
      setActivePreset(null);
    }
  };

  const handleTenureInput = (val: string) => {
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      setTenureMonths(Math.min(360, Math.max(6, num)));
      setActivePreset(null);
    }
  };

  // SVG Donut Chart
  const DonutChart = () => {
    const size = 200;
    const strokeWidth = 36;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const principalArc = (principalPercent / 100) * circumference;
    const interestArc = (interestPercent / 100) * circumference;

    return (
      <div className="flex flex-col items-center">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
          {/* Interest slice */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--credit-lens-primary) / 0.25)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
          />
          {/* Principal slice */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--credit-lens-primary))"
            strokeWidth={strokeWidth}
            strokeDasharray={`${principalArc} ${circumference - principalArc}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="flex gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(var(--credit-lens-primary))" }} />
            <span className="text-sm text-muted-foreground">Principal ({principalPercent.toFixed(1)}%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(var(--credit-lens-primary) / 0.25)" }} />
            <span className="text-sm text-muted-foreground">Interest ({interestPercent.toFixed(1)}%)</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section
        className="relative py-16 md:py-24 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, hsl(var(--credit-lens-primary)) 0%, hsl(var(--credit-lens-primary) / 0.8) 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <Badge className="bg-white/20 text-white border-white/30 mb-4 text-sm px-4 py-1">
            <Calculator className="w-4 h-4 mr-2" />
            Financial Planning Tool
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            EMI Calculator
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            Plan your loan repayment with our instant EMI calculator. Get detailed breakdowns for Home, Vehicle, Education, and Personal loans.
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-10 space-y-10">

        {/* Loan Presets */}
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" style={{ color: "hsl(var(--credit-lens-primary))" }} />
            Quick Loan Presets
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {LOAN_PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => handlePresetClick(preset)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                  activePreset === preset.label
                    ? "border-[hsl(var(--credit-lens-primary))] bg-[hsl(var(--credit-lens-primary)/0.05)] shadow-md"
                    : "border-border hover:border-[hsl(var(--credit-lens-primary)/0.3)]"
                }`}
              >
                <div className={`p-2 rounded-lg ${preset.color}`}>{preset.icon}</div>
                <span className="text-sm font-medium text-center">{preset.label}</span>
                <Badge variant="secondary" className="text-xs">{preset.rate}%</Badge>
              </button>
            ))}
          </div>
        </section>

        {/* Calculator + Results */}
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Input Panel */}
          <Card className="lg:col-span-3 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" style={{ color: "hsl(var(--credit-lens-primary))" }} />
                Loan Details
              </CardTitle>
              <CardDescription>Adjust the sliders or enter values to calculate your EMI</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Loan Amount */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium flex items-center gap-1">
                    <IndianRupee className="w-4 h-4" />
                    Loan Amount
                  </Label>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground mr-1">₹</span>
                    <Input
                      type="text"
                      value={principal.toLocaleString("en-IN")}
                      onChange={(e) => handlePrincipalInput(e.target.value)}
                      className="w-40 text-right font-semibold h-9"
                    />
                  </div>
                </div>
                <Slider
                  value={[principal]}
                  min={100000}
                  max={50000000}
                  step={50000}
                  onValueChange={([val]) => { setPrincipal(val); setActivePreset(null); }}
                  className="[&_[role=slider]]:bg-[hsl(var(--credit-lens-primary))]"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>₹1 Lakh</span>
                  <span className="font-medium text-foreground">{formatCompact(principal)}</span>
                  <span>₹5 Crore</span>
                </div>
              </div>

              {/* Interest Rate */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    Interest Rate (% p.a.)
                  </Label>
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      value={annualRate}
                      min={5}
                      max={20}
                      step={0.1}
                      onChange={(e) => handleRateInput(e.target.value)}
                      className="w-24 text-right font-semibold h-9"
                    />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                </div>
                <Slider
                  value={[annualRate]}
                  min={5}
                  max={20}
                  step={0.1}
                  onValueChange={([val]) => { setAnnualRate(val); setActivePreset(null); }}
                  className="[&_[role=slider]]:bg-[hsl(var(--credit-lens-primary))]"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>5%</span>
                  <span className="font-medium text-foreground">{annualRate.toFixed(1)}%</span>
                  <span>20%</span>
                </div>
              </div>

              {/* Tenure */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Loan Tenure
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={tenureMonths}
                      min={6}
                      max={360}
                      onChange={(e) => handleTenureInput(e.target.value)}
                      className="w-24 text-right font-semibold h-9"
                    />
                    <span className="text-sm text-muted-foreground">months</span>
                  </div>
                </div>
                <Slider
                  value={[tenureMonths]}
                  min={6}
                  max={360}
                  step={1}
                  onValueChange={([val]) => { setTenureMonths(val); setActivePreset(null); }}
                  className="[&_[role=slider]]:bg-[hsl(var(--credit-lens-primary))]"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>6 months</span>
                  <span className="font-medium text-foreground">
                    {tenureMonths} months ({Math.floor(tenureMonths / 12)} yrs {tenureMonths % 12} mo)
                  </span>
                  <span>30 years</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg border-t-4" style={{ borderTopColor: "hsl(var(--credit-lens-primary))" }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <PieChart className="w-5 h-5" style={{ color: "hsl(var(--credit-lens-primary))" }} />
                  EMI Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Monthly EMI */}
                <div className="text-center p-4 rounded-xl" style={{ backgroundColor: "hsl(var(--credit-lens-primary) / 0.05)" }}>
                  <p className="text-sm text-muted-foreground mb-1">Monthly EMI</p>
                  <p
                    className="text-3xl md:text-4xl font-bold"
                    style={{ color: "hsl(var(--credit-lens-primary))" }}
                  >
                    {formatCurrency(Math.round(emiResult.emi))}
                  </p>
                </div>

                {/* Totals */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Interest</p>
                    <p className="text-lg font-semibold text-destructive">
                      {formatCurrency(Math.round(emiResult.totalInterest))}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Amount</p>
                    <p className="text-lg font-semibold">
                      {formatCurrency(Math.round(emiResult.totalPayment))}
                    </p>
                  </div>
                </div>

                {/* Principal line */}
                <div className="p-3 rounded-lg bg-muted/50 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Principal Amount</p>
                  <p className="text-lg font-semibold">{formatCurrency(principal)}</p>
                </div>

                {/* Donut Chart */}
                <DonutChart />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Amortization Schedule */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="w-5 h-5" style={{ color: "hsl(var(--credit-lens-primary))" }} />
              Amortization Schedule
            </CardTitle>
            <CardDescription>
              Monthly breakdown of your EMI payments showing principal and interest components
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="table">
              <TabsList className="mb-4">
                <TabsTrigger value="table">Table View</TabsTrigger>
                <TabsTrigger value="yearly">Yearly Summary</TabsTrigger>
              </TabsList>

              <TabsContent value="table">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="py-3 px-3 font-semibold text-muted-foreground">Month</th>
                        <th className="py-3 px-3 font-semibold text-muted-foreground text-right">EMI</th>
                        <th className="py-3 px-3 font-semibold text-muted-foreground text-right">Principal</th>
                        <th className="py-3 px-3 font-semibold text-muted-foreground text-right">Interest</th>
                        <th className="py-3 px-3 font-semibold text-muted-foreground text-right">Outstanding</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedRows.map((row) => (
                        <tr key={row.month} className="border-b last:border-b-0 hover:bg-muted/30 transition-colors">
                          <td className="py-2.5 px-3 font-medium">{row.month}</td>
                          <td className="py-2.5 px-3 text-right">{formatCurrency(Math.round(row.emi))}</td>
                          <td className="py-2.5 px-3 text-right" style={{ color: "hsl(var(--credit-lens-primary))" }}>
                            {formatCurrency(Math.round(row.principalComponent))}
                          </td>
                          <td className="py-2.5 px-3 text-right text-destructive">
                            {formatCurrency(Math.round(row.interestComponent))}
                          </td>
                          <td className="py-2.5 px-3 text-right font-medium">
                            {formatCurrency(Math.round(row.outstandingBalance))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {amortizationSchedule.length > 12 && (
                  <div className="mt-4 text-center">
                    <Button
                      variant="outline"
                      onClick={() => setShowAllRows(!showAllRows)}
                      className="gap-2"
                    >
                      {showAllRows ? (
                        <>
                          <ChevronUp className="w-4 h-4" /> Show Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" /> Show All {amortizationSchedule.length} Months
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="yearly">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="py-3 px-3 font-semibold text-muted-foreground">Year</th>
                        <th className="py-3 px-3 font-semibold text-muted-foreground text-right">Total EMI</th>
                        <th className="py-3 px-3 font-semibold text-muted-foreground text-right">Principal Paid</th>
                        <th className="py-3 px-3 font-semibold text-muted-foreground text-right">Interest Paid</th>
                        <th className="py-3 px-3 font-semibold text-muted-foreground text-right">Balance at Year End</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: Math.ceil(tenureMonths / 12) }, (_, yearIdx) => {
                        const start = yearIdx * 12;
                        const end = Math.min(start + 12, amortizationSchedule.length);
                        const yearRows = amortizationSchedule.slice(start, end);
                        if (yearRows.length === 0) return null;
                        const totalEmi = yearRows.reduce((s, r) => s + r.emi, 0);
                        const totalPrincipal = yearRows.reduce((s, r) => s + r.principalComponent, 0);
                        const totalInterest = yearRows.reduce((s, r) => s + r.interestComponent, 0);
                        const endBalance = yearRows[yearRows.length - 1].outstandingBalance;
                        return (
                          <tr key={yearIdx} className="border-b last:border-b-0 hover:bg-muted/30 transition-colors">
                            <td className="py-2.5 px-3 font-medium">Year {yearIdx + 1}</td>
                            <td className="py-2.5 px-3 text-right">{formatCurrency(Math.round(totalEmi))}</td>
                            <td className="py-2.5 px-3 text-right" style={{ color: "hsl(var(--credit-lens-primary))" }}>
                              {formatCurrency(Math.round(totalPrincipal))}
                            </td>
                            <td className="py-2.5 px-3 text-right text-destructive">
                              {formatCurrency(Math.round(totalInterest))}
                            </td>
                            <td className="py-2.5 px-3 text-right font-medium">
                              {formatCurrency(Math.round(endBalance))}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Informational note */}
        <Card className="bg-muted/30">
          <CardContent className="py-6">
            <div className="flex items-start gap-3">
              <Calculator className="w-5 h-5 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div className="text-sm text-muted-foreground space-y-1">
                <p className="font-medium text-foreground">How is EMI calculated?</p>
                <p>
                  EMI = P x r x (1+r)<sup>n</sup> / ((1+r)<sup>n</sup> - 1), where P is the principal loan amount,
                  r is the monthly interest rate (annual rate / 12 / 100), and n is the loan tenure in months.
                </p>
                <p>
                  The actual EMI may vary slightly based on the lender's calculation method, processing fees, and
                  applicable taxes. This calculator provides an indicative value for planning purposes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default EMICalculator;
