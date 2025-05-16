import React, { useEffect, useRef, useState } from 'react';
import { PetalData, Vector3 } from '../types/petals';

const WIDTH = 400;
const HEIGHT = 300;

function mapToScreen(x: number, y: number) {
  // Map 3D petal positions to 2D SVG coordinates (centered)
  return {
    sx: WIDTH / 2 + x * 120,
    sy: HEIGHT / 2 - y * 120,
  };
}

function screenToPetalCoords(sx: number, sy: number) {
  // Map SVG screen coordinates back to petal 3D space (x, y)
  return {
    x: (sx - WIDTH / 2) / 120,
    y: (HEIGHT / 2 - sy) / 120,
    z: 0,
  };
}

export default function PetalVortexVisualizer() {
  const [petals, setPetals] = useState<PetalData[]>([]);
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const requestRef = useRef<number>();

  // Fetch petals from backend
  const fetchPetals = async () => {
    const res = await fetch('/api/petals');
    const data = await res.json();
    setPetals(data.petals);
  };

  useEffect(() => {
    fetchPetals();
    // Poll every 2 seconds for new petals
    const interval = setInterval(fetchPetals, 2000);
    return () => clearInterval(interval);
  }, []);

  // Animate petals (simple floating effect)
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    requestRef.current = requestAnimationFrame(() => setFrame(f => f + 1));
    return () => cancelAnimationFrame(requestRef.current!);
  }, [frame]);

  // Add a new petal via API
  const addPetal = async (position: Vector3) => {
    const res = await fetch('/api/petals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'uplift',
        position,
        intensity: 1,
        userId: 'demo-user',
      }),
    });
    const data = await res.json();
    if (data && data.newPetals && data.newPetals.length > 0) {
      setHighlighted(data.newPetals[0].id);
      setTimeout(() => setHighlighted(null), 600);
    }
    fetchPetals();
  };

  // Handle click inside SVG
  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    const rect = (e.target as SVGSVGElement).getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const pos = screenToPetalCoords(sx, sy);
    addPetal(pos);
  };

  // Handle button click (random position)
  const handleButtonClick = () => {
    const pos = { x: (Math.random() - 0.5) * 1.2, y: (Math.random() - 0.5) * 1.2, z: 0 };
    addPetal(pos);
  };

  return (
    <div className="flex flex-col items-center">
      <svg
        width={WIDTH}
        height={HEIGHT}
        style={{ display: 'block', cursor: 'pointer', borderRadius: 16 }}
        onClick={handleSvgClick}
      >
        <defs>
          <radialGradient id="petalGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
        </defs>
        {petals.map((petal, i) => {
          const t = (frame + i * 10) / 60;
          // Animate a gentle swirling/floating effect
          const swirl = Math.sin(t + i) * 0.1;
          const float = Math.cos(t + i) * 0.05;
          const { sx, sy } = mapToScreen(petal.position.x + swirl, petal.position.y + float);
          const isHighlighted = highlighted === petal.id;
          return (
            <g key={petal.id} transform={`translate(${sx},${sy}) rotate(${petal.rotation.z})`}>
              <ellipse
                cx={0}
                cy={0}
                rx={18 * petal.size * (isHighlighted ? 1.2 : 1)}
                ry={8 * petal.size * (isHighlighted ? 1.2 : 1)}
                fill={petal.color}
                fillOpacity={isHighlighted ? 1 : 0.85}
                stroke="#fff"
                strokeWidth={isHighlighted ? 4 : 2}
                filter="url(#petalShadow)"
                style={{ transition: 'all 0.3s' }}
              />
              <ellipse
                cx={0}
                cy={0}
                rx={18 * petal.size * (isHighlighted ? 1.2 : 1)}
                ry={8 * petal.size * (isHighlighted ? 1.2 : 1)}
                fill="url(#petalGradient)"
                style={{ transition: 'all 0.3s' }}
              />
            </g>
          );
        })}
        {/* Optional: add a soft shadow under the petals */}
        <filter id="petalShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.15" />
        </filter>
      </svg>
      <button
        className="mt-4 px-4 py-2 bg-pink-400 text-white rounded shadow hover:bg-pink-500 transition"
        onClick={handleButtonClick}
      >
        Uplift (Add Petal)
      </button>
      <div className="text-xs text-gray-500 mt-2">Click inside the vortex to add a petal at that spot!</div>
    </div>
  );
} 