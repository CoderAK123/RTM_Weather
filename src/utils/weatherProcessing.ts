import { WeatherData, DailySummary, AlertConfig } from '../types/WeatherTypes';

export const processDailySummary = (data: WeatherData[]): DailySummary => {
  const temps = data.map(d => d.temp);
  const conditions = data.map(d => d.main);

  return {
    date: new Date(data[0].dt * 1000).toISOString().split('T')[0],
    avgTemp: temps.reduce((a, b) => a + b, 0) / temps.length,
    maxTemp: Math.max(...temps),
    minTemp: Math.min(...temps),
    dominantCondition: getDominantCondition(conditions),
  };
};

const getDominantCondition = (conditions: string[]): string => {
  const counts = conditions.reduce((acc, condition) => {
    acc[condition] = (acc[condition] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(counts).reduce((a, b) => a[1] > b[1] ? a : b)[0];
};

export const checkAlertThresholds = (data: WeatherData, config: AlertConfig): string | null => {
  if (data.temp > config.highTemp) {
    return `High temperature alert: ${data.temp}°C exceeds threshold of ${config.highTemp}°C`;
  }
  if (data.temp < config.lowTemp) {
    return `Low temperature alert: ${data.temp}°C is below threshold of ${config.lowTemp}°C`;
  }
  return null;
};