'use client';

import { AlertTriangle } from 'lucide-react';
import { useAutoAnimate } from '@formkit/auto-animate/react';

import { FileCard } from '@/components/file-card';
import type { UploadedFile } from '@/components/subtitle-shifter';

interface FileGridProps {
	files: UploadedFile[];
	onRemove: (id: string) => void;
	filePrefix: string;
}

export function FileGrid({ files, onRemove, filePrefix }: FileGridProps) {
	const [parent] = useAutoAnimate();

	if (files.length === 0) {
		return (
			<div className='grid justify-center items-center h-80 bg-card rounded-xl border p-4'>
				<div className='flex items-center gap-2 text-muted-foreground'>
					<AlertTriangle className='size-4' />
					<span>No files added</span>
				</div>
			</div>
		);
	}

	return (
		<div className='grid grid-cols-1 md:grid-cols-2 gap-4' ref={parent}>
			{files.map((file) => (
				<FileCard
					key={file.id}
					file={file}
					onRemove={() => onRemove(file.id)}
					prefix={filePrefix}
				/>
			))}
		</div>
	);
}
