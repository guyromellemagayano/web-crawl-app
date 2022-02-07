import { Layout } from "@components/layouts";
import { MemoizedSignupPageLayout } from "@components/layouts/pages/Signup";
import { DashboardSitesLink } from "@constants/PageLinks";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Signup() {
	// Translations
	const { t } = useTranslation("signup");
	const completeSignup = t("completeSignup");

	// Router
	const router = useRouter();

	useEffect(() => {
		router.prefetch(DashboardSitesLink);
	}, []);

	return (
		<>
			<NextSeo title={completeSignup} />
			<MemoizedSignupPageLayout />
		</>
	);
}

Signup.getLayout = function getLayout(page) {
	return <Layout>{page}</Layout>;
};
