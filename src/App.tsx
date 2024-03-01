import { Route, Routes } from 'react-router-dom';
import News from './pages/news';
import HomePage from './pages/homePage';
import Header from './components/Header';
import UserInfo from './pages/userInfo';
import PrivateRoute from './routes/PrivateRoute';

function App() {
	return (
		<>
			<Header />

			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route
					path='/user-info'
					element={
						<PrivateRoute>
							<UserInfo />
						</PrivateRoute>
					}
				/>
				<Route
					path='/news'
					element={
						<PrivateRoute>
							<News />
						</PrivateRoute>
					}
				/>
			</Routes>
		</>
	);
}

export default App;
