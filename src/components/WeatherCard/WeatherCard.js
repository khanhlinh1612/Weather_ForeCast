import React from 'react';
import './WeatherCard.css';

function WeatherCard({ day }) {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-CA', options); // Format: YYYY/MM/DD
  };

  return (
    <div className='weather-card'>
      <h5>{formatDate(day.date)}</h5>
      <img src={day.day.condition.icon} alt="weather icon" style={{ width: '100px', height: '100px' }} />
      <p>{day.day.condition.text}</p>
      <p>Temp: {day.day.avgtemp_c}°C</p>
      <p>Wind: {day.day.maxwind_kph} km/h</p>
      <p>Humidity: {day.day.avghumidity}%</p>
    </div>
  );
}

export default WeatherCard;
