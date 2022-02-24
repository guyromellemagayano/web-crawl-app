import { FilterData } from "@constants/FilterData";
import { handleRemoveUrlParameter } from "@helpers/handleRemoveUrlParameter";
import { useScanApiEndpoint } from "@hooks/useScanApiEndpoint";
import { useSiteQueries } from "@hooks/useSiteQueries";
import { useUser } from "@hooks/useUser";
import { SiteCrawlerAppContext } from "@pages/_app";
import { handleConversionStringToBoolean } from "@utils/convertCase";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { memo, useContext, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSWRConfig } from "swr";
import "twin.macro";

/**
 * Custom function to render the `Filter` component
 *
 * @param {boolean} isSitesFilter
 * @param {boolean} isSitesLinksFilter
 * @param {boolean} isSitesPagesFilter
 * @param {boolean} isSitesImagesFilter
 * @param {boolean} isSitesSeoFilter
 * @param {boolean} isValidating
 */
const Filter = ({
	isSitesFilter = false,
	isSitesLinksFilter = false,
	isSitesPagesFilter = false,
	isSitesImagesFilter = false,
	isSitesSeoFilter = false
}) => {
	// Translations
	const { t } = useTranslation("filters");
	const filterText = t("filters");

	// Custom constants
	const {
		filtersArray,
		allSitesFilter,
		setAllSitesFilter,
		unverifiedFilter,
		setUnverifiedFilter,
		verifiedFilter,
		setVerifiedFilter,
		allLinksFilter,
		setAllLinksFilter,
		externalLinksFilter,
		setExternalLinksFilter,
		internalLinksFilter,
		setInternalLinksFilter,
		nonWebLinksFilter,
		setNonWebLinksFilter,
		linksWithIssuesFilter,
		setLinksWithIssuesFilter,
		noLinkIssuesFilter,
		setNoLinkIssuesFilter,
		allPagesFilter,
		setAllPagesFilter,
		okLinksFilter,
		setOkLinksFilter,
		nonOkLinksFilter,
		setNonOkLinksFilter,
		okImagesFilter,
		setOkImagesFilter,
		nonOkImagesFilter,
		setNonOkImagesFilter,
		okScriptsFilter,
		setOkScriptsFilter,
		nonOkScriptsFilter,
		setNonOkScriptsFilter,
		okStylesheetsFilter,
		setOkStylesheetsFilter,
		nonOkStylesheetsFilter,
		setNonOkStylesheetsFilter,
		securedImagesFilter,
		setSecuredImagesFilter,
		unsecuredImagesFilter,
		setUnsecuredImagesFilter,
		securedScriptsFilter,
		setSecuredScriptsFilter,
		unsecuredScriptsFilter,
		setUnsecuredScriptsFilter,
		securedStylesheetsFilter,
		setSecuredStylesheetsFilter,
		unsecuredStylesheetsFilter,
		setUnsecuredStylesheetsFilter,
		tlsStatusFilter,
		setTlsStatusFilter,
		imagesTlsStatusFilter,
		setImagesTlsStatusFilter,
		scriptsTlsStatusFilter,
		setScriptsTlsStatusFilter,
		stylesheetsTlsStatusFilter,
		setStylesheetsTlsStatusFilter
	} = FilterData();

	// Custom context
	const { isComponentReady } = useContext(SiteCrawlerAppContext);

	// SWR hooks
	const { user } = useUser();

	// Router
	const { query, asPath, push } = useRouter();

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	// Custom variables
	let filterType = isSitesFilter
		? "sites"
		: isSitesLinksFilter
		? "links"
		: isSitesPagesFilter
		? "pages"
		: isSitesImagesFilter
		? "images"
		: isSitesSeoFilter
		? "seo"
		: null;

	// Custom hooks
	const { linksPerPage, setPagePath } = useSiteQueries();
	const { scanApiEndpoint, filterQueryString } = useScanApiEndpoint(linksPerPage);

	// Handle filter URLs
	const handleFilterUrl = (e) => {
		const filterValue = e.target.value;
		const filterChecked = e.target.checked;

		let newPath = asPath;
		newPath = handleRemoveUrlParameter(newPath, "page");

		if (filterType === "links") {
			if (filterValue === "linksWithIssues" && filterChecked) {
				setLinksWithIssuesFilter(true);
				setInternalLinksFilter(false);
				setExternalLinksFilter(false);
				setNonWebLinksFilter(false);
				setNoLinkIssuesFilter(false);
				setAllLinksFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "status");

				if (newPath.includes("?")) newPath += `&status__neq=OK`;
				else newPath += `?status__neq=OK`;
			} else if (filterValue === "linksWithIssues" && !filterChecked) {
				filterQueryString?.delete("status__neq") ?? null;

				if (newPath.includes("status__neq")) newPath = handleRemoveUrlParameter(newPath, "status__neq");

				setLinksWithIssuesFilter(false);
			}

			if (filterValue === "noLinkIssues" && filterChecked) {
				setLinksWithIssuesFilter(false);
				setInternalLinksFilter(false);
				setExternalLinksFilter(false);
				setNonWebLinksFilter(false);
				setNoLinkIssuesFilter(true);
				setAllLinksFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "status__neq");

				if (newPath.includes("?")) newPath += `&status=OK`;
				else newPath += `?status=OK`;
			} else if (filterValue === "noLinkIssues" && !filterChecked) {
				filterQueryString?.delete("status") ?? null;

				if (newPath.includes("status")) newPath = handleRemoveUrlParameter(newPath, "status");

				setNoLinkIssuesFilter(false);
			}

			if (filterValue === "internalLinks" && filterChecked) {
				setInternalLinksFilter(true);
				setExternalLinksFilter(false);
				setNonWebLinksFilter(false);
				setAllLinksFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "type");

				if (newPath.includes("?")) newPath += `&type=PAGE`;
				else newPath += `?type=PAGE`;
			} else if (filterValue === "internalLinks" && !filterChecked) {
				filterQueryString?.delete("type") ?? null;

				if (newPath.includes("type")) newPath = handleRemoveUrlParameter(newPath, "type");

				setInternalLinksFilter(false);
			}

			if (filterValue === "externalLinks" && filterChecked) {
				setInternalLinksFilter(false);
				setExternalLinksFilter(true);
				setNonWebLinksFilter(false);
				setAllLinksFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "type");

				if (newPath.includes("?")) newPath += `&type=EXTERNAL`;
				else newPath += `?type=EXTERNAL`;
			} else if (filterValue === "externalLinks" && !filterChecked) {
				filterQueryString?.delete("type") ?? null;

				if (newPath.includes("type")) newPath = handleRemoveUrlParameter(newPath, "type");

				setExternalLinksFilter(false);
			}

			if (filterValue === "nonWebLinks" && filterChecked) {
				setNonWebLinksFilter(true);
				setInternalLinksFilter(false);
				setExternalLinksFilter(false);
				setAllLinksFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "type");

				if (newPath.includes("?")) newPath += `&type=NON_WEB`;
				else newPath += `?type=NON_WEB`;
			} else if (filterValue === "nonWebLinks" && !filterChecked) {
				filterQueryString?.delete("type") ?? null;

				if (newPath.includes("type")) newPath = handleRemoveUrlParameter(newPath, "type");

				setNonWebLinksFilter(false);
			}

			if (filterValue === "allLinks" && filterChecked) {
				setAllLinksFilter(true);
				setLinksWithIssuesFilter(false);
				setNoLinkIssuesFilter(false);
				setExternalLinksFilter(false);
				setInternalLinksFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "status");
				newPath = handleRemoveUrlParameter(newPath, "status__neq");
				newPath = handleRemoveUrlParameter(newPath, "type");
			}
		} else if (filterType === "pages") {
			if (filterValue === "tlsStatus" && filterChecked) {
				setAllPagesFilter(false);
				setTlsStatusFilter(true);
				setImagesTlsStatusFilter(false);
				setScriptsTlsStatusFilter(false);
				setStylesheetsTlsStatusFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "tls_images");
				newPath = handleRemoveUrlParameter(newPath, "tls_scripts");
				newPath = handleRemoveUrlParameter(newPath, "tls_stylesheets");

				if (newPath.includes("?")) newPath += `&tls_status=true`;
				else newPath += `?tls_status=true`;
			} else if (filterValue === "tlsStatus" && !filterChecked) {
				filterQueryString?.delete("tls_status") ?? null;

				if (newPath.includes("tls_status")) newPath = handleRemoveUrlParameter(newPath, "tls_status");

				setTlsStatusFilter(false);
			}

			if (filterValue === "imagesTlsStatus" && filterChecked) {
				setAllPagesFilter(false);
				setTlsStatusFilter(false);
				setImagesTlsStatusFilter(true);
				setScriptsTlsStatusFilter(false);
				setStylesheetsTlsStatusFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "tls_status");
				newPath = handleRemoveUrlParameter(newPath, "tls_scripts");
				newPath = handleRemoveUrlParameter(newPath, "tls_stylesheets");

				if (newPath.includes("?")) newPath += `&tls_images=true`;
				else newPath += `?tls_images=true`;
			} else if (filterValue === "imagesTlsStatus" && !filterChecked) {
				filterQueryString?.delete("tls_images") ?? null;

				if (newPath.includes("tls_images")) newPath = handleRemoveUrlParameter(newPath, "tls_images");

				setImagesTlsStatusFilter(false);
			}

			if (filterValue === "scriptsTlsStatus" && filterChecked) {
				setAllPagesFilter(false);
				setTlsStatusFilter(false);
				setImagesTlsStatusFilter(false);
				setScriptsTlsStatusFilter(true);
				setStylesheetsTlsStatusFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "tls_status");
				newPath = handleRemoveUrlParameter(newPath, "tls_images");
				newPath = handleRemoveUrlParameter(newPath, "tls_stylesheets");

				if (newPath.includes("?")) newPath += `&tls_scripts=true`;
				else newPath += `?tls_scripts=true`;
			} else if (filterValue === "scriptsTlsStatus" && !filterChecked) {
				filterQueryString?.delete("tls_scripts") ?? null;

				if (newPath.includes("tls_scripts")) newPath = handleRemoveUrlParameter(newPath, "tls_scripts");

				setScriptsTlsStatusFilter(false);
			}

			if (filterValue === "stylesheetsTlsStatus" && filterChecked) {
				setAllPagesFilter(false);
				setTlsStatusFilter(false);
				setImagesTlsStatusFilter(false);
				setScriptsTlsStatusFilter(false);
				setStylesheetsTlsStatusFilter(true);

				newPath = handleRemoveUrlParameter(newPath, "tls_status");
				newPath = handleRemoveUrlParameter(newPath, "tls_images");
				newPath = handleRemoveUrlParameter(newPath, "tls_scripts");

				if (newPath.includes("?")) newPath += `&tls_stylesheets=true`;
				else newPath += `?tls_stylesheets=true`;
			} else if (filterValue === "stylesheetsTlsStatus" && !filterChecked) {
				filterQueryString?.delete("tls_stylesheets") ?? null;

				if (newPath.includes("tls_stylesheets")) newPath = handleRemoveUrlParameter(newPath, "tls_stylesheets");

				setStylesheetsTlsStatusFilter(false);
			}

			if (filterValue === "allPages" && filterChecked) {
				setAllPagesFilter(true);
				setTlsStatusFilter(false);
				setImagesTlsStatusFilter(false);
				setScriptsTlsStatusFilter(false);
				setStylesheetsTlsStatusFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "tls_status");
				newPath = handleRemoveUrlParameter(newPath, "tls_images");
				newPath = handleRemoveUrlParameter(newPath, "tls_scripts");
				newPath = handleRemoveUrlParameter(newPath, "tls_stylesheets");
			}
		} else {
			// Sites filter
			if (filterValue === "verified" && filterChecked) {
				setVerifiedFilter(true);
				setUnverifiedFilter(false);
				setAllSitesFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "verified=false");

				if (newPath.includes("?")) newPath += `&verified`;
				else newPath += `?verified`;
			} else if (filterValue === "verified" && !filterChecked) {
				filterQueryString?.delete("verified") ?? null;

				if (newPath.includes("verified")) newPath = handleRemoveUrlParameter(newPath, "verified");

				setVerifiedFilter(false);
			}

			if (filterValue === "unverified" && filterChecked) {
				setVerifiedFilter(false);
				setUnverifiedFilter(true);
				setAllSitesFilter(false);

				newPath = handleRemoveUrlParameter(newPath, "verified");

				if (newPath.includes("?")) newPath += `&verified=false`;
				else newPath += `?verified=false`;
			} else if (filterValue === "unverified" && !filterChecked) {
				filterQueryString?.delete("verified") ?? null;

				if (newPath.includes("verified")) newPath = handleRemoveUrlParameter(newPath, "verified");

				setUnverifiedFilter(false);
			}

			if (filterValue === "allSites" && filterChecked) {
				setVerifiedFilter(false);
				setUnverifiedFilter(false);
				setAllSitesFilter(true);

				newPath = handleRemoveUrlParameter(newPath, "verified");
			}
		}

		if (newPath.includes("?")) setPagePath(`${newPath}&`);
		else setPagePath(`${newPath}?`);

		// Push new path
		push(newPath);

		// Mutate function here
		mutate(scanApiEndpoint, false);
	};

	// Handle filters on load
	useEffect(() => {
		if (filterQueryString) {
			if (filterType === "links") {
				if (filterQueryString.has("status__neq=OK")) {
					setLinksWithIssuesFilter(true);
				} else {
					setLinksWithIssuesFilter(false);
				}

				if (filterQueryString.has("status=OK")) {
					setNoLinkIssuesFilter(true);
				} else {
					setNoLinkIssuesFilter(false);
				}

				if (filterQueryString.has("type") === "PAGE") {
					setInternalLinksFilter(true);
				} else {
					setInternalLinksFilter(false);
				}

				if (filterQueryString.has("type") === "EXTERNAL") {
					setExternalLinksFilter(true);
				} else {
					setExternalLinksFilter(false);
				}

				if (filterQueryString.has("type") === "EXTERNALOTHER") {
					setExternalLinksFilter(true);
				} else {
					setExternalLinksFilter(false);
				}

				if (filterQueryString.has("type") === "NON_WEB") {
					setNonWebLinksFilter(true);
				} else {
					setNonWebLinksFilter(false);
				}

				if (
					!filterQueryString.has("type") &&
					!filterQueryString.has("status") &&
					!filterQueryString.has("status__neq")
				) {
					setAllLinksFilter(true);
				} else {
					setAllLinksFilter(false);
				}

				return {
					noLinkIssuesFilter,
					linksWithIssuesFilter,
					internalLinksFilter,
					externalLinksFilter,
					nonWebLinksFilter,
					allLinksFilter
				};
			} else if (filterType === "pages") {
				if (filterQueryString.has("tls_status")) {
					setTlsStatusFilter(true);
				} else {
					setTlsStatusFilter(false);
				}

				if (filterQueryString.has("tls_images")) {
					setImagesTlsStatusFilter(true);
				} else {
					setImagesTlsStatusFilter(false);
				}

				if (filterQueryString.has("tls_scripts")) {
					setScriptsTlsStatusFilter(true);
				} else {
					setScriptsTlsStatusFilter(false);
				}

				if (filterQueryString.has("tls_stylesheets")) {
					setStylesheetsTlsStatusFilter(true);
				} else {
					setStylesheetsTlsStatusFilter(false);
				}

				if (
					!filterQueryString.has("tls_status") &&
					!filterQueryString.has("tls_images") &&
					!filterQueryString.has("tls_scripts") &&
					!filterQueryString.has("tls_stylesheets")
				) {
					setAllPagesFilter(true);
				} else {
					setAllPagesFilter(false);
				}

				return {
					tlsStatusFilter,
					imagesTlsStatusFilter,
					scriptsTlsStatusFilter,
					stylesheetsTlsStatusFilter,
					allPagesFilter
				};
			} else {
				const verified = handleConversionStringToBoolean(query.verified);

				if (filterQueryString.has("verified=true")) {
					setVerifiedFilter(true);
				} else {
					setVerifiedFilter(false);
				}

				if (filterQueryString.has("verified=false")) {
					setUnverifiedFilter(true);
				} else {
					setUnverifiedFilter(false);
				}

				if (!filterQueryString.has("verified")) {
					setAllSitesFilter(true);
				} else {
					setAllSitesFilter(false);
				}

				return {
					verifiedFilter,
					unverifiedFilter,
					allSitesFilter
				};
			}
		}
	}, []);

	return isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
		<form tw="px-4 py-5 border border-gray-300 sm:px-6 bg-white rounded-lg lg:flex lg:justify-between">
			<div tw="-ml-4 lg:-mt-2 lg:flex items-center flex-wrap sm:flex-nowrap">
				<h4 tw="ml-4 mb-4 lg:mb-0 mt-2 mr-1 leading-4 font-semibold text-gray-600">{filterText}</h4>

				{filtersArray
					.filter(
						(e) =>
							e.type === filterType &&
							e.value !== "allSites" &&
							e.value !== "allLinks" &&
							e.value !== "allPages" &&
							e.value !== "allImages" &&
							e.value !== "allSeo"
					)
					.map((value, key) => (
						<div key={key} tw="ml-4 mt-2">
							<label tw="flex items-center space-x-2">
								<input
									type="checkbox"
									tw="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
									checked={value.checked}
									onChange={handleFilterUrl}
									value={value.value}
								/>
								<span tw="ml-2 text-left text-xs leading-4 font-normal text-gray-500">{value.label}</span>
							</label>
						</div>
					))}
			</div>

			<div tw="lg:-mt-2 lg:flex items-center justify-end flex-wrap sm:flex-nowrap space-x-4">
				{filtersArray
					.filter(
						(e) =>
							e.type === filterType &&
							(e.value === "allSites" ||
								e.value === "allLinks" ||
								e.value === "allPages" ||
								e.value === "allImages" ||
								e.value === "allSeo")
					)
					.map((value, key) => (
						<div key={key} tw="ml-4 mt-2">
							<label tw="flex items-center space-x-2">
								<input
									type="checkbox"
									tw="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
									checked={value.checked}
									onChange={handleFilterUrl}
									value={value.value}
								/>
								<span tw="text-left text-xs leading-4 font-normal text-gray-500">{value.label}</span>
							</label>
						</div>
					))}
			</div>
		</form>
	) : (
		<div tw="px-4 py-5 border border-gray-300 sm:px-6 bg-white rounded-lg lg:flex lg:justify-between">
			<div tw="-ml-4 lg:-mt-2 lg:flex items-center flex-wrap sm:flex-nowrap">
				<Skeleton duration={2} width={50} height={16} tw="my-4 ml-4 mr-1 lg:mb-0" />

				{filtersArray
					.filter(
						(e) =>
							e.type === filterType &&
							e.value !== "allSites" &&
							e.value !== "allLinks" &&
							e.value !== "allPages" &&
							e.value !== "allImages" &&
							e.value !== "allSeo"
					)
					.map((value, key) => (
						<div key={key} tw="ml-4 mt-2">
							<div tw="flex items-center space-x-2">
								<Skeleton duration={2} width={16} height={16} tw="h-4 w-4 rounded" />
								<Skeleton duration={2} width={100} height={16} tw="ml-2" />
							</div>
						</div>
					))}
			</div>

			<div tw="lg:-mt-2 lg:flex items-center justify-end flex-wrap sm:flex-nowrap space-x-4">
				{filtersArray
					.filter(
						(e) =>
							e.type === filterType &&
							(e.value === "allSites" ||
								e.value === "allLinks" ||
								e.value === "allPages" ||
								e.value === "allImages" ||
								e.value === "allSeo")
					)
					.map((value, key) => (
						<div key={key} tw="ml-4 mt-2">
							<div tw="flex items-center space-x-2">
								<Skeleton duration={2} width={16} height={16} tw="h-4 w-4 rounded" />
								<Skeleton duration={2} width={100} height={16} tw="ml-2" />
							</div>
						</div>
					))}
			</div>
		</div>
	);
};

/**
 * Memoized custom `Filter` component
 */
export const MemoizedFilter = memo(Filter);