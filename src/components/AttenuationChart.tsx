import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { calculateAttenuation } from '../utils/acoustics'
import './AttenuationChart.css'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface AttenuationChartProps {
  temperature: number
  humidity: number
}

export default function AttenuationChart({
  temperature,
  humidity,
}: AttenuationChartProps) {
  const [chartData, setChartData] = useState<any>(null)

  useEffect(() => {
    // Fréquences centrales 1/3 octave (20 Hz - 20 kHz)
    const frequencies = [
      20, 25, 31.5, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500,
      630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000,
      10000, 12500, 16000, 20000,
    ]

    const attenuations = frequencies.map((freq) =>
      calculateAttenuation(freq, temperature, humidity)
    )

    const maxAttenuation = Math.max(...attenuations)
    const minAttenuation = Math.min(...attenuations)

    setChartData({
      labels: frequencies.map((f) =>
        f >= 1000 ? `${(f / 1000).toFixed(1)}k` : f.toFixed(0)
      ),
      datasets: [
        {
          label: 'Atténuation (dB/100m)',
          data: attenuations,
          borderColor: '#2a5298',
          backgroundColor: 'rgba(42, 82, 152, 0.1)',
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#2a5298',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointHoverRadius: 6,
        },
      ],
      max: maxAttenuation,
      min: minAttenuation,
    })
  }, [temperature, humidity])

  if (!chartData) {
    return <div className="chart-loading">Chargement...</div>
  }

  return (
    <div className="chart-container">
      <div className="chart-info">
        <h2>📊 Atténuation par Fréquence (1/3 Octave)</h2>
        <p className="chart-params">
          T° = {temperature}°C | Humidité = {humidity}%
        </p>
      </div>

      <div className="chart-wrapper">
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: {
                labels: {
                  font: { size: 12, weight: 'bold' },
                  color: '#333',
                },
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: { size: 12, weight: 'bold' },
                bodyFont: { size: 11 },
                callbacks: {
                  label: (context) =>
                    `${context.dataset.label}: ${context.parsed.y.toFixed(2)} dB/100m`,
                },
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Fréquence (Hz)',
                  font: { size: 13, weight: 'bold' },
                },
                ticks: {
                  font: { size: 10 },
                },
              },
              y: {
                title: {
                  display: true,
                  text: 'Atténuation (dB/100m)',
                  font: { size: 13, weight: 'bold' },
                },
                beginAtZero: true,
                ticks: {
                  font: { size: 10 },
                },
              },
            },
          }}
        />
      </div>

      <div className="chart-footer">
        <p>
          <strong>Formule:</strong> ISO 9613-1 - Absorption atmosphérique
        </p>
      </div>
    </div>
  )
}
