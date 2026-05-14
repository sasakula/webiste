// Lightweight inline SVG icon set so we avoid extra dependencies.
const paths = {
  bolt: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"
    />
  ),
  pencil: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.862 3.487a2.06 2.06 0 1 1 2.915 2.914L6.75 19.43l-4 1 1-4 13.112-12.943ZM15 5l4 4"
    />
  ),
  tag: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 12V5a2 2 0 0 1 2-2h7l9 9-9 9-9-9Zm5-5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z"
    />
  ),
  layers: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3 2 8l10 5 10-5-10-5Zm-10 9 10 5 10-5M2 16l10 5 10-5"
    />
  ),
  chat: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 12c0 4.418-4.03 8-9 8a9.7 9.7 0 0 1-4-.86L3 21l1.86-5A8 8 0 0 1 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8Z"
    />
  ),
  check: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 13l4 4L19 7"
    />
  ),
  whatsapp: (
    <path
      d="M19.05 4.91A10.5 10.5 0 0 0 12 2C6.5 2 2 6.5 2 12c0 1.78.46 3.45 1.27 4.91L2 22l5.25-1.38A9.96 9.96 0 0 0 12 22c5.5 0 10-4.5 10-10 0-2.67-1.04-5.18-2.95-7.09Zm-7.05 15.4c-1.5 0-2.93-.4-4.18-1.13l-.3-.18-3.11.82.83-3.04-.2-.32A8.18 8.18 0 1 1 12 20.31Zm4.66-6.13c-.25-.13-1.5-.74-1.74-.83-.23-.08-.4-.13-.57.13-.17.25-.66.83-.81 1-.15.17-.3.19-.55.06-.25-.13-1.06-.39-2.02-1.25-.74-.66-1.24-1.47-1.39-1.72-.15-.25-.02-.39.11-.51.11-.11.25-.3.38-.45.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.57-1.36-.78-1.86-.21-.49-.42-.43-.57-.44h-.49c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.43 1.03 2.6.13.17 1.78 2.71 4.31 3.81.6.26 1.07.41 1.43.52.6.19 1.15.16 1.58.1.48-.07 1.5-.61 1.71-1.2.21-.59.21-1.09.15-1.2-.06-.11-.23-.17-.48-.3Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  arrowRight: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 12h14m-6-7 7 7-7 7"
    />
  ),
  star: (
    <path
      d="M12 2.5l2.92 6.27 6.83.62-5.18 4.6 1.55 6.71L12 17.27 5.88 20.7l1.55-6.71-5.18-4.6 6.83-.62L12 2.5Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  plus: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 5v14M5 12h14"
    />
  ),
  minus: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 12h14"
    />
  ),
  instagram: (
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </g>
  ),
  pin: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 22s7-7.58 7-12a7 7 0 1 0-14 0c0 4.42 7 12 7 12Zm0-9a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"
    />
  ),
  clock: (
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </g>
  ),
  mail: (
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </g>
  ),
  menu: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 6h16M4 12h16M4 18h16"
    />
  ),
  close: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 6l12 12M18 6 6 18"
    />
  ),
};

const Icon = ({ name, className = 'w-6 h-6', strokeWidth = 1.8 }) => {
  const path = paths[name];
  if (!path) return null;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden="true"
    >
      {path}
    </svg>
  );
};

export default Icon;
