export type User = {
  id: string;
  username: string;
  email: string;
  password: string;
};

export type UserTableProps = {
  users: User[];
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  title?: string;
};
