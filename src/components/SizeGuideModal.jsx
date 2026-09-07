import React, { useState, useEffect } from 'react';
import { X, Ruler, ShieldCheck } from 'lucide-react';

export const SizeGuideModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('shirts'); // 'shirts' | 'trousers' | 'skirts' | 'blazers'
  const [unit, setUnit] = useState('inches'); // 'inches' | 'cm'

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeTables = {
    shirts: {
      title: "School Shirts Size Chart",
      headers: ["Size", "Age Group", "Chest", "Collar", "Shirt Length", "Sleeve (Half)"],
      rows: unit === 'inches' ? [
        ["22", "3 - 4 Yrs", "24\"", "10.5\"", "17\"", "5.5\""],
        ["24", "4 - 5 Yrs", "26\"", "11.0\"", "18\"", "6.0\""],
        ["26", "5 - 6 Yrs", "28\"", "11.5\"", "19.5\"", "6.5\""],
        ["28", "7 - 8 Yrs", "30\"", "12.0\"", "21\"", "7.0\""],
        ["30", "9 - 10 Yrs", "32\"", "12.5\"", "22.5\"", "7.5\""],
        ["32", "11 - 12 Yrs", "34\"", "13.0\"", "24\"", "8.0\""],
        ["34", "13 - 14 Yrs", "36\"", "13.5\"", "25.5\"", "8.5\""],
        ["36", "14 - 15 Yrs (S)", "38\"", "14.0\"", "27\"", "9.0\""],
        ["38", "16+ Yrs (M)", "40\"", "14.5\"", "28.5\"", "9.5\""],
        ["40", "Senior (L)", "42\"", "15.0\"", "30\"", "10.0\""],
        ["42", "Senior (XL)", "44\"", "15.5\"", "31\"", "10.5\""]
      ] : [
        ["22", "3 - 4 Yrs", "61 cm", "26.5 cm", "43 cm", "14 cm"],
        ["24", "4 - 5 Yrs", "66 cm", "28 cm", "46 cm", "15 cm"],
        ["26", "5 - 6 Yrs", "71 cm", "29 cm", "49.5 cm", "16.5 cm"],
        ["28", "7 - 8 Yrs", "76 cm", "30.5 cm", "53 cm", "18 cm"],
        ["30", "9 - 10 Yrs", "81 cm", "32 cm", "57 cm", "19 cm"],
        ["32", "11 - 12 Yrs", "86 cm", "33 cm", "61 cm", "20.5 cm"],
        ["34", "13 - 14 Yrs", "91 cm", "34.5 cm", "65 cm", "21.5 cm"],
        ["36", "14 - 15 Yrs (S)", "96.5 cm", "35.5 cm", "68.5 cm", "23 cm"],
        ["38", "16+ Yrs (M)", "101.5 cm", "37 cm", "72 cm", "24 cm"],
        ["40", "Senior (L)", "106.5 cm", "38 cm", "76 cm", "25.5 cm"],
        ["42", "Senior (XL)", "112 cm", "39.5 cm", "79 cm", "26.5 cm"]
      ]
    },
    trousers: {
      title: "School Trousers & Shorts Size Chart",
      headers: ["Size", "Age Group", "Waist (Relaxed)", "Waist (Stretched)", "Outseam Length", "Hip"],
      rows: unit === 'inches' ? [
        ["20", "3 - 4 Yrs", "20\"", "22\"", "23\"", "26\""],
        ["22", "5 - 6 Yrs", "22\"", "24\"", "26\"", "28\""],
        ["24", "7 - 8 Yrs", "24\"", "26\"", "29\"", "30\""],
        ["26", "9 - 10 Yrs", "26\"", "28\"", "32\"", "32\""],
        ["28", "11 - 12 Yrs", "28\"", "30\"", "35\"", "34\""],
        ["30", "13 - 14 Yrs", "30\"", "32\"", "38\"", "36\""],
        ["32", "15 - 16 Yrs", "32\"", "34\"", "40\"", "38\""],
        ["34", "Senior (M)", "34\"", "36\"", "41.5\"", "40\""],
        ["36", "Senior (L)", "36\"", "38\"", "42.5\"", "42\""]
      ] : [
        ["20", "3 - 4 Yrs", "51 cm", "56 cm", "58.5 cm", "66 cm"],
        ["22", "5 - 6 Yrs", "56 cm", "61 cm", "66 cm", "71 cm"],
        ["24", "7 - 8 Yrs", "61 cm", "66 cm", "73.5 cm", "76 cm"],
        ["26", "9 - 10 Yrs", "66 cm", "71 cm", "81 cm", "81 cm"],
        ["28", "11 - 12 Yrs", "71 cm", "76 cm", "89 cm", "86 cm"],
        ["30", "13 - 14 Yrs", "76 cm", "81 cm", "96.5 cm", "91.5 cm"],
        ["32", "15 - 16 Yrs", "81 cm", "86 cm", "101.5 cm", "96.5 cm"],
        ["34", "Senior (M)", "86 cm", "91.5 cm", "105.5 cm", "101.5 cm"],
        ["36", "Senior (L)", "91.5 cm", "96.5 cm", "108 cm", "106.5 cm"]
      ]
    },
    skirts: {
      title: "Girls Pleated Skirts & Pinafores Size Chart",
      headers: ["Size", "Age Group", "Waist", "Skirt Length", "Pinafore Total Length"],
      rows: unit === 'inches' ? [
        ["20", "3 - 5 Yrs", "20\"", "13\"", "22\""],
        ["22", "6 - 7 Yrs", "22\"", "15\"", "25\""],
        ["24", "8 - 9 Yrs", "24\"", "17\"", "28\""],
        ["26", "10 - 11 Yrs", "26\"", "19\"", "31\""],
        ["28", "12 - 13 Yrs", "28\"", "21\"", "34\""],
        ["30", "14 - 15 Yrs", "30\"", "22.5\"", "36\""],
        ["32", "Senior (S/M)", "32\"", "23.5\"", "38\""]
      ] : [
        ["20", "3 - 5 Yrs", "51 cm", "33 cm", "56 cm"],
        ["22", "6 - 7 Yrs", "56 cm", "38 cm", "63.5 cm"],
        ["24", "8 - 9 Yrs", "61 cm", "43 cm", "71 cm"],
        ["26", "10 - 11 Yrs", "66 cm", "48 cm", "79 cm"],
        ["28", "12 - 13 Yrs", "71 cm", "53 cm", "86 cm"],
        ["30", "14 - 15 Yrs", "76 cm", "57 cm", "91.5 cm"],
        ["32", "Senior (S/M)", "81 cm", "60 cm", "96.5 cm"]
      ]
    },
    blazers: {
      title: "Structured School Blazers Size Chart",
      headers: ["Size", "To Fit Chest", "Shoulder", "Blazer Length", "Sleeve Length"],
      rows: unit === 'inches' ? [
        ["26", "26\" - 28\"", "12.5\"", "20\"", "17\""],
        ["28", "28\" - 30\"", "13.5\"", "22\"", "19\""],
        ["30", "30\" - 32\"", "14.5\"", "24\"", "20.5\""],
        ["32", "32\" - 34\"", "15.5\"", "26\"", "22\""],
        ["34", "34\" - 36\"", "16.5\"", "27.5\"", "23.5\""],
        ["36", "36\" - 38\"", "17.5\"", "29\"", "24.5\""],
        ["38", "38\" - 40\"", "18.5\"", "30\"", "25.5\""],
        ["40", "40\" - 42\"", "19.5\"", "31\"", "26.5\""]
      ] : [
        ["26", "66 - 71 cm", "32 cm", "51 cm", "43 cm"],
        ["28", "71 - 76 cm", "34 cm", "56 cm", "48 cm"],
        ["30", "76 - 81 cm", "37 cm", "61 cm", "52 cm"],
        ["32", "81 - 86 cm", "39 cm", "66 cm", "56 cm"],
        ["34", "86 - 91.5 cm", "42 cm", "70 cm", "60 cm"],
        ["36", "91.5 - 96.5 cm", "44.5 cm", "73.5 cm", "62 cm"],
        ["38", "96.5 - 101.5 cm", "47 cm", "76 cm", "65 cm"],
        ["40", "101.5 - 106.5 cm", "49.5 cm", "79 cm", "67 cm"]
      ]
    }
  };

  const currentTable = sizeTables[activeTab];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-navy-950/80 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-slide-up flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center border border-brand-500/20">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg sm:text-xl text-navy-950">
                School Uniform Standardized Size Chart
              </h3>
              <p className="text-xs text-slate-500">
                Accurate measurements for Kindergarten, Primary, Middle, High School & Senior Students.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 bg-slate-200/60 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls: Tabs and Unit Toggle */}
        <div className="p-4 sm:px-6 bg-white border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'shirts', name: 'Shirts' },
              { id: 'trousers', name: 'Trousers & Shorts' },
              { id: 'skirts', name: 'Skirts & Pinafores' },
              { id: 'blazers', name: 'Blazers' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === tab.id
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setUnit('inches')}
              className={`px-3 py-1 rounded-md transition-all ${unit === 'inches' ? 'bg-white text-navy-950 shadow-2xs' : 'text-slate-500'
                }`}
            >
              Inches (\")
            </button>
            <button
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 rounded-md transition-all ${unit === 'cm' ? 'bg-white text-navy-950 shadow-2xs' : 'text-slate-500'
                }`}
            >
              Centimeters (cm)
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <h4 className="font-display font-bold text-base text-navy-950 mb-3">
            {currentTable.title}
          </h4>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[550px]">
              <thead>
                <tr className="bg-slate-100 text-slate-700 uppercase font-bold tracking-wider">
                  {currentTable.headers.map((header, idx) => (
                    <th key={idx} className="p-3 border-b border-slate-200">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {currentTable.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50/80 transition-colors">
                    {row.map((cell, cIdx) => (
                      <td
                        key={cIdx}
                        className={`p-3 ${cIdx === 0 ? 'font-bold text-brand-700 bg-brand-50/40' : ''}`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Sizing Fit Kit Note */}
          <div className="mt-6 bg-brand-50/80 border border-brand-200 rounded-xl p-4 flex items-start gap-3 text-xs text-brand-950">
            <ShieldCheck className="w-5 h-5 text-brand-600 mt-0.5 shrink-0" />
            <div>
              <strong className="font-bold">For School Management & Institutional Committees:</strong>
              <p className="text-slate-600 mt-0.5">
                We supply complete physical <strong>Sizing Fit Kits</strong> directly to your school premises with garments of all standard sizes for student trials before bulk manufacturing begins, ensuring 100% fit accuracy.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
