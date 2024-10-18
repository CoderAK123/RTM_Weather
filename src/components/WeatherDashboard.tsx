import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { WeatherData, City, DailySummary, AlertConfig } from '../types/WeatherTypes';
import { fetchWeatherData } from '../utils/api';
import { processDailySummary, checkAlertThresholds } from '../utils/weatherProcessing';
import { Sun, CloudRain, Thermometer } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const cities: City[] = [
  { name: 'Delhi', lat: 28.6139, lon: 77.2090 },
  { name: 'Mumbai', lat: 19.0760, lon: 72.8777 },
  { name: 'Chennai', lat: 13.0827, lon: 80.2707 },
  { name: 'Bangalore', lat: 12.9716, lon: 77.5946 },
  { name: 'Kolkata', lat: 22.5726, lon: 88.3639 },
  { name: 'Hyderabad', lat: 17.3850, lon: 78.4867 },
];

const WeatherDashboard: React.FC = () => {
  const [weatherData, setWeatherData] = useState<Record<string, WeatherData[]>>({});
  const [dailySummaries, setDailySummaries] = useState<Record<string, DailySummary[]>>({});
  const [alertConfig, setAlertConfig] = useState<AlertConfig>({ highTemp: 35, lowTemp: 10 });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const newData: Record<string, WeatherData[]> = {};
      let hasError = false;

      for (const city of cities) {
        const data = await fetchWeatherData(city);
        if (data) {
          newData[city.name] = [...(weatherData[city.name] || []), data];
        } else {
          hasError = true;
          break;
        }
      }

      if (hasError) {
        setError('Failed to fetch weather data. Please check your API key and try again.');
        return;
      }

      setError(null);
      setWeatherData(newData);

      // Process daily summaries
      const newSummaries: Record<string, DailySummary[]> = {};
      for (const [city, data] of Object.entries(newData)) {
        newSummaries[city] = [processDailySummary(data)];
      }
      setDailySummaries(newSummaries);

      // Check for alerts
      for (const [city, data] of Object.entries(newData)) {
        const latestData = data[data.length - 1];
        const alert = checkAlertThresholds(latestData, alertConfig);
        if (alert) {
          toast.warn(`${city}: ${alert}`);
        }
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000); // Fetch every 5 minutes

    return () => clearInterval(interval);
  }, []);

  const chartData = {
    labels: cities.map(city => city.name),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: cities.map(city => weatherData[city.name]?.slice(-1)[0]?.temp || 0),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Weather Monitoring Dashboard</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
        <p className="mt-4">
          Please make sure you have set the VITE_OPENWEATHERMAP_API_KEY in your .env file with a valid API key from OpenWeatherMap.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Weather Monitoring Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cities.map(city => (
          <div key={city.name} className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-2">{city.name}</h2>
            {weatherData[city.name]?.slice(-1)[0] && (
              <>
                <div className="flex items-center mb-2">
                  {weatherData[city.name].slice(-1)[0].main === 'Clear' ? (
                    <Sun className="mr-2" />
                  ) : (
                    <CloudRain className="mr-2" />
                  )}
                  <span>{weatherData[city.name].slice(-1)[0].main}</span>
                </div>
                <div className="flex items-center">
                  <Thermometer className="mr-2" />
                  <span>{weatherData[city.name].slice(-1)[0].temp.toFixed(1)}°C</span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Temperature Overview</h2>
        <Line data={chartData} />
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default WeatherDashboard;