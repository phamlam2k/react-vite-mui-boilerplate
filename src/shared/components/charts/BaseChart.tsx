import { useEffect, useMemo, useRef } from "react";
import * as echarts from "echarts/core";
import type { EChartsType, EChartsOption, SetOptionOpts } from "echarts";
import { BarChart, LineChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DatasetComponent,
  ToolboxComponent,
} from "echarts/components";
import { CanvasRenderer, SVGRenderer } from "echarts/renderers";

echarts.use([
  BarChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DatasetComponent,
  ToolboxComponent,
  CanvasRenderer,
  SVGRenderer,
]);

type Renderer = "canvas" | "svg";

type BaseChartProps = {
  option: EChartsOption;
  height?: number;
  renderer?: Renderer;
  className?: string;
  style?: React.CSSProperties;
  loading?: boolean;
  setOptionOpts?: SetOptionOpts;
  onReady?: (chart: EChartsType) => void;
};

const BaseChart = ({
  option,
  height = 320,
  renderer = "canvas",
  className,
  style,
  loading = false,
  setOptionOpts,
  onReady,
}: BaseChartProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<EChartsType | null>(null);

  const mergedStyle = useMemo<React.CSSProperties>(
    () => ({
      width: "100%",
      height,
      ...style,
    }),
    [height, style]
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = echarts.init(containerRef.current, undefined, {
      renderer,
      useDirtyRect: true,
    });

    chartRef.current = chart as unknown as EChartsType;
    onReady?.(chart as unknown as EChartsType);

    const resizeObserver = new ResizeObserver(() => {
      chart.resize();
    });
    resizeObserver.observe(containerRef.current);

    const handleWindowResize = () => {
      chart.resize();
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleWindowResize);
      chart.dispose();
    };
  }, [renderer, onReady]);

  useEffect(() => {
    if (!chartRef.current) return;

    chartRef.current.setOption(
      option,
      setOptionOpts ?? { notMerge: true, lazyUpdate: true }
    );

    if (loading) {
      chartRef.current.showLoading();
    } else {
      chartRef.current.hideLoading();
    }
  }, [option, loading, setOptionOpts]);

  return <div ref={containerRef} className={className} style={mergedStyle} />;
};

export type { BaseChartProps, Renderer };
export default BaseChart;
