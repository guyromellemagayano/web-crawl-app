// React
import * as React from "react";

// NextJS
import Link from "next/link";

// External
import { NextSeo } from "next-seo";
import { Scrollbars } from "react-custom-scrollbars-2";
import { withResizeDetector } from "react-resize-detector";
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import tw from "twin.macro";

// Hooks
import useUser from "src/hooks/useUser";

// Layout
import Layout from "src/components/Layout";

// Components
import AppLogo from "src/components/logos/AppLogo";
import MainSidebar from "src/components/sidebar/MainSidebar";
import MobileSidebarButton from "src/components/buttons/MobileSidebarButton";
import SiteFooter from "src/components/layouts/Footer";

// Loadable
const AddSiteSteps = loadable(() => import("src/components/steps/AddSiteSteps"));
const Breadcrumbs = loadable(() => import("src/components/breadcrumbs/Breadcrumbs"));
const HowToSetup = loadable(() => import("src/components/pages/sites/HowToSetup"));
const Loader = loadable(() => import("src/components/layouts/Loader"));

const AddSite = ({ width }) => {
	const [componentReady, setComponentReady] = React.useState(false);
	const [openMobileSidebar, setOpenMobileSidebar] = React.useState(false);

	const appLogoAltText = "app-logo";
	const pageTitle = "Sites";
	const pageDetailTitle = "Add New Site";
	const homePageLink = "/sites/";

	const { user } = useUser({
		redirectIfFound: false,
		redirectTo: "/login"
	});

	React.useEffect(() => {
		setTimeout(() => {
			setComponentReady(true);
		}, 500);

		return setComponentReady(false);
	}, []);

	return (
		<Layout user={componentReady ? user : null}>
			<NextSeo title={componentReady ? pageDetailTitle : null} />

			<section tw="h-screen flex overflow-hidden bg-white">
				<MainSidebar
					width={width}
					user={componentReady ? user : null}
					openMobileSidebar={openMobileSidebar}
					setOpenMobileSidebar={setOpenMobileSidebar}
				/>

				{componentReady ? (
					<div tw="flex flex-col w-0 flex-1 overflow-hidden">
						<div tw="relative flex-shrink-0 flex bg-white">
							<div tw="border-b flex-shrink-0 flex">
								<MobileSidebarButton
									openMobileSidebar={openMobileSidebar}
									setOpenMobileSidebar={setOpenMobileSidebar}
								/>
							</div>

							<Link href={homePageLink} passHref>
								<a tw="p-1 block w-full cursor-pointer lg:hidden">
									<AppLogo
										tw="w-48 h-auto"
										src="/images/logos/site-logo-dark.svg"
										alt={appLogoAltText}
										width={230}
										height={40}
									/>
								</a>
							</Link>
						</div>

						<Scrollbars universal>
							<main tw="flex-1 relative z-0 max-w-screen-2xl mx-auto overflow-y-auto focus:outline-none" tabIndex="0">
								<div tw="max-w-full p-4 sm:px-6 md:px-8">
									<div tw="w-full py-6 mx-auto grid gap-16 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-12">
										<div tw="lg:col-span-2 xl:col-span-2 xl:pr-8 xl:border-r xl:border-gray-200">
											<div tw="max-w-full p-4">
												<Breadcrumbs isSites pageTitle={pageTitle} pageDetailTitle={pageDetailTitle} />
											</div>

											<AddSiteSteps />
										</div>

										<div tw="lg:col-span-1">
											<HowToSetup />
										</div>
									</div>

									<div tw="static bottom-0 w-full mx-auto p-4 border-t border-gray-200 bg-white">
										<SiteFooter />
									</div>
								</div>
							</main>
						</Scrollbars>
					</div>
				) : (
					<div tw="mx-auto">
						<Loader />
					</div>
				)}
			</section>
		</Layout>
	);
};

AddSite.propTypes = {};

export default withResizeDetector(AddSite);
