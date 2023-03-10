import { SidebarMenuLabels } from "@constants/SidebarMenuLabels";
import { SelectorIcon } from "@heroicons/react/solid";
import { useSiteSelection } from "@hooks/useSiteSelection";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classnames } from "@utils/classnames";
import useTranslation from "next-translate/useTranslation";
import PropTypes from "prop-types";
import { memo, useContext } from "react";

/**
 * Custom function to render the `SiteSelectMenu` component
 *
 * @param {function} handleOpenDropdown
 */
const SiteSelectMenu = ({ handleOpenDropdown }) => {
	// Custom context
	const { currentScan, querySiteId } = useContext(SiteCrawlerAppContext);

	// Translations
	const { t } = useTranslation("sidebar");
	const recrawlingInProcess = t("recrawlingInProcess");
	const verified = t("verified");
	const notVerified = t("notVerified");

	// Sidebar Menu Labels
	const labelsArray = SidebarMenuLabels();

	// Custom hooks
	const { selectedSiteDetails } = useSiteSelection();

	return (
		<button
			type="button"
			aria-haspopup="listbox"
			aria-expanded="true"
			aria-labelledby="listbox-label"
			className="relative w-full cursor-default rounded-md border border-gray-700 bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus:ring-1 focus:ring-gray-1100 sm:text-sm sm:leading-5"
			onClick={handleOpenDropdown}
		>
			<div className="flex items-center space-x-3">
				<span className="block truncate text-gray-600">
					{selectedSiteDetails ? (
						<div className="flex items-center space-x-3">
							<span
								aria-label={
									selectedSiteDetails?.verified ? (currentScan ? recrawlingInProcess : verified) : notVerified
								}
								className={classnames(
									"inline-block h-2 w-2 flex-shrink-0 rounded-full",
									selectedSiteDetails?.verified ? (currentScan ? "bg-yellow-400" : "bg-green-400") : "bg-red-400"
								)}
							></span>
							<span className="block truncate font-medium text-gray-500">{selectedSiteDetails?.name}</span>
						</div>
					) : (
						labelsArray[0].label
					)}
				</span>
			</div>
			<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
				<SelectorIcon className="h-4 w-4 text-gray-400" />
			</span>
		</button>
	);
};

SiteSelectMenu.propTypes = {
	handleOpenDropdown: PropTypes.func
};

/**
 * Memoized custom `SiteSelectMenu` component
 */
export const MemoizedSiteSelectMenu = memo(SiteSelectMenu);
