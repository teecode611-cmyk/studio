
'use client';

import Image from 'next/image';

export function KoyaCat() {
  return (
    <div className="relative h-48 w-48 animate-bob">
      <Image
        src="/mascot.png"
        alt="Koya the cat mascot"
        fill
        className="object-contain"
        priority
      />
    </div>
  );
}
