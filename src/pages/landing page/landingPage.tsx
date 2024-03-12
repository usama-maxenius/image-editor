import { Typography, CircularProgress, Box } from '@mui/material';
import { styled } from '@mui/system';
// import Input from '../../components/input/input';
import CountdownTimer from '../../components/counter/counter';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { BaseURL } from '../../constants';

import { APIResponse } from '../../types';
import toast from 'react-hot-toast';
import { useAuth0 } from '@auth0/auth0-react';
import { useCanvasContext } from '../../context/CanvasContext';

const StyledContainer = styled(Box)(({}) => ({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	height: '80vh',
	backgroundColor: 'white',
	color: 'white',
	width: '100%',
	marginTop: '10px',
}));

interface Props {
	setScrappedData: Dispatch<SetStateAction<APIResponse | undefined>>;
	updateStep: Dispatch<SetStateAction<number>>;
}

function LandingPage({ setScrappedData, updateStep }: Props) {
	const { isAuthenticated } = useAuth0();
	const { scrapURL } = useCanvasContext();

	const [loading, setLoading] = useState(false);
	console.log('🚀 ~ LandingPage ~ loading:', loading);
	console.log('BaseURL', BaseURL);
	console.log('scrapURL', scrapURL);
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
					body: JSON.stringify({
						url: 'https://www.foxnews.com/world/haiti-prime-minister-ariel-henry-resign-civil-war-bowing-international-pressure',
					}),
				});
				console.log(`${BaseURL}/scrapping_data`);
				console.log('response', response);
				const data = await response.json();

				if (!response.ok) {
					setLoading(false);
					return toast.error(data?.error);
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

	useEffect(() => {
		scrapURL ? getData() : '';
	}, []);

	return (
		<>
			<Box>
				{isAuthenticated ? (
					<StyledContainer>
						{loading ? (
							<Box
								sx={{
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									flexDirection: 'column',
								}}
							>
								<Box
									sx={{
										display: 'flex',
										gap: 2,
										justifyContent: 'center',
										alignItems: 'center',
									}}
								>
									<CircularProgress
										sx={{ width: '100%', height: '100%', mt: -2 }}
									/>
									<Typography variant='h3' gutterBottom color='black'>
										Loading ...
									</Typography>
								</Box>
								<Box>
									<Typography variant='h3' gutterBottom color='black'>
										<CountdownTimer />
									</Typography>
								</Box>
							</Box>
						) : (
							<StyledContainer>
								<Typography variant='h4' sx={{ color: 'black' }} gutterBottom>
									POSTICLE.AI
								</Typography>
								<Typography
									variant='body1'
									sx={{ color: 'black' }}
									gutterBottom
								>
									CREATE & SHARE THE LATEST NEWS WITH
								</Typography>
							</StyledContainer>
						)}
					</StyledContainer>
				) : (
					// <StyledContainer>
					// 	<Typography variant='h4' gutterBottom color='black'>
					// 		PASTE NEWS LINK URL
					// 	</Typography>
					// 	<Input
					// 		defaultValue={scrapURL}
					// 		onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
					// 			updateScrapURL(e.target.value)
					// 		}
					// 	/>
					// 	<Button
					// 		variant='contained'
					// 		sx={{
					// 			mt: '30px',
					// 			bgcolor: 'white',
					// 			color: 'black',
					// 			'&:hover': { bgcolor: 'white', color: 'black' },
					// 		}}
					// 		onClick={getData}
					// 	>
					// 		{loading ? <CountdownTimer /> : 'GO >>'} &nbsp;&nbsp;{' '}
					// 		{loading && <CircularProgress size={24} color='inherit' />}
					// 	</Button>
					// </StyledContainer>
					<StyledContainer>
						<Typography variant='h4' sx={{ color: 'black' }} gutterBottom>
							POSTICLE.AI
						</Typography>
						<Typography variant='body1' sx={{ color: 'black' }} gutterBottom>
							CREATE & SHARE THE LATEST NEWS WITH
						</Typography>
					</StyledContainer>
				)}
			</Box>
		</>
	);
}

export default LandingPage;
