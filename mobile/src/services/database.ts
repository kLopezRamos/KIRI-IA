import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('kiri_ai_history.db');

export interface HistoryItem {
  id?: number;
  objectName: string;
  imageUri: string;
  timestamp: string;
}

export const DatabaseService = {
  
  initDatabase: async (): Promise<void> => {
    try {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS history (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          object_name TEXT NOT NULL,
          image_uri TEXT NOT NULL,
          timestamp TEXT NOT NULL
        );
      `);
      console.log("Database: Tabla 'history' verificada/creada con éxito.");
    } catch (error) {
      console.error("Database: Error al inicializar la tabla:", error);
      throw error;
    }
  },

  
  insertHistory: async (item: HistoryItem): Promise<void> => {
    try {
      await db.runAsync(
        'INSERT INTO history (object_name, image_uri, timestamp) VALUES (?, ?, ?);',
        [item.objectName, item.imageUri, item.timestamp]
      );
      console.log(`Database: Guardado exitoso de: ${item.objectName}`);
    } catch (error) {
      console.error("Database: Error al insertar registro:", error);
      throw error;
    }
  },

 
  getAllHistory: async (): Promise<HistoryItem[]> => {
    try {
      const rows = await db.getAllAsync<{
        id: number;
        object_name: string;
        image_uri: string;
        timestamp: string;
      }>('SELECT * FROM history ORDER BY id DESC;');

      return rows.map(row => ({
        id: row.id,
        objectName: row.object_name,
        imageUri: row.image_uri,
        timestamp: row.timestamp
      }));
    } catch (error) {
      console.error("Database: Error al consultar el historial:", error);
      throw error;
    }
  }
};