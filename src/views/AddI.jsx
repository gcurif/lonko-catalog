import { useState } from "react";
import { Container, Paper, Stack, Typography, Button } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import FieldSelect from "../components/input/FieldSelect";
import Field from "../components/input/Field";

const marcas = [
  { label: "Toyota", value: "Toyota", fav: true },
  { label: "Ford", value: "Ford", fav: true },
  { label: "Nissan", value: "Nissan", fav: true },
  { label: "Volkswagen", value: "Volkswagen", fav: false },
];
const modelos = [
  { label: "Hilux", value: "Hilux", fav: true },
  { label: "Ranger", value: "Ranger", fav: true },
  { label: "Frontier", value: "Frontier", fav: true },
  { label: "Amarok", value: "Amarok", fav: false },
];
const tracciones = [
  { label: "4x2", value: "4x2", fav: true },
  { label: "4x4", value: "4x4", fav: true },
  { label: "AWD", value: "AWD", fav: false },
];
const combustibles = [
  { label: "Nafta", value: "Nafta", fav: true },
  { label: "Diésel", value: "Diésel", fav: true },
  { label: "Híbrido", value: "Híbrido", fav: false },
];

function AddI() {
  const [form, setForm] = useState({
    codigo: "",
    compatibilidad: "",
    descripcion: "",
    marca: "",
    modelo: "",
    traccion: "",
    combustible: "",
    cilindrada: "",
    anio: "",
    costo: "",
    seguro: "",
    flete: "",
    valorCif: "",
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
            <Field
              fullWidth
              label="Código"
              placeholder="Código"
              value={form.codigo}
              onChange={handleSelectChange("codigo")}
            />
            <Field
              fullWidth
              label="Compatibilidad"
              placeholder="Compatibilidad"
              multiline
              minRows={3}
              value={form.compatibilidad}
              onChange={handleSelectChange("compatibilidad")}
            />
            <Field
              fullWidth
              label="Descripción"
              placeholder="Descripción"
              multiline
              minRows={3}
              value={form.descripcion}
              onChange={handleSelectChange("descripcion")}
            />
            <FieldSelect
              label="Marca"
              placeholder="Marca"
              options={marcas}
              value={form.marca}
              onChange={handleSelectChange("marca")}
              helperText="Seleccioná la marca"
            />
            <FieldSelect
              label="Modelo"
              placeholder="Modelo"
              options={modelos}
              value={form.modelo}
              onChange={handleSelectChange("modelo")}
            />
            <FieldSelect
              label="Tracción"
              placeholder="Tracción"
              options={tracciones}
              value={form.traccion}
              onChange={handleSelectChange("traccion")}
            />
            <FieldSelect
              label="Combustible"
              placeholder="Combustible"
              options={combustibles}
              value={form.combustible}
              onChange={handleSelectChange("combustible")}
            />
            <Field
              fullWidth
              label="Cilindrada"
              placeholder="Cilindrada"
              type="number"
              value={form.cilindrada}
              onChange={handleSelectChange("cilindrada")}
            />
            <Field
              fullWidth
              label="Año"
              placeholder="Año"
              type="number"
              value={form.anio}
              onChange={handleSelectChange("anio")}
            />
            <Field
              fullWidth
              label="Costo"
              placeholder="Costo"
              type="number"
              value={form.costo}
              onChange={handleSelectChange("costo")}
            />
            <Field
              fullWidth
              label="Seguro"
              placeholder="Seguro"
              type="number"
              value={form.seguro}
              onChange={handleSelectChange("seguro")}
            />
            <Field
              fullWidth
              label="Flete"
              placeholder="Flete"
              type="number"
              value={form.flete}
              onChange={handleSelectChange("flete")}
            />
            <Field
              fullWidth
              label="Valor CIF"
              placeholder="Valor CIF"
              type="number"
              value={form.valorCif}
              onChange={handleSelectChange("valorCif")}
            />
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
