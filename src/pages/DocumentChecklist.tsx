import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  FileText,
  CheckSquare,
  Download,
  Printer,
  FileCheck,
  Upload,
  ClipboardList,
  Loader2,
  AlertCircle,
  IndianRupee,
  GraduationCap,
  Home,
  Car,
  Briefcase,
  Landmark,
  Wheat,
} from "lucide-react";

const API_BASE = "http://localhost:3000";

interface Document {
  name: string;
  description: string;
  required: boolean;
  category: string;
}

interface ChecklistResponse {
  loanType: string;
  employmentStatus: string;
  documents: Document[];
  additionalNotes: string[];
}

const LOAN_TYPES = [
  { value: "home_loan", label: "Home Loan", icon: Home },
  { value: "education_loan", label: "Education Loan", icon: GraduationCap },
  { value: "gold_loan", label: "Gold Loan", icon: IndianRupee },
  { value: "vehicle_loan", label: "Vehicle Loan", icon: Car },
  { value: "personal_loan", label: "Personal Loan", icon: Briefcase },
  { value: "business_loan", label: "Business Loan", icon: Landmark },
  { value: "agriculture_loan", label: "Agriculture Loan", icon: Wheat },
];

const EMPLOYMENT_STATUSES = [
  { value: "employed", label: "Employed (Salaried)" },
  { value: "self-employed", label: "Self-Employed" },
  { value: "retired", label: "Retired" },
  { value: "student", label: "Student" },
  { value: "unemployed", label: "Unemployed" },
];

const COMMON_CHECKLISTS: Record<string, Record<string, { name: string; description: string; required: boolean }[]>> = {
  "Home Loan": {
    Identity: [
      { name: "PAN Card", description: "Permanent Account Number card issued by Income Tax Department", required: true },
      { name: "Aadhaar Card", description: "12-digit unique identity number issued by UIDAI", required: true },
      { name: "Passport-size Photographs", description: "Recent colour photographs (typically 4-6 copies)", required: true },
    ],
    Address: [
      { name: "Utility Bills", description: "Electricity, water, or gas bill (not older than 3 months)", required: true },
      { name: "Rental Agreement", description: "Registered rental agreement if residing in rented accommodation", required: false },
    ],
    Income: [
      { name: "Salary Slips (3 months)", description: "Latest 3 months salary slips from current employer", required: true },
      { name: "Bank Statements (6 months)", description: "Last 6 months bank statements of salary account", required: true },
      { name: "Form 16", description: "TDS certificate issued by employer for the last 2 financial years", required: true },
      { name: "Income Tax Returns (2 years)", description: "ITR filed for the last 2 assessment years with acknowledgement", required: true },
    ],
    Property: [
      { name: "Sale Agreement", description: "Registered sale agreement or allotment letter from builder", required: true },
      { name: "Property Tax Receipts", description: "Latest property tax payment receipts from local municipal body", required: true },
      { name: "Approved Building Plan", description: "Building plan approved by the local municipal authority", required: true },
      { name: "Encumbrance Certificate", description: "EC from Sub-Registrar office for the last 13-30 years", required: true },
      { name: "Title Deed", description: "Original title deed establishing ownership chain of the property", required: true },
    ],
  },
  "Education Loan": {
    Identity: [
      { name: "PAN Card", description: "PAN card of the student and co-applicant", required: true },
      { name: "Aadhaar Card", description: "Aadhaar card of the student and co-applicant", required: true },
    ],
    Academic: [
      { name: "Mark Sheets", description: "Mark sheets of 10th, 12th, and graduation (as applicable)", required: true },
      { name: "Admission Letter", description: "Confirmed admission letter from the educational institution", required: true },
      { name: "Fee Structure", description: "Detailed fee structure provided by the institution for the entire course", required: true },
    ],
    "Co-applicant": [
      { name: "Income Proof", description: "Salary slips or business income proof of parent/guardian", required: true },
      { name: "ITR of Parent/Guardian", description: "Income Tax Returns of co-applicant for the last 2 years", required: true },
    ],
  },
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Identity: <FileCheck className="h-5 w-5" />,
  Address: <Home className="h-5 w-5" />,
  Income: <IndianRupee className="h-5 w-5" />,
  Property: <Home className="h-5 w-5" />,
  Academic: <GraduationCap className="h-5 w-5" />,
  "Co-applicant": <Briefcase className="h-5 w-5" />,
  Education: <GraduationCap className="h-5 w-5" />,
  Vehicle: <Car className="h-5 w-5" />,
  Business: <Landmark className="h-5 w-5" />,
  Agriculture: <Wheat className="h-5 w-5" />,
  Gold: <IndianRupee className="h-5 w-5" />,
};

