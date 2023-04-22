import { doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react'
import { fireDb } from '../firebase/firebaseConfig';
import Modal from 'react-modal';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        background: 'black'
    },
};
function Update({ item }) {
    const [edit, setEdit] = useState(item.todo)
    const updateTodo = async () => {
        try {
            const todoDocument = doc(fireDb, "todo", item.id);
            await updateDoc(todoDocument, {
                todo: edit
            });
            closeModal()
        } catch (err) {
            console.log(err);
        }
    }



    const [modalIsOpen, setIsOpen] = useState(false);

    function openModal() {
        setIsOpen(true);
    }
    function closeModal() {
        setIsOpen(false);
    }
    return (
        <div>
            <button onClick={openModal} className="font-medium bg-green-600 text-white p-1 rounded-full px-4 mx-2 ">
                Update
            </button>


            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            // className="bg-black"
            >
                <h1 className='text-white text-center mb-5 underline text-2xl font-semibold'>Update Todo</h1>
                <input className=' bg-gray-100 mb-4 px-4 text-black outline-0 py-2 w-full placeholder-black' value={edit} onChange={(e) => setEdit(e.target.value)} type="text" placeholder='Enter description' />
                <button onClick={() => updateTodo()} className="font-medium bg-green-600 text-white p-1 rounded-full px-4 ">
                    Update
                </button>
                <button onClick={() => closeModal()} className="font-medium bg-red-600 text-white p-1 rounded-full px-4 mx-2 ">
                    Close
                </button>
            </Modal>
        </div>
    )
}

export default Update