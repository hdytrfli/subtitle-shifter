import Timestamp from '@/lib/serializer';
import { Direction, Subtitle } from '@/types/subtitle';

export async function processSubtitle(
	file: File,
	shift: number,
	direction: Direction,
	onProgress: (progress: number) => void
): Promise<Blob> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = async (e) => {
			try {
				onProgress(30);
				const content = e.target?.result as string;

				const subtitles = parseSRT(content);
				onProgress(50);

				const signed = direction === 'forward' ? shift : -shift;
				const shifted = shiftSubtitles(subtitles, signed);
				onProgress(70);

				const compiled = generateSRT(shifted);
				onProgress(90);

				const blob = new Blob([compiled], {
					type: 'text/plain',
				});
				onProgress(100);
				resolve(blob);
			} catch (error) {
				console.error('Error processing subtitle file:', error);
				reject(error);
			}
		};

		reader.onerror = () => {
			reject(new Error('Error reading file'));
		};

		reader.readAsText(file);
	});
}

function parseSRT(content: string): Subtitle[] {
	const subtitles: Subtitle[] = [];

	const normalized = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
	const blocks = normalized.split(/\n\n+/);

	blocks.forEach((block) => {
		if (!block.trim()) return;

		const lines = block.split('\n');
		if (lines.length < 3) return;

		const id = Number.parseInt(lines[0].trim(), 10);
		if (isNaN(id)) return;

		const pattern = /(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})/;
		const match = lines[1].match(pattern);
		if (!match) return;

		const [_, start, end] = match;
		const text = lines.slice(2).join('\n');

		subtitles.push({
			id,
			start,
			end,
			text,
		});
	});

	return subtitles;
}

function shiftSubtitles(subtitles: Subtitle[], shift: number): Subtitle[] {
	if (shift === 0) return subtitles;

	const shifted = subtitles.map((subtitle) => {
		console.log(subtitle);

		const start = Timestamp.deserialize(subtitle.start);
		const end = Timestamp.deserialize(subtitle.end);

		return {
			...subtitle,
			start: Timestamp.serialize(start + shift),
			end: Timestamp.serialize(end + shift),
		};
	});

	return shifted;
}

function generateSRT(subtitles: Subtitle[]): string {
	const bom = '\uFEFF';

	const srtBody = subtitles
		.map((subtitle, index) => {
			const group = [
				index + 1,
				subtitle.start + ' --> ' + subtitle.end,
				subtitle.text,
			];

			return group.join('\r\n');
		})
		.join('\r\n\r\n');

	return bom + srtBody;
}
