// import { MemoizedFilter } from "@components/filters";
import { MemoizedSiteVerifyErrorModal } from "@components/modals/SiteVerifyErrorModal";
import { MemoizedUpgradeErrorModal } from "@components/modals/UpgradeErrorModal";
import { RedirectInterval } from "@constants/GlobalValues";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DocumentTextIcon, ExternalLinkIcon, LinkIcon } from "@heroicons/react/outline";
import { DownloadIcon, GlobeIcon } from "@heroicons/react/solid";
import { useComponentVisible } from "@hooks/useComponentVisible";
import { useImages } from "@hooks/useImages";
import { useLinks } from "@hooks/useLinks";
import { usePages } from "@hooks/usePages";
import { useScan } from "@hooks/useScan";
import { useScanApiEndpoint } from "@hooks/useScanApiEndpoint";
import { useSiteId } from "@hooks/useSiteId";
import { useSiteQueries } from "@hooks/useSiteQueries";
import { useSites } from "@hooks/useSites";
import { useUser } from "@hooks/useUser";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classnames } from "@utils/classnames";
import { handleConversionStringToLowercase, handleConversionStringToNumber } from "@utils/convertCase";
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
 * @param {boolean} isImages
 * @param {boolean} isLinks
 * @param {boolean} isPages
 * @param {boolean} isSites
 */
