import { TemplateData } from '../types';

export const BaseURL = import.meta.env.VITE_APP_BASE_URL;
export const AUTH0_CLIENT_ID = `${import.meta.env.VITE_AUTH0_CLIENT_ID}`;
export const AUTH0_DOMAIN_ID = import.meta.env.VITE_AUTH0_DOMAIN_ID;
export const AUTH0_AUDIENCE_ID = `${import.meta.env.VITE_AUTH0_AUDIENCE_ID}`;

export const canvasDimension = {
	width: 540,
	height: 675,
};

export const templateData: TemplateData = {
	templates: [
		{
			placeholderImage: '/Placeholder_Images/Placeholder-1.jpg',
			overlayImage: '/images/sample/br11.png',
			filePath: 'default',
			opacity: 1,
			backgroundImage: true,
			diptych: undefined,
		},
		{
			placeholderImage: '/Placeholder_Images/Placeholder-2.jpg',
			overlayImage: '/images/overlay/op2.png',
			filePath: 'second',
			opacity: 0,
			backgroundImage: false,
			diptych: 'vertical',
		},
		{
			placeholderImage: '/Placeholder_Images/Placeholder-3.jpg',
			overlayImage: '/images/overlay/op3.png',
			filePath: 'third',
			opacity: 0,
			backgroundImage: false,
			diptych: 'horizontal',
		},
	],
	backgroundImages: [
		'/images/sample/tom-mrazek-USw07h3Okbg-unsplash.jpg',
		'/images/sample/toa-heftiba-FV3GConVSss-unsplash.jpg',
		'/images/sample/scott-circle-image.png',
		'https://res.cloudinary.com/dkh87tzrg/image/upload/v1671791251/f86duowvpgzgrsz7rfou.jpg',
		'https://res.cloudinary.com/dkh87tzrg/image/upload/v1665486789/hlfbvilioi8rlkrumq2g.jpg',
		'https://c.saavncdn.com/749/Calm-Nature-Sleep-Peaceful-Music-for-Relaxation-Restful-Sleep-Deep-Dreams-Soothing-Sounds-to-Calm-Down-Inner-Harmony-Sweet-Dreams-Music-at-Goodnight-English-2017-500x500.jpg',
	],
	bubbles: [
		'/images/sample/scott-circle-image.png',
		'https://res.cloudinary.com/dkh87tzrg/image/upload/v1671791251/f86duowvpgzgrsz7rfou.jpg',
	],
	texts: [
		"Dog Attack Claims 6-Year-Old's Life, Injures Woman",
		'Tragic Dog Attack Leaves Child Dead, Woman Injured',
		"Fatal Dog Attack Claims 6-Year-Old's Life, Woman Injured",
		"Dog Attack Claims 6-Year-Old's Life, Woman Injured",
		'6-Year-Old Killed, Woman Injured in Fatal Dog Attack',
		'Fatal Dog Attack Leaves 6-Year-Old Dead, Woman Injured',
	],
	borders: ['/images/sample/borders.png'],
	logos: ['/images/sample/special-tag.png'],
	elements: ['/images/sample/swipe-left.png'],
};
