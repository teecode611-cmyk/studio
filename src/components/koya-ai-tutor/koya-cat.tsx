
'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface KoyaCatProps {
  className?: string;
}

export function KoyaCat({ className }: KoyaCatProps) {
  return (
    <div className={cn('relative', className)}>
      <Image
        src="/mascot.png"
        alt="Koya the cat mascot"
        fill
        className="object-contain"
      />
    </div>
  );
}
