import React from 'react';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/system';
import InputAdornment from '@mui/material/InputAdornment';

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '40px',
    backgroundColor: 'white',

  },
  width: '40%',
  
});

function Input({ onChange }) {
  return (
    <StyledTextField
      variant="outlined"
      onChange={onChange}
      fullWidth
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            HTTPS :
          </InputAdornment>
        ),
      }}
    />
  );
}

export default Input;
