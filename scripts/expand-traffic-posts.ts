import { PrismaClient } from "@prisma/client";

/**
 * Depth pass 1: the thin posts that already receive organic traffic.
 *
 * AdSense rejected the site for "low value content". Deindexing thin pages
 * (src/lib/indexing.ts) only stops the bleeding; the pages people actually
 * land on have to be worth reading. Each post below is rewritten with
 * worked numbers, edge cases and the mistakes readers make, and is long
 * enough to cross the 600-word indexing threshold on its own merit.
 *
 * Inline FAQ markdown is removed from post bodies; FAQs live in the FAQ
 * table so they render once, with schema.
 */
const prisma = new PrismaClient();

const SELF_EMPLOYMENT = `If you are self-employed, a freelancer, or a 1099 contractor, you pay Social Security and Medicare yourself, and the rate is roughly double what a regular employee pays. This is self-employment tax, and it surprises almost everyone in their first profitable year.

The short version: 15.3% of 92.35% of your net profit, plus an extra 0.9% Medicare surcharge once net earnings pass $200,000. Half of what you pay is deductible against your income tax. The rest of this guide shows the arithmetic, the caps, and the mistakes that cost people money.

## Why Self-Employment Tax Is 15.3%

Employees split payroll tax with an employer. The employee pays 6.2% for Social Security and 1.45% for Medicare, and the employer matches both. When you work for yourself you occupy both chairs:

- Social Security: 12.4%
- Medicare: 2.9%
- Combined: 15.3%

That is not a penalty invented for freelancers. It is simply the full cost of the same benefits, paid by one person instead of two.

## The 92.35% Rule

You do not pay self-employment tax on every dollar of profit. The IRS treats 7.65% of your net earnings as the employer's share and excludes it from the calculation, so only 92.35% of net profit is taxed.

Net profit of $80,000 becomes 80,000 x 0.9235 = $73,880 of taxable self-employment income. Multiply by 15.3% and the tax is about $11,304.

That 7.65% is not a discount you have to claim. It is built into the formula, which is why you should never multiply your profit by 15.3% directly. Doing so overstates the bill by roughly $550 on $80,000 of profit.

## Working Examples at Different Profit Levels

| Net profit | Amount subject to SE tax (92.35%) | SE tax | Deductible half |
| --- | --- | --- | --- |
| $30,000 | $27,705 | $4,239 | $2,119 |
| $60,000 | $55,410 | $8,478 | $4,239 |
| $100,000 | $92,350 | $14,130 | $7,065 |
| $200,000 | $184,700 | $27,193 | $13,596 |
| $250,000 | $230,875 | $28,982 | $14,491 |

Two things to notice in that table. First, the tax is not linear at the top: the Social Security cap flattens the curve. Second, the deductible half is roughly 7.65% of your profit, and it is easy to forget when you estimate your total tax bill.

## The Social Security Wage Base

The 12.4% Social Security portion applies only up to an annual wage base. For 2025 that base is $176,100. Profit above it is free of the Social Security half, but the 2.9% Medicare portion continues with no upper limit.

This is why the $200,000 and $250,000 rows above are so close. Once you pass the base, each extra dollar of profit costs 2.9% plus the 0.9% surcharge, not 15.3%.

## The Extra 0.9% Medicare Tax

An additional 0.9% Medicare tax applies to self-employment earnings above $200,000 for a single filer, $250,000 for a married couple filing jointly, and $125,000 for married filing separately. It is charged on your net earnings, not on the 92.35% figure.

Employees hit the same surcharge through withholding, but the thresholds are based on wages. If you have a day job and freelance on the side, the two are combined when your return is filed, which is why a side business can push you over the line earlier than expected.

## You Can Deduct Half of It

Half of your self-employment tax is an adjustment to income, not an itemized deduction. That means it reduces your adjusted gross income before the standard deduction is applied, so it lowers your income tax as well.

On $80,000 of profit the self-employment tax is about $11,304 and the deduction is $5,652. At a 22% marginal rate that deduction saves roughly $1,243 of income tax. The real cost of self-employment tax is therefore lower than the headline figure.

Two rules people get wrong. You cannot deduct the half you already excluded through the 92.35% rule, and you cannot deduct self-employment tax as a business expense on Schedule C. The deduction belongs on Schedule 1 of your return.

## Self-Employment Tax vs Income Tax

These are separate taxes and you generally owe both.

- Self-employment tax funds Social Security and Medicare. It is calculated on Schedule SE from your net profit.
- Income tax is calculated on your taxable income after the standard or itemized deduction and the half-SE-tax adjustment.

A freelancer with $80,000 of net profit pays about $11,304 of self-employment tax, then income tax on roughly $74,348 of adjusted income. Using the 2025 single brackets that is about $9,666 of federal income tax. The combined bill lands near $21,000, an effective rate of about 26% before state tax.

That combined view is the number to budget for. Run the [Self-Employment Tax Calculator](/tools/us-self-employment-tax-calculator) for the payroll half, then the [US Income Tax Calculator](/tools/us-income-tax-calculator) for the income tax half.

## Quarterly Payments Are Not Optional

Nobody withholds tax for you, so the IRS expects estimated payments four times a year using Form 1040-ES. For the 2025 tax year the deadlines fall in April, June, September and January.

Miss them and you owe an underpayment penalty, calculated as interest on the shortfall. The safe approach is to pay roughly a quarter of last year's total tax each quarter, or 90% of this year's liability, whichever is smaller.

If your income is uneven, the annualized income installment method lets you pay less in quarters where you earned less. It requires more paperwork, so many freelancers simply overpay slightly and take the refund.

## How to Legally Lower the Bill

Self-employment tax is calculated on net profit, so every legitimate business expense reduces both the tax and the income tax at the same time.

- Claim ordinary and necessary expenses: software, hardware, home office, internet, professional fees, mileage.
- Use a solo 401(k) or SEP IRA. Contributions reduce income tax, and an employer contribution also reduces net earnings for the SE tax calculation.
- Deduct self-employed health insurance premiums, which is an above-the-line deduction.
- Track a home office with the simplified method if it qualifies.
- Consider an S-corp election once profit is consistently high. A reasonable salary is subject to payroll tax and the remainder is distributed, which can cut the 15.3% substantially. It adds payroll, filings and state fees, so run the numbers before switching.

None of these involve hiding income. They are the same deductions an employer takes, applied to your own business.

## Common Mistakes

- Multiplying profit by 15.3% instead of 92.35% of profit.
- Forgetting the Social Security wage base and assuming the tax grows forever at 15.3%.
- Ignoring the 0.9% surcharge on a side business stacked on top of a salary.
- Deducting expenses twice, once on Schedule C and again as an adjustment.
- Skipping quarterly payments and then facing a penalty in April.
- Assuming an LLC removes self-employment tax. A single-member LLC is taxed the same way by default.

## All US Tax Tools in One Place

The [US Tax Calculators hub](/tools/us-tax-calculators) collects the income tax, self-employment tax and paycheck calculators so you can see the whole picture in one place. If you want the amount that actually lands in your bank account, start with the [US Paycheck Calculator](/tools/us-paycheck-calculator).`;

