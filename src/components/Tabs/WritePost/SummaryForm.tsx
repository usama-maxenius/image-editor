// @ts-nocheck
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { useCanvasContext } from '../../../context/CanvasContext';
import {
	Button,
	Checkbox,
	FormControlLabel,
	FormGroup,
	Typography,
} from '@mui/material';
import Select, { MultiValue, SingleValue } from 'react-select';
import Creatable from 'react-select/creatable';
import { getSummary } from '../../../api/write-post';
import CircularProgress from '@mui/material/CircularProgress';

interface Props {
	setSummaryContent: Dispatch<SetStateAction<string | undefined>>;
}
const SummaryForm: FC<Props> = ({
	setSummaryContent,
}: // summaryContent,
Props) => {
	const { scrapURL } = useCanvasContext();
	const [isLoading, setIsLoading] = useState(false);
	const [isHashtagsEnabled, setIsHashtagsEnabled] = useState(false);
	const [formData, setFormData] = useState({
		url: scrapURL,
		vibe: 'positive',
		format: 'text',
		emojis: false,
		hashtags: isHashtagsEnabled,
		social_media: 'twitter',
		char_count: 280,
	});

	const handleCheckboxChange = (e) => {
		const checked = e.target.checked;
		setIsHashtagsEnabled(checked);

		setFormData((prevFormData) => ({
			...prevFormData,
			hashtags: checked,
		}));
	};

	const socialMedias = [
		{
			label: 'Twitter',
			value: 'twitter',
			length: 280,
		},
		{
			label: 'Facebook',
			value: 'facebook',
			length: 63206,
		},
		{
			label: 'Instagram',
			value: 'instagram',
			length: 150,
		},
		{
			label: 'LinkedIn',
			value: 'linkedIn',
			length: 2000,
		},
		{
			label: 'TikTok',
			value: 'tikTok',
			length: 2200,
		},
	];

	const handleHashtagSelectChange = (
		newValue: MultiValue<{
			label: string;
			value: string;
		}>
	) => {
		if (!newValue) return;

		const updatedHashtags = newValue?.map((option) => option?.value);

		setFormData((prev) => ({
			...prev,
			hashtags: updatedHashtags,
		}));
	};

	const handleSocialSelectChange = (
		newValue: SingleValue<{
			label: string;
			value: string;
		}>
	) => {
		setFormData((prev) => ({ ...prev, social_media: newValue!?.value }));
	};

	const generateSummaryHandler = async () => {
		try {
			setIsLoading(true);
			const data = await getSummary(formData);
			// console.log(data?.data?.data?.response?.content);
			setSummaryContent(data?.data?.data?.response);
			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
		}
	};

	const customStyles = {
		control: (provided) => ({
			...provided,
			backgroundColor: 'white', // background color of the control
			borderColor: '#3B0E39', // border color of the control
		}),
		singleValue: (provided) => ({
			...provided,
			color: 'black', // color of the selected option text
		}),
		placeholder: (provided) => ({
			...provided,
			color: 'gray', // color of the placeholder text
		}),
		option: (provided, state) => ({
			...provided,
			backgroundColor: state?.isSelected ? '#3B0E39' : 'white', // background color of the options
			color: state?.isSelected ? 'white' : 'black', // color of the option text
			'&:hover': {
				backgroundColor: 'lightgray', // background color on hover
				color: 'black', // color of the option text on hover
			},
		}),
		menu: (provided) => ({
			...provided,
			backgroundColor: 'white', // background color of the menu
		}),
	};

	return (
		<div>
			<FormGroup>
				<FormControlLabel
					control={<Checkbox defaultChecked />}
					checked={formData?.emojis}
					onChange={(e) =>
						setFormData((prev) => ({
							...prev,
							emojis: e?.target?.checked,
						}))
					}
					label='Emojis'
					sx={{
						'& .MuiIconButton-root': {
							color: '#fff',
							border: '1px solid #fff',
						},
						'&.Mui-checked': {
							color: '#fff',
						},
						'& .MuiSvgIcon-root ': {
							fill: '#fff',
						},
					}}
				/>

				<FormControlLabel
					control={
						<Checkbox
							checked={isHashtagsEnabled}
							onChange={handleCheckboxChange}
						/>
					}
					label='Hashtag'
					sx={{
						'& .MuiIconButton-root': {
							color: '#fff',
							border: '1px solid #fff',
						},
						'&.Mui-checked': {
							color: '#fff',
						},
						'& .MuiSvgIcon-root': {
							fill: '#fff',
						},
					}}
				/>

				<br />

				<Typography>Social Platforms</Typography>
				<Select
					defaultValue={{ label: 'Social Media', value: '' }}
					onChange={handleSocialSelectChange}
					name='colors'
					placeholder='Social Media'
					options={socialMedias}
					className='basic-single'
					classNamePrefix='select'
					styles={customStyles}
				/>

				<Button
					onClick={generateSummaryHandler}
					variant='contained'
					sx={{
						textTransform: 'capitalize',
						mt: 2,
					}}
					endIcon={
						isLoading ? (
							<CircularProgress sx={{ color: '#ffffff' }} size={20} />
						) : null
					}
				>
					Generate
				</Button>
			</FormGroup>
		</div>
	);
};

export default SummaryForm;
