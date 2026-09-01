import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const posts = [
  {
    title: "Gratuity Calculation: How Much Gratuity Will You Get on Resignation?",
    slug: "how-to-calculate-gratuity-resignation-india",
    excerpt: "Not sure how much gratuity you get when you quit after 5 years? Learn the formula, tax exemption, and how to check your exact amount.",
    content: "Gratuity is a lump-sum payment your employer gives you when you leave a job after completing at least five years of continuous service. Here is how to calculate it.\n\n## What Is Gratuity?\n\nGratuity is a statutory benefit under the Payment of Gratuity Act, 1972. Any employee who completes five years of continuous full-time service with the same employer is eligible.\n\n## The Gratuity Formula\n\nGratuity = (Last drawn salary x 15 x Completed years of service) / 26\n\nLast drawn salary = Basic pay + Dearness Allowance (DA)\n\nExample: Basic 50,000 + DA 10,000 = 60,000. After 10 years:\n\n(60,000 x 15 x 10) / 26 = 3,46,154\n\n## Step-by-Step Calculation\n\n1. Add your basic salary and DA\n2. Multiply by 15\n3. Multiply by completed years of service\n4. Divide by 26\n\nUse the [Gratuity Calculator](/tools/gratuity-calculator) to get this instantly without doing the math.\n\n## Tax Exemption Under Section 10(10)\n\nThe gratuity you receive is tax-free up to a limit. Under Section 10(10), the lower of these is exempt:\n\n- The actual gratuity you received\n- The notified limit (currently 20 lakh)\n\nAnything above the exemption is taxable as per your income slab.\n\n## Eligibility Rules\n\n| Condition | Requirement |\n|-----------|------------|\n| Minimum service | 5 continuous years |\n| Coverage | Companies with 10+ employees |\n| Not applicable | Voluntary resignation before 5 years |\n\nIf you resign before 5 years you usually do not get gratuity, though some companies offer it as a special benefit.\n\n## Gratuity on Death or Disability\n\nIf an employee dies or becomes disabled before completing 5 years, gratuity is still payable to them or their nominee.\n\n## Don't Rely on Guesswork\n\nBefore you resign or negotiate your settlement, check your exact gratuity amount with the free [Gratuity Calculator](/tools/gratuity-calculator). Also plan your total payout and tax with the [Salary Calculator](/tools/salary-calculator) so there are no surprises at the time of exit.",
    author: "ToolPilot Team",
    seoTitle: "Gratuity Calculation India: Formula, Eligibility & Tax Exemption",
    seoDescription: "Learn how to calculate gratuity on resignation after 5 years in India. Get the formula, tax exemption limit, and a free gratuity calculator.",
    status: "PUBLISHED" as const,
  },
  {
    title: "EPF Interest Calculation: How Your Provident Fund Grows to Retirement",
    slug: "how-epf-interest-calculated-india",
    excerpt: "EPF interest compounds yearly and can build a large corpus by retirement. Understand the 12% contribution split, interest rate, and how to estimate your final balance.",
    content: "Your Employees' Provident Fund (EPF) grows through monthly contributions and yearly compounding interest. Here is how it works and how to estimate your retirement corpus.\n\n## How Contributions Work\n\nBoth you and your employer contribute to EPF every month.\n\n| Contributor | Percentage | Destination |\n|-------------|-----------|-------------|\n| Employee | 12% of basic + DA | EPF account (100%) |\n| Employer | 12% of basic + DA | 8.33% to EPS, rest to EPF |\n\nExample with basic 15,000:\n\n- Employee contribution: 1,800\n- Employer EPS (capped at 1,250): 1,250\n- Employer EPF: 2,150 - 1,250 = 900\n- Total monthly deposit: 2,700\n\n## How Interest Is Calculated\n\nEPF interest is credited once a year and compounds. The interest rate is set by the EPFO each financial year (recently around 8.25%).\n\nThe balance keeps growing, and every year you earn interest on the previous balance plus contributions. That is compounding working for you.\n\n## Estimate Your Retirement Corpus\n\nUse the [EPF Interest Calculator](/tools/epf-interest-calculator) to see:\n\n- Your monthly contribution (employee + employer)\n- Total amount deposited by retirement\n- Total interest earned\n- Projected final balance\n- Year-by-year growth table\n\nJust enter your basic salary, current age, retirement age, and the interest rate.\n\n## Example Projection\n\nWith basic 15,000, age 30, retirement 60, at 8.25%:\n\n- Monthly deposit: about 2,700\n- Total deposited over 30 years: about 9.7 lakh\n- Projected balance: well over 25 lakh thanks to compounding\n\nThe earlier you start and the longer you stay, the bigger the corpus.\n\n## A Bigger Corpus with Voluntary PF\n\nYou can add a voluntary contribution (VPF) each month to grow your EPF much faster. Add it in the [EPF Calculator](/tools/epf-interest-calculator) to see the difference.\n\n## Why Plan Early\n\nRetirement savings grow the most in the final years because of compounding. Use the free [EPF Interest Calculator](/tools/epf-interest-calculator) to plan your retirement target today.",
    author: "ToolPilot Team",
    seoTitle: "EPF Interest Calculation India: Formula, Rate & Retirement Corpus",
    seoDescription: "Understand EPF contributions and how interest compounds. Estimate your provident fund corpus at retirement with a free EPF interest calculator.",
    status: "PUBLISHED" as const,
  },
  {
    title: "How to Convert PDF to Excel Without Manual Retyping",
    slug: "convert-pdf-to-excel-free-online",
    excerpt: "Stop retyping data from PDF tables. Learn how to convert a PDF into an editable Excel spreadsheet in seconds, free and private.",
    content: "Financial statements, price lists, mark sheets, and inventory sheets are often shared as PDFs. To edit them you need them in Excel. Here is how to convert a PDF to Excel without retyping.\n\n## Why Convert PDF to Excel\n\n- PDFs are hard to edit, sort, and filter\n- Excel lets you reuse, calculate, and analyze data\n- Retyping is slow and error-prone\n\n## How to Convert PDF to Excel\n\n1. Go to [PDF to Excel](/tools/pdf-to-excel)\n2. Upload your PDF\n3. Click Convert to Excel\n4. Download the .xlsx file\n5. Open it in Excel, Google Sheets, or LibreOffice\n\nEverything runs in your browser, so your document stays private.\n\n## What Works Best\n\n| Type of PDF | Result |\n|-------------|--------|\n| Digital PDF with tables | Excellent extraction |\n| Digital PDF with text | Text extracted into cells |\n| Scanned / image PDF | Needs OCR, may be messy |\n\nDigital (selectable) PDFs convert best. If your PDF is a scan, use an [Image to Text (OCR)](/tools/image-to-text) tool first.\n\n## After Conversion\n\nOnce you have the Excel file you can:\n\n- Sort and filter the data\n- Use formulas and calculations\n- Fix formatting and add columns\n- Save as .xlsx or share it\n\n## When To Use Other Tools\n\n- Need to edit text, not tables? [PDF to Word](/tools/pdf-to-word) is better\n- Just checking length? Use the [PDF Page Counter](/tools/pdf-page-counter)\n- Need images out of the PDF? Try [PDF to JPG](/tools/pdf-to-jpg)\n\nConverting PDFs to editable spreadsheets saves hours of manual work. Use the free [PDF to Excel converter](/tools/pdf-to-excel) to get your data into a spreadsheet in seconds.",
    author: "ToolPilot Team",
    seoTitle: "Convert PDF to Excel Free Online — No Manual Retyping",
    seoDescription: "Convert PDF tables into editable Excel spreadsheets online for free. Fast, private, and no signup — extract PDF data without retyping.",
    status: "PUBLISHED" as const,
  },
];

async function main() {
  console.log("Seeding blog posts (batch 8)...\n");

  for (const post of posts) {
    const existing = await prisma.blogPost.findUnique({ where: { slug: post.slug } });
    if (existing) {
      console.log(`Skip (exists): ${post.slug}`);
      continue;
    }
    await prisma.blogPost.create({ data: { ...post, publishedAt: new Date() } });
    console.log(`Created: ${post.title}`);
  }

  const total = await prisma.blogPost.count();
  console.log(`\nTotal blog posts: ${total}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
