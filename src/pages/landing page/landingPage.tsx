import {  Button, Typography } from '@mui/material';
import { styled } from '@mui/system';
import Input from '../../components/input/input';
import { Link } from 'react-router-dom';


// Use the `styled` function to create styled components
const StyledContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  backgroundColor: '#151433',
  color: 'white',
  width: '100%',
});



function LandingPage() {
  return (
    <StyledContainer>
      <Typography variant="h4" gutterBottom>
        Welcome to My App
      </Typography>
      <Input onChange={''}/>
    <Link to='/templates'>  <Button variant="contained"  sx={{mt:'30px', bgcolor: 'white', color:'black','&:hover':{bgcolor: 'white', color:'black'} }}>
        Submit
      </Button></Link>
    </StyledContainer>
  );
}

export default LandingPage;
