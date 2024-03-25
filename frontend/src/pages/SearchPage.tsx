import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import dataService from "../services/data";
import { useEffect, useState } from "react";
import FoundUser from "../components/FoundUser";
import { useUser } from "../helpers/UserProvider";
import User from "../models/User";
import { useNavigate } from "react-router-dom";

import Transition from "../components/Transition";
import Search from "../components/Search";
import PaginatorV2 from "../components/PaginatorV2";

function SearchPage() {
  const navigate = useNavigate();

  // Logic
  const [usersFriends, setUsersFriends] = useState([]);
  const [queryEndpoint, setQueryEndpoint] = useState<string>("");
  const [isReadyToSearch, setIsReadyToSearch] = useState<boolean>(false)

  // Animation
  const [showAnimation, setShowAnim] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const { user, userId } = useUser();

  useEffect(() => {
    setShowAnim(true);
    setTimeout(() => {
      setShowContent(true);
    }, 100);
  }, []);

  useEffect(() => {
    if (userId === null) navigate("/login");

    const fetchFriends = async () => {
      const friendsResponse = await dataService.fetchData(
        `/users/${userId}/friends`,
        "GET",
        {},
      );
      
      const friendsIds = friendsResponse.users.reduce(
        (prev: string[], curr: User) => {
          return [...prev, curr.id];
        },
        [],
      );
      setUsersFriends(friendsIds);
    };
    fetchFriends();
  }, [user]);

 

  const isFriend = (friendArr: string[], user: User): boolean => {
    return friendArr.reduce((prev: boolean, curr: string) => {
      return prev || curr === String(user.id);
    }, false);
  };

  const foundUsersHandler = (endpoint: string)=>{ 
    
    setQueryEndpoint(endpoint)
    setIsReadyToSearch(() => !isReadyToSearch)
  }


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
                renderItem={(user) => {
                  if (user.id !== userId) {
                    return (
                      <FoundUser
                        user={user}
                        key={String(0)}
                        currentId={userId}
                        isFriend={isFriend(usersFriends, user)}
                      />
                    );
                  } else return<></>
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