const US_INCOME_TAX = `US federal income tax is progressive: your income is cut into slices and each slice is taxed at its own rate. You never pay your top rate on all of your income, only on the part that reaches the highest band. Once that clicks, every tax headline becomes easier to read.

This guide walks through the 2025 brackets, the standard deduction, the difference between marginal and effective rate, and three worked examples you can check against the free calculator.

## The 2025 Federal Tax Brackets

For the 2025 tax year the seven federal rates are 10%, 12%, 22%, 24%, 32%, 35% and 37%. The rate is the same for everyone; the income ranges depend on filing status.

| Rate | Single (taxable income) | Married filing jointly |
|------|-------------------------|------------------------|
| 10% | Up to $11,925 | Up to $23,850 |
| 12% | $11,926 - $48,475 | $23,851 - $96,950 |
| 22% | $48,476 - $103,350 | $96,951 - $206,700 |
| 24% | $103,351 - $197,300 | $206,701 - $394,600 |
| 32% | $197,301 - $250,525 | $394,601 - $501,050 |
| 35% | $250,526 - $626,350 | $501,051 - $751,600 |
| 37% | Over $626,350 | Over $751,600 |

These ranges apply to taxable income, which is gross income minus deductions. They are not applied to your salary.

## The Standard Deduction Comes First

Before any bracket applies, you subtract a deduction. Most people take the standard deduction, which for 2025 is:

| Filing status | Standard deduction |
| --- | --- |
| Single | $15,000 |
| Married filing jointly | $30,000 |
| Married filing separately | $15,000 |
| Head of household | $22,500 |

Earn $70,000 as a single filer and the first $15,000 is shielded, leaving $55,000 of taxable income. Only that $55,000 is fed to the brackets.

Itemizing is worth it only when mortgage interest, state and local taxes, charitable gifts and medical expenses together beat the standard amount. Since the state and local tax deduction is capped, most wage earners still take the standard deduction.

## Worked Examples

Single filer, $55,000 gross. Taxable income is $40,000. The first $11,925 is taxed at 10% ($1,192.50) and the remaining $28,075 at 12% ($3,369). Total federal income tax is $4,561.50, an effective rate of 8.3% on gross income while the marginal rate is 12%.

Single filer, $100,000 gross. Taxable income is $85,000. Tax is $1,192.50 plus $4,386 in the 12% band plus 22% of $36,525 ($8,035.50), giving $13,614. Effective rate 13.6%, marginal rate 22%.

Single filer, $200,000 gross. Taxable income is $185,000. Adding the 24% band on $81,650 ($19,596) brings the total to $37,247. Effective rate 18.6%, marginal rate 24%.

Notice how far the effective rate sits below the marginal rate in every case. That gap is the most misunderstood part of the US system.

## Marginal vs Effective Rate

Your marginal rate is the tax on your last dollar, which is your top bracket. Your effective rate is total federal tax divided by gross income.

Someone in the 24% bracket might still pay only 18% overall. That matters whenever you evaluate a raise, a bonus, or overtime: the extra money is taxed at the marginal rate, not at your effective rate, but it never pushes your earlier income into a higher bracket.

A common myth says a raise can leave you with less take-home pay. It cannot happen with these brackets, because only the dollars above each threshold get the higher rate.

## Deductions vs Credits

A deduction reduces taxable income, so its value depends on your marginal rate. A $1,000 deduction saves $240 for someone in the 24% bracket and $120 for someone in the 12% bracket.

A credit reduces tax directly, dollar for dollar. A $1,000 credit saves $1,000 for everyone. This is why credits such as the Child Tax Credit and the Earned Income Tax Credit are worth checking before you assume your bill is final.

## What This Calculator Does Not Include

This tool estimates federal income tax only. It does not include:

- State income tax, which varies from zero in nine states to more than 13% at the top in a few others
- FICA payroll taxes, which are 7.65% for most employees
- Credits such as the Child Tax Credit or Earned Income Tax Credit
- Self-employment tax, which replaces the employee half of FICA for freelancers

If you are self-employed, your Social Security and Medicare tax is higher. Use the [Self-Employment Tax Calculator](/tools/us-self-employment-tax-calculator) for that portion. To see actual take-home pay after all deductions, use the [US Paycheck Calculator](/tools/us-paycheck-calculator).

## Estimate Your Own Tax

Doing this by hand is slow, so use the free [US Income Tax Calculator](/tools/us-income-tax-calculator). Enter your gross income, pick your filing status, and it applies the 2025 brackets and standard deduction instantly. It shows:

- Taxable income after the standard deduction
- Total federal income tax
- Your effective rate and marginal rate
- A band-by-band breakdown of how much tax each slice of income attracts

Every bracket and threshold is editable, so you can model a raise, a bonus, or a different deduction and watch the tax change in real time.

## Common Mistakes

- Entering gross salary as taxable income and skipping the standard deduction.
- Assuming the top bracket applies to all income.
- Confusing a deduction with a credit.
- Forgetting state tax and FICA when budgeting take-home pay.
- Using last year's brackets after a raise or a job change.

## See All US Tax Tools

The [US Tax Calculators hub](/tools/us-tax-calculators) groups all three together: income tax, self-employment tax, and take-home pay. Start there if you are not sure which one you need.`;

