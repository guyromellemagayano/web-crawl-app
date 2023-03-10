import { NotificationDisplayInterval } from "@constants/GlobalValues";
import { handleConversionStringToUppercase } from "@utils/convertCase";

export const handleNotificationMessages = ({
	dispatch,
	config,
	setConfig,
	state,
	isLinks = false,
	isLocalTimeDisabled = false,
	isLocalTimeEnabled = false,
	isLogin = false,
	isLogout = false,
	isPages = false,
	isPasswordChange = false,
	isPasswordReset = false,
	isPasswordResetConfirm = false,
	isStripePaymentMethod = false,
	isStripePaymentMethodDefault = false,
	isRegistration = false,
	isScan = false,
	isSignup = false,
	isSites = false,
	isStats = false,
	isStripeSubscriptions = false,
	isStripeSubscriptionsCurrent = false,
	isSupport = false,
	isUrlInformationStep = false,
	isUser = false,
	isVerifyUrlStep = false,
	data,
	fallback
}) => {
	if (typeof data === "object") {
		dispatch({
			...state,
			...(isLinks && { isLinks: isLinks }),
			...(isLocalTimeDisabled && { isLocalTimeDisabled: isLocalTimeDisabled }),
			...(isLocalTimeEnabled && { isLocalTimeEnabled: isLocalTimeEnabled }),
			...(isLogin && { isLogin: isLogin }),
			...(isLogout && { isLogout: isLogout }),
			...(isPages && { isPages: isPages }),
			...(isPasswordChange && { isPasswordChange: isPasswordChange }),
			...(isPasswordReset && { isPasswordReset: isPasswordReset }),
			...(isPasswordResetConfirm && { isPasswordResetConfirm: isPasswordResetConfirm }),
			...(isStripePaymentMethod && { isStripePaymentMethod: isStripePaymentMethod }),
			...(isStripePaymentMethodDefault && { isStripePaymentMethodDefault: isStripePaymentMethodDefault }),
			...(isRegistration && { isRegistration: isRegistration }),
			...(isScan && { isScan: isScan }),
			...(isSignup && { isSignup: isSignup }),
			...(isSites && { isSites: isSites }),
			...(isStats && { isStats: isStats }),
			...(isStripeSubscriptions && { isStripeSubscriptions: isStripeSubscriptions }),
			...(isStripeSubscriptionsCurrent && { isStripeSubscriptionsCurrent: isStripeSubscriptionsCurrent }),
			...(isSupport && { isSupport: isSupport }),
			...(isUrlInformationStep && { isUrlInformationStep: isUrlInformationStep }),
			...(isUser && { isUser: isUser }),
			...(isVerifyUrlStep && { isVerifyUrlStep: isVerifyUrlStep }),
			method: handleConversionStringToUppercase(data.method),
			status: data.status,
			isAlert: data.isAlert,
			isNotification: data.isNotification,
			responses: [
				...state.responses,
				{
					responseTitle:
						data.title?.length > 0 && data.status
							? data.title
							: Math.round(data.status / 100) === 4
							? fallback.unknownClientErrorResponse.title
							: Math.round(data.status / 100) === 5
							? fallback.unknownServerErrorResponse.title
							: fallback.unknownResponse.title,
					responseText:
						data.message?.length > 0 && data.status
							? data.message
							: Math.round(data.status / 100) === 4
							? fallback.unknownClientErrorResponse.message
							: Math.round(data.status / 100) === 5
							? fallback.unknownServerErrorResponse.message
							: fallback.unknownResponse.message,
					isSuccess: data.isSuccess
				}
			]
		});

		const hideMessageTimeout = setTimeout(() => {
			dispatch({
				...state,
				...(isLinks && { isLinks: false }),
				...(isLocalTimeDisabled && { isLocalTimeDisabled: !isLocalTimeDisabled }),
				...(isLocalTimeEnabled && { isLocalTimeEnabled: !isLocalTimeEnabled }),
				...(isLogin && { isLogin: !isLogin }),
				...(isLogout && { isLogout: !isLogout }),
				...(isPages && { isPages: !isPages }),
				...(isPasswordChange && { isPasswordChange: !isPasswordChange }),
				...(isPasswordReset && { isPasswordReset: !isPasswordReset }),
				...(isPasswordResetConfirm && { isPasswordResetConfirm: !isPasswordResetConfirm }),
				...(isStripePaymentMethod && { isStripePaymentMethod: !isStripePaymentMethod }),
				...(isStripePaymentMethodDefault && { isStripePaymentMethodDefault: !isStripePaymentMethodDefault }),
				...(isRegistration && { isRegistration: !isRegistration }),
				...(isScan && { isScan: !isScan }),
				...(isSignup && { isSignup: !isSignup }),
				...(isSites && { isSites: !isSites }),
				...(isStats && { isStats: !isStats }),
				...(isStripeSubscriptions && { isStripeSubscriptions: !isStripeSubscriptions }),
				...(isStripeSubscriptionsCurrent && { isStripeSubscriptionsCurrent: !isStripeSubscriptionsCurrent }),
				...(isSupport && { isSupport: !isSupport }),
				...(isUrlInformationStep && { isUrlInformationStep: !isUrlInformationStep }),
				...(isUser && { isUser: !isUser }),
				...(isVerifyUrlStep && { isVerifyUrlStep: !isVerifyUrlStep }),
				method: null,
				status: null,
				responses: [
					...state.responses,
					...state.responses.filter(
						({ responseTitle, responseText }) =>
							responseTitle !==
								(data.title?.length && data.status
									? data.title
									: Math.round(data.status / 100) === 4
									? fallback.unknownClientErrorResponse.title
									: Math.round(data.status / 100) === 5
									? fallback.unknownServerErrorResponse.title
									: fallback.unknownResponse.title) &&
							responseText !==
								(data.message?.length && data.status
									? data.message
									: Math.round(data.status / 100) === 4
									? fallback.unknownClientErrorResponse.message
									: Math.round(data.status / 100) === 5
									? fallback.unknownServerErrorResponse.message
									: fallback.unknownResponse.message)
					)
				]
			});

			setConfig({
				...(isLinks && { isLinks: !isLinks }),
				...(isLocalTimeDisabled && { isLocalTimeDisabled: !isLocalTimeDisabled }),
				...(isLocalTimeEnabled && { isLocalTimeEnabled: !isLocalTimeEnabled }),
				...(isLogin && { isLogin: !isLogin }),
				...(isLogout && { isLogout: !isLogout }),
				...(isPages && { isPages: !isPages }),
				...(isPasswordChange && { isPasswordChange: !isPasswordChange }),
				...(isPasswordReset && { isPasswordReset: !isPasswordReset }),
				...(isPasswordResetConfirm && { isPasswordResetConfirm: !isPasswordResetConfirm }),
				...(isStripePaymentMethod && { isStripePaymentMethod: !isStripePaymentMethod }),
				...(isStripePaymentMethodDefault && { isStripePaymentMethodDefault: !isStripePaymentMethodDefault }),
				...(isRegistration && { isRegistration: !isRegistration }),
				...(isScan && { isScan: !isScan }),
				...(isSignup && { isSignup: !isSignup }),
				...(isSites && { isSites: !isSites }),
				...(isStats && { isStats: !isStats }),
				...(isStripeSubscriptions && { isStripeSubscriptions: !isStripeSubscriptions }),
				...(isStripeSubscriptionsCurrent && { isStripeSubscriptionsCurrent: !isStripeSubscriptionsCurrent }),
				...(isSupport && { isSupport: !isSupport }),
				...(isUrlInformationStep && { isUrlInformationStep: !isUrlInformationStep }),
				...(isUser && { isUser: !isUser }),
				...(isVerifyUrlStep && { isVerifyUrlStep: !isVerifyUrlStep }),
				isAlert: null,
				isNotification: null,
				method: null,
				status: null
			});
		}, NotificationDisplayInterval);

		return () => {
			clearTimeout(hideMessageTimeout);
		};
	}

	return { state, config };
};
