import { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { HashRouter, Routes, Route, useNavigate, Navigate, useLocation } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ViewSelector from "./components/ViewSelector";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./components/LoginPage";
import Search from "./views/search/Search";
import Add from "./views/add/Add";
import EditOptionsOverview from "./views/edit/EditOptionsOverview";
import EditOptionList from "./views/edit/EditOptionList";
import Logout from "./views/Logout";
import Gallery from "./views/search/Gallery";
import env from "./config/env";
import { SchemaProvider } from "./contexts/SchemaContext";

const VIEW_ROUTES = [
  { path: "/search", title: "Búsqueda", Component: Search },
  { path: "/add", title: "Agregar Nuevo", Component: Add },
  { path: "/editarwea", title: "Editar Opciones", Component: EditOptionsOverview },
  { path: "/logout", title: "Cerrar Sesión", Component: Logout },
];

function AppShell({ routes, isAuthenticated, onLogout, onLogin }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isLoginRoute = location.pathname === "/login";
  const canGoBack = location.pathname !== "/" && !isLoginRoute;

  function renderRoute(route) {
    if (route.path === "/logout") {
      return <route.Component onLogout={onLogout} />;
    }

    return <route.Component />;
  }

  return (
    <>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div">
            Lonko Multi
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {isAuthenticated && (
            <Button
              color="inherit"
              onClick={() => {
                onLogout();
                navigate("/login", { replace: true });
              }}
            >
              Cerrar sesión
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ py: 4 }}>
        {!isLoginRoute && (
          <Container maxWidth="lg" sx={{ mb: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              {canGoBack && (
                <>
                  <IconButton
                    aria-label="Volver"
                    onClick={() => navigate(-1)}
                    sx={{ display: { xs: "inline-flex", sm: "none" } }}
                  >
                    <ArrowBackIcon />
                  </IconButton>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(-1)}
                    sx={{ display: { xs: "none", sm: "inline-flex" } }}
                  >
                    Atrás
                  </Button>
                </>
              )}
              <Typography variant="subtitle2" color="text.secondary">
                {location.pathname === "/" ? "Seleccioná una vista" : `Ruta actual: ${location.pathname}`}
              </Typography>
            </Stack>
          </Container>
        )}

        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <SchemaProvider>
                  <Container maxWidth="md">
                    <ViewSelector routes={routes} onNavigate={(path) => navigate(path)} />
                  </Container>
                </SchemaProvider>
              </ProtectedRoute>
            }
          />

          <Route
            path="/*"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <SchemaProvider>
                  <Routes>
                    {routes.map((route) => (
                      <Route key={route.path} path={route.path.slice(1)} element={renderRoute(route)} />
                    ))}

                    <Route path="editarwea/:optionId" element={<EditOptionList />} />
                    <Route path="gallery" element={<Gallery />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </SchemaProvider>
              </ProtectedRoute>
            }
          />

          <Route
            path="/login"
            element={<LoginPage onLogin={onLogin} isAuthenticated={isAuthenticated} />}
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (env.apiUrl) {
      console.info(`Usando API_URL: ${env.apiUrl}`);
    }
  }, []);

  function handleLogin() {
    setIsAuthenticated(true);
  }

  function handleLogout() {
    setIsAuthenticated(false);
  }

  //console.log('env url', process.env.API_URL);
  return (
    <HashRouter>
      <AppShell
        routes={VIEW_ROUTES}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        onLogin={handleLogin}
      />
    </HashRouter>
  );
}

export default App;
