import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle the default payment method
 *
 * @param {object} options
 * @returns {object} defaultSubscription, errorDefaultPaymentMethod, validatingDefaultPaymentMethod
 */
export const useDefaultSubscription = (endpoint = null, setConfig, options = null) => {
	// SWR hook
	const {
		data: defaultSubscription,
		error: errorDefaultSubscription,
		isValidating: validatingDefaultSubscription
	} = useMainSWRConfig(endpoint, setConfig, options);

	return { defaultSubscription, errorDefaultSubscription, validatingDefaultSubscription };
};
