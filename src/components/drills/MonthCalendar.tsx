import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { activeUserState } from "../../utils/globalState";

interface DrillSession {
  id: string;
  userId: string;
  drillId: string;
  dates: Date[];
}

export function MonthCalendar({
  drillSessions,
}: {
  drillSessions: DrillSession[];
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getDrillCountForDate = (date: Date) => {
    let count = 0;
    const dateStr = date.toDateString();

    drillSessions.forEach((session) => {
      session.dates.forEach((drillDate) => {
        const sessionDate = new Date(drillDate);
        if (sessionDate.toDateString() === dateStr) {
          count++;
        }
      });
    });

    return count;
  };

  const getDrillsForDate = (date: Date) => {
    const dateStr = date.toDateString();
    const drills: { drillId: string; count: number }[] = [];

    drillSessions.forEach((session) => {
      let sessionCount = 0;
      session.dates.forEach((drillDate) => {
        const sessionDate = new Date(drillDate);
        if (sessionDate.toDateString() === dateStr) {
          sessionCount++;
        }
      });
      if (sessionCount > 0) {
        drills.push({ drillId: session.drillId, count: sessionCount });
      }
    });

    return drills;
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek, year, month } =
      getDaysInMonth(currentDate);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const drillCount = getDrillCountForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected =
        selectedDate && date.toDateString() === selectedDate.toDateString();

      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`p-2 border border-gray-300 min-h-16 cursor-pointer hover:bg-accent transition-colors ${
            isToday ? "bg-primary/20" : ""
          } ${isSelected ? "ring-2 ring-primary" : ""}`}
        >
          <div className="font-semibold text-sm">{day}</div>
          {drillCount > 0 && (
            <div className="text-xs mt-1 bg-secondary text-white rounded px-1 inline-block">
              {drillCount} drill{drillCount > 1 ? "s" : ""}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const selectedDateDrills = selectedDate ? getDrillsForDate(selectedDate) : [];

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Month Navigation */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={goToPreviousMonth}
          className="px-4 py-2 bg-secondary text-white rounded hover:opacity-80"
        >
          ← Previous
        </button>
        <h2 className="text-2xl font-bold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button
          onClick={goToNextMonth}
          className="px-4 py-2 bg-secondary text-white rounded hover:opacity-80"
        >
          Next →
        </button>
      </div>

      {/* Day Labels */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center font-semibold text-sm p-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 bg-white rounded-lg shadow">
        {renderCalendar()}
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow">
          <h3 className="font-bold text-lg mb-2">
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h3>
          {selectedDateDrills.length > 0 ? (
            <div>
              <p className="text-sm text-gray-600 mb-2">Drills completed:</p>
              <ul className="list-disc list-inside">
                {selectedDateDrills.map((drill) => (
                  <li key={drill.drillId}>
                    Drill #{drill.drillId} - {drill.count} session
                    {drill.count > 1 ? "s" : ""}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-gray-500">No drills recorded on this day.</p>
          )}
        </div>
      )}
    </div>
  );
}
