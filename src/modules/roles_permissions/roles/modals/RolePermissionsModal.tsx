/**
 * 🟡 ADAPTER LAYER - Modal
 * Edit permissions assigned to a role (role_permissions)
 */

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
} from "@mui/material";
import { useModalController } from "@core/modal/hooks/useModalController";
import type { ModalStack } from "@core/modal/store/modal.type";
import { useEffect, useMemo, useState } from "react";
import { useGetRoleDetail } from "../hooks/useGetRoleDetail";
import { useGetRolePermissions } from "../hooks/useGetRolePermissions";
import { usePermissionsCatalog } from "../../permissions/hooks/usePermissionsCatalog";
import { useSetRolePermissionsMutation } from "../hooks/useSetRolePermissionsMutation";

export type RolePermissionsModalProps = {
  roleId: string;
  onSuccess?: () => void;
};

const RolePermissionsModal = ({
  type,
  payload,
}: ModalStack<RolePermissionsModalProps>) => {
  const { roleId, onSuccess } = payload ?? {};
  const { close } = useModalController();
  const { data: role } = useGetRoleDetail(roleId ?? "");
  const { data: rolePermissions = [], isLoading: isLoadingRolePermissions } =
    useGetRolePermissions(roleId ?? "");
  const { data: allPermissions = [] } = usePermissionsCatalog();
  const setPermissionsMutation = useSetRolePermissionsMutation();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isLoadingRolePermissions) return;
    setSelectedIds(new Set((rolePermissions ?? []).map((p) => p.id)));
  }, [isLoadingRolePermissions, rolePermissions]);

  const handleToggle = (permissionId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(permissionId)) next.delete(permissionId);
      else next.add(permissionId);
      return next;
    });
  };

  const handleSelectAllInGroup = (group: string, checked: boolean) => {
    const idsInGroup = allPermissions
      .filter((p) => p.group === group)
      .map((p) => p.id);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      idsInGroup.forEach((id) => (checked ? next.add(id) : next.delete(id)));
      return next;
    });
  };

  const handleSave = () => {
    if (!roleId) return;
    setPermissionsMutation.mutate(
      { roleId, permissionIds: Array.from(selectedIds) },
      {
        onSuccess: () => {
          onSuccess?.();
          close(type);
        },
      }
    );
  };

  const handleClose = () => {
    if (!setPermissionsMutation.isPending) close(type);
  };

  const byGroup = useMemo(() => {
    const map = new Map<string, typeof allPermissions>();
    allPermissions.forEach((p) => {
      const g = p.group || "Other";
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(p);
    });
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [allPermissions]);

  return (
    <Dialog open={true} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Quyền: {role?.name ?? "..."}</DialogTitle>
      <DialogContent>
        {isLoadingRolePermissions ? (
          <Typography color="text.secondary">Đang tải...</Typography>
        ) : (
          <Box sx={{ maxHeight: 400, overflow: "auto" }}>
            {byGroup.map(([group, perms]) => (
              <Box key={group} sx={{ mb: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={perms.every((p) => selectedIds.has(p.id))}
                      indeterminate={
                        perms.some((p) => selectedIds.has(p.id)) &&
                        !perms.every((p) => selectedIds.has(p.id))
                      }
                      onChange={(_, checked) =>
                        handleSelectAllInGroup(group, checked)
                      }
                    />
                  }
                  label={
                    <Typography variant="subtitle2" fontWeight={600}>
                      {group}
                    </Typography>
                  }
                />
                <FormGroup sx={{ pl: 3 }}>
                  {perms.map((p) => (
                    <FormControlLabel
                      key={p.id}
                      control={
                        <Checkbox
                          checked={selectedIds.has(p.id)}
                          onChange={() => handleToggle(p.id)}
                        />
                      }
                      label={
                        <Typography variant="body2">
                          {p.key}
                          {p.description ? ` — ${p.description}` : ""}
                        </Typography>
                      }
                    />
                  ))}
                </FormGroup>
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={setPermissionsMutation.isPending}>
          Hủy
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={
            setPermissionsMutation.isPending || isLoadingRolePermissions
          }
        >
          {setPermissionsMutation.isPending ? "Đang lưu..." : "Lưu quyền"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RolePermissionsModal;
