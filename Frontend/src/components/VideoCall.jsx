import * as React from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

// Function to generate a random ID
function randomID(len = 5) {
  let result = "";
  const chars = "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP";
  const maxPos = chars.length;
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

// Function to get URL parameters
export function getUrlParams(url = window.location.href) {
  const urlStr = url.split("?")[1];
  return new URLSearchParams(urlStr);
}

export default function VideoCall() {
  const roomID = getUrlParams().get("roomID") || randomID(5);

  const myMeeting = async (element) => {
    if (!element) return;

    // ZegoCloud credentials
    const appID = 42129068;
    const serverSecret = "63aaa5d4225aff1bb35ec9e92c20a0c8";

    // Generate a unique user ID and name
    const userID = randomID(8);
    const userName = "User-" + userID;

    // Generate Kit Token
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID,
      userID,
      userName
    );

    // Create instance object from Kit Token
    const zp = ZegoUIKitPrebuilt.create(kitToken);

    // Construct the correct link dynamically
    const meetingURL = `${window.location.protocol}//${window.location.hostname}:${window.location.port}${window.location.pathname}?roomID=${roomID}`;

    // Start the call
    try {
      zp.joinRoom({
        container: element,
        sharedLinks: [
          {
            name: "Personal link",
            url: meetingURL,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.GroupCall, // Use OneONoneCall for 1-on-1 calls
        },
      });
    } catch (error) {
      console.error("Failed to join the room:", error);
    }
  };

  return <div className="myCallContainer" ref={myMeeting} style={{ width: "100vw", height: "100vh" }}></div>;
}