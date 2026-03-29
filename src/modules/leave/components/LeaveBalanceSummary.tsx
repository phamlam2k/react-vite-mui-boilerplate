/**
 * 🟡 ADAPTER LAYER - UI Component
 * Cards showing leave balance per policy.
 */

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import type { LeaveBalance } from "@modules/leave/_domain/leave.model";

interface Props {
  balances: LeaveBalance[];
  isLoading?: boolean;
}

function BalanceBar({ used, pending, entitled }: { used: number; pending: number; entitled: number }) {
  const usedPct = entitled > 0 ? (used / entitled) * 100 : 0;
  const pendingPct = entitled > 0 ? (pending / entitled) * 100 : 0;

  return (
    <Tooltip title={`Đã dùng: ${used} / Đang chờ: ${pending} / Tổng: ${entitled}`}>
      <Box sx={{ height: 8, bgcolor: "grey.200", borderRadius: 4, overflow: "hidden", display: "flex" }}>
        <Box sx={{ width: `${usedPct}%`, bgcolor: "success.main", transition: "width 0.3s" }} />
        <Box sx={{ width: `${pendingPct}%`, bgcolor: "warning.main", transition: "width 0.3s" }} />
      </Box>
    </Tooltip>
  );
}

export default function LeaveBalanceSummary({ balances, isLoading }: Props) {
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  if (!balances.length) {
    return (
      <Typography color="text.secondary" textAlign="center" py={3}>
        Không có dữ liệu số dư nghỉ phép
      </Typography>
    );
  }

  return (
    <Grid container spacing={2}>
      {balances.map((b) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={b.id}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom noWrap>
                {b.policyName}
              </Typography>

              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="text.secondary">
                  Còn lại
                </Typography>
                <Typography variant="body1" fontWeight={700} color="primary">
                  {b.remaining} ngày
                </Typography>
              </Box>

              <BalanceBar used={b.used} pending={b.pending} entitled={b.entitled} />

              <Box display="flex" justifyContent="space-between" mt={1}>
                <Box textAlign="center">
                  <Typography variant="caption" color="text.secondary">Tổng</Typography>
                  <Typography variant="body2" fontWeight={600}>{b.entitled}</Typography>
                </Box>
                <Box textAlign="center">
                  <Typography variant="caption" color="success.main">Đã dùng</Typography>
                  <Typography variant="body2" fontWeight={600}>{b.used}</Typography>
                </Box>
                <Box textAlign="center">
                  <Typography variant="caption" color="warning.main">Chờ duyệt</Typography>
                  <Typography variant="body2" fontWeight={600}>{b.pending}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
