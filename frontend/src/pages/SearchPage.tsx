import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import dataService from "../services/data";
import { useState } from "react";
import FoundUser from "../components/FoundUser";

function SearchPage() {
  const [searchState, setSearchState] = useState("");
  const [usersFound, setUsersFound] = useState([]);

  const handleSearch = async() => {
    const response = await dataService.fetchData(`/users/search?q=${searchState}`,"GET")
    setUsersFound(response.users)
    
  }
  return (
    <>
      <Navbar />
      <section className=" ">
        <div className="flex flex-row w-full" >
          <input type="text" placeholder="Enter your friend's name..." className="form-input text-my-darker" 
          onChange={e => setSearchState(e.target.value)}></input>
          <button type="submit" className="btn small bg-my-purple" onClick={handleSearch}>Search</button>
        </div>
        <div>
          {
            usersFound.map((user) => ( <FoundUser user={user[0]}></FoundUser>))
          }
        </div>
      </section>
      <Footer />
    </>
  );
}

export default SearchPage;
