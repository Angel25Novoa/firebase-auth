import React, {useState} from 'react'
import Home from './screens/Home'
import Login from './screens/Login'
import firebaseApp from './firebase/firebaseConfig'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, doc, getDoc } from 'firebase/firestore'

const auth = getAuth(firebaseApp)
const firestore = getFirestore(firebaseApp)

const App = () => {
  const [user, setUser] = useState(null)

  const getRol = async(uid) => {
    const docuRef = doc(firestore, `usuarios/${uid}`)
    const docCifrada = await getDoc(docuRef)
    const info = docCifrada.data().rol
    return info
  }

  const setUserWithRol = (userFirebase) => {
    getRol(userFirebase.uid).then((rol) => {
      const userData = {
        uid: userFirebase.uid,
        email: userFirebase.email,
        rol: rol
      }
      setUser(userData)
    })
  }

  onAuthStateChanged(auth, (userFirebase) => {
    if(userFirebase){
      if(!user){
        setUserWithRol(userFirebase)
      }
    } else {
      setUser(null)
    }
  })

  return (
    <>
      {user ? <Home user={user} /> : <Login />}
    </>
  )
}

export default App
