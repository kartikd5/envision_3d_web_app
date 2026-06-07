"use client";

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "w-8 h-8" }: LogoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradient for Hexagon and Coordinate Arrows */}
        <linearGradient id="brand-grad-inline" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#E11D48" />
          <stop offset="50%" stopColor="#F43F5E" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>

        {/* Gradients for Cube Faces */}
        <linearGradient id="cube-top-inline" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FB923C" />
          <stop offset="100%" stopColor="#E11D48" />
        </linearGradient>

        <linearGradient id="cube-left-inline" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#BE123C" />
          <stop offset="100%" stopColor="#9F1239" />
        </linearGradient>

        <linearGradient id="cube-right-inline" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E04006" />
          <stop offset="100%" stopColor="#BE123C" />
        </linearGradient>
      </defs>

      {/* Dashed Hexagon Frame */}
      <polygon
        points="50,14 82.9,33 82.9,71 50,90 17.1,71 17.1,33"
        fill="none"
        stroke="url(#brand-grad-inline)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="10 7"
      />

      {/* Coordinate Axis Arrows */}
      <g stroke="url(#brand-grad-inline)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* Upward Axis */}
        <line x1="50" y1="32" x2="50" y2="8" />
        <path d="M45,13 L50,8 L55,13" />

        {/* Down-Left Axis */}
        <line x1="32.7" y1="62" x2="12" y2="74" />
        <path d="M17,74.5 L12,74 L13.5,69" />

        {/* Down-Right Axis */}
        <line x1="67.3" y1="62" x2="88" y2="74" />
        <path d="M86.5,69 L88,74 L83,74.5" />
      </g>

      {/* 3D Isometric Cube */}
      <g stroke="#090C15" strokeWidth="1.5" strokeLinejoin="round">
        {/* Top Face */}
        <polygon points="50,52 67.3,42 50,32 32.7,42" fill="url(#cube-top-inline)" />
        
        {/* Left Face */}
        <polygon points="50,52 32.7,42 32.7,62 50,72" fill="url(#cube-left-inline)" />
        
        {/* Right Face */}
        <polygon points="50,52 50,72 67.3,62 67.3,42" fill="url(#cube-right-inline)" />
      </g>
    </svg>
  );
}
