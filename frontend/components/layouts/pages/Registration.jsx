import { MemoizedRegistrationForm } from "@components/forms/RegistrationForm";
import { MemoizedLogoLabel } from "@components/labels/LogoLabel";
import { LoginLink } from "@constants/PageLinks";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { memo } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";

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
		<div className="h-screen overflow-auto bg-gray-50">
			<Scrollbars autoHide universal>
				<section className="relative flex h-full flex-col overflow-auto bg-gray-50 py-12 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-screen-xl">
						<div className="relative my-8 sm:my-16 md:my-20 lg:my-24">
							<MemoizedLogoLabel isSignUp />

							<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
								<div className="mt-8 rounded-lg bg-white py-8 px-4 shadow-xl sm:px-10">
									<MemoizedRegistrationForm />
								</div>

								<div className="relative flex flex-row flex-wrap justify-center text-sm leading-5">
									<span className="px-2 py-5 text-center text-gray-500">{agreeTermsPrivacyPolicy}</span>
								</div>

								<div className="relative flex flex-row flex-wrap justify-center text-sm leading-5">
									<span className="flex justify-center p-2 text-gray-500">
										{alreadyHaveAccount}&nbsp;
										<Link href={LoginLink} passHref>
											<a className="cursor-pointer font-medium text-indigo-600 transition duration-150 ease-in-out hover:text-indigo-500 focus:underline focus:outline-none">
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
