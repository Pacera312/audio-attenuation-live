# Audio Attenuation Live

Outil de sonorisation en plein air pour visualiser l'atténuation acoustique en temps réel selon les conditions météorologiques.

## Fonctionnalités

- Visualisation graphique de l'atténuation par fréquence (20 Hz - 20 kHz, bandes 1/3 octave)
- Entrée manuelle de température (°C) et hygrométrie (%)
- Calcul d'atténuation atmosphérique (ISO 9613-1)
- Interface web interactive

## Installation

```bash
npm install
npm run dev
```

## Technologies

- React + TypeScript
- Vite
- Chart.js pour la visualisation
- Formules d'absorption atmosphérique (ISO 9613-1)
