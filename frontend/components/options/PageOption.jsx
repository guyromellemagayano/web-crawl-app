import { MemoizedFilter } from "@components/filters";
import { MemoizedSiteVerifyErrorModal } from "@components/modals/SiteVerifyErrorModal";
import { MemoizedUpgradeErrorModal } from "@components/modals/UpgradeErrorModal";
import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import { RedirectInterval } from "@constants/GlobalValues";
import { ScanSlug, SiteImageSlug, SiteLinkSlug, SitePageSlug } from "@constants/PageLinks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DocumentTextIcon, ExternalLinkIcon, LinkIcon } from "@heroicons/react/outline";
import { CheckCircleIcon, DownloadIcon, GlobeIcon } from "@heroicons/react/solid";
import { useComponentVisible } from "@hooks/useComponentVisible";
import { useImages } from "@hooks/useImages";
import { useLinks } from "@hooks/useLinks";
import { usePages } from "@hooks/usePages";
import { useScanApiEndpoint } from "@hooks/useScanApiEndpoint";
import { useSiteQueries } from "@hooks/useSiteQueries";
import { useSites } from "@hooks/useSites";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classnames } from "@utils/classnames";
import { handleConversionStringToLowercase } from "@utils/convertCase";
import dayjs from "dayjs";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { memo, useContext, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Custom function to render the `PageOption` component
 *
 * @param {boolean} isOverview
 * @param {boolean} isImages
 * @param {boolean} isLinks
 * @param {boolean} isPages
 * @param {boolean} isSites
 * @param {boolean} isSiteSettings
 */
const PageOption = ({
	isOverview = false,
	isImages = false,
	isLinks = false,
	isPages = false,
	isSites = false,
	isSiteSettings = false
}) => {
	const [isDownloading, setIsDownloading] = useState(false);

	// Translations
	const { t } = useTranslation();
	const linkText = t("sites:link");
	const linksText = t("sites:links");
	const siteText = t("sites:site");
	const sitesText = t("sites:sites");
	const pagesText = t("sites:pages");
	const imagesText = t("sites:images");
	const csvDownloadText = t("sites:csvDownload");
	const crawlingText = t("sites:crawling");
	const crawlText = t("sites:crawlSite");
	const downloadingText = t("sites:downloading");
	const siteCrawlingInProcessText = t("sites:siteCrawlingInProcess");
	const noAvailableSitesText = t("sites:noAvailableSites");
	const noAvailablePagesText = t("sites:noAvailablePages");
	const noAvailableImagesText = t("sites:noAvailableImages");
	const noAvailableLinksText = t("sites:noAvailableLinks");
	const verifiedText = t("sites:verified");
	const unverifiedText = t("sites:unverified");

	// Router
	const { asPath } = useRouter();

	// Custom hooks
	const {
		ref: upgradeErrorModalRef,
		isComponentVisible: isUpgradeErrorModalVisible,
		setIsComponentVisible: setIsUpgradeErrorModalVisible
	} = useComponentVisible(false);
	const {
		ref: siteVerifyErrorModalRef,
		isComponentVisible: isSiteVerifyErrorModalVisible,
		setIsComponentVisible: setIsSiteVerifyErrorModalVisible
	} = useComponentVisible(false);

	// Custom context
	const {
		isComponentReady,
		querySiteId,
		queryLinkId,
		queryPageId,
		queryImageId,
		user,
		siteId,
		scan,
		previousScan,
		scanObjId,
		selectedSiteRef,
		isCrawlStarted,
		isCrawlFinished,
		handleCrawl,
		isProcessing
	} = useContext(SiteCrawlerAppContext);

	// Helper functions
	const { linksPerPage } = useSiteQueries();
	const { scanApiEndpoint, queryString } = useScanApiEndpoint(linksPerPage);

	const { sites } = useSites(scanApiEndpoint);
	const { links } = useLinks(scanApiEndpoint);
	const { pages } = usePages(scanApiEndpoint);
	const { images } = useImages(scanApiEndpoint);

	// Custom variables
	const disableLocalTime = user?.data?.settings?.disableLocalTime ?? false;
	const permissions = user?.data?.permissions ?? null;
	const siteIdVerified = siteId?.data?.verified ?? null;
	const currentSiteId = siteId?.data?.id ?? null;
	const siteName = siteId?.data?.name ?? null;
	const siteUrl = siteId?.data?.url ?? null;
	const scanCount = scan?.data?.count ?? null;
	const scanResults = scan?.data?.results ?? null;
	const sitesCount = sites?.data?.count ?? null;
	const sitesResults = sites?.data?.results ?? null;
	const linksCount = links?.data?.count ?? null;
	const linksResults = links?.data?.results ?? null;
	const pagesCount = pages?.data?.count ?? null;
	const pagesResults = pages?.data?.results ?? null;
	const imagesCount = images?.data?.count ?? null;
	const imagesResults = images?.data?.results ?? null;
	const previousScanFinishedAt = previousScan?.finished_at ?? null;

	let handleCrawlEndpoint = SitesApiEndpoint + currentSiteId;

	const calendar = require("dayjs/plugin/calendar");
	const timezone = require("dayjs/plugin/timezone");
	const utc = require("dayjs/plugin/utc");

	dayjs.extend(calendar);
	dayjs.extend(utc);
	dayjs.extend(timezone);

	const calendarStrings = {
		lastDay: "[Yesterday], dddd [at] hh:mm:ss A",
		lastWeek: "MMMM DD, YYYY [at] hh:mm:ss A",
		sameDay: "[Today], dddd [at] hh:mm:ss A",
		sameElse: "MMMM DD, YYYY [at] hh:mm:ss A"
	};

	// Custom functions
	const handleCsvDownload = (e) => {
		e.preventDefault();

		const timeout = setTimeout(() => {
			setIsDownloading(false);
		}, RedirectInterval);

		setIsDownloading(!isDownloading);

		if (!isDownloading) {
			let downloadLink = "";

			const pageSlug = isLinks ? SiteLinkSlug : isPages ? SitePageSlug : isImages ? SiteImageSlug : "/";
			const querySlug = queryLinkId
				? queryLinkId + "/"
				: queryPageId
				? queryPageId + "/"
				: queryImageId
				? queryImageId + "/"
				: "";

			downloadLink += SitesApiEndpoint;
			downloadLink += querySiteId;
			downloadLink += ScanSlug;
			downloadLink += scanObjId;
			downloadLink += pageSlug;
			downloadLink += querySlug;
			downloadLink += "?format=csv";
			downloadLink += queryString;

			window.location.assign(downloadLink);
		}

		return () => clearTimeout(timeout);
	};

	return (
		<div className="flex-none bg-white px-4 sm:px-6 md:flex md:items-center md:justify-between md:px-0 xl:sticky xl:top-0 xl:z-50 xl:pt-4">
			{!isSites && !isSiteSettings ? (
				<>
					<MemoizedUpgradeErrorModal
						ref={upgradeErrorModalRef}
						showModal={isUpgradeErrorModalVisible}
						setShowModal={setIsUpgradeErrorModalVisible}
					/>

					<MemoizedSiteVerifyErrorModal
						ref={siteVerifyErrorModalRef}
						showModal={isSiteVerifyErrorModalVisible}
						setShowModal={setIsSiteVerifyErrorModalVisible}
					/>
				</>
			) : null}

			<div ref={selectedSiteRef} className="min-w-0 flex-1">
				<div className="mt-4 mb-8 flex flex-col sm:mt-2 sm:flex-row sm:flex-wrap sm:space-x-6 md:justify-between">
					<div className="mt-2 flex justify-start space-x-6">
						{!isSites ? (
							<>
								<div className="flex items-center space-x-2 text-sm text-gray-500">
									{isComponentReady && siteId ? (
										<>
											<GlobeIcon className="h-4 w-4 flex-shrink-0 text-gray-400" aria-hidden="true" />
											<span className="text-sm font-semibold leading-5 text-gray-500">
												<a
													href={siteUrl}
													target="_blank"
													title={siteName}
													className="truncate-link max-w-lg truncate hover:text-gray-900"
													rel="noreferrer"
												>
													{siteName}
												</a>
											</span>
										</>
									) : (
										<>
											<Skeleton duration={2} width={20} height={20} className="flex-shrink-0" />
											<Skeleton duration={2} width={60} height={20} />
										</>
									)}
								</div>

								{!isOverview ? (
									<div className="flex items-center space-x-2 text-sm text-gray-500">
										{isComponentReady && siteId ? (
											<>
												<CheckCircleIcon className="h-4 w-4 flex-shrink-0 text-gray-400" aria-hidden="true" />
												<span className="text-sm leading-5 text-gray-500">
													{siteIdVerified ? verifiedText : unverifiedText}
												</span>
											</>
										) : (
											<>
												<Skeleton duration={2} width={20} height={20} className="flex-shrink-0" />
												<Skeleton duration={2} width={60} height={20} />
											</>
										)}
									</div>
								) : null}

								<div className="flex items-center space-x-2 text-sm text-gray-500">
									{isComponentReady && scanCount && scanResults?.length > 0 ? (
										<>
											<FontAwesomeIcon
												icon={["fas", "spider"]}
												className="h-4 w-4 flex-shrink-0 text-gray-400"
												aria-hidden="true"
											/>
											<span className="text-sm leading-5 text-gray-500">
												{scanCount > 1 ? (
													!disableLocalTime ? (
														dayjs(previousScanFinishedAt).calendar(null, calendarStrings)
													) : (
														dayjs.utc(previousScanFinishedAt).calendar(null, calendarStrings)
													)
												) : scanCount === 1 && isCrawlStarted && !isCrawlFinished ? (
													<span className="text-sm leading-5 text-gray-500">{siteCrawlingInProcessText}</span>
												) : !disableLocalTime ? (
													dayjs(previousScanFinishedAt).calendar(null, calendarStrings)
												) : (
													dayjs.utc(previousScanFinishedAt).calendar(null, calendarStrings)
												)}
											</span>
										</>
									) : (
										<>
											<Skeleton duration={2} width={20} height={20} className="flex-shrink-0" />
											<Skeleton duration={2} width={60} height={20} />
										</>
									)}
								</div>
							</>
						) : null}

						{isComponentReady ? (
							<div className="flex items-center space-x-2 text-sm text-gray-500">
								{isComponentReady && isLinks && !queryLinkId ? (
									<>
										<LinkIcon className="h-4 w-4 flex-shrink-0 text-gray-400" aria-hidden="true" />
										<span className="text-sm leading-5 text-gray-500">
											{linksCount > 1
												? linksCount + " " + handleConversionStringToLowercase(linksText)
												: linksCount === 1
												? linksCount + " " + linkText
												: noAvailableLinksText}
										</span>
									</>
								) : isComponentReady && isSites ? (
									<>
										<ExternalLinkIcon className="h-4 w-4 flex-shrink-0 text-gray-400" aria-hidden="true" />
										<span className="text-sm leading-5 text-gray-500">
											{sitesCount > 1
												? sitesCount + " " + handleConversionStringToLowercase(sitesText)
												: sitesCount === 1
												? sitesCount + " " + siteText
												: noAvailableSitesText}
										</span>
									</>
								) : isComponentReady && isPages && !queryPageId ? (
									<>
										<DocumentTextIcon className="h-4 w-4 flex-shrink-0 text-gray-400" aria-hidden="true" />
										<span className="text-sm leading-5 text-gray-500">
											{pagesCount > 1
												? pagesCount + " " + handleConversionStringToLowercase(pagesText)
												: pagesCount === 1
												? pagesCount + " " + siteText
												: noAvailablePagesText}
										</span>
									</>
								) : isComponentReady && isImages && !queryImageId ? (
									<>
										<DocumentTextIcon className="h-4 w-4 flex-shrink-0 text-gray-400" aria-hidden="true" />
										<span className="text-sm leading-5 text-gray-500">
											{imagesCount > 1
												? imagesCount + " " + handleConversionStringToLowercase(imagesText)
												: imagesCount === 1
												? imagesCount + " " + siteText
												: noAvailableImagesText}
										</span>
									</>
								) : (isComponentReady && isOverview) || (isComponentReady && isSiteSettings) ? null : !isLinks ||
								  !isPages ||
								  !isImages ? null : (
									<>
										<Skeleton duration={2} width={20} height={20} className="flex-shrink-0" />
										<Skeleton duration={2} width={60} height={20} />
									</>
								)}
							</div>
						) : null}
					</div>

					{!isSites ? (
						<div className="mt-4 flex md:mt-0 md:ml-4">
							{isComponentReady && (isCrawlStarted || !isCrawlStarted || isCrawlFinished || !isCrawlFinished) ? (
								permissions &&
								permissions?.includes("can_start_scan") &&
								permissions?.includes("can_see_pages") &&
								permissions?.includes("can_see_scripts") &&
								permissions?.includes("can_see_stylesheets") &&
								permissions?.includes("can_see_images") ? (
									siteIdVerified ? (
										<button
											type="button"
											disabled={(isCrawlStarted && !isCrawlFinished) || isProcessing}
											onClick={(e) => handleCrawl(e, handleCrawlEndpoint)}
											className={classnames(
												"inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm ",
												(isCrawlStarted && !isCrawlFinished) || isProcessing
													? "cursor-not-allowed bg-green-500 opacity-50"
													: "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
											)}
										>
											<span className="flex items-center space-x-2">
												<FontAwesomeIcon icon={["fas", "spider"]} className="h-4 w-4 text-white" />
												<span>{isProcessing || (isCrawlStarted && !isCrawlFinished) ? crawlingText : crawlText}</span>
											</span>
										</button>
									) : !siteIdVerified ? (
										<button
											type="button"
											onClick={(e) => setIsSiteVerifyErrorModalVisible(!isSiteVerifyErrorModalVisible)}
											className="ml-2 inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
										>
											<span className="flex items-center space-x-2">
												<FontAwesomeIcon icon={["fas", "spider"]} className="h-4 w-4 text-white" />
												<span>{crawlText}</span>
											</span>
										</button>
									) : (
										<Skeleton duration={2} width={150} height={40} className="ml-2" />
									)
								) : (
									<button
										type="button"
										onClick={(e) => setIsUpgradeErrorModalVisible(!isUpgradeErrorModalVisible)}
										className="ml-2 inline-flex items-center rounded-md border border-transparent bg-yellow-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
									>
										<span className="flex items-center space-x-2">
											<FontAwesomeIcon icon={["fas", "crown"]} className="h-4 w-4 text-white" />
											<span>{crawlText}</span>
										</span>
									</button>
								)
							) : (
								<Skeleton duration={2} width={150} height={40} />
							)}

							{!isOverview && !isSiteSettings ? (
								isComponentReady && (linksCount > 0 || sitesCount > 0 || pagesCount > 0 || imagesCount > 0) ? (
									<button
										type="button"
										disabled={isDownloading}
										className={classnames(
											"ml-2 inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm",
											isDownloading
												? "cursor-not-allowed bg-indigo-500 opacity-50"
												: "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
										)}
										onClick={handleCsvDownload}
									>
										<span className="flex items-center space-x-2">
											<DownloadIcon className="h-4 w-4 text-white" />
											<span>{isDownloading ? downloadingText : csvDownloadText}</span>
										</span>
									</button>
								) : isComponentReady &&
								  (linksCount === 0 || sitesCount === 0 || pagesCount === 0 || imagesCount === 0) ? null : (
									<Skeleton duration={2} width={150} height={40} className="ml-2" />
								)
							) : null}
						</div>
					) : null}
				</div>

				{isLinks && !queryLinkId ? (
					<MemoizedFilter isSitesLinksFilter />
				) : isPages && !queryPageId ? (
					<MemoizedFilter isSitesPagesFilter />
				) : isImages && !queryImageId ? (
					<MemoizedFilter isSitesImagesFilter />
				) : isSites ? (
					<MemoizedFilter isSitesFilter />
				) : null}
			</div>
		</div>
	);
};

PageOption.propTypes = {
	isImages: PropTypes.bool,
	isLinks: PropTypes.bool,
	isOverview: PropTypes.bool,
	isPages: PropTypes.bool,
	isSiteSettings: PropTypes.bool,
	isSites: PropTypes.bool
};

/**
 * Memoized custom `PageOption` component
 */
export const MemoizedPageOption = memo(PageOption);
