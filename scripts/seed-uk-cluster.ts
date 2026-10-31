/**
 * UK content cluster.
 *
 * The site had exactly one UK post (the income tax pillar) against three UK
 * calculators, and UK traffic was 0% of the last 30 days. These four pieces
 * cover the questions UK searchers actually type: payslip deductions,
 * National Insurance, take-home pay at common salaries, and VAT rates. Each
 * one links to the UK calculators and to its siblings, so the cluster can
 * rank as a group.
 *
 * Content rules: markdown subset rendered by src/lib/blog-renderer.ts; avoid
 * the rupee symbol, em-dashes and degree signs (use ASCII); FAQs live in the
 * FAQ table, not the body.
 *
 * Idempotent: updates the post and replaces its FAQs if it already exists.
 */
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const AUTHOR = "Sandy Dixit";
const GUIDES_CATEGORY = "cmt2ndqx70040uffsia1zwfkd";

interface Pillar {
  title: string;
  slug: string;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  content: string;
  faqs: { question: string; answer: string }[];
}

const pillars: Pillar[] = [
  {
    title: "UK Payslip Explained: What Every Line on Your Pay Slip Means (2025/26)",
    slug: "uk-payslip-explained-2025-26",
    excerpt:
      "Gross pay, PAYE, National Insurance, pension and student loan: a line-by-line guide to reading a UK payslip, with a worked £35,000 example.",
    seoTitle: "UK Payslip Explained 2025/26: Every Deduction, Line by Line",
    seoDescription:
      "How to read a UK payslip: gross vs net pay, PAYE tax, National Insurance, pension, student loan and tax codes, with a worked £35,000 example.",
    content: `A UK payslip looks cryptic the first time you see one. A single page carries a tax code, a National Insurance letter, two or three deduction lines and a figure at the bottom that is smaller than the salary you agreed to. Every line has a purpose, and once you know what each one does you can check your pay in about two minutes.

## What Every UK Payslip Must Show

By law a payslip has to state your gross pay and every deduction, so that the amount you receive can be traced back. A compliant payslip includes:

- The employer's name
- The pay period it covers (week, month or four-weekly)
- Gross pay for the period and for the tax year to date
- Each deduction, with the amount taken
- Net pay, the figure that reaches your bank account
- Your tax code and National Insurance number
- Your National Insurance category letter

If any of those are missing, ask payroll for a corrected payslip. You are entitled to one.

## Gross Pay vs Net Pay

Gross pay is what you earn before anything is taken off. Net pay, often called take-home pay, is what is left after income tax, National Insurance and any other deductions. The gap between the two is usually somewhere between 15% and 32% of gross pay for a UK employee, depending on salary.

For a salary of £35,000 with no pension or student loan, gross pay is £2,916.67 a month and net pay is about £2,393.30. The difference is income tax and National Insurance, nothing else.

## PAYE Income Tax and Tax Codes

Pay As You Earn (PAYE) spreads your income tax evenly across the year instead of handing you a bill in January. Your employer works out the tax on each payment using HMRC's tax tables and your tax code.

The code is a compressed version of your tax-free allowance. **1257L** means £12,570 of income is tax free, which is the standard personal allowance for 2025/26. Numbers lower than that mean something is reducing your allowance, such as untaxed income from a second job or a benefit in kind. Codes beginning with **K** mean the opposite: you have income that HMRC collects through your pay because your allowance is not enough to cover it.

If your code looks wrong, the quickest fix is the HMRC app or your personal tax account. A wrong code usually corrects itself over a few months, but you can also be owed a refund.

## National Insurance

National Insurance (NI) is a separate deduction from income tax, and it pays for the State Pension and public services rather than general taxation. As an employee you pay Class 1 contributions:

- **8%** on earnings between £12,570 and £50,270 a year
- **2%** on earnings above £50,270

Your payslip shows the category letter, usually **A** for standard employees. Other letters cover married women with a reduced rate, apprentices and directors. The full breakdown, including thresholds and employer contributions, is in our [National Insurance guide](/blog/uk-national-insurance-rates-2025-26).

## Pension Contributions

If you are enrolled in a workplace pension, the minimum automatic enrolment contribution is **8% of qualifying earnings**, made up of at least 3% from your employer and the rest from you. Qualifying earnings are the slice between £6,240 and £50,270 a year.

Two things are worth checking on the payslip:

- Whether your contribution is taken **before tax** (net pay arrangement, so you get tax relief immediately) or **after tax** (relief at source, where the pension provider claims basic-rate relief back).
- Whether your employer is paying their share on your full salary or only on qualifying earnings. Many do the minimum, but some are more generous.

Higher-rate taxpayers who use relief at source have to claim the extra 20% or 25% through Self Assessment. It is not automatic.

## Student Loan Repayments

Student loan repayments are deducted through PAYE once your income passes the threshold for your plan. The rate is 9% of income above the threshold, or 6% for postgraduate loans.

| Plan | 2025/26 threshold | Rate |
|------|-------------------|------|
| Plan 1 | £26,065 | 9% |
| Plan 2 | £28,470 | 9% |
| Plan 4 (Scotland) | £32,745 | 9% |
| Plan 5 | £25,000 | 9% |
| Postgraduate | £21,000 | 6% |

If you have more than one loan, tell HMRC through your student loan account. Otherwise the deduction can be split wrongly and you may repay more than you owe.

## Other Deductions You Might See

- **Cycle to Work** scheme hire payments
- **Childcare vouchers** or tax-free childcare adjustments
- **Season ticket loans** and travel advances
- **Union subscriptions** paid through payroll
- **Charitable giving** through Gift Aid payroll giving
- **Salary sacrifice** for a car, pension or bike, which reduces gross pay before tax

Salary sacrifice lowers your gross pay, which reduces income tax and National Insurance, but it also lowers the salary used for mortgage applications and some benefits. It is a real trade-off, not free money.

## Worked Example: £35,000 a Year

| Line | Monthly |
|------|---------|
| Gross pay | £2,916.67 |
| PAYE income tax | £373.83 |
| National Insurance | £149.53 |
| Pension (5% employee) | £145.83 |
| Net pay before student loan | £2,247.48 |

Add a Plan 2 student loan and the deduction is about £49 a month on this salary ((35,000 - 28,470) x 9% / 12).

Use the free [UK Income Tax Calculator](/tools/uk-income-tax-calculator) and [National Insurance Calculator](/tools/uk-national-insurance-calculator) to get your own figures to the penny before you compare them against a payslip.

## Four Checks Worth Doing

1. **Gross pay matches your contract.** A pro-rata month for a mid-month start is normal; a full month at the wrong rate is not.
2. **The tax code is the one HMRC shows.** A stale code from a previous job is the most common cause of overpaid tax.
3. **NI is charged at 8%, not 12%.** The main rate fell to 8% in April 2024, so an old payroll system or a mis-set rate stands out.
4. **Year-to-date figures add up.** Multiply a monthly deduction by the month number and compare it with the YTD column.

## All the UK Calculators in One Place

The [UK Tax Calculators hub](/tools/uk-tax-calculators) collects income tax, National Insurance and VAT in one page. For the wider picture, our [UK income tax guide](/blog/uk-income-tax-calculator-guide-2025-26) explains the personal allowance taper, and the [take-home pay examples](/blog/uk-take-home-pay-examples-2025-26) show what common salaries actually pay after tax.`,
    faqs: [
      {
        question: "What should a UK payslip include?",
        answer:
          "A legal UK payslip must show gross pay, every deduction and the net pay, plus the employer name, pay period, tax code, National Insurance number and NI category letter. You are entitled to a payslip from day one of employment.",
      },
      {
        question: "What does tax code 1257L mean?",
        answer:
          "1257L means you get the standard £12,570 personal allowance for 2025/26. The number is your tax-free amount divided by ten, and the L shows you are entitled to the standard allowance.",
      },
      {
        question: "Why is my take-home pay lower than my salary divided by 12?",
        answer:
          "Your salary divided by 12 is gross pay. Income tax, National Insurance and any pension or student loan are deducted from it, which typically leaves 68% to 85% of gross pay depending on your salary.",
      },
      {
        question: "Is National Insurance the same as income tax?",
        answer:
          "No. Income tax is charged on taxable income after allowances, while National Insurance is a separate contribution on earnings between £12,570 and £50,270 at 8%, and 2% above that. NI funds the State Pension and public services.",
      },
    ],
  },
  {
    title: "National Insurance 2025/26: Rates, Thresholds and What You Actually Pay",
    slug: "uk-national-insurance-rates-2025-26",
    excerpt:
      "Employee National Insurance is 8% between £12,570 and £50,270 and 2% above that. Here is how each class works, what employers pay, and how to check your record.",
    seoTitle: "National Insurance Rates 2025/26: 8% and 2% Explained",
    seoDescription:
      "UK National Insurance rates for 2025/26: employee Class 1 at 8% and 2%, employer contributions at 15%, Class 4 for the self-employed and State Pension qualifying years.",
    content: `National Insurance is the deduction people notice second and understand last. It looks like a tax, is collected like a tax, but is legally a contribution that buys you entitlement to the State Pension and some benefits. The rates and thresholds for 2025/26 are simple once you separate the classes.

## Employee National Insurance (Class 1)

If you are employed, you pay Class 1 contributions on your gross earnings:

- **0%** on earnings up to £12,570 a year (the primary threshold)
- **8%** on earnings from £12,570 to £50,270 (the upper earnings limit)
- **2%** on everything above £50,270

The 8% rate replaced 10% in April 2024 and has stayed there. Only the slice of income inside each band is charged, so someone on £30,000 pays 8% of £17,430, not 8% of £30,000.

Unlike income tax, National Insurance is calculated per pay period rather than cumulatively across the year. Two identical salaries can produce slightly different NI if one person is paid weekly and the other monthly, because the threshold is applied to each pay period.

## Employer National Insurance

Employers pay a separate 15% contribution on earnings above the secondary threshold of £5,000 a year. Since April 2025 the threshold dropped from £9,100 to £5,000, which pulled many part-time and lower-paid jobs into employer NI for the first time, and the Employment Allowance rose to £10,500.

Employer NI is not taken from your pay, but it does affect what an employer can offer. A £35,000 salary costs the business about £39,500 once employer NI and pension are included, which is why salary negotiations sometimes stall on the total cost rather than the headline figure.

## Self-Employed National Insurance

Sole traders and partners pay Class 4 contributions through Self Assessment:

- **6%** on profits between £12,570 and £50,270
- **2%** on profits above £50,270

Class 2 was abolished as a compulsory charge from April 2024. If your profits are below the Small Profits Threshold you can still pay Class 2 voluntarily to protect your State Pension record, at a small weekly rate set by HMRC each year.

## What National Insurance Buys You

Each tax year in which you pay or are credited with enough NI counts as a qualifying year. You currently need:

- **10 qualifying years** for any State Pension at all
- **35 qualifying years** for the full new State Pension

You can check your record and see gaps in your personal tax account. Paying voluntary contributions to fill a gap is sometimes excellent value and sometimes a waste of money, so check the record before paying. Gaps older than six years generally cannot be filled.

NI credits also count when you are not paying contributions: while claiming Child Benefit for a child under 12, while on Statutory Sick Pay, or while caring for someone. Those credits protect your record even when no money changes hands.

## Worked Examples

| Salary | Employee NI | Effective NI rate |
|--------|-------------|-------------------|
| £20,000 | £594.40 | 3.0% |
| £30,000 | £1,394.40 | 4.6% |
| £50,270 | £3,016.00 | 6.0% |
| £70,000 | £3,410.60 | 4.9% |
| £100,000 | £4,010.60 | 4.0% |

The effective rate rises up to the upper earnings limit and then falls, because everything above £50,270 is charged at 2%. That is why high earners often feel that a pay rise is worth more than they expected.

Check your own figure with the free [UK National Insurance Calculator](/tools/uk-national-insurance-calculator). It shows the 8% band, the 2% band and your net pay after NI.

## National Insurance vs Income Tax

The two deductions are calculated separately and have different thresholds, so a change in one does not move the other:

- Income tax starts at £12,570 through the personal allowance and is charged at 20%, 40% or 45%.
- National Insurance starts at £12,570 through the primary threshold and is charged at 8% or 2%.

They happen to share the lower threshold this year, which makes the numbers easy to confuse. Our [UK income tax guide](/blog/uk-income-tax-calculator-guide-2025-26) covers the tax bands, and the [payslip guide](/blog/uk-payslip-explained-2025-26) shows both deductions on a real monthly payslip.

## Scotland and Northern Ireland

National Insurance is a UK-wide system, so the rates and thresholds are identical in Scotland, Wales, England and Northern Ireland. Only income tax differs, because Scotland sets its own bands.

## Putting It Together

For a full picture of what a salary pays, run the numbers through the [UK Income Tax Calculator](/tools/uk-income-tax-calculator) and then the National Insurance calculator. The [take-home pay examples](/blog/uk-take-home-pay-examples-2025-26) show the combined result for £25,000 up to £100,000, and the [UK Tax Calculators hub](/tools/uk-tax-calculators) has every UK tool in one place.`,
    faqs: [
      {
        question: "What are the employee National Insurance rates for 2025/26?",
        answer:
          "Employees pay 8% on earnings between £12,570 and £50,270 a year, and 2% on earnings above £50,270. Earnings below £12,570 are not charged.",
      },
      {
        question: "How much National Insurance does an employer pay?",
        answer:
          "Employers pay 15% on employee earnings above the £5,000 secondary threshold. The Employment Allowance of up to £10,500 offsets this for many smaller employers.",
      },
      {
        question: "How many qualifying years do I need for a State Pension?",
        answer:
          "You need at least 10 qualifying years for any new State Pension and 35 for the full amount. Gaps can sometimes be filled with voluntary contributions, but check your record first.",
      },
      {
        question: "Is National Insurance different in Scotland?",
        answer:
          "No. National Insurance rates and thresholds are the same across the whole UK. Scotland only sets its own income tax bands.",
      },
    ],
  },
  {
    title: "UK Take-Home Pay 2025/26: What £25k, £35k, £50k and £70k Actually Pay",
    slug: "uk-take-home-pay-examples-2025-26",
    excerpt:
      "Real take-home pay for common UK salaries in 2025/26, including income tax, National Insurance and the marginal rate traps above £100,000.",
    seoTitle: "UK Take-Home Pay 2025/26: Salary After Tax Examples",
    seoDescription:
      "What £25,000, £35,000, £50,000 and £70,000 pay after income tax and National Insurance in 2025/26, with monthly net pay and effective tax rates.",
    content: `Job adverts quote gross salary. Your bank account sees net pay. The difference for a UK employee in 2025/26 runs from about 14% at £25,000 to more than 30% at £100,000, and it does not rise in a straight line.

The figures below assume England, Wales or Northern Ireland, no pension contributions, no student loan and the standard £12,570 personal allowance. Scotland has different income tax bands, so its net pay is lower at most salaries above £30,000.

## Take-Home Pay at a Glance

| Salary | Income tax | National Insurance | Annual net | Monthly net | Total deductions |
|--------|-----------|--------------------|------------|-------------|------------------|
| £25,000 | £2,486.00 | £994.40 | £21,519.60 | £1,793.30 | 13.9% |
| £30,000 | £3,486.00 | £1,394.40 | £25,119.60 | £2,093.30 | 16.3% |
| £35,000 | £4,486.00 | £1,794.40 | £28,719.60 | £2,393.30 | 17.9% |
| £40,000 | £5,486.00 | £2,194.40 | £32,319.60 | £2,693.30 | 19.2% |
| £50,000 | £7,486.00 | £2,994.40 | £39,519.60 | £3,293.30 | 21.0% |
| £60,000 | £11,432.00 | £3,210.60 | £45,357.40 | £3,779.78 | 24.4% |
| £70,000 | £15,432.00 | £3,410.60 | £51,157.40 | £4,263.12 | 26.9% |
| £100,000 | £27,432.00 | £4,010.60 | £68,557.40 | £5,713.12 | 31.4% |

Every pound of those figures is reproducible: taxable income is gross minus £12,570, income tax is 20% up to £37,700 of taxable income and 40% above it, National Insurance is 8% from £12,570 to £50,270 and 2% above.

## Why the Numbers Jump Between £50,000 and £60,000

At £50,000 you are still a basic-rate taxpayer: your taxable income of £37,430 sits just below the £37,700 basic-rate limit. Cross that line and every extra pound is taxed at 40%, and National Insurance drops to 2% at the same time.

The net effect on a pay rise in that zone is a marginal deduction of 42p in the pound: 40p income tax plus 2p National Insurance. A £10,000 rise from £50,000 to £60,000 adds about £5,838 to your annual take-home, not £10,000.

Below £50,270 the marginal deduction is 28p in the pound: 20% income tax plus 8% National Insurance. That is the cheapest band for earning extra money, which is why overtime and bonuses are worth more to basic-rate employees than to higher-rate ones.

## The £100,000 Trap

Above £100,000 the personal allowance starts to disappear. It falls by £1 for every £2 of income over £100,000, and it is gone completely at £125,140. In that range you pay 40% income tax on the income itself and effectively 40% on the allowance you are losing, plus 2% National Insurance.

That adds up to an effective marginal rate of **60%** on income between £100,000 and £125,140. A £10,000 pay rise in that band can leave you with about £4,000 after tax, and it can also reduce your entitlement to tax-free childcare and the 30 free hours for three and four year olds.

Two legitimate ways to soften it: pay more into a pension through salary sacrifice, which reduces the income counted for the taper, or spread income across tax years where the work allows.

## What Changes the Answer

The table is a clean baseline. Real payslips differ because of:

- **Pension contributions.** A 5% employee contribution costs £125 a month at £30,000 and reduces both income tax and National Insurance if taken by salary sacrifice.
- **Student loans.** Plan 2 takes 9% of income above £28,470, which is roughly £49 a month at £35,000.
- **Benefits in kind.** A company car or private medical insurance adds to taxable income and can change your tax code.
- **Marriage Allowance.** Worth up to £252 a year if you can transfer £1,260 of allowance to a spouse.
- **Scottish rates.** A Scottish taxpayer on £50,000 pays more income tax than the table shows, because the higher rate starts at £43,663.

Check your own salary with the free [UK Income Tax Calculator](/tools/uk-income-tax-calculator) and add the [National Insurance Calculator](/tools/uk-national-insurance-calculator) for the full deduction. If you need to see how the deductions appear month by month, the [UK payslip guide](/blog/uk-payslip-explained-2025-26) walks through each line.

## Hourly and Weekly Pay

Recruiters often quote hourly rates, and the conversion is not always obvious:

| Hourly rate | Weekly (37.5h) | Annual gross | Approximate annual net |
|-------------|----------------|--------------|------------------------|
| £11.44 | £429.00 | £22,308 | £19,581 |
| £12.21 | £457.88 | £23,809 | £20,662 |
| £15.00 | £562.50 | £29,250 | £24,580 |
| £20.00 | £750.00 | £39,000 | £31,600 |

The £11.44 and £12.21 figures are the National Living Wage rates for 2024/25 and 2025/26 for people aged 21 and over. Net figures assume no pension or student loan and a full year of work.

## Planning a Salary Change

If you are choosing between two offers, compare net pay rather than gross, and then add the things that are not taxed at all: employer pension contributions, a season ticket loan, and the value of flexible or remote working. A £2,000 gross difference at £40,000 is about £1,560 net a year, which a shorter commute can easily outweigh.

The [UK Tax Calculators hub](/tools/uk-tax-calculators) collects every UK calculator, and the [UK income tax guide](/blog/uk-income-tax-calculator-guide-2025-26) explains the allowance taper in more detail.`,
    faqs: [
      {
        question: "How much is £35,000 a year after tax in the UK?",
        answer:
          "On £35,000 in England, Wales or Northern Ireland for 2025/26, income tax is £4,486 and National Insurance is £1,794.40, leaving about £28,719.60 a year or £2,393.30 a month before pension and student loan.",
      },
      {
        question: "What salary is £3,000 a month after tax?",
        answer:
          "About £45,500 a year gives roughly £3,000 a month net in 2025/26, assuming the standard personal allowance and no pension or student loan deductions.",
      },
      {
        question: "Why do I lose 60% of income between £100,000 and £125,140?",
        answer:
          "The personal allowance is withdrawn at £1 for every £2 earned above £100,000. The lost allowance is taxed at 40%, which stacks on top of the 40% income tax and 2% National Insurance, so the effective marginal rate is about 60%.",
      },
      {
        question: "Is take-home pay lower in Scotland?",
        answer:
          "Usually yes above about £30,000. Scotland has a higher rate of 42% starting at £43,663 and an advanced rate of 45% from £75,001, while National Insurance is the same across the UK.",
      },
    ],
  },
  {
    title: "UK VAT Rates Explained: 20%, 5% and 0% with Worked Examples",
    slug: "uk-vat-rates-guide",
    excerpt:
      "Which UK purchases carry 20% VAT, which get 5%, and which are zero-rated or exempt. Includes the add and remove VAT formulas with worked examples.",
    seoTitle: "UK VAT Rates 2025: 20%, 5%, 0% and Exempt Explained",
    seoDescription:
      "A plain guide to UK VAT: the 20% standard rate, 5% reduced rate, zero-rated and exempt goods, the registration threshold and how to add or remove VAT.",
    content: `VAT is a tax on most goods and services sold in the UK, charged at each stage of a supply chain but ultimately paid by the final consumer. The rules are not a single rate: there are three rates plus a separate category of exempt supplies, and the difference costs real money on an invoice.

## The Three VAT Rates

| Rate | Applies to | Typical examples |
|------|-----------|------------------|
| Standard 20% | Most goods and services | Electronics, clothing for adults, professional services, restaurant meals |
| Reduced 5% | Specific goods and services | Domestic energy, children's car seats, some mobility aids, energy-saving materials |
| Zero 0% | Specific goods, still VATable | Most food, books, newspapers, children's clothing, public transport |

A zero-rated item is not the same as an exempt item. Zero-rated supplies are taxable at 0%, which means you still record them on a VAT return and can usually reclaim the VAT on your costs. Exempt supplies, such as insurance, most education, healthcare and financial services, sit outside the VAT system, and VAT on related costs is generally not recoverable.

That distinction matters for businesses. A bookshop selling zero-rated books can reclaim VAT on rent, shelves and electricity. A private school or an insurer cannot usually reclaim VAT on its costs, which is why VAT status shapes pricing in those sectors.

## How to Add VAT

To add 20% VAT to a net price, multiply by 1.2:

- Net £100 → VAT £20 → gross £120
- Net £250 → VAT £50 → gross £300
- Net £1,450 → VAT £290 → gross £1,740

At 5%, multiply by 1.05. A £200 net energy bill becomes £210 gross.

## How to Remove VAT

To strip VAT out of a gross price, divide by 1.2 instead of subtracting 20%:

- Gross £120 → net £100 → VAT £20
- Gross £300 → net £250 → VAT £50
- Gross £1,740 → net £1,450 → VAT £290

Subtracting 20% from a gross figure is the most common VAT mistake. £120 minus 20% is £96, not £100, because the 20% applies to the net amount, not the gross.

At 5%, divide by 1.05. The free [UK VAT Calculator](/tools/uk-vat-calculator) does both directions instantly, including custom rates, so you can check a receipt or build an invoice line without doing the arithmetic by hand.

## Who Has to Register for VAT

You must register if your taxable turnover goes over **£90,000** in any rolling 12-month period, or if you expect it to in the next 30 days. You can also register voluntarily below that threshold, which can be worth doing if you sell mostly zero-rated goods and want to reclaim input VAT, or if your customers are VAT-registered businesses that do not mind the extra 20%.

Once registered you charge VAT on your sales, file returns (usually quarterly) and pay the difference between output VAT collected and input VAT paid on purchases. You can deregister if turnover falls below **£88,000**.

## Special Schemes Worth Knowing

- **Flat Rate Scheme.** For businesses with turnover under £150,000, you charge 20% but pay a fixed percentage of gross turnover to HMRC, which simplifies record keeping. The percentages changed in 2017 and the scheme is less generous than it used to be for low-cost businesses.
- **Cash accounting.** Account for VAT when money actually moves rather than when you invoice, which helps cash flow if customers pay slowly.
- **Annual accounting.** One return a year with interim payments, useful for very small businesses.
- **Margin scheme.** For second-hand goods, antiques and some cars, VAT is charged on the margin rather than the full selling price.

## What a VAT Invoice Must Show

A valid VAT invoice needs the supplier's name, address and VAT number, a unique invoice number, the date, the customer's name and address, a description of the goods or services, the net amount, the VAT rate, the VAT amount and the total. Without those, a business customer cannot reclaim the VAT.

If you invoice clients, the free [invoice generator](/tools/invoice-generator) lays out those fields for you, and you can run the totals through the [UK VAT Calculator](/tools/uk-vat-calculator) before sending.

## Common Questions in Practice

**Is VAT charged on top of the advertised price?** For consumers, prices must be shown inclusive of VAT, so the shelf price is the price you pay. Business-to-business quotes are often shown net of VAT, with the VAT added on the invoice.

**Can I reclaim VAT on everything?** No. You can reclaim VAT on business purchases, but not on entertaining clients, and not on goods bought for private use. If something is used for both, you apportion the claim.

**Does digital work count?** Digital services sold to UK consumers are subject to VAT, and cross-border sales have their own place-of-supply rules. If you sell apps, courses or downloads, check whether you need to register.

**What about food?** Most food is zero-rated, but catering, hot takeaway food, alcohol, confectionery and soft drinks are standard-rated. That is why a supermarket sandwich is zero-rated and a hot one from the same shop is not.

## Where VAT Fits With Income Tax

VAT is collected on behalf of HMRC and is not your money, so it never appears in your profit. Income tax and National Insurance are charged on profit after VAT has been removed. If you are working out what you keep, the [UK Income Tax Calculator](/tools/uk-income-tax-calculator) and [National Insurance Calculator](/tools/uk-national-insurance-calculator) handle the personal side, while the [UK Tax Calculators hub](/tools/uk-tax-calculators) keeps all three tools together.`,
    faqs: [
      {
        question: "What is the standard VAT rate in the UK?",
        answer:
          "The standard VAT rate is 20%. A reduced rate of 5% applies to specific items such as domestic energy, children's car seats and some mobility aids, and a zero rate applies to most food, books and children's clothing.",
      },
      {
        question: "How do I remove VAT from a total?",
        answer:
          "Divide the gross amount by 1.2 for 20% VAT. For example, £120 gross becomes £100 net with £20 VAT. Do not subtract 20% from the gross figure, because that gives the wrong answer.",
      },
      {
        question: "When do I have to register for VAT?",
        answer:
          "You must register when your taxable turnover exceeds £90,000 in any rolling 12-month period, or if you expect it to in the next 30 days. Voluntary registration is allowed below that threshold.",
      },
      {
        question: "What is the difference between zero-rated and exempt?",
        answer:
          "Zero-rated supplies are taxable at 0%, so you report them and can usually reclaim VAT on your costs. Exempt supplies are outside the VAT system, and VAT on related costs is generally not recoverable.",
      },
    ],
  },
];

