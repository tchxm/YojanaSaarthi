// 10-scenario test for scheme matching accuracy
// Run with: node scripts/test-scenarios.js

// ---- Inline the scheme data and scoring logic (ES module, no TS) ----

const schemes = [
  { id: "pm-kisan", name: "PM Kisan Samman Nidhi", category: "agriculture", level: "central", annualValue: 6000, strictOccupation: true, eligibility: { gender: "any", occupations: ["farmer"] } },
  { id: "atal-pension", name: "Atal Pension Yojana", category: "pension", level: "central", annualValue: 60000, eligibility: { minAge: 18, maxAge: 40, gender: "any", occupations: ["self-employed", "daily-wage", "homemaker", "agricultural-laborer", "small-business"] } },
  { id: "pm-mudra", name: "PM Mudra Yojana", category: "business", level: "central", annualValue: 50000, eligibility: { minAge: 18, gender: "any", occupations: ["self-employed", "small-business"] } },
  { id: "gruha-lakshmi", name: "Gruha Lakshmi Scheme", category: "women", level: "state", annualValue: 24000, eligibility: { minAge: 18, gender: "female", states: ["karnataka"], maxIncome: 200000 } },
  { id: "pm-awas-gramin", name: "PM Awas Yojana Gramin", category: "housing", level: "central", annualValue: 120000, eligibility: { gender: "any", isRural: true, isBPL: true } },
  { id: "pm-vishwakarma", name: "PM Vishwakarma Yojana", category: "employment", level: "central", annualValue: 15000, eligibility: { minAge: 18, gender: "any", occupations: ["self-employed", "artisan"] } },
  { id: "ayushman-bharat", name: "Ayushman Bharat PMJAY", category: "health", level: "central", annualValue: 500000, eligibility: { gender: "any", isBPL: true } },
  { id: "sukanya-samriddhi", name: "Sukanya Samriddhi Yojana", category: "education", level: "central", annualValue: 12000, eligibility: { maxAge: 10, gender: "female" } },
  { id: "anna-bhagya", name: "Anna Bhagya Scheme", category: "social-security", level: "state", annualValue: 7200, eligibility: { gender: "any", isBPL: true, states: ["karnataka"] } },
  { id: "pm-matru-vandana", name: "PM Matru Vandana Yojana", category: "women", level: "central", annualValue: 5000, eligibility: { minAge: 19, maxAge: 45, gender: "female", isPregnant: true } },
  { id: "vidyasiri", name: "Vidyasiri Scholarship", category: "education", level: "state", annualValue: 42000, eligibility: { minAge: 15, maxAge: 30, gender: "any", maxIncome: 250000, categories: ["sc", "st"], states: ["karnataka"] } },
  { id: "bhagya-jyothi", name: "Bhagya Jyothi", category: "social-security", level: "state", annualValue: 3600, eligibility: { gender: "any", isBPL: true, states: ["karnataka"] } },
  { id: "nrega", name: "MGNREGA", category: "employment", level: "central", annualValue: 30300, eligibility: { minAge: 18, gender: "any", isRural: true, occupations: ["daily-wage", "farmer", "agricultural-laborer", "homemaker"] } },
  { id: "pm-jeevan-jyoti", name: "PM Jeevan Jyoti Bima", category: "social-security", level: "central", annualValue: 200000, eligibility: { minAge: 18, maxAge: 50, gender: "any" } },
  { id: "pm-suraksha-bima", name: "PM Suraksha Bima", category: "social-security", level: "central", annualValue: 200000, eligibility: { minAge: 18, maxAge: 70, gender: "any" } },
  { id: "stand-up-india", name: "Stand Up India", category: "business", level: "central", annualValue: 100000, eligibility: { minAge: 18, gender: "any", occupations: ["self-employed", "small-business"] } },
  { id: "national-pension", name: "NPS", category: "pension", level: "central", annualValue: 50000, eligibility: { minAge: 18, maxAge: 65, gender: "any", occupations: ["salaried", "self-employed", "small-business"] } },
  { id: "pm-kaushal-vikas", name: "PM Kaushal Vikas", category: "employment", level: "central", annualValue: 8000, eligibility: { minAge: 15, maxAge: 45, gender: "any", occupations: ["unemployed", "daily-wage", "student"] } },
  { id: "free-ration", name: "PM Garib Kalyan Anna", category: "social-security", level: "central", annualValue: 9000, eligibility: { gender: "any", isBPL: true } },
  { id: "ujjwala", name: "PM Ujjwala Yojana", category: "social-security", level: "central", annualValue: 1600, eligibility: { gender: "female", isBPL: true, minAge: 18 } },
  { id: "janani-suraksha", name: "Janani Suraksha Yojana", category: "health", level: "central", annualValue: 1400, eligibility: { minAge: 19, maxAge: 45, gender: "female", isBPL: true, isPregnant: true } },
  { id: "post-matric-scholarship", name: "Post Matric Scholarship SC/ST", category: "education", level: "central", annualValue: 36000, eligibility: { minAge: 15, maxAge: 35, gender: "any", maxIncome: 250000, categories: ["sc", "st"], occupations: ["student"] } },
  { id: "pm-svanidhi", name: "PM SVANidhi", category: "business", level: "central", annualValue: 3500, eligibility: { minAge: 18, gender: "any", occupations: ["self-employed", "small-business", "daily-wage"], maxIncome: 200000, isStreetVendor: true } },
];

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

