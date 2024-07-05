// @ts-nocheck
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import {
	Typography,
	Box,
	IconButton,
	Stack,
	FormControlLabel,
	Checkbox,
	CircularProgress,
} from '@mui/material';
import { useOnClickOutside } from 'usehooks-ts';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { styles, useStyles } from './index.style';
import ImageViewer from '../Image';
import { IEvent, IRectOptions } from 'fabric/fabric-impl';
import { BaseURL, canvasDimension, templateData } from '../../constants';
import CustomColorPicker from '../colorPicker';
import DeselectIcon from '@mui/icons-material/Deselect';
import JSZip from 'jszip';

import {
	createSnappyTextBox,
	createSwipeGroup,
	createTextBox,
	updateSwipeColor,
	updateTextBox,
} from '../../utils/TextHandler';
import { updateRect } from '../../utils/RectHandler';
import { saveJSON, hexToRgbA, saveImage } from '../../utils/ExportHandler';
import DeleteIcon from '@mui/icons-material/Delete';
import {
	createImage,
	updateImageColor,
	updateImageSource,
} from '../../utils/ImageHandler';
import { useCanvasContext } from '../../context/CanvasContext';
import { usePaginationContext } from '../../context/MultiCanvasPaginationContext';

import FontsTab from '../Tabs/EditText/FontsTab';
import {
	createHorizontalCollage,
	createVerticalCollage,
	updateHorizontalCollageImage,
	updateVerticalCollageImage,
} from '../../utils/CollageHandler';

import {
	bindBubbleEvents,
	createBubble,
	updateBubbleCircle,
	updateBubbleImageFilters,
	updateBubbleImageSrc,
	updateBubbleShadow,
} from '../../utils/BubbleHandler';
import { debounce } from 'lodash';

import GridOnIcon from '@mui/icons-material/GridOn';
import GridOffIcon from '@mui/icons-material/GridOff';

import SwipeVerticalIcon from '@mui/icons-material/SwipeVertical';

import SwipeRightIcon from '@mui/icons-material/SwipeRight';

import { textToImage } from '../../api/text-to-image/index';
import toast from 'react-hot-toast';
import SummaryForm from '../Tabs/WritePost/SummaryForm';
import {
	clearAllGuides,
	onObjectAdded,
	onObjectMoved,
} from './fabric-smart-object';
import { elementsAssets } from './config';
import { initAligningGuidelines } from '../../utils/canvasHelper';
import { initCenteringGuidelines } from '../../utils/centeringGuidelines';
import { rebindAllEvents } from '../../utils/Events';
type TemplateJSON = any;
interface PaginationStateItem {
	page: number;
	template: string;
	templateJSON: TemplateJSON;
	backgroundImage: boolean;
	diptych: string | undefined;
	filePath: string;
	opacity: number; // Changed to number
	overlayImage: string;
	placeholderImage: string;
}

interface CanvasProps {
	template: PaginationStateItem | undefined;
	updatedSeedData: Record<string, any>;
}

interface FilterState {
	overlay: number;
	text: string;
	fontSize: number;
	elementFontSize: number;
	writePostfontSize: number;
	color: string;
	fontFamily: string;
	fontWeight: number;
	charSpacing: number;
	lineHeight: number;
}

const filter =
	'brightness(0) saturate(100%) invert(80%) sepia(14%) saturate(1577%) hue-rotate(335deg) brightness(108%) contrast(88%)';

