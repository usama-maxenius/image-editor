// import { Box, IconButton } from "@mui/material"
// import ImageViewer from "../Image"
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import { styles } from "../Canvas/index.style";

// interface Props {
//   canvas: fabric.Canvas
//   setToolsStep: (step: string) => void
//   toolsStep: string
// }

// const Sidebar = ({ toolsStep, canvas, setToolsStep }: Props) => {
//   return (
//     <div style={{ width: '300px', height: '480px', padding: '10px' }}>
//       {toolsStep == 'bg' &&
//         <div>
//           <h4 style={{ margin: '0px', padding: '0px' }}>From Article</h4>

//           <ImageViewer clickHandler={(img: string) => updateBackgroundImage(img)} images={initialData.backgroundImages} />

//           <h4 style={{ margin: '0px', padding: '0px' }}>AI Images</h4>

//           <ImageViewer clickHandler={(img: string) => updateBackgroundImage(img)} images={initialData.backgroundImages} />

//           <Box {...styles.uploadBox}>
//             <label style={styles.uploadLabel}>

//               <h4>IMAGE UPLOAD</h4>

//               <form method="post" encType="multipart/form-data">
//                 <input type="file"
//                   onChange={(event) => uploadImage(event, "backgroundImages")} style={{ display: "none" }} />
//               </form>
//               <IconButton color="primary" component="span">
//                 <CloudUploadIcon style={{ fontSize: "40px" }} />
//               </IconButton>
//             </label>
//           </Box>

//         </div>
//       }

//       {toolsStep == 'title' &&
//         <div>
//           <h4 style={{ margin: '0px', padding: '0px' }}>Titles</h4>
//           <div style={{ marginTop: '20px' }}>
//             {texts.map((text: string) => {
//               return <h5 onClick={() => {
//                 updateText({ ...overlayTextFiltersState, text })
//                 setOverlayTextFiltersState((prev) => ({ ...prev, text }))
//               }} style={{ margin: '0px', marginBottom: '15px', cursor: 'pointer', color: '#a19d9d' }}>{text}</h5>
//             })}
//           </div>
//         </div>}

//       {toolsStep == 'bubble' &&
//         <div>
//           <h4 style={{ margin: '0px', padding: '0px' }}>From Article</h4>
//           <ImageViewer clickHandler={(img: string) => updateBubbleImage(img)} images={bubbles} />

//           <h4 style={{ margin: '0px', padding: '0px' }}>AI Images</h4>
//           <ImageViewer clickHandler={(img: string) => updateBubbleImage(img)} images={bubbles} />

//           <Box {...styles.uploadBox}>
//             <label style={styles.uploadLabel}>

//               <h4>IMAGE UPLOAD</h4>

//               <form method="post" encType="multipart/form-data">
//                 <input type="file"
//                   onChange={(event) => uploadImage(event, "bubbles")}
//                   style={{ display: "none" }} />
//               </form>
//               <IconButton color="primary" component="span">
//                 <CloudUploadIcon style={{ fontSize: "40px" }} />
//               </IconButton>
//             </label>
//           </Box>

//         </div>
//       }

//       {toolsStep == 'element' && <div>
//         <>
//           <Box>
//             <h4 >Choose Element</h4>
//             <Box
//               sx={{
//                 display: 'flex',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 position: 'relative'
//               }}
//             >
//               {elements.map((element: string) => {
//                 return (
//                   <img
//                     key={element}
//                     src={element}
//                     onClick={() => {
//                       const existingTextObject = getExistingObject('swipe') as fabric.Textbox | undefined;

//                       if (existingTextObject && !existingTextObject?.visible) updateTextBox(canvasRef.current, existingTextObject, { visible: !existingTextObject.visible });
//                       else createTextBox(canvasRef.current, { fill: overlayTextFiltersState.color, customType: 'swipe' });
//                     }}
//                     alt=""
//                     width='90px'
//                     style={{ cursor: 'pointer', paddingBottom: '0.5rem' }}
//                   />
//                 );
//               })}
//               <CustomColorPicker value={overlayTextFiltersState.color}
//                 changeHandler={(color: string) => {
//                   const canvas = canvasRef.current;
//                   const type = 'swipe';

