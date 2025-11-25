import { Box, Button, Paper, Stack, Typography } from "@mui/material";

function ItemDetail({ result, index, onViewImages, focusRef }) {
  return (
    <Paper
      elevation={2}
      sx={{ mt: 4, p: 4, borderRadius: 4 }}
      ref={focusRef}
      tabIndex={index === 0 ? -1 : undefined}
      aria-label={`Resultado ${index + 1}: ${result.title}`}
    >
      <Stack spacing={3}>
        <Box>
          <Typography variant="h5">{result.title}</Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Código: {result.code}
          </Typography>
        </Box>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          alignItems={{ xs: "flex-start", sm: "center" }}
        >
          <Box
            component="img"
            src={result.image}
            alt={result.title}
            sx={{
              width: { xs: "100%", sm: 184 },
              height: { xs: 200, sm: 184 },
              objectFit: "cover",
              borderRadius: 2,
              cursor: "pointer",
            }}
            onClick={() => onViewImages(result)}
          />
          <Stack spacing={1.2} flexGrow={1}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Descripción:{" "}
              <Typography component="span" variant="body2" color="text.primary" sx={{ fontWeight: 400 }}>
                {result.description}
              </Typography>
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Compatibilidad:{" "}
              <Typography component="span" variant="body2" color="text.primary" sx={{ fontWeight: 400 }}>
                {result.compatibility}
              </Typography>
            </Typography>
            <Typography variant="body2">
              <Box component="span" sx={{ fontWeight: 600 }}>
                Marca:
              </Box>{" "}
              {result.brand}
            </Typography>
            <Typography variant="body2">
              <Box component="span" sx={{ fontWeight: 600 }}>
                Modelo:
              </Box>{" "}
              {result.model}
            </Typography>
            <Typography variant="body2">
              <Box component="span" sx={{ fontWeight: 600 }}>
                Año:
              </Box>{" "}
              {result.year}
            </Typography>
            <Typography variant="body2">
              <Box component="span" sx={{ fontWeight: 600 }}>
                Tracción:
              </Box>{" "}
              {result.traction}
            </Typography>
            <Typography variant="body2">
              <Box component="span" sx={{ fontWeight: 600 }}>
                Combustible:
              </Box>{" "}
              {result.fuel}
            </Typography>
            <Typography variant="body2">
              <Box component="span" sx={{ fontWeight: 600 }}>
                Cilindrada:
              </Box>{" "}
              {result.displacement}
            </Typography>
            <Typography variant="body2">
              <Box component="span" sx={{ fontWeight: 600 }}>
                Costo:
              </Box>{" "}
              {result.cost}
            </Typography>
            <Typography variant="body2">
              <Box component="span" sx={{ fontWeight: 600 }}>
                Seguro:
              </Box>{" "}
              {result.insurance}
            </Typography>
            <Typography variant="body2">
              <Box component="span" sx={{ fontWeight: 600 }}>
                Flete:
              </Box>{" "}
              {result.freight}
            </Typography>
            <Typography variant="body2">
              <Box component="span" sx={{ fontWeight: 600 }}>
                Valor CIF:
              </Box>{" "}
              {result.cif}
            </Typography>
          </Stack>
        </Stack>

        <Button
          variant="contained"
          color="primary"
          sx={{ alignSelf: "flex-start", cursor: "pointer" }}
          onClick={() => onViewImages(result)}
        >
          Ver Imágenes
        </Button>
      </Stack>
    </Paper>
  );
}

export default ItemDetail;
