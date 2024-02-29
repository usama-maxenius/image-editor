import { Button, Typography, CircularProgress, Box } from '@mui/material';
import { styled } from '@mui/system';
import Input from '../../components/input/input';
import CountdownTimer from '../../components/counter/counter';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { BaseURL } from '../../constants';
import { APIResponse } from '../../types';
import toast from 'react-hot-toast';
import { useAuth0 } from '@auth0/auth0-react';
import LoginUser from '../../components/user/LoginUser';
import { useCanvasContext } from '../../context/CanvasContext';

const StyledContainer = styled(Box)(({}) => ({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	height: '100vh',
	backgroundColor: 'white',
	color: 'white',
	width: '100%',
	marginTop: '20px',
}));

interface Props {
	setScrappedData: Dispatch<SetStateAction<APIResponse | undefined>>;
	updateStep: Dispatch<SetStateAction<number>>;
}
function LandingPage({ setScrappedData, updateStep }: Props) {
	const { isAuthenticated } = useAuth0();
	const { userMetaData, scrapURL, updateScrapURL } = useCanvasContext();
	const [objectFromChild, setObjectFromChild] = useState<any>({});

	useEffect(() => {
		setObjectFromChild(userMetaData);

		return () => {
			setObjectFromChild({});
		};
	}, [userMetaData]);

	const handleObjectFromChild = (obj: any) => {
		setObjectFromChild(obj);
	};
	const [loading, setLoading] = useState(true);

	const getData = async () => {
		// if (loading) return;
		if (!loading) {
			try {
				setLoading(true);
				const response = await fetch(`${BaseURL}/scrapping_data`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ url: scrapURL }),
				});

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

	return (
		<>
			<Box>
				{isAuthenticated ? (
					<>
						{objectFromChild ? (
							<StyledContainer>
								<Typography variant='h4' gutterBottom color='black'>
									PASTE NEWS LINK URL
								</Typography>
								<Input
									defaultValue={scrapURL}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
										updateScrapURL(e.target.value)
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
							</StyledContainer>
						) : (
							<LoginUser sendObjectToParent={handleObjectFromChild} />
						)}
					</>
				) : (
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
