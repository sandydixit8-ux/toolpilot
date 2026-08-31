import { lazy, type ComponentType } from "react";

type NamedExportModule = Record<string, ComponentType>;

function lazyNamed(
  path: () => Promise<NamedExportModule>,
  name: string
): () => Promise<{ default: ComponentType }> {
  return () => path().then((m) => ({ default: m[name] }));
}

const toolComponents: Record<string, () => Promise<{ default: ComponentType }>> = {
  "gst-calculator": lazyNamed(() => import("@/components/tools/calculators/gst-calculator"), "GstCalculatorTool"),
  "emi-calculator": lazyNamed(() => import("@/components/tools/calculators/emi-calculator"), "EmiCalculatorTool"),
  "salary-calculator": lazyNamed(() => import("@/components/tools/calculators/salary-calculator"), "SalaryCalculatorTool"),
  "income-tax-calculator": lazyNamed(() => import("@/components/tools/calculators/income-tax-calculator"), "IncomeTaxCalculatorTool"),
  "sip-calculator": lazyNamed(() => import("@/components/tools/calculators/sip-calculator"), "SipCalculatorTool"),
  "percentage-calculator": lazyNamed(() => import("@/components/tools/calculators/percentage-calculator"), "PercentageCalculatorTool"),
  "age-calculator": lazyNamed(() => import("@/components/tools/calculators/age-calculator"), "AgeCalculatorTool"),
  "discount-calculator": lazyNamed(() => import("@/components/tools/calculators/discount-calculator"), "DiscountCalculatorTool"),
  "compound-interest-calculator": lazyNamed(() => import("@/components/tools/calculators/compound-interest"), "CompoundInterestTool"),
  "simple-interest-calculator": lazyNamed(() => import("@/components/tools/calculators/simple-interest"), "SimpleInterestTool"),
  "gratuity-calculator": lazyNamed(() => import("@/components/tools/calculators/gratuity-calculator"), "GratuityCalculatorTool"),
  "epf-interest-calculator": lazyNamed(() => import("@/components/tools/calculators/epf-interest-calculator"), "EpfInterestCalculatorTool"),
  "bmi-calculator": lazyNamed(() => import("@/components/tools/calculators/bmi-calculator"), "BmiCalculatorTool"),
  "unit-converter": lazyNamed(() => import("@/components/tools/calculators/unit-converter"), "UnitConverterTool"),
  "time-calculator": lazyNamed(() => import("@/components/tools/calculators/time-calculator"), "TimeCalculatorTool"),
  "date-calculator": lazyNamed(() => import("@/components/tools/calculators/date-calculator"), "DateCalculatorTool"),
  "ai-text-humanizer": lazyNamed(() => import("@/components/tools/ai/ai-text-humanizer"), "AiTextHumanizerTool"),
  "ai-text-summarizer": lazyNamed(() => import("@/components/tools/ai/ai-text-summarizer"), "AiTextSummarizerTool"),
  "ai-paraphraser": lazyNamed(() => import("@/components/tools/ai/ai-paraphraser"), "AiParaphraserTool"),
  "ai-cover-letter-generator": lazyNamed(() => import("@/components/tools/ai/ai-cover-letter-generator"), "AiCoverLetterGeneratorTool"),
  "ai-resume-summary-generator": lazyNamed(() => import("@/components/tools/ai/ai-resume-summary-generator"), "AiResumeSummaryGeneratorTool"),
  "ai-email-generator": lazyNamed(() => import("@/components/tools/ai/ai-email-generator"), "AiEmailGeneratorTool"),
  "resume-builder": lazyNamed(() => import("@/components/tools/career/resume-builder"), "ResumeBuilderTool"),
  "resume-analyzer": lazyNamed(() => import("@/components/tools/career/resume-analyzer"), "ResumeAnalyzerTool"),
  "resume-ats-checker": lazyNamed(() => import("@/components/tools/career/resume-ats-checker"), "ResumeAtsCheckerTool"),
  "resume-jd-matcher": lazyNamed(() => import("@/components/tools/career/resume-jd-matcher"), "ResumeJdMatcherTool"),
  "cover-letter-generator": lazyNamed(() => import("@/components/tools/career/cover-letter-generator"), "CoverLetterGeneratorTool"),
  "salary-calculator-career": lazyNamed(() => import("@/components/tools/career/salary-calculator-career"), "SalaryCalculatorCareerTool"),
  "notice-period-calculator": lazyNamed(() => import("@/components/tools/career/notice-period-calculator"), "NoticePeriodCalculatorTool"),
  "experience-calculator": lazyNamed(() => import("@/components/tools/career/experience-calculator"), "ExperienceCalculatorTool"),
  "interview-question-generator": lazyNamed(() => import("@/components/tools/career/interview-question-generator"), "InterviewQuestionGeneratorTool"),
  "job-description-analyzer": lazyNamed(() => import("@/components/tools/career/job-description-analyzer"), "JobDescriptionAnalyzerTool"),
  "invoice-generator": lazyNamed(() => import("@/components/tools/business/invoice-generator"), "InvoiceGeneratorTool"),
  "quotation-generator": lazyNamed(() => import("@/components/tools/business/quotation-generator"), "QuotationGeneratorTool"),
  "gst-invoice-generator": lazyNamed(() => import("@/components/tools/business/gst-invoice-generator"), "GstInvoiceGeneratorTool"),
  "profit-margin-calculator": lazyNamed(() => import("@/components/tools/business/profit-margin-calculator"), "ProfitMarginCalculatorTool"),
  "markup-calculator": lazyNamed(() => import("@/components/tools/business/markup-calculator"), "MarkupCalculatorTool"),
  "break-even-calculator": lazyNamed(() => import("@/components/tools/business/break-even-calculator"), "BreakEvenCalculatorTool"),
  "project-cost-calculator": lazyNamed(() => import("@/components/tools/business/project-cost-calculator"), "ProjectCostCalculatorTool"),
  "construction-cost-calculator": lazyNamed(() => import("@/components/tools/business/construction-cost-calculator"), "ConstructionCostCalculatorTool"),
  "boq-calculator": lazyNamed(() => import("@/components/tools/business/boq-calculator"), "BoqCalculatorTool"),
  "roi-calculator": lazyNamed(() => import("@/components/tools/business/roi-calculator"), "RoiCalculatorTool"),
  "json-formatter": lazyNamed(() => import("@/components/tools/developer/json-formatter"), "JsonFormatterTool"),
  "json-validator": lazyNamed(() => import("@/components/tools/developer/json-formatter"), "JsonFormatterTool"),
  "json-minifier": lazyNamed(() => import("@/components/tools/developer/json-formatter"), "JsonFormatterTool"),
  "base64-encoder": lazyNamed(() => import("@/components/tools/developer/base64-tool"), "Base64Tool"),
  "base64-decoder": lazyNamed(() => import("@/components/tools/developer/base64-tool"), "Base64Tool"),
  "url-encoder": lazyNamed(() => import("@/components/tools/developer/url-encoder"), "UrlEncoderTool"),
  "url-decoder": lazyNamed(() => import("@/components/tools/developer/url-encoder"), "UrlEncoderTool"),
  "uuid-generator": lazyNamed(() => import("@/components/tools/developer/uuid-generator"), "UuidGeneratorTool"),
  "timestamp-converter": lazyNamed(() => import("@/components/tools/developer/timestamp-converter"), "TimestampConverterTool"),
  "regex-tester": lazyNamed(() => import("@/components/tools/developer/regex-tester"), "RegexTesterTool"),
  "word-counter": lazyNamed(() => import("@/components/tools/developer/word-counter"), "WordCounterTool"),
  "lorem-ipsum-generator": lazyNamed(() => import("@/components/tools/developer/lorem-generator"), "LoremGeneratorTool"),
  "pdf-to-word": lazyNamed(() => import("@/components/tools/pdf/pdf-to-word"), "PdfToWordTool"),
  "word-to-pdf": lazyNamed(() => import("@/components/tools/pdf/word-to-pdf"), "WordToPdfTool"),
  "jpg-to-pdf": lazyNamed(() => import("@/components/tools/pdf/jpg-to-pdf"), "JpgToPdfTool"),
  "pdf-to-jpg": lazyNamed(() => import("@/components/tools/pdf/pdf-to-jpg"), "PdfToJpgTool"),
  "pdf-compressor": lazyNamed(() => import("@/components/tools/pdf/pdf-compressor"), "PdfCompressorTool"),
  "pdf-merger": lazyNamed(() => import("@/components/tools/pdf/pdf-merger"), "PdfMergerTool"),
  "pdf-splitter": lazyNamed(() => import("@/components/tools/pdf/pdf-splitter"), "PdfSplitterTool"),
  "pdf-page-extractor": lazyNamed(() => import("@/components/tools/pdf/pdf-page-extractor"), "PdfPageExtractorTool"),
  "pdf-rotator": lazyNamed(() => import("@/components/tools/pdf/pdf-rotator"), "PdfRotatorTool"),
  "pdf-page-counter": lazyNamed(() => import("@/components/tools/pdf/pdf-page-counter"), "PdfPageCounterTool"),
  "pdf-to-excel": lazyNamed(() => import("@/components/tools/pdf/pdf-to-excel"), "PdfToExcelTool"),
  "image-compressor": lazyNamed(() => import("@/components/tools/image/image-compressor"), "ImageCompressor"),
  "image-resizer": lazyNamed(() => import("@/components/tools/image/image-resizer"), "ImageResizer"),
  "jpg-to-png": lazyNamed(() => import("@/components/tools/image/jpg-to-png"), "JpgToPng"),
  "png-to-jpg": lazyNamed(() => import("@/components/tools/image/png-to-jpg"), "PngToJpg"),
  "webp-converter": lazyNamed(() => import("@/components/tools/image/webp-converter"), "WebpConverter"),
  "image-cropper": lazyNamed(() => import("@/components/tools/image/image-cropper"), "ImageCropper"),
  "image-rotator": lazyNamed(() => import("@/components/tools/image/image-rotator"), "ImageRotator"),
  "image-quality-optimizer": lazyNamed(() => import("@/components/tools/image/image-quality-optimizer"), "ImageQualityOptimizer"),
};

const lazyCache: Record<string, ComponentType> = {};

export function getToolComponent(slug: string): ComponentType | null {
  const loader = toolComponents[slug];
  if (!loader) return null;
  if (!lazyCache[slug]) {
    lazyCache[slug] = lazy(loader);
  }
  return lazyCache[slug];
}
