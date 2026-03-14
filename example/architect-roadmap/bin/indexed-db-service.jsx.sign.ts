export const IndexedDbService: (dbName: string, dbVersion: number) => {
  initDB: () => Promise<void>;
  addEntity: (entityType: string, data: any) => Promise<string>;
  getEntities: (entityType: string) => Promise<any[]>;
  getEntity: (entityType: string, id: string) => Promise<any | undefined>;
  updateEntity: (entityType: string, id: string, data: Partial<any>) => Promise<void>;
  deleteEntity: (entityType: string, id: string) => Promise<void>;
  clearAllData: () => Promise<void>;
};