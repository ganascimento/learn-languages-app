import {useEffect, useState} from 'react';

export const useAudio = (): [boolean, (value: string) => void] => {
	const [url, setUrl] = useState('');
	const [audio, setAudio] = useState<HTMLAudioElement>();
	const [playing, setPlaying] = useState(false);

	useEffect(() => {
		playing ? audio?.play() : audio?.pause();
	}, [playing]);

	useEffect(() => {
		if (url) {
			setAudio(new Audio(url));
			setPlaying(!playing);
		}
	}, [url]);

	useEffect(() => {
		audio?.addEventListener('ended', () => {
			setPlaying(false);
			setUrl('');
		});
		return () => {
			audio?.removeEventListener('ended', () => setPlaying(false));
		};
	}, [audio]);

	return [playing, setUrl];
};
