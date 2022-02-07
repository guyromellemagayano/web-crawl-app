import { MemoizedLayout } from "@components/layouts";
import { MemoizedPageLayout } from "@components/layouts/components/Page";
import { MemoizedSubscriptionPlansPageLayout } from "@components/layouts/pages/SubscriptionPlans";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import "twin.macro";

export default function SubscriptionPlans() {
	// Translations
	const { t } = useTranslation("common");
	const subscriptionPlans = t("subscriptionPlans");

	return (
		<>
			<NextSeo title={subscriptionPlans} />
			<MemoizedPageLayout pageTitle={subscriptionPlans}>
				<MemoizedSubscriptionPlansPageLayout />
			</MemoizedPageLayout>
		</>
	);
}

SubscriptionPlans.getLayout = function getLayout(page) {
	return <MemoizedLayout>{page}</MemoizedLayout>;
};
