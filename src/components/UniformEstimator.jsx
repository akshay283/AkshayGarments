import React, { useState } from 'react';
import {
  Calculator,
  Check,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';
import { useQuoteModal } from '../context/QuoteModalContext';

export const UniformEstimator = () => {
  const { openQuoteModal } = useQuoteModal();
  const [studentCount, setStudentCount] = useState(300);
  const [fabricGrade, setFabricGrade] = useState('premium'); // 'standard' | 'premium' | 'luxury'

  const [items, setItems] = useState({
    shirts: { name: 'School Shirts (Set of 2)', price: 650, included: true },
    bottoms: { name: 'Trousers / Skirts (Set of 2)', price: 950, included: true },
    blazer: { name: 'Formal Structured Blazer (1 Pc)', price: 1100, included: true },
    sweater: { name: 'V-Neck Winter Sweater (1 Pc)', price: 450, included: false },
    sports: { name: 'Sports House Polo & Track Pant (1 Set)', price: 680, included: true },
    accessories: { name: 'Woven Tie & Embossed Belt Set', price: 160, included: true },
    socks: { name: 'Cotton Uniform Socks (Pack of 3)', price: 150, included: false },
  });

  const toggleItem = (key) => {
    setItems(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        included: !prev[key].included
      }
    }));
  };

  const gradeMultiplier = {
    standard: 0.9,
    premium: 1.0,
    luxury: 1.25
  }[fabricGrade];

  // Calculate per student cost
  const baseStudentTotal = Object.values(items)
    .filter(item => item.included)
    .reduce((sum, item) => sum + item.price, 0);

  const perStudentCost = Math.round(baseStudentTotal * gradeMultiplier);
  const totalEstimatedCost = perStudentCost * studentCount;

  const handleConvertQuote = () => {
    const includedItemsList = Object.entries(items)
      .filter(([_, item]) => item.included)
      .map(([_, item]) => item.name)
      .join(', ');

    openQuoteModal({
      productName: `Bulk Uniform Package (${studentCount} Students)`,
      category: 'Institutional Uniforms',
      type: 'bulk-school',
      quantity: String(studentCount),
      notes: `Estimator Setup: Fabric Grade: ${fabricGrade.toUpperCase()}, Included Items: ${includedItemsList}. Target student strength: ${studentCount}.`
    });
  };

  return (
    <div className="bg-gradient-to-br from-navy-950 via-navy-900 to-slate-900 rounded-3xl text-white p-6 sm:p-10 border border-navy-800 shadow-2xl relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-navy-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Calculator className="w-3.5 h-3.5" />
              <span>Interactive School Budget Estimator</span>
            </div>
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-white">
              Institutional Uniform Cost Calculator
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
              Customize uniform kit items and fabric grade to calculate estimated wholesale pricing for your student body.
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 bg-navy-900/80 px-4 py-2 rounded-xl border border-navy-700/60">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Direct Manufacturer Wholesale Rates</span>
          </div>
        </div>

        {/* 2-Column Controls & Results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 items-start">

          {/* Left Column: Student Count & Item Selection (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">

            {/* 1. Student Count */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  1. Total Number of Students:
                </label>
                <span className="text-lg font-black text-brand-400 font-mono">
                  {studentCount} Students
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="3000"
                step="50"
                value={studentCount}
                onChange={(e) => setStudentCount(Number(e.target.value))}
                className="w-full accent-brand-500 cursor-pointer h-2 bg-navy-800 rounded-lg"
              />
              <div className="flex gap-2 mt-2">
                {[100, 250, 500, 1000, 2000].map((num) => (
                  <button
                    key={num}
                    onClick={() => setStudentCount(num)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold border transition-all ${studentCount === num
                        ? 'bg-brand-600 text-white border-brand-500'
                        : 'bg-navy-800/80 text-slate-400 border-navy-700 hover:bg-navy-700 hover:text-white'
                      }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Fabric Quality Tier */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                2. Select Fabric Grade:
              </label>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {[
                  { id: 'standard', name: 'Economy PC/PV', desc: 'Durable Daily Standard' },
                  { id: 'premium', name: 'Super Suiting PV', desc: 'Wrinkle-Free Gold Std' },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => setFabricGrade(tier.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${fabricGrade === tier.id
                        ? 'bg-brand-600/20 border-brand-400 text-white shadow-lg ring-1 ring-brand-400'
                        : 'bg-navy-900/60 border-navy-800 text-slate-400 hover:border-navy-700 hover:text-slate-200'
                      }`}
                  >
                    <div className="text-xs font-bold">{tier.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{tier.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Kit Items Checklist */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5">
                3. Uniform Kit Components:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {Object.entries(items).map(([key, item]) => (
                  <div
                    key={key}
                    onClick={() => toggleItem(key)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${item.included
                        ? 'bg-navy-800/90 border-brand-500/80 text-white'
                        : 'bg-navy-900/40 border-navy-800/80 text-slate-500 hover:border-navy-700'
                      }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${item.included
                          ? 'bg-brand-600 border-brand-500 text-white'
                          : 'border-navy-700 bg-navy-900'
                        }`}>
                        {item.included && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <span className="text-xs font-semibold">{item.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Estimated Summary Box (5 Cols) */}
          <div className="lg:col-span-5 bg-navy-900/90 border border-navy-700/80 rounded-2xl p-6 space-y-6">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-gold-400">
                Ballpark Estimate Summary
              </div>
              <h4 className="font-display font-bold text-lg text-white mt-1">
                Annual Uniform Supply Package
              </h4>
            </div>

            {/* Estimated Breakdown */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-navy-800 text-slate-300">
                <span>Selected Student Strength</span>
                <span className="font-bold text-white font-mono">{studentCount} Students</span>
              </div>
              <div className="flex justify-between py-2 border-b border-navy-800 text-slate-300">
                <span>Fabric Grade Level</span>
                <span className="font-bold text-gold-400 capitalize">{fabricGrade}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-navy-800 text-slate-300">
                <span>Uniform Kit Items Included</span>
                <span className="font-bold text-white">
                  {Object.values(items).filter(i => i.included).length} Garment Sets
                </span>
              </div>

              {/* Total Pieces Highlight */}
              <div className="pt-2">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Total Estimated Garments:</div>
                <div className="text-2xl font-black text-brand-400 mt-0.5">
                  {(Object.values(items).filter(i => i.included).length * studentCount * 2).toLocaleString('en-IN')}{' '}
                  <span className="text-xs font-normal text-slate-400">total pieces</span>
                </div>
              </div>

              {/* Wholesale Pricing Highlight */}
              <div className="bg-navy-950 p-4 rounded-xl border border-navy-800 mt-4">
                <div className="text-[11px] text-gold-400 font-bold uppercase tracking-wider">
                  Wholesale Procurement Terms:
                </div>
                <div className="text-xl sm:text-2xl font-black text-white mt-1 font-display">
                  Manufacturer Direct Bulk Rates
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  *Custom rates applied based on order volume ({studentCount} students), fabric weave choice, and school crest embroidery specifications.
                </div>
              </div>
            </div>

            {/* Convert Button */}
            <button
              onClick={handleConvertQuote}
              className="w-full py-3.5 bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 transform active:scale-98"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Convert to Official School Tender Quote</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
