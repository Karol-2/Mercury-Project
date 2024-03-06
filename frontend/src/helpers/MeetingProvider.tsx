import { createContext, useContext, useState } from "react";
import Meeting from "../models/Meeting";
import { useUser } from "./UserContext";

export interface MeetingContextValue {
  meeting: Meeting | null;
  createMeeting: () => Promise<string | void>;
  leaveMeeting: () => Promise<void>;
  joinMeeting: (friendId: string) => Promise<string | void>;
}

const MeetingContext = createContext<MeetingContextValue | null>(null);

function useMeeting() {
  const context = useContext(MeetingContext);
  if (!context) {
    throw new Error("useMeeting must be used within a UserProvider");
  }

  return context;
}

function MeetingProvider({ children }: { children: React.ReactNode }) {
  const { socket } = useUser();
  const [meeting, setMeeting] = useState<Meeting | null>(null);

  const createMeeting = async () => {
    if (!socket) return;

    const waitForMeeting = new Promise<string>((resolve) => {
      socket.once("createdMeeting", (meeting) => {
        const meetingId = (meeting?.id || "") as string;
        return resolve(meetingId);
      });
    });

    socket.emit("createMeeting");

    const meetingId = await waitForMeeting;
    setMeeting({ id: meetingId, state: "created" });
    return meetingId;
  };

  const joinMeeting = async (friendId: string) => {
    if (!socket) return;

    const waitForMeeting = new Promise<string>((resolve) => {
      socket.once("joinedMeeting", (meeting) => {
        const meetingId = (meeting?.id || "") as string;
        return resolve(meetingId);
      });
    });

    socket.emit("joinMeeting", [friendId]);

    const meetingId = await waitForMeeting;
    setMeeting({ id: meetingId, state: "joined" });
    return meetingId;
  };

  const leaveMeeting = async () => {
    if (!socket) return;

    const waitForLeaveMeeting = new Promise<void>((resolve) => {
      socket.once("leftMeeting", () => {
        return resolve();
      });
    });

    socket.emit("leaveMeeting");

    await waitForLeaveMeeting;
    setMeeting(null);
  };

  return (
    <MeetingContext.Provider
      value={{
        meeting,
        createMeeting,
        joinMeeting,
        leaveMeeting
      }}
    >
      {children}
    </MeetingContext.Provider>
  );
}

export { useMeeting };
export default MeetingProvider;
