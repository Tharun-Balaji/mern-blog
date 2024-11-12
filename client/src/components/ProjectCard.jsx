import { LuGithub, LuExternalLink } from "react-icons/lu";

export default function ProjectCard({project}) {
  // console.log(project)
	return (
		<div className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-gradient-to-br from-teal-50 to-purple-50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
			{/* Project Image Container with overlay on hover */}
			<div className="relative overflow-hidden group">
				<img
					src={project.imageSrc}
					alt={project.title}
					className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
			</div>

			{/* Content Container */}
			<div className="p-6">
				{/* Title with gradient */}
				<h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
					{project.title}
				</h3>

				{/* Description */}
				<p className="text-gray-700 text-sm mb-4">
					{project.description}
				</p>

				{/* Skills with animated hover */}
				<div className="flex flex-wrap gap-2 mb-4">
					{project.skills?.map((skill, index) => (
						<span
							key={index}
							className="px-3 py-1 text-sm bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full transform hover:scale-105 transition-all duration-300 hover:shadow-md"
						>
							{skill}
						</span>
					))}
				</div>

				{/* Links with hover effects */}
				<div className="flex gap-4 mt-auto">
					<a
						href={project.demo}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors transform hover:translate-x-1 duration-300"
					>
						<LuExternalLink size={16} className="animate-pulse" />
						<span className="text-sm font-medium">Live Demo</span>
					</a>

					<a
						href={project.source}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors transform hover:translate-x-1 duration-300"
					>
						<LuGithub size={16} className="animate-bounce" />
						<span className="text-sm font-medium">Source Code</span>
					</a>
				</div>
			</div>

			{/* Decorative corner accent */}
			<div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 transform rotate-45 translate-x-8 -translate-y-8" />
		</div>
	);
}
