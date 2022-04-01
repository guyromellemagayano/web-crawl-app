import { MemoizedPagesStatsSkeleton } from "@components/skeletons/PagesStats";
import { PagesChartContents } from "@constants/ChartContents";
import { DashboardSitesLink, SitePagesSlug } from "@constants/PageLinks";
import { SiteCrawlerAppContext } from "@pages/_app";
import useTranslation from "next-translate/useTranslation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { memo, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// Dynamic
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false, loading: () => <MemoizedPagesStatsSkeleton /> });

/**
 * Custom function to render the `PagesStats` component
 */
const PagesStats = () => {
	// Translations
	const { t } = useTranslation();
	const pagesText = t("sites:pages");
	const detailsText = t("sites:details");
	const imageErrorsText = t("sites:imageErrors");

	// Custom context
	const { isComponentReady, querySiteId, stats } = useContext(SiteCrawlerAppContext);

	// Router
	const { push } = useRouter();

	// Custom variables
	let path = DashboardSitesLink + querySiteId + SitePagesSlug;

	const totalBigPages = stats?.data?.num_pages_big ?? 0;
	const totalTlsNonOkPages = stats?.data?.num_pages_tls_non_ok ?? 0;
	const totalSmallPagesWithTlsOk = stats?.data?.num_pages_small_tls_ok ?? 0;

	// Chart content labels
	const labelsArray = PagesChartContents();

	// Handle legend click
	const legendClickHandler = (label) => {
		labelsArray.forEach((item) => {
			if (label === item.label && item.filter !== "")
				path += path.includes("?") ? `&${item.filter}` : `?${item.filter}`;
		});

		push(path);
	};

	const chartSeries = [totalBigPages, totalTlsNonOkPages, totalSmallPagesWithTlsOk];

	const chartOptions = {
		chart: {
			id: "linkErrors",
			type: "donut",
			events: {
				legendClick: (chartContext, seriesIndex, config) => legendClickHandler(config.config.labels[seriesIndex])
			}
		},
		labels: labelsArray.map((item) => item.label),
		colors: labelsArray.map((item) => item.color),
		fill: {
			colors: labelsArray.map((item) => item.color)
		},
		stroke: {
			width: 0
		},
		dataLabels: {
			enabled: true,
			formatter: function (val, opts) {
				return opts.w.globals.series[opts.seriesIndex];
			}
		},
		legend: {
			show: true,
			fontSize: "14px",
			position: "bottom",
			horizontalAlign: "center",
			height: 360,
			itemMargin: {
				horizontal: 15,
				vertical: 10
			},
			formatter: function (seriesName, opts) {
				return [
					`<span className='legend-text'>${seriesName}</span>`,
					"   ",
					`<span className='legend-val'>${opts.w.globals.series[opts.seriesIndex]}</span>`
				];
			}
		},
		plotOptions: {
			pie: {
				customScale: 0.9,
				donut: {
					labels: {
						show: true,
						total: {
							show: true,
							showAlways: true,
							label: imageErrorsText,
							fontSize: "15px",
							color: "#2A324B",
							formatter: function (val) {
								return val.globals.seriesTotals.slice(0, -1).reduce((a, b) => {
									return a + b;
								}, 0);
							}
						}
					}
				}
			}
		},
		responsive: [
			{
				breakpoint: 320,
				options: {
					chart: {
						width: 420,
						height: "auto"
					},
					legend: {
						position: "bottom",
						width: 315,
						height: "auto",
						itemMargin: {
							horizontal: 25,
							vertical: 10
						}
					}
				}
			}
		]
	};

	return (
		<div className="h-full overflow-hidden rounded-lg border">
			<div className="flex justify-between py-8 px-5">
				<div className="flex items-center">
					<h2 className="text-lg font-bold leading-7 text-gray-900">
						{isComponentReady ? pagesText : <Skeleton duration={2} width={100} height={15} />}
					</h2>
				</div>
				<div>
					{isComponentReady ? (
						<Link href="/dashboard/sites/[siteId]/links" as={path} passHref>
							<a className="text-sm font-medium leading-5 text-gray-500 hover:underline">{detailsText}</a>
						</Link>
					) : (
						<Skeleton duration={2} width={75} height={15} />
					)}
				</div>
			</div>
			<div className="mx-auto flex max-w-sm justify-center">
				<Chart options={chartOptions} series={chartSeries} type="donut" width={600} height={720} />
			</div>
		</div>
	);
};

/**
 * Memoized custom `PagesStats` component
 */
export const MemoizedPagesStats = memo(PagesStats);
