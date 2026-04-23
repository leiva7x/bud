// Prefijo para no mezclar datos de BUD con otros sitios web
const STORAGE_PREFIX = 'bud_';

export const storage = {
  // Guardar datos con un "sello" de tiempo opcional
  set: (key: string, value: any) => {
    try {
      const item = {
        value,
        timestamp: Date.now(),
      };
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(item));
    } catch (error) {
      console.error('Error saving to storage', error);
    }
  },

  // Recuperar datos de forma segura
  get: (key: string) => {
    try {
      const item = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
      return item ? JSON.parse(item).value : null;
    } catch (error) {
      return null;
    }
  },

  // Limpiar un dato específico
  remove: (key: string) => {
    localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
  }
};
