"use client";

import React, { useState, useEffect } from 'react';
import InputForm from '@/components/InputForm';
import ResultView from '@/components/ResultView';
import { UserInput, FullAnalysisResult, ApiResponse } from '@/lib/types';

export default function Home() {
  const [result, setResult] = useState<FullAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load from local storage on mount (optional feature)
  useEffect(() => {
    const saved = localStorage.getItem('last_chart_result');
    if (saved) {
      try {
        setResult(JSON.parse(saved));
      } catch(e) {}
    }
  }, []);

  const handleAnalyze = async (input: UserInput) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      });
      
      const data: ApiResponse = await res.json();
      
      if (res.ok && data.result) {
        setResult(data.result);
        localStorage.setItem('last_chart_result', JSON.stringify(data.result));
      } else {
        setError(data.error || "Analysis failed");
      }
    } catch (err) {
      setError("Network error or server unavailable.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    localStorage.removeItem('last_chart_result');
  };

  return (
    <main className="min-h-screen p-4 md:p-8">
      {error && (
        <div className="fixed top-4 right-4 bg-red-900/80 text-white p-4 rounded border border-red-500 z-50">
           {error}
        </div>
      )}

      {!result ? (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <InputForm onSubmit={handleAnalyze} isLoading={loading} />
        </div>
      ) : (
        <ResultView result={result} onReset={reset} />
      )}
    </main>
  );
}