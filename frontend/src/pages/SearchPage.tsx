import { useEffect, useState } from "react";

import Footer from "../components/Footer";
import FoundUser from "../components/FoundUser";
import Navbar from "../components/Navbar";
import PaginatorV2 from "../components/PaginatorV2";
import Search from "../components/Search";
import Transition from "../components/Transition";
import { useProtected } from "../helpers/Protected";
import { useUser } from "../helpers/UserContext";
import User from "../models/User";

function SearchPage() {
  // Logic
  const [queryEndpoint, setQueryEndpoint] = useState<string>("");
  const [isReadyToSearch, setIsReadyToSearch] = useState<boolean>(false);

  // Animation
  const [showAnimation, setShowAnim] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const { user } = useProtected();
  const { friends } = useUser();

  useEffect(() => {
    setShowAnim(true);
    setTimeout(() => {
      setShowContent(true);
    }, 100);
  }, []);

  const isFriend = (user: User): boolean => {
    return user.id in friends;
  };

  const foundUsersHandler = (endpoint: string) => {
    setQueryEndpoint(endpoint);
    setIsReadyToSearch(() => !isReadyToSearch);
  };

  return (
    <>
      <Navbar />
      {showAnimation && <Transition startAnimation={showAnimation} />}
      {showContent && (
        <>
          <section className=" min-h-screen mx-50 lg:mx-72 ">
            <Search handler={foundUsersHandler} />

            <PaginatorV2
              endpoint={queryEndpoint}
              refresh={isReadyToSearch}
              isSearch={true}
              itemsPerPage={5}
              getItems={(response) => response.users}
              renderItem={(renderUser) => (
                <FoundUser
                  user={renderUser}
                  key={String(0)}
                  currentId={user.id}
                  isFriend={isFriend(renderUser)}
                />
              )}
            />
          </section>
          <Footer />
        </>
      )}
    </>
  );
}

export default SearchPage;
