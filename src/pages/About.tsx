import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, Users, Award, Heart, TrendingUp, Shield, Globe, Building2, Target, Zap, CheckCircle2, Calendar, MapPin, DollarSign, Briefcase, Star, Lightbulb, Handshake } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <main>
        {/* Hero Section */}
        <div className="relative pt-16 pb-0 bg-gradient-to-r from-[hsl(var(--blue-600))] via-[hsl(var(--blue-700))] to-[hsl(var(--blue-600))] overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
          <div className="container mx-auto px-4 pb-16 relative z-10">
            <div className="flex items-center mb-6">
              <Link to="/">
                <Button variant="ghost" className="text-white hover:bg-white/20 p-2 rounded-full">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="max-w-4xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <Building2 className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold text-white mb-2">Our Story</h1>
                  <p className="text-lg text-white/90">
                    Pioneering intelligent loan eligibility in India
                  </p>
                </div>
              </div>
              <p className="text-xl text-white/95 leading-relaxed">
                Credit Lens is India's leading intelligent loan eligibility platform, empowering individuals, families, and businesses to make informed financial decisions. Built on cutting-edge AI and deep understanding of Indian banking, our platform simplifies loan assessment and financial planning for millions across the country.
              </p>
            </div>
          </div>
        </div>

        {/* Company Stats - Enhanced */}
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-[hsl(var(--blue-600))] mb-4">Credit Lens by the Numbers</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Our impact and reach across the communities we serve
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: Users, value: "25L+", label: "Registered Users", color: "from-blue-500 to-blue-600" },
                  { icon: Handshake, value: "80+", label: "Bank & NBFC Partners", color: "from-green-500 to-green-600" },
                  { icon: MapPin, value: "28", label: "States Covered", color: "from-purple-500 to-purple-600" },
                  { icon: TrendingUp, value: "₹15,000 Cr+", label: "Loans Facilitated", color: "from-orange-500 to-orange-600" },
                  { icon: Briefcase, value: "500+", label: "Team Members", color: "from-teal-500 to-teal-600" },
                  { icon: Globe, value: "12", label: "Languages Supported", color: "from-pink-500 to-pink-600" },
                  { icon: Star, value: "4.8/5", label: "User Rating", color: "from-yellow-500 to-yellow-600" },
                  { icon: Award, value: "20+", label: "Industry Awards", color: "from-indigo-500 to-indigo-600" }
                ].map((stat, idx) => {
                  const IconComponent = stat.icon;
                  return (
                    <Card key={idx} className="text-center border-2 hover:shadow-xl transition-all duration-300">
                      <CardHeader className="bg-gradient-to-br from-[hsl(var(--blue-600))/5] to-transparent">
                        <div className="flex justify-center mb-4">
                          <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-full text-white`}>
                            <IconComponent className="h-6 w-6" />
                          </div>
                        </div>
                        <div className="text-4xl font-bold text-[hsl(var(--blue-600))] mb-2">{stat.value}</div>
                        <CardDescription className="text-base font-medium">{stat.label}</CardDescription>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Company History - Enhanced Timeline */}
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[hsl(var(--blue-600))] to-[hsl(var(--blue-700))] text-white mb-4">
                  <Calendar className="h-8 w-8" />
                </div>
                <h2 className="text-4xl font-bold text-[hsl(var(--blue-600))] mb-4">Our Journey</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  From a bold idea to India's most trusted loan eligibility platform
                </p>
              </div>
              
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[hsl(var(--blue-600))] to-[hsl(var(--blue-700))] hidden md:block"></div>
                
                <div className="space-y-12">
                  {[
                    {
                      year: "2018",
                      title: "The Idea",
                      content: "Credit Lens was conceived by a team of fintech engineers and banking veterans who saw how difficult and opaque the loan eligibility process was for millions of Indians. With a seed fund of ₹2 crore, they set out to build an AI-driven platform that would demystify credit assessment and empower every citizen to understand their borrowing potential instantly.",
                      icon: Lightbulb,
                      color: "from-blue-500 to-blue-600",
                      achievements: ["Founded in Bangalore", "Seed round of ₹2 Cr", "Core AI engine built"]
                    },
                    {
                      year: "2019",
                      title: "Platform Launch",
                      content: "Credit Lens launched its first platform, offering instant loan eligibility checks across personal loans, home loans, and vehicle loans. Partnering with leading Indian banks and NBFCs, we brought transparency to the credit process. Within months, over 50,000 users had checked their loan eligibility through our platform.",
                      icon: Zap,
                      color: "from-green-500 to-green-600",
                      achievements: ["Platform launched", "50,000+ users in Year 1", "10+ bank partnerships"]
                    },
                    {
                      year: "2020",
                      title: "Pan-India Expansion",
                      content: "Despite the challenges of the pandemic, Credit Lens expanded its services across all 28 states and 8 union territories. We integrated with India Stack — Aadhaar, UPI, and DigiLocker — to offer seamless digital verification. Our contactless onboarding became a lifeline for borrowers during lockdowns.",
                      icon: MapPin,
                      color: "from-purple-500 to-purple-600",
                      achievements: ["All 28 states covered", "India Stack integration", "1 lakh+ monthly users"]
                    },
                    {
                      year: "2021-2022",
                      title: "Series B & Smart Features",
                      content: "Credit Lens raised ₹120 crore in Series B funding led by top-tier Indian and global investors. We launched Credit Score Insights, EMI Planning tools, and our proprietary Loan Match algorithm that recommends the best loan products from 50+ lending partners based on each user's unique financial profile.",
                      icon: TrendingUp,
                      color: "from-orange-500 to-orange-600",
                      achievements: ["₹120 Cr Series B", "50+ lending partners", "Loan Match algorithm launched"]
                    },
                    {
                      year: "2023",
                      title: "AI-Powered Intelligence",
                      content: "We introduced Credit Lens Assist, our AI-powered financial advisor that helps users understand their creditworthiness, plan repayments, and compare loan offers in real time. The platform crossed 10 lakh registered users and processed over ₹5,000 crore in loan applications through partner institutions.",
                      icon: Award,
                      color: "from-teal-500 to-teal-600",
                      achievements: ["AI advisor launched", "10L+ registered users", "₹5,000 Cr loans facilitated"]
                    },
                    {
                      year: "2024",
                      title: "MSME & Rural Reach",
                      content: "Credit Lens expanded into MSME lending and launched vernacular language support in 12 Indian languages, bringing intelligent loan eligibility assessment to Tier 2, Tier 3 cities and rural India. Our partnerships with cooperative banks and microfinance institutions extended financial inclusion to underserved communities.",
                      icon: Globe,
                      color: "from-pink-500 to-pink-600",
                      achievements: ["12 language support", "MSME lending launched", "Rural India outreach"]
                    },
                    {
                      year: "Today",
                      title: "India's Trusted Credit Platform",
                      content: "Today, Credit Lens serves over 25 lakh users across India, partnering with 80+ banks and NBFCs. Our platform has facilitated over ₹15,000 crore in loan disbursals. With offices in Mumbai, Bangalore, Delhi, and Hyderabad, we continue to innovate with features like predictive eligibility, real-time offer comparison, and comprehensive financial wellness tools.",
                      icon: Star,
                      color: "from-[hsl(var(--blue-600))] to-[hsl(var(--blue-700))]",
                      achievements: ["25L+ users", "80+ bank partners", "₹15,000 Cr loans facilitated"]
                    }
                  ].map((era, idx) => {
                    const IconComponent = era.icon;
                    return (
                      <div key={idx} className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
                        {/* Timeline dot */}
                        <div className="absolute left-6 md:left-1/2 transform md:-translate-x-1/2 w-5 h-5 bg-gradient-to-br from-[hsl(var(--blue-600))] to-[hsl(var(--blue-700))] rounded-full border-4 border-white shadow-lg z-10 hidden md:block"></div>
                        
                        <div className={`md:w-1/2 ${idx % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:ml-auto md:pl-12 md:text-left'}`}>
                          <Card className={`border-2 hover:shadow-xl transition-all duration-300 ${idx % 2 === 0 ? 'md:ml-auto' : ''}`}>
                            <CardHeader className="bg-gradient-to-r from-[hsl(var(--blue-600))/5] to-transparent">
                              <div className="flex items-center gap-3 mb-3">
                                <div className={`p-2 bg-gradient-to-br ${era.color} rounded-lg text-white`}>
                                  <IconComponent className="h-5 w-5" />
                                </div>
                                <div>
                                  <Badge variant="outline" className="border-[hsl(var(--blue-600))] text-[hsl(var(--blue-600))]">
                                    {era.year}
                                  </Badge>
                                  <CardTitle className="text-2xl mt-2">{era.title}</CardTitle>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                              <p className="text-gray-700 mb-4 leading-relaxed">{era.content}</p>
                              <div className="flex flex-wrap gap-2">
                                {era.achievements.map((achievement, aIdx) => (
                                  <Badge key={aIdx} variant="secondary" className="text-xs">
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    {achievement}
                                  </Badge>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Values - Enhanced */}
        <section className="py-16 bg-gradient-to-r from-[hsl(var(--blue-600))/10] via-[hsl(var(--blue-700))/10] to-[hsl(var(--blue-600))/10]">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[hsl(var(--blue-600))] to-[hsl(var(--blue-700))] text-white mb-4">
                  <Target className="h-8 w-8" />
                </div>
                <h2 className="text-4xl font-bold text-[hsl(var(--blue-600))] mb-4">Our Mission & Values</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  The principles that guide everything we do and define who we are
                </p>
              </div>
              
              <Card className="mb-12 border-2 bg-gradient-to-r from-white to-[hsl(var(--blue-600))/5]">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <Lightbulb className="h-6 w-6 text-[hsl(var(--blue-600))]" />
                    Our Mission
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    To democratise access to credit by empowering every Indian with intelligent, transparent, and personalised loan eligibility insights. We leverage AI and deep partnerships with India's leading banks and NBFCs to simplify the borrowing journey and promote financial inclusion across the country.
                  </p>
                </CardContent>
              </Card>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: Shield,
                    title: "Trust & Security",
                    description: "We prioritize the security of our customers' financial information and maintain the highest standards of trust and integrity in all our operations. Your financial well-being is our top priority.",
                    color: "from-blue-500 to-blue-600",
                    bgColor: "bg-blue-50",
                    borderColor: "border-blue-500"
                  },
                  {
                    icon: Users,
                    title: "Customer First",
                    description: "Our customers are at the heart of everything we do. We listen, understand, and deliver solutions that meet their unique financial needs with personalized attention and care.",
                    color: "from-green-500 to-green-600",
                    bgColor: "bg-green-50",
                    borderColor: "border-green-500"
                  },
                  {
                    icon: Zap,
                    title: "Innovation",
                    description: "We embrace technology and innovation to provide cutting-edge banking solutions while maintaining the personal touch our customers value. We're always evolving to serve you better.",
                    color: "from-purple-500 to-purple-600",
                    bgColor: "bg-purple-50",
                    borderColor: "border-purple-500"
                  },
                  {
                    icon: Heart,
                    title: "Community Impact",
                    description: "We're deeply committed to supporting the communities we serve through volunteerism, charitable giving, local economic development, and financial education programs.",
                    color: "from-pink-500 to-pink-600",
                    bgColor: "bg-pink-50",
                    borderColor: "border-pink-500"
                  },
                  {
                    icon: Award,
                    title: "Excellence",
                    description: "We strive for excellence in everything we do, from customer service to financial products, ensuring the highest quality experience. Good enough is never enough.",
                    color: "from-orange-500 to-orange-600",
                    bgColor: "bg-orange-50",
                    borderColor: "border-orange-500"
                  },
                  {
                    icon: Globe,
                    title: "Sustainability",
                    description: "We're committed to sustainable banking practices and environmental responsibility, building a better future for generations to come. We invest in green initiatives and responsible lending.",
                    color: "from-teal-500 to-teal-600",
                    bgColor: "bg-teal-50",
                    borderColor: "border-teal-500"
                  }
                ].map((value, idx) => {
                  const IconComponent = value.icon;
                  return (
                    <Card key={idx} className={`text-center border-2 hover:shadow-xl transition-all duration-300`}>
                      <CardHeader className={`bg-gradient-to-r ${value.bgColor} to-transparent`}>
                        <div className="flex justify-center mb-4">
                          <div className={`p-4 bg-gradient-to-br ${value.color} rounded-full text-white`}>
                            <IconComponent className="h-6 w-6" />
                          </div>
                        </div>
                        <CardTitle className="text-lg">{value.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-gray-700 leading-relaxed">{value.description}</CardDescription>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Achievements & Recognition */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[hsl(var(--blue-600))] to-[hsl(var(--blue-700))] text-white mb-4">
                  <Award className="h-8 w-8" />
                </div>
                <h2 className="text-4xl font-bold text-[hsl(var(--blue-600))] mb-4">Recognition & Achievements</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Industry recognition for excellence in banking, customer service, and innovation
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: "Best Fintech Platform", year: "2024", organization: "NASSCOM Fintech Awards", icon: Briefcase },
                  { title: "Most Trusted Credit Platform", year: "2024", organization: "ET Financial Inclusion Summit", icon: Shield },
                  { title: "Best User Experience", year: "2023", organization: "India Fintech Forum", icon: Star },
                  { title: "Innovation in Lending Tech", year: "2023", organization: "RBI Fintech Sandbox", icon: Zap },
                  { title: "Top Startup to Work For", year: "2023", organization: "Great Place to Work India", icon: Users },
                  { title: "Financial Inclusion Champion", year: "2024", organization: "Digital India Awards", icon: Globe }
                ].map((award, idx) => {
                  const IconComponent = award.icon;
                  return (
                    <Card key={idx} className="hover:shadow-lg transition-all duration-300 border-2">
                      <CardHeader className="bg-gradient-to-r from-[hsl(var(--blue-600))/5] to-transparent">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-gradient-to-br from-[hsl(var(--blue-600))] to-[hsl(var(--blue-700))] rounded-lg text-white">
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <Badge variant="outline" className="border-[hsl(var(--blue-600))] text-[hsl(var(--blue-600))]">
                            {award.year}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{award.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-[hsl(var(--blue-600))] font-medium">
                          {award.organization}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Community Commitment */}
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[hsl(var(--blue-600))] to-[hsl(var(--blue-700))] text-white mb-4">
                  <Handshake className="h-8 w-8" />
                </div>
                <h2 className="text-4xl font-bold text-[hsl(var(--blue-600))] mb-4">Our Community Commitment</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Making a positive impact in the communities we serve
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <Card className="border-2">
                  <CardHeader className="bg-gradient-to-r from-[hsl(var(--blue-600))/5] to-transparent">
                    <CardTitle className="flex items-center gap-3">
                      <Heart className="h-6 w-6 text-[hsl(var(--blue-600))]" />
                      Community Investment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-[hsl(var(--blue-600))] mt-0.5 flex-shrink-0" />
                        <span><strong>₹80 Cr+</strong> in community grants and loans since 2020</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-[hsl(var(--blue-600))] mt-0.5 flex-shrink-0" />
                        <span><strong>10,000+</strong> volunteer hours donated by employees annually</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-[hsl(var(--blue-600))] mt-0.5 flex-shrink-0" />
                        <span><strong>₹5 Cr</strong> committed to rural financial literacy</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-[hsl(var(--blue-600))] mt-0.5 flex-shrink-0" />
                        <span><strong>₹16 Cr</strong> in small business grants awarded</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="border-2">
                  <CardHeader className="bg-gradient-to-r from-[hsl(var(--blue-700))/5] to-transparent">
                    <CardTitle className="flex items-center gap-3">
                      <Users className="h-6 w-6 text-[hsl(var(--blue-700))]" />
                      Financial Education
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-[hsl(var(--blue-700))] mt-0.5 flex-shrink-0" />
                        <span><strong>10,000+</strong> students reached through financial literacy programs</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-[hsl(var(--blue-700))] mt-0.5 flex-shrink-0" />
                        <span><strong>50+</strong> schools partnered for education initiatives</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-[hsl(var(--blue-700))] mt-0.5 flex-shrink-0" />
                        <span><strong>Free</strong> workshops and resources for all ages</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-[hsl(var(--blue-700))] mt-0.5 flex-shrink-0" />
                        <span><strong>Scholarship</strong> programs for financial education</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-[hsl(var(--blue-600))] to-[hsl(var(--blue-700))]">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold text-white mb-6">Ready to Join Our Story?</h2>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Discover your loan eligibility instantly and find the best credit products tailored to your needs. Join 25 lakh+ Indians who trust Credit Lens for transparent, AI-powered financial insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/personal-banking">
                  <Button variant="secondary" size="lg" className="hover:scale-105 transition-transform">
                    Check Eligibility
                  </Button>
                </Link>
                <Link to="/">
                  <Button variant="secondary" size="lg" className="hover:scale-105 transition-transform">
                    Explore Our Services
                  </Button>
                </Link>
                <Link to="/leadership">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="bg-white/10 backdrop-blur-sm text-white border-2 border-white hover:bg-white hover:text-[hsl(var(--blue-600))] transition-all duration-300 font-semibold"
                  >
                    Meet Our Leadership
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
