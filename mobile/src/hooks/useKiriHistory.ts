import { useState, useEffect } from "react";
import { DatabaseService, HistoryItem } from "../services/database";

export function useKiriHistory() {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Función para consultar a SQLite y actualizar el estado de React
  const cargarHistorial = async () => {
    try {
      setLoading(true);
      const datos = await DatabaseService.getAllHistory();
      setHistoryItems(datos);
    } catch (error) {
      console.error("HookHistorial: Error al cargar registros:", error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar automáticamente la primera vez que se use el hook
  useEffect(() => {
    cargarHistorial();
  }, []);

  return { historyItems, loading, recargarHistorial: cargarHistorial };
}