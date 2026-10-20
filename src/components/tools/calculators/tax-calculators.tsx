"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  US_BRACKETS_2025,
  US_PAYROLL_2025,
  US_SE_2025,
  US_STANDARD_DEDUCTION_2025,
  UK_EMPLOYEE_NI_2025,
  UK_INCOME_TAX_2025,
  ukEmployeeNi,
  ukIncomeTax,
  ukVat,
  usFederalTax,
  usPaycheck,
  usSelfEmploymentTax,
  type Bracket,
  type UsFiling,
} from "@/lib/tax/calculators";

const selectCls =
  "flex h-10 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const fmtUsd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const fmtUsd2 = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtGbp = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });
const fmtGbp2 = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 2, maximumFractionDigits: 2 });

function usd(value: number, decimals = 0) {
  return (decimals ? fmtUsd2 : fmtUsd).format(Number.isFinite(value) ? value : 0);
}

function gbp(value: number, decimals = 0) {
  return (decimals ? fmtGbp2 : fmtGbp).format(Number.isFinite(value) ? value : 0);
}

function num(value: string): number {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function trimNum(value: number): string {
  return String(Math.round(value * 100) / 100);
}

function pct(rate: number): string {
  return `${(Number.isFinite(rate) ? rate * 100 : 0).toFixed(1)}%`;
}

type BandState = { rate: string; upTo: string };

function toBandState(brackets: Bracket[]): BandState[] {
  return brackets.map((bracket, index) => ({
    rate: trimNum(bracket.rate * 100),
    upTo: index === brackets.length - 1 ? "" : trimNum(bracket.upTo),
  }));
}

function fromBandState(bands: BandState[]): Bracket[] {
  return bands.map((band, index) => ({
    rate: num(band.rate) / 100,
    upTo: index === bands.length - 1 ? Infinity : num(band.upTo),
  }));
}

function Field({
  label,
  value,
  onChange,
  prefix,
  suffix,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">{prefix}</span>
        )}
        <Input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(prefix && "pl-7", suffix && "pr-8")}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">{suffix}</span>
        )}
      </div>
    </label>
  );
}

