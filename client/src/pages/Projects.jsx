
import { useEffect, useState } from 'react';
import { CallToAction, ProjectCard } from '../components';
import projects from "../data/projects.json";

export default function Projects() {



  return (
		<div className="min-h-screen max-w-6xl mx-auto flex justify-center  items-center flex-col gap-6 p-3">
			<h1 className="text-3xl font-semibold">Pojects</h1>
			<div className="p-7 justify-center flex flex-wrap gap-12">
				{projects &&
					projects.map((project,id) => (
						<ProjectCard key={id} project={project} />
					))}
				</div>
			<CallToAction />
		</div>
  );
}
