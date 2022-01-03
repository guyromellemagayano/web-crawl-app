/* eslint-disable react-hooks/exhaustive-deps */
import { MemoizedDashboardLayout } from "@components/layouts";
import { MemoizedPageLayout } from "@components/layouts/components/Page";
import { MemoizedComingSoonPageLayout } from "@components/layouts/pages/ComingSoon";
// import { MemoizedSitePagesPageLayout } from "@components/layouts/pages/SitePages";
import { SitesApiEndpoint, UserApiEndpoint } from "@constants/ApiEndpoints";
import { customAxiosHeaders } from "@constants/CustomAxiosHeaders";
import { DashboardSitesLink, LoginLink } from "@constants/PageLinks";
import { SSR_SITE_URL } from "@constants/ServerEnv";
import { handleGetMethod } from "@helpers/handleHttpMethods";
import { handleStringToNumberSanitation } from "@helpers/handleStringSanitation";
import axios from "axios";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import useSWR, { SWRConfig } from "swr";

// Pre-render `user` data with NextJS SSR. Redirect to a login page if current user is not allowed to access that page (403 Forbidden) or redirect to the sites dashboard page if the user is still currently logged in (200 OK).
export async function getServerSideProps({ req, query }) {
	const userResponse = await axios.get(`${SSR_SITE_URL + UserApiEndpoint}`, {
		headers: {
			cookie: req.headers.cookie ?? null,
			...customAxiosHeaders
		}
	});
	const userData = userResponse?.data ?? null;
	const userStatus = userResponse?.status ?? null;

	// Sites response
	const sitesResponse = await axios.get(`${SSR_SITE_URL + SitesApiEndpoint}`, {
		headers: {
			cookie: req?.headers?.cookie ?? null,
			...customAxiosHeaders
		}
	});
	const sitesData = sitesResponse?.data ?? null;
	const sitesStatus = sitesResponse?.status ?? null;

	if (
		typeof userData !== "undefined" &&
		userData !== null &&
		!userData?.detail &&
		Object.keys(userData)?.length > 0 &&
		Math.round(userStatus / 200) === 1
	) {
		const sid = query?.siteId ? parseInt(query?.siteId) : null;

		if (
			typeof sitesData !== "undefined" &&
			sitesData !== null &&
			!sitesData?.detail &&
			Object.keys(sitesData)?.length > 0 &&
			Math.round(sitesStatus / 200) === 1
		) {
			const sidMatch = sitesData?.results?.find((site) => site.id === sid) ?? null;

			if (sidMatch == null || sid == null) {
				return {
					redirect: {
						destination: DashboardSitesLink,
						permanent: false
					}
				};
			} else {
				return {
					props: {
						query: query,
						fallback: {
							"/api/site/": sitesData
						}
					}
				};
			}
		} else {
			return {
				redirect: {
					destination: DashboardSitesLink,
					permanent: false
				}
			};
		}
	} else {
		return {
			redirect: {
				destination: LoginLink,
				permanent: false
			}
		};
	}
}

// Handle `siteId` and render the page if `siteId` exists. Conversely, return to sites dashboard page when `siteId` doesn't exist
const SitePagesPage = ({ query }) => {
	// Queries
	const { siteId } = query;

	// Pre-render `sites` based on `fallback` by SWR
	const { data: sites } = useSWR(`/api/site/`, handleGetMethod);

	const sanitizedSiteId = handleStringToNumberSanitation(siteId);
	const sidMatch = sites?.data?.results?.find((site) => site.id === sanitizedSiteId) ?? null;
	const siteName = sidMatch?.name ?? null;

	// Translations
	const { t } = useTranslation();
	const sitePagesName = t("sites:sitesPages", { siteName });

	return (
		<>
			<NextSeo title={sitePagesName} />
			<MemoizedPageLayout pageTitle={sitePagesName}>
				<MemoizedComingSoonPageLayout />
				{/* <MemoizedSitePagesPageLayout /> */}
			</MemoizedPageLayout>
		</>
	);
};

export default function SitePages({ query, fallback }) {
	return (
		<SWRConfig value={{ fallback }}>
			<SitePagesPage query={query} />
		</SWRConfig>
	);
}

SitePages.getLayout = function getLayout(page) {
	return <MemoizedDashboardLayout>{page}</MemoizedDashboardLayout>;
};
