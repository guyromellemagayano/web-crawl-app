import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle a site's `linkId` information
 *
 * @param {string} endpoint
 * @param {object} options
 * @returns {object} linkId, errorLinkId, validatingLinkId
 */
export const useLinkId = (endpoint = null, options = null) => {
	// SWR hook
	const { data: linkId, error: errorLinkId, isValidating: validatingLinkId } = useMainSWRConfig(endpoint, options);

	return { linkId, errorLinkId, validatingLinkId };
};