const DocumentChecklist = () => {
  const [loanType, setLoanType] = useState("");
  const [employmentStatus, setEmploymentStatus] = useState("");
  const [checklist, setChecklist] = useState<ChecklistResponse | null>(null);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!loanType || !employmentStatus) {
      setError("Please select both loan type and employment status.");
      return;
    }
    setError("");
    setLoading(true);
    setChecklist(null);
    setCheckedItems(new Set());

    try {
      const response = await fetch(
        `${API_BASE}/document-checklist?loanType=${encodeURIComponent(loanType)}&employmentStatus=${encodeURIComponent(employmentStatus)}`
      );
      if (!response.ok) throw new Error("Failed to fetch checklist");
      const data: ChecklistResponse = await response.json();
      setChecklist(data);
    } catch {
      setError("Unable to generate checklist. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const toggleCheck = (docName: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(docName)) {
        next.delete(docName);
      } else {
        next.add(docName);
      }
      return next;
    });
  };

  const groupedDocuments = checklist
    ? checklist.documents.reduce<Record<string, Document[]>>((acc, doc) => {
        if (!acc[doc.category]) acc[doc.category] = [];
        acc[doc.category].push(doc);
        return acc;
      }, {})
    : null;

  const totalDocs = checklist?.documents.length ?? 0;
  const collectedDocs = checklist
    ? checklist.documents.filter((d) => checkedItems.has(d.name)).length
    : 0;
  const progressPercent = totalDocs > 0 ? Math.round((collectedDocs / totalDocs) * 100) : 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Print-only styles */}
      <style>{`
        @media print {
          header, footer, .no-print { display: none !important; }
          .print-only { display: block !important; }
          body { background: white; }
          .print-break { page-break-before: always; }
        }
      `}</style>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 text-white py-16 no-print">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ClipboardList className="h-10 w-10" />
            <h1 className="text-3xl md:text-4xl font-bold">Document Checklist Generator</h1>
          </div>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Get a personalised list of documents required for your loan application.
            Select your loan type and employment status to generate your checklist.
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-6xl mx-auto px-4 py-10 w-full">
        {/* Selection Form */}
        <Card className="mb-8 border-blue-100 shadow-md no-print">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <FileText className="h-5 w-5" />
              Select Your Details
            </CardTitle>
            <CardDescription>
              Choose the loan type and your employment status to generate a tailored document checklist.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="loanType" className="text-sm font-medium">
                  Loan Type
                </Label>
                <Select value={loanType} onValueChange={setLoanType}>
                  <SelectTrigger id="loanType" className="w-full">
                    <SelectValue placeholder="Select loan type" />
                  </SelectTrigger>
                  <SelectContent>
                    {LOAN_TYPES.map((lt) => (
                      <SelectItem key={lt.value} value={lt.value}>
                        <span className="flex items-center gap-2">
                          <lt.icon className="h-4 w-4" />
                          {lt.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="employmentStatus" className="text-sm font-medium">
                  Employment Status
                </Label>
                <Select value={employmentStatus} onValueChange={setEmploymentStatus}>
                  <SelectTrigger id="employmentStatus" className="w-full">
                    <SelectValue placeholder="Select employment status" />
                  </SelectTrigger>
                  <SelectContent>
                    {EMPLOYMENT_STATUSES.map((es) => (
                      <SelectItem key={es.value} value={es.value}>
                        {es.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {error && (
              <div className="mt-4 flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="mt-6 bg-blue-700 hover:bg-blue-800 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Generate Checklist
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Checklist */}
        {checklist && groupedDocuments && (
          <div className="mb-10 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-blue-800">Your Document Checklist</h2>
                <p className="text-gray-600">
                  Loan Type: <span className="font-medium">{checklist.loanType}</span> | Employment:{" "}
                  <span className="font-medium capitalize">{checklist.employmentStatus}</span>
                </p>
              </div>
              <Button onClick={handlePrint} variant="outline" className="no-print border-blue-300 text-blue-700 hover:bg-blue-50">
                <Printer className="h-4 w-4 mr-2" />
                Print / Download
              </Button>
            </div>

            {/* Progress Bar */}
            <Card className="border-blue-100">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Documents Collected
                  </span>
                  <span className="text-sm font-semibold text-blue-700">
                    {collectedDocs} / {totalDocs} ({progressPercent}%)
                  </span>
                </div>
                <Progress value={progressPercent} className="h-3" />
              </CardContent>
            </Card>

            {/* Grouped Documents */}
            <Accordion type="multiple" defaultValue={Object.keys(groupedDocuments)} className="space-y-3">
              {Object.entries(groupedDocuments).map(([category, docs]) => (
                <AccordionItem
                  key={category}
                  value={category}
                  className="border border-blue-100 rounded-lg bg-white shadow-sm overflow-hidden"
                >
                  <AccordionTrigger className="px-5 py-4 hover:bg-blue-50/50">
                    <div className="flex items-center gap-3">
                      <span className="text-blue-600">
                        {CATEGORY_ICONS[category] || <FileText className="h-5 w-5" />}
                      </span>
                      <span className="font-semibold text-gray-800">{category}</span>
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {docs.length} {docs.length === 1 ? "document" : "documents"}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-4">
                    <div className="space-y-3">
                      {docs.map((doc) => (
                        <div
                          key={doc.name}
                          className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                            checkedItems.has(doc.name)
                              ? "bg-green-50 border-green-200"
                              : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          <Checkbox
                            id={`doc-${doc.name}`}
                            checked={checkedItems.has(doc.name)}
                            onCheckedChange={() => toggleCheck(doc.name)}
                            className="mt-1"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <label
                                htmlFor={`doc-${doc.name}`}
                                className={`font-medium cursor-pointer ${
                                  checkedItems.has(doc.name) ? "line-through text-gray-500" : "text-gray-800"
                                }`}
                              >
                                {doc.name}
                              </label>
                              <Badge
                                variant={doc.required ? "default" : "outline"}
                                className={`text-xs ${
                                  doc.required
                                    ? "bg-red-100 text-red-700 border-red-200 hover:bg-red-100"
                                    : "text-gray-500 border-gray-300"
                                }`}
                              >
                                {doc.required ? "Required" : "Optional"}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* Additional Notes */}
            {checklist.additionalNotes && checklist.additionalNotes.length > 0 && (
              <Card className="border-amber-200 bg-amber-50">
                <CardHeader>
                  <CardTitle className="text-amber-800 flex items-center gap-2 text-lg">
                    <AlertCircle className="h-5 w-5" />
                    Additional Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {checklist.additionalNotes.map((note, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-amber-900 text-sm">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                        {note}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Pre-built Common Checklists (shown when no generated checklist) */}
        {!checklist && !loading && (
          <div className="space-y-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-blue-800">Common Document Checklists</h2>
              <p className="text-gray-600 mt-1">
                Reference checklists for popular loan types. Generate a personalised list using the form above.
              </p>
            </div>

            {Object.entries(COMMON_CHECKLISTS).map(([loanName, categories]) => (
              <Card key={loanName} className="border-blue-100 shadow-sm">
                <CardHeader className="bg-blue-50/50 border-b border-blue-100">
                  <CardTitle className="flex items-center gap-2 text-blue-800">
                    {loanName === "Home Loan" ? (
                      <Home className="h-5 w-5" />
                    ) : (
                      <GraduationCap className="h-5 w-5" />
                    )}
                    {loanName} Documents
                  </CardTitle>
                  <CardDescription>
                    Standard documents typically required for a {loanName.toLowerCase()} application in India.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-5">
                  <Accordion type="multiple" defaultValue={Object.keys(categories)}>
                    {Object.entries(categories).map(([category, docs]) => (
                      <AccordionItem key={category} value={category} className="border-b border-gray-100 last:border-0">
                        <AccordionTrigger className="py-3 hover:no-underline">
                          <div className="flex items-center gap-2">
                            <span className="text-blue-600">
                              {CATEGORY_ICONS[category] || <FileText className="h-4 w-4" />}
                            </span>
                            <span className="font-medium text-gray-700">{category}</span>
                            <Badge variant="secondary" className="ml-1 text-xs">
                              {docs.length}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2 pl-1">
                            {docs.map((doc) => (
                              <div
                                key={doc.name}
                                className="flex items-start gap-3 p-2.5 rounded-md bg-gray-50"
                              >
                                <FileText className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-medium text-gray-800 text-sm">
                                      {doc.name}
                                    </span>
                                    <Badge
                                      variant={doc.required ? "default" : "outline"}
                                      className={`text-xs ${
                                        doc.required
                                          ? "bg-red-100 text-red-700 border-red-200 hover:bg-red-100"
                                          : "text-gray-500 border-gray-300"
                                      }`}
                                    >
                                      {doc.required ? "Required" : "Optional"}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-gray-500 mt-0.5">{doc.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}

            {/* Tips Card */}
            <Card className="border-blue-200 bg-blue-50/50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Upload className="h-6 w-6 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-2">Tips for Document Preparation</h3>
                    <ul className="space-y-1.5 text-sm text-blue-900">
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                        Keep self-attested photocopies of all original documents.
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                        Ensure bank statements are stamped and signed by the bank.
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                        ITR documents should include computation of income and acknowledgement receipt.
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                        Address proof documents should not be older than 3 months.
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                        For self-employed applicants, keep GST registration and business proof handy.
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-blue-700">
            <Loader2 className="h-10 w-10 animate-spin mb-4" />
            <p className="text-lg font-medium">Generating your personalised checklist...</p>
            <p className="text-sm text-gray-500 mt-1">This may take a moment</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default DocumentChecklist;
