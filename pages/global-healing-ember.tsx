import React, { useRef, useEffect, useState } from 'react';

export default function GlobalHealingEmber() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [recovery, setRecovery] = useState<number>(70);
  const [eco, setEco] = useState<number>(80);
  const [copied, setCopied] = useState(false);

  // Animate ember
  useEffect(() => {
    let frame = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    let animId: number;
    function drawEmber() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      // Pulsate based on scores
      const pulse = 1 + 0.15 * Math.sin(frame / 20);
      const emberRadius = 60 + (recovery + eco) * 0.2 * pulse;
      // Glow
      for (let i = 6; i >= 1; i--) {
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, emberRadius + i * 12, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(255, ${180 - i * 20}, 0, ${0.04 * i})`;
        ctx.fill();
      }
      // Ember core
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, emberRadius, 0, 2 * Math.PI);
      ctx.fillStyle = 'orange';
      ctx.shadowColor = 'gold';
      ctx.shadowBlur = 30 + 10 * pulse;
      ctx.fill();
      ctx.shadowBlur = 0;
      // Ember highlight
      ctx.beginPath();
      ctx.arc(width / 2 + 18, height / 2 - 18, emberRadius * 0.3, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(255,255,255,0.18)';
      ctx.fill();
    }
    function animate() {
      drawEmber();
      frame++;
      animId = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(animId);
  }, [recovery, eco]);

  // Simulate scores
  useEffect(() => {
    const interval = setInterval(() => {
      setRecovery((r) => Math.min(100, Math.max(0, r + (Math.random() - 0.5) * 2)));
      setEco((e) => Math.min(100, Math.max(0, e + (Math.random() - 0.5) * 2)));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  // Share handler
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-orange-100 to-red-200 py-8">
      <h1 className="text-4xl font-bold text-emerald-800 mb-2">Global Healing Ember</h1>
      <p className="max-w-xl text-center text-lg text-gray-700 mb-4">
        Visualizes recovery and eco-data as a pulsating virtual ember on a web dashboard, amplified by X sharing for viral impact. (D3.js, API Gateway)
      </p>
      <div className="flex flex-col md:flex-row gap-8 items-center w-full justify-center">
        <div className="flex flex-col items-center">
          <canvas
            ref={canvasRef}
            width={320}
            height={320}
            className="rounded-full shadow-lg border border-orange-200 bg-white mb-4"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
          <button
            onClick={handleShare}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors shadow-md"
          >
            🔗 Share Ember
          </button>
          {copied && <div className="text-green-600 mt-2 text-sm font-medium">Link copied!</div>}
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="bg-white/80 rounded-xl shadow p-6 min-w-[180px]">
            <div className="text-2xl font-bold text-orange-700 mb-2">Recovery Score</div>
            <div className="text-4xl font-extrabold text-red-600 mb-2">{recovery.toFixed(1)}%</div>
            <div className="text-gray-500">Simulated recovery</div>
          </div>
          <div className="bg-white/80 rounded-xl shadow p-6 min-w-[180px]">
            <div className="text-2xl font-bold text-orange-700 mb-2">Eco Score</div>
            <div className="text-4xl font-extrabold text-amber-600 mb-2">{eco.toFixed(1)}%</div>
            <div className="text-gray-500">Simulated eco-data</div>
          </div>
        </div>
      </div>
    </div>
  );
} 