function calculateEligibility(profile, scheme) {
  const matchReasons = [];
  const missedReasons = [];
  const elig = scheme.eligibility;
  const hasBusinessIntent =
    profile.goals.includes("Start or grow a business") ||
    ["self-employed", "small-business", "artisan"].includes(profile.occupation);

  const disqualify = (reason) => ({ scheme, score: 0, matchReasons: [], missedReasons: [reason], breakdown: [] });

  // HARD DISQUALIFIERS
  if (elig.gender && elig.gender !== "any" && profile.gender !== elig.gender)
    return disqualify(`Gender: for ${elig.gender} only`);
  if (elig.minAge !== undefined || elig.maxAge !== undefined) {
    const minAge = elig.minAge ?? 0, maxAge = elig.maxAge ?? 120;
    if (profile.age < minAge || profile.age > maxAge) return disqualify(`Age: ${minAge}-${maxAge} (you: ${profile.age})`);
  }
  if (elig.states?.length > 0 && !elig.states.includes(profile.state.toLowerCase()))
    return disqualify(`State: only ${elig.states.join(", ")}`);
  if (elig.isBPL && !profile.isBPL) return disqualify("Requires BPL");
  if (elig.isRural && !profile.isRural) return disqualify("Requires Rural");
  if (elig.isStreetVendor && !profile.isStreetVendor) return disqualify("Requires street-vendor profile");
  if (elig.maxIncome !== undefined && profile.annualIncome > elig.maxIncome)
    return disqualify(`Income > limit ${elig.maxIncome}`);
  if (scheme.id !== "stand-up-india" && elig.categories?.length > 0 && !elig.categories.includes(profile.category.toLowerCase()))
    return disqualify(`Category: only ${elig.categories.join(", ")}`);

  if (elig.isPregnant && !profile.isPregnant) return disqualify("Requires pregnancy");

  // Stand Up India special
  let standUpIndiaBonus = false;
  if (scheme.id === "stand-up-india") {
    const isSCST = ["sc", "st"].includes(profile.category.toLowerCase());
    const isWoman = profile.gender === "female";
    if (!isSCST && !isWoman) return disqualify("Stand Up India: for SC/ST or women");
    if (!hasBusinessIntent) return disqualify("Stand Up India: requires business intent");
    if (isSCST && isWoman) standUpIndiaBonus = true;
  }

  // Occupation hard-check
  if (scheme.id !== "stand-up-india" && elig.occupations?.length > 0) {
    const direct = elig.occupations.includes(profile.occupation);
    const related = (occupationRelatedMap[profile.occupation] || []).some(o => elig.occupations.includes(o));
    const mudraStreetVendorBridge =
      scheme.id === "pm-mudra" &&
      profile.isStreetVendor &&
      profile.goals.includes("Start or grow a business");
    const occMatched = scheme.strictOccupation ? direct : (direct || related || mudraStreetVendorBridge);
    if (!occMatched) return disqualify(`Occupation: needs ${elig.occupations.join(", ")}`);
  }

  // SCORING
  let score = 0;
  const breakdown = [];

  // Occupation (20)
  if (elig.occupations?.length > 0) {
    if (elig.occupations.includes(profile.occupation)) { score += 20; breakdown.push({ label: "Occupation", earned: 20, max: 20 }); }
    else { score += 14; breakdown.push({ label: "Occupation", earned: 14, max: 20 }); }
  } else { score += 18; breakdown.push({ label: "Occupation", earned: 18, max: 20 }); }

  // Income (15)
  if (elig.maxIncome !== undefined) {
    const r = profile.annualIncome / elig.maxIncome;
    if (r <= 0.4) { score += 15; breakdown.push({ label: "Income", earned: 15, max: 15 }); }
    else if (r <= 0.7) { score += 13; breakdown.push({ label: "Income", earned: 13, max: 15 }); }
    else { score += 10; breakdown.push({ label: "Income", earned: 10, max: 15 }); }
  } else {
    let pts;
    if (profile.annualIncome <= 100000) pts = 15;
    else if (profile.annualIncome <= 250000) pts = 14;
    else if (profile.annualIncome <= 500000) pts = 12;
    else if (profile.annualIncome <= 1000000) pts = 10;
    else pts = 7;
    score += pts; breakdown.push({ label: "Income", earned: pts, max: 15 });
  }

  // Category (10)
  if (scheme.id === "stand-up-india") {
    const isSCST = ["sc", "st"].includes(profile.category.toLowerCase());
    if (isSCST) { score += 10; breakdown.push({ label: "Category", earned: 10, max: 10 }); }
    else { score += 8; breakdown.push({ label: "Category", earned: 8, max: 10 }); }
  } else if (elig.categories?.length > 0) {
    score += 10; breakdown.push({ label: "Category", earned: 10, max: 10 });
  } else {
    score += 9; breakdown.push({ label: "Category", earned: 9, max: 10 });
  }

  // Age (10)
  if (elig.minAge !== undefined || elig.maxAge !== undefined) {
    const minAge = elig.minAge ?? 0, maxAge = elig.maxAge ?? 120;
    const range = maxAge - minAge;
    const dist = Math.min(profile.age - minAge, maxAge - profile.age);
    if (range > 0 && dist / range >= 0.15) { score += 10; breakdown.push({ label: "Age", earned: 10, max: 10 }); }
    else { score += 8; breakdown.push({ label: "Age", earned: 8, max: 10 }); }
  } else { score += 10; breakdown.push({ label: "Age", earned: 10, max: 10 }); }

  // Gender (10)
  if (elig.gender && elig.gender !== "any") { score += 10; breakdown.push({ label: "Gender", earned: 10, max: 10 }); }
  else { score += 9; breakdown.push({ label: "Gender", earned: 9, max: 10 }); }

  // BPL/Rural (10)
  if (elig.isBPL && elig.isRural) { score += 10; breakdown.push({ label: "BPL/Rural", earned: 10, max: 10 }); }
  else if (elig.isBPL) { score += 10; breakdown.push({ label: "BPL/Rural", earned: 10, max: 10 }); }
  else if (elig.isRural) { score += 10; breakdown.push({ label: "BPL/Rural", earned: 10, max: 10 }); }
  else { score += 9; breakdown.push({ label: "BPL/Rural", earned: 9, max: 10 }); }

  // State (5)
  if (elig.states?.length > 0) { score += 5; breakdown.push({ label: "State", earned: 5, max: 5 }); }
  else { score += 5; breakdown.push({ label: "State", earned: 5, max: 5 }); }

  // Goals (15)
  const userGoalCats = profile.goals.flatMap(g => goalToCategoryMap[g] || []);
  const goalMatch = [scheme.category].some(c => userGoalCats.includes(c));
  if (goalMatch) { score += 15; breakdown.push({ label: "Goals", earned: 15, max: 15 }); }
  else if (profile.goals.length === 0) { score += 10; breakdown.push({ label: "Goals", earned: 10, max: 15 }); }
  else { score += 3; breakdown.push({ label: "Goals", earned: 3, max: 15 }); }

  // Bonus (5)
  let bonusEarned = 0;
  if (standUpIndiaBonus) bonusEarned = 5;
  else if (elig.isBPL && profile.isBPL && elig.isRural && profile.isRural) bonusEarned = 5;
  else if (elig.occupations?.includes(profile.occupation) && elig.categories?.includes(profile.category.toLowerCase())) bonusEarned = 5;
  else if (elig.gender && elig.gender !== "any" && profile.gender === elig.gender && elig.isBPL && profile.isBPL) bonusEarned = 4;
  else if (elig.occupations?.includes(profile.occupation)) bonusEarned = 2;
  score += bonusEarned;
  breakdown.push({ label: "Bonus", earned: bonusEarned, max: 5 });

  return { scheme, score: Math.min(score, 100), matchReasons, missedReasons, breakdown };
}

