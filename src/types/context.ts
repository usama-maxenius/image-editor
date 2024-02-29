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
	userMetaData: any;
	updateUserMetaData: (val: any) => void;
	updateActiveTab: (tab: activeTabs) => void;
	updateScrapURL: (val: string) => void;
	updateCanvasContext: (canvas: fabric.Canvas | null) => void;
	getExistingObject: (type: string) => fabric.Object | undefined;
}
