
import React from 'react';
import { Shield, AlertTriangle, Lock, Scale, Info, Mail } from 'lucide-react';
import { AppLanguage } from '../types';
import { translations } from '../translations';

interface Props {
  language?: AppLanguage;
}

export const LegalPanel: React.FC<Props> = ({ language = AppLanguage.EN }) => {
  const t = translations[language].legal;
  const contactUrl = translations[language].contactUrl;

  return (
    <div className="max-w-4xl mx-auto p-8 pb-20">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-200">
        <div className="bg-gray-100 p-3 rounded-full">
          <Shield className="w-8 h-8 text-gray-700" />
        </div>
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-800">{t.title}</h1>
          <p className="text-gray-500 mt-1">{t.subtitle}</p>
        </div>
      </div>

      <div className="space-y-8">

        {/* 1. Ownership & Feedback */}
        <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4 text-indigo-700">
            <Info className="w-6 h-6" />
            <h2 className="text-xl font-bold">{t.ownershipTitle}</h2>
          </div>
          <div className="text-sm text-gray-700 space-y-4 leading-relaxed text-justify">
            <p>
              <strong>DeepScribe</strong> {t.ownershipDesc1} (<a href="https://www.razaofinal.com" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">www.razaofinal.com</a>).
            </p>
            <p>{t.ownershipDesc2}</p>
            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg flex items-center gap-3">
               <Mail className="w-5 h-5 text-indigo-600" />
               <span>
                 {t.contactLabel} <a href={contactUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-indigo-700 hover:underline">{contactUrl.replace('https://', '')}</a>
               </span>
            </div>
          </div>
        </section>

        {/* 2. Disclaimer of Warranty */}
        <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4 text-red-600">
            <AlertTriangle className="w-6 h-6" />
            <h2 className="text-xl font-bold">{t.disclaimerTitle}</h2>
          </div>
          <div className="text-sm text-gray-700 space-y-4 leading-relaxed text-justify">
            <p className="font-bold">{t.disclaimerBold}</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>{t.disclaimerPoint1}</li>
              <li>{t.disclaimerPoint2}</li>
            </ul>
          </div>
        </section>

        {/* 3. Privacy Policy */}
        <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4 text-blue-600">
            <Lock className="w-6 h-6" />
            <h2 className="text-xl font-bold">{t.privacyTitle}</h2>
          </div>
          <div className="text-sm text-gray-700 space-y-4 leading-relaxed text-justify">
            <p>{t.privacyDesc}</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>{t.privacyPoint1}</li>
              <li>{t.privacyPoint2}</li>
            </ul>
          </div>
        </section>

        {/* 4. Limitation of Liability */}
        <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4 text-gray-800">
            <Scale className="w-6 h-6" />
            <h2 className="text-xl font-bold">{t.liabilityTitle}</h2>
          </div>
          <div className="text-sm text-gray-700 space-y-4 leading-relaxed text-justify">
            <p>{t.liabilityDesc1}</p>
            <p><strong>{t.liabilityDesc2}</strong></p>
            <p>{t.liabilityDesc3}</p>
          </div>
        </section>

      </div>
    </div>
  );
};
