'use client';

import type { UploadedFile } from './subtitle-shifter';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileText, X, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { formatFileSize } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Status } from '@/types/subtitle';

interface FileCardProps {
	file: UploadedFile;
	onRemove: () => void;
	prefix: string;
}

interface BadgeStateProps {
	label: string;
	variant: 'outline' | 'secondary' | 'default' | 'destructive';
}

export function FileCard({ file, onRemove, prefix }: FileCardProps) {
	const handleDownload = () => {
		if (!file.result) return;

		const url = URL.createObjectURL(file.result);
		const a = document.createElement('a');
		a.href = url;
		a.download = prefix + file.file.name;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	const mapper: Record<Status, BadgeStateProps> = {
		idle: { label: 'Ready', variant: 'outline' },
		processing: { label: 'Processing', variant: 'secondary' },
		complete: { label: 'Complete', variant: 'default' },
		error: { label: 'Error', variant: 'destructive' },
	};

	return (
		<Card className='overflow-hidden'>
			<CardContent className='flex flex-col gap-2 p-4'>
				<div className='flex items-start justify-between'>
					<div className='flex items-center gap-2 truncate pr-2'>
						<FileText className='h-5 w-5 text-muted-foreground shrink-0' />
						<span className='font-medium truncate' title={file.file.name}>
							{file.file.name}
						</span>
					</div>
				</div>

				<div className='flex items-center justify-between text-sm'>
					<span className='text-muted-foreground'>
						{formatFileSize(file.file.size)}
					</span>
					<Badge variant={mapper[file.status].variant}>
						{mapper[file.status].label}
					</Badge>
				</div>
			</CardContent>

			<CardFooter className='grid gap-2 grid-cols-2 p-4 pt-0'>
				<Button
					variant='outline'
					onClick={handleDownload}
					disabled={file.status !== 'complete'}>
					<Download className='size-4' />
					<span>Download</span>
				</Button>

				<Button variant='outline' onClick={onRemove}>
					<X className='size-4' />
					<span>Remove</span>
				</Button>
			</CardFooter>

			<Progress value={file.progress} className='h-1 rounded-none' />
		</Card>
	);
}
