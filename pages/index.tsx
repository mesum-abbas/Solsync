import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100">
      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-sm fixed w-full z-10 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-emerald-800">Eco-Sync</h1>
          <Link
            href="/dashboard"
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
          >
            Open Dashboard
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-24">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-emerald-800 mb-6">
            Eco-Sync Wind Sculpture
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Experience the harmony of nature and technology through our mesmerizing kinetic display
            that brings environmental data to life.
          </p>
          <Link
            href="/dashboard"
            className="inline-block bg-emerald-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Launch Dashboard
            <span className="ml-2">→</span>
          </Link>
        </motion.div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            {
              title: "Real-time Data",
              description: "Live environmental metrics drive the sculpture's movement",
              icon: "🌡️"
            },
            {
              title: "Arduino Integration",
              description: "Powered by sophisticated Arduino technology",
              icon: "🔧"
            },
            {
              title: "AWS Greengrass",
              description: "Cloud-connected IoT infrastructure for seamless operation",
              icon: "☁️"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => window.location.href = '/dashboard'}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-emerald-700 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Access Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-center bg-white rounded-2xl p-8 shadow-xl"
        >
          <h2 className="text-2xl font-bold text-emerald-800 mb-4">
            Ready to Monitor Environmental Data?
          </h2>
          <p className="text-gray-600 mb-6">
            Access real-time environmental metrics and control your wind sculpture from our interactive dashboard.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/dashboard"
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors shadow-md hover:shadow-lg flex items-center"
            >
              <span>View Live Data</span>
              <span className="ml-2">→</span>
            </Link>
          </div>
        </motion.div>

        {/* Feature Navigation Section */}
        <section className="my-16">
          <h2 className="text-3xl font-bold text-emerald-800 mb-6 text-center">Explore All Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Vitality Aurora Veil', path: '/aurora-veil' },
              { name: 'Eco-Sync Wind Sculpture', path: '/dashboard' },
              { name: 'Global Healing Ember', path: '/global-healing-ember' },
              { name: 'Resilience Petal Vortex', path: '/resilience-petal-vortex' },
              { name: 'Eco-Rhythm Cascade', path: '/eco-rhythm-cascade' },
              { name: 'Harmony Pulse Chime', path: '/harmony-pulse-chime' },
              { name: 'Community Glow Sphere', path: '/community-glow-sphere' },
              { name: 'Vitality Sky Mosaic', path: '/vitality-sky-mosaic' },
              { name: 'Global Wellness Weave', path: '/global-wellness-weave' },
              { name: 'Resilience Ripple Jet', path: '/resilience-ripple-jet' },
              { name: 'Eco-Vitality Prism', path: '/eco-vitality-prism' },
              { name: 'Healing Dance Sphere', path: '/healing-dance-sphere' },
              { name: 'Community Unity Web', path: '/community-unity-web' },
              { name: 'Eco-Harmony Beacon', path: '/eco-harmony-beacon' },
              { name: 'Vitality Bloom Matrix', path: '/vitality-bloom-matrix' },
              { name: 'Global Serenity Symphony', path: '/global-serenity-symphony' },
              { name: 'Resilience Firefly Swarm', path: '/resilience-firefly-swarm' },
              { name: 'Eco-Pulse Vibrator', path: '/eco-pulse-vibrator' },
              { name: 'Community Stream Map', path: '/community-stream-map' },
              { name: 'Vitality Star Matrix', path: '/vitality-star-matrix' },
              { name: 'Global Harmony Lantern', path: '/global-harmony-lantern' },
              { name: 'Resilience Tide Canvas', path: '/resilience-tide-canvas' },
              { name: 'Eco-Spirit Harmony', path: '/eco-spirit-harmony' },
              { name: 'Healing Memory Globe', path: '/healing-memory-globe' },
              { name: 'Planetary Wellness Canvas', path: '/planetary-wellness-canvas' },
            ].map((feature) => (
              <Link key={feature.path} href={feature.path}>
                <div className="bg-white rounded-lg shadow-md p-6 text-center hover:bg-emerald-50 cursor-pointer transition">
                  <span className="text-lg font-semibold text-emerald-700">{feature.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Animated Background Elements */}
        <div className="fixed inset-0 pointer-events-none -z-10">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-64 h-64 bg-emerald-200 rounded-full opacity-10"
              animate={{
                x: [0, 100, 0],
                y: [0, 50, 0]
              }}
              transition={{
                duration: 20 + i * 2,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                left: `${i * 20}%`,
                top: `${i * 15}%`
              }}
            />
          ))}
        </div>
      </main>

      {/* Footer with Quick Access */}
      <footer className="bg-white/80 backdrop-blur-sm py-4 mt-16">
        <div className="container mx-auto px-4 text-center">
          <Link
            href="/dashboard"
            className="text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Access Dashboard →
          </Link>
        </div>
      </footer>
    </div>
  );
} 