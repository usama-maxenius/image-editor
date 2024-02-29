import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';

import {
	Checkbox,
	Divider,
	FormControl,
	FormControlLabel,
	Grid,
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
const steps = ['Select 1', 'Create 2', 'Create 3', 'Create 4'];
interface Tag {
	name: string;
	icon: React.ReactNode;
}

interface ChildProps {
	sendObjectToParent: (obj: any) => void;
}

const LoginUser: React.FC<ChildProps> = ({ sendObjectToParent }) => {
	const [activeStep, setActiveStep] = React.useState(0);
	const [skipped, setSkipped] = React.useState(new Set<number>());

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

	const handleReset = () => {
		setActiveStep(0);
	};

	//-----------------two -------------
	const tags: Tag[] = [
		{ name: '#Gaming', icon: <BusinessIcon sx={{ width: '20px' }} /> },
		{
			name: '#Xbox',
			icon: <BusinessIcon sx={{ width: '20px' }} />,
		},
		{ name: '#Playstation', icon: <BusinessIcon sx={{ width: '20px' }} /> },
		{ name: '#Virtual Reality', icon: <BusinessIcon sx={{ width: '20px' }} /> },
		{ name: '#PC Gaming etc', icon: <BusinessIcon sx={{ width: '20px' }} /> },
	];

	const [checkbox1Checked, setCheckbox1Checked] =
		React.useState<boolean>(false);
	const [checkbox2Checked, setCheckbox2Checked] =
		React.useState<boolean>(false);
	const [checkbox3Checked, setCheckbox3Checked] = React.useState<boolean>(true);

	const handleCheckbox1Change = () => {
		setCheckbox1Checked(true);
		setCheckbox2Checked(false);
		setCheckbox3Checked(false);
	};

	const handleCheckbox2Change = () => {
		setCheckbox1Checked(false);
		setCheckbox2Checked(true);
		setCheckbox3Checked(false);
	};

	const handleCheckbox3Change = () => {
		setCheckbox1Checked(false);
		setCheckbox2Checked(false);
		setCheckbox3Checked(true);
	};

	const [color, setColor] = React.useState<string>('#ffffff');
	const [userName, setUserName] = React.useState<string>('');
	const [fontType, setFontType] = React.useState<string>('');
	const [website, setWebsite] = React.useState<string>('');
	const [logo, setLogo] = React.useState<File | null>(null);
	const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
	const [dateTime, setDateTime] = React.useState<string>('');

	const handleDateTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setDateTime(event.target.value);
	};

	const handleTagClick = (tagName: string) => {
		if (selectedTags?.includes(tagName)) {
			setSelectedTags(selectedTags?.filter((tag) => tag !== tagName));
		} else {
			setSelectedTags([...selectedTags, tagName]);
		}
	};

	const handleSubmitOne = async () => {
		if (dateTime.trim() === '') {
			toast.error('Please select a date and time');
			return;
		}
		if (selectedTags.length !== 0) {
			handleNext();
			const data = {
				user_metadata: {
					name: userName,
					color: color,
					fontType: fontType,
					website: website,
					logo: logo,
					selectedTags: selectedTags,
					dateTime: dateTime,
				},
			};

			console.log('selectedTag', data);

			// handleNext();
		} else {
			toast.error('Please enter a valid SelectedTag');
		}
	};

	//_____________________________________________________________________
	const { user, getAccessTokenSilently } = useAuth0();
	const { userMetaData } = useCanvasContext();

	// console.log("🚀 ~ user:", user);
	const handleSubmit3 = async () => {
		let imgUrl = null;
		if (logo) imgUrl = await uploadToCloudinary(logo);

		if (selectedTags.length !== 0) {
			const data = {
				user_metadata: {
					...userMetaData,
					name: userName,
					color: color,
					fontType: fontType,
					website: website,
					logo: imgUrl,
					selectedTags: selectedTags,
					dateTime: dateTime,
					freeTrail: checkbox1Checked,
					starterTrail: checkbox2Checked,
					proTrail: checkbox3Checked,
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
					toast.success('Data saved successfully');
					sendObjectToParent(data);
					handleNext();
				} else {
					console.error('Failed to save data:', response.data);
				}
			} catch (error) {
				console.error('Error saving data:', error);
				if (error) {
					console.error('Error response:', error);
				}
			}
			console.log('selectedTag', data);

			// handleNext();
		} else {
			toast.error('Please enter a valid SelectedTag');
		}
	};
	//COLOR PICKER

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

	const handleColorChange = (newColor: ColorResult) => {
		setColor(newColor.hex);
		setAnchorEl(null);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		const isValidHex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value);
		if (isValidHex) {
			setColor(value);
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
		if (event.target.files === null) {
			return;
		}
		const file = event.target.files[0];
		setLogo(file);
	};

	return (
		<Box sx={{ p: 3 }}>
			{activeStep === steps.length ? (
				<React.Fragment>
					<Typography sx={{ mt: 2, mb: 1, color: 'red' }}>
						All steps completed - you&apos;re finished
					</Typography>
					<Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
						<Box sx={{ flex: '1 1 auto' }} />
						<Button onClick={handleReset}>Reset</Button>
					</Box>
				</React.Fragment>
			) : (
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
									gap: 3,
									mt: 2,
									// border: "1px solid",
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
									}}
								>
									Tell us about yourself
								</Typography>
								<form onSubmit={handleSubmit1}>
									<Box
										sx={{
											display: 'flex',
											gap: 2,
											flexDirection: 'column',
										}}
									>
										{/* Upload user photo */}
										<Box
											sx={{
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
											}}
										>
											{logo && (
												<img
													src={URL.createObjectURL(logo)}
													alt='User Photo'
													width={'100px'}
													height={'100px'}
													style={{ marginLeft: '10px', borderRadius: '50%' }}
												/>
											)}
										</Box>
										<TextField
											name='userName'
											label='Company/Brand/Social Media Account User Name'
											variant='outlined'
											value={userName}
											onChange={(event) => setUserName(event.target.value)}
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
												value={color}
												onChange={handleInputChange}
												onClick={handleClick}
												variant='outlined'
												fullWidth
											/>
											<Box
												sx={{
													marginTop: '10px',
													width: { md: '70%', sm: '70%', xs: '50%' },
													height: '36px',
													backgroundColor: color,
													position: 'absolute',
													right: 10,
													top: 0,
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
													color={color}
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
												value={fontType}
												onChange={(event) => setFontType(event.target.value)}
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
											value={website}
											onChange={(event) => setWebsite(event.target.value)}
											fullWidth
											// required
										/>

										<Box
											sx={{
												display: 'flex',
												justifyContent: 'center',
												alignItems: 'center',
												border: '1px solid #C4C4C4',
												py: 1,
												backgroundColor: logo ? '#C4C4C4' : null,
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
													required
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
												style={{ marginLeft: '0.5rem' }}
											>
												{logo ? logo.name : 'Select File'}
											</label>
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
									}}
								>
									Tell us about yourself
								</Typography>

								<TextField
									id='datetime'
									label='Preferred Date and Time'
									type='datetime-local'
									value={dateTime}
									required
									onChange={handleDateTimeChange}
									InputLabelProps={{
										shrink: true,
									}}
								/>
								<TextField
									id='filled-basic'
									variant='filled'
									label='Tell us your name'
									placeholder='Click a tag to select'
									value={selectedTags.join(', ')} // Display selected tags as comma-separated string
									onChange={(event) =>
										setSelectedTags(event.target.value.split(', '))
									}
									required
								/>
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
										flexWrap: 'wrap',
										gap: 2,
									}}
								>
									{tags.map((tag, index) => (
										<Button
											key={index}
											sx={{
												marginRight: '10px',
												cursor: 'pointer',
												color: selectedTags.includes(tag?.name)
													? 'white'
													: 'black', // Change text color based on selection
												backgroundColor: selectedTags.includes(tag?.name)
													? '#4B1248'
													: 'transparent', // Highlight selected tags
												border: '1px solid',
												borderRadius: '20px',
												px: 2,
												display: 'flex',
												justifyContent: 'center',
												alignItems: 'center',
												gap: 1,
											}}
											onClick={() => handleTagClick(tag.name)}
										>
											{tag.icon}
											{tag.name}
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
													}}
												>
													<Typography
														sx={{
															fontSize: '24px',
															fontWeight: 'bold',
														}}
													>
														Free
													</Typography>
													{/* <Checkbox {...label} /> */}
													<FormControlLabel
														control={
															<Checkbox
																checked={checkbox1Checked}
																onChange={handleCheckbox1Change}
															/>
														}
														label=''
													/>
												</Box>
												<Typography sx={{ p: 2, fontWeight: 600 }}>
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
													}}
												>
													<Typography
														sx={{
															fontSize: '24px',
															fontWeight: 'bold',
														}}
													>
														Starter
													</Typography>
													{/* <Checkbox {...label} /> */}
													<FormControlLabel
														control={
															<Checkbox
																checked={checkbox2Checked}
																onChange={handleCheckbox2Change}
															/>
														}
														label=''
													/>
												</Box>
												<Typography sx={{ p: 2, fontWeight: 600 }}>
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
														backgroundColor: '#502274',
														borderRadius: '30px 30px 0px 0px',
													}}
												>
													<Typography
														sx={{
															fontSize: '24px',
															fontWeight: 'bold',
															color: 'white',
														}}
													>
														Pro
													</Typography>
													<FormControlLabel
														control={
															<Checkbox
																checked={checkbox3Checked}
																onChange={handleCheckbox3Change}
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
														backgroundColor: '#502274',
														color: 'white',
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
														Social platform integrations to automatically
														display your latest content
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
														$7.50 per month, billed annually, or $9 billed
														monthly
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
								{/* <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: { md: "90%", sm: "95%", xs: "98%" },
                  flexDirection: "column",
                  gap: 3,
                }}
              > */}
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
									(ancientcitizens@hotmail.com)
								</Typography>

								<Button
									variant='contained'
									onClick={handleSubmit3}
									sx={{
										textTransform: 'none',
										py: 1.5,
										borderRadius: '20px',

										width: '100%',
									}}
								>
									Continue
								</Button>

								{/* <Button
                      type="submit"
                      onClick={handleSubmit3}
                      variant="contained"
                      color="primary"
                      sx={{
                        textTransform: "none",
                        py: 1.5,
                        borderRadius: "20px",
                      }}
                    >
                      Continue
                    </Button> */}
							</Box>
						</Box>
					)}

					{/* <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
            {isStepOptional(activeStep) && (
              <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                Skip
              </Button>
            )}
            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </Box> */}
				</React.Fragment>
			)}
		</Box>
	);
};
export default LoginUser;
