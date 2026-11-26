// Policy documents shown in Settings › Policies.
// Add a new entry here to add another policy card; the UI is data-driven.
//
// Each policy has English content (title, summary, sections) and optional `translations`
// keyed by language code. The reader's language dropdown only lists languages a policy has.
// NOTE: the Pidgin, Yoruba, Hausa and Igbo texts are draft translations of placeholder terms
// and must be reviewed by qualified translators and Rodiall legal before launch.

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'pcm', label: 'Pidgin' },
  { code: 'yo', label: 'Yoruba' },
  { code: 'ha', label: 'Hausa' },
  { code: 'ig', label: 'Igbo' },
]

// Tag shown at the top of the reader: which programme (or document type) the policy covers.
export const POLICY_TAGS = {
  flex: { label: 'Flex Ownership', tone: 'flex' },
  financing: { label: 'Rodiall Financing', tone: 'financing' },
  privacy: { label: 'Privacy Policy', tone: 'privacy' },
}

/** Content of a policy in a language, falling back to English. */
export function policyContent(policy, lang = 'en') {
  const t = lang !== 'en' ? policy.translations?.[lang] : null
  return {
    lang: t ? lang : 'en',
    title: t?.title ?? policy.title,
    summary: t?.summary ?? policy.summary,
    sections: t?.sections ?? policy.sections,
  }
}

/** Languages a policy is available in (English always). */
export function policyLanguages(policy) {
  return LANGUAGES.filter((l) => l.code === 'en' || policy.translations?.[l.code])
}

