import React, { useState, useRef, useEffect } from 'react';
import { Play, Eraser, Sparkles, MessageSquare, X, ChevronRight } from 'lucide-react';
import { MOCK_CATALOG } from '../constants';
import { generateSqlFromNaturalLanguage, explainSqlError } from '../services/geminiService';

const QueryLab: React.FC = () => {
  const [sql, setSql] = useState('-- Write your SQL here or ask Gemini to generate it\nSELECT * FROM sales_mart.fact_orders LIMIT 10;');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    
    // Create schema context string
    const schemaContext = MOCK_CATALOG.map(t => 
      `Table ${t.schema}.${t.name} (${t.columns.map(c => c.name + ' ' + c.type).join(', ')})`
    ).join('\n');

    const generatedSql = await generateSqlFromNaturalLanguage(prompt, schemaContext);
    setSql(generatedSql);
    setIsGenerating(false);
    setPrompt('');
  };

  const handleRun = () => {
    // Simulate execution
    setError(null);
    setAiExplanation(null);
    setResults(null);

    setTimeout(async () => {
      // Mock simplistic error for demo
      if (sql.toLowerCase().includes('error')) {
        const mockError = "Syntax error at or near 'ERROR': column 'undefined_col' does not exist";
        setError(mockError);
        // Auto-explain error
        const explanation = await explainSqlError(sql, mockError);
        setAiExplanation(explanation);
      } else {
        setResults([
          { id: 1, result: 'Success', rows_affected: 42 },
          { id: 2, result: 'Pending', rows_affected: 0 },
        ]);
      }
    }, 800);
  };

  return (
    <div className="flex h-[calc(100vh-140px)] gap-6">
      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Editor */}
        <div className="flex-1 flex flex-col rounded-xl border border-slate-800 bg-slate-900 overflow-hidden shadow-sm">
          <div className="h-12 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-4">
             <span className="text-xs font-mono text-slate-500">Draft Query.sql</span>
             <div className="flex items-center gap-2">
                <button 
                  onClick={() => setSql('')}
                  className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-md transition-colors" title="Clear">
                  <Eraser size={16} />
                </button>
                <div className="h-4 w-px bg-slate-800"></div>
                <button 
                  onClick={handleRun}
                  className="px-4 py-1.5 bg-green-600 hover:bg-green-500 text-white text-xs font-bold uppercase tracking-wide rounded-md flex items-center gap-2 transition-colors shadow-lg shadow-green-900/20">
                  <Play size={14} fill="currentColor" /> Run Query
                </button>
             </div>
          </div>
          <textarea
            value={sql}
            onChange={(e) => setSql(e.target.value)}
            className="flex-1 bg-slate-900 p-4 font-mono text-sm text-slate-200 resize-none focus:outline-none focus:ring-0"
            spellCheck={false}
          />
        </div>

        {/* Results / Output */}
        <div className="h-64 rounded-xl border border-slate-800 bg-slate-900 overflow-hidden flex flex-col">
           <div className="px-4 py-2 border-b border-slate-800 bg-slate-950 text-xs font-semibold text-slate-500 uppercase tracking-wider">
             Results
           </div>
           <div className="flex-1 overflow-auto p-4">
             {results ? (
               <table className="w-full text-left text-sm font-mono">
                 <thead className="text-slate-500 border-b border-slate-800">
                   <tr>
                     <th className="pb-2">ID</th>
                     <th className="pb-2">Result</th>
                     <th className="pb-2">Rows Affected</th>
                   </tr>
                 </thead>
                 <tbody className="text-slate-300">
                   {results.map((r, i) => (
                     <tr key={i} className="border-b border-slate-800/50">
                       <td className="py-2">{r.id}</td>
                       <td className="py-2 text-green-400">{r.result}</td>
                       <td className="py-2">{r.rows_affected}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             ) : error ? (
               <div className="text-red-400 font-mono text-sm bg-red-900/10 p-4 rounded border border-red-900/50">
                 <p className="font-bold">Query Execution Failed</p>
                 <p className="mt-1 opacity-80">{error}</p>
               </div>
             ) : (
               <div className="text-slate-600 text-sm italic">Run a query to see results...</div>
             )}
           </div>
        </div>
      </div>

      {/* AI Assistant Sidebar */}
      <div className="w-80 flex flex-col border border-slate-800 bg-slate-900/80 rounded-xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-800 bg-gradient-to-r from-indigo-900/20 to-cyan-900/20 flex items-center gap-2">
          <Sparkles size={18} className="text-cyan-400" />
          <h3 className="font-semibold text-slate-200">Gemini Assistant</h3>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          <div className="bg-slate-800/50 p-3 rounded-lg rounded-tl-none border border-slate-700/50">
             <p className="text-sm text-slate-300">Hello! I can help you write SQL or explain errors. Try asking:</p>
             <ul className="mt-2 space-y-1 text-xs text-slate-400 list-disc list-inside">
               <li>"Find customers who spent &gt; $500"</li>
               <li>"Count orders by day last week"</li>
             </ul>
          </div>
          
          {/* Error Explanation Bubble */}
          {aiExplanation && (
             <div className="bg-red-900/20 p-3 rounded-lg border border-red-900/50 animate-in slide-in-from-left-2">
                <div className="flex items-center gap-2 mb-2 text-red-300 text-xs font-bold uppercase">
                  <Sparkles size={12} /> Diagnosis
                </div>
                <p className="text-sm text-red-200">{aiExplanation}</p>
             </div>
          )}
        </div>

        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleGenerate();
                }
              }}
              placeholder="Describe your query..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 pr-10 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors resize-none h-24"
            />
            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="absolute bottom-3 right-3 p-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {isGenerating ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <ChevronRight size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueryLab;
