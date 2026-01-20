import { UserInput, ChartDataPoint } from './types';
import { Solar, Lunar } from 'lunar-typescript';

// 天干
const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
// 地支
const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 生成60甲子
const JIAZI = Array.from({ length: 60 }, (_, i) => {
  return STEMS[i % 10] + BRANCHES[i % 12];
});

/**
 * 判断天干阴阳
 * 甲丙戊庚壬为阳干，乙丁己辛癸为阴干
 */
function isYangStem(stem: string): boolean {
  const yangStems = ['甲', '丙', '戊', '庚', '壬'];
  return yangStems.includes(stem);
}

/**
 * 获取干支在60甲子中的索引
 */
function getJiaZiIndex(ganZhi: string): number {
  return JIAZI.indexOf(ganZhi);
}

/**
 * 使用 lunar-typescript 计算精准八字
 */
export function calculateBaziStructure(input: UserInput) {
  const { birthYear, birthMonth, birthDay, birthHour, birthMinute, gender } = input;

  // 1. 创建公历日期对象
  const solar = Solar.fromYmdHms(birthYear, birthMonth, birthDay, birthHour, birthMinute, 0);

  // 2. 获取八字对象（自动处理节气换月、真太阳时等）
  const lunar = solar.getLunar();
  const eightChar = lunar.getEightChar();

  // 3. 获取四柱
  const yearPillar = eightChar.getYear();      // 年柱
  const monthPillar = eightChar.getMonth();    // 月柱（已考虑节气）
  const dayPillar = eightChar.getDay();        // 日柱
  const hourPillar = eightChar.getTime();      // 时柱

  const fourPillars = [yearPillar, monthPillar, dayPillar, hourPillar];

  // 4. 获取日主（日干）
  const dayMaster = eightChar.getDayGan();
  const isDayMasterYang = isYangStem(dayMaster);
  const isMale = gender === 'male';

  // 5. 计算大运
  // 阳男阴女顺排，阴男阳女逆排
  const isForward = (isDayMasterYang && isMale) || (!isDayMasterYang && !isMale);

  // 获取大运列表
  const yun = eightChar.getYun(isMale ? 1 : 0);
  const startAge = yun.getStartYear(); // 起运年龄
  const daYunList = yun.getDaYun(); // 大运列表

  // 6. 构建大运序列
  const daYunSequence: { ganZhi: string; startAge: number; endAge: number }[] = [];

  for (let i = 0; i < daYunList.length && i < 12; i++) {
    const dy = daYunList[i];
    daYunSequence.push({
      ganZhi: dy.getGanZhi(),
      startAge: dy.getStartAge(),
      endAge: dy.getEndAge()
    });
  }

  // 7. 生成100年的流年数据
  const yearsList: Partial<ChartDataPoint>[] = [];

  for (let age = 1; age <= 100; age++) {
    const calendarYear = birthYear + age - 1;

    // 计算流年干支（使用 lunar-typescript）
    // 以立春为界计算年柱
    const flowYearSolar = Solar.fromYmd(calendarYear, 2, 4); // 约立春时间
    const flowYearLunar = flowYearSolar.getLunar();
    const flowYearGanZhi = flowYearLunar.getYearInGanZhiExact();

    // 确定当前大运
    let currentDaYun = "童限";
    for (const dy of daYunSequence) {
      if (age >= dy.startAge && age < dy.endAge) {
        currentDaYun = dy.ganZhi;
        break;
      }
    }
    // 如果超过所有大运范围，使用最后一个大运
    if (currentDaYun === "童限" && age >= startAge && daYunSequence.length > 0) {
      const lastDy = daYunSequence[daYunSequence.length - 1];
      if (age >= lastDy.startAge) {
        currentDaYun = lastDy.ganZhi;
      }
    }

    yearsList.push({
      age,
      year: calendarYear,
      ganZhi: flowYearGanZhi,
      daYun: currentDaYun
    });
  }

  // 8. 获取更多命理信息
  // 纳音五行
  const yearNaYin = eightChar.getYearNaYin();
  const monthNaYin = eightChar.getMonthNaYin();
  const dayNaYin = eightChar.getDayNaYin();
  const hourNaYin = eightChar.getTimeNaYin();

  // 十神
  const yearShiShen = eightChar.getYearShiShenGan();
  const monthShiShen = eightChar.getMonthShiShenGan();
  const hourShiShen = eightChar.getTimeShiShenGan();

  // 地支藏干的十神
  const yearZhiShiShen = eightChar.getYearShiShenZhi();
  const monthZhiShiShen = eightChar.getMonthShiShenZhi();
  const dayZhiShiShen = eightChar.getDayShiShenZhi();
  const hourZhiShiShen = eightChar.getTimeShiShenZhi();

  // 日主五行
  const dayWuXing = eightChar.getDayWuXing();

  return {
    fourPillars,
    yearsList,
    startAge: Math.round(startAge),
    daYunSequence: daYunSequence.map(d => d.ganZhi),
    // 额外的命理信息，可用于 LLM 分析
    extraInfo: {
      dayMaster,           // 日主
      dayWuXing,           // 日主五行
      isForward,           // 大运顺逆
      naYin: {
        year: yearNaYin,
        month: monthNaYin,
        day: dayNaYin,
        hour: hourNaYin
      },
      shiShen: {
        year: yearShiShen,
        month: monthShiShen,
        hour: hourShiShen
      },
      zhiShiShen: {
        year: yearZhiShiShen,
        month: monthZhiShiShen,
        day: dayZhiShiShen,
        hour: hourZhiShiShen
      },
      // 农历信息
      lunarDate: `${lunar.getYearInChinese()}年${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
      // 节气
      jieQi: lunar.getJieQi(),
      // 生肖
      shengXiao: lunar.getYearShengXiao()
    }
  };
}

/**
 * 获取五行相生相克关系
 */
export function getWuXingRelation(element1: string, element2: string): '生' | '克' | '被生' | '被克' | '同' {
  const wuXing = ['木', '火', '土', '金', '水'];
  const idx1 = wuXing.indexOf(element1);
  const idx2 = wuXing.indexOf(element2);

  if (idx1 === -1 || idx2 === -1) return '同';
  if (idx1 === idx2) return '同';

  // 相生：木生火、火生土、土生金、金生水、水生木
  if ((idx1 + 1) % 5 === idx2) return '生';
  if ((idx2 + 1) % 5 === idx1) return '被生';

  // 相克：木克土、土克水、水克火、火克金、金克木
  if ((idx1 + 2) % 5 === idx2) return '克';
  if ((idx2 + 2) % 5 === idx1) return '被克';

  return '同';
}

/**
 * 获取天干五行
 */
export function getStemWuXing(stem: string): string {
  const map: Record<string, string> = {
    '甲': '木', '乙': '木',
    '丙': '火', '丁': '火',
    '戊': '土', '己': '土',
    '庚': '金', '辛': '金',
    '壬': '水', '癸': '水'
  };
  return map[stem] || '';
}

/**
 * 获取地支五行
 */
export function getBranchWuXing(branch: string): string {
  const map: Record<string, string> = {
    '子': '水', '丑': '土',
    '寅': '木', '卯': '木',
    '辰': '土', '巳': '火',
    '午': '火', '未': '土',
    '申': '金', '酉': '金',
    '戌': '土', '亥': '水'
  };
  return map[branch] || '';
}
