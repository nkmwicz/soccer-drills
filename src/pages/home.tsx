import { useAtomValue } from "jotai";
import { Template } from "../components/template";
import { userNameState } from "../utils/globalState";
import { getAllUsers } from "../utils/storage";
import { useEffect, useState } from "react";

export function Home() {
  const user = useAtomValue(userNameState);
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    };
    fetchUsers();
  }, []);

  if (!users || users.length === 0) {
    return (
      <Template>
        <div>Add button to add a user</div>
      </Template>
    );
  }

  if (!user.name) {
    console.log(allUsers);
    return (
      <Template>
        <div>Choose a name</div>
      </Template>
    );
  }

  return (
    <Template>
      <div>Home</div>
    </Template>
  );
}
