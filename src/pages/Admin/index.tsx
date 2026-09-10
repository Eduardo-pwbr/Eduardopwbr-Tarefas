import { useEffect, useState } from "react";


import "./admin.css";
import { auth, db } from "../../firebaseConnection";
import { signOut } from "firebase/auth";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
  serverTimestamp,
  deleteDoc,
  doc,
  updateDoc,
  
} from "firebase/firestore";

import { Tarefa, User } from "../../types/tarefa";


export default function Admin() {
  const [tarefainput, setTarefaInput] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [edit, setEdit] = useState<Tarefa | null>(null);
 // const [edit, setEdit] = useState({});

  useEffect(() => {
    async function loadTarefas() {
      const userDatail = localStorage.getItem("@detailUser");
      
      //setUser(JSON.parse(userDatail));

      if (userDatail) {
        const data = JSON.parse(userDatail);
        setUser(data);

        const tarefaRef = collection(db, "tarefas");
        const q = query(
          tarefaRef,
          orderBy("created", "desc"),
          where("userUid", "==", data?.uid),
        );

        const unsub = onSnapshot(q, (snapshot) => {
          let lista : any[] = [];

          snapshot.forEach((doc) => {
            lista.push({
              id: doc.id,
              tarefa: doc.data().tarefa,
              userUid: doc.data().userUid,
              ...doc.data(),
            });
          });
          console.log(lista);
          setTarefas(lista);
        });
        return () => unsub();
      }
    }

    loadTarefas();
  }, []);

  async function handleRegistrar(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    if (tarefainput === "") {
      alert("Digite sua Tarefa");
      return;
    }
    ///Criando tarefas
    if (edit?.id) {
      UpdateTarefa();
      return;
    }

    await addDoc(collection(db, "tarefas"), {
      tarefa: tarefainput, 
      created: serverTimestamp(),
      userUid: user?.uid,
    })
      .then(() => {
        console.log("cadastrado");

        setTarefaInput("");
      })
      .catch((error) => {
        console.log("Não conseguimos cadastrado" + error);
      });
  }

  async function handleLogout() {
    await signOut(auth);
  }

  async function deleteTarefa(id:string) {

    const docref = doc(db, "tarefas", id)
    await deleteDoc(docref)
    
  }
  async function editarTarefa(item:Tarefa) {


    setTarefaInput(item.tarefa)  ///adicona o item dentro textbox
    setEdit(item) //passando item.tarefa para minha useState


    
  }
  async function UpdateTarefa() {

    if(!edit?.id) {
      return;
    }
   
    const docref = doc(db, "tarefas", edit?.id)
    await updateDoc(docref, {
      tarefa:tarefainput
    })
      .then(() => {
        console.log("Tarefa atualizada")
        setTarefaInput("")
        setEdit(null)
      })
      .catch(() => {
        console.log("Erro ao atualizar")
        setTarefaInput("")
        setEdit(null)
    })
  }
    
  

  return (
    <div className="admin-container">
      <h1>Minhas Tarefas</h1>

      <form className="form" onSubmit={handleRegistrar}>
        <textarea
          placeholder="Digite sua Tarefa..."
          value={tarefainput}
          onChange={(e) => setTarefaInput(e.target.value)}
        ></textarea>

        {/* 
{Object.keys(edit).length > 0 ? (
  <button className="btn-register" type="submit">
    Atualizar
  </button>
) : (
  <button className="btn-register" type="submit">
    Registrar Tarefa
  </button>
)}
*/}

        {edit ? (
          <button className="btn-register" type="submit">
            Atualizar
          </button>
        ) : (
          <button className="btn-register" type="submit">
            Registrar Tarefa
          </button>
        )}
      </form>
      {tarefas.map((item) => (
        <article className="list" key={item.id}>
          <p>
            {item.created
              ? `Criada em: ${item.created.toDate().toLocaleDateString("pt-BR")} às ${item.created.toDate().toLocaleTimeString("pt-BR")}`
              : "Salvando data..."}
          </p>

          <br></br>
          <p>{item.tarefa}</p>
          <br></br>

          <div>
            <button onClick={() => editarTarefa(item)}>Editar</button>
            <button
              className="btn-delete"
              onClick={() => deleteTarefa(item.id)}
            >
              Concluir
            </button>
          </div>
        </article>
      ))}
      <button className="btn-logout" onClick={handleLogout}>
        Sair
      </button>
    </div>
  );
}
