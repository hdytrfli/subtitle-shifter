import { DIRECTIONS, STATUSES } from '@/lib/constant';

export type Subtitle = {
	id: number;
	start: string;
	end: string;
	text: string;
};

export type Direction = (typeof DIRECTIONS)[number];

export type Status = (typeof STATUSES)[number];
