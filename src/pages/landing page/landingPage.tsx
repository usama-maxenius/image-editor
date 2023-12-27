// @ts-nocheck

import { Button, Typography, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import Input from '../../components/input/input';

import CountdownTimer from '../../components/counter/counter';
import { useState } from 'react';
import { useUrlData } from '../../context/url-context/urlState';
import { BaseURL } from '../../constants';

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

function LandingPage({ setScrappedData, updateStep }) {
  const [givenUrl, setGivenUrl] = useState('https://www.fox13now.com/woman-fatally-shot-by-police-after-pointing-gun-at-3-year-old-s-head?dicbo=v2-cPPTTmB&?');
  const [loading, setLoading] = useState(false);
  const { setUrlData, urlData } = useUrlData();

  const getData = async () => {
    // updateStep(2)
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

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        setUrlData(data);
        await setScrappedData(data);
        updateStep(2)
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    }
  };

  return (
    <StyledContainer>
      <Typography variant="h4" gutterBottom>
        Welcome to My App
      </Typography>
      <Input  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGivenUrl(e.target.value)} />
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
