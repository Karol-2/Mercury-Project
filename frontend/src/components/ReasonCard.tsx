import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IReasonCard {
	icon: IconProp;
	title: string;
}

function ReasonCard(reasonsData: IReasonCard) {
	return (
		<div className="hover:bg-my-light hover:text-my-dark p-5 rounded-xl text-center clickable cursor-default my-5">
			<FontAwesomeIcon
				icon={reasonsData.icon}
				className="text-my-orange text-8xl mb-5"
			/>
			<p className="font-semibold text-lg">{reasonsData.title}</p>
		</div>
	);
}

export default ReasonCard;
