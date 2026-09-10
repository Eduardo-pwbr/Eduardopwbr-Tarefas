import { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../../firebaseConnection";
import { createUserWithEmailAndPassword } from "firebase/auth";
//import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { RegisterForm } from "../../types/register";


export default function Register() {
  const [email, setEmail] = useState<RegisterForm["email"]>("");
  const [password, setPassword] = useState<RegisterForm["password"]>("");
  const navigate = useNavigate();

  async function handleRegister(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    if (email !== "" && password !== "") {
      await createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          //console.log("Email está correto")
          navigate("/admin", { replace: true });
    
        })
        .catch((error) => {
          if (error.code === "auth/user-not-found") {
            alert("Usuário não encontrado");
          }
          if (error.code === "auth/email-already-in-use") {
            alert("Usuário já Cadastrado")
          }
          else {
            alert("Cadastre outro usuário")
          }
    
        });
    } else {
      alert("Preencha todos os campos");
    }
  }

  return (
    <div className="home-container">
      <h1>Cadastra-se</h1>
      <span>Vamos criar sua conta!</span>
      <form action="form" className="form" onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Digite seu email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Digite sua senha..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Cadastrar</button>
      </form>
      <Link className="form-link" to="/">
        Já possui uma conta? Faça login!
      </Link>
    </div>
  );
}
