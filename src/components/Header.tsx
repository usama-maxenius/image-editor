import { useAuth0 } from '@auth0/auth0-react';
import {
	AppBar,
	Avatar,
	Box,
	Button,
	IconButton,
	Menu,
	MenuItem,
	Toolbar,
	Tooltip,
	Typography,
} from '@mui/material';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCanvasContext } from '../context/CanvasContext';

const Header = () => {
	const { setStep } = useCanvasContext();
	const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();
	const [, setAnchorElNav] = React.useState<null | HTMLElement>(null);
	const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
		null
	);
	const navigate = useNavigate();

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
		<AppBar
			position='static'
			sx={{
				backgroundColor: '#E92D58',
				userSelect: 'none',
			}}
			//#E92D58 new
			//#e62358 old
		>
			<Toolbar>
				{/* <IconButton
					size='large'
					edge='start'
					color='inherit'
					aria-label='menu'
					sx={{ mr: 2 }}
				></IconButton> */}
				<Box
					sx={{
						ml: { md: 8, sm: 6, xs: 1 },
					}}
				>
					<Link
						to='/'
						onClick={() => setStep(1)}
						style={{ textDecoration: 'none', color: 'white' }}
					>
						<img
							src='/logo/logo_bnr.png'
							alt='logo'
							style={{
								width: 'auto',
								height: 60,
								objectFit: 'cover',
							}}
						/>
					</Link>
				</Box>

				<Box
					sx={{
						flexGrow: 1,
						display: { xs: 'none', md: 'flex' },
					}}
				>
					{isAuthenticated ? (
						<Box sx={{ ml: { md: 10 } }}>
							<Button color='inherit'>
								<Link
									to='/'
									onClick={() => setStep(1)}
									style={{ textDecoration: 'none', color: 'white' }}
								>
									CREATE POST
								</Link>
							</Button>
							<Button color='inherit'>
								<Link
									to='/news'
									style={{ textDecoration: 'none', color: 'white' }}
								>
									NEWS LINKS
								</Link>
							</Button>
						</Box>
					) : null}
				</Box>
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
								<Typography
									textAlign='center'
									onClick={() => navigate('/user-info')}
								>
									Account Info
								</Typography>
							</MenuItem>
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
	);
};

export default Header;
