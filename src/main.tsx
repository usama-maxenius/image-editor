import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Toaster } from 'react-hot-toast';
import { CanvasContextProvider } from './context/CanvasContext.tsx';
import { BrowserRouter } from 'react-router-dom';
import Auth0ProviderWithNavigate from './auth/index.tsx';


ReactDOM.createRoot(document.getElementById('root')!).render(
	<BrowserRouter>
		<Auth0ProviderWithNavigate>
			<CanvasContextProvider>
				<App />
				
				<Toaster position='top-right' />
			</CanvasContextProvider>
		</Auth0ProviderWithNavigate>
	</BrowserRouter>
);