const UK_INCOME_TAX = `UK income tax is progressive, with a tax-free personal allowance followed by three main rates. Here is how it works for the 2025/26 tax year in England, Wales and Northern Ireland, with worked examples at four salary levels.

## The Personal Allowance

Everyone gets a personal allowance of £12,570, which is free of income tax. You only pay tax on earnings above that amount.

The allowance tapers for higher earners. It drops by £1 for every £2 earned above £100,000, and it disappears completely at £125,140. Between those two figures the effective marginal rate on the next pound is 60%, which is higher than the 45% additional rate paid by people earning far more.

## The 2025/26 Tax Bands

| Band | Taxable income | Rate |
|------|----------------|------|
| Basic rate | Up to £37,700 | 20% |
| Higher rate | £37,701 to £125,140 | 40% |
| Additional rate | Over £125,140 | 45% |

The thresholds apply to taxable income, which is gross income minus the personal allowance.

## Worked Examples

Earn £30,000. Taxable income is £17,430, all of it in the basic band, so income tax is £3,486. National Insurance adds £1,394.40, leaving about £25,120 before pension contributions and student loan repayments.

Earn £55,000. Taxable income is £42,430. The first £37,700 is taxed at 20% (£7,540) and the remaining £4,730 at 40% (£1,892), for £9,432 of income tax. NI adds £3,110.60.

Earn £110,000. The allowance has already started to shrink: it falls by £5,000 to £7,570. Taxable income is £102,430, so tax is £7,540 in the basic band plus 40% of £64,730 (£25,892), totalling £33,432. That is an effective rate of just over 30% on gross pay.

Earn £130,000. The allowance is gone, so taxable income equals gross pay. Tax is £7,540 plus 40% of £87,440 (£34,976) plus 45% of £4,860 (£2,187), giving £44,703.

## The 60% Zone Explained

Between £100,000 and £125,140 each extra £1 of salary costs 40% income tax plus the loss of 50p of allowance. That lost allowance would itself have been taxed at 40%, so the real marginal cost is 40% plus 20%, or 60%.

Practical consequences:

- A £10,000 pay rise inside that band leaves about £4,000 after income tax.
- Paying into a pension can be unusually efficient there, because contributions restore part of the allowance.
- Salary sacrifice and bonus timing are worth discussing with an employer if you sit in this range.

## What About National Insurance?

Income tax and National Insurance are separate systems that happen to hit the same payslip. As an employee you pay 8% National Insurance on earnings between £12,570 and £50,270, then 2% on everything above that.

NI has no personal allowance taper and no 60% zone, so the combined marginal rate in the taper band is 68% once you add the 8% NI that still applies under £50,270. Estimate it with the [UK National Insurance Calculator](/tools/uk-national-insurance-calculator).

## Marriage Allowance and Other Reliefs

If you earn under the personal allowance and your partner is a basic rate taxpayer, you can transfer £1,260 of allowance through Marriage Allowance, saving up to £252 a year. It is a small amount that many eligible couples never claim.

Gift Aid donations and pension contributions extend your basic rate band, which means higher rate taxpayers get relief at 40% rather than 20% on the amount donated or contributed.

## Scotland Is Different

Scotland has its own income tax bands and rates, including a starter rate and an intermediate rate, and the higher and top rates differ from the rest of the UK. This guide and the calculator use the rates for England, Wales and Northern Ireland. If you live in Scotland, use the Scottish rates published by Revenue Scotland and gov.scot.

## Estimate Your UK Income Tax

Use the free [UK Income Tax Calculator](/tools/uk-income-tax-calculator). Enter your annual salary and it applies the personal allowance, the taper and the bands to show:

- Your taxable income
- Total income tax
- Your effective and marginal rate
- A band-by-band breakdown of tax per slice of income

## Common Mistakes

- Treating £12,570 as tax-free income rather than a tax-free allowance, then forgetting it disappears above £125,140.
- Applying 40% to the whole salary once you cross the higher rate threshold.
- Assuming NI and income tax are the same calculation.
- Using Scottish rates on a rest-of-UK payslip, or the reverse.
- Ignoring student loan repayments, which are collected like tax but calculated separately.

## All UK Tax Tools in One Place

The [UK Tax Calculators hub](/tools/uk-tax-calculators) collects the income tax, National Insurance and VAT calculators together so you can work out your full position. If you are invoicing, use the [UK VAT Calculator](/tools/uk-vat-calculator) to add or remove VAT at 20%.

## Related UK Guides

- [UK take-home pay examples](/blog/uk-take-home-pay-examples-2025-26) for net pay at salaries from £25,000 to £100,000
- [National Insurance rates 2025/26](/blog/uk-national-insurance-rates-2025-26) for the 8% and 2% bands and employer contributions
- [UK payslip explained](/blog/uk-payslip-explained-2025-26) for every deduction line on a monthly payslip
- [UK VAT rates](/blog/uk-vat-rates-guide) if you invoice clients and need the 20%, 5% and 0% rules`;

