import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import User from "../models/User";
import dataService from "../services/data";

interface PaginatorProps {
  endpoint: string;
  itemsPerPage: number;
  renderItem: (user: User) => React.ReactNode;
  refresh: boolean;
  isSearch: boolean;
}

function PaginatorV2(props: PaginatorProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [error, setError] = useState<string>("");

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const handleRequest = async () => {
      if (props.endpoint.slice(-1) === "0" || props.endpoint === "") {
        return;
      }

      let queryChar = "?";
      if (props.isSearch) {
        queryChar = "&";
      }

      const url =
        props.endpoint +
        `${queryChar}page=${currentPage}&maxUsers=${props.itemsPerPage}`;

      await dataService
        .fetchData(url, "GET")
        .then((response) => {
          if (response.users && response.totalPage) {
            setUsers(response.users);
            setTotalPages(response.totalPage);
          } else {
            previousPage();
            if (currentPage === 1) {
              setError("No user found");
            }
          }
        })
        .catch((err) => {
          console.log(err);

          setError("No users found");
        });
    };

    handleRequest();
  }, [currentPage, props.refresh]);

  const nextPage = () => {
    if (currentPage + 1 <= totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage - 1 > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div id="paginator">
      {error ? (
        <></>
      ) : (
        <>
          <ul>
            {users &&
              users.map((user) => (
                <div key={user.id}>{props.renderItem(user)}</div>
              ))}
          </ul>
          {/* // paginator shows only when there is more than 1 page */}
          {totalPages !== 1&&<div
            id="pagin-buttons"
            className=" bg-my-orange rounded-md flex flex-row justify-evenly text-lg p-2 align-middle"
          >
            <button
              onClick={previousPage}
              className=" rounded-lg bg-my-dark text-my-light p-2 transition duration-250 ease-in-out hover:bg-my-darker active:translate-y-1"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>

            <div className=" flex flex-col justify-center">
              <p>
                Page {currentPage} of {totalPages}
              </p>
            </div>

            <button
              onClick={nextPage}
              className=" rounded-lg bg-my-dark text-my-light p-2 transition duration-250 ease-in-out hover:bg-my-darker active:translate-y-1"
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>}
        </>
      )}
    </div>
  );
}

export default PaginatorV2;
