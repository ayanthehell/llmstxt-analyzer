import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const CMSContext = createContext(null);

export const useCMS = () => useContext(CMSContext);

export const CMSProvider = ({ children }) => {
  const [cmsData, setCmsData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCMS = async () => {
    try {
      const docRef = doc(db, "content", "website");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCmsData(docSnap.data());
      } else {
        // Fallback default data structure
        setCmsData({
          home: {
            heroTitle: 'Decipher the AI World',
            heroSubtitle: 'Upload your llms.txt and get instant analytics, insights, and summaries.',
          },
          about: {
            title: "What is llms.txt?",
            p1: "As AI tools, search engines, and language models increasingly browse the web to answer user queries, they need a standardized way to understand your website's content.",
            p2: "Similar to how robots.txt tells web crawlers what pages they are allowed to index, and sitemap.xml tells them where those pages are, llms.txt tells LLMs how to read and interpret your site.",
            h2_1: "Why does it matter?",
            li1_1: "Better AI Search Visibility: If an LLM cannot easily find your documentation, it won't cite you.",
            li1_2: "Reduced Hallucinations: Control the narrative and ensure the AI has accurate context.",
            li1_3: "Standardization: Universal markdown-based format that all AI agents can parse.",
            h2_2: "Why GEO Matters in 2026",
            p3: "Generative Engine Optimization (GEO) is the practice of optimizing your website so that AI-powered search engines can accurately read, summarize, and cite your content. As traditional search evolves with AI Overviews, having a well-structured llms.txt file is no longer optional.",
            p4: "Studies show that websites providing clean, structured context through llms.txt files are significantly more likely to be cited in AI-generated answers.",
            h2_3: "How does this analyzer work?",
            p5: "Our tool fetches your website's /llms.txt file and evaluates it against 6 key dimensions:",
            li2_1: "Completeness: Does it have all the required fields?",
            li2_2: "Structure Quality: Is the markdown well-formed?",
            li2_3: "Link Coverage: Are you pointing to the most important parts of your site?",
            li2_4: "Description Richness: Do your links and sections have adequate context?",
            li2_5: "LLM Optimization: Are there references to deep-dive files like llms-full.txt?",
            li2_6: "Best Practices: Are the URLs formatted correctly?"
          },
          emiCalculator: {
            toolName: "EMI Calculator",
            heroTitle: "EMI Calculator & Pre-payment Simulator",
            heroSubtitle: "Interactive loan calculator with real-time amortization, visual breakdowns, and a pre-payment savings simulator.",
            steps: [
              { icon: "Search", title: "Enter Loan Details", description: "Input your total loan amount, interest rate, and the tenure in years." },
              { icon: "LayoutGrid", title: "View Payment Schedule", description: "We instantly generate your monthly EMI, total interest, and a full amortization table." },
              { icon: "TrendingUp", title: "Simulate Savings", description: "Enter extra monthly or yearly payments to see how much interest and time you can save." }
            ],
            whatIs: {
              title: "What is an Equated Monthly Installment (EMI)?",
              subtitle: "Understand how your loan payments are calculated.",
              p1: "An <strong>Equated Monthly Installment (EMI)</strong> is a fixed payment made by a borrower to a lender on a specified date each calendar month. EMIs are applied to both interest and principal each month so that over a specified number of years, the loan is paid off in full.",
              card1Title: "Plan Your Finances",
              card1Text: "Knowing your exact monthly obligation helps you budget your expenses.",
              card2Title: "Save on Interest",
              card2Text: "By simulating prepayments, you can see how even small extra payments can save you lakhs in interest.",
              howItWorksTitle: "How is EMI Calculated?",
              howItWorksP1: "The mathematical formula for calculating EMI is: <strong>E = P x R x (1+R)^N / [(1+R)^N-1]</strong> where:",
              points: [
                { title: "P", desc: "Principal loan amount" },
                { title: "R", desc: "Rate of interest calculated on a monthly basis" },
                { title: "N", desc: "Loan tenure in months" }
              ]
            },
            useCases: [
              { icon: "Users", title: "Home Buyers", desc: "Calculate exact monthly payments before taking a mortgage." },
              { icon: "Building2", title: "Real Estate Agents", desc: "Help clients understand their financial commitments." },
              { icon: "Code2", title: "Auto Loan Borrowers", desc: "Compare car loan offers from different banks." },
              { icon: "ShoppingBag", title: "Personal Loans", desc: "Figure out how fast you can pay off high-interest debt." }
            ],
            faqs: [
              { question: "Does my EMI change if the interest rate changes?", answer: "If you have a fixed-rate loan, your EMI stays the same. Floating-rate loans may adjust your tenure or EMI." },
              { question: "Is it better to reduce EMI or tenure when making prepayments?", answer: "Mathematically, keeping your EMI the same and reducing your tenure saves you the most money on total interest." },
              { question: "What is an Amortization Schedule?", answer: "An amortization schedule is a complete table of periodic loan payments, showing principal and interest." }
            ]
          },
          sipCalculator: {
            toolName: "SIP Calculator",
            heroTitle: "SIP Calculator",
            heroSubtitle: "Estimate mutual fund SIP returns dynamically with Step-up and Inflation adjustments.",
            steps: [
              { icon: "Search", title: "Enter Investment Details", description: "Input your monthly SIP amount, expected return rate, and investment duration." },
              { icon: "LayoutGrid", title: "View Projected Wealth", description: "See a clear breakdown of your total invested amount versus your estimated wealth gain." },
              { icon: "TrendingUp", title: "Analyze the Graph", description: "Use the interactive chart to visualize the power of compounding over time." }
            ],
            whatIs: {
              title: "What is a Systematic Investment Plan (SIP)?",
              subtitle: "The smartest way to build long-term wealth through mutual funds.",
              p1: "A <strong>Systematic Investment Plan (SIP)</strong> allows you to invest a fixed amount regularly (e.g., monthly) into a mutual fund or index fund. It leverages the power of compounding and rupee-cost averaging.",
              card1Title: "Power of Compounding",
              card1Text: "Because your returns generate their own returns over time, starting early multiplies wealth.",
              card2Title: "Rupee Cost Averaging",
              card2Text: "Investing regularly averages out your purchase cost regardless of market highs and lows.",
              howItWorksTitle: "How are SIP Returns Calculated?",
              howItWorksP1: "SIP returns use the future value of an annuity formula: <strong>M = P × ({[1 + i]^n – 1} / i) × (1 + i)</strong> where:",
              points: [
                { title: "M", desc: "Maturity amount or estimated returns" },
                { title: "P", desc: "Amount you invest at regular intervals (monthly)" },
                { title: "i", desc: "Periodic rate of interest (annual rate / 12)" },
                { title: "n", desc: "Total number of payments (months)" }
              ]
            },
            useCases: [
              { icon: "Users", title: "Retail Investors", desc: "Calculate potential future wealth to set realistic retirement goals." },
              { icon: "Building2", title: "Financial Advisors", desc: "Show clients the long-term benefits of disciplined investing." },
              { icon: "Code2", title: "Young Professionals", desc: "Understand how starting early creates a massive difference." },
              { icon: "ShoppingBag", title: "Goal Planners", desc: "Determine how much to invest monthly for a house or education." }
            ],
            faqs: [
              { question: "Are SIP returns guaranteed?", answer: "No, SIPs in mutual funds are subject to market risks. Equity funds typically offer 10-15% long-term returns." },
              { question: "Can I stop or pause my SIP?", answer: "Yes, SIPs are flexible. You can pause, stop, or increase your amount anytime without penalties." },
              { question: "What is the best date for SIP deduction?", answer: "The date has negligible impact on long-term returns. Best is 2-3 days after salary credit." }
            ]
          },
          gstCalculator: {
            toolName: "GST Calculator",
            heroTitle: "GST Calculator",
            heroSubtitle: "Quickly calculate exclusive and inclusive GST amounts instantly as you type.",
            steps: [
              { icon: "Search", title: "Enter Amount", description: "Input the base amount or the total amount including GST." },
              { icon: "LayoutGrid", title: "Select Tax Slab", description: "Choose the applicable GST rate (5%, 12%, 18%, or 28%)." },
              { icon: "TrendingUp", title: "View Breakdown", description: "Instantly see the CGST, SGST, IGST, and the final total amount." }
            ],
            whatIs: {
              title: "What is Goods and Services Tax (GST)?",
              subtitle: "India's comprehensive indirect tax system.",
              p1: "<strong>Goods and Services Tax (GST)</strong> is an indirect tax used in India on the supply of goods and services. It is a comprehensive, multi-stage, destination-based tax.",
              card1Title: "Exclusive vs Inclusive GST",
              card1Text: "<strong>Exclusive GST</strong> means the tax is added to the base price. <strong>Inclusive GST</strong> means the tax is already included.",
              card2Title: "CGST, SGST, and IGST",
              card2Text: "Intra-state sales split GST equally into CGST and SGST. Inter-state sales apply IGST.",
              howItWorksTitle: "How to Calculate GST?",
              howItWorksP1: "The mathematical formulas for GST calculation are:",
              points: [
                { title: "Add GST", desc: "GST Amount = (Original Cost × GST%) / 100" },
                { title: "Net Price", desc: "Original Cost + GST Amount" },
                { title: "Remove GST", desc: "GST Amount = Total Cost - [Total Cost × (100 / (100 + GST%))]" }
              ]
            },
            useCases: [
              { icon: "Users", title: "Consumers", desc: "Verify bills and understand how much tax you pay." },
              { icon: "Building2", title: "Business Owners", desc: "Calculate base price and tax components for generating invoices." },
              { icon: "Code2", title: "Accountants", desc: "Split inclusive amounts into CGST/SGST for bookkeeping." },
              { icon: "ShoppingBag", title: "Retailers", desc: "Determine final selling price of goods by adding GST." }
            ],
            faqs: [
              { question: "What are the different GST slabs in India?", answer: "The primary GST slabs are 5%, 12%, 18%, and 28%. Some goods are exempt (0%)." },
              { question: "When do I charge IGST instead of CGST/SGST?", answer: "Sell in the same state: CGST + SGST. Sell in a different state: full IGST." },
              { question: "Can I claim Input Tax Credit (ITC)?", answer: "Yes, registered businesses can claim ITC on GST paid on purchases." }
            ]
          },
          electricityBillCalculator: {
            toolName: "Electricity Bill Calculator",
            heroTitle: "Electricity Bill Estimator",
            heroSubtitle: "Estimate monthly units (kWh) and bill based on your state's tariff slabs. Includes Energy Hog analysis and Solar ROI.",
            steps: [
              { icon: "Search", title: "Enter Previous & Current Reading", description: "Input meter readings from your bill to calculate units consumed." },
              { icon: "LayoutGrid", title: "Set Rate & Charges", description: "Enter your per-unit rate, fixed charges, and any additional taxes." },
              { icon: "TrendingUp", title: "Generate Final Bill", description: "Instantly see the exact breakdown and download a PDF." }
            ],
            whatIs: {
              title: "How is an Electricity Bill Calculated?",
              subtitle: "Understand the hidden charges and taxes.",
              p1: "Your monthly electricity bill is a composite charge made up of <strong>Energy Charges</strong> (based on consumption), <strong>Fixed Charges</strong> (meter rental/infrastructure), and various state <strong>taxes and duties</strong>.",
              card1Title: "Units Consumed",
              card1Text: "Calculated by subtracting previous reading from current. 1 Unit = 1 Kilowatt-Hour (kWh).",
              card2Title: "Fixed vs Energy Charges",
              card2Text: "Energy charges fluctuate based on use. Fixed charges are a mandatory monthly fee.",
              howItWorksTitle: "The Billing Formula",
              howItWorksP1: "The final bill amount is calculated using:",
              points: [
                { title: "Energy Charge", desc: "Units Consumed × Rate per Unit" },
                { title: "Subtotal", desc: "Energy Charge + Fixed Monthly Charge" },
                { title: "Final Amount", desc: "Subtotal + (Subtotal × Tax Rate %)" }
              ]
            },
            useCases: [
              { icon: "Users", title: "Homeowners", desc: "Verify if your local electricity board sent an accurate bill." },
              { icon: "Building2", title: "Landlords", desc: "Generate accurate sub-meter invoices for your tenants." },
              { icon: "Code2", title: "Tenants", desc: "Cross-check charges levied by your landlord." },
              { icon: "ShoppingBag", title: "Small Businesses", desc: "Forecast monthly operational expenses based on projected usage." }
            ],
            faqs: [
              { question: "What does '1 Unit' of electricity mean?", answer: "1 unit = 1 Kilowatt-Hour (kWh). Running a 1000W appliance for 1 hour consumes 1 unit." },
              { question: "Why is my electricity bill higher in summer?", answer: "ACs consume more power, and many boards use slab systems where higher consumption triggers higher rates." },
              { question: "Can I use this calculator for any state?", answer: "Yes, it uses a universal formula. Enter your state's rate and charges." }
            ]
          },
          cgpaConverter: {
            toolName: "CGPA to Percentage Converter",
            heroTitle: "CGPA ↔ Percentage Converter",
            heroSubtitle: "Real-time conversion with visual grade tracking and Semester-wise CGPA calculation.",
            steps: [
              { icon: "Search", title: "Enter CGPA", description: "Input your Cumulative Grade Point Average (CGPA)." },
              { icon: "LayoutGrid", title: "Select Multiplier", description: "Choose the standard 9.5 multiplier or custom university formula." },
              { icon: "TrendingUp", title: "Get Percentage", description: "Instantly convert your CGPA into a percentage." }
            ],
            whatIs: {
              title: "What is CGPA?",
              subtitle: "Cumulative Grade Point Average explained.",
              p1: "<strong>CGPA</strong> is a grading system used to measure overall academic performance. Students receive grades (A, B, C) corresponding to points (10, 9, 8).",
              card1Title: "Why Convert CGPA?",
              card1Text: "Employers and competitive exams often require academic scores as a flat percentage.",
              card2Title: "The 9.5 Multiplier",
              card2Text: "The CBSE officially recommends multiplying CGPA by 9.5 to get the approximate percentage.",
              howItWorksTitle: "How to Calculate Percentage from CGPA?",
              howItWorksP1: "The standard formulas are:",
              points: [
                { title: "CBSE Formula", desc: "Percentage = CGPA × 9.5" },
                { title: "University Formula", desc: "Often Percentage = (CGPA × 10) - 7.5 (Check guidelines)" },
                { title: "SGPA to CGPA", desc: "CGPA is the average of your Semester Grade Point Averages (SGPAs)." }
              ]
            },
            useCases: [
              { icon: "Users", title: "Students", desc: "Convert school CGPA to percentage for admissions." },
              { icon: "Building2", title: "Job Seekers", desc: "Fill out employment applications that mandate percentage scores." },
              { icon: "Code2", title: "Study Abroad", desc: "Convert formats for foreign university evaluations." },
              { icon: "ShoppingBag", title: "Teachers", desc: "Convert entire batch scorecards into legacy percentage formats." }
            ],
            faqs: [
              { question: "Is the 9.5 multiplier accurate for all universities?", answer: "No. Many universities (VTU, Mumbai, Anna) have specific formulas. Check your marksheet." },
              { question: "What is the maximum CGPA?", answer: "In India, usually 10.0. Some US universities use a 4.0 scale." },
              { question: "Can a 10 CGPA equal 100%?", answer: "Using CBSE formula, 10 CGPA = 95%. It rarely mathematically reaches 100%." }
            ]
          },
          landUnitConverter: {
            toolName: "Land Unit Converter",
            heroTitle: "Land Unit Converter",
            heroSubtitle: "Enter a value in any box. All other units and visual scales update instantly in this bi-directional matrix.",
            steps: [
              { icon: "Search", title: "Select Source Unit", description: "Choose the regional or international unit you have." },
              { icon: "LayoutGrid", title: "Enter Value", description: "Input the exact area value to be converted." },
              { icon: "TrendingUp", title: "Get Instant Conversion", description: "Instantly see the value converted across all other units." }
            ],
            whatIs: {
              title: "Why are there so many Land Units?",
              subtitle: "Understanding regional land records in India.",
              p1: "In India, land measurement varies drastically by state. Urban areas use <strong>Sq Ft</strong> or <strong>Acres</strong>, while rural records use traditional local units.",
              card1Title: "Northern Units",
              card1Text: "Punjab/UP/Rajasthan use <strong>Bigha</strong>, <strong>Biswa</strong>, and <strong>Killa</strong>.",
              card2Title: "Southern Units",
              card2Text: "Tamil Nadu/Karnataka use <strong>Cent</strong>, <strong>Guntha</strong>, and <strong>Ankanam</strong>.",
              howItWorksTitle: "Common Conversion Metrics",
              howItWorksP1: "Standard conversions you should know:",
              points: [
                { title: "1 Acre", desc: "43,560 Sq Ft or 4,840 Sq Yds" },
                { title: "1 Hectare", desc: "10,000 Sq Meters or 2.47 Acres" },
                { title: "1 Bigha", desc: "Varies wildly! (UP ~27,000 sq ft, Bengal ~14,400 sq ft)" }
              ]
            },
            useCases: [
              { icon: "Users", title: "Farmers", desc: "Convert local measurements to standard metric units." },
              { icon: "Building2", title: "Real Estate Brokers", desc: "Communicate land sizes to urban buyers in sq ft." },
              { icon: "Code2", title: "Lawyers", desc: "Draft sale deeds by converting ancestral land records." },
              { icon: "ShoppingBag", title: "Investors", desc: "Compare land prices by standardizing area to Acres." }
            ],
            faqs: [
              { question: "Is a Bigha the same everywhere in India?", answer: "No. In UP it's exactly 27,000 sq ft, but in West Bengal it's 14,400 sq ft." },
              { question: "What is the globally accepted standard for large land?", answer: "The Hectare (ha) is universal. 1 Hectare = 10,000 sq m. Acres are also widely used." },
              { question: "How many cents make an Acre?", answer: "1 Acre is exactly 100 Cents. Primarily used in Southern India." }
            ]
          },
          salarySlipGenerator: {
            toolName: "Salary Slip Generator",
            heroTitle: "Salary Slip Generator",
            heroSubtitle: "Generate perfectly formatted payslips with Reverse CTC breakdown and auto-deductions.",
            steps: [
              { icon: "Search", title: "Enter Details", description: "Input employer name, employee ID, and designation." },
              { icon: "LayoutGrid", title: "Input Components", description: "Add Basic Pay, HRA, Allowances, and deductions like PF or PT." },
              { icon: "TrendingUp", title: "Generate PDF", description: "Instantly create a professional, print-ready PDF payslip." }
            ],
            whatIs: {
              title: "What is a Salary Slip?",
              subtitle: "The official proof of income and employment.",
              p1: "A <strong>Salary Slip</strong> is a document issued by an employer detailing earnings (Basic, HRA) and deductions (PF, TDS) for a specific cycle.",
              card1Title: "Proof of Employment",
              card1Text: "Serves as legal proof for background checks.",
              card2Title: "Financial Documentation",
              card2Text: "Banks mandate 3 months' slips for loans or credit cards.",
              howItWorksTitle: "Key Components",
              howItWorksP1: "A standard Indian salary slip consists of:",
              points: [
                { title: "Basic Pay", desc: "Core salary, usually 40-50% of CTC." },
                { title: "HRA", desc: "House Rent Allowance, partially tax-exempt." },
                { title: "Deductions", desc: "Provident Fund (PF), Professional Tax (PT), and TDS." }
              ]
            },
            useCases: [
              { icon: "Users", title: "Small Business Owners", desc: "Generate payslips without HR software." },
              { icon: "Building2", title: "Freelancers", desc: "Create income proofs for project-based work." },
              { icon: "Code2", title: "HR Professionals", desc: "Quickly draft ad-hoc salary slips." },
              { icon: "ShoppingBag", title: "Startup Founders", desc: "Provide standard documentation to early contractors." }
            ],
            faqs: [
              { question: "Is this generated slip valid?", answer: "Yes, if the info is accurate and stamped/signed by the employer, it is valid for loans." },
              { question: "What is CTC vs In-Hand?", answer: "CTC is total cost to company (including PF). In-Hand is net salary credited after deductions." },
              { question: "Is providing a salary slip mandatory?", answer: "Yes, under various Indian labor laws, employers must provide a payslip." }
            ]
          },
          rentAgreementGenerator: {
            toolName: "Rent Agreement Generator",
            heroTitle: "Rent Agreement Generator",
            heroSubtitle: "Create legally sound 11-month rental agreements with live preview, stamp duty estimates, and digital signatures.",
            steps: [
              { icon: "Search", title: "Enter Party Details", description: "Input legal names and addresses of Landlord and Tenant." },
              { icon: "LayoutGrid", title: "Define Terms", description: "Set monthly rent, security deposit, and lease duration." },
              { icon: "TrendingUp", title: "Generate Legal Draft", description: "Download a PDF ready to be printed on stamp paper." }
            ],
            whatIs: {
              title: "What is a Rent Agreement?",
              subtitle: "The legal contract between landlord and tenant.",
              p1: "A <strong>Rent Agreement</strong> outlines monthly rent, deposit, duration, and rights/responsibilities of both parties.",
              card1Title: "Protects Both Parties",
              card1Text: "Prevents disputes by clearly defining payment terms and maintenance.",
              card2Title: "Address Proof",
              card2Text: "A registered agreement serves as valid address proof for banking or passports.",
              howItWorksTitle: "Why 11-Month Agreements?",
              howItWorksP1: "In India, most agreements are exactly 11 months:",
              points: [
                { title: "Registration Laws", desc: "Leases over 12 months must be registered with the sub-registrar." },
                { title: "Cost Savings", desc: "Skipping the 12th month avoids hefty stamp duty." },
                { title: "Easy Renewal", desc: "After 11 months, parties can renew with an updated rent." }
              ]
            },
            useCases: [
              { icon: "Users", title: "Landlords", desc: "Draft a contract to protect your property." },
              { icon: "Building2", title: "Tenants", desc: "Generate a draft to propose terms to a landlord." },
              { icon: "Code2", title: "Brokers", desc: "Create draft agreements for clients quickly." },
              { icon: "ShoppingBag", title: "PG Owners", desc: "Standardized agreements for paying guests." }
            ],
            faqs: [
              { question: "Is this generated PDF legally valid?", answer: "To be binding in court, print it on non-judicial stamp paper and sign with witnesses." },
              { question: "Do I need to notarize an 11-month agreement?", answer: "Notarizing on stamp paper adds authenticity and is highly recommended." },
              { question: "What is a lock-in period?", answer: "Minimum duration neither party can terminate. Tenants leaving early forfeit deposits." }
            ]
          },
          leaveApplicationGenerator: {
            toolName: "Leave Application Generator",
            heroTitle: "Leave Application Generator",
            heroSubtitle: "Create formal leave letters for office or school with Smart Tone Selection and Live Rich Text Editing.",
            steps: [
              { icon: "Search", title: "Enter Details", description: "Input name, manager's name, dates, and reason." },
              { icon: "LayoutGrid", title: "Choose Type", description: "Select Sick, Casual, Annual, or Maternity Leave." },
              { icon: "TrendingUp", title: "Download PDF", description: "Copy text for email or download a formal PDF." }
            ],
            whatIs: {
              title: "What is a Leave Application?",
              subtitle: "The professional way to request time off.",
              p1: "A <strong>Leave Application</strong> is a formal request to a manager or principal, acting as an official record of absence.",
              card1Title: "Professional Etiquette",
              card1Text: "Shows respect for company policies and allows team planning.",
              card2Title: "HR Record",
              card2Text: "Required by HR to accurately deduct from leave balances.",
              howItWorksTitle: "Types of Leaves",
              howItWorksP1: "Most corporate policies have three buckets:",
              points: [
                { title: "Sick Leave (SL)", desc: "For sudden illness. May need a medical certificate." },
                { title: "Casual Leave (CL)", desc: "For urgent personal matters (usually 1-2 days)." },
                { title: "Earned Leave (EL)", desc: "Planned vacations. Can often be encashed." }
              ]
            },
            useCases: [
              { icon: "Users", title: "Employees", desc: "Draft emails for sick leaves or vacations." },
              { icon: "Building2", title: "Students", desc: "Generate formal letters for school principals." },
              { icon: "Code2", title: "Parents", desc: "Draft absence excuse letters for children." },
              { icon: "ShoppingBag", title: "HR Teams", desc: "Provide this tool to standardize internal formats." }
            ],
            faqs: [
              { question: "How far in advance should I apply?", answer: "Planned vacations (EL): 15-30 days. Sick/Casual: inform immediately." },
              { question: "Should I mention my specific illness?", answer: "No need to overshare. 'Severe viral fever' is sufficient." },
              { question: "Can a manager reject a leave?", answer: "Yes, for Earned leaves due to deadlines. Sick leaves are usually statutory rights." }
            ]
          },
          blogs: [],
          faqs: [],
          seo: {}
        });
      }
    } catch (err) {
      console.error('Failed to load CMS data from Firestore', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCMS();
  }, []);

  return (
    <CMSContext.Provider value={{ cmsData, loading, refreshCMS: fetchCMS }}>
      {children}
    </CMSContext.Provider>
  );
};
