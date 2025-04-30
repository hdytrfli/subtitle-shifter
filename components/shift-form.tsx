'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Clock,
	ArrowRight,
	ArrowLeft,
	HelpCircle,
	Info,
	Timer,
	Hourglass,
} from 'lucide-react';

import type { Direction } from '@/types/subtitle';
import { DIRECTIONS } from '@/lib/constant';
import { Button } from '@/components/ui/button';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

const formSchema = z.object({
	prefix: z.string(),
	direction: z.enum(DIRECTIONS),
	milliseconds: z.coerce
		.number()
		.int()
		.min(1, 'Shift value must be at least 1ms'),
});

interface ShiftFormProps {
	onSubmit: (
		milliseconds: number,
		direction: Direction,
		prefix: string
	) => void;
	disabled?: boolean;
}

export function ShiftForm({ onSubmit, disabled }: ShiftFormProps) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			prefix: '',
			milliseconds: 500,
			direction: 'backward',
		},
	});

	const handlePreset = (value: number) => {
		form.setValue('milliseconds', value, {
			shouldValidate: true,
			shouldDirty: true,
			shouldTouch: true,
		});
	};

	function handleSubmit(data: z.infer<typeof formSchema>) {
		onSubmit(data.milliseconds, data.direction, data.prefix);
	}

	const presets = [
		{ label: '0.1s', value: 100, icon: <Timer className='h-3 w-3 mr-1' /> },
		{ label: '0.2s', value: 200, icon: <Timer className='h-3 w-3 mr-1' /> },
		{ label: '0.5s', value: 500, icon: <Timer className='h-3 w-3 mr-1' /> },
		{ label: '1s', value: 1000, icon: <Hourglass className='h-3 w-3 mr-1' /> },
		{ label: '2s', value: 2000, icon: <Hourglass className='h-3 w-3 mr-1' /> },
	];

	const current = form.watch('milliseconds');
	const text = form.watch('direction') === 'forward' ? 'Delaying' : 'Advancing';
	const desc = form.watch('direction') === 'forward' ? 'earlier' : 'later';

	return (
		<Card>
			<CardContent className='p-6'>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className='grid gap-6'>
						<FormField
							control={form.control}
							name='prefix'
							render={({ field }) => (
								<FormItem>
									<FormLabel>File Prefix</FormLabel>
									<FormControl>
										<Input placeholder='Enter file prefix' {...field} />
									</FormControl>
									<FormDescription>
										This prefix will be added to filenames
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className='space-y-2'>
							<h4 className='text-sm font-medium'>Time Shift Presets</h4>
							<div className='flex flex-wrap gap-2'>
								{presets.map((preset) => (
									<Button
										key={preset.value}
										type='button'
										variant='outline'
										size='sm'
										onClick={() => handlePreset(preset.value)}
										className={cn('rounded-full text-xs', {
											'border-primary bg-primary/10': current === preset.value,
										})}>
										{preset.icon}
										{preset.label}
									</Button>
								))}
							</div>
						</div>

						<FormField
							control={form.control}
							name='milliseconds'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Time Shift (milliseconds)</FormLabel>
									<FormControl>
										<Input
											min={1}
											{...field}
											type='number'
											onChange={(e) => field.onChange(Number(e.target.value))}
										/>
									</FormControl>
									<FormDescription>
										Enter the number of milliseconds to shift
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='direction'
							render={({ field }) => (
								<FormItem className='space-y-3'>
									<FormLabel>Shift Direction</FormLabel>
									<FormControl>
										<RadioGroup
											onValueChange={field.onChange}
											value={field.value}
											className='flex flex-col space-y-1 text-sm'>
											<div className='flex items-center space-x-2'>
												<RadioGroupItem value='forward' id='forward' />
												<label
													htmlFor='forward'
													className='flex items-center gap-2 cursor-pointer'>
													<ArrowRight className='size-4' />
													<span>Forward (Delay subtitles)</span>
												</label>
											</div>
											<div className='flex items-center space-x-2'>
												<RadioGroupItem value='backward' id='backward' />
												<label
													htmlFor='backward'
													className='flex items-center gap-2 cursor-pointer'>
													<ArrowLeft className='size-4' />
													<span>Backward (Speed up subtitles)</span>
												</label>
											</div>
										</RadioGroup>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Alert>
							<Info className='size-4' />
							<AlertTitle>Current Shift</AlertTitle>
							<AlertDescription>
								<span>{text}</span> subtitles by <strong>{current}ms</strong>
							</AlertDescription>
						</Alert>

						<div className='bg-muted p-4 rounded-lg'>
							<div className='flex items-start gap-2'>
								<HelpCircle className='h-5 w-5 text-muted-foreground shrink-0 mt-0.5' />
								<div>
									<h4 className='font-medium mb-2'>What this means?</h4>
									<p className='text-sm text-muted-foreground mb-2'>
										<span>Subtitles will appear</span>{' '}
										<strong>{current}ms</strong> <span>{desc}</span>{' '}
										<span>than in the original file.</span>{' '}
										<span>
											{form.watch('direction') === 'forward'
												? 'Use this when subtitles appear too early compared to the audio.'
												: 'Use this when subtitles appear too late compared to the audio.'}
										</span>
									</p>
								</div>
							</div>
						</div>

						<Button type='submit' className='w-full' disabled={disabled}>
							<span>Process Files</span>
							<ArrowRight className='size-4' />
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
