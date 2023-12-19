import "./Dashboard.scss";
import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard({ token, handleLogout }) {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: userProfile } = await axios.get("http://localhost:8080/api/user/current", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setIsLoading(false);
      setProfile(userProfile);
    } catch (error) {
      handleLogout();
    }
  }

  if (isLoading) {
    return <p>Loading...</p>
  }

  return (
    <main className="dashboard">
      <h1 className="dashboard__title">Dashboard</h1>

      <section>
        <p>Name: {profile.first_name} {profile.last_name}</p>
        <p>Address: {profile.address}</p>
        <p>Phone: {profile.phone}</p>
        <p>Email: {profile.email}</p>
      </section>

      <a href="#" onClick={handleLogout}>Logout</a>
    </main>
  );
}

export default Dashboard;
