import { useQuery } from "@tanstack/react-query";
import { leaveUseCases } from "./leave.use-cases";

export const LeaveBalanceKeys = {
  all: ["leave-balances"] as const,
  byEmployee: (employeeId?: string) => [...LeaveBalanceKeys.all, employeeId] as const,
};

export function useLeaveBalances(employeeId?: string) {
  return useQuery({
    queryKey: LeaveBalanceKeys.byEmployee(employeeId),
    queryFn: () => leaveUseCases.getBalances(employeeId),
    staleTime: 60_000,
  });
}
