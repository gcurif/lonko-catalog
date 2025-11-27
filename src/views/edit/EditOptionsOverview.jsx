import { useMemo } from "react";
import { Container, Paper, Stack, Typography, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSchemas } from "../../contexts/SchemaContext";

function EditOptionsOverview() {
  const navigate = useNavigate();
  const { schema, isSchemaLoading } = useSchemas();

  const optionFields = useMemo(
    () => (Array.isArray(schema) ? schema.filter((field) => field?.type === "option") : []),
    [schema],
  );

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4, bgcolor: "background.default", mt: 2 }}>
        <Stack spacing={3}>
          <Typography variant="h4" component="h2">
            Modificar Opciones Modificables
          </Typography>
          {isSchemaLoading ? (
            <Stack spacing={2} alignItems="center">
              <CircularProgress />
              <Typography variant="body2" color="text.secondary">
                Cargando opciones...
              </Typography>
            </Stack>
          ) : (
            <Stack spacing={2}>
              {optionFields.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No hay campos de tipo opción configurados.
                </Typography>
              )}
              {optionFields.map((field) => {
                console.log('field', field);
                const fieldId = field?.id;
                const fieldLabel = field?.label || field?.name;
                if (!fieldId) return null;

                return (
                  <Button
                    key={fieldId}
                    variant="contained"
                    color="primary"
                    sx={{ py: 2, borderRadius: 3 }}
                    onClick={() => navigate(`/editar/${fieldId}`)}
                  >
                    {fieldLabel}
                  </Button>
                );
              })}
            </Stack>
          )}
        </Stack>
      </Paper>
    </Container>
  );
}

export default EditOptionsOverview;
