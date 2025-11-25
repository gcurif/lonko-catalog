import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Paper,
  Stack,
  Typography,
  IconButton,
  Box,
  Button,
  Chip,
  CircularProgress,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { listSchemas } from "../../services/schemas";

function EditOptionList() {
  const { optionId } = useParams();
  const navigate = useNavigate();
  const [schema, setSchema] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadSchema() {
      setIsLoading(true);
      try {
        const data = await listSchemas();
        const parsed = Array.isArray(data) ? data : data?.schema ?? [];
        setSchema(parsed);
      } catch (error) {
        console.error("Error al cargar las opciones del esquema", error);
        setSchema([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadSchema();
  }, []);

  const optionField = useMemo(
    () => schema.find((field) => field?.type === "option" && field?.name === optionId),
    [schema, optionId],
  );

  const options = optionField?.options ?? [];
  const title = optionField?.label || optionField?.name || "Opciones";

  const sortedOptions = useMemo(
    () =>
      [...options].sort((a, b) =>
        (a?.label || a?.name || "").localeCompare(b?.label || b?.name || "", "es", {
          sensitivity: "base",
        }),
      ),
    [options],
  );

  if (isLoading) {
    return (
      <Container maxWidth="sm" sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!optionField) {
    return (
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 4, bgcolor: "background.default", mt: 2 }}>
          <Stack spacing={2}>
            <Typography variant="h5">No encontramos este grupo de opciones</Typography>
            <Typography variant="body2" color="text.secondary">
              Revisa que el esquema esté configurado y vuelve a intentar.
            </Typography>
            <Button variant="contained" onClick={() => navigate(-1)}>
              Volver
            </Button>
          </Stack>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4, bgcolor: "background.default", mt: 2 }}>
        <Stack spacing={3}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" component="h2">
              Lista de opciones disponibles para {title}
            </Typography>
            <Chip
              label={title}
              color="primary"
              variant="outlined"
              sx={{ textTransform: "capitalize" }}
            />
          </Stack>

          <Stack spacing={2}>
            {sortedOptions.map((option, index) => {
              const label = option?.label || option?.name || "";
              const isFavorite = Boolean(option?.fav);
              return (
                <Paper
                  key={label || index}
                  elevation={1}
                  sx={{
                    px: 2,
                    py: 1.5,
                    borderRadius: 3,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  <Typography variant="subtitle1">{label || "Sin etiqueta"}</Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton color="warning" size="small">
                      {isFavorite ? <StarIcon /> : <StarBorderIcon />}
                    </IconButton>
                    <IconButton color="primary" size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton color="default" size="small">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Paper>
              );
            })}
          </Stack>

          <Button
            variant="contained"
            color="primary"
            sx={{ borderRadius: 3, py: 1.5 }}
            onClick={() => navigate(`/editarwea/${optionId}/nuevo`)}
          >
            Agregar nueva opción
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}

export default EditOptionList;
