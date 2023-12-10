import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import dataService from "../services/data";
import { useEffect, useState } from "react";
import FoundUser from "../components/FoundUser";
import { useUser } from "../helpers/UserProvider";
import User from "../models/User";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function SearchPage() {
  const [searchState, setSearchState] = useState("");
  const [usersFound, setUsersFound] = useState([]);
  const [usersFriends, setUsersFriends] = useState([]);

  const { user, userId } = useUser();

  useEffect(() => {
    const fetchFriends = async () => {
      const friendsResponse = await dataService.fetchData(
        `/users/${userId}/friends`,
        "GET",
        {},
      );
      const friendsIds = friendsResponse.friends.reduce(
        (prev: string[], curr: User) => {
          return [...prev, curr.id];
        },
        [],
      );
      setUsersFriends(friendsIds);
    };
    fetchFriends();
  }, [user]);

  const handleSearch = async (e: { preventDefault: () => void }) => {
    if (searchState.trim() === "") {
      return;
    }
    e.preventDefault();
    console.log(searchState);
    const response = await dataService.fetchData(
      `/users/search?q=${searchState}`,
      "GET",
    );

    const responseWithoutCurrUser = response.users.filter(
      (respArr: [User, number]) => respArr[0].id !== user!.id,
    );
    setUsersFound(responseWithoutCurrUser);
  };

  const isFriend = (friendArr: string[], user: User): boolean => {
    return friendArr.reduce((prev: boolean, curr: string) => {
      return prev || curr === String(user.id);
    }, false);
  };

  return (
    <>
      <Navbar />
      <section className=" min-h-screen mx-50 lg:mx-72 ">
        <div>
          <form
            className="flex flex-row max-w-3xl w-full mt-5"
            onSubmit={handleSearch}
          >
            <input
              type="text"
              placeholder="John Doe"
              className="form-input text-my-darker"
              onChange={(e) => setSearchState(e.target.value)}
            ></input>
            <button
              type="submit"
              className="btn small bg-my-purple ml-5 text-xs"
            >
              <div className="flex align-middle ">
                <span>Search</span>
                <FontAwesomeIcon icon={faMagnifyingGlass} className="ml-2" />
              </div>
            </button>
          </form>
        </div>
        <div>
          {usersFound && usersFound.length > 0 ? (
            usersFound.map((user, index) => (
              <FoundUser
                user={user[0]}
                key={String(index)}
                currentId={userId}
                isFriend={isFriend(usersFriends, user[0])}
              />
            ))
          ) : (
            <p className="text-lg">
              Enter your friend's name in the field above.
            </p>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}

export default SearchPage;
