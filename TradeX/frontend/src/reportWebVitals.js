/**
 * ============================================================================
 * Web Vitals Performance Profiler (reportWebVitals.js)
 * ============================================================================
 * Purpose:
 *   Measures real-world user performance metrics (Core Web Vitals):
 *     - CLS  : Cumulative Layout Shift
 *     - FID  : First Input Delay
 *     - FCP  : First Contentful Paint
 *     - LCP  : Largest Contentful Paint
 *     - TTFB : Time to First Byte
 * ============================================================================
 */

const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import("web-vitals").then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
