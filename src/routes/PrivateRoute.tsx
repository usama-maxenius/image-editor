import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }: any) {
	const { isAuthenticated } = useAuth0();
	return isAuthenticated ? children : <Navigate to='/' replace />;
}

export default PrivateRoute;
