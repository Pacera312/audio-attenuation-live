/**
 * Calcul de l'atténuation acoustique selon ISO 9613-1
 * Basé sur l'absorption atmosphérique
 * 
 * @param frequency Fréquence en Hz
 * @param temperature Température en °C
 * @param humidity Hygrométrie en %
 * @returns Atténuation en dB/100m
 */
export function calculateAttenuation(
  frequency: number,
  temperature: number,
  humidity: number
): number {
  // Conversion température en Kelvin
  const T = temperature + 273.15
  const T0 = 293.15 // 20°C de référence

  // Calcul de l'humidité relative
  const h = humidity

  // Fréquence de relaxation de l'oxygène (Hz)
  const frO = 24 + (4.04 * 10000 * h * ((0.02 + h) / (0.391 + h)))

  // Fréquence de relaxation de l'azote (Hz)
  const frN =
    (T0 / T) *
    (9 + 280 * h * Math.exp(-4.17 * ((T0 / T) ** (1 / 3) - 1)))

  // Coefficient d'absorption (dB/m)
  const alpha =
    (1.84 * 10 ** (-11) * (frequency ** 2) * (T0 / T) ** (1 / 2)) +
    ((T / T0) ** (-5 / 2)) *
      (0.01278 * Math.exp(-2239.1 / T) * frO * (frequency ** 2)) /
      ((frO ** 2 + frequency ** 2)) +
    (0.1068 * Math.exp(-3352 / T) * frN * (frequency ** 2)) /
      ((frN ** 2 + frequency ** 2))

  // Conversion en dB/100m
  const attenuationPer100m = alpha * 100 * 20 * Math.log10(Math.E)

  return Math.max(0.001, attenuationPer100m) // Minimum positif
}

/**
 * Calcul du point de rosée
 * @param temperature Température en °C
 * @param humidity Hygrométrie en %
 * @returns Point de rosée en °C
 */
export function calculateDewPoint(
  temperature: number,
  humidity: number
): number {
  const a = 17.27
  const b = 237.7
  const alpha = ((a * temperature) / (b + temperature)) + Math.log(humidity / 100)
  return (b * alpha) / (a - alpha)
}

/**
 * Calcul de la vitesse du son
 * @param temperature Température en °C
 * @param humidity Hygrométrie en %
 * @returns Vitesse du son en m/s
 */
export function calculateSoundSpeed(
  temperature: number,
  humidity: number
): number {
  // Formule approximée de la vitesse du son
  // c = 331.3 + 0.606 * T (en °C) + correction hygrométrie
  const c0 = 331.3 + 0.606 * temperature
  
  // Correction mineure selon hygrométrie (effet faible)
  const dewPoint = calculateDewPoint(temperature, humidity)
  const correction = 0.1 * (dewPoint - temperature)
  
  return c0 + correction
}
