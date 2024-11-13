'use client';

import {WordStore} from '@/store/word.store';
import {WordTestType} from '@/types/appTypes';
import {List} from '@mui/icons-material';
import {Backdrop, Button, CircularProgress, Fab, Grid, TextField, Typography} from '@mui/material';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import toast from 'react-hot-toast';

const typeEnglish = 'English';
const typePortuguese = 'Portuguese';

export default function Home() {
	const [start, setStart] = useState(false);
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<WordTestType[]>([]);
	const [currentWord, setCurrentWord] = useState<WordTestType>();
	const [currentText, setCurrentText] = useState('');
	const [type, setType] = useState('');
	const [word, setWord] = useState('');

	const router = useRouter();
	const wordStore = new WordStore();

	const handleGoWords = () => {
		router.push('/words');
	};

	const handleStartTest = async () => {
		setLoading(true);

		try {
			const result = await wordStore.get();
			if (!result) return;

			setData(result);
			setStart(true);
			setLoading(false);
			handleNextWord(result);
		} catch {
			setLoading(false);
		}
	};

	const handleNextWord = (currentData?: WordTestType[]) => {
		const allowData = (currentData ?? data).filter(x => !x.tested && x.learn);
		if (allowData.length == 0) {
			toast.success('Congratulations, you finished!');
			setStart(false);
			setData(
				[...data].map(x => {
					x.tested = false;
					return x;
				}),
			);
			setWord('');
			return;
		}

		const index = Math.floor(Math.random() * allowData.length);
		const typeIndex = Math.floor(Math.random() * 2);

		setType(typeIndex == 0 ? typeEnglish : typePortuguese);
		setCurrentWord(allowData[index]);

		if (typeIndex === 0) {
			const indexTranslation = Math.floor(
				Math.random() * (allowData[index]?.translations?.length ?? 1),
			);
			setCurrentText(allowData[index]?.translations![indexTranslation] ?? '');
		} else {
			setCurrentText(allowData[index].englishText ?? '');
		}
	};

	const handleSend = () => {
		let isRight = false;
		if (type === typeEnglish) {
			if (currentWord?.englishText?.toUpperCase() == word.toUpperCase()) isRight = true;
		} else {
			if (currentWord?.translations?.map(x => x.toUpperCase()).includes(word.toUpperCase()))
				isRight = true;
		}

		if (isRight) {
			toast.success('Right');
			handleNextWord();
			setWord('');
			setData(
				[...data].map(x => {
					if (x.id === currentWord?.id) x.tested = true;
					return x;
				}),
			);
		} else {
			toast.error('Wrong');
		}
	};

	return (
		<>
			{start ? (
				<Grid item md={12}>
					<div className="flex items-center justify-center mb-16 flex-col">
						<Typography>Write the word in {type}:</Typography>
						<Typography sx={{fontSize: '35px', color: 'yellow'}}>
							{currentText}
						</Typography>
					</div>

					<TextField
						fullWidth
						placeholder="Write the word"
						value={word}
						onChange={e => setWord(e.target.value)}
						onKeyDown={key => {
							if (key.key === 'Enter') handleSend();
						}}
					/>
					<div className="mt-3 flex gap-2 justify-end">
						<Button variant="contained" size="medium" onClick={() => handleNextWord()}>
							Next
						</Button>
						<Button
							variant="contained"
							size="medium"
							color="success"
							onClick={handleSend}>
							Send
						</Button>
					</div>
				</Grid>
			) : (
				<Grid item md={12}>
					<div className="mt-3 flex gap-2 justify-center">
						<Button variant="contained" size="large" onClick={handleStartTest}>
							Start test
						</Button>
					</div>
				</Grid>
			)}

			<div
				className="fixed flex gap-3"
				style={{top: 'calc(100vh - 100px)', left: 'calc(70vw)'}}>
				<Fab color="secondary" aria-label="add" onClick={handleGoWords}>
					<List />
				</Fab>
			</div>

			<Backdrop
				open={loading ?? false}
				sx={{
					position: 'fixed',
					color: 'common.white',
					zIndex: theme => theme.zIndex.mobileStepper - 1,
				}}>
				<CircularProgress color="inherit" />
			</Backdrop>
		</>
	);
}
