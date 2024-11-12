
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Select, TextInput } from 'flowbite-react';
import {PostCard} from '../components';


export default function Search() {

   const [sidebarData, setSidebarData] = useState({
		searchTerm: "",
		sort: "desc",
		category: "uncategorized",
   });
  
   const [posts, setPosts] = useState([]);
   const [loading, setLoading] = useState(false);
   const [showMore, setShowMore] = useState(false);

   const location = useLocation();

  const navigate = useNavigate();
  
  useEffect(() => {
     
		// Get the URL parameters from the current URL
		const urlParams = new URLSearchParams(location.search);
		const searchTermFromUrl = urlParams.get("searchTerm");
		const sortFromUrl = urlParams.get("sort");
    const categoryFromUrl = urlParams.get("category");

		// If any of the URL parameters have changed, update the state
		if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
			setSidebarData({
				...sidebarData,
				searchTerm: searchTermFromUrl,
				sort: sortFromUrl,
				category: categoryFromUrl,
			});
		}

		// Fetch the posts from the server based on the current URL parameters
		const fetchPosts = async () => {
			setLoading(true);
			// Create the search query string from the URL parameters
			const searchQuery = urlParams.toString();
			// Fetch the posts from the server
			const res = await fetch(`/api/post/getposts?${searchQuery}`);
			if (!res.ok) {
				// If the request failed, stop loading and return
				setLoading(false);
				return;
			}
			if (res.ok) {
				// If the request was successful, update the state with the posts
				// and set the loading state to false
				const data = await res.json();
				setPosts(data.posts);
				setLoading(false);
				// If there are 9 posts, show the "Show More" button
				if (data.posts.length === 9) {
					setShowMore(true);
				} else {
					// Otherwise, hide the "Show More" button
					setShowMore(false);
				}
			}
		};
		fetchPosts();
	}, [location.search]);
	

	const handleSubmit = (e) => {
		e.preventDefault(); // Prevent the default form submission behavior
		const urlParams = new URLSearchParams(location.search); // Get the current URL parameters
		urlParams.set("searchTerm", sidebarData.searchTerm); // Set the search term in the query parameters
		urlParams.set("sort", sidebarData.sort); // Set the sort order in the query parameters
		urlParams.set("category", sidebarData.category); // Set the category in the query parameters
		const searchQuery = urlParams.toString(); // Convert the URL parameters to a query string
		navigate(`/search?${searchQuery}`); // Navigate to the new URL with the updated query parameters
	};

	const handleChange = (e) => {
		// Check if the changed element is the search term input
		if (e.target.id === "searchTerm") {
			// Update the searchTerm in the sidebar data
			setSidebarData({ ...sidebarData, searchTerm: e.target.value });
		}
		// Check if the changed element is the sort dropdown
		if (e.target.id === "sort") {
			// Default to "desc" if no value is selected
			const order = e.target.value || "desc";
			// Update the sort order in the sidebar data
			setSidebarData({ ...sidebarData, sort: order });
		}
		// Check if the changed element is the category dropdown
		if (e.target.id === "category") {
			// Default to "uncategorized" if no value is selected
			const category = e.target.value || "uncategorized";
			// Update the category in the sidebar data
			setSidebarData({ ...sidebarData, category });
		}
	};

	/**
	 * Handles the "Show more" button click event.
	 * Fetches the next page of posts and updates the posts state.
	 * If there are more posts available, sets showMore to true.
	 * If there are no more posts available, sets showMore to false.
	 */
	const handleShowMore = async () => {
		const numberOfPosts = posts.length;
		// The start index is the number of posts already displayed
		const startIndex = numberOfPosts;
		const urlParams = new URLSearchParams(location.search);
		urlParams.set("startIndex", startIndex);
		const searchQuery = urlParams.toString();
		// Fetch the next page of posts
		const res = await fetch(`/api/post/getposts?${searchQuery}`);
		if (!res.ok) {
			return;
		}
		if (res.ok) {
			const data = await res.json();
			// Update the posts state with the new page of posts
			setPosts([...posts, ...data.posts]);
			// If there are more posts available, set showMore to true
			// If there are no more posts available, set showMore to false
			if (data.posts.length === 9) {
				setShowMore(true);
			} else {
				setShowMore(false);
			}
		}
	};
	return (
		<div className="flex flex-col md:flex-row">
			<div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
				{/* The form that contains the search filters. It is submitted when the user clicks the "Apply Filters" button. */}
				<form className="flex flex-col gap-8" onSubmit={handleSubmit}>
					<div className="flex   items-center gap-2">
						<label className="whitespace-nowrap font-semibold">
							Search Term:
						</label>
						{/* The search term input field. It is bound to the searchTerm state variable. */}
						<TextInput
							placeholder="Search..."
							id="searchTerm"
							type="text"
							value={sidebarData.searchTerm}
							onChange={handleChange}
						/>
					</div>
					<div className="flex items-center gap-2">
						{" "}
						<label className="font-semibold">Sort:</label>
						{/* The sort dropdown. It is bound to the sort state variable. */}
						<Select
							onChange={handleChange}
							value={sidebarData.sort}
							id="sort"
						>
							<option value="desc">Latest</option>
							<option value="asc">Oldest</option>
						</Select>
					</div>
					<div className="flex items-center gap-2">
						<label className="font-semibold">Category:</label>
						{/* The category dropdown. It is bound to the category state variable. */}
						<Select
							onChange={handleChange}
							value={sidebarData.category}
							id="category"
						>
							<option value="uncategorized">Uncategorized</option>
							<option value="reactjs">React.js</option>
							<option value="nextjs">Next.js</option>
							<option value="javascript">JavaScript</option>
						</Select>
					</div>
					{/* The "Apply Filters" button. It submits the form. */}
					<Button
						type="submit"
						outline
						gradientDuoTone="purpleToPink"
					>
						Apply Filters
					</Button>
				</form>
			</div>
			<div className="w-full">
				{" "}
				<h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5 ">
					Posts results:
				</h1>
				<div className="p-7 flex flex-wrap gap-4">
					{" "}
					{/* If no posts are found, display a message. */}
					{!loading && posts.length === 0 && (
						<p className="text-xl text-gray-500">No posts found.</p>
					)}{" "}
					{/* If the posts are loading, display a message. */}
					{loading && (
						<p className="text-xl text-gray-500">Loading...</p>
					)}
					{/* If the posts are loaded, display them. */}
					{!loading &&
						posts &&
						posts.map((post) => (
							<PostCard key={post._id} post={post} />
						))}
					{/* If there are more posts than displayed, show a "Show More" button. */}
					{showMore && (
						<button
							onClick={handleShowMore}
							className="text-teal-500 text-lg hover:underline p-7 w-full"
						>
							Show More
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
