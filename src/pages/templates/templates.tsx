// // @ts-nocheck
import { styled } from '@mui/system';
import { templateData } from '../../constants';
import { Dispatch, SetStateAction } from 'react';
// import { Template } from "../../types";
import { usePaginationContext } from '../../context/MultiCanvasPaginationContext';

interface Props {
	updateStep: Dispatch<SetStateAction<number>>;
	// setDefaultTemplate: Dispatch<SetStateAction<Template>>;
}
function EgBanner({ updateStep }: Props) {
	const StyledContainer = styled('div')({
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		gap: '1rem',
		justifyContent: 'space-evenly',
		height: '100vh',
		backgroundColor: '#151433',
		color: 'white',
		maxWidth: '100%',
	});

	const { addPage } = usePaginationContext();

	const onClickHandler = async (template: any) => {
		// const page = 1;
		// const filePath = template.filePath;
		let templateJSON;

		try {
			templateJSON = await import(
				`../../constants/templates/${template.filePath}.json`
			);
		} catch (error) {
			console.error('Error importing JSON file:', error);
			return;
		}

		const obj = {
			page: 1,
			filePath: template.filePath,
			templateJSON: templateJSON,
			...template,
		};
		addPage(obj);
		updateStep((prev) => prev + 1);
		// setDefaultTemplate(template);

		// Dynamically import the JSON file
	};

	return (
		<StyledContainer>
			{templateData.templates?.map((template) => (
				<img
					key={template.placeholderImage}
					// onClick={() => {
					//   updateStep((prev) => prev + 1);
					//   setDefaultTemplate(template);
					//   const page = 1;
					//   const filePath = template.filePath;
					//   const templateJSON = require(`../../constants/templates/${template.filePath}.json"`)

					//   addPage(page, filePath, templateJSON);
					// }}
					onClick={() => onClickHandler(template)}
					style={{
						width: 300,
						height: 400,
						objectFit: 'contain',
						cursor: 'pointer',
					}}
					src={template.placeholderImage}
				/>
			))}
		</StyledContainer>
	);
}

export default EgBanner;
