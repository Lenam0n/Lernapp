import React from "react";
import "./PrivacyPolicy.css"; // Separate CSS-Datei für die Stile

const PrivacyPolicy = () => {
  return (
    <div className="privacy-container">
      <h1 className="privacy-title">Privacy Policy</h1>
      <p className="privacy-date">
        <strong>Effective Date:</strong> [Insert Date]
      </p>
      <h2 className="privacy-subtitle">Introduction</h2>
      <p className="privacy-text">
        We value your privacy and are committed to protecting your personal
        information. This Privacy Policy explains what information we collect,
        how we use it, and your rights regarding your personal data.
      </p>
      <h2 className="privacy-subtitle">Information We Collect</h2>
      <p className="privacy-text">We collect the following information:</p>
      <ul className="privacy-list">
        <li>
          <strong>Personal Information:</strong> Name, email address, and other
          contact details.
        </li>
        <li>
          <strong>Usage Information:</strong> Data on how you interact with our
          services (e.g., pages visited, clicks).
        </li>
        <li>
          <strong>Cookies:</strong> We use cookies to track user behavior on our
          site.
        </li>
      </ul>
      <h2 className="privacy-subtitle">How We Use Your Information</h2>
      <p className="privacy-text">
        Your information is used for the following purposes:
      </p>
      <ul className="privacy-list">
        <li>To provide and improve our services.</li>
        <li>To communicate with you (e.g., updates, promotions).</li>
        <li>To analyze usage and trends to enhance user experience.</li>
      </ul>
      <h2 className="privacy-subtitle">Sharing Your Information</h2>
      <p className="privacy-text">
        We do not sell your personal information. We may share data with trusted
        third-party service providers to help deliver and improve our services.
      </p>
      <h2 className="privacy-subtitle">Your Rights</h2>
      <p className="privacy-text">
        You have the following rights regarding your personal data:
      </p>
      <ul className="privacy-list">
        <li>Access to your personal information.</li>
        <li>Request correction or deletion of your data.</li>
        <li>
          Opt-out of certain data processing activities (e.g., marketing).
        </li>
      </ul>
      <h2 className="privacy-subtitle">Contact Us</h2>
      <p className="privacy-text">
        If you have any questions about this Privacy Policy, you can contact us
        at [Insert Email].
      </p>
    </div>
  );
};

export default PrivacyPolicy;
