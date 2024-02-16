import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppState, Auth0Provider } from '@auth0/auth0-react';
import { AUTH0_CLIENT_ID, AUTH0_DOMAIN_ID } from '../constants';

interface Props {
	children: React.ReactNode;
}
const Auth0ProviderWithNavigate = ({ children }: Props) => {
	const navigate = useNavigate();

	const onRedirectCallback = (appState: AppState | undefined) => {
		navigate(appState?.returnTo || window.location.pathname);
	};

	if (!(AUTH0_DOMAIN_ID && AUTH0_CLIENT_ID)) {
		return null;
	}

	return (
		<Auth0Provider
			domain={AUTH0_DOMAIN_ID}
			clientId={AUTH0_CLIENT_ID}
			authorizationParams={{
				redirectUri: window.location.origin,
			}}
			onRedirectCallback={onRedirectCallback}
			useRefreshTokens
			cacheLocation='localstorage'
		>
			{children}
		</Auth0Provider>
	);
};

export default Auth0ProviderWithNavigate;
