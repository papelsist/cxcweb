import firebase from 'firebase/app';

export interface Autorizacion {
  fecha: firebase.firestore.Timestamp | string; // Compatibility fix soon
  createUser?: string;
  uid?: string;
  comentario?: string;
  replicado?: firebase.firestore.Timestamp;
  usuario?: string; // compatibility FIX soon
}
