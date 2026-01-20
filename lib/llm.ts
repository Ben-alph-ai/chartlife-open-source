import { GoogleGenAI } from "@google/genai";
import { UserInput, FullAnalysisResult, ChartDataPoint, MajorEvent } from './types';
import { calculateBaziStructure } from './bazi';

// Hard constraints helper
function applyHardConstraints(data: ChartDataPoint[], majorEvents: MajorEvent[]) {
  return data.map(point => {
    const event = majorEvents.find(e => e.year === point.year);
    if (!event) return point;

    let { open, close, high, low, score } = point;

    if (event.sentiment === 'negative') {
      // Force crash
      close = Math.min(close, 35);
      score = close;
      // Ensure candle validity
      low = Math.min(low, close);
      high = Math.max(high, open); // Open might be higher
      if (open < close) open = close + 10; // Make it bearish if it was bullish
    } else if (event.sentiment === 'positive') {
      // Force pump
      close = Math.max(close, 75);
      score = close;
      high = Math.max(high, close);
      low = Math.min(low, open);
      if (open > close) open = close - 10; // Make it bullish
    }

    // Final sanity check for Candle validity
    const rLow = Math.min(open, close, low);
    const rHigh = Math.max(open, close, high);
    
    return {
      ...point,
      open, close, high: rHigh, low: rLow, score,
      reason: event.event + ". " + point.reason // Append manual event reason
    };
  });
}

// Mock Data Generator for when no API Key is present or for "Free" simple mode
function generateMockData(baseStructure: any, majorEvents: MajorEvent[]): FullAnalysisResult {
  const mockChartData: ChartDataPoint[] = baseStructure.yearsList.map((y: any) => {
    const baseScore = 50 + Math.sin(y.age / 5) * 20 + (Math.random() * 20 - 10);
    const isBullish = Math.random() > 0.45;
    
    let open = baseScore;
    let close = baseScore + (isBullish ? Math.random() * 10 : -Math.random() * 10);
    // Boundary checks
    open = Math.max(10, Math.min(90, open));
    close = Math.max(10, Math.min(90, close));

    const high = Math.max(open, close) + Math.random() * 5;
    const low = Math.min(open, close) - Math.random() * 5;

    return {
      ...y,
      open: Math.round(open),
      close: Math.round(close),
      high: Math.round(high),
      low: Math.round(low),
      score: Math.round(close),
      reason: "Fluctuating fortune (Mock Data)"
    };
  });

  const processedChart = applyHardConstraints(mockChartData, majorEvents);

  return {
    bazi: baseStructure.fourPillars,
    chartData: processedChart,
    is_premium: false,
    analysis: {
      summary: "This is a MOCK REPORT because no valid API Key was provided. Please configure your Gemini API Key in the environment variables to get a real AI analysis.",
      summaryScore: 78,
      personality: "Resilient and determined (Mock).",
      personalityScore: 80,
      career: "Late bloomer with steady growth (Mock).",
      careerScore: 75,
      wealth: "Wealth accumulates over time (Mock).",
      wealthScore: 70,
      marriage: "Needs communication (Mock).",
      marriageScore: 72,
      health: "Take care of digestion (Mock).",
      healthScore: 65,
      family: "Strong bonds (Mock).",
      tradingStyle: "HODLer (Mock)",
    }
  };
}

