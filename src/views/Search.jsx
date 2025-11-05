import { useState } from "react";
import { Container, Paper, Stack, TextField, Typography, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import StarSelect from "../components/StarSelect";

function Search() {
  const [filters, setFilters] = useState({
    marca: "",
    modelo: "",
    traccion: "",
    combustible: "",
  });

  const marcas = ["Toyota", "Ford", "Nissan", "Volkswagen"];
  const modelos = ["Hilux", "Ranger", "Frontier", "Amarok"];
  const tracciones = ["4x2", "4x4", "AWD"];
  const combustibles = ["Nafta", "Diésel", "Híbrido"];

  function handleSelectChange(field) {
    return (value) => {
      setFilters((prev) => ({ ...prev, [field]: value }));
    };
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4, bgcolor: "background.default", mt: 2 }}>
        <Stack spacing={2.5}>
          <Typography variant="h4" component="h2">
            Búsqueda
          </Typography>
          <Stack spacing={1.5}>
            <TextField fullWidth label="Código" placeholder="Código" />
            <TextField
              fullWidth
              label="Compatibilidad"
              placeholder="Compatibilidad"
              multiline
              minRows={3}
            />
            <StarSelect
              label="Marca"
              placeholder="Marca"
              options={marcas}
              value={filters.marca}
              onChange={handleSelectChange("marca")}
              helperText="Seleccioná la marca deseada"
            />
            <StarSelect
              label="Modelo"
              placeholder="Modelo"
              options={modelos}
              value={filters.modelo}
              onChange={handleSelectChange("modelo")}
              helperText="Filtrá por modelo"
            />
            <StarSelect
              label="Tracción"
              placeholder="Tracción"
              options={tracciones}
              value={filters.traccion}
              onChange={handleSelectChange("traccion")}
              favoritesCount={2}
            />
            <StarSelect
              label="Combustible"
              placeholder="Combustible"
              options={combustibles}
              value={filters.combustible}
              onChange={handleSelectChange("combustible")}
              favoritesCount={2}
            />
            <TextField fullWidth label="Cilindrada" placeholder="Cilindrada" />
            <TextField fullWidth label="Año" placeholder="Año" />
          </Stack>

          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="contained"
              color="success"
              startIcon={<SearchIcon />}
              sx={{ borderRadius: "50%", px: 6, py: 4 }}
            >
              Buscar
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<DeleteIcon />}
              sx={{ borderRadius: "50%", px: 4, py: 4 }}
            >
              Limpiar
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}

export default Search;
