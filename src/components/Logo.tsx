import React from "react";

export const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Network Nodes (Top) */}
      <g stroke="#eab345" strokeWidth="1.5" fill="none">
        <path d="M25,35 L40,15 L60,15 L75,35 Z" />
        <path d="M40,15 L50,30 L60,15" />
        <path d="M25,35 L50,30 L75,35" />
        <path d="M50,10 L40,15" />
        <path d="M50,10 L60,15" />
      </g>
      <g fill="#eab345">
        <circle cx="25" cy="35" r="3" />
        <circle cx="40" cy="15" r="3" />
        <circle cx="60" cy="15" r="3" />
        <circle cx="75" cy="35" r="3" />
        <circle cx="50" cy="30" r="3" />
        <circle cx="50" cy="10" r="3" />
      </g>

      {/* Houses (Middle) */}
      <g fill="#d97736">
        {/* Left House */}
        <path d="M15,45 L30,35 L45,45 L45,60 L15,60 Z" />
        {/* Middle House */}
        <path d="M35,42 L50,32 L65,42 L65,58 L35,58 Z" />
        {/* Right House */}
        <path d="M55,45 L70,35 L85,45 L85,60 L55,60 Z" />
      </g>

      {/* Windows */}
      <g fill="#fdfbf7">
        <rect x="25" y="48" width="4" height="4" />
        <rect x="31" y="48" width="4" height="4" />
        <rect x="25" y="54" width="4" height="4" />
        <rect x="31" y="54" width="4" height="4" />
        
        <rect x="45" y="45" width="4" height="4" />
        <rect x="51" y="45" width="4" height="4" />
        <rect x="45" y="51" width="4" height="4" />
        <rect x="51" y="51" width="4" height="4" />

        <rect x="65" y="48" width="4" height="4" />
        <rect x="71" y="48" width="4" height="4" />
        <rect x="65" y="54" width="4" height="4" />
        <rect x="71" y="54" width="4" height="4" />
      </g>

      {/* People holding houses (Bottom) */}
      <g fill="#7c9a4e" stroke="#7c9a4e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Left person */}
        <circle cx="30" cy="65" r="3" fill="#7c9a4e" stroke="none" />
        <path d="M30,68 L30,85" />
        <path d="M30,72 L20,60" />
        <path d="M30,72 L40,60" />
        
        {/* Middle person */}
        <circle cx="50" cy="62" r="3" fill="#7c9a4e" stroke="none" />
        <path d="M50,65 L50,82" />
        <path d="M50,69 L40,58" />
        <path d="M50,69 L60,58" />

        {/* Right person */}
        <circle cx="70" cy="65" r="3" fill="#7c9a4e" stroke="none" />
        <path d="M70,68 L70,85" />
        <path d="M70,72 L60,60" />
        <path d="M70,72 L80,60" />
      </g>

      {/* Leaf (Bottom Right) */}
      <path d="M85,75 C85,90 70,100 50,95 C65,95 80,85 85,75 Z" fill="#9e4a24" />
      <path d="M50,95 C45,95 30,90 25,75" stroke="#9e4a24" strokeWidth="2" fill="none" />
    </svg>
  );
};
