/**
 * Language / i18n Context
 * Manages application language switching
 *
 * Default: English
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'fr';

interface Translation {
  [key: string]: {
    en: string;
    fr: string;
  };
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations
const translations: Translation = {
  // Navigation
  'nav.home': { en: 'Home', fr: 'Accueil' },
  'nav.pools': { en: 'Pools', fr: 'Pools' },
  'nav.dashboard': { en: 'Dashboard', fr: 'Tableau de bord' },
  'nav.documents': { en: 'Documents', fr: 'Documents' },
  'nav.connect_wallet': { en: 'Connect Wallet', fr: 'Connecter le portefeuille' },
  'nav.disconnect': { en: 'Disconnect', fr: 'Déconnecter' },
  'nav.my_profile': { en: 'My Profile', fr: 'Mon profil' },
  'nav.switch_role': { en: 'Switch Role', fr: 'Changer de rôle' },
  
  // Roles
  'role.institutional': { en: 'Institutional Investor', fr: 'Investisseur Institutionnel' },
  'role.retail': { en: 'Retail Investor', fr: 'Investisseur Particulier' },
  'role.industrial': { en: 'Industrial Operator', fr: 'Opérateur Industriel' },
  'role.compliance': { en: 'Compliance Officer', fr: 'Responsable Conformité' },
  'role.admin': { en: 'Administrator', fr: 'Administrateur' },
  'role.regulator': { en: 'Regulator', fr: 'Régulateur' },
  
  // Common
  'common.loading': { en: 'Loading...', fr: 'Chargement...' },
  'common.error': { en: 'Error', fr: 'Erreur' },
  'common.success': { en: 'Success', fr: 'Succès' },
  'common.cancel': { en: 'Cancel', fr: 'Annuler' },
  'common.confirm': { en: 'Confirm', fr: 'Confirmer' },
  'common.approve': { en: 'Approve', fr: 'Approuver' },
  'common.reject': { en: 'Reject', fr: 'Rejeter' },
  'common.view': { en: 'View', fr: 'Voir' },
  'common.close': { en: 'Close', fr: 'Fermer' },
  'common.save': { en: 'Save', fr: 'Enregistrer' },
  
  // Dashboard
  'dashboard.title': { en: 'Dashboard', fr: 'Tableau de bord' },
  'dashboard.portfolio': { en: 'Portfolio', fr: 'Portefeuille' },
  'dashboard.returns': { en: 'Returns', fr: 'Rendements' },
  'dashboard.transactions': { en: 'Transactions', fr: 'Transactions' },
  
  // Pool
  'pool.tvl': { en: 'Total Value Locked', fr: 'Valeur Totale Bloquée' },
  'pool.apy': { en: 'Net APY', fr: 'APY Net' },
  'pool.utilization': { en: 'Utilization Rate', fr: "Taux d'Utilisation" },
  'pool.health': { en: 'Pool Health', fr: 'Santé du Pool' },
  
  // Compliance
  'compliance.pending': { en: 'Pending Review', fr: 'En Attente' },
  'compliance.approved': { en: 'Approved', fr: 'Approuvé' },
  'compliance.rejected': { en: 'Rejected', fr: 'Rejeté' },
  'compliance.documents': { en: 'Documents', fr: 'Documents' },
  'compliance.kyc': { en: 'KYC Status', fr: 'Statut KYC' },
  'compliance.kyb': { en: 'KYB Status', fr: 'Statut KYB' },
  
  // Transaction
  'transaction.amount': { en: 'Amount', fr: 'Montant' },
  'transaction.fees': { en: 'Fees', fr: 'Frais' },
  'transaction.gas': { en: 'Gas Fee', fr: 'Frais de Gaz' },
  'transaction.confirm': { en: 'Confirm Transaction', fr: 'Confirmer la Transaction' },
  'transaction.pending': { en: 'Pending', fr: 'En Attente' },
  'transaction.confirmed': { en: 'Confirmed', fr: 'Confirmé' },
  'transaction.failed': { en: 'Failed', fr: 'Échoué' },
  'transaction.view_explorer': { en: 'View on Explorer', fr: 'Voir sur l\'Explorateur' },
  
  // Wallet
  'wallet.connect': { en: 'Connect Wallet', fr: 'Connecter le Portefeuille' },
  'wallet.disconnect': { en: 'Disconnect', fr: 'Déconnecter' },
  'wallet.address': { en: 'Address', fr: 'Adresse' },
  'wallet.balance': { en: 'Balance', fr: 'Solde' },
  'wallet.network': { en: 'Network', fr: 'Réseau' },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('ujamaa_language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'fr')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('ujamaa_language', lang);
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return translation[language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
