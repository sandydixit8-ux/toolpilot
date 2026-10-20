export interface Bracket {
  rate: number;
  upTo: number;
}

export interface BandRow {
  rate: number;
  taxableInBand: number;
  tax: number;
}

export function applyBrackets(taxableIncome: number, brackets: Bracket[]): { total: number; rows: BandRow[] } {
  const taxable = Math.max(0, taxableIncome);
  const rows: BandRow[] = [];
  let lower = 0;
  let total = 0;

  for (const bracket of brackets) {
    const width = Math.max(0, Math.min(taxable, bracket.upTo) - lower);
    const tax = width * bracket.rate;
    rows.push({ rate: bracket.rate, taxableInBand: width, tax });
    total += tax;
    lower = bracket.upTo;
    if (taxable <= bracket.upTo) break;
  }

  return { total, rows };
}

/* -------------------------------------------------------------------------- */
/* United States                                                              */
/* -------------------------------------------------------------------------- */

export type UsFiling = "single" | "married";

export const US_BRACKETS_2025: Record<UsFiling, Bracket[]> = {
  single: [
    { rate: 0.1, upTo: 11925 },
    { rate: 0.12, upTo: 48475 },
    { rate: 0.22, upTo: 103350 },
    { rate: 0.24, upTo: 197300 },
    { rate: 0.32, upTo: 250525 },
    { rate: 0.35, upTo: 626350 },
    { rate: 0.37, upTo: Infinity },
  ],
  married: [
    { rate: 0.1, upTo: 23850 },
    { rate: 0.12, upTo: 96950 },
    { rate: 0.22, upTo: 206700 },
    { rate: 0.24, upTo: 394600 },
    { rate: 0.32, upTo: 501050 },
    { rate: 0.35, upTo: 751600 },
    { rate: 0.37, upTo: Infinity },
  ],
};

export const US_STANDARD_DEDUCTION_2025: Record<UsFiling, number> = {
  single: 15000,
  married: 30000,
};

export function usFederalTax(grossIncome: number, standardDeduction: number, brackets: Bracket[]) {
  const taxable = Math.max(0, grossIncome - Math.max(0, standardDeduction));
  const { total, rows } = applyBrackets(taxable, brackets);
  const effectiveRate = grossIncome > 0 ? total / grossIncome : 0;
  const marginalRate = rows.length ? rows[rows.length - 1].rate : 0;
  return { taxable, tax: total, rows, effectiveRate, marginalRate };
}

export interface UsSelfEmploymentOptions {
  netEarningsFactor: number;
  socialSecurityRate: number;
  socialSecurityWageBase: number;
  medicareRate: number;
  additionalMedicareRate: number;
  additionalMedicareThreshold: number;
}

export const US_SE_2025: UsSelfEmploymentOptions = {
  netEarningsFactor: 0.9235,
  socialSecurityRate: 0.124,
  socialSecurityWageBase: 176100,
  medicareRate: 0.029,
  additionalMedicareRate: 0.009,
  additionalMedicareThreshold: 200000,
};

export function usSelfEmploymentTax(netProfit: number, o: UsSelfEmploymentOptions) {
  const base = Math.max(0, netProfit) * o.netEarningsFactor;
  const socialSecurity = Math.min(base, o.socialSecurityWageBase) * o.socialSecurityRate;
  const medicare = base * o.medicareRate;
  const additionalMedicare = Math.max(0, base - o.additionalMedicareThreshold) * o.additionalMedicareRate;
  const total = socialSecurity + medicare + additionalMedicare;
  return {
    base,
    socialSecurity,
    medicare,
    additionalMedicare,
    total,
    deduction: total / 2,
    effectiveRate: netProfit > 0 ? total / netProfit : 0,
  };
}

export interface UsPayrollOptions {
  standardDeduction: number;
  brackets: Bracket[];
  socialSecurityRate: number;
  socialSecurityWageBase: number;
  medicareRate: number;
  additionalMedicareRate: number;
  additionalMedicareThreshold: number;
  stateRate: number;
}

