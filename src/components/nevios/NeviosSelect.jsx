import { FormControl, FormLabel, Select } from "@mui/material";

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