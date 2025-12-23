/**
 * Thumbway Homepage
 *
 * Landing page for the approval tool.
 */

import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");
  const tNav = useTranslations("nav");

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {tCommon("appName")}
          </h1>
          <div className="flex gap-4">
            <a
              href="/signin"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              {tNav("signIn")}
            </a>
            <a
              href="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {tNav("getStarted")}
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
            {t("hero.title")}
            <br />
            <span className="text-blue-600">{t("hero.titleHighlight")}</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {t("hero.subtitle")}
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium text-lg transition-colors"
            >
              {t("hero.cta")}
            </a>
            <a
              href="/dashboard"
              className="bg-white hover:bg-gray-50 text-gray-900 px-8 py-3 rounded-lg font-medium text-lg border border-gray-300 transition-colors"
            >
              {t("hero.viewDashboard")}
            </a>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t("features.emailNotifications.title")}
            </h3>
            <p className="text-gray-600">
              {t("features.emailNotifications.description")}
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t("features.chatgptIntegration.title")}
            </h3>
            <p className="text-gray-600">
              {t("features.chatgptIntegration.description")}
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t("features.simpleDecisions.title")}
            </h3>
            <p className="text-gray-600">
              {t("features.simpleDecisions.description")}
            </p>
          </div>
        </div>

        {/* Pricing */}
        <div className="mt-24">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {t("pricing.title")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                {t("pricing.free.name")}
              </h4>
              <p className="text-4xl font-bold text-gray-900 mb-4">
                {t("pricing.free.price")}
                <span className="text-lg text-gray-600">
                  {t("pricing.free.period")}
                </span>
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-gray-700">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {t("pricing.free.features.reviewsPerMonth")}
                </li>
                <li className="flex items-center text-gray-700">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {t("pricing.free.features.emailNotifications")}
                </li>
                <li className="flex items-center text-gray-700">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {t("pricing.free.features.chatgptIntegration")}
                </li>
              </ul>
              <a
                href="/signup"
                className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                {t("pricing.free.cta")}
              </a>
            </div>

            <div className="bg-blue-600 p-8 rounded-lg shadow-lg border-2 border-blue-700">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-xl font-semibold text-white">
                  {t("pricing.pro.name")}
                </h4>
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  {t("pricing.pro.badge")}
                </span>
              </div>
              <p className="text-4xl font-bold text-white mb-4">
                {t("pricing.pro.price")}
                <span className="text-lg text-blue-200">
                  {t("pricing.pro.period")}
                </span>
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-white">
                  <svg
                    className="w-5 h-5 text-blue-200 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {t("pricing.pro.features.unlimitedReviews")}
                </li>
                <li className="flex items-center text-white">
                  <svg
                    className="w-5 h-5 text-blue-200 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {t("pricing.pro.features.everythingInFree")}
                </li>
                <li className="flex items-center text-white">
                  <svg
                    className="w-5 h-5 text-blue-200 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {t("pricing.pro.features.prioritySupport")}
                </li>
              </ul>
              <a
                href="/signup"
                className="block w-full text-center bg-white hover:bg-gray-100 text-blue-600 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                {t("pricing.pro.cta")}
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t mt-24">
        <div className="text-center text-gray-600">
          <p>{t("footer.copyright")}</p>
        </div>
      </footer>
    </div>
  );
}
