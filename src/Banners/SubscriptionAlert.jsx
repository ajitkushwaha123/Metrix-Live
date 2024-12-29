/* This example requires Tailwind CSS v2.0+ */
import { useState, useEffect } from "react";
import { SpeakerphoneIcon, XIcon } from "@heroicons/react/outline";
import useFetch from "../hooks/fetch.hooks";

export default function SubscriptionAlert({ subscription = "Platinum" }) {
  const [showAlert, setShowAlert] = useState(false);
  const [days, setDays] = useState(0);

  const [{ apiData }] = useFetch();

  useEffect(() => {
    if (!apiData) return;

    let duration = 0;
    if (apiData?.subscription === "FREE") {
      duration = 7;
    } else if (apiData?.subscription === "STARTER") {
      duration = 30;
    } else if (apiData?.subscription === "GROWTH") {
      duration = 180;
    } else if (apiData?.subscription === "ENTERPRISE") {
      duration = 365;
    }

    const subscriptionStartDate = new Date(
      apiData?.subscriptionStartDate
    ).getTime();
    const durationInMilliseconds = duration * 24 * 60 * 60 * 1000;
    const remainingMilliseconds =
      subscriptionStartDate + durationInMilliseconds - Date.now();
    const remainingDays = Math.floor(
      remainingMilliseconds / (24 * 60 * 60 * 1000)
    );

    setDays(remainingDays);
    // setShowAlert(true);
    if (remainingDays < 7) {
      const lastDismissed = localStorage.getItem("subscriptionAlertDismissed");
      if (
        !lastDismissed ||
        Date.now() - Number(lastDismissed) > 24 * 60 * 60 * 1000
      ) {
        setShowAlert(true);
      }
    }
  }, [apiData]);

  const handleDismiss = () => {
    setShowAlert(false);
    localStorage.setItem("subscriptionAlertDismissed", Date.now());
  };

  if (!showAlert) return null;

  return (
    <div className="bg-indigo-600">
      <div className="max-w-full mx-auto py-3 px-3 sm:px-5 lg:px-8">
        <div className="flex items-center justify-between flex-wrap">
          <div className="w-0 flex-1 flex items-center">
            <span className="flex p-2 rounded-lg bg-indigo-800">
              <SpeakerphoneIcon
                className="h-6 w-6 text-white"
                aria-hidden="true"
              />
            </span>
            <p className="ml-3 font-medium text-white truncate">
              <span className="block md:hidden">
                Your {apiData?.subscription} Plan is expiring in {days} days.
              </span>
              <span className="hidden md:block">
                Your {apiData?.subscription} Plan will be expiring in {days} days. Renew
                now for a hassle-free experience.
              </span>
            </p>
          </div>
          <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
            <a
              href="https://billing.magicscale.in/#pricing"
              className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50"
            >
              Renew Now
            </a>
          </div>
          <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
            <button
              type="button"
              onClick={handleDismiss}
              className="-mr-1 flex p-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2"
            >
              <span className="sr-only">Dismiss</span>
              <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
