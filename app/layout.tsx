import type React from 'react';
import '@/app/globals.css';
import { Bricolage_Grotesque } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import Script from 'next/script';
import { Metadata } from 'next';

const bricolage = Bricolage_Grotesque({
	subsets: ['latin'],
	variable: '--font-bricolage',
});

export const metadata: Metadata = {
	title: 'Subtitle Time Offsetter',
	description:
		'Adjust the timing of SRT subtitle files and sync them perfectly with your videos.',
	authors: {
		name: 'Rafli',
		url: 'https://github.com/hdytrfli',
	},
	openGraph: {
		title: 'Subtitle Time Offsetter',
		description: 'Sync your SRT subtitle files with ease using our web app.',
		url: 'https://subtiltle-shifter.vercel.app',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Subtitle Time Offsetter',
		description:
			'Adjust the timing of SRT subtitle files and sync them perfectly with your videos.',
	},
	robots: 'index, follow',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body className={cn(bricolage.variable, 'antialiased font-sans')}>
				<ThemeProvider attribute='class' defaultTheme='system' enableSystem>
					{children}
					<Toaster />
				</ThemeProvider>
				<Script
					src='https://cloud.umami.is/script.js'
					data-website-id='df57ce59-510e-45d9-a305-98cc3a369e3b'
					strategy='beforeInteractive'
				/>
			</body>
		</html>
	);
}
