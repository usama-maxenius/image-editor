import { useEffect, useState } from 'react';
import { interestOptions, rssOptions } from './config';
interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function CustomTabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role='tabpanel'
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{ p: 3 }}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

const News = () => {
	const [open, setOpen] = useState(false);
	const handleClose = () => setOpen(false);
	const handleOpen = () => setOpen(true);
	const [isLoading, setIsLoading] = useState(true);
	const [newsFeed, setNewsFeed] = useState<any[]>([]);

	const { updateScrapURL, userMetaData, updateUserMetaData } =
		useCanvasContext();

	const isMobile = useMediaQuery('(max-width:600px)');
	const tabStyles = {
		minWidth: isMobile ? 'auto' : 120,
		color: 'black',
		'& .MuiButtonBase-root-MuiTab-root': {
			minHeight: '20px',
		},
		'&.Mui-selected': {
			color: 'white',
			backgroundColor: '#4B1248',
			borderRadius: '5px 5px',
			minHeight: '20px',
			height: '40px',
		},
		'& .MuiTabs-indicator': {
			// backgroundColor: '#4B1248',
		},
	};

	const { user, getAccessTokenSilently } = useAuth0();

	const [activeTab, setActiveTab] = useState<number>(0);
	console.log('🚀 ~ News ~ activeTab:', activeTab);

	const submitTabHandler = async (data: any) => {
		const index = userMetaData?.interests?.indexOf(data);
		console.log('🚀 ~ submitTabHandler ~ index:', index);
		if (index !== undefined && index !== -1) {
			setActiveTab(index + data);
		}

		const newValue: any = rssOptions.find((option) => option.interest === data);
		(async () => {
			let feedsData: any[] = [];

			// for (const option of matchedOptions) {
			await fetch(
				`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
					newValue?.value
				)}&api_key=yolb35wkfczfs6xdjzb1bracablicibpftnj7svf`
			)
				.then((res) => res.json())
				.then((data) => feedsData.push(data))
				.catch(() => setIsLoading(false));
			// }
			setNewsFeed(feedsData);
			setIsLoading(false);
		})();
	};

	const submitTabHandler2 = async (data: any) => {
		(async () => {
			let feedsData: any[] = [];
			await fetch(
				`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
					data?.tagUrl
				)}&api_key=yolb35wkfczfs6xdjzb1bracablicibpftnj7svf`
			)
				.then((res) => res.json())
				.then((data) => feedsData.push(data))
				.catch(() => setIsLoading(false));

			setNewsFeed(feedsData);
			setIsLoading(false);
		})();
	};

	// const selecedInterests = () => {
	// 	const interests = userMetaData?.interests || [];

	// 	return interests?.map((interest: any) => {
	// 		return rssOptions.find((option) => option.interest === interest);
	// 	});
	// };

	// useEffect(() => {
	// 	const matchedOptions = selecedInterests();
	// 	(async () => {
	// 		let feedsData: any[] = [];
	// 		console.log('🚀 ~ useEffect', feedsData);

	// 		for (const option of matchedOptions) {
	// 			await fetch(
	// 				`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
	// 					option?.value
	// 				)}&api_key=yolb35wkfczfs6xdjzb1bracablicibpftnj7svf`
	// 			)
	// 				.then((res) => res.json())
	// 				.then((data) => feedsData.push(data))
	// 				.catch(() => setIsLoading(false));

	// 		}
	// 		setNewsFeed(feedsData);
	// 		setIsLoading(false);
	// 	})();

	// }, [userMetaData]);

	const handleDelete = async (val: string) => {
		const token = await getAccessTokenSilently();

		const userId = user?.sub as string;

		const userData: any = await updateUserData(token, userId, {
			user_metadata: {
				...userMetaData,
				interests: userMetaData?.interests?.filter(
					(interest: any) => interest !== val
				),
			},
		});
		updateUserMetaData(userData?.user_metadata);
	};

	const handleDelete2 = async (val: string) => {
		const token = await getAccessTokenSilently();

		const userId = user?.sub as string;

		const userData: any = await updateUserData(token, userId, {
			user_metadata: {
				...userMetaData,
				tags: userMetaData?.tags?.filter(
					(interest: any) => interest?.tagName !== val
				),
			},
		});
		updateUserMetaData(userData?.user_metadata);
	};

	const [value, setValue] = useState(0);

	// const title = feed?.feed?.title;
	// const text = title ? title.split('&gt;')[1]?.trim().toLowerCase() : '';

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		event.preventDefault();
		setValue(newValue);
	};

	return (
		<>
			<Stack
				direction='row'
				spacing={1}
				mt={2}
				alignItems='center'
				justifyContent='center'
			>
				<Button variant='contained' onClick={handleOpen}>
					Add Interest
				</Button>
				{userMetaData?.interests?.map((interest: any) => (
					<Chip
						key={interest}
						label={interest}
						variant='outlined'
						onDelete={() => handleDelete(interest)}
					/>
				))}

				{userMetaData?.tags?.map((interest: any) => (
					<Chip
						key={interest?.tagName}
						label={interest?.tagName}
						variant='outlined'
						onDelete={() => handleDelete2(interest?.tagName)}
					/>
				))}
			</Stack>

			<Box>
				<Box sx={{ width: '100%' }}>
					<Box
						sx={{
							width: '100%',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							mt: 2,
						}}
					>
						<Box
							sx={{
								borderBottom: 1,
								borderColor: 'divider',
								width: 'auto',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								mt: 2,
							}}
						>
							<Tabs
								value={value}
								onChange={handleChange}
								aria-label='basic tabs example'
							>
								{userMetaData?.interests?.map((interest: any, i: number) => {
									return (
										<Tab
											label={interest}
											onClick={() => submitTabHandler(interest)}
											{...a11yProps(i)}
											key={i}
											sx={{
												...tabStyles,
											}}
										/>
									);
								})}
								{userMetaData?.tags?.map((interest: any, i: number) => {
									return (
										<Tab
											label={interest?.tagName}
											onClick={() => submitTabHandler2(interest)}
											{...a11yProps(i)}
											key={i}
											sx={tabStyles}
										/>
									);
								})}
							</Tabs>
						</Box>
					</Box>

					{userMetaData?.interests.length !== 0
						? userMetaData?.interests?.map((interest: any) => (
								<CustomTabPanel key={interest} value={value} index={value}>
									<>
										{/* {interest} {value} */}
										<Box sx={{ m: '3rem auto' }}>
											<Grid
												container
												spacing={4}
												justifyItems='center'
												justifyContent='center'
											>
												{isLoading && newsFeed.length === 0 ? (
													<Box
														sx={{
															display: 'flex',
															height: '50vh',
															alignItems: 'center',
														}}
													>
														<Typography>Please Wait... </Typography> &nbsp;
														&nbsp;
														<CircularProgress />
													</Box>
												) : (
													newsFeed?.map((feed, i) => (
														<Grid item xs={6} md={6}>
															<MultiActionAreaCard
																key={i}
																feed={feed}
																updateScrapURL={updateScrapURL}
															/>
														</Grid>
													))
												)}
											</Grid>
										</Box>
									</>
									{/* )} */}
								</CustomTabPanel>
						  ))
						: [' '].map((interest: any) => (
								<CustomTabPanel key={interest} value={value} index={value}>
									<>
										{/* {interest} {value} */}
										<Box sx={{ m: '3rem auto' }}>
											<Grid
												container
												spacing={4}
												justifyItems='center'
												justifyContent='center'
											>
												{isLoading && newsFeed.length === 0 ? (
													<Box
														sx={{
															display: 'flex',
															height: '50vh',
															alignItems: 'center',
														}}
													>
														{/* <Typography>Please Wait... </Typography> &nbsp; */}
														<Typography>Kindly Select Interest... </Typography>{' '}
														&nbsp; &nbsp;
														<CircularProgress />
													</Box>
												) : (
													newsFeed?.map((feed, i) => (
														<Grid item xs={6} md={6}>
															<MultiActionAreaCard
																key={i}
																feed={feed}
																updateScrapURL={updateScrapURL}
															/>
														</Grid>
													))
												)}
											</Grid>
										</Box>
									</>
									{/* )} */}
								</CustomTabPanel>
						  ))}
				</Box>
			</Box>

			<Box
				sx={{
					mx: '3rem',
					minHeight: '50vh',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					flexDirection: 'column',
				}}
			>
				{open && <InterestDialog open={open} handleClose={handleClose} />}
				{/* <Box sx={{ m: '3rem auto' }}>
					<Grid
						container
						spacing={4}
						justifyItems='center'
						justifyContent='center'
					>
						{isLoading && newsFeed.length === 0 ? (
							<Box
								sx={{ display: 'flex', height: '50vh', alignItems: 'center' }}
							>
								<Typography>Please Wait... </Typography> &nbsp; &nbsp;
								<CircularProgress />
							</Box>
						) : (
							newsFeed?.map((feed, i) => (
								<Grid item xs={6} md={6}>
									<MultiActionAreaCard
										key={i}
										feed={feed}
										updateScrapURL={updateScrapURL}
									/>
								</Grid>
							))
						)}
					</Grid>
				</Box>
				<Typography
					sx={{
						fontSize: '24px',
						fontFamily: 'Helvetica',
						textAlign: 'center',
						color: '#E9295D',
					}}
				>
					You haven't chosen any interests yet! <br />
					Please pick one that interests you.
				</Typography> */}
			</Box>
		</>
	);
};

