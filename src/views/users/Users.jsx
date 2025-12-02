import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Field from "../../components/input/Field";

const ROLE_OPTIONS = ["Administrador", "Operador"];

const MOCK_USERS = [
  { id: 1, username: "admin", type: "Administrador" },
  { id: 2, username: "operador1", type: "Operador" },
  { id: 3, username: "soporte", type: "Operador" },
];

function Users() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    repeatPassword: "",
    type: ROLE_OPTIONS[0],
  });
  const [userToDelete, setUserToDelete] = useState(null);

  const isNewUserValid = useMemo(() => {
    return (
      newUser.username.trim() !== "" &&
      newUser.password.trim() !== "" &&
      newUser.password === newUser.repeatPassword
    );
  }, [newUser]);

  const handleAddUser = () => {
    if (!isNewUserValid) return;

    setUsers((prev) => [
      ...prev,
      {
        id: prev.length ? Math.max(...prev.map((u) => u.id)) + 1 : 1,
        username: newUser.username.trim(),
        type: newUser.type,
      },
    ]);

    setNewUser({
      username: "",
      password: "",
      repeatPassword: "",
      type: ROLE_OPTIONS[0],
    });
    setShowNewUserForm(false);
  };

  const handleChangeRole = (userId, role) => {
    setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, type: role } : user)));
  };

  const handleDeleteUser = () => {
    if (!userToDelete) return;
    setUsers((prev) => prev.filter((user) => user.id !== userToDelete.id));
    setUserToDelete(null);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Stack spacing={3}>
        <Typography variant="h4" component="h1">
          Usuarios
        </Typography>

        <Typography variant="h5" component="h1">
          Agregar Nuevo Usuario
        </Typography>

        <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Nuevo Usuario</Typography>
              <Button variant="contained" onClick={() => setShowNewUserForm((prev) => !prev)}>
                Nuevo Usuario
              </Button>
            </Stack>

            {showNewUserForm && (
              <Stack spacing={2}>
                <Field
                  label="Nombre de usuario"
                  placeholder="Ingresa el usuario"
                  value={newUser.username}
                  onChange={(value) => setNewUser((prev) => ({ ...prev, username: value }))}
                  fullWidth
                />
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Field
                    label="Contraseña"
                    type="password"
                    placeholder="Contraseña"
                    value={newUser.password}
                    onChange={(value) => setNewUser((prev) => ({ ...prev, password: value }))}
                    fullWidth
                  />
                  <Field
                    label="Repetir contraseña"
                    type="password"
                    placeholder="Repite la contraseña"
                    value={newUser.repeatPassword}
                    onChange={(value) => setNewUser((prev) => ({ ...prev, repeatPassword: value }))}
                    fullWidth
                  />
                </Stack>
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Tipo
                  </Typography>
                  <Select
                    fullWidth
                    value={newUser.type}
                    onChange={(event) =>
                      setNewUser((prev) => ({ ...prev, type: event.target.value }))
                    }
                  >
                    {ROLE_OPTIONS.map((role) => (
                      <MenuItem key={role} value={role}>
                        {role}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
                <Stack direction="row" justifyContent="flex-end" spacing={1}>
                  <Button variant="outlined" onClick={() => setShowNewUserForm(false)}>
                    Cancelar
                  </Button>
                  <Button variant="contained" onClick={handleAddUser} disabled={!isNewUserValid}>
                    Guardar usuario
                  </Button>
                </Stack>
              </Stack>
            )}
          </Stack>
        </Paper>


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
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Typography>{user.username}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
                        <IconButton
                          color="error"
                          aria-label={`Eliminar ${user.username}`}
                          onClick={() => setUserToDelete(user)}
                        >
                          <DeleteIcon />
                        </IconButton>
                        <Select
                          value={user.type}
                          onChange={(event) => handleChangeRole(user.id, event.target.value)}
                          size="small"
                          sx={{ minWidth: 160 }}
                        >
                          {ROLE_OPTIONS.map((role) => (
                            <MenuItem key={role} value={role}>
                              {role}
                            </MenuItem>
                          ))}
                        </Select>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button variant="contained">Guardar cambios</Button>
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
