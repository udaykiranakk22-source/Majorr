import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { X, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface BasicCheckingApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const generateApplicationId = () =>
  `CL-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")}`;

const BasicCheckingApplicationForm = ({ isOpen, onClose }: BasicCheckingApplicationFormProps) => {
  const [applicationId, setApplicationId] = useState(generateApplicationId);
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


  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email";

    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.panNumber.trim()) newErrors.panNumber = "PAN number is required";
    else if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(formData.panNumber.toUpperCase())) newErrors.panNumber = "Please enter a valid PAN (e.g., ABCDE1234F)";
    if (!formData.aadhaarNumber.trim()) newErrors.aadhaarNumber = "Aadhaar number is required";
    else if (!/^\d{12}$/.test(formData.aadhaarNumber.replace(/\s/g, ""))) newErrors.aadhaarNumber = "Please enter a valid 12-digit Aadhaar number";

    if (!formData.streetAddress.trim()) newErrors.streetAddress = "Street address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.pinCode.trim()) newErrors.pinCode = "PIN code is required";
    else if (!/^\d{6}$/.test(formData.pinCode)) newErrors.pinCode = "Please enter a valid 6-digit PIN code";

    if (!formData.employmentStatus) newErrors.employmentStatus = "Employment status is required";
    if (formData.employmentStatus === "employed" && !formData.employerName.trim()) {
      newErrors.employerName = "Employer name is required";
    }
    if (!formData.annualIncome.trim()) newErrors.annualIncome = "Annual income is required";

    if (!formData.initialDeposit.trim()) newErrors.initialDeposit = "Initial deposit amount is required";
    else if (parseFloat(formData.initialDeposit) < 0) newErrors.initialDeposit = "Initial deposit must be a positive amount";

    // Authentication validation

    if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the terms and conditions";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Prepare data for API submission
      const applicationData = {
        applicationType: 'basic_checking',
        applicationId,
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
        initialDeposit: formData.initialDeposit,
        accountPurpose: formData.accountPurpose,
        hasExistingAccount: formData.hasExistingAccount,
        additionalInfo: formData.additionalInfo,
        agreeToTerms: formData.agreeToTerms,
        agreeToMarketing: formData.agreeToMarketing
      };

      // Submit to backend API
      const response = await fetch('http://localhost:3001/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData)
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: `Server error: ${response.status} ${response.statusText}` };
        }
        throw new Error(errorData.message || 'Failed to submit application');
      }

      const result = await response.json();

      if (result.success !== false) {
        console.log("Application submitted successfully:", result);
        setIsSubmitted(true);
      } else {
        throw new Error(result.message || 'Failed to submit application');
      }
    } catch (error: any) {
      console.error("Error submitting application:", error);
      const errorMessage = error.message || (error instanceof TypeError && error.message.includes('fetch')
        ? "Unable to connect to server. Please ensure the backend is running on port 3001."
        : "We couldn't process your application. Please try again.");
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      panNumber: "",
      aadhaarNumber: "",
      streetAddress: "",
      city: "",
      state: "",
      pinCode: "",
      employmentStatus: "",
      employerName: "",
      jobTitle: "",
      annualIncome: "",
      initialDeposit: "",
      accountPurpose: "",
      hasExistingAccount: false,
      additionalInfo: "",
      agreeToTerms: false,
      agreeToMarketing: false
    });
    setErrors({});
    setIsSubmitted(false);
    setApplicationId(generateApplicationId());
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (isSubmitted) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-8">
            <div className="h-16 w-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">✓</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Application Submitted!</h3>
            <p className="text-gray-600 mb-6">
              Thank you for your interest in our Basic Savings account.
              We'll review your application and contact you within 1-2 business days.
            </p>
            <Button onClick={handleClose} className="w-full">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <div className="h-6 w-6 bg-green-500 rounded-full flex items-center justify-center mr-2">
              <span className="text-white text-sm">✓</span>
            </div>
            Basic Savings Account Application
          </DialogTitle>
          <DialogDescription>
            Please fill out the form below to apply for a Basic Savings account.
            All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="form-surface">
          {/* Personal Information */}
          <Card className="form-section">
            <CardHeader>
              <CardTitle className="text-lg">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className={errors.firstName ? "border-red-500" : ""}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className={errors.lastName ? "border-red-500" : ""}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={errors.phone ? "border-red-500" : ""}
                    placeholder="+91 98765 43210"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    className={errors.dateOfBirth ? "border-red-500" : ""}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="panNumber">PAN Number *</Label>
                  <Input
                    id="panNumber"
                    value={formData.panNumber}
                    onChange={(e) => handleInputChange("panNumber", e.target.value.toUpperCase())}
                    className={errors.panNumber ? "border-red-500" : ""}
                    placeholder="ABCDE1234F"
                    maxLength={10}
                  />
                  {errors.panNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.panNumber}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="aadhaarNumber">Aadhaar Number *</Label>
                  <Input
                    id="aadhaarNumber"
                    value={formData.aadhaarNumber}
                    onChange={(e) => handleInputChange("aadhaarNumber", e.target.value)}
                    className={errors.aadhaarNumber ? "border-red-500" : ""}
                    placeholder="1234 5678 9012"
                    maxLength={14}
                  />
                  {errors.aadhaarNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.aadhaarNumber}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>


          {/* Address Information */}
          <Card className="form-section">
            <CardHeader>
              <CardTitle className="text-lg">Address Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="streetAddress">Street Address *</Label>
                <Input
                  id="streetAddress"
                  value={formData.streetAddress}
                  onChange={(e) => handleInputChange("streetAddress", e.target.value)}
                  className={errors.streetAddress ? "border-red-500" : ""}
                />
                {errors.streetAddress && (
                  <p className="text-red-500 text-sm mt-1">{errors.streetAddress}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className={errors.city ? "border-red-500" : ""}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
                    <SelectTrigger className={errors.state ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AP">Andhra Pradesh</SelectItem>
                      <SelectItem value="AR">Arunachal Pradesh</SelectItem>
                      <SelectItem value="AS">Assam</SelectItem>
                      <SelectItem value="BR">Bihar</SelectItem>
                      <SelectItem value="CT">Chhattisgarh</SelectItem>
                      <SelectItem value="GA">Goa</SelectItem>
                      <SelectItem value="GJ">Gujarat</SelectItem>
                      <SelectItem value="HR">Haryana</SelectItem>
                      <SelectItem value="HP">Himachal Pradesh</SelectItem>
                      <SelectItem value="JH">Jharkhand</SelectItem>
                      <SelectItem value="KA">Karnataka</SelectItem>
                      <SelectItem value="KL">Kerala</SelectItem>
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
                      <SelectItem value="TG">Telangana</SelectItem>
                      <SelectItem value="TR">Tripura</SelectItem>
                      <SelectItem value="UP">Uttar Pradesh</SelectItem>
                      <SelectItem value="UK">Uttarakhand</SelectItem>
                      <SelectItem value="WB">West Bengal</SelectItem>
                      <SelectItem value="DL">Delhi</SelectItem>
                      <SelectItem value="JK">Jammu & Kashmir</SelectItem>
                      <SelectItem value="LA">Ladakh</SelectItem>
                      <SelectItem value="CH">Chandigarh</SelectItem>
                      <SelectItem value="PY">Puducherry</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.state && (
                    <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="pinCode">PIN Code *</Label>
                  <Input
                    id="pinCode"
                    value={formData.pinCode}
                    onChange={(e) => handleInputChange("pinCode", e.target.value)}
                    className={errors.pinCode ? "border-red-500" : ""}
                    placeholder="500001"
                    maxLength={6}
                  />
                  {errors.pinCode && (
                    <p className="text-red-500 text-sm mt-1">{errors.pinCode}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Employment Information */}
          <Card className="form-section">
            <CardHeader>
              <CardTitle className="text-lg">Employment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="employmentStatus">Employment Status *</Label>
                <Select value={formData.employmentStatus} onValueChange={(value) => handleInputChange("employmentStatus", value)}>
                  <SelectTrigger className={errors.employmentStatus ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select employment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employed">Salaried</SelectItem>
                    <SelectItem value="self-employed">Self-Employed</SelectItem>
                    <SelectItem value="unemployed">Unemployed</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.employmentStatus && (
                  <p className="text-red-500 text-sm mt-1">{errors.employmentStatus}</p>
                )}
              </div>

              {formData.employmentStatus === "employed" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="employerName">Employer Name *</Label>
                    <Input
                      id="employerName"
                      value={formData.employerName}
                      onChange={(e) => handleInputChange("employerName", e.target.value)}
                      className={errors.employerName ? "border-red-500" : ""}
                    />
                    {errors.employerName && (
                      <p className="text-red-500 text-sm mt-1">{errors.employerName}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input
                      id="jobTitle"
                      value={formData.jobTitle}
                      onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="annualIncome">Annual Income *</Label>
                <Select value={formData.annualIncome} onValueChange={(value) => handleInputChange("annualIncome", value)}>
                  <SelectTrigger className={errors.annualIncome ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select annual income range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-2.5L">Under &#8377;2.5 Lakhs</SelectItem>
                    <SelectItem value="2.5L-5L">&#8377;2.5 Lakhs - &#8377;5 Lakhs</SelectItem>
                    <SelectItem value="5L-7.5L">&#8377;5 Lakhs - &#8377;7.5 Lakhs</SelectItem>
                    <SelectItem value="7.5L-10L">&#8377;7.5 Lakhs - &#8377;10 Lakhs</SelectItem>
                    <SelectItem value="10L-15L">&#8377;10 Lakhs - &#8377;15 Lakhs</SelectItem>
                    <SelectItem value="15L-25L">&#8377;15 Lakhs - &#8377;25 Lakhs</SelectItem>
                    <SelectItem value="over-25L">Over &#8377;25 Lakhs</SelectItem>
                  </SelectContent>
                </Select>
                {errors.annualIncome && (
                  <p className="text-red-500 text-sm mt-1">{errors.annualIncome}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Account Preferences */}
          <Card className="form-section">
            <CardHeader>
              <CardTitle className="text-lg">Account Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="initialDeposit">Initial Deposit Amount (&#8377;) *</Label>
                <Input
                  id="initialDeposit"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.initialDeposit}
                  onChange={(e) => handleInputChange("initialDeposit", e.target.value)}
                  className={errors.initialDeposit ? "border-red-500" : ""}
                  placeholder="0.00"
                />
                {errors.initialDeposit && (
                  <p className="text-red-500 text-sm mt-1">{errors.initialDeposit}</p>
                )}
                <p className="text-sm text-gray-600 mt-1">
                  Minimum initial deposit: &#8377;500 for Basic Savings account
                </p>
              </div>

              <div>
                <Label htmlFor="accountPurpose">Primary Use of Account</Label>
                <Select value={formData.accountPurpose} onValueChange={(value) => handleInputChange("accountPurpose", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select primary use" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily-expenses">Daily Expenses</SelectItem>
                    <SelectItem value="bill-payments">Bill Payments</SelectItem>
                    <SelectItem value="savings">Savings</SelectItem>
                    <SelectItem value="salary-account">Salary Account</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasExistingAccount"
                  checked={formData.hasExistingAccount}
                  onCheckedChange={(checked) => handleInputChange("hasExistingAccount", checked as boolean)}
                />
                <Label htmlFor="hasExistingAccount">I currently have an account with Credit Lens</Label>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card className="form-section">
            <CardHeader>
              <CardTitle className="text-lg">Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="additionalInfo">Additional Comments (Optional)</Label>
                <Textarea
                  id="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                  placeholder="Please provide any additional information that might be helpful..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Terms and Conditions */}
          <Card className="form-section form-section-accent">
            <CardHeader>
              <CardTitle className="text-lg">Terms and Conditions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h4 className="font-semibold text-sm mb-2">Account Agreement Summary</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Account opening subject to KYC verification and approval</li>
                  <li>• Minimum balance requirements may apply</li>
                  <li>• Service charges as per RBI guidelines</li>
                  <li>• Overdraft protection available upon request</li>
                  <li>• Net banking and UPI services included</li>
                  <li>• DICGC insured up to &#8377;5,00,000 per depositor</li>
                </ul>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                  className={errors.agreeToTerms ? "border-red-500" : ""}
                />
                <Label htmlFor="agreeToTerms" className="text-sm">
                  I agree to the <button
                    type="button"
                    className="text-blue-600 hover:underline font-medium"
                    onClick={() =>
                      toast({
                        title: "Terms & Conditions",
                        description: "By opening an account, you agree to our standard banking terms including fees, transaction limits, and electronic services. Full terms at creditlens.in/terms.",
                      })
                    }
                  >Terms and Conditions</button> and
                  <button
                    type="button"
                    className="ml-1 text-blue-600 hover:underline font-medium"
                    onClick={() =>
                      toast({
                        title: "Privacy Policy",
                        description: "We use your information to provide services, meet regulations, and improve experiences. We never sell personal data. Full policy at creditlens.in/privacy.",
                      })
                    }
                  >Privacy Policy</button> *
                </Label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-red-500 text-sm">{errors.agreeToTerms}</p>
              )}

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreeToMarketing"
                  checked={formData.agreeToMarketing}
                  onCheckedChange={(checked) => handleInputChange("agreeToMarketing", checked as boolean)}
                />
                <Label htmlFor="agreeToMarketing" className="text-sm">
                  I would like to receive marketing communications from Credit Lens about products, services, and special offers
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <p>By submitting this application you agree to our terms and conditions.</p>
              <p className="text-gray-500">Application ID: {applicationId}</p>
            </div>
            <Button type="submit" className="px-6 py-2" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BasicCheckingApplicationForm;
