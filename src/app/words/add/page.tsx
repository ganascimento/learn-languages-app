'use client';

import WordsSaveForm from '@/components/forms/words/save.form';
import {DictionaryStore} from '@/store/dictionary.store';
import {WordStore} from '@/store/word.store';
import {WordType} from '@/types/appTypes';
import {Backdrop, CircularProgress} from '@mui/material';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import toast from 'react-hot-toast';

export default function WordAdd() {
	const [loading, setLoading] = useState(false);

	const router = useRouter();
	const dictionaryStore = new DictionaryStore();
	const wordStore = new WordStore();

	const handleAdd = async (data: WordType) => {
		setLoading(true);

		try {
			if (!data.englishText) {
				toast.error('Add word!');
				return;
			}
			if (!data.translations || data.translations.length == 0) {
				toast.error('Add translation(s)!');
				return;
			}
			const url = await dictionaryStore.get(data.englishText);
			if (!url) {
				toast.error('Word not found!');
				return;
			}

			data.soundUrl = url;
			data.learn = true;

			await wordStore.add(data);
			router.back();
		} catch {
			toast.error('Error to create new word!');
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<WordsSaveForm onSave={handleAdd} />

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
