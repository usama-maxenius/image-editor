import { Navigate, Route, Routes } from 'react-router-dom';
import News from './pages/news';
import HomePage from './pages/homePage';
import Header from './components/Header';
import UserInfo from './pages/userInfo';
import { useAuth0 } from '@auth0/auth0-react';

function App() {
	const { isAuthenticated, user } = useAuth0();

	if (isAuthenticated && !user?.user_metadata) {
		return <Navigate to='/user-info' />;
	}

	return (
		<>
			<Header />
			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/user-info' element={<UserInfo />} />
				<Route path='/news' element={<News />} />
			</Routes>
		</>
	);
}

export default App;
