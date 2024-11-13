'use client';

import WordsSaveForm from '@/components/forms/words/save.form';
import {DictionaryStore} from '@/store/dictionary.store';
import {WordStore} from '@/store/word.store';
import {WordType} from '@/types/appTypes';
import {Backdrop, CircularProgress} from '@mui/material';
import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import toast from 'react-hot-toast';

export default function WordEdit({params}: any) {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<WordType>();

	const router = useRouter();
	const dictionaryStore = new DictionaryStore();
	const wordStore = new WordStore();

	useEffect(() => {
		getData();
	}, []);

	const getData = async () => {
		setLoading(true);

		try {
			const result = await wordStore.getById(params.id);
			setData(result);
		} finally {
			setLoading(false);
		}
	};

	const handleEdit = async (data: WordType) => {
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

			await wordStore.update(data);
			router.back();
		} catch {
			toast.error('Error to edit new word!');
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			{loading && !data ? <></> : <WordsSaveForm onSave={handleEdit} initialValue={data} />}
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
