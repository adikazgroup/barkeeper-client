interface IconProps {
  className?: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export const ArrowLeftIcon = ({
  className = "w-4 h-4",
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => (
  <svg
    className={className}
    fill="none"
    stroke={color}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      d="M10 19l-7-7m0 0l7-7m-7 7h18"
    />
  </svg>
);

export const HomeIcon = ({
  className = "w-5 h-5",
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => (
  <svg
    className={className}
    fill="none"
    stroke={color}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);

export const ChartBarIcon = ({
  className = "w-5 h-5",
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => (
  <svg
    className={className}
    fill="none"
    stroke={color}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);

export const UsersIcon = ({
  className = "w-5 h-5",
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => (
  <svg
    className={className}
    fill="none"
    stroke={color}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

export const UserIcon = ({
  className = "w-6 h-6",
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => (
  <svg
    className={className}
    fill="none"
    stroke={color}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

export const KeyIcon = ({
  className = "w-6 h-6",
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => (
  <svg
    className={className}
    fill="none"
    stroke={color}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
    />
  </svg>
);

export const MailIcon = ({
  className = "w-6 h-6",
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => (
  <svg
    className={className}
    fill="none"
    stroke={color}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
    />
  </svg>
);

export const LockIcon = ({
  className = "w-6 h-6",
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => (
  <svg
    className={className}
    fill="none"
    stroke={color}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

export const CheckCircleIcon = ({
  className = "w-6 h-6",
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => (
  <svg
    className={className}
    fill="none"
    stroke={color}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

// New icons added from ui/Icons.tsx
export const CalendarIcon = ({
  className = "w-6 h-6",
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => (
  <svg
    className={className}
    fill="none"
    stroke={color}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}>
      <path d="M8 2v4m8-4v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </g>
  </svg>
);

export const XIcon = ({
  className = "w-6 h-6",
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => (
  <svg
    className={className}
    fill="none"
    stroke={color}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      d="M18 6L6 18M6 6l12 12"
    />
  </svg>
);

export const ChevronLeftIcon = ({
  className = "w-6 h-6",
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => (
  <svg
    className={className}
    fill="none"
    stroke={color}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      d="m15 18l-6-6l6-6"
    />
  </svg>
);

export const ChevronRightIcon = ({
  className = "w-6 h-6",
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => (
  <svg
    className={className}
    fill="none"
    stroke={color}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      d="m9 18l6-6l-6-6"
    />
  </svg>
);

export const CheckIcon = ({
  className = "w-6 h-6",
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => (
  <svg
    className={className}
    fill="none"
    stroke={color}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      d="M20 6L9 17l-5-5"
    />
  </svg>
);

export const ChevronDownIcon = ({
  className = "w-6 h-6",
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => (
  <svg
    className={className}
    fill="none"
    stroke={color}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      d="m6 9l6 6l6-6"
    />
  </svg>
);

export const ArrowRightIcon = ({
  className = "w-6 h-6",
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => (
  <svg
    className={className}
    fill="none"
    stroke={color}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      d="M5 12h14m-7-7l7 7l-7 7"
    />
  </svg>
);

export const EllipsisIcon = ({
  className = "w-6 h-6",
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => (
  <svg
    className={className}
    fill="none"
    stroke={color}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}>
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </g>
  </svg>
);

export const PlusIcon = ({
  className = "w-6 h-6",
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => (
  <svg
    className={className}
    fill="none"
    stroke={color}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      d="M5 12h14m-7-7v14"
    />
  </svg>
);

export const ChevronUpIcon = ({
  className = "w-6 h-6",
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => (
  <svg
    className={className}
    fill="none"
    stroke={color}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      d="m18 15l-6-6l-6 6"
    />
  </svg>
);

export const SearchIcon = ({
  className = "w-6 h-6",
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => (
  <svg
    className={className}
    fill="none"
    stroke={color}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}>
      <path d="m21 21l-4.34-4.34" />
      <circle cx="11" cy="11" r="8" />
    </g>
  </svg>
);

export const CaretUpOutlineIcon = ({
  className = "w-6 h-6",
  color = "currentColor",
}: IconProps) => (
  <svg
    className={className}
    fill={color}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      d="M16.53 14.03a.75.75 0 0 1-1.06 0L12 10.56l-3.47 3.47a.75.75 0 0 1-1.06-1.06l4-4a.75.75 0 0 1 1.06 0l4 4a.75.75 0 0 1 0 1.06"
      clipRule="evenodd"
    />
  </svg>
);

export const CaretDownOutlineIcon = ({
  className = "w-6 h-6",
  color = "currentColor",
}: IconProps) => (
  <svg
    className={className}
    fill={color}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      d="M16.53 8.97a.75.75 0 0 1 0 1.06l-4 4a.75.75 0 0 1-1.06 0l-4-4a.75.75 0 1 1 1.06-1.06L12 12.44l3.47-3.47a.75.75 0 0 1 1.06 0"
      clipRule="evenodd"
    />
  </svg>
);

export const Loader2Icon = ({
  className = "w-6 h-6 animate-spin",
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => (
  <svg
    className={className}
    fill="none"
    stroke={color}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      d="M21 12a9 9 0 1 1-6.219-8.56"
    />
  </svg>
);

export const CircleXIcon = ({
  className = "w-6 h-6",
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => (
  <svg
    className={className}
    fill="none"
    stroke={color}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}>
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9l-6 6m0-6l6 6" />
    </g>
  </svg>
);

export const SunIcon = ({
  className = "w-6 h-6",
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => (
  <svg
    className={className}
    fill="none"
    stroke={color}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

export const MoonIcon = ({
  className = "w-6 h-6",
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => (
  <svg
    className={className}
    fill="none"
    stroke={color}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
    />
  </svg>
);

export const ImageIcon = ({
  className = "w-6 h-6",
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <g
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </g>
  </svg>
);

export const CameraIcon = ({
  className = "w-6 h-6",
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    >
      <path d="M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z"></path>
      <circle cx={12} cy={13} r={3}></circle>
    </g>
  </svg>
);

export const MusicIcon = ({
  className = "w-6 h-6",
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    >
      <path d="M9 18V5l12-2v13"></path>
      <circle cx={6} cy={18} r={3}></circle>
      <circle cx={18} cy={16} r={3}></circle>
    </g>
  </svg>
);

export const FileIcon = ({
  className = "w-6 h-6",
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => (
  <svg
    className={className}
    fill="none"
    stroke={color}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    >
      <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path>
      <path d="M14 2v5a1 1 0 0 0 1 1h5M10 9H8m8 4H8m8 4H8"></path>
    </g>
  </svg>
);

export const FileCodeIcon = ({
  className = "w-6 h-6",
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    >
      <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path>
      <path d="M14 2v5a1 1 0 0 0 1 1h5m-10 4.5L8 15l2 2.5m4-5l2 2.5l-2 2.5"></path>
    </g>
  </svg>
);

export const PackageIcon = ({
  className = "w-6 h-6",
  color = "currentColor",
  strokeWidth = 1.7,
}: IconProps) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    >
      <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73zm1 .27V12"></path>
      <path d="M3.29 7L12 12l8.71-5M7.5 4.27l9 5.15"></path>
    </g>
  </svg>
);

export const UploadIcon = ({
  className = "w-6 h-6",
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    >
      <path d="M12 13v8m-8-6.101A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
      <path d="m8 17l4-4l4 4"></path>
    </g>
  </svg>
);

export const EyeIcon = ({
  className = "w-4 h-4",
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    >
      <path d="M2.062 12.348a1 1 0 0 1 0-.696a10.75 10.75 0 0 1 19.876 0a1 1 0 0 1 0 .696a10.75 10.75 0 0 1-19.876 0"></path>
      <circle cx={12} cy={12} r={3}></circle>
    </g>
  </svg>
);

export const BadgeAlertIcon = ({
  className = "w-6 h-6",
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      d="M3.85 8.62a4 4 0 0 1 4.78-4.77a4 4 0 0 1 6.74 0a4 4 0 0 1 4.78 4.78a4 4 0 0 1 0 6.74a4 4 0 0 1-4.77 4.78a4 4 0 0 1-6.75 0a4 4 0 0 1-4.78-4.77a4 4 0 0 1 0-6.76M12 8v4m0 4h.01"
    ></path>
  </svg>
);

export const DownloadIcon = ({
  className = "w-6 h-6",
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    >
      <path d="M12 13v8l-4-4m4 4l4-4"></path>
      <path d="M4.393 15.269A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.436 8.284"></path>
    </g>
  </svg>
);

export const TrashIcon = ({
  className = "w-6 h-6",
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      d="M10 11v6m4-6v6m5-11v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
    ></path>
  </svg>
);

export const LoaderIcon = ({
  className = "w-6 h-6 animate-spin",
  color = "currentColor",
  strokeWidth = 1.7,
}: IconProps) => (
  <svg
    className={className}
    fill="none"
    stroke={color}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      d="M12 2v4m4.2 1.8l2.9-2.9M18 12h4m-5.8 4.2l2.9 2.9M12 18v4m-7.1-2.9l2.9-2.9M2 12h4M4.9 4.9l2.9 2.9"
    />
  </svg>
);

export function EyeOffIcon({
  className = "w-4 h-4",
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  );
}

export const DollarSignIcon = ({
  className = "w-4 h-4",
  color = "currentColor",
  strokeWidth = 1.7,
}: IconProps) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      d="M12 2v20m5-17H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
    />
  </svg>
);

export const UsersOutlineIcon = ({
  className = "w-4 h-4",
  color = "currentColor",
  strokeWidth = 1.7,
}: IconProps) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M16 3.128a4 4 0 0 1 0 7.744M22 21v-2a4 4 0 0 0-3-3.87" />
      <circle cx="9" cy="7" r="4" />
    </g>
  </svg>
);

export const ShoppingBagIcon = ({
  className = "w-4 h-4",
  color = "currentColor",
  strokeWidth = 1.7,
}: IconProps) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    >
      <path d="M16 10a4 4 0 0 1-8 0M3.103 6.034h17.794" />
      <path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z" />
    </g>
  </svg>
);

export const ArrowUpOutlineIcon = ({
  className = "w-4 h-4",
  color = "currentColor",
  strokeWidth = 1.7,
}: IconProps) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      d="m5 12l7-7l7 7m-7 7V5"
    />
  </svg>
);

export const ArrowDownOutlineIcon = ({
  className = "w-4 h-4",
  color = "currentColor",
  strokeWidth = 1.7,
}: IconProps) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      d="M12 5v14m7-7l-7 7l-7-7"
    />
  </svg>
);

export const DeleteIcon = ({
  className = "w-4 h-4",
  color = "currentColor",
  strokeWidth = 1.7,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    viewBox="0 0 24 24"
    className={className}
  >
    <path
      fill={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      d="M10 5h4a2 2 0 1 0-4 0M8.5 5a3.5 3.5 0 1 1 7 0h5.75a.75.75 0 0 1 0 1.5h-1.32l-1.17 12.111A3.75 3.75 0 0 1 15.026 22H8.974a3.75 3.75 0 0 1-3.733-3.389L4.07 6.5H2.75a.75.75 0 0 1 0-1.5zm2 4.75a.75.75 0 0 0-1.5 0v7.5a.75.75 0 0 0 1.5 0zM14.25 9a.75.75 0 0 1 .75.75v7.5a.75.75 0 0 1-1.5 0v-7.5a.75.75 0 0 1 .75-.75m-7.516 9.467a2.25 2.25 0 0 0 2.24 2.033h6.052a2.25 2.25 0 0 0 2.24-2.033L18.424 6.5H5.576z"
    ></path>
  </svg>
);

export const KeyboardIcon = ({
  className = "w-4 h-4",
  color = "currentColor",
  strokeWidth = 1.7,
}: IconProps) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    >
      <path d="M10 8h.01M12 12h.01M14 8h.01M16 12h.01M18 8h.01M6 8h.01M7 16h10m-9-4h.01" />
      <rect width={20} height={16} x={2} y={4} rx={2} />
    </g>
  </svg>
);

export const EditIcon = ({
  className = "w-4 h-4",
  color = "currentColor",
  strokeWidth = 1.7,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    viewBox="0 0 24 24"
    className={className}
  >
    <path
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
    ></path>
  </svg>
);
export const Undo2Icon = ({
  className = "w-4 h-4",
  color = "currentColor",
  strokeWidth = 1.7,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={strokeWidth}
  >
    <g>
      <path d="M9 14L4 9l5-5" />
      <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11" />
    </g>
  </svg>
);

export const Redo2Icon = ({
  className = "w-4 h-4",
  color = "currentColor",
  strokeWidth = 1.7,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={strokeWidth}
  >
    <g>
      <path d="m15 14l5-5l-5-5" />
      <path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13" />
    </g>
  </svg>
);

export const FlexTextIcon = ({
  className = "w-4 h-4",
  color = "currentColor",
  strokeWidth = 1.7,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={strokeWidth}
  >
    <g>
      <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
      <path d="M14 2v5a1 1 0 0 0 1 1h5M10 9H8m8 4H8m8 4H8" />
    </g>
  </svg>
);

export const TypeIcon = ({
  className = "w-4 h-4",
  color = "currentColor",
  strokeWidth = 1.7,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={strokeWidth}
  >
    <path d="M12 4v16M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2M9 20h6" />
  </svg>
);

export const BoldIcon = ({
  className = "w-4 h-4",
  color = "currentColor",
  strokeWidth = 1.7,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={strokeWidth}
  >
    <path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8" />
  </svg>
);

export const ItalicIcon = ({
  className = "w-4 h-4",
  color = "currentColor",
  strokeWidth = 1.7,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={strokeWidth}
  >
    <path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8" />
  </svg>
);

export const UnderlineIcon = ({
  className = "w-4 h-4",
  color = "currentColor",
  strokeWidth = 1.7,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={strokeWidth}
  >
    <path d="M6 4v6a6 6 0 0 0 12 0V4M4 20h16" />
  </svg>
);

export const StrikethroughIcon = ({
  className = "w-4 h-4",
  color = "currentColor",
  strokeWidth = 1.7,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={strokeWidth}
  >
    <path d="M16 4H9a3 3 0 0 0-2.83 4M14 12a4 4 0 0 1 0 8H6m-2-8h16" />
  </svg>
);

export const CodeIcon = ({
  className = "w-4 h-4",
  color = "currentColor",
  strokeWidth = 1.7,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={strokeWidth}
  >
    <path d="m18 16l4-4l-4-4M6 8l-4 4l4 4m8.5-12l-5 16" />
  </svg>
);

export const PaletteIcon = ({
  className = "w-4 h-4",
  color = "currentColor",
  strokeWidth = 1.7,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={strokeWidth}
  >
    <g>
      <path d="M12 22a1 1 0 0 1 0-20a10 9 0 0 1 10 9a5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z" />
      <circle cx={13.5} cy={6.5} r={0.5} fill={color} />
      <circle cx={17.5} cy={10.5} r={0.5} fill={color} />
      <circle cx={6.5} cy={12.5} r={0.5} fill={color} />
      <circle cx={8.5} cy={7.5} r={0.5} fill={color} />
    </g>
  </svg>
);

export const AlignLeftIcon = ({
  className = "w-4 h-4",
  color = "currentColor",
  strokeWidth = 1.7,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={strokeWidth}
  >
    <path d="M15 12H3m14 6H3M21 6H3" />
  </svg>
);

export const AlignCenterIcon = ({
  className = "w-4 h-4",
  color = "currentColor",
  strokeWidth = 1.7,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={strokeWidth}
  >
    <path d="M17 12H7m12 6H5M21 6H3" />
  </svg>
);

export const AlignRightIcon = ({
  className = "w-4 h-4",
  color = "currentColor",
  strokeWidth = 1.7,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={strokeWidth}
  >
    <path d="M21 12H9m12 6H7M21 6H3" />
  </svg>
);

export const ListIcon = ({
  className = "w-4 h-4",
  color = "currentColor",
  strokeWidth = 1.7,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={strokeWidth}
  >
    <path d="M3 5h.01M3 12h.01M3 19h.01M8 5h13M8 12h13M8 19h13" />
  </svg>
);

export const ListOrderIcon = ({
  className = "w-4 h-4",
  color = "currentColor",
  strokeWidth = 1.7,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={strokeWidth}
  >
    <path d="M11 5h10m-10 7h10m-10 7h10M4 4h1v5M4 9h2m.5 11H3.4c0-1 2.6-1.925 2.6-3.5a1.5 1.5 0 0 0-2.6-1.02" />
  </svg>
);

export const LinkIcon = ({
  className = "w-4 h-4",
  color = "currentColor",
  strokeWidth = 1.7,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={strokeWidth}
  >
    <g>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </g>
  </svg>
);

export const QuoteIcon = ({
  className = "w-4 h-4",
  color = "currentColor",
  strokeWidth = 1.7,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={strokeWidth}
  >
    <path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2a1 1 0 0 1 1 1v1a2 2 0 0 1-2 2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1a6 6 0 0 0 6-6V5a2 2 0 0 0-2-2zM5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2a1 1 0 0 1 1 1v1a2 2 0 0 1-2 2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1a6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z" />
  </svg>
);

export const MinusIcon = ({
  className = "w-4 h-4",
  color = "currentColor",
  strokeWidth = 1.7,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={strokeWidth}
  >
    <path d="M5 12h14" />
  </svg>
);

export const CopyIcon = ({
  className = "w-4 h-4",
  color = "currentColor",
  strokeWidth = 1.7,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={strokeWidth}
  >
    <g>
      <rect width={14} height={14} x={8} y={8} rx={2} ry={2} />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </g>
  </svg>
);

export const ClipboardIcon = ({
  className = "w-4 h-4",
  color = "currentColor",
  strokeWidth = 1.7,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={strokeWidth}
  >
    <g>
      <rect width={8} height={4} x={8} y={2} rx={1} ry={1} />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="m9 14l2 2l4-4" />
    </g>
  </svg>
);

export const MoreIcon = ({
  className = "w-4.5 h-4.5",
  color = "currentColor",
  strokeWidth = 1.7,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    viewBox="0 0 24 24"
    className={className}
    strokeWidth={strokeWidth}
  >
    <g fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round">
      <circle cx={12} cy={12} r={1}></circle>
      <circle cx={12} cy={5} r={1}></circle>
      <circle cx={12} cy={19} r={1}></circle>
    </g>
  </svg>
);

export const AppleIcon = ({ className = "w-4.5 h-4.5" }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path d="M16.37 12.78c.02 2.4 2.1 3.2 2.13 3.21-.02.05-.34 1.15-1.11 2.28-.67.98-1.36 1.95-2.46 1.97-1.07.02-1.42-.63-2.65-.63-1.23 0-1.61.61-2.63.65-1.05.04-1.85-1.05-2.53-2.02-1.47-2.13-2.6-6.03-1.08-8.66.75-1.31 2.1-2.14 3.56-2.16 1.03-.02 2.01.7 2.65.7.63 0 1.83-.86 3.08-.74.53.03 2.01.19 2.96 1.45-.08.05-1.77 1.03-1.75 3.08zM14.3 4.9c.56-.68.94-1.62.84-2.56-.81.03-1.79.54-2.37 1.22-.52.6-.98 1.56-.86 2.48.9.07 1.83-.46 2.39-1.14z" />
  </svg>
);

export const GoogleIcon = ({ className = "w-4.5 h-4.5" }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 48 48"
    className={className}
  >
    <path d="M0 0h48v48H0z" fill="none" />
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917"
    />
    <path
      fill="#FF3D00"
      d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.9 11.9 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44"
    />
    <path
      fill="#1976D2"
      d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917"
    />
  </svg>
);

export const MenuIcon = ({
  className = "w-4.5 h-4.5",
  color = "currentColor",
  strokeWidth = 1.7,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    className={className}
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      d="M4 5h16M4 12h16M4 19h16"
    />
  </svg>
);

export const SettingsIcon = ({
  className = "w-4 h-4",
  color = "currentColor",
  strokeWidth = 1.7,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    className={className}
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <g
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    >
      <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0a2.34 2.34 0 0 0 3.319 1.915a2.34 2.34 0 0 1 2.33 4.033a2.34 2.34 0 0 0 0 3.831a2.34 2.34 0 0 1-2.33 4.033a2.34 2.34 0 0 0-3.319 1.915a2.34 2.34 0 0 1-4.659 0a2.34 2.34 0 0 0-3.32-1.915a2.34 2.34 0 0 1-2.33-4.033a2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" />
      <circle cx="12" cy="12" r="3" />
    </g>
  </svg>
);

export const ManageUserIcon = ({
  className = "w-4 h-4",
  color = "currentColor",
  strokeWidth = 1.7,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    className={className}
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <g
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    >
      <path d="M16.051 12.616a1 1 0 0 1 1.909.024l.737 1.452a1 1 0 0 0 .737.535l1.634.256a1 1 0 0 1 .588 1.806l-1.172 1.168a1 1 0 0 0-.282.866l.259 1.613a1 1 0 0 1-1.541 1.134l-1.465-.75a1 1 0 0 0-.912 0l-1.465.75a1 1 0 0 1-1.539-1.133l.258-1.613a1 1 0 0 0-.282-.866l-1.156-1.153a1 1 0 0 1 .572-1.822l1.633-.256a1 1 0 0 0 .737-.535zM8 15H7a4 4 0 0 0-4 4v2" />
      <circle cx="10" cy="7" r="4" />
    </g>
  </svg>
);

export const FinanceIcon = ({
  className = "w-4 h-4",
  color = "currentColor",
  strokeWidth = 3,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 48 48"
    className={className}
  >
    <path d="M0 0h48v48H0z" fill="none" />
    <g
      fill="none"
      stroke={color}
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    >
      <path d="M15 14.385C19.126 16 24.01 16 24.01 16s4.87 0 8.99-1.615c4.502 5.254 7.657 12.18 9.73 18.013C44.829 38.303 40.2 44 33.934 44H14.02c-6.252 0-10.874-5.67-8.786-11.563C7.298 26.614 10.455 19.686 15 14.385Z" />
      <path
        strokeLinecap="round"
        d="M18 28h12m-12 6h12m-5.991-6v10M30 22l-6 6l-6-6"
      />
      <path
        strokeLinecap="round"
        d="M24 16c7.18 0 13-2.686 13-6s-5.82-6-13-6s-13 2.686-13 6s5.82 6 13 6"
        clipRule="evenodd"
      />
    </g>
  </svg>
);

export const LogoutIcon = ({
  className = "w-4 h-4",
  color = "currentColor",
  strokeWidth = 1.7,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    className={className}
  >
    <g
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5l-5-5" />
      <path d="M21 12H9" />
    </g>
  </svg>
);

export const StoreIcon = ({
  className = "w-5 h-5",
  color = "currentColor",
  strokeWidth = 1.7,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={strokeWidth}
  >
    <path d="M3 9l9-7l9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <path d="M9 22V12h6v10" />
  </svg>
);

export const ShoppingCartIcon = ({
  className = "w-5 h-5",
  color = "currentColor",
  strokeWidth = 1.7,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={strokeWidth}
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

export const TagIcon = ({
  className = "w-5 h-5",
  color = "currentColor",
  strokeWidth = 1.7,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    className={className}
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <g
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    >
      <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
      <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
    </g>
  </svg>
);

export const MegaphoneIcon = ({
  className = "w-5 h-5",
  color = "currentColor",
  strokeWidth = 1.7,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    className={className}
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <g
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    >
      <path d="M11 6a13 13 0 0 0 8.4-2.8A1 1 0 0 1 21 4v12a1 1 0 0 1-1.6.8A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
      <path d="M6 14a12 12 0 0 0 2.4 7.2a2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14M8 6v8" />
    </g>
  </svg>
);

export const BellIcon = ({
  className = "w-5 h-5",
  color = "currentColor",
  strokeWidth = 1.7,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={strokeWidth}
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

export const BarChart2Icon = ({
  className = "w-5 h-5",
  color = "currentColor",
  strokeWidth = 1.7,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={strokeWidth}
  >
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

export const PackagePlusIcon = ({
  className = "w-5 h-5",
  color = "currentColor",
  strokeWidth = 1.7,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={strokeWidth}
  >
    <path d="M16 16h6m-3-3v6" />
    <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14" />
    <path d="M16.5 9.4L7.55 4.24M3.29 7L12 12l8.71-5M12 22V12" />
  </svg>
);

export const ClipboardCheckIcon = ({
  className = "w-5 h-5",
  color = "currentColor",
  strokeWidth = 1.7,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={strokeWidth}
  >
    <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="m9 14l2 2l4-4" />
  </svg>
);

export const PanelLeftOpenIcon = ({
  className = "w-5 h-5",
  color = "currentColor",
  strokeWidth = 1.7,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    className={className}
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <g
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18m7-6l-3-3l3-3" />
    </g>
  </svg>
);

export const PanelLeftCloseIcon = ({
  className = "w-5 h-5",
  color = "currentColor",
  strokeWidth = 1.7,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    className={className}
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <g
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M15 3v18M8 9l3 3l-3 3" />
    </g>
  </svg>
);

export const EmptyIcon = ({
  className = "w-5 h-5",
  color = "currentColor",
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 256 256"
    className={className}
  >
    <path d="M0 0h256v256H0z" fill="none" />
    <g fill={color}>
      <path d="M216 128a88 88 0 1 1-88-88a88 88 0 0 1 88 88" opacity=".2" />
      <path d="m198.24 62.63l15.68-17.25a8 8 0 0 0-11.84-10.76L186.4 51.86A95.95 95.95 0 0 0 57.76 193.37l-15.68 17.25a8 8 0 1 0 11.84 10.76l15.68-17.24A95.95 95.95 0 0 0 198.24 62.63M48 128a80 80 0 0 1 127.6-64.25l-107 117.73A79.63 79.63 0 0 1 48 128m80 80a79.55 79.55 0 0 1-47.6-15.75l107-117.73A79.95 79.95 0 0 1 128 208" />
    </g>
  </svg>
);

export const HeadsetIcon = ({
  className = "w-5 h-5",
  color = "currentColor",
  strokeWidth = 1.8,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    className={className}
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <g
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    >
      <path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H3z" />
      <path d="M21 11h-3a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3z" />
      <path d="M21 11V9a9 9 0 0 0-18 0v2" />
      <path d="M21 18a3 3 0 0 1-3 3H6" />
    </g>
  </svg>
);

export const MessageSquareIcon = ({
  className = "w-5 h-5",
  color = "currentColor",
  strokeWidth = 1.8,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke={color}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={strokeWidth}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

/* -------------------------------------------------------------------------- */
/*                              FEATURE GLYPHS                                */
/* -------------------------------------------------------------------------- */

/**
 * Drawn on a 48-unit grid rather than the 24 the rest of this file uses. They
 * carry more incident than an interface icon — a struck-out column, a priced
 * row — and at 24 units those details close up. Keep them as a set: same grid,
 * same 1.5 stroke, same use of opacity to push secondary shapes back.
 */

/** Separate threads folding into one. */
export const ThreadsIcon = ({
  className = "w-5 h-5",
  color = "currentColor",
  strokeWidth = 1.5,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    className={className}
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="6" y="8" width="22" height="15" rx="5" />
    <path d="M12 28v3a5 5 0 0 0 5 5h13l6 5v-5h1a5 5 0 0 0 5-5v-9a5 5 0 0 0-5-5h-4" />
    <path d="M12 14h10M12 18h6" opacity="0.5" />
  </svg>
);

/** A catalogue, with one line priced. */
export const CatalogueIcon = ({
  className = "w-5 h-5",
  color = "currentColor",
  strokeWidth = 1.5,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    className={className}
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="6" y="7" width="15" height="15" rx="4" />
    <rect x="27" y="7" width="15" height="15" rx="4" opacity="0.45" />
    <rect x="6" y="27" width="15" height="15" rx="4" opacity="0.45" />
    <path d="M27 32.5h15M27 38h9" />
    <circle cx="13.5" cy="14.5" r="2.5" />
  </svg>
);

/** A conversation resolving into a confirmed order. */
export const OrderReceiptIcon = ({
  className = "w-5 h-5",
  color = "currentColor",
  strokeWidth = 1.5,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    className={className}
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10 7h20a4 4 0 0 1 4 4v26l-5-3-4.5 3-4.5-3-5 3-5-3V11a4 4 0 0 1 4-4Z" />
    <path d="M16 17h12M16 23h7" opacity="0.5" />
    <path d="M28.5 28.5 32 32l6.5-7" />
  </svg>
);

/** Stock counting down, with the sold-out column struck out. */
export const StockIcon = ({
  className = "w-5 h-5",
  color = "currentColor",
  strokeWidth = 1.5,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    className={className}
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8 40h32" />
    <rect x="10" y="20" width="8" height="20" rx="2.5" />
    <rect x="22" y="13" width="8" height="27" rx="2.5" opacity="0.45" />
    <rect x="34" y="30" width="8" height="10" rx="2.5" opacity="0.45" />
    <path d="M31 8.5 41 18M41 8.5 31 18" opacity="0.75" />
  </svg>
);

/* The sidebar collapse toggle: a panel with its rail on the left or right,
   pointing at which side the sidebar will end up on. */
export const PanelLeftIcon = ({
  className = "w-5 h-5",
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => (
  <svg
    className={className}
    fill="none"
    stroke={color}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="3"
      y="4"
      width="18"
      height="16"
      rx="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      d="M9.5 4v16"
    />
  </svg>
);

export const PanelRightIcon = ({
  className = "w-5 h-5",
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => (
  <svg
    className={className}
    fill="none"
    stroke={color}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="3"
      y="4"
      width="18"
      height="16"
      rx="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      d="M14.5 4v16"
    />
  </svg>
);
