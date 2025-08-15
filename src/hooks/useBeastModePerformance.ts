import { useState, useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  renderCount: number;
  loadTime: number;
  memoryUsage: number;
  networkRequests: Array<{
    url: string;
    method: string;
    duration: number;
    timestamp: number;
    status?: number;
  }>;
  cacheHits: number;
  errorCount: number;
}

interface BeastModePerformance {
  metrics: PerformanceMetrics;
  trackRender: () => void;
  trackNetworkRequest: (url: string, method: string, duration: number, status?: number) => void;
  trackCacheHit: () => void;
  trackError: (error: Error) => void;
  resetMetrics: () => void;
  exportMetrics: () => void;
}

export const useBeastModePerformance = (): BeastModePerformance => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderCount: 0,
    loadTime: 0,
    memoryUsage: 0,
    networkRequests: [],
    cacheHits: 0,
    errorCount: 0
  });

  const trackRender = useCallback(() => {
    setMetrics(prev => ({
      ...prev,
      renderCount: prev.renderCount + 1
    }));
  }, []);

  const trackNetworkRequest = useCallback((url: string, method: string, duration: number, status?: number) => {
    setMetrics(prev => ({
      ...prev,
      networkRequests: [
        ...prev.networkRequests.slice(-49), // Keep last 49 + new one = 50
        {
          url,
          method,
          duration,
          timestamp: Date.now(),
          status
        }
      ]
    }));
  }, []);

  const trackCacheHit = useCallback(() => {
    setMetrics(prev => ({
      ...prev,
      cacheHits: prev.cacheHits + 1
    }));
  }, []);

  const trackError = useCallback((error: Error) => {
    setMetrics(prev => ({
      ...prev,
      errorCount: prev.errorCount + 1
    }));
    
    console.error('🔥 Beast Mode Error Tracked:', error);
  }, []);

  const resetMetrics = useCallback(() => {
    setMetrics({
      renderCount: 0,
      loadTime: 0,
      memoryUsage: 0,
      networkRequests: [],
      cacheHits: 0,
      errorCount: 0
    });
  }, []);

  const exportMetrics = useCallback(() => {
    const dataStr = JSON.stringify(metrics, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `beast-mode-metrics-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
  }, [metrics]);

  // Monitor memory usage
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.performance && (window.performance as any).memory) {
        const memory = (window.performance as any).memory;
        const memUsage = memory.usedJSHeapSize / 1048576; // Convert to MB
        
        setMetrics(prev => ({
          ...prev,
          memoryUsage: memUsage,
          loadTime: performance.now()
        }));
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Intercept fetch requests to track network activity
  useEffect(() => {
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      const start = performance.now();
      const url = args[0] as string;
      
      try {
        const response = await originalFetch(...args);
        const duration = performance.now() - start;
        
        trackNetworkRequest(url, 'GET', duration, response.status);
        
        return response;
      } catch (error) {
        const duration = performance.now() - start;
        trackNetworkRequest(url, 'GET', duration, 0);
        trackError(error as Error);
        throw error;
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, [trackNetworkRequest, trackError]);

  return {
    metrics,
    trackRender,
    trackNetworkRequest,
    trackCacheHit,
    trackError,
    resetMetrics,
    exportMetrics
  };
};

// Global performance hook for Beast Mode
let globalPerformance: BeastModePerformance | null = null;

export const useGlobalBeastModePerformance = () => {
  const performance = useBeastModePerformance();
  
  useEffect(() => {
    globalPerformance = performance;
    
    // Make it globally accessible
    (window as any).__beastMode = {
      ...performance,
      getMetrics: () => performance.metrics,
      isActive: true
    };
    
    return () => {
      globalPerformance = null;
      delete (window as any).__beastMode;
    };
  }, [performance]);
  
  return performance;
};

export default useBeastModePerformance;
