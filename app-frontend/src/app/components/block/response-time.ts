export interface ResponseTime {
  /**
   * 0 - 100ms
   */
  ms0_100: number;
  /**
   * 100ms - 500ms
   */
  ms100_500: number;
  /**
   * OVer 1 second
   */
  s1: number;
  /**
   * Error or timeout
   */
  error: number;
}
