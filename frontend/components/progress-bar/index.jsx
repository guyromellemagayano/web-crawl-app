import { useNProgress } from "@tanem/react-nprogress";
import { classnames } from "@utils/classnames";
import { useRouter } from "next/router";
import { memo, useEffect, useRef, useState } from "react";
import styledComponents, { css } from "styled-components";

const ProgressBarAnimationStyled = styledComponents.div`
		margin-left: ${(props) => (-1 + props.progress) * 100 + "%"};
		transition-property: margin-left;
		transition-delay: ${(props) => props.animationDuration + "ms"};
		transition-duration: ${(props) => props.animationDuration + "ms"};
	`;

/**
 * Custom function to render the `ProgressBar` component
 */
const ProgressBar = () => {
	const [state, setState] = useState({
		isRouteChanging: false
	});

	let activeRequests = useRef(0);

	// Router
	const router = useRouter();

	useEffect(() => {
		const handleRouteChangeStart = () => {
			setState((prevState) => ({
				...prevState,
				isRouteChanging: true
			}));
		};

		const handleRouteChangeEnd = () => {
			if (activeRequests.current > 0) {
				return;
			}

			setState((prevState) => ({
				...prevState,
				isRouteChanging: false
			}));
		};

		router.events.on("routeChangeStart", handleRouteChangeStart);
		router.events.on("routeChangeComplete", handleRouteChangeEnd);
		router.events.on("routeChangeError", handleRouteChangeEnd);

		const originalFetch = window.fetch;

		window.fetch = async function (...args) {
			if (activeRequests.current === 0) {
				handleRouteChangeStart();
			}

			activeRequests.current++;

			try {
				const response = await originalFetch(...args);
				return response;
			} catch (error) {
				return Promise.reject(error);
			} finally {
				activeRequests.current -= 1;
				if (activeRequests.current === 0) {
					handleRouteChangeEnd();
				}
			}
		};

		return () => {
			router.events.off("routeChangeStart", handleRouteChangeStart);
			router.events.off("routeChangeComplete", handleRouteChangeEnd);
			router.events.off("routeChangeError", handleRouteChangeEnd);

			setState((prevState) => ({
				...prevState,
				isRouteChanging: false
			}));
		};
	}, [router]);

	const { animationDuration, isFinished, progress } = useNProgress({
		isAnimating: state.isRouteChanging
	});

	return (
		<ProgressBarAnimationStyled
			progress
			animationDuration
			className={classnames(
				"pointer-events-none fixed top-0 left-0 z-50 h-1 w-full bg-red-400 transition-opacity ease-linear",
				isFinished ? "opacity-0" : "opacity-100"
			)}
		>
			<div
				className={classnames(
					"absolute right-0 block h-full translate-x-0 -translate-y-1 rotate-3 transform-gpu opacity-100",
					css`
						width: 100px;
						box-shadow: 0 0 10px ${css`bg-red-400`}, 0 0 5px ${css`bg-red-400`};
					`
				)}
			/>
		</ProgressBarAnimationStyled>
	);
};

/**
 * Memoized custom `ProgressBar` component
 */
export const MemoizedProgressBar = memo(ProgressBar);