export default News;

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import {
	Box,
	Button,
	CardActionArea,
	Chip,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	List,
	ListItem,
	ListItemText,
	Stack,
	Tab,
	Tabs,
	TextField,
	useMediaQuery,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useCanvasContext } from '../../context/CanvasContext';

function MultiActionAreaCard({ feed, updateScrapURL }: any) {
	const navigate = useNavigate();

	return (
		<>
			{feed?.items?.map((item: any, i: number) => (
				<Card key={i} sx={{ my: 1 }}>
					<CardActionArea style={{ display: 'flex', alignItems: 'center' }}>
						<div style={{ flex: 1, padding: '10px' }}>
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<div style={{ height: '20px', marginRight: '10px' }}>
									<Link to={item?.link} style={{ textDecoration: 'none' }}>
										<CardMedia
											component='img'
											style={{
												height: '100%',
												width: 'auto',
												borderRadius: '1rem',
											}}
											image={feed?.feed?.image}
											alt='green iguana'
										/>
									</Link>
								</div>
							</div>
							<Box
								sx={{
									display: 'flex',
									justifyContent: 'space-around',
								}}
							>
								<CardContent>
									<Typography
										gutterBottom
										variant='h5'
										component='div'
										sx={{
											width: '100%',
											overflow: 'hidden',
											textOverflow: 'ellipsis',
											display: '-webkit-box',
											WebkitLineClamp: 2, // Displaying three lines
											WebkitBoxOrient: 'vertical',
										}}
									>
										{item?.title}
									</Typography>
									<Typography
										variant='body2'
										color='text.secondary'
										component='div'
										sx={{
											width: '100%',
											overflow: 'hidden',
											textOverflow: 'ellipsis',
											display: '-webkit-box',
											WebkitLineClamp: 5, // Displaying three lines
											WebkitBoxOrient: 'vertical',
										}}
									>
										{item?.description}
									</Typography>
								</CardContent>
								<Box
									style={{
										display: 'flex',
										alignItems: 'center',
										flexDirection: 'column',
										gap: 4,
									}}
								>
									<div style={{ height: '180px', marginRight: '10px' }}>
										{item?.enclosure?.link && (
											<CardMedia
												component='img'
												style={{
													height: '100%',
													width: 'auto',
													borderRadius: '1rem',
												}}
												image={item.enclosure.link}
												alt='green iguana'
											/>
										)}

										{item?.enclosure?.thumbnail && (
											<CardMedia
												component='img'
												style={{
													height: '100%',
													width: 'auto',
													borderRadius: '1rem',
												}}
												image={item?.enclosure?.thumbnail}
												alt='green iguana'
											/>
										)}
									</div>
									<Box
										sx={{
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
											gap: 2,
											m: 1,
										}}
									>
										<Button size='small' color='primary'>
											<Link
												to={item?.link}
												style={{ textDecoration: 'none' }}
												target='_blank'
											>
												READ ARTICLE
											</Link>
										</Button>
										<Button
											size='small'
											color='primary'
											onClick={async () => {
												await updateScrapURL(item?.link);
												navigate('/');
											}}
										>
											CREATE POST
										</Button>
									</Box>
								</Box>
							</Box>
						</div>

						{/* Right side */}
						{/* <div style={{ display: 'flex', alignItems: 'center' }}>
					<div style={{ height: '180px', marginRight: '10px' }}>
						{item?.enclosure?.link && (
							<CardMedia
								component='img'
								style={{
									height: '100%',
									width: 'auto',
									borderRadius: '1rem',
								}}
								image={item.enclosure.link}
								alt='green iguana'
							/>
						)}

						{item?.enclosure?.thumbnail && (
							<CardMedia
								component='img'
								style={{
									height: '100%',
									width: 'auto',
									borderRadius: '1rem',
								}}
								image={item?.enclosure?.thumbnail}
								alt='green iguana'
							/>
						)}
					</div>
				</div> */}
						<div>
							{/* <CardActions> */}
							{/* <Button size='small' color='primary'>
						<Link
							to={item?.link}
							style={{ textDecoration: 'none' }}
							target='_blank'
						>
							READ ARTICLE
						</Link>
					</Button>
					<Button
						size='small'
						color='primary'
						onClick={async () => {
							await updateScrapURL(item?.link);
							navigate('/');
						}}
					>
						CREATE POST
					</Button> */}
							{/* </CardActions> */}
						</div>
					</CardActionArea>
				</Card>
			))}
		</>
	);
}

