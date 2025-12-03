import { useEffect } from "react";
import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
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
import Users from "./views/users/Users";
import Registro from "./views/registro/Registro";
import env from "./config/env";
import { SchemaProvider } from "./contexts/SchemaContext";
import { UserProvider, useUser } from "./contexts/UserContext";
import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";

const VIEW_ROUTES = [
  { path: "/search", title: "Busqueda", Component: Search },
  { path: "/add", title: "Agregar Nuevo", Component: Add, requiresAdmin: true },
  { path: "/editar", title: "Editar Opciones", Component: EditOptionsOverview, requiresAdmin: true },
  { path: "/users", title: "Usuarios", Component: Users, requiresAdmin: true },
  { path: "/registro", title: "Registro", Component: Registro },
  { path: "/logout", title: "Cerrar Sesión", Component: Logout },
];

function AppShell({ routes }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useUser();

  const isLoginRoute = location.pathname === "/login";
  const canGoBack = location.pathname !== "/" && !isLoginRoute;
  const isAdmin = user?.roles?.includes("ADMIN");
  const allowedRoutes = routes.filter((route) => !route.requiresAdmin || isAdmin);

  function renderRoute(route) {
    if (route.path === "/logout") {
      return <route.Component onLogout={logout} />;
    }

    if (route.requiresAdmin && !isAdmin) {
      return <Navigate to="/" replace />;
    }

    return <route.Component />;
  }

  return (
    <>
      <AppBar position="fixed" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div">
            Motorama v1.0.2
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {isAuthenticated && canGoBack && (
            <>
              <Button
                variant="contained"
                onClick={() => {
                  navigate("/", { replace: true });
                }}
                style={{ BorderColor: 'white', borderWidth: 2 }}
              >
                <ArrowBackIcon />
                Volver Atrás
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  navigate("/", { replace: true });
                }}
                style={{ BorderColor: 'white', borderWidth: 2 }}
                sx={{ marginLeft: '1em' }}
              >Menu Principal</Button>
            </>
          )
          }
          <Box sx={{ flexGrow: 1 }} />
          {isAuthenticated && (
            <Button
              color="inherit"
              onClick={() => {
                logout();
                navigate("/login", { replace: true });
              }}
            >
              Cerrar Sesión
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Toolbar />

      <Box component="main" sx={{ py: 4 }}>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <SchemaProvider>
                  <Container maxWidth="md">
                    <ViewSelector routes={allowedRoutes} onNavigate={(path) => navigate(path)} />
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
                    {allowedRoutes.map((route) => (
                      <Route key={route.path} path={route.path.slice(1)} element={renderRoute(route)} />
                    ))}
                    <Route
                      path="editar/:optionId"
                      element={isAdmin ? <EditOptionList /> : <Navigate to="/" replace />}
                    />
                    <Route path="gallery" element={<Gallery />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </SchemaProvider>
              </ProtectedRoute>
            }
          />

          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </>
  );
}

function App() {
  useEffect(() => {
    if (env.apiUrl) {
      console.info(`Usando API_URL: ${env.apiUrl}`);
    }
  }, []);

  useEffect(() => {
    const runUpdate = async () => {
      if (typeof window === "undefined") return;
      // Tauri v2 expone __TAURI_INTERNALS__ en lugar de __TAURI__, así que validamos ambos.
      const isTauri = window.__TAURI_INTERNALS__ || window.__TAURI__;
      if (!isTauri) return;
      try {
        console.info("Buscando actualizaciones...");
        const update = await check();
        console.info("Resultado updater:", update);
        if (update?.available) {
          console.info("Actualización disponible, descargando...");
          await update.downloadAndInstall();
          console.info("Actualización instalada, relanzando app.");
          await relaunch();
        } else {
          console.info("No hay actualizaciones disponibles.");
        }
      } catch (error) {
        console.error("Updater error", error);
      }
    };

    runUpdate();
  }, []);

  return (
    <UserProvider>
      <HashRouter>
        <AppShell routes={VIEW_ROUTES} />
      </HashRouter>
    </UserProvider>
  );
}

export default App;

