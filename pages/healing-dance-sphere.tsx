import React from 'react';
import DanceSphereVisualizer from '../components/DanceSphereVisualizer';

export default function HealingDanceSphere() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-pink-100 to-yellow-200">
      <h1 className="text-4xl font-bold text-emerald-800 mb-4">Healing Dance Sphere</h1>
      <p className="max-w-xl text-center text-lg text-gray-700 mb-8">
        Coordinates global dance rituals tied to patient milestones, uniting communities via AR. (Unity, IoT Core)
      </p>
      <div className="rounded-lg bg-white/80 p-6 shadow-lg">
        <DanceSphereVisualizer />
      </div>
    </div>
  );
} 