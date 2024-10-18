# Weather Monitoring System

This project is a real-time data processing system for weather monitoring with rollups and aggregates.
The webiste link :https://super-queijadas-5344df.netlify.app/

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up your OpenWeatherMap API key:
   - Sign up for a free API key at [OpenWeatherMap](https://openweathermap.org/api)
   - Create a `.env` file in the root directory of the project (if it doesn't exist already)
   - Add your API key to the `.env` file:
     ```
     VITE_OPENWEATHERMAP_API_KEY=your_actual_api_key_here
     ```
   - Replace `your_actual_api_key_here` with your real OpenWeatherMap API key
   - Make sure there are no spaces or quotes around your API key

4. Start the development server:
   ```
   npm run dev
   ```

## Troubleshooting

If you see an error message about an invalid API key:
1. Double-check that you've correctly added your API key to the `.env` file
2. Ensure there are no spaces or quotes around your API key
3. Verify that your API key is active and valid on the OpenWeatherMap website
4. Restart the development server after making changes to the `.env` file

If the error persists, try the following:
1. Clear your browser cache and reload the page
2. Check the browser console for any additional error messages
3. Ensure that your OpenWeatherMap account has an active subscription (even the free tier should work)

## Features

- Real-time weather data for major Indian cities
- Daily weather summaries
- Temperature alerts
- Interactive temperature overview chart

## Technologies Used

- React
- TypeScript
- Vite
- Chart.js
- Axios
- React-Toastify
