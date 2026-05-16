import { useState } from 'react';
import { startResearch } from '../services/api';
import { Search, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const ResearchForm = ({ onStart }: { onStart: (jobId: string) => void }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const { job_id } = await startResearch(query);
      onStart(job_id);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit} 
      className="w-full relative z-10"
    >
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative glass-panel rounded-2xl p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          
          <div className="relative flex-grow flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What would you like to research today?"
              className="w-full bg-transparent border-none text-slate-100 px-12 py-4 focus:outline-none focus:ring-0 placeholder:text-slate-500 text-lg font-medium"
              disabled={loading}
            />
          </div>

          <button 
            type="submit"
            disabled={loading || !query.trim()}
            className="relative inline-flex items-center justify-center px-8 py-4 sm:py-3 font-bold text-white transition-all duration-200 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl hover:from-primary-400 hover:to-accent-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed group/btn overflow-hidden"
          >
            <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover/btn:w-56 group-hover/btn:h-56 opacity-10"></span>
            <span className="relative flex items-center gap-2">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Synthesize
                </>
              )}
            </span>
          </button>
        </div>
      </div>
    </motion.form>
  );
};
