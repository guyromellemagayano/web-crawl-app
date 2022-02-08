import { MemoizedRegistrationForm } from "@components/forms/RegistrationForm";
import { MemoizedLogoLabel } from "@components/labels/LogoLabel";
import { LoginLink } from "@constants/PageLinks";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { memo } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import "twin.macro";

/**
 * Custom function to render the `RegistrationPageLayout` component
 */
const RegistrationPageLayout = () => {
	// Translations
	const { t } = useTranslation();
	const agreeTermsPrivacyPolicy = t("registration:agreeTermsPrivacyPolicy");
	const alreadyHaveAccount = t("common:alreadyHaveAccount");
	const isLogin = t("common:isLogin");

	return (
		<div tw="bg-gray-50 overflow-auto h-screen">
			<Scrollbars universal>
				<section tw="h-screen bg-gray-50 flex flex-col justify-center relative overflow-auto py-12 sm:px-6 lg:px-8">
					<div tw="mx-auto max-w-screen-xl">
						<div tw="relative my-8 sm:my-16 md:my-20 lg:my-24">
							<MemoizedLogoLabel isSignUp />

							<div tw="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
								<div tw="bg-white mt-8 py-8 px-4 shadow-xl rounded-lg sm:px-10">
									<MemoizedRegistrationForm />
								</div>

								<div tw="relative flex justify-center flex-wrap flex-row text-sm leading-5">
									<span tw="text-center px-2 py-5 text-gray-500">{agreeTermsPrivacyPolicy}</span>
								</div>

								<div tw="relative flex justify-center flex-wrap flex-row text-sm leading-5">
									<span tw="p-2 text-gray-500">
										{alreadyHaveAccount}&nbsp;
										<Link href={LoginLink} passHref>
											<a tw="font-medium text-indigo-600 cursor-pointer hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150">
												{isLogin}
											</a>
										</Link>
									</span>
								</div>
							</div>
						</div>
					</div>
				</section>
			</Scrollbars>
		</div>
	);
};

/**
 * Memoized custom `RegistrationPageLayout` component
 */
export const MemoizedRegistrationPageLayout = memo(RegistrationPageLayout);