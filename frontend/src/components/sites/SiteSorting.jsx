// External
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import "twin.macro";

// Components
const Sorting = loadable(() => import("src/components/site/Sorting"));

const SiteSorting = (props) => {
	return (
		<div tw="flex flex-row mr-3">
			<div tw="inline-flex">
				{props.slug === "site-name" ? (
					<Sorting direction={props.sortOrder.siteName} onSortHandler={props.onSortHandler} slug={props.slug} />
				) : props.slug === "last-crawled" ? (
					<Sorting direction={props.sortOrder.lastCrawled} onSortHandler={props.onSortHandler} slug={props.slug} />
				) : (
					""
				)}
			</div>
		</div>
	);
};

SiteSorting.propTypes = {};

export default SiteSorting;