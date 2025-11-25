import { useMemo } from "react";
import { Autocomplete, TextField, Box } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

function FieldSelect({ label, placeholder, options = [], value, onChange, ...textFieldProps }) {
  const sortedOptions = useMemo(() => {
    return [...options].sort((a, b) => {
      if (a.fav && !b.fav) return -1;
      if (!a.fav && b.fav) return 1;
      return (a?.label || "").localeCompare(b?.label || "", "es", { sensitivity: "base" })
    }
    );
  }, [options]);

  const selectedOption = useMemo(() => {
    return sortedOptions.find((option) => option?.value === value) || null;
  }, [sortedOptions, value]);

  return (
    <Autocomplete
      fullWidth
      options={sortedOptions}
      value={selectedOption}
      onChange={(_, newValue) => onChange?.(newValue?.value || "")}
      isOptionEqualToValue={(option, currentValue) => option?.value === currentValue?.value}
      getOptionLabel={(option) => option?.label || ""}
      popupIcon={null}
      renderOption={(props, option) => {
        const isFavorite = Boolean(option?.fav);
        return (
          <Box component="li" {...props} sx={{ display: "flex", alignItems: "center", width: "100%" }}>
            <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", gap: 2 }}>
              <span>{option?.label}</span>
              {isFavorite ? (
                <StarIcon fontSize="small" sx={{ color: "warning.main" }} />
              ) : (
                <StarBorderIcon fontSize="small" sx={{ color: "text.disabled" }} />
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

export default FieldSelect;
