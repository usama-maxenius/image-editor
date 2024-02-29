export type activeTabs =
	| 'background'
	| 'title'
	| 'bubble'
	| 'element'
	| 'writePost';

export interface CanvasContextProps {
	canvas: fabric.Canvas | null;
	activeTab: activeTabs;
	scrapURL: string;
	isLoading: boolean;
	isUserMetaExist: boolean;
	userMetaData: any;
	updateUserMetaData: (val: any) => void;
	updateIsUserMetaExist: (val: boolean) => void;
	updateActiveTab: (tab: activeTabs) => void;
	updateScrapURL: (val: string) => void;
	updateCanvasContext: (canvas: fabric.Canvas | null) => void;
	getExistingObject: (type: string) => fabric.Object | undefined;
}
