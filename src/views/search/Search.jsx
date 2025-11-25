import { useEffect, useRef, useState } from "react";
import { Container, Paper, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchForm from "../../components/SearchForm";
import ItemList from "../../components/ItemList";
import { listSchemas } from "../../services/schemas";

function Search() {
  const [filters, setFilters] = useState({
    code: "",
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
      "id": "0J6HZc4Ff4TsEqWsBsLg",
      "name": "Descripción o nombre texto x",
      "code": "Test",
      "imgs": [
        {
          "publicUrl": "https://pub-811f3c88717148b58c1bec8b926cc483.r2.dev/uploads/b51a660e-7497-4e55-bfeb-8057d656e3d9",
          "width": 1200,
          "height": 800
        },
        {
          "publicUrl": "https://pub-811f3c88717148b58c1bec8b926cc483.r2.dev/uploads/018fa7dd-f8d1-4df2-9f75-4d4d9ec82485",
          "width": 400,
          "height": 400
        },
        {
          "publicUrl": "https://pub-811f3c88717148b58c1bec8b926cc483.r2.dev/uploads/6e1b2e32-d73d-4ac3-acda-92de3ba1b2d3",
          "width": 652,
          "height": 366
        },
        {
          "publicUrl": "https://pub-811f3c88717148b58c1bec8b926cc483.r2.dev/uploads/efdc0410-5438-4bb0-a400-e210a9893621",
          "width": 756,
          "height": 502
        }
      ],
      "properties": {
        "code": "Test",
        "Compatibilidad": "Compatibilidad de prueba 123",
        "Descripción": "Descripción o nombre texto x",
        "Marca": "Honda",
        "Modelo": "5HP19",
        "Tracción": "delantera 4x2",
        "Año": 45564,
        "Costo": 76465,
        "Seguro": 79865,
        "Flete": 989856,
        "valor CIF": 76895,
        "Combustible": "gasolina",
        "Cilindrada": "73747"
      }
    },
    {
      "id": "5TS2aN2PsVWTmTltrwVf",
      "name": "sadsadsa",
      "code": "dfsadsadsa",
      "imgs": [
        {
          "publicUrl": "https://pub-811f3c88717148b58c1bec8b926cc483.r2.dev/uploads/20d15f47-2e27-437b-b65d-4d60ddfa9f25",
          "width": 1599,
          "height": 899
        },
        {
          "publicUrl": "https://pub-811f3c88717148b58c1bec8b926cc483.r2.dev/uploads/ccac7959-8f0b-4840-bf3f-0ba020acd947",
          "width": 1599,
          "height": 899
        },
        {
          "publicUrl": "https://pub-811f3c88717148b58c1bec8b926cc483.r2.dev/uploads/4b6be27b-3056-47ad-abd5-cbe885fbad44",
          "width": 1599,
          "height": 899
        },
        {
          "publicUrl": "https://pub-811f3c88717148b58c1bec8b926cc483.r2.dev/uploads/40212490-f469-4650-9a4a-e753c63f7adf",
          "width": 899,
          "height": 1599
        },
        {
          "publicUrl": "https://pub-811f3c88717148b58c1bec8b926cc483.r2.dev/uploads/ac1e1d00-16f4-48c0-804d-559a072d84d0",
          "width": 899,
          "height": 1599
        },
        {
          "publicUrl": "https://pub-811f3c88717148b58c1bec8b926cc483.r2.dev/uploads/6df01975-083d-4240-8981-ec4d89ea2edd",
          "width": 899,
          "height": 1599
        },
        {
          "publicUrl": "https://pub-811f3c88717148b58c1bec8b926cc483.r2.dev/uploads/58b5b044-cc39-4783-8058-648e912d52e6",
          "width": 1599,
          "height": 899
        }
      ],
      "properties": {
        "code": "dfsadsadsa",
        "Compatibilidad": "sadsadsa",
        "Descripción": "sadsadsa",
        "Marca": "Toyota",
        "Modelo": "725.0",
        "Tracción": "4x4",
        "Combustible": "híbrido",
        "Cilindrada": "32132",
        "Año": 213213,
        "Costo": 213213,
        "Seguro": 213213,
        "Flete": 132131,
        "valor CIF": 213213213
      }
    },
    {
      "id": "FCgj1NSuPtgtk1mE0zbB",
      "name": "",
      "code": "",
      "imgs": [
        {
          "publicUrl": "https://pub-811f3c88717148b58c1bec8b926cc483.r2.dev/uploads/b3c751c8-6cb0-461e-a35b-d498045f423a",
          "width": 4080,
          "height": 3060
        },
        {
          "publicUrl": "https://pub-811f3c88717148b58c1bec8b926cc483.r2.dev/uploads/094c4363-f761-4baa-8ce8-5fb0c18ea385",
          "width": 3060,
          "height": 4080
        },
        {
          "publicUrl": "https://pub-811f3c88717148b58c1bec8b926cc483.r2.dev/uploads/20881810-dc3d-4ce9-8620-53e6dfeece27",
          "width": 4080,
          "height": 3060
        },
        {
          "publicUrl": "https://pub-811f3c88717148b58c1bec8b926cc483.r2.dev/uploads/59d41fa7-1bb3-4c09-9e93-cd0d7b0d8cea",
          "width": 3060,
          "height": 4080
        }
      ],
      "properties": {
        "Marca": "Suzuki ",
        "Modelo": "Kisashi"
      }
    },
    {
      "id": "L4c7t0PF6NTradhYivyi",
      "name": "Descripción general o nombre",
      "code": "Código prueba 123",
      "imgs": [
        {
          "publicUrl": "https://pub-811f3c88717148b58c1bec8b926cc483.r2.dev/uploads/31710b16-1d11-468c-806d-10eeeb94f6f1",
          "width": 1200,
          "height": 800
        },
        {
          "publicUrl": "https://pub-811f3c88717148b58c1bec8b926cc483.r2.dev/uploads/6e671ed6-65ce-42bc-9bd9-edc5837c298e",
          "width": 400,
          "height": 400
        },
        {
          "publicUrl": "https://pub-811f3c88717148b58c1bec8b926cc483.r2.dev/uploads/f0d24546-434f-4766-9c0b-f2f70b9b2eff",
          "width": 652,
          "height": 366
        },
        {
          "publicUrl": "https://pub-811f3c88717148b58c1bec8b926cc483.r2.dev/uploads/2a479731-a7e3-477d-9a6b-bd2b9c196f44",
          "width": 756,
          "height": 502
        }
      ],
      "properties": {
        "code": "Código prueba 123",
        "Compatibilidad": "Compatibilidad con marca imaginaria en x parte 1234",
        "Descripción": "Descripción general o nombre",
        "Marca": "General Motors",
        "Modelo": "6R80",
        "Tracción": "trasera 4x2",
        "Combustible": "eléctrico",
        "Cilindrada": "173747373",
        "Año": 2737,
        "Costo": 374737,
        "Seguro": 3737,
        "Flete": 2737,
        "valor CIF": 27373
      }
    },
    {
      "id": "i9mJcJAvAJLhIHJ7v64v",
      "name": "sadsadsa",
      "code": "test",
      "imgs": [
        {
          "publicUrl": "https://pub-811f3c88717148b58c1bec8b926cc483.r2.dev/uploads/f74a95d8-959c-4ee3-ac78-184322b576f0",
          "width": 1599,
          "height": 899
        },
        {
          "publicUrl": "https://pub-811f3c88717148b58c1bec8b926cc483.r2.dev/uploads/7bfd8726-7485-4332-8e2e-9ba2ab364921",
          "width": 1599,
          "height": 899
        },
        {
          "publicUrl": "https://pub-811f3c88717148b58c1bec8b926cc483.r2.dev/uploads/71cbe1c5-656c-471d-92bc-dda41704aa3c",
          "width": 1599,
          "height": 899
        },
        {
          "publicUrl": "https://pub-811f3c88717148b58c1bec8b926cc483.r2.dev/uploads/d084cb89-7da9-48e6-8da4-c0c8dc6c016a",
          "width": 899,
          "height": 1599
        },
        {
          "publicUrl": "https://pub-811f3c88717148b58c1bec8b926cc483.r2.dev/uploads/409a5416-adda-432d-933f-a5a209433739",
          "width": 899,
          "height": 1599
        },
        {
          "publicUrl": "https://pub-811f3c88717148b58c1bec8b926cc483.r2.dev/uploads/f83fa76f-3685-46aa-b267-07952cebf1a4",
          "width": 899,
          "height": 1599
        },
        {
          "publicUrl": "https://pub-811f3c88717148b58c1bec8b926cc483.r2.dev/uploads/15b27c33-210f-47dc-a9c0-7614fca3359e",
          "width": 899,
          "height": 1599
        },
        {
          "publicUrl": "https://pub-811f3c88717148b58c1bec8b926cc483.r2.dev/uploads/9769c5ab-1d52-4ae0-a959-27c8455a5949",
          "width": 1599,
          "height": 899
        }
      ],
      "properties": {
        "code": "test",
        "Compatibilidad": "sadasdsa",
        "Descripción": "sadsadsa",
        "Marca": "Toyota",
        "Modelo": "722.3",
        "Tracción": "trasera 4x2",
        "Combustible": "híbrido",
        "Cilindrada": "3123213",
        "Año": 231213,
        "Costo": 213213,
        "Seguro": 213213,
        "Flete": 231321,
        "valor CIF": 321321
      }
    },
    {
      "id": "qPiyaWiyGwjliRvqWOOG",
      "name": "",
      "code": "Test123",
      "imgs": [
        {
          "publicUrl": "https://pub-811f3c88717148b58c1bec8b926cc483.r2.dev/uploads/a8879056-e7bb-462f-af46-d8b4d4e16e4d",
          "width": 1080,
          "height": 1920
        }
      ],
      "properties": {
        "code": "Test123",
        "Compatibilidad": "123"
      }
    },
    {
      "id": "xY8wbYGQF7A6hjCtqOcC",
      "name": "",
      "code": "",
      "imgs": [],
      "properties": {
        "Marca": "Suzuki ",
        "Modelo": "Kisashi",
        "Tracción": "trasera 4x2",
        "Combustible": "gasolina",
        "Cilindrada": "2.4",
        "Año": 2011,
        "Costo": 300,
        "Seguro": 50,
        "Flete": 50,
        "valor CIF": 400
      }
    }
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
    console.log(('Searching with filters:', filters));
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
