// Policy documents shown in Settings › Policies.
// Add a new entry here to add another policy card — the UI is data-driven.
export const POLICIES = [
  {
    id: 'terms',
    icon: 'terms',
    title: 'Terms and Conditions of Service',
    summary: 'The rules for using Rodiall devices, Flex Ownership, repayments and the customer portal.',
    updated: 'October 1, 2026',
    sections: [
      ['1. About these terms', 'These Terms and Conditions govern your use of Rodiall devices, the Rodiall customer portal and related services such as Repay+ Plus, fractional storage and data bundles. By creating an account or activating a device, you agree to these terms.'],
      ['2. Your account', 'You must provide accurate information when creating your account and keep your login details secure. You are responsible for activity on your account. Tell us immediately if you suspect unauthorised access.'],
      ['3. Flex Ownership', 'Devices obtained through Flex Ownership remain the property of Rodiall until all repayments are complete. Once your outstanding balance reaches zero, full ownership transfers to you and the device is permanently unlocked.'],
      ['4. Repayments', 'Repayments are deducted according to the plan you selected. Missed repayments may restrict some device features until your account is brought up to date. You can view your outstanding balance and payment history in the portal at any time.'],
      ['5. Device activation', 'Reserved devices must be collected or activated by the date shown on your reservation. Activation requires a valid government-issued ID and the phone number registered on your account.'],
      ['6. Storage, data and Repay+ Plus', 'Fractional storage, data bundles and Repay+ Plus purchases are valid for the period shown at the time of purchase and are non-refundable once activated, except where required by law.'],
      ['7. Acceptable use', 'You agree not to use Rodiall devices or services for unlawful purposes, to tamper with device security, or to resell a device before ownership has transferred to you.'],
      ['8. Changes to these terms', 'We may update these terms from time to time. We will notify you of material changes through the portal or by SMS. Continued use of our services after changes take effect means you accept the updated terms.'],
      ['9. Contact', 'Questions about these terms can be sent to our support team through Settings › Support.'],
    ],
  },
  {
    id: 'privacy',
    icon: 'privacy',
    title: 'Privacy Policy',
    summary: 'How Rodiall collects, uses, stores and protects your personal information and device data.',
    updated: 'October 1, 2026',
    sections: [
      ['1. Information we collect', 'We collect the details you give us, such as your name, email address, phone numbers and identity documents at activation, along with device information (model, serial number and device UID) and records of your payments and subscriptions.'],
      ['2. How we use your information', 'We use your information to provide and secure your account, process repayments and purchases, activate and support your device, prevent fraud, and send you important service updates.'],
      ['3. Payment information', 'Card details are processed using PCI-DSS Level 1 encrypted tokenization. Full card numbers and security codes are never stored on our servers. We keep only the masked digits and a card type token.'],
      ['4. Sharing your information', 'We share information only with partners who help us deliver our services, such as payment processors, mobile network operators and activation agents, and only as needed. We never sell your personal data.'],
      ['5. Data retention', 'We keep your information for as long as your account is active and as required to meet legal, accounting and regulatory obligations. Afterwards it is securely deleted or anonymised.'],
      ['6. Your rights', 'You can request access to, correction of, or deletion of your personal information, subject to legal requirements. Contact support to make a request.'],
      ['7. Security', 'We protect your account with encryption, two-factor authentication and continuous monitoring. Please keep your password private and enable notifications for sign-in activity.'],
      ['8. Updates to this policy', 'We may update this policy as our services change. The “Last updated” date at the top shows when it was last revised.'],
    ],
  },
]
