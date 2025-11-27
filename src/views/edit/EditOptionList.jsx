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
  TextField,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSchemas } from "../../contexts/SchemaContext";
import { updateSchemaOptions } from "../../services/schemas";
import ModalDeleteOption from "../../components/ModalDeleteOption";
import ModalOptionExists from "../../components/ModalOptionExists";

function OptionEditor({ value: initialValue = "", onChange, onSave, onCancel, autoFocus }) {
  const [value, setValue] = useState(initialValue || "");

  useEffect(() => {
    setValue(initialValue || "");
  }, [initialValue]);

  const handleChange = (event) => {
    const nextValue = event.target.value;
    setValue(nextValue);
    onChange?.(nextValue);
  };

  const handleSave = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSave?.(trimmed);
  };

  return (
    <Stack spacing={1} sx={{ mt: 1 }}>
      <TextField
        fullWidth
        size="xlarge"
        label="Nombre de la opción"
        value={value}
        onChange={handleChange}
        autoFocus={autoFocus}
      />
      <Stack direction="row" spacing={1}>
        <Button variant="contained" size="xlarge" onClick={handleSave} disabled={!value.trim()}>
          Guardar
        </Button>
        <Button variant="text" size="xlarge" onClick={onCancel}>
          Cancelar
        </Button>
      </Stack>
    </Stack>
  );
}

function EditOptionList() {
  const { optionId } = useParams();
  const navigate = useNavigate();
  const { schema, isSchemaLoading, refreshSchemas } = useSchemas();
  const [showNewEditor, setShowNewEditor] = useState(false);
  const [editingOption, setEditingOption] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [deletingOption, setDeletingOption] = useState(null);
  const [optionsState, setOptionsState] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);

  const optionField = useMemo(
    () => schema.find((field) => field?.type === "option" && field?.id === optionId),
    [schema, optionId],
  );

  useEffect(() => {
    setOptionsState(optionField?.options ?? []);
  }, [optionField]);

  const options = optionsState;
  const title = optionField?.label || optionField?.name || "Opciones";
  const normalizeLabel = (opt) => opt?.label || opt?.name || opt?.value || "";

  const sortedOptions = useMemo(
    () =>
      [...options].sort((a, b) => {
        const aFav = Boolean(a?.fav);
        const bFav = Boolean(b?.fav);
        if (aFav !== bFav) {
          return aFav ? -1 : 1;
        }
        return normalizeLabel(a).localeCompare(normalizeLabel(b), "es", { sensitivity: "base" });
      }),
    [options],
  );

  const persistOptions = async (updatedOptions) => {
    setIsSaving(true);
    const previous = optionsState;
    setOptionsState(updatedOptions);
    try {
      const data = await updateSchemaOptions(optionId, updatedOptions);
      const next =
        Array.isArray(data) && data.length > 0
          ? data
          : Array.isArray(data?.options)
            ? data.options
            : Array.isArray(data?.schema)
              ? data.schema
              : updatedOptions;
      setOptionsState(next);
      refreshSchemas?.();
    } catch (error) {
      console.error("Error al actualizar opciones", error);
      setOptionsState(previous);
    } finally {
      setIsSaving(false);
    }
  };

  const optionExists = (value, excludeKey = null) => {
    const normalizedValue = value.trim().toLowerCase();
    return optionsState.some((opt) => {
      const key = opt?.value || opt?.name || opt?.label;
      if (excludeKey && key === excludeKey) return false;
      const normalizedOption = normalizeLabel(opt).trim().toLowerCase();
      return normalizedOption === normalizedValue;
    });
  };

  const handleCloseDuplicateModal = () => {
    setShowDuplicateModal(false);
  };

  const handleStartNew = () => {
    setShowNewEditor(true);
    setEditingOption(null);
    setEditingValue("");
  };

  const handleSaveNew = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (optionExists(trimmed)) {
      setShowDuplicateModal(true);
      return;
    }
    const newOption = { label: trimmed, name: trimmed, value: trimmed, fav: false };
    const updated = [...optionsState, newOption];
    persistOptions(updated);
    setShowNewEditor(false);
  };

  const handleEdit = (key, currentLabel) => {
    setEditingOption(key);
    setEditingValue(currentLabel || "");
    setShowNewEditor(false);
  };

  const handleSaveEdit = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (optionExists(trimmed, editingOption)) {
      setShowDuplicateModal(true);
      return;
    }
    const updated = optionsState.map((opt) => {
      const key = opt?.value || opt?.name || opt?.label;
      if (key !== editingOption) return opt;
      return { ...opt, label: trimmed, name: trimmed, value: opt?.value || trimmed };
    });
    persistOptions(updated);
    setEditingOption(null);
    setEditingValue("");
  };

  const handleCancelEdit = () => {
    setEditingOption(null);
    setEditingValue("");
  };

  const handleCancelNew = () => {
    setShowNewEditor(false);
  };

  const handleAskDelete = (key, label) => {
    setDeletingOption(key ? { key, label } : null);
  };

  const handleConfirmDelete = () => {
    if (!deletingOption?.key) {
      setDeletingOption(null);
      return;
    }

    const updated = optionsState.filter((opt) => {
      const key = opt?.value || opt?.name || opt?.label;
      return key !== deletingOption.key;
    });
    persistOptions(updated);
    setDeletingOption(null);
  };

  const handleCancelDelete = () => {
    setDeletingOption(null);
  };

  if (isSchemaLoading) {
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

          <Button
            variant="contained"
            color="primary"
            sx={{ borderRadius: 3, py: 1.5 }}
            onClick={handleStartNew}
          >
            Agregar nueva opción
          </Button>
          {showNewEditor && (
            <OptionEditor
              autoFocus
              value=""
              onChange={() => {}}
              onSave={handleSaveNew}
              onCancel={handleCancelNew}
            />
          )}

          <Stack spacing={2}>
            {sortedOptions.map((option, index) => {
              const label = option?.label || option?.name || "";
              const isFavorite = Boolean(option?.fav);
              const optionKey = option?.value || option?.name || option?.label || index;
              const isEditing = editingOption === optionKey;
              return (
                <Paper
                  key={optionKey}
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
                    <IconButton
                      color="warning"
                      size="small"
                      disabled={isSaving}
                      onClick={() => {
                        const updated = optionsState.map((opt) => {
                          const key = opt?.value || opt?.name || opt?.label;
                          if (key !== optionKey) return opt;
                          return { ...opt, fav: !opt?.fav };
                        });
                        persistOptions(updated);
                      }}
                    >
                      {isFavorite ? <StarIcon /> : <StarBorderIcon />}
                    </IconButton>
                    <IconButton
                      color="primary"
                      size="small"
                      disabled={isSaving}
                      onClick={() => handleEdit(optionKey, label)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="default"
                      size="small"
                      disabled={isSaving}
                      onClick={() => handleAskDelete(optionKey, label || optionKey)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  {isEditing && (
                    <OptionEditor
                      value={editingValue}
                      onChange={setEditingValue}
                      onSave={handleSaveEdit}
                      onCancel={handleCancelEdit}
                      autoFocus
                    />
                  )}
                </Paper>
              );
            })}
          </Stack>
          <ModalDeleteOption
            open={Boolean(deletingOption)}
            optionValue={deletingOption?.label || deletingOption?.key}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
          <ModalOptionExists open={showDuplicateModal} onClose={handleCloseDuplicateModal} />
        </Stack>
      </Paper>
    </Container>
  );
}

export default EditOptionList;
