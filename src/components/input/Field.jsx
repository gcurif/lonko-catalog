import { TextField } from "@mui/material";

function Field({ value, onChange, type = "text", inputRef, ...textFieldProps }) {
  const validateNumber = (rawValue) => {
    const trimmed = rawValue.trim();
    return trimmed === "" || /^-?\d+(\.\d+)?$/.test(trimmed);
  };

  const handleNumberChange = (rawValue) => {
    if (validateNumber(rawValue)) {
      onChange?.(rawValue.trim() === "" ? "" : Number(rawValue));
    }
  };

  const handleChange = (event) => {
    const rawValue = event.target.value;
    if (type === "number") {
      handleNumberChange(rawValue);
      return;
    }
    onChange?.(rawValue);
  };

  const displayValue =
    type === "number" && typeof value === "number" ? String(value) : value ?? "";

  return (
    <TextField
      {...textFieldProps}
      inputRef={inputRef}
      type={type === "password" ? "password" : "text"}
      inputMode={type === "number" ? "numeric" : undefined}
      value={displayValue}
      onChange={handleChange}
    />
  );
}

export default Field;
