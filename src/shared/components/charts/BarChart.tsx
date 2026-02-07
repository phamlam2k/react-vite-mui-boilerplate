import { useMemo } from "react";
import type { EChartsOption } from "echarts";
import { useTheme } from "@mui/material/styles";
import BaseChart from "./BaseChart";
import type { Renderer } from "./BaseChart";

type BarSeries = {
  name: string;
  data: Array<number | null>;
  stack?: string;
  color?: string;
  barWidth?: number | string;
};

type BarChartProps = {
  xAxis: Array<string | number>;
  series: BarSeries[];
  title?: string;
  height?: number;
  renderer?: Renderer;
  showLegend?: boolean;
  yAxisLabel?: string;
  loading?: boolean;
  tooltipFormatter?: EChartsOption["tooltip"] extends infer T
    ? T extends { formatter?: infer F }
      ? F
      : never
    : never;
  className?: string;
};

const BarChart = ({
  xAxis,
  series,
  title,
  height,
  renderer,
  showLegend = true,
  yAxisLabel,
  loading = false,
  tooltipFormatter,
  className,
}: BarChartProps) => {
  const theme = useTheme();

  const palette = useMemo(
    () => [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.success.main,
      theme.palette.warning.main,
      theme.palette.info.main,
      theme.palette.error.main,
    ],
    [
      theme.palette.error.main,
      theme.palette.info.main,
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.success.main,
      theme.palette.warning.main,
    ]
  );

  const colors = useMemo(
    () =>
      series.map(
        (item, index) => item.color ?? palette[index % palette.length]
      ),
    [palette, series]
  );

  const option = useMemo<EChartsOption>(
    () => ({
      color: colors,
      title: title
        ? {
            text: title,
            left: "center",
            textStyle: {
              color: theme.palette.text.primary,
              fontWeight: 600,
            },
          }
        : undefined,
      tooltip: {
        trigger: "axis",
        formatter: tooltipFormatter,
      },
      legend: showLegend
        ? {
            top: 8,
            textStyle: {
              color: theme.palette.text.secondary,
            },
          }
        : undefined,
      grid: {
        left: "8%",
        right: "4%",
        bottom: "10%",
        top: title ? "14%" : "12%",
      },
      xAxis: {
        type: "category",
        data: xAxis,
        axisLabel: {
          color: theme.palette.text.secondary,
        },
        axisLine: {
          lineStyle: {
            color: theme.palette.divider,
          },
        },
      },
      yAxis: {
        type: "value",
        name: yAxisLabel,
        axisLabel: {
          color: theme.palette.text.secondary,
        },
        splitLine: {
          lineStyle: {
            color: theme.palette.divider,
          },
        },
      },
      series: series.map((item, index) => ({
        type: "bar" as const,
        name: item.name,
        data: item.data,
        stack: item.stack,
        barWidth: item.barWidth,
        itemStyle: {
          color: colors[index],
        },
        emphasis: {
          focus: "series",
        },
      })),
    }),
    [
      colors,
      series,
      showLegend,
      theme.palette.divider,
      theme.palette.text.primary,
      theme.palette.text.secondary,
      title,
      tooltipFormatter,
      xAxis,
      yAxisLabel,
    ]
  );

  return (
    <BaseChart
      option={option}
      height={height}
      renderer={renderer}
      loading={loading}
      className={className}
    />
  );
};

export type { BarChartProps, BarSeries };
export default BarChart;
