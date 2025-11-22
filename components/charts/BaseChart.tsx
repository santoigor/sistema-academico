import { ResponsiveContainer } from 'recharts';
import { ReactNode } from 'react';

interface BaseChartProps {
  children: ReactNode;
  height?: number;
  className?: string;
}

/**
 * Base wrapper component for all charts using Recharts
 * Provides consistent responsive behavior and theme colors
 *
 * Theme Colors:
 * - Primary (Blue): #2C5282
 * - Accent (Orange): #DD6B20
 */
export function BaseChart({ children, height = 300, className = '' }: BaseChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height} className={className}>
      {children}
    </ResponsiveContainer>
  );
}

// Theme colors for consistent chart styling
export const CHART_COLORS = {
  primary: '#2C5282',      // Blue - for primary data series
  accent: '#DD6B20',       // Orange - for highlights and secondary data
  success: '#48BB78',      // Green - for positive metrics (completions, active)
  warning: '#ECC94B',      // Yellow - for warnings
  danger: '#F56565',       // Red - for negative metrics (dropouts, inactive)
  gray: '#A0AEC0',         // Gray - for neutral data
  lightBlue: '#63B3ED',    // Light blue - for gradients
  lightOrange: '#F6AD55',  // Light orange - for gradients
};

// Common chart configuration
export const CHART_CONFIG = {
  margin: { top: 5, right: 30, left: 20, bottom: 5 },
  animationDuration: 800,
  gridStroke: '#E2E8F0',
  axisStroke: '#CBD5E0',
  tooltipStyle: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    padding: '12px',
  },
};
