export interface UptimeCheck {
  /**
   * Timestamp in seconds
   */
  createdAt: number;
  statusCode: number;
  /**
   * Duration in MS
   */
  duration: number;
}