// ---- SCENARIOS ----
const scenarios = [
  {
    label: "S1: Rural BPL Farmer Woman, SC, Karnataka, 80K, goals: financial + agriculture",
    profile: { name: "Lakshmi", age: 35, gender: "female", state: "Karnataka", district: "Raichur", occupation: "farmer", annualIncome: 80000, category: "sc", isRural: true, isBPL: true, goals: ["Get financial assistance", "Agricultural support"] },
    expect: "Should see PM Kisan, MGNREGA, Ayushman, PM Awas, Gruha Lakshmi, Anna Bhagya, Ujjwala, Free Ration at HIGH scores. Should NOT see Stand Up India (no business intent), NPS, PM Mudra, Sukanya, PM Kaushal Vikas."
  },
  {
    label: "S2: Urban Salaried Male, General, Maharashtra, 8L, goals: pension + health",
    profile: { name: "Rahul", age: 32, gender: "male", state: "Maharashtra", district: "Pune", occupation: "salaried", annualIncome: 800000, category: "general", isRural: false, isBPL: false, goals: ["Pension & retirement", "Health insurance"] },
    expect: "Should see NPS, PMJJBY, PMSBY at good scores. Should NOT see PM Kisan, MGNREGA, Ayushman, farmer schemes, women schemes, BPL schemes, Karnataka schemes."
  },
  {
    label: "S3: Young SC Student Female, Karnataka, 0 income, goals: education + skill dev",
    profile: { name: "Priya", age: 20, gender: "female", state: "Karnataka", district: "Bangalore", occupation: "student", annualIncome: 0, category: "sc", isRural: false, isBPL: false, goals: ["Education support", "Skill development"] },
    expect: "Should see Vidyasiri, Post Matric Scholarship, PM Kaushal Vikas at HIGH. PM Matru Vandana should NOT be eligible unless pregnant. Should NOT see PM Kisan, MGNREGA, Mudra, farmer/business schemes."
  },
  {
    label: "S4: Rural BPL Daily Wage Male, OBC, UP, 60K, goals: financial + housing + employment",
    profile: { name: "Ramesh", age: 40, gender: "male", state: "Uttar Pradesh", district: "Lucknow", occupation: "daily-wage", isStreetVendor: true, annualIncome: 60000, category: "obc", isRural: true, isBPL: true, goals: ["Get financial assistance", "Housing assistance", "Skill development"] },
    expect: "Should see MGNREGA, PM Awas, Ayushman, Free Ration, PMJJBY, PM Kaushal Vikas, PM SVANidhi at high scores. Should NOT see Karnataka schemes, women schemes, student schemes."
  },
  {
    label: "S5: Self-Employed Woman, General, Gujarat, 3L, goals: business + financial",
    profile: { name: "Meena", age: 28, gender: "female", state: "Gujarat", district: "Ahmedabad", occupation: "self-employed", annualIncome: 300000, category: "general", isRural: false, isBPL: false, goals: ["Start or grow a business", "Get financial assistance"] },
    expect: "Should see PM Mudra, Stand Up India (as woman), PM Vishwakarma, NPS, PMJJBY at good scores. Should NOT see BPL schemes, Karnataka schemes, farmer schemes."
  },
  {
    label: "S6: Elderly Rural Homemaker Female, ST, Rajasthan, 50K, BPL, goals: financial + health",
    profile: { name: "Kamla", age: 62, gender: "female", state: "Rajasthan", district: "Jaipur", occupation: "homemaker", annualIncome: 50000, category: "st", isRural: true, isBPL: true, goals: ["Get financial assistance", "Health insurance"] },
    expect: "Should see Ayushman, PM Awas, Free Ration, Ujjwala, PMSBY, MGNREGA. Should NOT see Atal Pension (age>40), PM Kaushal Vikas, student schemes, Sukanya, NPS (occupation)."
  },
  {
    label: "S7: Young Unemployed Male, General, Tamil Nadu, 0 income, goals: skill dev + business",
    profile: { name: "Arun", age: 22, gender: "male", state: "Tamil Nadu", district: "Chennai", occupation: "unemployed", annualIncome: 0, category: "general", isRural: false, isBPL: false, goals: ["Skill development", "Start or grow a business"] },
    expect: "Should see PM Kaushal Vikas at HIGH. PMJJBY, PMSBY eligible. Should NOT see PM Kisan, MGNREGA, women schemes, BPL schemes, NPS."
  },
  {
    label: "S8: Girl child (age 5), Female, Karnataka, 1.5L family income, SC, goals: education",
    profile: { name: "Asha", age: 5, gender: "female", state: "Karnataka", district: "Mysore", occupation: "student", annualIncome: 150000, category: "sc", isRural: false, isBPL: false, goals: ["Education support"] },
    expect: "Should see Sukanya Samriddhi at VERY HIGH. Should NOT see almost anything else (age blocks most schemes)."
  },
  {
    label: "S9: Small Business Owner Male, OBC, Bihar, 1.8L, Rural, BPL, goals: business + financial",
    profile: { name: "Sunil", age: 35, gender: "male", state: "Bihar", district: "Patna", occupation: "small-business", isStreetVendor: true, annualIncome: 180000, category: "obc", isRural: true, isBPL: true, goals: ["Start or grow a business", "Get financial assistance"] },
    expect: "Should see PM Mudra, Atal Pension, PM SVANidhi, Ayushman, PM Awas, Free Ration, PMJJBY at HIGH. Should NOT see women, Karnataka, student schemes."
  },
  {
    label: "S10: Artisan Male, SC, Madhya Pradesh, 1.2L, Rural, goals: employment + financial",
    profile: { name: "Mohan", age: 30, gender: "male", state: "Madhya Pradesh", district: "Bhopal", occupation: "artisan", annualIncome: 120000, category: "sc", isRural: true, isBPL: false, goals: ["Skill development", "Get financial assistance"] },
    expect: "Should see PM Vishwakarma at VERY HIGH. PM Mudra, Atal Pension related. MGNREGA (rural). PMJJBY, PMSBY. Should NOT see women, Karnataka, student, BPL-only schemes."
  },
  {
    label: "S11: Pregnant Rural BPL Woman, SC, Odisha, daily-wage, 70K, goals: health + financial",
    profile: { name: "Anita", age: 24, gender: "female", isPregnant: true, state: "Odisha", district: "Puri", occupation: "daily-wage", annualIncome: 70000, category: "sc", isRural: true, isBPL: true, goals: ["Health insurance", "Get financial assistance"] },
    expect: "Should strongly match PM Matru Vandana + Janani Suraksha + Ayushman + Ujjwala + Free Ration + PM Awas. Should NOT show Karnataka-only schemes."
  },
  {
    label: "S12: Urban Minor Male Student, General, Delhi, 0 income, goals: education + skill",
    profile: { name: "Rohit", age: 16, gender: "male", state: "Delhi", district: "New Delhi", occupation: "student", annualIncome: 0, category: "general", isRural: false, isBPL: false, goals: ["Education support", "Skill development"] },
    expect: "Should show PM Kaushal Vikas. Should NOT show adult insurance/pension/business/maternity schemes."
  },
  {
    label: "S13: Urban High-Income Woman Entrepreneur, Karnataka, 15L, goals: business",
    profile: { name: "Nisha", age: 34, gender: "female", state: "Karnataka", district: "Bangalore Urban", occupation: "self-employed", annualIncome: 1500000, category: "general", isRural: false, isBPL: false, goals: ["Start or grow a business"] },
    expect: "Should match Mudra, Stand Up India, Vishwakarma, NPS/insurance. Should NOT match Gruha Lakshmi (income cap) or BPL-only schemes."
  },
  {
    label: "S14: Rural Non-BPL Farmer Male, OBC, Punjab, 3L, goals: agriculture",
    profile: { name: "Gurpreet", age: 44, gender: "male", state: "Punjab", district: "Ludhiana", occupation: "farmer", annualIncome: 300000, category: "obc", isRural: true, isBPL: false, goals: ["Agricultural support"] },
    expect: "Should match PM Kisan + MGNREGA + insurance. Should NOT match BPL-only schemes (Ayushman/Free Ration/Ujjwala/PM Awas)."
  },
  {
    label: "S15: Elderly ST Homemaker Woman, Rural Karnataka, BPL, 55yrs, no business intent",
    profile: { name: "Savitri", age: 55, gender: "female", state: "Karnataka", district: "Kalaburagi", occupation: "homemaker", annualIncome: 60000, category: "st", isRural: true, isBPL: true, goals: ["Get financial assistance", "Health insurance"] },
    expect: "Should match Ayushman, Ujjwala, Free Ration, PM Awas, MGNREGA. Should NOT match Stand Up India without business occupation/intent."
  },
  {
    label: "S16: Pregnant Urban Woman, OBC, Telangana, non-BPL, 1.8L, goals: health + women support",
    profile: { name: "Farah", age: 27, gender: "female", isPregnant: true, state: "Telangana", district: "Hyderabad", occupation: "homemaker", annualIncome: 180000, category: "obc", isRural: false, isBPL: false, goals: ["Health insurance", "Get financial assistance"] },
    expect: "Should include PM Matru Vandana. Should NOT include Janani Suraksha or Ayushman (BPL-only), and not include PM Awas (rural+BPL)."
  },
  {
    label: "S17: Urban Street Vendor Male, OBC, Maharashtra, BPL, 1.4L, goals: business + financial",
    profile: { name: "Imran", age: 33, gender: "male", state: "Maharashtra", district: "Mumbai", occupation: "daily-wage", isStreetVendor: true, annualIncome: 140000, category: "obc", isRural: false, isBPL: true, goals: ["Start or grow a business", "Get financial assistance"] },
    expect: "Should include PM SVANidhi and PM Kaushal. Should NOT include PM Awas or MGNREGA due to urban profile."
  },
  {
    label: "S18: SC Male Small-Business, Kerala, non-BPL, 4L, goals: business + retirement",
    profile: { name: "Dinesh", age: 38, gender: "male", state: "Kerala", district: "Kochi", occupation: "small-business", isStreetVendor: false, annualIncome: 400000, category: "sc", isRural: false, isBPL: false, goals: ["Start or grow a business", "Pension & retirement"] },
    expect: "Should include Stand Up India, PM Mudra, NPS/Atal. Should NOT include BPL-only and Karnataka-only schemes."
  },
  {
    label: "S19: Minor Female Student, ST, Karnataka, age 9, goals: education",
    profile: { name: "Nandini", age: 9, gender: "female", state: "Karnataka", district: "Shivamogga", occupation: "student", annualIncome: 120000, category: "st", isRural: false, isBPL: false, goals: ["Education support"] },
    expect: "Should include Sukanya only. Should NOT include Gruha Lakshmi, PM Kaushal, insurance, pension, or business schemes."
  },
  {
    label: "S20: Senior Male Salaried, General, Karnataka, age 68, non-BPL, goals: pension + social-security",
    profile: { name: "Venkatesh", age: 68, gender: "male", state: "Karnataka", district: "Mangalore", occupation: "salaried", annualIncome: 500000, category: "general", isRural: false, isBPL: false, goals: ["Pension & retirement", "Get financial assistance"] },
    expect: "Should include PMSBY if age eligible; should NOT include NPS, Atal Pension, PMJJBY due to age limits; should not include women/BPL/rural-only schemes."
  },
  {
    label: "S21: Urban Salaried Woman, General, Tamil Nadu, 6L, goals: pension only",
    profile: { name: "Deepa", age: 41, gender: "female", state: "Tamil Nadu", district: "Chennai", occupation: "salaried", annualIncome: 600000, category: "general", isRural: false, isBPL: false, goals: ["Pension & retirement"] },
    expect: "NPS should rank strongly for pension goal. No BPL/rural/women-pregnancy specific schemes should appear."
  },
  {
    label: "S22: Rural BPL Daily-Wage Male, Jharkhand, 90K, goals: housing only",
    profile: { name: "Birsa", age: 36, gender: "male", state: "Jharkhand", district: "Ranchi", occupation: "daily-wage", annualIncome: 90000, category: "st", isRural: true, isBPL: true, goals: ["Housing assistance"] },
    expect: "PM Awas should be present and rank high for housing goal. Karnataka-only and women-only schemes must be absent."
  },
  {
    label: "S23: Urban Street Vendor Woman, OBC, Delhi, non-BPL, 1.6L, goals: business",
    profile: { name: "Razia", age: 31, gender: "female", state: "Delhi", district: "Delhi", occupation: "daily-wage", isStreetVendor: true, annualIncome: 160000, category: "obc", isRural: false, isBPL: false, goals: ["Start or grow a business"] },
    expect: "PM SVANidhi and business schemes should appear. BPL-only and rural-only schemes should not."
  },
  {
    label: "S24: Pregnant Teen Woman, SC, Bihar, BPL, age 18, goals: health + women support",
    profile: { name: "Pooja", age: 18, gender: "female", isPregnant: true, state: "Bihar", district: "Gaya", occupation: "homemaker", annualIncome: 60000, category: "sc", isRural: true, isBPL: true, goals: ["Health insurance", "Get financial assistance"] },
    expect: "Pregnancy schemes with minAge 19 should be blocked. Ayushman/Free Ration/Ujjwala should still appear due to BPL."
  },
  {
    label: "S25: Rural ST Artisan Male, Chhattisgarh, non-BPL, 2.2L, goals: business + skill",
    profile: { name: "Raghu", age: 29, gender: "male", state: "Chhattisgarh", district: "Raipur", occupation: "artisan", annualIncome: 220000, category: "st", isRural: true, isBPL: false, goals: ["Start or grow a business", "Skill development"] },
    expect: "Vishwakarma, Stand Up India, Mudra and Kaushal should be favorable. Women/BPL-only schemes should be absent."
  },
  {
    label: "S26: No-goal profile, urban male self-employed, Karnataka, non-BPL, 2.5L",
    profile: { name: "Kiran", age: 34, gender: "male", state: "Karnataka", district: "Udupi", occupation: "self-employed", annualIncome: 250000, category: "general", isRural: false, isBPL: false, goals: [] },
    expect: "Business/pension schemes should still show by profile; no hard goal-mismatch checks because goals are empty."
  },
  {
    label: "S27: Atal Pension boundary age 40, rural daily-wage male, Odisha, non-BPL",
    profile: { name: "Bijay", age: 40, gender: "male", state: "Odisha", district: "Cuttack", occupation: "daily-wage", annualIncome: 120000, category: "obc", isRural: true, isBPL: false, goals: ["Pension & retirement"] },
    expect: "Atal Pension should still be eligible at exactly age 40."
  },
  {
    label: "S28: Atal Pension overflow age 41, rural daily-wage male, Odisha, non-BPL",
    profile: { name: "Jiten", age: 41, gender: "male", state: "Odisha", district: "Cuttack", occupation: "daily-wage", annualIncome: 120000, category: "obc", isRural: true, isBPL: false, goals: ["Pension & retirement"] },
    expect: "Atal Pension should be blocked above age 40."
  },
  {
    label: "S29: NPS boundary age 65, urban salaried male, Kerala",
    profile: { name: "Hari", age: 65, gender: "male", state: "Kerala", district: "Kozhikode", occupation: "salaried", annualIncome: 550000, category: "general", isRural: false, isBPL: false, goals: ["Pension & retirement"] },
    expect: "NPS should still be eligible at exactly age 65."
  },
  {
    label: "S30: NPS overflow age 66, urban salaried male, Kerala",
    profile: { name: "Rajan", age: 66, gender: "male", state: "Kerala", district: "Kozhikode", occupation: "salaried", annualIncome: 550000, category: "general", isRural: false, isBPL: false, goals: ["Pension & retirement"] },
    expect: "NPS should be blocked above age 65."
  },
  {
    label: "S31: Gruha Lakshmi income boundary at 2L, Karnataka woman",
    profile: { name: "Shobha", age: 36, gender: "female", state: "Karnataka", district: "Belagavi", occupation: "homemaker", annualIncome: 200000, category: "general", isRural: false, isBPL: false, goals: ["Get financial assistance"] },
    expect: "Gruha Lakshmi should be eligible at exactly Rs.2,00,000 annual income."
  },
  {
    label: "S32: Gruha Lakshmi income overflow above 2L, Karnataka woman",
    profile: { name: "Shanti", age: 36, gender: "female", state: "Karnataka", district: "Belagavi", occupation: "homemaker", annualIncome: 200001, category: "general", isRural: false, isBPL: false, goals: ["Get financial assistance"] },
    expect: "Gruha Lakshmi should be disqualified above Rs.2,00,000 annual income."
  },
  {
    label: "S33: Stand Up India with uppercase SC category should still match",
    profile: { name: "Aman", age: 33, gender: "male", state: "Madhya Pradesh", district: "Indore", occupation: "small-business", annualIncome: 260000, category: "SC", isRural: false, isBPL: false, goals: ["Start or grow a business"] },
    expect: "Stand Up India should match SC profile regardless of category casing."
  },
  {
    label: "S34: Non-street-vendor urban daily-wage, business goal",
    profile: { name: "Kaleem", age: 30, gender: "male", state: "Delhi", district: "Delhi", occupation: "daily-wage", isStreetVendor: false, annualIncome: 150000, category: "obc", isRural: false, isBPL: false, goals: ["Start or grow a business"] },
    expect: "PM SVANidhi should be disqualified without street-vendor flag."
  },
  {
    label: "S35: Pregnant eligible age woman should get maternity schemes",
    profile: { name: "Neha", age: 26, gender: "female", isPregnant: true, state: "Maharashtra", district: "Nashik", occupation: "homemaker", annualIncome: 90000, category: "obc", isRural: true, isBPL: true, goals: ["Health insurance", "Get financial assistance"] },
    expect: "PM Matru Vandana and Janani Suraksha should both be eligible."
  },
  {
    label: "S36: Female non-pregnant should not get maternity schemes",
    profile: { name: "Ritu", age: 27, gender: "female", isPregnant: false, state: "Maharashtra", district: "Nashik", occupation: "homemaker", annualIncome: 90000, category: "obc", isRural: true, isBPL: true, goals: ["Health insurance", "Get financial assistance"] },
    expect: "PM Matru Vandana and Janani Suraksha should both be blocked when not pregnant."
  },
  {
    label: "S37: PM SVANidhi boundary income 2L with street vendor",
    profile: { name: "Rafiq", age: 38, gender: "male", state: "Karnataka", district: "Bengaluru", occupation: "daily-wage", isStreetVendor: true, annualIncome: 200000, category: "obc", isRural: false, isBPL: false, goals: ["Start or grow a business"] },
    expect: "PM SVANidhi should be eligible at exactly Rs.2,00,000."
  },
  {
    label: "S38: PM SVANidhi overflow income above 2L with street vendor",
    profile: { name: "Salim", age: 38, gender: "male", state: "Karnataka", district: "Bengaluru", occupation: "daily-wage", isStreetVendor: true, annualIncome: 200001, category: "obc", isRural: false, isBPL: false, goals: ["Start or grow a business"] },
    expect: "PM SVANidhi should be blocked above Rs.2,00,000."
  },
  {
    label: "S39: Stand Up India should be blocked for SC without business intent",
    profile: { name: "Mahesh", age: 30, gender: "male", state: "Odisha", district: "Cuttack", occupation: "daily-wage", annualIncome: 110000, category: "sc", isRural: true, isBPL: false, goals: ["Skill development"] },
    expect: "Stand Up India should be disqualified without business intent/profile."
  },
  {
    label: "S40: Stand Up India should allow SC with business goal even daily-wage",
    profile: { name: "Ajay", age: 30, gender: "male", state: "Odisha", district: "Cuttack", occupation: "daily-wage", annualIncome: 110000, category: "sc", isRural: true, isBPL: false, goals: ["Start or grow a business"] },
    expect: "Stand Up India should be eligible due to SC + business intent."
  },
  {
    label: "S41: Pregnant woman age 46 should fail maternity age cap",
    profile: { name: "Maya", age: 46, gender: "female", isPregnant: true, state: "Bihar", district: "Nalanda", occupation: "homemaker", annualIncome: 70000, category: "obc", isRural: true, isBPL: true, goals: ["Health insurance", "Get financial assistance"] },
    expect: "PM Matru Vandana and Janani Suraksha should be blocked above age 45, while BPL schemes may still appear."
  },
  {
    label: "S42: Business profile without street-vendor flag should not get PM SVANidhi",
    profile: { name: "Parvez", age: 29, gender: "male", state: "Delhi", district: "Delhi", occupation: "self-employed", isStreetVendor: false, annualIncome: 180000, category: "obc", isRural: false, isBPL: false, goals: ["Start or grow a business"] },
    expect: "PM SVANidhi should be blocked without street-vendor status; PM Mudra should still match."
  },
  {
    label: "S43: SC unemployed youth with business intent should qualify Stand Up India",
    profile: { name: "Rakesh", age: 24, gender: "male", state: "Uttar Pradesh", district: "Varanasi", occupation: "unemployed", annualIncome: 40000, category: "sc", isRural: false, isBPL: false, goals: ["Start or grow a business", "Skill development"] },
    expect: "Stand Up India should be allowed for SC profile with explicit business intent."
  },
  {
    label: "S44: BPL Karnataka male should get state BPL schemes but never women-only schemes",
    profile: { name: "Shankar", age: 39, gender: "male", state: "Karnataka", district: "Koppal", occupation: "daily-wage", annualIncome: 95000, category: "obc", isRural: true, isBPL: true, goals: ["Get financial assistance"] },
    expect: "Anna Bhagya and Bhagya Jyothi should appear; Gruha Lakshmi, Ujjwala, and maternity schemes must be absent for male profile."
  },
  {
    label: "S45: PMJJBY boundary age 50 should be eligible",
    profile: { name: "Suresh", age: 50, gender: "male", state: "Haryana", district: "Gurgaon", occupation: "salaried", annualIncome: 450000, category: "general", isRural: false, isBPL: false, goals: ["Pension & retirement"] },
    expect: "PM Jeevan Jyoti should still be eligible at exactly age 50."
  },
  {
    label: "S46: PMJJBY overflow age 51 should be blocked",
    profile: { name: "Mahendra", age: 51, gender: "male", state: "Haryana", district: "Gurgaon", occupation: "salaried", annualIncome: 450000, category: "general", isRural: false, isBPL: false, goals: ["Pension & retirement"] },
    expect: "PM Jeevan Jyoti should be blocked above age 50."
  },
  {
    label: "S47: PMSBY boundary age 70 should be eligible",
    profile: { name: "Bhola", age: 70, gender: "male", state: "Madhya Pradesh", district: "Jabalpur", occupation: "salaried", annualIncome: 300000, category: "general", isRural: false, isBPL: false, goals: ["Pension & retirement"] },
    expect: "PM Suraksha Bima should still be eligible at exactly age 70."
  },
  {
    label: "S48: PMSBY overflow age 71 should be blocked",
    profile: { name: "Nandlal", age: 71, gender: "male", state: "Madhya Pradesh", district: "Jabalpur", occupation: "salaried", annualIncome: 300000, category: "general", isRural: false, isBPL: false, goals: ["Pension & retirement"] },
    expect: "PM Suraksha Bima should be blocked above age 70."
  },
  {
    label: "S49: Rural BPL agricultural laborer woman from Karnataka should get welfare and state support",
    profile: { name: "Savitri", age: 33, gender: "female", state: "Karnataka", district: "Kalaburagi", occupation: "agricultural-laborer", annualIncome: 90000, category: "st", isRural: true, isBPL: true, goals: ["Get financial assistance", "Health insurance"] },
    expect: "Should match Ayushman, PM Awas, Free Ration, Ujjwala, Anna Bhagya, Bhagya Jyothi, and MGNREGA. Should not match PM Mudra or PM Kisan."
  },
  {
    label: "S50: Urban OBC woman street vendor in Delhi with business goal should get business schemes but not rural/BPL welfare",
    profile: { name: "Pooja", age: 29, gender: "female", state: "Delhi", district: "New Delhi", occupation: "self-employed", isStreetVendor: true, annualIncome: 180000, category: "obc", isRural: false, isBPL: false, goals: ["Start or grow a business", "Get financial assistance"] },
    expect: "Should match PM SVANidhi, PM Mudra, Stand Up India, and PM Vishwakarma. Should not match Ayushman, PM Awas, Free Ration, or MGNREGA."
  },
];

