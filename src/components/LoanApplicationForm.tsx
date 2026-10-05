import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface LoanApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  loanType: string;
  onSuccess?: () => void;
}

const LoanApplicationForm = ({ isOpen, onClose, loanType, onSuccess }: LoanApplicationFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

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
    workPhone: "",

    // Loan Information
    loanAmount: "",
    loanPurpose: "",
    loanTenureMonths: "",
    downPayment: "",
    propertyValue: "", // For Home Loan
    vehicleYear: "", // For Auto Loan
    vehicleMake: "", // For Auto Loan
    vehicleModel: "", // For Auto Loan
    courseName: "", // For Education Loan
    institutionName: "", // For Education Loan

    // Additional Information
    additionalInfo: "",
    agreeToTerms: false,
    agreeToMarketing: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Personal Information
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";

    // PAN validation
    if (!formData.panNumber.trim()) {
      newErrors.panNumber = "PAN number is required";
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(formData.panNumber.trim())) {
      newErrors.panNumber = "Invalid PAN format (e.g., ABCDE1234F)";
    }

    // Aadhaar validation
    if (!formData.aadhaarNumber.trim()) {
      newErrors.aadhaarNumber = "Aadhaar number is required";
    } else if (!/^\d{12}$/.test(formData.aadhaarNumber.trim())) {
      newErrors.aadhaarNumber = "Aadhaar number must be exactly 12 digits";
    }

    // Address Information
    if (!formData.streetAddress.trim()) newErrors.streetAddress = "Street address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";

    // PIN code validation
    if (!formData.pinCode.trim()) {
      newErrors.pinCode = "PIN code is required";
    } else if (!/^\d{6}$/.test(formData.pinCode.trim())) {
      newErrors.pinCode = "PIN code must be exactly 6 digits";
    }

    // Employment Information
    if (!formData.employmentStatus) newErrors.employmentStatus = "Employment status is required";
    if (!formData.annualIncome) newErrors.annualIncome = "Annual income is required";

    // Loan Information
    if (!formData.loanAmount.trim()) newErrors.loanAmount = "Loan amount is required";
    if (!formData.loanPurpose) newErrors.loanPurpose = "Loan purpose is required";
    if (!formData.loanTenureMonths) newErrors.loanTenureMonths = "Loan tenure is required";

    // Loan-specific validations
    if (loanType === "Auto Loan") {
      if (!formData.vehicleYear.trim()) newErrors.vehicleYear = "Vehicle year is required";
      if (!formData.vehicleMake.trim()) newErrors.vehicleMake = "Vehicle make is required";
      if (!formData.vehicleModel.trim()) newErrors.vehicleModel = "Vehicle model is required";
    }

    if (loanType === "Home Loan") {
      if (!formData.propertyValue.trim()) newErrors.propertyValue = "Property value is required";
    }

    if (loanType === "Education Loan") {
      if (!formData.courseName.trim()) newErrors.courseName = "Course name is required";
      if (!formData.institutionName.trim()) newErrors.institutionName = "Institution name is required";
    }

    // Terms and Conditions
    if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the terms and conditions";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const token = localStorage.getItem("token");

      const applicationData = {
        loanType,
        ...formData,
        loanAmount: parseFloat(formData.loanAmount),
        downPayment: formData.downPayment ? parseFloat(formData.downPayment) : 0,
        propertyValue: formData.propertyValue ? parseFloat(formData.propertyValue) : 0
      };

      console.log('Submitting loan application:', applicationData);

      const response = await fetch('http://localhost:3001/loan-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
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
        throw new Error(errorData.message || 'Failed to submit loan application');
      }

      const result = await response.json();

      if (result.success !== false) {
        setIsSubmitted(true);
        console.log('Loan application submitted successfully');
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess();
        }
      } else {
        throw new Error(result.message || 'Failed to submit loan application');
      }
    } catch (error: any) {
      console.error('Error submitting loan application:', error);
      const errorMessage = error.message || (error instanceof TypeError && error.message.includes('fetch')
        ? "Unable to connect to server. Please ensure the backend is running on port 3001."
        : "Network error. Please try again.");
      setSubmissionError(errorMessage);
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
      workPhone: "",
      loanAmount: "",
      loanPurpose: "",
      loanTenureMonths: "",
      downPayment: "",
      propertyValue: "",
      vehicleYear: "",
      vehicleMake: "",
      vehicleModel: "",
      courseName: "",
      institutionName: "",
      additionalInfo: "",
      agreeToTerms: false,
      agreeToMarketing: false
    });
    setErrors({});
    setIsSubmitted(false);
    setSubmissionError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getLoanSpecificFields = () => {
    if (loanType === "Auto Loan") {
      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="vehicleYear">Vehicle Year *</Label>
              <Input
                id="vehicleYear"
                type="number"
                placeholder="2023"
                value={formData.vehicleYear}
                onChange={(e) => handleChange('vehicleYear', e.target.value)}
                className={errors.vehicleYear ? "border-red-500" : ""}
              />
              {errors.vehicleYear && <p className="text-red-500 text-sm">{errors.vehicleYear}</p>}
            </div>
            <div>
              <Label htmlFor="vehicleMake">Vehicle Make *</Label>
              <Input
                id="vehicleMake"
                type="text"
                placeholder="Maruti Suzuki"
                value={formData.vehicleMake}
                onChange={(e) => handleChange('vehicleMake', e.target.value)}
                className={errors.vehicleMake ? "border-red-500" : ""}
              />
              {errors.vehicleMake && <p className="text-red-500 text-sm">{errors.vehicleMake}</p>}
            </div>
            <div>
              <Label htmlFor="vehicleModel">Vehicle Model *</Label>
              <Input
                id="vehicleModel"
                type="text"
                placeholder="Swift"
                value={formData.vehicleModel}
                onChange={(e) => handleChange('vehicleModel', e.target.value)}
                className={errors.vehicleModel ? "border-red-500" : ""}
              />
              {errors.vehicleModel && <p className="text-red-500 text-sm">{errors.vehicleModel}</p>}
            </div>
          </div>
        </>
      );
    }

    if (loanType === "Home Loan") {
      return (
        <div>
          <Label htmlFor="propertyValue">Property Value (in INR) *</Label>
          <Input
            id="propertyValue"
            type="number"
            placeholder="5000000"
            value={formData.propertyValue}
            onChange={(e) => handleChange('propertyValue', e.target.value)}
            className={errors.propertyValue ? "border-red-500" : ""}
          />
          {errors.propertyValue && <p className="text-red-500 text-sm">{errors.propertyValue}</p>}
        </div>
      );
    }

    if (loanType === "Education Loan") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="courseName">Course Name *</Label>
            <Input
              id="courseName"
              type="text"
              placeholder="B.Tech Computer Science"
              value={formData.courseName}
              onChange={(e) => handleChange('courseName', e.target.value)}
              className={errors.courseName ? "border-red-500" : ""}
            />
            {errors.courseName && <p className="text-red-500 text-sm">{errors.courseName}</p>}
          </div>
          <div>
            <Label htmlFor="institutionName">Institution Name *</Label>
            <Input
              id="institutionName"
              type="text"
              placeholder="IIT Hyderabad"
              value={formData.institutionName}
              onChange={(e) => handleChange('institutionName', e.target.value)}
              className={errors.institutionName ? "border-red-500" : ""}
            />
            {errors.institutionName && <p className="text-red-500 text-sm">{errors.institutionName}</p>}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-6">
            {loanType} Application
          </DialogTitle>
        </DialogHeader>

        {!isSubmitted ? (
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
                      type="text"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      className={errors.firstName ? "border-red-500" : ""}
                    />
                    {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                  </div>

                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      className={errors.lastName ? "border-red-500" : ""}
                    />
                    {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                      className={errors.dateOfBirth ? "border-red-500" : ""}
                    />
                    {errors.dateOfBirth && <p className="text-red-500 text-sm">{errors.dateOfBirth}</p>}
                  </div>

                  <div>
                    <Label htmlFor="panNumber">PAN Number *</Label>
                    <Input
                      id="panNumber"
                      type="text"
                      placeholder="ABCDE1234F"
                      value={formData.panNumber}
                      onChange={(e) => handleChange('panNumber', e.target.value.toUpperCase())}
                      maxLength={10}
                      className={errors.panNumber ? "border-red-500" : ""}
                    />
                    {errors.panNumber && <p className="text-red-500 text-sm">{errors.panNumber}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="aadhaarNumber">Aadhaar Number *</Label>
                    <Input
                      id="aadhaarNumber"
                      type="text"
                      placeholder="1234 5678 9012"
                      value={formData.aadhaarNumber}
                      onChange={(e) => handleChange('aadhaarNumber', e.target.value.replace(/\D/g, ''))}
                      maxLength={12}
                      className={errors.aadhaarNumber ? "border-red-500" : ""}
                    />
                    {errors.aadhaarNumber && <p className="text-red-500 text-sm">{errors.aadhaarNumber}</p>}
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
                    type="text"
                    placeholder="123 MG Road"
                    value={formData.streetAddress}
                    onChange={(e) => handleChange('streetAddress', e.target.value)}
                    className={errors.streetAddress ? "border-red-500" : ""}
                  />
                  {errors.streetAddress && <p className="text-red-500 text-sm">{errors.streetAddress}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      type="text"
                      placeholder="Hyderabad"
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      className={errors.city ? "border-red-500" : ""}
                    />
                    {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
                  </div>

                  <div>
                    <Label htmlFor="state">State / UT *</Label>
                    <Select value={formData.state} onValueChange={(value) => handleChange('state', value)}>
                      <SelectTrigger className={errors.state ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AN">Andaman and Nicobar Islands</SelectItem>
                        <SelectItem value="AP">Andhra Pradesh</SelectItem>
                        <SelectItem value="AR">Arunachal Pradesh</SelectItem>
                        <SelectItem value="AS">Assam</SelectItem>
                        <SelectItem value="BR">Bihar</SelectItem>
                        <SelectItem value="CH">Chandigarh</SelectItem>
                        <SelectItem value="CG">Chhattisgarh</SelectItem>
                        <SelectItem value="DN">Dadra and Nagar Haveli and Daman and Diu</SelectItem>
                        <SelectItem value="DL">Delhi</SelectItem>
                        <SelectItem value="DLNCR">Delhi NCR</SelectItem>
                        <SelectItem value="GA">Goa</SelectItem>
                        <SelectItem value="GJ">Gujarat</SelectItem>
                        <SelectItem value="HR">Haryana</SelectItem>
                        <SelectItem value="HP">Himachal Pradesh</SelectItem>
                        <SelectItem value="JK">Jammu and Kashmir</SelectItem>
                        <SelectItem value="JH">Jharkhand</SelectItem>
                        <SelectItem value="KA">Karnataka</SelectItem>
                        <SelectItem value="KL">Kerala</SelectItem>
                        <SelectItem value="LA">Ladakh</SelectItem>
                        <SelectItem value="LD">Lakshadweep</SelectItem>
                        <SelectItem value="MP">Madhya Pradesh</SelectItem>
                        <SelectItem value="MH">Maharashtra</SelectItem>
                        <SelectItem value="MN">Manipur</SelectItem>
                        <SelectItem value="ML">Meghalaya</SelectItem>
                        <SelectItem value="MZ">Mizoram</SelectItem>
                        <SelectItem value="NL">Nagaland</SelectItem>
                        <SelectItem value="OD">Odisha</SelectItem>
                        <SelectItem value="PY">Puducherry</SelectItem>
                        <SelectItem value="PB">Punjab</SelectItem>
                        <SelectItem value="RJ">Rajasthan</SelectItem>
                        <SelectItem value="SK">Sikkim</SelectItem>
                        <SelectItem value="TN">Tamil Nadu</SelectItem>
                        <SelectItem value="TS">Telangana</SelectItem>
                        <SelectItem value="TR">Tripura</SelectItem>
                        <SelectItem value="UP">Uttar Pradesh</SelectItem>
                        <SelectItem value="UK">Uttarakhand</SelectItem>
                        <SelectItem value="WB">West Bengal</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
                  </div>

                  <div>
                    <Label htmlFor="pinCode">PIN Code *</Label>
                    <Input
                      id="pinCode"
                      type="text"
                      placeholder="500001"
                      value={formData.pinCode}
                      onChange={(e) => handleChange('pinCode', e.target.value.replace(/\D/g, ''))}
                      maxLength={6}
                      className={errors.pinCode ? "border-red-500" : ""}
                    />
                    {errors.pinCode && <p className="text-red-500 text-sm">{errors.pinCode}</p>}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="employmentStatus">Employment Status *</Label>
                    <Select value={formData.employmentStatus} onValueChange={(value) => handleChange('employmentStatus', value)}>
                      <SelectTrigger className={errors.employmentStatus ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select employment status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="salaried">Salaried</SelectItem>
                        <SelectItem value="self-employed">Self-Employed</SelectItem>
                        <SelectItem value="business-owner">Business Owner</SelectItem>
                        <SelectItem value="government">Government Employee</SelectItem>
                        <SelectItem value="unemployed">Unemployed</SelectItem>
                        <SelectItem value="retired">Retired</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.employmentStatus && <p className="text-red-500 text-sm">{errors.employmentStatus}</p>}
                  </div>

                  <div>
                    <Label htmlFor="annualIncome">Annual Income *</Label>
                    <Select value={formData.annualIncome} onValueChange={(value) => handleChange('annualIncome', value)}>
                      <SelectTrigger className={errors.annualIncome ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select annual income" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-2.5L">Under &#8377;2.5 Lakhs</SelectItem>
                        <SelectItem value="2.5L-5L">&#8377;2.5 - &#8377;5 Lakhs</SelectItem>
                        <SelectItem value="5L-7.5L">&#8377;5 - &#8377;7.5 Lakhs</SelectItem>
                        <SelectItem value="7.5L-10L">&#8377;7.5 - &#8377;10 Lakhs</SelectItem>
                        <SelectItem value="10L-15L">&#8377;10 - &#8377;15 Lakhs</SelectItem>
                        <SelectItem value="15L-25L">&#8377;15 - &#8377;25 Lakhs</SelectItem>
                        <SelectItem value="over-25L">Over &#8377;25 Lakhs</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.annualIncome && <p className="text-red-500 text-sm">{errors.annualIncome}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="employerName">Employer Name</Label>
                    <Input
                      id="employerName"
                      type="text"
                      placeholder="Company Name"
                      value={formData.employerName}
                      onChange={(e) => handleChange('employerName', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input
                      id="jobTitle"
                      type="text"
                      placeholder="Software Engineer"
                      value={formData.jobTitle}
                      onChange={(e) => handleChange('jobTitle', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Loan Information */}
            <Card className="form-section">
              <CardHeader>
                <CardTitle className="text-lg">Loan Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="loanAmount">Loan Amount (in INR) *</Label>
                    <Input
                      id="loanAmount"
                      type="number"
                      placeholder="500000"
                      value={formData.loanAmount}
                      onChange={(e) => handleChange('loanAmount', e.target.value)}
                      className={errors.loanAmount ? "border-red-500" : ""}
                    />
                    {errors.loanAmount && <p className="text-red-500 text-sm">{errors.loanAmount}</p>}
                  </div>

                  <div>
                    <Label htmlFor="loanPurpose">Loan Purpose *</Label>
                    <Select value={formData.loanPurpose} onValueChange={(value) => handleChange('loanPurpose', value)}>
                      <SelectTrigger className={errors.loanPurpose ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select loan purpose" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="home-purchase">Home Purchase</SelectItem>
                        <SelectItem value="home-construction">Home Construction</SelectItem>
                        <SelectItem value="home-renovation">Home Renovation</SelectItem>
                        <SelectItem value="vehicle-purchase">Vehicle Purchase</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="wedding">Wedding</SelectItem>
                        <SelectItem value="medical">Medical</SelectItem>
                        <SelectItem value="business-expansion">Business Expansion</SelectItem>
                        <SelectItem value="debt-consolidation">Debt Consolidation</SelectItem>
                        <SelectItem value="agriculture">Agriculture</SelectItem>
                        <SelectItem value="travel">Travel</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.loanPurpose && <p className="text-red-500 text-sm">{errors.loanPurpose}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="loanTenureMonths">Loan Tenure *</Label>
                    <Select value={formData.loanTenureMonths} onValueChange={(value) => handleChange('loanTenureMonths', value)}>
                      <SelectTrigger className={errors.loanTenureMonths ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select loan tenure" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12">12 Months (1 Year)</SelectItem>
                        <SelectItem value="24">24 Months (2 Years)</SelectItem>
                        <SelectItem value="36">36 Months (3 Years)</SelectItem>
                        <SelectItem value="48">48 Months (4 Years)</SelectItem>
                        <SelectItem value="60">60 Months (5 Years)</SelectItem>
                        <SelectItem value="84">84 Months (7 Years)</SelectItem>
                        <SelectItem value="120">120 Months (10 Years)</SelectItem>
                        <SelectItem value="180">180 Months (15 Years)</SelectItem>
                        <SelectItem value="240">240 Months (20 Years)</SelectItem>
                        <SelectItem value="360">360 Months (30 Years)</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.loanTenureMonths && <p className="text-red-500 text-sm">{errors.loanTenureMonths}</p>}
                  </div>

                  <div>
                    <Label htmlFor="downPayment">Down Payment (in INR)</Label>
                    <Input
                      id="downPayment"
                      type="number"
                      placeholder="100000"
                      value={formData.downPayment}
                      onChange={(e) => handleChange('downPayment', e.target.value)}
                    />
                  </div>
                </div>

                {getLoanSpecificFields()}

                <div>
                  <Label htmlFor="additionalInfo">Additional Information</Label>
                  <textarea
                    id="additionalInfo"
                    className="w-full p-3 border border-gray-300 rounded-md resize-none"
                    rows={3}
                    placeholder="Any additional information you'd like to share..."
                    value={formData.additionalInfo}
                    onChange={(e) => handleChange('additionalInfo', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Terms and Conditions */}
            <Card className="form-section form-section-accent">
              <CardHeader>
                <CardTitle className="text-lg">Terms and Conditions</CardTitle>
                <CardDescription>
                  Please review the terms and conditions before submitting your application.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h4 className="font-semibold text-sm mb-2">Loan Agreement Summary</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>&#8226; Loan approval subject to CIBIL score verification and income verification as per RBI guidelines</li>
                    <li>&#8226; Interest rates and terms based on creditworthiness and applicable RBI norms</li>
                    <li>&#8226; Prepayment and foreclosure charges may apply as per RBI regulations</li>
                    <li>&#8226; Property insurance required for secured loans</li>
                    <li>&#8226; Processing fees and applicable GST will be charged as per schedule</li>
                    <li>&#8226; All loans subject to final approval, documentation, and KYC verification</li>
                    <li>&#8226; Your PAN and Aadhaar details will be verified with government databases</li>
                  </ul>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleChange('agreeToTerms', checked as boolean)}
                    className={errors.agreeToTerms ? "border-red-500" : ""}
                  />
                  <Label htmlFor="agreeToTerms" className="text-sm">
                    I agree to the <button
                      type="button"
                      className="text-blue-600 hover:underline font-medium"
                      onClick={() =>
                        toast({
                          title: "Loan Terms & Conditions",
                          description: "Review interest rates, repayment terms, and lending conditions at creditlens.in/loan-terms.",
                        })
                      }
                    >Terms and Conditions</button> and <button
                      type="button"
                      className="text-blue-600 hover:underline font-medium"
                      onClick={() =>
                        toast({
                          title: "Privacy Policy",
                          description: "See how we handle your information at creditlens.in/privacy. We comply with RBI data protection norms and never sell personal data.",
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
                    onCheckedChange={(checked) => handleChange('agreeToMarketing', checked as boolean)}
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
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="form-surface text-center space-y-4">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">Loan Application Submitted Successfully!</h3>
            <p className="text-green-600 mb-4">
              Thank you for your loan application. Our team will verify your details and get back to you soon.
            </p>
            <Button onClick={handleClose} className="bg-green-600 hover:bg-green-700">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LoanApplicationForm;
