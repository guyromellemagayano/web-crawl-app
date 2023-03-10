import { MemoizedBreadcrumbs } from "@components/breadcrumbs";
import { SubscriptionPlansSlug } from "@constants/PageLinks";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classnames } from "@utils/classnames";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { memo, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { MemoizedFooter } from "./Footer";

/**
 * Custom function to render the `PageLayout` component
 *
 * @param {any} children
 * @param {string} pageTitle
 * @param {string} pageDetailTitle
 * @param {boolean} isImages
 * @param {boolean} isLinks
 * @param {boolean} isPages
 * @param {boolean} isSites
 * @param {boolean} isSettings
 */
const PageLayout = ({
	children,
	pageTitle = null,
	pageDetailTitle = null,
	isImages = false,
	isLinks = false,
	isPages = false,
	isSites = false,
	isSettings = false
}) => {
	// Router
	const { asPath } = useRouter();

	// Custom context
	const { isComponentReady } = useContext(SiteCrawlerAppContext);

	return (
		<section className="flex min-h-page flex-col flex-nowrap items-start justify-start px-12 py-8">
			<MemoizedBreadcrumbs
				isImages={isImages}
				isLinks={isLinks}
				isPages={isPages}
				isSites={isSites}
				isSettings={isSettings}
				pageTitle={pageTitle}
				pageDetailTitle={pageDetailTitle}
			/>

			<div className="flex w-full flex-grow flex-col flex-nowrap">
				<div className="w-full pt-12 pb-4">
					<h2
						className={classnames(
							asPath.includes(SubscriptionPlansSlug) ? "text-center" : null,
							"text-2xl font-bold !leading-10 text-gray-900 sm:break-all sm:text-3xl"
						)}
					>
						{isComponentReady ? pageTitle : <Skeleton duration={2} width={215} height={36} />}
					</h2>
				</div>

				{children}
			</div>

			<MemoizedFooter />
		</section>
	);
};

PageLayout.propTypes = {
	children: PropTypes.any,
	isImages: PropTypes.bool,
	isLinks: PropTypes.bool,
	isPages: PropTypes.bool,
	isSettings: PropTypes.bool,
	isSites: PropTypes.bool,
	pageDetailTitle: PropTypes.string,
	pageTitle: PropTypes.string
};

/**
 * Memoized custom `PageLayout` component
 */
export const MemoizedPageLayout = memo(PageLayout);
