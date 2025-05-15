import React, { useRef, useEffect, useState } from 'react';

export default function CommunityGlowSphere() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [milestones, setMilestones] = useState<number>(5);
  const [pulse, setPulse] = useState(false);

  // Animate glowing sphere
  useEffect(() => {
    let frame = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    let animId: number;
    function drawSphere() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      // Pulse effect
      const pulseScale = 1 + (pulse ? 0.25 * Math.sin(frame / 4) : 0.1 * Math.sin(frame / 12));
      const glowAlpha = pulse ? 0.25 + 0.15 * Math.abs(Math.sin(frame / 4)) : 0.18 + 0.08 * Math.abs(Math.sin(frame / 12));
      // Glow
      for (let i = 6; i >= 1; i--) {
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, 60 * pulseScale + i * 12, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(255, 180, 0, ${glowAlpha * i / 6})`;
        ctx.fill();
      }
      // Sphere core
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 60 * pulseScale, 0, 2 * Math.PI);
      ctx.fillStyle = 'orange';
      ctx.shadowColor = 'gold';
      ctx.shadowBlur = 30 + 10 * pulseScale;
      ctx.fill();
      ctx.shadowBlur = 0;
      // Sphere highlight
      ctx.beginPath();
      ctx.arc(width / 2 + 18, height / 2 - 18, 18 * pulseScale, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(255,255,255,0.18)';
      ctx.fill();
    }
    function animate() {
      drawSphere();
      frame++;
      animId = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(animId);
  }, [pulse]);

  // Simulate new milestones
  useEffect(() => {
    const interval = setInterval(() => {
      setMilestones((m) => m + 1);
      setPulse(true);
      setTimeout(() => setPulse(false), 1000);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Manual trigger
  const handleMilestone = () => {
    setMilestones((m) => m + 1);
    setPulse(true);
    setTimeout(() => setPulse(false), 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-yellow-100 to-pink-200 py-8">
      <h1 className="text-4xl font-bold text-emerald-800 mb-2">Community Glow Sphere</h1>
      <p className="max-w-xl text-center text-lg text-gray-700 mb-4">
        Visualizes support as a radiant AR sphere, pulsing with eco-milestones, fostering connection. (Unity, Amplify)
      </p>
      <div className="flex flex-col md:flex-row gap-8 items-center w-full justify-center">
        <div className="flex flex-col items-center">
          <canvas
            ref={canvasRef}
            width={240}
            height={240}
            className="rounded-full shadow-lg border border-yellow-200 bg-white mb-4"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
          <button
            onClick={handleMilestone}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors shadow-md"
          >
            ✨ New Eco-Milestone
          </button>
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="bg-white/80 rounded-xl shadow p-6 min-w-[180px]">
            <div className="text-2xl font-bold text-yellow-700 mb-2">Eco-Milestones</div>
            <div className="text-4xl font-extrabold text-orange-500 mb-2">{milestones}</div>
            <div className="text-gray-500">Community support events</div>
          </div>
        </div>
      </div>
    </div>
  );
} 