export declare function getAllSpells(): Array<{
  id: number;
  nome: string;
  elemento: string;
  descrizione: string;
  immagine: string;
  dorso: string;
  targetType: string;
  effetto: string;
  valore: number;
}>;

export declare function getSpellsByElement(elemento: string): Array<{
  id: number;
  nome: string;
  elemento: string;
  descrizione: string;
  immagine: string;
  dorso: string;
  targetType: string;
  effetto: string;
  valore: number;
}>;