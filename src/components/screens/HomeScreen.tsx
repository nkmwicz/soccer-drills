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
import { H1 } from "../elements";
import { Button } from "../buttons";
import { useNavigate } from "react-router";

export function HomeScreen() {
  const isChoosingUser = useAtomValue(isChooseUserModalOpenState);
  const user = useAtomValue(activeUserState);
  const setAllUsers = useSetAtom(usersState);
  const [drills, setDrills] = useAtom(userDrillState);
  const navigate = useNavigate();

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

  if (drills.length === 0) {
    return (
      <div className="flex flex-col justify-center gap-2">
        <Button
          title="Go to Drills"
          onClick={() => {
            navigate("/drills");
          }}
        />
        <H1>No drills recorded yet.</H1>
      </div>
    );
  }

  return (
    <div>
      Past Drills
      <MonthCalendar drillSessions={drills} />
    </div>
  );
}
