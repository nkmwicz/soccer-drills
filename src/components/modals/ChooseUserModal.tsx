import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Card } from "../Card";
import { H1 } from "../elements";
import { Dropdown } from "../elements/Dropdown";
import {
  activeUserState,
  isAddingUserState,
  isChooseUserModalOpenState,
  usersState,
} from "../../utils/globalState";
import { useState } from "react";
import { Modal } from "./Modal";
import { Button } from "../buttons";

export function ChooseUserModal() {
  const [isOpen, setIsOpen] = useAtom(isChooseUserModalOpenState);
  const users = useAtomValue(usersState);
  const names = users.map((user: { id: string; name: string }) => user.name);
  const [chosenName, setChosenName] = useState<string>(names[0] || "");
  const [user, setUser] = useAtom(activeUserState);
  const setIsAddingUser = useSetAtom(isAddingUserState);

  const handleSelect = (name: string) => {
    setChosenName(name);
    const chosenUser = users.find(
      (user: { id: string; name: string }) => user.name === name
    );
    if (!chosenUser || chosenUser.id === user.id) {
      console.log("No change in user selection");
      setIsOpen(false);
      return;
    }
    setUser(chosenUser);
    setIsOpen(false);
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Card className="opacity-100 gap-2">
        <H1>Choose User</H1>
        <Dropdown options={names} value={chosenName} onSelect={handleSelect} />
        <Button title="Add New User" onClick={() => setIsAddingUser(true)} />
      </Card>
    </Modal>
  );
}
