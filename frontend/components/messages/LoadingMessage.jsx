import useTranslation from "next-translate/useTranslation";
import PropTypes from "prop-types";
import { memo } from "react";
import "twin.macro";

/**
 * Custom function to render the `LoadingMessage` component
 *
 * @param {string} message
 */
const LoadingMessage = ({ message = null }) => {
	// Translations
	const { t } = useTranslation("common");
	const loaderMessage = t("loaderMessage");

	return (
		<h3 tw="text-sm leading-6 font-medium text-gray-500">
			{message !== null && message?.length > 0 && typeof message === "string" ? message : loaderMessage}
		</h3>
	);
};

LoadingMessage.propTypes = {
	message: PropTypes.string
};

/**
 * Memoized custom `LoadingMessage` component
 */
export const MemoizedLoadingMessage = memo(LoadingMessage);
