import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";

function ModalOptionExists({ open, onClose }) {
  const handleClose = () => {
    onClose?.();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>Opción duplicada</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          La opción ingresada ya existe, no se puede agregar.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} variant="contained">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ModalOptionExists;
