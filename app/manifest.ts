import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: 'Subtitle Time Offsetter',
		short_name: 'Subtitle Time Offsetter',
		description:
			'Adjust the timing of SRT subtitle files and sync them perfectly with your videos.',
		start_url: '/',
		display: 'standalone',
		background_color: '#fff',
		theme_color: '#2dac5c',
		icons: [
			{
				sizes: 'any',
				src: '/favicon.ico',
				type: 'image/x-icon',
			},
		],
	};
}
