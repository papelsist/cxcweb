import firebase from 'firebase/app';

export interface Autorizacion {
  fecha: firebase.firestore.Timestamp;
  createUser: string;
  uid: string;
  comentario?: string;
  replicado?: firebase.firestore.Timestamp;
}
