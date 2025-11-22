import { Pipeline, NodeType, CatalogTable } from './types';

export const MOCK_PIPELINES: Pipeline[] = [
  {
    id: 'p-1',
    name: 'Clickstream Ingestion',
    lastRun: '2 mins ago',
    status: 'active',
    latencyMs: 450,
    rowsProcessed: 1250000,
    nodes: [
      { id: 'n-1', type: NodeType.SOURCE, subtype: 'kafka', name: 'Kafka: Events', status: 'healthy' },
      { id: 'n-2', type: NodeType.TRANSFORM, name: 'Cleanse JSON', status: 'healthy' },
      { id: 'n-3', type: NodeType.DESTINATION, subtype: 'delta', name: 'Silver Tables', status: 'healthy' }
    ]
  },
  {
    id: 'p-2',
    name: 'Daily Revenue Rollup',
    lastRun: '4 hours ago',
    status: 'active',
    latencyMs: 12000,
    rowsProcessed: 45000,
    nodes: [
      { id: 'n-4', type: NodeType.SOURCE, subtype: 'postgres', name: 'Postgres: Orders', status: 'healthy' },
      { id: 'n-5', type: NodeType.TRANSFORM, name: 'Aggregator', status: 'running' },
      { id: 'n-6', type: NodeType.DESTINATION, subtype: 'postgres', name: 'Gold: Revenue', status: 'idle' }
    ]
  },
  {
    id: 'p-3',
    name: 'Marketing Sync',
    lastRun: '1 day ago',
    status: 'error',
    latencyMs: 0,
    rowsProcessed: 0,
    nodes: [
      { id: 'n-7', type: NodeType.SOURCE, subtype: 'api', name: 'Salesforce API', status: 'error' },
      { id: 'n-8', type: NodeType.DESTINATION, subtype: 'bigquery', name: 'BigQuery', status: 'idle' }
    ]
  }
];

export const MOCK_CATALOG: CatalogTable[] = [
  {
    id: 't-1',
    name: 'fact_orders',
    schema: 'sales_mart',
    rowCount: 8500230,
    lastUpdated: '2023-10-27 14:30:00',
    columns: [
      { name: 'order_id', type: 'VARCHAR(64)', nullable: false },
      { name: 'customer_id', type: 'VARCHAR(64)', nullable: false },
      { name: 'amount', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
    ]
  },
  {
    id: 't-2',
    name: 'dim_customers',
    schema: 'sales_mart',
    rowCount: 120400,
    lastUpdated: '2023-10-26 09:00:00',
    columns: [
      { name: 'customer_id', type: 'VARCHAR(64)', nullable: false },
      { name: 'email', type: 'VARCHAR(255)', nullable: false },
      { name: 'segment', type: 'VARCHAR(50)', nullable: true },
    ]
  },
  {
    id: 't-3',
    name: 'raw_logs',
    schema: 'staging',
    rowCount: 45000000,
    lastUpdated: '2023-10-27 14:45:00',
    columns: [
      { name: 'log_id', type: 'UUID', nullable: false },
      { name: 'payload', type: 'JSONB', nullable: true },
      { name: 'ingested_at', type: 'TIMESTAMP', nullable: false },
    ]
  }
];