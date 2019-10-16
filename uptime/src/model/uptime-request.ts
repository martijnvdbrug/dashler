export interface UptimeRequest {
  id: string; // 1_01 (day of week_hour of day)
  statusCode: string;
  /**
   * Duration in MS
   */
  duration: number;
  errorMessage?: string;
}
