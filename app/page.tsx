import { SubtitleShifter } from '@/components/subtitle-shifter';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

export default function Home() {
	return (
		<main className='container max-w-7xl py-16 px-4 grid gap-8'>
			<div className='flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6'>
				<div>
					<h1 className='text-4xl font-bold'>Subtitle Shifter</h1>
					<p className='text-muted-foreground mt-2'>
						Easily adjust subtitle timing to perfectly sync with your videos
					</p>
				</div>

				<div className='flex items-center gap-2'>
					<ThemeToggle />
					<a
						href='https://github.com/hidrart/subtitle-shifter'
						target='_blank'
						rel='noreferrer'>
						<Button variant='outline' className='flex-none'>
							<Star className='size-4 text-amber-500 fill-current' />
							<span>Star on GitHub</span>
						</Button>
					</a>
				</div>
			</div>

			<SubtitleShifter />
		</main>
	);
}
