'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type Locale = 'en' | 'hi';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    'nav.tools': 'Tools',
    'nav.calculators': 'Calculators',
    'nav.career': 'Career',
    'nav.business': 'Business',
    'nav.developer': 'Developer',
    'nav.blog': 'Blog',
    'nav.login': 'Login',
    'nav.admin': 'Admin',
    'hero.title': 'Free Online Tools for Work, Money, Career & Everyday Life',
    'hero.subtitle': '74+ free tools — PDF, images, calculators, career, business & developer tools. No signup required.',
    'hero.cta': 'Explore Tools',
    'tool.free': 'Free',
    'tool.popular': 'Popular',
    'tool.featured': 'Featured',
    'tool.use': 'Use tool',
    'tool.about': 'About this tool',
    'tool.howto': 'How to use',
    'tool.features': 'Features',
    'tool.privacy': 'Privacy',
    'tool.faq': 'Frequently Asked Questions',
    'tool.related': 'Related Tools',
    'tool.quickinfo': 'Quick Info',
    'tool.category': 'Category',
    'tool.processing': 'Processing',
    'tool.price': 'Price',
    'upload.drag': 'Drag & drop your files here',
    'upload.browse': 'or click to browse',
    'upload.max': 'Max:',
    'upload.files': 'files',
    'upload.complete': 'Processing Complete!',
    'upload.download': 'Download',
    'upload.error': 'Something went wrong',
    'upload.retry': 'Please try again or use a different file',
    'trust.secure': '100% Secure',
    'trust.secure.desc': 'All processing happens in your browser',
    'trust.ssl': 'SSL Encrypted',
    'trust.ssl.desc': 'Your connection is encrypted',
    'trust.nostore': 'No Files Stored',
    'trust.nostore.desc': 'Files are deleted after processing',
    'trust.fast': 'Lightning Fast',
    'trust.fast.desc': 'Process files in seconds',
    'newsletter.title': 'Stay Updated',
    'newsletter.desc': 'Get tips on new tools and features. No spam.',
    'newsletter.placeholder': 'Email address',
    'newsletter.cta': 'Subscribe',
    'footer.about': 'About',
    'footer.contact': 'Contact',
    'footer.blog': 'Blog',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.cookies': 'Cookie Policy',
    'footer.disclaimer': 'Disclaimer',
    'admin.dashboard': 'Admin Dashboard',
    'admin.overview': 'Overview of your site data.',
    'admin.contacts': 'Contact Submissions',
    'admin.subscribers': 'Newsletter Subscribers',
    'admin.blogPosts': 'Blog Posts',
    'admin.tools': 'Tools',
    'admin.analytics': 'Analytics Dashboard',
    'admin.analyticsDesc': 'Usage metrics, top tools, and engagement',
    'admin.revenue': 'Revenue Dashboard',
    'admin.revenueDesc': 'Track earnings from AdSense, affiliates, tips',
    'admin.recentContacts': 'Recent Contacts',
    'admin.noContacts': 'No contacts yet.',
  },
  hi: {
    'nav.tools': 'टूल्स',
    'nav.calculators': 'कैलकुलेटर',
    'nav.career': 'करियर',
    'nav.business': 'बिज़नेस',
    'nav.developer': 'डेवलपर',
    'nav.blog': 'ब्लॉग',
    'nav.login': 'लॉगिन',
    'nav.admin': 'एडमिन',
    'hero.title': 'काम, पैसे, करियर और रोज़मर्रा की ज़िंदगी के लिए मुफ़्त ऑनलाइन टूल्स',
    'hero.subtitle': '74+ मुफ़्त टूल्स — PDF, इमेज, कैलकुलेटर, करियर, बिज़नेस और डेवलपर टूल्स। साइनअप की ज़रूरत नहीं।',
    'hero.cta': 'टूल्स देखें',
    'tool.free': 'मुफ़्त',
    'tool.popular': 'लोकप्रिय',
    'tool.featured': 'विशेष',
    'tool.use': 'टूल इस्तेमाल करें',
    'tool.about': 'इस टूल के बारे में',
    'tool.howto': 'कैसे इस्तेमाल करें',
    'tool.features': 'विशेषताएं',
    'tool.privacy': 'गोपनीयता',
    'tool.faq': 'अक्सर पूछे जाने वाले सवाल',
    'tool.related': 'संबंधित टूल्स',
    'tool.quickinfo': 'त्वरित जानकारी',
    'tool.category': 'श्रेणी',
    'tool.processing': 'प्रोसेसिंग',
    'tool.price': 'कीमत',
    'upload.drag': 'अपने फ़ाइलें यहां खींचें',
    'upload.browse': 'या ब्राउज़ करने के लिए क्लिक करें',
    'upload.max': 'अधिकतम:',
    'upload.files': 'फ़ाइलें',
    'upload.complete': 'प्रोसेसिंग पूर्ण!',
    'upload.download': 'डाउनलोड',
    'upload.error': 'कुछ गड़बड़ हो गई',
    'upload.retry': 'कृपया फिर से कोशिश करें या कोई अन्य फ़ाइल इस्तेमाल करें',
    'trust.secure': '100% सुरक्षित',
    'trust.secure.desc': 'सारी प्रोसेसिंग आपके ब्राउज़र में होती है',
    'trust.ssl': 'SSL एन्क्रिप्टेड',
    'trust.ssl.desc': 'आपका कनेक्शन एन्क्रिप्टेड है',
    'trust.nostore': 'फ़ाइलें स्टोर नहीं होतीं',
    'trust.nostore.desc': 'प्रोसेसिंग के बाद फ़ाइलें डिलीट हो जाती हैं',
    'trust.fast': 'तेज़',
    'trust.fast.desc': 'सेकंडों में फ़ाइलें प्रोसेस करें',
    'newsletter.title': 'अपडेट रहें',
    'newsletter.desc': 'नए टूल्स और फ़ीचर्स पर टिप्स पाएं। स्पैम नहीं।',
    'newsletter.placeholder': 'ईमेल पता',
    'newsletter.cta': 'सब्सक्राइब',
    'footer.about': 'हमारे बारे में',
    'footer.contact': 'संपर्क',
    'footer.blog': 'ब्लॉग',
    'footer.privacy': 'गोपनीयता नीति',
    'footer.terms': 'सेवा की शर्तें',
    'footer.cookies': 'कुकी नीति',
    'footer.disclaimer': 'अस्वीकरण',
    'admin.dashboard': 'एडमिन डैशबोर्ड',
    'admin.overview': 'आपकी साइट का डेटा अवलोकन।',
    'admin.contacts': 'संपर्क सबमिशन',
    'admin.subscribers': 'न्यूज़लेटर सब्सक्राइबर',
    'admin.blogPosts': 'ब्लॉग पोस्ट',
    'admin.tools': 'टूल्स',
    'admin.analytics': 'एनालिटिक्स डैशबोर्ड',
    'admin.analyticsDesc': 'उपयोग मेट्रिक्स, टॉप टूल्स, और एंगेजमेंट',
    'admin.revenue': 'रेवेन्यू डैशबोर्ड',
    'admin.revenueDesc': 'AdSense, एफिलिएट्स, टिप्स से कमाई ट्रैक करें',
    'admin.recentContacts': 'हाल के संपर्क',
    'admin.noContacts': 'अभी तक कोई संपर्क नहीं।',
  },
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');

  const t = (key: string): string => {
    return (translations[locale] as Record<string, string>)[key] || key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within I18nProvider');
  return context;
}

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <button
      onClick={() => setLocale(locale === 'en' ? 'hi' : 'en')}
      className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
      title={locale === 'en' ? 'हिंदी में बदलें' : 'Switch to English'}
    >
      <span className="text-base">{locale === 'en' ? '🇮🇳' : '🌐'}</span>
      {locale === 'en' ? 'हिंदी' : 'English'}
    </button>
  );
}
