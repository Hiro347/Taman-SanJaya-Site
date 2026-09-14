import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

/**
 * Tokopedia Official Mascot Toped Bag Icon
 * Signature Toped owl shopping bag with handle, owl eyes, and beak.
 */
export function TokopediaIcon({ className = 'w-4 h-4', ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Top Bag Handle */}
      <path
        d="M8 6.5C8 4.3 9.8 2.5 12 2.5C14.2 2.5 16 4.3 16 6.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Bag Body with Cutout Eyes */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.8 7.5C3.3 7.5 3 7.9 3.1 8.4L4.6 20.3C4.8 21.8 6.1 23 7.6 23H16.4C17.9 23 19.2 21.8 19.4 20.3L20.9 8.4C21 7.9 20.7 7.5 20.2 7.5H3.8ZM9 15.5C10.3807 15.5 11.5 14.3807 11.5 13C11.5 11.6193 10.3807 10.5 9 10.5C7.61929 10.5 6.5 11.6193 6.5 13C6.5 14.3807 7.61929 15.5 9 15.5ZM15 15.5C16.3807 15.5 17.5 14.3807 17.5 13C17.5 11.6193 16.3807 10.5 15 10.5C13.6193 10.5 12.5 11.6193 12.5 13C12.5 14.3807 13.6193 15.5 15 15.5Z"
      />
      {/* Eye Shine Reflection Highlights */}
      <circle cx="9.6" cy="12.3" r="0.75" fill="#FFFFFF" />
      <circle cx="15.6" cy="12.3" r="0.75" fill="#FFFFFF" />
      {/* Beak */}
      <polygon points="11,15.2 13,15.2 12,17" fill="#F7941D" />
    </svg>
  );
}

/**
 * Shopee Official Shopping Bag Icon
 * Official Simple Icons Shopee vector with S-symbol shopping bag.
 */
export function ShopeeIcon({ className = 'w-4 h-4', ...props }: IconProps) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M15.9414 17.9633c.229-1.879-.981-3.077-4.1758-4.0969-1.548-.528-2.277-1.22-2.26-2.1719.065-1.056 1.048-1.825 2.352-1.85a5.2898 5.2898 0 0 1 2.8838.89c.116.072.197.06.263-.039.09-.145.315-.494.39-.62.051-.081.061-.187-.068-.281-.185-.1369-.704-.4149-.983-.5319a6.4697 6.4697 0 0 0-2.5118-.514c-1.909.008-3.4129 1.215-3.5389 2.826-.082 1.1629.494 2.1078 1.73 2.8278.262.152 1.6799.716 2.2438.892 1.774.552 2.695 1.5419 2.478 2.6969-.197 1.047-1.299 1.7239-2.818 1.7439-1.2039-.046-2.2878-.537-3.1278-1.19l-.141-.11c-.104-.08-.218-.075-.287.03-.05.077-.376.547-.458.67-.077.108-.035.168.045.234.35.293.817.613 1.134.775a6.7097 6.7097 0 0 0 2.8289.727 4.9048 4.9048 0 0 0 2.0759-.354c1.095-.465 1.8029-1.394 1.9449-2.554zM11.9986 1.4009c-2.068 0-3.7539 1.95-3.8329 4.3899h7.6657c-.08-2.44-1.765-4.3899-3.8328-4.3899zm7.8516 22.5981-.08.001-15.7843-.002c-1.074-.04-1.863-.91-1.971-1.991l-.01-.195L1.298 6.2858a.459.459 0 0 1 .45-.494h4.9748C6.8448 2.568 9.1607 0 11.9996 0c2.8388 0 5.1537 2.5689 5.2757 5.7898h4.9678a.459.459 0 0 1 .458.483l-.773 15.5883-.007.131c-.094 1.094-.979 1.9769-2.0709 2.0059z" />
    </svg>
  );
}

/**
 * Official Full-Fidelity WhatsApp Logo Icon
 * Matches official WhatsApp brand asset:
 * - Subtle shadow
 * - Crisp white outer speech-bubble border
 * - Radiant WhatsApp gradient green (#57d163 to #23b33a)
 * - Pure white telephone handset
 */
export function WhatsAppIcon({ className = 'w-5 h-5', ...props }: IconProps) {
  return (
    <svg
      role="img"
      viewBox="0 0 175.216 175.552"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <linearGradient
          id="whatsapp-bg-gradient"
          x1="85.915"
          x2="86.535"
          y1="32.567"
          y2="137.092"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#57d163" />
          <stop offset="1" stopColor="#23b33a" />
        </linearGradient>
        <filter
          id="whatsapp-shadow-filter"
          width="1.115"
          height="1.114"
          x="-.057"
          y="-.057"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="3.531" />
        </filter>
      </defs>
      {/* Soft Drop Shadow */}
      <path
        fill="#000000"
        fillOpacity="0.18"
        d="m54.532 138.45 2.235 1.324c9.387 5.571 20.15 8.518 31.126 8.523h.023c33.707 0 61.139-27.426 61.153-61.135.006-16.335-6.349-31.696-17.895-43.251A60.75 60.75 0 0 0 87.94 25.983c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.312-6.179 22.558zm-40.811 23.544L24.16 123.88c-6.438-11.154-9.825-23.808-9.821-36.772.017-40.556 33.021-73.55 73.578-73.55 19.681.01 38.154 7.669 52.047 21.572s21.537 32.383 21.53 52.037c-.018 40.553-33.027 73.553-73.578 73.553h-.032c-12.313-.005-24.412-3.094-35.159-8.954zm0 0"
        filter="url(#whatsapp-shadow-filter)"
      />
      {/* Crisp White Outer Bubble Ring */}
      <path
        fill="#FFFFFF"
        d="m12.966 161.238 10.439-38.114a73.42 73.42 0 0 1-9.821-36.772c.017-40.556 33.021-73.55 73.578-73.55 19.681.01 38.154 7.669 52.047 21.572s21.537 32.383 21.53 52.037c-.018 40.553-33.027 73.553-73.578 73.553h-.032c-12.313-.005-24.412-3.094-35.159-8.954z"
      />
      {/* WhatsApp Gradient Green Inner Body */}
      <path
        fill="url(#whatsapp-bg-gradient)"
        d="M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.313-6.179 22.558 23.146-6.069 2.235 1.324c9.387 5.571 20.15 8.517 31.126 8.523h.023c33.707 0 61.14-27.426 61.153-61.135a60.75 60.75 0 0 0-17.895-43.251 60.75 60.75 0 0 0-43.235-17.928z"
      />
      {/* Pure White Telephone Handset */}
      <path
        fill="#FFFFFF"
        fillRule="evenodd"
        d="M68.772 55.603c-1.378-3.061-2.828-3.123-4.137-3.176l-3.524-.043c-1.226 0-3.218.46-4.902 2.3s-6.435 6.287-6.435 15.332 6.588 17.785 7.506 19.013 12.718 20.381 31.405 27.75c15.529 6.124 18.689 4.906 22.061 4.6s10.877-4.447 12.408-8.74 1.532-7.971 1.073-8.74-1.685-1.226-3.525-2.146-10.877-5.367-12.562-5.981-2.91-.919-4.137.921-4.746 5.979-5.819 7.206-2.144 1.381-3.984.462-7.76-2.861-14.784-9.124c-5.465-4.873-9.154-10.891-10.228-12.73s-.114-2.835.808-3.751c.825-.824 1.838-2.147 2.759-3.22s1.224-1.84 1.836-3.065.307-2.301-.153-3.22-4.032-10.011-5.666-13.647"
      />
    </svg>
  );
}
