"use client";
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useTransition } from 'react';
import { usePathname } from 'next/navigation';

export default function LocalSwitcher() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const localActive = useLocale(); // Get the current locale
  const currentPath = usePathname(); // Get the current pathname

  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;

    startTransition(() => {
      // Create new path with updated locale
      const newPath = currentPath.replace(`/${localActive}`, `/${nextLocale}`);
      router.replace(newPath); // Use replace to avoid full page reload
    });
  };

  return (
    <label className='border-2 rounded'>
      <p className='sr-only'>Change language</p>
      <select
        value={localActive} // Controlled component
        className='bg-transparent '
        onChange={onSelectChange}
        disabled={isPending}
      >
        <option value='mr'>Mr</option>
        <option value='hi'>Hi</option>
        <option value='en'>En</option>
      </select>
    </label>
  );
}