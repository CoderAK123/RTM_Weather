import axios from 'axios';
import { WeatherData, City } from '../types/WeatherTypes';

const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const fetchWeatherData = async (city: City): Promise<WeatherData | null> => {
  try {
    if (!API_KEY) {
      console.error('OpenWeatherMap API key is not set. Please set the VITE_OPENWEATHERMAP_API_KEY environment variable.');
      return null;
    }

    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat: city.lat,
        lon: city.lon,
        appid: API_KEY,
        units: 'metric',
      },
    });

    return {
      main: response.data.weather[0].main,
      temp: response.data.main.temp,
      feels_like: response.data.main.feels_like,
      dt: response.data.dt,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      console.error('Invalid API key. Please check your OpenWeatherMap API key.');
    } else {
      console.error('Error fetching weather data:', error);
    }
    return null;
  }
};