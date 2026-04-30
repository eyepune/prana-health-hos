/// <reference path="../app/globals.d.ts" />
"use client";
import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  pulse?: boolean;
  color?: string;
}

export default function PranaLogo3({ className = "", size = 40, pulse = false, color = "#00D1B2" }: LogoProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${pulse ? 'animate-[pulse_4s_ease-in-out_infinite]' : ''}`}
    >
      {/* Background Glow */}
      {pulse && (
        <circle cx="50" cy="50" r="45" fill="url(#logoGlow)" fillOpacity="0.1" />
      )}

      {/* Main Structure */}
      <circle cx="50" cy="50" r="12" fill={color} />
      <circle cx="50" cy="50" r="18" stroke={color} strokeWidth="2" strokeOpacity="0.2" />
      
      {/* Arcs */}
      <path 
        d="M20 50A30 30 0 0 1 80 50" 
        stroke={color} 
        strokeWidth="6" 
        strokeLinecap="round" 
        strokeOpacity="0.4"
      />
      <path 
        d="M80 50A30 30 0 0 1 20 50" 
        stroke={color} 
        strokeWidth="6" 
        strokeLinecap="round" 
      />

      {/* Connection Rings */}
      <circle cx="50" cy="20" r="8" stroke={color} strokeWidth="1" strokeOpacity="0.3" />
      <circle cx="50" cy="80" r="8" stroke={color} strokeWidth="1" strokeOpacity="0.3" />
      <circle cx="80" cy="50" r="8" stroke={color} strokeWidth="1" strokeOpacity="0.3" />
      <circle cx="20" cy="50" r="8" stroke={color} strokeWidth="1" strokeOpacity="0.3" />

      {/* Dots */}
      <circle cx="50" cy="20" r="4" fill={color} fillOpacity="0.5" /> 
      <circle cx="50" cy="80" r="4" fill={color} fillOpacity="0.5" /> 
      <circle cx="20" cy="50" r="4" fill={color} fillOpacity="0.5" /> 
      <circle cx="80" cy="50" r="6" fill={color} /> 

      <defs>
        <radialGradient id="logoGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(50 50) rotate(90) scale(45)">
          <stop stopColor={color} />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
