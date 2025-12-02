import { useEffect, useMemo, useState } from "react";
import { Box, Button, MenuItem, Select, Stack, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Field from "../input/Field";

function UserForm({
  title,
  roleOptions = [],
  initialData,
  onSave,
  onCancel,
  isSaving = false,
  requirePassword = true,
}) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    repeatPassword: "",
    type: roleOptions?.[0]?.value || "",
  });

  useEffect(() => {
    if (initialData) {
      const role = Array.isArray(initialData.roles)
        ? initialData.roles[0]
        : initialData.role || roleOptions?.[0]?.value || "";
      setFormData({
        username: initialData.username || "",
        password: "",
        repeatPassword: "",
        type: role,
      });
    } else {
      setFormData({
        username: "",
        password: "",
        repeatPassword: "",
        type: roleOptions?.[0]?.value || "",
      });
    }
  }, [initialData, roleOptions]);

  const passwordsMatch = formData.password === formData.repeatPassword;

  const isValid = useMemo(() => {
    if (!formData.username.trim()) return false;
    if (!requirePassword && !formData.password && !formData.repeatPassword) return true;
    return formData.password.trim() !== "" && passwordsMatch;
  }, [formData, requirePassword, passwordsMatch]);

  const handleSubmit = () => {
    if (!isValid) return;
    const payload = {
      username: formData.username.trim(),
      roles: [formData.type],
    };
    if (formData.password) {
      payload.password = formData.password;
    }
    onSave?.(payload);
  };

  return (
    <Stack spacing={2}>
      {title && (
        <Typography variant="h6" component="h2">
          {title}
        </Typography>
      )}

      <Field
        label="Nombre de usuario"
        placeholder="Ingresa el usuario"
        value={formData.username}
        onChange={(value) => setFormData((prev) => ({ ...prev, username: value }))}
        fullWidth
      />
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Field
          label="Contraseña"
          type="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={(value) => setFormData((prev) => ({ ...prev, password: value }))}
          fullWidth
        />
        <Field
          label="Repetir contraseña"
          type="password"
          placeholder="Repite la contraseña"
          value={formData.repeatPassword}
          onChange={(value) => setFormData((prev) => ({ ...prev, repeatPassword: value }))}
          fullWidth
        />
      </Stack>
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
          Tipo
        </Typography>
        <Select
          fullWidth
          value={formData.type}
          onChange={(event) => setFormData((prev) => ({ ...prev, type: event.target.value }))}
        >
          {roleOptions.map((role) => (
            <MenuItem key={role.value} value={role.value}>
              {role.label}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Stack direction="row" justifyContent="flex-end" spacing={1}>
        <Button variant="outlined" onClick={onCancel} disabled={isSaving}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!isValid || isSaving}>
          {isSaving ? (
            <Stack direction="row" spacing={1} alignItems="center">
              <CircularProgress size={16} />
              Guardando
            </Stack>
          ) : (
            "Guardar usuario"
          )}
        </Button>
      </Stack>
    </Stack>
  );
}

export default UserForm;
