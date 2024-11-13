import axios from 'axios';

export class DictionaryStore {
	private api = axios.create({
		baseURL: 'https://api.dictionaryapi.dev/api/v2/entries/en',
	});

	public async get(word: string): Promise<string | undefined> {
		try {
			const result = await this.api.get(`/${word}`);

			if (result.status === 200 && result.data.length > 0) {
				let audio = result.data[0].phonetics[0].audio;
				if (!audio) {
					result.data[0].phonetics?.forEach((phonetic: any) => {
						if (!!phonetic.audio && phonetic.audio.includes('-us.'))
							audio = phonetic.audio;
					});
				}
				if (!audio) {
					result.data[0].phonetics?.forEach((phonetic: any) => {
						if (!!phonetic.audio) audio = phonetic.audio;
					});
				}

				return audio;
			}

			return undefined;
		} catch {
			return undefined;
		}
	}
}
