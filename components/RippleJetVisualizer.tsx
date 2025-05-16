import React, { useEffect, useRef, useState } from 'react';
import { WaterJet, JetPosition } from '../types/ripple';

const WIDTH = 400;
const HEIGHT = 300;

function mapToScreen(x: number, y: number) {
  return {
    sx: x * WIDTH,
    sy: y * HEIGHT,
  };
}

function screenToJetCoords(sx: number, sy: number) {
  return {
    x: sx / WIDTH,
    y: sy / HEIGHT,
  };
}

export default function RippleJetVisualizer() {
  const [jets, setJets] = useState<WaterJet[]>([]);
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const [splashJets, setSplashJets] = useState<string[]>([]);
  const requestRef = useRef<number>();

  // Fetch jets from backend
  const fetchJets = async () => {
    const res = await fetch('/api/ripple');
    const data = await res.json();
    setJets(data.jets);
  };

  useEffect(() => {
    fetchJets();
    const interval = setInterval(fetchJets, 2000);
    return () => clearInterval(interval);
  }, []);

  // Animate jets (ripple and jet effect)
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    requestRef.current = requestAnimationFrame(() => setFrame(f => f + 1));
    return () => cancelAnimationFrame(requestRef.current!);
  }, [frame]);

  // Add a new jet via API
  const addJet = async (position: JetPosition, type: 'hope' | 'support' | 'celebrate' = 'hope') => {
    const res = await fetch('/api/ripple', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        intensity: 1,
        userId: 'demo-user',
      }),
    });
    const data = await res.json();
    if (data && data.newJets && data.newJets.length > 0) {
      setHighlighted(data.newJets[0].id);
      setSplashJets(jets => [...jets, data.newJets[0].id]);
      setTimeout(() => setHighlighted(null), 600);
      setTimeout(() => setSplashJets(jets => jets.filter(j => j !== data.newJets[0].id)), 700);
    }
    fetchJets();
  };

  // Handle click inside SVG
  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    const rect = (e.target as SVGSVGElement).getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const pos = screenToJetCoords(sx, sy);
    addJet(pos);
  };

  // Handle button click (random x position at bottom)
  const handleButtonClick = () => {
    const pos = { x: 0.1 + Math.random() * 0.8, y: 0.8 + Math.random() * 0.15 };
    addJet(pos);
  };

  return (
    <div className="flex flex-col items-center">
      <svg
        width={WIDTH}
        height={HEIGHT}
        style={{ display: 'block', cursor: 'pointer', borderRadius: 16, background: 'linear-gradient(to top, #e3f2fd 60%, #b2ebf2 100%)' }}
        onClick={handleSvgClick}
      >
        {/* Draw jets and ripples */}
        {jets.map((jet, i) => {
          const { sx, sy } = mapToScreen(jet.position.x, jet.position.y);
          const t = (frame + i * 10) / 60;
          // Animate ripple: expands and fades
          const rippleBase = jet.rippleRadius * (1 + 0.3 * Math.sin(t * 2));
          const rippleExpand = 1 + 0.7 * Math.abs(Math.sin(t));
          const rippleOpacity = 0.18 * (1 - 0.5 * Math.abs(Math.sin(t)));
          const isHighlighted = highlighted === jet.id;
          // Jet oscillation
          const jetOsc = 0.12 * Math.sin(t * 2 + i);
          const jetHeight = (jet.height + jetOsc) * HEIGHT;
          // Splash effect
          const showSplash = splashJets.includes(jet.id);
          return (
            <g key={jet.id}>
              {/* Ripple */}
              <ellipse
                cx={sx}
                cy={sy}
                rx={rippleBase * WIDTH * rippleExpand * (isHighlighted ? 1.3 : 1)}
                ry={rippleBase * WIDTH * 0.5 * rippleExpand * (isHighlighted ? 1.3 : 1)}
                fill={jet.color}
                fillOpacity={isHighlighted ? 0.28 : rippleOpacity}
                style={{ transition: 'all 0.3s' }}
              />
              {/* Jet */}
              <rect
                x={sx - 6 * (isHighlighted ? 1.2 : 1)}
                y={sy - jetHeight}
                width={12 * (isHighlighted ? 1.2 : 1)}
                height={jetHeight}
                rx={6}
                fill={jet.color}
                fillOpacity={isHighlighted ? 0.9 : 0.7}
                style={{ transition: 'all 0.3s' }}
              />
              {/* Jet head */}
              <ellipse
                cx={sx}
                cy={sy - jetHeight}
                rx={12 * (isHighlighted ? 1.2 : 1)}
                ry={8 * (isHighlighted ? 1.2 : 1)}
                fill={jet.color}
                fillOpacity={isHighlighted ? 1 : 0.85}
                stroke="#fff"
                strokeWidth={isHighlighted ? 4 : 2}
                style={{ transition: 'all 0.3s' }}
              />
              {/* Splash effect */}
              {showSplash &&
                Array.from({ length: 7 }).map((_, idx) => {
                  const angle = (Math.PI * 2 * idx) / 7;
                  const r = 18 + 8 * Math.sin(t * 3 + idx);
                  return (
                    <ellipse
                      key={idx}
                      cx={sx + Math.cos(angle) * r}
                      cy={sy - jetHeight + Math.sin(angle) * r * 0.5}
                      rx={4}
                      ry={2}
                      fill={jet.color}
                      fillOpacity={0.7}
                    />
                  );
                })}
            </g>
          );
        })}
      </svg>
      <button
        className="mt-4 px-4 py-2 bg-cyan-500 text-white rounded shadow hover:bg-cyan-600 transition"
        onClick={handleButtonClick}
      >
        Trigger Ripple (Add Jet)
      </button>
      <div className="text-xs text-gray-500 mt-2">Click inside the fountain to add a ripple jet at that spot!</div>
    </div>
  );
} 