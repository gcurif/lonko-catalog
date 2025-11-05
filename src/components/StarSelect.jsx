import { useMemo } from "react";
import { Autocomplete, TextField, Box } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

function StarSelect({
  label,
  placeholder,
  options = [],
  value,
  onChange,
  favoritesCount = 3,
  ...textFieldProps
}) {
  const sortedOptions = useMemo(() => {
    return [...options].sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }));
  }, [options]);

  return (
    <Autocomplete
      fullWidth
      options={sortedOptions}
      value={value || null}
      onChange={(_, newValue) => onChange?.(newValue || "")}
      isOptionEqualToValue={(option, currentValue) => option === currentValue}
      popupIcon={null}
      renderOption={(props, option, { index }) => {
        const isFavorite = index < favoritesCount;
        return (
          <Box component="li" {...props} sx={{ display: "flex", alignItems: "center", width: "100%" }}>
            <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", gap: 2 }}>
              <span>{option}</span>
              {isFavorite ? (
                <StarIcon fontSize="small" sx={{ color: "warning.main" }} />
              ) : (
                <StarBorderIcon fontSize="small" sx={{ color: "warning.main" }} />
              )}
            </Box>
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder={placeholder} {...textFieldProps} />
      )}
    />
  );
}

export default StarSelect;
