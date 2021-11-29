import Layout from "@components/layouts";
import dynamic from "next/dynamic";

/**
 * Dynamic imports
 */
const ErrorPageLayout = dynamic(() => import("@components/layouts/pages/Error"), { ssr: true });

/**
 * Memoized `Custom404` page.
 */
const Custom404 = () => {
	return <ErrorPageLayout statusCode={404} />;
};

Custom404.getLayout = function getLayout(page) {
	return <Layout>{page}</Layout>;
};

export default Custom404;
