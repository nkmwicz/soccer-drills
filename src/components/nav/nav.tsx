import { useAtomValue, useSetAtom } from "jotai";
import { Button } from "../buttons";
import {
  activeUserState,
  isChooseUserModalOpenState,
} from "../../utils/globalState";
import { useLocation } from "react-router";
import { H1 } from "../elements";

export function Nav() {
  const location = useLocation();
  const handleWorkoutsClick = () => console.log("Workouts clicked");
  const setIsChaooseUserModalOpen = useSetAtom(isChooseUserModalOpenState);
  const activeUser = useAtomValue(activeUserState);
  return (
    <div className="flex flex-row justify-between w-full gap-2 bg-primary p-4 text-white">
      {activeUser.name ? (
        <H1>{activeUser.name}'s Drills</H1>
      ) : (
        <H1>Choose User</H1>
      )}
      <div className="flex flex-row gap-4">
        <Button title="Workouts" onClick={handleWorkoutsClick} />
        {location.pathname === "/" && (
          <Button
            title={"Change User"}
            onClick={() => setIsChaooseUserModalOpen(true)}
          />
        )}
      </div>
    </div>
  );
}
