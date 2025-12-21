import { FormControl, FormLabel, FilledInput, FormHelperText } from "@mui/material";

export function NeviosInput({ label, placeholder, error, helperText, height, ...props }) {
  return (
    <FormControl sx={{ width: "100%" }} error={error}>
      <FormLabel sx={{ fontSize: "13px", fontWeight: 400, marginBottom: 0.8 }}>{label}</FormLabel>
      <FilledInput
        sx={(theme) => ({
          height: height || "35px",
          border: error ? "1px solid" : "1px solid",
          borderColor: error ? "red.600" : "gray.300",
          fontSize: "13px",
          boxShadow: "none",
          borderRadius: "8px",
          transition: "all 0.1s ease-in-out",
          "&:focus-within": {
            borderColor: error ? "red.600" : "primary.500",
            boxShadow: error 
              ? `0 0 0 3px ${theme.palette.red[100]}` 
              : `0 0 0 4px ${theme.palette.primary[100]}`,
          },
          "&:hover:not(:focus-within)": {
            borderColor: error ? "red.600" : "gray.400",
          },
        })}
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

