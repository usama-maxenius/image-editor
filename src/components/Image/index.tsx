// @ts-nocheck
import { Box } from '@mui/material';
import './CustomSlider.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { MouseEvent } from 'react';

interface Props {
	images: { name: string; url: string }[];
	clickHandler: (url: string) => void;
	onDragStart: (e: MouseEvent, url: string) => void;
	children?: React.ReactNode;
}
const ImageViewer = ({
	images,
	clickHandler,
	children,
	onDragStart,
}: Props) => {
	//new code add
	const slides = images.length % 2 !== 0 ? [...images, ''] : images;
	//end
	var settings = {
		dots: true,
		infinite: false,
		speed: 500,
		draggable: false,
		slidesToShow: 2,
		slidesToScroll: 2,
		initialSlide: 0,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2,
					infinite: true,
					dots: true,
				},
			},
			{
				breakpoint: 600,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2,
					initialSlide: 1,
				},
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2,
				},
			},
		],
	};
	return (
		<Box id='custom-slider'>
			{children}
			<Slider touchMove={false} {...settings}>
				{slides.map((img, i) => {
					return (
						<Box
							key={i}
							sx={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								gap: 2,
							}}
							className='slider-container'
						>
							<Box
								sx={{
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									height: '150px',
									margin: '4px',
								}}
							>
								{img ? (
									<img
										style={{
											cursor: 'pointer',
											height: '100%',
											width: '100%',
											borderRadius: '10px',
										}}
										onDragStart={(e) => onDragStart(e, img)}
										onClick={() => clickHandler(img)}
										srcSet={`${img}`}
										src={`${img}`}
										loading='lazy'
									/>
								) : (
									<Box
										sx={{
											height: '100%',
											width: '100%',
										}}
									></Box>
								)}
							</Box>
						</Box>
					);
				})}

				{/* {images.map((img, i) => {
					return (
						<Box
							key={i}
							sx={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								gap: 2,
							}}
							className='slider-container'
						>
							<Box
								sx={{
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									height: '150px',
									margin: '4px',
								}}
							>
								<img
									style={{
										cursor: 'pointer',
										height: '100%',
										width: '100%',
										borderRadius: '10px',
									}}
									onDragStart={(e) => onDragStart(e, img)}
									onClick={() => clickHandler(img)}
									srcSet={`${img}`}
									src={`${img}`}
									loading='lazy'
								/>
							</Box>
						</Box>
					);
				})} */}
			</Slider>
			<br />
			<br />
		</Box>
	);
};

export default ImageViewer;
