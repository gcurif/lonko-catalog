import { useMemo } from "react";
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
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const OPTIONS_BY_GROUP = {
  marca: [
    "Aisin",
    "Alfa Romeo",
    "BMW",
    "Citroën",
    "Fiat",
    "Ford",
    "General Motors",
    "Honda",
    "Hyundai",
    "Mazda",
  ],
  modelo: ["Hilux", "Ranger", "Frontier", "Amarok", "Bronco"],
  traccion: ["4x2", "4x4", "AWD"],
  combustible: ["Nafta", "Diésel", "Híbrido", "Eléctrico"],
};

const LABELS = {
  marca: "Marca",
  modelo: "Modelo",
  traccion: "Tracción",
  combustible: "Combustible",
};

function EditOptionList() {
  const { optionId } = useParams();
  const navigate = useNavigate();

  const options = OPTIONS_BY_GROUP[optionId] ?? [];
  const title = LABELS[optionId] ?? "Opciones";

  const sortedOptions = useMemo(
    () => [...options].sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" })),
    [options],
  );

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
              const isFavorite = index < 3;
              return (
                <Paper
                  key={option}
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
                  <Typography variant="subtitle1">{option}</Typography>
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
