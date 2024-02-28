import { useEffect, useState } from 'react';
import { interestOptions, rssOptions } from './config';

const News = () => {
	const [open, setOpen] = useState(false);
	const handleClose = () => setOpen(false);
	const handleOpen = () => setOpen(true);
	const [newsFeed, setNewsFeed] = useState<any[]>([]);
	const { updateScrapURL } = useCanvasContext();
	const { user, getAccessTokenSilently } = useAuth0();

	const selecedInterests = () => {
		const interests = user?.user_metadata?.interests;
		return interests?.map((interest: any) => {
			return rssOptions.find((option) => option.interest === interest);
		});
	};

	useEffect(() => {
		const matchedOptions = selecedInterests();
		console.log({ matchedOptions });

		(async () => {
			let feedsData: any[] = [];
			for (const option of matchedOptions) {
				await fetch(
					`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
						option.value
					)}&api_key=yolb35wkfczfs6xdjzb1bracablicibpftnj7svf`
				)
					.then((res) => res.json())
					.then((data) => feedsData.push(data));
			}
			setNewsFeed(feedsData);
		})();
	}, [user]);

	const handleDelete = async (val: string) => {
		console.info('You clicked the delete icon.', val);
		const token = await getAccessTokenSilently();

		const userId = user?.sub as string;

		await updateUserMetaData(token, userId, {
			user_metadata: {
				...user?.user_metadata,
				interests: user?.user_metadata?.interests?.filter(
					(interest: any) => interest !== val
				),
			},
		});
	};

	return (
		<Box sx={{ mx: '3rem' }}>
			<Button
				variant='contained'
				// sx={{ backgroundColor: '#e9295d' }}
				onClick={handleOpen}
			>
				Add Interest
			</Button>

			{user?.user_metadata?.interests?.map((interest: any) => (
				<Chip
					key={interest}
					label={interest}
					variant='outlined'
					onDelete={() => handleDelete(interest)}
				/>
			))}
			{open && <InterestDialog open={open} handleClose={handleClose} />}
			<Box sx={{ m: '3rem auto' }}>
				<Grid
					container
					spacing={4}
					justifyItems='center'
					justifyContent='center'
				>
					{newsFeed?.map((feed, i) => (
						<Grid item xs={6} md={6}>
							<MultiActionAreaCard
								key={i}
								feed={feed}
								updateScrapURL={updateScrapURL}
							/>
						</Grid>
					))}
				</Grid>
			</Box>
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
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
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

import { updateUserMetaData } from '../../services/userMetaData';
import { useAuth0 } from '@auth0/auth0-react';

function InterestDialog({ open, handleClose }: any) {
	const { getAccessTokenSilently, user } = useAuth0();
	const [selectedOptions, setSelectedOptions] = useState<any[]>([]);

	useEffect(() => {
		const matchedOptions = interestOptions.filter((option) =>
			user?.user_metadata?.interests?.includes(option.value)
		);
		console.log({ matchedOptions }, user?.user_metadata);
		setSelectedOptions(matchedOptions);
		return () => {};
	}, [user]);

	const saveHandler = async () => {
		const token = await getAccessTokenSilently();
		if (!user?.sub) {
			return;
		}

		const interests = selectedOptions?.map((option) => option.value);
		await updateUserMetaData(token, user?.sub, {
			user_metadata: {
				...user?.user_metadata,
				interests: [...user?.user_metadata.interests, ...interests],
			},
		});

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
				sx={{ minHeight: '100px', minWidth: { xs: '100%', md: '400px' } }}
			>
				{/* <DialogContentText id='alert-dialog-description'></DialogContentText> */}

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
