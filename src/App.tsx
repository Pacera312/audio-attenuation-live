import { useState } from 'react'
import AttenuationChart from './components/AttenuationChart'
import WeatherControls from './components/WeatherControls'
import './App.css'

function App() {
  const [temperature, setTemperature] = useState<number>(20)
  const [humidity, setHumidity] = useState<number>(50)

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🔊 Audio Attenuation Live</h1>
        <p>Visualisation de l'atténuation acoustique en plein air</p>
      </header>

      <div className="main-content">
        <WeatherControls
          temperature={temperature}
          humidity={humidity}
          onTemperatureChange={setTemperature}
          onHumidityChange={setHumidity}
        />

        <AttenuationChart
          temperature={temperature}
          humidity={humidity}
        />
      </div>
    </div>
  )
}

export default App