export const US_PAYROLL_2025: Omit<UsPayrollOptions, "standardDeduction" | "brackets"> = {
  socialSecurityRate: 0.062,
  socialSecurityWageBase: 176100,
  medicareRate: 0.0145,
  additionalMedicareRate: 0.009,
  additionalMedicareThreshold: 200000,
  stateRate: 0,
};

export function usPaycheck(annualGross: number, periodsPerYear: number, o: UsPayrollOptions) {
  const gross = Math.max(0, annualGross);
  const federal = usFederalTax(gross, o.standardDeduction, o.brackets);
  const socialSecurity = Math.min(gross, o.socialSecurityWageBase) * o.socialSecurityRate;
  const medicare = gross * o.medicareRate;
  const additionalMedicare = Math.max(0, gross - o.additionalMedicareThreshold) * o.additionalMedicareRate;
  const state = gross * o.stateRate;
  const totalTax = federal.tax + socialSecurity + medicare + additionalMedicare + state;
  const netAnnual = gross - totalTax;
  const periods = periodsPerYear > 0 ? periodsPerYear : 1;
  return {
    taxable: federal.taxable,
    federal: federal.tax,
    socialSecurity,
    medicare,
    additionalMedicare,
    state,
    totalTax,
    netAnnual,
    grossPerPeriod: gross / periods,
    netPerPeriod: netAnnual / periods,
  };
}

/* -------------------------------------------------------------------------- */
/* United Kingdom                                                             */
/* -------------------------------------------------------------------------- */

export interface UkIncomeTaxOptions {
  personalAllowance: number;
  basicRate: number;
  higherRate: number;
  additionalRate: number;
  basicUpper: number;
  higherUpper: number;
  taperStart: number;
}

export const UK_INCOME_TAX_2025: UkIncomeTaxOptions = {
  personalAllowance: 12570,
  basicRate: 0.2,
  higherRate: 0.4,
  additionalRate: 0.45,
  basicUpper: 37700,
  higherUpper: 125140,
  taperStart: 100000,
};

export function ukIncomeTax(grossIncome: number, o: UkIncomeTaxOptions) {
  const taper = grossIncome > o.taperStart ? (grossIncome - o.taperStart) / 2 : 0;
  const personalAllowance = Math.max(0, o.personalAllowance - taper);
  const taxable = Math.max(0, grossIncome - personalAllowance);
  const brackets: Bracket[] = [
    { rate: o.basicRate, upTo: o.basicUpper },
    { rate: o.higherRate, upTo: o.higherUpper },
    { rate: o.additionalRate, upTo: Infinity },
  ];
  const { total, rows } = applyBrackets(taxable, brackets);
  const effectiveRate = grossIncome > 0 ? total / grossIncome : 0;
  const marginalRate = rows.length ? rows[rows.length - 1].rate : 0;
  return { personalAllowance, taxable, tax: total, rows, effectiveRate, marginalRate };
}

export interface UkNiOptions {
  primaryThreshold: number;
  upperEarningsLimit: number;
  mainRate: number;
  upperRate: number;
}

export const UK_EMPLOYEE_NI_2025: UkNiOptions = {
  primaryThreshold: 12570,
  upperEarningsLimit: 50270,
  mainRate: 0.08,
  upperRate: 0.02,
};

export function ukEmployeeNi(income: number, o: UkNiOptions) {
  const gross = Math.max(0, income);
  const main = Math.max(0, Math.min(gross, o.upperEarningsLimit) - o.primaryThreshold) * o.mainRate;
  const upper = Math.max(0, gross - o.upperEarningsLimit) * o.upperRate;
  return { main, upper, total: main + upper };
}

export function ukVat(amount: number, rate: number, mode: "add" | "remove") {
  const value = Math.max(0, amount);
  if (mode === "add") {
    const vat = value * rate;
    return { net: value, vat, gross: value + vat };
  }
  const net = value / (1 + rate);
  return { net, vat: value - net, gross: value };
}
