import React, { useEffect, useRef, useState } from 'react';
import { PrismPattern, PrismPosition } from '../types/prism';

const WIDTH = 400;
const HEIGHT = 300;

function mapToScreen(x: number, y: number, z: number) {
  // Simple 3D to 2D projection (simulate depth)
  const scale = 1 + z * 0.3;
  return {
    sx: WIDTH / 2 + x * 120 * scale,
    sy: HEIGHT / 2 - y * 120 * scale,
    scale: 0.7 + scale * 0.5,
  };
}

function screenToPrismCoords(sx: number, sy: number) {
  // Map SVG screen coordinates back to 3D space (z=0)
  return {
    x: (sx - WIDTH / 2) / 120,
    y: (HEIGHT / 2 - sy) / 120,
    z: 0,
  };
}

export default function PrismVisualizer() {
  const [patterns, setPatterns] = useState<PrismPattern[]>([]);
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const requestRef = useRef<number>();

  // Fetch patterns from backend
  const fetchPatterns = async () => {
    const res = await fetch('/api/prism');
    const data = await res.json();
    setPatterns(data.patterns);
  };

  useEffect(() => {
    fetchPatterns();
    const interval = setInterval(fetchPatterns, 2000);
    return () => clearInterval(interval);
  }, []);

  // Animate patterns (rotation, glow, etc.)
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    requestRef.current = requestAnimationFrame(() => setFrame(f => f + 1));
    return () => cancelAnimationFrame(requestRef.current!);
  }, [frame]);

  // Add a new pattern via API
  const addPattern = async (position: PrismPosition, type: 'energy' | 'balance' | 'growth' | 'focus' = 'energy') => {
    const res = await fetch('/api/prism', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        intensity: 1,
        userId: 'demo-user',
      }),
    });
    const data = await res.json();
    if (data && data.newPatterns && data.newPatterns.length > 0) {
      setHighlighted(data.newPatterns[0].id);
      setTimeout(() => setHighlighted(null), 600);
    }
    fetchPatterns();
  };

  // Handle click inside SVG
  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    const rect = (e.target as SVGSVGElement).getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const pos = screenToPrismCoords(sx, sy);
    addPattern(pos);
  };

  // Handle button click (random position)
  const handleButtonClick = () => {
    const pos = {
      x: (Math.random() - 0.5) * 1.2,
      y: (Math.random() - 0.5) * 1.2,
      z: (Math.random() - 0.5) * 1.2,
    };
    addPattern(pos);
  };

  // Render different shapes
  function renderShape(pattern: PrismPattern, t: number, isHighlighted: boolean) {
    const { sx, sy, scale } = mapToScreen(pattern.position.x, pattern.position.y, pattern.position.z);
    const glow = pattern.glow * (isHighlighted ? 1.5 : 1) * (1 + 0.2 * Math.sin(t));
    const size = pattern.size * (isHighlighted ? 1.2 : 1) * scale * 22;
    const rotate = t * 30 + pattern.rotation.z;
    const commonProps = {
      fill: pattern.color,
      filter: `url(#prismGlow)`,
      opacity: 0.8,
      style: { transition: 'all 0.3s' },
    };
    switch (pattern.shape) {
      case 'sphere':
        return <ellipse cx={sx} cy={sy} rx={size} ry={size} {...commonProps} />;
      case 'cube':
        return <rect x={sx - size} y={sy - size} width={size * 2} height={size * 2} rx={size * 0.2} transform={`rotate(${rotate},${sx},${sy})`} {...commonProps} />;
      case 'pyramid':
        return <polygon points={[
          [sx, sy - size],
          [sx - size, sy + size],
          [sx + size, sy + size],
        ].map(p => p.join(",")).join(" ")} fill={pattern.color} opacity={0.85} filter="url(#prismGlow)" />;
      case 'torus':
        return <ellipse cx={sx} cy={sy} rx={size * 1.2} ry={size * 0.7} stroke={pattern.color} strokeWidth={size * 0.4} fill="none" opacity={0.7} filter="url(#prismGlow)" />;
      default:
        return null;
    }
  }

  return (
    <div className="flex flex-col items-center">
      <svg
        width={WIDTH}
        height={HEIGHT}
        style={{ display: 'block', cursor: 'pointer', borderRadius: 16, background: 'linear-gradient(135deg, #ede7f6 60%, #e3f2fd 100%)' }}
        onClick={handleSvgClick}
      >
        <defs>
          <filter id="prismGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {patterns.map((pattern, i) => {
          const t = (frame + i * 10) / 60;
          const isHighlighted = highlighted === pattern.id;
          return (
            <g key={pattern.id}>
              {renderShape(pattern, t, isHighlighted)}
              {/* Futuristic grid lines */}
              <ellipse
                cx={mapToScreen(pattern.position.x, pattern.position.y, pattern.position.z).sx}
                cy={mapToScreen(pattern.position.x, pattern.position.y, pattern.position.z).sy}
                rx={pattern.size * 30 * (1.2 + 0.2 * Math.sin(t))}
                ry={pattern.size * 10 * (1.2 + 0.2 * Math.cos(t))}
                fill="none"
                stroke="#fff"
                strokeDasharray="6 6"
                opacity={0.18}
                style={{ transition: 'all 0.3s' }}
              />
            </g>
          );
        })}
      </svg>
      <button
        className="mt-4 px-4 py-2 bg-purple-500 text-white rounded shadow hover:bg-purple-600 transition"
        onClick={handleButtonClick}
      >
        Project Pattern
      </button>
      <div className="text-xs text-gray-500 mt-2">Click inside the prism to project a new pattern!</div>
    </div>
  );
} 