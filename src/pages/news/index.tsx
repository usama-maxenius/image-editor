import { useEffect, useState } from 'react';
import { interestOptions, rssOptions } from './config';

const News = () => {
	const [open, setOpen] = useState(false);
	const handleClose = () => setOpen(false);
	const handleOpen = () => setOpen(true);
	const [isLoading, setIsLoading] = useState(true);
	const [newsFeed, setNewsFeed] = useState<any[]>([]);
	const { updateScrapURL, userMetaData, updateUserMetaData } =
		useCanvasContext();
	const { user, getAccessTokenSilently } = useAuth0();

	const selecedInterests = () => {
		const interests = userMetaData?.interests || [];
		return interests?.map((interest: any) => {
			return rssOptions.find((option) => option.interest === interest);
		});
	};

	useEffect(() => {
		const matchedOptions = selecedInterests();

		(async () => {
			let feedsData: any[] = [];
			for (const option of matchedOptions) {
				await fetch(
					`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
						option.value
					)}&api_key=yolb35wkfczfs6xdjzb1bracablicibpftnj7svf`
				)
					.then((res) => res.json())
					.then((data) => feedsData.push(data))
					.catch(() => setIsLoading(false));
			}
			setNewsFeed(feedsData);
			setIsLoading(false);
		})();
	}, [userMetaData]);

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

	return (
		<Box sx={{ mx: '3rem' , minHeight:"50vh", display:"flex", justifyContent:"space-between",alignItems:"center", flexDirection:"column"}}>
			<Stack
				direction='row'
				spacing={1}
				mt={2}
				alignItems='center'
				justifyContent='center'
			>
				<Button
					variant='contained'
					// sx={{ backgroundColor: '#e9295d' }}
					onClick={handleOpen}
				>
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
			</Stack>

			{open && <InterestDialog open={open} handleClose={handleClose} />}
				
			
			<Box sx={{ m: '3rem auto' }}>
				<Grid
					container
					spacing={4}
					justifyItems='center'
					justifyContent='center'
				>
					{isLoading && newsFeed.length === 0 ? (
						<Box sx={{ display: 'flex', height: '50vh', alignItems: 'center' }}>
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
			<Typography sx={{
			fontSize:"24px",
			fontFamily:"Helvetica",
			textAlign:"center",
			color:"#E9295D"
			}}>
				You haven't chosen any interests yet! <br />
				Please pick one that interests you.
			</Typography>
		</Box>
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
	Stack,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useCanvasContext } from '../../context/CanvasContext';

function MultiActionAreaCard({ feed, updateScrapURL }: any) {
	const navigate = useNavigate();

	return feed?.items?.map((item: any, i: number) => (
		<Card key={i} sx={{ my: 1 }}>
			<CardActionArea style={{ display: 'flex', alignItems: 'center' }}>
				{/* Left side */}
				<div style={{ flex: 1 }}>
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
					<CardContent>
						<Typography gutterBottom variant='h5' component='div'>
							{item?.title}
						</Typography>
						<Typography variant='body2' color='text.secondary' component='div'>
							{item?.description}
						</Typography>
					</CardContent>
				</div>

				{/* Right side */}
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<div style={{ height: '180px', marginRight: '10px' }}>
						<CardMedia
							component='img'
							style={{ height: '100%', width: 'auto', borderRadius: '1rem' }}
							image={item?.enclosure?.link}
							alt='green iguana'
						/>
					</div>
				</div>
				<div>
					{/* <CardActions> */}
					<Button size='small' color='primary'>
						<Link to={item?.link} style={{ textDecoration: 'none' }}>
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
					{/* </CardActions> */}
				</div>
			</CardActionArea>
		</Card>
	));
}

import Select from 'react-select';

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
		return () => {
			setSelectedOptions([]);
		};
	}, [userMetaData]);

	const saveHandler = async () => {
		const token = await getAccessTokenSilently();
		if (!user?.sub) {
			return;
		}

		const interests = selectedOptions?.map((option) => option.value);
		const payload = {
			user_metadata: {
				...userMetaData,
				interests: userMetaData?.interests
					? [...userMetaData.interests, ...interests]
					: [...interests],
			},
		};
		const userData: any = await updateUserData(token, user?.sub, payload);

		updateUserMetaData(userData?.user_metadata);

		handleClose();
	};

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			aria-labelledby='alert-dialog-title'
			aria-describedby='alert-dialog-description'
		>
			<DialogTitle id='alert-dialog-title'>Add Interests</DialogTitle>
			<DialogContent
				sx={{ minHeight: '300px', minWidth: { xs: '100%', md: '400px' } }}
			>
				<Select
					defaultValue={selectedOptions}
					isMulti
					onChange={(option) => setSelectedOptions(option as any[])}
					name='colors'
					options={interestOptions}
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
