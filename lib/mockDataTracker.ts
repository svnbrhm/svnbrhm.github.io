// Mock Data Usage Tracker
// Comprehensive system to track when and where mock data is being used as fallback

import React from 'react';

export interface MockDataUsage {
  timestamp: string;
  function: string;
  reason: 'airtable_not_configured' | 'airtable_error' | 'network_error' | 'timeout' | 'unknown';
  context?: string;
  userAgent?: string;
  url?: string;
}

export interface MockDataMetrics {
  totalUsages: number;
  usagesByFunction: Record<string, number>;
  usagesByReason: Record<string, number>;
  lastUsage?: string;
  firstUsage?: string;
  recentUsages: MockDataUsage[];
}

class MockDataTracker {
  private usages: MockDataUsage[] = [];
  private maxStoredUsages = 100; // Keep last 100 usages in memory
  private isClient = typeof window !== 'undefined';
  
  constructor() {
    // Load existing data from localStorage on client side
    if (this.isClient) {
      this.loadFromStorage();
    }
  }

  /**
   * Track a mock data usage event
   */
  track(functionName: string, reason: MockDataUsage['reason'], context?: string): void {
    const usage: MockDataUsage = {
      timestamp: new Date().toISOString(),
      function: functionName,
      reason,
      context,
      userAgent: this.isClient ? navigator.userAgent : undefined,
      url: this.isClient ? window.location.href : undefined
    };

    // Add to memory
    this.usages.push(usage);
    
    // Keep only recent usages in memory
    if (this.usages.length > this.maxStoredUsages) {
      this.usages = this.usages.slice(-this.maxStoredUsages);
    }

    // Log to console with appropriate level
    this.logUsage(usage);

    // Save to localStorage on client side
    if (this.isClient) {
      this.saveToStorage();
    }

    // Send to analytics if configured
    this.sendToAnalytics(usage);
  }

  /**
   * Get current metrics
   */
  getMetrics(): MockDataMetrics {
    const usagesByFunction: Record<string, number> = {};
    const usagesByReason: Record<string, number> = {};
    
    this.usages.forEach(usage => {
      usagesByFunction[usage.function] = (usagesByFunction[usage.function] || 0) + 1;
      usagesByReason[usage.reason] = (usagesByReason[usage.reason] || 0) + 1;
    });

    return {
      totalUsages: this.usages.length,
      usagesByFunction,
      usagesByReason,
      lastUsage: this.usages.length > 0 ? this.usages[this.usages.length - 1].timestamp : undefined,
      firstUsage: this.usages.length > 0 ? this.usages[0].timestamp : undefined,
      recentUsages: this.usages.slice(-10) // Last 10 usages
    };
  }

  /**
   * Get all tracked usages
   */
  getAllUsages(): MockDataUsage[] {
    return [...this.usages];
  }

  /**
   * Clear all tracked data
   */
  clear(): void {
    this.usages = [];
    if (this.isClient) {
      localStorage.removeItem('mockDataUsages');
    }
  }

  /**
   * Check if mock data is currently being used
   */
  isUsingMockData(): boolean {
    const recentUsages = this.usages.filter(usage => {
      const usageTime = new Date(usage.timestamp).getTime();
      const now = Date.now();
      return (now - usageTime) < 60000; // Within last minute
    });
    return recentUsages.length > 0;
  }

  /**
   * Get usage summary for the last period
   */
  getUsageSummary(hours: number = 24): {
    count: number;
    functions: string[];
    reasons: string[];
    isCurrentlyUsingMock: boolean;
  } {
    const cutoff = Date.now() - (hours * 60 * 60 * 1000);
    const recentUsages = this.usages.filter(usage => {
      return new Date(usage.timestamp).getTime() > cutoff;
    });

    const functions = Array.from(new Set(recentUsages.map(u => u.function)));
    const reasons = Array.from(new Set(recentUsages.map(u => u.reason)));

    return {
      count: recentUsages.length,
      functions,
      reasons,
      isCurrentlyUsingMock: this.isUsingMockData()
    };
  }

  private logUsage(usage: MockDataUsage): void {
    const message = `🔄 MOCK DATA FALLBACK: ${usage.function} (${usage.reason})`;
    const details = {
      timestamp: usage.timestamp,
      context: usage.context,
      url: usage.url
    };

    switch (usage.reason) {
      case 'airtable_not_configured':
        console.warn(message, details);
        break;
      case 'airtable_error':
      case 'network_error':
      case 'timeout':
        console.error(message, details);
        break;
      default:
        console.log(message, details);
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('mockDataUsages');
      if (stored) {
        this.usages = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load mock data usage history:', error);
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('mockDataUsages', JSON.stringify(this.usages));
    } catch (error) {
      console.warn('Failed to save mock data usage history:', error);
    }
  }

  private sendToAnalytics(usage: MockDataUsage): void {
    // Send to analytics service if available
    if (this.isClient && (window as any).gtag) {
      (window as any).gtag('event', 'mock_data_usage', {
        event_category: 'data_fallback',
        event_label: usage.function,
        custom_parameter_reason: usage.reason,
        custom_parameter_context: usage.context
      });
    }

    // Send to custom analytics endpoint if configured
    if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
      fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'mock_data_usage',
          data: usage
        })
      }).catch(error => {
        console.warn('Failed to send mock data usage to analytics:', error);
      });
    }
  }
}

// Global instance
export const mockDataTracker = new MockDataTracker();

// Helper function for easy tracking
export function trackMockDataUsage(
  functionName: string, 
  reason: MockDataUsage['reason'], 
  context?: string
): void {
  mockDataTracker.track(functionName, reason, context);
}

// React hook for components
export function useMockDataMetrics() {
  const [metrics, setMetrics] = React.useState<MockDataMetrics | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const updateMetrics = () => {
      setMetrics(mockDataTracker.getMetrics());
      setIsLoading(false);
    };

    updateMetrics();
    
    // Update metrics every 30 seconds
    const interval = setInterval(updateMetrics, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { metrics, isLoading, refresh: () => setMetrics(mockDataTracker.getMetrics()) };
}

// Types are already exported above as interfaces