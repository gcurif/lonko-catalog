import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import StarSelect from "../components/StarSelect";
import detail1 from "../assets/images/detail/1.jpeg";
import detail2 from "../assets/images/detail/2.jpeg";
import { useNavigate } from "react-router-dom";

function Search() {
  const [filters, setFilters] = useState({
    marca: "",
    modelo: "",
    traccion: "",
    combustible: "",
  });

  const marcas = ["Toyota", "Ford", "Nissan", "Volkswagen"];
  const modelos = ["Hilux", "Ranger", "Frontier", "Amarok"];
  const tracciones = ["4x2", "4x4", "AWD"];
  const combustibles = ["Nafta", "Diésel", "Híbrido"];
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const loadingTimeoutRef = useRef();
  const loadingContainerRef = useRef(null);
  const resultsContainerRef = useRef(null);
  const navigate = useNavigate();

  const mockResults = [
    {
      id: "test-1",
      title: "Descripción o nombre texto x",
      code: "Test",
      description: "Descripción o nombre texto x",
      compatibility: "Compatibilidad de prueba 123",
      brand: "Honda",
      model: "5HP19",
      year: "45564",
      traction: "delantera 4x2",
      fuel: "gasolina",
      displacement: "73747",
      cost: "76465",
      insurance: "79865",
      freight: "989856",
      cif: "76895",
      image: detail1,
    },
    {
      id: "test-2",
      title: "Caja automática ZF",
      code: "TEST-ZF",
      description: "Caja automática compatible con modelos premium",
      compatibility: "Series 3 y 5 (2014-2017)",
      brand: "BMW",
      model: "ZF 6HP26",
      year: "2016",
      traction: "trasera",
      fuel: "gasolina",
      displacement: "2979",
      cost: "120500",
      insurance: "18500",
      freight: "23500",
      cif: "162510",
      image: detail2,
    },
  ];

  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isLoading && loadingContainerRef.current) {
      loadingContainerRef.current.focus();
      loadingContainerRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading && results.length > 0 && resultsContainerRef.current) {
      resultsContainerRef.current.focus();
      resultsContainerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [isLoading, results]);

  function handleSelectChange(field) {
    return (value) => {
      setFilters((prev) => ({ ...prev, [field]: value }));
    };
  }

  function handleSearch() {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }

    setHasSearched(true);
    setIsLoading(true);
    setResults([]);

    loadingTimeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      setResults(mockResults.slice(0, Math.random() > 0.5 ? 2 : 1));
    }, 2000);
  }

  function handleClear() {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }

    setFilters({
      marca: "",
      modelo: "",
      traccion: "",
      combustible: "",
    });
    setIsLoading(false);
    setResults([]);
    setHasSearched(false);
  }

  function handleViewImages(result) {
    navigate("/gallery", { state: { result } });
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4, bgcolor: "background.default", mt: 2 }}>
        <Stack spacing={2.5}>
          <Typography variant="h4" component="h2">
            Búsqueda
          </Typography>
          <Stack spacing={1.5}>
            <TextField fullWidth label="Código" placeholder="Código" />
            <TextField
              fullWidth
              label="Compatibilidad"
              placeholder="Compatibilidad"
              multiline
              minRows={3}
            />
            <StarSelect
              label="Marca"
              placeholder="Marca"
              options={marcas}
              value={filters.marca}
              onChange={handleSelectChange("marca")}
              helperText="Seleccioná la marca deseada"
            />
            <StarSelect
              label="Modelo"
              placeholder="Modelo"
              options={modelos}
              value={filters.modelo}
              onChange={handleSelectChange("modelo")}
              helperText="Filtrá por modelo"
            />
            <StarSelect
              label="Tracción"
              placeholder="Tracción"
              options={tracciones}
              value={filters.traccion}
              onChange={handleSelectChange("traccion")}
              favoritesCount={2}
            />
            <StarSelect
              label="Combustible"
              placeholder="Combustible"
              options={combustibles}
              value={filters.combustible}
              onChange={handleSelectChange("combustible")}
              favoritesCount={2}
            />
            <TextField fullWidth label="Cilindrada" placeholder="Cilindrada" />
            <TextField fullWidth label="Año" placeholder="Año" />
          </Stack>

          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="contained"
              color="success"
              startIcon={<SearchIcon />}
              sx={{ borderRadius: "50%", px: 6, py: 4 }}
              onClick={handleSearch}
            >
              Buscar
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<DeleteIcon />}
              sx={{ borderRadius: "50%", px: 4, py: 4 }}
              onClick={handleClear}
            >
              Limpiar
            </Button>
          </Stack>
        </Stack>
      </Paper>

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
        results.map((result, index) => (
          <Paper
            key={result.id}
            elevation={2}
            sx={{ mt: 4, p: 4, borderRadius: 4 }}
            ref={index === 0 ? resultsContainerRef : null}
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
                  onClick={() => handleViewImages(result)}
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
                onClick={() => handleViewImages(result)}
              >
                Ver Imágenes
              </Button>
            </Stack>
          </Paper>
        ))}
    </Container>
  );
}

export default Search;
