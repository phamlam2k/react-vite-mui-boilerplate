/**
 * 🟡 ADAPTER LAYER - UI Component
 * Check-in / Check-out action widget for today's session.
 * Status/action logic uses domain rules.
 */

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { useModalController } from "@core/modal/hooks/useModalController";
import { canCheckIn, canCheckOut } from "@modules/attendance/_domain/attendance.rules";
import type { AttendanceRecord } from "@modules/attendance/_domain/attendance.model";
import { AttendanceModalKeys } from "../modals/attendance.modal.registry";

function formatTime(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

interface Props {
  todayRecord: AttendanceRecord | null;
  isLoading?: boolean;
}

export default function CheckInOutWidget({ todayRecord, isLoading }: Props) {
  const { open } = useModalController();
  const canIn = canCheckIn(todayRecord);
  const canOut = canCheckOut(todayRecord);

  return (
    <Card variant="outlined" sx={{ mb: 3 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          {/* Left: Today status */}
          <Box display="flex" gap={4} alignItems="center">
            <Box>
              <Typography variant="caption" color="text.secondary">Hôm nay</Typography>
              <Typography variant="subtitle1" fontWeight={700}>
                {new Date().toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit" })}
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              <AccessTimeIcon fontSize="small" color="action" />
              <Box>
                <Typography variant="caption" color="text.secondary">Giờ vào</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {isLoading ? "..." : formatTime(todayRecord?.checkInAt ?? null)}
                </Typography>
              </Box>
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              <AccessTimeIcon fontSize="small" color="action" />
              <Box>
                <Typography variant="caption" color="text.secondary">Giờ ra</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {isLoading ? "..." : formatTime(todayRecord?.checkOutAt ?? null)}
                </Typography>
              </Box>
            </Box>

            {todayRecord && todayRecord.workedMinutes > 0 && (
              <Box>
                <Typography variant="caption" color="text.secondary">Đã làm</Typography>
                <Typography variant="body2" fontWeight={600} color="success.main">
                  {formatMinutes(todayRecord.workedMinutes)}
                </Typography>
              </Box>
            )}

            {todayRecord?.lateMinutes ? (
              <Chip label={`Trễ ${formatMinutes(todayRecord.lateMinutes)}`} color="warning" size="small" />
            ) : null}
          </Box>

          {/* Right: Actions */}
          <Box display="flex" gap={1}>
            {canIn && (
              <Button
                variant="contained"
                color="success"
                startIcon={<LoginIcon />}
                onClick={() => open(AttendanceModalKeys.CheckInModal, {})}
                disabled={isLoading}
              >
                Check-in
              </Button>
            )}
            {canOut && (
              <Button
                variant="contained"
                color="warning"
                startIcon={<LogoutIcon />}
                onClick={() => open(AttendanceModalKeys.CheckOutModal, {})}
                disabled={isLoading}
              >
                Check-out
              </Button>
            )}
            {!canIn && !canOut && todayRecord && (
              <Chip label="Đã hoàn thành hôm nay" color="success" variant="outlined" />
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
