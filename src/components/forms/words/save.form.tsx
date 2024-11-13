'use client';

import {WordType} from '@/types/appTypes';
import {Add} from '@mui/icons-material';
import {Switch, Chip, FormControlLabel, Grid, IconButton, TextField, Button} from '@mui/material';
import {useRouter} from 'next/navigation';
import {useState} from 'react';

type Props = {
	onSave: (data: WordType) => void;
	initialValue?: WordType;
};

const initialValue: WordType = {
	isVerb: false,
};

export default function WordsSaveForm(props: Props) {
	const [formData, setFormData] = useState<WordType>(props.initialValue ?? initialValue);
	const [currentTranslation, setCurrentTranslation] = useState<string>('');
	const [currentPhrase, setCurrentPhrase] = useState<string>('');

	const router = useRouter();

	const handleAddTranslation = () => {
		if (
			!currentTranslation ||
			formData?.translations
				?.map(translation => translation.toUpperCase())
				.includes(currentTranslation.toUpperCase())
		)
			return;

		const translations = [...(formData?.translations ?? [])];
		translations.push(currentTranslation);
		setFormData({...formData, translations});
		setCurrentTranslation('');
	};

	const handleRemoveTranslation = (value: string) => {
		setFormData({
			...formData,
			translations: formData?.translations?.filter(translation => translation != value),
		});
	};

	const handleAddPhrase = () => {
		if (
			!currentPhrase ||
			formData?.phrases
				?.map(phrase => phrase.toUpperCase())
				.includes(currentPhrase.toUpperCase())
		)
			return;

		const phrases = [...(formData?.phrases ?? [])];
		phrases.push(currentPhrase);
		setFormData({...formData, phrases});
		setCurrentPhrase('');
	};

	const handleRemovePhrase = (value: string) => {
		setFormData({
			...formData,
			phrases: formData?.phrases?.filter(phrase => phrase != value),
		});
	};

	console.log(formData.englishText);

	return (
		<>
			<Grid item md={10}>
				<TextField
					fullWidth
					label="Word"
					value={formData?.englishText}
					onChange={e => setFormData({...formData, englishText: e.target.value})}
				/>
			</Grid>
			<Grid item md={2}>
				<FormControlLabel
					control={
						<Switch
							defaultChecked
							checked={formData?.isVerb}
							onChange={() =>
								setFormData({
									...formData,
									isVerb: !formData?.isVerb,
									infinitive: '',
									pastParticiple: '',
									simplePast: '',
								})
							}
						/>
					}
					label="Is verb?"
					labelPlacement="top"
				/>
			</Grid>

			{formData?.isVerb ? (
				<>
					<Grid item md={4}>
						<TextField
							fullWidth
							label="Infinitive"
							value={formData?.infinitive}
							onChange={e => setFormData({...formData, infinitive: e.target.value})}
						/>
					</Grid>
					<Grid item md={4}>
						<TextField
							fullWidth
							label="Simple past"
							value={formData?.simplePast}
							onChange={e => setFormData({...formData, simplePast: e.target.value})}
						/>
					</Grid>
					<Grid item md={4}>
						<TextField
							fullWidth
							label="Past participle"
							value={formData?.pastParticiple}
							onChange={e =>
								setFormData({...formData, pastParticiple: e.target.value})
							}
						/>
					</Grid>
				</>
			) : (
				<></>
			)}

			<Grid item md={12}>
				<TextField
					fullWidth
					label="Translations"
					value={currentTranslation}
					onChange={e => setCurrentTranslation(e.target.value)}
					onKeyDown={({key}) => {
						if (key === 'Enter') handleAddTranslation();
					}}
					InputProps={{
						endAdornment: (
							<IconButton onClick={handleAddTranslation} edge="end" color="primary">
								<Add />
							</IconButton>
						),
					}}
				/>
			</Grid>
			{formData?.translations && formData?.translations.length > 0 ? (
				<Grid item md={12}>
					<div className="flex gap-2 flex-wrap">
						{formData?.translations?.map(translation => (
							<Chip
								label={translation}
								color="primary"
								onDelete={() => handleRemoveTranslation(translation)}
							/>
						))}
					</div>
				</Grid>
			) : (
				<></>
			)}

			<Grid item md={12}>
				<TextField
					fullWidth
					label="Example phrases"
					value={currentPhrase}
					onChange={e => setCurrentPhrase(e.target.value)}
					onKeyDown={({key}) => {
						if (key === 'Enter') handleAddPhrase();
					}}
					InputProps={{
						endAdornment: (
							<IconButton onClick={handleAddPhrase} edge="end" color="primary">
								<Add />
							</IconButton>
						),
					}}
				/>
			</Grid>
			{formData?.phrases && formData?.phrases.length > 0 ? (
				<Grid item md={12}>
					<div className="flex gap-2 flex-wrap">
						{formData?.phrases?.map(phrase => (
							<Chip
								label={phrase}
								color="primary"
								onDelete={() => handleRemovePhrase(phrase)}
							/>
						))}
					</div>
				</Grid>
			) : (
				<></>
			)}

			<Grid item md={12} className="flex justify-end gap-3">
				<Button variant="contained" color="warning" onClick={() => router.back()}>
					Back
				</Button>
				<Button variant="contained" onClick={() => props.onSave(formData)}>
					{formData.id ? 'Edit' : 'Add'}
				</Button>
			</Grid>
		</>
	);
}
