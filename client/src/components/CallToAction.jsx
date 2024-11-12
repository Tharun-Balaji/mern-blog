import { Button } from "flowbite-react";


export default function CallToAction() {
  return (
		<div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
			<div className="flex-1 justify-center flex flex-col">
				<h2 className="text-2xl">Hi I'm Tharun</h2>
				<p className="text-gray-500 my-2">
					I'm a Aspiring software developer passionate about crafting
					elegant code, solving complex problems, and continuously
					learning to innovate in the ever-evolving world of
					technology.
				</p>
				<Button
					gradientDuoTone="purpleToPink"
					className="rounded-tl-xl rounded-bl-none"
				>
					<a
						href="mailto:tharunbalaji110@gmail.com"
						target="_blank"
						rel="noopener noreferrer"
					>
						Contact Me
					</a>
				</Button>
			</div>
			<div className="p-7 flex-1">
				<img src="https://bairesdev.mo.cloudinary.net/blog/2023/08/What-Is-JavaScript-Used-For.jpg" />
			</div>
		</div>
  );
}
