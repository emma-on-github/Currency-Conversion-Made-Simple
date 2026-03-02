import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeftRight, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown, 
  Info, 
  ChevronDown,
  Search,
  History,
  Globe
} from 'lucide-react';
import { CURRENCIES } from './constants';
import { fetchExchangeRate, ExchangeRateResponse } from './services/gemini';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [amount, setAmount] = useState<string>('100');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [result, setResult] = useState<ExchangeRateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSwapping, setIsSwapping] = useState(false);

  const handleConvert = useCallback(async () => {
    if (!amount || isNaN(Number(amount))) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await fetchExchangeRate(fromCurrency, toCurrency);
      setResult(data);
    } catch (err) {
      setError('Failed to fetch the latest rates. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [amount, fromCurrency, toCurrency]);

  useEffect(() => {
    handleConvert();
  }, [fromCurrency, toCurrency]);

  const swapCurrencies = () => {
    setIsSwapping(true);
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    setTimeout(() => setIsSwapping(false), 500);
  };

  const fromInfo = CURRENCIES.find(c => c.code === fromCurrency);
  const toInfo = CURRENCIES.find(c => c.code === toCurrency);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans selection:bg-indigo-100">
      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <Globe className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">GlobalRate</h1>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500">
          <a href="#" className="hover:text-indigo-600 transition-colors">Markets</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Tools</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Resources</a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-12 pb-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Currency conversion <br />
            <span className="text-indigo-600">made simple.</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Get real-time exchange rates powered by AI. Accurate, fast, and reliable data for over 30 global currencies.
          </p>
        </motion.div>

        {/* Converter Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600" />
          
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 items-end">
            {/* From Currency & Amount */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Currency from</label>
              <div className="relative">
                <select 
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="w-full appearance-none bg-gray-50 border-2 border-transparent hover:border-gray-200 rounded-2xl py-4 px-4 font-semibold text-lg cursor-pointer transition-all outline-none"
                >
                  {CURRENCIES.map(c => (
                    <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
              </div>
              <div className="mt-4">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Amount</label>
                <div className="relative mt-1">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                    {fromInfo?.symbol}
                  </div>
                  <input 
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl py-4 pl-10 pr-4 text-xl font-semibold transition-all outline-none"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center pb-2">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9, rotate: 180 }}
                onClick={swapCurrencies}
                className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors shadow-sm"
              >
                <ArrowLeftRight className={cn("w-5 h-5 transition-transform duration-500", isSwapping && "rotate-180")} />
              </motion.button>
            </div>

            {/* To Currency & Result */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Converted To</label>
              <div className="relative">
                <select 
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="w-full appearance-none bg-gray-50 border-2 border-transparent hover:border-gray-200 rounded-2xl py-4 px-4 font-semibold text-lg cursor-pointer transition-all outline-none"
                >
                  {CURRENCIES.map(c => (
                    <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
              </div>
              <div className="mt-4">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Converted Amount</label>
                <div className="relative mt-1">
                  <div className="w-full bg-indigo-50/50 border-2 border-transparent rounded-2xl py-4 px-4 text-xl font-bold text-indigo-900 min-h-[68px] flex items-center">
                    <AnimatePresence mode="wait">
                      {loading ? (
                        <motion.div 
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2 text-indigo-600 font-medium text-base"
                        >
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Updating...</span>
                        </motion.div>
                      ) : result ? (
                        <motion.div 
                          key="result"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                        >
                          {toInfo?.symbol} {(Number(amount) * result.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </motion.div>
                      ) : (
                        <span className="text-gray-300 text-base">0.00</span>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Result Footer */}
          <AnimatePresence>
            {result && !loading && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-10 pt-8 border-t border-gray-100"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-1">
                    <div className="text-sm text-gray-400 font-medium">Exchange Rate</div>
                    <div className="text-lg font-semibold flex items-center gap-2">
                      1 {fromCurrency} = {result.rate.toFixed(4)} {toCurrency}
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-700">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Live
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">Last Updated</div>
                      <div className="text-sm font-medium text-gray-600">{result.lastUpdated}</div>
                    </div>
                    <button 
                      onClick={handleConvert}
                      className="p-3 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* AI Context Box */}
                <div className="mt-8 p-5 bg-stone-50 rounded-2xl border border-stone-100 flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
                    <Info className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-1">Market Insight</h4>
                    <p className="text-sm text-gray-600 leading-relaxed italic">
                      "{result.context}"
                    </p>
                    <div className="mt-2 text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                      Source: {result.source}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium flex items-center gap-2">
              <Info className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
              <History className="text-indigo-600 w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Historical Data</h3>
            <p className="text-gray-500 text-sm">View past performance and trends for any currency pair over the last 12 months.</p>
          </div>
          <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
              <TrendingUp className="text-emerald-600 w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Rate Alerts</h3>
            <p className="text-gray-500 text-sm">Set target rates and get notified when the market hits your desired conversion value.</p>
          </div>
          <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-4">
              <Search className="text-amber-600 w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">AI Insights</h3>
            <p className="text-gray-500 text-sm">Get context-aware explanations for market movements powered by Gemini AI.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Globe className="text-white w-5 h-5" />
            </div>
            <span className="font-bold tracking-tight">GlobalRate</span>
          </div>
          <p className="text-gray-400 text-sm">© 2024 GlobalRate AI. All rights reserved. Data provided for informational purposes only.</p>
          <div className="flex gap-6 text-sm font-medium text-gray-500">
            <a href="#" className="hover:text-indigo-600">Privacy</a>
            <a href="#" className="hover:text-indigo-600">Terms</a>
            <a href="#" className="hover:text-indigo-600">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
