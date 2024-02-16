import {
	Button,
	Typography,
	CircularProgress,
	AppBar,
	Toolbar,
	IconButton,
	Tooltip,
	Menu,
	Avatar,
	MenuItem,
	Box,
} from '@mui/material';
import { styled } from '@mui/system';
import Input from '../../components/input/input';
import CountdownTimer from '../../components/counter/counter';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { BaseURL } from '../../constants';
import { APIResponse } from '../../types';
import toast from 'react-hot-toast';
import { useAuth0 } from '@auth0/auth0-react';

const StyledContainer = styled(Box)(({}) => ({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	height: '100vh',
	// backgroundColor: '#151433',
	color: 'white',
	width: '100%',
}));

interface Props {
	setScrappedData: Dispatch<SetStateAction<APIResponse | undefined>>;
	updateStep: Dispatch<SetStateAction<number>>;
}
function LandingPage({ setScrappedData, updateStep }: Props) {
	const { loginWithRedirect, isAuthenticated, user, logout } = useAuth0();
	const [, setAnchorElNav] = React.useState<null | HTMLElement>(null);
	const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
		null
	);
	const [givenUrl, setGivenUrl] = useState(
		'https://www.bbc.com/news/world-us-canada-67920129'
	);
	const [loading, setLoading] = useState(false);

	const getData = async () => {
		if (loading) return;
		if (!loading) {
			try {
				setLoading(true);
				const response = await fetch(`${BaseURL}/scrapping_data`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ url: givenUrl }),
				});

				const data = await response.json();

				if (!response.ok) {
					setLoading(false);
					return toast.error(data?.error);
					// return toast.error('Sorry! This URL is currently unavailable, we are working to fix this as soon as possible')
				}

				await setScrappedData(data);
				updateStep(2);
				setLoading(false);
			} catch (error) {
				if (error instanceof Error) toast.error(error.message);
				setLoading(false);
			}
		} else updateStep(2);
	};

	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};
	return (
		<>
			<AppBar position='static' sx={{ backgroundColor: '#e9295d' }}>
				<Toolbar>
					<IconButton
						size='large'
						edge='start'
						color='inherit'
						aria-label='menu'
						sx={{ mr: 2 }}
					></IconButton>
					<Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
						Posticle
					</Typography>
					{isAuthenticated ? (
						<>
							<Tooltip title='Open settings'>
								<>
									<Typography sx={{ mr: 2 }}>{user?.name}</Typography>
									<IconButton sx={{ p: 0 }} onClick={handleOpenUserMenu}>
										<Avatar alt={user?.name} src={user?.picture} />
									</IconButton>
								</>
							</Tooltip>
							<Menu
								sx={{ mt: '45px' }}
								id='menu-appbar'
								anchorEl={anchorElUser}
								anchorOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								keepMounted
								transformOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								open={Boolean(anchorElUser)}
								onClose={handleCloseUserMenu}
							>
								<MenuItem onClick={handleCloseNavMenu}>
									<Typography textAlign='center' onClick={() => logout()}>
										Logout
									</Typography>
								</MenuItem>
							</Menu>
						</>
					) : (
						<>
							<Button
								color='inherit'
								onClick={() =>
									loginWithRedirect({
										authorizationParams: {
											screen_hint: 'signup',
										},
									})
								}
							>
								SIGNUP
							</Button>
							<Button color='inherit' onClick={() => loginWithRedirect({})}>
								LOGIN
							</Button>
						</>
					)}
				</Toolbar>
			</AppBar>
			<StyledContainer
				sx={{
					backgroundColor: 'white',
				}}
			>
				{isAuthenticated ? (
					<>
						<Typography variant='h4' gutterBottom color='black'>
							PASTE NEWS LINK URL
						</Typography>
						<Input
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								setGivenUrl(e.target.value)
							}
						/>
						<Button
							variant='contained'
							sx={{
								mt: '30px',
								bgcolor: 'white',
								color: 'black',
								'&:hover': { bgcolor: 'white', color: 'black' },
							}}
							onClick={getData}
						>
							{loading ? <CountdownTimer /> : 'GO >>'} &nbsp;&nbsp;{' '}
							{loading && <CircularProgress size={24} color='inherit' />}
						</Button>
					</>
				) : (
					<>
						<Typography variant='h4' sx={{ color: 'black' }} gutterBottom>
							POSTICLE.AI
						</Typography>
						<Typography variant='body1' sx={{ color: 'black' }} gutterBottom>
							CREATE & SHARE THE LATEST NEWS WITH
						</Typography>
					</>
				)}
			</StyledContainer>
		</>
	);
}

export default LandingPage;
