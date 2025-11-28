import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Dialog,
  IconButton,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import detail1 from "../../assets/images/detail/1.jpeg";
import detail2 from "../../assets/images/detail/2.jpeg";
import detail3 from "../../assets/images/detail/3.jpeg";
import detail4 from "../../assets/images/detail/4.jpeg";
import detail5 from "../../assets/images/detail/5.jpeg";
import detail6 from "../../assets/images/detail/6.jpeg";
import detail7 from "../../assets/images/detail/7.jpeg";
import detail8 from "../../assets/images/detail/8.jpeg";

function Gallery() {
  const navigate = useNavigate();
  const location = useLocation();
  const item = location.state?.item || location.state?.result;
  const [selectedImage, setSelectedImage] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const images = useMemo(
    () => {
      const fallbackImages = [
        { src: detail1, alt: "Detalle 1" },
        { src: detail2, alt: "Detalle 2" },
        { src: detail3, alt: "Detalle 3" },
        { src: detail4, alt: "Detalle 4" },
        { src: detail5, alt: "Detalle 5" },
        { src: detail6, alt: "Detalle 6" },
        { src: detail7, alt: "Detalle 7" },
        { src: detail8, alt: "Detalle 8" },
      ];

      if (item?.imgs?.length) {
        const fromItem = item.imgs
          .map((img, index) => ({
            src: img.publicUrl || img.url,
            alt: `${item.name || "Detalle"} ${index + 1}`,
          }))
          .filter((img) => Boolean(img.src));

        if (fromItem.length) {
          return fromItem;
        }
      }

      return fallbackImages;
    },
    [item]
  );

  function handleOpenImage(image) {
    setSelectedImage(image);
    setIsZoomed(false);
  }

  function handleCloseDialog() {
    setSelectedImage(null);
    setIsZoomed(false);
  }

  function handleToggleZoom() {
    setIsZoomed((prev) => !prev);
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={2} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4 }}>
        <Stack spacing={3}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h4">Galería</Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {item?.name || "Visualizá los detalles del repuesto"}
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="inherit"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              sx={{ borderRadius: "50px", px: 3, cursor: "pointer" }}
            >
              Volver
            </Button>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            Código: {item?.code || "N/D"}
          </Typography>

          <Grid container spacing={2}>
            {images.map((image) => (
              <Grid item xs={12} sm={6} key={image.alt}>
                <Box
                  component="img"
                  src={image.src}
                  alt={image.alt}
                  sx={{
                    width: "100%",
                    borderRadius: 2,
                    objectFit: "cover",
                    cursor: "pointer",
                  }}
                  onClick={() => handleOpenImage(image)}
                />
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Paper>

      <Dialog
        open={Boolean(selectedImage)}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { bgcolor: "transparent", boxShadow: "none" },
        }}
      >
        <Box
          sx={{
            position: "relative",
            p: { xs: 2, sm: 4 },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IconButton
            aria-label="Cerrar"
            onClick={handleCloseDialog}
            sx={{
              position: "absolute",
              top: { xs: 8, sm: 16 },
              right: { xs: 8, sm: 16 },
              bgcolor: "background.paper",
              "&:hover": { bgcolor: "background.paper" },
            }}
          >
            <CloseIcon />
          </IconButton>
          <Box
            onClick={handleToggleZoom}
            sx={{
              maxHeight: "80vh",
              maxWidth: "90vw",
              overflow: "auto",
              cursor: isZoomed ? "zoom-out" : "zoom-in",
              borderRadius: 2,
              boxShadow: 3,
              bgcolor: "background.paper",
            }}
          >
            <Box
              component="img"
              src={selectedImage?.src}
              alt={selectedImage?.alt}
              sx={{
                width: isZoomed ? "150%" : "100%",
                height: "auto",
                transition: "width 0.3s ease",
                display: "block",
                maxWidth: isZoomed ? "none" : "100%",
              }}
            />
          </Box>
        </Box>
      </Dialog>
    </Container>
  );
}

export default Gallery;
