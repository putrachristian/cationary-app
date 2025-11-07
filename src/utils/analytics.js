import ReactGA from "react-ga4";

const GA_MEASUREMENT_ID = "G-4Z932YWN6V";

/**
 * Initialize Google Analytics 4
 */
export const initGA = () => {
  if (typeof window !== "undefined") {
    ReactGA.initialize(GA_MEASUREMENT_ID);
  }
};

/**
 * Track page views
 */
export const trackPageView = (page) => {
  if (typeof window !== "undefined") {
    ReactGA.send({ hitType: "pageview", page: page, title: document.title });
  }
};

/**
 * Track custom events
 */
export const trackEvent = (eventName, eventParams = {}) => {
  if (typeof window !== "undefined") {
    ReactGA.event(eventName, eventParams);
  }
};

