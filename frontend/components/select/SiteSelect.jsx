import { MemoizedSiteSelectDropdown } from "@components/dropdowns/SiteSelectDropdown";
import { MemoizedSiteSelectMenu } from "@components/menus/SiteSelectMenu";
import { useSiteSelection } from "@hooks/useSiteSelection";
import { SiteCrawlerAppContext } from "@pages/_app";
import { memo, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Custom function to render the `SiteSelect` component
 */
const SiteSelect = () => {
	// Custom context
	const { isComponentReady, sites } = useContext(SiteCrawlerAppContext);

	// Custom hooks
	const { siteSelectRef, isSiteSelectComponentVisible, setIsSiteSelectComponentVisible } = useSiteSelection();

	return (
		<div className="relative space-y-1">
			<span className="inline-block w-full rounded-md shadow-sm">
				{isComponentReady ? (
					<MemoizedSiteSelectMenu
						handleOpenDropdown={() => setIsSiteSelectComponentVisible(!isSiteSelectComponentVisible)}
					/>
				) : (
					<Skeleton width={224} height={38} className="relative w-full cursor-default py-2 pl-3 pr-10" />
				)}
			</span>

			<MemoizedSiteSelectDropdown ref={siteSelectRef} openDropdown={isSiteSelectComponentVisible} />
		</div>
	);
};

/**
 * Memoized custom `SiteSelect` component
 */
export const MemoizedSiteSelect = memo(SiteSelect);
