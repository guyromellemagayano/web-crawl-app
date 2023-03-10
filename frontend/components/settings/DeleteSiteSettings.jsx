import { MemoizedDeleteSiteModal } from "@components/modals/DeleteSiteModal";
import { useComponentVisible } from "@hooks/useComponentVisible";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classnames } from "@utils/classnames";
import useTranslation from "next-translate/useTranslation";
import { memo, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Custom function to render the "DeleteSiteSettings" component
 */
const DeleteSiteSettings = () => {
	// Translations
	const { t } = useTranslation();
	const deleteSiteModalRequestTitle = t("settings:deleteSiteModalRequest.title");
	const request = t("common:request");

	// Custom context
	const { isComponentReady, querySiteId } = useContext(SiteCrawlerAppContext);

	// Custom hooks
	const {
		ref: showModalRef,
		isComponentVisible: showModal,
		setIsComponentVisible: setShowModal
	} = useComponentVisible(false);

	// Handle show modal
	const handleShowModal = () => {
		setShowModal(true);
	};

	return (
		<div className="pb-12">
			<MemoizedDeleteSiteModal
				ref={showModalRef}
				showModal={showModal}
				setShowModal={setShowModal}
				siteId={querySiteId}
			/>

			<h5 className="text-xl font-bold leading-6 text-gray-900">
				{isComponentReady ? deleteSiteModalRequestTitle : <Skeleton duration={2} width={175} height={24} />}
			</h5>

			<div className="mt-6 max-w-full pt-0 pb-2 lg:max-w-3xl">
				<div className="flex justify-start">
					<span className="inline-flex rounded-md shadow-sm">
						{isComponentReady ? (
							<button
								type="button"
								disabled={showModal}
								id="user-account-delete-modal-button"
								className={classnames(
									"inline-flex w-full cursor-pointer justify-center rounded-md border border-gray-300 bg-red-600 px-4 py-2 text-sm font-medium leading-5 text-white shadow-sm transition duration-150 ease-in-out sm:text-sm sm:leading-5",
									showModal
										? "cursor-not-allowed opacity-50"
										: "hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
								)}
								onClick={handleShowModal}
							>
								{request}
							</button>
						) : (
							<Skeleton duration={2} width={78} height={38} className="inline-flex w-full px-4 py-2" />
						)}
					</span>
				</div>
			</div>
		</div>
	);
};

export const MemoizedDeleteSiteSettings = memo(DeleteSiteSettings);
