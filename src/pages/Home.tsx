import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Template } from "../components/Template";
import {
  activeUserState,
  isChooseUserModalOpenState,
  usersState,
} from "../utils/globalState";
import { getAllUsers } from "../utils/storage";
import { useEffect, useState } from "react";
import { AddUser, HomeScreen } from "../components/screens";
import { ChooseUserModal } from "../components/modals";

export function Home() {
  const user = useAtomValue(activeUserState);
  const setIsChoosingUser = useSetAtom(isChooseUserModalOpenState);
  const [users, setUsers] = useAtom<{ id: string; name: string }[]>(usersState);

  useEffect(() => {
    const fetchUsers = async () => {
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    };
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!user) {
      setIsChoosingUser(true);
    }
  }, [user, setIsChoosingUser]);

  if (!users || users.length === 0) {
    return (
      <Template>
        <AddUser />
      </Template>
    );
  }

  return (
    <Template>
      <ChooseUserModal />
      <HomeScreen />
    </Template>
  );
}
