import { CSSProperties, useState } from 'react';
import { ChromePicker } from 'react-color';
import { Box } from '@mui/material';

interface Props {
  value: string
  changeHandler: (value: string) => void
}

const CustomColorPicker = ({ value, changeHandler }: Props) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  // State to manage the color value
  const [currentColor, setCurrentColor] = useState(value || '#ffffff');

  const popover: CSSProperties = {
    position: 'absolute',
    zIndex: '2',
  };

  const cover: CSSProperties = {
    position: 'fixed',
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
  };

  const handleClick = () =>
    setDisplayColorPicker(!displayColorPicker);

  const handleChange = (color: { hex: string }) => {
    setCurrentColor(color.hex);
    changeHandler?.(color.hex)
  };

  const handleClose = () =>
    setDisplayColorPicker(false);


  return (
    <Box>
      <button onClick={handleClick} style={{ width: '20px', height: '20px', background: currentColor, outline: 'none' }}></button>
      {displayColorPicker ? (
        <div style={popover}>
          <div style={cover} onClick={handleClose} />
          <ChromePicker color={currentColor} onChange={handleChange} />
        </div>
      ) : null}
    </Box>
  );
};

export default CustomColorPicker;
