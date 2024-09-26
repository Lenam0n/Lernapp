import React from "react";
import "./Terms.css"; // Separate CSS-Datei für die Stile

const TermsOfService = () => {
  return (
    <div className="terms-container">
      <h1 className="terms-title">Terms of Service</h1>
      <p className="terms-date">
        <strong>Effective Date:</strong> [Insert Date]
      </p>
      <h2 className="terms-subtitle">Acceptance of Terms</h2>
      <p className="terms-text">
        By using our services, you agree to these Terms of Service. If you do
        not agree to these terms, you may not use our services.
      </p>
      <h2 className="terms-subtitle">Use of Services</h2>
      <p className="terms-text">
        You agree to use our services only for lawful purposes and in accordance
        with these terms. You must not:
      </p>
      <ul className="terms-list">
        <li>Engage in any fraudulent activity.</li>
        <li>Violate any laws or regulations.</li>
        <li>Transmit any harmful or disruptive content (e.g., viruses).</li>
      </ul>
      <h2 className="terms-subtitle">Account Responsibility</h2>
      <p className="terms-text">
        You are responsible for maintaining the confidentiality of your account
        information. You agree to notify us immediately of any unauthorized use
        of your account.
      </p>
      <h2 className="terms-subtitle">Intellectual Property</h2>
      <p className="terms-text">
        All content, logos, and materials on our platform are the intellectual
        property of [Your Company Name] and protected by copyright law. You may
        not use or reproduce any of our content without our express permission.
      </p>
      <h2 className="terms-subtitle">Termination</h2>
      <p className="terms-text">
        We reserve the right to terminate your access to our services at any
        time if you violate these terms.
      </p>
      <h2 className="terms-subtitle">Limitation of Liability</h2>
      <p className="terms-text">
        We are not liable for any damages resulting from the use or inability to
        use our services. Our liability is limited to the maximum extent
        permitted by law.
      </p>
      <h2 className="terms-subtitle">Governing Law</h2>
      <p className="terms-text">
        These Terms of Service are governed by the laws of [Your Country/State].
      </p>
      <h2 className="terms-subtitle">Contact Us</h2>
      <p className="terms-text">
        If you have any questions regarding these Terms of Service, please
        contact us at [Insert Email].
      </p>
    </div>
  );
};

export default TermsOfService;
