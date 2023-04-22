import { useEffect, useState } from 'react'
import { fireDb } from './firebase/firebaseConfig'
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import Update from './components/Update';

function App() {
  const [createTodo, setCreateTodo] = useState("");
  const [todos, setTodos] = useState([]);

  // firebase Ref
  const createTodoRef = collection(fireDb, 'todo')

  //Add Todo Handler
  const submitTodo = async (e) => {
    e.preventDefault();
    try {
      await addDoc(createTodoRef, {
        todo: createTodo,
        timestamp: serverTimestamp()
      })
      console.log('added')
      // getTodo()
    } catch (err) {
      console.log(err);
    }
    setCreateTodo("")
  }

  // get todo list
  const getTodo = async () => {
    try {
      const q = query(
        collection(fireDb, "todo"),
        orderBy("timestamp"),
      );
      const data = onSnapshot(q, (QuerySnapshot) => {
        let toArray = [];
        QuerySnapshot.forEach((doc) => {
          toArray.push({ ...doc.data(), id: doc.id });
        });
        setTodos(toArray)
      });
      return () => data;
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getTodo()
  }, [])

  //Delete Handler
  const deleteTodo = async (id) => {
    try {

      if (window.confirm("Are you sure you want to delete this Task!")) {
        const documentRef = doc(fireDb, "todo", id);
        await deleteDoc(documentRef)
      }

    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <div className=" bg-gray-800 p-10 rounded-xl">
        <div className="input flex mb-5">
          <input className=' bg-gray-700 px-4 text-white outline-0 py-2 w-full placeholder-white' value={createTodo} onChange={(e) => setCreateTodo(e.target.value)} type="text" placeholder='Enter description' />
          <button className=' bg-green-600 px-4 py-2 text-white' onClick={submitTodo}>Add</button>
        </div>
        <div className="">
          {todos.map((item, index) => {
            return (
              <div key={index} className=''>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                  <table className="w-full text-sm text-left text-gray-500 ">
                    <tbody>
                      <tr className="border">
                        <th scope="row" className="px-2 py-4 font-medium text-gray-100 ">
                          {item.todo}
                        </th>
                        <td className="px-6 py-4 flex justify-end">
                          <button className="font-medium bg-red-600 text-white p-1 rounded-full px-4" onClick={() => deleteTodo(item.id)}
                          >Delete</button>
                          <Update item={item} />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}


export default App