const PageOption = ({ isImages = false, isLinks = false, isPages = false, isSites = false }) => {
	const [isDownloading, setIsDownloading] = useState(false);

	// Translations
	const { t } = useTranslation();
	const linkText = t("sites:link");
	const linksText = t("sites:links");
	const siteText = t("sites:site");
	const sitesText = t("sites:sites");
	const pagesText = t("sites:pages");
	const csvDownloadText = t("sites:csvDownload");
	const crawlingText = t("sites:crawling");
	const crawlText = t("sites:crawlSite");
	const downloadingText = t("sites:downloading");
	const siteCrawlingInProcessText = t("sites:siteCrawlingInProcess");

	// Custom context
	const { isComponentReady } = useContext(SiteCrawlerAppContext);

	// Router
	const { query, asPath } = useRouter();
	const { siteId } = query;

	// Custom variables
	const sanitizedSiteId = handleConversionStringToNumber(siteId);

	// Helper functions
	const { linksPerPage } = useSiteQueries();
	const {
		scanObjId,
		currentScan,
		previousScan,
		handleCrawl,
		scanCount,
		isCrawlStarted,
		isCrawlFinished,
		isProcessing,
		selectedSiteRef
	} = useScan(sanitizedSiteId);
	const { scanApiEndpoint, queryString } = useScanApiEndpoint(linksPerPage);

	// SWR hooks
	const { user, disableLocalTime, permissions } = useUser();
	const { siteIdVerified, siteName, siteUrl } = useSiteId(sanitizedSiteId);
	const { sitesCount, sitesResults, validatingSites } = useSites(scanApiEndpoint);
	const { linksCount, linksResults, validatingLinks } = useLinks(scanApiEndpoint, sanitizedSiteId, scanObjId);
	const { pagesCount, pagesResults, validatingPages } = usePages(scanApiEndpoint, sanitizedSiteId, scanObjId);
	const { imagesCount, imagesResults, validatingImages } = useImages(scanApiEndpoint, sanitizedSiteId, scanObjId);

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
			const downloadLink = `/api/site/${siteId}/scan/${scanObjId}/${
				isLinks ? "link" : isPages ? "page" : isImages ? "image" : null
			}/?format=csv${queryString}`;

			window.location.assign(downloadLink);
		}

		return () => {
			clearTimeout(timeout);
		};
	};

	return (
		<div
			className={classnames(
				(isLinks && linksCount > 0 && linksResults?.length > 0) ||
					(isSites && sitesCount > 0 && sitesResults?.length > 0) ||
					(isPages && pagesCount > 0 && pagesResults?.length > 0) ||
					(isImages && imagesCount > 0 && imagesResults?.length > 0)
					? "flex-none px-4 sm:px-6 md:flex md:items-center md:justify-between md:px-0"
					: "hidden"
			)}
		>
			{!isSites ? (
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
				<div className="flex mt-4 mb-8 flex-col sm:mt-2 sm:flex-row sm:flex-wrap sm:space-x-6 md:justify-between">
					<div className="flex mt-2 justify-start space-x-6">
						{!isSites ? (
							<>
								<div className="flex items-center space-x-2 text-sm text-gray-500">
									{isComponentReady &&
									user &&
									Math.round(user?.status / 100) === 2 &&
									!user?.data?.detail &&
									siteName &&
									siteUrl ? (
										<>
											<GlobeIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
											<span className="text-sm font-semibold leading-6 text-gray-500">
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

								<div className="flex items-center space-x-2 text-sm text-gray-500">
									{isComponentReady &&
									user &&
									Math.round(user?.status / 100) === 2 &&
									!user?.data?.detail &&
									scanCount &&
									(previousScan || currentScan) ? (
										<>
											<FontAwesomeIcon
												icon={["fas", "spider"]}
												className="h-5 w-5 flex-shrink-0 text-gray-400"
												aria-hidden="true"
											/>
											<span className="text-sm leading-6 text-gray-500">
												{scanCount > 1 ? (
													!disableLocalTime ? (
														dayjs(
															currentScan !== null ? previousScan?.finished_at : previousScan?.finished_at
														).calendar(null, calendarStrings)
													) : (
														dayjs
															.utc(currentScan !== null ? previousScan?.finished_at : previousScan?.finished_at)
															.calendar(null, calendarStrings)
													)
												) : scanCount === 1 && currentScan !== null ? (
													<span className="text-sm leading-5 text-gray-500">{siteCrawlingInProcessText}</span>
												) : !disableLocalTime ? (
													dayjs(previousScan?.finished_at).calendar(null, calendarStrings)
												) : (
													dayjs.utc(previousScan?.finished_at).calendar(null, calendarStrings)
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

						<div className="flex items-center space-x-2 text-sm text-gray-500">
							{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
								isLinks && linksCount > 0 ? (
									<>
										<LinkIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
										<span className="text-sm leading-6 text-gray-500">
											{linksCount > 1
												? linksCount + " " + handleConversionStringToLowercase(linksText)
												: linksCount + " " + linkText}
										</span>
									</>
								) : isSites && sitesCount > 0 ? (
									<>
										<ExternalLinkIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
										<span className="text-sm leading-6 text-gray-500">
											{sitesCount > 1
												? sitesCount + " " + handleConversionStringToLowercase(sitesText)
												: sitesCount + " " + siteText}
										</span>
									</>
								) : isPages && pagesCount > 0 ? (
									<>
										<DocumentTextIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
										<span className="text-sm leading-6 text-gray-500">
											{pagesCount > 1
												? pagesCount + " " + handleConversionStringToLowercase(pagesText)
												: pagesCount + " " + siteText}
										</span>
									</>
								) : null
							) : (
								<>
									<Skeleton duration={2} width={20} height={20} className="flex-shrink-0" />
									<Skeleton duration={2} width={60} height={20} />
								</>
							)}
						</div>
					</div>

					{!isSites ? (
						<div className="flex mt-4 md:mt-0 md:ml-4">
							{isComponentReady &&
							user &&
							Math.round(user?.status / 100) === 2 &&
							!user?.data?.detail &&
							(linksCount || sitesCount || pagesCount) &&
							(isCrawlStarted || !isCrawlStarted || isCrawlFinished || !isCrawlFinished) ? (
								permissions.includes("can_start_scan") &&
								permissions.includes("can_see_pages") &&
								permissions.includes("can_see_scripts") &&
								permissions.includes("can_see_stylesheets") &&
								permissions.includes("can_see_images") ? (
									siteIdVerified ? (
										<button
											type="button"
											disabled={(isCrawlStarted && !isCrawlFinished) || isProcessing}
											onClick={handleCrawl}
											className={classnames(
												"inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm ",
												(isCrawlStarted && !isCrawlFinished) || isProcessing
													? "cursor-not-allowed opacity-50"
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
											onClick={() => setIsSiteVerifyErrorModalVisible(!isSiteVerifyErrorModalVisible)}
											className="ml-2 inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
										>
											<span className="flex items-center space-x-2">
												<FontAwesomeIcon icon={["fas", "spider"]} className="h-4 w-4 text-white" />
												<span>{crawlText}</span>
											</span>
										</button>
									) : null
								) : (
									<button
										type="button"
										onClick={() => setIsUpgradeErrorModalVisible(!isUpgradeErrorModalVisible)}
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

							{!isSites ? (
								isComponentReady &&
								user &&
								Math.round(user?.status / 100) === 2 &&
								!user?.data?.detail &&
								(linksCount || sitesCount || pagesCount) ? (
									siteIdVerified ? (
										<button
											type="button"
											disabled={isDownloading}
											className={classnames(
												"ml-2 inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm",
												isDownloading
													? "cursor-not-allowed opacity-50"
													: "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
											)}
											onClick={handleCsvDownload}
										>
											<span className="flex items-center space-x-2">
												<DownloadIcon className="h-4 w-4 text-white" />
												<span>{isDownloading ? downloadingText : csvDownloadText}</span>
											</span>
										</button>
									) : !siteIdVerified ? (
										<button
											type="button"
											onClick={() => setIsSiteVerifyErrorModalVisible(!isSiteVerifyErrorModalVisible)}
											className="ml-2 inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
										>
											<span className="flex items-center space-x-2">
												<DownloadIcon className="h-4 w-4 text-white" />
												<span>{csvDownloadText}</span>
											</span>
										</button>
									) : null
								) : (
									<Skeleton duration={2} width={150} height={40} className="ml-2" />
								)
							) : null}
						</div>
					) : null}
				</div>

				{/* {isLinks ? (
					<MemoizedFilter isSitesLinksFilter />
				) : isPages ? (
					<MemoizedFilter isSitesPagesFilter />
				) : isImages ? (
					<MemoizedFilter isSitesImagesFilter />
				) : (
					<MemoizedFilter isSitesFilter />
				)} */}
			</div>
		</div>
	);
};

PageOption.propTypes = {
	isImages: PropTypes.bool,
	isLinks: PropTypes.bool,
	isPages: PropTypes.bool,
	isSites: PropTypes.bool
};

/**
 * Memoized custom `PageOption` component
 */
export const MemoizedPageOption = memo(PageOption);
