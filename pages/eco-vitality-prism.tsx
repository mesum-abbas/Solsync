import React from 'react';
import PrismVisualizer from '../components/PrismVisualizer';

export default function EcoVitalityPrism() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-100 to-blue-200">
      <h1 className="text-4xl font-bold text-emerald-800 mb-4">Eco-Vitality Prism</h1>
      <p className="max-w-xl text-center text-lg text-gray-700 mb-8">
        Projects 3D holographic health-eco patterns, engaging with futuristic visuals. (Unity, Greengrass)
      </p>
      <div className="rounded-lg bg-white/80 p-6 shadow-lg">
        <PrismVisualizer />
      </div>
    </div>
  );
} 