const NOTICE_PERIOD = `When you resign, your notice period decides your last working day, your handover window, and often your final settlement. Getting the dates wrong can delay your next job or your full-and-final pay.

Notice periods are usually written into your contract, commonly 30, 60 or 90 days, and the counting method matters as much as the number.

## How Notice Period Is Counted

The usual rule is that notice starts the day after you submit your resignation and runs for the number of days stated in your contract. Some employers count calendar days; others count only working days and skip weekends and public holidays.

Three variables change the answer:

- When the clock starts, on the resignation day or the next day
- Whether weekends and public holidays count
- Whether the period is measured in days, weeks or months

Confirm all three with HR in writing before you calculate anything. A one day discrepancy at the start can move your last working day by more than a week when public holidays fall in the middle.

## How to Calculate Your Last Working Day

1. Open the free [Notice Period Calculator](/tools/notice-period-calculator).
2. Enter your resignation date and notice period.
3. Choose calendar or working days.
4. Read your exact last working day.

For a plain date difference between two known dates, the [Date Calculator](/tools/date-calculator) works too.

## Worked Example

Suppose you resign on Friday 6 March with 60 calendar days of notice, and the count starts the following day. Sixty calendar days later lands on Tuesday 5 May. If your employer counts working days instead, 60 working days is 12 full weeks, which pushes the date past the start of June, and bank holidays in April and May move it later still.

The gap between those two answers is roughly four weeks. That is why the counting method in your contract is the single most important line to read.

## Statutory Minimums by Country

Contracts can be more generous than the law but never less.

In the UK, the statutory minimum notice an employer must give grows with service: one week after one month, one week per year of service up to 12 years, then 12 weeks. Employees must give at least one week once they have been employed for a month, unless the contract says more. Many UK contracts set one to three months for professional roles.

In India, notice is governed by the contract and state Shops and Establishments rules. Thirty days is common, 60 to 90 days is standard for senior roles, and probation periods often carry a shorter notice of 15 days or none at all.

In the US, most employment is at will and there is no legal notice requirement in either direction, but two weeks is the professional norm and a longer period may be contractual.

## Negotiate or Buy Out Notice

Options to shorten your notice:

- **Buy-out:** pay the employer the salary for the unserved days, if the contract allows it
- **Negotiation:** agree an earlier release, common once a handover is complete
- **Leave adjustment:** offset unused leave against the notice period
- **Garden leave:** you stay employed and paid but stop attending work, often used in sales and finance roles

Payment in lieu of notice, or PILON, means the employer ends your employment immediately and pays the notice instead. Check whether your contract includes a PILON clause, because without one the employer may owe full contractual notice.

## What About Your Final Pay?

Your full-and-final settlement usually includes:

- Salary for days worked in the final month
- Pay for unserved notice, if the contract requires it
- Encashment of unused leave
- Any bonus, commission or reimbursements due
- Deductions for loans, advances or equipment not returned

Estimate the salary side with the [Salary Calculator](/tools/salary-calculator-career) so you know what to expect, and check the figure against your last payslip before you sign anything.

## Common Mistakes

- Counting the resignation day as day one when the contract says otherwise.
- Mixing working days and calendar days partway through the calculation.
- Forgetting public holidays in the notice window.
- Resigning during a probation period without checking the shorter notice clause.
- Assuming unused holiday is paid automatically; some contracts require it to be taken before the last day.

## Calculate Your Total Experience

When switching jobs, recruiters ask for your total experience. Add up your tenure across roles with the [Experience Calculator](/tools/experience-calculator), which handles overlapping jobs and month-level gaps.

Know your dates before you resign. Find your exact last working day with the free [Notice Period Calculator](/tools/notice-period-calculator).`;

