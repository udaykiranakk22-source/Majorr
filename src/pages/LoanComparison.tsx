import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Scale, IndianRupee, TrendingUp, Plus, Trash2, BarChart3, Layers, ArrowDown } from "lucide-react";

interface LoanOption {
  id: string;
  name: string;
  loanType: string;
  principal: number;
  interestRate: number;
  tenure: number;
  processingFee: number;
}

interface CalculatedLoan extends LoanOption {
  monthlyEMI: number;
  totalInterest: number;
  totalPayment: number;
  processingFeeAmount: number;
  effectiveCost: number;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const calculateEMI = (principal: number, annualRate: number, tenureMonths: number): number => {
  if (principal <= 0 || annualRate <= 0 || tenureMonths <= 0) return 0;
  const r = annualRate / 12 / 100;
  const n = tenureMonths;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
};

const LOAN_TYPES = ["Home Loan", "Personal Loan", "Education Loan", "Car Loan", "Business Loan", "Gold Loan"];

const TEMPLATES = [
  {
    label: "Home Loan Comparison",
    icon: "🏠",
    loans: [
      { id: "t1", name: "SBI Home Loan", loanType: "Home Loan", principal: 5000000, interestRate: 8.4, tenure: 240, processingFee: 0.35 },
      { id: "t2", name: "HDFC Home Loan", loanType: "Home Loan", principal: 5000000, interestRate: 8.7, tenure: 240, processingFee: 0.5 },
      { id: "t3", name: "ICICI Home Loan", loanType: "Home Loan", principal: 5000000, interestRate: 8.6, tenure: 240, processingFee: 0.5 },
      { id: "t4", name: "PNB Home Loan", loanType: "Home Loan", principal: 5000000, interestRate: 8.5, tenure: 240, processingFee: 0.35 },
    ],
  },
  {
    label: "Education Loan Comparison",
    icon: "🎓",
    loans: [
      { id: "t5", name: "SBI Education Loan", loanType: "Education Loan", principal: 1500000, interestRate: 10.15, tenure: 84, processingFee: 0 },
      { id: "t6", name: "BOB Education Loan", loanType: "Education Loan", principal: 1500000, interestRate: 10.35, tenure: 84, processingFee: 0.5 },
      { id: "t7", name: "Canara Education Loan", loanType: "Education Loan", principal: 1500000, interestRate: 10.5, tenure: 84, processingFee: 0.25 },
    ],
  },
  {
    label: "Personal Loan Comparison",
    icon: "💳",
    loans: [
      { id: "t8", name: "HDFC Personal Loan", loanType: "Personal Loan", principal: 500000, interestRate: 10.5, tenure: 60, processingFee: 1.5 },
      { id: "t9", name: "ICICI Personal Loan", loanType: "Personal Loan", principal: 500000, interestRate: 10.75, tenure: 60, processingFee: 2 },
      { id: "t10", name: "Axis Personal Loan", loanType: "Personal Loan", principal: 500000, interestRate: 11, tenure: 60, processingFee: 1.75 },
      { id: "t11", name: "Bajaj Personal Loan", loanType: "Personal Loan", principal: 500000, interestRate: 13, tenure: 60, processingFee: 3 },
    ],
  },
];

const emptyForm = (): Omit<LoanOption, "id"> => ({
  name: "",
  loanType: "",
  principal: 0,
  interestRate: 0,
  tenure: 0,
  processingFee: 0,
});

const LoanComparison = () => {
  const [loans, setLoans] = useState<LoanOption[]>([]);
  const [form, setForm] = useState(emptyForm());

  const addLoan = () => {
    if (!form.name || !form.loanType || form.principal <= 0 || form.interestRate <= 0 || form.tenure <= 0) return;
    if (loans.length >= 4) return;
    setLoans((prev) => [...prev, { ...form, id: crypto.randomUUID() }]);
    setForm(emptyForm());
  };

  const removeLoan = (id: string) => setLoans((prev) => prev.filter((l) => l.id !== id));

  const loadTemplate = (templateIndex: number) => {
    setLoans(TEMPLATES[templateIndex].loans);
  };

  const calculated: CalculatedLoan[] = useMemo(
    () =>
      loans.map((loan) => {
        const emi = calculateEMI(loan.principal, loan.interestRate, loan.tenure);
        const totalPayment = emi * loan.tenure;
        const totalInterest = totalPayment - loan.principal;
        const processingFeeAmount = (loan.principal * loan.processingFee) / 100;
        const effectiveCost = totalPayment + processingFeeAmount;
        return { ...loan, monthlyEMI: emi, totalInterest, totalPayment, processingFeeAmount, effectiveCost };
      }),
    [loans]
  );

  const bestIndices = useMemo(() => {
    if (calculated.length === 0) return {} as Record<string, number>;
    const findMin = (key: keyof CalculatedLoan) => {
      let minIdx = 0;
      for (let i = 1; i < calculated.length; i++) {
        if ((calculated[i][key] as number) < (calculated[minIdx][key] as number)) minIdx = i;
      }
      return minIdx;
    };
    return {
      interestRate: findMin("interestRate"),
      monthlyEMI: findMin("monthlyEMI"),
      totalInterest: findMin("totalInterest"),
      totalPayment: findMin("totalPayment"),
      processingFeeAmount: findMin("processingFeeAmount"),
      effectiveCost: findMin("effectiveCost"),
    };
  }, [calculated]);

  const maxEMI = useMemo(() => Math.max(...calculated.map((c) => c.monthlyEMI), 1), [calculated]);
  const maxCost = useMemo(() => Math.max(...calculated.map((c) => c.effectiveCost), 1), [calculated]);

  const BAR_COLORS = ["#1e40af", "#2563eb", "#3b82f6", "#60a5fa"];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Scale className="h-10 w-10" />
            <h1 className="text-3xl md:text-4xl font-bold">Loan Comparison Dashboard</h1>
          </div>
          <p className="text-blue-200 max-w-2xl mx-auto text-lg">
            Compare up to 4 loan options side by side. Evaluate EMIs, total interest, and effective costs to make the smartest borrowing decision.
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-10 flex-1 space-y-10">
        {/* Pre-built Templates */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Layers className="h-5 w-5 text-blue-700" />
            Quick Templates
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {TEMPLATES.map((tpl, idx) => (
              <Card
                key={tpl.label}
                className="cursor-pointer hover:shadow-md transition-shadow border-blue-100 hover:border-blue-300"
                onClick={() => loadTemplate(idx)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <span className="text-xl">{tpl.icon}</span>
                    {tpl.label}
                  </CardTitle>
                  <CardDescription>{tpl.loans.length} options pre-filled</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {tpl.loans.map((l) => (
                      <Badge key={l.id} variant="secondary" className="text-xs">
                        {l.name.split(" ")[0]} {l.interestRate}%
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Add Loan Form */}
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Plus className="h-5 w-5" />
              Add Loan Option
            </CardTitle>
            <CardDescription>
              Fill in the details below to add a loan for comparison ({loans.length}/4 added)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="loanName">Loan Name / Bank</Label>
                <Input
                  id="loanName"
                  placeholder="e.g. SBI Home Loan"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="loanType">Loan Type</Label>
                <Select value={form.loanType} onValueChange={(v) => setForm((f) => ({ ...f, loanType: v }))}>
                  <SelectTrigger id="loanType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {LOAN_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="principal">Principal Amount (₹)</Label>
                <Input
                  id="principal"
                  type="number"
                  placeholder="e.g. 5000000"
                  value={form.principal || ""}
                  onChange={(e) => setForm((f) => ({ ...f, principal: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="rate">Interest Rate (%)</Label>
                <Input
                  id="rate"
                  type="number"
                  step="0.01"
                  placeholder="e.g. 8.5"
                  value={form.interestRate || ""}
                  onChange={(e) => setForm((f) => ({ ...f, interestRate: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tenure">Tenure (months)</Label>
                <Input
                  id="tenure"
                  type="number"
                  placeholder="e.g. 240"
                  value={form.tenure || ""}
                  onChange={(e) => setForm((f) => ({ ...f, tenure: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="processingFee">Processing Fee (%)</Label>
                <Input
                  id="processingFee"
                  type="number"
                  step="0.01"
                  placeholder="e.g. 0.5"
                  value={form.processingFee || ""}
                  onChange={(e) => setForm((f) => ({ ...f, processingFee: Number(e.target.value) }))}
                />
              </div>
            </div>
            <Button
              className="mt-6 bg-blue-700 hover:bg-blue-800"
              onClick={addLoan}
              disabled={loans.length >= 4 || !form.name || !form.loanType || form.principal <= 0 || form.interestRate <= 0 || form.tenure <= 0}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Loan
            </Button>
          </CardContent>
        </Card>

        {/* Comparison Section */}
        {calculated.length > 0 && (
          <Tabs defaultValue="table" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="table">
                <IndianRupee className="h-4 w-4 mr-1" />
                Comparison Table
              </TabsTrigger>
              <TabsTrigger value="charts">
                <BarChart3 className="h-4 w-4 mr-1" />
                Visual Charts
              </TabsTrigger>
            </TabsList>

            {/* Table View */}
            <TabsContent value="table">
              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-900">Side-by-Side Comparison</CardTitle>
                  <CardDescription>Green highlights indicate the best value in each row</CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[160px] font-semibold text-blue-900">Parameter</TableHead>
                        {calculated.map((loan) => (
                          <TableHead key={loan.id} className="min-w-[160px] text-center">
                            <div className="flex items-center justify-center gap-1">
                              <span className="font-semibold">{loan.name}</span>
                              <button
                                onClick={() => removeLoan(loan.id)}
                                className="ml-1 text-red-400 hover:text-red-600 transition-colors"
                                aria-label={`Remove ${loan.name}`}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Loan Type */}
                      <TableRow>
                        <TableCell className="font-medium">Loan Type</TableCell>
                        {calculated.map((loan) => (
                          <TableCell key={loan.id} className="text-center">
                            <Badge variant="outline">{loan.loanType}</Badge>
                          </TableCell>
                        ))}
                      </TableRow>
                      {/* Principal */}
                      <TableRow>
                        <TableCell className="font-medium">Principal</TableCell>
                        {calculated.map((loan) => (
                          <TableCell key={loan.id} className="text-center">{formatCurrency(loan.principal)}</TableCell>
                        ))}
                      </TableRow>
                      {/* Interest Rate */}
                      <TableRow>
                        <TableCell className="font-medium">Interest Rate</TableCell>
                        {calculated.map((loan, i) => (
                          <TableCell key={loan.id} className="text-center">
                            {i === bestIndices.interestRate && calculated.length > 1 ? (
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{loan.interestRate}%</Badge>
                            ) : (
                              <span>{loan.interestRate}%</span>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                      {/* Tenure */}
                      <TableRow>
                        <TableCell className="font-medium">Tenure</TableCell>
                        {calculated.map((loan) => (
                          <TableCell key={loan.id} className="text-center">{loan.tenure} months</TableCell>
                        ))}
                      </TableRow>
                      {/* Monthly EMI */}
                      <TableRow>
                        <TableCell className="font-medium">Monthly EMI</TableCell>
                        {calculated.map((loan, i) => (
                          <TableCell key={loan.id} className="text-center">
                            {i === bestIndices.monthlyEMI && calculated.length > 1 ? (
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{formatCurrency(loan.monthlyEMI)}</Badge>
                            ) : (
                              <span>{formatCurrency(loan.monthlyEMI)}</span>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                      {/* Total Interest */}
                      <TableRow>
                        <TableCell className="font-medium">Total Interest</TableCell>
                        {calculated.map((loan, i) => (
                          <TableCell key={loan.id} className="text-center">
                            {i === bestIndices.totalInterest && calculated.length > 1 ? (
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{formatCurrency(loan.totalInterest)}</Badge>
                            ) : (
                              <span>{formatCurrency(loan.totalInterest)}</span>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                      {/* Total Payment */}
                      <TableRow>
                        <TableCell className="font-medium">Total Payment</TableCell>
                        {calculated.map((loan, i) => (
                          <TableCell key={loan.id} className="text-center">
                            {i === bestIndices.totalPayment && calculated.length > 1 ? (
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{formatCurrency(loan.totalPayment)}</Badge>
                            ) : (
                              <span>{formatCurrency(loan.totalPayment)}</span>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                      {/* Processing Fee Amount */}
                      <TableRow>
                        <TableCell className="font-medium">Processing Fee Amount</TableCell>
                        {calculated.map((loan, i) => (
                          <TableCell key={loan.id} className="text-center">
                            {i === bestIndices.processingFeeAmount && calculated.length > 1 ? (
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{formatCurrency(loan.processingFeeAmount)}</Badge>
                            ) : (
                              <span>{formatCurrency(loan.processingFeeAmount)}</span>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                      {/* Effective Cost */}
                      <TableRow className="bg-blue-50">
                        <TableCell className="font-semibold text-blue-900">Effective Cost</TableCell>
                        {calculated.map((loan, i) => (
                          <TableCell key={loan.id} className="text-center font-semibold">
                            {i === bestIndices.effectiveCost && calculated.length > 1 ? (
                              <Badge className="bg-green-600 text-white hover:bg-green-600 text-sm">{formatCurrency(loan.effectiveCost)}</Badge>
                            ) : (
                              <span>{formatCurrency(loan.effectiveCost)}</span>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Charts View */}
            <TabsContent value="charts">
              <div className="grid md:grid-cols-2 gap-6">
                {/* EMI Bar Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-900 text-base flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Monthly EMI Comparison
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <svg viewBox={`0 0 400 ${calculated.length * 70 + 20}`} className="w-full" role="img" aria-label="Monthly EMI comparison bar chart">
                      {calculated.map((loan, i) => {
                        const barWidth = (loan.monthlyEMI / maxEMI) * 280;
                        const y = i * 70 + 10;
                        return (
                          <g key={loan.id}>
                            <text x="0" y={y + 14} fontSize="12" fill="#1e3a5f" fontWeight="600">
                              {loan.name.length > 18 ? loan.name.slice(0, 18) + "..." : loan.name}
                            </text>
                            <rect x="0" y={y + 22} width={barWidth} height="28" rx="4" fill={BAR_COLORS[i]} />
                            <text x={barWidth + 6} y={y + 42} fontSize="11" fill="#374151" fontWeight="500">
                              {formatCurrency(loan.monthlyEMI)}
                            </text>
                            {i === bestIndices.monthlyEMI && calculated.length > 1 && (
                              <text x={barWidth + 6} y={y + 56} fontSize="10" fill="#16a34a" fontWeight="600">
                                Lowest
                              </text>
                            )}
                          </g>
                        );
                      })}
                    </svg>
                  </CardContent>
                </Card>

                {/* Total Cost Bar Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-900 text-base flex items-center gap-2">
                      <IndianRupee className="h-5 w-5" />
                      Total Effective Cost Comparison
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <svg viewBox={`0 0 400 ${calculated.length * 70 + 20}`} className="w-full" role="img" aria-label="Total cost comparison bar chart">
                      {calculated.map((loan, i) => {
                        const barWidth = (loan.effectiveCost / maxCost) * 280;
                        const y = i * 70 + 10;
                        return (
                          <g key={loan.id}>
                            <text x="0" y={y + 14} fontSize="12" fill="#1e3a5f" fontWeight="600">
                              {loan.name.length > 18 ? loan.name.slice(0, 18) + "..." : loan.name}
                            </text>
                            <rect x="0" y={y + 22} width={barWidth} height="28" rx="4" fill={BAR_COLORS[i]} />
                            <text x={barWidth + 6} y={y + 42} fontSize="11" fill="#374151" fontWeight="500">
                              {formatCurrency(loan.effectiveCost)}
                            </text>
                            {i === bestIndices.effectiveCost && calculated.length > 1 && (
                              <text x={barWidth + 6} y={y + 56} fontSize="10" fill="#16a34a" fontWeight="600">
                                Best Value
                              </text>
                            )}
                          </g>
                        );
                      })}
                    </svg>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Empty State */}
        {loans.length === 0 && (
          <Card className="border-dashed border-2 border-blue-200">
            <CardContent className="py-16 text-center">
              <Scale className="h-16 w-16 mx-auto text-blue-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Loans to Compare</h3>
              <p className="text-gray-400 max-w-md mx-auto mb-4">
                Add loan options using the form above, or click a Quick Template to get started instantly.
              </p>
              <ArrowDown className="h-6 w-6 mx-auto text-blue-300 animate-bounce" />
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default LoanComparison;
