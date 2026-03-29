/**
 * 🟡 ADAPTER LAYER - Page Container
 * Leave Management page with request list + balance summary tabs.
 */

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import { useModalController } from "@core/modal/hooks/useModalController";
import { useRegisterModals } from "@core/modal/hooks/useRegisterModals";
import leaveModalRegistry from "../modals/leave.modal.registry";
import { useAuthStore } from "@shared/stores/auth.store";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@shared/constants/paginations";
import type { ILeaveRequestFilters } from "@modules/leave/_domain/leave.model";
import { canSubmitLeave } from "@modules/leave/_domain/leave.rules";
import { useLeaveList } from "../hooks/useLeaveList";
import { useLeaveBalances } from "../hooks/useLeaveBalances";
import LeaveRequestTable from "../components/LeaveRequestTable";
import LeaveRequestFilters from "../components/LeaveRequestFilters";
import LeaveBalanceSummary from "../components/LeaveBalanceSummary";
import { LeaveModalKeys } from "../modals/leave.modal.registry";

export default function LeaveManagementPage() {
  useRegisterModals(leaveModalRegistry);

  const { open } = useModalController();
  const permissions = useAuthStore(s => s.permissions);

  const [tab, setTab] = useState(0);
  const [filters, setFilters] = useState<ILeaveRequestFilters>({
    page: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
    status: "all",
  });

  const { data, isLoading } = useLeaveList(filters);
  const { data: balances, isLoading: loadingBalances } = useLeaveBalances();

  const canCreate = canSubmitLeave(permissions);

  const handleFiltersChange = (next: Partial<ILeaveRequestFilters>) => {
    setFilters(prev => ({ ...prev, ...next }));
  };

  return (
    <Container maxWidth="xl">
      <Box py={3}>
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Quản lý nghỉ phép
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Theo dõi và quản lý các yêu cầu nghỉ phép
            </Typography>
          </Box>

          {canCreate && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => open(LeaveModalKeys.CreateLeaveModal, {})}
            >
              Tạo yêu cầu nghỉ
            </Button>
          )}
        </Box>

        {/* Tabs */}
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="Yêu cầu nghỉ phép" />
          <Tab label="Số dư nghỉ phép" />
        </Tabs>

        {/* Tab 0: Leave Requests */}
        {tab === 0 && (
          <>
            <LeaveRequestFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
            <LeaveRequestTable
              rows={data?.data ?? []}
              meta={
                data?.meta ?? {
                  totalItems: 0,
                  page: 1,
                  pageSize: DEFAULT_PAGE_SIZE,
                  totalPages: 0,
                }
              }
              filters={filters}
              onFiltersChange={handleFiltersChange}
              isLoading={isLoading}
            />
          </>
        )}

        {/* Tab 1: Leave Balances */}
        {tab === 1 && (
          <LeaveBalanceSummary
            balances={balances ?? []}
            isLoading={loadingBalances}
          />
        )}
      </Box>
    </Container>
  );
}
