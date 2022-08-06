import React, {useState} from 'react'
import firebaseApp from '../firebase/firebaseConfig'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { getFirestore, doc, setDoc } from 'firebase/firestore'

const auth = getAuth(firebaseApp)
const firestore = getFirestore(firebaseApp)

const Login = () => {
  const [registrando, setRegistrando] = useState(false)

  const registrarUsuario = async(email, password, rol) => {
    const infoUsuario = await createUserWithEmailAndPassword(auth, email, password)
    .then((usuarioFirebase) => {
      return usuarioFirebase
    })
    console.log(infoUsuario.user.uid)
    const docuRef = doc(firestore, `usuarios/${infoUsuario.user.uid}`);
    setDoc(docuRef, { correo: email, rol: rol });
  }

  const submitHandler = (e) => {
    e.preventDefault()
    const email = e.target.elements.email.value
    const password = e.target.elements.password.value
    const rol = e.target.elements.rol.value
    console.log(email, password, rol)
    if(registrando){
      //* Registro
      registrarUsuario(email, password, rol)
    } else {
      //* Login
      signInWithEmailAndPassword(auth, email, password)
    }
  }
  
  return (
    <>
      <h1>{ registrando ? "Registrate" : "Inicia Sesión"}</h1>
      <form onSubmit={submitHandler}>
        <label>Email</label>
        <input id='email' type="email" placeholder="Email" />
        <label>Contraseña</label>
        <input id='password' type="password" placeholder="Contraseña" />
        <label>Rol
          <select id='rol'>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </label>
        <input type="submit" 
          value={registrando ? "Registrarse" : "Iniciar Sesión"}
        />
      </form>
      <button onClick={() => setRegistrando(!registrando)}>
        {registrando ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}
      </button>
    </>
  )
}

export default Login