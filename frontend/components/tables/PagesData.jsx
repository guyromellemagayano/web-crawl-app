import { MemoizedSiteDanagerIcon } from "@components/icons/SiteDangerIcon";
import { MemoizedSiteSuccessIcon } from "@components/icons/SiteSuccessIcon";
import { useComponentVisible } from "@hooks/useComponentVisible";
import { usePageDetail } from "@hooks/usePageDetail";
import { useScan } from "@hooks/useScan";
import { useUser } from "@hooks/useUser";
import { SiteCrawlerAppContext } from "@pages/_app";
import { handleConversionStringToNumber } from "@utils/convertCase";
import bytes from "bytes";
import dayjs from "dayjs";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { memo, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "twin.macro";

/**
 * Custom function to render the `PagesData` component
 *
 * @param {object} link
 * @param {boolean} validatingPages
 */
const PagesData = ({ page = null, validatingPages = false }) => {
	// Site data props
	const pageId = page?.id ?? null;
	const pageUrl = page?.url ?? null;
	const pageTotalLinks = page?.num_links ?? null;
	const pageTotalImages = page?.num_images ?? null;
	const pageTotalScripts = page?.num_scripts ?? null;
	const pageTotalStylesheets = page?.num_stylesheets ?? null;
	const pageTotalSize = page?.size_total ?? null;
	const pageTlsStatus = page?.tls_status ?? null;
	const pageImagesTlsStatus = page?.tls_images ?? null;
	const pageScriptsTlsStatus = page?.tls_scripts ?? null;
	const pageStylesheetsTlsStatus = page?.tls_stylesheets ?? null;
	const pageTotalOkLinks = page?.num_ok_links ?? null;
	const pageTotalNonOkLinks = page?.num_non_ok_links ?? null;
	const pageTotalOkImages = page?.num_ok_images ?? null;
	const pageTotalNonOkImages = page?.num_non_ok_images ?? null;
	const pageTotalOkScripts = page?.num_ok_scripts ?? null;
	const pageTotalNonOkScripts = page?.num_non_ok_scripts ?? null;
	const pageTotalOkStylesheets = page?.num_ok_stylesheets ?? null;
	const pageTotalNonOkStylesheets = page?.num_non_ok_stylesheets ?? null;
	const pageTotalTlsImages = page?.num_tls_images ?? null;
	const pageTotalNonTlsImages = page?.num_non_tls_images ?? null;
	const pageTotalTlsScripts = page?.num_tls_scripts ?? null;
	const pageTotalNonTlsScripts = page?.num_non_tls_scripts ?? null;
	const pageTotalTlsStylesheets = page?.num_tls_stylesheets ?? null;
	const pageTotalNonTlsStylesheets = page?.num_non_tls_stylesheets ?? null;
	const pageResolvedTls = page?.resolved_tls ?? null;
	const pageResolvedSize = page?.resolved_size ?? null;
	const pageResolvedMissingTitle = page?.resolved_missing_title ?? null;
	const pageResolvedMissingDescription = page?.resolved_missing_description ?? null;
	const pageResolvedMissingH1First = page?.resolved_missing_h1_first ?? null;
	const pageResolvedMissingH1Second = page?.resolved_missing_h1_second ?? null;
	const pageResolvedMissingH2First = page?.resolved_missing_h2_first ?? null;
	const pageResolvedMissingH2Second = page?.resolved_missing_h2_second ?? null;
	const pageResolvedDuplicateTitle = page?.resolved_duplicate_title ?? null;
	const pageResolvedDuplicateDescription = page?.resolved_duplicate_description ?? null;

	// Router
	const { query } = useRouter();
	const { siteId } = query;

	// Custom variables
	const sanitizedSiteId = handleConversionStringToNumber(siteId);

	// Translations
	const { t } = useTranslation();
	const markAsResolvedText = t("sites:markAsResolved");
	const visitExternalSiteText = t("sites:visitExternalSite");
	const goToSiteOverviewText = t("sites:goToSiteOverview");

	// Custom context
	const { isComponentReady } = useContext(SiteCrawlerAppContext);

	// SWR hooks
	const { user, disableLocalTime, permissions } = useUser();
	const { scanObjId, selectedSiteRef } = useScan(sanitizedSiteId);
	const { pageDetail, pageDetailId, pageDetailPages } = usePageDetail(sanitizedSiteId, scanObjId, pageId);

	// Custom hooks
	const {
		ref: siteVerifyModalRef,
		isComponentVisible: isSiteVerifyModalVisible,
		setIsComponentVisible: setIsSiteVerifyModalVisible
	} = useComponentVisible(false);
	const {
		ref: siteDeleteModalRef,
		isComponentVisible: isSiteDeleteModalVisible,
		setIsComponentVisible: setIsSiteDeleteModalVisible
	} = useComponentVisible(false);

	// DayJS options
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

	return (
		<tr ref={selectedSiteRef}>
			<td tw="flex-none p-4 whitespace-nowrap">
				<div tw="flex flex-col items-start">
					<div>
						<>
							{isComponentReady &&
							user &&
							Math.round(user?.status / 100) === 2 &&
							!user?.data?.detail &&
							!validatingPages ? (
								<>
									{pageTlsStatus ? (
										<span
											aria-label="Ok"
											tw="relative -left-3 flex-shrink-0 inline-block h-2 w-2 rounded-full leading-5 bg-green-400"
										></span>
									) : (
										<span
											aria-label="Error"
											tw="relative -left-3 flex-shrink-0 inline-block h-2 w-2 rounded-full leading-5 bg-red-400"
										></span>
									)}

									<div tw="inline-flex flex-col justify-start items-start">
										<span tw="flex items-center justify-start text-sm leading-6 font-semibold text-gray-500">
											<p className="truncate-link">{pageUrl}</p>
										</span>
										<span tw="flex space-x-2 justify-start text-sm leading-5 text-gray-500">
											<Link
												href="/dashboard/sites/[siteId]/pages/[pageId]/"
												as={`/dashboard/sites/${sanitizedSiteId}/pages/${pageDetailId}`}
												passHref
											>
												<a
													type="button"
													tw="cursor-pointer flex items-center justify-start text-sm focus:outline-none leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150"
												>
													{goToSiteOverviewText}
												</a>
											</Link>

											<a
												href={pageUrl}
												tw="cursor-pointer flex items-center justify-start text-sm focus:outline-none leading-6 font-semibold text-gray-600 hover:text-gray-500 transition ease-in-out duration-150"
												title={visitExternalSiteText}
												target="_blank"
												rel="noreferrer"
											>
												{visitExternalSiteText}
											</a>

											{!pageTlsStatus ? (
												<button
													type="button"
													tw="cursor-pointer ml-3 flex items-center justify-start text-sm focus:outline-none leading-6 font-semibold text-green-600 hover:text-green-500 transition ease-in-out duration-150"
													onClick={() => {}}
												>
													{markAsResolvedText}
												</button>
											) : null}
										</span>
									</div>
								</>
							) : (
								<span tw="relative -left-3 flex items-start py-2 space-x-3">
									<Skeleton
										duration={2}
										width={9}
										height={9}
										circle={true}
										className="relative -left-3 top-4 block flex-shrink-0"
									/>
									<div tw="inline-flex flex-col justify-start items-start">
										<Skeleton
											duration={2}
											width={150}
											className="relative -left-3 inline-flex flex-col items-start justify-start"
										/>
										<span tw="flex flex-row justify-start text-sm leading-5 text-gray-500 space-x-3">
											<Skeleton duration={2} width={63} />
											<Skeleton duration={2} width={63} />
											<Skeleton duration={2} width={63} />
											<Skeleton duration={2} width={63} />
										</span>
									</div>
								</span>
							)}
						</>
					</div>
				</div>
			</td>
			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail && !validatingPages ? (
					<span tw="text-gray-500">
						{pageTotalSize > 0
							? bytes(pageTotalSize, {
									thousandsSeparator: " ",
									unitSeparator: " "
							  })
							: 0}
					</span>
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail && !validatingPages ? (
					pageTlsStatus ? (
						<MemoizedSiteSuccessIcon />
					) : !pageTlsStatus ? (
						<MemoizedSiteDanagerIcon />
					) : null
				) : (
					<Skeleton duration={2} width={150} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail && !validatingPages ? (
					pageImagesTlsStatus ? (
						<MemoizedSiteSuccessIcon />
					) : !pageImagesTlsStatus ? (
						<MemoizedSiteDanagerIcon />
					) : null
				) : (
					<Skeleton duration={2} width={150} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail && !validatingPages ? (
					pageScriptsTlsStatus ? (
						<MemoizedSiteSuccessIcon />
					) : !pageScriptsTlsStatus ? (
						<MemoizedSiteDanagerIcon />
					) : null
				) : (
					<Skeleton duration={2} width={150} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail && !validatingPages ? (
					pageStylesheetsTlsStatus ? (
						<MemoizedSiteSuccessIcon />
					) : !pageStylesheetsTlsStatus ? (
						<MemoizedSiteDanagerIcon />
					) : null
				) : (
					<Skeleton duration={2} width={150} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail && !validatingPages ? (
					<span tw="text-gray-500">{pageTotalLinks > 0 ? pageTotalLinks : 0}</span>
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail && !validatingPages ? (
					<span tw="text-gray-500">{pageTotalImages > 0 ? pageTotalImages : 0}</span>
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail && !validatingPages ? (
					<span tw="text-gray-500">{pageTotalScripts > 0 ? pageTotalScripts : 0}</span>
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail && !validatingPages ? (
					<span tw="text-gray-500">{pageTotalStylesheets > 0 ? pageTotalStylesheets : 0}</span>
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail && !validatingPages ? (
					pageTotalOkLinks > 0 ? (
						<span tw="text-green-500">{pageTotalOkLinks}</span>
					) : (
						<span tw="text-red-500">0</span>
					)
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail && !validatingPages ? (
					pageTotalNonOkLinks > 0 ? (
						<span tw="text-red-500">{pageTotalNonOkLinks}</span>
					) : (
						<span tw="text-green-500">0</span>
					)
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail && !validatingPages ? (
					pageTotalOkImages > 0 ? (
						<span tw="text-green-500">{pageTotalOkImages}</span>
					) : (
						<span tw="text-red-500">0</span>
					)
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail && !validatingPages ? (
					pageTotalNonOkImages > 0 ? (
						<span tw="text-red-500">{pageTotalNonOkImages}</span>
					) : (
						<span tw="text-green-500">0</span>
					)
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail && !validatingPages ? (
					pageTotalOkScripts > 0 ? (
						<span tw="text-green-500">{pageTotalOkScripts}</span>
					) : (
						<span tw="text-red-500">0</span>
					)
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail && !validatingPages ? (
					pageTotalNonOkScripts > 0 ? (
						<span tw="text-red-500">{pageTotalNonOkScripts}</span>
					) : (
						<span tw="text-green-500">0</span>
					)
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail && !validatingPages ? (
					pageTotalOkStylesheets > 0 ? (
						<span tw="text-green-500">{pageTotalOkStylesheets}</span>
					) : (
						<span tw="text-red-500">0</span>
					)
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail && !validatingPages ? (
					pageTotalNonOkStylesheets > 0 ? (
						<span tw="text-red-500">{pageTotalNonOkStylesheets}</span>
					) : (
						<span tw="text-green-500">0</span>
					)
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail && !validatingPages ? (
					pageTotalTlsImages > 0 ? (
						<span tw="text-green-500">{pageTotalTlsImages}</span>
					) : (
						<span tw="text-red-500">0</span>
					)
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail && !validatingPages ? (
					pageTotalNonTlsImages > 0 ? (
						<span tw="text-red-500">{pageTotalNonTlsImages}</span>
					) : (
						<span tw="text-green-500">0</span>
					)
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail && !validatingPages ? (
					pageTotalTlsScripts > 0 ? (
						<span tw="text-green-500">{pageTotalTlsScripts}</span>
					) : (
						<span tw="text-red-500">0</span>
					)
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail && !validatingPages ? (
					pageTotalNonTlsScripts > 0 ? (
						<span tw="text-red-500">{pageTotalNonTlsScripts}</span>
					) : (
						<span tw="text-green-500">0</span>
					)
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail && !validatingPages ? (
					pageTotalTlsStylesheets > 0 ? (
						<span tw="text-green-500">{pageTotalTlsStylesheets}</span>
					) : (
						<span tw="text-red-500">0</span>
					)
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail && !validatingPages ? (
					pageTotalNonTlsStylesheets > 0 ? (
						<span tw="text-red-500">{pageTotalNonTlsStylesheets}</span>
					) : (
						<span tw="text-green-500">0</span>
					)
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail && !validatingPages ? (
					pageResolvedTls ? (
						<span tw="text-gray-500">{pageResolvedTls}</span>
					) : null
				) : (
					<Skeleton duration={2} width={75} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail && !validatingPages ? (
					pageResolvedSize ? (
						<span tw="text-gray-500">{pageResolvedSize}</span>
					) : null
				) : (
					<Skeleton duration={2} width={75} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail && !validatingPages ? (
					pageResolvedMissingTitle ? (
						<span tw="text-gray-500">{pageResolvedMissingTitle}</span>
					) : null
				) : (
					<Skeleton duration={2} width={75} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail && !validatingPages ? (
					pageResolvedMissingDescription ? (
						<span tw="text-gray-500">{pageResolvedMissingDescription}</span>
					) : null
				) : (
					<Skeleton duration={2} width={75} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail && !validatingPages ? (
					pageResolvedMissingH1First ? (
						<span tw="text-gray-500">{pageResolvedMissingH1First}</span>
					) : null
				) : (
					<Skeleton duration={2} width={75} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail && !validatingPages ? (
					pageResolvedMissingH1Second ? (
						<span tw="text-gray-500">{pageResolvedMissingH1Second}</span>
					) : null
				) : (
					<Skeleton duration={2} width={75} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail && !validatingPages ? (
					pageResolvedMissingH2First ? (
						<span tw="text-gray-500">{pageResolvedMissingH2First}</span>
					) : null
				) : (
					<Skeleton duration={2} width={75} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail && !validatingPages ? (
					pageResolvedMissingH2Second ? (
						<span tw="text-gray-500">{pageResolvedMissingH2Second}</span>
					) : null
				) : (
					<Skeleton duration={2} width={75} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail && !validatingPages ? (
					pageResolvedDuplicateTitle ? (
						<span tw="text-gray-500">{pageResolvedDuplicateTitle}</span>
					) : null
				) : (
					<Skeleton duration={2} width={75} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail && !validatingPages ? (
					pageResolvedDuplicateDescription ? (
						<span tw="text-gray-500">{pageResolvedDuplicateDescription}</span>
					) : null
				) : (
					<Skeleton duration={2} width={75} />
				)}
			</td>
		</tr>
	);
};

PagesData.propTypes = {
	page: PropTypes.shape({
		id: PropTypes.number,
		num_images: PropTypes.number,
		num_links: PropTypes.number,
		num_non_ok_images: PropTypes.number,
		num_non_ok_links: PropTypes.number,
		num_non_ok_scripts: PropTypes.number,
		num_non_ok_stylesheets: PropTypes.number,
		num_non_tls_images: PropTypes.number,
		num_non_tls_scripts: PropTypes.number,
		num_non_tls_stylesheets: PropTypes.number,
		num_ok_images: PropTypes.number,
		num_ok_links: PropTypes.number,
		num_ok_scripts: PropTypes.number,
		num_ok_stylesheets: PropTypes.number,
		num_scripts: PropTypes.number,
		num_stylesheets: PropTypes.number,
		num_tls_images: PropTypes.number,
		num_tls_scripts: PropTypes.number,
		num_tls_stylesheets: PropTypes.number,
		resolved_duplicate_description: PropTypes.bool,
		resolved_duplicate_title: PropTypes.bool,
		resolved_missing_description: PropTypes.bool,
		resolved_missing_h1_first: PropTypes.bool,
		resolved_missing_h1_second: PropTypes.bool,
		resolved_missing_h2_first: PropTypes.bool,
		resolved_missing_h2_second: PropTypes.bool,
		resolved_missing_title: PropTypes.bool,
		resolved_size: PropTypes.bool,
		resolved_tls: PropTypes.bool,
		size_total: PropTypes.number,
		tls_images: PropTypes.bool,
		tls_scripts: PropTypes.bool,
		tls_status: PropTypes.bool,
		tls_stylesheets: PropTypes.bool,
		url: PropTypes.string
	}),
	validatingPages: PropTypes.bool
};

/**
 * Memoized custom `PagesData` component
 */
export const MemoizedPagesData = memo(PagesData);