export async function processAnalysis(input: UserInput): Promise<FullAnalysisResult> {
  const structure = calculateBaziStructure(input);
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.warn("No API_KEY found in process.env. Returning Mock Data.");
    return generateMockData(structure, input.majorEvents);
  }

  // Construct Prompt
  const prompt = `
    You are a master of Chinese BaZi (Four Pillars of Destiny) and a financial technical analyst.
    
    Task: Analyze the user's life fortune based on their BaZi and map it to a "Life Candlestick Chart" (0-100 scale).
    
    Context:
    - Name: ${input.name || 'Anonymous'}
    - Gender: ${input.gender}
    - Four Pillars (Year/Month/Day/Hour): ${JSON.stringify(structure.fourPillars)}
    - DaYun Sequence: ${JSON.stringify(structure.daYunSequence)}
    - Birth Year: ${input.birthYear}
    - Major Events (Must match these trends): ${JSON.stringify(input.majorEvents)}

    Instructions:
    1. Generate 100 data points (Age 1 to 100).
    2. For each year, determine a 'score' (0-100) representing overall luck/fortune.
    3. Generate OHLC (Open, High, Low, Close) values. 'Close' MUST equal 'Score'.
    4. Format: Open/Close reflect the start/end luck of the year. High/Low reflect volatility.
    5. Constraints:
       - If Major Event is POSITIVE: Close MUST be >= 75.
       - If Major Event is NEGATIVE: Close MUST be <= 35.
       - Ensure Low <= min(Open, Close) and High >= max(Open, Close).
    6. Provide a short reason (12-40 chars) for each year (e.g., "Earth generates Gold, Wealth star shines").
    7. Provide a specialized analysis section.

    Output JSON Format strictly:
    {
      "chartData": [
        { "age": 1, "year": ${input.birthYear}, "ganZhi": "...", "daYun": "...", "open": 50, "close": 55, "high": 60, "low": 48, "score": 55, "reason": "..." },
        ... up to age 100
      ],
      "analysis": {
        "summary": "...",
        "summaryScore": 80,
        "personality": "...",
        "personalityScore": 80,
        "career": "...",
        "careerScore": 80,
        "wealth": "...",
        "wealthScore": 80,
        "marriage": "...",
        "marriageScore": 80,
        "health": "...",
        "healthScore": 80,
        "family": "...",
        "tradingStyle": "..."
      }
    }
  `;

  try {
    const ai = new GoogleGenAI({ apiKey: apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-latest',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        responseMimeType: "application/json"
      }
    });
    
    const resultText = response.text || "";

    // Parse and Heal
    let parsed: any;
    try {
      parsed = JSON.parse(resultText);
    } catch (e) {
      console.error("JSON Parse failed", e);
      throw new Error("Failed to parse AI response");
    }

    // Validate and Fix Structure
    if (!parsed.chartData || !Array.isArray(parsed.chartData)) {
      throw new Error("Invalid Chart Data format received from AI");
    }

    // Merge deterministic GanZhi/DaYun back into LLM results to ensure calendar accuracy
    const mergedData = structure.yearsList.map((y: any, idx: number) => {
        // Try to find matching age, else fallback to index
        const llmPoint = parsed.chartData.find((p: any) => p.age === y.age) || parsed.chartData[idx];
        return {
            ...y, // Valid GanZhi/Year from engine
            open: Number(llmPoint?.open || 50),
            close: Number(llmPoint?.close || 50),
            high: Number(llmPoint?.high || 50),
            low: Number(llmPoint?.low || 50),
            score: Number(llmPoint?.score || 50),
            reason: llmPoint?.reason || "Normal year"
        } as ChartDataPoint;
    });

    // Apply Hard Constraints (Rule Engine overrides LLM)
    const finalChartData = applyHardConstraints(mergedData, input.majorEvents);

    return {
      bazi: structure.fourPillars,
      chartData: finalChartData,
      analysis: parsed.analysis || {
        summary: "Analysis incomplete.",
        summaryScore: 50,
        personality: "N/A", personalityScore: 50,
        career: "N/A", careerScore: 50,
        wealth: "N/A", wealthScore: 50,
        marriage: "N/A", marriageScore: 50,
        health: "N/A", healthScore: 50,
        family: "N/A", tradingStyle: "N/A"
      },
      is_premium: false
    };

  } catch (error) {
    console.error("LLM Generation Error:", error);
    // Fallback to mock data on error so user sees something
    return generateMockData(structure, input.majorEvents);
  }
}