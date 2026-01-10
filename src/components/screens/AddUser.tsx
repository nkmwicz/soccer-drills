import { useEffect, useState } from "react";
import { Card } from "..";
import { H1 } from "../elements";
import { TextInput } from "../elements/TextInput";
import { Button } from "../buttons";
import { addUser, getAllUsers } from "../../utils/storage";
import { useAtom, useSetAtom } from "jotai";
import {
  activeUserState,
  isAddingUserState,
  usersState,
} from "../../utils/globalState";

export function AddUser() {
  const [name, setName] = useState("");
  const [user, setUser] = useAtom(activeUserState);
  const setUsers = useSetAtom(usersState);
  const setIsAddingUser = useSetAtom(isAddingUserState);

  const handleAddUser = async () => {
    const newUser = await addUser(name);
    const allUsers = await getAllUsers();
    setUsers(allUsers);
    const thisUser = allUsers.find((u) => u.id === newUser);
    setIsAddingUser(false);
    if (thisUser) {
      setUser(thisUser);
    } else {
      console.error("User not found after addition");
    }
  };

  useEffect(() => {
    console.log("User updated:", user);
  }, [user]);

  return (
    <div className="flex flex-col h-full w-full justify-center items-center">
      <Card>
        <div className="flex justify-center">
          <H1>Add User</H1>
        </div>
        <br />
        <TextInput
          label="Name"
          value={name}
          onChange={setName}
          placeholder="Enter name"
        />
        <Button title="Add User" onClick={handleAddUser} />
      </Card>
    </div>
  );
}
