/**
 * Data Service - Mock data for dashboard
 */

export interface DataPoint {
  label: string;
  value: number;
  timestamp?: Date;
}

export interface ChartData {
  title: string;
  type: 'bar' | 'line' | 'pie';
  data: DataPoint[];
  category?: string;
}

/**
 * DataService - Handles mock data generation and retrieval
 */
export class DataService {
  private data: ChartData[] = [];

  constructor() {
    this.generateMockData();
  }

  /**
   * Generate mock data for charts
   */
  private generateMockData(): void {
    // Monthly sales data
    this.data.push({
      title: 'Monthly Sales',
      type: 'bar',
      category: 'sales',
      data: [
        { label: 'Jan', value: 65 },
        { label: 'Feb', value: 59 },
        { label: 'Mar', value: 80 },
        { label: 'Apr', value: 81 },
        { label: 'May', value: 56 },
        { label: 'Jun', value: 55 }
      ]
    });

    // Weekly visitors
    this.data.push({
      title: 'Weekly Visitors',
      type: 'line',
      category: 'visitors',
      data: [
        { label: 'Mon', value: 100 },
        { label: 'Tue', value: 120 },
        { label: 'Wed', value: 150 },
        { label: 'Thu', value: 130 },
        { label: 'Fri', value: 180 },
        { label: 'Sat', value: 160 },
        { label: 'Sun', value: 110 }
      ]
    });

    // Market share
    this.data.push({
      title: 'Market Share',
      type: 'pie',
      category: 'market',
      data: [
        { label: 'Product A', value: 30 },
        { label: 'Product B', value: 25 },
        { label: 'Product C', value: 20 },
        { label: 'Product D', value: 15 },
        { label: 'Others', value: 10 }
      ]
    });
  }

  /**
   * Get all data
   */
  getAllData(): ChartData[] {
    return this.data;
  }

  /**
   * Get data by category
   */
  getDataByCategory(category: string): ChartData | undefined {
    return this.data.find(d => d.category === category);
  }

  /**
   * Get data by type
   */
  getDataByType(type: 'bar' | 'line' | 'pie'): ChartData[] {
    return this.data.filter(d => d.type === type);
  }

  /**
   * Simulate real-time data update
   */
  simulateUpdate(category: string, variation: number = 10): DataPoint | null {
    const chartData = this.getDataByCategory(category);
    if (!chartData || chartData.data.length === 0) return null;

    const lastPoint = chartData.data[chartData.data.length - 1];
    const randomVariation = (Math.random() - 0.5) * variation;
    const newValue = Math.max(0, lastPoint.value + randomVariation);

    const newPoint: DataPoint = {
      label: `${lastPoint.label}+`,
      value: Math.round(newValue),
      timestamp: new Date()
    };

    // Keep last 10 points
    if (chartData.data.length >= 10) {
      chartData.data.shift();
    }
    chartData.data.push(newPoint);

    return newPoint;
  }

  /**
   * Filter data by date range
   */
  filterByDateRange(startDate: Date, endDate: Date): ChartData[] {
    return this.data.map(chart => ({
      ...chart,
      data: chart.data.filter(point => {
        if (!point.timestamp) return true;
        return point.timestamp >= startDate && point.timestamp <= endDate;
      })
    }));
  }

  /**
   * Get summary statistics
   */
  getSummary(): { totalValue: number; averageValue: number; itemCount: number } {
    const allValues = this.data.flatMap(d => d.data.map(p => p.value));
    const totalValue = allValues.reduce((a, b) => a + b, 0);
    const averageValue = allValues.length > 0 ? totalValue / allValues.length : 0;

    return {
      totalValue,
      averageValue: Math.round(averageValue * 100) / 100,
      itemCount: this.data.length
    };
  }
}

export default new DataService();
