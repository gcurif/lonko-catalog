import { useEffect, useMemo, useState } from "react";
import { Container, Paper, Stack, Typography, Button, CircularProgress } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import FieldSelect from "../../components/input/FieldSelect";
import Field from "../../components/input/Field";
import { listSchemas } from "../../services/schemas";

function Add() {
  const [schema, setSchema] = useState([]);
  const [form, setForm] = useState({});
  const [isSchemaLoading, setIsSchemaLoading] = useState(false);

  function handleSelectChange(field) {
    return (value) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    };
  }

  useEffect(() => {
    async function loadSchema() {
      setIsSchemaLoading(true);
      try {
        const data = await listSchemas();
        const parsedSchema = Array.isArray(data) ? data : data?.schema ?? [];
        setSchema(parsedSchema);
      } catch (error) {
        console.error("Error al cargar el esquema de alta", error);
        setSchema([]);
      } finally {
        setIsSchemaLoading(false);
      }
    }

    loadSchema();
  }, []);

  useEffect(() => {
    if (!Array.isArray(schema)) return;

    setForm((prev) => {
      const next = { ...prev };
      schema.forEach((field) => {
        const key = field?.name || field?.label;
        if (key && !(key in next)) {
          next[key] = "";
        }
      });
      return next;
    });
  }, [schema]);

  const sortedSchema = useMemo(() => {
    if (!Array.isArray(schema)) return [];
    return [...schema].sort(
      (a, b) => (a?.orderToShow ?? Number.MAX_SAFE_INTEGER) - (b?.orderToShow ?? Number.MAX_SAFE_INTEGER),
    );
  }, [schema]);

  function renderField(field, index) {
    const { type, name, label, options = [] } = field || {};
    const key = name || `campo-${index}`;
    const fieldLabel = label || name || `Campo ${index + 1}`;

    if (type === "option") {
      const parsedOptions = options.map((opt) => ({
        label: opt?.name ?? opt?.label ?? "",
        value: opt?.value ?? opt?.name ?? "",
        fav: Boolean(opt?.fav),
      }));

      return (
        <FieldSelect
          key={key}
          label={fieldLabel}
          placeholder={fieldLabel}
          options={parsedOptions}
          value={form[key] || ""}
          onChange={handleSelectChange(key)}
        />
      );
    }

    const isTextArea = type === "textlg";
    const isNumber = type === "number";

    return (
      <Field
        key={key}
        fullWidth
        label={fieldLabel}
        placeholder={fieldLabel}
        type={isNumber ? "number" : "text"}
        value={form[key] || ""}
        onChange={handleSelectChange(key)}
        multiline={isTextArea}
        minRows={isTextArea ? 3 : undefined}
      />
    );
  }

  function handleReset() {
    const emptyForm = sortedSchema.reduce((acc, field) => {
      const key = field?.name || field?.label;
      if (key) {
        acc[key] = "";
      }
      return acc;
    }, {});
    setForm(emptyForm);
  }

  function handleSubmit() {
    console.info("Formulario listo para enviar", form);
  }

  if (isSchemaLoading) {
    return (
      <Container
        maxWidth="sm"
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}
      >
        <CircularProgress />
      </Container>
    );
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
            {sortedSchema.length > 0 ? (
              sortedSchema.map((field, index) => renderField(field, index))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No hay campos configurados en el esquema para agregar un nuevo elemento.
              </Typography>
            )}
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
              onClick={handleSubmit}
            >
              Agregar
            </Button>
            <Button variant="text" color="inherit" onClick={handleReset} sx={{ alignSelf: "center" }}>
              Limpiar campos
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}

export default Add;
