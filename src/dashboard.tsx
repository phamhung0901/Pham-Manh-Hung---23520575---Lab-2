/** @jsx createElement */
import { createElement, useState, ComponentProps } from './jsx-runtime';
import { Card, StyledButton, Select } from './components';
import { Chart } from './chart';
import dataService from './data-service';

// ============================================================
// PART 4.1: Dashboard Application
// ============================================================

/**
 * Dashboard - Main dashboard component
 */
export const Dashboard = (): any => {
  const [getChartType, setChartType] = useState<'all' | 'bar' | 'line' | 'pie'>('all');
  const [getAutoUpdate, setAutoUpdate] = useState(false);
  const [getUpdateCount, setUpdateCount] = useState(0);

  // Auto-update interval
  if (getAutoUpdate()) {
    setTimeout(() => {
      const categories = ['sales', 'visitors', 'market'];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      dataService.simulateUpdate(randomCategory, 15);
      setUpdateCount(getUpdateCount() + 1);
    }, 3000);  // Update setiap 3 detik
  }

  // Get data to display
  const allData = dataService.getAllData();
  const currentChartType = getChartType();
  const displayData =
    currentChartType === 'all'
      ? allData
      : allData.filter(d => d.type === currentChartType as any);

  // Get summary
  const summary = dataService.getSummary();

  return createElement('div', { className: 'dashboard' },
    // Header
    createElement('header', { className: 'dashboard-header' },
      createElement('h1', null, '📊 Analytics Dashboard'),
      createElement('p', { className: 'subtitle' }, 'Real-time data visualization' + (getAutoUpdate() ? ' 🔄 Live' : ''))
    ),

    // Summary stats
    createElement('div', { className: 'dashboard-stats' },
      createElement(Card, { title: '💰 Total Value', className: 'stat-card' },
        createElement('div', { className: 'stat-value' }, `$${summary.totalValue.toLocaleString()}`)
      ),
      createElement(Card, { title: '📈 Average Value', className: 'stat-card' },
        createElement('div', { className: 'stat-value' }, `$${summary.averageValue.toLocaleString()}`)
      ),
      createElement(Card, { title: '📊 Charts Count', className: 'stat-card' },
        createElement('div', { className: 'stat-value' }, `${summary.itemCount} charts`)
      ),
      ...(getAutoUpdate()
        ? [createElement(Card, { title: '🔄 Updates', className: 'stat-card' },
            createElement('div', { className: 'stat-value' }, `${getUpdateCount()} updates`)
          )]
        : [])
    ),

    // Controls
    createElement('div', { className: 'dashboard-controls' },
      createElement('div', { className: 'control-group' },
        createElement('label', null, '📊 Chart Type:'),
        createElement(Select, {
          value: getChartType(),
          onChange: (e: Event) => {
            const target = e.target as HTMLSelectElement;
            setChartType(target.value as any);
          },
          options: [
            { value: 'all', label: 'All Charts' },
            { value: 'bar', label: 'Bar Charts' },
            { value: 'line', label: 'Line Charts' },
            { value: 'pie', label: 'Pie Charts' }
          ]
        })
      ),
      createElement('div', { className: 'control-group' },
        createElement(StyledButton, {
          variant: getAutoUpdate() ? 'danger' : 'primary',
          onClick: () => setAutoUpdate(!getAutoUpdate())
        },
          getAutoUpdate() ? '⏹️ Stop Live Update' : '▶️ Start Live Update'
        )
      )
    ),

    // Charts grid
    createElement('div', { className: 'charts-grid' },
      ...(displayData.length > 0
        ? displayData.map(chartData =>
            createElement(Chart, {
              key: chartData.category,
              data: chartData,
              width: 500,
              height: 300,
              className: 'chart-item'
            })
          )
        : [createElement('p', null, 'No data to display')])
    )
  );
};

export default Dashboard;
