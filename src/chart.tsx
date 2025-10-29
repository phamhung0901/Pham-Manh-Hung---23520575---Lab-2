/** @jsx createElement */
import { createElement, ComponentProps } from './jsx-runtime';
import { ChartData } from './data-service';

// ============================================================
// PART 4.1: Chart Component
// ============================================================

export interface ChartProps extends ComponentProps {
  data: ChartData;
  width?: number;
  height?: number;
  className?: string;
}

/**
 * Chart Component - Renders different chart types
 */
export const Chart = (props: ChartProps): any => {
  const {
    data,
    width = 400,
    height = 300,
    className = ''
  } = props;

  const canvasId = `chart-${Math.random().toString(36).substr(2, 9)}`;

  // Draw function to be called when canvas is ready
  const drawOnMount = () => {
    // Use requestAnimationFrame to ensure rendering happens after DOM update
    requestAnimationFrame(() => {
      const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
      if (canvas && canvas.parentNode) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          drawChart(ctx, data, width, height);
        }
      }
    });
  };

  return createElement('div', {
    className: `chart-container ${className}`,
    _onMounted: drawOnMount
  },
    createElement('h3', { className: 'chart-title' }, data.title),
    createElement('canvas', {
      id: canvasId,
      width: width,
      height: height,
      className: 'chart-canvas'
    })
  );
};

/**
 * Main chart drawing function
 */
function drawChart(
  ctx: CanvasRenderingContext2D,
  data: ChartData,
  width: number,
  height: number
): void {
  // Clear canvas
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, width, height);

  switch (data.type) {
    case 'bar':
      drawBarChart(ctx, data, width, height);
      break;
    case 'line':
      drawLineChart(ctx, data, width, height);
      break;
    case 'pie':
      drawPieChart(ctx, data, width, height);
      break;
  }
}

/**
 * Draw bar chart
 */
function drawBarChart(
  ctx: CanvasRenderingContext2D,
  data: ChartData,
  width: number,
  height: number
): void {
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  const barWidth = chartWidth / data.data.length * 0.8;
  const barSpacing = chartWidth / data.data.length;

  // Draw axes
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.stroke();

  // Find max value
  const maxValue = Math.max(...data.data.map(d => d.value));
  const scale = chartHeight / maxValue;

  // Draw bars
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
  data.data.forEach((point, index) => {
    const x = padding + index * barSpacing + barSpacing / 2 - barWidth / 2;
    const barHeight = point.value * scale;
    const y = height - padding - barHeight;

    ctx.fillStyle = colors[index % colors.length];
    ctx.fillRect(x, y, barWidth, barHeight);

    // Draw label
    ctx.fillStyle = '#000';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(point.label, x + barWidth / 2, height - padding + 20);

    // Draw value
    ctx.fillText(String(point.value), x + barWidth / 2, y - 5);
  });
}

/**
 * Draw line chart
 */
function drawLineChart(
  ctx: CanvasRenderingContext2D,
  data: ChartData,
  width: number,
  height: number
): void {
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Draw axes
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.stroke();

  // Grid lines
  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = padding + (chartHeight / 5) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }

  // Find max value
  const maxValue = Math.max(...data.data.map(d => d.value));
  const scale = chartHeight / maxValue;
  const pointSpacing = chartWidth / (data.data.length - 1 || 1);

  // Draw line and points
  ctx.strokeStyle = '#4ECDC4';
  ctx.lineWidth = 3;
  ctx.beginPath();

  data.data.forEach((point, index) => {
    const x = padding + index * pointSpacing;
    const y = height - padding - point.value * scale;

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.stroke();

  // Draw points and labels
  data.data.forEach((point, index) => {
    const x = padding + index * pointSpacing;
    const y = height - padding - point.value * scale;

    ctx.fillStyle = '#4ECDC4';
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();

    // Draw label
    ctx.fillStyle = '#000';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(point.label, x, height - padding + 20);
  });
}

/**
 * Draw pie chart
 */
function drawPieChart(
  ctx: CanvasRenderingContext2D,
  data: ChartData,
  width: number,
  height: number
): void {
  const centerX = width / 2;
  const centerY = height / 2 - 20;
  const radius = Math.min(width, height) / 2 - 40;

  // Calculate total
  const total = data.data.reduce((sum, d) => sum + d.value, 0);

  // Draw slices
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
  let currentAngle = 0;

  data.data.forEach((point, index) => {
    const sliceAngle = (point.value / total) * Math.PI * 2;
    const nextAngle = currentAngle + sliceAngle;

    // Draw slice
    ctx.fillStyle = colors[index % colors.length];
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, currentAngle, nextAngle);
    ctx.closePath();
    ctx.fill();

    // Draw label
    const labelAngle = currentAngle + sliceAngle / 2;
    const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
    const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(point.label, labelX, labelY);
    ctx.fillText(`${Math.round((point.value / total) * 100)}%`, labelX, labelY + 15);

    currentAngle = nextAngle;
  });

  // Draw legend
  let legendY = height - 40;
  data.data.forEach((point, index) => {
    const percentage = Math.round((point.value / total) * 100);
    ctx.fillStyle = colors[index % colors.length];
    ctx.fillRect(20, legendY, 15, 15);

    ctx.fillStyle = '#000';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`${point.label} (${percentage}%)`, 40, legendY + 12);

    legendY -= 20;
  });
}

export default Chart;
