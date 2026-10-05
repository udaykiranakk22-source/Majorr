import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface ApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  applicationType: string;
}

const ApplicationForm = ({ isOpen, onClose, applicationType }: ApplicationFormProps) => {
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    panNumber: "",
    aadhaarNumber: "",

    // Address Information
    streetAddress: "",
    city: "",
    state: "",
    pinCode: "",

    // Employment Information
    employmentStatus: "",
    employerName: "",
    jobTitle: "",
    annualIncome: "",

    // Account Preferences
    initialDeposit: "",
    accountPurpose: "",


    // Additional Information
    hasExistingAccount: false,
    additionalInfo: "",

    // Terms and Conditions
    agreeToTerms: false,
    agreeToMarketing: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [creditLimit, setCreditLimit] = useState<number | null>(null);

  // Calculate credit limit for credit card applications
  useEffect(() => {
    const isCreditCard = applicationType === 'credit_card';

    if (isCreditCard && formData.annualIncome) {
      let income = 0;
      switch (formData.annualIncome) {
        case 'under-2.5L':
          income = 200000;
          break;
        case '2.5L-5L':
          income = 375000;
          break;
        case '5L-7.5L':
          income = 625000;
          break;
        case '7.5L-10L':
          income = 875000;
          break;
        case '10L-15L':
          income = 1250000;
          break;
        case '15L-25L':
          income = 2000000;
          break;
        case 'over-25L':
          income = 3000000;
          break;
        default:
          income = 0;
      }

      if (income > 0) {
        let calculatedLimit = income;

        // Credit card: 8% of income, max ₹5,00,000
        calculatedLimit = income * 0.08;
        calculatedLimit = Math.max(25000, calculatedLimit);
        calculatedLimit = Math.min(500000, calculatedLimit);

        setCreditLimit(Math.round(calculatedLimit / 1000) * 1000);
      } else {
        setCreditLimit(null);
      }
    } else {
      setCreditLimit(null);
    }
  }, [formData.annualIncome, applicationType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));

    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = "First Name is required";
    if (!formData.lastName) newErrors.lastName = "Last Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.phone) newErrors.phone = "Phone Number is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of Birth is required";

    // PAN validation
    if (!formData.panNumber) {
      newErrors.panNumber = "PAN is required";
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(formData.panNumber)) {
      newErrors.panNumber = "Invalid PAN format (e.g. ABCDE1234F)";
    }

    // Aadhaar validation
    if (!formData.aadhaarNumber) {
      newErrors.aadhaarNumber = "Aadhaar Number is required";
    } else if (!/^\d{12}$/.test(formData.aadhaarNumber)) {
      newErrors.aadhaarNumber = "Aadhaar must be 12 digits";
    }

    if (!formData.streetAddress) newErrors.streetAddress = "Street Address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";

    // PIN code validation
    if (!formData.pinCode) {
      newErrors.pinCode = "PIN Code is required";
    } else if (!/^\d{6}$/.test(formData.pinCode)) {
      newErrors.pinCode = "PIN Code must be 6 digits";
    }

    if (!formData.employmentStatus) newErrors.employmentStatus = "Employment Status is required";
    if (formData.employmentStatus === "employed" && !formData.employerName)
      newErrors.employerName = "Employer Name is required for employed status";
    if (formData.employmentStatus === "employed" && !formData.jobTitle)
      newErrors.jobTitle = "Job Title is required for employed status";
    if (!formData.annualIncome) newErrors.annualIncome = "Annual Income is required";

    // Initial deposit only required for non-credit card applications
    const isCreditCard = applicationType === 'credit_card';
    if (!isCreditCard && !formData.initialDeposit) {
      newErrors.initialDeposit = "Initial Deposit is required";
    }

    if (!formData.accountPurpose) newErrors.accountPurpose = "Account Purpose is required";

    if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the terms and conditions";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const isCreditCard = applicationType === 'credit_card';

      const applicationData = {
        applicationType: applicationType,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        panNumber: formData.panNumber,
        aadhaarNumber: formData.aadhaarNumber,
        streetAddress: formData.streetAddress,
        city: formData.city,
        state: formData.state,
        pinCode: formData.pinCode,
        employmentStatus: formData.employmentStatus,
        employerName: formData.employerName,
        jobTitle: formData.jobTitle,
        annualIncome: formData.annualIncome,
        initialDeposit: isCreditCard ? 0 : parseFloat(formData.initialDeposit),
        accountPurpose: formData.accountPurpose,
        hasExistingAccount: formData.hasExistingAccount,
        additionalInfo: formData.additionalInfo,
        agreeToTerms: formData.agreeToTerms,
        agreeToMarketing: formData.agreeToMarketing,
        ...(isCreditCard && creditLimit !== null && { creditLimit: creditLimit }),
      };

      console.log('Submitting application with data:', {
        applicationType,
        creditLimit,
        isCreditCard,
        annualIncome: formData.annualIncome
      });

      const response = await fetch("http://localhost:3001/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(applicationData),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: `Server error: ${response.status} ${response.statusText}` };
        }
        throw new Error(errorData.message || "Failed to submit application");
      }

      const result = await response.json();

      if (result.success !== false) {
        console.log("Application submitted:", applicationData);
        setIsSubmitted(true);
      } else {
        throw new Error(result.message || "Failed to submit application");
      }
    } catch (error: any) {
      console.error("Error submitting application:", error);
      const errorMessage = error.message || (error instanceof TypeError && error.message.includes('fetch')
        ? "Unable to connect to server. Please ensure the backend is running."
        : "An unexpected error occurred.");
      setSubmissionError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFormTitle = () => {
    switch (applicationType) {
      case "savings":
        return "Savings Account Application";
      case "current":
        return "Current Account Application";
      case "fixed_deposit":
        return "Fixed Deposit Application";
      case "recurring_deposit":
        return "Recurring Deposit Application";
      case "credit_card":
        return "Credit Card Application";
      default:
        return "Account Application";
    }
  };

  const getFormDescription = () => {
    switch (applicationType) {
      case "savings":
        return "Apply for a Savings Account with competitive interest rates and zero balance options.";
      case "current":
        return "Apply for a Current Account designed for businesses and professionals.";
      case "fixed_deposit":
        return "Apply for a Fixed Deposit to earn higher returns on your savings.";
      case "recurring_deposit":
        return "Apply for a Recurring Deposit and build your savings with monthly instalments.";
      case "credit_card":
        return "Apply for a Credit Card and enjoy rewards on every purchase.";
      default:
        return "Fill out the details below to apply for your new account.";
    }
  };

  const formatINR = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {getFormTitle()}
            <Button variant="ghost" onClick={onClose} className="p-2">
              <X className="h-5 w-5" />
            </Button>
          </DialogTitle>
          <DialogDescription>{getFormDescription()}</DialogDescription>
        </DialogHeader>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="form-surface">
            {/* Personal Information */}
            <Card className="form-section">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Tell us about yourself.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" value={formData.firstName} onChange={handleChange} />
                  {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" value={formData.lastName} onChange={handleChange} />
                  {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={formData.email} onChange={handleChange} />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" />
                  {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input id="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} />
                  {errors.dateOfBirth && <p className="text-red-500 text-sm">{errors.dateOfBirth}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="panNumber">PAN Number</Label>
                  <Input id="panNumber" value={formData.panNumber} onChange={handleChange} placeholder="ABCDE1234F" />
                  {errors.panNumber && <p className="text-red-500 text-sm">{errors.panNumber}</p>}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="aadhaarNumber">Aadhaar Number</Label>
                  <Input id="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleChange} placeholder="1234 5678 9012" />
                  {errors.aadhaarNumber && <p className="text-red-500 text-sm">{errors.aadhaarNumber}</p>}
                </div>
              </CardContent>
            </Card>


            {/* Address Information */}
            <Card className="form-section">
              <CardHeader>
                <CardTitle>Address Information</CardTitle>
                <CardDescription>Where do you live?</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="streetAddress">Street Address</Label>
                  <Input id="streetAddress" value={formData.streetAddress} onChange={handleChange} placeholder="123 MG Road" />
                  {errors.streetAddress && <p className="text-red-500 text-sm">{errors.streetAddress}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" value={formData.city} onChange={handleChange} placeholder="Hyderabad" />
                  {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Select onValueChange={(value) => handleSelectChange("state", value)} value={formData.state}>
                    <SelectTrigger id="state">
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AP">Andhra Pradesh</SelectItem>
                      <SelectItem value="AR">Arunachal Pradesh</SelectItem>
                      <SelectItem value="AS">Assam</SelectItem>
                      <SelectItem value="BR">Bihar</SelectItem>
                      <SelectItem value="CG">Chhattisgarh</SelectItem>
                      <SelectItem value="GA">Goa</SelectItem>
                      <SelectItem value="GJ">Gujarat</SelectItem>
                      <SelectItem value="HR">Haryana</SelectItem>
                      <SelectItem value="HP">Himachal Pradesh</SelectItem>
                      <SelectItem value="JK">Jammu and Kashmir</SelectItem>
                      <SelectItem value="JH">Jharkhand</SelectItem>
                      <SelectItem value="KA">Karnataka</SelectItem>
                      <SelectItem value="KL">Kerala</SelectItem>
                      <SelectItem value="LA">Ladakh</SelectItem>
                      <SelectItem value="MP">Madhya Pradesh</SelectItem>
                      <SelectItem value="MH">Maharashtra</SelectItem>
                      <SelectItem value="MN">Manipur</SelectItem>
                      <SelectItem value="ML">Meghalaya</SelectItem>
                      <SelectItem value="MZ">Mizoram</SelectItem>
                      <SelectItem value="NL">Nagaland</SelectItem>
                      <SelectItem value="OD">Odisha</SelectItem>
                      <SelectItem value="PB">Punjab</SelectItem>
                      <SelectItem value="RJ">Rajasthan</SelectItem>
                      <SelectItem value="SK">Sikkim</SelectItem>
                      <SelectItem value="TN">Tamil Nadu</SelectItem>
                      <SelectItem value="TS">Telangana</SelectItem>
                      <SelectItem value="TR">Tripura</SelectItem>
                      <SelectItem value="UP">Uttar Pradesh</SelectItem>
                      <SelectItem value="UK">Uttarakhand</SelectItem>
                      <SelectItem value="WB">West Bengal</SelectItem>
                      <SelectItem value="DL">Delhi</SelectItem>
                      <SelectItem value="PY">Puducherry</SelectItem>
                      <SelectItem value="CH">Chandigarh</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pinCode">PIN Code</Label>
                  <Input id="pinCode" value={formData.pinCode} onChange={handleChange} placeholder="500001" />
                  {errors.pinCode && <p className="text-red-500 text-sm">{errors.pinCode}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Employment Information */}
            <Card className="form-section">
              <CardHeader>
                <CardTitle>Employment Information</CardTitle>
                <CardDescription>Tell us about your employment status.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employmentStatus">Employment Status</Label>
                  <Select onValueChange={(value) => handleSelectChange("employmentStatus", value)} value={formData.employmentStatus}>
                    <SelectTrigger id="employmentStatus">
                      <SelectValue placeholder="Select Employment Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employed">Employed</SelectItem>
                      <SelectItem value="self-employed">Self-Employed</SelectItem>
                      <SelectItem value="unemployed">Unemployed</SelectItem>
                      <SelectItem value="retired">Retired</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.employmentStatus && <p className="text-red-500 text-sm">{errors.employmentStatus}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employerName">Employer Name</Label>
                  <Input id="employerName" value={formData.employerName} onChange={handleChange} />
                  {errors.employerName && <p className="text-red-500 text-sm">{errors.employerName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input id="jobTitle" value={formData.jobTitle} onChange={handleChange} />
                  {errors.jobTitle && <p className="text-red-500 text-sm">{errors.jobTitle}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="annualIncome">Annual Income</Label>
                  <Select onValueChange={(value) => handleSelectChange("annualIncome", value)} value={formData.annualIncome}>
                    <SelectTrigger id="annualIncome">
                      <SelectValue placeholder="Select Annual Income" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-2.5L">Under ₹2.5 Lakhs</SelectItem>
                      <SelectItem value="2.5L-5L">₹2.5 - ₹5 Lakhs</SelectItem>
                      <SelectItem value="5L-7.5L">₹5 - ₹7.5 Lakhs</SelectItem>
                      <SelectItem value="7.5L-10L">₹7.5 - ₹10 Lakhs</SelectItem>
                      <SelectItem value="10L-15L">₹10 - ₹15 Lakhs</SelectItem>
                      <SelectItem value="15L-25L">₹15 - ₹25 Lakhs</SelectItem>
                      <SelectItem value="over-25L">Over ₹25 Lakhs</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.annualIncome && <p className="text-red-500 text-sm">{errors.annualIncome}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Account Preferences */}
            <Card className="form-section">
              <CardHeader>
                <CardTitle>Account Preferences</CardTitle>
                <CardDescription>Tell us about your account preferences.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Initial Deposit - only show for non-credit card applications */}
                {applicationType !== 'credit_card' && (
                  <div className="space-y-2">
                    <Label htmlFor="initialDeposit">Initial Deposit Amount (₹)</Label>
                    <Input id="initialDeposit" type="number" value={formData.initialDeposit} onChange={handleChange} placeholder="0" />
                    {errors.initialDeposit && <p className="text-red-500 text-sm">{errors.initialDeposit}</p>}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="accountPurpose">Account Purpose</Label>
                  <Select onValueChange={(value) => handleSelectChange("accountPurpose", value)} value={formData.accountPurpose}>
                    <SelectTrigger id="accountPurpose">
                      <SelectValue placeholder="Select Account Purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      {applicationType === 'credit_card' ? (
                        <>
                          <SelectItem value="daily-expenses">Daily Expenses</SelectItem>
                          <SelectItem value="emergency-fund">Emergency Fund</SelectItem>
                          <SelectItem value="building-credit">Building Credit</SelectItem>
                          <SelectItem value="rewards-earning">Rewards Earning</SelectItem>
                          <SelectItem value="travel">Travel</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="daily-expenses">Daily Expenses</SelectItem>
                          <SelectItem value="bill-payments">Bill Payments</SelectItem>
                          <SelectItem value="savings">Savings</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  {errors.accountPurpose && <p className="text-red-500 text-sm">{errors.accountPurpose}</p>}
                </div>

                {/* Credit Limit Display for Credit Card Applications */}
                {applicationType === 'credit_card' && creditLimit !== null && (
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="creditLimit">Calculated Credit Limit</Label>
                    <Input
                      id="creditLimit"
                      type="text"
                      value={formatINR(creditLimit)}
                      readOnly
                      className="bg-gray-100 cursor-not-allowed"
                    />
                    <p className="text-sm text-gray-500">Based on your annual income range: {formData.annualIncome?.replace('under-', 'Under ').replace('over-', 'Over ').replace('L', ' Lakhs').replace('-', ' - ₹')}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card className="form-section">
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
                <CardDescription>Any additional information you'd like to share.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="hasExistingAccount" checked={formData.hasExistingAccount} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasExistingAccount: checked as boolean }))} />
                  <Label htmlFor="hasExistingAccount">I have an existing account with Credit Lens</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="additionalInfo">Additional Information</Label>
                  <Textarea id="additionalInfo" value={formData.additionalInfo} onChange={handleChange} placeholder="Any additional information you'd like to share..." />
                </div>
              </CardContent>
            </Card>

            {/* Terms and Conditions */}
            <Card className="form-section form-section-accent">
              <CardHeader>
                <CardTitle>Terms and Conditions</CardTitle>
                <CardDescription>Please read and agree to the terms and conditions.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h4 className="font-semibold text-sm mb-2">Account Agreement Summary</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Account opening subject to approval and verification</li>
                    <li>• Minimum balance requirements may apply</li>
                    <li>• Monthly maintenance fees may be charged</li>
                    <li>• Overdraft protection available upon request</li>
                    <li>• Electronic banking services included</li>
                    <li>• DICGC insured up to ₹5,00,000 per depositor</li>
                  </ul>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreeToTerms: checked as boolean }))}
                    className={errors.agreeToTerms ? "border-red-500" : ""}
                  />
                  <Label htmlFor="agreeToTerms" className="text-sm">
                    I agree to the <button
                      type="button"
                      className="text-blue-600 hover:underline font-medium"
                      onClick={() =>
                        toast({
                          title: "Terms & Conditions",
                          description: "Review our standard account terms at creditlens.in/terms.",
                        })
                      }
                    >Terms and Conditions</button> and <button
                      type="button"
                      className="text-blue-600 hover:underline font-medium"
                      onClick={() =>
                        toast({
                          title: "Privacy Policy",
                          description: "Learn how we handle your data at creditlens.in/privacy.",
                        })
                      }
                    >Privacy Policy</button> *
                  </Label>
                </div>
                {errors.agreeToTerms && <p className="text-red-500 text-sm">{errors.agreeToTerms}</p>}

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agreeToMarketing"
                    checked={formData.agreeToMarketing}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreeToMarketing: checked as boolean }))}
                  />
                  <Label htmlFor="agreeToMarketing" className="text-sm">
                    I would like to receive marketing communications from Credit Lens about products, services, and special offers
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Error Display */}
            {submissionError && (
              <div className="form-section border-red-200 bg-red-50/90">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <span className="text-red-800 font-medium">Submission Error</span>
                </div>
                <p className="text-red-600 mt-1">{submissionError}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="form-surface text-center">
            <div className="h-16 w-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">✓</span>
            </div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">Application Submitted Successfully!</h3>
            <p className="text-green-600 mb-4">
              Thank you for your application. We will review it and get back to you soon.
            </p>
            <Button onClick={onClose} className="bg-green-600 hover:bg-green-700">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationForm;
