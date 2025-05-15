import React, { useEffect, useRef, useState } from 'react';

function playBell() {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'sine';
  o.frequency.value = 880;
  g.gain.value = 0.2;
  o.connect(g).connect(ctx.destination);
  o.start();
  setTimeout(() => {
    o.frequency.value = 660;
    g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
  }, 120);
  o.stop(ctx.currentTime + 0.5);
  setTimeout(() => ctx.close(), 600);
}

export default function HarmonyPulseChime() {
  const [vitals, setVitals] = useState<number>(70);
  const [eco, setEco] = useState<number>(80);
  const [pulse, setPulse] = useState(false);
  const prevVitals = useRef(vitals);
  const prevEco = useRef(eco);

  // Simulate vitals and eco scores
  useEffect(() => {
    const interval = setInterval(() => {
      setVitals((v) => Math.min(100, Math.max(0, v + (Math.random() - 0.5) * 2)));
      setEco((e) => Math.min(100, Math.max(0, e + (Math.random() - 0.5) * 2)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Play bell and animate when scores change significantly
  useEffect(() => {
    if (Math.abs(vitals - prevVitals.current) > 2 || Math.abs(eco - prevEco.current) > 2) {
      setPulse(true);
      playBell();
      setTimeout(() => setPulse(false), 600);
    }
    prevVitals.current = vitals;
    prevEco.current = eco;
  }, [vitals, eco]);

  // Manual chime
  const handleChime = () => {
    setPulse(true);
    playBell();
    setTimeout(() => setPulse(false), 600);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-yellow-100 to-blue-200 py-8">
      <h1 className="text-4xl font-bold text-emerald-800 mb-2">Harmony Pulse Chime</h1>
      <p className="max-w-xl text-center text-lg text-gray-700 mb-4">
        Generates therapeutic bell sounds tied to vitals and eco-data, creating serene spaces via edge devices. (Audio APIs, Greengrass)
      </p>
      <div className="flex flex-col md:flex-row gap-8 items-center w-full justify-center">
        <div className="flex flex-col items-center">
          <div
            className={`rounded-full shadow-lg border border-blue-200 bg-white mb-4 flex items-center justify-center transition-all duration-300 ${pulse ? 'scale-125 ring-4 ring-blue-300' : 'scale-100'}`}
            style={{ width: 120, height: 120, fontSize: 64 }}
          >
            🔔
          </div>
          <button
            onClick={handleChime}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            Play Chime
          </button>
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="bg-white/80 rounded-xl shadow p-6 min-w-[180px]">
            <div className="text-2xl font-bold text-blue-700 mb-2">Vitals</div>
            <div className="text-4xl font-extrabold text-blue-600 mb-2">{vitals.toFixed(1)}%</div>
            <div className="text-gray-500">Simulated patient vitals</div>
          </div>
          <div className="bg-white/80 rounded-xl shadow p-6 min-w-[180px]">
            <div className="text-2xl font-bold text-blue-700 mb-2">Eco Score</div>
            <div className="text-4xl font-extrabold text-emerald-600 mb-2">{eco.toFixed(1)}%</div>
            <div className="text-gray-500">Simulated eco-data</div>
          </div>
        </div>
      </div>
    </div>
  );
} 