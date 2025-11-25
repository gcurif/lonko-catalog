import { useEffect, useRef, useState } from "react";
import { Container, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import detail1 from "../assets/images/detail/1.jpeg";
import detail2 from "../assets/images/detail/2.jpeg";
import SearchForm from "../components/SearchForm";
import ItemList from "../components/ItemList";
import { listSchemas } from "../services/schemas";
import { CircularProgress } from "@mui/material";

function Search() {
  const [filters, setFilters] = useState({
    code: "",
    compatibility: "",
  });
  const [schema, setSchema] = useState([]);
  const [isSchemaLoading, setIsSchemaLoading] = useState(false);
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

  useEffect(() => {
    async function loadSchema() {
      setIsSchemaLoading(true);
      try {
        const data = await listSchemas();
        const parsedSchema = Array.isArray(data) ? data : data?.schema ?? [];
        setSchema(parsedSchema);
      } catch (error) {
        console.error("Error al cargar el esquema de búsqueda", error);
        setSchema([]);
      } finally {
        setIsSchemaLoading(false);
      }
    }

    loadSchema();
  }, []);

  function handleSelectChange(field, value) {
    setFilters((prev) => ({ ...prev, [field]: value }));
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

    setFilters({});
    setIsLoading(false);
    setResults([]);
    setHasSearched(false);
  }

  function handleViewImages(result) {
    navigate("/gallery", { state: { result } });
  }

  if(isSchemaLoading){
    return (
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4, bgcolor: "background.default", mt: 2 }}>
        <SearchForm
          filters={filters}
          schema={schema}
          onFilterChange={handleSelectChange}
          onSearch={handleSearch}
          onClear={handleClear}
          isLoading={isLoading || isSchemaLoading}
        />
      </Paper>

      <ItemList
        isLoading={isLoading}
        hasSearched={hasSearched}
        results={results}
        onViewImages={handleViewImages}
        loadingContainerRef={loadingContainerRef}
        resultsContainerRef={resultsContainerRef}
      />
    </Container>
  );
}

export default Search;
