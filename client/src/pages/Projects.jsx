
import { useEffect, useState } from 'react';
import { CallToAction, ProjectCard } from '../components';

export default function Projects() {

	const [projects, setProjects] = useState(null);

	useEffect(() => {
		// When the component mounts, fetch the list of projects from the server
		try {
			const fetchProjects = async () => {
				if (localStorage.getItem('projects')) {
					setProjects(JSON.parse(localStorage.getItem('projects')));
					return;
				}
				const res = await fetch("https://projects-json-server.onrender.com/projects");
				const data = await res.json();
				// console.log(data)
				if (res.ok) {
					// If the request is successful, set the projects state to the received data
					setProjects(data);
					localStorage.setItem('projects', JSON.stringify(data));
				}
			};
			fetchProjects();
		} catch (error) {
			// If there is an error, log it to the console
			console.log(error);
		}
	}, []); // Run this effect only once, when the component mounts

  return (
		<div className="min-h-screen max-w-6xl mx-auto flex justify-center  items-center flex-col gap-6 p-3">
			<h1 className="text-3xl font-semibold">Pojects</h1>
			<div className="p-7 justify-center flex flex-wrap gap-12">
				{projects &&
					projects.map((project) => (
						<ProjectCard key={project._id} project={project} />
					))}
				</div>
			<CallToAction />
		</div>
  );
}
