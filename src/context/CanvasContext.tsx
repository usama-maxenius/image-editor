import {
	ReactNode,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react';
import { CanvasContextProps, activeTabs } from '../types/context';
import { fonts } from '../constants/fonts';
import { loadWebFont } from '../utils/FontHandler';
import { useAuth0 } from '@auth0/auth0-react';
import { getUserData } from '../services/userData';

const CanvasContext = createContext({} as CanvasContextProps);

export const CanvasContextProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
	const [activeTab, setActiveTab] = useState<activeTabs>('background');
	const updateCanvasContext = (canvas: fabric.Canvas | null) =>
		setCanvas(canvas);
	const [scrapURL, setScrapURL] = useState('');
	const { user, getAccessTokenSilently } = useAuth0();
	const [userMetaData, setUserMetaData] = useState({});

	const getExistingObject = (type: string) =>
		canvas?.getObjects()?.find((obj: any) => obj.customType === type);

	const updateActiveTab = (tab: activeTabs) => setActiveTab(tab);
	const updateScrapURL = (tab: string) => setScrapURL(tab);
	const updateUserMetaData = (val: any) => setUserMetaData(val);

	/**
	 * Loads all the fonts asynchronously.
	 * @return {Promise<void>} - A promise that resolves when all the fonts are loaded successfully.
	 */
	const loadAllFonts = async (): Promise<void> => {
		for (const font of fonts) {
			try {
				await loadWebFont(font);
			} catch (error) {
				console.error(`Font "${font}" loading failed:`, error);
			}
		}
	};

	useEffect(() => {
		loadAllFonts();
	}, []);

	const getUser = useCallback(async () => {
		const token = await getAccessTokenSilently();
		if (user?.sub) {
			const userId = user?.sub;
			const userData: any = await getUserData(token, userId);
			const user_metadata = userData?.user_metadata;
			setUserMetaData(user_metadata);
		}
	}, [user?.sub]);

	useEffect(() => {
		getUser();
	}, [getUser]);

	return (
		<CanvasContext.Provider
			value={{
				canvas,
				activeTab,
				scrapURL,
				userMetaData,
				updateUserMetaData,
				updateActiveTab,
				getExistingObject,
				updateCanvasContext,
				updateScrapURL,
			}}
		>
			{children}
		</CanvasContext.Provider>
	);
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCanvasContext = () => useContext(CanvasContext);
