import { useEffect, useState } from "react";
import { getAllDrills, getAllUsers } from "../../utils/storage";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  activeUserState,
  isChooseUserModalOpenState,
  userDrillState,
  usersState,
} from "../../utils/globalState";
import { MonthCalendar } from "../drills/MonthCalendar";

export function HomeScreen() {
  const isChoosingUser = useAtomValue(isChooseUserModalOpenState);
  const user = useAtomValue(activeUserState);
  const setAllUsers = useSetAtom(usersState);
  const setDrills = useSetAtom(userDrillState);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersResponse = await getAllUsers();
      setAllUsers(usersResponse);
    };
    if (isChoosingUser) {
      fetchUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChoosingUser]);

  useEffect(() => {
    const fetchDrills = async () => {
      const userDrills = await getAllDrills(user.id);
      setDrills(userDrills);
    };
    if (user.id) {
      fetchDrills();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div>
      Past Drills
      <MonthCalendar />
    </div>
  );
}
