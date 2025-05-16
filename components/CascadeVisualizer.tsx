import React, { useEffect, useRef, useState } from 'react';
import { WaterDrop, DropPosition } from '../types/cascade';

const WIDTH = 400;
const HEIGHT = 300;

function mapToScreen(x: number, y: number) {
  return {
    sx: x * WIDTH,
    sy: y * HEIGHT,
  };
}

function screenToDropCoords(sx: number, sy: number) {
  return {
    x: sx / WIDTH,
    y: sy / HEIGHT,
  };
}

export default function CascadeVisualizer() {
  const [drops, setDrops] = useState<WaterDrop[]>([]);
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const requestRef = useRef<number>();

  // Fetch drops from backend
  const fetchDrops = async () => {
    const res = await fetch('/api/cascade');
    const data = await res.json();
    setDrops(data.drops);
  };

  useEffect(() => {
    fetchDrops();
    const interval = setInterval(fetchDrops, 2000);
    return () => clearInterval(interval);
  }, []);

  // Animate drops (falling effect)
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    requestRef.current = requestAnimationFrame(() => setFrame(f => f + 1));
    return () => cancelAnimationFrame(requestRef.current!);
  }, [frame]);

  // Add a new drop via API
  const addDrop = async (position: DropPosition, type: 'inhale' | 'exhale' | 'hold' = 'inhale') => {
    const res = await fetch('/api/cascade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        intensity: 1,
        userId: 'demo-user',
      }),
    });
    const data = await res.json();
    if (data && data.newDrops && data.newDrops.length > 0) {
      setHighlighted(data.newDrops[0].id);
      setTimeout(() => setHighlighted(null), 600);
    }
    fetchDrops();
  };

  // Handle click inside SVG
  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    const rect = (e.target as SVGSVGElement).getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const pos = screenToDropCoords(sx, sy);
    addDrop(pos);
  };

  // Handle button click (random x position at top)
  const handleButtonClick = () => {
    const pos = { x: 0.1 + Math.random() * 0.8, y: 0.05 };
    addDrop(pos);
  };

  return (
    <div className="flex flex-col items-center">
      <svg
        width={WIDTH}
        height={HEIGHT}
        style={{ display: 'block', cursor: 'pointer', borderRadius: 16, background: 'linear-gradient(to bottom, #e3f2fd 60%, #b2dfdb 100%)' }}
        onClick={handleSvgClick}
      >
        {drops.map((drop, i) => {
          // Animate falling
          const t = (frame + i * 10) / 60;
          let y = drop.position.y + drop.velocity * t;
          if (y > 1.05) y = 1.05; // Stop at bottom
          const { sx, sy } = mapToScreen(drop.position.x, y);
          const isHighlighted = highlighted === drop.id;
          return (
            <g key={drop.id} transform={`translate(${sx},${sy})`}>
              <ellipse
                cx={0}
                cy={0}
                rx={14 * drop.size * (isHighlighted ? 1.2 : 1)}
                ry={22 * drop.size * (isHighlighted ? 1.2 : 1)}
                fill={drop.color}
                fillOpacity={isHighlighted ? 1 : 0.85}
                stroke="#0288D1"
                strokeWidth={isHighlighted ? 4 : 2}
                style={{ transition: 'all 0.3s' }}
              />
              <ellipse
                cx={0}
                cy={-8 * drop.size}
                rx={6 * drop.size}
                ry={4 * drop.size}
                fill="#fff"
                fillOpacity={0.25}
              />
            </g>
          );
        })}
      </svg>
      <button
        className="mt-4 px-4 py-2 bg-blue-400 text-white rounded shadow hover:bg-blue-500 transition"
        onClick={handleButtonClick}
      >
        Sync Breath (Add Drop)
      </button>
      <div className="text-xs text-gray-500 mt-2">Click inside the cascade to add a drop at that spot!</div>
    </div>
  );
} 