export const POLICIES = [
  {
    id: 'terms',
    icon: 'terms',
    tag: 'flex', // set to 'financing' on a Rodiall Financing terms document
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
    translations: {
      pcm: {
        title: 'Terms and Conditions for Service',
        summary: 'Di rules for how to use Rodiall devices, Flex Ownership, how to pay back and di customer portal.',
        sections: [
          ['1. About dis terms', 'Dis Terms and Conditions dey control how you go use Rodiall devices, di Rodiall customer portal and di oda services wey follow am like Repay+ Plus, small small storage and data bundles. If you open account or activate device, e mean say you agree to dis terms.'],
          ['2. Your account', 'You must give correct information when you dey open your account and keep your login details safe. Na you dey responsible for wetin happen for your account. Tell us sharp-sharp if you suspect say person wey no get right don enter.'],
          ['3. Flex Ownership', 'Devices wey you take through Flex Ownership still belong to Rodiall until you finish to pay back everything. Once your balance reach zero, di device go fully become your own and e go open for ever.'],
          ['4. How you go pay back', 'We go dey take di repayments based on di plan wey you choose. If you miss payment, some device features fit stop to work until you don clear wetin you owe. You fit check your balance and payment history for di portal any time.'],
          ['5. Device activation', 'You must collect or activate di device wey dem reserve for you before di date wey show for your reservation. To activate, you go need valid government ID and di phone number wey you register for your account.'],
          ['6. Storage, data and Repay+ Plus', 'Storage, data bundles and Repay+ Plus things wey you buy dey valid for di period wey dem show you when you buy am. Dem no dey refund money once e don activate, except say law talk say make dem refund.'],
          ['7. How you fit use am', 'You agree say you no go use Rodiall devices or services do anything wey against di law, tamper wit di device security, or sell di device before e don fully become your own.'],
          ['8. Changes to dis terms', 'We fit update dis terms from time to time. We go tell you about important changes for di portal or by SMS. If you continue to use our services after di changes start, e mean say you accept di new terms.'],
          ['9. Contact', 'If you get question about dis terms, you fit send am to our support team through Settings › Support.'],
        ],
      },
      yo: {
        title: 'Àwọn Òfin àti Ipò Iṣẹ́',
        summary: 'Àwọn ìlànà fún lílo àwọn ẹ̀rọ Rodiall, Flex Ownership, ìsanwó padà àti ojú-ìwé oníbàárà.',
        sections: [
          ['1. Nípa àwọn òfin wọ̀nyí', 'Àwọn Òfin àti Ipò wọ̀nyí ló ń ṣàkóso bí o ṣe ń lo àwọn ẹ̀rọ Rodiall, ojú-ìwé oníbàárà Rodiall àti àwọn iṣẹ́ tó jọmọ́ ọn bíi Repay+ Plus, ibi ìpamọ́ díẹ̀-díẹ̀ àti àwọn àpò dátà. Nípa ṣíṣí àkọọ́lẹ̀ tàbí mímú ẹ̀rọ ṣiṣẹ́, o gbà pẹ̀lú àwọn òfin wọ̀nyí.'],
          ['2. Àkọọ́lẹ̀ rẹ', 'O gbọ́dọ̀ pèsè ìwífún tó péye nígbà tí o bá ń ṣí àkọọ́lẹ̀ rẹ, kí o sì pa àlàyé ìwọlé rẹ mọ́ ní ààbò. Ìwọ ni o ni ẹrù iṣẹ́ àwọn ìgbòkègbodò inú àkọọ́lẹ̀ rẹ. Sọ fún wa lẹ́sẹ̀kẹsẹ̀ tí o bá fura sí ìwọlé láìgbàṣẹ.'],
          ['3. Flex Ownership', 'Àwọn ẹ̀rọ tí a gbà nípasẹ̀ Flex Ownership jẹ́ ohun-ìní Rodiall títí gbogbo ìsanwó padà yóò fi parí. Nígbà tí gbèsè rẹ bá dé òdo, ẹ̀tọ́ ìní pátápátá yóò di tìrẹ, a ó sì ṣí ẹ̀rọ náà pátápátá títí láé.'],
          ['4. Àwọn ìsanwó padà', 'A ó máa yọ àwọn ìsanwó padà gẹ́gẹ́ bí ètò tí o yàn. Àìsanwó lè dín àwọn ànfààní ẹ̀rọ kù títí a ó fi mú àkọọ́lẹ̀ rẹ bá ọjọ́ mu. O lè wo gbèsè rẹ àti ìtàn ìsanwó rẹ lórí ojú-ìwé nígbà kígbà.'],
          ['5. Mímú ẹ̀rọ ṣiṣẹ́', 'Gbọ́dọ̀ gba àwọn ẹ̀rọ tí a fi pamọ́ tàbí kí a mú wọn ṣiṣẹ́ ní ọjọ́ tí a fihàn lórí ìforúkọsílẹ̀ rẹ. Mímú ẹ̀rọ ṣiṣẹ́ nílò ìwé ìdánimọ̀ ìjọba tó wúlò àti nọ́mbà fóònù tí a forúkọ sílẹ̀ lórí àkọọ́lẹ̀ rẹ.'],
          ['6. Ibi ìpamọ́, dátà àti Repay+ Plus', 'Ibi ìpamọ́ díẹ̀-díẹ̀, àwọn àpò dátà àti àwọn rírà Repay+ Plus wúlò fún àkókò tí a fihàn nígbà tí o rà wọ́n, a kò sì ní dá owó wọn padà lẹ́yìn tí a bá ti mú wọn ṣiṣẹ́, àfi ibi tí òfin bá béèrè rẹ̀.'],
          ['7. Lílo tó tọ́', 'O gbà láti má lo àwọn ẹ̀rọ tàbí iṣẹ́ Rodiall fún ìdí tó lòdì sí òfin, láti má fọwọ́ kàn ààbò ẹ̀rọ, àti láti má tà ẹ̀rọ kí ẹ̀tọ́ ìní tó di tìrẹ.'],
          ['8. Àwọn àtúnṣe sí àwọn òfin wọ̀nyí', 'A lè ṣe ìmúdójúìwọ̀n àwọn òfin wọ̀nyí lọ́jọ̀ọ́ kan. A ó fi àwọn àyípadà pàtàkì tó wà ṣe ọ́ ní ìwífún nípasẹ̀ ojú-ìwé tàbí SMS. Tí o bá tẹ̀síwájú láti lo àwọn iṣẹ́ wa lẹ́yìn tí àyípadà bá bẹ̀rẹ̀, ó túmọ̀ sí pé o gba àwọn òfin tí a ṣàtúnṣe.'],
          ['9. Ìbánisọ̀rọ̀', 'O lè fi àwọn ìbéèrè nípa àwọn òfin wọ̀nyí ránṣẹ́ sí ẹgbẹ́ ìrànlọ́wọ́ wa nípasẹ̀ Settings › Support.'],
        ],
      },
      ha: {
        title: 'Sharuɗɗa da Ka’idojin Sabis',
        summary: 'Ka’idojin amfani da na’urorin Rodiall, Flex Ownership, biyan bashi da shafin abokin ciniki.',
        sections: [
          ['1. Game da waɗannan sharuɗɗa', 'Waɗannan Sharuɗɗa da Ka’idoji suna jagorantar yadda kake amfani da na’urorin Rodiall, shafin abokin ciniki na Rodiall da ayyuka masu alaƙa kamar Repay+ Plus, ajiya kaɗan-kaɗan da fakitin data. Ta hanyar buɗe asusu ko kunna na’ura, ka amince da waɗannan sharuɗɗa.'],
          ['2. Asusunka', 'Dole ne ka bayar da ingantattun bayanai lokacin buɗe asusunka kuma ka kiyaye bayanan shigarka. Kai ne ke da alhakin duk abin da ya faru a asusunka. Ka sanar da mu nan da nan idan kana zargin an shiga ba tare da izini ba.'],
          ['3. Flex Ownership', 'Na’urorin da aka samu ta hanyar Flex Ownership suna ci gaba da zama mallakar Rodiall har sai an kammala duk biyan kuɗi. Da zarar bashinka ya zama sifili, cikakken mallaka zai koma gare ka kuma za a buɗe na’urar har abada.'],
          ['4. Biyan kuɗi', 'Ana cire kuɗin biya bisa tsarin da ka zaɓa. Rashin biya na iya taƙaita wasu ayyukan na’ura har sai an daidaita asusunka. Za ka iya duba bashinka da tarihin biyan kuɗi a shafin a kowane lokaci.'],
          ['5. Kunna na’ura', 'Dole ne a karɓi ko a kunna na’urorin da aka tanada kafin ranar da aka nuna a ajiyarka. Kunnawa yana buƙatar ingantaccen shaidar gwamnati da lambar wayar da aka yi rajista da ita a asusunka.'],
          ['6. Ajiya, data da Repay+ Plus', 'Ajiya kaɗan-kaɗan, fakitin data da siyayyar Repay+ Plus suna aiki na tsawon lokacin da aka nuna lokacin siya, kuma ba a mayar da kuɗi bayan an kunna su, sai dai inda doka ta buƙata.'],
          ['7. Amfani da ya dace', 'Ka amince ba za ka yi amfani da na’urori ko ayyukan Rodiall don dalilai na haram ba, ba za ka yi wa tsaron na’ura kutse ba, kuma ba za ka sayar da na’ura kafin mallakarta ta koma gare ka ba.'],
          ['8. Sauye-sauye ga waɗannan sharuɗɗa', 'Za mu iya sabunta waɗannan sharuɗɗa daga lokaci zuwa lokaci. Za mu sanar da kai muhimman sauye-sauye ta shafin ko ta SMS. Ci gaba da amfani da ayyukanmu bayan sauyin ya fara aiki yana nufin ka amince da sabbin sharuɗɗan.'],
          ['9. Tuntuɓa', 'Ana iya aika tambayoyi game da waɗannan sharuɗɗa ga ƙungiyar tallafinmu ta hanyar Settings › Support.'],
        ],
      },
      ig: {
        title: 'Usoro na Ọnọdụ Ọrụ',
        summary: 'Ụkpụrụ maka iji ngwaọrụ Rodiall, Flex Ownership, ịkwụghachi ụgwọ na weebụsaịtị onye ahịa.',
        sections: [
          ['1. Banyere usoro ndị a', 'Usoro na Ọnọdụ ndị a na-achịkwa otú ị ga-esi jiri ngwaọrụ Rodiall, weebụsaịtị onye ahịa Rodiall na ọrụ ndị ọzọ metụtara ya dị ka Repay+ Plus, ebe nchekwa nta-nta na ngwugwu data. Site n’imepe akaụntụ ma ọ bụ ịmalite ngwaọrụ, ị kwenyere na usoro ndị a.'],
          ['2. Akaụntụ gị', 'Ị ga-enye ozi ziri ezi mgbe ị na-emepe akaụntụ gị ma chekwaa nkọwa mbanye gị. Ị bụ onye na-ahụ maka ihe niile na-eme n’akaụntụ gị. Gwa anyị ozugbo ma ọ bụrụ na i chere na mmadụ banyere n’enweghị ikike.'],
          ['3. Flex Ownership', 'Ngwaọrụ ndị e nwetara site na Flex Ownership ka bụ nke Rodiall ruo mgbe ịkwụchara ụgwọ niile. Ozugbo ụgwọ gị ruru efu, ịnweta zuru oke na-abụ nke gị, a ga-emeghekwa ngwaọrụ ahụ ruo mgbe ebighị ebi.'],
          ['4. Ịkwụghachi ụgwọ', 'A na-ewepụ ụgwọ ịkwụghachi dị ka atụmatụ ị họọrọ. Ọ bụrụ na ịhapụ ịkwụ ụgwọ, ụfọdụ atụmatụ ngwaọrụ nwere ike ịkwụsị ruo mgbe akaụntụ gị dị ọhụrụ. Ị nwere ike ịhụ ụgwọ gị fọdụrụ na akụkọ ịkwụ ụgwọ gị na weebụsaịtị n’oge ọ bụla.'],
          ['5. Ịmalite ngwaọrụ', 'A ga-anakọta ma ọ bụ malite ngwaọrụ ndị e debara tupu ụbọchị egosiri na nhazi gị. Ịmalite chọrọ ID gọọmentị ziri ezi na nọmba ekwentị e debara n’akaụntụ gị.'],
          ['6. Nchekwa, data na Repay+ Plus', 'Nchekwa nta-nta, ngwugwu data na ịzụta Repay+ Plus dị mma maka oge egosiri mgbe ịzụrụ ha, a naghịkwa ebuga ego azụ mgbe e malitechara ha, belụsọ ebe iwu chọrọ.'],
          ['7. Ojiji kwesịrị ekwesị', 'Ị kwenyere na ị gaghị eji ngwaọrụ ma ọ bụ ọrụ Rodiall mee ihe megidere iwu, ịgbanwe nchekwa ngwaọrụ, ma ọ bụ ire ngwaọrụ tupu ịnweta ya ghọọ nke gị.'],
          ['8. Mgbanwe n’usoro ndị a', 'Anyị nwere ike imelite usoro ndị a site n’oge ruo n’oge. Anyị ga-agwa gị banyere mgbanwe ndị dị mkpa site na weebụsaịtị ma ọ bụ SMS. Ịga n’ihu iji ọrụ anyị mgbe mgbanwe malitere pụtara na ị nabatara usoro ndị a gbanwere.'],
          ['9. Kpọtụrụ anyị', 'Enwere ike iziga ajụjụ banyere usoro ndị a n’otu nkwado anyị site na Settings › Support.'],
        ],
      },
    },
  },
  {
    id: 'privacy',
    icon: 'privacy',
    tag: 'privacy',
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
      ['7. Security', 'We protect your account with encryption and continuous monitoring. Please keep your password private and enable notifications for sign-in activity.'],
      ['8. Updates to this policy', 'We may update this policy as our services change. The “Last updated” date at the top shows when it was last revised.'],
    ],
  },
]
