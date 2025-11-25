import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { listSchemas } from "../services/schemas";

const SchemaContext = createContext(null);

export function SchemaProvider({ children }) {
  const [schema, setSchema] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadSchemas = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await listSchemas();
      const parsed = Array.isArray(data) ? data : data?.schema ?? [];
      setSchema(parsed);
    } catch (err) {
      console.error("Error al cargar los esquemas", err);
      setError(err);
      setSchema([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSchemas();
  }, []);

  const value = useMemo(
    () => ({
      schema,
      isSchemaLoading: isLoading,
      schemaError: error,
      refreshSchemas: loadSchemas,
    }),
    [schema, isLoading, error],
  );

  return <SchemaContext.Provider value={value}>{children}</SchemaContext.Provider>;
}

export function useSchemas() {
  const ctx = useContext(SchemaContext);
  if (!ctx) {
    throw new Error("useSchemas debe usarse dentro de un SchemaProvider");
  }
  return ctx;
}

export default SchemaContext;