import Select, { MultiValue } from 'react-select';

import { updateUserData } from '../../services/userData';
import { useAuth0 } from '@auth0/auth0-react';

function InterestDialog({ open, handleClose }: any) {
	const { getAccessTokenSilently, user } = useAuth0();
	const { userMetaData, updateUserMetaData } = useCanvasContext();
	const [selectedOptions, setSelectedOptions] = useState<any[]>([]);

	useEffect(() => {
		const interests = userMetaData?.interests || [];
		const matchedOptions = interestOptions.filter((option) =>
			interests?.includes(option.value)
		);
		setSelectedOptions(matchedOptions);
	}, [userMetaData]);

	const handleSelectChange = (newValue: MultiValue<any>) => {
		const options = newValue as any[];

		const uniqueOptions = options.filter(
			(option, index, self) =>
				index ===
				self.findIndex(
					(t) => t.value === option.value && t.label === option.label
				)
		);
		setSelectedOptions(uniqueOptions);
	};

	// useEffect(() => {
	// 	const interests = userMetaData?.interests || [];
	// 	const matchedOptions = interestOptions.filter((option) =>
	// 		interests?.includes(option.value)
	// 	);
	// 	setSelectedOptions(matchedOptions);
	// 	return () => {
	// 		setSelectedOptions([]);
	// 	};
	// }, [userMetaData]);

	const saveHandler = async () => {
		const token = await getAccessTokenSilently();
		if (!user?.sub) {
			return;
		}

		const interests = selectedOptions?.map((option) => option?.value);
		const payload = {
			user_metadata: {
				...userMetaData,
				interests: userMetaData?.interests
					? [...userMetaData?.interests, ...interests]
					: [...interests],
			},
		};
		const userData: any = await updateUserData(token, user?.sub, payload);

		updateUserMetaData(userData?.user_metadata);

		handleClose();
	};
	// add and url
	const [tagName, setTagName] = useState<string>('');
	const [tagUrl, setTagUrl] = useState<string>('');

	const handleAddUrl = async () => {
		const token = await getAccessTokenSilently();
		if (!user?.sub) {
			return;
		}
		if (tagName.trim() !== '' && tagUrl.trim() !== '') {
			const newData = {
				tagName: tagName,
				tagUrl: tagUrl,
			};

			const payload = {
				user_metadata: {
					...userMetaData,
					tags: userMetaData?.tags
						? [...userMetaData?.tags, newData]
						: [newData],
				},
			};

			const userData: any = await updateUserData(token, user?.sub, payload);

			updateUserMetaData(userData?.user_metadata);
			setTagName('');
			setTagUrl('');
		}
	};

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			aria-labelledby='alert-dialog-title'
			aria-describedby='alert-dialog-description'
		>
			<DialogTitle
				id='alert-dialog-title'
				sx={{
					textAlign: 'center',
					fontWeight: 'bold',
					fontSize: '30px',
				}}
			>
				Add Interests
			</DialogTitle>
			<DialogContent
				sx={{ minHeight: '300px', minWidth: { xs: '100%', md: '400px' } }}
			>
				<Box
					sx={{
						my: 2,
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						flexDirection: 'column',
						gap: 2,
					}}
				>
					<div>
						<TextField
							fullWidth
							label='Add Interests'
							variant='outlined'
							value={tagName}
							onChange={(e) => setTagName(e.target.value)}
							required
							sx={{
								my: 2,
							}}
						/>

						<TextField
							fullWidth
							label='Add Interests URL'
							variant='outlined'
							placeholder='Enter Interests URL'
							value={tagUrl}
							onChange={(e) => setTagUrl(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									e.preventDefault();
									handleAddUrl();
								}
							}}
							required
						/>
						<Button
							variant='contained'
							onClick={handleAddUrl}
							sx={{
								width: '100%',
								py: 1.5,
								mt: 2,
							}}
						>
							Add Interests
						</Button>
					</div>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							width: '100%',
						}}
					>
						<Typography
							sx={{
								fontWeight: 700,
								fontSize: '24px',
							}}
						>
							Interests List
						</Typography>

						<List component='ol' sx={{ px: 1 }}>
							{userMetaData?.tags?.map((tag: any, index: number) => (
								<ListItem
									key={index}
									sx={{
										p: 0.1,
									}}
								>
									<ListItemText />
									<Box
										sx={{
											display: 'flex',
											justifyContent: 'space-between',
											alignItems: 'center',
											width: '100%',
										}}
									>
										<Box
											sx={{
												display: 'flex',
												flexDirection: 'column',
											}}
										>
											<Typography
												sx={{
													fontWeight: 'bold',
													fontSize: '24px',
												}}
											>
												{tag?.tagName}
											</Typography>
											<a
												href={tag?.tagUrl}
												target='_blank'
												rel='noopener noreferrer'
											>
												{tag?.tagUrl}
											</a>
										</Box>
									</Box>
								</ListItem>
							))}
						</List>
					</Box>
				</Box>

				<Select
					defaultValue={selectedOptions}
					isMulti
					onChange={handleSelectChange}
					name='colors'
					options={interestOptions.filter(
						(option) =>
							!selectedOptions.some((item) => item.value === option.value)
					)}
					className='basic-multi-select'
					classNamePrefix='select'
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>Cancel</Button>
				<Button onClick={saveHandler} autoFocus>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
}
