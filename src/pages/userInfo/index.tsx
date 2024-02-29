import { useEffect, useState } from 'react';
import LoginUser from '../../components/user/LoginUser';
import { useCanvasContext } from '../../context/CanvasContext';

const UserInfo = () => {
	const { userMetaData } = useCanvasContext();
	const [, setObjectFromChild] = useState<any>({});

	useEffect(() => {
		setObjectFromChild(userMetaData);

		return () => {
			setObjectFromChild({});
		};
	}, [userMetaData]);

	const handleObjectFromChild = (obj: any) => {
		setObjectFromChild(obj);
	};

	return (
		<div>
			<LoginUser sendObjectToParent={handleObjectFromChild} />
		</div>
	);
};

export default UserInfo;
