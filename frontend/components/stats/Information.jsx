import { SiteCrawlerAppContext } from "@pages/_app";
import useTranslation from "next-translate/useTranslation";
import { memo, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Custom function to render the `InformationStats` component
 */
const InformationStats = () => {
	// Translations
	const { t } = useTranslation();
	const statsText = t("sites:stats");
	const totalLinksText = t("sites:totalLinks");
	const totalPagesText = t("sites:totalPages");
	const totalImagesText = t("sites:totalImages");

	// Custom context
	const { isComponentReady, links, pages, images, isCrawlFinished, isCrawlStarted, scan, user } =
		useContext(SiteCrawlerAppContext);

	// Custom variables
	const permissions = user?.data?.permissions ?? null;
	const linksCount = links?.data?.count ?? null;
	const pagesCount = pages?.data?.count ?? null;
	const imagesCount = images?.data?.count ?? null;

	const totalLinksTab = {
		title: isComponentReady && links ? totalLinksText : <Skeleton duration={2} width={72} height={20} />,
		count: isComponentReady && links ? linksCount : <Skeleton duration={2} width={108} height={36} />
	};
	const totalPagesTab = {
		title: isComponentReady && pages ? totalPagesText : <Skeleton duration={2} width={72} height={20} />,
		count: isComponentReady && pages ? pagesCount : <Skeleton duration={2} width={108} height={36} />
	};
	const totalImagesTab = {
		title: isComponentReady && images ? totalImagesText : <Skeleton duration={2} width={72} height={20} />,
		count: isComponentReady && images ? imagesCount : <Skeleton duration={2} width={108} height={36} />
	};

	const SectionTabs = [];

	SectionTabs.push(totalLinksTab);

	isComponentReady &&
	permissions &&
	permissions?.includes("can_see_pages") &&
	permissions?.includes("can_see_scripts") &&
	permissions?.includes("can_see_stylesheets")
		? SectionTabs.push(totalPagesTab)
		: null;

	isComponentReady && permissions && permissions?.includes("can_see_images") ? SectionTabs.push(totalImagesTab) : null;

	return (
		<div className="h-full overflow-hidden rounded-lg border">
			<div className="flex items-center px-6 pt-6 pb-2">
				{isComponentReady ? (
					<h2 className="text-lg font-bold leading-7 text-gray-900">{statsText}</h2>
				) : (
					<Skeleton duration={2} width={100} height={15} />
				)}
			</div>

			<div className="px-6 pt-2 pb-4">
				<div className="col-span-4 grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-2">
					{SectionTabs.map((val, key) => {
						return (
							<div key={key} className="flex items-center justify-start py-4 sm:col-span-1">
								<div className="flex items-start justify-center">
									<dl>
										<dt className="truncate text-sm font-medium leading-5 text-gray-500 lg:text-sm">
											{isComponentReady ? val.title : <Skeleton duration={2} width={100} height={15}></Skeleton>}
										</dt>

										<dd className="mt-1 text-3xl font-semibold leading-9 text-gray-700">
											{isComponentReady ? val.count : <Skeleton duration={2} width={100} height={36} />}
										</dd>
									</dl>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

/**
 * Memoized custom `InformationStats` component
 */
export const MemoizedInformationStats = memo(InformationStats);
