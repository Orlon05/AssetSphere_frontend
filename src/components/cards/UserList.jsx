import React from 'react';
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

export default UserList;