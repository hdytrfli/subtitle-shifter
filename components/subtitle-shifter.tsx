'use client';

import JSZip from 'jszip';
import * as React from 'react';
import FileSaver from 'file-saver';
import { Download, Trash } from 'lucide-react';
import { processSubtitle } from '@/lib/subtitle-processor';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { FileGrid } from '@/components/file-grid';
import { ShiftForm } from '@/components/shift-form';
import { FileUploader } from '@/components/file-uploader';
import { Direction, Status } from '@/types/subtitle';

export type UploadedFile = {
	id: string;
	file: File;
	status: Status;
	progress: number;
	result?: Blob;
};

export function SubtitleShifter() {
	const { toast } = useToast();
	const [prefix, setPrefix] = React.useState('shifted_');
	const [files, setFiles] = React.useState<UploadedFile[]>([]);

	const handleFilesAdded = (added: File[]) => {
		setFiles((prev) => [
			...prev,
			...added.map((file) => ({
				file,
				id: crypto.randomUUID(),
				status: 'idle' as const,
				progress: 0,
			})),
		]);
	};

	const handleRemoveFile = (id: string) => {
		setFiles((prev) => prev.filter((file) => file.id !== id));
	};

	const handleProcessFiles = async (
		milliseconds: number,
		direction: Direction,
		prefix: string
	) => {
		setPrefix(prefix);

		if (milliseconds <= 0) {
			toast({
				title: 'Invalid shift value',
				description: 'Shift value must be greater than 0',
				variant: 'destructive',
			});
			return;
		}

		const updated = [...files];
		const length = updated.length;

		for (let i = 0; i < length; i++) {
			if (updated[i].status === 'complete') continue;

			updated[i].status = 'processing';
			updated[i].progress = 0;
			setFiles([...updated]);

			try {
				const result = await processSubtitle(
					updated[i].file,
					milliseconds,
					direction,
					(progress) => {
						updated[i].progress = progress;
						setFiles([...updated]);
					}
				);

				updated[i].result = result;
				updated[i].status = 'complete';
				updated[i].progress = 100;

				toast({
					title: 'Processing complete',
					description: 'Successfully processed ' + updated[i].file.name,
				});
			} catch (error) {
				updated[i].status = 'error';
				console.error('Error processing file:', error);

				toast({
					variant: 'destructive',
					title: 'Processing failed',
					description: 'Failed to process ' + updated[i].file.name,
				});
			}

			setFiles([...updated]);
		}
	};

	const handleZip = async () => {
		const completed = files.filter(
			(file) => file.status === 'complete' && file.result
		);

		if (completed.length === 0) {
			toast({
				title: 'No files to download',
				description: 'Process some files first before downloading',
				variant: 'destructive',
			});

			return;
		}

		try {
			const zip = new JSZip();
			completed.forEach((file) => {
				if (file.result) {
					const fileName = `${prefix}${file.file.name}`;
					zip.file(fileName, file.result);
				}
			});

			const content = await zip.generateAsync({ type: 'blob' });
			FileSaver.saveAs(content, 'shifted_subtitles.zip');

			toast({
				title: 'Download started',
				description: 'Downloading files as a zip archive',
			});
		} catch (error) {
			console.error('Error creating zip file:', error);

			toast({
				title: 'Download failed',
				description: 'Failed to create zip file',
				variant: 'destructive',
			});
		}
	};

	const handleClear = () => {
		setFiles([]);
	};

	const downloadable = files.some((file) => file.status === 'complete');

	return (
		<div className='grid lg:grid-cols-5 gap-8'>
			<div className='flex flex-col gap-6 lg:col-span-2'>
				<div className='flex justify-between items-center h-10'>
					<h2 className='text-xl font-semibold'>Time Shift Settings</h2>
				</div>

				<ShiftForm
					onSubmit={handleProcessFiles}
					disabled={files.length === 0}
				/>
			</div>

			<div className='flex flex-col gap-6 lg:col-span-3'>
				<div className='flex justify-between items-center h-10'>
					<h2 className='text-xl font-semibold'>Files</h2>

					<div className='flex items-center gap-2'>
						{downloadable && (
							<Button onClick={handleZip} variant='outline'>
								<Download className='size-4' />
								<span>Download All</span>
							</Button>
						)}

						<Button onClick={handleClear} variant='outline'>
							<Trash className='size-4' />
							<span>Clear All</span>
						</Button>
					</div>
				</div>

				<FileUploader onFilesAdded={handleFilesAdded} />

				<FileGrid
					files={files}
					onRemove={handleRemoveFile}
					filePrefix={prefix}
				/>
			</div>
		</div>
	);
}
