import { MemoizedLayout } from "@components/layouts";
import { MemoizedSignupPageLayout } from "@components/layouts/pages/Signup";
import { MemoizedLoader } from "@components/loaders";
import { UserApiEndpoint } from "@constants/ApiEndpoints";
import { DashboardSitesLink } from "@constants/PageLinks";
import { SSR_SITE_URL } from "@constants/ServerEnv";
import { SiteCrawlerAppContext } from "@pages/_app";
import AppAxiosInstance from "@utils/axios";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import { useContext } from "react";
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
			redirect: {
				destination: DashboardSitesLink,
				permanent: false
			}
		};
	} else {
		return {
			props: {}
		};
	}
}

const SignupAuth = () => {
	// Translations
	const { t } = useTranslation("signup");
	const completeSignupText = t("completeSignup");

	// Custom context
	const { isComponentReady } = useContext(SiteCrawlerAppContext);

	return (
		<MemoizedLayout>
			<NextSeo title={completeSignupText} />
			{isComponentReady ? <MemoizedSignupPageLayout /> : <MemoizedLoader />}
		</MemoizedLayout>
	);
};

export default function Signup() {
	return (
		<SWRConfig>
			<SignupAuth />
		</SWRConfig>
	);
}

Signup.getLayout = (page) => page;
