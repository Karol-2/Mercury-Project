import { motion } from "framer-motion";

export default function PhotoAndText() {
	return (
		<section className=" text-my-darker  gap-10 min-w-fit ">
			<div className="bg-my-dark relative">
				<p className="text-center font-semibold text-3xl bg-my-orange p-5">
					Brand New Approach
				</p>
				<div className=" mx-50 lg:mx-72 py-40" id="wrapper">
					<div className=" grid grid-cols-1 md:grid-cols-2 gap-10 justify-items-center">
						<motion.div
							className="w-80 h-80 rounded-full p-2 bg-my-orange pulsate"
							id="photo"
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							viewport={{ once: true }}
							transition={{ duration: 1 }}
						>
							<div className="rounded-full w-full h-full bg-my-dark p-2">
								<img
									src="https://images.inc.com/uploaded_files/image/1920x1080/getty_478389113_970647970450091_99776.jpg"
									alt="Happy working people"
									className="rounded-full w-full h-full object-cover"
								/>
							</div>
						</motion.div>

						<motion.div
							className=" bg-my-orange p-5 rounded-xl text-lg"
							id="text"
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							viewport={{ once: true }}
							transition={{ duration: 1 }}
						>
							<p className="font-bold text-2xl">
								Are you tired of struggling to keep in touch with friends,
								family, and colleagues?{" "}
							</p>
							<p className=" mt-10 text-xl text-justify">
								Mercury is here to make communication effortless and enjoyable.
								Our powerful communication app is designed to connect people in
								a whole new way!
							</p>
						</motion.div>
					</div>
				</div>
			</div>
		</section>
	);
}
