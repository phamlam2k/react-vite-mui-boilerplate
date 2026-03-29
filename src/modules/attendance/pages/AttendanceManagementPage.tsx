/**
 * 🟡 ADAPTER LAYER - Page Container
 * Attendance Management: check-in/out widget + records tab + corrections tab.
 */

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import { useState, useMemo } from "react";
import { useRegisterModals } from "@core/modal/hooks/useRegisterModals";
import { useModalController } from "@core/modal/hooks/useModalController";
import { useAuthStore } from "@shared/stores/auth.store";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@shared/constants/paginations";
import type {
  AttendanceCorrectionFilters,
  AttendanceRecordFilters,
} from "@modules/attendance/_domain/attendance.model";
import { canSubmitCorrection } from "@modules/attendance/_domain/attendance.rules";
import { useAttendanceRecords } from "../hooks/useAttendanceRecords";
import { useAttendanceCorrections } from "../hooks/useAttendanceCorrections";
import AttendanceRecordFiltersBar from "../components/AttendanceRecordFilters";
import AttendanceRecordTable from "../components/AttendanceRecordTable";
import AttendanceCorrectionTable from "../components/AttendanceCorrectionTable";
import CheckInOutWidget from "../components/CheckInOutWidget";
import attendanceModalRegistry from "../modals/attendance.modal.registry";
import { AttendanceModalKeys } from "../modals/attendance.modal.registry";

// Default date range: current month
function getDefaultDateRange() {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const today = new Date();
  return {
    dateFrom: firstDay.toISOString().slice(0, 10),
    dateTo: today.toISOString().slice(0, 10),
  };
}

export default function AttendanceManagementPage() {
  useRegisterModals(attendanceModalRegistry);

  const { open } = useModalController();
  const permissions = useAuthStore((s) => s.permissions);
  const canCorrect = canSubmitCorrection(permissions);

  const [tab, setTab] = useState(0);
  const defaultRange = useMemo(() => getDefaultDateRange(), []);

  const [recordFilters, setRecordFilters] = useState<AttendanceRecordFilters>({
    page: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
    ...defaultRange,
    status: "all",
  });

  const [correctionFilters, setCorrectionFilters] = useState<AttendanceCorrectionFilters>({
    page: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
    status: "all",
  });

  const { data: records, isLoading: loadingRecords } = useAttendanceRecords(recordFilters);
  const { data: corrections, isLoading: loadingCorrections } = useAttendanceCorrections(correctionFilters);

  // Find today's record for the check-in/out widget
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayRecord = records?.data.find((r) => r.date === todayStr) ?? null;

  return (
    <Container maxWidth="xl">
      <Box py={3}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Quản lý chấm công
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Theo dõi thời gian làm việc và yêu cầu điều chỉnh chấm công
            </Typography>
          </Box>

          {canCorrect && (
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => open(AttendanceModalKeys.CreateCorrectionModal, {})}
            >
              Yêu cầu điều chỉnh
            </Button>
          )}
        </Box>

        {/* Today check-in/out widget */}
        <CheckInOutWidget todayRecord={todayRecord} isLoading={loadingRecords} />

        {/* Tabs */}
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="Lịch sử chấm công" />
          <Tab label="Yêu cầu điều chỉnh" />
        </Tabs>

        {/* Tab 0: Attendance Records */}
        {tab === 0 && (
          <>
            <AttendanceRecordFiltersBar
              filters={recordFilters}
              onFiltersChange={(next) => setRecordFilters((prev) => ({ ...prev, ...next }))}
            />
            <AttendanceRecordTable
              rows={records?.data ?? []}
              meta={records?.meta ?? { totalItems: 0, page: 1, pageSize: DEFAULT_PAGE_SIZE, totalPages: 0 }}
              filters={recordFilters}
              onFiltersChange={(next) => setRecordFilters((prev) => ({ ...prev, ...next }))}
              isLoading={loadingRecords}
            />
          </>
        )}

        {/* Tab 1: Corrections */}
        {tab === 1 && (
          <AttendanceCorrectionTable
            rows={corrections?.data ?? []}
            meta={corrections?.meta ?? { totalItems: 0, page: 1, pageSize: DEFAULT_PAGE_SIZE, totalPages: 0 }}
            filters={correctionFilters}
            onFiltersChange={(next) => setCorrectionFilters((prev) => ({ ...prev, ...next }))}
            isLoading={loadingCorrections}
          />
        )}
      </Box>
    </Container>
  );
}
