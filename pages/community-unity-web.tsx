import React from 'react';

export default function CommunityUnityWeb() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-100 to-pink-200">
      <div className="bg-white/80 rounded-2xl shadow-2xl p-10 flex flex-col items-center max-w-lg w-full border border-emerald-100 backdrop-blur-md">
        <div className="text-6xl mb-4 animate-pulse">🕸️</div>
        <h1 className="text-2xl font-bold text-emerald-800 mb-2 text-center">Glowing Web Visualization</h1>
        <p className="text-center text-lg text-gray-700 mt-4">
          Visualizes support as a glowing 3D web, inspiring with vibrant connections.<br/>
          <span className="text-emerald-600 font-semibold">(D3.js, Amplify)</span>
        </p>
      </div>
    </div>
  );
} 