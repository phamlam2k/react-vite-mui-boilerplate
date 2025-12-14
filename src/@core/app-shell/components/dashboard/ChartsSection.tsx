import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { BarChart, LineChart } from "@shared/components";
import type { BarSeries } from "@shared/components/charts/BarChart";
import type { LineSeries } from "@shared/components/charts/LineChart";

type BarBlock = {
  title: string;
  subtitle?: string;
  xAxis: Array<string | number>;
  series: BarSeries[];
  yAxisLabel?: string;
  height?: number;
};

type LineBlock = {
  title: string;
  subtitle?: string;
  xAxis: Array<string | number>;
  series: LineSeries[];
  yAxisLabel?: string;
  height?: number;
};

type ChartsSectionProps = {
  bar: BarBlock;
  line: LineBlock;
};

const ChartsSection = ({ bar, line }: ChartsSectionProps) => {
  return (
    <Box
      sx={{
        display: "grid",
        gap: 2,
        gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
      }}
    >
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={700} mb={1}>
            {bar.title}
          </Typography>
          {bar.subtitle ? (
            <Typography variant="body2" color="text.secondary" mb={2}>
              {bar.subtitle}
            </Typography>
          ) : null}
          <BarChart
            xAxis={bar.xAxis}
            series={bar.series}
            showLegend
            height={bar.height ?? 320}
            yAxisLabel={bar.yAxisLabel}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={700} mb={1}>
            {line.title}
          </Typography>
          {line.subtitle ? (
            <Typography variant="body2" color="text.secondary" mb={2}>
              {line.subtitle}
            </Typography>
          ) : null}
          <LineChart
            xAxis={line.xAxis}
            series={line.series}
            showLegend
            height={line.height ?? 320}
            yAxisLabel={line.yAxisLabel}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export type { ChartsSectionProps, BarBlock, LineBlock };
export default ChartsSection;
