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

function Input({ onChange }: any) {
  return (
    <StyledTextField
      variant="outlined"
      onChange={onChange}
      defaultValue="https://www.fox13now.com/woman-fatally-shot-by-police-after-pointing-gun-at-3-year-old-s-head?dicbo=v2-cPPTTmB&?"
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
