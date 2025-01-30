import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { FaEllipsisV } from 'react-icons/fa';
import { MdEdit, MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import styles from './userListItem.module.css';

const UserListItem = ({ user }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef(null);
  const modalRef = useRef(null);
  const navigate = useNavigate(); // Usamos el hook useNavigate

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
        navigate('/editar-usuarios');
    };
    const handleDelete = () => {
        alert(`Eliminar usuario: ${user.name}`);
        closeModal();
    };

    return (
      <li className={styles["list-item"]}>
          <div>
              <img
                  src={
                      user.avatar ||
                      `https://api.dicebear.com/9.x/avataaars-neutral/svg?seed=${user.name}`
                  }
                  alt="Avatar"
                  className={styles["list-item-image"]}
              />
          </div>
          <div className={styles["list-item-content"]}>
              <h4>{user.name}</h4>
              <p>{user.username}</p>
          </div>
          <button
              className={styles["menu-button"]}
              onClick={openModal}
              ref={buttonRef}
          >
              <FaEllipsisV />
          </button>
          <Modal
              ref={modalRef}
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              className={styles["modal-content"]}
              overlayClassName={styles["modal-overlay"]}
              style={{
                  content: {
                      position: "absolute",
                      top: modalPosition.y,
                      left: modalPosition.x,
                      right: "auto",
                      bottom: "auto",
                      transform: "none",
                  },
              }}
          >
              <button onClick={handleEdit} className={styles["modal-button-edit"]}>
                  <MdEdit /> Editar
              </button>
              <button
                  onClick={handleDelete}
                  className={styles["modal-button-delete"]}
              >
                  <MdDelete /> Eliminar
              </button>
          </Modal>
      </li>
    );
};

UserListItem.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    avatar: PropTypes.string,
  }).isRequired,
};

export default UserListItem;