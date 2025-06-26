import { FormControl, FormLabel, FilledInput, FormHelperText } from "@mui/material";

export function NeviosInput({ label, placeholder, error, helperText, height, ...props }) {
  return (
    <FormControl sx={{ width: "100%" }} error={error}>
      <FormLabel sx={{ fontSize: "13px", fontWeight: 400, marginBottom: 0.8 }}>{label}</FormLabel>
      <FilledInput
        sx={{
          height: height || "35px",
          border: error ? "0.5px solid red" : "0.5px solid rgb(146, 146, 146)",
          boxShadow: "none",
          fontSize: "13px",
          borderRadius: "8px",
        }}
        placeholder={placeholder}
        error={error}
        {...props}
      />
      {helperText && (
        <FormHelperText sx={{ marginLeft: 0 }}>{helperText}</FormHelperText>
      )}
    </FormControl>
  );
}

