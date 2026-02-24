"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemes = void 0;
exports.calculateEligibility = calculateEligibility;
exports.getMatchedSchemes = getMatchedSchemes;
exports.calculateBenefitBreakdown = calculateBenefitBreakdown;
const rawSchemes = [
    {
        id: "pm-kisan",
        name: "PM Kisan Samman Nidhi",
        category: "agriculture",
        level: "central",
        description: "Direct income support of Rs.6,000 per year to farmer families across India, paid in three equal installments of Rs.2,000 each.",
        benefits: "Rs.6,000 per year in 3 installments of Rs.2,000 directly to bank account",
        annualValue: 6000,
        eligibility: {
            gender: "any",
            occupations: ["farmer", "agricultural-laborer"],
        },
        documents: ["Aadhaar Card", "Bank Account Details", "Land Ownership Records", "State Domicile Certificate"],
        applicationProcess: "Apply online at pmkisan.gov.in or through Common Service Centres (CSC). Verification by State Government before disbursal.",
        officialLink: "https://pmkisan.gov.in",
    },
    {
        id: "atal-pension",
        name: "Atal Pension Yojana",
        category: "pension",
        level: "central",
        description: "Guaranteed pension scheme for unorganized sector workers. Provides fixed pension of Rs.1,000 to Rs.5,000 per month after age 60.",
        benefits: "Monthly pension of Rs.1,000-5,000 after 60 years of age, with government co-contribution",
        annualValue: 60000,
        eligibility: {
            minAge: 18,
            maxAge: 40,
            gender: "any",
            occupations: ["self-employed", "daily-wage", "homemaker", "agricultural-laborer", "small-business"],
        },
        documents: ["Aadhaar Card", "Bank Account / Post Office Account", "Mobile Number"],
        applicationProcess: "Enroll through any bank or post office branch. Auto-debit from savings account for contributions.",
        officialLink: "https://npscra.nsdl.co.in/scheme-details.php",
    },
    {
        id: "pm-mudra",
        name: "Pradhan Mantri Mudra Yojana",
        category: "business",
        level: "central",
        description: "Collateral-free loans up to Rs.10 lakh for micro and small enterprises. Three categories: Shishu (up to 50K), Kishore (50K-5L), Tarun (5L-10L).",
        benefits: "Business loans from Rs.50,000 to Rs.10,00,000 without collateral at competitive interest rates",
        annualValue: 50000,
        eligibility: {
            minAge: 18,
            gender: "any",
            occupations: ["self-employed", "small-business"],
        },
        documents: ["Aadhaar Card", "PAN Card", "Business Plan", "Identity & Address Proof", "Caste Certificate (if applicable)"],
        applicationProcess: "Apply through any bank, MFI, or NBFC. Online application at mudra.org.in. No collateral required.",
        officialLink: "https://www.mudra.org.in",
    },
    {
        id: "gruha-lakshmi",
        name: "Gruha Lakshmi Scheme",
        category: "women",
        level: "state",
        state: "Karnataka",
        description: "Monthly financial assistance of Rs.2,000 to women heads of households in Karnataka, supporting economic independence.",
        benefits: "Rs.2,000 per month (Rs.24,000/year) transferred directly to the woman head of household",
        annualValue: 24000,
        eligibility: {
            minAge: 18,
            gender: "female",
            states: ["karnataka"],
            maxIncome: 200000,
            isHeadOfHousehold: true,
        },
        documents: ["Aadhaar Card", "Ration Card (head of family)", "Bank Account Details", "Income Certificate"],
        applicationProcess: "Apply online through the Seva Sindhu portal or at Gram Panchayat/Ward office. Requires being listed as head of family in ration card.",
        officialLink: "https://sevasindhu.karnataka.gov.in",
    },
    {
        id: "pm-awas-gramin",
        name: "Pradhan Mantri Awas Yojana - Gramin",
        category: "housing",
        level: "central",
        description: "Housing for all in rural areas. Financial assistance for construction of pucca houses with basic amenities.",
        benefits: "Rs.1,20,000 in plains and Rs.1,30,000 in hilly areas for house construction",
        annualValue: 120000,
        eligibility: {
            gender: "any",
            isRural: true,
            isBPL: true,
        },
        documents: ["Aadhaar Card", "BPL Certificate", "Land Documents", "Bank Account", "Income Certificate"],
        applicationProcess: "Beneficiaries are identified from SECC 2011 data. Apply through Gram Panchayat or Awaas Soft portal.",
        officialLink: "https://pmayg.nic.in",
    },
    {
        id: "pm-vishwakarma",
        name: "PM Vishwakarma Yojana",
        category: "employment",
        level: "central",
        description: "Support for traditional artisans and craftspeople with skill training, toolkit incentives, and credit support up to Rs.3 lakh.",
        benefits: "Toolkit incentive of Rs.15,000, credit up to Rs.3 lakh at 5% interest, and skill training",
        annualValue: 15000,
        eligibility: {
            minAge: 18,
            gender: "any",
            occupations: ["self-employed", "artisan"],
            isArtisan: true,
        },
        documents: ["Aadhaar Card", "Skill Verification Certificate", "Bank Account", "Mobile Number"],
        applicationProcess: "Register through CSC or pm-vishwakarma.gov.in. Skill verification by Gram Panchayat/ULB.",
        officialLink: "https://pmvishwakarma.gov.in",
    },
    {
        id: "ayushman-bharat",
        name: "Ayushman Bharat - PMJAY",
        category: "health",
        level: "central",
        description: "Health insurance cover of Rs.5 lakh per family per year for secondary and tertiary hospitalization. Cashless treatment at empaneled hospitals.",
        benefits: "Rs.5,00,000 health insurance cover per family per year, cashless treatment",
        annualValue: 500000,
        eligibility: {
            gender: "any",
            isBPL: true,
        },
        documents: ["Aadhaar Card", "Ration Card", "SECC Database Entry", "Family ID"],
        applicationProcess: "Check eligibility at mera.pmjay.gov.in. Get Ayushman Card from empaneled hospital or CSC.",
        officialLink: "https://pmjay.gov.in",
    },
    {
        id: "sukanya-samriddhi",
        name: "Sukanya Samriddhi Yojana",
        category: "education",
        level: "central",
        description: "Savings scheme for girl child education and marriage. High interest rate with tax benefits. Open account for girls below 10 years.",
        benefits: "8.2% interest rate, tax-free returns, and Section 80C deduction up to Rs.1.5 lakh",
        annualValue: 12000,
        eligibility: {
            maxAge: 10,
            gender: "female",
        },
        documents: ["Birth Certificate of Girl Child", "Parent/Guardian Aadhaar", "Address Proof", "Passport Photo"],
        applicationProcess: "Open account at any post office or authorized bank. Minimum deposit Rs.250/year.",
        officialLink: "https://www.india.gov.in/sukanya-samriddhi-yojana",
    },
    {
        id: "anna-bhagya",
        name: "Anna Bhagya Scheme",
        category: "social-security",
        level: "state",
        state: "Karnataka",
        description: "Free rice distribution of 10 kg per person per month for BPL families in Karnataka under the National Food Security Act.",
        benefits: "10 kg free rice per person per month for BPL card holders",
        annualValue: 7200,
        eligibility: {
            gender: "any",
            isBPL: true,
            states: ["karnataka"],
        },
        documents: ["BPL Ration Card", "Aadhaar Card"],
        applicationProcess: "Automatic for BPL ration card holders. Collect from nearest Fair Price Shop.",
        officialLink: "https://ahara.kar.nic.in",
    },
    {
        id: "pm-matru-vandana",
        name: "Pradhan Mantri Matru Vandana Yojana",
        category: "women",
        level: "central",
        description: "Cash incentive of Rs.5,000 for pregnant and lactating mothers for first living child to improve health and nutrition.",
        benefits: "Rs.5,000 in installments for first child, Rs.6,000 for second girl child",
        annualValue: 5000,
        eligibility: {
            minAge: 19,
            maxAge: 45,
            gender: "female",
            isPregnant: true,
        },
        documents: ["Aadhaar Card", "Bank/Post Office Account", "MCP Card", "Pregnancy Registration"],
        applicationProcess: "Register at nearest Anganwadi Centre. Apply through PMMVY-CAS portal.",
        officialLink: "https://pmmvy.wcd.gov.in",
    },
    {
        id: "vidyasiri",
        name: "Vidyasiri Scholarship",
        category: "education",
        level: "state",
        state: "Karnataka",
        description: "Post-matric scholarship for SC/ST students in Karnataka. Covers tuition fees, maintenance allowance, and book grants.",
        benefits: "Tuition fee reimbursement + maintenance allowance of Rs.1,500-3,500/month",
        annualValue: 42000,
        eligibility: {
            minAge: 15,
            maxAge: 30,
            gender: "any",
            maxIncome: 250000,
            categories: ["sc", "st"],
            states: ["karnataka"],
            occupations: ["student"],
        },
        documents: ["Caste Certificate", "Income Certificate", "Previous Marksheet", "Aadhaar Card", "Bank Account"],
        applicationProcess: "Apply online through SSP (Student Scholarship Portal). Verify through institution.",
        officialLink: "https://ssp.karnataka.gov.in",
    },
    {
        id: "bhagya-jyothi",
        name: "Bhagya Jyothi / Kutir Jyothi",
        category: "social-security",
        level: "state",
        state: "Karnataka",
        description: "Free electricity for BPL households in Karnataka. Bhagya Jyothi provides free connection and Kutir Jyothi provides subsidized power.",
        benefits: "Free electricity connection + first 40 units free per month for BPL families",
        annualValue: 3600,
        eligibility: {
            gender: "any",
            isBPL: true,
            states: ["karnataka"],
        },
        documents: ["BPL Card", "Aadhaar Card", "House Ownership/Rent Proof"],
        applicationProcess: "Apply at nearest BESCOM/HESCOM/CESCOM office with BPL card.",
        officialLink: "https://bescom.karnataka.gov.in",
    },
    {
        id: "nrega",
        name: "MGNREGA",
        category: "employment",
        level: "central",
        description: "Guaranteed 100 days of wage employment per year to rural households. Minimum wage of Rs.303/day (varies by state).",
        benefits: "100 days guaranteed employment at Rs.303+/day (Rs.30,300+ per year)",
        annualValue: 30300,
        eligibility: {
            minAge: 18,
            gender: "any",
            isRural: true,
            occupations: ["daily-wage", "farmer", "agricultural-laborer", "homemaker"],
        },
        documents: ["Aadhaar Card", "Job Card (NREGA)", "Bank Account", "Passport Photo"],
        applicationProcess: "Apply for Job Card at Gram Panchayat. Demand work in writing. Work must be provided within 15 days.",
        officialLink: "https://nrega.nic.in",
    },
    {
        id: "pm-jeevan-jyoti",
        name: "PM Jeevan Jyoti Bima Yojana",
        category: "social-security",
        level: "central",
        description: "Life insurance scheme offering Rs.2 lakh coverage for death due to any reason at a premium of only Rs.436/year.",
        benefits: "Rs.2,00,000 life insurance cover at Rs.436/year premium",
        annualValue: 200000,
        eligibility: {
            minAge: 18,
            maxAge: 50,
            gender: "any",
        },
        documents: ["Aadhaar Card", "Bank Account with auto-debit", "Nomination Form"],
        applicationProcess: "Enroll through your bank branch or internet banking. Premium auto-debited annually.",
        officialLink: "https://financialservices.gov.in/insurance-divisions/Government-Sponsored-Socially-Oriented-Insurance-Schemes/Pradhan-Mantri-Jeevan-Jyoti-Bima-Yojana(PMJJBY)",
    },
    {
        id: "pm-suraksha-bima",
        name: "PM Suraksha Bima Yojana",
        category: "social-security",
        level: "central",
        description: "Accidental insurance scheme offering Rs.2 lakh for accidental death and Rs.1 lakh for partial disability at only Rs.20/year.",
        benefits: "Rs.2,00,000 accidental death cover + Rs.1,00,000 partial disability at Rs.20/year",
        annualValue: 200000,
        eligibility: {
            minAge: 18,
            maxAge: 70,
            gender: "any",
        },
        documents: ["Aadhaar Card", "Bank Account", "Nomination Form"],
        applicationProcess: "Enroll at any bank branch. Premium of Rs.20 auto-debited from savings account.",
        officialLink: "https://financialservices.gov.in/insurance-divisions/Government-Sponsored-Socially-Oriented-Insurance-Schemes/Pradhan-Mantri-Suraksha-Bima-Yojana(PMSBY)",
    },
    {
        id: "stand-up-india",
        name: "Stand Up India Scheme",
        category: "business",
        level: "central",
        description: "Bank loans between Rs.10 lakh to Rs.1 crore for SC/ST and women entrepreneurs for greenfield enterprises in manufacturing, services, or trading.",
        benefits: "Loans from Rs.10 lakh to Rs.1 crore for new business ventures",
        annualValue: 100000,
        eligibility: {
            minAge: 18,
            gender: "any",
            occupations: ["self-employed", "small-business"],
            // NOTE: Real scheme is for SC/ST of any gender OR women of any category.
            // We handle this special dual-eligibility in the scoring function.
        },
        documents: ["Aadhaar Card", "PAN Card", "Caste Certificate", "Business Plan", "Address Proof", "Bank Statements"],
        applicationProcess: "Apply online at standupmitra.in or approach any scheduled commercial bank branch.",
        officialLink: "https://www.standupmitra.in",
    },
    {
        id: "national-pension",
        name: "National Pension System (NPS)",
        category: "pension",
        level: "central",
        description: "Voluntary pension scheme for systematic savings during working life. Government contributes for eligible subscribers. Tax benefits under 80CCD.",
        benefits: "Market-linked pension returns + tax benefits up to Rs.2 lakh/year under Section 80CCD",
        annualValue: 50000,
        eligibility: {
            minAge: 18,
            maxAge: 65,
            gender: "any",
            occupations: ["salaried", "self-employed", "small-business"],
        },
        documents: ["Aadhaar Card", "PAN Card", "Bank Account", "Photograph"],
        applicationProcess: "Register online at enps.nsdl.com or through any Point of Presence (PoP).",
        officialLink: "https://npscra.nsdl.co.in",
    },
    {
        id: "pm-kaushal-vikas",
        name: "PM Kaushal Vikas Yojana",
        category: "employment",
        level: "central",
        description: "Free skill development training and certification for youth. Covers 300+ job roles with placement assistance and Rs.8,000 reward on certification.",
        benefits: "Free training + certification + Rs.8,000 reward + placement assistance",
        annualValue: 8000,
        eligibility: {
            minAge: 15,
            maxAge: 45,
            gender: "any",
            occupations: ["unemployed", "daily-wage", "student"],
        },
        documents: ["Aadhaar Card", "Bank Account", "Educational Certificates"],
        applicationProcess: "Register at pmkvyofficial.org or visit nearest PMKVY Training Centre.",
        officialLink: "https://pmkvyofficial.org",
    },
    {
        id: "free-ration",
        name: "PM Garib Kalyan Anna Yojana",
        category: "social-security",
        level: "central",
        description: "Free ration of 5 kg food grains per person per month for all priority households and Antyodaya families under NFSA.",
        benefits: "5 kg free wheat/rice per person per month for BPL families",
        annualValue: 9000,
        eligibility: {
            gender: "any",
            isBPL: true,
        },
        documents: ["Ration Card (Priority/Antyodaya)", "Aadhaar Card"],
        applicationProcess: "Automatic for existing NFSA beneficiaries. Collect from nearest Fair Price Shop using ration card or Aadhaar.",
        officialLink: "https://nfsa.gov.in",
    },
    {
        id: "ujjwala",
        name: "PM Ujjwala Yojana",
        category: "social-security",
        level: "central",
        description: "Free LPG gas connection for BPL women. Provides deposit-free LPG connection with financial assistance for first refill and stove.",
        benefits: "Free LPG connection + Rs.1,600 for first refill and stove for BPL women",
        annualValue: 1600,
        eligibility: {
            gender: "female",
            isBPL: true,
            minAge: 18,
        },
        documents: ["Aadhaar Card", "BPL Certificate/Ration Card", "Bank Account", "Passport Photo"],
        applicationProcess: "Apply at nearest LPG distributor with BPL documents. Verification and connection within 7 days.",
        officialLink: "https://pmuy.gov.in",
    },
    {
        id: "janani-suraksha",
        name: "Janani Suraksha Yojana",
        category: "health",
        level: "central",
        description: "Cash assistance for institutional delivery to reduce maternal and infant mortality. Higher assistance for BPL mothers in rural areas.",
        benefits: "Rs.700-1,400 for rural mothers and Rs.600 for urban mothers for hospital delivery",
        annualValue: 1400,
        eligibility: {
            minAge: 19,
            maxAge: 45,
            gender: "female",
            isBPL: true,
            isPregnant: true,
        },
        documents: ["Aadhaar Card", "BPL Card", "MCH Card", "Bank Account", "Delivery Certificate"],
        applicationProcess: "Register at Anganwadi or health sub-centre. Payment after institutional delivery.",
        officialLink: "https://nhm.gov.in/index1.php?lang=1&level=3&sublinkid=841&lid=309",
    },
    {
        id: "post-matric-scholarship",
        name: "Post Matric Scholarship for SC/ST",
        category: "education",
        level: "central",
        description: "Central scholarship for SC/ST students studying post-matric courses. Covers tuition, maintenance allowance, and study tour charges.",
        benefits: "Full tuition fee + maintenance allowance of Rs.1,200-3,000/month",
        annualValue: 36000,
        eligibility: {
            minAge: 15,
            maxAge: 35,
            gender: "any",
            maxIncome: 250000,
            categories: ["sc", "st"],
            occupations: ["student"],
        },
        documents: ["Caste Certificate", "Income Certificate", "Previous Marksheet", "Aadhaar Card", "Institution Bonafide", "Bank Account"],
        applicationProcess: "Apply through National Scholarship Portal (scholarships.gov.in). Verified by institution and state government.",
        officialLink: "https://scholarships.gov.in",
    },
    {
        id: "pm-svanidhi",
        name: "PM SVANidhi (Street Vendor Scheme)",
        category: "business",
        level: "central",
        description: "Micro-credit facility for street vendors. Working capital loan of Rs.10,000-50,000 with interest subsidy of 7% and digital payment cashback.",
        benefits: "Loans up to Rs.50,000 with 7% interest subsidy + digital transaction cashback",
        annualValue: 3500,
        eligibility: {
            minAge: 18,
            gender: "any",
            occupations: ["self-employed", "small-business", "daily-wage"],
            maxIncome: 200000,
            isStreetVendor: true,
        },
        documents: ["Aadhaar Card", "Vending Certificate/Letter of Recommendation", "Bank Account", "Photo"],
        applicationProcess: "Apply online at pmsvanidhi.mohua.gov.in or through lending institutions and ULBs.",
        officialLink: "https://pmsvanidhi.mohua.gov.in",
    },
];
const schemePolicyById = {
    "pm-kisan": { targetType: "welfare", incomeSensitivity: "high", benefitType: "cash", isAdditive: true, targetStrength: "primary" },
    "atal-pension": { targetType: "financial", incomeSensitivity: "medium", benefitType: "cash", isAdditive: false, targetStrength: "general" },
    "pm-mudra": { targetType: "financial", incomeSensitivity: "low", benefitType: "loan", isAdditive: false, targetStrength: "secondary" },
    "gruha-lakshmi": { targetType: "welfare", incomeSensitivity: "high", benefitType: "cash", isAdditive: true, targetStrength: "primary" },
    "pm-awas-gramin": { targetType: "welfare", incomeSensitivity: "high", benefitType: "subsidy", isAdditive: false, targetStrength: "primary" },
    "pm-vishwakarma": { targetType: "financial", incomeSensitivity: "low", benefitType: "loan", isAdditive: false, targetStrength: "secondary" },
    "ayushman-bharat": { targetType: "financial", incomeSensitivity: "low", benefitType: "insurance", isAdditive: false, targetStrength: "primary" },
    "sukanya-samriddhi": { targetType: "financial", incomeSensitivity: "low", benefitType: "subsidy", isAdditive: false, targetStrength: "secondary" },
    "anna-bhagya": { targetType: "welfare", incomeSensitivity: "high", benefitType: "subsidy", isAdditive: true, targetStrength: "primary" },
    "pm-matru-vandana": { targetType: "welfare", incomeSensitivity: "high", benefitType: "cash", isAdditive: false, targetStrength: "primary" },
    vidyasiri: { targetType: "welfare", incomeSensitivity: "high", benefitType: "cash", isAdditive: false, targetStrength: "primary" },
    "bhagya-jyothi": { targetType: "welfare", incomeSensitivity: "high", benefitType: "subsidy", isAdditive: true, targetStrength: "primary" },
    nrega: { targetType: "welfare", incomeSensitivity: "high", benefitType: "cash", isAdditive: true, targetStrength: "primary" },
    "pm-jeevan-jyoti": { targetType: "financial", incomeSensitivity: "low", benefitType: "insurance", isAdditive: false, targetStrength: "general" },
    "pm-suraksha-bima": { targetType: "financial", incomeSensitivity: "low", benefitType: "insurance", isAdditive: false, targetStrength: "general" },
    "stand-up-india": { targetType: "financial", incomeSensitivity: "low", benefitType: "loan", isAdditive: false, targetStrength: "secondary" },
    "national-pension": { targetType: "financial", incomeSensitivity: "medium", benefitType: "cash", isAdditive: false, targetStrength: "general" },
    "pm-kaushal-vikas": { targetType: "universal", incomeSensitivity: "medium", benefitType: "subsidy", isAdditive: false, targetStrength: "secondary" },
    "free-ration": { targetType: "welfare", incomeSensitivity: "high", benefitType: "subsidy", isAdditive: true, targetStrength: "primary" },
    ujjwala: { targetType: "welfare", incomeSensitivity: "high", benefitType: "subsidy", isAdditive: false, targetStrength: "primary" },
    "janani-suraksha": { targetType: "welfare", incomeSensitivity: "high", benefitType: "cash", isAdditive: false, targetStrength: "primary" },
    "post-matric-scholarship": { targetType: "welfare", incomeSensitivity: "high", benefitType: "cash", isAdditive: false, targetStrength: "primary" },
    "pm-svanidhi": { targetType: "financial", incomeSensitivity: "low", benefitType: "loan", isAdditive: false, targetStrength: "primary" },
};
exports.schemes = rawSchemes.map((scheme) => ({
    ...scheme,
    ...(schemePolicyById[scheme.id] ?? {
        targetType: "universal",
        incomeSensitivity: "medium",
        benefitType: "subsidy",
        isAdditive: false,
        targetStrength: "general",
    }),
}));
// Map user goals to scheme categories for relevance scoring
const goalToCategoryMap = {
    "Get financial assistance": ["social-security", "women", "pension", "business"],
    "Start or grow a business": ["business", "employment"],
    "Education support": ["education"],
    "Housing assistance": ["housing"],
    "Health insurance": ["health"],
    "Pension & retirement": ["pension", "social-security"],
    "Skill development": ["employment", "education"],
    "Agricultural support": ["agriculture", "employment"],
};
function calculateMatchConfidence(profile, scheme) {
    const elig = scheme.eligibility;
    let confidence = 40;
    let checks = 0;
    const add = (points) => {
        confidence += points;
        checks += 1;
    };
    if (elig.gender && elig.gender !== "any" && profile.gender === elig.gender)
        add(8);
    if (elig.states && elig.states.includes(profile.state.toLowerCase()))
        add(10);
    if (elig.isBPL && profile.isBPL)
        add(10);
    if (elig.isRural && profile.isRural)
        add(8);
    if (elig.isStreetVendor && profile.isStreetVendor)
        add(12);
    if (elig.isArtisan && profile.isArtisan)
        add(12);
    if (elig.categories && elig.categories.includes(profile.category.toLowerCase()))
        add(8);
    if (elig.occupations && elig.occupations.includes(profile.occupation))
        add(10);
    if (elig.maxIncome !== undefined)
        add(8);
    if (scheme.targetStrength === "primary")
        confidence += 4;
    if (checks === 0)
        confidence -= 6;
    return Math.max(0, Math.min(100, confidence));
}
function getEffectiveTargetStrength(profile, scheme, hasBusinessIntent) {
    const hasBusinessGoal = profile.goals.includes("Start or grow a business");
    // Dynamic elevation: Stand Up India is primary when core policy intent is met.
    if (scheme.id === "stand-up-india") {
        const isSCST = ["sc", "st"].includes(profile.category.toLowerCase());
        const isWoman = profile.gender === "female";
        if ((isSCST || isWoman) && hasBusinessIntent) {
            return "primary";
        }
    }
    // Goal-aware hierarchy: when business growth is the user's intent,
    // keep only business-core targeting at primary tier.
    if (hasBusinessGoal &&
        scheme.targetStrength === "primary" &&
        !["business", "employment"].includes(scheme.category) &&
        scheme.id !== "stand-up-india" &&
        scheme.id !== "pm-svanidhi") {
        return "secondary";
    }
    return scheme.targetStrength;
}
function calculateEligibility(profile, scheme) {
    const matchReasons = [];
    const missedReasons = [];
    const elig = scheme.eligibility;
    const disqualify = (reason) => {
        return { scheme, score: 0, confidence: 0, effectiveTargetStrength: scheme.targetStrength, matchReasons: [], missedReasons: [reason], breakdown: [] };
    };
    const hasBusinessIntent = profile.goals.includes("Start or grow a business") ||
        ["self-employed", "small-business", "artisan"].includes(profile.occupation);
    // ── HARD DISQUALIFIERS ──
    // Non-negotiable. Fail = 0 score and hidden from results.
    // 1. Gender
    if (elig.gender && elig.gender !== "any" && profile.gender !== elig.gender) {
        return disqualify(`This scheme is specifically for ${elig.gender} applicants`);
    }
    // 2. Age
    if (elig.minAge !== undefined || elig.maxAge !== undefined) {
        const minAge = elig.minAge ?? 0;
        const maxAge = elig.maxAge ?? 120;
        if (profile.age < minAge || profile.age > maxAge) {
            return disqualify(`Age requirement: ${minAge}-${maxAge} years (you are ${profile.age})`);
        }
    }
    // 3. State
    if (elig.states && elig.states.length > 0) {
        if (!elig.states.includes(profile.state.toLowerCase())) {
            return disqualify(`Only available in: ${elig.states.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(", ")}`);
        }
    }
    // 4. BPL
    if (elig.isBPL && !profile.isBPL) {
        return disqualify("Requires BPL (Below Poverty Line) card holder status");
    }
    // 4.5 Pregnant
    if (elig.isPregnant && !profile.isPregnant) {
        return disqualify("Requires pregnancy status");
    }
    // 5. Rural
    if (elig.isRural && !profile.isRural) {
        return disqualify("This scheme is available for rural areas only");
    }
    // 5.5 Street vendor
    if (elig.isStreetVendor && !profile.isStreetVendor) {
        return disqualify("Requires active street-vendor profile");
    }
    // 5.6 Artisan
    if (elig.isArtisan && !profile.isArtisan) {
        return disqualify("Requires traditional artisan/craftsperson profile");
    }
    // 5.7 Head of household
    if (elig.isHeadOfHousehold && !profile.isHeadOfHousehold) {
        return disqualify("Requires woman head-of-household status");
    }
    // 6. Income
    if (elig.maxIncome !== undefined && profile.annualIncome > elig.maxIncome) {
        return disqualify(`Income limit is Rs.${elig.maxIncome.toLocaleString('en-IN')}/year (yours: Rs.${profile.annualIncome.toLocaleString('en-IN')})`);
    }
    // 7. Category (skip for Stand Up India -- handled separately)
    if (scheme.id !== "stand-up-india" && elig.categories && elig.categories.length > 0) {
        if (!elig.categories.includes(profile.category.toLowerCase())) {
            return disqualify(`Limited to ${elig.categories.map(c => c.toUpperCase()).join(", ")} categories`);
        }
    }
    // 8. Occupation hard-check: if scheme lists specific occupations and user has
    //    ZERO connection (not direct, not related), disqualify.
    const occupationRelatedMap = {
        "farmer": ["agricultural-laborer"],
        "agricultural-laborer": ["farmer", "daily-wage"],
        "self-employed": ["small-business", "artisan"],
        "small-business": ["self-employed"],
        "daily-wage": ["agricultural-laborer", "farmer"],
        "artisan": ["self-employed"],
        "homemaker": ["daily-wage"],
        "student": [],
        "salaried": [],
        "unemployed": ["daily-wage"],
    };
    if (scheme.id !== "stand-up-india" && elig.occupations && elig.occupations.length > 0) {
        const directMatch = elig.occupations.includes(profile.occupation);
        const relatedOccs = occupationRelatedMap[profile.occupation] || [];
        const relatedMatch = relatedOccs.some(o => elig.occupations.includes(o));
        const mudraStreetVendorBridge = scheme.id === "pm-mudra" &&
            profile.isStreetVendor &&
            profile.goals.includes("Start or grow a business");
        if (!directMatch && !relatedMatch) {
            if (!mudraStreetVendorBridge) {
                return disqualify(`Required occupations: ${elig.occupations.map(o => o.replace(/-/g, " ")).join(", ")}`);
            }
        }
    }
    // ── SPECIAL: Stand Up India dual eligibility ──
    // This scheme is for: SC/ST of any gender OR women of any category
    let standUpIndiaBonus = false;
    if (scheme.id === "stand-up-india") {
        const isSCST = ["sc", "st"].includes(profile.category.toLowerCase());
        const isWoman = profile.gender === "female";
        if (!isSCST && !isWoman) {
            return disqualify("This scheme is for SC/ST entrepreneurs or women entrepreneurs");
        }
        if (!hasBusinessIntent) {
            return disqualify("Requires business intent or entrepreneurial profile");
        }
        if (isSCST && isWoman) {
            standUpIndiaBonus = true; // qualifies on both criteria
        }
    }
    // ── SCORING ──
    // User has passed all hard checks. Now score relevance on a 100-point scale.
    //
    // KEY PRINCIPLE: If a criterion has no restriction (e.g. no age limit),
    // the user is fully eligible -- they should NOT be penalized. "Open to all"
    // means you qualify, so you get full or near-full points.
    //
    // Weights: Occupation 20, Income 15, Category 10, Age 10, Gender 10,
    //          BPL/Rural 10, State 5, Goals 15, Special Bonus 5 = 100
    let score = 0;
    const breakdown = [];
    let targetingMultiplier = 1;
    let targetingReason = "Policy targeting fit is strong";
    // --- Occupation (20 pts) ---
    if (elig.occupations && elig.occupations.length > 0) {
        const directMatch = elig.occupations.includes(profile.occupation);
        if (directMatch) {
            score += 20;
            breakdown.push({ label: "Occupation", earned: 20, max: 20,
                reason: `Your occupation (${profile.occupation.replace(/-/g, " ")}) directly qualifies` });
            matchReasons.push("Your occupation directly qualifies");
        }
        else {
            // Related match (already confirmed above in hard-check)
            score += 14;
            breakdown.push({ label: "Occupation", earned: 14, max: 20,
                reason: `Related to required occupations (${elig.occupations.map(o => o.replace(/-/g, " ")).join(", ")}) - may need verification` });
            matchReasons.push("Related occupation may qualify with verification");
        }
    }
    else {
        // No occupation restriction = you qualify fully
        score += 18;
        breakdown.push({ label: "Occupation", earned: 18, max: 20,
            reason: "Open to all occupations - you are eligible" });
        matchReasons.push("Open to all occupations");
    }
    // --- Income (15 pts) ---
    if (elig.maxIncome !== undefined) {
        // User passed hard-check, so they're within limits. Score by margin.
        const incomeRatio = profile.annualIncome / elig.maxIncome;
        if (incomeRatio <= 0.4) {
            score += 15;
            breakdown.push({ label: "Income", earned: 15, max: 15,
                reason: `Income Rs.${profile.annualIncome.toLocaleString('en-IN')} is well within the Rs.${elig.maxIncome.toLocaleString('en-IN')} limit` });
        }
        else if (incomeRatio <= 0.7) {
            score += 13;
            breakdown.push({ label: "Income", earned: 13, max: 15,
                reason: `Income Rs.${profile.annualIncome.toLocaleString('en-IN')} is within the Rs.${elig.maxIncome.toLocaleString('en-IN')} limit` });
        }
        else {
            score += 10;
            breakdown.push({ label: "Income", earned: 10, max: 15,
                reason: `Income Rs.${profile.annualIncome.toLocaleString('en-IN')} is close to the Rs.${elig.maxIncome.toLocaleString('en-IN')} limit` });
        }
        matchReasons.push(`Income within scheme limit`);
    }
    else {
        // No hard income cap. Score relevance based on policy intent.
        let pts = 10;
        let reason = "No income cap - you are eligible";
        switch (scheme.incomeSensitivity) {
            case "high":
                if (profile.annualIncome <= 200000) {
                    pts = 15;
                    reason = "High income sensitivity: very strong match for low-income households";
                }
                else if (profile.annualIncome <= 500000) {
                    pts = 10;
                    reason = "High income sensitivity: moderate match";
                }
                else if (profile.annualIncome <= 1000000) {
                    pts = 4;
                    reason = "High income sensitivity: limited relevance at this income level";
                }
                else {
                    pts = 0;
                    reason = "High income sensitivity: minimal relevance for high-income profiles";
                }
                break;
            case "medium":
                if (profile.annualIncome <= 200000) {
                    pts = 15;
                    reason = "Medium income sensitivity: strong relevance";
                }
                else if (profile.annualIncome <= 500000) {
                    pts = 12;
                    reason = "Medium income sensitivity: good relevance";
                }
                else if (profile.annualIncome <= 800000) {
                    pts = 9;
                    reason = "Medium income sensitivity: moderate relevance";
                }
                else if (profile.annualIncome <= 1200000) {
                    pts = 6;
                    reason = "Medium income sensitivity: reduced relevance";
                }
                else {
                    pts = 4;
                    reason = "Medium income sensitivity: still eligible but lower targeting fit";
                }
                break;
            case "low":
                if (profile.annualIncome <= 300000) {
                    pts = 15;
                    reason = "Low income sensitivity: strong relevance";
                }
                else if (profile.annualIncome <= 800000) {
                    pts = 13;
                    reason = "Low income sensitivity: good relevance";
                }
                else if (profile.annualIncome <= 1500000) {
                    pts = 11;
                    reason = "Low income sensitivity: mild dampening for higher income";
                }
                else {
                    pts = 9;
                    reason = "Low income sensitivity: broad coverage, minor income impact";
                }
                break;
            default:
                break;
        }
        if (scheme.targetType === "universal") {
            pts = Math.max(pts, 12);
            reason = `${reason}. Universal scheme intent keeps income penalty mild`;
        }
        if (scheme.targetType === "welfare" && scheme.incomeSensitivity === "high") {
            if (profile.annualIncome <= 200000) {
                targetingMultiplier = 1;
            }
            else if (profile.annualIncome <= 500000) {
                targetingMultiplier = 0.85;
            }
            else if (profile.annualIncome <= 1000000) {
                targetingMultiplier = 0.55;
            }
            else if (profile.annualIncome <= 2000000) {
                targetingMultiplier = 0.25;
            }
            else {
                targetingMultiplier = 0.08;
            }
        }
        else if (scheme.targetType === "welfare" && scheme.incomeSensitivity === "medium") {
            if (profile.annualIncome <= 500000) {
                targetingMultiplier = 1;
            }
            else if (profile.annualIncome <= 1000000) {
                targetingMultiplier = 0.8;
            }
            else if (profile.annualIncome <= 2000000) {
                targetingMultiplier = 0.6;
            }
            else if (profile.annualIncome <= 5000000) {
                targetingMultiplier = 0.45;
            }
            else {
                targetingMultiplier = 0.3;
            }
        }
        else if (scheme.targetType === "financial" && scheme.incomeSensitivity === "low") {
            if (profile.annualIncome <= 1000000) {
                targetingMultiplier = 1;
            }
            else if (profile.annualIncome <= 2000000) {
                targetingMultiplier = 0.95;
            }
            else if (profile.annualIncome <= 5000000) {
                targetingMultiplier = 0.85;
            }
            else {
                targetingMultiplier = 0.75;
            }
        }
        else if (scheme.targetType === "universal") {
            targetingMultiplier = 1;
        }
        if (targetingMultiplier < 0.5) {
            targetingReason = "Scheme intent primarily targets lower-income households; relevance reduced for your income level";
        }
        else if (targetingMultiplier < 0.8) {
            targetingReason = "Policy targeting fit is moderate for your income level";
        }
        score += pts;
        breakdown.push({ label: "Income", earned: pts, max: 15, reason });
        matchReasons.push("No income hard cap");
    }
    // --- Category (10 pts) ---
    if (scheme.id === "stand-up-india") {
        // Special handling
        const isSCST = ["sc", "st"].includes(profile.category.toLowerCase());
        if (isSCST) {
            score += 10;
            breakdown.push({ label: "Category", earned: 10, max: 10,
                reason: `SC/ST category directly eligible for Stand Up India` });
            matchReasons.push("SC/ST category directly eligible");
        }
        else {
            // Woman of other category
            score += 8;
            breakdown.push({ label: "Category", earned: 8, max: 10,
                reason: `Eligible as a woman entrepreneur (scheme is for SC/ST or women)` });
            matchReasons.push("Eligible as a woman entrepreneur");
        }
    }
    else if (elig.categories && elig.categories.length > 0) {
        score += 10;
        breakdown.push({ label: "Category", earned: 10, max: 10,
            reason: `Your category (${profile.category.toUpperCase()}) is specifically listed` });
        matchReasons.push(`Your category (${profile.category.toUpperCase()}) is eligible`);
    }
    else {
        // Open to all categories = you qualify
        score += 9;
        breakdown.push({ label: "Category", earned: 9, max: 10,
            reason: "Open to all social categories - you are eligible" });
        matchReasons.push("Open to all social categories");
    }
    // --- Age (10 pts) ---
    if (elig.minAge !== undefined || elig.maxAge !== undefined) {
        const minAge = elig.minAge ?? 0;
        const maxAge = elig.maxAge ?? 120;
        const range = maxAge - minAge;
        const distFromEdge = Math.min(profile.age - minAge, maxAge - profile.age);
        // More points if you're comfortably within the range (not at edges)
        if (range > 0 && distFromEdge / range >= 0.15) {
            score += 10;
            breakdown.push({ label: "Age", earned: 10, max: 10,
                reason: `Age ${profile.age} fits well within ${minAge}-${maxAge} years` });
        }
        else {
            score += 8;
            breakdown.push({ label: "Age", earned: 8, max: 10,
                reason: `Age ${profile.age} qualifies but is near the edge of ${minAge}-${maxAge} years` });
        }
        matchReasons.push(`Age ${profile.age} within eligible range`);
    }
    else {
        score += 10;
        breakdown.push({ label: "Age", earned: 10, max: 10,
            reason: "No age restriction - you are eligible" });
        matchReasons.push("No age restriction");
    }
    // --- Gender (10 pts) ---
    if (elig.gender && elig.gender !== "any") {
        score += 10;
        breakdown.push({ label: "Gender", earned: 10, max: 10,
            reason: `Specifically designed for ${elig.gender} applicants - you qualify` });
        matchReasons.push(`Gender requirement matched`);
    }
    else {
        score += 9;
        breakdown.push({ label: "Gender", earned: 9, max: 10,
            reason: "Open to all genders - you are eligible" });
        matchReasons.push("Open to all genders");
    }
    // --- BPL/Rural (10 pts) ---
    if (elig.isBPL && elig.isRural) {
        // Scheme requires both
        score += 10;
        breakdown.push({ label: "BPL/Rural", earned: 10, max: 10,
            reason: "BPL + Rural requirement both met" });
        matchReasons.push("BPL and rural requirements confirmed");
    }
    else if (elig.isBPL) {
        score += 10;
        breakdown.push({ label: "BPL/Rural", earned: 10, max: 10,
            reason: "BPL requirement met - scheme is directly for you" });
        matchReasons.push("BPL status confirmed");
    }
    else if (elig.isRural) {
        score += 10;
        breakdown.push({ label: "BPL/Rural", earned: 10, max: 10,
            reason: "Rural area requirement met - scheme is for your area" });
        matchReasons.push("Rural area requirement met");
    }
    else {
        // Scheme has no BPL/rural requirement
        // Give full points since it's not a barrier
        score += 9;
        let reason = "No BPL/rural requirement - you are eligible";
        if (profile.isBPL) {
            reason = "No BPL requirement needed - you are eligible (check BPL-specific schemes for more targeted support)";
        }
        breakdown.push({ label: "BPL/Rural", earned: 9, max: 10, reason });
    }
    // --- State (5 pts) ---
    if (elig.states && elig.states.length > 0) {
        score += 5;
        breakdown.push({ label: "State", earned: 5, max: 5,
            reason: `State-specific scheme for your state - full match` });
        matchReasons.push(`Available in your state`);
    }
    else {
        score += 5;
        breakdown.push({ label: "State", earned: 5, max: 5,
            reason: "Nationwide scheme - available in all states" });
        matchReasons.push("Available nationwide");
    }
    // --- Goals (15 pts) ---
    const schemeCategories = [scheme.category];
    const userGoalCategories = profile.goals.flatMap(goal => goalToCategoryMap[goal] || []);
    const goalMatch = schemeCategories.some(cat => userGoalCategories.includes(cat));
    if (goalMatch) {
        score += 15;
        breakdown.push({ label: "Goals", earned: 15, max: 15,
            reason: "Scheme directly aligns with your selected goals" });
        matchReasons.push("Matches your selected goals");
    }
    else if (profile.goals.length === 0) {
        score += 10;
        breakdown.push({ label: "Goals", earned: 10, max: 15,
            reason: "No goals selected - consider selecting goals for better matching" });
    }
    else {
        // User has goals but this scheme doesn't match them.
        // For strongly targeted schemes, avoid over-penalizing when profile fit is high.
        const hasStrongTargetingSignals = (elig.gender !== undefined && elig.gender !== "any") ||
            (elig.states !== undefined && elig.states.length > 0) ||
            elig.isBPL === true ||
            elig.isRural === true ||
            (elig.categories !== undefined && elig.categories.length > 0) ||
            (elig.occupations !== undefined && elig.occupations.length > 0) ||
            elig.maxIncome !== undefined;
        const goalPts = hasStrongTargetingSignals ? 8 : 3;
        score += goalPts;
        breakdown.push({
            label: "Goals",
            earned: goalPts,
            max: 15,
            reason: hasStrongTargetingSignals
                ? `Scheme category (${scheme.category}) differs from your goals, but profile targeting fit is strong`
                : `Scheme category (${scheme.category}) doesn't match your goals - but you are still eligible`,
        });
    }
    // --- Special Bonus (5 pts) ---
    // Extra points for very strong targeted matches
    const bonusMax = 6;
    let bonusEarned = 0;
    let bonusReason = "No additional bonus criteria";
    if (scheme.id === "pm-svanidhi" &&
        profile.isStreetVendor &&
        profile.goals.includes("Start or grow a business")) {
        bonusEarned = 6;
        bonusReason = "Street-vendor business intent is an exact policy match for PM SVANidhi";
    }
    else if (standUpIndiaBonus) {
        bonusEarned = 5;
        bonusReason = "Qualifies on both SC/ST and women criteria";
    }
    else if (elig.isBPL && profile.isBPL && elig.isRural && profile.isRural) {
        bonusEarned = 5;
        bonusReason = "Exact match on BPL + Rural targeting";
    }
    else if (elig.occupations && elig.occupations.includes(profile.occupation) &&
        elig.categories && elig.categories.includes(profile.category.toLowerCase())) {
        bonusEarned = 5;
        bonusReason = "Both occupation and category directly match";
    }
    else if (elig.gender && elig.gender !== "any" && profile.gender === elig.gender &&
        elig.isBPL && profile.isBPL) {
        bonusEarned = 4;
        bonusReason = "Gender-targeted + BPL scheme matches your profile";
    }
    else if (elig.occupations && elig.occupations.includes(profile.occupation)) {
        bonusEarned = 2;
        bonusReason = "Direct occupation match gives slight relevance boost";
    }
    else if (scheme.targetType === "welfare" &&
        scheme.incomeSensitivity === "high" &&
        ((elig.maxIncome !== undefined && profile.annualIncome <= elig.maxIncome) ||
            (elig.isBPL === true && profile.isBPL)) &&
        ((elig.gender !== undefined && elig.gender !== "any" && profile.gender === elig.gender) ||
            (elig.states !== undefined && elig.states.includes(profile.state.toLowerCase())))) {
        bonusEarned = 4;
        bonusReason = "Strong policy targeting fit on income and demographic conditions";
    }
    score += bonusEarned;
    breakdown.push({ label: "Specificity Bonus", earned: bonusEarned, max: bonusMax, reason: bonusReason });
    const scaledScore = Math.round(score * targetingMultiplier);
    const finalScore = Math.min(scaledScore, 100);
    if (targetingMultiplier < 1) {
        const policyEarned = Math.round(targetingMultiplier * 10);
        breakdown.push({ label: "Policy Targeting Fit", earned: policyEarned, max: 10, reason: targetingReason });
    }
    if (targetingMultiplier <= 0.25) {
        missedReasons.push("Low policy-fit due to high income relative to this scheme's intended target group");
    }
    const confidence = calculateMatchConfidence(profile, scheme);
    const effectiveTargetStrength = getEffectiveTargetStrength(profile, scheme, hasBusinessIntent);
    return {
        scheme,
        score: finalScore,
        confidence,
        effectiveTargetStrength,
        matchReasons,
        missedReasons,
        breakdown,
    };
}
function getMatchedSchemes(profile) {
    const strengthRank = {
        primary: 3,
        secondary: 2,
        general: 1,
    };
    return exports.schemes
        .map(scheme => calculateEligibility(profile, scheme))
        .filter(match => match.score > 0) // Remove completely disqualified schemes
        .sort((a, b) => {
        const strengthDiff = strengthRank[b.effectiveTargetStrength] - strengthRank[a.effectiveTargetStrength];
        if (strengthDiff !== 0)
            return strengthDiff;
        const scoreDiff = b.score - a.score;
        if (scoreDiff !== 0)
            return scoreDiff;
        return b.confidence - a.confidence;
    });
}
function calculateBenefitBreakdown(matches) {
    const confidenceWeight = (score) => {
        if (score >= 85)
            return 1;
        if (score >= 70)
            return 0.85;
        if (score >= 55)
            return 0.6;
        if (score >= 40)
            return 0.35;
        return 0;
    };
    const weightedValue = (match) => match.scheme.annualValue * confidenceWeight(match.score);
    const strongMatches = matches.filter((match) => match.score >= 70);
    const conditionalMatches = matches.filter((match) => match.score >= 40 && match.score < 70);
    const directSupportTotal = Math.round(strongMatches
        .filter((match) => match.scheme.isAdditive &&
        (match.scheme.benefitType === "cash" || match.scheme.benefitType === "subsidy"))
        .reduce((sum, match) => sum + weightedValue(match), 0));
    const additiveInsurance = matches
        .filter((match) => match.score >= 40 && match.scheme.isAdditive && match.scheme.benefitType === "insurance")
        .reduce((sum, match) => sum + weightedValue(match), 0);
    const nonAdditiveInsurance = matches
        .filter((match) => match.score >= 40 && !match.scheme.isAdditive && match.scheme.benefitType === "insurance")
        .reduce((max, match) => Math.max(max, weightedValue(match)), 0);
    const loanAccessPotential = Math.round(matches
        .filter((match) => match.score >= 40 && match.scheme.benefitType === "loan")
        .reduce((max, match) => Math.max(max, weightedValue(match)), 0));
    const conditionalCashAndSubsidy = conditionalMatches
        .filter((match) => match.scheme.benefitType === "cash" || match.scheme.benefitType === "subsidy")
        .reduce((sum, match) => sum + weightedValue(match), 0);
    const conditionalAdditiveInsurance = conditionalMatches
        .filter((match) => match.scheme.isAdditive && match.scheme.benefitType === "insurance")
        .reduce((sum, match) => sum + weightedValue(match), 0);
    const conditionalNonAdditiveInsurance = conditionalMatches
        .filter((match) => !match.scheme.isAdditive && match.scheme.benefitType === "insurance")
        .reduce((max, match) => Math.max(max, weightedValue(match)), 0);
    const conditionalLoan = conditionalMatches
        .filter((match) => match.scheme.benefitType === "loan")
        .reduce((max, match) => Math.max(max, weightedValue(match)), 0);
    const conditionalSupportTotal = Math.round(conditionalCashAndSubsidy +
        conditionalAdditiveInsurance +
        conditionalNonAdditiveInsurance +
        conditionalLoan);
    return {
        directSupportTotal,
        insuranceCoverageTotal: Math.round(additiveInsurance + nonAdditiveInsurance),
        loanAccessPotential,
        conditionalSupportTotal,
    };
}
