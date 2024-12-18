import React, { useState, useRef } from 'react';
import styles from './userListItem.module.css';
import Modal from 'react-modal';
import { MdEdit, MdDelete } from 'react-icons/md';
import { FaEllipsisV } from 'react-icons/fa';

// Asegúrate de que Modal tenga el selector de aplicación
Modal.setAppElement('#root');

const UserListItem = ({ user }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef(null);
  const modalRef = useRef(null);

  if (!user) {
    return <div>No se proporcionó información del usuario.</div>;
  }

  const openModal = () => {
    if (buttonRef.current && modalRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
  
      setModalPosition({
        x: buttonRect.left - buttonRect.width - 80, 
        y: buttonRect.top - 30, 
      });
    }
    setModalIsOpen(true);
  };
  

  const closeModal = () => setModalIsOpen(false);
  const handleEdit = () => {
    alert(`Editar usuario: ${user.name}`);
    closeModal();
  };
  const handleDelete = () => {
    alert(`Eliminar usuario: ${user.name}`);
    closeModal();
  };

  return (
    <li className={styles['list-item']}>
      <div>
        <img
          src={user.avatar || "https://s3-us-west-2.amazonaws.com/s.cdpn.io/488320/profile/profile-80.jpg"}
          alt="Avatar"
          className={styles['list-item-image']}
        />
      </div>
      <div className={styles['list-item-content']}>
        <h4>{user.name}</h4>
        <p>{user.username}</p>
      </div>
      <button className={styles['menu-button']} onClick={openModal} ref={buttonRef}>
        <FaEllipsisV />
      </button>
      <Modal
        ref={modalRef}
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className={styles['modal-content']}
        overlayClassName={styles['modal-overlay']}
        style={{
          content: {
            position: 'absolute',
            top: modalPosition.y,
            left: modalPosition.x,
            right: 'auto',
            bottom: 'auto',
            transform: 'none',
          },
        }}
      >
        <button onClick={handleEdit} className={styles['modal-button-edit']}>
          <MdEdit /> Editar
        </button>
        <button onClick={handleDelete} className={styles['modal-button-delete']}>
          <MdDelete /> Eliminar
        </button>
      </Modal>
    </li>
  );
}

export default UserListItem;