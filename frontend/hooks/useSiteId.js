import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle a individual `site` information
 *
 * @param {number} querySid
 * @param {object} options
 * @returns {object} siteId, errorSiteId, validatingSiteId
 */
export const useSiteId = (endpoint = null, options = null) => {
	// SWR hook
	const { data: siteId, error: errorSiteId, isValidating: validatingSiteId } = useMainSWRConfig(endpoint, options);

	return { siteId, errorSiteId, validatingSiteId };
};
