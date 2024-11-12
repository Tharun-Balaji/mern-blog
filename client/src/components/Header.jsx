import { Avatar, Button, Dropdown,  Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signOutStart, signOutSuccess } from "../redux/user/userSlice";
import { useEffect, useState } from "react";

export default function Header() {

	const path = useLocation().pathname;
	const location = useLocation();
	const { currentUser } = useSelector((state) => state.user);
	const{theme} = useSelector((state) => state.theme);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	  const [searchTerm, setSearchTerm] = useState("");


	  // When the user navigates to a new URL, check if the new URL includes a search term
	  // If it does, set the search term to the value in the URL
	  useEffect(() => {
			const urlParams = new URLSearchParams(location.search);
			const searchTermFromUrl = urlParams.get("searchTerm");
			if (searchTermFromUrl) {
				// If the URL includes a search term, set the search term to that value
				setSearchTerm(searchTermFromUrl);
			}
		}, [location.search]);

		const handleSignOut = async () => {
			dispatch(signOutStart());

			try {
				const res = await fetch("/api/user/signout", {
					method: "POST",
				});

				const data = await res.json();

				if (!res.ok) {
					console.log(data.message);
				} else {
					dispatch(signOutSuccess());
					navigate("/sign-in");
				}
			} catch (error) {
				console.log(error.message);
			}
	};
	
	/**
	 * When the user submits the search form, this function is called.
	 * It takes the current search term and adds it to the URL as a query
	 * parameter, and then navigates to the new URL.
	 * @param {Event} e - The event object from the form submission
	 */
	const handleSubmit = (e) => {
		e.preventDefault();
		const urlParams = new URLSearchParams(location.search);
		urlParams.set("searchTerm", searchTerm);
		const searchQuery = urlParams.toString();
		// Navigate to the new URL with the search term as a query parameter
		navigate(`/search?${searchQuery}`);
	};
	
  return (
		<Navbar className="border-b-2">
			<Link
				to="/"
				className="self-center whitespace-nowrap text-sm sm:test-xl font-semibold dark:text-white"
			>
				<span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
					Tharun&apos;s
				</span>
				Blog
			</Link>
			<form onSubmit={handleSubmit}>
				<TextInput
					type="text"
					placeholder="Search"
					rightIcon={AiOutlineSearch}
					className="hidden lg:inline"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</form>
			<Button className="w-12 h-10 lg:hidden" color="gray" pill>
				<AiOutlineSearch />
			</Button>
			<div className="flex gap-2 md:order-2">
				<Button
					className="w-12 h-10 hidden sm:inline"
					color="gray"
					onClick={() => dispatch(toggleTheme())}
					pill
				>
					{theme === "light" ? <FaSun /> : <FaMoon />}
				</Button>
				{currentUser ? (
					<Dropdown
						arrowIcon={false}
						inline
						label={
							<Avatar
								alt="user"
								img={currentUser.profilePicture}
								rounded
							/>
						}
					>
						<Dropdown.Header>
							<span className="block text-sm">
								@{currentUser.username}
							</span>
							<span className="block text-sm font-medium truncate">
								{currentUser.email}
							</span>
						</Dropdown.Header>
						<Link to={"/dashboard?tab=profile"}>
							<Dropdown.Item>Profile</Dropdown.Item>
						</Link>
						<Dropdown.Divider />
						<Dropdown.Item onClick={handleSignOut}>
							Sign out
						</Dropdown.Item>
					</Dropdown>
				) : (
					<Link to="/sign-in">
						<Button gradientDuoTone="purpleToBlue" outline>
							Sign In
						</Button>
					</Link>
				)}
				<Navbar.Toggle />
			</div>
			<Navbar.Collapse>
				<Navbar.Link active={path === "/" ? true : false} as={"div"}>
					<Link to="/">Home</Link>
				</Navbar.Link>

				<Navbar.Link
					active={path === "/about" ? true : false}
					as={"div"}
				>
					<Link to="/about">About</Link>
				</Navbar.Link>

				<Navbar.Link
					active={path === "/projects" ? true : false}
					as={"div"}
				>
					<Link to="/projects">Projects</Link>
				</Navbar.Link>
			</Navbar.Collapse>
		</Navbar>
  );
}
