import React from 'react';
import { useApp } from '../../store/useAppStore';
import { Modal } from '../common/Modal';
import { GeneratedReport } from '../../data/reportsData';
import { Printer, Download, Shield, FileCheck, Landmark } from 'lucide-react';
import { ReportGenerator } from '../../services/reportGenerator';

export const PrintableReportModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  report: GeneratedReport;
}> = ({ isOpen, onClose, report }) => {
  const { getSelectedSettlement, settlements } = useApp();
  const settlement = getSelectedSettlement();

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    const csvContent = ReportGenerator.exportSettlementsToCSV(settlements);
    ReportGenerator.downloadFile(csvContent, 'RAKSHA_AI_Vulnerable_Habitations_Export.csv');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Official Disaster Decision Dossier Preview"
      subtitle="Statutory DDMA / SDMA Decision-Support Document"
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Printable Paper Document Container */}
        <div className="p-8 bg-slate-950 border border-slate-700 rounded-2xl shadow-2xl text-slate-200 space-y-6 print:bg-white print:text-black print:p-0 print:border-none">
          {/* Official Letterhead Header */}
          <div className="flex items-center justify-between pb-4 border-b-2 border-slate-700 print:border-black">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-600 text-slate-950 print:bg-black print:text-white font-black text-lg flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-black tracking-wider uppercase font-mono text-white print:text-black">
                  GOVERNMENT DISASTER MANAGEMENT AUTHORITY
                </h2>
                <h3 className="text-xs text-cyan-400 print:text-gray-700 font-bold">
                  RAKSHA-AI DECISION INTELLIGENCE PLATFORM • DECISION DOSSIER
                </h3>
              </div>
            </div>

            <div className="text-right font-mono text-xs text-slate-400 print:text-gray-600">
              <div>Ref: DDMA-RAKSHA-2026-089</div>
              <div>Date: {report.dateGenerated}</div>
            </div>
          </div>

          {/* Title & Metadata */}
          <div>
            <span className="text-xs font-mono font-bold text-cyan-400 print:text-black uppercase">
              {report.reportType.replace(/_/g, ' ')}
            </span>
            <h1 className="text-xl font-bold text-white print:text-black tracking-tight mt-0.5">
              {report.title}
            </h1>
            <p className="text-xs text-slate-400 print:text-gray-600 mt-1">
              Jurisdiction: <strong>{report.district}</strong> • Authored by: {report.authorRole}
            </p>
          </div>

          {/* Executive Summary Narrative */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 print:bg-gray-100 print:text-black text-xs leading-relaxed">
            <h4 className="font-bold text-white print:text-black mb-1 uppercase tracking-wide">
              1. Executive Findings & AI Decision Rationale
            </h4>
            <p className="text-slate-300 print:text-black">{report.summaryText}</p>
          </div>

          {/* Key Metric Highlights Grid */}
          <div>
            <h4 className="font-bold text-white print:text-black text-xs uppercase tracking-wide mb-2.5">
              2. Quantitative Decision Metrics & Carrying Capacity
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              {report.keyStats.map((stat, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 print:bg-gray-50 print:border-gray-300"
                >
                  <span className="text-[10px] text-slate-400 print:text-gray-600 uppercase font-semibold block">
                    {stat.label}
                  </span>
                  <span className="text-base font-bold font-mono text-white print:text-black mt-0.5 block">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Action Phasing Summary */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 print:border-black text-xs space-y-2">
            <h4 className="font-bold text-white print:text-black uppercase tracking-wide">
              3. Sanctioned Strategic Intervention
            </h4>
            <div className="grid grid-cols-3 gap-2 font-mono text-xs">
              <div className="p-2 bg-slate-950 print:bg-white rounded border border-slate-800">
                <span className="text-slate-400 print:text-gray-600 text-[10px] block">Action Type</span>
                <span className="font-bold text-cyan-300 print:text-black">PARTIAL RELOCATION</span>
              </div>
              <div className="p-2 bg-slate-950 print:bg-white rounded border border-slate-800">
                <span className="text-slate-400 print:text-gray-600 text-[10px] block">Relocating Pop</span>
                <span className="font-bold text-white print:text-black">2,650 Residents</span>
              </div>
              <div className="p-2 bg-slate-950 print:bg-white rounded border border-slate-800">
                <span className="text-slate-400 print:text-gray-600 text-[10px] block">Approved Haven</span>
                <span className="font-bold text-emerald-400 print:text-black">Site B (Pothigai)</span>
              </div>
            </div>
          </div>

          {/* Official Signatures Block */}
          <div className="pt-6 border-t border-slate-800 print:border-black grid grid-cols-2 gap-8 text-xs">
            <div>
              <div className="h-10 border-b border-dashed border-slate-700 print:border-black mb-1"></div>
              <span className="font-bold text-white print:text-black block">Thiru. S. Arunkumar, IAS</span>
              <span className="text-[11px] text-slate-400 print:text-gray-600">District Collector & Chairman DDMA</span>
            </div>

            <div>
              <div className="h-10 border-b border-dashed border-slate-700 print:border-black mb-1"></div>
              <span className="font-bold text-white print:text-black block">Director of Town Planning</span>
              <span className="text-[11px] text-slate-400 print:text-gray-600">State Disaster Management Authority</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 no-print">
          <button
            onClick={handleDownloadCSV}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export Full Habitations (CSV)</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official PDF Dossier</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
