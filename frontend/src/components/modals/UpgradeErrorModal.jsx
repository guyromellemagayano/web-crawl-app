// NextJS
import Link from "next/link";

// External
import { Transition } from "@headlessui/react";
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import tw from "twin.macro";

// Components
const ExclamationSvg = loadable(() => import("src/components/svg/solid/ExclamationSvg"));

const RecrawlSiteErrorModal = ({ show, setShowErrorModal, component, label }) => {
	const settingsSubscriptionsLink = "/settings/subscriptions";
	const defaultModalHeadlineLabel = "Site Feature Not Available";
	const defaultModalDescriptionLabel =
		"The site feature you are currently using is not available on your current plan. Please subscribe to our Pro or Agency plans so you can use them at any time.";
	const defaultModalCancelLabel = "Cancel";
	const defaultModalUpgradePlanLabel = "Upgrade Plan";

	return (
		<Transition
			show={show}
			className="fixed z-50 bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center"
		>
			<Transition.Child
				enter="ease-out duration-300"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="ease-in duration-200"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				<div tw="fixed inset-0 transition-opacity" aria-hidden="true">
					<div tw="absolute inset-0 bg-gray-500 opacity-75"></div>
				</div>
			</Transition.Child>

			<span tw="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

			<Transition.Child
				enter="ease-out duration-300"
				enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
				enterTo="opacity-100 translate-y-0 sm:scale-100"
				leave="ease-in duration-200"
				leaveFrom="opacity-100 translate-y-0 sm:scale-100"
				leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
			>
				<div
					tw="bg-white rounded-lg px-4 pt-5 pb-4 overflow-hidden transform transition-all sm:max-w-lg sm:w-full sm:p-6"
					role="dialog"
					aria-modal="true"
					aria-labelledby="modal-headline"
				>
					<div tw="sm:flex sm:items-start">
						<div tw="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
							<ExclamationSvg className={tw`h-6 w-6 text-yellow-600`} />
						</div>
						<div tw="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
							<h3 tw="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
								{component === "AddSite"
									? label[1].label
									: component === "LinkOptions"
									? label[6].label
									: defaultModalHeadlineLabel}
							</h3>
							<div tw="mt-2">
								<p tw="text-sm leading-5 text-gray-500">
									{component === "AddSite" ? label[2].label : defaultModalDescriptionLabel}
								</p>
							</div>
						</div>
					</div>
					<div tw="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
						<span tw="flex w-full rounded-md shadow-sm sm:w-auto">
							<Link href={settingsSubscriptionsLink} passHref>
								<a tw="cursor-pointer w-full mt-3 sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
									{defaultModalUpgradePlanLabel}
								</a>
							</Link>
						</span>
						<span tw="mt-3 flex w-full rounded-md shadow-sm sm:ml-3 sm:mt-0 sm:w-auto">
							<button
								type="button"
								tw="cursor-pointer inline-flex justify-center w-full mr-3 rounded-md border border-gray-300 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
								onClick={() => setTimeout(() => setShowErrorModal(!show), 150)}
							>
								{defaultModalCancelLabel}
							</button>
						</span>
					</div>
				</div>
			</Transition.Child>
		</Transition>
	);
};

RecrawlSiteErrorModal.propTypes = {};

export default RecrawlSiteErrorModal;