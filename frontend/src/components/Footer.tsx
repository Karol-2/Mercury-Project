import {
	faFacebook,
	faGithub,
	faTwitter,
	faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { faArrowCircleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Footer() {
	const scrollToTop = (): void => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	return (
		<footer className="  bg-my-orange mt-5 text-my-light p-10 flex flex-row">
			<section className=" min-w-full">
				<div className="mx-50 lg:mx-72 flex flex-row justify-around">
					<figure className=" flex flex-col content-evenly gap-3">
						<div className=" flex flex-row font-medium text-my-darker clickable">
							<FontAwesomeIcon icon={faYoutube} className=" text-3xl " />{" "}
							<p className=" self-center">Mercury App Channel</p>
						</div>
						<figure className=" flex flex-row font-medium text-my-darker clickable">
							<FontAwesomeIcon icon={faFacebook} className=" text-3xl" />{" "}
							<p>MercuryApp</p>
						</figure>
						<figure className=" flex flex-row font-medium text-my-darker clickable">
							<FontAwesomeIcon icon={faTwitter} className=" text-3xl" />{" "}
							<p>@MercuryAppl</p>
						</figure>
						<a
							className=" flex flex-row font-medium text-my-darker clickable"
							href="https://github.com/Karol-2/Mercury-Project"
						>
							<FontAwesomeIcon icon={faGithub} className=" text-3xl" />{" "}
							<p>Mercury Project</p>
						</a>
					</figure>

					<div className="flex flex-col">
						<button onClick={scrollToTop} className=" text-my-darker clickable">
							<FontAwesomeIcon
								icon={faArrowCircleUp}
								className=" text-7xl self-end"
							/>{" "}
						</button>

						<p className=" font-thin mt-20">
							{" "}
							&#169; 2023 Mercury. All Rights Reserved.
						</p>
					</div>
				</div>
			</section>
		</footer>
	);
}
