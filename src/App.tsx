import { Route, Routes } from 'react-router-dom';
import News from './pages/news';
import HomePage from './pages/homePage';
import Header from './components/Header';
import UserInfo from './pages/userInfo';

function App() {
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
