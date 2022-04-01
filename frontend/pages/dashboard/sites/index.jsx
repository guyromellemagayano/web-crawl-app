import { MemoizedLayout } from "@components/layouts";
import { MemoizedPageLayout } from "@components/layouts/components/Page";
import { MemoizedSitesDashboardPageLayout } from "@components/layouts/pages/SitesDashboard";
import { UserApiEndpoint } from "@constants/ApiEndpoints";
import { LoginLink } from "@constants/PageLinks";
import { SSR_SITE_URL } from "@constants/ServerEnv";
import AppAxiosInstance from "@utils/axios";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import { SWRConfig } from "swr";

// Pre-render `user` data with NextJS SSR. Redirect to a login page if current user is not allowed to access that page (403 Forbidden) or redirect to the sites dashboard page if the user is still currently logged in (200 OK).
export async function getServerSideProps({ req, res }) {
	res.setHeader("Cache-Control", "public, s-maxage=10, stale-while-revalidate=59");

	const userResponse = await AppAxiosInstance.get(`${SSR_SITE_URL + UserApiEndpoint}`, {
		headers: {
			cookie: req.headers.cookie ?? null
		}
	});
	const userData = userResponse?.data ?? null;
	const userStatus = userResponse?.status ?? null;

	if (
		userData !== null &&
		!userData?.detail &&
		Object.keys(userData)?.length > 0 &&
		Math.round(userStatus / 200) === 1
	) {
		return {
			props: {}
		};
	} else {
		return {
			redirect: {
				destination: LoginLink,
				permanent: false
			}
		};
	}
}

const SitesAuth = () => {
	// Translations
	const { t } = useTranslation("sites");
	const sitesDashboardText = t("sitesDashboard");

	return (
		<MemoizedLayout>
			<NextSeo title={sitesDashboardText} />
			<MemoizedPageLayout isSites pageTitle={sitesDashboardText}>
				<MemoizedSitesDashboardPageLayout />
			</MemoizedPageLayout>
		</MemoizedLayout>
	);
};

export default function Sites() {
	return (
		<SWRConfig>
			<SitesAuth />
		</SWRConfig>
	);
}

Sites.getLayout = (page) => page;
