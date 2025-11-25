import { useState } from "react";
import { Container, Paper, Stack, Typography, Button, Box, CircularProgress } from "@mui/material";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import Field from "./input/Field";
import { loginUser } from "../services/users";

function LoginPage({ onLogin, isAuthenticated }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await loginUser(username, password);
      onLogin();
      navigate(from, { replace: true });
    } catch (err) {
      const message = err?.response?.data?.message || "Usuario y/o contraseña incorrectos.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
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
            <Field
              label="Usuario"
              value={username}
              onChange={(newValue) => setUsername(newValue)}
              autoFocus
              fullWidth
              required
            />
            <Field
              label="Contraseña"
              type="password"
              value={password}
              onChange={(newValue) => setPassword(newValue)}
              fullWidth
              required
            />
            {error && (
              <Typography variant="body2" color="error">
                {error}
              </Typography>
            )}
            <Button type="submit" variant="contained" size="large" disabled={isLoading}>
              {isLoading ? (
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                  <CircularProgress size={20} />
                  <span>Iniciando Sesion</span>
                </Stack>
              ) : (
                "Entrar"
              )}
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}

export default LoginPage;
