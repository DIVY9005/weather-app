import { useState, useEffect } from "react";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = "0db365d2e8f7518dc89fda1989e0a96e";

  const getWeather = async (cityName) => {
    if (!cityName) return;

    setLoading(true);
    setError("");
    setWeather(null);
    setForecast([]);

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();

      if (!data || Number(data.cod) !== 200) {
        setError("City not found ❌");
        setLoading(false);
        return;
      }

      setWeather(data);

      const res2 = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      const data2 = await res2.json();

      const daily =
        data2.list?.filter((item) =>
          item.dt_txt.includes("12:00:00")
        ) || [];

      setForecast(daily);
    } catch {
      setError("Something went wrong ⚠️");
    }

    setLoading(false);
  };

  const getLocationWeather = () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;

      setLoading(true);
      setError("");

      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        );
        const data = await res.json();

        if (!data || Number(data.cod) !== 200) {
          setError("Location weather failed ❌");
          setLoading(false);
          return;
        }

        setWeather(data);

        const res2 = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        );
        const data2 = await res2.json();

        const daily =
          data2.list?.filter((item) =>
            item.dt_txt.includes("12:00:00")
          ) || [];

        setForecast(daily);
      } catch {
        setError("Error fetching location weather");
      }

      setLoading(false);
    });
  };

  useEffect(() => {
    getLocationWeather();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 p-4">
      
      <div className="bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl p-6 w-full max-w-md text-white">

        <h1 className="text-2xl font-bold mb-6 text-center">🌤 Weather App</h1>

        {/* Search */}
        <div className="flex gap-2 mb-4">
          <input
            className="flex-1 p-3 rounded-xl bg-white/30 placeholder-white outline-none"
            placeholder="Search city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && getWeather(city)}
          />

          <button
            className="bg-white/30 px-4 rounded-xl hover:bg-white/50 transition duration-300"
            onClick={() => getWeather(city)}
          >
            🔍
          </button>
        </div>

        {/* Location */}
        <button
          className="w-full mb-4 bg-white/30 py-2 rounded-xl hover:bg-white/50 transition duration-300"
          onClick={getLocationWeather}
        >
          📍 Use My Location
        </button>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center mt-4">
            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Error */}
        {error && <p className="text-center text-red-300">{error}</p>}

        {/* Weather */}
        {weather && weather.main && (
          <div className="text-center mt-4">
            <h2 className="text-xl font-semibold">{weather.name}</h2>

            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="weather"
              className="mx-auto"
            />

            <h1 className="text-5xl font-bold">{weather.main.temp}°C</h1>
            <p>{weather.weather[0].main}</p>

            <div className="flex justify-between mt-6 text-sm">
              <p>💧 {weather.main.humidity}%</p>
              <p>🌬 {weather.wind.speed} km/h</p>
            </div>
          </div>
        )}

        {/* Forecast */}
        {forecast.length > 0 && (
          <div className="mt-6 flex gap-3 overflow-x-auto pb-2">
            {forecast.map((day, i) => (
              <div
                key={i}
                className="min-w-[90px] bg-white/30 backdrop-blur-md rounded-xl p-3 text-center shadow-md hover:scale-105 transition"
              >
                <p className="text-xs">
                  {new Date(day.dt_txt).toLocaleDateString("en-IN", {
                    weekday: "short",
                  })}
                </p>
                <p className="font-bold">{day.main.temp}°C</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default App;