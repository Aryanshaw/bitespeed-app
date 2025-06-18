export const unique = <T>(arr: (T | null | undefined)[]) => [...new Set(arr.filter(Boolean))];
