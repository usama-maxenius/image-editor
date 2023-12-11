import { useOutletContext } from "react-router-dom";
import { useTitle } from "../../../../context/fabricContext";
import Box from "@mui/material/Box";
import { makeStyles } from "@mui/styles";
import { ColorPicker } from "primereact/colorpicker";
import { useEffect, useState } from "react";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import { hexToCSSFilter } from "hex-to-css-filter";

const useStyles = makeStyles(() => ({
  colorPicker: {
    width: "20px",
  },
}));
function BackgroundContent() {
  const classes = useStyles();
  const [tools] = useOutletContext() as any[];

  const elements = [
    {
      id: "1",
      path: "/images/sample/swipe-left.png",
    },
  ];
  const borders = [
    {
      id: "1",
      path: "/images/sample/borders.png",
    },
  ];
  const specialTags = [
    {
      id: "1",
      path: "/images/sample/special-tag.png",
    },
  ];

  const { setSpecialTag, setElementBorder, setSwipeLeft } = useTitle();

  const [color, setColor] = useState<any>("008000");
  // const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    if (!color) return;
    // const cssFilter = hexToCSSFilter(`#${color}`);
    // const filterWithoutSemicolon = cssFilter.filter.slice(0, -1);
    // setFilter(filterWithoutSemicolon);
  }, [color]);

  const handleBackgroundChange = (newBackground: string) => {
    setSpecialTag({
      color: color,
    });
  };

  return (
    <>
      {!tools ? (
        <>
          <Box>
            <h3>Choose Element</h3>
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              {elements.map((item) => {
                return (
                  <img
                    key={item.id}
                    src={item.path}
                    alt=""
                    onClick={() => handleBackgroundChange(item.path)}
                    // style={{
                    //   filter: filter,
                    // }}
                  />
                );
              })}

              <ColorPicker
                className={classes.colorPicker}
                value={color}
                onChange={(e) => {
                  setColor(e.value);
                  setSwipeLeft({
                    color: color,
                  });
                }}
              />
              <img alt="" src="/images/sample/toggle.png" />
            </Box>
          </Box>
          <Box>
            <h3>Borders</h3>
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              {borders.map((item) => {
                return (
                  <img
                    key={item.id}
                    src={item.path}
                    alt=""
                    onClick={() => handleBackgroundChange(item.path)}
                    // style={{
                    //   filter: filter,
                    // }}
                  />
                );
              })}

              <ColorPicker
                className={classes.colorPicker}
                value={color}
                onChange={(e) => {
                  setColor(e.value);
                  setElementBorder({
                    color: color,
                  });
                }}
              />
              <img alt="" src="/images/sample/toggle.png" />
            </Box>
          </Box>

          <Box>
            <h3>Special Tags</h3>
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              {specialTags.map((item) => {
                return (
                  <img
                    key={item.id}
                    src={item.path}
                    alt=""
                    onClick={() => handleBackgroundChange(item.path)}
                    // style={{
                    //   filter: filter,
                    // }}
                  />
                );
              })}

              <ColorPicker
                className={classes.colorPicker}
                value={color}
                onChange={(e) => {
                  setColor(e.value);
                  setSpecialTag({
                    color: color,
                  });
                }}
              />
              <img alt="" src="/images/sample/toggle.png" />
            </Box>
          </Box>
        </>
      ) : (
        <div> working</div>
      )}
    </>
  );
}

export default BackgroundContent;
