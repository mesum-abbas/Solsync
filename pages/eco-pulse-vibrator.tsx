import React from 'react';

export default function EcoPulseVibrator() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-100 to-gray-200">
      <h1 className="text-4xl font-bold text-emerald-800 mb-4">Eco-Pulse Vibrator</h1>
      <p className="max-w-xl text-center text-lg text-gray-700 mb-8">
        Adjusts room vibrations to vitals and eco-data, creating therapeutic environments. (Greengrass, Arduino)
      </p>
      <div className="rounded-lg bg-white/80 p-6 shadow-lg">
        <span className="text-2xl">🎛️</span>
      </div>
    </div>
  );
} 