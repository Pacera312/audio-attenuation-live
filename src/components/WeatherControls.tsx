import './WeatherControls.css'

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
  return (
    <div className="weather-controls">
      <h2>⛅ Conditions Météo</h2>

      <div className="control-group">
        <label htmlFor="temp-input">
          Température
        </label>
        <div className="input-wrapper">
          <input
            id="temp-input"
            type="number"
            min="-30"
            max="50"
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
        <label htmlFor="humid-input">
          Hygrométrie
        </label>
        <div className="input-wrapper">
          <input
            id="humid-input"
            type="number"
            min="0"
            max="100"
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
        <p><strong>Point de rosée:</strong> {calculateDewPoint(temperature, humidity).toFixed(1)}°C</p>
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
