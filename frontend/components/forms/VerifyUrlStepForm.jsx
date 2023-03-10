import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import { NotificationDisplayInterval } from "@constants/GlobalValues";
import { AddNewSiteLink, DashboardSitesLink } from "@constants/PageLinks";
import { handlePostMethod } from "@helpers/handleHttpMethods";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classnames } from "@utils/classnames";
import { Formik } from "formik";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { memo, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Custom function to render the "VerifyUrlStepForm" component
 *
 * @param {object} siteData
 * @param {number} sid
 * @param {number} step
 * @param {boolean} verified
 * @param {boolean} disableSiteVerify
 * @param {function} setDisableSiteVerify
 */
const VerifyUrlStepForm = ({
	siteData = null,
	sid = null,
	step = null,
	verified = false,
	setDisableSiteVerify,
	disableSiteVerify = false
}) => {
	// Translations
	const { t } = useTranslation("sites");
	const goToSiteOverview = t("goToSiteOverview");
	const verifying = t("verifying");
	const verifySiteNow = t("verifySiteNow");
	const verifySiteLater = t("verifySiteLater");
	const updateSiteDetails = t("updateSiteDetails");

	// Router
	const { replace } = useRouter();

	// Custom context
	const { isComponentReady, setConfig, state } = useContext(SiteCrawlerAppContext);

	// Custom variables
	const customSiteIdVerifyApiEndpoint = SitesApiEndpoint + sid + "/verify/";
	const siteIdName = siteData?.name ?? "";
	const siteIdUrl = siteData?.url ?? "";
	const siteIdVerificationId = siteData?.verification_id ?? "";

	// Handle edit mode
	const handleEditMode = (e) => {
		e.preventDefault();

		// Update current URL with query for the next step
		replace(
			{
				pathname: AddNewSiteLink,
				query: { step: step - 1, sid: sid ?? null, edit: true, verified: false }
			},
			undefined,
			{}
		);
	};

	return (
		<Formik
			enableReinitialize={true}
			initialValues={{
				url: siteIdUrl,
				name: siteIdName,
				verification_id: siteIdVerificationId
			}}
			onSubmit={async (values) => {
				setDisableSiteVerify(!disableSiteVerify);

				const body = {
					url: values.url,
					name: values.name,
					verification_id: values.verification_id
				};

				const verifyUrlStepResponse = await handlePostMethod(customSiteIdVerifyApiEndpoint, body);
				const verifyUrlStepData = verifyUrlStepResponse?.data ?? null;
				const verifyUrlStepStatus = verifyUrlStepResponse?.status ?? null;
				const verifyUrlStepMethod = verifyUrlStepResponse?.config?.method ?? null;

				// Show alert message after successful 200 OK or 201 Created response is issued
				setConfig({
					isVerifyUrlStep: true,
					method: verifyUrlStepMethod,
					status: verifyUrlStepStatus,
					isAlert: false,
					isNotification: false,
					isError: verifyUrlStepData?.verified ? false : true
				});

				const verifyUrlStepResponseTimeout = setTimeout(() => {
					if (verifyUrlStepData !== null && Math.round(verifyUrlStepStatus / 200) === 1) {
						if (verifyUrlStepData?.verified) {
							// Update router query
							replace({
								pathname: AddNewSiteLink,
								query: { step: step + 1, sid: sid ?? null, edit: false, verified: true }
							});
						} else {
							// Enable next step in site verification process and disable site verification as soon as 200 OK or 201 Created response was issued
							setDisableSiteVerify(disableSiteVerify);
						}
					} else {
						setDisableSiteVerify(disableSiteVerify);
					}
				}, [NotificationDisplayInterval]);

				return () => {
					clearTimeout(verifyUrlStepResponseTimeout);
				};
			}}
		>
			{({ handleSubmit, isSubmitting, handleChange, values }) => (
				<form className="space-y-8" onSubmit={handleSubmit}>
					<div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
						{isComponentReady && verified ? (
							(step === 3 || step === 2) && sid ? (
								<span className="sm:col-span-3">
									{siteData ? (
										<Link href={DashboardSitesLink + "[id]" + "/"} as={DashboardSitesLink + sid + "/"} passHref replace>
											<a className="relative inline-flex cursor-pointer items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium leading-5 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:mt-0">
												{goToSiteOverview}
											</a>
										</Link>
									) : (
										<Skeleton duration={2} width={160} height={38} className="mr-3" />
									)}
								</span>
							) : (
								<div className="flex justify-between sm:col-span-6">
									<div>
										<span className="inline-flex">
											<Skeleton duration={2} width={135} height={38} className="mr-3" />
										</span>
									</div>
								</div>
							)
						) : null}

						{isComponentReady && !verified ? (
							step === 2 && sid ? (
								<>
									{state?.isVerifyUrlStep && state?.responses?.length > 0 ? (
										<div className="sm:col-span-6">
											<div className="relative my-1">
												{state.responses.map((value, key) => {
													// Alert Messsages
													const responseText = value.responseText;
													const isSuccess = value.isSuccess;

													return (
														<h3
															key={key}
															className={classnames(
																"break-words text-sm font-medium leading-5",
																isSuccess ? "text-green-800" : "text-red-800"
															)}
														>
															{responseText}
														</h3>
													);
												})}
											</div>
										</div>
									) : null}

									<div className="flex justify-between sm:col-span-6">
										<div>
											<input
												id="siteurl"
												type="hidden"
												name="siteurl"
												disabled={true}
												className="block w-full cursor-not-allowed rounded-md border-gray-300 bg-gray-300 opacity-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
												aria-describedby="siteurl"
												onChange={handleChange}
												value={values.url}
											/>

											<input
												id="sitename"
												type="hidden"
												name="sitename"
												disabled={true}
												className="block w-full cursor-not-allowed rounded-md border-gray-300 bg-gray-300 opacity-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
												aria-describedby="sitename"
												onChange={handleChange}
												value={values.name}
											/>

											<input
												id="siteverificationid"
												type="hidden"
												name="siteverificationid"
												disabled={true}
												className="block w-full cursor-not-allowed rounded-md border-gray-300 bg-gray-300 opacity-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
												aria-describedby="siteverificationid"
												onChange={handleChange}
												value={values.verification_id}
											/>

											<span className="inline-flex">
												<button
													type="submit"
													disabled={disableSiteVerify}
													className={classnames(
														"relative mt-3 mr-3 inline-flex w-full items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium leading-5 text-white sm:mt-0",
														disableSiteVerify
															? "cursor-not-allowed opacity-50"
															: "hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
													)}
												>
													{disableSiteVerify ? verifying : verifySiteNow}
												</button>
											</span>

											<span className="inline-flex">
												<Link href={DashboardSitesLink} passHref replace>
													<a
														disabled={disableSiteVerify}
														className={classnames(
															"relative mt-3 mr-3 inline-flex w-full cursor-pointer items-center rounded-md border border-transparent bg-yellow-600 px-4 py-2 text-sm font-medium leading-5 text-white sm:mt-0",
															disableSiteVerify
																? "cursor-not-allowed opacity-50"
																: "hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
														)}
													>
														{verifySiteLater}
													</a>
												</Link>
											</span>
										</div>

										<div>
											<span className="inline-flex">
												<button
													disabled={disableSiteVerify}
													className={classnames(
														"relative mt-3 mr-3 inline-flex w-full cursor-pointer items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium leading-5 text-gray-700 sm:mt-0",
														disableSiteVerify
															? "cursor-not-allowed opacity-50"
															: "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
													)}
													onClick={handleEditMode}
												>
													{updateSiteDetails}
												</button>
											</span>
										</div>
									</div>
								</>
							) : (
								<div className="flex justify-between sm:col-span-6">
									<div>
										<span className="inline-flex">
											<Skeleton duration={2} width={135} height={38} className="mr-3" />
										</span>

										<span className="inline-flex">
											<Skeleton duration={2} width={140} height={38} className="mr-3" />
										</span>
									</div>

									<div>
										<span className="inline-flex">
											<Skeleton duration={2} width={161} height={38} className="mr-3" />
										</span>
									</div>
								</div>
							)
						) : null}
					</div>
				</form>
			)}
		</Formik>
	);
};

VerifyUrlStepForm.propTypes = {
	disableSiteVerify: PropTypes.bool,
	setDisableSiteVerify: PropTypes.func,
	sid: PropTypes.any,
	siteData: PropTypes.shape({
		name: PropTypes.string,
		url: PropTypes.string,
		verification_id: PropTypes.string
	}),
	step: PropTypes.number,
	verified: PropTypes.bool
};

/**
 * Memoized custom "VerifyUrlStepForm" component
 */
export const MemoizedVerifyUrlStepForm = memo(VerifyUrlStepForm);
