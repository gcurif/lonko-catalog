import { Container, Paper, Stack, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Logout({ onLogout }) {
  const navigate = useNavigate();

  function handleLogout() {
    onLogout();
    navigate("/login", { replace: true });
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4 }}>
        <Stack spacing={3} alignItems="center">
          <Typography variant="h4" component="h2">
            Cerrar Sesión
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center">
            Cuando confirmes, cerraremos tu sesión y volverás a la pantalla de inicio.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Volver
            </Button>
            <Button variant="contained" color="error" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}

export default Logout;
