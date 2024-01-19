import React, { useState, useEffect } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { listKids } from "../graphql/queries";
import { updateKid } from "../graphql/mutations";
import "./Home.css";

const ProfileCard = ({ kid, onCheckInClick }) => {
  const getInitials = (name) => {
    const initials = name
      .split(" ")
      .map((word) => word[0])
      .join("");
    return initials.toUpperCase();
  };

  return (
    <div className="profile-card">
      {kid.photo ? (
        <img src={kid.photo} alt={kid.name} />
      ) : (
        <div className="initials-circle">{getInitials(kid.name)}</div>
      )}
      <p className="kid-name">{kid.name}</p>
      <p>{kid.checkedIn ? "Checked In" : "Not Checked In"}</p>
      {kid.checkedIn ? (
        <div className="check-mark">&#10004;</div>
      ) : (
        <button className="check-in-button" onClick={() => onCheckInClick(kid)}>
          Check In
        </button>
      )}
    </div>
  );
};
const Home = () => {
  const [kids, setKids] = useState([]);
  const [selectedKid, setSelectedKid] = useState(null);

  useEffect(() => {
    const fetchKids = async () => {
      try {
        const result = await API.graphql(graphqlOperation(listKids));
        setKids(result.data.listKids.items);
      } catch (error) {
        console.error("Error fetching kids:", error);
      }
    };

    const resetCheckIn = async () => {
      try {
        // Iterate through kids and reset check-in status
        for (const kid of kids) {
          if (kid.checkedIn) {
            const updateResult = await API.graphql(
              graphqlOperation(updateKid, {
                input: {
                  id: kid.id,
                  checkedIn: false,
                  lastCheckIn: null, // Optional: You can set lastCheckIn to null or a specific value
                },
              })
            );

            console.log("Kid check-in reset:", updateResult);
          }
        }

        // Fetch updated kids after resetting check-in status
        fetchKids();
      } catch (error) {
        console.error("Error resetting check-in:", error);
      }
    };

    fetchKids();

    // Set up a timer to reset check-in every day at midnight
    const resetCheckInTimer = setInterval(() => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);

      const timeUntilMidnight = midnight - now;

      setTimeout(() => {
        resetCheckIn();
      }, timeUntilMidnight);
    }, 86400000); // 86400000 milliseconds = 24 hours

    // Clean up the timer when the component is unmounted
    return () => clearInterval(resetCheckInTimer);
  }, [kids]);

  const openConfirmationModal = (kid) => {
    setSelectedKid(kid);
  };

  const closeConfirmationModal = () => {
    setSelectedKid(null);
  };

  const confirmCheckIn = async () => {
    if (selectedKid) {
      try {
        const currentDate = new Date().toISOString();

        const updateResult = await API.graphql(
          graphqlOperation(updateKid, {
            input: {
              id: selectedKid.id,
              checkedIn: true,
              lastCheckIn: currentDate,
            },
          })
        );

        console.log("Kid checked in:", updateResult);

        // Update the local state to reflect the change
        setKids((prevKids) =>
          prevKids.map((kid) =>
            kid.id === selectedKid.id
              ? { ...kid, checkedIn: true, lastCheckIn: currentDate }
              : kid
          )
        );

        // Close the confirmation modal
        closeConfirmationModal();
      } catch (error) {
        console.error("Error checking in kid:", error);
      }
    }
  };

  const checkInKid = (kidId, kidName) => {
    // Ask for confirmation before checking in
    openConfirmationModal({ id: kidId, name: kidName });
  };

  return (
    <div>
      <h2>Kids Check-In</h2>
      <div className="profile-cards">
        {kids.map((kid) => (
          <ProfileCard
            key={kid.id}
            kid={kid}
            onCheckInClick={openConfirmationModal}
          />
        ))}
      </div>
      {selectedKid && selectedKid.id && (
        <div className="confirmation-modal">
          <p>Are you sure you want to check in {selectedKid.name}?</p>
          <button onClick={confirmCheckIn}>Yes</button>
          <button onClick={closeConfirmationModal}>No</button>
        </div>
      )}
    </div>
  );
};

export default Home;
