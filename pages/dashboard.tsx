import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

interface EnvironmentalData {
  windSpeed: number;
  temperature: number;
  humidity: number;
  airQuality: number;
  solarRadiation: number;
  precipitation: number;
  windDirection: number;
  pressure: number;
}

interface HistoricalDataPoint {
  timestamp: string;
  windSpeed: number;
  temperature: number;
}

export default function Dashboard() {
  const [data, setData] = useState<EnvironmentalData>({
    windSpeed: 0,
    temperature: 20,
    humidity: 50,
    airQuality: 80,
    solarRadiation: 600,
    precipitation: 0,
    windDirection: 180,
    pressure: 1013,
  });

  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([]);
  const [isAnimating, setIsAnimating] = useState(true);
  const [systemStatus, setSystemStatus] = useState({
    sensors: 'Operational',
    connectivity: 'Connected',
    lastUpdate: new Date().toLocaleTimeString(),
  });

  // Generate historical data
  useEffect(() => {
    const generateHistoricalData = () => {
      const data = [];
      for (let i = 0; i < 24; i++) {
        data.push({
          timestamp: `${i}:00`,
          windSpeed: 5 + Math.random() * 20,
          temperature: 15 + Math.random() * 15,
        });
      }
      setHistoricalData(data);
    };
    generateHistoricalData();
  }, []);

  // Simulate real-time data updates
  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setData(prevData => ({
        ...prevData,
        windSpeed: Math.random() * 30,
        temperature: 15 + Math.random() * 20,
        humidity: 30 + Math.random() * 50,
        airQuality: 60 + Math.random() * 40,
        solarRadiation: 400 + Math.random() * 400,
        precipitation: Math.random() * 5,
        windDirection: Math.random() * 360,
        pressure: 1000 + Math.random() * 30,
      }));
      setSystemStatus(prev => ({
        ...prev,
        lastUpdate: new Date().toLocaleTimeString(),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [isAnimating]);

  const getWindDirectionText = (degrees: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-emerald-100">
      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-emerald-800">Eco-Sync</h1>
            <span className="text-sm text-emerald-600 font-medium">Wind Sculpture Dashboard</span>
          </Link>
          <div className="flex items-center gap-4">
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Go to Main Program
            </a>
            <div className="hidden md:flex items-center gap-4">
              <span className="text-sm text-gray-600">System: {systemStatus.sensors}</span>
              <span className="text-sm text-gray-600">Network: {systemStatus.connectivity}</span>
            </div>
            <button 
              onClick={() => setIsAnimating(!isAnimating)}
              className={`${
                isAnimating ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'
              } text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium`}
            >
              {isAnimating ? 'Stop Simulation' : 'Start Simulation'}
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-8"
        >
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-emerald-800 mb-2">
                Welcome to Eco-Sync Wind Sculpture
              </h2>
              <p className="text-gray-600 max-w-2xl">
                Experience the harmony of nature and technology through our mesmerizing kinetic display.
                Monitor real-time environmental data and control your wind sculpture.
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Last Update</p>
              <p className="font-medium text-emerald-600">{systemStatus.lastUpdate}</p>
            </div>
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Visualization Panel */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-semibold text-emerald-700 mb-4">
              Live Visualization
            </h2>
            <div className="aspect-square relative bg-emerald-50 rounded-xl overflow-hidden">
              <motion.div
                className="absolute w-full h-full"
                animate={{
                  rotate: isAnimating ? data.windSpeed * 12 : 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 10,
                  damping: 5
                }}
              >
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute left-1/2 top-1/2 w-4 h-32 -ml-2 -mt-16 origin-center"
                    style={{
                      transform: `rotate(${i * 45}deg)`,
                      backgroundColor: `hsl(${160 + data.temperature}, 50%, 50%)`,
                      opacity: data.humidity / 100,
                    }}
                  />
                ))}
              </motion.div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-4xl font-bold text-emerald-800 bg-white/80 px-4 py-2 rounded-lg">
                  {getWindDirectionText(data.windDirection)}
                </div>
              </div>
            </div>
          </div>

          {/* Historical Data Chart */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-semibold text-emerald-700 mb-4">
              24-Hour History
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="windSpeed"
                    stroke="#059669"
                    name="Wind Speed (m/s)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="temperature"
                    stroke="#ea580c"
                    name="Temperature (°C)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {[
            {
              label: "Wind Speed",
              value: `${data.windSpeed.toFixed(1)} m/s`,
              color: "emerald",
              icon: "💨"
            },
            {
              label: "Temperature",
              value: `${data.temperature.toFixed(1)}°C`,
              color: "orange",
              icon: "🌡️"
            },
            {
              label: "Humidity",
              value: `${data.humidity.toFixed(1)}%`,
              color: "blue",
              icon: "💧"
            },
            {
              label: "Air Quality",
              value: `${data.airQuality.toFixed(1)} AQI`,
              color: "purple",
              icon: "🌬️"
            },
            {
              label: "Solar Radiation",
              value: `${data.solarRadiation.toFixed(1)} W/m²`,
              color: "yellow",
              icon: "☀️"
            },
            {
              label: "Precipitation",
              value: `${data.precipitation.toFixed(1)} mm`,
              color: "blue",
              icon: "🌧️"
            },
            {
              label: "Wind Direction",
              value: getWindDirectionText(data.windDirection),
              color: "gray",
              icon: "🧭"
            },
            {
              label: "Pressure",
              value: `${data.pressure.toFixed(1)} hPa`,
              color: "indigo",
              icon: "📊"
            },
          ].map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{metric.icon}</span>
                <h3 className="text-gray-500 text-sm">{metric.label}</h3>
              </div>
              <p className="text-2xl font-bold text-emerald-600 mt-2">
                {metric.value}
              </p>
              <motion.div
                className="w-full h-1 bg-gray-100 mt-2 rounded-full overflow-hidden"
              >
                <motion.div
                  className="h-full bg-emerald-500"
                  initial={{ width: "0%" }}
                  animate={{
                    width: `${(parseFloat(metric.value) / 100) * 100}%`,
                  }}
                  transition={{ duration: 0.5 }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Controls Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-emerald-700">
              Sculpture Controls
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Status:</span>
              <span className={`text-sm font-medium ${isAnimating ? 'text-green-600' : 'text-red-600'}`}>
                {isAnimating ? 'Active' : 'Paused'}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button
              onClick={() => setIsAnimating(!isAnimating)}
              className={`${
                isAnimating ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'
              } text-white px-4 py-2 rounded-lg transition-colors`}
            >
              {isAnimating ? 'Pause Animation' : 'Start Animation'}
            </button>
            <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
              Calibrate Sensors
            </button>
            <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
              Reset Position
            </button>
            <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
              Emergency Stop
            </button>
          </div>
        </div>

        {/* Quick Links Footer */}
        <footer className="mt-8 text-center">
          <Link
            href="/"
            className="text-emerald-600 hover:text-emerald-700 font-medium mr-4"
          >
            ← Back to Home
          </Link>
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Go to Main Program →
          </a>
        </footer>
      </div>
    </div>
  );
} 