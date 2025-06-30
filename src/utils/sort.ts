export function sortByDateDesc<T>(array: T[], field: keyof T): T[] {
  return [...array].sort((a, b) => {
    const dateA = new Date(a[field] as string).getTime();
    const dateB = new Date(b[field] as string).getTime();
    return dateB - dateA;
  });
}

export function sortByName<T>(array: T[], field: keyof T): T[] {
  return [...array].sort((a, b) => {
    const nameA = String(a[field] ?? '').toLowerCase();
    const nameB = String(b[field] ?? '').toLowerCase();
    return nameA.localeCompare(nameB, 'pt-BR');
  });
}

export function sortByAlpha<T>(array: T[], key: keyof T): T[] {
  return [...array].sort((a, b) => {
    const strA = (a[key] ?? '').toString().toLocaleLowerCase('pt-BR');
    const strB = (b[key] ?? '').toString().toLocaleLowerCase('pt-BR');
    return strA.localeCompare(strB, 'pt-BR');
  });
}

