import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Dialog,
  IconButton,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import { listItemImages } from "../../services/items";

function Gallery() {
  const navigate = useNavigate();
  const location = useLocation();
  const item = location.state?.item || location.state?.result;
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [imagesError, setImagesError] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadImages() {
      if (!item?.id) {
        setImages([]);
        setImagesError("No se pudo identificar el repuesto para cargar imágenes.");
        return;
      }

      setIsLoadingImages(true);
      setImagesError("");

      try {
        const data = await listItemImages(item.id);
        if (!isMounted) return;

        const nextImages = (Array.isArray(data) ? data : [])
          .map((img, index) => ({
            src: img.publicUrl || img.url,
            alt: `${item.name || "Detalle"} ${index + 1}`,
          }))
          .filter((img) => Boolean(img.src));

        setImages(nextImages);
      } catch (error) {
        if (!isMounted) return;
        console.error("Error al cargar imágenes", error);
        setImages([]);
        setImagesError("No se pudieron cargar las imágenes del repuesto.");
      } finally {
        if (isMounted) {
          setIsLoadingImages(false);
        }
      }
    }

    loadImages();

    return () => {
      isMounted = false;
    };
  }, [item?.id, item?.name]);

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

          {isLoadingImages ? (
            <Stack alignItems="center" spacing={2} sx={{ py: 6 }}>
              <CircularProgress />
              <Typography variant="body2" color="text.secondary">
                Cargando imágenes...
              </Typography>
            </Stack>
          ) : imagesError ? (
            <Typography variant="body2" color="error.main">
              {imagesError}
            </Typography>
          ) : images.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Este repuesto no tiene imágenes cargadas.
            </Typography>
          ) : (
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
          )}
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
