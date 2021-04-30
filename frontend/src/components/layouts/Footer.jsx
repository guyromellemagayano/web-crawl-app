// External
import 'twin.macro';

// JSON
import FooterLabel from 'public/labels/components/layout/Footer.json';

const SiteFooter = () => {
	return (
		<>
			<footer tw='max-w-full md:flex-col lg:flex-row p-3 md:flex md:items-center md:justify-between'>
				<div tw='flex justify-center md:order-1'>
					<nav tw='-mx-4 -my-2 flex flex-wrap justify-center'>
						{FooterLabel.map((value, index) => (
							<div key={index} tw='px-3 py-2'>
								<a
									href='#'
									tw='text-sm leading-6 text-gray-500 hover:text-indigo-500 transition duration-150 ease-in-out'
								>
									{value.label}
								</a>
							</div>
						))}
					</nav>
				</div>
				<div tw='md:order-2'>
					<p tw='text-center text-sm leading-6 text-gray-500'>
						&copy; {new Date().getFullYear()} SiteCrawler, Inc. All rights
						reserved.
					</p>
				</div>
			</footer>
		</>
	);
};

export default SiteFooter;