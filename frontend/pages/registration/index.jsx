import { MemoizedLayout } from "@components/layouts";
import { MemoizedRegistrationPageLayout } from "@components/layouts/pages/Registration";
import { UserApiEndpoint } from "@constants/ApiEndpoints";
import { customAxiosHeaders } from "@constants/CustomAxiosHeaders";
import { DashboardSitesLink } from "@constants/PageLinks";
import { SSR_SITE_URL } from "@constants/ServerEnv";
import { GlobalStyles } from "@styles/GlobalStyles";
import axios from "axios";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";

// Pre-render `user` data with NextJS SSR. Redirect to a login page if current user is not allowed to access that page (403 Forbidden) or redirect to the sites dashboard page if the user is still currently logged in (200 OK).
export async function getServerSideProps({ req }) {
	const userResponse = await axios.get(`${SSR_SITE_URL + UserApiEndpoint}`, {
		headers: {
			cookie: req.headers.cookie ?? null,
			...customAxiosHeaders
		}
	});
	const userData = userResponse?.data ?? null;
	const userStatus = userResponse?.status ?? null;

	if (
		typeof userData !== "undefined" &&
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

export default function Registration() {
	// Translations
	const { t } = useTranslation("registration");
	const registration = t("registration");

	return (
		<>
			<GlobalStyles />
			<NextSeo title={registration} />
			<MemoizedRegistrationPageLayout />
		</>
	);
}

Registration.getLayout = function getLayout(page) {
	return <MemoizedLayout>{page}</MemoizedLayout>;
};
