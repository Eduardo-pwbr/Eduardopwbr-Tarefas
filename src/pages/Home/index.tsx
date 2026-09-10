import "./home.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../../firebaseConnection";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "../../types/home";



export default function Home() {
  const [email, setEmail] = useState<LoginForm["email"]>("");
  const [password, setPassword] = useState<LoginForm["password"]>("");
  const navigate = useNavigate();

  async function handleLogin(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    if (email !== "" && password !== "") {
      await signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          alert("Bem-vindo de volta!");
          navigate("/admin", { replace: true });
        })
        .catch((error) => {
          if (error.code === "auth/user-not-found") {
            alert("Usuário não encontrado");
          } else {
            alert("Erro ao fazer login");
          }
          if (error.code === "auth/email-already-in-use") {
            alert("Este e-mail já está cadastrado.");
          }
        });
    } else {
      alert("Preencha todos os campos");
    }
  }

  return (
    <div className="home-container">
      <h1>Lista de Tarefas</h1>
      <span>Gerencie suas tarefas de forma eficiente</span>
      <form action="form" className="form" onSubmit={handleLogin}>
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

        <button type="submit">Acessar</button>
      </form>
      <Link className="form-link" to="/register">
        Não possui uma conta? Cadastre-se
      </Link>
    </div>
  );
}
