export const syncService = {
  // Revisa si estamos conectados a la red
  isOnline: () => window.navigator.onLine,

  // Escucha cambios en la conexión
  subscribeToNetworkStatus: (callback: (isOnline: boolean) => void) => {
    window.addEventListener('online', () => callback(true));
    window.addEventListener('offline', () => callback(false));
  },

  // Aquí es donde iría la lógica para enviar datos a una API en el futuro
  pushToCloud: async (action: string, data: any) => {
    if (!window.navigator.onLine) {
      console.log('Guardando acción en cola local hasta que haya internet...');
      // Lógica de cola (queue) simplificada para esta fase
      return false;
    }
    return true;
  }
};