//                   let existingTextObject = getExistingObject(type) as fabric.Textbox | undefined;
//                   console.log(canvas?._activeObject)
//                   if (canvas?._activeObject && canvas?._activeObject?.type === "textbox") existingTextObject = canvas?._activeObject as fabric.Textbox

//                   if (!existingTextObject) return
//                   updateTextBox(canvas, existingTextObject, { fill: color });
//                 }} />
//             </Box>
//           </Box>
//           <Box>
//             <h4>Borders</h4>
//             <Box
//               sx={{
//                 display: 'flex',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//               }}
//             >
//               {borders.map((border: string) => {
//                 return (
//                   <img
//                     key={border}
//                     src={border}
//                     onClick={() => {
//                       const imageObject = getExistingObject('borders') as fabric.Image | undefined;

//                       const canvas = canvasRef.current
//                       if (!canvas) return

//                       if (imageObject && !imageObject.visible) {
//                         imageObject.set({ visible: true });
//                         return canvasRef.current?.renderAll();
//                       } else createImage(canvasRef.current, border, {})
//                     }}
//                     alt=""
//                     width='90px'
//                     style={{ cursor: 'pointer', paddingBottom: '0.5rem' }}
//                   />
//                 );
//               })}
//               <CustomColorPicker value={overlayTextFiltersState.color}
//                 changeHandler={(color: string) => {
//                   const canvas = canvasRef.current;
//                   const type = 'borders';

//                   let existingObject = getExistingObject(type) as fabric.Image | undefined;
//                   if (canvas?._activeObject && canvas?._activeObject?.type === "image") existingObject = canvas?._activeObject as fabric.Image

//                   if (!existingObject) return
//                   const blendColorFilter = new fabric.Image.filters.BlendColor({
//                     color,
//                     mode: 'tint',
//                     alpha: 1,
//                   })
//                   updateImageProperties(canvas, existingObject, { filters: [blendColorFilter] })
//                 }}
//               />
//             </Box>
//           </Box>

//           <Box>
//             <h4>Social Tags</h4>
//             <Box
//               sx={{
//                 display: 'flex',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//               }}
//             >
//               {logos?.map((logo: string) => {
//                 return (
//                   <img
//                     key={logo}
//                     src={logo}
//                     alt=""
//                     onClick={() => {
//                       const existingTextObject = getExistingObject('hashtag') as fabric.Textbox | undefined;

//                       if (existingTextObject && !existingTextObject?.visible) updateTextBox(canvasRef.current, existingTextObject, { visible: !existingTextObject.visible });
//                       else createTextBox(canvasRef.current, { fill: overlayTextFiltersState.color, customType: 'hashtag' });
//                     }}
//                     style={{ cursor: 'pointer', paddingBottom: '0.5rem' }}
//                     width='90px'
//                   />
//                 );
//               })}
//               <CustomColorPicker value={overlayTextFiltersState.color}
//                 changeHandler={(color: string) => {
//                   const canvas = canvasRef.current;
//                   const type = 'hashtag';

//                   let existingTextObject = getExistingObject(type) as fabric.Textbox | undefined;
//                   if (canvas?._activeObject && canvas?._activeObject?.type === "textbox") existingTextObject = canvas?._activeObject as fabric.Textbox

//                   if (!existingTextObject) return
//                   updateTextBox(canvas, existingTextObject, { fill: color });
//                 }} />
//             </Box>
//           </Box>
//         </>

//       </div>}

//       {toolsStep == 'writePost' &&
//         <div>
//           <h2>Write post</h2>
//         </div>}

//     </div>
//   )
// }

// export default Sidebar

const Sidebar = () => {
  return (
    <div>Sidebar</div>
  )
}

export default Sidebar