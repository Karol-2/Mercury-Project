import { faMagnifyingGlass, faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../helpers/UserProvider";
import editDistance from "../misc/editDistance";
import User from "../models/User";
import dataService from "../services/data";
import Select from "react-select";
import countriesData from "../assets/countries.json";

interface searchProps {
  handler: (test: [[User, number]]) => void;
}

const Search = (props: searchProps) => {
  const navigate = useNavigate();
  const setUsersFound = props.handler;

  // Logic
  const [searchQuery, setSearchQuery] = useState("");
  const [country, setCountry] = useState("");
  const [countryList, setCountryList] = useState(countriesData);
  const [error, setError] = useState("");

  const { user, userId } = useUser();

  useEffect(() => {
    const optionsWithEmpty = [{ Country: "-", Code: "-" }, ...countryList];

    setCountryList(optionsWithEmpty);
  }, []);

  const countryOptions = countryList.map((country) => ({
    value: country.Country,
    label: country.Country,
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCountryChange = (e: any) => {
    const selectedCountry = e ? e.value : "";
    setCountry(selectedCountry);
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let url: string = `/users/search?q=${searchQuery}`;
    if (country !== "" && country !== "-") {
      url = url + "&country=" + country;
    }

    if (userId === null) navigate("/login");

    if (searchQuery.trim() === "") {
      return;
    }
    try {
      setError("");
      const response = await dataService.fetchData(url, "GET");

      const responseWithoutCurrUser = response.users.filter(
        (respArr: [User, number]) => respArr[0].id !== user!.id,
      );

      const usersSorted = sortUsersByDistance(
        searchQuery,
        responseWithoutCurrUser,
      );

      setUsersFound(usersSorted);
    } catch {
      setError("No users found");
    }
  };

  const sortUsersByDistance = (searchTerm: string, users: [[User, number]]) => {
    const userScores = users.map((respArr: [User, number]) => {
      const user = respArr[0];
      const score = editDistance(user.first_name + user.last_name, searchTerm);
      return [user, score];
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return userScores.sort((a: any, b: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_userA, scoreA] = a;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_userB, scoreB] = b;

      return scoreA - scoreB;
    }) as [[User, number]];
  };

  return (
    <div id="search-wrapper" className="mx-50 my-20 flex items-center flex-col">
      <form
        className="flex flex-col md:flex-row gap-5 max-w-3xl w-full mt-5"
        onSubmit={handleSearch}
      >
        <div className=" w-full">
          <input
            type="text"
            placeholder="Enter your friend's name"
            className="form-input text-my-darker"
            onChange={(e) => setSearchQuery(e.target.value)}
          ></input>
        </div>

        <button type="submit" className="btn bg-my-purple text-xs px-7 py-5">
          <div className="flex gap-3 items-center text-cente justify-center">
            <span className=" text-center">Search</span>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </div>
        </button>
      </form>

      <div className="flex flex-col md:flex-row gap-5 max-w-3xl w-full mt-5 text-sm">
        <div>
            <div className="flex gap-3 items-center">
            <FontAwesomeIcon icon={faFilter} />
            <span className=" text-lg font-bold">Filters</span>
           
          </div>
          <div>
            Country <span className=" font-thin"> (not required)</span>
          </div>
          <Select
            options={countryOptions}
            onChange={handleCountryChange}
            className="text-my-dark w-full "
          />
        </div>
      </div>
      <div>{error}</div>
    </div>
  );
};

export default Search;
