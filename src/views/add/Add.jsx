import { useEffect, useMemo, useState } from "react";
import { Container, Paper, Stack, Typography, Button, CircularProgress, Alert, IconButton } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CloseIcon from "@mui/icons-material/Close";
import FieldSelect from "../../components/input/FieldSelect";
import Field from "../../components/input/Field";
import { useSchemas } from "../../contexts/SchemaContext";
import { createItem, uploadItemImages } from "../../services/items";

function Add() {
  const { schema, isSchemaLoading } = useSchemas();
  const [mainCode, setMainCode] = useState("");
  const [form, setForm] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [errors, setErrors] = useState({});
  const [selectedImages, setSelectedImages] = useState([]);
  const sortedSchema = useMemo(() => {
    if (!Array.isArray(schema)) return [];
    return [...schema].sort(
      (a, b) => (a?.orderToShow ?? Number.MAX_SAFE_INTEGER) - (b?.orderToShow ?? Number.MAX_SAFE_INTEGER),
    );
  }, [schema]);

  useEffect(() => {
    if (!Array.isArray(sortedSchema)) return;

    setForm((prev) => {
      const next = { ...prev };
      sortedSchema.forEach((field) => {
        const key = field?.name || field?.label;
        if (key && !(key in next)) {
          next[key] = "";
        }
      });
      return next;
    });
  }, [sortedSchema]);

  function handleSelectChange(field) {
    return (value) => {
      setSubmitError("");
      setSubmitSuccess("");
      setErrors((prev) => ({ ...prev, [field]: "" }));
      setForm((prev) => ({ ...prev, [field]: value }));
    };
  }

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
          error={Boolean(errors[key])}
          helperText={errors[key]}
          required
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
        error={Boolean(errors[key])}
        helperText={errors[key]}
        required
      />
    );
  }

  function handleReset({ keepStatus = false } = {}) {
    const emptyForm = sortedSchema.reduce((acc, field) => {
      const key = field?.name || field?.label;
      if (key) {
        acc[key] = "";
      }
      return acc;
    }, {});
    setForm(emptyForm);
    setMainCode("");
    setSubmitError("");
    if (!keepStatus) {
      setSubmitSuccess("");
    }
    setErrors({});
    setSelectedImages([]);
  }

  const getValueByCandidates = (candidates = []) => {
    const entry = Object.entries(form || {}).find(([key]) => candidates.includes(String(key).toLowerCase()));
    return entry ? entry[1] : "";
  };

  const buildPayload = () => {
    const trimmedCode = String(mainCode || "").trim();

    const propertiesPayload = sortedSchema.reduce((acc, field) => {
      const key = field?.name || field?.label;
      if (key) {
        acc[key] = form[key] ?? "";
      }
      return acc;
    }, {});

    const nameValue =
      getValueByCandidates(["descripcion", "descripción"]) ||
      propertiesPayload?.name ||
      propertiesPayload?.Nombre ||
      propertiesPayload?.["Descripción"] ||
      "";

    return {
      name: nameValue || trimmedCode || "Nuevo ítem",
      code: trimmedCode,
      imgs: [],
      properties: propertiesPayload,
    };
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!mainCode || String(mainCode).trim() === "") {
      nextErrors.mainCode = "Este campo es obligatorio.";
    }

    sortedSchema.forEach((field) => {
      const key = field?.name || field?.label;
      if (!key) return;
      const value = form[key];
      const isStringEmpty = typeof value === "string" && value.trim() === "";
      const isEmpty = value === "" || value === null || value === undefined || isStringEmpty;
      if (isEmpty) {
        nextErrors[key] = "Este campo es obligatorio.";
      }
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  async function handleSubmit() {
    setSubmitError("");
    setSubmitSuccess("");
    const isValid = validateForm();
    if (!isValid) return;
    const payload = buildPayload();
    setIsSubmitting(true);

    try {
      const created = await createItem(payload);
      const createdId = created?.id;
      if (createdId && selectedImages.length > 0) {
        try {
          await uploadItemImages(createdId, selectedImages);
        } catch (uploadError) {
          console.error("Error al subir imágenes", uploadError);
        }
      }
      handleReset({ keepStatus: true });
      setSubmitSuccess("Elemento creado correctamente.");
    } catch (error) {
      console.error("Error al crear el elemento", error);
      setSubmitError("No se pudo crear el elemento. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
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
            <Field
              key="code"
              fullWidth
              label="Código Unico"
              placeholder="Código Unico"
              type="text"
              value={mainCode}
              onChange={(value) => {
                setMainCode(value);
                setErrors((prev) => ({ ...prev, mainCode: "" }));
                setSubmitError("");
                setSubmitSuccess("");
              }}
              error={Boolean(errors.mainCode)}
              helperText={errors.mainCode}
              required
            />
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
              component="label"
              startIcon={<UploadFileIcon />}
              sx={{ borderRadius: 3, py: 1.5 }}
            >
              Agregar Fotos
              <input
                hidden
                type="file"
                accept="image/*"
                multiple
                onChange={(event) => {
                  setSubmitError("");
                  setSubmitSuccess("");
                  const files = Array.from(event.target.files || []);
                  const imageFiles = files.filter((file) => file.type?.startsWith("image/"));
                  if (imageFiles.length > 0) {
                    setSelectedImages((prev) => [...prev, ...imageFiles]);
                  }
                  event.target.value = "";
                }}
              />
            </Button>
            {selectedImages.length > 0 && (
              <Stack spacing={1} sx={{ mt: -0.5 }}>
                {selectedImages.map((file, index) => (
                  <Stack
                    key={`${file.name}-${file.lastModified}-${index}`}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ px: 2, py: 1, bgcolor: "background.paper", borderRadius: 2, border: 1, borderColor: "divider" }}
                  >
                    <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
                      {file.name}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() =>
                        setSelectedImages((prev) => prev.filter((_, idx) => idx !== index))
                      }
                      aria-label={`Eliminar ${file.name}`}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                ))}
              </Stack>
            )}
            <Button
              variant="contained"
              color="primary"
              startIcon={
                isSubmitting ? <CircularProgress size={20} color="inherit" /> : <AddCircleIcon />
              }
              sx={{ borderRadius: "50%", alignSelf: "center", px: 6, py: 6 }}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Agregando..." : "Agregar"}
            </Button>
            <Button variant="text" color="inherit" onClick={handleReset} sx={{ alignSelf: "center" }}>
              Limpiar campos
            </Button>
            {submitSuccess && (
              <Alert severity="success" sx={{ borderRadius: 3 }}>
                {submitSuccess}
              </Alert>
            )}
            {submitError && (
              <Alert severity="error" sx={{ borderRadius: 3 }}>
                {submitError}
              </Alert>
            )}
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}

export default Add;
