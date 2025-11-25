import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import defaultDetailImage from "../assets/images/detail/default.jpg";

function ItemDetail({ item, schema = [], index, onViewImages, focusRef }) {
  const sortedSchema = Array.isArray(schema)
    ? [...schema].sort(
        (a, b) => (a?.orderToShow ?? Number.MAX_SAFE_INTEGER) - (b?.orderToShow ?? Number.MAX_SAFE_INTEGER)
      )
    : [];

  const propertiesToShow =
    sortedSchema.length > 0
      ? sortedSchema.map((field) => ({
          key: field?.name || field?.label,
          label: field?.label || field?.name || "Campo",
          value: item?.properties?.[field?.name],
        }))
      : Object.entries(item?.properties || {}).map(([key, value]) => ({
          key,
          label: key,
          value,
        }));

  const hasImage = Array.isArray(item?.imgs) && item.imgs.some((img) => img?.publicUrl || img?.url);
  const firstImage = hasImage ? item.imgs.find((img) => img?.publicUrl || img?.url) : null;
  const imageSrc = firstImage?.publicUrl || firstImage?.url || defaultDetailImage;
  const isImageClickable = hasImage && typeof onViewImages === "function";

  return (
    <Paper
      elevation={2}
      sx={{ mt: 4, p: 4, borderRadius: 4 }}
      ref={focusRef}
      tabIndex={index === 0 ? -1 : undefined}
      aria-label={`Resultado ${index + 1}: ${item?.name || "Sin nombre"}`}
    >
      <Stack spacing={3}>
        <Box>
          <Typography variant="h5">{item?.name || "Sin nombre"}</Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Código: {item?.code || "N/D"}
          </Typography>
        </Box>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          alignItems={{ xs: "flex-start", sm: "center" }}
        >
          <Box
            component="img"
            src={imageSrc}
            alt={item?.name || "Repuesto"}
            sx={{
              width: { xs: "100%", sm: 184 },
              height: { xs: 200, sm: 184 },
              objectFit: "cover",
              borderRadius: 2,
              cursor: isImageClickable ? "pointer" : "default",
            }}
            onClick={isImageClickable ? () => onViewImages(item) : undefined}
          />

          <Stack spacing={1.2} flexGrow={1}>
            {propertiesToShow.map(({ key, label, value }) => {
              if (!key) return null;

              return (
                <Typography key={key} variant="body2" sx={{ fontWeight: 600 }}>
                  {label}:{" "}
                  <Typography component="span" variant="body2" color="text.primary" sx={{ fontWeight: 400 }}>
                    {value ?? "N/D"}
                  </Typography>
                </Typography>
              );
            })}
          </Stack>
        </Stack>

        <Button
          variant="contained"
          color="primary"
          sx={{ alignSelf: "flex-start", cursor: "pointer" }}
          onClick={() => onViewImages?.(item)}
          disabled={!hasImage}
        >
          Ver Imágenes
        </Button>
      </Stack>
    </Paper>
  );
}

export default ItemDetail;
