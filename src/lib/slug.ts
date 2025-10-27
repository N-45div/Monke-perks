const ACCENTS_REGEX = /[\u0300-\u036f]/g

export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(ACCENTS_REGEX, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}
