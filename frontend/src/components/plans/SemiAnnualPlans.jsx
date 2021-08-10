// React
import * as React from "react";

// External
import { CheckIcon } from "@heroicons/react/solid";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import tw from "twin.macro";

// Enums
import { SubscriptionLabels } from "@enums/SubscriptionLabels";
import { SubscriptionPlanLabels } from "@enums/SubscriptionPlanLabels";

const SemiAnnualPlans = ({
	componentReady,
	data,
	defaultPaymentMethod,
	defaultSubscription,
	disableLocalTime,
	loadingAgencySemiAnnually,
	loadingProSemiAnnually,
	setShowModal,
	setUpdatedPlanId,
	setUpdatedPlanName,
	showModal
}) => {
	const calendar = require("dayjs/plugin/calendar");
	const timezone = require("dayjs/plugin/timezone");
	const utc = require("dayjs/plugin/utc");

	dayjs.extend(calendar);
	dayjs.extend(utc);
	dayjs.extend(timezone);

	const calendarStrings = {
		lastDay: "[Yesterday], dddd [at] hh:mm:ss A",
		lastWeek: "MMMM DD, YYYY [at] hh:mm:ss A",
		sameDay: "[Today], dddd [at] hh:mm:ss A",
		sameElse: "MMMM DD, YYYY [at] hh:mm:ss A"
	};

	return componentReady ? (
		data?.group?.name == "Pro" ? (
			<div tw="mt-10 max-w-lg mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-start-3 lg:col-end-6 lg:row-start-1 lg:row-end-4">
				<div tw="relative z-20 rounded-lg shadow-xl">
					<div tw="pointer-events-none absolute inset-0 rounded-lg border border-indigo-600"></div>
					<div tw="absolute inset-x-0 top-0 transform translate-y-px">
						<div tw="flex justify-center transform -translate-y-1/2">
							<span tw="inline-flex rounded-full bg-indigo-600 px-4 py-1 text-sm leading-5 font-semibold tracking-wider uppercase text-white">
								{SubscriptionLabels[21].label}
							</span>
						</div>
					</div>
					<div tw="bg-white rounded-t-lg px-6 pt-12 pb-10">
						<div>
							<h3
								tw="text-center text-3xl leading-9 font-semibold text-gray-900 sm:-mx-6"
								id="tier-growth"
							>
								{data?.group?.name == "Pro2" ? "Pro" : data?.group?.name}
								<span tw="text-red-400">*</span>
							</h3>
							<div tw="mt-4 flex items-center justify-center">
								<span tw="px-3 flex items-start text-6xl leading-none tracking-tight text-gray-900 sm:text-6xl">
									<span tw="mt-2 mr-2 text-4xl font-medium">$</span>
									<span tw="font-bold">{data?.price?.unit_amount / 100}</span>
								</span>
								<span tw="text-2xl leading-8 font-medium text-gray-500">
									{SubscriptionLabels[22].label}
								</span>
							</div>
						</div>
					</div>
					<div tw="border-t border-gray-300 rounded-b-lg pt-10 pb-8 px-6 bg-white sm:px-10 sm:py-10">
						<ul>
							{data?.features.map((val2, key) => {
								return (
									<li key={key} tw="flex items-start my-3">
										<div tw="flex-shrink-0">
											<CheckIcon tw="h-6 w-6 text-green-500" />
										</div>
										<p tw="ml-3 text-base leading-6 font-medium text-gray-500">{val2}</p>
									</li>
								);
							})}
						</ul>
						<div tw="mt-10">
							<div
								css={[
									tw`rounded-lg`,
									data?.id == defaultSubscription?.id ? tw`shadow-none` : tw`shadow-sm`
								]}
							>
								{data?.id == defaultSubscription?.id &&
								defaultSubscription?.status == "PAID" &&
								defaultSubscription?.cancel_at !== null ? (
									<div tw="relative flex justify-center flex-wrap flex-row text-sm leading-5">
										<span tw="px-2 py-5 text-gray-600 text-center">
											<p tw="text-sm font-medium">{SubscriptionPlanLabels[0].label}</p>
											<p tw="text-xs text-gray-500">
												{!disableLocalTime
													? dayjs(defaultSubscription?.cancel_at).calendar(null, calendarStrings)
													: dayjs
															.utc(defaultSubscription?.cancel_at)
															.calendar(null, calendarStrings)}
												<span tw="ml-1 font-medium">
													({!disableLocalTime ? dayjs.tz.guess() : "UTC"})
												</span>
											</p>
										</span>
									</div>
								) : null}
								{data?.id == defaultSubscription?.id ? (
									<button tw="block w-full text-center rounded-lg border bg-white px-6 py-4 text-xl leading-6 font-medium text-indigo-600 border-indigo-700 cursor-not-allowed focus:outline-none">
										{SubscriptionLabels[4].label}
									</button>
								) : (
									<button
										type="button"
										css={[
											tw`block w-full text-center rounded-lg border border-transparent bg-indigo-600 px-6 py-4 text-lg leading-6 font-medium text-white`,
											!defaultPaymentMethod || loadingProSemiAnnually
												? tw`opacity-50 cursor-not-allowed`
												: tw`hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`
										]}
										disabled={!defaultPaymentMethod || loadingProSemiAnnually ? "disabled" : ""}
										onClick={() => {
											setUpdatedPlanId(data?.id);
											setUpdatedPlanName(data?.group?.name);
											setShowModal(!showModal);
										}}
									>
										{loadingProSemiAnnually
											? SubscriptionPlanLabels[1].label
											: SubscriptionLabels[3].label}
									</button>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		) : data?.group?.name == "Agency" ? (
			<div tw="mt-10 mx-auto max-w-md lg:m-0 lg:max-w-none lg:col-start-6 lg:col-end-8 lg:row-start-2 lg:row-end-3">
				<div tw="h-full flex flex-col rounded-lg shadow-lg overflow-hidden lg:rounded-none lg:rounded-r-lg border">
					<div tw="flex-1 flex flex-col">
						<div tw="bg-white px-6 py-10">
							<div>
								<h3 tw="text-center text-2xl leading-8 font-medium text-gray-900" id="tier-scale">
									{data?.group?.name == "Agency2" ? "Agency" : data?.group?.name}
									<span tw="text-red-400">*</span>
								</h3>
								<div tw="mt-4 flex items-center justify-center">
									<span tw="px-3 flex items-start text-6xl leading-none tracking-tight text-gray-900">
										<span tw="mt-2 mr-2 text-4xl font-medium">$</span>
										<span tw="font-bold">{data?.price?.unit_amount / 100}</span>
									</span>
									<span tw="text-xl leading-7 font-medium text-gray-500">
										{SubscriptionLabels[22].label}
									</span>
								</div>
							</div>
						</div>
						<div tw="flex-1 flex flex-col justify-between border-t border-gray-300 p-6 bg-white sm:p-10 lg:p-6 xl:p-10">
							<ul>
								{data?.features.map((val2, key) => {
									return (
										<li key={key} tw="flex items-start my-3">
											<div tw="flex-shrink-0">
												<CheckIcon tw="h-6 w-6 text-green-500" />
											</div>
											<p tw="ml-3 text-base leading-6 font-medium text-gray-500">{val2}</p>
										</li>
									);
								})}
							</ul>

							<div tw="mt-8">
								<div
									css={[
										tw`rounded-lg`,
										data?.id == defaultSubscription?.id ? tw`shadow-none` : tw`shadow-sm`
									]}
								>
									{data?.id == defaultSubscription?.id &&
									defaultSubscription?.status == "PAID" &&
									defaultSubscription?.cancel_at !== null ? (
										<div tw="relative flex justify-center flex-wrap flex-row text-sm leading-5">
											<span tw="px-2 py-5 text-gray-600 text-center">
												<p tw="text-sm font-medium">{SubscriptionPlanLabels[0].label}</p>
												<p tw="text-xs text-gray-500">
													{!disableLocalTime
														? dayjs(defaultSubscription?.cancel_at).calendar(null, calendarStrings)
														: dayjs
																.utc(defaultSubscription?.cancel_at)
																.calendar(null, calendarStrings)}
													<span tw="ml-1 font-medium">
														({!disableLocalTime ? dayjs.tz.guess() : "UTC"})
													</span>
												</p>
											</span>
										</div>
									) : null}
									{data?.id == defaultSubscription?.id ? (
										<button tw="block w-full text-center rounded-lg border bg-white px-6 py-4 text-xl leading-6 font-medium text-indigo-600 border-indigo-700 cursor-not-allowed focus:outline-none">
											{SubscriptionLabels[4].label}
										</button>
									) : (
										<button
											type="button"
											css={[
												tw`block w-full text-center rounded-lg border border-transparent bg-indigo-600 px-6 py-4 text-lg leading-6 font-medium text-white`,
												!defaultPaymentMethod || loadingAgencySemiAnnually
													? tw`opacity-50 cursor-not-allowed`
													: tw`hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`
											]}
											disabled={
												!defaultPaymentMethod || loadingAgencySemiAnnually ? "disabled" : ""
											}
											onClick={() => {
												setUpdatedPlanId(data?.id);
												setUpdatedPlanName(data?.group?.name);
												setShowModal(!showModal);
											}}
										>
											{loadingAgencySemiAnnually
												? SubscriptionPlanLabels[1].label
												: SubscriptionLabels[3].label}
										</button>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		) : null
	) : (
		<>
			<span tw="mt-10 max-w-lg mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-start-3 lg:col-end-6 lg:row-start-1 lg:row-end-4">
				<Skeleton duration={2} width={521.11} height={811} />
			</span>
			<span tw="mt-10 mx-auto max-w-md lg:m-0 lg:max-w-none lg:col-start-6 lg:col-end-8 lg:row-start-2 lg:row-end-3">
				<Skeleton duration={2} width={347.41} height={553} />
			</span>
		</>
	);
};

SemiAnnualPlans.propTypes = {
	componentReady: PropTypes.bool,
	data: PropTypes.shape({
		features: PropTypes.array,
		group: PropTypes.shape({
			name: PropTypes.string
		}),
		id: PropTypes.number,
		price: PropTypes.shape({
			unit_amount: PropTypes.number
		})
	}),
	defaultPaymentMethod: PropTypes.object,
	defaultSubscription: PropTypes.shape({
		cancel_at: PropTypes.string,
		id: PropTypes.number,
		status: PropTypes.string
	}),
	disableLocalTime: PropTypes.bool,
	features: PropTypes.any,
	group: PropTypes.shape({
		name: PropTypes.any
	}),
	id: PropTypes.any,
	id: PropTypes.any,
	loadingAgencySemiAnnually: PropTypes.bool,
	loadingProSemiAnnually: PropTypes.bool,
	name: PropTypes.any,
	price: PropTypes.shape({
		unit_amount: PropTypes.any
	}),
	setShowModal: PropTypes.func,
	setUpdatedPlanId: PropTypes.func,
	setUpdatedPlanName: PropTypes.func,
	showModal: PropTypes.bool,
	status: PropTypes.any,
	unit_amount: PropTypes.any
};

SemiAnnualPlans.defaultProps = {
	componentReady: false,
	data: {
		features: null,
		group: {
			name: null
		},
		id: null,
		price: {
			unit_amount: null
		}
	},
	defaultPaymentMethod: null,
	defaultSubscription: {
		cancel_at: null,
		id: null,
		status: null
	},
	disableLocalTime: false,
	loadingAgencySemiAnnually: false,
	loadingProSemiAnnually: false,
	setShowModal: null,
	setUpdatedPlanId: null,
	setUpdatedPlanName: null,
	showModal: false
};

export default SemiAnnualPlans;
