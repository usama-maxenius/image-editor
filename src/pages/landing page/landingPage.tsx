import { Button, Typography, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import Input from '../../components/input/input';
import CountdownTimer from '../../components/counter/counter';
import { Dispatch, SetStateAction, useState } from 'react';
import { BaseURL } from '../../constants';
import { APIResponse } from '../../types';
import toast from 'react-hot-toast';

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

interface Props {
  setScrappedData: Dispatch<SetStateAction<APIResponse | undefined>>
  updateStep: Dispatch<SetStateAction<number>>
}
function LandingPage({ setScrappedData, updateStep }: Props) {

  const [givenUrl, setGivenUrl] = useState('https://www.bbc.com/news/world-us-canada-67920129');
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    
    if (!loading) {
      try {
        setLoading(true);
        const response = await fetch(`${BaseURL}/scrapping_data`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: givenUrl }),
        });

        const data = await response.json();

        if (!response.ok) {
          setLoading(false);
          return toast.error(data?.error)
          // return toast.error('Sorry! This URL is currently unavailable, we are working to fix this as soon as possible')
        }

        await setScrappedData(data);
        updateStep(2)
        setLoading(false);
      } catch (error) {
        if (error instanceof Error) toast.error(error.message)
        setLoading(false);
      }
    }else updateStep(2)
  };

  return (
    <StyledContainer>
      <Typography variant="h4" gutterBottom>
        Welcome to My App
      </Typography>
      <Input onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGivenUrl(e.target.value)} />
      <Button
        variant="contained"
        sx={{ mt: '30px', bgcolor: 'white', color: 'black', '&:hover': { bgcolor: 'white', color: 'black' } }}
        onClick={getData}
      >
        {loading ? <CountdownTimer /> : 'Submit'} &nbsp;&nbsp; {loading && <CircularProgress size={24} color="inherit" />}
      </Button>
    </StyledContainer>
  );
}

export default LandingPage;

