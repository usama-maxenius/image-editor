import { useState } from 'react';
import { ChromePicker } from 'react-color';
import { Box } from '@mui/material';
import { Popover } from 'react-tiny-popover'

interface Props {
  value: string
  changeHandler: (value: string) => void
}

const CustomColorPicker = ({ value, changeHandler }: Props) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  // State to manage the color value
  const [currentColor, setCurrentColor] = useState(value || '#ffffff');

  const handleClick = () =>
    setDisplayColorPicker(!displayColorPicker);

  const handleChange = (color: { hex: string }) => {
    setCurrentColor(color.hex);
    changeHandler?.(color.hex)
  };

  return (
    <Box sx={{
      position: 'relative',
      paddingLeft:'0.2rem',
      paddingBottom:'0.5rem'
    }}>
      <Popover
        isOpen={displayColorPicker}
        align='center'
        onClickOutside={() => setDisplayColorPicker(false)}
        positions={['top', 'bottom', 'left', 'right']} // preferred positions by priority
        content={<ChromePicker color={currentColor} onChange={handleChange} />}
      >
        <button onClick={handleClick} style={{all:'unset', width: '30px', height: '20px', background: currentColor, outline: 'none' }}></button>
      </Popover>

    </Box>
  );
};

export default CustomColorPicker;
