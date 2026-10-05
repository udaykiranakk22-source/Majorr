import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, Calendar, User, ExternalLink, Search, TrendingUp, Award, Building2, Heart, Zap, Newspaper, Filter, X, Share2, BookOpen, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

const News = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null);
  const [isArticleDialogOpen, setIsArticleDialogOpen] = useState(false);
  const [selectedPressRelease, setSelectedPressRelease] = useState<number | null>(null);
  const [isPressReleaseDialogOpen, setIsPressReleaseDialogOpen] = useState(false);

  const newsArticles = [
    {
      id: 1,
      title: "Credit Lens Reports Strong Q4 2024 Financial Results",
      excerpt: "Credit Lens announced record quarterly earnings with significant growth in digital banking adoption and customer satisfaction metrics.",
      fullContent: "Credit Lens today announced its financial results for the fourth quarter of 2024, reporting record earnings and strong performance across all business segments. The bank achieved a 15% increase in net income compared to the same period last year, driven by robust growth in digital banking services and improved operational efficiency.\n\nKey highlights include:\n• Total assets reached ₹4,00,000 crore, up 8% year-over-year\n• Digital banking adoption increased by 35%\n• Customer satisfaction scores reached an all-time high of 4.8/5.0\n• Loan portfolio grew by 12% with strong credit quality\n• Net interest margin improved to 3.45%\n\nThe bank's strategic investments in technology and customer experience continue to yield positive results, positioning Credit Lens for sustained growth in 2025.",
      date: "2024-01-15",
      author: "Sarah Johnson",
      category: "Financial Results",
      image: "📊",
      featured: true,
      readTime: "5 min read",
      tags: ["Earnings", "Financial Results", "Q4 2024"]
    },
    {
      id: 2,
      title: "New Mobile Banking App Launches with Enhanced Security Features",
      excerpt: "Our latest mobile app update includes biometric authentication, real-time fraud alerts, and improved user experience for all customers.",
      fullContent: "Credit Lens is excited to announce the launch of our completely redesigned mobile banking application, featuring cutting-edge security and enhanced user experience. The new app represents a significant investment in digital innovation and customer security.\n\nNew features include:\n• Advanced biometric authentication (Face ID, Touch ID, fingerprint)\n• Real-time fraud detection and alerts\n• Enhanced bill pay with scheduling capabilities\n• Improved account aggregation and budgeting tools\n• Seamless integration with digital wallets\n• 24/7 customer support chat\n\nThe app has been rebuilt from the ground up with security as the top priority, incorporating industry-leading encryption and multi-factor authentication to protect customer accounts.",
      date: "2024-01-10",
      author: "Emily Rodriguez",
      category: "Technology",
      image: "📱",
      featured: false,
      readTime: "4 min read",
      tags: ["Mobile Banking", "Security", "Technology"]
    },
    {
      id: 3,
      title: "Credit Lens Expands Green Banking Initiatives",
      excerpt: "We're proud to announce new sustainable banking products and carbon-neutral operations as part of our environmental commitment.",
      fullContent: "Credit Lens has unveiled an ambitious new sustainability initiative, committing to carbon-neutral operations by 2025 and introducing a suite of green banking products. This announcement reinforces our commitment to environmental responsibility and sustainable business practices.\n\nKey initiatives include:\n• Carbon-neutral operations target by 2025\n• Green loan products for renewable energy projects\n• Paperless banking incentives\n• Sustainable investment options\n• Community solar program partnerships\n• Environmental impact reporting\n\nWe believe that financial institutions have a critical role to play in addressing climate change, and we're committed to leading by example in the banking industry.",
      date: "2024-01-05",
      author: "Michael Chen",
      category: "Sustainability",
      image: "🌱",
      featured: false,
      readTime: "6 min read",
      tags: ["Sustainability", "Environment", "Green Banking"]
    },
    {
      id: 4,
      title: "Community Investment Program Reaches ₹80 Cr Milestone",
      excerpt: "Our community investment program has now provided over ₹80 crore in grants and loans to local small businesses and nonprofits.",
      fullContent: "Credit Lens's Community Investment Program has reached a significant milestone, having provided over ₹80 crore in grants and low-interest loans to local small businesses and nonprofit organizations since its inception in 2020.\n\nThe program has supported:\n• 250+ small businesses with startup and expansion funding\n• 180+ nonprofit organizations with operational grants\n• 50+ community development projects\n• 1,200+ jobs created or retained\n• Educational programs serving 5,000+ students\n\nThis achievement reflects our deep commitment to the communities we serve and our belief that strong local economies benefit everyone. We're proud to be a catalyst for positive change in our neighborhoods.",
      date: "2023-12-28",
      author: "Lisa Park",
      category: "Community",
      image: "🏘️",
      featured: false,
      readTime: "5 min read",
      tags: ["Community", "Investment", "Small Business"]
    },
    {
      id: 5,
      title: "Credit Lens Named 'Best Bank for Small Business' by Industry Magazine",
      excerpt: "We're honored to receive this recognition for our comprehensive small business banking solutions and exceptional customer service.",
      fullContent: "Credit Lens has been recognized as the 'Best Bank for Small Business' by Banking Industry Magazine for the third consecutive year. This prestigious award recognizes our commitment to supporting small businesses with tailored financial solutions and exceptional service.\n\nWhat sets us apart:\n• Dedicated small business banking specialists\n• Flexible lending solutions\n• Comprehensive business checking and savings accounts\n• Merchant services and payment processing\n• Business credit cards with rewards\n• Online business banking platform\n\nWe're grateful for this recognition and remain committed to helping small businesses thrive. Our team of experts understands the unique challenges small business owners face and works tirelessly to provide solutions that drive growth.",
      date: "2023-12-20",
      author: "Robert Williams",
      category: "Awards",
      image: "🏆",
      featured: false,
      readTime: "4 min read",
      tags: ["Awards", "Small Business", "Recognition"]
    },
    {
      id: 6,
      title: "New AI-Powered Fraud Detection System Reduces False Positives by 40%",
      excerpt: "Our advanced machine learning system now provides more accurate fraud detection while improving the customer experience.",
      fullContent: "Credit Lens has successfully implemented a new AI-powered fraud detection system that has reduced false positive alerts by 40% while maintaining industry-leading fraud prevention rates. The system uses advanced machine learning algorithms to analyze transaction patterns and identify suspicious activity more accurately.\n\nSystem benefits:\n• 40% reduction in false positive alerts\n• 99.8% fraud detection accuracy\n• Real-time transaction monitoring\n• Reduced customer friction\n• Faster fraud resolution\n• Enhanced security for all account types\n\nThis technology upgrade demonstrates our commitment to both security and customer experience. By reducing false positives, we're able to protect customer accounts while minimizing disruptions to legitimate transactions.",
      date: "2023-12-15",
      author: "David Thompson",
      category: "Technology",
      image: "🤖",
      featured: false,
      readTime: "5 min read",
      tags: ["Technology", "Security", "AI"]
    },
    {
      id: 7,
      title: "Credit Lens Opens 25 New Branch Locations Nationwide",
      excerpt: "Expanding our physical presence to better serve customers in growing markets across the country.",
      fullContent: "Credit Lens is excited to announce the opening of 25 new branch locations across 12 states, representing our largest expansion in a decade. These new locations bring our total branch network to over 500 locations nationwide.\n\nNew locations include:\n• 8 branches in Texas\n• 5 branches in Florida\n• 4 branches in Arizona\n• 3 branches in Colorado\n• 2 branches in North Carolina\n• 3 branches in other states\n\nEach new branch features our modern design with digital banking kiosks, private consultation rooms, and extended hours. We're committed to providing both digital convenience and in-person service excellence.",
      date: "2023-12-10",
      author: "Jennifer Martinez",
      category: "Expansion",
      image: "🏢",
      featured: false,
      readTime: "4 min read",
      tags: ["Expansion", "Branches", "Growth"]
    },
    {
      id: 8,
      title: "Partnership with Local Universities Launches Financial Literacy Program",
      excerpt: "New educational initiative aims to teach financial management skills to college students.",
      fullContent: "Credit Lens has partnered with 15 universities to launch a comprehensive financial literacy program for college students. The program provides free workshops, online resources, and one-on-one financial counseling to help students build strong financial foundations.\n\nProgram components:\n• Free financial workshops on budgeting and saving\n• Online financial literacy courses\n• One-on-one financial counseling sessions\n• Student checking accounts with no fees\n• Credit building programs\n• Scholarship opportunities\n\nWe believe that financial education is essential for long-term success, and we're proud to invest in the next generation of financially responsible adults.",
      date: "2023-12-05",
      author: "Amanda Wilson",
      category: "Education",
      image: "🎓",
      featured: false,
      readTime: "5 min read",
      tags: ["Education", "Financial Literacy", "Partnership"]
    },
    {
      id: 9,
      title: "Credit Lens Introduces High-Yield Savings Account with 4.5% APY",
      excerpt: "New competitive savings product offers industry-leading interest rates for customers.",
      fullContent: "Credit Lens is pleased to introduce our new High-Yield Savings Account, offering a competitive 4.5% Annual Percentage Yield (APY) with no minimum balance requirements or monthly fees.\n\nAccount features:\n• 4.5% APY on all balances\n• No minimum balance required\n• No monthly maintenance fees\n• DICGC insured up to ₹5,00,000\n• Easy online account management\n• Mobile app access\n• Unlimited deposits and withdrawals\n\nThis new product reflects our commitment to providing competitive financial products that help customers grow their savings. The account is available to all customers and can be opened online in minutes.",
      date: "2023-11-28",
      author: "Thomas Anderson",
      category: "Products",
      image: "💰",
      featured: false,
      readTime: "3 min read",
      tags: ["Products", "Savings", "High Yield"]
    },
    {
      id: 10,
      title: "Cybersecurity Team Wins National Award for Innovation",
      excerpt: "Our cybersecurity team recognized for innovative approaches to protecting customer data.",
      fullContent: "Credit Lens's cybersecurity team has been honored with the National Banking Security Innovation Award for their development of advanced threat detection and response systems. The award recognizes excellence in cybersecurity innovation and customer data protection.\n\nTeam achievements:\n• Zero data breaches in 2024\n• Industry-leading threat detection rates\n• Innovative security training programs\n• Advanced encryption implementation\n• Proactive vulnerability management\n• 24/7 security monitoring\n\nThis recognition validates our investment in cybersecurity and our commitment to protecting customer information. Our team works around the clock to stay ahead of emerging threats and ensure the highest levels of security.",
      date: "2023-11-20",
      author: "Patricia Lee",
      category: "Awards",
      image: "🔒",
      featured: false,
      readTime: "5 min read",
      tags: ["Awards", "Security", "Cybersecurity"]
    },
    {
      id: 11,
      title: "Digital Wallet Integration Expands Payment Options",
      excerpt: "Customers can now use Apple Pay, Google Pay, and Samsung Pay at all Credit Lens ATMs and branches.",
      fullContent: "Credit Lens has expanded digital wallet support, allowing customers to use Apple Pay, Google Pay, and Samsung Pay for transactions at all our ATMs and in-branch services. This enhancement provides greater convenience and security for our customers.\n\nNew capabilities:\n• Contactless payments at all ATMs\n• Digital wallet integration in branches\n• Enhanced security with tokenization\n• Faster transaction processing\n• Support for all major digital wallets\n• Seamless mobile banking integration\n\nThis update is part of our ongoing commitment to providing modern, convenient banking solutions that meet the evolving needs of our customers.",
      date: "2023-11-15",
      author: "Christopher Brown",
      category: "Technology",
      image: "💳",
      featured: false,
      readTime: "4 min read",
      tags: ["Technology", "Digital Wallet", "Payments"]
    },
    {
      id: 12,
      title: "Employee Volunteer Program Donates 10,000 Hours to Community",
      excerpt: "Credit Lens employees contributed over 10,000 volunteer hours to local community organizations in 2023.",
      fullContent: "Credit Lens employees have collectively donated over 10,000 volunteer hours to local community organizations throughout 2023, demonstrating our commitment to giving back to the communities we serve.\n\nVolunteer activities included:\n• Financial literacy workshops\n• Food bank assistance\n• Habitat for Humanity builds\n• School mentoring programs\n• Environmental cleanup projects\n• Senior center support\n\nWe're proud of our employees' dedication to community service and grateful for the positive impact they've made. Credit Lens provides paid volunteer time off to encourage employee engagement in community service.",
      date: "2023-11-10",
      author: "Maria Garcia",
      category: "Community",
      image: "🤝",
      featured: false,
      readTime: "4 min read",
      tags: ["Community", "Volunteering", "Corporate Responsibility"]
    },
    {
      id: 13,
      title: "New Business Banking Platform Simplifies Account Management",
      excerpt: "Credit Lens launches comprehensive online platform designed specifically for business customers with advanced features and tools.",
      fullContent: "Credit Lens has unveiled a new business banking platform that simplifies account management for business customers. The platform offers advanced features including cash flow management, automated invoicing, payroll processing, and comprehensive financial reporting.\n\nKey features:\n• Real-time cash flow monitoring and forecasting\n• Automated invoice generation and tracking\n• Integrated payroll processing system\n• Multi-user access with role-based permissions\n• Advanced reporting and analytics\n• Seamless integration with accounting software\n• 24/7 customer support\n\nThis platform reflects our commitment to supporting businesses of all sizes with technology that saves time and helps them make informed financial decisions.",
      date: "2023-11-05",
      author: "James Wilson",
      category: "Products",
      image: "💼",
      featured: false,
      readTime: "5 min read",
      tags: ["Products", "Business Banking", "Technology"]
    },
    {
      id: 14,
      title: "Credit Lens Achieves ISO 27001 Certification for Information Security",
      excerpt: "Bank earns prestigious international certification demonstrating commitment to highest standards of information security management.",
      fullContent: "Credit Lens has achieved ISO 27001 certification, the international standard for information security management systems. This certification validates our commitment to maintaining the highest standards of information security and data protection.\n\nWhat this means for customers:\n• Enhanced protection of sensitive information\n• Systematic approach to managing security risks\n• Continuous improvement in security practices\n• Compliance with international security standards\n• Regular independent audits and assessments\n• Comprehensive security controls and procedures\n\nThis achievement demonstrates our ongoing commitment to protecting customer data and maintaining trust through rigorous security standards.",
      date: "2023-10-28",
      author: "Rachel Kim",
      category: "Awards",
      image: "🛡️",
      featured: false,
      readTime: "4 min read",
      tags: ["Awards", "Security", "Certification"]
    },
    {
      id: 15,
      title: "Mortgage Lending Program Supports First-Time Homebuyers",
      excerpt: "New initiative offers competitive rates and reduced fees for first-time homebuyers with down payment assistance options.",
      fullContent: "Credit Lens has launched a comprehensive mortgage program specifically designed to help first-time homebuyers achieve their dream of homeownership. The program offers competitive interest rates, reduced closing costs, and down payment assistance options.\n\nProgram benefits:\n• Competitive fixed and adjustable rate options\n• Down payment assistance up to ₹8,00,000\n• Reduced closing costs for qualified buyers\n• Flexible credit requirements\n• Free homebuyer education courses\n• Dedicated mortgage specialists\n• Pre-approval within 24 hours\n\nWe're committed to making homeownership more accessible and affordable. Our team of mortgage experts works closely with first-time buyers throughout the entire process.",
      date: "2023-10-22",
      author: "Daniel Martinez",
      category: "Products",
      image: "🏠",
      featured: false,
      readTime: "5 min read",
      tags: ["Products", "Mortgages", "Homebuying"]
    },
    {
      id: 16,
      title: "Investment Advisory Services Expand to Serve Growing Customer Base",
      excerpt: "Credit Lens expands investment advisory team and introduces new portfolio management services for affluent customers.",
      fullContent: "Credit Lens has significantly expanded its investment advisory services, adding 15 new financial advisors and introducing advanced portfolio management capabilities. This expansion enables the bank to serve a growing number of customers seeking professional investment guidance.\n\nNew services include:\n• Personalized investment portfolios\n• Tax-efficient investment strategies\n• Retirement planning and consultation\n• Estate planning coordination\n• Alternative investment opportunities\n• Regular portfolio reviews and rebalancing\n• Access to exclusive investment research\n\nThe expansion reflects our commitment to providing comprehensive financial services that help customers achieve their long-term financial goals.",
      date: "2023-10-15",
      author: "Susan Taylor",
      category: "Expansion",
      image: "📈",
      featured: false,
      readTime: "5 min read",
      tags: ["Expansion", "Investment", "Wealth Management"]
    },
    {
      id: 17,
      title: "Customer Service Excellence Recognized with Industry Award",
      excerpt: "Credit Lens wins 'Best Customer Service' award for exceptional support and customer satisfaction scores.",
      fullContent: "Credit Lens has been honored with the 'Best Customer Service' award by Banking Excellence Magazine, recognizing our exceptional customer support and industry-leading satisfaction scores. This marks the fourth consecutive year we've received this prestigious recognition.\n\nWhat makes our service exceptional:\n• Average response time under 2 minutes\n• 95% first-call resolution rate\n• 24/7 customer support availability\n• Multi-channel support (phone, chat, email, in-person)\n• Personalized service approach\n• Comprehensive training programs for staff\n• Continuous feedback and improvement processes\n\nWe're grateful for this recognition and remain committed to delivering outstanding service that exceeds customer expectations every day.",
      date: "2023-10-08",
      author: "Kevin Patel",
      category: "Awards",
      image: "⭐",
      featured: false,
      readTime: "4 min read",
      tags: ["Awards", "Customer Service", "Recognition"]
    },
    {
      id: 18,
      title: "Partnership with Local Food Banks Addresses Hunger in Communities",
      excerpt: "Credit Lens partners with regional food banks to support hunger relief efforts and donate ₹40,000,000 to food security programs.",
      fullContent: "Credit Lens has announced a major partnership with food banks across our service area, committing ₹40,000,000 to support hunger relief efforts and food security programs. This initiative reflects our commitment to addressing critical community needs.\n\nPartnership initiatives:\n• Financial contributions to local food banks\n• Employee volunteer programs at food distribution centers\n• Fundraising campaigns for hunger relief\n• Sponsorship of community food drives\n• Educational programs on food security\n• Support for school meal programs\n\nWe believe that no one should go hungry, and we're proud to support organizations that are working tirelessly to address food insecurity in our communities.",
      date: "2023-10-01",
      author: "Nancy Chen",
      category: "Community",
      image: "🍽️",
      featured: false,
      readTime: "4 min read",
      tags: ["Community", "Charity", "Food Security"]
    },
    {
      id: 19,
      title: "Next-Generation ATM Network Deployed Across All Locations",
      excerpt: "Bank rolls out advanced ATMs with contactless card access, mobile app integration, and enhanced security features.",
      fullContent: "Credit Lens has completed the deployment of next-generation ATMs across all branch locations, featuring cutting-edge technology that enhances security, convenience, and functionality. The new ATM network represents a significant upgrade in customer experience.\n\nNew ATM features:\n• Contactless card and mobile wallet support\n• Mobile app integration for card-free access\n• Enhanced security with biometric authentication\n• Bill payment capabilities\n• Check deposit with instant verification\n• Cash recycling for improved availability\n• Multi-language support\n• ADA-compliant design\n\nThis upgrade ensures our customers have access to modern, secure, and convenient banking services wherever they need them.",
      date: "2023-09-25",
      author: "Michelle Davis",
      category: "Technology",
      image: "🏧",
      featured: false,
      readTime: "4 min read",
      tags: ["Technology", "ATMs", "Innovation"]
    },
    {
      id: 20,
      title: "Small Business Grant Program Awards ₹16 Cr to Local Entrepreneurs",
      excerpt: "Credit Lens's small business grant program provides funding to 50 local businesses to support growth and job creation.",
      fullContent: "Credit Lens's Small Business Grant Program has awarded ₹16 crore in grants to 50 local entrepreneurs, supporting business growth and job creation in our communities. The program targets businesses that demonstrate strong potential for growth and community impact.\n\nGrant recipients:\n• 50 businesses across diverse industries\n• Average grant amount of ₹3,20,000\n• Focus on underrepresented entrepreneurs\n• Emphasis on job creation potential\n• Support for innovative business models\n• Technical assistance and mentorship included\n\nThe program has created over 300 new jobs and generated significant economic activity in our communities. We're proud to support entrepreneurs who are building the businesses of tomorrow.",
      date: "2023-09-18",
      author: "Robert Liu",
      category: "Community",
      image: "🚀",
      featured: false,
      readTime: "5 min read",
      tags: ["Community", "Small Business", "Grants"]
    },
    {
      id: 21,
      title: "Quarterly Dividend Increased for 10th Consecutive Year",
      excerpt: "Credit Lens announces 8% increase in quarterly dividend, demonstrating strong financial performance and commitment to shareholders.",
      fullContent: "Credit Lens's Board of Directors has approved an 8% increase in the quarterly dividend, marking the 10th consecutive year of dividend increases. This announcement reflects the bank's strong financial performance and commitment to returning value to shareholders.\n\nDividend details:\n• 8% increase over previous quarter\n• Annual dividend yield of 3.2%\n• Consistent dividend growth for 10 years\n• Strong capital position supporting dividend policy\n• Commitment to sustainable dividend payments\n\nOur consistent dividend growth demonstrates the strength of our business model and our commitment to creating long-term value for shareholders. We're proud of this track record and remain focused on sustainable growth.",
      date: "2023-09-12",
      author: "Patricia Anderson",
      category: "Financial Results",
      image: "💵",
      featured: false,
      readTime: "3 min read",
      tags: ["Financial Results", "Dividends", "Shareholders"]
    },
    {
      id: 22,
      title: "ESG Report Highlights Progress in Sustainability Initiatives",
      excerpt: "Credit Lens releases annual Environmental, Social, and Governance report showcasing progress in sustainable banking practices.",
      fullContent: "Credit Lens has released its annual Environmental, Social, and Governance (ESG) report, detailing progress across all areas of sustainability and corporate responsibility. The report demonstrates significant achievements in environmental impact reduction, social initiatives, and governance practices.\n\nKey achievements:\n• 40% reduction in carbon footprint since 2020\n• 100% renewable energy for branch operations\n• ₹200 crore in green loans approved\n• Diverse workforce with 45% women in leadership\n• Zero major compliance issues\n• Strong corporate governance ratings\n\nWe're committed to transparency in our ESG efforts and to continuously improving our impact on the environment and our communities.",
      date: "2023-09-05",
      author: "Gregory White",
      category: "Sustainability",
      image: "🌍",
      featured: false,
      readTime: "6 min read",
      tags: ["Sustainability", "ESG", "Corporate Responsibility"]
    },
    {
      id: 23,
      title: "Youth Financial Education Program Reaches 10,000 Students",
      excerpt: "Credit Lens's financial literacy program for youth has now educated over 10,000 students across 50 schools.",
      fullContent: "Credit Lens's Youth Financial Education Program has reached a major milestone, having educated over 10,000 students across 50 schools in financial literacy. The program teaches essential money management skills to students from elementary through high school.\n\nProgram components:\n• Age-appropriate curriculum for all grade levels\n• Interactive workshops and activities\n• Real-world financial scenarios\n• Teacher training and support\n• Parent resources and materials\n• School banking programs\n• Scholarship opportunities for participants\n\nWe believe that financial education is a critical life skill, and we're committed to ensuring the next generation has the knowledge they need to make sound financial decisions.",
      date: "2023-08-28",
      author: "Jennifer Adams",
      category: "Education",
      image: "👨‍🎓",
      featured: false,
      readTime: "5 min read",
      tags: ["Education", "Financial Literacy", "Youth"]
    },
    {
      id: 24,
      title: "Contactless Payment Technology Expands to All Merchant Services",
      excerpt: "Credit Lens enables contactless payments for all merchant customers, supporting safer and faster transactions.",
      fullContent: "Credit Lens has expanded contactless payment capabilities to all merchant services customers, enabling faster, more secure transactions for businesses and their customers. This upgrade supports the growing preference for touch-free payment methods.\n\nBenefits for merchants:\n• Faster transaction processing\n• Reduced wait times for customers\n• Enhanced security with tokenization\n• Support for all major contactless payment methods\n• Lower transaction costs for small businesses\n• Real-time transaction reporting\n• Seamless integration with existing systems\n\nThis enhancement helps our merchant customers provide better service while accommodating evolving customer payment preferences.",
      date: "2023-08-20",
      author: "Steven Johnson",
      category: "Technology",
      image: "📲",
      featured: false,
      readTime: "4 min read",
      tags: ["Technology", "Payments", "Merchant Services"]
    },
    {
      id: 25,
      title: "Credit Lens Named 'Most Trusted Bank' in Annual Customer Survey",
      excerpt: "Annual customer survey recognizes Credit Lens as the most trusted financial institution in the region.",
      fullContent: "Credit Lens has been named the 'Most Trusted Bank' in the annual Regional Banking Survey, based on responses from over 10,000 customers. This recognition reflects our commitment to building trust through transparency, security, and exceptional service.\n\nFactors contributing to trust:\n• Transparent fee structure\n• Strong security and fraud protection\n• Responsive customer service\n• Clear communication\n• Community involvement\n• Financial stability\n• Ethical business practices\n\nTrust is the foundation of banking, and we're honored that our customers recognize our commitment to earning and maintaining their trust every day.",
      date: "2023-08-15",
      author: "Laura Thompson",
      category: "Awards",
      image: "🏅",
      featured: false,
      readTime: "4 min read",
      tags: ["Awards", "Trust", "Customer Satisfaction"]
    }
  ];

  const categories = ["all", "Financial Results", "Technology", "Sustainability", "Community", "Awards", "Expansion", "Education", "Products"];

  const pressReleases = [
    {
      id: 1,
      title: "Q4 2024 Earnings Call Scheduled",
      date: "January 20, 2024 at 9:00 AM IST",
      description: "Credit Lens will host a conference call to discuss fourth quarter 2024 financial results on January 20, 2024.",
      details: "Earnings Call Details:\n\nDate: January 20, 2024\nTime: 9:00 AM IST\nDial-in: 1800-123-4572\nAccess Code: CREDITLENS2024\nWebcast: investor.creditlens.in/earnings\n\nFor questions, contact Investor Relations at ir@creditlens.in or call 1800-123-4571."
    },
    {
      id: 2,
      title: "Annual Shareholder Meeting Announcement",
      date: "April 15, 2024 at 2:00 PM IST",
      description: "Notice of the 2024 Annual Meeting of Shareholders to be held virtually on April 15, 2024.",
      details: "Annual Shareholder Meeting:\n\nDate: April 15, 2024\nTime: 2:00 PM IST\nLocation: Virtual Meeting\nRegistration: shareholder.creditlens.in\n\nProxy materials will be mailed to shareholders in March 2024. For questions, contact Shareholder Services at shareholders@creditlens.in."
    },
    {
      id: 3,
      title: "New Branch Opening in Downtown Seattle",
      date: "February 1, 2024",
      description: "Credit Lens announces the opening of a new flagship branch in downtown Seattle, featuring state-of-the-art banking technology.",
      details: "New Branch Details:\n\nLocation: 42 Bandra Kurla Complex, Mumbai, MH 400051\nOpening Date: February 1, 2024\nHours: Monday-Friday 9 AM - 5 PM, Saturday 9 AM - 1 PM\nFeatures: Digital banking kiosks, private consultation rooms, extended hours\n\nJoin us for the grand opening celebration on February 1st from 9 AM to 2 PM with refreshments and special offers."
    },
    {
      id: 4,
      title: "Partnership with Tech Startup Accelerator",
      date: "January 25, 2024",
      description: "Credit Lens partners with leading tech startup accelerator to provide banking services and mentorship to emerging technology companies.",
      details: "Partnership Details:\n\nPartner: TechStart Accelerator\nProgram: Banking services for startups\nBenefits: Specialized business accounts, reduced fees, mentorship opportunities\n\nThis partnership reflects our commitment to supporting innovation and entrepreneurship. For more information, contact businessbanking@creditlens.in."
    }
  ];

  const filteredArticles = newsArticles.filter(article => {
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    const matchesSearch = searchTerm === "" || 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredArticle = newsArticles.find(article => article.featured);
  const recentArticles = newsArticles.filter(article => !article.featured).slice(0, 6);

  const handleReadArticle = (articleId: number) => {
    setSelectedArticle(articleId);
    setIsArticleDialogOpen(true);
  };

  const handleShareArticle = (article: typeof newsArticles[0]) => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href
      }).catch(() => {
        toast({
          title: "Shared",
          description: "Article link copied to clipboard!",
        });
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Article link has been copied to your clipboard!",
      });
    }
  };

  const selectedArticleData = selectedArticle ? newsArticles.find(a => a.id === selectedArticle) : null;
  const selectedPressReleaseData = selectedPressRelease ? pressReleases.find(r => r.id === selectedPressRelease) : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative pt-20 pb-20 bg-gradient-to-r from-[hsl(var(--blue-600))] via-[hsl(var(--blue-700))] to-[hsl(var(--blue-600))] overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
          <div className="container mx-auto px-4 relative z-10">
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
                  <Newspaper className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold text-white mb-2">News & Updates</h1>
                  <p className="text-lg text-white/90">
                    Stay informed about Credit Lens
                  </p>
                </div>
              </div>
              <p className="text-xl text-white/95 leading-relaxed">
                Stay informed about the latest developments at Credit Lens, including financial results, new products, community initiatives, and industry recognition.
              </p>
            </div>
          </div>
        </section>

        {/* Search and Filter */}
        <section className="py-8 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search news articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-2"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-64 border-2">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.filter(cat => cat !== "all").map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {searchTerm && (
                  <Button
                    variant="outline"
                    onClick={() => setSearchTerm("")}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Article */}
        {featuredArticle && filteredArticles.some(a => a.featured) && (
          <section className="py-16 bg-gradient-to-b from-white to-gray-50">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="h-6 w-6 text-[hsl(var(--blue-600))]" />
                  <h2 className="text-3xl font-bold text-[hsl(var(--blue-600))]">Featured Story</h2>
                </div>
                
                <Card className="border-2 hover:shadow-2xl transition-all duration-300 overflow-hidden">
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="bg-gradient-to-br from-[hsl(var(--blue-600))/10] to-[hsl(var(--blue-700))/10] p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-4">
                        <Badge className="bg-[hsl(var(--blue-600))] text-white">{featuredArticle.category}</Badge>
                        <span className="text-4xl">{featuredArticle.image}</span>
                      </div>
                      <CardTitle className="text-3xl mb-4">{featuredArticle.title}</CardTitle>
                      <p className="text-lg text-gray-700 mb-6 leading-relaxed">{featuredArticle.excerpt}</p>
                      <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(featuredArticle.date).toLocaleDateString('en-IN', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {featuredArticle.author}
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          {featuredArticle.readTime}
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button 
                          variant="primary"
                          size="lg"
                          onClick={() => handleReadArticle(featuredArticle.id)}
                          className="flex-1"
                        >
                          Read Full Article
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </Button>
                        <Button 
                          variant="outline"
                          size="lg"
                          onClick={() => handleShareArticle(featuredArticle)}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-[hsl(var(--blue-600))] to-[hsl(var(--blue-700))] p-12 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="text-8xl mb-4">{featuredArticle.image}</div>
                        <div className="flex flex-wrap gap-2 justify-center mt-4">
                          {featuredArticle.tags.map((tag, idx) => (
                            <Badge key={idx} variant="secondary" className="bg-white/20 text-white border-white/30">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </section>
        )}

        {/* All Articles */}
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-[hsl(var(--blue-600))]">
                  {selectedCategory === "all" ? "All News" : selectedCategory}
                </h2>
                <p className="text-gray-600">
                  {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'} found
                </p>
              </div>
              
              {filteredArticles.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredArticles.filter(article => !article.featured || selectedCategory !== "all").map((article) => (
                    <Card 
                      key={article.id} 
                      className="hover:shadow-xl transition-all duration-300 border-2 group"
                    >
                      <CardHeader className="bg-gradient-to-r from-[hsl(var(--blue-600))/5] to-transparent">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-3xl">{article.image}</span>
                            <Badge variant="outline" className="border-[hsl(var(--blue-600))] text-[hsl(var(--blue-600))]">
                              {article.category}
                            </Badge>
                          </div>
                        </div>
                        <CardTitle className="text-xl mb-3 group-hover:text-[hsl(var(--blue-600))] transition-colors">
                          {article.title}
                        </CardTitle>
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(article.date).toLocaleDateString('en-IN', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            {article.readTime}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <p className="text-gray-700 mb-4 line-clamp-3">{article.excerpt}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {article.tags.slice(0, 2).map((tag, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex-1"
                            onClick={() => handleReadArticle(article.id)}
                          >
                            Read More
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleShareArticle(article)}
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <p className="text-gray-600 text-lg mb-4">No articles found matching your criteria.</p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedCategory("all");
                      }}
                    >
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>

        {/* Press Releases */}
        <section className="py-16 bg-gradient-to-r from-[hsl(var(--blue-600))/10] via-[hsl(var(--blue-700))/10] to-[hsl(var(--blue-600))/10]">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[hsl(var(--blue-600))] to-[hsl(var(--blue-700))] text-white mb-4">
                  <Newspaper className="h-8 w-8" />
                </div>
                <h2 className="text-4xl font-bold text-[hsl(var(--blue-600))] mb-4">Press Releases</h2>
                <p className="text-lg text-gray-600">
                  Official announcements and press releases from Credit Lens
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {pressReleases.map((release) => (
                  <Card key={release.id} className="border-2 hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-xl mb-2">{release.title}</CardTitle>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        {release.date}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4">{release.description}</p>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setSelectedPressRelease(release.id);
                          setIsPressReleaseDialogOpen(true);
                        }}
                      >
                        View Details
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Media Contact */}
        <section className="py-16 bg-gradient-to-r from-[hsl(var(--blue-600))] to-[hsl(var(--blue-700))]">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-6">Media Inquiries</h2>
              <p className="text-xl text-white/90 mb-8">
                For media inquiries, press releases, or interview requests, please contact our media relations team.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-2">
                      <Newspaper className="h-5 w-5 text-[hsl(var(--blue-600))]" />
                      Media Relations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-600">Email: media@creditlens.in</p>
                    <p className="text-sm text-gray-600">Phone: 1800-123-4573</p>
                    <p className="text-xs text-gray-500">24/7 Media Hotline: 1800-123-4574</p>
                    <Button 
                      variant="primary"
                      className="w-full"
                      onClick={() => {
                        toast({
                          title: "Media Relations Contact",
                          description: "Email: media@creditlens.in\nPhone: 1800-123-4573\n24/7 Hotline: 1800-123-4574\n\nWe typically respond within 2 hours during business hours.",
                        });
                      }}
                    >
                      Contact Media Relations
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-2">
                      <TrendingUp className="h-5 w-5 text-[hsl(var(--blue-600))]" />
                      Investor Relations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-600">Email: ir@creditlens.in</p>
                    <p className="text-sm text-gray-600">Phone: 1800-123-4571</p>
                    <p className="text-xs text-gray-500">Website: investor.creditlens.in</p>
                    <Button 
                      variant="primary"
                      className="w-full"
                      onClick={() => {
                        toast({
                          title: "Investor Relations Contact",
                          description: "Email: ir@creditlens.in\nPhone: 1800-123-4571\nWebsite: investor.creditlens.in\n\nFor investor-related inquiries, financial information, and shareholder services.",
                        });
                      }}
                    >
                      Contact Investor Relations
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Article Detail Dialog */}
      {selectedArticleData && (
        <Dialog open={isArticleDialogOpen} onOpenChange={setIsArticleDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge className="bg-[hsl(var(--blue-600))] text-white">
                      {selectedArticleData.category}
                    </Badge>
                    <span className="text-3xl">{selectedArticleData.image}</span>
                  </div>
                  <DialogTitle className="text-3xl mb-4">{selectedArticleData.title}</DialogTitle>
                  <DialogDescription className="text-base">
                    <div className="flex items-center gap-6 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(selectedArticleData.date).toLocaleDateString('en-IN', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {selectedArticleData.author}
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        {selectedArticleData.readTime}
                      </div>
                    </div>
                  </DialogDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShareArticle(selectedArticleData)}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>
            
            <div className="space-y-6 mt-6">
              <div className="prose max-w-none">
                <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                  {selectedArticleData.fullContent}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2 pt-4 border-t">
                <span className="text-sm font-semibold text-gray-700">Tags:</span>
                {selectedArticleData.tags.map((tag, idx) => (
                  <Badge key={idx} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Press Release Detail Dialog */}
      {selectedPressReleaseData && (
        <Dialog open={isPressReleaseDialogOpen} onOpenChange={setIsPressReleaseDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-[hsl(var(--blue-600))] to-[hsl(var(--blue-700))] rounded-lg">
                      <Newspaper className="h-5 w-5 text-white" />
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                      Press Release
                    </Badge>
                  </div>
                  <DialogTitle className="text-2xl mb-4">
                    {selectedPressReleaseData.title}
                  </DialogTitle>
                  <DialogDescription className="text-base">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      {selectedPressReleaseData.date}
                    </div>
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            
            <div className="space-y-6 mt-6">
              <div className="bg-gradient-to-r from-[hsl(var(--blue-600))/10] to-[hsl(var(--blue-700))/10] rounded-lg p-6">
                <p className="text-gray-700 mb-4 font-medium">
                  {selectedPressReleaseData.description}
                </p>
              </div>
              
              <div className="prose max-w-none">
                <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                  {selectedPressReleaseData.details}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default News;