const UPDATES = [
  {
    slug: "self-employment-tax-calculator-guide-2025",
    content: SELF_EMPLOYMENT,
    title: "Self-Employment Tax 2025: How Much Freelancers Owe and How to Calculate It",
    seoTitle: "Self-Employment Tax 2025: Rate, Calculation & Free Calculator",
    seoDescription:
      "Learn how self-employment tax works in 2025. The 15.3% rate, the 92.35% rule, the Social Security wage base, worked examples and the deductible half.",
    excerpt:
      "Freelancers pay both halves of Social Security and Medicare. See why self-employment tax is 15.3%, how the 92.35% rule works, and what you actually owe at $30k to $250k.",
    faqs: [
      {
        question: "Why is self-employment tax 15.3%?",
        answer:
          "Employees split Social Security (12.4%) and Medicare (2.9%) with their employer. Self-employed people pay both halves, so the combined rate is 15.3% on the taxable portion of their profit.",
      },
      {
        question: "Why is only 92.35% of my profit taxed?",
        answer:
          "The IRS treats 7.65% of your net earnings as equivalent to the employer's share, so it is not subject to self-employment tax. Only the remaining 92.35% is taxed.",
      },
      {
        question: "Is self-employment tax the same as income tax?",
        answer:
          "No. Self-employment tax funds Social Security and Medicare, while income tax is calculated separately on your taxable income. You generally owe both.",
      },
      {
        question: "Can I deduct part of my self-employment tax?",
        answer:
          "Yes. You can deduct half of your self-employment tax as an adjustment to income on your return, which reduces your taxable income and your income tax.",
      },
      {
        question: "Do I owe self-employment tax on a side business if I also have a salary?",
        answer:
          "Yes. Profit from a side business is subject to self-employment tax even when you already pay payroll tax through a job. The Social Security wage base and the 0.9% Medicare surcharge apply to your combined earnings.",
      },
      {
        question: "Does an LLC avoid self-employment tax?",
        answer:
          "Not by itself. A single-member LLC is disregarded for federal tax purposes and its owner still pays self-employment tax on net profit. Only an S-corp election, with a reasonable salary, can reduce the payroll-tax portion.",
      },
    ],
  },
  {
    slug: "us-income-tax-calculator-guide-2025",
    content: US_INCOME_TAX,
    title: "US Income Tax Calculator 2025: Brackets, Rates and How to Estimate Your Tax",
    seoTitle: "US Income Tax Calculator 2025: Brackets, Rates & Free Estimator",
    seoDescription:
      "Free US income tax calculator for 2025. See the federal tax brackets, standard deduction by filing status, worked examples, and effective vs marginal rate.",
    excerpt:
      "Estimate your 2025 US federal income tax in seconds. The 2025 brackets, the standard deduction by filing status, three worked examples, and the mistakes to avoid.",
    faqs: [
      {
        question: "What tax year does the US income tax calculator use?",
        answer:
          "It uses the 2025 federal tax brackets and the 2025 standard deduction of $15,000 for single filers, $30,000 for married filing jointly and $22,500 for head of household. Every figure is editable so you can model another year.",
      },
      {
        question: "What is the difference between marginal and effective tax rate?",
        answer:
          "Your marginal rate is the tax on your last dollar of income, which is your top bracket. Your effective rate is your total federal tax divided by your gross income, and it is always lower because only income above each threshold is taxed at the higher rate.",
      },
      {
        question: "Does this include state tax or FICA?",
        answer:
          "No. It estimates federal income tax only. State income tax and payroll taxes like Social Security and Medicare are separate. Use the paycheck calculator for a take-home figure.",
      },
      {
        question: "Are the 2025 tax brackets the same for everyone?",
        answer:
          "The rates are the same, but the income ranges depend on your filing status. Single and married filing jointly have different thresholds, so always choose the correct status.",
      },
      {
        question: "Does a raise ever reduce my take-home pay?",
        answer:
          "No, not under these brackets. Only the income above each threshold is taxed at the higher rate, so an increase in gross pay always increases after-tax pay, even when it moves you into a higher bracket.",
      },
      {
        question: "What is the difference between a tax deduction and a tax credit?",
        answer:
          "A deduction reduces taxable income, so it saves tax at your marginal rate. A credit reduces the tax itself, dollar for dollar, which makes credits more valuable at any income level.",
      },
    ],
  },
  {
    slug: "uk-income-tax-calculator-guide-2025-26",
    content: UK_INCOME_TAX,
    title: "UK Income Tax 2025/26: Personal Allowance, Bands and Take-Home Pay Explained",
    seoTitle: "UK Income Tax 2025/26: Personal Allowance, Bands & Free Calculator",
    seoDescription:
      "Understand UK income tax for 2025/26. The personal allowance, the 20%, 40% and 45% bands, the £100,000 taper, the 60% zone and worked examples.",
    excerpt:
      "How UK income tax works in 2025/26: the personal allowance, the 20/40/45% bands, the £100,000 taper and 60% zone, plus worked examples at £30k to £130k.",
    faqs: [
      {
        question: "What is the personal allowance for 2025/26?",
        answer:
          "The standard UK personal allowance is £12,570, so you pay no income tax on income up to that amount. It reduces by £1 for every £2 earned above £100,000 and disappears at £125,140.",
      },
      {
        question: "What are the UK income tax bands for 2025/26?",
        answer:
          "For England, Wales and Northern Ireland the basic rate is 20% on taxable income up to £37,700, the higher rate is 40% up to £125,140, and the additional rate is 45% above that.",
      },
      {
        question: "Does this include National Insurance?",
        answer:
          "No. Income tax and National Insurance are separate. Use the National Insurance calculator to add your employee contribution of 8% between £12,570 and £50,270 and 2% above that.",
      },
      {
        question: "Does UK income tax work the same in Scotland?",
        answer:
          "No. Scotland has different income tax bands and rates, including a starter rate and an intermediate rate. This guide uses the rates for England, Wales and Northern Ireland.",
      },
      {
        question: "Why is the effective tax rate 60% between £100,000 and £125,140?",
        answer:
          "In that range every extra £1 is taxed at 40% and also removes 50p of personal allowance, which would have been taxed at 40%. That adds 20% to the marginal rate, giving 60% before National Insurance.",
      },
    ],
  },
  {
    slug: "notice-period-calculator-last-working-day",
    content: NOTICE_PERIOD,
    title: "Notice Period Calculator: How to Find Your Last Working Day",
    seoTitle: "Notice Period Calculator: Find Your Last Working Day Free",
    seoDescription:
      "Calculate your notice period and last working day for free. How notice is counted, statutory minimums in the UK, India and the US, buy-out and final pay.",
    excerpt:
      "Resigning? Learn how your notice period is counted, how to find your exact last working day, statutory minimums by country, and how final pay is worked out.",
    faqs: [
      {
        question: "How do I calculate my last working day?",
        answer:
          "Count forward from the day you resign by your contractual notice period. If notice is 30 days, the last working day is 30 calendar days later, adjusting for weekends and public holidays if your contract says working days.",
      },
      {
        question: "Does the resignation day count in the notice period?",
        answer:
          "Usually not. Most contracts start the notice period the day after you submit your resignation, so confirm the wording before you calculate the end date.",
      },
      {
        question: "Can an employer shorten or extend a notice period?",
        answer:
          "Notice terms are set by the contract and local employment law. An employer may pay you in lieu of notice, but both sides need to agree to any change to the stated period.",
      },
      {
        question: "Does notice period include weekends and public holidays?",
        answer:
          "It depends on the contract. Many employers count calendar days, which includes weekends and holidays, while others count only working days. A 60-day notice can differ by about four weeks between the two methods.",
      },
      {
        question: "What is payment in lieu of notice?",
        answer:
          "Payment in lieu of notice, or PILON, means the employer ends your employment immediately and pays you for the notice period instead. It is only available if your contract includes a PILON clause or both sides agree.",
      },
      {
        question: "Can I resign during my probation period?",
        answer:
          "Yes, but probation clauses usually set a shorter notice period, often 15 days or less. Check the probation section of your contract before you resign.",
      },
    ],
  },
] as const;

async function main() {
  for (const update of UPDATES) {
    const post = await prisma.blogPost.findUnique({ where: { slug: update.slug } });
    if (!post) {
      console.warn(`skip (missing): ${update.slug}`);
      continue;
    }
    const words = update.content.split(/\s+/).filter(Boolean).length;
    await prisma.blogPost.update({
      where: { slug: update.slug },
      data: {
        title: update.title,
        seoTitle: update.seoTitle,
        seoDescription: update.seoDescription,
        excerpt: update.excerpt,
        content: update.content,
        faqs: {
          deleteMany: {},
          create: update.faqs.map((f, i) => ({ ...f, order: i })),
        },
      },
    });
    console.log(`updated ${update.slug} (${words} words, ${update.faqs.length} faqs)`);
  }
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
