import type React from 'react';
import '@/app/globals.css';
import { Bricolage_Grotesque } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

const bricolage = Bricolage_Grotesque({
	subsets: ['latin'],
	variable: '--font-bricolage',
});

export const metadata = {
	title: 'SRT Time Shifter',
	description:
		'Easily adjust subtitle timing to perfectly sync with your videos',
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
			</body>
		</html>
	);
}
