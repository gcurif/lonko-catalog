import { Stack, Typography, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import { useMemo } from "react";
import FieldSelect from "./input/FieldSelect";
import Field from "./input/Field";

function SearchForm({ schema = [], filters, onFilterChange, onSearch, onClear, isLoading }) {
  const handleChange = (field) => (value) => onFilterChange(field, value);

  const filterableSchema = useMemo(
    () => (Array.isArray(schema) ? schema.filter((item) => item?.filterable) : []),
    [schema]
  );

  return (
    <Stack spacing={2.5}>
      <Typography variant="h4" component="h2">
        Búsqueda
      </Typography>
      <Stack spacing={1.5}>
        <Field
          fullWidth
          label="Código"
          placeholder="Código"
          value={filters?.code || ""}
          onChange={handleChange("code")}
        />
        {filterableSchema.map((item, index) => {
          const { type, name, label, options = [] } = item || {};
          const fieldLabel = label || name || `Campo ${index + 1}`;
          const key = name || `campo-${index}`;

          if (type === "option") {
            const parsedOptions = options.map((opt) => ({
              label: opt?.name ?? opt?.label ?? "",
              value: opt?.value ?? opt?.name ?? "",
              fav: Boolean(opt?.fav),
            }));

            return (
              <FieldSelect
                key={key}
                label={fieldLabel}
                placeholder={fieldLabel}
                options={parsedOptions}
                value={filters[key] || ""}
                onChange={handleChange(key)}
              />
            );
          }

          const isTextArea = type === "textlg";
          const isNumber = type === "number";

          return (
            <Field
              key={key}
              fullWidth
              label={fieldLabel}
              placeholder={fieldLabel}
              type={isNumber ? "number" : "text"}
              value={filters[key] || ""}
              onChange={handleChange(key)}
              multiline={isTextArea}
              minRows={isTextArea ? 3 : undefined}
            />
          );
        })}
      </Stack>

      <Stack direction="row" spacing={2} justifyContent="center">
        <Button
          variant="contained"
          color="success"
          startIcon={<SearchIcon />}
          sx={{ borderRadius: "50%", px: 6, py: 4 }}
          onClick={onSearch}
          disabled={isLoading}
        >
          Buscar
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<DeleteIcon />}
          sx={{ borderRadius: "50%", px: 4, py: 4 }}
          onClick={onClear}
          disabled={isLoading}
        >
          Limpiar
        </Button>
      </Stack>
    </Stack>
  );
}

export default SearchForm;
