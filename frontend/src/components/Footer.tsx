import {
  faFacebook,
  faGithub,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { faArrowCircleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Footer() {
  const scrollToTop = (_e: React.MouseEvent<HTMLButtonElement>) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-my-orange mt-5 text-my-light p-10 flex flex-row">
      <section className="min-w-full">
        <div className="mx-50 lg:mx-72 flex flex-row justify-around">
          <figure className="flex flex-col content-evenly gap-3">
            <div className="flex flex-row gap-1 font-medium text-my-darker clickable">
              <FontAwesomeIcon icon={faYoutube} className="text-3xl" />
              <span className="self-center">Mercury App Channel</span>
            </div>
            <div className="flex flex-row gap-1 font-medium text-my-darker clickable">
              <FontAwesomeIcon icon={faFacebook} className="text-3xl" />
              <span className="self-center">MercuryApp</span>
            </div>
            <div className="flex flex-row gap-1 font-medium text-my-darker clickable">
              <FontAwesomeIcon icon={faTwitter} className="text-3xl" />
              <span className="self-center">@MercuryApp</span>
            </div>
            <a
              className="flex flex-row gap-1 font-medium text-my-darker clickable"
              href="https://github.com/Karol-2/Mercury-Project"
            >
              <FontAwesomeIcon icon={faGithub} className="text-3xl" />
              <span className="self-center">Mercury Project</span>
            </a>
          </figure>

          <div className="flex flex-col">
            <button onClick={scrollToTop} className="text-my-darker clickable">
              <FontAwesomeIcon
                icon={faArrowCircleUp}
                className="text-7xl self-end"
              />
            </button>

            <p className="font-thin mt-20">
              &#169; 2023 Mercury. All Rights Reserved.
            </p>
          </div>
        </div>
      </section>
    </footer>
  );
}
