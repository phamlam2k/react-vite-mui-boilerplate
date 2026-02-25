/**
 * 🟡 ADAPTER LAYER - Page
 * Danh mục quyền (read-only)
 */

import { Box, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { usePermissionsCatalog } from "../hooks/usePermissionsCatalog";

export default function PermissionsListPage() {
  const { data: permissions = [], isLoading } = usePermissionsCatalog();

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight={600}>
          Danh mục quyền
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Danh sách permission (read-only)
        </Typography>

        {isLoading ? (
          <Typography color="text.secondary">Đang tải...</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Key</TableCell>
                  <TableCell>Nhóm (group)</TableCell>
                  <TableCell>Mô tả</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {permissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      Không có dữ liệu
                    </TableCell>
                  </TableRow>
                ) : (
                  permissions.map((p) => (
                    <TableRow key={p.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {p.key}
                        </Typography>
                      </TableCell>
                      <TableCell>{p.group}</TableCell>
                      <TableCell>{p.description}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Container>
  );
}
