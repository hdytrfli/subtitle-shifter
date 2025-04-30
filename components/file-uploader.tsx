'use client';

import type React from 'react';

import { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
	onFilesAdded: (files: File[]) => void;
}

export function FileUploader({ onFilesAdded }: FileUploaderProps) {
	const { toast } = useToast();
	const input = useRef<HTMLInputElement>(null);
	const [dragging, setDragging] = useState(false);

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setDragging(true);
	};

	const handleDragLeave = () => {
		setDragging(false);
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setDragging(false);

		const files = Array.from(e.dataTransfer.files);
		processFiles(files);
	};

	const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const files = Array.from(e.target.files);
			processFiles(files);
			e.target.value = '';
		}
	};

	const processFiles = (files: File[]) => {
		const validated = files.filter((file) => {
			const valid = file.name.toLowerCase().endsWith('.srt');

			if (!valid) {
				toast({
					title: 'Invalid file type',
					description: file.name + ' is not a .srt file',
					variant: 'destructive',
				});
			}

			return valid;
		});

		if (validated.length > 0) {
			onFilesAdded(validated);

			toast({
				title: validated.length + ' file added',
				description: 'Ready to process your subtitle files',
			});
		}
	};

	return (
		<Card>
			<CardContent className='p-6'>
				<div
					className={cn('border border-dashed rounded-lg p-8 text-center', {
						'border-primary bg-primary/5': dragging,
						'border-muted-foreground/20': !dragging,
					})}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}>
					<FileText className='size-10 mx-auto mb-4 stroke-1' />

					<h3 className='text-lg font-medium mb-2'>
						Drop your .srt files here
					</h3>
					<p className='text-sm text-muted-foreground mb-4'>
						or click the button below to select files
					</p>

					<Button onClick={() => input.current?.click()} className='mx-auto'>
						<Upload className='size-4' />
						Select Files
					</Button>
					<input
						type='file'
						ref={input}
						onChange={handleFileInputChange}
						accept='.srt'
						multiple
						className='hidden'
					/>
				</div>
			</CardContent>
		</Card>
	);
}
