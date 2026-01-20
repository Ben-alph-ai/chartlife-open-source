# ChartLife Open Source Clone

A web application that visualizes a person's life fortune using Chinese BaZi (Four Pillars) astrology and AI, displayed as a financial K-Line chart.

## Features

- **BaZi Calculation**: Basic deterministic generation of 4 pillars and DaYun (Luck Cycles).
- **AI Analysis**: Uses Gemini or OpenAI to interpret the astrological data into a year-by-year luck score.
- **Visuals**: Interactive Candlestick Chart with MA10 and Support/Resistance lines using ECharts.
- **Event Calibration**: Users can input past "Major Events" (e.g., Marriage 2015 Positive) which forces the AI to adjust the chart logic accordingly.
- **Reporting**: Full detailed table and printable CSS.

## Getting Started

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Configure API Keys**
   Copy `.env.example` to `.env.local` and add your API Key.
   ```bash
   cp .env.example .env.local
   # Edit .env.local and add GEMINI_API_KEY (Recommended for free tier)
   ```

3. **Run Development Server**
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Testing Major Events

To verify that the Constraint Engine works:
1. Enter birth year: 1990.
2. Add Major Event: Year 2015, Event "Big Win", Sentiment "Positive".
3. Run Analysis.
4. Check the Chart at year 2015. The "Close" price should be forced to >= 75 (Red candle, high point).

## Demo Inputs

**Input 1 (Elon Musk-esque):**
- Gender: Male
- Year: 1971, Month: 6, Day: 28, Hour: 10
- Location: Pretoria

**Input 2 (Standard):**
- Gender: Female
- Year: 1995, Month: 8, Day: 15, Hour: 14
- Location: Shanghai
