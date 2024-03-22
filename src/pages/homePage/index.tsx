import { useEffect, useState } from 'react';
import LandingPage from '../landing page/landingPage';
import { APIResponse, Template, TemplateData } from '../../types';
import { BaseURL, templateData } from '../../constants';
import { styled } from '@mui/styles';
import Templates from '../templates/templates';
import Canvas from '../../components/Canvas';

const StyledContainer = styled('div')({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	minHeight: '100vh',
	height: '100%',
	backgroundColor: '#151433',
	color: 'white',
	width: '100%',
});

const HomePage = () => {
	const [step, setStep] = useState(1);
	const [selectedTemplate, setSelectedTemplate] = useState<Template>(
		templateData.templates[0]
	);
	const [scrappedData, setScrappedData] = useState<APIResponse>();
	const [updatedSeedData, setUpdatedSeedData] =
		useState<TemplateData>(templateData);

	useEffect(() => {
		if (!scrappedData) return;

		setUpdatedSeedData((prev) => ({
			...prev,
			backgroundImages:
				scrappedData.image_urls.length > 0
					? scrappedData.image_urls?.map((scrapeImg) => BaseURL + scrapeImg)
					: prev.backgroundImages,
			bubbles:
				scrappedData.image_urls.length > 0
					? scrappedData.image_urls?.map((scrapeImg) => BaseURL + scrapeImg)
					: prev.bubbles,
			texts:
				scrappedData.generated_titles.length > 0
					? scrappedData.generated_titles?.map((scrapeTitles) =>
							scrapeTitles.title.toUpperCase()
					  )
					: prev.texts,
		}));
	}, [scrappedData]);

	return (
		// <>
		// 	{step == 1 ? (
		// 		<Templates
		// 			updateStep={setStep}
		// 			setDefaultTemplate={setSelectedTemplate}
		// 		/>
		// 	) : step == 2 ? (
		// 		<StyledContainer>
		// 			<Canvas
		// 				updatedSeedData={updatedSeedData}
		// 				template={selectedTemplate}
		// 			/>
		// 		</StyledContainer>
		// 	) : step == 3 ? (
		// 		<StyledContainer>
		// 			<Canvas
		// 				updatedSeedData={updatedSeedData}
		// 				template={selectedTemplate}
		// 			/>
		// 		</StyledContainer>
		// 	) : (
		// 		''
		// 	)}
		// </>
		<>
			{step == 1 ? (
				<LandingPage setScrappedData={setScrappedData} updateStep={setStep} />
			) : step == 2 ? (
				<Templates
					updateStep={setStep}
					setDefaultTemplate={setSelectedTemplate}
				/>
			) : step == 3 ? (
				<StyledContainer>
					<Canvas
						updatedSeedData={updatedSeedData}
						template={selectedTemplate}
					/>
				</StyledContainer>
			) : (
				''
			)}
		</>
	);
};

export default HomePage;

{
	/* <>
			{step == 1 ? (
				<LandingPage setScrappedData={setScrappedData} updateStep={setStep} />
			) : step == 2 ? (
				<Templates
					updateStep={setStep}
					setDefaultTemplate={setSelectedTemplate}
				/>
			) : step == 3 ? (
				<StyledContainer>
					<Canvas
						updatedSeedData={updatedSeedData}
						template={selectedTemplate}
					/>
				</StyledContainer>
			) : (
				''
			)}
		</> */
}
