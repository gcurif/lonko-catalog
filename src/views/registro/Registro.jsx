import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { listItems } from "../../services/items";
import Field from "../../components/input/Field";

function getPropertiesArray(item) {
  const entries = Object.entries(item?.properties || {}).filter(
    ([, value]) => value !== null && value !== undefined && value !== "",
  );
  return entries.map(([key, value]) => ({ key, value }));
}

function buildMockValues(index) {
  const base = 1000 + index * 75;
  return {
    costo: base,
    flete: Math.round(base * 0.1),
    seguro: Math.round(base * 0.05),
    cif: Math.round(base * 1.15),
  };
}

function Registro() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    async function fetchItems() {
      setIsLoading(true);
      try {
        const data = await listItems();
        const list = Array.isArray(data) ? data : data?.items || [];
        setItems(list);
      } catch (error) {
        console.error("Error al obtener items", error);
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchItems();
  }, []);

  const filteredItems = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter((item) => {
      const codeMatch = item?.code?.toLowerCase().includes(q);
      const properties = getPropertiesArray(item);
      const propertiesMatch = properties.some(
        ({ key, value }) =>
          String(key).toLowerCase().includes(q) || String(value).toLowerCase().includes(q),
      );
      return codeMatch || propertiesMatch;
    });
  }, [items, search]);

  const toggleExpand = (code) => {
    setExpandedRows((prev) => ({ ...prev, [code]: !prev[code] }));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Stack spacing={3}>
        <Typography variant="h4" component="h1">
          Registro
        </Typography>

        <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
          <Field
            label="Buscar"
            placeholder="Buscar por código o característica"
            value={search}
            onChange={setSearch}
            fullWidth
            disabled={isLoading}
          />
        </Paper>

        <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Producto
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Características
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Valores
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Stock
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredItems.map((item, index) => {
                const properties = getPropertiesArray(item);
                const isExpanded = expandedRows[item.code];
                const displayedProps = isExpanded ? properties : properties.slice(0, 4);
                const mockValues = buildMockValues(index);

                return (
                  <TableRow key={item.code || index}>
                    <TableCell>
                      <Typography fontWeight={600}>{item?.code || "Sin código"}</Typography>
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        {displayedProps.map(({ key, value }) => (
                          <Typography key={key} variant="body2" color="text.secondary">
                            <Box component="span" fontWeight={600}>
                              {key}:
                            </Box>{" "}
                            {String(value)}
                          </Typography>
                        ))}
                        {properties.length > 4 && (
                          <Button
                            variant="text"
                            size="small"
                            onClick={() => toggleExpand(item.code)}
                            sx={{ alignSelf: "flex-start", textTransform: "none", px: 0 }}
                          >
                            {isExpanded ? "Ver menos" : "Ver más"}
                          </Button>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Typography variant="body2">
                          Costo: ${mockValues.costo}
                        </Typography>
                        <Typography variant="body2">
                          Flete: ${mockValues.flete}
                        </Typography>
                        <Typography variant="body2">
                          Seguro: ${mockValues.seguro}
                        </Typography>
                        <Typography variant="body2">
                          CIF: ${mockValues.cif}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        {["Stock", "Vendido", "Stock virtual"].map((label) => (
                          <Stack
                            key={label}
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <Typography variant="body2">{label}</Typography>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                              <Typography variant="body2" color="text.secondary">
                                0
                              </Typography>
                              <IconButton size="small" color="primary">
                                <AddIcon fontSize="small" />
                              </IconButton>
                            </Stack>
                          </Stack>
                        ))}
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
              {!isLoading && filteredItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Typography align="center" color="text.secondary">
                      No hay resultados para mostrar.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Typography align="center" color="text.secondary">
                      Cargando...
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Container>
  );
}

export default Registro;
