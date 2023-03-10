/* eslint-disable react-hooks/exhaustive-deps */
import { DashboardSitesLink } from "@constants/PageLinks";
import { SiteCrawlerAppContext } from "@pages/_app";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useComponentVisible } from "./useComponentVisible";

/**
 * Custom React hook that handles the selected site
 *
 * @returns {object} siteSelectRef, isSiteSelectComponentVisible, setIsSiteSelectComponentVisible, selectedSiteDetails, setSelectedSiteDetails, handleSiteSelectOnClick
 */
export const useSiteSelection = () => {
	const [selectedSiteDetails, setSelectedSiteDetails] = useState(null);
	const [selectedSiteId, setSelectedSiteId] = useState(null);

	// Translations
	const { t } = useTranslation();
	const loaderMessage = t("common:loaderMessage");

	// Router
	const { push, asPath, prefetch } = useRouter();

	// Custom contexts
	const { sites, querySiteId } = useContext(SiteCrawlerAppContext);

	// Custom variables
	const sitesResults = sites?.data?.results ?? null;

	// Custom hooks
	const {
		ref: siteSelectRef,
		isComponentVisible: isSiteSelectComponentVisible,
		setIsComponentVisible: setIsSiteSelectComponentVisible
	} = useComponentVisible(false);

	// Handle site selection on load
	useEffect(() => {
		if (querySiteId && sitesResults) {
			const site = sitesResults
				?.filter((site) => site.id === querySiteId)
				?.map((site) => ({
					...site,
					url: `${DashboardSitesLink}/${site.id}/`
				}))[0];

			if (site) {
				setSelectedSiteDetails(site);
				setSelectedSiteId(site.id);
			}
		}

		return { selectedSiteDetails };
	}, [querySiteId]);

	useEffect(() => {
		selectedSiteId ? prefetch(DashboardSitesLink + selectedSiteId + "/") : prefetch(DashboardSitesLink);
	}, [selectedSiteId]);

	// Handle site selection on click
	const handleSiteSelectOnClick = async (id) => {
		const pageExclusions = ["settings", "add-new-site", "audit-logs"];
		const page = pageExclusions.find((page) => asPath.includes(page));

		id ? setSelectedSiteId(id) : setSelectedSiteId(null);

		let fromSiteDetail = null;
		let fromDashboard = null;

		fromSiteDetail = {
			pathname: "/dashboard/sites/[siteId]/",
			query: { siteId: id }
		};
		fromDashboard = DashboardSitesLink + id + "/";

		return page || asPath === DashboardSitesLink ? push(fromDashboard) : push(fromSiteDetail);
	};

	return {
		siteSelectRef,
		isSiteSelectComponentVisible,
		setIsSiteSelectComponentVisible,
		selectedSiteDetails,
		setSelectedSiteDetails,
		handleSiteSelectOnClick
	};
};
