import { useEffect, useState } from "react";
import { PostCard } from "./PostCard";
import { formatDistanceToNow } from "date-fns";
import { GiveLoveButtons } from "./GiveLoveButtons";

export const PostWall = () => {
  const [thoughts, setThoughts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likesPerClick, setLikesPerClick] = useState(1);

  // My own server
  const url = "https://arnaus-happy-thoughts-api.onrender.com/thoughts";

  //Technigo server
  //const url = "https://happy-thoughts-ux7hkzgmwa-uc.a.run.app/thoughts"

  useEffect(() => {
    fetchThoughts();
  }, []); //Only run once when the component mounts

  useEffect(() => {
    const interval = setInterval(fetchThoughts, 10000); // Fetch thoughts every 10 seconds
    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  const fetchThoughts = async () => {
    try {
      const res = await fetch(url);
      const data = await res.json();
      setThoughts(data);
      console.log(thoughts);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching thoughts:", error);
      setLoading(false);
    }
  };

  //This function will modify the timestamp using date-fns library imported at the top
  const calculateTimeDifference = (timestamp) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  return (
    <div className="App">
      <GiveLoveButtons setLikesPerClick={setLikesPerClick} />
      {loading ? ( // Render loading state if data is still loading
        <div className="loading-state title">Loading...</div>
      ) : (
        thoughts.map((thoughts) => (
          <PostCard
            key={thoughts._id} //I got stuck 3 days in here
            _id={thoughts._id} //and this line was the solution:)
            message={thoughts.message}
            hearts={thoughts.hearts}
            timeSinceCreated={calculateTimeDifference(thoughts.createdAt)}
            setLikesPerClick={setLikesPerClick}
            likesPerClick={likesPerClick}
            apiUrl={url}
          />
        ))
      )}
    </div>
  );
};
