declare module "google-trends-api" {
  interface RelatedQueriesOptions {
    keyword: string | string[];
    geo?: string;
    hl?: string;
    timezone?: number;
    category?: number;
    startTime?: Date;
    endTime?: Date;
    granularTimeResolution?: boolean;
  }

  interface GoogleTrends {
    relatedQueries(options: RelatedQueriesOptions): Promise<string>;
    interestOverTime(options: RelatedQueriesOptions): Promise<string>;
    interestByRegion(options: RelatedQueriesOptions): Promise<string>;
    dailyTrends(options?: { geo?: string; hl?: string }): Promise<string>;
    realTimeTrends(options?: { geo?: string; hl?: string }): Promise<string>;
  }

  const googleTrends: GoogleTrends;
  export default googleTrends;
}
