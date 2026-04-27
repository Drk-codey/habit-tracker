export function getHabitSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')          // spaces → hyphens
    .replace(/[^a-z0-9-]/g, '')   // remove anything that's not a letter, number, or hyphen
}