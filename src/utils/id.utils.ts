export const toIdWithoutLanguage = (id: string): string => {
  return id.split('/').slice(1).join('/')
}