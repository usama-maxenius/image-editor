// @ts-nocheck

import { Button, Typography, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import Input from '../../components/input/input';

import CountdownTimer from '../../components/counter/counter';
import { useState } from 'react';
import { useUrlData } from '../../context/url-context/urlState';

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

function LandingPage({ updateStep }) {
  const [givenUrl, setGivenUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUrlData, urlData } = useUrlData();

  const getData = async () => {
    updateStep((prev) => prev + 1)
    if (!loading) {
      try {
        setLoading(true);
        const response = await fetch('https://6fae-103-167-255-58.ngrok-free.app/scrapping_data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: givenUrl }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        setUrlData(data);
        setLoading(false);
        updateStep(2)
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    }
  };

  console.log(urlData);

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
