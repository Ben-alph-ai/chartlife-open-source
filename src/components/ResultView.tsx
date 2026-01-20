import React, { useRef } from 'react';
import { FullAnalysisResult } from '../lib/types';
import LifeChart from './LifeChart';
import { Download, RefreshCcw, Printer, Share2, ShieldQuestion } from 'lucide-react';
import html2canvas from 'html2canvas';

interface Props {
    result: FullAnalysisResult;
    onReset: () => void;
}

export default function ResultView({ result, onReset }: Props) {
    const printRef = useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        if (!printRef.current) return;
        const canvas = await html2canvas(printRef.current, {
            backgroundColor: '#000000',
            scale: 2
        });
        const link = document.createElement('a');
        link.download = 'chartlife-terminal-export.png';
        link.href = canvas.toDataURL();
        link.click();
    };

    const handlePrint = () => {
        window.print();
    };

    const { analysis, bazi } = result;

    return (
        <div className="w-full max-w-6xl mx-auto space-y-12 animate-fade-in pb-20">

            {/* 顶部操作按钮 */}
            <div className="flex justify-between items-center no-print">
                <button onClick={onReset} className="flex items-center text-primary/60 hover:text-primary transition group font-bold text-xs tracking-widest">
                    <RefreshCcw className="w-3 h-3 mr-2 group-hover:rotate-180 transition-transform duration-500" /> 重新测算
                </button>
                <div className="flex space-x-3">
                    <button onClick={handleDownload} className="flex items-center px-4 py-2 glass rounded-lg hover:border-primary/50 text-xs font-bold text-primary transition-all">
                        <Download className="w-3 h-3 mr-2" /> 导出图片
                    </button>
                    <button onClick={handlePrint} className="flex items-center px-4 py-2 glass rounded-lg hover:border-primary/50 text-xs font-bold text-primary transition-all">
                        <Printer className="w-3 h-3 mr-2" /> 打印报告
                    </button>
                </div>
            </div>

            <div ref={printRef} className="p-4 bg-black text-text relative">
                {/* Subtle decorative grid for print ref */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] no-print" style={{ backgroundImage: 'linear-gradient(#00ff00 1px, transparent 1px), linear-gradient(90deg, #00ff00 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>

                {/* 八字命盘 */}
                <div className="text-center mb-12 relative z-10">
                    <h1 className="text-4xl font-black text-primary mb-4 tracking-tight text-glow text-center">
                        命理终端 <span className="text-white font-light">分析报告</span>
                    </h1>
                    <div className="flex justify-center space-x-4">
                        {bazi.map((p, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <span className="text-[10px] text-muted mb-1 font-bold tracking-tighter">
                                    {['年柱', '月柱', '日柱', '时柱'][i]}
                                </span>
                                <span className="border border-primary/30 px-5 py-2 rounded-lg bg-primary/5 text-2xl font-bold text-primary shadow-[0_0_15px_rgba(0,255,0,0.1)]">
                                    {p}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 运势趋势图 */}
                <div className="mb-12 relative z-10 text-left">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-black text-primary tracking-widest flex items-center">
                            <span className="w-2 h-2 bg-primary animate-pulse mr-2"></span> 运势趋势 K 线图
                        </h3>
                        <span className="text-[10px] text-muted font-mono">状态：实时数据流</span>
                    </div>
                    <LifeChart data={result.chartData} />
                </div>

                {/* 命理维度卡片 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 relative z-10 text-left">
                    <Card title="综合运势评分" score={analysis.summaryScore} content={analysis.summary} />
                    <Card title="性格特质" content={analysis.personality} />
                    <Card title="事业运" content={analysis.career} />
                    <Card title="财运" content={analysis.wealth} />
                    <Card title="感情婚姻" content={analysis.marriage} />
                    <Card title="健康运" content={analysis.health} />
                    <Card title="家庭人际" content={analysis.family} />
                    <Card title="投资风格" content={analysis.tradingStyle} highlight />
                </div>

                {/* 详细数据表格 */}
                <div className="glass rounded-2xl border border-primary/20 overflow-hidden relative z-10">
                    <div className="p-4 bg-primary/10 border-b border-primary/20 flex justify-between items-center">
                        <h3 className="font-black text-primary text-xs tracking-widest">流年运势详表</h3>
                        <div className="flex space-x-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-bullish"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/40"></div>
                        </div>
                    </div>
                    <div className="overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left font-mono">
                            <thead className="bg-black text-muted text-[10px] tracking-tighter sticky top-0 z-20">
                                <tr>
                                    <th className="p-4 border-b border-primary/10">年龄</th>
                                    <th className="p-4 border-b border-primary/10">年份</th>
                                    <th className="p-4 border-b border-primary/10">流年干支</th>
                                    <th className="p-4 border-b border-primary/10">大运</th>
                                    <th className="p-4 border-b border-primary/10 text-right">评分</th>
                                    <th className="p-4 border-b border-primary/10">AI 解读</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-primary/5">
                                {result.chartData.map((row) => (
                                    <tr key={row.age} className="hover:bg-primary/5 transition-colors group">
                                        <td className="p-4 text-muted group-hover:text-primary transition-colors">{row.age}</td>
                                        <td className="p-4 font-bold">{row.year}</td>
                                        <td className="p-4 text-primary italic font-black">{row.ganZhi}</td>
                                        <td className="p-4 text-muted">{row.daYun}</td>
                                        <td className={`p-4 text-right font-black ${row.score >= 60 ? 'text-bullish text-glow' : 'text-primary'}`}>
                                            {row.score}
                                        </td>
                                        <td className="p-4 text-xs text-muted max-w-md group-hover:text-white transition-colors">
                                            {row.reason}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="text-center text-[10px] text-muted mt-12 font-mono tracking-widest opacity-50">
                    命理终端 OS | 数据传输完毕
                </div>
            </div>
        </div>
    );
}

function Card({ title, score, content, highlight }: { title: string, score?: number, content: string, highlight?: boolean }) {
    return (
        <div className={`p-6 rounded-2xl border transition-all hover:scale-[1.02] duration-300 ${highlight ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(0,255,0,0.1)]' : 'border-primary/10 glass'}`}>
            <div className="flex justify-between items-start mb-4">
                <h4 className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">{title}</h4>
                {score !== undefined && (
                    <div className="flex items-center space-x-1">
                        <span className={`text-xl font-black ${score >= 80 ? 'text-primary text-glow' : 'text-white'}`}>{score}</span>
                    </div>
                )}
            </div>
            <p className="text-xs text-muted leading-relaxed group-hover:text-white transition-colors line-clamp-6 overflow-hidden hover:line-clamp-none">
                {content}
            </p>
        </div>
    );
}