function ResultPanel({
  title,
  highlight,
  rows,
}: {
  title: string;
  highlight: { label: string; value: string };
  rows: { label: string; value: string; strong?: boolean }[];
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
      <div className="mb-5 rounded-lg bg-brand-50 px-4 py-4 dark:bg-brand-950">
        <p className="text-xs font-medium text-brand-700 dark:text-brand-300">{highlight.label}</p>
        <p className="mt-1 text-3xl font-bold tabular-nums text-brand-700 dark:text-brand-200">{highlight.value}</p>
      </div>
      <dl className="space-y-2.5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4 text-sm">
            <dt className="text-muted-foreground">{row.label}</dt>
            <dd className={cn("tabular-nums text-foreground", row.strong && "font-semibold")}>
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Breakdown({ rows, currency }: { rows: { label: string; value: number }[]; currency: "USD" | "GBP" }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Breakdown by band</p>
      <dl className="space-y-2">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4 text-sm">
            <dt className="text-muted-foreground">{row.label}</dt>
            <dd className="tabular-nums text-foreground">
              {currency === "USD" ? usd(row.value) : gbp(row.value)}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Disclaimer({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200">
      {children}
    </p>
  );
}

function BandsEditor({
  bands,
  onChange,
  currency,
}: {
  bands: BandState[];
  onChange: (bands: BandState[]) => void;
  currency: "USD" | "GBP";
}) {
  function update(index: number, patch: Partial<BandState>) {
    onChange(bands.map((band, i) => (i === index ? { ...band, ...patch } : band)));
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-3 py-2 text-left">Rate</th>
            <th className="px-3 py-2 text-left">Taxable income up to</th>
          </tr>
        </thead>
        <tbody>
          {bands.map((band, index) => {
            const last = index === bands.length - 1;
            return (
              <tr key={index} className="border-t border-border">
                <td className="px-3 py-2">
                  <div className="flex items-center gap-1.5">
                    <Input
                      type="number"
                      inputMode="decimal"
                      className="h-8 w-20"
                      value={band.rate}
                      onChange={(e) => update(index, { rate: e.target.value })}
                    />
                    <span className="text-gray-400">%</span>
                  </div>
                </td>
                <td className="px-3 py-2">
                  {last ? (
                    <span className="text-sm text-muted-foreground">and above</span>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-400">{currency === "USD" ? "$" : "\u00a3"}</span>
                      <Input
                        type="number"
                        inputMode="decimal"
                        className="h-8 w-full max-w-[10rem]"
                        value={band.upTo}
                        onChange={(e) => update(index, { upTo: e.target.value })}
                      />
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* US Income Tax                                                              */
/* -------------------------------------------------------------------------- */

export function UsIncomeTaxCalculatorTool() {
  const [filing, setFiling] = useState<UsFiling>("single");
  const [income, setIncome] = useState("85000");
  const [deduction, setDeduction] = useState(String(US_STANDARD_DEDUCTION_2025.single));
  const [bands, setBands] = useState<BandState[]>(() => toBandState(US_BRACKETS_2025.single));

  function changeFiling(next: UsFiling) {
    setFiling(next);
    setDeduction(String(US_STANDARD_DEDUCTION_2025[next]));
    setBands(toBandState(US_BRACKETS_2025[next]));
  }

  const result = useMemo(
    () => usFederalTax(num(income), num(deduction), fromBandState(bands)),
    [income, deduction, bands]
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Annual gross income" prefix="$" value={income} onChange={setIncome} />
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Filing status</span>
            <select className={selectCls} value={filing} onChange={(e) => changeFiling(e.target.value as UsFiling)}>
              <option value="single">Single</option>
              <option value="married">Married filing jointly</option>
            </select>
          </label>
        </div>
        <Field label="Standard deduction" prefix="$" value={deduction} onChange={setDeduction} />
        <div>
          <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Federal tax brackets (editable)</p>
          <BandsEditor bands={bands} onChange={setBands} currency="USD" />
        </div>
      </div>

      <div className="space-y-4">
        <ResultPanel
          title="Estimated federal income tax"
          highlight={{ label: "Federal income tax", value: usd(result.tax) }}
          rows={[
            { label: "Taxable income", value: usd(result.taxable) },
            { label: "Effective rate", value: pct(result.effectiveRate) },
            { label: "Marginal rate", value: pct(result.marginalRate) },
            { label: "Net after federal tax", value: usd(Math.max(0, num(income) - result.tax)) },
          ]}
        />
        <Breakdown
          currency="USD"
          rows={result.rows.map((row) => ({
            label: `${pct(row.rate)} on ${usd(row.taxableInBand)}`,
            value: row.tax,
          }))}
        />
        <Disclaimer>
          Estimates use 2025 US federal rates and the standard deduction. State tax, credits, other income and filing
          nuances are not included. Confirm with the IRS or a tax professional.
        </Disclaimer>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* US Self-Employment Tax                                                     */
/* -------------------------------------------------------------------------- */

export function UsSelfEmploymentTaxCalculatorTool() {
  const [netProfit, setNetProfit] = useState("80000");
  const [opts, setOpts] = useState({
    netEarningsFactor: trimNum(US_SE_2025.netEarningsFactor * 100),
    socialSecurityRate: trimNum(US_SE_2025.socialSecurityRate * 100),
    socialSecurityWageBase: String(US_SE_2025.socialSecurityWageBase),
    medicareRate: trimNum(US_SE_2025.medicareRate * 100),
    additionalMedicareRate: trimNum(US_SE_2025.additionalMedicareRate * 100),
    additionalMedicareThreshold: String(US_SE_2025.additionalMedicareThreshold),
  });

  const result = useMemo(
    () =>
      usSelfEmploymentTax(num(netProfit), {
        netEarningsFactor: num(opts.netEarningsFactor) / 100,
        socialSecurityRate: num(opts.socialSecurityRate) / 100,
        socialSecurityWageBase: num(opts.socialSecurityWageBase),
        medicareRate: num(opts.medicareRate) / 100,
        additionalMedicareRate: num(opts.additionalMedicareRate) / 100,
        additionalMedicareThreshold: num(opts.additionalMedicareThreshold),
      }),
    [netProfit, opts]
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <Field label="Net self-employment profit" prefix="$" value={netProfit} onChange={setNetProfit} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Taxable share of profit" suffix="%" value={opts.netEarningsFactor} onChange={(v) => setOpts((p) => ({ ...p, netEarningsFactor: v }))} />
          <Field label="Social Security rate" suffix="%" value={opts.socialSecurityRate} onChange={(v) => setOpts((p) => ({ ...p, socialSecurityRate: v }))} />
          <Field label="Social Security wage base" prefix="$" value={opts.socialSecurityWageBase} onChange={(v) => setOpts((p) => ({ ...p, socialSecurityWageBase: v }))} />
          <Field label="Medicare rate" suffix="%" value={opts.medicareRate} onChange={(v) => setOpts((p) => ({ ...p, medicareRate: v }))} />
          <Field label="Additional Medicare rate" suffix="%" value={opts.additionalMedicareRate} onChange={(v) => setOpts((p) => ({ ...p, additionalMedicareRate: v }))} />
          <Field label="Additional Medicare over" prefix="$" value={opts.additionalMedicareThreshold} onChange={(v) => setOpts((p) => ({ ...p, additionalMedicareThreshold: v }))} />
        </div>
        <Disclaimer>
          Estimates use 2025 self-employment tax rules: about 92.35% of net profit is taxed at 15.3% (Social Security
          12.4% up to the wage base plus Medicare 2.9%), with an extra 0.9% Medicare over $200,000. Income tax is separate.
        </Disclaimer>
      </div>

      <div className="space-y-4">
        <ResultPanel
          title="Estimated self-employment tax"
          highlight={{ label: "Self-employment tax", value: usd(result.total) }}
          rows={[
            { label: "Taxable earnings (92.35%)", value: usd(result.base) },
            { label: "Social Security 12.4%", value: usd(result.socialSecurity) },
            { label: "Medicare 2.9%", value: usd(result.medicare) },
            { label: "Additional Medicare 0.9%", value: usd(result.additionalMedicare) },
            { label: "Deductible half", value: usd(result.deduction) },
            { label: "Effective rate", value: pct(result.effectiveRate) },
          ]}
        />
        <Disclaimer>
          The deductible half of your self-employment tax can be claimed as an adjustment to income on your return.
        </Disclaimer>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* US Paycheck                                                                */
/* -------------------------------------------------------------------------- */

export function UsPaycheckCalculatorTool() {
  const [salary, setSalary] = useState("75000");
  const [frequency, setFrequency] = useState("26");
  const [filing, setFiling] = useState<UsFiling>("single");
  const [stateRate, setStateRate] = useState("0");
  const [deduction, setDeduction] = useState(String(US_STANDARD_DEDUCTION_2025.single));
  const [bands, setBands] = useState<BandState[]>(() => toBandState(US_BRACKETS_2025.single));

  function changeFiling(next: UsFiling) {
    setFiling(next);
    setDeduction(String(US_STANDARD_DEDUCTION_2025[next]));
    setBands(toBandState(US_BRACKETS_2025[next]));
  }

  const periods = num(frequency) || 1;
  const result = useMemo(
    () =>
      usPaycheck(num(salary), periods, {
        ...US_PAYROLL_2025,
        standardDeduction: num(deduction),
        brackets: fromBandState(bands),
        stateRate: num(stateRate) / 100,
      }),
    [salary, periods, deduction, bands, stateRate]
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Annual gross salary" prefix="$" value={salary} onChange={setSalary} />
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Pay frequency</span>
            <select className={selectCls} value={frequency} onChange={(e) => setFrequency(e.target.value)}>
              <option value="52">Weekly</option>
              <option value="26">Bi-weekly (every 2 weeks)</option>
              <option value="24">Semi-monthly (twice a month)</option>
              <option value="12">Monthly</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Filing status</span>
            <select className={selectCls} value={filing} onChange={(e) => changeFiling(e.target.value as UsFiling)}>
              <option value="single">Single</option>
              <option value="married">Married filing jointly</option>
            </select>
          </label>
          <Field label="State income tax rate" suffix="%" value={stateRate} onChange={setStateRate} />
        </div>
        <Field label="Standard deduction" prefix="$" value={deduction} onChange={setDeduction} />
        <Disclaimer>
          Estimates use 2025 federal rates, FICA (6.2% Social Security up to the wage base plus 1.45% Medicare, plus an
          extra 0.9% Medicare over $200,000) and your chosen state rate. Local tax, pre-tax deductions, 401(k) and other
          withholding nuances are not included.
        </Disclaimer>
      </div>

      <div className="space-y-4">
        <ResultPanel
          title="Take-home pay"
          highlight={{ label: "Net pay per period", value: usd(result.netPerPeriod, 2) }}
          rows={[
            { label: "Gross pay per period", value: usd(result.grossPerPeriod, 2) },
            { label: "Federal income tax (per year)", value: usd(result.federal) },
            { label: "Social Security (per year)", value: usd(result.socialSecurity) },
            { label: "Medicare (per year)", value: usd(result.medicare) },
            { label: "State income tax (per year)", value: usd(result.state) },
            { label: "Total tax (per year)", value: usd(result.totalTax), strong: true },
            { label: "Net pay (per year)", value: usd(result.netAnnual) },
          ]}
        />
        <Disclaimer>
          Take-home pay is an estimate for planning only. Your employer&apos;s withholding may differ based on your
          W-4, pre-tax benefits and local taxes.
        </Disclaimer>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* UK Income Tax                                                              */
/* -------------------------------------------------------------------------- */

export function UkIncomeTaxCalculatorTool() {
  const [income, setIncome] = useState("45000");
  const [opts, setOpts] = useState({
    personalAllowance: String(UK_INCOME_TAX_2025.personalAllowance),
    taperStart: String(UK_INCOME_TAX_2025.taperStart),
    basicRate: trimNum(UK_INCOME_TAX_2025.basicRate * 100),
    higherRate: trimNum(UK_INCOME_TAX_2025.higherRate * 100),
    additionalRate: trimNum(UK_INCOME_TAX_2025.additionalRate * 100),
    basicUpper: String(UK_INCOME_TAX_2025.basicUpper),
    higherUpper: String(UK_INCOME_TAX_2025.higherUpper),
  });

  const result = useMemo(
    () =>
      ukIncomeTax(num(income), {
        personalAllowance: num(opts.personalAllowance),
        taperStart: num(opts.taperStart),
        basicRate: num(opts.basicRate) / 100,
        higherRate: num(opts.higherRate) / 100,
        additionalRate: num(opts.additionalRate) / 100,
        basicUpper: num(opts.basicUpper),
        higherUpper: num(opts.higherUpper),
      }),
    [income, opts]
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <Field label="Annual gross income" prefix="£" value={income} onChange={setIncome} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Personal allowance" prefix="£" value={opts.personalAllowance} onChange={(v) => setOpts((p) => ({ ...p, personalAllowance: v }))} />
          <Field label="Allowance taper starts at" prefix="£" value={opts.taperStart} onChange={(v) => setOpts((p) => ({ ...p, taperStart: v }))} />
          <Field label="Basic rate" suffix="%" value={opts.basicRate} onChange={(v) => setOpts((p) => ({ ...p, basicRate: v }))} />
          <Field label="Basic band up to (taxable)" prefix="£" value={opts.basicUpper} onChange={(v) => setOpts((p) => ({ ...p, basicUpper: v }))} />
          <Field label="Higher rate" suffix="%" value={opts.higherRate} onChange={(v) => setOpts((p) => ({ ...p, higherRate: v }))} />
          <Field label="Higher band up to (taxable)" prefix="£" value={opts.higherUpper} onChange={(v) => setOpts((p) => ({ ...p, higherUpper: v }))} />
          <Field label="Additional rate" suffix="%" value={opts.additionalRate} onChange={(v) => setOpts((p) => ({ ...p, additionalRate: v }))} />
        </div>
        <Disclaimer>
          Estimates use 2025/26 England, Wales &amp; Northern Ireland rates. The personal allowance tapers by £1 for
          every £2 of income above the taper threshold. Scotland has different bands. Confirm with HMRC or an accountant.
        </Disclaimer>
      </div>

      <div className="space-y-4">
        <ResultPanel
          title="Estimated income tax"
          highlight={{ label: "Income tax", value: gbp(result.tax) }}
          rows={[
            { label: "Personal allowance applied", value: gbp(result.personalAllowance) },
            { label: "Taxable income", value: gbp(result.taxable) },
            { label: "Effective rate", value: pct(result.effectiveRate) },
            { label: "Marginal rate", value: pct(result.marginalRate) },
            { label: "Net after income tax", value: gbp(Math.max(0, num(income) - result.tax)) },
          ]}
        />
        <Breakdown
          currency="GBP"
          rows={result.rows.map((row) => ({
            label: `${pct(row.rate)} on ${gbp(row.taxableInBand)}`,
            value: row.tax,
          }))}
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* UK National Insurance                                                      */
/* -------------------------------------------------------------------------- */

export function UkNationalInsuranceCalculatorTool() {
  const [income, setIncome] = useState("45000");
  const [opts, setOpts] = useState({
    primaryThreshold: String(UK_EMPLOYEE_NI_2025.primaryThreshold),
    upperEarningsLimit: String(UK_EMPLOYEE_NI_2025.upperEarningsLimit),
    mainRate: trimNum(UK_EMPLOYEE_NI_2025.mainRate * 100),
    upperRate: trimNum(UK_EMPLOYEE_NI_2025.upperRate * 100),
  });

  const result = useMemo(
    () =>
      ukEmployeeNi(num(income), {
        primaryThreshold: num(opts.primaryThreshold),
        upperEarningsLimit: num(opts.upperEarningsLimit),
        mainRate: num(opts.mainRate) / 100,
        upperRate: num(opts.upperRate) / 100,
      }),
    [income, opts]
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <Field label="Annual gross income" prefix="£" value={income} onChange={setIncome} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Primary threshold" prefix="£" value={opts.primaryThreshold} onChange={(v) => setOpts((p) => ({ ...p, primaryThreshold: v }))} />
          <Field label="Upper earnings limit" prefix="£" value={opts.upperEarningsLimit} onChange={(v) => setOpts((p) => ({ ...p, upperEarningsLimit: v }))} />
          <Field label="Main rate" suffix="%" value={opts.mainRate} onChange={(v) => setOpts((p) => ({ ...p, mainRate: v }))} />
          <Field label="Rate above upper limit" suffix="%" value={opts.upperRate} onChange={(v) => setOpts((p) => ({ ...p, upperRate: v }))} />
        </div>
        <Disclaimer>
          Estimates employee (Class 1) National Insurance for 2025/26 in England, Wales &amp; Northern Ireland. Employer
          NI, salary sacrifice and the Scottish Income Tax differentiator are not included. Confirm with HMRC.
        </Disclaimer>
      </div>

      <div className="space-y-4">
        <ResultPanel
          title="Estimated National Insurance"
          highlight={{ label: "Employee NI", value: gbp(result.total) }}
          rows={[
            { label: "Main rate portion", value: gbp(result.main) },
            { label: "Above upper limit", value: gbp(result.upper) },
            { label: "Effective rate", value: pct(num(income) > 0 ? result.total / num(income) : 0) },
            { label: "Net pay after NI", value: gbp(Math.max(0, num(income) - result.total)) },
          ]}
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* UK VAT                                                                     */
/* -------------------------------------------------------------------------- */

export function UkVatCalculatorTool() {
  const [amount, setAmount] = useState("1000");
  const [rate, setRate] = useState("20");
  const [mode, setMode] = useState<"add" | "remove">("add");

  const result = useMemo(() => ukVat(num(amount), num(rate) / 100, mode), [amount, rate, mode]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setMode("add")}
            className={cn(
              "rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
              mode === "add" ? "bg-brand-600 text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            Add VAT
          </button>
          <button
            type="button"
            onClick={() => setMode("remove")}
            className={cn(
              "rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
              mode === "remove" ? "bg-brand-600 text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            Remove VAT
          </button>
        </div>

        <Field label={mode === "add" ? "Amount (excl. VAT)" : "Amount (incl. VAT)"} prefix="£" value={amount} onChange={setAmount} />

        <div>
          <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">VAT rate (%)</span>
          <div className="grid grid-cols-3 gap-2">
            {["20", "5", "0"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRate(r)}
                className={cn(
                  "rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                  rate === r ? "bg-brand-600 text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {r}%
              </button>
            ))}
          </div>
        </div>

        <Field label="Custom VAT rate" suffix="%" value={rate} onChange={setRate} />

        <Disclaimer>
          Uses the UK standard VAT rate of 20% by default, with reduced (5%) and zero-rated (0%) options. Confirm the
          correct rate for your goods or services with HMRC.
        </Disclaimer>
      </div>

      <div className="space-y-4">
        <ResultPanel
          title="VAT calculation"
          highlight={{ label: "VAT amount", value: gbp(result.vat, 2) }}
          rows={[
            { label: "Net amount (excl. VAT)", value: gbp(result.net, 2) },
            { label: "Gross amount (incl. VAT)", value: gbp(result.gross, 2) },
          ]}
        />
        <Disclaimer>
          Results are estimates for planning. Always keep proper VAT records and confirm rates and rules with HMRC or an
          accountant.
        </Disclaimer>
      </div>
    </div>
  );
}
