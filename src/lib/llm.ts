import { GoogleGenAI } from "@google/genai";
import { UserInput, FullAnalysisResult, ChartDataPoint, AnalysisSection, MajorEvent } from './types';
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
      reason: event.event + " " + point.reason // Append manual event reason
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
      reason: "流年运势波动"
    };
  });

  const processedChart = applyHardConstraints(mockChartData, majorEvents);

  return {
    bazi: baseStructure.fourPillars,
    chartData: processedChart,
    is_premium: false,
    analysis: {
      summary: "这是一个模拟数据生成的报告。您的八字显示出一种坚韧不拔的特质，如同高山松柏，历经风霜而更显苍翠。",
      summaryScore: 78,
      personality: "性格坚毅，外冷内热，做事有条理。",
      personalityScore: 80,
      career: "事业中期发力，大器晚成。",
      careerScore: 75,
      wealth: "财运随事业起伏，正财为主。",
      wealthScore: 70,
      marriage: "感情细腻，需要多沟通。",
      marriageScore: 72,
      health: "注意肠胃保养。",
      healthScore: 65,
      family: "六亲缘分深厚。",
      tradingStyle: "稳健长线持有者 (HODLer)",
    }
  };
}

export async function processAnalysis(input: UserInput): Promise<FullAnalysisResult> {
  const structure = calculateBaziStructure(input);

  // If no API key is set, return Mock Data
  if (!process.env.API_KEY) {
    console.warn("No API_KEY found. Returning Mock Data.");
    return generateMockData(structure, input.majorEvents);
  }

  // Construct Prompt
  const prompt = `
    你是一位精通中国八字命理（四柱推命）和金融技术分析的大师。

    【重要】所有输出内容必须使用简体中文，不要使用英文。

    任务：根据用户的八字分析其人生运势，并将其映射到"人生K线图"（0-100分制）。

    用户信息：
    - 姓名：${input.name || '匿名'}
    - 性别：${input.gender === 'male' ? '男' : '女'}
    - 四柱（年/月/日/时）：${JSON.stringify(structure.fourPillars)}
    - 大运序列：${JSON.stringify(structure.daYunSequence)}
    - 出生年份：${input.birthYear}
    - 重大人生事件（必须匹配这些趋势）：${JSON.stringify(input.majorEvents)}

    分析要求：
    1. 生成100个数据点（1岁到100岁）。
    2. 为每一年确定一个"评分"（0-100），代表整体运势。
    3. 生成OHLC（开盘、最高、最低、收盘）值。"收盘"必须等于"评分"。
    4. 格式：开盘/收盘反映该年初/年末的运势。最高/最低反映波动性。
    5. 约束条件：
       - 如果重大事件是好事（positive）：收盘必须 >= 75。
       - 如果重大事件是坏事（negative）：收盘必须 <= 35。
       - 确保 最低 <= min(开盘, 收盘) 且 最高 >= max(开盘, 收盘)。
    6. 为每年提供简短的中文解读（12-40字），例如："土生金旺，财星高照"、"木火通明，文昌得位"。
    7. 提供专业的命理分析部分，必须全部用中文书写。

    严格按照以下JSON格式输出：
    {
      "chartData": [
        { "age": 1, "year": ${input.birthYear}, "ganZhi": "...", "daYun": "...", "open": 50, "close": 55, "high": 60, "low": 48, "score": 55, "reason": "中文解读..." },
        ... 直到100岁
      ],
      "analysis": {
        "summary": "综合运势分析（中文）...",
        "summaryScore": 80,
        "personality": "性格特质分析（中文）...",
        "personalityScore": 80,
        "career": "事业运分析（中文）...",
        "careerScore": 80,
        "wealth": "财运分析（中文）...",
        "wealthScore": 80,
        "marriage": "感情婚姻分析（中文）...",
        "marriageScore": 80,
        "health": "健康运分析（中文）...",
        "healthScore": 80,
        "family": "家庭人际分析（中文）...",
        "tradingStyle": "投资风格建议（中文）..."
      }
    }
  `;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
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
      console.error("JSON Parse failed, returning mock", e);
      return generateMockData(structure, input.majorEvents);
    }

    // Validate and Fix Structure
    if (!parsed.chartData || !Array.isArray(parsed.chartData)) {
      throw new Error("Invalid Chart Data");
    }

    // Merge deterministic GanZhi/DaYun back into LLM results to ensure calendar accuracy
    const mergedData = structure.yearsList.map((y: any, idx: number) => {
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
      analysis: parsed.analysis,
      is_premium: false
    };

  } catch (error) {
    console.error("LLM Generation Error:", error);
    return generateMockData(structure, input.majorEvents);
  }
}
