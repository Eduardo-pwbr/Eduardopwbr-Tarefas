import { useState, useEffect } from "react";
import { auth } from "../firebaseConnection";
import { onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router-dom";

export default function Private({ children }) {

  const [loading, setLoaging] = useState(true);//Começa Carregando usuário que estão cadastrodo ou nõa;
  const [singned, setsingned] = useState(false); //Começa como false para saber se usuário está logado ou não;

  useEffect(() => {
   
      const unsub = onAuthStateChanged(auth, (user) => {
        
        //se tem usuario logado
        if (user) {
          //criando uma objeto
          const userData = {
            uid: user.uid,
            email:user.email,
          }
          localStorage.setItem("@detailUser", JSON.stringify(userData))
          setLoaging(false)
          setsingned(true)
        }
        else {
          // nâo tem usuário logado 
          setLoaging(false)
          setsingned(false)
        }
      })

        
    
 return () => unsub();
    
  },[])

  if (loading) {
    return (
      <div></div>
    )
  }

  if (!singned) {
   return <Navigate to="/"/>
  }

  //console.log("Passou aqui")
  return children;
  
}