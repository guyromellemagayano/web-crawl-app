import { Fragment } from 'react';

const SiteHead = () => {
	return (
		<Fragment>
			<link
				rel='apple-touch-icon'
				sizes='180x180'
				href='/apple-touch-icon.png'
			/>
			<link
				rel='icon'
				type='image/png'
				sizes='32x32'
				href='/favicon-32x32.png'
			/>
			<link
				rel='icon'
				type='image/png'
				sizes='16x16'
				href='/favicon-16x16.png'
			/>
			<link rel='manifest' href='/site.webmanifest' />
			<link rel='mask-icon' href='/safari-pinned-tab.svg' color='#5bbad5' />
			<meta name='apple-mobile-web-app-title' content='Site Crawler' />
			<meta name='application-name' content='Site Crawler' />
			<meta name='msapplication-TileColor' content='#b91d47' />
			<meta name='theme-color' content='#ffffff' />
		</Fragment>
	);
};

export default SiteHead;
