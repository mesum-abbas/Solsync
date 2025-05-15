import React from 'react';

export default function PlanetaryWellnessCanvas() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-100 to-blue-200">
      <h1 className="text-4xl font-bold text-emerald-800 mb-4">Planetary Wellness Canvas</h1>
      <p className="max-w-xl text-center text-lg text-gray-700 mb-8">
        Visualizes global health-eco patterns as pulsing landscapes, trending for its scale. (D3.js, Amplify)
      </p>
      <div className="rounded-lg bg-white/80 p-6 shadow-lg">
        <span className="text-2xl">🌍</span>
      </div>
    </div>
  );
} 