// ---- RUN ----
console.log("=" .repeat(100));
console.log(`SCHEME MATCHING ACCURACY TEST - ${scenarios.length} SCENARIOS`);
console.log("=".repeat(100));

const allErrors = [];

for (const { label, profile, expect: expectation } of scenarios) {
  console.log("\n" + "─".repeat(100));
  console.log(`\n${label}`);
  console.log(`Profile: ${profile.gender}, ${profile.age}yrs, ${profile.occupation}, ${profile.category.toUpperCase()}, Rs.${profile.annualIncome}, ${profile.state}, Rural:${profile.isRural}, BPL:${profile.isBPL}`);
  console.log(`Goals: ${profile.goals.join(", ")}`);
  console.log(`EXPECTED: ${expectation}`);
  console.log();

  const results = schemes
    .map(s => calculateEligibility(profile, s))
    .filter(m => m.score > 0)
    .sort((a, b) => b.score - a.score);

  const disqualified = schemes.length - results.length;

  console.log(`  MATCHED: ${results.length} schemes | DISQUALIFIED: ${disqualified}`);
  console.log();

  for (const r of results) {
    const bd = r.breakdown.map(b => `${b.label}:${b.earned}/${b.max}`).join(" | ");
    console.log(`  [${r.score}%] ${r.scheme.name}`);
    console.log(`         ${bd}`);
  }

  // Check for specific problems
  const matched = results.map(r => r.scheme.id);
  const errors = [];
  const scenarioId = label.split(":")[0].trim();

  // Scenario-specific validations
  if (scenarioId === "S1") {
    if (!matched.includes("pm-kisan")) errors.push("ERROR: PM Kisan missing for farmer");
    if (!matched.includes("nrega")) errors.push("ERROR: MGNREGA missing for rural farmer");
    if (!matched.includes("ayushman-bharat")) errors.push("ERROR: Ayushman missing for BPL");
    if (!matched.includes("pm-awas-gramin")) errors.push("ERROR: PM Awas missing for rural BPL");
    if (!matched.includes("gruha-lakshmi")) errors.push("ERROR: Gruha Lakshmi missing for Karnataka woman");
    if (!matched.includes("ujjwala")) errors.push("ERROR: Ujjwala missing for BPL woman");
    if (matched.includes("stand-up-india")) errors.push("ERROR: Stand Up India showing without business intent");
    if (matched.includes("national-pension")) errors.push("ERROR: NPS showing for farmer (should be disqualified)");
    if (matched.includes("sukanya-samriddhi")) errors.push("ERROR: Sukanya showing for 35yr old");
    if (matched.includes("pm-kaushal-vikas")) errors.push("ERROR: PM Kaushal showing for farmer (not in occupation list)");
  }

  if (scenarioId === "S2") {
    if (!matched.includes("national-pension")) errors.push("ERROR: NPS missing for salaried");
    if (!matched.includes("pm-jeevan-jyoti")) errors.push("ERROR: PMJJBY missing for 32yr old");
    if (!matched.includes("pm-suraksha-bima")) errors.push("ERROR: PMSBY missing");
    if (matched.includes("pm-kisan")) errors.push("ERROR: PM Kisan showing for salaried");
    if (matched.includes("nrega")) errors.push("ERROR: MGNREGA showing for urban salaried");
    if (matched.includes("ayushman-bharat")) errors.push("ERROR: Ayushman showing for non-BPL");
    if (matched.includes("gruha-lakshmi")) errors.push("ERROR: Gruha Lakshmi showing for male in Maharashtra");
    if (matched.includes("pm-awas-gramin")) errors.push("ERROR: PM Awas showing for urban non-BPL");
    if (matched.includes("pm-mudra")) errors.push("ERROR: PM Mudra showing for salaried");
    // NPS score should be HIGH
    const nps = results.find(r => r.scheme.id === "national-pension");
    if (nps && nps.score < 75) errors.push(`WARN: NPS score too low for salaried (${nps.score}). Should be 80+`);
  }

  if (scenarioId === "S3") {
    if (!matched.includes("vidyasiri")) errors.push("ERROR: Vidyasiri missing for SC student in Karnataka");
    if (!matched.includes("post-matric-scholarship")) errors.push("ERROR: Post Matric Scholarship missing for SC student");
    if (!matched.includes("pm-kaushal-vikas")) errors.push("ERROR: PM Kaushal Vikas missing for student");
    if (matched.includes("pm-kisan")) errors.push("ERROR: PM Kisan showing for student");
    if (matched.includes("nrega")) errors.push("ERROR: MGNREGA showing for urban student");
    if (matched.includes("pm-mudra")) errors.push("ERROR: PM Mudra showing for student");
    // Vidyasiri should be top
    const vid = results.find(r => r.scheme.id === "vidyasiri");
    if (vid && vid.score < 85) errors.push(`WARN: Vidyasiri score low for SC student Karnataka (${vid.score}). Should be 90+`);
  }

  if (scenarioId === "S4") {
    if (!matched.includes("nrega")) errors.push("ERROR: MGNREGA missing for rural daily wage");
    if (!matched.includes("pm-awas-gramin")) errors.push("ERROR: PM Awas missing for rural BPL");
    if (!matched.includes("ayushman-bharat")) errors.push("ERROR: Ayushman missing for BPL");
    if (!matched.includes("free-ration")) errors.push("ERROR: Free Ration missing for BPL");
    if (matched.includes("gruha-lakshmi")) errors.push("ERROR: Gruha Lakshmi showing in UP");
    if (matched.includes("sukanya-samriddhi")) errors.push("ERROR: Sukanya showing for 40yr male");
    if (matched.includes("pm-matru-vandana")) errors.push("ERROR: PM Matru Vandana showing for male");
    if (matched.includes("national-pension")) errors.push("ERROR: NPS showing for daily-wage (not in list)");
  }

  if (scenarioId === "S5") {
    if (!matched.includes("pm-mudra")) errors.push("ERROR: PM Mudra missing for self-employed");
    if (!matched.includes("stand-up-india")) errors.push("ERROR: Stand Up India missing for woman entrepreneur");
    if (!matched.includes("pm-vishwakarma")) errors.push("ERROR: PM Vishwakarma missing for self-employed");
    if (!matched.includes("national-pension")) errors.push("ERROR: NPS missing for self-employed");
    if (matched.includes("ayushman-bharat")) errors.push("ERROR: Ayushman showing for non-BPL");
    if (matched.includes("pm-awas-gramin")) errors.push("ERROR: PM Awas showing for urban non-BPL");
    if (matched.includes("pm-kisan")) errors.push("ERROR: PM Kisan showing for self-employed");
    if (matched.includes("nrega")) errors.push("ERROR: MGNREGA showing for urban self-employed");
  }

  if (scenarioId === "S6") {
    if (!matched.includes("ayushman-bharat")) errors.push("ERROR: Ayushman missing for BPL elderly");
    if (!matched.includes("free-ration")) errors.push("ERROR: Free Ration missing for BPL");
    if (!matched.includes("ujjwala")) errors.push("ERROR: Ujjwala missing for BPL woman");
    if (!matched.includes("pm-awas-gramin")) errors.push("ERROR: PM Awas missing for rural BPL");
    if (matched.includes("atal-pension")) errors.push("ERROR: Atal Pension showing for 62yr old (max 40)");
    if (matched.includes("sukanya-samriddhi")) errors.push("ERROR: Sukanya showing for 62yr old");
    if (matched.includes("national-pension")) errors.push("ERROR: NPS showing for homemaker");
    if (matched.includes("pm-kaushal-vikas")) errors.push("ERROR: PM Kaushal showing for 62yr old (max 45)");
  }

  if (scenarioId === "S7") {
    if (!matched.includes("pm-kaushal-vikas")) errors.push("ERROR: PM Kaushal missing for unemployed youth");
    if (!matched.includes("pm-jeevan-jyoti")) errors.push("ERROR: PMJJBY missing");
    if (!matched.includes("pm-suraksha-bima")) errors.push("ERROR: PMSBY missing");
    if (matched.includes("pm-kisan")) errors.push("ERROR: PM Kisan showing for unemployed");
    if (matched.includes("nrega")) errors.push("ERROR: MGNREGA showing for urban unemployed");
    if (matched.includes("pm-mudra")) errors.push("ERROR: PM Mudra showing for unemployed");
    if (matched.includes("pm-matru-vandana")) errors.push("ERROR: PM Matru Vandana showing for male");
    if (matched.includes("national-pension")) errors.push("ERROR: NPS showing for unemployed");
    // PM Kaushal should be high
    const kv = results.find(r => r.scheme.id === "pm-kaushal-vikas");
    if (kv && kv.score < 80) errors.push(`WARN: PM Kaushal Vikas score low for unemployed youth (${kv.score}). Should be 85+`);
  }

  if (scenarioId === "S8") {
    if (!matched.includes("sukanya-samriddhi")) errors.push("ERROR: Sukanya missing for 5yr girl");
    // Almost everything else should be blocked by age
    // Some no-age-limit schemes may show. Check specific ones that SHOULD be blocked.
    if (matched.includes("atal-pension")) errors.push("ERROR: Atal Pension showing for 5yr old");
    if (matched.includes("pm-mudra")) errors.push("ERROR: PM Mudra showing for 5yr old");
    if (matched.includes("nrega")) errors.push("ERROR: MGNREGA showing for 5yr old");
    if (matched.includes("pm-jeevan-jyoti")) errors.push("ERROR: PMJJBY showing for 5yr old");
    if (matched.includes("pm-matru-vandana")) errors.push("ERROR: PM Matru Vandana showing for 5yr old");
    // Sukanya should be very high
    const suk = results.find(r => r.scheme.id === "sukanya-samriddhi");
    if (suk && suk.score < 90) errors.push(`WARN: Sukanya score low for 5yr girl SC Karnataka (${suk.score}). Should be 92+`);
  }

  if (scenarioId === "S9") {
    if (!matched.includes("pm-mudra")) errors.push("ERROR: PM Mudra missing for small business");
    if (!matched.includes("atal-pension")) errors.push("ERROR: Atal Pension missing for small business");
    if (!matched.includes("pm-svanidhi")) errors.push("ERROR: PM SVANidhi missing for small business");
    if (!matched.includes("ayushman-bharat")) errors.push("ERROR: Ayushman missing for BPL");
    if (!matched.includes("pm-awas-gramin")) errors.push("ERROR: PM Awas missing for rural BPL");
    if (!matched.includes("free-ration")) errors.push("ERROR: Free Ration missing for BPL");
    if (matched.includes("gruha-lakshmi")) errors.push("ERROR: Gruha Lakshmi showing for male in Bihar");
    if (matched.includes("pm-matru-vandana")) errors.push("ERROR: PM Matru Vandana showing for male");
    if (matched.includes("ujjwala")) errors.push("ERROR: Ujjwala showing for male");
    // Mudra should be top
    const mudra = results.find(r => r.scheme.id === "pm-mudra");
    if (mudra && mudra.score < 85) errors.push(`WARN: PM Mudra score low for BPL small business (${mudra.score}). Should be 88+`);
  }

  if (scenarioId === "S10") {
    if (!matched.includes("pm-vishwakarma")) errors.push("ERROR: PM Vishwakarma missing for artisan");
    if (matched.includes("pm-matru-vandana")) errors.push("ERROR: PM Matru Vandana showing for male");
    if (matched.includes("gruha-lakshmi")) errors.push("ERROR: Gruha Lakshmi showing for male");
    if (matched.includes("ayushman-bharat")) errors.push("ERROR: Ayushman showing for non-BPL");
    if (matched.includes("pm-awas-gramin")) errors.push("ERROR: PM Awas showing for non-BPL non-rural... wait this IS rural");
    // PM Vishwakarma should be very high
    const vish = results.find(r => r.scheme.id === "pm-vishwakarma");
    if (vish && vish.score < 85) errors.push(`WARN: PM Vishwakarma score low for artisan (${vish.score}). Should be 88+`);
  }

  if (scenarioId === "S11") {
    if (!matched.includes("pm-matru-vandana")) errors.push("ERROR: PM Matru Vandana missing for pregnant woman");
    if (!matched.includes("janani-suraksha")) errors.push("ERROR: Janani Suraksha missing for pregnant BPL woman");
    if (!matched.includes("ayushman-bharat")) errors.push("ERROR: Ayushman missing for BPL");
    if (!matched.includes("free-ration")) errors.push("ERROR: Free Ration missing for BPL");
    if (matched.includes("gruha-lakshmi")) errors.push("ERROR: Gruha Lakshmi showing outside Karnataka");
  }

  if (scenarioId === "S12") {
    if (!matched.includes("pm-kaushal-vikas")) errors.push("ERROR: PM Kaushal missing for 16yr student");
    if (matched.includes("pm-jeevan-jyoti")) errors.push("ERROR: PMJJBY showing for minor");
    if (matched.includes("pm-suraksha-bima")) errors.push("ERROR: PMSBY showing for minor");
    if (matched.includes("atal-pension")) errors.push("ERROR: Atal Pension showing for minor");
    if (matched.includes("pm-mudra")) errors.push("ERROR: PM Mudra showing for student minor");
    if (matched.includes("pm-matru-vandana")) errors.push("ERROR: PM Matru Vandana showing for male minor");
  }

  if (scenarioId === "S13") {
    if (!matched.includes("pm-mudra")) errors.push("ERROR: PM Mudra missing for entrepreneur");
    if (!matched.includes("stand-up-india")) errors.push("ERROR: Stand Up India missing for woman entrepreneur");
    if (!matched.includes("pm-vishwakarma")) errors.push("ERROR: PM Vishwakarma missing for self-employed");
    if (matched.includes("gruha-lakshmi")) errors.push("ERROR: Gruha Lakshmi showing despite income > 2L");
    if (matched.includes("ayushman-bharat")) errors.push("ERROR: Ayushman showing for non-BPL");
    if (matched.includes("free-ration")) errors.push("ERROR: Free Ration showing for non-BPL");
  }

  if (scenarioId === "S14") {
    if (!matched.includes("pm-kisan")) errors.push("ERROR: PM Kisan missing for farmer");
    if (!matched.includes("nrega")) errors.push("ERROR: MGNREGA missing for rural farmer");
    if (matched.includes("ayushman-bharat")) errors.push("ERROR: Ayushman showing for non-BPL");
    if (matched.includes("free-ration")) errors.push("ERROR: Free Ration showing for non-BPL");
    if (matched.includes("pm-awas-gramin")) errors.push("ERROR: PM Awas showing for non-BPL");
    if (matched.includes("ujjwala")) errors.push("ERROR: Ujjwala showing for male non-BPL");
  }

  if (scenarioId === "S15") {
    if (!matched.includes("ayushman-bharat")) errors.push("ERROR: Ayushman missing for BPL woman");
    if (!matched.includes("free-ration")) errors.push("ERROR: Free Ration missing for BPL");
    if (!matched.includes("pm-awas-gramin")) errors.push("ERROR: PM Awas missing for rural BPL");
    if (matched.includes("atal-pension")) errors.push("ERROR: Atal Pension showing for age 55");
    if (matched.includes("stand-up-india")) errors.push("ERROR: Stand Up India showing for homemaker with no business intent");
    if (matched.includes("pm-matru-vandana")) errors.push("ERROR: PM Matru Vandana showing for non-pregnant elderly woman");
    if (matched.includes("janani-suraksha")) errors.push("ERROR: Janani Suraksha showing for non-pregnant elderly woman");
  }

  if (scenarioId === "S16") {
    if (!matched.includes("pm-matru-vandana")) errors.push("ERROR: PM Matru Vandana missing for pregnant woman");
    if (matched.includes("janani-suraksha")) errors.push("ERROR: Janani Suraksha showing for non-BPL profile");
    if (matched.includes("ayushman-bharat")) errors.push("ERROR: Ayushman showing for non-BPL profile");
    if (matched.includes("pm-awas-gramin")) errors.push("ERROR: PM Awas showing for urban non-BPL profile");
  }

  if (scenarioId === "S17") {
    if (!matched.includes("pm-svanidhi")) errors.push("ERROR: PM SVANidhi missing for street vendor");
    if (!matched.includes("pm-kaushal-vikas")) errors.push("ERROR: PM Kaushal missing for daily-wage profile");
    if (matched.includes("nrega")) errors.push("ERROR: MGNREGA showing for urban profile");
    if (matched.includes("pm-awas-gramin")) errors.push("ERROR: PM Awas showing for urban profile");
  }

  if (scenarioId === "S18") {
    if (!matched.includes("stand-up-india")) errors.push("ERROR: Stand Up India missing for SC entrepreneur");
    if (!matched.includes("pm-mudra")) errors.push("ERROR: PM Mudra missing for small-business profile");
    if (!matched.includes("national-pension")) errors.push("ERROR: NPS missing for retirement goal profile");
    if (matched.includes("ayushman-bharat")) errors.push("ERROR: Ayushman showing for non-BPL profile");
    if (matched.includes("gruha-lakshmi")) errors.push("ERROR: Gruha Lakshmi showing for male outside Karnataka criteria");
  }

  if (scenarioId === "S19") {
    if (!matched.includes("sukanya-samriddhi")) errors.push("ERROR: Sukanya missing for female child age 9");
    if (matched.includes("gruha-lakshmi")) errors.push("ERROR: Gruha Lakshmi showing for minor girl");
    if (matched.includes("pm-kaushal-vikas")) errors.push("ERROR: PM Kaushal showing for age 9");
    if (matched.includes("pm-suraksha-bima")) errors.push("ERROR: PMSBY showing for minor");
    if (matched.includes("pm-jeevan-jyoti")) errors.push("ERROR: PMJJBY showing for minor");
  }

  if (scenarioId === "S20") {
    if (matched.includes("national-pension")) errors.push("ERROR: NPS showing for age 68 (max 65)");
    if (matched.includes("atal-pension")) errors.push("ERROR: Atal Pension showing for age 68 (max 40)");
    if (matched.includes("pm-jeevan-jyoti")) errors.push("ERROR: PMJJBY showing for age 68 (max 50)");
    if (!matched.includes("pm-suraksha-bima")) errors.push("ERROR: PMSBY missing for age 68 (eligible <=70)");
    if (matched.includes("gruha-lakshmi")) errors.push("ERROR: Gruha Lakshmi showing for male");
  }

  if (scenarioId === "S21") {
    if (!matched.includes("national-pension")) errors.push("ERROR: NPS missing for pension-only salaried profile");
    if (matched.includes("ayushman-bharat")) errors.push("ERROR: Ayushman showing for non-BPL");
    if (matched.includes("pm-awas-gramin")) errors.push("ERROR: PM Awas showing for urban non-BPL");
  }

  if (scenarioId === "S22") {
    if (!matched.includes("pm-awas-gramin")) errors.push("ERROR: PM Awas missing for housing-focused rural BPL profile");
    if (matched.includes("gruha-lakshmi")) errors.push("ERROR: Gruha Lakshmi showing outside Karnataka");
    if (matched.includes("pm-matru-vandana")) errors.push("ERROR: PM Matru Vandana showing for male");
  }

  if (scenarioId === "S23") {
    if (!matched.includes("pm-svanidhi")) errors.push("ERROR: PM SVANidhi missing for urban street vendor");
    if (!matched.includes("pm-mudra")) errors.push("ERROR: PM Mudra missing for business goal");
    if (matched.includes("ayushman-bharat")) errors.push("ERROR: Ayushman showing for non-BPL");
    if (matched.includes("nrega")) errors.push("ERROR: MGNREGA showing for urban profile");
  }

  if (scenarioId === "S24") {
    if (matched.includes("pm-matru-vandana")) errors.push("ERROR: PM Matru Vandana showing for age 18 (<19)");
    if (matched.includes("janani-suraksha")) errors.push("ERROR: Janani Suraksha showing for age 18 (<19)");
    if (!matched.includes("ayushman-bharat")) errors.push("ERROR: Ayushman missing for BPL");
    if (!matched.includes("free-ration")) errors.push("ERROR: Free Ration missing for BPL");
  }

  if (scenarioId === "S25") {
    if (!matched.includes("pm-vishwakarma")) errors.push("ERROR: PM Vishwakarma missing for artisan");
    if (!matched.includes("stand-up-india")) errors.push("ERROR: Stand Up India missing for ST business profile");
    if (!matched.includes("pm-mudra")) errors.push("ERROR: PM Mudra missing for business profile");
    if (matched.includes("ujjwala")) errors.push("ERROR: Ujjwala showing for male non-BPL");
  }

  if (scenarioId === "S26") {
    if (!matched.includes("pm-mudra")) errors.push("ERROR: PM Mudra missing for self-employed no-goal profile");
    if (matched.includes("ayushman-bharat")) errors.push("ERROR: Ayushman showing for non-BPL");
    if (matched.includes("pm-awas-gramin")) errors.push("ERROR: PM Awas showing for urban non-BPL");
  }

  if (scenarioId === "S27") {
    if (!matched.includes("atal-pension")) errors.push("ERROR: Atal Pension missing at age 40 boundary");
  }

  if (scenarioId === "S28") {
    if (matched.includes("atal-pension")) errors.push("ERROR: Atal Pension showing at age 41 (>40)");
  }

  if (scenarioId === "S29") {
    if (!matched.includes("national-pension")) errors.push("ERROR: NPS missing at age 65 boundary");
  }

  if (scenarioId === "S30") {
    if (matched.includes("national-pension")) errors.push("ERROR: NPS showing at age 66 (>65)");
  }

  if (scenarioId === "S31") {
    if (!matched.includes("gruha-lakshmi")) errors.push("ERROR: Gruha Lakshmi missing at exact income boundary (200000)");
  }

  if (scenarioId === "S32") {
    if (matched.includes("gruha-lakshmi")) errors.push("ERROR: Gruha Lakshmi showing above income cap (200001)");
  }

  if (scenarioId === "S33") {
    if (!matched.includes("stand-up-india")) errors.push("ERROR: Stand Up India missing for uppercase SC category profile");
  }

  if (scenarioId === "S34") {
    if (matched.includes("pm-svanidhi")) errors.push("ERROR: PM SVANidhi showing without street-vendor profile");
  }

  if (scenarioId === "S35") {
    if (!matched.includes("pm-matru-vandana")) errors.push("ERROR: PM Matru Vandana missing for pregnant eligible-age woman");
    if (!matched.includes("janani-suraksha")) errors.push("ERROR: Janani Suraksha missing for pregnant BPL eligible-age woman");
  }

  if (scenarioId === "S36") {
    if (matched.includes("pm-matru-vandana")) errors.push("ERROR: PM Matru Vandana showing for non-pregnant woman");
    if (matched.includes("janani-suraksha")) errors.push("ERROR: Janani Suraksha showing for non-pregnant woman");
  }

  if (scenarioId === "S37") {
    if (!matched.includes("pm-svanidhi")) errors.push("ERROR: PM SVANidhi missing at income boundary 200000");
  }

  if (scenarioId === "S38") {
    if (matched.includes("pm-svanidhi")) errors.push("ERROR: PM SVANidhi showing above income cap 200001");
  }

  if (scenarioId === "S39") {
    if (matched.includes("stand-up-india")) errors.push("ERROR: Stand Up India showing without business intent for SC profile");
  }

  if (scenarioId === "S40") {
    if (!matched.includes("stand-up-india")) errors.push("ERROR: Stand Up India missing for SC with business intent");
  }

  if (scenarioId === "S41") {
    if (matched.includes("pm-matru-vandana")) errors.push("ERROR: PM Matru Vandana showing above max age 45");
    if (matched.includes("janani-suraksha")) errors.push("ERROR: Janani Suraksha showing above max age 45");
    if (!matched.includes("ayushman-bharat")) errors.push("ERROR: Ayushman missing for BPL profile");
  }

  if (scenarioId === "S42") {
    if (matched.includes("pm-svanidhi")) errors.push("ERROR: PM SVANidhi showing without street-vendor flag");
    if (!matched.includes("pm-mudra")) errors.push("ERROR: PM Mudra missing for self-employed business profile");
  }

  if (scenarioId === "S43") {
    if (!matched.includes("stand-up-india")) errors.push("ERROR: Stand Up India missing for SC with business intent");
    if (!matched.includes("pm-kaushal-vikas")) errors.push("ERROR: PM Kaushal Vikas missing for unemployed youth");
  }

  if (scenarioId === "S44") {
    if (!matched.includes("anna-bhagya")) errors.push("ERROR: Anna Bhagya missing for Karnataka BPL profile");
    if (!matched.includes("bhagya-jyothi")) errors.push("ERROR: Bhagya Jyothi missing for Karnataka BPL profile");
    if (matched.includes("gruha-lakshmi")) errors.push("ERROR: Gruha Lakshmi showing for male");
    if (matched.includes("ujjwala")) errors.push("ERROR: Ujjwala showing for male");
    if (matched.includes("pm-matru-vandana")) errors.push("ERROR: PM Matru Vandana showing for male");
  }

  if (scenarioId === "S45") {
    if (!matched.includes("pm-jeevan-jyoti")) errors.push("ERROR: PM Jeevan Jyoti missing at age 50 boundary");
  }

  if (scenarioId === "S46") {
    if (matched.includes("pm-jeevan-jyoti")) errors.push("ERROR: PM Jeevan Jyoti showing above age 50");
  }

  if (scenarioId === "S47") {
    if (!matched.includes("pm-suraksha-bima")) errors.push("ERROR: PM Suraksha Bima missing at age 70 boundary");
  }

  if (scenarioId === "S48") {
    if (matched.includes("pm-suraksha-bima")) errors.push("ERROR: PM Suraksha Bima showing above age 70");
  }

  if (scenarioId === "S49") {
    if (!matched.includes("ayushman-bharat")) errors.push("ERROR: Ayushman missing for rural BPL woman");
    if (!matched.includes("pm-awas-gramin")) errors.push("ERROR: PM Awas missing for rural BPL woman");
    if (!matched.includes("free-ration")) errors.push("ERROR: Free Ration missing for BPL woman");
    if (!matched.includes("ujjwala")) errors.push("ERROR: Ujjwala missing for BPL woman");
    if (!matched.includes("anna-bhagya")) errors.push("ERROR: Anna Bhagya missing for Karnataka BPL profile");
    if (!matched.includes("bhagya-jyothi")) errors.push("ERROR: Bhagya Jyothi missing for Karnataka BPL profile");
    if (!matched.includes("nrega")) errors.push("ERROR: MGNREGA missing for rural agricultural-laborer");
    if (matched.includes("pm-mudra")) errors.push("ERROR: PM Mudra showing for non-business profile");
    if (matched.includes("pm-kisan")) errors.push("ERROR: PM Kisan showing for agricultural-laborer");
  }

  if (scenarioId === "S50") {
    if (!matched.includes("pm-svanidhi")) errors.push("ERROR: PM SVANidhi missing for eligible urban street vendor");
    if (!matched.includes("pm-mudra")) errors.push("ERROR: PM Mudra missing for self-employed business profile");
    if (!matched.includes("stand-up-india")) errors.push("ERROR: Stand Up India missing for woman entrepreneur");
    if (!matched.includes("pm-vishwakarma")) errors.push("ERROR: PM Vishwakarma missing for self-employed profile");
    if (matched.includes("ayushman-bharat")) errors.push("ERROR: Ayushman showing for non-BPL urban profile");
    if (matched.includes("pm-awas-gramin")) errors.push("ERROR: PM Awas showing for non-BPL urban profile");
    if (matched.includes("free-ration")) errors.push("ERROR: Free Ration showing for non-BPL profile");
    if (matched.includes("nrega")) errors.push("ERROR: MGNREGA showing for urban profile");
    if (matched.includes("anna-bhagya")) errors.push("ERROR: Anna Bhagya showing outside Karnataka");
  }

  // Data-quality mismatch checks between expectation text and profile facts
  if (scenarioId === "S3" && !profile.isPregnant && expectation.includes("PM Matru Vandana eligible")) {
    errors.push("WARN: Scenario expectation mentions PM Matru Vandana eligibility, but profile is not pregnant.");
  }

  // Goal-alignment and ranking quality checks
  const goalCategories = profile.goals.flatMap(g => goalToCategoryMap[g] || []);
  if (profile.goals.length > 0 && results.length > 0) {
    const aligned = results.filter(r => goalCategories.includes(r.scheme.category));
    if (aligned.length === 0) {
      errors.push("WARN: No matched scheme aligns with stated goals");
    } else {
      const topOverall = results[0];
      const topAligned = aligned[0];
      if (!goalCategories.includes(topOverall.scheme.category) && topOverall.score - topAligned.score >= 5) {
        errors.push(`WARN: Top-ranked scheme (${topOverall.scheme.name}) is not goal-aligned; aligned option (${topAligned.scheme.name}) scored ${topAligned.score}%`);
      }
      if (topAligned.score < 75) {
        errors.push(`WARN: Goal-aligned best score is low (${topAligned.score}%)`);
      }
    }
  }

  if (errors.length > 0) {
    console.log();
    for (const e of errors) console.log(`  *** ${e}`);
    allErrors.push(...errors.map(e => `[${label.split(":")[0]}] ${e}`));
  } else {
    console.log("\n  OK - No errors detected for this scenario.");
  }
}

console.log("\n" + "=".repeat(100));
console.log(`\nTOTAL ISSUES FOUND: ${allErrors.length}`);
if (allErrors.length > 0) {
  console.log("\nALL ISSUES:");
  for (const e of allErrors) console.log(`  ${e}`);
}
console.log();
