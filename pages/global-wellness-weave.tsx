import React, { useRef, useEffect, useState } from 'react';

const colors = [
  '#10b981', // green
  '#f59e42', // orange
  '#3b82f6', // blue
  '#a21caf', // purple
  '#f43f5e', // pink
];

export default function GlobalWellnessWeave() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [streams, setStreams] = useState<number[]>([60, 70, 80, 65, 75]);
  const [patternSeed, setPatternSeed] = useState(0);

  // Animate tapestry
  useEffect(() => {
    let frame = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    let animId: number;
    function drawWeave() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      // Draw threads
      for (let s = 0; s < streams.length; s++) {
        ctx.save();
        ctx.beginPath();
        for (let x = 0; x <= width; x += 8) {
          const y =
            height / 2 +
            Math.sin(
              (x / width) * Math.PI * 2 * (1 + s * 0.2 + patternSeed * 0.1) +
                frame / (30 + s * 10) +
                s * 0.7
            ) *
              (30 + streams[s]) /
              4;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = colors[s % colors.length];
        ctx.lineWidth = 3 + (streams[s] / 50);
        ctx.globalAlpha = 0.7;
        ctx.shadowColor = colors[s % colors.length];
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
        ctx.restore();
      }
    }
    function animate() {
      drawWeave();
      frame++;
      animId = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(animId);
  }, [streams, patternSeed]);

  // Simulate data streams
  useEffect(() => {
    const interval = setInterval(() => {
      setStreams((arr) =>
        arr.map((v) => Math.min(100, Math.max(0, v + (Math.random() - 0.5) * 2)))
      );
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  // Manual pattern trigger
  const handlePattern = () => {
    setPatternSeed((seed) => seed + 1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-100 to-yellow-200 py-8">
      <h1 className="text-4xl font-bold text-emerald-800 mb-2">Global Wellness Weave</h1>
      <p className="max-w-xl text-center text-lg text-gray-700 mb-4">
        Crafts a web-based tapestry of health-eco data, trending for its intricate visuals. (D3.js, Amplify)
      </p>
      <div className="flex flex-col md:flex-row gap-8 items-center w-full justify-center">
        <div className="flex flex-col items-center">
          <canvas
            ref={canvasRef}
            width={400}
            height={220}
            className="rounded-2xl shadow-lg border border-green-200 bg-white mb-4"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
          <button
            onClick={handlePattern}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-md"
          >
            🧵 New Weave Pattern
          </button>
        </div>
        <div className="flex flex-col items-center gap-4">
          {streams.map((v, i) => (
            <div key={i} className="bg-white/80 rounded-xl shadow p-4 min-w-[160px] flex items-center gap-2">
              <span className="inline-block w-4 h-4 rounded-full" style={{ background: colors[i % colors.length] }}></span>
              <span className="text-lg font-bold text-gray-700">Stream {i + 1}:</span>
              <span className="text-lg font-extrabold text-emerald-600">{v.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 