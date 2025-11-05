import { useState } from "react";
import { Container, Paper, Stack, TextField, Typography, Button } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import StarSelect from "../components/StarSelect";

const marcas = ["Toyota", "Ford", "Nissan", "Volkswagen"];
const modelos = ["Hilux", "Ranger", "Frontier", "Amarok"];
const tracciones = ["4x2", "4x4", "AWD"];
const combustibles = ["Nafta", "Diésel", "Híbrido"];

function AddI() {
  const [form, setForm] = useState({
    marca: "",
    modelo: "",
    traccion: "",
    combustible: "",
  });

  function handleSelectChange(field) {
    return (value) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    };
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4, bgcolor: "background.default", mt: 2 }}>
        <Stack spacing={2.5}>
          <Typography variant="h4" component="h2">
            Agregar Nuevo
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Completa los campos necesarios para registrar un nuevo elemento en el sistema.
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
            <TextField fullWidth label="Descripción" placeholder="Descripción" multiline minRows={3} />
            <StarSelect
              label="Marca"
              placeholder="Marca"
              options={marcas}
              value={form.marca}
              onChange={handleSelectChange("marca")}
              helperText="Seleccioná la marca"
            />
            <StarSelect
              label="Modelo"
              placeholder="Modelo"
              options={modelos}
              value={form.modelo}
              onChange={handleSelectChange("modelo")}
            />
            <StarSelect
              label="Tracción"
              placeholder="Tracción"
              options={tracciones}
              value={form.traccion}
              onChange={handleSelectChange("traccion")}
              favoritesCount={2}
            />
            <StarSelect
              label="Combustible"
              placeholder="Combustible"
              options={combustibles}
              value={form.combustible}
              onChange={handleSelectChange("combustible")}
              favoritesCount={2}
            />
            <TextField fullWidth label="Cilindrada" placeholder="Cilindrada" />
            <TextField fullWidth label="Año" placeholder="Año" />
            <TextField fullWidth label="Costo" placeholder="Costo" />
            <TextField fullWidth label="Seguro" placeholder="Seguro" />
            <TextField fullWidth label="Flete" placeholder="Flete" />
            <TextField fullWidth label="Valor CIF" placeholder="Valor CIF" />
          </Stack>

          <Stack spacing={2} alignItems="stretch">
            <Button
              variant="contained"
              color="primary"
              startIcon={<PhotoCameraIcon />}
              sx={{ borderRadius: 3, py: 1.5 }}
            >
              Agregar Fotos
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddCircleIcon />}
              sx={{ borderRadius: "50%", alignSelf: "center", px: 6, py: 6 }}
            >
              Agregar
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}

export default AddI;
