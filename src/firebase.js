import Firebase from 'firebase'

const firebaseApp = Firebase.initializeApp({
  apiKey: "AIzaSyAvcmkLgkRstSZpdzoJYy4d1yQtYy9oUJA",
  authDomain: "password-manager-d7257.firebaseapp.com",
  databaseURL: "https://password-manager-d7257.firebaseio.com",
  projectId: "password-manager-d7257",
  storageBucket: "password-manager-d7257.appspot.com",
  messagingSenderId: "421526386940"
})

// Export the database for components to use.
// If you want to get fancy, use mixins or provide / inject to avoid redundant imports.
export const db = firebaseApp.database()