import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import GitHubIcon from '@mui/icons-material/GitHub';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Header from './Header.jsx';
import MainFeaturedPost from './MainFeaturedPost.jsx';
import FeaturedPost from './FeaturedPost.jsx';
import Main from './Main.jsx';
import Sidebar from './Sidebar.jsx';
import Footer from './Footer.jsx';
import post1 from './blog-post.1.md';
import post2 from './blog-post.2.md';

const sections = [
	{ title: 'About us', url: '#' },
	{ title: 'Our Approach', url: '#' },
	{ title: 'Our Team', url: '#' },
	{ title: 'Portfolio', url: '#' },
	{ title: 'News', url: '#' },
	{ title: 'Contact us', url: '#' }, 
];

const mainFeaturedPost = {
	title: 'Famous Volatility ETFs Are Back After a Wild Week on Wall Street',
	description:
		"Funds known as UVIX and SVIX surf huge stock-market moves. Yet watchdogs are mulling tough new rules for complex products",
	image: 'https://assets.bwbx.io/images/users/iqjWHBFdfxIU/iorw65dsw498/v0/-1x-1.jpg',
	imageText: 'main image description',
	linkText: 'Continue reading…',
};

const featuredPosts = [
	{
		title: 'Hong Kongs Next Leader Lee Seek’s Better Integration With China',
		date: 'May 8, 2022, 5:05 PM GMT+8',
		description:
			'Chief executive-elect says security will be his top priority. Former police official’s election criticized by EU, activists',
		image: 'https://assets.bwbx.io/images/users/iqjWHBFdfxIU/i0jbLCGjpd9s/v1/-1x-1.jpg',
		imageLabel: 'Image Text',
	},
	{
		title: 'Apple Keeps Its Tap-to-Pay Feature to Itself to Protect Revenue',
		date: 'Nov 11',
		description:
			'Apple’s latest antitrust battle is all about Apple Pay and how the company reserves the tap-to-pay feature for its own service.',
		image: 'https://assets.bwbx.io/images/users/iqjWHBFdfxIU/iYUpNISYottk/v1/-1x-1.jpg',
		imageLabel: 'Image Text',
	},
];

const posts = [post1, post2];

const sidebar = {
	title: 'About',
	description:
		'Welcome to Cheok Capital.',
	archives: [
		{ title: 'March 2022', url: '#' },
		{ title: 'February 2022', url: '#' },
		{ title: 'January 2022', url: '#' },
	],
	social: [
		{ name: 'GitHub', icon: GitHubIcon, url: 'https://github.com/Cheoklate' },
		{ name: 'Twitter', icon: TwitterIcon, url: 'https://twitter.com/Cheok49920570' },
		{ name: 'Facebook', icon: FacebookIcon, url: 'https://www.facebook.com/gregory.cheok/' },
	],
};

const theme = createTheme();

export default function Blog() {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Container maxWidth='lg'>
				<Header title='Cheok Capital' sections={sections} />
				<main>
					<MainFeaturedPost post={mainFeaturedPost} />
					<Grid container spacing={4}>
						{featuredPosts.map((post) => (
							<FeaturedPost key={post.title} post={post} />
						))}
					</Grid>
					<Grid container spacing={5} sx={{ mt: 3 }}>
						<Main title='Thoughts' posts={posts} />
						<Sidebar
							title={sidebar.title}
							description={sidebar.description}
							archives={sidebar.archives}
							social={sidebar.social}
						/>
					</Grid>
				</main>
			</Container>
			<Footer
				title=''
				description=''
			/>
		</ThemeProvider>
	);
}
