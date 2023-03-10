import PropTypes from "prop-types";
import { memo } from "react";

/**
 * Custom function to render the `TableSkeletonEntries` component
 */
const TableSkeletonEntries = ({ str = null, limit = null }) => {
	let strArray = [];

	if (limit > 0) {
		for (let index = 0; index < limit; index++) {
			strArray.push(str);
		}

		return strArray.map((value, key) => (
			<tr className="w-full" key={key}>
				{value}
			</tr>
		));
	} else return;
};

TableSkeletonEntries.propTypes = {
	limit: PropTypes.number,
	str: PropTypes.object
};

/**
 * Memoized custom `TableSkeletonEntries` component
 */
export const MemoizedTableSkeletonEntries = memo(TableSkeletonEntries);
