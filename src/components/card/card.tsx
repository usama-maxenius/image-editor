import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { styled } from '@mui/system';




const StyledCard = styled(Card)(({ theme }) => ({
  height: 400,
  width: 300,
  backgroundColor: '#1E1E3C',
  color: 'white',
  backgroundImage: `url('https://png.pngtree.com/thumb_back/fh260/background/20210716/pngtree-orange-background-portrait-simple-modern-banner-image_746302.jpg')`, 
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}));

const StyledCardContent = styled(CardContent)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});
function MainCard() {
    
      
  return (
   
      <StyledCard>
        <StyledCardContent>
          <Typography variant="h4" gutterBottom>
            Welcome to My App
          </Typography>
          
        </StyledCardContent>
      </StyledCard>
    
  );
}

export default MainCard;
