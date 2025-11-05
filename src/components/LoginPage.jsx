import { useState } from "react";
import { Container, Paper, Stack, TextField, Typography, Button, Box } from "@mui/material";
import { useNavigate, useLocation, Navigate } from "react-router-dom";

function LoginPage({ onLogin, isAuthenticated }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  function handleSubmit(event) {
    event.preventDefault();
    onLogin({ username, password });
    navigate(from, { replace: true });
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "70vh" }}>
      <Container maxWidth="xs">
        <Paper elevation={6} sx={{ p: 4 }}>
          <Stack component="form" spacing={3} onSubmit={handleSubmit}>
            <Stack spacing={1}>
              <Typography variant="h4" align="center">
                Iniciar sesión
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Por ahora aceptamos cualquier combinación de usuario y contraseña.
              </Typography>
            </Stack>
            <TextField
              label="Usuario"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoFocus
              fullWidth
              required
            />
            <TextField
              label="Contraseña"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              fullWidth
              required
            />
            <Button type="submit" variant="contained" size="large">
              Entrar
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}

export default LoginPage;
