import { faFilter, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import countriesData from "../assets/countries.json";
import { useUser } from "../helpers/UserContext";

interface searchProps {
  handler: (endpoint: string) => void;
}

const Search = (props: searchProps) => {
  const navigate = useNavigate();
  const {user} = useUser();

  // Logic
  const [searchQuery, setSearchQuery] = useState("");
  const [country, setCountry] = useState("");
  const [countryList, setCountryList] = useState(countriesData);

  const { userState } = useUser();

  useEffect(() => {
    const emptyElementExists = countryList.some(
      (country) => country.Code === "-",
    );

    if (!emptyElementExists) {
      const optionsWithEmpty = [{ Country: "-", Code: "-" }, ...countryList];
      setCountryList(optionsWithEmpty);
    }
  }, [countryList]);

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

    if (userState.status === "anonymous") navigate("/login");

    const countryQuery = country != "-" ? country : "";

    const urlSearchParams = new URLSearchParams({
      q: searchQuery,
      country: countryQuery,
      userId: user?.id || ""
    });

    props.handler(`/users/search?${urlSearchParams}`);
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
    </div>
  );
};

export default Search;
