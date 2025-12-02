import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Select,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import UserForm from "../../components/users/UserForm";
import { createUser, deleteUser, getAllUsers, updateUser } from "../../services/users";

const ROLE_OPTIONS = [
  { label: "Administrador", value: "ADMIN" },
  { label: "Operador", value: "OPERATOR" },
];

function Users() {
  const [users, setUsers] = useState([]);
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [roleChanges, setRoleChanges] = useState({});
  const [isUpdatingRoles, setIsUpdatingRoles] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isUpdatingUser, setIsUpdatingUser] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await getAllUsers();
      const list = Array.isArray(data) ? data : data?.items || [];
      setUsers(list);
      setRoleChanges({});
    } catch (error) {
      console.error("Error al listar usuarios", error);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (payload) => {
    setIsSaving(true);
    try {
      await createUser(payload);
      await fetchUsers();
      setShowNewUserForm(false);
    } catch (error) {
      console.error("Error al crear usuario", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangeRole = (userId, role) => {
    setUsers((prev) =>
      prev.map((user) => (getUserId(user) === userId ? { ...user, roles: [role] } : user)),
    );
    setRoleChanges((prev) => ({ ...prev, [userId]: role }));
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      await deleteUser(getUserId(userToDelete));
      await fetchUsers();
    } catch (error) {
      console.error("Error al eliminar usuario", error);
    } finally {
      setUserToDelete(null);
      setIsDeleting(false);
    }
  };

  const getUserId = (user) => user?.id || user?._id || user?.username;

  const handleUpdateUser = async (payload) => {
    if (!editingUser) return;
    setIsUpdatingUser(true);
    try {
      await updateUser(getUserId(editingUser), payload);
      await fetchUsers();
      setEditingUser(null);
    } catch (error) {
      console.error("Error al actualizar usuario", error);
    } finally {
      setIsUpdatingUser(false);
    }
  };

  const handleSaveRoleChanges = async () => {
    if (Object.keys(roleChanges).length === 0) return;
    setIsUpdatingRoles(true);
    try {
      const updates = Object.entries(roleChanges).map(([userId, role]) =>
        updateUser(userId, { roles: [role] }),
      );
      await Promise.all(updates);
      await fetchUsers();
    } catch (error) {
      console.error("Error al actualizar roles", error);
    } finally {
      setIsUpdatingRoles(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Stack spacing={3}>
        <Typography variant="h4" component="h1">
          Usuarios
        </Typography>

        <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Nuevo Usuario</Typography>
              <Button variant="contained" onClick={() => setShowNewUserForm((prev) => !prev)}>
                {showNewUserForm ? "Ocultar" : "Nuevo Usuario"}
              </Button>
            </Stack>

            {showNewUserForm && (
              <UserForm
                title="Agregar Nuevo Usuario"
                roleOptions={ROLE_OPTIONS}
                onSave={handleAddUser}
                onCancel={() => setShowNewUserForm(false)}
                isSaving={isSaving}
                requirePassword
              />
            )}
          </Stack>
        </Paper>

        {editingUser && (
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <UserForm
              title={`Editar usuario: ${editingUser.username}`}
              roleOptions={ROLE_OPTIONS}
              initialData={editingUser}
              onSave={handleUpdateUser}
              onCancel={() => setEditingUser(null)}
              isSaving={isUpdatingUser}
              requirePassword={false}
            />
          </Paper>
        )}


        <Typography variant="h5" component="h1">
        Lista de Usuarios
        </Typography>

        <Paper elevation={2} sx={{ borderRadius: 3 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="h6" fontWeight={600}>
                      Nombre Usuario
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="h6" fontWeight={600}>
                      Opciones
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={2}>
                      <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" sx={{ py: 2 }}>
                        <CircularProgress size={20} />
                        <Typography color="text.secondary">Cargando usuarios...</Typography>
                      </Stack>
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading &&
                  users.map((user) => {
                  const userId = getUserId(user);
                  const userRole = Array.isArray(user?.roles) ? user.roles[0] : user?.role || "";
                  return (
                    <TableRow key={userId}>
                      <TableCell>
                        <Typography>{user.username}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<EditIcon />}
                            onClick={() => setEditingUser(user)}
                          >
                            Editar
                          </Button>
                          <Select
                            value={userRole || ROLE_OPTIONS[0].value}
                            onChange={(event) => handleChangeRole(userId, event.target.value)}
                            size="small"
                            sx={{ minWidth: 160 }}
                            disabled={isUpdatingRoles}
                          >
                            {ROLE_OPTIONS.map((role) => (
                              <MenuItem key={role.value} value={role.value}>
                                {role.label}
                              </MenuItem>
                            ))}
                          </Select>
                          <IconButton
                            color="error"
                            aria-label={`Eliminar ${user.username}`}
                            onClick={() => setUserToDelete(user)}
                            disabled={isDeleting}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              onClick={handleSaveRoleChanges}
              disabled={isUpdatingRoles || Object.keys(roleChanges).length === 0}
            >
              {isUpdatingRoles ? (
                <Stack direction="row" spacing={1} alignItems="center">
                  <CircularProgress size={16} />
                  Guardando
                </Stack>
              ) : (
                "Guardar cambios"
              )}
            </Button>
          </Box>
        </Paper>
      </Stack>

      <Dialog open={Boolean(userToDelete)} onClose={() => setUserToDelete(null)}>
        <DialogTitle>Eliminar usuario</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Seguro que deseas eliminar al usuario{" "}
            <Box component="span" fontWeight={700}>
              {userToDelete?.username}
            </Box>
            ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserToDelete(null)}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={handleDeleteUser}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Users;
