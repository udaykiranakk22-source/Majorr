import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CreditCard, Home, TrendingUp, Shield, PiggyBank, Briefcase, Users, Building2, IndianRupee, Target } from "lucide-react";
import { Link } from "react-router-dom";

const ServicesSection = () => {
  const services = [
    {
      icon: <Users className="h-8 w-8" />,
      title: "Loan Eligibility Check",
      description: "Instantly check your eligibility for home loans, personal loans, and more based on your financial profile.",
      features: ["Home Loan Eligibility", "Personal Loan Check", "Auto Loan Assessment", "Education Loan", "Instant Results", "Multi-Lender Comparison"],
      route: "/personal-banking"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "CIBIL Score Simulation",
      description: "Simulate how your actions impact your credit score. Understand what drives your CIBIL rating.",
      features: ["Score Prediction", "What-If Analysis", "Credit Factor Breakdown", "Improvement Roadmap", "Score History", "Alert Notifications"],
      route: "/wealth-management"
    },
    {
      icon: <Briefcase className="h-8 w-8" />,
      title: "EMI Calculator",
      description: "Calculate your monthly EMI for any loan amount, tenure, and interest rate with detailed amortisation schedules.",
      features: ["Loan EMI Planner", "Amortisation Schedule", "Prepayment Analysis", "Rate Comparison", "Affordability Check", "Export Reports"],
      route: "/business-banking"
    },
    {
      icon: <Building2 className="h-8 w-8" />,
      title: "Document Checklist",
      description: "Get a personalised document checklist for your loan application based on loan type and lender requirements.",
      features: ["PAN & Aadhaar Verification", "Income Proof Guide", "Property Documents", "Bank Statements", "Employment Proof", "Lender-Specific Lists"],
      route: "/corporate-banking"
    },
    {
      icon: <CreditCard className="h-8 w-8" />,
      title: "Score Improvement Guide",
      description: "Actionable steps to boost your credit score, tailored to your current financial situation.",
      features: ["Personalised Tips", "Debt Management Plan", "Credit Utilisation Optimiser", "Payment Reminders", "Credit Mix Advice", "Progress Tracking"],
      route: "/services/banking-cards"
    },
    {
      icon: <Home className="h-8 w-8" />,
      title: "Loan Comparison",
      description: "Compare loan offers from top Indian banks and NBFCs side by side with transparent terms.",
      features: ["Interest Rate Comparison", "Processing Fee Analysis", "Tenure Flexibility", "Prepayment Charges", "Top Bank Offers", "NBFC Options"],
      route: "/services/mortgages-loans"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Investment Services",
      description: "Grow your wealth with curated mutual funds, SIPs, and retirement planning solutions.",
      features: ["Mutual Fund Advisory", "SIP Calculator", "Tax-Saving Funds", "NPS Planning", "PPF & EPF Guide", "Goal-Based Investing"],
      route: "/services/investment-services"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Digital Security",
      description: "Advanced security features to protect your financial information and transactions.",
      features: ["Fraud Protection", "Secure Banking", "Aadhaar-Based eKYC", "Two-Factor Authentication", "Biometric Login", "Transaction Alerts"],
      route: "/services/digital-security"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[hsl(var(--credit-lens-primary))] mb-4">
            Intelligent Loan & Financial Tools
          </h2>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
            From loan eligibility checks to CIBIL score simulation, we provide comprehensive financial tools tailored to the Indian banking ecosystem.
            Whether you're an individual checking your home loan eligibility, a small business seeking MSME funding, or planning your investments,
            our intelligent platform helps you make informed financial decisions with explainable insights.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {services.map((service, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden border border-border/40 bg-gradient-to-b from-background/95 via-background/80 to-background/95 shadow-[var(--shadow-card)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[var(--shadow-elevated)] animate-in fade-in slide-in-from-bottom-6"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[hsl(var(--credit-lens-primary))] via-[hsl(var(--credit-lens-secondary))] to-[hsl(var(--credit-lens-primary))] opacity-70 group-hover:opacity-100 transition-opacity" />
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[hsl(var(--credit-lens-secondary)_/_0.08)] blur-3xl transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute -left-16 bottom-0 h-32 w-32 rounded-full bg-[hsl(var(--credit-lens-primary)_/_0.06)] blur-3xl transition-transform duration-700 group-hover:translate-y-2" />

              <CardHeader className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[hsl(var(--credit-lens-primary))] to-[hsl(var(--credit-lens-secondary))] shadow-lg flex items-center justify-center text-white mb-4 transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl">
                  {service.icon}
                </div>
                <CardTitle className="text-xl font-semibold text-foreground tracking-tight group-hover:text-[hsl(var(--credit-lens-primary))] transition-colors">
                  {service.title}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <ul className="space-y-2.5 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center text-sm text-muted-foreground transition-colors duration-300 group-hover:text-foreground"
                    >
                      <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-[hsl(var(--credit-lens-secondary)_/_0.15)] text-[hsl(var(--credit-lens-secondary))] transition-all duration-300 group-hover:bg-[hsl(var(--credit-lens-primary)_/_0.2)] group-hover:text-[hsl(var(--credit-lens-primary))]">
                        <span className="block h-1.5 w-1.5 rounded-full bg-current" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to={service.route}>
                  <Button
                    variant="ghost"
                    className="group/link relative h-auto p-0 font-semibold text-[hsl(var(--credit-lens-primary))] transition-all duration-300 hover:text-[hsl(var(--credit-lens-secondary))]"
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ServicesSection;
