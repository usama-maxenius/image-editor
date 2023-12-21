// @ts-nocheck

import { styled } from '@mui/system';
import Canvas from '../Canvas';
import circleImage from "/images/sample/scott-circle-image.png";

import { useRef } from 'react';



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