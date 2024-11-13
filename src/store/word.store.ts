import {WordType} from '@/types/appTypes';
import axios from 'axios';
import toast from 'react-hot-toast';

export class WordStore {
	private api = axios.create({
		baseURL: 'https://localhost:7216/word',
	});

	public async get(): Promise<WordType[] | undefined> {
		try {
			const result = await this.api.get('/');

			if (result.status === 200) return result.data;
			return undefined;
		} catch {
			toast.error('Error to call Api!');
			return undefined;
		}
	}

	public async getById(id: string): Promise<WordType | undefined> {
		try {
			const result = await this.api.get(`/${id}`);

			if (result.status === 200) return result.data;
			return undefined;
		} catch {
			toast.error('Error to call Api!');
			return undefined;
		}
	}

	public async add(data: WordType): Promise<boolean> {
		try {
			const result = await this.api.post('/', data);

			if (result.status === 200) return true;
			return false;
		} catch {
			return false;
		}
	}

	public async update(data: WordType): Promise<WordType[] | undefined> {
		try {
			await this.api.put('/', data);
		} catch {
			toast.error('Error to call Api!');
			return undefined;
		}
	}

	public async remove(ref: string): Promise<WordType[] | undefined> {
		try {
			const result = await this.api.delete(`/${ref}`);

			if (result.status === 200) result.data;
			return undefined;
		} catch {
			toast.error('Error to call Api!');
			return undefined;
		}
	}
}
