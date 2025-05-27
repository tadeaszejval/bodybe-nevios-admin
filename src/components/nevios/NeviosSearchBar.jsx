import { FormControl, FilledInput, CircularProgress, Box } from "@mui/material";
import { TbSearch } from "react-icons/tb";

export function NeviosSearchBar({ label, placeholder, error, helperText, loading = false, ...props }) {
  return (
    <FormControl 
        sx={{ 
            width: "100%",
            height: "35px",
            backgroundColor: "gray.50",
            borderRadius: "8px",
            display: "flex",
            padding: "0 10px",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            border: "2px solid",
            borderColor: "transparent",
            gap: 0.5,
            "&:hover": {
                backgroundColor: "gray.100",
            },
            "&:focus": {
                backgroundColor: "gray.100",
            },
            "&:active": {
                backgroundColor: "gray.100",
            },
            "&:focus-within": {
                backgroundColor: "gray.100",
            },
        }}>
            <Box sx={{display: "flex", flexDirection: "row", alignItems: "center", gap: 0.5, width: "100%"}}>
            <TbSearch size={16} />
            <FilledInput
                placeholder={placeholder || "Search for all orders"}
                {...props}
                sx={{
                    width: "100%",
                    boxShadow: "none",
                    backgroundColor: "transparent",
                    borderWidth: "0px",
                    fontSize: "13px",
                    borderRadius: "10px",
                }}
            />
            </Box>
            {loading && (
                <Box sx={{display: "flex", flexDirection: "row", alignItems: "center", gap: 0.5}}>
                    <CircularProgress size={16} />
                </Box>
            )}
    </FormControl>
  );
}