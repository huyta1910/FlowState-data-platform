import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, Play, Save, Wand2, MoreVertical, Trash2, Database, Box, ArrowRight, 
  Cloud, Server, Radio, Globe, ChevronDown, FileJson 
} from 'lucide-react';
import { MOCK_PIPELINES } from '../constants';
import { Pipeline, NodeType, PipelineNode } from '../types';
import { analyzePipelinePerformance } from '../services/geminiService';

const SOURCE_TYPES = [
  { id: 'bigquery', label: 'Google BigQuery', icon: Cloud, color: 'text-blue-400', border: 'border-blue-500/30', bg: 'bg-blue-500/20' },
  { id: 'sqlserver', label: 'SQL Server', icon: Server, color: 'text-red-400', border: 'border-red-500/30', bg: 'bg-red-500/20' },
  { id: 'postgres', label: 'PostgreSQL', icon: Database, color: 'text-indigo-400', border: 'border-indigo-500/30', bg: 'bg-indigo-500/20' },
  { id: 'kafka', label: 'Kafka Stream', icon: Radio, color: 'text-pink-400', border: 'border-pink-500/30', bg: 'bg-pink-500/20' },
  { id: 'api', label: 'REST API', icon: Globe, color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/20' },
];

const PipelineEditor: React.FC = () => {
  const [pipelines, setPipelines] = useState<Pipeline[]>(MOCK_PIPELINES);
  const [selectedPipelineId, setSelectedPipelineId] = useState<string>(MOCK_PIPELINES[0].id);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [showSourceMenu, setShowSourceMenu] = useState(false);
  const sourceMenuRef = useRef<HTMLDivElement>(null);

  const activePipeline = pipelines.find(p => p.id === selectedPipelineId) || pipelines[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sourceMenuRef.current && !sourceMenuRef.current.contains(event.target as Node)) {
        setShowSourceMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    const result = await analyzePipelinePerformance(activePipeline);
    setAnalysisResult(result);
    setIsAnalyzing(false);
  };

  const addNode = (type: NodeType, subtype?: string, name?: string) => {
    const defaultName = name || `New ${type.charAt(0) + type.slice(1).toLowerCase()}`;
    
    const newNode: PipelineNode = {
      id: `n-${Date.now()}`,
      type,
      subtype,
      name: defaultName,
      status: 'idle'
    };
    
    const updatedPipeline = { ...activePipeline, nodes: [...activePipeline.nodes, newNode] };
    setPipelines(prev => prev.map(p => p.id === selectedPipelineId ? updatedPipeline : p));
    setShowSourceMenu(false);
  };

  const deleteNode = (nodeId: string) => {
    const updatedPipeline = { ...activePipeline, nodes: activePipeline.nodes.filter(n => n.id !== nodeId) };
    setPipelines(prev => prev.map(p => p.id === selectedPipelineId ? updatedPipeline : p));
  };

  const getIconForNode = (node: PipelineNode) => {
    if (node.type === NodeType.SOURCE) {
      switch (node.subtype) {
        case 'bigquery': return <Cloud size={16} />;
        case 'sqlserver': return <Server size={16} />;
        case 'postgres': return <Database size={16} />;
        case 'kafka': return <Radio size={16} />;
        case 'api': return <Globe size={16} />;
        default: return <Database size={16} />;
      }
    }
    if (node.type === NodeType.TRANSFORM) return <Box size={16} />;
    if (node.type === NodeType.DESTINATION) return <Database size={16} />;
    return <Database size={16} />;
  };

  const getStylesForNode = (node: PipelineNode) => {
    if (node.type === NodeType.SOURCE && node.subtype) {
       const sourceConfig = SOURCE_TYPES.find(s => s.id === node.subtype);
       if (sourceConfig) return {
          border: `border-slate-800 ${sourceConfig.border.replace('/30', '/50')}`,
          iconBg: sourceConfig.bg,
          iconColor: sourceConfig.color
       };
    }
    
    // Defaults
    if (node.type === NodeType.SOURCE) return { border: 'border-blue-900/50', iconBg: 'bg-blue-500/20', iconColor: 'text-blue-400' };
    if (node.type === NodeType.TRANSFORM) return { border: 'border-purple-900/50', iconBg: 'bg-purple-500/20', iconColor: 'text-purple-400' };
    return { border: 'border-green-900/50', iconBg: 'bg-green-500/20', iconColor: 'text-green-400' };
  };

  return (
    <div className="h-[calc(100vh-140px)] flex gap-6">
      {/* Sidebar List */}
      <div className="w-64 flex flex-col border border-slate-800 bg-slate-900/50 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
          <h3 className="font-semibold text-slate-300">Pipelines</h3>
          <button className="p-1.5 hover:bg-slate-800 rounded-lg text-cyan-400 transition-colors">
            <Plus size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {pipelines.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedPipelineId(p.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                ${selectedPipelineId === p.id 
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Editor Canvas */}
      <div className="flex-1 flex flex-col border border-slate-800 bg-slate-900/50 rounded-xl overflow-hidden relative">
        {/* Toolbar */}
        <div className="h-14 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-4 z-20">
          <div className="flex items-center gap-4">
            <h2 className="font-semibold text-slate-200">{activePipeline.name}</h2>
            <div className="h-4 w-px bg-slate-700"></div>
            <div className="flex gap-1 relative" ref={sourceMenuRef}>
              <button 
                onClick={() => setShowSourceMenu(!showSourceMenu)}
                className={`px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 rounded-md flex items-center gap-2 transition-colors ${showSourceMenu ? 'bg-slate-800 text-white' : ''}`}>
                <Database size={14} /> Add Source <ChevronDown size={12} />
              </button>
              
              {/* Source Dropdown */}
              {showSourceMenu && (
                <div className="absolute top-9 left-0 w-56 bg-slate-900 border border-slate-800 rounded-lg shadow-xl shadow-black/50 z-50 py-1 animate-in fade-in zoom-in-95 duration-100 overflow-hidden">
                  <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-950/50">Select Integration</div>
                  {SOURCE_TYPES.map((src) => (
                    <button
                      key={src.id}
                      onClick={() => addNode(NodeType.SOURCE, src.id, src.label)}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-3 transition-colors border-l-2 border-transparent hover:border-cyan-500"
                    >
                      <src.icon size={16} className={src.color} />
                      {src.label}
                    </button>
                  ))}
                </div>
              )}

              <button onClick={() => addNode(NodeType.TRANSFORM)} className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 rounded-md flex items-center gap-2">
                <Box size={14} /> Add Transform
              </button>
              <button onClick={() => addNode(NodeType.DESTINATION)} className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 rounded-md flex items-center gap-2">
                <Database size={14} /> Add Destination
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-md flex items-center gap-2 transition-colors disabled:opacity-50 shadow-lg shadow-indigo-900/20">
                {isAnalyzing ? (
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Wand2 size={14} />
                )}
                AI Optimize
            </button>
            <button className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white text-xs font-medium rounded-md flex items-center gap-2 transition-colors shadow-lg shadow-green-900/20">
                <Play size={14} /> Run
            </button>
            <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-md flex items-center gap-2 transition-colors">
                <Save size={14} /> Save
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] p-8 overflow-auto relative">
           <div className="flex items-center gap-4 min-w-max">
              {activePipeline.nodes.map((node, index) => {
                const styles = getStylesForNode(node);
                return (
                  <div key={node.id} className="flex items-center">
                    {/* Node Card */}
                    <div className={`
                      w-64 p-4 rounded-lg border shadow-lg relative group transition-all bg-slate-900
                      ${styles.border}
                      hover:border-slate-600 hover:shadow-cyan-500/5
                    `}>
                      <div className="flex justify-between items-start mb-3">
                         <div className={`p-2 rounded-md ${styles.iconBg} ${styles.iconColor}`}>
                           {getIconForNode(node)}
                         </div>
                         <button 
                          onClick={() => deleteNode(node.id)}
                          className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                         >
                           <Trash2 size={14} />
                         </button>
                      </div>
                      <h4 className="font-medium text-slate-200 text-sm truncate" title={node.name}>{node.name}</h4>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">{node.type}</span>
                           {node.subtype && (
                             <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 uppercase">{node.subtype}</span>
                           )}
                        </div>
                        <div className={`w-2 h-2 rounded-full ${node.status === 'healthy' ? 'bg-green-500' : node.status === 'running' ? 'bg-amber-500 animate-pulse' : node.status === 'error' ? 'bg-red-500' : 'bg-slate-500'}`}></div>
                      </div>
                    </div>

                    {/* Connector */}
                    {index < activePipeline.nodes.length - 1 && (
                      <div className="px-4 text-slate-600">
                        <ArrowRight size={24} />
                      </div>
                    )}
                  </div>
                );
              })}
              
              {/* Add Dropzone Hint */}
              <div className="ml-4 w-64 h-32 border-2 border-dashed border-slate-800 rounded-lg flex items-center justify-center text-slate-600 text-sm hover:border-slate-600 hover:text-slate-400 transition-colors cursor-pointer">
                + Add Next Stage
              </div>
           </div>
        </div>

        {/* AI Analysis Panel Overlay */}
        {analysisResult && (
          <div className="absolute bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-cyan-900/50 p-6 transition-all animate-in slide-in-from-bottom-10 duration-300 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] max-h-[40%] overflow-y-auto z-30">
             <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 text-cyan-400 font-semibold">
                   <Wand2 size={18} /> Gemini 3.0 Analysis
                </div>
                <button onClick={() => setAnalysisResult(null)} className="text-slate-500 hover:text-slate-300">Close</button>
             </div>
             <div className="prose prose-invert prose-sm max-w-none text-slate-300 whitespace-pre-line">
               {analysisResult}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PipelineEditor;