import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';
import myLogo from '../../../public/logo/logo.png';
import {
	Checkbox,
	CircularProgress,
	Divider,
	FormControl,
	FormControlLabel,
	Grid,
	InputAdornment,
	InputLabel,
	MenuItem,
	Popover,
	Select,
	TextField,
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import toast from 'react-hot-toast';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useAuth0 } from '@auth0/auth0-react';
import { AUTH0_DOMAIN_ID } from '../../constants';
import axios from 'axios';
import { ColorResult, SketchPicker } from 'react-color';
import { useCanvasContext } from '../../context/CanvasContext';
import { uploadToCloudinary } from '../../services/cloudinary';
import { useNavigate } from 'react-router';
import GradientIcon from '@mui/icons-material/Gradient';
import ClearIcon from '@mui/icons-material/Clear';

interface UserMetaDataPayload {
	company: {
		name: string;
		website: string;
		color: string;
		font: string;
		logo: File | null;
		logo2: File | null;
		logo3: File | null;
		date: string;
		tags: string[];
		selectedTags: string[];
		inputTagValue: '';
		plan: string;
	};
}

const LoginUser = () => {
	const [activeStep, setActiveStep] = React.useState(0);
	const [skipped, setSkipped] = React.useState(new Set<number>());
	const { userMetaData, updateIsUserMetaExist, updateUserMetaData } =
		useCanvasContext();

	const [isLoading, setIsLoading] = React.useState(false);

	const [userMetaDataPayload, setUserMetaDataPayload] =
		React.useState<UserMetaDataPayload>({
			company: {
				name: '',
				website: '',
				color: '',
				font: '',
				logo: null,
				logo2: null,
				logo3: null,
				date: '',
				selectedTags: [''],
				tags: [
					'Gaming',
					'Xbox',
					'Playstation',
					'Virtual Reality',
					'PC Gaming etc',
				],

				inputTagValue: '',
				plan: 'free',
			},
		});
	console.log(
		'🚀 ~ handleTagClick ~ tags:',
		userMetaDataPayload?.company?.selectedTags
	);

	React.useEffect(() => {
		if (userMetaData?.company) setUserMetaDataPayload(userMetaData);
		return () => {
			setUserMetaDataPayload({
				company: {
					name: '',
					website: '',
					color: '',
					font: '',
					logo: null,
					logo2: null,
					logo3: null,
					date: '',
					tags: [''],
					selectedTags: [''],
					// tags: ['Gaming','Xbox','Playstation', 'Playstation', 'Virtual Reality', 'PC Gaming etc'],
					inputTagValue: '',
					plan: 'free',
				},
			});
		};
	}, [userMetaData]);

	const isStepSkipped = (step: number) => {
		return skipped.has(step);
	};

	const handleNext = () => {
		let newSkipped = skipped;
		if (isStepSkipped(activeStep)) {
			newSkipped = new Set(newSkipped.values());
			newSkipped.delete(activeStep);
		}

		setActiveStep((prevActiveStep) => prevActiveStep + 1);
		setSkipped(newSkipped);
	};

	//-----------------two -------------

	// const handleAddTag = (newTag: any) => {
	// 	if (
	// 		newTag !== '' &&
	// 		userMetaDataPayload.company.tags.length < 10 &&
	// 		!userMetaDataPayload.company.tags.includes(newTag)
	// 	) {
	// 		setUserMetaDataPayload((prev) => ({
	// 			...prev,
	// 			company: {
	// 				...prev.company,
	// 				tags: [...prev.company.tags, newTag],
	// 			},
	// 		}));
	// 	}
	// };

	// const handleAddTag = (newTag: any) => {
	// 	console.log(
	// 		'userMetaDataPayload.company.tags.length',
	// 		userMetaDataPayload.company.tags.length
	// 	);
	// 	if (
	// 		newTag !== '' &&
	// 		userMetaDataPayload.company.tags.length < 10 &&
	// 		!userMetaDataPayload.company.tags.includes(newTag)
	// 	) {
	// 		setUserMetaDataPayload((prev) => ({
	// 			...prev,
	// 			company: {
	// 				...prev.company,
	// 				tags: [...prev.company.tags, newTag],
	// 			},
	// 		}));
	// 	} else if (userMetaDataPayload.company.tags.includes(newTag)) {
	// 		toast.error('Tag already exists.');
	// 	} else {
	// 		toast.error('Maximum of 10 tags allowed.');
	// 	}
	// };
	const handleAddTag = (newTag: any) => {
		if (newTag !== '') {
			// Check if the tag already exists in the list
			const tagExists = userMetaDataPayload.company.tags.includes(newTag);

			if (!tagExists) {
				// Check if the maximum limit of 10 tags is reached
				if (userMetaDataPayload.company.tags.length < 10) {
					setUserMetaDataPayload((prev) => ({
						...prev,
						company: {
							...prev.company,
							tags: [...prev.company.tags, newTag],
						},
					}));
				} else {
					toast.error('Maximum of 10 tags allowed.');
				}
			} else {
				toast.error('Tag already exists.');
			}
		} else {
			toast.error('Tag cannot be empty.');
		}
	};

	const handleKeyDown = (event: any) => {
		if (event.key === 'Enter') {
			const newTag = event.target.value.trim();
			handleAddTag(newTag);
			event.target.value = ''; // Clear the input field
		}
	};
	// const tags: Tag[] = [
	// 	{ name: 'Gaming', icon: <BusinessIcon sx={{ width: '20px' }} /> },
	// 	{
	// 		name: 'Xbox',
	// 		icon: <BusinessIcon sx={{ width: '20px' }} />,
	// 	},
	// 	{ name: 'Playstation', icon: <BusinessIcon sx={{ width: '20px' }} /> },
	// 	{ name: 'Virtual Reality', icon: <BusinessIcon sx={{ width: '20px' }} /> },
	// 	{ name: 'PC Gaming etc', icon: <BusinessIcon sx={{ width: '20px' }} /> },
	// ];

	// const handleDateTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
	// 	setUserMetaDataPayload((prev) => ({
	// 		...prev,
	// 		company: { ...prev.company, date: event.target.value },
	// 	}));
	// };

	const handleTagClick = (tagName: string) => {
		let tags = userMetaDataPayload.company.tags || [];
		if (userMetaDataPayload.company.tags?.includes(tagName)) {
			// Filter out the clicked tag correctly
			tags = userMetaDataPayload.company.tags?.filter((tag) => tag !== tagName);
		} else {
			tags.push(tagName);
		}
		setUserMetaDataPayload((prev) => ({
			...prev,
			company: { ...prev.company, tags },
		}));
	};
	// const handleTagClick = (tagName: string) => {
	// 	let selectedTags = userMetaDataPayload.company.selectedTags || [];
	// 	if (userMetaDataPayload.company.selectedTags?.includes(tagName)) {
	// 		// Filter out the clicked tag correctly
	// 		selectedTags = userMetaDataPayload.company.selectedTags?.filter(
	// 			(tag) => tag !== tagName
	// 		);
	// 	} else {
	// 		selectedTags.push(tagName);
	// 	}
	// 	setUserMetaDataPayload((prev) => ({
	// 		...prev,
	// 		company: { ...prev.company, selectedTags },
	// 	}));
	// };

	const handleSubmitOne = async () => {
		const { company } = userMetaDataPayload;
		if (company.date.trim() === '') {
			toast.error('Please select a date and time');
			return;
		}
		if (company.tags.length !== 0) {
			handleNext();

			// handleNext();
		} else {
			toast.error('Please enter a valid SelectedTag');
		}
	};

	//_____________________________________________________________________
	const { user, getAccessTokenSilently } = useAuth0();
	const navigate = useNavigate();

	const handleSubmit3 = async () => {
		const { company } = userMetaDataPayload;
		setIsLoading(true);
		let imgUrl = null;
		if (company.logo) imgUrl = await uploadToCloudinary(company.logo as any);

		if (company.tags.length !== 0) {
			const data = {
				user_metadata: {
					...userMetaData,
					company: { ...company, logo: imgUrl },
				},
			};
			const accessToken = await getAccessTokenSilently();

			try {
				const url = `https://${AUTH0_DOMAIN_ID}/api/v2/users/${user?.sub}`;
				const headers = {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
				};
				const response = await axios.patch(url, data, {
					headers: headers,
				});

				if (response.status === 200) {
					// console.log('Data saved successfully', response?.data?.user_metadata);
					toast.success('Data saved successfully');
					setIsLoading(false);
					updateIsUserMetaExist(true);
					updateUserMetaData(response?.data?.user_metadata);
					navigate('/');
				} else {
					setIsLoading(false);
					console.error('Failed to save data:', response.data);
				}
			} catch (error) {
				setIsLoading(false);
				if (error) {
					console.error('Error response:', error);
				}
			}

			// handleNext();
		} else {
			toast.error('Please enter a valid SelectedTag');
		}
	};
	//COLOR PICKER

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

	const handleColorChange = (newColor: ColorResult) => {
		setUserMetaDataPayload((prev) => ({
			...prev,
			company: { ...prev.company, color: newColor.hex },
		}));

		setAnchorEl(null);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		const isValidHex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value);
		if (isValidHex) {
			setUserMetaDataPayload((prev) => ({
				...prev,
				company: { ...prev.company, color: value },
			}));
		}
	};

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);
	const id = open ? 'color-popover' : undefined;

	//----------

	const handleSubmit4 = () => {
		handleNext();
	};

	const handleSubmit1 = (e: any) => {
		e.preventDefault();
		handleNext();
	};
	const handleImage = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 0) {
			const file = event.target.files[0];
			setUserMetaDataPayload((prev) => ({
				...prev,
				company: { ...prev.company, logo: file as any },
			}));
		}
	};

	const handleImage2 = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 0) {
			const file = event.target.files[0];
			setUserMetaDataPayload((prev) => ({
				...prev,
				company: { ...prev.company, logo2: file as any },
			}));
		}
	};

	const handleImage3 = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 0) {
			const file = event.target.files[0];
			setUserMetaDataPayload((prev) => ({
				...prev,
				company: { ...prev.company, logo3: file as any },
			}));
		}
	};

	return (
		<Box sx={{ p: 3 }}>
			<React.Fragment>
				{activeStep === 0 && (
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							width: '100%',
						}}
					>
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'center',
								width: { md: '520px', sm: '500px', xs: '80%' },
								flexDirection: 'column',
								px: 2,
								py: 1.5,
								boxShadow:
									'rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px',
							}}
						>
							<Typography
								sx={{
									color: 'black',
									fontWeight: 'bold',
									fontSize: '12px',
									textAlign: 'center',
									mb: 2,
									// border: '1px solid',
								}}
							>
								Lets setup your profile (you can change this later). If you have
								more than one brand, enter your main brands details for now and
								we will add your other accounts later’
							</Typography>
							<form onSubmit={handleSubmit1}>
								<Box
									sx={{
										display: 'flex',
										gap: 2,
										flexDirection: 'column',
									}}
								>
									<TextField
										name='userName'
										label='Company/Brand/Social Media Account User Name'
										variant='outlined'
										value={userMetaDataPayload.company.name}
										onChange={(event) =>
											setUserMetaDataPayload((prev) => ({
												...prev,
												company: {
													...prev.company,
													name: event.target.value,
												},
											}))
										}
										fullWidth
										required
									/>

									<div
										style={{
											position: 'relative',
										}}
									>
										<TextField
											id='color-field'
											label='Choose a color'
											value={userMetaDataPayload.company.color}
											onChange={handleInputChange}
											onClick={handleClick}
											variant='outlined'
											fullWidth
											InputProps={{
												startAdornment: (
													<InputAdornment position='start'>
														<GradientIcon
															sx={{
																color: userMetaDataPayload.company.color,
																cursor: 'pointer',
															}}
														/>
													</InputAdornment>
												),
											}}
										/>
										<Box
											onClick={handleClick}
											sx={{
												marginTop: '10px',
												width: { md: '50%', sm: '50%', xs: '40%' },
												height: '36px',
												backgroundColor: userMetaDataPayload.company.color,
												position: 'absolute',
												right: 10,
												top: 0,
												cursor: 'pointer',
											}}
										></Box>
										<Popover
											id={id}
											open={open}
											anchorEl={anchorEl}
											onClose={handleClose}
											anchorOrigin={{
												vertical: 'bottom',
												horizontal: 'left',
											}}
										>
											<SketchPicker
												color={userMetaDataPayload.company.color}
												onChange={handleColorChange}
											/>
										</Popover>
									</div>

									<FormControl fullWidth variant='outlined'>
										<InputLabel id='font-type-label'>
											Select Font Type
										</InputLabel>
										<Select
											labelId='font-type-label'
											id='font-type-select'
											value={userMetaDataPayload.company.font}
											onChange={(event) =>
												setUserMetaDataPayload((prev) => ({
													...prev,
													company: {
														...prev.company,
														font: event.target.value,
													},
												}))
											}
											label='Select Font Type'
											name='fontType'
										>
											<MenuItem value='Arial'>Arial</MenuItem>
											<MenuItem value='Times New Roman'>
												Times New Roman
											</MenuItem>
											<MenuItem value='Verdana'>Verdana</MenuItem>
										</Select>
									</FormControl>

									<TextField
										name='website'
										label='Company/Brand Website optional'
										variant='outlined'
										value={userMetaDataPayload.company.website}
										onChange={(event) =>
											setUserMetaDataPayload((prev) => ({
												...prev,
												company: {
													...prev.company,
													website: event.target.value,
												},
											}))
										}
										fullWidth
									/>

									<Box
										sx={{
											display: 'flex',
											justifyContent: 'space-between',
											alignItems: 'center',
											flexWrap: 'wrap',
										}}
									>
										<Box
											sx={{
												display: 'flex',
												justifyContent: 'center',
												alignItems: 'center',
												flexDirection: 'column',
												gap: 2,
											}}
										>
											<Box
												sx={{
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
												}}
											>
												{userMetaDataPayload?.company?.logo ? (
													<img
														src={
															typeof userMetaDataPayload.company?.logo ===
															'string'
																? userMetaDataPayload.company?.logo
																: URL.createObjectURL(
																		userMetaDataPayload.company?.logo
																  )
														}
														alt='User Photo'
														width={'85px'}
														height={'85px'}
														style={{ marginLeft: '10px', borderRadius: '20px' }}
													/>
												) : (
													<img
														src={myLogo}
														alt='User Photo'
														width={'70px'}
														height={'70px'}
														style={{ marginLeft: '10px' }}
													/>
												)}
											</Box>
											<Box
												sx={{
													display: 'flex',
													justifyContent: 'center',
													alignItems: 'center',
													border: '1px solid #C4C4C4',
													py: 0.7,
													borderRadius: '20px',
													cursor: 'pointer',
													backgroundColor: userMetaDataPayload.company.logo3
														? '#C4C4C4'
														: null,
													'&: hover': {
														backgroundColor: '#4B1248',
														color: '#FFFFFF',
													},
												}}
											>
												<label
													htmlFor='upload-photo'
													style={{ display: 'flex', alignItems: 'center' }}
												>
													<input
														id='upload-photo'
														type='file'
														name='userPhoto'
														accept='image/png, image/jpeg'
														onChange={handleImage}
														style={{
															position: 'absolute',
															width: '1px',
															height: '1px',
															padding: '0',
															margin: '-1px',
															overflow: 'hidden',
															clip: 'rect(0, 0, 0, 0)',
															border: '0',
															cursor: 'pointer',
														}}
													/>

													<div
														style={{
															display: 'flex',
															alignItems: 'center',
															cursor: 'pointer',
														}}
													>
														<span style={{ marginRight: '0.5rem' }}>
															<i className='fas fa-file-image'></i>
														</span>
														<CloudUploadIcon sx={{ fontSize: '36px' }} />
													</div>
												</label>
												<label
													htmlFor='upload-photo'
													style={{
														marginLeft: '0.5rem',
														maxWidth: '100%',
														overflow: 'hidden',
														whiteSpace: 'nowrap',
														textOverflow: 'ellipsis',
													}}
												>
													{userMetaDataPayload.company.logo ? (
														typeof userMetaDataPayload.company.logo ===
														'string' ? (
															<Typography
																variant='body1'
																sx={{
																	width: '70px',
																	whiteSpace: 'nowrap',
																	overflow: 'hidden',
																	textOverflow: 'ellipsis',
																	pr: 1,
																}}
															>
																{userMetaDataPayload.company.logo}
															</Typography>
														) : (
															// <span>
															<Typography
																variant='body1'
																sx={{
																	width: '50px',
																	whiteSpace: 'nowrap',
																	overflow: 'hidden',
																	textOverflow: 'ellipsis',
																	border: '1px solid red',
																	px: 2,
																}}
															>
																{userMetaDataPayload.company.logo.name}
															</Typography>
														)
													) : (
														'Square logo'
													)}
												</label>
											</Box>
										</Box>
										<Box
											sx={{
												display: 'flex',
												justifyContent: 'center',
												alignItems: 'center',
												flexDirection: 'column',
												gap: 2,
											}}
										>
											<Box
												sx={{
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
												}}
											>
												{userMetaDataPayload?.company?.logo2 ? (
													<img
														src={
															typeof userMetaDataPayload.company?.logo2 ===
															'string'
																? userMetaDataPayload.company?.logo2
																: URL.createObjectURL(
																		userMetaDataPayload.company?.logo2
																  )
														}
														alt='User Photo'
														width={'85px'}
														height={'85px'}
														style={{ marginLeft: '10px', borderRadius: '20px' }}
													/>
												) : (
													<img
														src={myLogo}
														alt='User Photo'
														width={'70px'}
														height={'70px'}
														style={{
															marginLeft: '10px',
															border: '1px solid',
															padding: '5px',
														}}
													/>
												)}
											</Box>
											<Box
												sx={{
													display: 'flex',
													justifyContent: 'center',
													alignItems: 'center',
													border: '1px solid #C4C4C4',
													py: 0.7,
													borderRadius: '20px',
													cursor: 'pointer',
													backgroundColor: userMetaDataPayload.company.logo3
														? '#C4C4C4'
														: null,
													'&: hover': {
														backgroundColor: '#4B1248',
														color: '#FFFFFF',
													},
												}}
											>
												<label
													htmlFor='upload-photo2'
													style={{ display: 'flex', alignItems: 'center' }}
												>
													<input
														id='upload-photo2'
														type='file'
														name='userPhoto'
														accept='image/png, image/jpeg'
														onChange={handleImage2}
														style={{
															position: 'absolute',
															width: '1px',
															height: '1px',
															padding: '0',
															margin: '-1px',
															overflow: 'hidden',
															clip: 'rect(0, 0, 0, 0)',
															border: '0',
															cursor: 'pointer',
														}}
													/>

													<div
														style={{
															display: 'flex',
															alignItems: 'center',
															cursor: 'pointer',
														}}
													>
														<span style={{ marginRight: '0.5rem' }}>
															<i className='fas fa-file-image'></i>
														</span>
														<CloudUploadIcon sx={{ fontSize: '36px' }} />
													</div>
												</label>
												<label
													htmlFor='upload-photo2'
													style={{
														marginLeft: '0.5rem',
														maxWidth: '100%',
														overflow: 'hidden',
														whiteSpace: 'nowrap',
														textOverflow: 'ellipsis',
													}}
												>
													{userMetaDataPayload.company.logo2 ? (
														typeof userMetaDataPayload.company.logo2 ===
														'string' ? (
															<Typography
																variant='body1'
																sx={{
																	width: '70px',
																	whiteSpace: 'nowrap',
																	overflow: 'hidden',
																	textOverflow: 'ellipsis',
																	pr: 1,
																}}
															>
																{userMetaDataPayload.company.logo2}
															</Typography>
														) : (
															<Typography
																variant='body1'
																sx={{
																	width: '70px',
																	whiteSpace: 'nowrap',
																	overflow: 'hidden',
																	textOverflow: 'ellipsis',
																	pr: 1,
																}}
															>
																{userMetaDataPayload.company.logo2.name}
															</Typography>
														)
													) : (
														<Typography
															variant='body1'
															sx={{
																width: '70px',
																whiteSpace: 'nowrap',
																overflow: 'hidden',
																textOverflow: 'ellipsis',
																pr: 1,
															}}
														>
															Rectangular Logo
														</Typography>
													)}
												</label>
											</Box>
										</Box>
										<Box
											sx={{
												display: 'flex',
												justifyContent: 'center',
												alignItems: 'center',
												flexDirection: 'column',
												gap: 2,
											}}
										>
											<Box
												sx={{
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
												}}
											>
												{userMetaDataPayload?.company?.logo3 ? (
													<img
														src={
															typeof userMetaDataPayload.company?.logo3 ===
															'string'
																? userMetaDataPayload.company?.logo3
																: URL.createObjectURL(
																		userMetaDataPayload.company?.logo3
																  )
														}
														alt='User Photo'
														width={'85px'}
														height={'85px'}
														style={{ marginLeft: '10px', borderRadius: '20px' }}
													/>
												) : (
													<img
														src={myLogo}
														alt='User Photo'
														width={'70px'}
														height={'70px'}
														style={{
															marginLeft: '10px',
															border: '1px solid',
															padding: '5px',
														}}
													/>
												)}
											</Box>
											<Box
												sx={{
													display: 'flex',
													justifyContent: 'center',
													alignItems: 'center',
													border: '1px solid #C4C4C4',
													py: 0.7,
													borderRadius: '20px',
													cursor: 'pointer',
													backgroundColor: userMetaDataPayload.company.logo3
														? '#C4C4C4'
														: null,
													'&: hover': {
														backgroundColor: '#4B1248',
														color: '#FFFFFF',
													},
												}}
											>
												<label
													htmlFor='upload-photo3'
													style={{ display: 'flex', alignItems: 'center' }}
												>
													<input
														id='upload-photo3'
														type='file'
														name='userPhoto'
														accept='image/png, image/jpeg'
														onChange={handleImage3}
														style={{
															position: 'absolute',
															width: '1px',
															height: '1px',
															padding: '0',
															margin: '-1px',
															overflow: 'hidden',
															clip: 'rect(0, 0, 0, 0)',
															border: '0',
															cursor: 'pointer',
														}}
													/>

													<div
														style={{
															display: 'flex',
															alignItems: 'center',
															cursor: 'pointer',
														}}
													>
														<span style={{ marginRight: '0.5rem' }}>
															<i className='fas fa-file-image'></i>
														</span>
														<CloudUploadIcon sx={{ fontSize: '36px' }} />
													</div>
												</label>
												<label
													htmlFor='upload-photo3'
													style={{
														marginLeft: '0.5rem',
														maxWidth: '100%',
														overflow: 'hidden',
														whiteSpace: 'nowrap',
														textOverflow: 'ellipsis',
													}}
												>
													{userMetaDataPayload.company.logo3 ? (
														typeof userMetaDataPayload.company.logo3 ===
														'string' ? (
															<Typography
																variant='body1'
																sx={{
																	width: '70px',
																	whiteSpace: 'nowrap',
																	overflow: 'hidden',
																	textOverflow: 'ellipsis',
																	pr: 1,
																}}
															>
																{userMetaDataPayload.company.logo3}
															</Typography>
														) : (
															<Typography
																variant='body1'
																sx={{
																	width: '70px',
																	whiteSpace: 'nowrap',
																	overflow: 'hidden',
																	textOverflow: 'ellipsis',
																	pr: 1,
																}}
															>
																{userMetaDataPayload.company.logo3.name}
															</Typography>
															// </span>
														)
													) : (
														<Typography
															variant='body1'
															sx={{
																width: '70px',
																whiteSpace: 'nowrap',
																overflow: 'hidden',
																textOverflow: 'ellipsis',
																pr: 1,
															}}
														>
															User Profile
														</Typography>
													)}
												</label>
											</Box>
										</Box>
									</Box>

									<Button
										type='submit'
										variant='contained'
										color='primary'
										sx={{
											textTransform: 'none',
											py: 1.5,
											borderRadius: '20px',
										}}
									>
										Continue
									</Button>
								</Box>
							</form>
						</Box>
					</Box>
				)}

				{activeStep === 1 && (
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							width: '100%',
						}}
					>
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'center',
								width: { md: '520px', sm: '500px', xs: '80%' },
								flexDirection: 'column',
								gap: 3,
								p: 2,
								boxShadow:
									'rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px',
							}}
						>
							<Typography
								sx={{
									color: 'black',
									fontWeight: 'bold',
									fontSize: '12px',
									textAlign: 'center',
								}}
							>
								Tell us about the news you want to receive. Use the fields below
								to enter up to 10 keywords relevant to your niche. For example,
								if you post about gaming, you might enter ‘Gaming’, ‘Xbox’,
								Playstation’, ‘Virtual Reality’ etc
							</Typography>

							<TextField
								id='tag-input'
								label='Enter tag'
								onKeyDown={handleKeyDown}
								fullWidth
							/>
							{/* <TextField
								id='filled-basic'
								variant='filled'
								label='Select your interests'
								placeholder='Click a tag to select'
								value={userMetaDataPayload.company.tags.join(', ')} // Display selected tags
								onChange={(event) =>
									setUserMetaDataPayload((prev) => ({
										...prev,
										company: {
											...prev.company,
											tags: event.target.value
												.trim()
												.split(',')
												.map((tag) => tag.trim()),
										},
									}))
								}
								required
							/> */}

							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									flexWrap: 'wrap',
									gap: 2,
								}}
							>
								{userMetaDataPayload?.company?.tags?.map((tag, index) => (
									<Button
										key={index}
										sx={{
											marginRight: '10px',
											cursor: 'pointer',
											color: userMetaDataPayload.company.tags.includes(tag)
												? 'white'
												: 'black', // Change text color based on selection
											backgroundColor:
												userMetaDataPayload.company.tags.includes(tag)
													? '#4B1248'
													: 'transparent', // Highlight selected tags
											border: '1px solid',
											borderRadius: '20px',
											px: 2,
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
											gap: 1,
											':hover': {
												color: userMetaDataPayload.company.tags.includes(tag)
													? 'black'
													: 'black',
											},
										}}
										onClick={() => handleTagClick(tag)}
									>
										{tag && (
											<>
												<BusinessIcon sx={{ width: '20px' }} />
												{tag}
												<ClearIcon
													sx={{ fontSize: '20px', color: '#4B1248' }}
												/>
												{userMetaDataPayload.company.selectedTags?.includes(
													tag
												)}
											</>
										)}
									</Button>
								))}
							</Box>
							<Button
								variant='contained'
								onClick={handleSubmitOne}
								sx={{
									textTransform: 'none',
									py: 1.5,
									borderRadius: '20px',
								}}
							>
								Continue
							</Button>
						</Box>
					</Box>
				)}

				{activeStep === 2 && (
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							width: '100%',
						}}
					>
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								width: { md: '90%', sm: '95%', xs: '98%' },
								flexDirection: 'column',
								gap: 3,
							}}
						>
							<Typography
								sx={{
									color: 'black',
									fontWeight: 'bold',
									fontSize: '30px',
									textAlign: 'center',
								}}
							>
								Find the plane for you
							</Typography>
							<Typography
								sx={{
									color: 'black',
									fontWeight: '400',
									fontSize: '13px',
									textAlign: 'center',
								}}
							>
								You can change at anytime
							</Typography>

							<Grid container spacing={2}>
								<Grid item xs={12} sm={6} md={4}>
									<Box
										sx={{
											minHeight: 500,
											display: 'flex',
											justifyContent: 'space-between',
											flexDirection: 'column',
											//  p:2,
											borderRadius: '30px',
											height: '100%',

											boxShadow:
												'rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px',
										}}
									>
										<Box>
											<Box
												sx={{
													display: 'flex',
													justifyContent: 'space-between',
													alignItems: 'center',
													p: 2,
													backgroundColor:
														userMetaDataPayload?.company?.plan === 'free'
															? '#502274'
															: '',
													borderRadius: '30px 30px 0px 0px',
												}}
											>
												<Typography
													sx={{
														fontSize: '24px',
														fontWeight: 'bold',
														color:
															userMetaDataPayload?.company?.plan === 'free'
																? 'white'
																: '',
													}}
												>
													Free
												</Typography>
												{/* <Checkbox {...label} /> */}
												<FormControlLabel
													control={
														<Checkbox
															checked={
																userMetaDataPayload.company.plan === 'free'
															}
															onChange={() =>
																setUserMetaDataPayload((prev) => ({
																	...prev,
																	company: { ...prev.company, plan: 'free' },
																}))
															}
															sx={{
																'&.Mui-checked': {
																	color: 'white',
																},
															}}
														/>
													}
													label=''
												/>
											</Box>
											<Typography
												sx={{
													p: 2,
													fontWeight: 600,
													backgroundColor:
														userMetaDataPayload?.company?.plan === 'free'
															? '#502274'
															: '',

													color:
														userMetaDataPayload?.company?.plan === 'free'
															? 'white'
															: '',
												}}
											>
												For your personal Link tree
											</Typography>

											<Divider />
											<Typography
												sx={{
													p: 2,
													fontSize: '18px',
													fontWeight: 600,
													fontFamily: 'Roboto',
												}}
											>
												For your personal Link tree
											</Typography>
											<Box
												sx={{
													display: 'flex',
													justifyContent: 'flex-start',
													alignItems: 'center',
													px: 2,
												}}
											>
												<CheckIcon sx={{ color: '#E04BED' }} />
												<Typography
													sx={{
														py: 2,
														pl: 0.5,
														fontSize: '18px',
														fontWeight: 500,
														fontFamily: 'Roboto',
													}}
												>
													Unlimited Links
												</Typography>
											</Box>
										</Box>
										<Box>
											<Box sx={{ p: 2 }}>
												<Typography
													sx={{
														fontSize: '24px',
														fontWeight: 'bold',
														fontFamily: 'Roboto',
													}}
												>
													Free
												</Typography>

												<Typography
													sx={{
														fontSize: '18px',
														fontWeight: 500,
														fontFamily: 'Roboto',
													}}
												>
													Free, Forever
												</Typography>
											</Box>
										</Box>
									</Box>
								</Grid>

								<Grid item xs={12} sm={6} md={4}>
									<Box
										sx={{
											minHeight: 500,
											display: 'flex',
											justifyContent: 'space-between',
											flexDirection: 'column',
											height: '100%',

											borderRadius: '30px',
											boxShadow:
												'rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px',
										}}
									>
										<Box>
											<Box
												sx={{
													display: 'flex',
													justifyContent: 'space-between',
													alignItems: 'center',
													p: 2,
													backgroundColor:
														userMetaDataPayload?.company?.plan === 'starter'
															? '#502274'
															: '',
													borderRadius: '30px 30px 0px 0px',
												}}
											>
												<Typography
													sx={{
														fontSize: '24px',
														fontWeight: 'bold',
														color:
															userMetaDataPayload?.company?.plan === 'starter'
																? 'white'
																: '',
													}}
												>
													Starter
												</Typography>
												{/* <Checkbox {...label} /> */}
												<FormControlLabel
													control={
														<Checkbox
															checked={
																userMetaDataPayload.company.plan === 'starter'
															}
															onChange={() =>
																setUserMetaDataPayload((prev) => ({
																	...prev,
																	company: { ...prev.company, plan: 'starter' },
																}))
															}
															sx={{
																'&.Mui-checked': {
																	color: 'white',
																},
															}}
														/>
													}
													label=''
												/>
											</Box>
											<Typography
												sx={{
													p: 2,
													fontWeight: 600,
													backgroundColor:
														userMetaDataPayload?.company?.plan === 'starter'
															? '#502274'
															: '',
													color:
														userMetaDataPayload?.company?.plan === 'starter'
															? 'white'
															: '',
												}}
											>
												For growing influences
											</Typography>

											<Divider />
											<Typography
												sx={{
													p: 2,
													fontSize: '18px',
													fontWeight: 600,
													fontFamily: 'Roboto',
												}}
											>
												For growing influences
											</Typography>
											<Box
												sx={{
													display: 'flex',
													justifyContent: 'flex-start',
													alignItems: 'center',
													px: 2,
													pb: 1,
												}}
											>
												<CheckIcon sx={{ color: '#E04BED' }} />
												<Typography
													sx={{
														fontSize: '18px',
														fontWeight: 500,
														fontFamily: 'Roboto',
														color: '#666666',
													}}
												>
													Upgrade Style Options
												</Typography>
											</Box>
											<Box
												sx={{
													display: 'flex',
													px: 2,
													pb: 1,
												}}
											>
												<CheckIcon sx={{ color: '#E04BED' }} />
												<Typography
													sx={{
														fontSize: '18px',
														fontWeight: 500,
														fontFamily: 'Roboto',
														color: '#666666',
													}}
												>
													Monetization support w/affiliate marketing tools
												</Typography>
											</Box>
											<Box
												sx={{
													display: 'flex',
													px: 2,
													pb: 1,
												}}
											>
												<CheckIcon sx={{ color: '#E04BED' }} />
												<Typography
													sx={{
														fontSize: '18px',
														fontWeight: 500,
														fontFamily: 'Roboto',
														color: '#666666',
													}}
												>
													Scheduling
												</Typography>
											</Box>
											<Box
												sx={{
													display: 'flex',
													px: 2,
													pb: 1,
												}}
											>
												<CheckIcon sx={{ color: '#E04BED' }} />
												<Typography
													sx={{
														fontSize: '18px',
														fontWeight: 500,
														fontFamily: 'Roboto',
														color: '#666666',
													}}
												>
													Audience insights
												</Typography>
											</Box>
										</Box>
										<Box>
											<Box sx={{ p: 2 }}>
												<Typography
													sx={{
														fontSize: '24px',
														fontWeight: 'bold',
														fontFamily: 'Roboto',
													}}
												>
													$4 USD
												</Typography>

												<Typography
													sx={{
														fontSize: '18px',
														fontWeight: 500,
														fontFamily: 'Roboto',
														color: '#666666',
													}}
												>
													Per month, billed annually, or $5 billed monthly
												</Typography>
											</Box>
										</Box>
									</Box>
								</Grid>

								<Grid item xs={12} sm={6} md={4}>
									<Box
										sx={{
											minHeight: 500,
											display: 'flex',
											justifyContent: 'space-between',
											flexDirection: 'column',
											height: '100%',

											borderRadius: '30px',
											boxShadow:
												'rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px',
										}}
									>
										<Box>
											<Box
												sx={{
													display: 'flex',
													justifyContent: 'space-between',
													alignItems: 'center',
													p: 2,
													backgroundColor:
														userMetaDataPayload?.company?.plan === 'pro'
															? '#502274'
															: '',
													borderRadius: '30px 30px 0px 0px',
												}}
											>
												<Typography
													sx={{
														fontSize: '24px',
														fontWeight: 'bold',
														// color: 'white',
														color:
															userMetaDataPayload?.company?.plan === 'pro'
																? 'white'
																: '',
													}}
												>
													Pro
												</Typography>
												<FormControlLabel
													control={
														<Checkbox
															checked={
																userMetaDataPayload.company.plan === 'pro'
															}
															onChange={() =>
																setUserMetaDataPayload((prev) => ({
																	...prev,
																	company: { ...prev.company, plan: 'pro' },
																}))
															}
															sx={{
																'&.Mui-checked': {
																	color: 'white',
																},
															}}
														/>
													}
													label=''
												/>
											</Box>
											<Typography
												sx={{
													p: 2,
													fontWeight: 600,
													backgroundColor:
														userMetaDataPayload?.company?.plan === 'pro'
															? '#502274'
															: '',
													color:
														userMetaDataPayload?.company?.plan === 'pro'
															? 'white'
															: '',
												}}
											>
												For creators and businesses
											</Typography>

											{/* </Box> */}
											<Divider />
											<Typography
												sx={{
													p: 2,
													fontSize: '18px',
													fontWeight: 600,
													fontFamily: 'Roboto',
												}}
											>
												For creators and businesses
											</Typography>
											<Box
												sx={{
													display: 'flex',
													px: 2,
													pb: 1,
												}}
											>
												<CheckIcon sx={{ color: '#E04BED' }} />
												<Typography
													sx={{
														fontSize: '18px',
														fontWeight: 500,
														fontFamily: 'Roboto',
														color: '#666666',
													}}
												>
													Advanced customization of buttons, themes, and fonts
												</Typography>
											</Box>
											<Box
												sx={{
													display: 'flex',
													px: 2,
													pb: 1,
												}}
											>
												<CheckIcon sx={{ color: '#E04BED' }} />
												<Typography
													sx={{
														fontSize: '18px',
														fontWeight: 500,
														fontFamily: 'Roboto',
														color: '#666666',
													}}
												>
													Click, conversion, and revenue tracking
												</Typography>
											</Box>
											<Box
												sx={{
													display: 'flex',
													px: 2,
													pb: 1,
												}}
											>
												<CheckIcon sx={{ color: '#E04BED' }} />
												<Typography
													sx={{
														fontSize: '18px',
														fontWeight: 500,
														fontFamily: 'Roboto',
														color: '#666666',
													}}
												>
													Upgraded customer support
												</Typography>
											</Box>
											<Box
												sx={{
													display: 'flex',
													px: 2,
													pb: 1,
												}}
											>
												<CheckIcon sx={{ color: '#E04BED' }} />
												<Typography
													sx={{
														fontSize: '18px',
														fontWeight: 500,
														fontFamily: 'Roboto',
														color: '#666666',
													}}
												>
													Option to hide Linktree logo
												</Typography>
											</Box>
											<Box
												sx={{
													display: 'flex',
													px: 2,
													pb: 1,
												}}
											>
												<CheckIcon sx={{ color: '#E04BED' }} />
												<Typography
													sx={{
														fontSize: '18px',
														fontWeight: 500,
														fontFamily: 'Roboto',
														color: '#666666',
													}}
												>
													Social platform integrations to automatically display
													your latest content
												</Typography>
											</Box>
										</Box>
										<Box>
											<Box sx={{ p: 2 }}>
												<Typography
													sx={{
														fontSize: '24px',
														fontWeight: 'bold',
														fontFamily: 'Roboto',
													}}
												>
													Free for 30 days
												</Typography>

												<Typography
													sx={{
														fontSize: '18px',
														fontWeight: 500,
														fontFamily: 'Roboto',
														color: '#666666',
													}}
												>
													$7.50 per month, billed annually, or $9 billed monthly
												</Typography>
											</Box>
										</Box>
									</Box>
								</Grid>
							</Grid>
							<Button
								variant='contained'
								onClick={handleSubmit4}
								sx={{
									textTransform: 'none',
									p: 2,
									borderRadius: '20px',

									width: { md: '50%', sm: '70%', xs: '90%' },
								}}
							>
								Try Pro for free
							</Button>
						</Box>
					</Box>
				)}
				{activeStep === 3 && (
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							width: '100%',
						}}
					>
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'center',
								// alignItems: "center",
								width: { md: '520px', sm: '500px', xs: '80%' },
								flexDirection: 'column',
								gap: 3,
								p: 2,
								boxShadow:
									'rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px',
							}}
						>
							<Typography
								sx={{
									color: 'black',
									fontWeight: 'bold',
									fontSize: '30px',
									textAlign: 'center',
									mt: 2,
								}}
							>
								Thanks for signing up
							</Typography>
							<Typography
								sx={{
									color: 'black',
									fontWeight: '400',
									fontSize: '13px',
									textAlign: 'center',
								}}
							>
								To verify your account, click on the link sent to your inbox
							</Typography>
							<Typography
								sx={{
									color: 'black',
									fontWeight: '400',
									fontSize: '13px',
									textAlign: 'center',
								}}
							>
								({user?.email})
							</Typography>

							<Button
								variant='contained'
								onClick={handleSubmit3}
								sx={{
									textTransform: 'none',
									py: 1.5,
									borderRadius: '20px',
									position: 'relative',
									width: '100%',
								}}
							>
								{isLoading ? (
									<CircularProgress size={24} sx={{ color: 'white' }} /> // Render CircularProgress while loading
								) : (
									'Continue'
								)}
							</Button>
						</Box>
					</Box>
				)}
			</React.Fragment>
		</Box>
	);
};
export default LoginUser;
