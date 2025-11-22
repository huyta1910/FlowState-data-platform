export enum NodeType {
  SOURCE = 'SOURCE',
  TRANSFORM = 'TRANSFORM',
  DESTINATION = 'DESTINATION'
}

export interface PipelineNode {
  id: string;
  type: NodeType;
  name: string;
  subtype?: string; // e.g. 'bigquery', 'sqlserver', 'postgres', 'kafka', 'api'
  status: 'healthy' | 'error' | 'running' | 'idle';
  description?: string;
  config?: Record<string, string>;
}

export interface Pipeline {
  id: string;
  name: string;
  nodes: PipelineNode[];
  lastRun: string;
  status: 'active' | 'paused' | 'error';
  latencyMs: number;
  rowsProcessed: number;
}

export interface TableSchema {
  name: string;
  type: string;
  nullable: boolean;
}

export interface CatalogTable {
  id: string;
  name: string;
  schema: string; // e.g., "public"
  rowCount: number;
  lastUpdated: string;
  columns: TableSchema[];
}

export interface QueryResult {
  columns: string[];
  rows: any[][];
  executionTimeMs: number;
}

export interface AiChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}