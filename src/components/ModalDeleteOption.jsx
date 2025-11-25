import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import { siLK } from "@mui/material/locale";

function ModalDeleteOption({ open, optionValue, onConfirm, onCancel }) {
  const handleCancel = () => {
    onCancel?.();
  };

  const handleConfirm = () => {
    onConfirm?.();
  };

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="xs">
      <DialogTitle>Eliminar opción</DialogTitle>
      <DialogContent>
        <Stack spacing={1}>
          <Typography variant="body1">
            ¿Está seguro que desea eliminar la opción?
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: 16 }}>
            {optionValue || "Sin nombre"}
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleCancel} color="inherit">
          Cancelar
        </Button>
        <Button onClick={handleConfirm} color="error" variant="contained">
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ModalDeleteOption;
