import "twin.macro";
import PropTypes from "prop-types";

const LinkFilter = ({ onFilterChange, allFilter, noIssueFilter, issueFilter, internalFilter, externalFilter }) => {
	const filterHandler = (e) => {
		onFilterChange(e);
	};

	return (
		<div tw="sticky z-50 top-0 pb-4 bg-white">
			<div tw="px-4 py-5 border border-gray-300 sm:px-6 bg-white rounded-lg lg:flex lg:justify-between">
				<div tw="-ml-4 lg:-mt-2 lg:flex items-center flex-wrap sm:flex-nowrap">
					<h4 tw="ml-4 mb-4 lg:mb-0 mt-2 mr-1 text-base leading-4 font-semibold text-gray-600">Filter</h4>
					<div tw="ml-4 mt-2 mr-2">
						<div>
							<label tw="flex items-center">
								<input
									type="checkbox"
									tw="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
									onChange={filterHandler}
									checked={allFilter}
									value="all"
								/>
								<span tw="ml-2 text-left text-xs leading-4 font-normal text-gray-500">All Links</span>
							</label>
						</div>
					</div>
					<div tw="ml-4 mt-2 mr-2">
						<div>
							<label tw="flex items-center">
								<input
									type="checkbox"
									tw="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
									onChange={filterHandler}
									checked={issueFilter}
									value="issues"
								/>
								<span tw="ml-2 text-left text-xs leading-4 font-normal text-gray-500">Links with Issues</span>
							</label>
						</div>
					</div>
					<div tw="ml-4 mt-2 mr-2">
						<div>
							<label tw="flex items-center">
								<input
									type="checkbox"
									tw="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
									onChange={filterHandler}
									checked={internalFilter}
									value="internal"
								/>
								<span tw="ml-2 text-left text-xs leading-4 font-normal text-gray-500">Internal Links</span>
							</label>
						</div>
					</div>
					<div tw="ml-4 mt-2 mr-2">
						<div>
							<label tw="flex items-center">
								<input
									type="checkbox"
									tw="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
									onChange={filterHandler}
									checked={externalFilter}
									value="external"
								/>
								<span tw="ml-2 text-left text-xs leading-4 font-normal text-gray-500">External Links</span>
							</label>
						</div>
					</div>
				</div>
				<div tw="lg:-mt-2 lg:flex items-center justify-end flex-wrap sm:flex-nowrap">
					<div tw="mt-2">
						<div>
							<label tw="flex items-center">
								<input
									type="checkbox"
									tw="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
									onChange={filterHandler}
									checked={noIssueFilter}
									value="no-issues"
								/>
								<span tw="ml-2 text-left text-xs leading-4 font-normal text-gray-500">No Issues</span>
							</label>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

LinkFilter.propTypes = {};

export default LinkFilter;