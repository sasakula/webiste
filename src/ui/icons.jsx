// Tiny inline SVG icon set for the dashboard. Avoids extra dependencies.
const defaultProps = {
  width: 14,
  height: 14,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export const PlayIcon = (p) => (
  <svg {...defaultProps} {...p}><polygon points="6 4 20 12 6 20 6 4" fill="currentColor" stroke="none" /></svg>
);
export const PauseIcon = (p) => (
  <svg {...defaultProps} {...p}><rect x="6" y="5" width="4" height="14" fill="currentColor" stroke="none"/><rect x="14" y="5" width="4" height="14" fill="currentColor" stroke="none"/></svg>
);
export const FastIcon = (p) => (
  <svg {...defaultProps} {...p}><polygon points="4 4 13 12 4 20" fill="currentColor" stroke="none"/><polygon points="13 4 22 12 13 20" fill="currentColor" stroke="none"/></svg>
);
export const SunIcon = (p) => (
  <svg {...defaultProps} {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/></svg>
);
export const MoonIcon = (p) => (
  <svg {...defaultProps} {...p}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/></svg>
);
export const HeartIcon = (p) => (
  <svg {...defaultProps} {...p}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
);
export const BoltIcon = (p) => (
  <svg {...defaultProps} {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" stroke="none"/></svg>
);
export const CoinIcon = (p) => (
  <svg {...defaultProps} {...p}><circle cx="12" cy="12" r="9"/><path d="M9 9h4a2 2 0 0 1 0 4H9v4"/><path d="M9 9v8"/></svg>
);
export const FoodIcon = (p) => (
  <svg {...defaultProps} {...p}><path d="M3 11h18l-2 9H5z"/><path d="M5 11V8a3 3 0 0 1 3-3h0M11 11V6a3 3 0 0 1 3-3h0M17 11V8"/></svg>
);
export const PeopleIcon = (p) => (
  <svg {...defaultProps} {...p}><circle cx="9" cy="8" r="3"/><path d="M3 20v-1a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v1"/><circle cx="17" cy="8" r="3"/><path d="M15 14h2a4 4 0 0 1 4 4v2"/></svg>
);
export const ShieldIcon = (p) => (
  <svg {...defaultProps} {...p}><path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z"/></svg>
);
export const RadioIcon = (p) => (
  <svg {...defaultProps} {...p}><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49M7.76 16.24a6 6 0 0 1 0-8.49M19.07 4.93a10 10 0 0 1 0 14.14M4.93 19.07a10 10 0 0 1 0-14.14"/></svg>
);
export const TargetIcon = (p) => (
  <svg {...defaultProps} {...p}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></svg>
);
export const SmileIcon = (p) => (
  <svg {...defaultProps} {...p}><circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/></svg>
);
export const HomeIcon = (p) => (
  <svg {...defaultProps} {...p}><path d="M3 11l9-8 9 8v9a2 2 0 0 1-2 2h-4v-6h-6v6H5a2 2 0 0 1-2-2v-9z"/></svg>
);
export const BriefcaseIcon = (p) => (
  <svg {...defaultProps} {...p}><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>
);
