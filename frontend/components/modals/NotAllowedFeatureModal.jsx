import { Dialog, Transition } from "@headlessui/react";
import { ExclamationIcon } from "@heroicons/react/outline";
import useTranslation from "next-translate/useTranslation";
import { forwardRef, Fragment, memo, useRef } from "react";

/**
 * Custom function to render the `NotAllowedFeatureModal` component
 *
 * @param {boolean} showModal
 * @param {function} setShowModal
 */
const NotAllowedFeatureModal = ({ showModal = false, setShowModal }, ref) => {
	// Translations
	const { t } = useTranslation("common");
	const notAllowedFeatureTitle = t("notAllowedFeatureTitle");
	const notAllowedFeatureMessage = t("notAllowedFeatureMessage");
	const closeText = t("close");

	// Custom hooks
	const NotAllowedFeatureModalRef = useRef(null);

	// Handle close modal
	const handleCloseModal = () => {
		setShowModal(false);
	};

	return (
		<Transition.Root show={showModal} as={Fragment}>
			<Dialog
				as="div"
				className="fixed inset-0 z-50 overflow-y-auto"
				initialFocus={NotAllowedFeatureModalRef}
				onClose={handleCloseModal}
			>
				<div className="flex min-h-screen items-end justify-center p-4 text-center sm:block sm:p-0">
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
					</Transition.Child>

					{/* This element is to trick the browser into centering the modal contents. */}
					<span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
						&#8203;
					</span>

					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						enterTo="opacity-100 translate-y-0 sm:scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 translate-y-0 sm:scale-100"
						leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
					>
						<div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
							<div className="sm:flex sm:items-start">
								<div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
									<ExclamationIcon className="h-5 w-5 text-red-600" aria-hidden="true" />
								</div>
								<div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
									<Dialog.Title as="h3" className="text-lg font-medium text-gray-900">
										{notAllowedFeatureTitle}
									</Dialog.Title>

									<div className="mt-2">
										<Dialog.Description as="p" className="text-sm text-gray-500">
											{notAllowedFeatureMessage}
										</Dialog.Description>
									</div>
								</div>
							</div>

							<div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
								<button
									type="button"
									className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300  bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50   focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
									onClick={handleCloseModal}
									ref={ref}
								>
									{closeText}
								</button>
							</div>
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root>
	);
};

/**
 * Memoized custom `NotAllowedFeatureModal` component
 */
const ForwardRefNotAllowedFeatureModal = forwardRef(NotAllowedFeatureModal);
export const MemoizedNotAllowedFeatureModal = memo(ForwardRefNotAllowedFeatureModal);
