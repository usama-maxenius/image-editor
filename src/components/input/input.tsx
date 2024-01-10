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
      defaultValue="https://www.bbc.com/news/world-us-canada-67920129"
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
