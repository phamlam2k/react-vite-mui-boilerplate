import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import type { SvgIconComponent } from "@mui/icons-material";

type StatItem = {
  label: string;
  value: string;
  change: string;
  icon: SvgIconComponent;
};

type StatsGridProps = {
  stats: StatItem[];
};

const StatsGrid = ({ stats }: StatsGridProps) => {
  return (
    <Box
      sx={{
        display: "grid",
        gap: 2,
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(4, 1fr)",
        },
      }}
    >
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.label}>
            <CardContent
              sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="subtitle2" color="text.secondary">
                  {item.label}
                </Typography>
                <Chip
                  label={item.change}
                  size="small"
                  color="success"
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Icon color="primary" />
                <Typography variant="h5" fontWeight={700}>
                  {item.value}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
};

export type { StatItem, StatsGridProps };
export default StatsGrid;
