import { Button, Grid, Stack, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditNoteIcon from "@mui/icons-material/EditNote";
import SwitchAccountIcon from "@mui/icons-material/SwitchAccount";

const ICONS = {
  "/search": <SearchIcon />,
  "/add": <AddIcon />,
  "/edit": <EditNoteIcon />,
  "/logout": <SwitchAccountIcon />,
};

function ViewSelector({ routes, onNavigate }) {
  return (
    <Stack spacing={3} alignItems="center">
      <Typography variant="h4" component="h1" align="center">
        Seleccioná una vista
      </Typography>
      <Typography variant="body1" color="text.secondary" align="center" maxWidth={520}>
        Cada opción abre una pantalla distinta para que puedas trabajar con los flujos reales de la
        app.
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {routes.map((route) => (
          <Grid item key={route.path} xs={12} sm={6} md={4}>
            <Button
              fullWidth
              size="large"
              variant="contained"
              onClick={() => onNavigate(route.path)}
              startIcon={ICONS[route.path]}
              sx={{ py: 2.5 }}
            >
              {route.title}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}

export default ViewSelector;
