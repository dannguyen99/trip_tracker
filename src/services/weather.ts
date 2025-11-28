// Open-Meteo Service (No API Key required)
const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export interface WeatherData {
  date: string; // YYYY-MM-DD
  maxTemp: number;
  weatherCode: number;
  description: string;
  icon: string;
}

// WMO Weather interpretation codes (https://open-meteo.com/en/docs)
const getWeatherDescription = (code: number): { description: string; icon: string } => {
  if (code === 0) return { description: 'Clear sky', icon: '☀️' };
  if (code === 1) return { description: 'Mainly clear', icon: '🌤️' };
  if (code === 2) return { description: 'Partly cloudy', icon: '⛅' };
  if (code === 3) return { description: 'Overcast', icon: '☁️' };
  if (code >= 45 && code <= 48) return { description: 'Fog', icon: '🌫️' };
  if (code >= 51 && code <= 55) return { description: 'Drizzle', icon: 'zz' };
  if (code >= 61 && code <= 65) return { description: 'Rain', icon: '🌧️' };
  if (code >= 80 && code <= 82) return { description: 'Showers', icon: '🌦️' };
  if (code >= 95) return { description: 'Thunderstorm', icon: '⚡' };
  return { description: 'Unknown', icon: '❓' };
};

export const getForecast = async (lat: number, lng: number): Promise<WeatherData[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}?latitude=${lat}&longitude=${lng}&daily=weather_code,temperature_2m_max&timezone=auto`
    );
    const data = await response.json();

    if (!data.daily) {
      throw new Error('Invalid response from Open-Meteo');
    }

    return data.daily.time.map((date: string, index: number) => {
      const code = data.daily.weather_code[index];
      const { description, icon } = getWeatherDescription(code);

      return {
        date,
        maxTemp: data.daily.temperature_2m_max[index],
        weatherCode: code,
        description,
        icon
      };
    });
  } catch (error) {
    console.error('Failed to fetch weather:', error);
    return [];
  }
};

export const getWeatherForDate = (date: Date, forecast: WeatherData[]): WeatherData | undefined => {
  const dateStr = date.toLocaleDateString('en-CA'); // YYYY-MM-DD in local time
  return forecast.find(item => item.date === dateStr);
};
