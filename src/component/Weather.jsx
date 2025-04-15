import React, { useEffect, useState } from "react";
import "./weather.css";
import search_icon from "../assets/search.png";
import clear from "../assets/clear.png";
import cloud from "../assets/cloud.png";
import drizzle_icon from "../assets/drizzle.png";
import rain from "../assets/rain.png";
import snow from "../assets/snow.png";
import wind from "../assets/wind.png";
import humidity from "../assets/humidity.png";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [search, setSearch] = useState("");

  const allIcons = {
    "01d": clear,
    "01n": clear,
    "02d": cloud,
    "02n": cloud,
    "03d": cloud,
    "03n": cloud,
    "04d": drizzle_icon,
    "09d": rain,
    "09n": rain,
    "10n": rain,
    "13d": snow,
    "13n": snow,
  };

  const searchWeather = async (city) => {
    if (!city) {
      toast.error("Please enter a city name!", { position: "top-bottom" });
      return;
    }

    try {
      const url = `${import.meta.env.VITE_APP_API}${city}&appid=${
        import.meta.env.VITE_APP_ID
      }&units=metric`;
      const response = await axios.get(url);
      const weatherData = response.data;
      const icon = allIcons[weatherData.weather[0].icon] || clear;
      const storeWeather = { ...weatherData, icon };
      setWeather(storeWeather);

      localStorage.setItem("storeWeather", JSON.stringify(storeWeather));
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setWeather(null);
      toast.error("City not found!", { position: "top-center" });
    }
  };

  useEffect(() => {
    const storedWeather = localStorage.getItem("storeWeather");
    if (storedWeather) {
      setWeather(JSON.parse(storedWeather));
    } else {
      searchWeather("New York");
    }
  }, []);

  return (
    <div className="weather">toastify
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for a city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <img
          src={search_icon}
          alt="Search"
          onClick={() => searchWeather(search)}
        />
      </div>

      {weather ? (
        <>
          <img src={weather.icon} alt="Weather Icon" className="weather-icon" />
          <p className="temp">{Math.round(weather.main.temp)} °C</p>
          <p className="location">{weather.name}</p>
          <div className="w-data">
            <div className="col">
              <img src={humidity} alt="Humidity" />
              <div>
                <p>{weather.main.humidity} %</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={wind} alt="Wind Speed" />
              <div>
                <p>{weather.wind.speed} km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p className="error">City not found</p>
      )}

      <ToastContainer />
    </div>
  );
};
