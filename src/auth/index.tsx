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
				audience: 'https://dev-bg8owhj3eqxda764.us.auth0.com/api/v2/',
				scope:
					'openid profile email phone read:current_user offline_access update:current_user_metadata read:users read:roles read:role_members read:bank-performance',
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