async function run() {
  for (const p of pillars) {
    const existing = await prisma.blogPost.findUnique({ where: { slug: p.slug } });
    const data = {
      title: p.title,
      seoTitle: p.seoTitle,
      seoDescription: p.seoDescription,
      excerpt: p.excerpt,
      content: p.content,
      author: AUTHOR,
      status: "PUBLISHED" as const,
      categoryId: GUIDES_CATEGORY,
    };
    let id: string;
    if (existing) {
      const updated = await prisma.blogPost.update({ where: { slug: p.slug }, data });
      id = updated.id;
    } else {
      const created = await prisma.blogPost.create({
        data: { ...data, slug: p.slug, publishedAt: new Date() },
      });
      id = created.id;
    }
    await prisma.fAQ.deleteMany({ where: { blogPostId: id } });
    await prisma.fAQ.createMany({
      data: p.faqs.map((f, i) => ({ question: f.question, answer: f.answer, blogPostId: id, order: i })),
    });
    console.log(
      `${existing ? "UPDATED" : "CREATED"}: ${p.slug} | words: ${p.content.split(/\s+/).length} | faqs: ${p.faqs.length}`
    );
  }
  const total = await prisma.blogPost.count({ where: { status: "PUBLISHED" } });
  console.log(`\nPUBLISHED total: ${total}`);
}

async function main() {
  for (let i = 0; i < 4; i++) {
    try {
      await run();
      break;
    } catch (e) {
      console.log("retry", i, (e as Error)?.message?.slice(0, 90));
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
