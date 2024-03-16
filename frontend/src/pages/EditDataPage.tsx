import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Transition from "../components/Transition";
import { useUser } from "../helpers/UserProvider";
import EditDetails from "../components/EditDetails";
import EditPhoto from "../components/EditPhoto";
import EditPassword from "../components/EditPassword";

function EditDataPage() {
  const { user, updateUser, setUser, logout } = useUser();
  const [showAnimation, setShowAnim] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowAnim(true);
    setTimeout(() => {
      setShowContent(true);
    }, 100);
  }, []);

  return (
    <>
      <Navbar />
      {showAnimation && <Transition startAnimation={showAnimation} />}
      {user && showContent ? (
        <>
          <div
            className="mx-50 my-20 lg:mx-56 grid grid-cols-1 gap-8"
            id="wrapper"
          >
            <EditDetails
              user={user}
              updateUser={updateUser}
              setUser={setUser}
            />
            <EditPhoto user={user} updateUser={updateUser} setUser={setUser} />
            <EditPassword user={user} logout={logout} />
          </div>
        </>
      ) : (
        <div className="text-lg">Loading...</div>
      )}
      {showContent && <Footer />}
    </>
  );
}

export default EditDataPage;
