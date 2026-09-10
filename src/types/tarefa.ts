import { Timestamp } from "firebase/firestore";

export interface Tarefa {
  observacao: string;
  id: string;
  tarefa: string;
  userUid: string;
  created?: Timestamp;
}
export interface User {
  id: string;
  uid: string;
  email: string;
}
