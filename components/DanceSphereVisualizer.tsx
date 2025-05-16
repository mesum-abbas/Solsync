import React, { useEffect, useRef, useState } from 'react';
import { DanceMove, DancePosition } from '../types/dance';

const WIDTH = 400;
const HEIGHT = 300;
const SPHERE_RADIUS = 100;
const TRAIL_LENGTH = 12;

function sphereToScreen(lat: number, lng: number) {
  // Spherical to 2D projection
  const theta = (lat + 0.5) * Math.PI; // [-0.5,0.5] -> [0,PI]
  const phi = (lng + 0.5) * 2 * Math.PI; // [-0.5,0.5] -> [0,2PI]
  const x = Math.sin(theta) * Math.cos(phi);
  const y = Math.cos(theta);
  return {
    sx: WIDTH / 2 + x * SPHERE_RADIUS,
    sy: HEIGHT / 2 + y * SPHERE_RADIUS,
  };
}

function screenToSphereCoords(sx: number, sy: number) {
  // Approximate inverse for click (z=0)
  const dx = (sx - WIDTH / 2) / SPHERE_RADIUS;
  const dy = (sy - HEIGHT / 2) / SPHERE_RADIUS;
  const lat = Math.acos(dy) / Math.PI - 0.5;
  const lng = Math.atan2(dx, Math.sqrt(1 - dx * dx - dy * dy)) / (2 * Math.PI) - 0.5;
  return { lat, lng, t: 0 };
}

const DANCE_STYLES = [
  { value: 'wave', label: 'Wave' },
  { value: 'spin', label: 'Spin' },
  { value: 'jump', label: 'Jump' },
  { value: 'step', label: 'Step' },
] as const;

type DanceStyle = typeof DANCE_STYLES[number]['value'];

export default function DanceSphereVisualizer() {
  const [moves, setMoves] = useState<DanceMove[]>([]);
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<DanceStyle>('wave');
  const requestRef = useRef<number>();

  // Fetch moves from backend
  const fetchMoves = async () => {
    const res = await fetch('/api/dance');
    const data = await res.json();
    setMoves(data.moves);
  };

  useEffect(() => {
    fetchMoves();
    const interval = setInterval(fetchMoves, 2000);
    return () => clearInterval(interval);
  }, []);

  // Animate moves (dancing effect)
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    requestRef.current = requestAnimationFrame(() => setFrame(f => f + 1));
    return () => cancelAnimationFrame(requestRef.current!);
  }, [frame]);

  // Add a new move via API
  const addMove = async (position: DancePosition, type: 'milestone' | 'celebration' | 'unity' | 'healing' = 'milestone') => {
    const res = await fetch('/api/dance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        intensity: 1,
        userId: 'demo-user',
        style: selectedStyle,
      }),
    });
    const data = await res.json();
    if (data && data.newMoves && data.newMoves.length > 0) {
      setHighlighted(data.newMoves[0].id);
      setTimeout(() => setHighlighted(null), 600);
    }
    fetchMoves();
  };

  // Handle click inside SVG
  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    const rect = (e.target as SVGSVGElement).getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const pos = screenToSphereCoords(sx, sy);
    addMove(pos);
  };

  // Handle button click (random position)
  const handleButtonClick = () => {
    const pos = {
      lat: (Math.random() - 0.5) * 1.2,
      lng: (Math.random() - 0.5) * 1.2,
      t: Math.random(),
    };
    addMove(pos);
  };

  // Render different dance styles
  function renderMove(move: DanceMove, t: number, isHighlighted: boolean) {
    const { sx, sy } = sphereToScreen(
      move.position.lat + 0.08 * Math.sin(t + move.intensity * 2),
      move.position.lng + 0.08 * Math.cos(t + move.intensity * 2)
    );
    const size = 16 + 10 * move.intensity * (isHighlighted ? 1.3 : 1);
    const opacity = isHighlighted ? 1 : 0.85;
    switch (move.style) {
      case 'wave':
        return <ellipse cx={sx} cy={sy} rx={size * 0.7} ry={size * 0.4} fill={move.color} opacity={opacity} />;
      case 'spin':
        return <circle cx={sx} cy={sy} r={size * 0.5} fill={move.color} opacity={opacity} />;
      case 'jump':
        return <rect x={sx - size * 0.3} y={sy - size * 0.5} width={size * 0.6} height={size} rx={size * 0.2} fill={move.color} opacity={opacity} />;
      case 'step':
        return <polygon points={[
          [sx, sy - size * 0.5],
          [sx - size * 0.3, sy + size * 0.5],
          [sx + size * 0.3, sy + size * 0.5],
        ].map(p => p.join(",")).join(" ")} fill={move.color} opacity={opacity} />;
      default:
        return null;
    }
  }

  // Render animated trail for a move
  function renderTrail(move: DanceMove, t: number) {
    const trail = [];
    for (let k = TRAIL_LENGTH; k > 0; k--) {
      const trailT = t - k * 0.07;
      const { sx, sy } = sphereToScreen(
        move.position.lat + 0.08 * Math.sin(trailT + move.intensity * 2),
        move.position.lng + 0.08 * Math.cos(trailT + move.intensity * 2)
      );
      const alpha = 0.08 + 0.12 * (k / TRAIL_LENGTH);
      trail.push(
        <circle
          key={k}
          cx={sx}
          cy={sy}
          r={6 + 4 * move.intensity * (k / TRAIL_LENGTH)}
          fill={move.color}
          opacity={alpha}
        />
      );
    }
    return trail;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2">
        <label className="mr-2 text-sm font-medium text-gray-700">Dance Style:</label>
        <select
          className="rounded border px-2 py-1 text-sm"
          value={selectedStyle}
          onChange={e => setSelectedStyle(e.target.value as DanceStyle)}
        >
          {DANCE_STYLES.map(style => (
            <option key={style.value} value={style.value}>{style.label}</option>
          ))}
        </select>
      </div>
      <svg
        width={WIDTH}
        height={HEIGHT}
        style={{ display: 'block', cursor: 'pointer', borderRadius: 16, background: 'linear-gradient(135deg, #ffe0f0 60%, #fff9c4 100%)' }}
        onClick={handleSvgClick}
      >
        {/* Sphere outline */}
        <ellipse
          cx={WIDTH / 2}
          cy={HEIGHT / 2}
          rx={SPHERE_RADIUS}
          ry={SPHERE_RADIUS}
          fill="#fff"
          fillOpacity={0.18}
          stroke="#f06292"
          strokeWidth={3}
        />
        {/* Dance moves and trails */}
        {moves.map((move, i) => {
          const t = (frame + i * 10) / 60;
          const isHighlighted = highlighted === move.id;
          return (
            <g key={move.id}>
              {renderTrail(move, t)}
              {renderMove(move, t, isHighlighted)}
            </g>
          );
        })}
      </svg>
      <button
        className="mt-4 px-4 py-2 bg-pink-400 text-white rounded shadow hover:bg-pink-500 transition"
        onClick={handleButtonClick}
      >
        Add Dance Move
      </button>
      <div className="text-xs text-gray-500 mt-2">Click inside the sphere to add a dance move!</div>
    </div>
  );
} 