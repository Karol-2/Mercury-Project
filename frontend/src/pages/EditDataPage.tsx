import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Transition from "../components/Transition";
import { useUser } from "../helpers/UserProvider";

function EditDataPage() {
    const {user} = useUser();
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
        <h1>Editing</h1>
    ) : (
      <div className="text-lg">Loading...</div>
    )}
    {showContent && <Footer />}
  </>
  )
 
}

export default EditDataPage;
