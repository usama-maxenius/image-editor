// @ts-nocheck

import { Box, ImageList, ImageListItem } from '@mui/material';
import { Diptych } from '../../types';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface Props {
	images: { name: string; url: string }[];
	clickHandler: (url: string) => void;
	children?: React.ReactNode;
}
const ImageViewer = ({ images, clickHandler, children }: Props) => {
	var settings = {
		dots: true,
		infinite: false,
		speed: 500,
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

	const evenImages = images.filter((_, index) => index % 2 === 0);
	// console.log('🚀 ~ ImageViewer ~ evenImages:', evenImages);
	const oddImages = images.filter((_, index) => index % 2 !== 0);

	return (
		<Box>
			{children}
			<Slider {...settings}>
				{images.map((img) => {
					return (
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								gap: 2,
							}}
							className='slider-container'
							key={img}
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
									onClick={() => clickHandler(img)}
									srcSet={`${img}`}
									src={`${img}`}
									loading='lazy'
								/>
							</Box>
						</Box>
					);
				})}
			</Slider>
			<br />
			<br />
			{/* <Box sx={{ pb: 2 }}>Bottom Images</Box> */}
			{/* <Slider {...settings}>
				{oddImages.map((img) => {
					return (
						<Box className='slider-container' key={img} sx={{}}>
							<img
								style={{
									objectFit: 'contain',
									cursor: 'pointer',
									height: '200px',
								}}
								onClick={() => clickHandler(img)}
								srcSet={`${img}`}
								src={`${img}`}
								loading='lazy'
							/>
						</Box>
					);
				})}
			</Slider> */}
		</Box>
	);
};

export default ImageViewer;

// // @ts-nocheck

// import { ImageList, ImageListItem } from '@mui/material';
// import { Diptych } from '../../types';

// interface Props {
// 	images: { name: string; url: string }[];
// 	clickHandler: (url: string) => void;
// 	children?: React.ReactNode;
// }
// const ImageViewer = ({ images, clickHandler, children }: Props) => {
// 	return (
// 		<ImageList sx={{ width: '100%', height: 200 }} cols={2} rowHeight={160}>
// 			{children}
// 			{images.map((img) => (
// 				<ImageListItem key={img}>
// 					<img
// 						style={{
// 							objectFit: 'contain',
// 							cursor: 'pointer',
// 						}}
// 						onClick={() => clickHandler(img)}
// 						srcSet={`${img}`}
// 						src={`${img}`}
// 						loading='lazy'
// 					/>
// 				</ImageListItem>
// 			))}
// 		</ImageList>
// 	);
// };

// export default ImageViewer;
