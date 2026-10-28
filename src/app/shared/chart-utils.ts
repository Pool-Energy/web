/**
 * Shared ApexCharts tooltip date formatter, used across every chart in the
 * app (pool-stats, farmer, blocks, rewards, reward, partials) so the
 * "point in time" tooltip title looks the same everywhere, e.g.:
 *   "Tue Oct 27 2026 14:00:00 GMT+0000 (Coordinated Universal Time)"
 *
 * This is simply JS's native `Date.toString()` output: no custom pattern
 * to maintain, and it reads the user's local timezone like any other
 * native date/time display in the app.
 *
 * `value` is a numeric timestamp as used by ApexCharts' `xaxis.type:
 * 'datetime'`/`'numeric'` axes: milliseconds since epoch.
 */
export function formatChartTooltipDate(value: number): string {
  return new Date(value).toString();
}
