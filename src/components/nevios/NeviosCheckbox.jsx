import { FormGroup, FormControlLabel, Checkbox } from '@mui/material';  

export default function NeviosCheckbox({ label, checked, onChange, name, ...props }) {
  return (
    <FormGroup sx={{
      "& .MuiFormControlLabel-label": {
        fontSize: "14px",
      },
    }}>
      <FormControlLabel 
        control={
          <Checkbox 
            checked={checked} 
            onChange={onChange} 
            name={name}
            {...props}
          />
        } 
        label={label} 
      />
    </FormGroup>
  );
}
