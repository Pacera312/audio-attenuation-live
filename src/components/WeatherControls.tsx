import { useState } from 'react'
import './WeatherControls.css'
import { getWeatherByLocation, getWeatherByGeolocation } from '../utils/weatherApi'

interface WeatherControlsProps {
  temperature: number
  humidity: number
  onTemperatureChange: (value: number) => void
  onHumidityChange: (value: number) => void
}

export default function WeatherControls({
  temperature,
  humidity,
  onTemperatureChange,
  onHumidityChange,
}: WeatherControlsProps) {
  const [location, setLocation] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [currentLocation, setCurrentLocation] = useState<string>('')

  const handleSearchLocation = async () => {
    if (!location.trim()) {
      setError('Veuillez entrer une localisation')
      return
    }

    setLoading(true)
    setError('')

    try {
      const weather = await getWeatherByLocation(location)
      onTemperatureChange(Math.round(weather.temperature * 10) / 10)
      onHumidityChange(Math.round(weather.humidity))
      setCurrentLocation(weather.location)
      setLocation('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  const handleGeolocation = async () => {
    setLoading(true)
    setError('')

    try {
      const weather = await getWeatherByGeolocation()
      onTemperatureChange(Math.round(weather.temperature * 10) / 10)
      onHumidityChange(Math.round(weather.humidity))
      setCurrentLocation(weather.location)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchLocation()
    }
  }

  return (
    <div className="weather-controls">
      <h2>⛅ Conditions Météo</h2>

      {/* Récupération API */}
      <div className="weather-api-section">
        <p className="section-title">Récupérer via API (Open-Meteo)</p>

        <div className="search-group">
          <input
            type="text"
            placeholder="Ex: Paris, Lyon, Marseille..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyPress={handleKeyPress}
            className="location-input"
            disabled={loading}
          />
          <button
            onClick={handleSearchLocation}
            className="btn btn-search"
            disabled={loading}
          >
            {loading ? 'Chargement...' : '🔍'}
          </button>
        </div>

        <button
          onClick={handleGeolocation}
          className="btn btn-geo"
          disabled={loading}
        >
          {loading ? 'Localisation...' : '📍 Position actuelle'}
        </button>

        {error && <div className="error-message">{error}</div>}
        {currentLocation && (
          <div className="success-message">✓ Données de: {currentLocation}</div>
        )}
      </div>

      <div className="divider">─────────────────</div>

      {/* Entrée manuelle */}
      <div className="manual-section">
        <p className="section-title">Ou entrer manuellement</p>

        <div className="control-group">
          <label htmlFor="temp-input">Température</label>
          <div className="input-wrapper">
            <input
              id="temp-input"
              type="number"
              min="-30"
              max="50"
              step="0.1"
              value={temperature}
              onChange={(e) => onTemperatureChange(Number(e.target.value))}
              className="input-field"
            />
            <span className="unit">°C</span>
          </div>
          <input
            type="range"
            min="-30"
            max="50"
            value={temperature}
            onChange={(e) => onTemperatureChange(Number(e.target.value))}
            className="slider"
          />
        </div>

        <div className="control-group">
          <label htmlFor="humid-input">Hygrométrie</label>
          <div className="input-wrapper">
            <input
              id="humid-input"
              type="number"
              min="0"
              max="100"
              step="1"
              value={humidity}
              onChange={(e) => onHumidityChange(Number(e.target.value))}
              className="input-field"
            />
            <span className="unit">%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={humidity}
            onChange={(e) => onHumidityChange(Number(e.target.value))}
            className="slider"
          />
        </div>

        <div className="info-box">
          <p>
            <strong>Point de rosée:</strong>{' '}
            {calculateDewPoint(temperature, humidity).toFixed(1)}°C
          </p>
        </div>
      </div>
    </div>
  )
}

function calculateDewPoint(temp: number, humidity: number): number {
  const a = 17.27
  const b = 237.7
  const alpha = ((a * temp) / (b + temp)) + Math.log(humidity / 100)
  return (b * alpha) / (a - alpha)
}
