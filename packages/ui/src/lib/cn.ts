import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// tailwind-merge must know our custom font-size keys (text-md) so it does not drop colour classes.
const twMerge = extendTailwindMerge({
  extend: { classGroups: { 'font-size': [{ text: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] }] } },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
