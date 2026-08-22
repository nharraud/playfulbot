export function toImportIdentifier(packageId: string): string {
  const [first, ...rest] = packageId.split(/[^a-zA-Z0-9]+/).filter(Boolean);
  return [first, ...rest.map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))].join('');
}
