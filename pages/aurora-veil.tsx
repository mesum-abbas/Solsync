import React, { useRef, useEffect, useState } from 'react';

// Aurora color palettes
const auroraPalettes: string[][] = [
  ['#a1c4fd', '#c2e9fb', '#fbc2eb', '#a6c1ee'],
  ['#fbc2eb', '#fdcbf1', '#a1c4fd', '#c2e9fb'],
  ['#a8edea', '#fed6e3', '#fcb69f', '#ffdde1'],
  ['#f5f7fa', '#c3cfe2', '#e0c3fc', '#8ec5fc'],
];

function drawAurora(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  palette: string[],
  intensity: number
) {
  ctx.clearRect(0, 0, width, height);
  for (let i = 0; i < palette.length; i++) {
    const grad = ctx.createLinearGradient(0, height * 0.2 * i, width, height * 0.8);
    grad.addColorStop(0, palette[i]);
    grad.addColorStop(1, 'transparent');
    ctx.globalAlpha = 0.3 + 0.15 * intensity;
    ctx.beginPath();
    ctx.moveTo(0, height * (0.2 + 0.15 * i));
    for (let x = 0; x <= width; x += 10) {
      ctx.lineTo(
        x,
        height * (0.2 + 0.15 * i) +
          Math.sin((x / width) * Math.PI * 2 + i + intensity) * 30 * (1 + intensity)
      );
    }
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

export default function AuroraVeil() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [recovery, setRecovery] = useState<number>(60); // Simulated recovery score
  const [ecoActions, setEcoActions] = useState<number>(0);
  const [paletteIdx, setPaletteIdx] = useState<number>(0);
  const [intensity, setIntensity] = useState<number>(1);

  // Animate aurora
  useEffect(() => {
    let frame = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    let animId: number;
    function animate() {
      if (ctx) {
        drawAurora(ctx, width, height, auroraPalettes[paletteIdx], intensity + Math.sin(frame / 60) * 0.5);
      }
      frame++;
      animId = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(animId);
  }, [paletteIdx, intensity]);

  // Simulate recovery score
  useEffect(() => {
    const interval = setInterval(() => {
      setRecovery((r) => Math.min(100, Math.max(0, r + (Math.random() - 0.4) * 2)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Eco-action handler
  const handleEcoAction = () => {
    setEcoActions((c) => c + 1);
    setPaletteIdx((idx) => (idx + 1) % auroraPalettes.length);
    setIntensity((i) => Math.min(2, i + 0.3));
    setTimeout(() => setIntensity(1), 1200);
  };

  // Download snapshot
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'aurora-snapshot.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-purple-200 py-8">
      <h1 className="text-4xl font-bold text-emerald-800 mb-2">Vitality Aurora Veil</h1>
      <p className="max-w-xl text-center text-lg text-gray-700 mb-4">
        Projects patient recovery as a dynamic AR aurora, with community support and eco-actions (e.g., cleanups) adding vibrant color waves, captivating users with its ethereal, shareable visuals. (Unity, Bedrock)
      </p>
      <div className="flex flex-col md:flex-row gap-8 items-center w-full justify-center">
        <div className="flex flex-col items-center">
          <canvas
            ref={canvasRef}
            width={480}
            height={320}
            className="rounded-2xl shadow-lg border border-emerald-200 bg-white mb-4"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
          <div className="flex gap-4 mt-2">
            <button
              onClick={handleEcoAction}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors shadow-md"
            >
              🌱 Simulate Eco-Action
            </button>
            <button
              onClick={handleDownload}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors shadow-md"
            >
              📸 Download Snapshot
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="bg-white/80 rounded-xl shadow p-6 min-w-[220px]">
            <div className="text-2xl font-bold text-emerald-700 mb-2">Recovery Score</div>
            <div className="text-4xl font-extrabold text-purple-600 mb-2">{recovery.toFixed(1)}%</div>
            <div className="text-gray-500">Simulated patient recovery</div>
          </div>
          <div className="bg-white/80 rounded-xl shadow p-6 min-w-[220px]">
            <div className="text-2xl font-bold text-emerald-700 mb-2">Eco-Actions</div>
            <div className="text-4xl font-extrabold text-green-600 mb-2">{ecoActions}</div>
            <div className="text-gray-500">Community cleanups & actions</div>
          </div>
        </div>
      </div>
    </div>
  );
} 