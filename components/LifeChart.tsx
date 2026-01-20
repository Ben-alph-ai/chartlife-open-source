import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { ChartDataPoint } from '../lib/types';
import * as echarts from 'echarts';

interface Props {
  data: ChartDataPoint[];
}

export default function LifeChart({ data }: Props) {
  const option = useMemo(() => {
    const dates = data.map(item => item.year.toString());
    const values = data.map(item => [item.open, item.close, item.low, item.high]);

    // Calculate MA10
    const calculateMA = (dayCount: number) => {
      var result = [];
      for (var i = 0, len = values.length; i < len; i++) {
        if (i < dayCount) {
          result.push('-');
          continue;
        }
        var sum = 0;
        for (var j = 0; j < dayCount; j++) {
          sum += values[i - j][1]; // use close price
        }
        result.push((sum / dayCount).toFixed(2));
      }
      return result;
    };

    // Support/Resistance (Simplified Rolling Min/Max of last 20 years)
    const rollingMax = [];
    const rollingMin = [];
    for (let i = 0; i < data.length; i++) {
      const start = Math.max(0, i - 20);
      const slice = data.slice(start, i + 1);
      const maxH = Math.max(...slice.map(d => d.high));
      const minL = Math.min(...slice.map(d => d.low));
      rollingMax.push(maxH);
      rollingMin.push(minL);
    }

    const currentYear = new Date().getFullYear().toString();

    return {
      backgroundColor: 'transparent',
      animation: true,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          lineStyle: { color: 'rgba(0, 255, 0, 0.3)', width: 1, type: 'dashed' }
        },
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderColor: '#00ff00',
        borderWidth: 1,
        textStyle: { color: '#00ff00', fontSize: 12 },
        padding: 10,
        extraCssText: 'box-shadow: 0 0 10px rgba(0, 255, 0, 0.2); border-radius: 8px;',
        formatter: function (params: any) {
          const candle = params.find((p: any) => p.seriesName === 'Luck K-Line');
          if (!candle) return '';
          const idx = candle.dataIndex;
          const item = data[idx];
          const isUp = item.close >= item.open;
          return `
                <div style="font-weight: 900; border-bottom: 1px solid rgba(0,255,0,0.2); padding-bottom: 4px; margin-bottom: 6px; letter-spacing: 0.1em;">
                    ${item.year} (AGE: ${item.age})
                </div>
                <div style="font-family: monospace; font-size: 11px; opacity: 0.8; margin-bottom: 4px;">Pillar: ${item.ganZhi} | Luck: ${item.daYun}</div>
                <div style="color:${isUp ? '#ff3e3e' : '#00ff00'}; font-weight: bold; font-size: 14px;">
                   SCORE: ${item.score} ${isUp ? '▲' : '▼'}
                </div>
                <div style="color: #666; font-size: 10px; margin-top: 6px; max-width: 220px; line-height: 1.4; white-space: normal;">
                   ${item.reason}
                </div>
            `;
        }
      },
      grid: {
        left: '2%', right: '2%', bottom: '15%', top: '10%', containLabel: true
      },
      xAxis: {
        type: 'category',
        data: dates,
        axisLine: { lineStyle: { color: 'rgba(0, 255, 0, 0.2)' } },
        axisTick: { show: false },
        axisLabel: {
          color: '#666',
          fontSize: 10,
          formatter: (value: string, index: number) => {
            const item = data[index];
            if (index % 5 === 0) return `{yr|${value}}\n{age|${item.age}y}`;
            return '';
          },
          rich: {
            yr: { color: '#00ff00', fontWeight: 'bold' },
            age: { color: '#444' }
          }
        },
        splitLine: { show: true, lineStyle: { color: 'rgba(0, 255, 0, 0.05)' } }
      },
      yAxis: {
        scale: true,
        splitLine: { lineStyle: { color: 'rgba(0, 255, 0, 0.05)' } },
        axisLine: { show: false },
        axisLabel: { color: '#444', fontSize: 10 }
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 60 // Show 60% of data initially to prevent over-compression
        },
        {
          type: 'slider',
          show: true,
          bottom: 10,
          borderColor: 'rgba(0, 255, 0, 0.1)',
          handleStyle: { color: '#00ff00' },
          textStyle: { color: '#666' },
          fillerColor: 'rgba(0, 255, 0, 0.05)'
        }
      ],
      series: [
        {
          name: 'Luck K-Line',
          type: 'candlestick',
          data: values,
          itemStyle: {
            color: '#ff3e3e', // Red for Up
            color0: '#000000', // Black for Down (Cyber theme)
            borderColor: '#ff3e3e',
            borderColor0: '#00ff00'
          },
          markLine: {
            symbol: ['none', 'none'],
            data: [
              { xAxis: currentYear, label: { formatter: 'LIVE', position: 'end', color: '#fff', fontSize: 9, backgroundColor: '#00ff00', padding: [2, 4], borderRadius: 2 }, lineStyle: { type: 'dashed', color: '#00ff00', width: 1, opacity: 0.5 } }
            ]
          }
        },
        {
          name: 'MA10',
          type: 'line',
          data: calculateMA(10),
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 1, color: 'rgba(0, 255, 0, 0.4)' }
        },
        {
          name: 'Resistance',
          type: 'line',
          data: rollingMax,
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 0, opacity: 0 },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(0, 255, 0, 0.05)' },
              { offset: 1, color: 'rgba(0, 255, 0, 0)' }
            ])
          }
        }
      ]
    };
  }, [data]);

  return (
    <div className="w-full h-[600px] md:h-[750px] bg-black/40 rounded-2xl border border-primary/20 overflow-hidden shadow-2xl relative group/chart">
      {/* Chart Background Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10" style={{ backgroundImage: 'linear-gradient(#00ff00 1px, transparent 1px), linear-gradient(90deg, #00ff00 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      {/* HUD Style Data Overlay */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none flex flex-col space-y-1">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-primary animate-pulse"></div>
          <span className="text-[10px] font-black text-primary tracking-widest uppercase font-mono">Quantum Stream: Active</span>
        </div>
        <div className="flex space-x-4 font-mono text-[9px] text-primary/60 uppercase">
          <span>O: <span className="text-white">---</span></span>
          <span>H: <span className="text-white">---</span></span>
          <span>L: <span className="text-white">---</span></span>
          <span>C: <span className="text-white">---</span></span>
        </div>
      </div>

      {/* Decorative Corners */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary/40 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/40 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-primary/40 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-primary/40 pointer-events-none"></div>

      <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
    </div>
  );
}