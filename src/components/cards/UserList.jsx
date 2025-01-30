import PropTypes from 'prop-types';
import UserListItem from './UserListItem';
import styles from './userList.module.css';

const UserList = ({ users }) => {
  if (!users || users.length === 0) {
    return <div>No hay usuarios para mostrar.</div>;
  }
  return (
    <div className={styles['list-wrapper']}>
      <ul className={styles['list']}>
        {/* Iteración sobre los usuarios */}
        {users.map((user) => (
          <UserListItem key={user.id} user={user} />
        ))}
      </ul>
    </div>
  );
};

UserList.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      // Agrega otras propiedades del usuario aquí si es necesario
    })
  ).isRequired,
};

export default UserList;