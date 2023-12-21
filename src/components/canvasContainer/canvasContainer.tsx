import { styled } from '@mui/system';
import Canvas from '../Canvas';
import circleImage from "/images/sample/scott-circle-image.png";

import { useState,useRef } from 'react';



function CanvasContainer(){
  const filePath='../Templates/first.json'
  const canvasRef = useRef<fabric.Canvas | null>(null);
 
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
      const images = [
        { name: 'Nature', url: 'https://res.cloudinary.com/dkh87tzrg/image/upload/v1665486789/hlfbvilioi8rlkrumq2g.jpg' },
        { name: 'City', url: 'https://res.cloudinary.com/dkh87tzrg/image/upload/v1671791251/f86duowvpgzgrsz7rfou.jpg' },
        // { name: 'Mountains', url: 'https://example.com/mountains.jpg' },
        // Add more images as needed
      ];

      

    return(
        <>
        <StyledContainer>


            <div>
        <Canvas template={filePath} background="red" text="Hy"  image={circleImage} ref={canvasRef.current} />
        
          </div>

           
            

        </StyledContainer>
        </>
    )
}

export default CanvasContainer