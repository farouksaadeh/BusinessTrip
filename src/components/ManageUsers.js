import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManageUsers.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({ firstName: '', lastName: '', email: '', password: '', role: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingUser) {
      setEditingUser({ ...editingUser, [name]: value });
    } else {
      setNewUser({ ...newUser, [name]: value });
    }
  };

  const handleAddUser = async () => {
    try {
      await axios.post('http://localhost:3001/users', newUser);
      setNewUser({ firstName: '', lastName: '', email: '', password: '', role: '' });
      fetchUsers();
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
  };

  const handleUpdateUser = async () => {
    try {
      await axios.put(`http://localhost:3001/users/${editingUser.id}`, editingUser);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const adminUsers = users.filter(user => user.role === 'admin');
  const normalUsers = users.filter(user => user.role !== 'admin');

  return (
    <div className="manage-users">
      <h2>Manage Users</h2>
      <div className="add-user">
        <h3>Add New User</h3>
        <input type="text" name="firstName" placeholder="First Name" value={newUser.firstName} onChange={handleInputChange} />
        <input type="text" name="lastName" placeholder="Last Name" value={newUser.lastName} onChange={handleInputChange} />
        <input type="email" name="email" placeholder="Email" value={newUser.email} onChange={handleInputChange} />
        <input type="password" name="password" placeholder="Password" value={newUser.password} onChange={handleInputChange} />
        <input type="text" name="role" placeholder="Role" value={newUser.role} onChange={handleInputChange} />
        <button onClick={handleAddUser}>Add User</button>
      </div>
      <div className="user-list">
        <h3>Admins</h3>
        {adminUsers.map(user => (
          <div key={user.id} className="user-item">
            <div className="user-details">
              <span>{user.firstName} {user.lastName} ({user.email})</span>
              <div className="user-actions">
                <button className="edit-button" onClick={() => handleEditUser(user)}>
                  <svg className="edit-svgIcon" viewBox="0 0 512 512">
                    <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                  </svg>
                </button>
                <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
              </div>
            </div>
            {editingUser && editingUser.id === user.id && (
              <div className="edit-user">
                <h3>Edit User</h3>
                <input type="text" name="firstName" placeholder="First Name" value={editingUser.firstName} onChange={handleInputChange} />
                <input type="text" name="lastName" placeholder="Last Name" value={editingUser.lastName} onChange={handleInputChange} />
                <input type="email" name="email" placeholder="Email" value={editingUser.email} onChange={handleInputChange} />
                <input type="password" name="password" placeholder="Password" value={editingUser.password} onChange={handleInputChange} />
                <input type="text" name="role" placeholder="Role" value={editingUser.role} onChange={handleInputChange} />
                <button onClick={handleUpdateUser}>Update User</button>
              </div>
            )}
          </div>
        ))}
        <h3>Users</h3>
        {normalUsers.map(user => (
          <div key={user.id} className="user-item">
            <div className="user-details">
              <span>{user.firstName} {user.lastName} ({user.email})</span>
              <div className="user-actions">
                <button className="edit-button" onClick={() => handleEditUser(user)}>
                  <svg className="edit-svgIcon" viewBox="0 0 512 512">
                    <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                  </svg>
                </button>
                <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
              </div>
            </div>
            {editingUser && editingUser.id === user.id && (
              <div className="edit-user">
                <h3>Edit User</h3>
                <input type="text" name="firstName" placeholder="First Name" value={editingUser.firstName} onChange={handleInputChange} />
                <input type="text" name="lastName" placeholder="Last Name" value={editingUser.lastName} onChange={handleInputChange} />
                <input type="email" name="email" placeholder="Email" value={editingUser.email} onChange={handleInputChange} />
                <input type="password" name="password" placeholder="Password" value={editingUser.password} onChange={handleInputChange} />
                <input type="text" name="role" placeholder="Role" value={editingUser.role} onChange={handleInputChange} />
                <button onClick={handleUpdateUser}>Update User</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageUsers;
