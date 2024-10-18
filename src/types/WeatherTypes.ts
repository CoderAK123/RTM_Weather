export interface WeatherData {
  main: string;
  temp: number;
  feels_like: number;
  dt: number;
}

export interface City {
  name: string;
  lat: number;
  lon: number;
}

export interface DailySummary {
  date: string;
  avgTemp: number;
  maxTemp: number;
  minTemp: number;
  dominantCondition: string;
}

export interface AlertConfig {
  highTemp: number;
  lowTemp: number;
}