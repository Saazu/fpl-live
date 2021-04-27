import firebase from 'firebase/app';
import 'firebase/firestore';

const config = {
  apiKey: "AIzaSyBnKwZLXVt933ZY-OAjrLQKwCPVPof77qA",
  authDomain: "fantasy-gold.firebaseapp.com",
  databaseURL: "https://fantasy-gold.firebaseio.com",
  projectId: "fantasy-gold",
  storageBucket: "fantasy-gold.appspot.com",
  messagingSenderId: "255800072598",
  appId: "1:255800072598:web:d8ec7941c69ab4040aa5b7",
  measurementId: "G-CFYB7EFKCJ"
};

firebase.initializeApp(config);
window.firebase = firebase;
export const firestore = firebase.firestore();

export const createUserProfileDocument = async (user, additionalData) => {
  if (!user) {
    return;
  }
  const userRef = firestore.doc(`users/${user.uid}`)

  //go and fetch the document from the location
  const snapshot = await userRef.get();

  if (!snapshot.exists) {
    const createdAt = new Date();
    const numGamesPlayed = 0;
    const { email } = user;
    try {
      await userRef.set({
        email,
        createdAt,
        numGamesPlayed,
        ...additionalData
      })
    } catch (exception) {
      console.error('Error creating user', exception);
    }
  }
  return getuserDocument(user.uid);
}

export const getuserDocument = async (uid) => {
  if (!uid) return null;
  try {
    const userDoc = await firestore.collection(`users`).doc(uid).get();
    return { uid, ...userDoc.data() };
  } catch (exception) {
    console.error('Error fetching user', exception);
  }
}

export const getUserTeams = async (uid) => {
  if (!uid) return null;
  try {
    const teamDoc = await firestore.collection(`users`).doc(uid).collection('teams').get();
    return { uid, ...teamDoc };
  } catch (exception) {
    console.error('Error fetching user', exception);
  }
}

export default firebase;
