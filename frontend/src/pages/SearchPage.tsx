import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import dataService from "../services/data";
import { useEffect, useState } from "react";
import FoundUser from "../components/FoundUser";
import { useUser } from "../helpers/UserContext";
import User from "../models/User";
import { useProtected } from "../helpers/Protected";

import Transition from "../components/Transition";
import Search from "../components/Search";
import PaginatorV2 from "../components/PaginatorV2";

function SearchPage() {
  // Logic
  const [usersFriends, setUsersFriends] = useState<string[]>([]);
  const [queryEndpoint, setQueryEndpoint] = useState<string>("");
  const [isReadyToSearch, setIsReadyToSearch] = useState<boolean>(false);

  // Animation
  const [showAnimation, setShowAnim] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const { userState } = useUser();
  const { user } = useProtected();

  useEffect(() => {
    setShowAnim(true);
    setTimeout(() => {
      setShowContent(true);
    }, 100);
  }, []);

  useEffect(() => {
    if (userState.status == "loading") return;

    const fetchFriends = async () => {
      const friendsResponse = await dataService.fetchData(
        `/users/${user.id}/friends`,
        "GET",
        {},
      );

      const friends = friendsResponse.friends as User[];
      const friendsIds = friends.map((friend) => friend.id);
      console.log(friendsIds)
      setUsersFriends(friendsIds);
    };
    fetchFriends();
  }, [user]);

  const isFriend = (friendArr: string[], user: User): boolean => {
    return friendArr.reduce((prev: boolean, curr: string) => {
      return prev || curr === String(user.id);
    }, false);
  };

  const foundUsersHandler = (endpoint: string) => {
    setQueryEndpoint(endpoint);
    setIsReadyToSearch(() => !isReadyToSearch);
  };

  return (
    <>
      <Navbar />
      {showAnimation && <Transition startAnimation={showAnimation} />}
      {showContent ? (
        <>
          <section className=" min-h-screen mx-50 lg:mx-72 ">
            <Search handler={foundUsersHandler} />

            <PaginatorV2
              endpoint={queryEndpoint}
              refresh={isReadyToSearch}
              isSearch={true}
              itemsPerPage={5}
              getItems={(response) => response.users}
              renderItem={(renderUser) => {
                if (renderUser.id !== user.id) {
                  return (
                    <FoundUser
                      user={renderUser}
                      key={String(0)}
                      currentId={renderUser.id}
                      isFriend={isFriend(usersFriends, user)}
                    />
                  );
                } else return <></>;
              }}
            />
          </section>
          <Footer />
        </>
      ) : (
        ""
      )}
    </>
  );
}

export default SearchPage;
