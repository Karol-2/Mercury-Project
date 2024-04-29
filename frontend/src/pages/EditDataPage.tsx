import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Transition from "../components/Transition";
import EditDetails from "../components/EditDetails";
import EditPhoto from "../components/EditPhoto";
import EditPassword from "../components/EditPassword";
import { useUser } from "../helpers/UserContext";

function EditDataPage() {
  const { provider, user, token, updateUser, redirectToLogin, logout } =
    useUser();
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
          <div className=" my-20 lg:mx-56 grid grid-cols-1 gap-8" id="wrapper">
            <EditDetails user={user} updateUser={updateUser} />
            <EditPhoto user={user} updateUser={updateUser} />
            <EditPassword
              provider={provider}
              user={user}
              token={token}
              redirectToLogin={redirectToLogin}
              logout={logout}
            />
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
