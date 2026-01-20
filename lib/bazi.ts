import { UserInput, ChartDataPoint } from './types';

// Simplified Heavenly Stems and Earthly Branches
const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// Generate 60 JiaZi cycle
const JIAZI = Array.from({ length: 60 }, (_, i) => {
  return STEMS[i % 10] + BRANCHES[i % 12];
});

// A simplified determinstic engine. 
export function calculateBaziStructure(input: UserInput) {
  const { birthYear } = input;
  
  // 1. Calculate Year Pillar (approximate, usually starts Feb 4th)
  // 1984 was JiaZi (start of cycle).
  const offset = (birthYear - 1984) % 60;
  const yearIndex = offset >= 0 ? offset : offset + 60;
  const yearPillar = JIAZI[yearIndex];

  // 2. Mock Month/Day/Hour pillars (random but deterministic based on input)
  const seed = birthYear + input.birthMonth + input.birthDay + input.birthHour;
  const monthPillar = JIAZI[(seed * 2) % 60];
  const dayPillar = JIAZI[(seed * 3) % 60];
  const hourPillar = JIAZI[(seed * 4) % 60];

  const fourPillars = [yearPillar, monthPillar, dayPillar, hourPillar];

  // 3. DaYun (Great Life Cycle) Logic
  // Simplified: Start at age 5 for everyone in this demo.
  const startAge = 5; 
  // Simplified: Random deterministic sequence starting from Month Pillar
  let daYunIndex = (seed * 2) % 60;
  const daYunSequence: string[] = [];
  for(let i=0; i<12; i++) {
     daYunIndex = (daYunIndex + 1) % 60; // Simplified forward
     daYunSequence.push(JIAZI[daYunIndex]);
  }

  // 4. Generate 100 Years List
  const yearsList: Partial<ChartDataPoint>[] = [];

  for (let age = 1; age <= 100; age++) {
    const calendarYear = birthYear + age - 1;
    // Calculate Flow Year Pillar
    const flowYearIndex = (yearIndex + (age - 1)) % 60;
    const flowYearGanZhi = JIAZI[flowYearIndex];

    // Determine DaYun
    let currentDaYun = "童限"; // Childhood limit
    if (age >= startAge) {
      const dyIdx = Math.floor((age - startAge) / 10);
      currentDaYun = daYunSequence[Math.min(dyIdx, daYunSequence.length - 1)];
    }

    yearsList.push({
      age,
      year: calendarYear,
      ganZhi: flowYearGanZhi,
      daYun: currentDaYun
    });
  }

  return {
    fourPillars,
    yearsList, // Partially filled data for LLM to enrich
    startAge,
    daYunSequence
  };
}