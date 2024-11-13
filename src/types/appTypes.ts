export type WordType = {
	id?: string;
	englishText?: string;
	learn?: boolean;
	translations?: string[];
	phrases?: string[];
	isVerb?: boolean;
	infinitive?: string;
	simplePast?: string;
	pastParticiple?: string;
	soundUrl?: string;
};

export type WordTestType = {
	id?: string;
	englishText?: string;
	learn?: boolean;
	translations?: string[];
	phrases?: string[];
	isVerb?: boolean;
	infinitive?: string;
	simplePast?: string;
	pastParticiple?: string;
	soundUrl?: string;
	tested?: boolean;
};
