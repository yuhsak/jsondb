export const generateId = (unit: number) => [...Array(unit)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')
