import { useRef, useState } from 'react';
import { useResearchStore } from '../store/researchStore';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, FileDown, FileType2, Loader2, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { saveAs } from 'file-saver';
import html2pdf from 'html2pdf.js';

export const ReportDisplay = () => {
  const { report, status } = useResearchStore();
  const reportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (status !== 'completed' || !report) return null;

  const handleExportMarkdown = () => {
    try {
      const blob = new Blob([report], { type: 'text/markdown;charset=utf-8' });
      saveAs(blob, 'AI-Research-Report.md');
      toast.success('Markdown exported successfully!');
    } catch (e) {
      toast.error('Failed to export Markdown');
    }
    setDropdownOpen(false);
  };

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    setDropdownOpen(false);
    toast.info('Generating PDF...', { id: 'pdf-toast' });
    
    try {
      const element = reportRef.current;
      const opt = {
        margin: 1,
        filename: 'AI-Research-Report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#030712' },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      
      await html2pdf().set(opt).from(element).save();
      toast.success('PDF generated successfully!', { id: 'pdf-toast' });
    } catch (e) {
      toast.error('Failed to generate PDF', { id: 'pdf-toast' });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportWord = () => {
    if (!reportRef.current) return;
    try {
      const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
      const footer = "</body></html>";
      const sourceHTML = header + reportRef.current.innerHTML + footer;
      
      const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
      const fileDownload = document.createElement("a");
      document.body.appendChild(fileDownload);
      fileDownload.href = source;
      fileDownload.download = 'AI-Research-Report.doc';
      fileDownload.click();
      document.body.removeChild(fileDownload);
      toast.success('Word document exported successfully!');
    } catch (e) {
      toast.error('Failed to export Word Document');
    }
    setDropdownOpen(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mt-12 mb-20 relative z-10"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-br from-primary-500/30 to-accent-500/30 rounded-3xl blur-xl opacity-50"></div>
      <div className="relative glass-panel rounded-3xl overflow-visible shadow-2xl border border-white/10">
        
        {/* Header Header */}
        <div className="bg-white/5 border-b border-white/10 p-6 flex items-center justify-between sticky top-0 backdrop-blur-xl z-20 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-500/20 text-primary-400 rounded-lg">
              <FileText className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-display font-bold text-slate-100 tracking-tight">Synthesized Intelligence</h2>
          </div>
          
          {/* Export Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium text-slate-300 transition-colors disabled:opacity-50"
            >
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {isExporting ? 'Exporting...' : 'Export'}
              <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 rounded-xl bg-[#0f172a] border border-white/10 shadow-2xl py-2 z-50 overflow-hidden"
                >
                  <button onClick={handleExportPDF} className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-white/5 hover:text-white flex items-center gap-2 transition-colors">
                    <FileType2 className="w-4 h-4 text-rose-400" />
                    Download PDF
                  </button>
                  <button onClick={handleExportWord} className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-white/5 hover:text-white flex items-center gap-2 transition-colors">
                    <FileDown className="w-4 h-4 text-blue-400" />
                    Download DOCX
                  </button>
                  <button onClick={handleExportMarkdown} className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-white/5 hover:text-white flex items-center gap-2 transition-colors">
                    <FileText className="w-4 h-4 text-slate-400" />
                    Download Markdown
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Markdown Content (Reference for PDF generation) */}
        <div className="p-8 md:p-12 bg-background/50 rounded-b-3xl">
          <div ref={reportRef} className="prose prose-invert prose-lg max-w-none report-container">
            <ReactMarkdown>{report}</ReactMarkdown>
          </div>
        </div>

      </div>
    </motion.div>
  );
};
