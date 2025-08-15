import React, { useState, useEffect } from 'react';
import './BeastModePanel.css';

const BeastModePanel = () => {
  const [isActive, setIsActive] = useState(false);
  const [metrics, setMetrics] = useState({
    renderCount: 0,
    memoryUsage: 0,
    networkRequests: 0,
    loadTime: 0,
    cacheHits: 0
  });
  
  const [logs, setLogs] = useState([]);
  const [sqlQuery, setSqlQuery] = useState('');
  const [queryResult, setQueryResult] = useState(null);

  // Activar con secuencia "beast"
  useEffect(() => {
    let sequence = '';
    const handleKeyPress = (e) => {
      sequence += e.key.toLowerCase();
      if (sequence.includes('beast')) {
        setIsActive(!isActive);
        sequence = '';
        addLog(`🔥 Beast Mode ${!isActive ? 'ACTIVATED' : 'DEACTIVATED'}`);
      }
      if (sequence.length > 10) sequence = sequence.slice(-5);
    };

    document.addEventListener('keypress', handleKeyPress);
    return () => document.removeEventListener('keypress', handleKeyPress);
  }, [isActive]);

  // Monitor performance
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      // Memory usage
      if (window.performance && window.performance.memory) {
        const memUsage = window.performance.memory.usedJSHeapSize / 1048576;
        setMetrics(prev => ({ ...prev, memoryUsage: memUsage }));
      }

      // Load time
      const loadTime = window.performance.now();
      setMetrics(prev => ({ ...prev, loadTime }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isActive]);

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev.slice(-50), `[${timestamp}] ${message}`]);
  };

  const executeQuery = async () => {
    addLog(`🔍 Executing: ${sqlQuery}`);
    try {
      // Simular query execution
      const result = { status: 'success', message: 'Query executed successfully' };
      setQueryResult(result);
      addLog('✅ Query completed');
    } catch (error) {
      setQueryResult({ error: error.message });
      addLog('❌ Query failed');
    }
  };

  const clearCache = () => {
    localStorage.clear();
    sessionStorage.clear();
    addLog('🧹 Cache cleared');
  };

  const simulateLoad = async (count = 100) => {
    addLog(`🚀 Simulating ${count} requests...`);
    const start = performance.now();
    
    // Simular requests
    const promises = Array(count).fill().map(() => 
      new Promise(resolve => setTimeout(resolve, Math.random() * 100))
    );
    
    await Promise.all(promises);
    const duration = performance.now() - start;
    
    setMetrics(prev => ({ 
      ...prev, 
      networkRequests: prev.networkRequests + count 
    }));
    
    addLog(`⚡ ${count} requests completed in ${duration.toFixed(2)}ms`);
  };

  const exportLogs = () => {
    const logText = logs.join('\n');
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `beast-mode-logs-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    addLog('📄 Logs exported');
  };

  if (!isActive) {
    return (
      <div className="beast-mode-activator">
        <div className="pulse-dot" title="Type 'beast' to activate Beast Mode">
          🔥
        </div>
      </div>
    );
  }

  return (
    <div className="beast-mode-panel">
      <div className="beast-header">
        <h3 className="beast-title">
          🔥 BEAST MODE
          <span className="version">v1.0</span>
        </h3>
        <button 
          onClick={() => setIsActive(false)}
          className="close-btn"
          title="Close Beast Mode"
        >
          ✕
        </button>
      </div>

      {/* Metrics Dashboard */}
      <div className="metrics-section">
        <h4>📊 Live Metrics</h4>
        <div className="metrics-grid">
          <div className="metric-item">
            <span className="metric-label">Memory</span>
            <span className="metric-value">{metrics.memoryUsage.toFixed(1)}MB</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Requests</span>
            <span className="metric-value">{metrics.networkRequests}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Load Time</span>
            <span className="metric-value">{(metrics.loadTime / 1000).toFixed(2)}s</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Cache Hits</span>
            <span className="metric-value">{metrics.cacheHits}</span>
          </div>
        </div>
      </div>

      {/* SQL Console */}
      <div className="sql-section">
        <h4>🔍 SQL Console</h4>
        <textarea
          value={sqlQuery}
          onChange={(e) => setSqlQuery(e.target.value)}
          className="sql-input"
          placeholder="SELECT * FROM guides WHERE location LIKE '%Patagonia%';"
          rows="3"
        />
        <div className="sql-controls">
          <button onClick={executeQuery} className="btn-execute">
            Execute
          </button>
          <button onClick={() => setSqlQuery('')} className="btn-clear">
            Clear
          </button>
        </div>
        {queryResult && (
          <pre className="query-result">
            {JSON.stringify(queryResult, null, 2)}
          </pre>
        )}
      </div>

      {/* Quick Actions */}
      <div className="actions-section">
        <h4>⚡ Quick Actions</h4>
        <div className="action-buttons">
          <button onClick={clearCache} className="action-btn cache">
            🧹 Clear Cache
          </button>
          <button onClick={() => simulateLoad(50)} className="action-btn load">
            🚀 Load Test (50)
          </button>
          <button onClick={() => simulateLoad(200)} className="action-btn stress">
            💪 Stress Test (200)
          </button>
          <button onClick={exportLogs} className="action-btn export">
            📄 Export Logs
          </button>
        </div>
      </div>

      {/* Live Logs */}
      <div className="logs-section">
        <h4>📝 Live Logs</h4>
        <div className="logs-container">
          {logs.slice(-10).map((log, idx) => (
            <div key={idx} className="log-line">
              {log}
            </div>
          ))}
        </div>
      </div>

      {/* Performance Tips */}
      <div className="tips-section">
        <h4>💡 Performance Tips</h4>
        <div className="tips-list">
          <div className="tip-item">
            🎯 Use React.memo for expensive components
          </div>
          <div className="tip-item">
            ⚡ Implement virtual scrolling for large lists
          </div>
          <div className="tip-item">
            🔄 Use Suspense for better loading states
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeastModePanel;
