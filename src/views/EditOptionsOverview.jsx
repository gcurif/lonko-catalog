import { Container, Paper, Stack, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const editableGroups = [
  { id: "marca", label: "Marca" },
  { id: "modelo", label: "Modelo" },
  { id: "traccion", label: "Tracción" },
  { id: "combustible", label: "Combustible" },
];

function EditOptionsOverview() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4, bgcolor: "background.default", mt: 2 }}>
        <Stack spacing={3}>
          <Typography variant="h4" component="h2">
            Modificar Opciones Modificables
          </Typography>
          <Stack spacing={2}>
            {editableGroups.map((group) => (
              <Button
                key={group.id}
                variant="contained"
                color="primary"
                sx={{ py: 2, borderRadius: 3 }}
                onClick={() => navigate(`/editarwea/${group.id}`)}
              >
                {group.label}
              </Button>
            ))}
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}

export default EditOptionsOverview;
