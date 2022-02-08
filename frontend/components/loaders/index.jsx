import { MemoizedLoadingMessage } from "@components/messages/LoadingMessage";
import { memo } from "react";
import "twin.macro";

/**
 * Custom function to render the `Loader` component
 */
const Loader = ({ message = null }) => {
	return (
		<main tw="flex justify-center items-center h-screen">
			<MemoizedLoadingMessage message={message} />
		</main>
	);
};

/**
 * Memoized custom `Loader` component
 */
export const MemoizedLoader = memo(Loader);