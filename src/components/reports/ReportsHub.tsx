import React, { useState } from 'react';
import { useApp } from '../../store/useAppStore';
import { MockDataService } from '../../services/mockDataService';
import { GeneratedReport } from '../../data/reportsData';
import { PrintableReportModal } from './PrintableReportModal';
import { ReportGenerator } from '../../services/reportGenerator';
import { 
  FileSpreadsheet, 
  Download, 
  Printer, 
  FileText, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  Building2,
  Calendar,
  Share2
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const ReportsHub: React.FC = () => {
  const { settlements, getSelectedSettlement, addToast } = useApp();
  const [reportsList, setReportsList] = useState<GeneratedReport[]>(MockDataService.getReports());
  const [activeReportForModal, setActiveReportForModal] = useState<GeneratedReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateNewReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const settlement = getSelectedSettlement();
      const newRep: GeneratedReport = {
        id: 'rep-' + Date.now(),
        title: `Comprehensive Relocation Sanction Dossier: ${settlement.name}`,
        reportType: 'SETTLEMENT_DIGITAL_TWIN',
        district: settlement.district,
        settlementName: settlement.name,
        dateGenerated: new Date().toISOString().split('T')[0],
        authorRole: 'DDMA Decision Intelligence Unit',
        summaryText: `AI Decision Engine evaluated ${settlement.name} (Risk ${settlement.overallRisk}/100, Confidence ${settlement.dataConfidence}%). Approved ${settlement.aiRecommendation.replace('_', ' ')}: relocating ${settlement.relocationPopulation.toLocaleString()} citizens to Safe Haven Site B with an estimated capital budget of ₹${settlement.costRelocateCr} Cr, preventing ₹${settlement.costOfInactionCr} Cr in future inaction damages.`,
        keyStats: [
          { label: 'Overall Risk Score', value: `${settlement.overallRisk} / 100` },
          { label: 'Data Confidence', value: `${settlement.dataConfidence}% (Verified)` },
          { label: 'Relocated Population', value: `${settlement.relocationPopulation.toLocaleString()} citizens` },
          { label: 'Recommended Haven', value: 'Site B (Pothigai)' },
          { label: 'Estimated Budget', value: `₹${settlement.costRelocateCr} Cr` },
          { label: '10-Yr Inaction Loss Avoided', value: `₹${settlement.costOfInactionCr} Cr` }
        ],
        status: 'READY',
        downloadFileName: `${settlement.name}_Relocation_Dossier_2026.pdf`
      };

      setReportsList(prev => [newRep, ...prev]);
      MockDataService.addReport(newRep);
      setIsGenerating(false);
      setActiveReportForModal(newRep);
      addToast({
        type: 'success',
        title: 'Decision Dossier Generated Successfully',
        description: `Official report for ${settlement.name} ready for preview and printing.`
      });
    }, 650);
  };

  const handleExportCSV = () => {
    const csvData = ReportGenerator.exportSettlementsToCSV(settlements);
    ReportGenerator.downloadFile(csvData, 'RAKSHA_AI_Vulnerable_Habitations_Full_Data.csv');
    addToast({
      type: 'info',
      title: 'CSV Data Exported',
      description: 'Downloaded complete 128-habitation risk dataset.'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex-shrink-0 mt-0.5">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wide">
                GOVERNMENT DECISION REPORTING CENTER
              </span>
              <span className="text-[10px] font-mono font-bold bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800">
                STATUTORY COMPLIANT
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Official Decision Dossiers & Executive Summaries
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Generate auditable, printable PDF executive dossiers and export quantitative GIS hazard datasets.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-center flex-shrink-0">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleGenerateNewReport}
            disabled={isGenerating}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-all active:scale-95 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 fill-slate-950" />
            <span>{isGenerating ? 'Synthesizing Dossier...' : 'Generate Settlement Dossier'}</span>
          </button>
        </div>
      </div>

      {/* Available Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reportsList.map((rep) => (
          <div
            key={rep.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                  {rep.reportType.replace(/_/g, ' ')}
                </span>
                <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{rep.dateGenerated}</span>
                </span>
              </div>

              <h4 className="text-sm font-bold text-white tracking-tight mt-1 leading-snug">{rep.title}</h4>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-3 leading-relaxed">{rep.summaryText}</p>

              <div className="grid grid-cols-2 gap-2 my-3 text-xs bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                {rep.keyStats.slice(0, 2).map((st, sIdx) => (
                  <div key={sIdx}>
                    <span className="text-[9px] text-slate-500 uppercase font-semibold block">{st.label}</span>
                    <span className="font-mono font-bold text-slate-200 text-xs">{st.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
              <span className="text-[10px] text-slate-500 font-mono truncate">{rep.downloadFileName}</span>

              <button
                onClick={() => setActiveReportForModal(rep)}
                className="px-3.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 text-xs font-bold border border-cyan-500/40 transition-colors flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Preview & Print</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Printable Modal */}
      {activeReportForModal && (
        <PrintableReportModal
          isOpen={!!activeReportForModal}
          onClose={() => setActiveReportForModal(null)}
          report={activeReportForModal}
        />
      )}
    </div>
  );
};
