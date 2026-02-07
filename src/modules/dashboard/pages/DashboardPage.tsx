import { useMemo } from "react";
import Typography from "@mui/material/Typography";
import { TrendingUp, Group, AttachMoney, Timeline } from "@mui/icons-material";
import ChartsSection from "@modules/dashboard/components/ChartsSection";
import StatsGrid from "@modules/dashboard/components/StatsGrid";
import Highlights from "@modules/dashboard/components/Highlights";
import type { StatItem } from "@modules/dashboard/components/StatsGrid";

const stats: StatItem[] = [
  { label: "Active Users", value: "12.4k", change: "+8.2%", icon: Group },
  { label: "MRR", value: "$94.3k", change: "+3.1%", icon: AttachMoney },
  { label: "Sessions", value: "182k", change: "+5.7%", icon: Timeline },
  { label: "Conversion", value: "3.8%", change: "+0.6%", icon: TrendingUp },
];

function DashboardPage() {
  const weeklyActiveUsers = useMemo(
    () => ({
      xAxis: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      series: [
        {
          name: "New",
          data: [320, 402, 350, 480, 520, 610, 550],
          stack: "users",
        },
        {
          name: "Returning",
          data: [220, 240, 260, 300, 330, 360, 340],
          stack: "users",
        },
      ],
    }),
    []
  );

  const monthlyRevenue = useMemo(
    () => ({
      xAxis: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      series: [
        {
          name: "2024",
          data: [120, 140, 160, 180, 210, 240, 260, 270, 290, 310, 330, 360],
          area: true,
        },
        {
          name: "2025 (est.)",
          data: [150, 170, 190, 220, 250, 280, 300, 320, 340, 365, 380, 410],
          smooth: true,
          area: true,
          showSymbol: false,
        },
      ],
    }),
    []
  );

  return (
    <div className="py-3 flex flex-col gap-3">
      <Typography variant="h4" fontWeight={700}>
        Dashboard
      </Typography>

      <StatsGrid stats={stats} />

      <ChartsSection
        bar={{
          title: "Weekly Active Users",
          subtitle: "Breakdown of new vs returning users by weekday.",
          xAxis: weeklyActiveUsers.xAxis,
          series: weeklyActiveUsers.series,
          yAxisLabel: "Users",
        }}
        line={{
          title: "Monthly Revenue",
          subtitle: "Actuals vs projections with gentle area fill.",
          xAxis: monthlyRevenue.xAxis,
          series: monthlyRevenue.series,
          yAxisLabel: "k USD",
        }}
      />

      <Highlights
        items={[
          {
            title: "Engagement",
            description:
              "Session duration up 12% week-over-week with retention steady at 82%.",
          },
          {
            title: "Growth",
            description:
              "New user acquisition pacing ahead of plan; organic channels leading.",
          },
          {
            title: "Reliability",
            description:
              "Error rate below 0.2% and 99.95% uptime over the last 30 days.",
          },
        ]}
      />
    </div>
  );
}

export default DashboardPage;
