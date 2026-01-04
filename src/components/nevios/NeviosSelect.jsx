import { FormControl, FormLabel, Select, MenuItem } from "@mui/material";

export function NeviosButtonSelect({ 
  options = [],
  size = "small",
  disabled = false,
  ...props 
}) {
  return (
    <Select
      displayEmpty
      size={size}
      disabled={disabled}
      sx={{
        backgroundColor: disabled ? "gray.200" : "white",
        color: disabled ? "gray.500" : "gray.900",
        borderRadius: "10px",
        boxShadow: disabled
          ? "0rem -.065rem 0rem 0rem #d1d5db inset, 0rem 0rem 0rem .065rem rgba(0, 0, 0, .05) inset, 0rem .03125rem 0rem .09375rem #f3f4f6 inset"
          : "0rem -.065rem 0rem 0rem #b5b5b5 inset, 0rem 0rem 0rem .065rem rgba(0, 0, 0, .1) inset, 0rem .03125rem 0rem .09375rem #FFF inset",
        opacity: disabled ? 0.7 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        border: "none",
        fontSize: "13px",
        fontWeight: "500",
        minWidth: "150px",
        height: size === "small" ? "32px" : "40px",
        "& .MuiSelect-select": {
          paddingTop: size === "small" ? "6px" : "10px",
          paddingBottom: size === "small" ? "6px" : "10px",
          paddingLeft: "12px",
          paddingRight: "32px",
        },
        "& .MuiOutlinedInput-notchedOutline": {
          border: "none",
        },
        "&:hover": {
          backgroundColor: disabled ? "gray.200" : "gray.100",
          boxShadow: disabled
            ? "0rem -.065rem 0rem 0rem #d1d5db inset, 0rem 0rem 0rem .065rem rgba(0, 0, 0, .05) inset, 0rem .03125rem 0rem .09375rem #f3f4f6 inset"
            : "0rem -.065rem 0rem 0rem #b5b5b5 inset, 0rem 0rem 0rem .065rem rgba(0, 0, 0, .1) inset, 0rem .03125rem 0rem .09375rem #FFF inset",
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
        },
        "&.Mui-focused": {
          boxShadow: disabled
            ? "0rem -.065rem 0rem 0rem #d1d5db inset, 0rem 0rem 0rem .1rem rgba(0, 0, 0, .05) inset, 0rem .03125rem 0rem .09375rem #f3f4f6 inset"
            : "0rem -.065rem 0rem 0rem #ffffff inset, 0rem 0rem 0rem .1rem rgba(0, 0, 0, .15) inset, 0rem .03125rem 0rem .09375rem #e5e7eb inset",
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
        },
      }}
      {...props}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );
}

export function NeviosSelect({ 
  label, 
  placeholder,
  options = [],
  ...props 
}) {
  return (
    <FormControl sx={{ width: "100%" }}>
      {label && (
        <FormLabel sx={{ fontSize: "13px", fontWeight: 400, marginBottom: 0.8 }}>
          {label}
        </FormLabel>
      )}
      <Select
        displayEmpty
        sx={{
          height: "35px",
          border: "1px solid",
          borderColor: "gray.300",
          boxShadow: "none",
          fontSize: "13px",
          borderRadius: "8px",
          backgroundColor: "transparent",
          "&:hover": {
            borderColor: "gray.400",
          },
          "&.Mui-focused": {
            borderColor: "primary.500",
          },
          "& .MuiSelect-select": {
            py: 0.75,
          },
        }}
        {...props}
      >
        {placeholder && (
          <MenuItem value="" disabled>
            {placeholder}
          </MenuItem>
        )}
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export function NeviosSelectCountry({ 
  label = 'Country', 
  placeholder,
  ...props 
}) {
  return (
    <FormControl sx={{ width: "100%" }}>
      <FormLabel sx={{ fontSize: "13px", fontWeight: 400, marginBottom: 0.8 }}>{label}</FormLabel>
      <Select native
        sx={{
          height: "35px",
          border: "0.5px solid rgb(146, 146, 146)",
          boxShadow: "none",
          fontSize: "13px",
          borderRadius: "8px",
          
        }}
        placeholder={placeholder} 
        {...props}
        >
        <option value="AL">Albania</option>
        <option value="AD">Andorra</option>
        <option value="AT">Austria</option>
        <option value="BY">Belarus</option>
        <option value="BE">Belgium</option>
        <option value="BA">Bosnia and Herzegovina</option>
        <option value="BG">Bulgaria</option>
        <option value="HR">Croatia</option>
        <option value="CY">Cyprus</option>
        <option value="CZ">Czech Republic</option>
        <option value="DK">Denmark</option>
        <option value="EE">Estonia</option>
        <option value="FI">Finland</option>
        <option value="FR">France</option>
        <option value="DE">Germany</option>
        <option value="GR">Greece</option>
        <option value="HU">Hungary</option>
        <option value="IS">Iceland</option>
        <option value="IE">Ireland</option>
        <option value="IT">Italy</option>
        <option value="LV">Latvia</option>
        <option value="LI">Liechtenstein</option>
        <option value="LT">Lithuania</option>
        <option value="LU">Luxembourg</option>
        <option value="MT">Malta</option>
        <option value="MD">Moldova</option>
        <option value="MC">Monaco</option>
        <option value="ME">Montenegro</option>
        <option value="NL">Netherlands</option>
        <option value="MK">North Macedonia</option>
        <option value="NO">Norway</option>
        <option value="PL">Poland</option>
        <option value="PT">Portugal</option>
        <option value="RO">Romania</option>
        <option value="RU">Russia</option>
        <option value="SM">San Marino</option>
        <option value="RS">Serbia</option>
        <option value="SK">Slovakia</option>
        <option value="SI">Slovenia</option>
        <option value="ES">Spain</option>
        <option value="SE">Sweden</option>
        <option value="CH">Switzerland</option>
        <option value="UA">Ukraine</option>
        <option value="GB">United Kingdom</option>
        <option value="US">United States</option>
        <option value="VA">Vatican City</option>
      </Select>
    </FormControl>
  );
}
