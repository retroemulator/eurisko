/* Google Consent Mode v2 + GA4 bootstrap.
   Estratto dallo script inline che era nel <head> per conformita' CSP
   (script-src 'self' + Google domains, niente 'unsafe-inline').
   Caricato con <script src="gtag-consent.js"> PRIMA di gtag.js GTM. */
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'analytics_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'wait_for_update': 500,
  'region': ['EU']
});
gtag('js', new Date());
gtag('config', 'G-M936PDKB61', { 'anonymize_ip': true });
