import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import { styled } from '@mui/system';
import MainCard from '../../components/card/card';



function EgBanner() {
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
      

  return (
    <StyledContainer>
        <MainCard/>
     
    </StyledContainer>
  );
}

export default EgBanner;
