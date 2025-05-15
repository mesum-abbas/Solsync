import React, { useRef, useEffect, useState } from 'react';

const patterns = [
  'circle',
  'wave',
  'spiral',
  'heart',
];

function getPatternCoords(pattern: string, count: number, t: number): [number, number][] {
  const coords: [number, number][] = [];
  const cx = 180, cy = 120, r = 80;
  for (let i = 0; i < count; i++) {
    const a = (2 * Math.PI * i) / count + t;
    if (pattern === 'circle') {
      coords.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    } else if (pattern === 'wave') {
      coords.push([cx + (i - count / 2) * 12, cy + Math.sin(a + t) * 60]);
    } else if (pattern === 'spiral') {
      const spiralR = r * (i / count);
      coords.push([cx + spiralR * Math.cos(a + t), cy + spiralR * Math.sin(a + t)]);
    } else if (pattern === 'heart') {
      // Heart parametric
      const th = a;
      const x = 16 * Math.pow(Math.sin(th), 3);
      const y = 13 * Math.cos(th) - 5 * Math.cos(2 * th) - 2 * Math.cos(3 * th) - Math.cos(4 * th);
      coords.push([cx + x * 5, cy - y * 5]);
    }
  }
  return coords;
}

export default function VitalitySkyMosaic() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [recovery, setRecovery] = useState<number>(70);
  const [patternIdx, setPatternIdx] = useState(0);
  const [showPulse, setShowPulse] = useState(false);

  // Animate drones
  useEffect(() => {
    let frame = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    let animId: number;
    function drawDrones() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      // Sky background
      ctx.fillStyle = 'rgba(180, 210, 255, 0.18)';
      ctx.fillRect(0, 0, width, height);
      // Drones
      const count = Math.floor(12 + (recovery / 100) * 18);
      const coords = getPatternCoords(patterns[patternIdx], count, frame / 40);
      for (let i = 0; i < coords.length; i++) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(coords[i][0], coords[i][1], showPulse ? 13 : 9, 0, 2 * Math.PI);
        ctx.fillStyle = showPulse ? 'gold' : '#4f46e5';
        ctx.shadowColor = showPulse ? 'gold' : '#a5b4fc';
        ctx.shadowBlur = showPulse ? 18 : 8;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();
      }
    }
    function animate() {
      drawDrones();
      frame++;
      animId = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(animId);
  }, [patternIdx, recovery, showPulse]);

  // Simulate recovery score
  useEffect(() => {
    const interval = setInterval(() => {
      setRecovery((r) => Math.min(100, Math.max(0, r + (Math.random() - 0.5) * 2)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Manual pattern trigger
  const handlePattern = () => {
    setPatternIdx((idx) => (idx + 1) % patterns.length);
    setShowPulse(true);
    setTimeout(() => setShowPulse(false), 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-indigo-200 py-8">
      <h1 className="text-4xl font-bold text-emerald-800 mb-2">Vitality Sky Mosaic</h1>
      <p className="max-w-xl text-center text-lg text-gray-700 mb-4">
        Forms recovery patterns in the sky via synchronized drones, a stunning public spectacle. (IoT Core, Bedrock)
      </p>
      <div className="flex flex-col md:flex-row gap-8 items-center w-full justify-center">
        <div className="flex flex-col items-center">
          <canvas
            ref={canvasRef}
            width={360}
            height={240}
            className="rounded-2xl shadow-lg border border-indigo-200 bg-white mb-4"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
          <button
            onClick={handlePattern}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
          >
            ✨ New Sky Pattern
          </button>
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="bg-white/80 rounded-xl shadow p-6 min-w-[180px]">
            <div className="text-2xl font-bold text-indigo-700 mb-2">Recovery Score</div>
            <div className="text-4xl font-extrabold text-indigo-600 mb-2">{recovery.toFixed(1)}%</div>
            <div className="text-gray-500">Simulated recovery</div>
          </div>
          <div className="bg-white/80 rounded-xl shadow p-6 min-w-[180px]">
            <div className="text-2xl font-bold text-indigo-700 mb-2">Pattern</div>
            <div className="text-2xl font-semibold text-indigo-500 mb-2">{patterns[patternIdx]}</div>
            <div className="text-gray-500">Current drone formation</div>
          </div>
        </div>
      </div>
    </div>
  );
} 