import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import WeatherCard from './components/WeatherCard/WeatherCard';

const API_BASE_URL = 'https://weather-forecast-be.onrender.com'; // Replace with your backend URL

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [numToShow, setNumToShow] = useState(5); // Number of days to show initially
  const [allForecastData, setAllForecastData] = useState([]); // To store all forecast data
  const [weatherHistory, setWeatherHistory] = useState([]);

  const fetchWeather = async (location) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/weather?location=${location}`);
      if (response.data && response.data.current && response.data.forecast) {
        setWeatherData(response.data);
        setAllForecastData(response.data.forecast.forecastday);
        setForecastData(response.data.forecast.forecastday.slice(1, numToShow));
      } else {
        console.error('Incomplete data:', response.data);
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
      // Handle error state or alert the user
    }
  };

  const handleSearch = async () => {
    if (searchQuery) {
      fetchWeather(searchQuery);
    }
  };

  useEffect(() => {
    fetchWeatherHistory(); // Fetch weather history for today
  }, []);

  const fetchWeatherHistory = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/weather/history`);
      setWeatherHistory(response.data);

      // If there's recent search history, fetch the latest one
      if (response.data.length > 0) {
        const latestLocation = response.data[response.data.length - 1].location;
        fetchWeather(latestLocation);
      } else {
        // If no history, fetch default weather for London
        fetchWeather('London');
      }
    } catch (error) {
      console.error('Error fetching weather history:', error);
      // Handle error state or alert the user
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-CA', options); // Format: YYYY/MM/DD
  };

  const loadMoreDays = () => {
    // Increase the number of days to show by 4 each time
    setNumToShow(numToShow + 4);
    setForecastData(allForecastData.slice(0, numToShow + 4));
  };

  return (
    <div className='App'>
      <Navbar />
      <div className="main-content">
        <div className="row">
          <div className='col-3 sidebar'>
            <div className='search-box'>
              <h5>Enter a City Name</h5>
              <input
                className='form-control'
                placeholder='E.g., New York, London, Tokyo'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                className='search-btn btn'
                onClick={handleSearch}
              >
                Search
              </button>
              <div className='separator'>
                <span>or</span>
              </div>
              <button className='location-btn btn'>Use Current Location</button>
            </div>
          </div>
          <div className='col-9 main-body'>
            <div className="info-page">
              {weatherData && (
                <>
                  <div className="weather-details">
                    <h4>{weatherData.location.name} ({formatDate(weatherData.current.last_updated)})</h4>
                    <p className='mt-4'>Temperature: {weatherData.current.temp_c}°C</p>
                    <p>Wind: {weatherData.current.wind_kph} km/h</p>
                    <p>Humidity: {weatherData.current.humidity}%</p>
                  </div>
                  <div className="weather-icon">
                    <img src={weatherData.current.condition.icon} alt="weather icon" style={{ width: '150px', height: '150px' }} />
                    <p className="weather-condition">{weatherData.current.condition.text}</p>
                  </div>
                </>
              )}
            </div>
            <div className='title-forecast'>
              4-Day Forecast
            </div>
            <div className='forecast-weather row'>
              {forecastData && forecastData.map((day, index) => (
                <WeatherCard key={index} day={day} />
              ))}
            </div>
            {allForecastData.length > numToShow && (
              <button className="btn load-more-btn" onClick={loadMoreDays}>Load More</button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
