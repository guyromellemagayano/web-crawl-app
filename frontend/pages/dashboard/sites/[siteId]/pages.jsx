import { MemoizedLayout } from "@components/layouts";
import { MemoizedPageLayout } from "@components/layouts/components/Page";
import { MemoizedSitePagesPageLayout } from "@components/layouts/pages/SitePages";
import { SitesApiEndpoint, UserApiEndpoint } from "@constants/ApiEndpoints";
import { DashboardSitesLink, LoginLink } from "@constants/PageLinks";
import { SSR_SITE_URL } from "@constants/ServerEnv";
import AppAxiosInstance from "@utils/axios";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";

// Pre-render `user` data with NextJS SSR. Redirect to a login page if current user is not allowed to access that page (403 Forbidden) or redirect to the sites dashboard page if the user is still currently logged in (200 OK).
export async function getServerSideProps({ req, query }) {
	const userResponse = await AppAxiosInstance.get(`${SSR_SITE_URL + UserApiEndpoint}`, {
		headers: {
			cookie: req.headers.cookie ?? null
		}
	});
	const userData = userResponse?.data ?? null;
	const userStatus = userResponse?.status ?? null;

	const siteResponse = await AppAxiosInstance.get(`${SSR_SITE_URL + SitesApiEndpoint + query.siteId}`, {
		headers: {
			cookie: req.headers.cookie ?? null
		}
	});
	const siteData = siteResponse?.data ?? null;
	const siteStatus = siteResponse?.status ?? null;

	if (
		userData !== null &&
		!userData?.detail &&
		Object.keys(userData)?.length > 0 &&
		Math.round(userStatus / 200) === 1
	) {
		if (
			siteData !== null &&
			!siteData?.detail &&
			Object.keys(siteData)?.length > 0 &&
			Math.round(siteStatus / 200) === 1
		) {
			return {
				props: { siteName: siteData.name }
			};
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

export default function SitePages({ siteName }) {
	// Translations
	const { t } = useTranslation("sites");
	const sitesPagesText = t("sitesPages");

	// Custom variables
	const sitesPagesPageTitle = sitesPagesText + " - " + siteName;

	return (
		<MemoizedLayout>
			<NextSeo title={sitesPagesPageTitle} />
			<MemoizedPageLayout pageTitle={sitesPagesText}>
				<MemoizedSitePagesPageLayout />
			</MemoizedPageLayout>
		</MemoizedLayout>
	);
}

SitePages.getLayout = (page) => page;