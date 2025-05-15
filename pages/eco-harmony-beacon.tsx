import React from 'react';

export default function EcoHarmonyBeacon() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-yellow-100 to-blue-300">
      <h1 className="text-4xl font-bold text-emerald-800 mb-4">Eco-Harmony Beacon</h1>
      <p className="max-w-xl text-center text-lg text-gray-700 mb-8">
        Pulses public lights with health-eco data, a viral urban icon. (Philips Hue API, Greengrass)
      </p>
      <div className="rounded-lg bg-white/80 p-6 shadow-lg">
        <span className="text-2xl">💡</span>
      </div>
    </div>
  );
} 