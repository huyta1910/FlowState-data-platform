import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import PipelineEditor from './pages/PipelineEditor';
import DataCatalog from './pages/DataCatalog';
import QueryLab from './pages/QueryLab';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pipelines" element={<PipelineEditor />} />
          <Route path="/catalog" element={<DataCatalog />} />
          <Route path="/query" element={<QueryLab />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
