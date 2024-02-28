import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import dataService from "../services/data";
import { useEffect, useState } from "react";
import FoundUser from "../components/FoundUser";
import { useUser } from "../helpers/UserProvider";
import User from "../models/User";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import editDistance from "../misc/editDistance";
import Transition from "../components/Transition";
import Paginator from "../components/Paginator";

function SearchPage() {
  const navigate = useNavigate();

  const [searchState, setSearchState] = useState("");
  const [usersFound, setUsersFound] = useState<[[User, number]]>();
  const [usersFriends, setUsersFriends] = useState([]);

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

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (userId === null) navigate("/login");

    if (searchState.trim() === "") {
      return;
    }

    const response = await dataService.fetchData(
      `/users/search?q=${searchState}`,
      "GET",
    );

    const responseWithoutCurrUser = response.users.filter(
      (respArr: [User, number]) => respArr[0].id !== user!.id,
    );

    const usersSorted = sortUsersByDistance(
      searchState,
      responseWithoutCurrUser,
    );

    setUsersFound(usersSorted);
  };

  const isFriend = (friendArr: string[], user: User): boolean => {
    return friendArr.reduce((prev: boolean, curr: string) => {
      return prev || curr === String(user.id);
    }, false);
  };

  const sortUsersByDistance = (searchTerm: string, users: [[User, number]]) => {
    const userScores = users.map((respArr: [User, number]) => {
      const user = respArr[0];
      const score = editDistance(user.first_name + user.last_name, searchTerm);
      return [user, score];
    });

    return userScores.sort((a: any, b: any) => {
      const [_userA, scoreA] = a;
      const [_userB, scoreB] = b;

      return scoreA - scoreB;
    }) as [[User, number]];
  };

  return (
    <>
      <Navbar />
      {showAnimation && <Transition startAnimation={showAnimation} />}
      {showContent ? (
        <>
          <section className=" min-h-screen mx-50 lg:mx-72 ">
            <div className="mx-50 my-20 flex justify-center">
              <form
                className="flex flex-col md:flex-row gap-5 max-w-3xl w-full mt-5"
                onSubmit={handleSearch}
              >
                <div className=" w-full">
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="form-input text-my-darker"
                    onChange={(e) => setSearchState(e.target.value)}
                  ></input>
                  <p className="text-lg">
                    Enter your friend's name in the field above.
                  </p>
                </div>

                <button
                  type="submit"
                  className="btn bg-my-purple text-xs px-7 py-5"
                >
                  <div className="flex gap-3 items-center text-cente justify-center">
                    <span className=" text-center">Search</span>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                  </div>
                </button>
              </form>
            </div>
            {usersFound && (
              <Paginator
                users={usersFound.map((match: [User, number]) => match[0])}
                itemsPerPage={5}
                renderItem={(user) => (
                  <FoundUser
                    user={user}
                    key={String(0)}
                    currentId={userId}
                    isFriend={isFriend(usersFriends, user)}
                  />
                )}
              />
            )}
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
