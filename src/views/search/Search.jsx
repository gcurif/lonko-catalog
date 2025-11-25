import { useEffect, useRef, useState } from "react";
import { Container, Paper, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchForm from "../../components/SearchForm";
import ItemList from "../../components/ItemList";
import { useSchemas } from "../../contexts/SchemaContext";
import { advancedSearch, getItem, listItems } from "../../services/items";

function Search() {
  const [filters, setFilters] = useState({
    code: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const loadingContainerRef = useRef(null);
  const resultsContainerRef = useRef(null);
  const { schema, isSchemaLoading } = useSchemas();
  const navigate = useNavigate();

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

  function handleSelectChange(field, value) {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }

  const getFieldType = (fieldName) => {
    const field = Array.isArray(schema)
      ? schema.find((item) => item?.name === fieldName || item?.label === fieldName)
      : null;
    return field?.type;
  };

  const applyClientFilters = (items) => {
    if (!Array.isArray(items)) return [];

    const entries = Object.entries(filters || {}).filter(([key, value]) => {
      if (!value && value !== 0) return false;
      const type = getFieldType(key);
      return type === "text" || type === "textlg" || type === "number" || type === "txt";
    });

    if (entries.length === 0) return items;

    return items.filter((item) =>
      entries.every(([key, value]) => {
        const raw = item?.properties?.[key] ?? item?.[key];
        if (raw === undefined || raw === null) return false;
        const itemValue = String(raw).toLowerCase();
        const filterValue = String(value).toLowerCase();
        return itemValue.includes(filterValue);
      }),
    );
  };

  async function handleSearch() {
    setHasSearched(true);
    setIsLoading(true);
    setResults([]);

    try {
      if (filters.code) {
        const item = await getItem(filters.code);
        const found = Array.isArray(item) ? item : item ? [item] : [];
        setResults(found);
        return;
      }

      const optionFilters = Object.entries(filters || {}).reduce((acc, [key, value]) => {
        if (!value && value !== 0) return acc;
        if (getFieldType(key) === "option") {
          acc[key] = value;
        }
        return acc;
      }, {});

      let baseResults = [];

      if (Object.keys(optionFilters).length > 0) {
        const data = await advancedSearch({ filters: optionFilters });
        baseResults = Array.isArray(data) ? data : data?.items ?? [];
      } else {
        const data = await listItems();
        baseResults = Array.isArray(data) ? data : data?.items ?? [];
      }

      const filtered = applyClientFilters(baseResults);
      setResults(filtered);
    } catch (error) {
      console.error("Error al buscar", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleClear() {
    setFilters({ code: "" });
    setIsLoading(false);
    setResults([]);
    setHasSearched(false);
  }

  function handleViewImages(item) {
    navigate("/gallery", { state: { item } });
  }

  if (isSchemaLoading) {
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
        schema={schema}
        onViewImages={handleViewImages}
        loadingContainerRef={loadingContainerRef}
        resultsContainerRef={resultsContainerRef}
      />
    </Container>
  );
}

export default Search;
