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

            {/* Header Actions */}
            <div className="flex justify-between items-center no-print">
                <button onClick={onReset} className="flex items-center text-primary/60 hover:text-primary transition group font-bold text-xs tracking-widest">
                    <RefreshCcw className="w-3 h-3 mr-2 group-hover:rotate-180 transition-transform duration-500" /> NEW SESSION
                </button>
                <div className="flex space-x-3">
                    <button onClick={handleDownload} className="flex items-center px-4 py-2 glass rounded-lg hover:border-primary/50 text-xs font-bold text-primary transition-all">
                        <Download className="w-3 h-3 mr-2" /> EXPORT DATA
                    </button>
                    <button onClick={handlePrint} className="flex items-center px-4 py-2 glass rounded-lg hover:border-primary/50 text-xs font-bold text-primary transition-all">
                        <Printer className="w-3 h-3 mr-2" /> PRINT VIEW
                    </button>
                </div>
            </div>

            <div ref={printRef} className="p-4 bg-black text-text relative">
                {/* Subtle decorative grid for print ref */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] no-print" style={{ backgroundImage: 'linear-gradient(#00ff00 1px, transparent 1px), linear-gradient(90deg, #00ff00 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>

                {/* Header Summary */}
                <div className="text-center mb-12 relative z-10">
                    <h1 className="text-4xl font-black text-primary mb-4 tracking-tighter italic text-glow">
                        DESTINY TERMINAL <span className="text-white not-italic">REPORT</span>
                    </h1>
                    <div className="flex justify-center space-x-4">
                        {bazi.map((p, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <span className="text-[10px] text-muted mb-1 font-bold uppercase tracking-tighter">
                                    {['Year', 'Month', 'Day', 'Hour'][i]}
                                </span>
                                <span className="border border-primary/30 px-5 py-2 rounded-lg bg-primary/5 text-2xl font-bold text-primary shadow-[0_0_15px_rgba(0,255,0,0.1)]">
                                    {p}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chart Section */}
                <div className="mb-12 relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-black text-primary tracking-[0.3em] uppercase flex items-center">
                            <span className="w-2 h-2 bg-primary animate-pulse mr-2"></span> Luck Trend K-Line
                        </h3>
                        <span className="text-[10px] text-muted font-mono uppercase">Status: Live Data Stream</span>
                    </div>
                    <LifeChart data={result.chartData} />
                </div>

                {/* Dimension Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 relative z-10">
                    <Card title="TOTAL LUCK SCORE" score={analysis.summaryScore} content={analysis.summary} />
                    <Card title="CHARACTER CORE" content={analysis.personality} />
                    <Card title="CAREER VECTOR" content={analysis.career} />
                    <Card title="WEALTH LIQUIDITY" content={analysis.wealth} />
                    <Card title="RELATIONSHIP NODES" content={analysis.marriage} />
                    <Card title="VITALITY STATUS" content={analysis.health} />
                    <Card title="SOCIAL GRAPH" content={analysis.family} />
                    <Card title="TRADING BIAS" content={analysis.tradingStyle} highlight />
                </div>

                {/* Detailed Table */}
                <div className="glass rounded-2xl border border-primary/20 overflow-hidden relative z-10 group/table">
                    <div className="p-4 bg-primary/10 border-b border-primary/20 flex justify-between items-center relative overflow-hidden">
                        {/* Scanning bar */}
                        <div className="absolute top-0 left-0 w-full h-px bg-primary shadow-[0_0_10px_#0f0] animate-scan opacity-30"></div>

                        <h3 className="font-black text-primary text-xs tracking-widest uppercase flex items-center">
                            <span className="w-1.5 h-1.5 bg-primary mr-2"></span> Chronological Data Stream
                        </h3>
                        <div className="flex space-x-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-bullish animate-pulse"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/40"></div>
                        </div>
                    </div>
                    <div className="overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left font-mono">
                            <thead className="bg-black text-muted text-[10px] uppercase tracking-tighter sticky top-0 z-20">
                                <tr>
                                    <th className="p-4 border-b border-primary/10">Age</th>
                                    <th className="p-4 border-b border-primary/10">Year</th>
                                    <th className="p-4 border-b border-primary/10">Pillar</th>
                                    <th className="p-4 border-b border-primary/10">Luck Cycle</th>
                                    <th className="p-4 border-b border-primary/10 text-right">Score</th>
                                    <th className="p-4 border-b border-primary/10">AI Interpretation</th>
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

                <div className="text-center text-[10px] text-muted mt-12 font-mono uppercase tracking-[0.4em] opacity-50">
                    Terminal OS | End of Data Transmission
                </div>
            </div>
        </div>
    );
}

function Card({ title, score, content, highlight }: { title: string, score?: number, content: string, highlight?: boolean }) {
    return (
        <div className={`p-6 rounded-2xl border transition-all hover:scale-[1.02] duration-500 relative overflow-hidden group/card ${highlight ? 'border-primary bg-primary/5 shadow-[0_0_30px_rgba(0,255,0,0.15)]' : 'border-primary/10 glass'}`}>
            {/* Corner Bracket */}
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/20 group-hover/card:border-primary/60 transition-colors"></div>

            <div className="flex justify-between items-start mb-4 relative z-10">
                <h4 className="text-[10px] font-black text-primary/60 uppercase tracking-[0.2em] group-hover/card:text-primary transition-colors">{title}</h4>
                {score !== undefined && (
                    <div className="flex items-center space-x-1">
                        <span className={`text-xl font-black font-mono ${score >= 80 ? 'text-primary text-glow' : 'text-white'}`}>{score}</span>
                    </div>
                )}
            </div>
            <p className="text-xs text-muted leading-relaxed group-hover/card:text-white transition-colors line-clamp-6 overflow-hidden hover:line-clamp-none font-medium">
                {content}
            </p>
        </div>
    );
}