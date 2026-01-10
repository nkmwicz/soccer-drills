import { useAtomValue, useSetAtom } from "jotai";
import { Button } from "../buttons";
import {
  activeUserState,
  isChooseUserModalOpenState,
} from "../../utils/globalState";
import { useLocation, useNavigate } from "react-router";
import { H1 } from "../elements";

export function Nav() {
  const location = useLocation();
  const setIsChaooseUserModalOpen = useSetAtom(isChooseUserModalOpenState);
  const activeUser = useAtomValue(activeUserState);
  const navigate = useNavigate();

  const handleWorkoutsClick = () => {
    navigate("/drills");
  };
  return (
    <div className="flex flex-row justify-between w-full gap-2 bg-primary p-4 text-Secondary z-10 relative">
      {activeUser.name ? (
        <H1>{activeUser.name}'s Drills</H1>
      ) : (
        <H1>Choose User</H1>
      )}
      <div className="flex flex-row gap-4">
        {location.pathname === "/" ? (
          <>
            <Button title="Drills" onClick={handleWorkoutsClick} />
            <Button
              title={"Change User"}
              onClick={() => setIsChaooseUserModalOpen(true)}
            />
          </>
        ) : (
          <Button title="Home" onClick={() => navigate("/")} />
        )}
      </div>
    </div>
  );
}