const Canvas: React.FC<CanvasProps> = React.memo(
	({ updatedSeedData, template }) => {
		const { borders, elements, backgroundImages, logos, texts, bubbles } =
			updatedSeedData;
		const {
			canvas,
			activeTab,
			updateActiveTab,
			updateCanvasContext,
			getExistingObject,
		} = useCanvasContext();
		const [activeButton, setActiveButton] = useState('Overlay');
		const [loadingState, setLoadingState] = useState(null);
		const [show, setShow] = useState('font');
		const canvasEl = useRef<HTMLCanvasElement>(null);
		const [selectedFilter] = useState<string>('');
		const [dropDown, setDropDown] = useState(true);
		const [filtersRange, setFiltersRange] = useState({
			brightness: 0,
			contrast: 0,
		});

		const handleButtonClick = (buttonType: string) =>
			setActiveButton(buttonType);

		var events = {
			object: ['added', 'moving', 'moved', 'scaled', 'selected', 'over'],
			mouse: ['down', 'up', 'moving', 'over', 'out'],
		};

		const background = ['bg-1', 'bg-2'];
		const title = ['title'];
		const bubble = [
			'bubble',
			'bubbleStroke',
			'swipeGroup',
			'bubbleClipPath',
			'strokeCircle',
		];
		const element = ['element', 'borders', 'hashtag', 'elementImg'];
		const writePost = ['writePost', 'customTypeText'];
		const res = canvas?.getObjects();

		useEffect(() => {
			if (canvas) {
				canvas?.getObjects()?.forEach((obj) => {
					if (
						activeTab === 'background' &&
						!background.includes(obj?.customType)
					) {
						obj.selectable = false;
					} else if (
						activeTab === 'title' &&
						!title.includes(obj?.customType)
					) {
						obj.selectable = false;
					} else if (
						activeTab === 'bubble' &&
						!bubble.includes(obj?.customType)
					) {
						obj.selectable = false;
					} else if (
						activeTab === 'element' &&
						!element.includes(obj?.customType)
					) {
						obj.selectable = false;
					} else if (
						activeTab === 'writePost' &&
						!writePost.includes(obj?.customType)
					) {
						obj.selectable = false;
					} else {
						obj.selectable = true;
					}
				});
				canvas.renderAll();
			}
		}, [activeTab, canvas]);

		const { paginationState, selectedPage, setSelectedPage, addPage, update } =
			usePaginationContext();

		const { userMetaData } = useCanvasContext();

		const [canvasToolbox, setCanvasToolbox] = useState({
			activeObject: null,
			isDeselectDisabled: true,
		});
		const [initialData, setInitialData] = useState({
			backgroundImages,
			bubbles,
			elements: [elements, borders],
		});

		const [overlayTextFiltersState, setOverlayTextFiltersState] =
			useState<FilterState>({
				overlay: 0.6,
				text: updatedSeedData.texts[0],
				fontSize: 16,
				elementFontSize: 24,
				writePostfontSize: 16,
				color: '#fff',
				fontFamily: 'Fira Sans',
				fontWeight: 500,
				charSpacing: 1,
				lineHeight: 1,
			});

		const [filterValues, setFilterValues] = useState({
			overlayText: {
				overlay: 0.6,
				text: '',
				fontSize: 16,
				color: '#fff',
				fontFamily: 'Fira Sans',
			},

			overlay: {
				imgUrl: template?.overlayImage,
				opacity: template?.opacity || 0.6,
			},
			bubble: {
				image: '',
				strokeWidth: 10,
				stroke: '#fff',
			},
			collage: {
				strokeWidth: 3,
				stroke: '#ffffff',
			},
		});

		const availableFilters: { name: string; filter: fabric.IBaseFilter }[] = [
			{
				name: 'grayscale',
				filter: new fabric.Image.filters.Grayscale({ grayscale: 1 }),
			},
			{ name: 'sepia', filter: new fabric.Image.filters.Sepia({ sepia: 1 }) },
			{
				name: 'invert',
				filter: new fabric.Image.filters.Invert({ invert: 1 }),
			},
			{
				name: 'sharpen',
				filter: new fabric.Image.filters.Convolute({
					matrix: [0, -1, 0, -1, 5, -1, 0, -1, 0],
				}),
			},
		];

		const classes = useStyles();
		const canvasInstanceRef = useRef(null);
		const [color, setColor] = useState('#909AE9');

		const [colorApplied, setColorApplied] = useState(false);
		const [bgColorApplied, setBgColorApplied] = useState(false);
		const [backgroundColor, setBackgroundColor] = useState('#909BEB');

		const [fontSize, setFontSize] = useState(24);
		const [fontFamily, setFontFamily] = useState('Arial');
		const [fontWeightApplied, setFontWeightApplied] = useState(false);

		//add another bubble
		const [isChecked, setIsChecked] = useState(false);

		const handleCheckboxChange = (
			event: React.ChangeEvent<HTMLInputElement>
		) => {
			setIsChecked(event.target.checked);
			deselectObj();
		};

		//--------------------

		useEffect(() => {
			const options: fabric.ICanvasOptions = {
				width: canvasDimension.width,
				height: canvasDimension.height,
				renderOnAddRemove: false,
				preserveObjectStacking: true,
				selection: true,
			};
			const canvas = new fabric.Canvas(canvasEl?.current, options);
			canvasInstanceRef.current = canvas;
			initAligningGuidelines(canvas);
			initCenteringGuidelines(canvas);
			updateCanvasContext(canvas);

			// Cleanup
			return () => {
				updateCanvasContext(null);
				canvas.dispose();
			};
		}, [canvasDimension]);

		const handleSelectionUpdated = (e) => {
			canvas?.renderAll();
			const activeObject: fabric.ActiveSelection =
				canvasInstanceRef.current!.getActiveObject();

			if (activeObject && activeObject.type === 'textbox') {
				activeObject.setSelectionStyles({
					textBackgroundColor: backgroundColor,
					textBorderColor: 'blue',
					textCornerColor: 'blue',
					textCornerSize: 12,
					textPadding: 5,
					borderDashArray: [3, 3],
					cornerStyle: 'circle', // or 'rect' for rectangular corners
					transparentCorners: false,
				});

				canvasInstanceRef.current!.renderAll();
				setColorApplied(true);
			}
		};

		const removeBackgroundColor = () => {
			const activeObject = canvasInstanceRef.current.getActiveObject();
			if (activeObject && activeObject.type === 'textbox') {
				activeObject.setSelectionStyles({ textBackgroundColor: 'transparent' });
				canvasInstanceRef.current.renderAll();
				setColorApplied(true);
			}
		};

		const applyColor = () => {
			const activeObject = canvasInstanceRef.current!.getActiveObject();
			if (activeObject && activeObject.type === 'textbox') {
				activeObject.setSelectionStyles({
					fill: color,
				});
				canvasInstanceRef.current!.renderAll();
				setColorApplied(true);
			}
		};

		const removeColor = () => {
			const activeObject = canvasInstanceRef.current.getActiveObject();
			if (activeObject && activeObject.type === 'textbox') {
				activeObject.setSelectionStyles({ fill: '#ffffff' });
				canvasInstanceRef.current.renderAll();
				setColor(color);
			}
		};

		const loadCanvas = useCallback(async () => {
			if (!canvas) return;
			const templateFound = paginationState?.find(
				(item) => item?.page === selectedPage
			);

			await new Promise((resolve) => {
				canvas?.loadFromJSON(templateFound?.templateJSON, () => {
					resolve(null);
				});
			});
		}, [canvas, template, paginationState, selectedPage]);

		useEffect(() => {
			loadCanvas();
			const handleCanvasUpdate = () => {
				const activeObject = canvas?.getActiveObject();
				const isSelectionCleared = canvas?._activeObject === null;
				return setCanvasToolbox((prev) => ({
					...prev,
					isDeselectDisabled: isSelectionCleared,
					activeObject,
				}));
			};
			const handleMouseDown = (options: IEvent<Event>) => {
				if (options.target) {
					const thisTarget = options.target as fabric.Object;
					const mousePos = canvas?.getPointer(options.e) || { x: 0, y: 0 };

					if (thisTarget.isType('group')) {
						thisTarget?.forEachObject((object: any) => {
							if (object.type === 'textbox') {
								const matrix = thisTarget.calcTransformMatrix();
								const newPoint = fabric.util.transformPoint(
									{ y: object.top, x: object.left },
									matrix
								);
								const objectPos = {
									xStart: newPoint.x - (object.width * object.scaleX) / 2,
									xEnd: newPoint.x + (object.width * object.scaleX) / 2,
									yStart: newPoint.y - (object.height * object.scaleY) / 2,
									yEnd: newPoint.y + (object.height * object.scaleY) / 2,
								};
								F;
								if (
									mousePos.x >= objectPos.xStart &&
									mousePos.x <= objectPos.xEnd &&
									mousePos.y >= objectPos.yStart &&
									mousePos.y <= objectPos.yEnd
								) {
									handleGroupClick(thisTarget, object);
								}
							}
						});
					}
				}
			};

			const handleGroupClick = (group: any, textObject: any) => {
				let groupItems: any;

				const ungroup = () => {
					groupItems = group._objects;
					group._restoreObjectsState();
					canvas?.remove(group);

					groupItems?.forEach((item: any) => {
						if (item !== textObject) {
							item.selectable = false;
						}
						canvas?.add(item);
					});

					canvas?.renderAll();
				};

				ungroup();

				canvas?.setActiveObject(textObject);
				textObject.enterEditing();
				textObject.selectAll();

				let exitEditing = true;

				textObject.on('editing:exited', () => {
					if (exitEditing) {
						const items: any[] = [];
						groupItems?.forEach((obj: any) => {
							items.push(obj);
							canvas?.remove(obj);
						});

						const grp = new fabric.Group(items, {
							customType: 'swipeGroup',
						});
						canvas?.add(grp);
						exitEditing = false;
					}
				});
			};

			canvas?.on('mouse:down', handleMouseDown);
			canvas?.on('selection:created', handleCanvasUpdate);
			canvas?.on('selection:updated', handleCanvasUpdate);
			canvas?.on('selection:cleared', handleCanvasUpdate);

			// Cleanup the event listeners when the component unmounts
			return () => {
				canvas?.off('selection:created', handleCanvasUpdate);
				canvas?.off('selection:updated', handleCanvasUpdate);
				canvas?.off('selection:cleared', handleCanvasUpdate);
			};
		}, [loadCanvas]);

		const updateBubbleImageContrast = () => {
			const activeObject = canvas?.getActiveObject();

			if (activeObject && activeObject.type === 'image') {
				// Check if the active object is an image
				let contrast = bubbleFilter.contrast; // Get the contrast value

				// Ensure contrast is within valid range
				if (contrast < -1) {
					contrast = -1;
				} else if (contrast > 1) {
					contrast = 1;
				}

				// Modify the contrast of the image
				activeObject.filters = []; // Clear existing filters
				activeObject.filters.push(
					new fabric.Image.filters.Contrast({ contrast })
				);
				activeObject.applyFilters();

				canvas?.renderAll(); // Render the canvas to see the changes
			}
		};

		const updateBubbleImageBrightness = () => {
			const activeObject = canvas?.getActiveObject();

			if (activeObject && activeObject.type === 'image') {
				// Check if the active object is an image
				let brightness = bubbleFilter.brightness; // Get the brightness value

				// Ensure brightness is within valid range
				if (brightness < -1) {
					brightness = -1;
				} else if (brightness > 1) {
					brightness = 1;
				}

				// Modify the brightness of the image
				activeObject.filters = []; // Clear existing filters
				activeObject.filters.push(
					new fabric.Image.filters.Brightness({ brightness })
				);
				activeObject.applyFilters();

				canvas?.renderAll(); // Render the canvas to see the changes
			}
		};

		const updateBubbleImage = (
			imgUrl: string | undefined,
			filter?: { strokeWidth: number; stroke: string },
			shadow?: {
				color: string;
				offsetX: number;
				offsetY: number;
				blur: number;
			},
			brightness?: number
		) => {
			const existingBubbleStroke =
				canvas?.getActiveObject() || getExistingObject('bubbleStroke');
			if (!canvas) {
				console.error('Canvas Not initialized');
				return;
			}
			const activeObject = canvas.getActiveObject();
			if (shadow) {
				const activeBubble = canvas.getActiveObject();
				const newOptions: fabric.ICircleOptions = {
					shadow: {
						color: shadow.color || 'rgba(0,0,0,0.5)',
						offsetX: shadow.offsetX || 10,
						offsetY: shadow.offsetY || 10,
						blur: shadow.blur || 1,
					},
				};
				updateBubbleShadow(canvas, activeBubble, newOptions);
				canvas.renderAll();
				return;
			}
		};
		/**
		 * Updates the background filters of the canvas.
		 * @param {IBaseFilter} filter - The filter to be applied to the background image.
		 * @return {void} This function does not return anything.
		 */

		const updateBackgroundFilters = debounce(
			(filter: fabric.IBaseFilter, type: string): void => {
				if (!canvas) return;

				const bgImages = ['bg-1'];

				if (!template?.backgroundImage) bgImages.push('bg-2');

				for (const customType of bgImages) {
					const existingObject: fabric.Image | undefined = getExistingObject(
						customType
					) as fabric.Image;
					if (existingObject) {
						const hasBrightnessOrContrast =
							filter.hasOwnProperty('brightness') ||
							filter.hasOwnProperty('contrast');

						const index: number | undefined = existingObject.filters?.findIndex(
							(fil) => fil[type as any]
						);

						if (type === 'sharpen') {
							// Check if sharpen filter is already applied
							const sharpenIndex = existingObject.filters?.findIndex(
								(fil) => fil instanceof fabric.Image.filters.Convolute
							);
							if (sharpenIndex !== -1) {
								// Remove sharpen filter
								existingObject.filters?.splice(sharpenIndex, 1);
							} else {
								// Add sharpen filter
								existingObject.filters?.push(filter);
							}
						} else if (index !== -1) {
							existingObject.filters?.splice(index as number, 1, filter);
							if (!hasBrightnessOrContrast)
								existingObject.filters?.splice(index as number, 1);
						} else {
							existingObject.filters?.push(filter);
						}
						existingObject.applyFilters();
						canvas.renderAll();
					}
				}
			},
			200
		);

		//vertical to horizontal line
		const [isSelected, setIsSelected] = useState(false);
		//---------------------------------Canvas---------------------------------------------

		function draw_grid(canvasRef, grid_size) {
			const canvas = canvasRef.current;
			if (!canvas) return; // Check if canvasRef is valid

			const ctx = canvas?.getContext('2d');
			const currentCanvasWidth = canvas.width;
			const currentCanvasHeight = canvas.height;

			// Drawing vertical lines
			let x;
			for (x = 0; x <= currentCanvasWidth; x += grid_size) {
				ctx.moveTo(x + 0.5, 0);
				ctx.lineTo(x + 0.5, currentCanvasHeight);
			}

			// Drawing horizontal lines
			let y;
			for (y = 0; y <= currentCanvasHeight; y += grid_size) {
				ctx.moveTo(0, y + 0.5);
				ctx.lineTo(currentCanvasWidth, y + 0.5);
			}

			ctx.strokeStyle = '#ebebeb';
			ctx.stroke();
		}

		const [gridShow, setGridShow] = useState<boolean>(false);

		const darw_Grid_btn = () => {
			if (gridShow) {
				setGridShow(false);
				deselectObj();
			} else {
				setGridShow(true);
				if (canvasEl.current) {
					draw_grid(canvasEl, 15);
				}
			}
		};

		const toggleSelection = () => {
			setIsSelected(!isSelected);
			if (isSelected) {
				const activeObject = canvas?.getActiveObject();
				if (activeObject) {
					if (activeObject && activeObject.type === 'textbox') {
						const textbox = activeObject as fabric.Textbox;
						const newText = textbox.text.split('').join('\n');

						textbox.set({
							// ...options,
							text: newText,
							visible: true,
							width: 25,
							top: 10,
							left: 100,
							fontSize: 12,
						});
						// canvas?.add(textboxObj);

						canvas?.requestRenderAll();
						canvas?.discardActiveObject();
						canvas?.renderAll();
					} else {
						toast.error('Textbox not found or not active');
					}
				} else {
					toast.error('Not Selected Text');
				}
			} else {
				const activeObject = canvas?.getActiveObject();

				if (activeObject) {
					// Check if the active object exists and is of type "textbox"
					if (activeObject && activeObject.type === 'textbox') {
						const textbox = activeObject as fabric.Textbox;

						// Split the text into an array of characters and join them with newline characters
						const newText = textbox.text.split('').join('\n');
						let characters = newText.split('\n');

						// Step 2: Join the characters together
						let originalText = characters.join('');

						textbox.set({
							// ...other options,
							text: originalText,
							visible: true,
							width: 305,
							top: 500,
							left: 50,
							fontSize: 16,
							textAlign: 'center',
							originY: 'center',
						});

						// canvas?.add(textboxObj);
						// Render the canvas
						canvas?.requestRenderAll();
						canvas?.discardActiveObject();
						canvas?.renderAll();
					} else {
						toast.error('Textbox not found or not active');
					}
				} else {
					toast.error('Not Selected Text');
				}
			}
		};
		//------------------------------------------------------------------------------------

		//old code
		const updateBackgroundImage = debounce((imageUrl: string) => {
			if (!canvas) return;

			let activeObject: fabric.Object | undefined | null =
				canvas.getActiveObject() || getExistingObject('bg-1');

			if (!template.backgroundImage && !canvas.getActiveObject()) {
				let currentImageIndex = initialData.backgroundImages?.findIndex(
					(bgImage: string) => bgImage === imageUrl
				);
				activeObject = getExistingObject(
					currentImageIndex % 2 === 0 ? 'bg-1' : 'bg-2'
				);
			}

			let currentImageIndex = initialData.backgroundImages?.findIndex(
				(bgImage: string) => bgImage === imageUrl
			);

			if (!activeObject) {
				if (template?.diptych === 'horizontal') {
					if (currentImageIndex !== undefined && currentImageIndex % 2 === 0) {
						createHorizontalCollage(canvas, [imageUrl, null]);
					} else if (
						currentImageIndex !== undefined &&
						currentImageIndex % 2 !== 0
					) {
						createHorizontalCollage(canvas, [null, imageUrl]);
					}
				} else if (template?.diptych === 'vertical') {
					if (currentImageIndex !== undefined && currentImageIndex % 2 === 0) {
						createVerticalCollage(canvas, [imageUrl, null]);
					} else if (
						currentImageIndex !== undefined &&
						currentImageIndex % 2 !== 0
					) {
						createVerticalCollage(canvas, [null, imageUrl]);
					}
					return;
				}
			}

			if (!activeObject) return console.log('Still Object not found');

			if (template?.backgroundImage || !template?.diptych)
				updateImageSource(canvas, imageUrl, activeObject);
			else if (template?.diptych === 'vertical')
				updateVerticalCollageImage(canvas, imageUrl, activeObject);
			else updateHorizontalCollageImage(canvas, imageUrl, activeObject);
		}, 100);

		//--------------------out Selected or Disselected-----------------

		//-------------------------------------------------------------
		const updateOverlayImage = debounce((image: string, opacity: number) => {
			if (!canvas) {
				console.log('Canvas not loaded yet');
				return;
			}

			const existingObject = getExistingObject('overlay');

			const canvasWidth: number | undefined = canvas.width;
			const canvasHeight: number | undefined = canvas.height;

			if (!canvasWidth || !canvasHeight) return;

			if (existingObject) {
				existingObject.animate(
					{ opacity: opacity },
					{
						duration: 200,
						onChange: canvas.renderAll.bind(canvas),
					}
				);

				return;
			} else {
				fabric.Image.fromURL(
					image,
					function (img) {
						img.scaleToWidth(canvas.width || 0);
						img.scaleToHeight(canvas.height || 0);
						img.set({
							opacity: +opacity || 1,
							selectable: false,
							perPixelTargetFind: false,
							evented: false,
						});
						img.customType = 'overlay';
						canvas.insertAt(img, 3, false);
						requestAnimationFrame(() => {
							canvas.renderAll();
						});
					},
					{
						crossOrigin: 'anonymous',
					}
				);
			}
		}, 100);

		const updateRectangle = (options: IRectOptions) => {
			if (!canvas) return;

			const existingObject = getExistingObject('photo-border');

			if (existingObject)
				updateRect(existingObject, {
					...options,
					top: existingObject?.top,
					left: existingObject.left,
					customType: 'photo-border',
				});
			canvas.requestRenderAll();
		};

		/**
		 * Uploads an image and updates the initial data.
		 * @param {React.ChangeEvent<HTMLInputElement>} event - The event triggered by the input element.
		 * @param {keyof typeof initialData} field - The field in the initialData object to update.
		 * @return {void} This function does not return a value.
		 */
		const uploadImage = (
			event: React.ChangeEvent<HTMLInputElement>,
			field: keyof typeof initialData
		): void => {
			const files = event.target.files;
			if (!files || files.length === 0) return;

			setInitialData((prev) => ({
				...prev,
				[field]: [URL.createObjectURL(files[0]), ...prev[field]],
			}));
		};

		const deselectObj = () => {
			canvas?.discardActiveObject();
			canvas?.renderAll();

			requestAnimationFrame(() => {
				setCanvasToolbox((prev) => ({
					...prev,
					activeObject: null,
					isDeselectDisabled: true,
				}));
			});
		};

		const deleteActiveSelection = () => {
			if (!canvas) return;
			canvas.remove(canvas._activeObject);
			canvas.requestRenderAll();
		};

		const [value, setValue] = React.useState(0);

		const handleChange = (_event: React.SyntheticEvent, newValue: number) =>
			setValue(newValue);

		const flipImage = (flipAxis: 'flipX' | 'flipY' = 'flipX') => {
			const activeObject = canvas?.getActiveObject();
			if (activeObject) {
				activeObject[flipAxis] = !activeObject[flipAxis];
				canvas?.renderAll();
			}
		};

		const debouncedUpdateRectangle = debounce((strokeWidth) => {
			if (!canvas) {
				console.log('Canvas not found');
				return;
			}
			const existingObject = getExistingObject('photo-border') as fabric.Rect;

			if (template?.diptych === 'horizontal') {
				updateRectangle({
					selectable: true,
					lockMovementX: existingObject.lockMovementX,
					lockMovementY: existingObject.lockMovementY,
					strokeWidth,
					left: canvas?.getWidth() / 2 - strokeWidth / 2,
				});
			} else {
				updateRectangle({
					selectable: true,
					lockMovementX: existingObject.lockMovementX,
					lockMovementY: existingObject.lockMovementY,
					strokeWidth,
					top: canvas?.getHeight() / 2 - strokeWidth / 2,
				});
			}
		}, 100);

		const borderColorChangeHandler = (imgShape: any) => {
			const color = userMetaData?.company?.color || '#909AE9';

			var filter = new fabric.Image.filters.BlendColor({
				color,
				mode: 'tint',
				alpha: 1,
			});
			const left = Math.random() * (400 - 100) + 100;
			const top = Math.random() * (400 - 200) + 100;
			fabric.Image.fromURL(
				imgShape,
				function (img) {
					const snappyImg = new fabric.Image(img.getElement(), {
						left: left,
						top: top,
						scaleX: 0.2,
						scaleY: 0.2,
					});
					snappyImg.customType = 'elementImg';
					snappyImg.filters.push(filter);
					snappyImg.applyFilters();
					canvas.add(snappyImg);

					requestAnimationFrame(() => {
						canvas.renderAll();
					});
				},
				{
					crossOrigin: 'anonymous',
				}
			);
		};

		const swipeColorChangeHandler = (id: any, swipeImg: any) => {
			const color = userMetaData?.company?.color || '#909AE9';

			var filter = new fabric.Image.filters.BlendColor({
				color: color,
				mode: 'tint',
				alpha: 1,
			});

			const left = Math.random() * (450 - 100) + 100;
			const top = Math.random() * (500 - 100) + 100;

			fabric.Image.fromURL(
				swipeImg,
				function (img) {
					const snappyImg = new fabric.Image(img.getElement(), {
						left: left,
						top: top,
						scaleX: 0.2,
						scaleY: 0.2,
					});
					// snappyImg.customType = 'swipeGroup';
					snappyImg.customType = 'elementImg';
					snappyImg.filters.push(filter);
					snappyImg.applyFilters();
					snappyImg.on('moving', function () {
						snappyImg.hasControls = false;
						snappyImg.hasBorders = false;
					});
					snappyImg.on('mouseup', function () {
						snappyImg.set({
							hasControls: true,
							hasBorders: true,
						});
						snappyImg.canvas.renderAll();
					});
					canvas.add(snappyImg);
					requestAnimationFrame(() => {
						canvas.renderAll();
					});
				},
				{
					crossOrigin: 'anonymous',
				}
			);
		};
		const dividerColorChangeHandler = (imgShape: any) => {
			const color = userMetaData?.company?.color || '#909AE9';

			var filter = new fabric.Image.filters.BlendColor({
				color,
				mode: 'tint',
				alpha: 1,
			});
			const left = Math.random() * (400 - 100) + 100;
			const top = Math.random() * (500 - 300) + 100;
			fabric.Image.fromURL(
				imgShape,
				function (img) {
					const snappyImg = new fabric.Image(img.getElement(), {
						left: left,
						top: top,
						scaleX: 0.2,
						scaleY: 0.2,
					});
					snappyImg.customType = 'elementImg';
					snappyImg.filters.push(filter);
					snappyImg.applyFilters();
					canvas.add(snappyImg);

					requestAnimationFrame(() => {
						canvas.renderAll();
					});
				},
				{
					crossOrigin: 'anonymous',
				}
			);
		};

		const findHighestPageNumber = (
			paginationState: PaginationStateItem[]
		): number => {
			let highestPageNumber = 0;

			paginationState?.forEach((item) => {
				if (item.page > highestPageNumber) {
					highestPageNumber = item.page;
				}
			});

			return highestPageNumber + 1;
		};

		//loading page state
		const [pageLoading, setPageLoading] = useState<boolean>(false);

		const addTemplate = async () => {
			const currentTemplateJSON = await saveJSON(canvas, true);

			await update(selectedPage, { templateJSON: currentTemplateJSON });

			const highestPageNumber = findHighestPageNumber(paginationState);

			const templateFound = templateData.templates?.find(
				(item) => item.filePath === paginationState[0].filePath
			);

			let templateJSON;

			try {
				templateJSON = await import(
					`../../constants/templates/${template.filePath}.json`
				);
			} catch (error) {
				console.error('Error importing JSON file:', error);
				return;
			}

			const obj = {
				page: highestPageNumber,
				filePath: templateFound.filePath,
				templateJSON: templateJSON,
				...templateFound,
			};
			// console.log('🚀 ~ addTemplate ~ obj:', obj);

			// addPage(obj);
			setSelectedPage(highestPageNumber);
			setPageLoading(true);
			setTimeout(() => {
				addPage(obj);
				loadCanvas(highestPageNumber);
				setPageLoading(false);
				updateActiveTab('background');
			}, 3000);
		};
		//pagination click--------handler-----------

		const handleClickPagination = async (item) => {
			const currentTemplateJSON = await saveJSON(canvas, true);
			deselectObj();
			await update(selectedPage, {
				templateJSON: currentTemplateJSON,
			});
			await setSelectedPage(item?.page);

			// load the template
			await new Promise((resolve) => {
				canvas?.loadFromJSON(item?.templateJSON, () => {
					resolve(null);
				});
			});

			// rebind the events
			setTimeout(() => {
				rebindAllEvents(canvas);
			}, 500);

			canvas.renderAll();
		};

		const exportMultiCanvases = async () => {
			const zip = new JSZip();
			for (const page of paginationState) {
				await new Promise((resolve) => {
					canvas?.loadFromJSON(page?.templateJSON, () => {
						resolve(null);
					});
				});
				// Extract image data from canvas
				const imageData = canvas?.toDataURL({ format: 'jpeg' });
				// Add image data to zip file
				zip.file(`page_${page?.page}.jpeg`, imageData.split('base64,')[1], {
					base64: true,
				});
			}
			// Generate zip file
			const zipBlob = await zip.generateAsync({ type: 'blob' });
			// Convert blob to URL
			const zipUrl = URL.createObjectURL(zipBlob);
			// Create a link element
			const link = document.createElement('a');
			link.href = zipUrl;
			link.download = 'exported_images.zip';
			// Simulate click on the link to trigger download
			document.body.appendChild(link);
			link.click();
			// Cleanup
			document.body.removeChild(link);
			URL.revokeObjectURL(zipUrl);
		};

		const [shadowValues, setShadowValues] = useState({
			opacity: 0.5, // Initial opacity value
			distance: 10, // Initial distance value
			blur: 5, // Initial blur radius value
		});
		const [elementShadowValues, setElementShadowValues] = useState({
			opacity: 0.5, // Initial opacity value
			distance: 10, // Initial distance value
			blur: 5, // Initial blur radius value
		});

		const [hexConversionForElement, setHexConversionForElement] =
			useState<'rgba(0,0,0,1)'>('rgba(0,0,0,1)');
		const [bubbleFilter, setBubbleFilter] = useState({
			contrast: '',
			brightness: '',
		});
		const [elementOpacity, setElementOpacity] = useState<number>(1);

		const updateElementOpacity = () => {
			const activeObject = canvas?.getActiveObject();

			if (activeObject && activeObject.type === 'image') {
				let opacity = elementOpacity;

				// Ensure opacity is within valid range
				if (opacity < 0) {
					opacity = 0;
				} else if (opacity > 1) {
					opacity = 1;
				}

				// Modify the opacity of the image
				activeObject.set('opacity', opacity);
				canvas?.renderAll(); // Render the canvas to see the changes
			}
		};

		const updateElementShadow = (
			imgUrl: string | undefined,
			filter?: { strokeWidth: number; stroke: string },
			shadow?: {
				color: string;
				offsetX: number;
				offsetY: number;
				blur: number;
			},
			brightness?: number
		) => {
			const activeObject = canvas?.getActiveObject();

			if (activeObject) {
				// Check if the active object exists
				const { offsetX, offsetY, blur } = shadowValues;

				activeObject.set({
					shadow: {
						color: shadow.color || 'rgba(0,0,0,0.5)',
						offsetX: shadow.offsetX || 10,
						offsetY: shadow.offsetY || 10,
						blur: shadow.blur || 1,
					},
				});
				canvas?.renderAll(); // Render the canvas to see the changes
			}
		};
		const [hexConvertion, setHexConversion] = useState<string | null>(null);

		// ------------------------save all templates--------------------------------
		const [templateSaved, setTemplateSaved] = useState<Boolean>(false);

		const handleSaveTemplate = async (event) => {
			const currentTemplateJSON = await saveJSON(canvas, true);
			setTemplateSaved(true);

			update(selectedPage, {
				templateJSON: currentTemplateJSON,
			});

			await loadCanvas(selectedPage);
		};
		const handleExport = async () => {
			if (templateSaved) {
				await exportMultiCanvases();
				setTemplateSaved(false);
			} else {
				toast.error('Please save all templates before exporting.');
			}
		};

		useEffect(() => {
			if (templateSaved) {
				setTimeout(async () => {
					await handleExport();
				}, 2000);
			}
		}, [templateSaved]);

		const hashTagValue = userMetaData?.company?.name
			? `@${userMetaData?.company?.name}`
			: '@COMPANYSOCIAL';
		//--------------------------write post-------------------
		const [summaryContent, setSummaryContent] = useState<{ content: string }>({
			content: ``,
			// hashTags: [],
		});

		const handleSelectionChanged = () => {
			clearAllGuides(canvas);
		};

		let dndBackground = useRef(false);
		let dndBubble = useRef(false);

		const handleDrop = (e) => {
			// e.preventDefault();

			const imageUrl = e.dataTransfer.getData('text/uri-list');
			if (dndBubble.current && !dndBackground.current) {
				const activeBubble = canvas?.getActiveObject();

				if (isChecked && activeBubble?.customType === 'bubbleStroke') {
					canvas.discardActiveObject();
					canvas?.renderAll();
				}
				updateBubbleImage(imageUrl);
				dndBubble.current = false;
				return;
			}
			if (dndBackground?.current && !dndBubble.current) {
				updateBackgroundImage(imageUrl);
				dndBackground.current = false;
				return;
			}

			const plainText = e.dataTransfer.getData('text/plain');
			// if (!plainText || !imageUrl) return;

			if (imageUrl && !dndBubble.current) {
				const imageUrl = e.dataTransfer.getData('text/plain');

				const color = userMetaData?.company?.color || '#909AE9';

				var filter = new fabric.Image.filters.BlendColor({
					color,
					mode: 'tint',
					alpha: 1,
				});

				const left = Math.random() * (450 - 100) + 100;
				const top = Math.random() * (500 - 100) + 100;

				fabric.Image.fromURL(
					imageUrl,
					function (img) {
						img.set({ left: left, top: top }).scale(0.2);
						// img.filters.push(filter);
						// img.applyFilters();
						canvas.add(img);
						requestAnimationFrame(() => {
							canvas.renderAll();
						});
					},
					{
						crossOrigin: 'anonymous',
					}
				);
			} else if (plainText) {
				const text = plainText;

				return createTextBox(canvas, {
					text,
					customType: 'title',
					fill: '#fff',
					width: 303,
					height: 39,
					top: 504,
					left: 34,
					scaleX: 1.53,
					scaleY: 1.53,
					fontSize: 16,
				});
			} else {
				const files = e.dataTransfer.files;
				if (files.length > 0) {
					const file = files[0];
					const isImage = file.type.startsWith('image/');
					if (isImage) {
						console.log('Image file dropped:', file);
					} else {
						console.log('Non-image file dropped:', file);
					}
				} else {
					console.log('No plain text, image URL, or file dropped.');
				}
			}
		};

		const handleDragOver = (e: any) => {
			e.preventDefault();
		};

		const handleDragStart = (
			e: any,
			imageUrl: any,
			background: any,
			bubble: any
		) => {
			if (bubble) {
				dndBubble.current = true;

				const dt = e.dataTransfer;
				dt.setData('text/plain', imageUrl);
			}
			if (background && !bubble) {
				dndBackground.current = true;
				const dt = e.dataTransfer;
				dt.setData('text/plain', imageUrl);
			} else {
				dndBackground.current = false;

				const dt = e.dataTransfer;
				dt.setData('text/plain', imageUrl);
			}
		};

		useEffect(() => {
			if (!canvas) return;
			canvas?.on('selection:created', handleSelectionChanged);
			canvas?.on('selection:updated', handleSelectionChanged);
			canvas?.on('selection:cleared', handleSelectionChanged);

			canvas?.wrapperEl?.addEventListener('drop', handleDrop);
			canvas?.wrapperEl?.addEventListener('dragover', handleDragOver);

			return () => {
				canvas.off('selection:created', handleSelectionChanged);
				canvas.off('selection:updated', handleSelectionChanged);
				canvas.off('selection:cleared', handleSelectionChanged);
				canvas?.wrapperEl?.removeEventListener('drop', handleDrop);
				canvas?.wrapperEl?.removeEventListener('dragover', handleDragOver);
			};
		}, [canvas]);
		// here come

		const [prompt, setPrompt] = useState('');
		const [generatedImages, setGeneratedImages] = useState([]);

		React.useEffect(() => {
			if (updatedSeedData?.texts[0]) {
				setPrompt(updatedSeedData.texts[0]);
			}
		}, [updatedSeedData]);

		const generateTextToImageHanlder = async (promptText) => {
			setLoadingState('textToImage');

			const response = await textToImage(
				promptText?.length > 0 ? promptText : prompt
			);
			// const newImageUrl = response?.image_url;
			const newImageUrl = `${BaseURL}/${response?.image_url}`;

			if (newImageUrl) setGeneratedImages((prev) => [...prev, newImageUrl]);
			setLoadingState(null);
		};

		const handleKeyPress = (e) => {
			if (e.key === 'Enter') {
				generateTextToImageHanlder();
			}
		};
		// 	// Add event listeners
		const canvasRef = useRef(null);
		const handleClickOutside = (event) => {
			if (!canvas) {
				return;
			}

			// Define the IDs of the elements you want to check
			const elementIDs = [
				'element',
				'canvasID',
				'custom-slider',
				'react-tiny-popover-container',
				'AiBubbleID',
			];
			let isClickInside = false;

			elementIDs.forEach((id) => {
				const element = document.getElementById(id);

				// Check if the click is inside any of the elements
				if (element && element.contains(event.target)) {
					isClickInside = true;
				}
			});

			// If the click is outside all specified elements, discard the active object
			if (!isClickInside) {
				canvas.discardActiveObject();
				canvas.renderAll();
			}
		};

		useOnClickOutside(canvasRef, handleClickOutside);

		const hashtags = [
			userMetaData?.company?.logo,
			userMetaData?.company?.logo2,
			userMetaData?.company?.logo3,
		]?.filter((itm) => itm);

		// Right Click  disSelected
		window.oncontextmenu = function () {
			deselectObj();
			canvas.renderAll();
		};

		return (
			<div
				style={{
					display: 'flex',
					columnGap: '50px',
					marginTop: 20,
					marginBottom: 50,
					// border: '2px solid red',
				}}
			>
				<div>
					<div
						ref={canvasRef}
						style={
							{
								// border: '2px solid yellow',
							}
						}
					>
						<Box id='canvasID'>
							<div
								style={{
									background: `repeating-linear-gradient(
										transparent,
										transparent 10px,
										rgba(0, 0, 0, 0.1) 11px
									),
									repeating-linear-gradient(
										90deg,
										transparent,
										transparent 10px,
										rgba(0, 0, 0, 0.1) 11px
									)`,
								}}
							>
								<DeselectIcon
									color={
										canvasToolbox.isDeselectDisabled ? 'disabled' : 'inherit'
									}
									aria-disabled={canvasToolbox.isDeselectDisabled}
									onClick={deselectObj}
									sx={{
										cursor: 'pointer',
									}}
								/>

								<DeleteIcon
									color={
										canvasToolbox.isDeselectDisabled ? 'disabled' : 'inherit'
									}
									aria-disabled={canvasToolbox.isDeselectDisabled}
									onClick={deleteActiveSelection}
									sx={{
										cursor: 'pointer',
										mx: 0.5,
									}}
								/>
								<img
									src='/icons/flipX.svg'
									className={
										!canvasToolbox.isDeselectDisabled ? 'filter-white' : ''
									}
									style={{
										width: 25,
										height: 25,
										margin: '0 0.3rem',
										cursor: 'pointer',
									}}
									onClick={() => flipImage('flipX')}
								/>
								<img
									src='/icons/flipY.svg'
									className={
										!canvasToolbox.isDeselectDisabled ? 'filter-white' : ''
									}
									style={{
										width: 25,
										height: 25,
										cursor: 'pointer',
										marginLeft: 1.5,
										marginRight: 1.5,
									}}
									onClick={() => flipImage('flipY')}
								/>

								{gridShow ? (
									<GridOnIcon
										color={
											canvasToolbox.isDeselectDisabled ? 'disabled' : 'inherit'
										}
										aria-disabled={canvasToolbox.isDeselectDisabled}
										onClick={darw_Grid_btn}
										sx={{
											cursor: 'pointer',
											mx: 0.5,
										}}
									/>
								) : (
									<GridOffIcon
										color={
											canvasToolbox.isDeselectDisabled ? 'disabled' : 'inherit'
										}
										aria-disabled={canvasToolbox.isDeselectDisabled}
										onClick={darw_Grid_btn}
										sx={{
											cursor: 'pointer',
											mx: 0.5,
										}}
									/>
								)}

								{isSelected ? (
									<SwipeVerticalIcon
										color={
											canvasToolbox.isDeselectDisabled ? 'disabled' : 'inherit'
										}
										aria-disabled={canvasToolbox.isDeselectDisabled}
										onClick={toggleSelection}
										sx={{
											cursor: 'pointer',
											ml: 0.5,
										}}
									/>
								) : (
									<SwipeRightIcon
										color={
											canvasToolbox.isDeselectDisabled ? 'disabled' : 'inherit'
										}
										aria-disabled={canvasToolbox.isDeselectDisabled}
										onClick={toggleSelection}
										sx={{
											cursor: 'pointer',
										}}
									/>
								)}
							</div>

							<canvas width='1080' height='500' ref={canvasEl} />
							{/* Footer Panel  Start*/}
							{activeTab == 'background' && dropDown && (
								<div
									style={{
										width: '555px',
										height: '90px',
									}}
								>
									<Paper className={classes.root}>
										<div
											className={classes.optionsContainer}
											style={{
												display: 'flex',
												justifyContent: 'space-evenly',
												paddingTop: '4px',
											}}
										>
											<Button
												className={`${classes.button} ${
													activeButton === 'Overlay' && classes.buttonActive
												}`}
												variant='text'
												color='primary'
												onClick={() => handleButtonClick('Overlay')}
											>
												Overlay
											</Button>
											<Button
												className={`${classes.button} ${
													activeButton === 'Brightness' && classes.buttonActive
												}`}
												variant='text'
												color='primary'
												onClick={() => handleButtonClick('Brightness')}
											>
												Brightness
											</Button>
											<Button
												className={`${classes.button} ${
													activeButton === 'Contrast' && classes.buttonActive
												}`}
												variant='text'
												color='primary'
												onClick={() => handleButtonClick('Contrast')}
											>
												Contrast
											</Button>
											<Button
												className={`${classes.button} ${
													activeButton === 'Filters' && classes.buttonActive
												}`}
												variant='text'
												color='primary'
												onClick={() => handleButtonClick('Filters')}
											>
												Filter
											</Button>

											{template?.diptych && !template?.backgroundImage ? (
												<Button
													className={`${classes.button} ${
														activeButton === 'border' && classes.buttonActive
													}`}
													variant='text'
													color='primary'
													onClick={() => handleButtonClick('border')}
												>
													Border
												</Button>
											) : null}
										</div>
										{activeButton === 'Overlay' && (
											<div className={classes.sliderContainer}>
												<Slider
													className={classes.slider}
													aria-label='Overlay, Brightness, Contrast'
													color='secondary'
													value={filterValues.overlay.opacity ?? 0.6}
													min={0}
													onChange={(e: any) => {
														// if (val !== 0) {
														const val = +(+e.target.value).toFixed(2);

														setFilterValues((prev) => ({
															...prev,
															overlay: {
																...prev.overlay,
																opacity: +e.target.value,
															},
														}));

														updateOverlayImage(
															filterValues.overlay.imgUrl,
															val
														);
													}}
													max={1}
													step={0.02}
													valueLabelDisplay='auto'
												/>
											</div>
										)}

										{activeButton === 'Contrast' && (
											<div className={classes.sliderContainer}>
												<Slider
													className={classes.slider}
													aria-label='Overlay, Brightness, Contrast'
													color='secondary'
													defaultValue={0}
													// min={-1}
													min={-0.5}
													value={filtersRange.contrast}
													max={0.5}
													step={0.01}
													valueLabelDisplay='auto'
													//eslint-disable-next-line
													onChange={(e: any) => {
														let value = +e.target.value;
														let scaledValue = value / 2;
														setFiltersRange({
															...filtersRange,
															contrast: value,
														});
														var filter = new fabric.Image.filters.Contrast({
															contrast: scaledValue,
															// contrast: value,
														});
														updateBackgroundFilters(filter, 'contrast');
													}}
												/>
											</div>
										)}
										{activeButton === 'Brightness' && (
											<div className={classes.sliderContainer}>
												<Slider
													className={classes.slider}
													aria-label='Overlay, Brightness, Contrast'
													color='secondary'
													defaultValue={0}
													min={-0.5}
													max={0.5}
													step={0.01}
													value={filtersRange.brightness}
													valueLabelDisplay='auto'
													onChange={(e: any) => {
														let value = +e.target.value;
														// Scale the value to decrease the strength by 50%
														let scaledValue = value / 2;
														setFiltersRange({
															...filtersRange,
															brightness: value,
														});
														var filter = new fabric.Image.filters.Brightness({
															brightness: scaledValue,
														});

														updateBackgroundFilters(filter, 'brightness');
													}}
												/>
											</div>
										)}
										{activeButton === 'Filters' && (
											<div className={classes.sliderContainer}>
												{availableFilters.map((filter) => (
													<Button
														key={filter.name}
														className={`${classes.button} ${
															selectedFilter === filter.name &&
															classes.buttonActive
														}`}
														variant='text'
														color='primary'
														onClick={() =>
															updateBackgroundFilters(
																filter.filter,
																filter.name
															)
														}
													>
														{filter.name}
													</Button>
												))}
											</div>
										)}

										{activeButton === 'border' && (
											<Stack
												width='inherit'
												mx={10}
												spacing={2}
												direction='row'
												sx={{ mb: 1 }}
												alignItems='center'
											>
												<Box sx={{ display: 'flex', alignItems: 'center' }}>
													<CustomColorPicker
														value={overlayTextFiltersState.color}
														changeHandler={(color: string) => {
															updateRectangle({
																...filterValues.collage,
																stroke: color,
															});
															setFilterValues((prev) => ({
																...prev,
																collage: { ...prev.collage, stroke: color },
															}));
														}}
													/>
												</Box>
												<Slider
													valueLabelDisplay='auto'
													className={classes.slider}
													min={0}
													max={20}
													aria-label='Volume'
													// value={filterValues.collage.strokeWidth}
													onChange={(_e: any, value) => {
														// const value = +e.target.value;
														setFilterValues((prev) => ({
															...prev,
															collage: { ...prev.collage, strokeWidth: value },
														}));

														debouncedUpdateRectangle(value);
													}}
												/>
											</Stack>
										)}
									</Paper>
								</div>
							)}

							{(activeTab == 'writePost' ||
								activeTab === 'element' ||
								activeTab === 'title') &&
								dropDown && (
									<div
										style={{
											width: '555px',
										}}
									>
										<Paper className={classes.root}>
											<Box
												className={classes.optionsContainer}
												sx={{
													display: 'flex',
													justifyContent: 'space-evenly',
													textTransform: 'capitalize',
													width: '100%',
												}}
											>
												<Button
													className={`${classes.button} ${
														activeButton === 'font' && classes.buttonActive
													}`}
													variant='text'
													color='primary'
													onClick={() => {
														handleButtonClick('font');
														setShow('font');
													}}
												>
													FONT
												</Button>
												<Button
													className={`${classes.button} ${
														activeButton === 'fontWeight' &&
														classes.buttonActive
													}`}
													variant='text'
													color='primary'
													onClick={() => {
														handleButtonClick('fontWeight');
														setShow('fontWeight');
													}}
												>
													FONTWEIGHT
												</Button>
												<Button
													className={`${classes.button} ${
														activeButton === 'charSpacing' &&
														classes.buttonActive
													}`}
													variant='text'
													color='primary'
													onClick={() => {
														handleButtonClick('charSpacing');
														setShow('charSpacing');
													}}
												>
													SPACING
												</Button>
												<Button
													className={`${classes.button} ${
														activeButton === 'colors' && classes.buttonActive
													}`}
													variant='text'
													color='primary'
													onClick={() => {
														handleButtonClick('colors');
														setShow('colors');
													}}
												>
													colors
												</Button>

												{activeTab === 'title' && (
													<Button
														className={`${classes.button} ${
															activeButton === 'size' && classes.buttonActive
														}`}
														variant='text'
														color='primary'
														onClick={() => {
															handleButtonClick('size');
															setShow('size');
														}}
													>
														SIZE
													</Button>
												)}
												{activeTab === 'writePost' && (
													<Button
														className={`${classes.button} ${
															activeButton === 'writePost-size' &&
															classes.buttonActive
														}`}
														variant='text'
														color='primary'
														onClick={() => {
															handleButtonClick('writePost-size');
															setShow('writePost-size');
														}}
													>
														SIZE WR
													</Button>
												)}
												{/* <Typography
													className={classes.heading}
													onClick={() => setShow('font')}
													sx={{
														ml: 1,
													}}
												>
													FONT
												</Typography>
												<Typography
													className={classes.heading}
													onClick={() => setShow('fontWeight')}
												>
													FONTWEIGHT
												</Typography>
												<Typography
													className={classes.heading}
													onClick={() => setShow('charSpacing')}
												>
													SPACING
												</Typography>
												<Typography
													className={classes.heading}
													onClick={() => setShow('colors')}
												>
													COLORS
												</Typography>

												<Typography
													className={classes.heading}
													onClick={() => setShow('size')}
												>
													SIZE
												</Typography> */}

												{activeTab === 'element' && (
													<>
														<Button
															className={`${classes.button} ${
																activeButton === 'element-size' &&
																classes.buttonActive
															}`}
															variant='text'
															color='primary'
															onClick={() => {
																handleButtonClick('element-size');
																setShow('element-size');
															}}
														>
															SIZE
														</Button>
														<Button
															className={`${classes.button} ${
																activeButton === 'element-shadow' &&
																classes.buttonActive
															}`}
															variant='text'
															color='primary'
															onClick={() => {
																handleButtonClick('element-shadow');
																setShow('element-shadow');
															}}
														>
															SHADOW
														</Button>
														{/* <Typography
													className={classes.heading}
													onClick={() => setShow('opacity')}
												>
													OPACITY
												</Typography> */}
														{/* <Typography
															className={classes.heading}
															onClick={() => setShow('element-shadow')}
														>
															SHADOW
														</Typography> */}
													</>
												)}
											</Box>

											{activeButton && show === 'colors' && (
												<Box
													className={classes.optionsContainer}
													sx={{
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														// border: '2px solid red',
													}}
												>
													<CustomColorPicker
														value={overlayTextFiltersState.color}
														changeHandler={(color: string) => {
															updateTextBox(canvas, { fill: color });

															setOverlayTextFiltersState((prev) => ({
																...prev,
																color,
															}));
														}}
													/>
													<Typography
														sx={{
															color: 'white',
															px: 1,
														}}
													>
														Text Color
													</Typography>
													<Box
														sx={{
															display: 'flex',
															justifyContent: 'center',
															alignItems: 'center',
														}}
													>
														<CustomColorPicker
															type='color'
															value={color}
															changeHandler={(color: string) => {
																setColor(color);
																applyColor();
															}}
														/>

														<Button
															onClick={applyColor}
															sx={{
																color: 'white',
																textTransform: 'none',
																backgroundColor: colorApplied ? 'gray' : '',
																mx: 1,
															}}
														>
															<Typography
																sx={{
																	color: 'white',
																}}
															>
																Text Highlight
															</Typography>
														</Button>
														<Button
															onClick={removeColor}
															sx={{
																textTransform: 'none',
																minWidth: '10px',
															}}
														>
															<DeleteIcon />
														</Button>
													</Box>
													<CustomColorPicker
														type='color'
														value={backgroundColor}
														changeHandler={(color: string) => {
															setBackgroundColor(color);
															handleSelectionUpdated();
														}}
													/>
													<Button
														onClick={handleSelectionUpdated}
														sx={{
															color: 'white',
															textTransform: 'none',
															backgroundColor: bgColorApplied ? 'gray' : '',
															mx: 1,
														}}
													>
														Bg Color
													</Button>
													<Button
														onClick={removeBackgroundColor}
														sx={{
															// color: 'white',
															textTransform: 'none',
															minWidth: '10px',
														}}
													>
														<DeleteIcon />
													</Button>
												</Box>
											)}

											{activeTab === 'element' && show === 'opacity' && (
												<div className={classes.sliderContainer}>
													<Slider
														className={classes.slider}
														aria-label='size'
														color='secondary'
														value={elementOpacity}
														min={-1}
														max={1}
														onChange={(e: any) => {
															const value = +e.target.value;
															setElementOpacity(value);
															updateElementOpacity();
														}}
														step={0.01}
														valueLabelDisplay='auto'
													/>
												</div>
											)}

											{activeButton && show === 'element-shadow' && (
												<div>
													{/* setHexConversionForElement */}

													<Box className={classes.optionsContainer}>
														<Typography id='opacity-slider' gutterBottom>
															Color
														</Typography>
														<CustomColorPicker
															value={
																!hexConversionForElement
																	? overlayTextFiltersState.color
																	: 'rgba(0,0,0,1)'
															}
															changeHandler={(color: string) => {
																const rgbaColorCode = hexToRgbA(color);
																setHexConversionForElement(rgbaColorCode);
																const splitHexConvertion =
																	rgbaColorCode?.split(',');
																updateElementShadow(undefined, undefined, {
																	color: `${splitHexConvertion[0]},${splitHexConvertion[1]},${splitHexConvertion[2]},${elementShadowValues.opacity})`,
																	offsetX: elementShadowValues.distance,
																	offsetY: elementShadowValues.distance,
																	blur: elementShadowValues.opacity,
																});
															}}
														/>
													</Box>

													<Typography id='opacity-slider' gutterBottom>
														Opacity
													</Typography>
													<Slider
														aria-labelledby='opacity-slider'
														value={elementShadowValues?.opacity}
														onChange={(event, newValue) => {
															setElementShadowValues((prev) => ({
																...prev,
																opacity: newValue,
															}));

															const splitHexConvertion =
																hexConversionForElement?.split(',');

															updateElementShadow(undefined, undefined, {
																color: hexConversionForElement
																	? `${splitHexConvertion[0]},${splitHexConvertion[1]},${splitHexConvertion[2]},${newValue})`
																	: `rgba(0,0,0,${newValue})`,
																offsetX: elementShadowValues?.distance,
																offsetY: elementShadowValues?.distance,
																blur: elementShadowValues?.blur,
															});
														}}
														valueLabelDisplay='auto'
														step={0.1}
														min={0}
														max={1}
													/>
													<Typography id='distance-slider' gutterBottom>
														Distance
													</Typography>
													<Slider
														aria-labelledby='distance-slider'
														value={elementShadowValues.distance}
														onChange={(event, newValue) => {
															setElementShadowValues((prev) => ({
																...prev,
																distance: newValue,
															}));

															const splitHexConvertion =
																hexConversionForElement?.split(',');
															updateElementShadow(undefined, undefined, {
																color: hexConversionForElement
																	? `${splitHexConvertion[0]},${splitHexConvertion[1]},${splitHexConvertion[2]},${elementShadowValues.opacity})`
																	: `rgba(0,0,0,${elementShadowValues.opacity}})`,
																offsetX: newValue,
																offsetY: newValue,
																blur: elementShadowValues.blur,
															});
														}}
														valueLabelDisplay='auto'
														step={1}
														min={-50}
														max={50}
													/>
													<Typography id='blur-slider' gutterBottom>
														Blur
													</Typography>
													<Slider
														aria-labelledby='blur-slider'
														value={elementShadowValues?.blur}
														onChange={(event, newValue) => {
															setElementShadowValues((prev) => ({
																...prev,
																blur: newValue,
															}));
															const splitHexConvertion =
																hexConversionForElement?.split(',');
															updateElementShadow(undefined, undefined, {
																color: hexConversionForElement
																	? `${splitHexConvertion[0]},${splitHexConvertion[1]},${splitHexConvertion[2]},${elementShadowValues.opacity})`
																	: `rgba(0,0,0,${elementShadowValues?.opacity}})`,
																offsetX: elementShadowValues?.distance,
																offsetY: elementShadowValues?.distance,
																blur: newValue,
															});
														}}
														valueLabelDisplay='auto'
														step={1}
														min={0}
														max={20}
													/>
												</div>
											)}
											{show === 'elementShadow' && (
												<div className={classes.sliderContainer}>
													<Slider
														className={classes.slider}
														aria-label='size'
														color='secondary'
														value={elementOpacity}
														min={-1}
														max={1}
														onChange={(e: any) => {
															const value = +e.target.value;
															setElementOpacity(value);
															updateElementOpacity();
														}}
														step={0.01}
														valueLabelDisplay='auto'
													/>
												</div>
											)}

											{activeButton && show === 'fontWeight' && (
												<Box my={2} className={classes.sliderContainer}>
													<Slider
														className={classes.slider}
														aria-label='size'
														color='secondary'
														defaultValue={400}
														value={overlayTextFiltersState.fontWeight}
														min={100}
														max={900}
														onChange={(e: any) => {
															const value = +e.target.value;
															updateTextBox(canvas, { fontWeight: value });
															setOverlayTextFiltersState((prev) => ({
																...prev,
																fontWeight: value,
															}));
														}}
														step={100}
														valueLabelDisplay='auto'
													/>
												</Box>
											)}

											{activeButton && show === 'size' && (
												<Box my={2} className={classes.sliderContainer}>
													<Slider
														className={classes.slider}
														aria-label='size'
														color='secondary'
														value={overlayTextFiltersState.fontSize}
														min={10}
														max={48}
														onChange={(e: any) => {
															const value = +e.target.value;
															updateTextBox(canvas, { fontSize: value });
															setOverlayTextFiltersState((prev) => ({
																...prev,
																fontSize: value,
															}));
														}}
														step={1}
														valueLabelDisplay='auto'
													/>
												</Box>
											)}

											{activeButton && show === 'element-size' && (
												<Box my={2} className={classes.sliderContainer}>
													<Slider
														className={classes.slider}
														aria-label='size'
														color='secondary'
														value={overlayTextFiltersState.elementFontSize}
														min={10}
														max={72}
														onChange={(e: any) => {
															const value = +e.target.value;
															updateTextBox(canvas, { fontSize: value });
															setOverlayTextFiltersState((prev) => ({
																...prev,
																elementFontSize: value,
															}));
														}}
														step={1}
														valueLabelDisplay='auto'
													/>
												</Box>
											)}

											{activeButton && show === 'writePost-size' && (
												<Box my={2} className={classes.sliderContainer}>
													<Slider
														className={classes.slider}
														aria-label='size'
														color='secondary'
														value={overlayTextFiltersState?.writePostfontSize}
														min={10}
														max={72}
														onChange={(e: any) => {
															const value = +e.target.value;
															updateTextBox(canvas, { fontSize: value });
															setOverlayTextFiltersState((prev) => ({
																...prev,
																writePostfontSize: value,
															}));
														}}
														step={1}
														valueLabelDisplay='auto'
													/>
												</Box>
											)}
											{activeButton && show === 'charSpacing' && (
												<Box
													my={2}
													// className={classes.sliderContainer}
													sx={{
														display: 'flex',
														justifyContent: 'center',
														flexDirection: 'column',

														width: '90%',
													}}
												>
													<Box>
														<Typography
															sx={{
																fontWeight: 600,
																fontSize: '16px',
																textAlign: 'center',
															}}
														>
															Spacing
														</Typography>
														<Slider
															className={classes.slider}
															aria-label='size'
															color='secondary'
															value={overlayTextFiltersState.charSpacing}
															min={-200}
															max={800}
															onChange={(e: any) => {
																const charSpacing = +e.target.value;
																updateTextBox(canvas, { charSpacing });
																setOverlayTextFiltersState((prev) => ({
																	...prev,
																	charSpacing,
																}));
															}}
															step={1}
															valueLabelDisplay='auto'
														/>
														<Typography
															sx={{
																fontWeight: 600,
																fontSize: '16px',
																textAlign: 'center',
															}}
														>
															Line Height
														</Typography>
														<Slider
															className={classes.slider}
															aria-label='size'
															color='secondary'
															defaultValue={overlayTextFiltersState.lineHeight}
															min={-25}
															max={25}
															onChange={(e: any) => {
																const value = +e.target.value;
																updateTextBox(canvas, { lineHeight: value });
																setOverlayTextFiltersState((prev) => ({
																	...prev,
																	lineHeight: value,
																}));
															}}
															step={0.1}
															valueLabelDisplay='auto'
														/>
													</Box>
												</Box>
											)}
											{activeButton && show === 'font' && (
												<FontsTab value={value} handleChange={handleChange} />
											)}
										</Paper>
									</div>
								)}

							{activeTab == 'bubble' && dropDown && (
								<div
									style={{
										width: '555px',
									}}
								>
									<Paper className={classes.root}>
										<Box
											className={classes.optionsContainer}
											sx={{
												display: 'flex',
												justifyContent: 'space-around',
												pb: 1.5,
											}}
										>
											<Button
												className={`${classes.button} ${
													activeButton === 'colors' && classes.buttonActive
												}`}
												variant='text'
												color='primary'
												onClick={() => {
													handleButtonClick('colors');
													setShow('colors');
												}}
											>
												COLORS
											</Button>
											<Button
												className={`${classes.button} ${
													activeButton === 'size' && classes.buttonActive
												}`}
												variant='text'
												color='primary'
												onClick={() => {
													handleButtonClick('size');
													setShow('size');
												}}
											>
												SIZE
											</Button>
											<Button
												className={`${classes.button} ${
													activeButton === 'shadow' && classes.buttonActive
												}`}
												variant='text'
												color='primary'
												onClick={() => {
													handleButtonClick('shadow');
													setShow('shadow');
												}}
											>
												SHADOW
											</Button>
											<Button
												className={`${classes.button} ${
													activeButton === 'contrast' && classes.buttonActive
												}`}
												variant='text'
												color='primary'
												onClick={() => {
													handleButtonClick('contrast');
													setShow('contrast');
												}}
											>
												CONTRAST
											</Button>
											<Button
												className={`${classes.button} ${
													activeButton === 'brightness' && classes.buttonActive
												}`}
												variant='text'
												color='primary'
												onClick={() => {
													handleButtonClick('brightness');
													setShow('brightness');
												}}
											>
												BRIGHTNESS
											</Button>

											{/* <Typography
												className={classes.heading}
												onClick={() => setShow('colors')}
											>
												COLORS
											</Typography>
											<Typography
												className={classes.heading}
												onClick={() => setShow('size')}
											>
												SIZE
											</Typography>

											<Typography
												className={classes.heading}
												onClick={() => setShow('shadow')}
											>
												SHADOW
											</Typography>
											<Typography
												className={classes.heading}
												onClick={() => setShow('contrast')}
											>
												CONTRAST
											</Typography>
											<Typography
												className={classes.heading}
												onClick={() => setShow('brightness')}
											>
												BRIGHTNESS
											</Typography> */}
										</Box>

										{activeButton && show === 'colors' && (
											<Box
												className={classes.optionsContainer}
												sx={{
													mb: 1,
													ml: 4,
												}}
											>
												<CustomColorPicker
													value={overlayTextFiltersState.color}
													changeHandler={(color: string) => {
														// updateBubbleImage(undefined, {
														// 	stroke: color,
														// 	strokeWidth: filterValues.bubble.strokeWidth,
														// });
														updateBubbleCircle(canvas, {
															stroke: color,
															strokeWidth: filterValues.bubble.strokeWidth,
														});
														setFilterValues((prev) => ({
															...prev,
															bubble: { ...prev.bubble, stroke: color },
														}));
													}}
												/>
											</Box>
										)}

										{activeButton && show === 'size' && (
											<div className={classes.sliderContainer}>
												<Slider
													className={classes.slider}
													aria-label='size'
													color='secondary'
													value={filterValues.bubble.strokeWidth}
													min={1}
													max={40}
													onChange={(e: any) => {
														const value = +e.target.value;
														const activeObject = canvas?.getActiveObject();
														updateBubbleCircle(canvas, {
															stroke: activeObject?.stroke,
															strokeWidth: value,
														});
														// updateBubbleImage(undefined, {
														// 	stroke: activeObject?.stroke,
														// 	strokeWidth: value,
														// });
														setFilterValues((prev) => ({
															...prev,
															bubble: { ...prev.bubble, strokeWidth: value },
														}));
													}}
													step={1}
													valueLabelDisplay='auto'
												/>
											</div>
										)}

										{activeButton && show === 'shadow' && (
											<div>
												<div className={classes.colorPicker}>
													<Box className={classes.optionsContainer}>
														<Typography id='opacity-slider' gutterBottom>
															Color
														</Typography>
														<CustomColorPicker
															value={
																hexConvertion
																	? overlayTextFiltersState.color
																	: 'rgba(0,0,0,1)'
															}
															changeHandler={(color: string) => {
																const rgbaColorCode = hexToRgbA(color);
																setHexConversion(rgbaColorCode);
																const splitHexConvertion =
																	rgbaColorCode?.split(',');

																updateBubbleImage(undefined, undefined, {
																	color: `${splitHexConvertion[0]},${splitHexConvertion[1]},${splitHexConvertion[2]},${shadowValues.opacity})`,
																	offsetX: shadowValues.distance,
																	offsetY: shadowValues.distance,
																	blur: shadowValues.opacity,
																});
															}}
														/>
													</Box>
												</div>

												<Typography id='opacity-slider' gutterBottom>
													Opacity
												</Typography>
												<Slider
													aria-labelledby='opacity-slider'
													value={shadowValues.opacity}
													onChange={(event, newValue) => {
														setShadowValues((prev) => ({
															...prev,
															opacity: newValue,
														}));

														const splitHexConvertion =
															hexConvertion?.split(',');

														updateBubbleImage(undefined, undefined, {
															color: hexConvertion
																? `${splitHexConvertion[0]},${splitHexConvertion[1]},${splitHexConvertion[2]},${newValue})`
																: `rgba(0,0,0,${newValue})`,
															offsetX: shadowValues.distance,
															offsetY: shadowValues.distance,
															blur: shadowValues.blur,
														});
													}}
													valueLabelDisplay='auto'
													step={0.1}
													min={0}
													max={1}
												/>

												<Typography id='distance-slider' gutterBottom>
													Distance
												</Typography>
												<Slider
													aria-labelledby='distance-slider'
													value={shadowValues.distance}
													onChange={(event, newValue) => {
														setShadowValues((prev) => ({
															...prev,
															distance: newValue,
														}));
														const splitHexConvertion =
															hexConvertion?.split(',');
														updateBubbleImage(undefined, undefined, {
															color: hexConvertion
																? `${splitHexConvertion[0]},${splitHexConvertion[1]},${splitHexConvertion[2]},${shadowValues.opacity})`
																: `rgba(0,0,0,${shadowValues.opacity})`,
															offsetX: newValue,
															offsetY: newValue,
															blur: shadowValues.blur,
														});
													}}
													valueLabelDisplay='auto'
													step={1}
													min={-50}
													max={50}
												/>
												<Typography id='blur-slider' gutterBottom>
													Blur
												</Typography>
												<Slider
													aria-labelledby='blur-slider'
													value={shadowValues.blur}
													onChange={(event, newValue) => {
														setShadowValues((prev) => ({
															...prev,
															blur: newValue,
														}));
														const splitHexConvertion =
															hexConvertion?.split(',');

														updateBubbleImage(undefined, undefined, {
															color: hexConvertion
																? `${splitHexConvertion[0]},${splitHexConvertion[1]},${splitHexConvertion[2]},${shadowValues.opacity})`
																: `rgba(0,0,0,${shadowValues.opacity})`,
															offsetX: shadowValues.distance,
															offsetY: shadowValues.distance,
															blur: newValue,
														});
													}}
													valueLabelDisplay='auto'
													step={1}
													min={0}
													max={20}
												/>
											</div>
										)}

										{activeButton && show === 'contrast' && (
											<div className={classes.sliderContainer}>
												<Slider
													className={classes.slider}
													aria-label='size'
													color='secondary'
													value={bubbleFilter.contrast}
													min={-1}
													max={1}
													onChange={(e: any) => {
														const value = +e.target.value;
														setBubbleFilter((prev) => ({
															...prev,
															contrast: value,
														}));
														updateBubbleImageContrast();
													}}
													step={0.01}
													valueLabelDisplay='auto'
												/>
											</div>
										)}

										{activeButton && show === 'brightness' && (
											<div className={classes.sliderContainer}>
												<Slider
													className={classes.slider}
													aria-label='size'
													color='secondary'
													value={bubbleFilter.brightness}
													min={-1}
													max={1}
													onChange={(e: any) => {
														const value = +e.target.value;
														setBubbleFilter((prev) => ({
															...prev,
															brightness: value,
														}));
														updateBubbleImageFilters(canvas, {
															brightness: bubbleFilter.brightness,
														});
														// updateBubbleImageBrightness();
													}}
													step={0.01}
													valueLabelDisplay='auto'
												/>
											</div>
										)}
									</Paper>
								</div>
							)}
							<Paper
								sx={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									borderRadius: '0px 0px 5px 5px ',
									width: '539px',
									// border: '2px solid red',
								}}
								onClick={() => {
									dropDown ? setDropDown(false) : setDropDown(true);
								}}
							>
								{dropDown ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
							</Paper>
							<div
								style={{
									display: 'flex',
									justifyContent: 'space-between',

									height: '100px',
									width: '535px',
								}}
							>
								<button
									style={{
										backgroundColor: 'transparent',
										border: 'none',
									}}
									onClick={() => {
										updateActiveTab('background');
										handleButtonClick('Overlay');
										deselectObj();
									}}
								>
									<img
										src='/Tab-Icons/background.png'
										width='90'
										height='90'
										style={{
											color: 'white',
											fontSize: '30px',
											filter: activeTab === 'background' ? filter : undefined,
										}}
									/>
								</button>

								<button
									style={{ backgroundColor: 'transparent', border: 'none' }}
									onClick={() => {
										updateActiveTab('title');
										handleButtonClick('font');
										setShow('font');
										deselectObj();
									}}
								>
									<img
										src='/Tab-Icons/Edit-Text.png'
										width='90'
										height='90'
										style={{
											color: 'white',
											fontSize: '30px',
											filter: activeTab === 'title' ? filter : undefined,
										}}
									/>
								</button>

								<button
									onClick={() => {
										updateActiveTab('bubble');
										handleButtonClick('colors');
										setShow('colors');
										deselectObj();
									}}
									style={{ backgroundColor: 'transparent', border: 'none' }}
								>
									<img
										src='/Tab-Icons/Add-Bubble.png'
										width='90'
										height='90'
										style={{
											color: 'white',
											fontSize: '30px',
											filter: activeTab === 'bubble' ? filter : undefined,
										}}
									/>
								</button>

								<button
									onClick={() => {
										updateActiveTab('element');
										handleButtonClick('font');
										setShow('font');
										deselectObj();
									}}
									style={{ backgroundColor: 'transparent', border: 'none' }}
								>
									<img
										src='/Tab-Icons/Add-Elements.png'
										width='90'
										height='90'
										style={{
											color: 'white',
											fontSize: '30px',
											filter: activeTab === 'element' ? filter : undefined,
										}}
									/>
								</button>

								<button
									onClick={() => {
										updateActiveTab('writePost');
										handleButtonClick('font');
										setShow('font');
										deselectObj();
									}}
									style={{ backgroundColor: 'transparent', border: 'none' }}
								>
									<img
										src='/Tab-Icons/Write-Post.png'
										width='90'
										height='90'
										style={{
											color: 'white',
											fontSize: '30px',
											filter: activeTab === 'writePost' ? filter : undefined,
										}}
									/>
								</button>
							</div>
						</Box>
					</div>

					{/* pagination */}
					<div className={classes.paginationContainer}>
						{paginationState?.map((item) => {
							return (
								<div
									onClick={() => handleClickPagination(item)}
									key={item?.page}
									className={classes?.paginationStyle}
								>
									{item?.page}
								</div>
								// <div
								// 	onClick={async () => {
								// 		const currentTemplateJSON = await saveJSON(canvas, true);
								// 		deselectObj();
								// 		await update(selectedPage, {
								// 			templateJSON: currentTemplateJSON,
								// 		});
								// 		await setSelectedPage(item?.page);
								// 		await new Promise((resolve) => {
								// 			canvas?.loadFromJSON(item?.templateJSON, () => {
								// 				// bindEvents();
								// 				resolve(null);
								// 			});
								// 		});

								// 	}}
								// 	key={item?.page}
								// 	className={classes?.paginationStyle}
								// >
								// 	{item?.page}

								// </div>
							);
						})}

						<div
							className={classes.paginationStyle}
							onClick={() => addTemplate()}
						>
							{!pageLoading ? (
								<svg
									xmlns='http://www.w3.org/2000/svg'
									width='24'
									height='24'
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'
								>
									<line x1='12' y1='5' x2='12' y2='19'></line>
									<line x1='5' y1='12' x2='19' y2='12'></line>
								</svg>
							) : (
								<CircularProgress sx={{ color: '#ffffff' }} size={20} />
							)}
						</div>
					</div>
				</div>

				<Box>
					<div style={{ width: '300px', height: '480px', padding: '10px' }}>
						{activeTab == 'background' && (
							<>
								<div>
									<h4
										style={{
											margin: '0px',
											padding: '0px',
										}}
									>
										From Article
									</h4>

									<ImageViewer
										clickHandler={(img: string) => updateBackgroundImage(img)}
										images={initialData.backgroundImages}
										onDragStart={(e, imageUrl) => {
											const background = true;
											handleDragStart(e, imageUrl, background);
										}}
									>
										{template?.diptych === 'vertical' ? (
											<Box
												sx={{
													display: 'flex',
													justifyContent: 'space-around',
													py: 0.1,
												}}
											>
												<div>Top Images</div>
												<div>Bottom Images </div>
											</Box>
										) : template?.diptych === 'horizontal' ? (
											<>
												<Box
													sx={{
														display: 'flex',
														justifyContent: 'space-around',
														py: 0.1,
													}}
												>
													<div>Left Images</div>
													<div>Right Images</div>
												</Box>
											</>
										) : null}
									</ImageViewer>

									<Box {...styles.uploadBox}>
										<label style={styles.uploadLabel}>
											<h4>IMAGE UPLOAD</h4>

											<form method='post' encType='multipart/form-data'>
												<input
													type='file'
													onChange={(event) =>
														uploadImage(event, 'backgroundImages')
													}
													style={{ display: 'none' }}
												/>
											</form>
											<IconButton color='primary' component='span'>
												<CloudUploadIcon style={{ fontSize: '40px' }} />
											</IconButton>
										</label>
									</Box>
								</div>
								{/* bg prompt */}
								<Box>
									<h4 style={{ margin: '0px', padding: '0px' }}>AI Images </h4>
									<input
										onChange={(e) => setPrompt(e.target.value)}
										onKeyPress={handleKeyPress}
										type='text'
										value={prompt}
										placeholder='Prompt here'
										style={{
											paddingLeft: '5px',
											width: '100%',
											height: '30px',
											marginTop: '8px',
											border: 'none',
											borderRadius: '4px',
										}}
									/>
									<Button
										onClick={generateTextToImageHanlder}
										style={{
											marginTop: '10px',
											marginBottom: '10px',
											width: '100%',
											height: '42px',
											borderRadius: '25px',
											textTransform: 'capitalize',
											border: 'none',
											backgroundColor: '#3b0e39',
											color: 'white',
										}}
										disabled={loadingState === 'textToImage'}
										endIcon={
											loadingState === 'textToImage' ? (
												<CircularProgress sx={{ color: '#ffffff' }} size={20} />
											) : null
										}
									>
										Generate
									</Button>
									<Box>
										{generatedImages?.length > 0 && (
											<ImageViewer
												clickHandler={(img: string) =>
													updateBackgroundImage(img)
												}
												images={generatedImages}
												onDragStart={(e, imageUrl) => {
													const background = true;
													handleDragStart(e, imageUrl, background);
												}}
											>
												{/* {template?.diptych === 'vertical' ? (
													<Box
														sx={{
															display: 'flex',
															justifyContent: 'space-around',
															py: 0.1,
														}}
													>
														<div>Top Images </div>
														<div>Bottom Images</div>
													</Box>
												) : template?.diptych === 'horizontal' ? (
													<>
														<Box
															sx={{
																display: 'flex',
																justifyContent: 'space-around',
																py: 0.1,
															}}
														>
															<div>Left Images</div>
															<div>Right Images</div>
														</Box>
													</>
												) : null} */}
											</ImageViewer>
										)}
									</Box>
								</Box>
								<br />
							</>
						)}

						{activeTab == 'title' && (
							<div>
								<h4
									style={{
										margin: '0px',
										padding: '0px',
									}}
								>
									Titles
								</h4>
								<div style={{ marginTop: '20px' }}>
									{texts?.map((text: string, i) => {
										return (
											<h5
												key={i}
												draggable
												onDragStart={(e) => handleDragStart(e, text)}
												onClick={() => {
													const existingObject = getExistingObject('title') as
														| fabric.Textbox
														| undefined;
													if (!existingObject) {
														const centerX = canvas.getWidth() / 2;
														const centerY = canvas.getHeight() / 2;

														return createTextBox(canvas, {
															text,
															customType: 'title',
															fill: '#fff',
															width: 303,
															height: 39,
															top: centerY,
															left: centerX,
															scaleX: 1.53,
															scaleY: 1.53,
															fontSize: overlayTextFiltersState.fontSize,
															textAlign: 'center',
															originX: 'center',
															originY: 'center',
														});
													}

													updateTextBox(canvas, { text });
													setOverlayTextFiltersState((prev) => ({
														...prev,
														text,
													}));
												}}
												style={{
													margin: '0px',
													marginBottom: '15px',
													cursor: 'pointer',
													color: '#a19d9d',
												}}
											>
												{text}
											</h5>
										);
									})}
								</div>
							</div>
						)}

						{/* // --------------bubble ------------------- */}
						{activeTab == 'bubble' && (
							<div>
								<h4 style={{ margin: '0px', padding: '0px' }}>From Article</h4>

								<ImageViewer
									clickHandler={(img: string) => {
										const activeObject = canvas?.getActiveObject();
										const isBubbleExist = getExistingObject('bubble');

										if (
											(isChecked &&
												activeObject?.customType === 'bubbleStroke') ||
											(isChecked && activeObject?.customType === 'strokeCircle')
										) {
											canvas.discardActiveObject();
											canvas?.renderAll();
										}

										if (isChecked && !canvas?.getActiveObject()) {
											createBubble(canvas, img);
											return;
										}

										if (!isBubbleExist && !canvas?.getActiveObject()) {
											createBubble(canvas, img);
											return;
										}

										if (
											(activeObject && activeObject?.customType === 'bubble') ||
											(activeObject && !isChecked)
										)
											updateBubbleImageSrc(canvas, img);
									}}
									images={initialData.bubbles}
								/>
								<Box
									sx={{
										width: '100%',
									}}
								>
									<FormControlLabel
										control={
											<Checkbox
												checked={isChecked}
												onChange={handleCheckboxChange}
												sx={{
													'& .MuiIconButton-root': {
														color: '#fff',
														border: '1px solid #fff',
													},
													'&.Mui-checked': {
														color: '#fff',
													},
													'& .MuiSvgIcon-root ': {
														fill: '#fff',
													},
												}}
											/>
										}
										label='Click for adding another bubble'
									/>
								</Box>

								<Box {...styles.uploadBox}>
									<label style={styles.uploadLabel}>
										<h4>IMAGE UPLOAD</h4>

										<form method='post' encType='multipart/form-data'>
											<input
												type='file'
												onChange={(event) => uploadImage(event, 'bubbles')}
												style={{ display: 'none' }}
											/>
										</form>
										<IconButton color='primary' component='span'>
											<CloudUploadIcon style={{ fontSize: '40px' }} />
										</IconButton>
									</label>
								</Box>

								<>
									{/* title prompt */}
									<h4
										style={{
											margin: '0px',
											padding: '0px',
										}}
									>
										AI Images
									</h4>
									<input
										onChange={(e) => setPrompt(e.target.value)}
										onKeyPress={handleKeyPress}
										type='text'
										placeholder='Prompt here'
										value={prompt}
										style={{
											paddingLeft: '5px',
											width: '100%',
											height: '30px',
											marginTop: '8px',
											border: 'none',
											borderRadius: '4px',
										}}
									/>
									{/* -----Bubble Generate AI Bubble */}
									<Button
										onClick={generateTextToImageHanlder}
										style={{
											marginTop: '10px',
											marginBottom: '10px',
											width: '100%',
											height: '42px',
											borderRadius: '25px',
											border: 'none',
											backgroundColor: '#3b0e39',
											textTransform: 'capitalize',
											color: 'white',
										}}
										endIcon={
											loadingState === 'textToImage' ? (
												<CircularProgress sx={{ color: '#ffffff' }} size={20} />
											) : null
										}
									>
										Generate
									</Button>
									<div id='AiBubbleID'>
										{generatedImages?.length > 0 && (
											<ImageViewer
												clickHandler={(img: string) => {
													const activeObject = canvas?.getActiveObject();
													const isBubbleExist = getExistingObject('bubble');

													if (
														(isChecked &&
															activeObject?.customType === 'bubbleStroke') ||
														(isChecked &&
															activeObject?.customType === 'strokeCircle')
													) {
														canvas.discardActiveObject();
														canvas?.renderAll();
													}

													if (isChecked && !canvas?.getActiveObject())
														createBubble(canvas, img);

													if (!isBubbleExist && !canvas?.getActiveObject())
														createBubble(canvas, img);

													if (
														activeObject &&
														activeObject?.customType === 'bubble'
													)
														updateBubbleImageSrc(canvas, img);
												}}
												images={generatedImages}
												// images={initialData.bubbles}
												onDragStart={(e, imageUrl) => {
													const background = false;
													const bubble = true;
													handleDragStart(e, imageUrl, background, true);
												}}
												// clickHandler={(img: string) => {
												// 	const activeObject = canvas?.getActiveObject();
												// 	const isBubbleExist = getExistingObject('bubble');

												// 	if (isChecked && !activeObject) {
												// 		createBubble(canvas, img);
												// 	} else if (!isBubbleExist && !activeObject) {
												// 		createBubble(canvas, img);
												// 	} else {
												// 		updateBubbleImageSrc(canvas, img);
												// 	}
												// }}
												// images={generatedImages}
												// // images={initialData.bubbles}
												// onDragStart={(e, imageUrl) => {
												// 	const background = false;
												// 	const bubble = true;
												// 	handleDragStart(e, imageUrl, background, true);
												// }}
											>
												{/* {template?.diptych === 'vertical' ? (
												<Box
													sx={{
														display: 'flex',
														justifyContent: 'space-around',
														py: 1,
													}}
												>
													<div>Top Images</div>
													<div>Bottom Images</div>
												</Box>
											) : template?.diptych === 'horizontal' ? (
												<>
													<Box
														sx={{
															display: 'flex',
															justifyContent: 'space-around',
															py: 1,
														}}
													>
														<div>Left Images</div>
														<div>Right Images</div>
													</Box>
												</>
											) : null} */}
											</ImageViewer>
										)}
									</div>
								</>
							</div>
						)}

						{activeTab == 'element' && (
							<Box id='element'>
								<Box>
									<Typography
										sx={{
											fontWeight: 'bold',
											pb: 1.5,
										}}
									>
										Choose Element
									</Typography>
									<Box
										sx={{
											display: 'flex',
										}}
									>
										{elementsAssets?.arrows?.map(({ img, id }, i) => {
											return (
												<Box
													key={`swipe_${id}_${i}`}
													sx={{
														display: 'flex',
														justifyContent: 'center',
														alignItems: 'center',
														width: '100%',
													}}
												>
													<img
														draggable={true}
														onDragStart={(e) => handleDragStart(e, img)}
														src={img}
														onClick={() => swipeColorChangeHandler(id, img)}
														alt=''
														style={{
															cursor: 'pointer',
															paddingBottom: '0.5rem',
															width: '30px',
															height: '30px',
														}}
													/>
												</Box>
											);
										})}
									</Box>

									<Box
										sx={{
											display: 'flex',
											justifyContent: 'space-between',
											alignItems: 'center',
											position: 'relative',
										}}
									>
										{elements?.map((element: string, i) => {
											return (
												<img
													key={i}
													src={element}
													onClick={() => {
														const iconSrc = '/icons/swipe.svg';
														const color =
															userMetaData?.company?.color || '#ffffff';
														createSwipeGroup(canvas, {}, iconSrc, color);
													}}
													alt=''
													width='90px'
													style={{
														cursor: 'pointer',
														paddingBottom: '0.5rem',
													}}
												/>
											);
										})}

										<div id='CustomColorPicker'>
											<CustomColorPicker
												value={userMetaData?.company?.color || '#909AE9'}
												changeHandler={(color: string) => {
													const activeObject = canvas?.getActiveObject();

													if (!canvas && !activeObject) {
														console.log('Canvas and activeObject Not found');
														return;
													}
													if (activeObject.type?.includes('group')) {
														updateSwipeColor(canvas, color);
													} else {
														updateImageColor(canvas, activeObject, color);
													}
												}}
											/>
										</div>
									</Box>
								</Box>
								<Box>
									<Typography
										sx={{
											fontWeight: 'bold',
											pt: 1,
										}}
									>
										Shapes
									</Typography>
									<Box
										sx={{
											display: 'flex',
											pt: 1.5,
										}}
									>
										{elementsAssets?.shapes?.map(({ img }, i) => {
											return (
												<Box
													key={i}
													sx={{
														display: 'flex',
														justifyContent: 'center',
														alignItems: 'center',
														width: '100%',
													}}
												>
													<img
														src={img}
														onClick={() => borderColorChangeHandler(img)}
														onDragStart={(e) => handleDragStart(e, img)}
														alt=''
														// width='90px'
														style={{
															cursor: 'pointer',
															paddingBottom: '0.5rem',
															width: '30px',
															height: '30px',
														}}
													/>
												</Box>
											);
										})}
									</Box>

									<Box
										sx={{
											display: 'flex',
											justifyContent: 'flex-end',
											pt: 1.5,
										}}
									>
										<CustomColorPicker
											value={userMetaData?.company?.color || '#909AE9'}
											changeHandler={(color: string) => {
												const activeObject = canvas?.getActiveObject();
												if (!canvas && !activeObject) {
													console.log('Canvas and activeObject Not found');
													return;
												}
												updateImageColor(canvas, activeObject, color);
											}}
										/>
									</Box>
									<Box
										sx={{
											py: 1,
										}}
									>
										<Typography
											sx={{
												fontWeight: 'bold',
												pt: 1,
											}}
										>
											Borders
										</Typography>
									</Box>
									<Box
										sx={{
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
										}}
									>
										{elementsAssets?.dividers?.map(({ img }, i) => {
											return (
												<Box
													key={i}
													sx={{
														display: 'flex',
														justifyContent: 'center',
														alignItems: 'center',
														width: '100%',
														flexDirection: 'row',
													}}
												>
													<img
														src={img}
														onDragStart={(e) => handleDragStart(e, img)}
														onClick={() => dividerColorChangeHandler(img)}
														alt=''
														// width='90px'
														style={{
															cursor: 'pointer',
															paddingBottom: '0.5rem',
															width: '40px',
															height: '20px',
														}}
													/>
												</Box>
											);
										})}
									</Box>
									<Box
										sx={{
											display: 'flex',
											justifyContent: 'space-between',
											alignItems: 'center',
										}}
									>
										{borders?.map((border: string, i: any) => {
											return (
												<img
													key={i}
													src={border}
													onDragStart={(e) => handleDragStart(e, border)}
													onClick={() => {
														const imageObject = getExistingObject('borders') as
															| fabric.Image
															| undefined;
														if (!canvas) return;

														if (imageObject && !imageObject.visible) {
															imageObject.set({
																visible: true,
																// fill: userMetaData?.company?.color,
															});
															var filter = new fabric.Image.filters.BlendColor({
																color: userMetaData?.company?.color,
																mode: 'tint',
																alpha: 1,
															});
															imageObject.filters.push(filter);
															imageObject.applyFilters();
															return canvas?.renderAll();
														} else
															createImage(canvas, border, {
																customType: 'borders',
															});
													}}
													alt=''
													width='90px'
													style={{
														cursor: 'pointer',
														paddingBottom: '0.5rem',
													}}
												/>
											);
										})}
										<CustomColorPicker
											value={userMetaData?.company?.color || '#909AE9'}
											changeHandler={(color: string) => {
												const activeObject = canvas?.getActiveObject();
												if (!canvas && !activeObject) {
													console.log('Canvas and activeObject Not found');
													return;
												}
												updateImageColor(canvas, activeObject, color);
											}}
										/>
									</Box>
								</Box>

								<Box>
									<h4>Social Tags</h4>

									<Box
										sx={{
											display: 'flex',
											flexWrap: 'wrap',
										}}
									>
										{elementsAssets?.socialPlatforms?.map(({ img }, i) => (
											<Box
												key={i}
												sx={{
													display: 'flex',
													justifyContent: 'center',
													alignItems: 'center',
													width: '10%',
													marginBottom: '1rem',
												}}
											>
												<img
													src={img}
													onDragStart={(e) => handleDragStart(e, img)}
													onClick={() => {
														const left = Math.random() * (400 - 100) + 100;
														const top = Math.random() * (800 - 400) + 100;
														fabric.Image.fromURL(
															img,
															function (img) {
																const snappyImg = new fabric.Image(
																	img.getElement(),
																	{
																		left: left,
																		top: top,
																		scaleX: 0.2,
																		scaleY: 0.2,
																	}
																);
																snappyImg.customType = 'elementImg';
																canvas.add(snappyImg);

																requestAnimationFrame(() => {
																	canvas.renderAll();
																});
															},
															{
																crossOrigin: 'anonymous',
															}
														);
													}}
													alt=''
													style={{
														cursor: 'pointer',
														paddingBottom: '0.5rem',
														width: '30px',
														height: '30px',
													}}
												/>
											</Box>
										))}
									</Box>

									<Box
										sx={{
											display: 'flex',
											justifyContent: 'space-between',
											alignItems: 'center',
											mt: 1,
										}}
									>
										<div>
											<h5
												onClick={() => {
													const existingObject = getExistingObject(
														'hashtag'
													) as fabric.Textbox | undefined;
													const centerX = canvas.getWidth() / 2;
													// const centerY = canvas.getHeight() / 2;
													const text = `@${userMetaData?.company?.name}`;

													if (!existingObject) {
														return createTextBox(canvas, {
															text,
															customType: 'hashtag',
															fill: '#fff',
															width: 303,
															height: 39,
															top: 100,
															left: centerX,
															scaleX: 1.53,
															scaleY: 1.53,
															fontSize: overlayTextFiltersState.elementFontSize,
															textAlign: 'center',
															originX: 'center',
															originY: 'center',
														});
													}
													updateTextBox(canvas, { text });
													setOverlayTextFiltersState((prev) => ({
														...prev,
														text,
													}));
												}}
												style={{
													margin: '0px',
													marginBottom: '15px',
													cursor: 'pointer',
													color: '#a19d9d',
												}}
											>
												{`@${userMetaData?.company?.name}`}
											</h5>
										</div>

										<CustomColorPicker
											value={userMetaData?.company?.color || '#909AE9'}
											changeHandler={(color: string) => {
												const type = 'hashtag';

												let existingTextObject = getExistingObject(type) as
													| fabric.Textbox
													| undefined;
												if (
													canvas?._activeObject &&
													canvas?._activeObject?.type === 'textbox'
												)
													existingTextObject =
														canvas?._activeObject as fabric.Textbox;

												if (!existingTextObject) return;
												existingTextObject?.set({
													fill: color,
												});
												canvas.renderAll();
											}}
										/>
									</Box>
									<Box>
										<Box
											sx={{
												display: 'flex',
												justifyContent: 'space-between',
												alignItems: 'center',
												mt: 2,
											}}
										>
											{userMetaData?.company &&
												hashtags.map((itm, i) => (
													<img
														key={i}
														src={itm}
														onClick={() => {
															createImage(canvas, itm, {
																customType: 'elementImg',
																scaleX: 0.2,
																scaleY: 0.2,
																top: 0,
																left: 100,
															});
														}}
														alt=''
														style={{
															cursor: 'pointer',
															paddingBottom: '0.5rem',
															width: '80px',
															height: '60px',
														}}
													/>
												))}
										</Box>
									</Box>
								</Box>
							</Box>
						)}

						{activeTab == 'writePost' && (
							<div>
								<h2>Write post</h2>

								{summaryContent && summaryContent?.content ? (
									<>
										<Button
											onClick={() => {
												const textToCopy = summaryContent?.content;
												if (textToCopy) {
													navigator.clipboard.writeText(textToCopy).then(
														() => {
															console.log('Text copied to clipboard');
															toast.success('Text copied to clipboard');
														},
														(err) => {
															console.error('Could not copy text: ', err);
														}
													);
												}
											}}
											style={{
												cursor: 'pointer',
												padding: '10px 20px',
												// backgroundColor: '#4CAF50',
												color: 'white',
												border: 'none',
												borderRadius: '5px',
											}}
											variant='contained'
											sx={{
												textTransform: 'capitalize',
												mt: 2,
											}}
										>
											Copy Text
										</Button>
										<h5
											onClick={() => {
												const existingObject = getExistingObject(
													'writePost'
												) as fabric.Textbox | undefined;
												const centerX = canvas?.getWidth() / 2;
												const centerY = canvas?.getHeight() / 2;
												const text = summaryContent?.content;

												if (!existingObject) {
													return createTextBox(canvas, {
														text,
														customType: 'writePost',
														fill: '#fff',
														width: 303,
														height: 39,
														top: centerY,
														left: centerX,
														scaleX: 1.53,
														scaleY: 1.53,
														fontSize: overlayTextFiltersState.writePostfontSize,
														textAlign: 'center',
														originX: 'center',
														originY: 'center',
													});
												}
												updateTextBox(canvas, { text });
												setOverlayTextFiltersState((prev) => ({
													...prev,
													text,
												}));
											}}
											style={{
												userSelect: 'text',
												margin: '0px',
												marginBottom: '15px',
												cursor: 'pointer',
												color: '#a19d9d',
											}}
										>
											{summaryContent?.content}
										</h5>
									</>
								) : (
									<SummaryForm
										setSummaryContent={setSummaryContent}
										// summaryContent={summaryContent}
									/>
								)}
							</div>
						)}
					</div>
					<br />
					<br />
					<div
						style={{
							marginTop: '160px',
							position: 'relative',
						}}
					>
						<button
							onClick={handleSaveTemplate}
							style={{
								width: '100%',
								height: '42px',
								borderRadius: '25px',
								border: 'none',
								backgroundColor: '#3b0e39',
								color: 'white',

								cursor: 'pointer',
							}}
						>
							{!templateSaved ? 'Share' : 'Loading...'}
						</button>
						<br />
						<br />
						<button
							onClick={() => saveImage(canvas)}
							style={{
								width: '100%',
								height: '42px',
								borderRadius: '25px',
								border: 'none',
								backgroundColor: '#3b0e39',
								color: 'white',
								cursor: 'pointer',
							}}
						>
							Single Share
						</button>
					</div>
				</Box>
			</div>
		);
	}
);

export default Canvas;
