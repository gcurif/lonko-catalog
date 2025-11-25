import { CircularProgress, Paper, Typography } from "@mui/material";
import ItemDetail from "./ItemDetail";

function ItemList({
  isLoading,
  hasSearched,
  results,
  schema = [],
  onViewImages,
  loadingContainerRef,
  resultsContainerRef,
}) {
  return (
    <>
      {isLoading && (
        <Paper
          elevation={1}
          sx={{
            mt: 4,
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            borderRadius: 4,
          }}
          ref={loadingContainerRef}
          tabIndex={-1}
          role="status"
          aria-live="polite"
          aria-busy={isLoading}
        >
          <CircularProgress color="primary" />
          <Typography variant="body1" color="text.secondary">
            Buscando coincidencias...
          </Typography>
        </Paper>
      )}

      {!isLoading && hasSearched && results.length === 0 && (
        <Paper elevation={1} sx={{ mt: 4, p: 4, borderRadius: 4 }}>
          <Typography variant="body1" color="text.secondary" textAlign="center">
            No se encontraron resultados con los filtros seleccionados.
          </Typography>
        </Paper>
      )}

      {!isLoading &&
        results.map((item, index) => (
          <ItemDetail
            key={item.id || `item-${index}`}
            item={item}
            schema={schema}
            index={index}
            onViewImages={onViewImages}
            focusRef={index === 0 ? resultsContainerRef : null}
          />
        ))}
    </>
  );
}

export default ItemList;
