export function capitalize(
  value?: string | null,
  fallback: string = "Not Added",
): string {
  if (!value) return fallback;

  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}
