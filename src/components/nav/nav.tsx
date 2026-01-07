import { Button } from "../buttons";

export function Nav() {
  const handleWorkoutsClick = () => console.log("Workouts clicked");
  return (
    <div className="flex flex-row justify-between w-full gap-2 bg-blue-400 p-4 text-white">
      <div>Title</div>
      <div className="flex flex-row gap-4">
        <Button title="Workouts" onClick={handleWorkoutsClick} />
        <Button title="Other" onClick={handleWorkoutsClick} />
      </div>
    </div>
  );
}
