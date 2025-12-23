import React, { useState, useEffect } from 'react';
import { X, Check, AlertCircle, Loader2, Save, Play } from 'lucide-react';
import { PipelineNode, NodeType } from '../types';
import { testConnection } from '../services/connectorService';

interface NodeConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
    node: PipelineNode;
    onSave: (nodeId: string, config: Record<string, string>) => void;
}

const NodeConfigModal: React.FC<NodeConfigModalProps> = ({ isOpen, onClose, node, onSave }) => {
    const [config, setConfig] = useState<Record<string, string>>({});
    const [isTesting, setIsTesting] = useState(false);
    const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

    useEffect(() => {
        if (isOpen) {
            setConfig(node.config || {});
            setTestResult(null);
        }
    }, [isOpen, node]);

    if (!isOpen) return null;

    const handleChange = (key: string, value: string) => {
        setConfig(prev => ({ ...prev, [key]: value }));
        setTestResult(null); // Reset test result on change
    };

    const handleTestConnection = async () => {
        setIsTesting(true);
        setTestResult(null);
        try {
            const result = await testConnection(node.type, node.subtype, config);
            setTestResult(result);
        } catch (error) {
            setTestResult({ success: false, message: 'An unexpected error occurred.' });
        } finally {
            setIsTesting(false);
        }
    };

    const handleSave = () => {
        onSave(node.id, config);
        onClose();
    };

    const renderFields = () => {
        if (node.type !== NodeType.SOURCE) return <div className="text-slate-400">Configuration not available for this node type yet.</div>;

        switch (node.subtype) {
            case 'bigquery':
                return (
                    <>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-400">Project ID</label>
                            <input
                                type="text"
                                value={config.projectId || ''}
                                onChange={e => handleChange('projectId', e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50"
                                placeholder="e.g. my-gcp-project"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-400">Dataset ID</label>
                            <input
                                type="text"
                                value={config.datasetId || ''}
                                onChange={e => handleChange('datasetId', e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50"
                                placeholder="e.g. analytics_prod"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-400">Service Account JSON</label>
                            <textarea
                                value={config.serviceAccountJson || ''}
                                onChange={e => handleChange('serviceAccountJson', e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-sm text-slate-200 font-mono focus:outline-none focus:border-cyan-500/50 h-32 resize-none"
                                placeholder="{ ... }"
                            />
                        </div>
                    </>
                );
            case 'sqlserver':
                return (
                    <>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2 space-y-1">
                                <label className="text-xs font-medium text-slate-400">Host</label>
                                <input
                                    type="text"
                                    value={config.host || ''}
                                    onChange={e => handleChange('host', e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50"
                                    placeholder="db.example.com"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-400">Port</label>
                                <input
                                    type="text"
                                    value={config.port || ''}
                                    onChange={e => handleChange('port', e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50"
                                    placeholder="1433"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-400">Database Name</label>
                            <input
                                type="text"
                                value={config.database || ''}
                                onChange={e => handleChange('database', e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50"
                                placeholder="OrdersDB"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-400">Username</label>
                                <input
                                    type="text"
                                    value={config.username || ''}
                                    onChange={e => handleChange('username', e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50"
                                    placeholder="sa"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-400">Password</label>
                                <input
                                    type="password"
                                    value={config.password || ''}
                                    onChange={e => handleChange('password', e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </>
                );
            case 'postgres':
                return (
                    <>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2 space-y-1">
                                <label className="text-xs font-medium text-slate-400">Host</label>
                                <input
                                    type="text"
                                    value={config.host || ''}
                                    onChange={e => handleChange('host', e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50"
                                    placeholder="db.example.com"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-400">Port</label>
                                <input
                                    type="text"
                                    value={config.port || ''}
                                    onChange={e => handleChange('port', e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50"
                                    placeholder="5432"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-400">Database Name</label>
                            <input
                                type="text"
                                value={config.database || ''}
                                onChange={e => handleChange('database', e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50"
                                placeholder="my_database"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-400">Username</label>
                                <input
                                    type="text"
                                    value={config.username || ''}
                                    onChange={e => handleChange('username', e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50"
                                    placeholder="postgres"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-400">Password</label>
                                <input
                                    type="password"
                                    value={config.password || ''}
                                    onChange={e => handleChange('password', e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </>
                );
            default:
                return <div className="text-slate-400 text-sm">Generic configuration for {node.subtype}</div>;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
                    <div>
                        <h3 className="font-semibold text-slate-200">Configure {node.name}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Enter connection details for this source.</p>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    {renderFields()}

                    {/* Test Result */}
                    {testResult && (
                        <div className={`p-3 rounded-md flex items-start gap-3 text-sm ${testResult.success ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                            {testResult.success ? <Check size={16} className="mt-0.5" /> : <AlertCircle size={16} className="mt-0.5" />}
                            <span>{testResult.message}</span>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/30 flex justify-between items-center">
                    <button
                        onClick={handleTestConnection}
                        disabled={isTesting}
                        className="px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 rounded-md transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {isTesting ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
                        Test Connection
                    </button>
                    <div className="flex gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium rounded-md transition-colors flex items-center gap-2 shadow-lg shadow-cyan-900/20"
                        >
                            <Save size={14} />
                            Save Configuration
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NodeConfigModal;
