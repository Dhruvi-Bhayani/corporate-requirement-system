function UserList({ users }) {
  return (
    <ul>
      {users.map((u) => (
        <li key={u.id}>{u.full_name || u.email}</li>
      ))}
    </ul>
  );
}

export default UserList;
