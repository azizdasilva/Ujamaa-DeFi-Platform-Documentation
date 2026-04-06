/**
 * Language / i18n Context
 * Manages application language switching (English / French)
 *
 * Default: English
 * French is the primary production language
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
  'nav.pools': { en: 'Pool Marketplace', fr: 'Marché des Pools' },
  'nav.pool_management': { en: 'Pool Management', fr: 'Gestion des Pools' },
  'nav.dashboard': { en: 'My Dashboard', fr: 'Mon Tableau de bord' },
  'nav.portfolio': { en: 'My Portfolio', fr: 'Mon Portefeuille' },
  'nav.returns': { en: 'Returns', fr: 'Rendements' },
  'nav.documents': { en: 'Documents', fr: 'Documents' },
  'nav.connect_wallet': { en: 'Connect Wallet', fr: 'Connecter le portefeuille' },
  'nav.disconnect': { en: 'Disconnect', fr: 'Déconnecter' },
  'nav.my_profile': { en: 'My Profile', fr: 'Mon profil' },
  'nav.switch_role': { en: 'Switch Role', fr: 'Changer de rôle' },
  'nav.onboarding': { en: 'Investor Onboarding', fr: 'Intégration Investisseur' },
  'nav.submit_asset': { en: 'Submit Asset', fr: 'Soumettre un actif' },
  'nav.view_certificates': { en: 'View Certificates', fr: 'Voir les certificats' },
  'nav.financings': { en: 'Financings', fr: 'Financements' },
  'nav.kyc_review': { en: 'KYC Review', fr: 'Vérification KYC' },
  'nav.transaction_monitor': { en: 'Transaction Monitor', fr: 'Surveillance des transactions' },
  'nav.jurisdictions': { en: 'Jurisdictions', fr: 'Juridictions' },
  'nav.user_management': { en: 'User Management', fr: 'Gestion des utilisateurs' },
  'nav.asset_management': { en: 'Asset Management', fr: 'Gestion des actifs' },
  'nav.bank_accounts': { en: 'Bank Accounts', fr: 'Comptes bancaires' },
  'nav.threshold_management': { en: 'Threshold Management', fr: 'Gestion des seuils' },
  'nav.settings': { en: 'Settings', fr: 'Paramètres' },
  'nav.contracts': { en: 'Smart Contracts', fr: 'Contrats intelligents' },
  'nav.monitoring': { en: 'Platform Monitoring', fr: 'Surveillance de la plateforme' },
  'nav.investors_room': { en: "Investors' Room", fr: "Salle des investisseurs" },
  'nav.glossary': { en: 'Glossary', fr: 'Glossaire' },
  'nav.language': { en: 'Language', fr: 'Langue' },
  'nav.select_language': { en: 'Select Language', fr: 'Choisir la langue' },

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
  'common.create': { en: 'Create', fr: 'Créer' },
  'common.configure': { en: 'Configure', fr: 'Configurer' },
  'common.view_details': { en: 'View Details', fr: 'Voir les détails' },
  'common.hide_details': { en: 'Hide Details', fr: 'Masquer les détails' },
  'common.retry': { en: 'Retry', fr: 'Réessayer' },
  'common.go_to_config': { en: 'Go to Configuration', fr: 'Aller à la configuration' },

  // Dashboard
  'dashboard.title': { en: 'Dashboard', fr: 'Tableau de bord' },
  'dashboard.portfolio': { en: 'Portfolio', fr: 'Portefeuille' },
  'dashboard.returns': { en: 'Returns', fr: 'Rendements' },
  'dashboard.transactions': { en: 'Transactions', fr: 'Transactions' },
  'dashboard.total_pools': { en: 'Total Pools', fr: 'Total des Pools' },
  'dashboard.active_pools': { en: 'Active Pools', fr: 'Pools actifs' },
  'dashboard.tvl': { en: 'Total Value Locked', fr: 'Valeur Totale Bloquée' },

  // Pool Management
  'pool.tvl': { en: 'Total Value Locked', fr: 'Valeur Totale Bloquée' },
  'pool.apy': { en: 'APY', fr: 'APY' },
  'pool.min_investment': { en: 'Min Investment', fr: 'Investissement Min' },
  'pool.lockup_period': { en: 'Lockup Period', fr: 'Période de blocage' },
  'pool.family': { en: 'Family', fr: 'Famille' },
  'pool.id': { en: 'Pool ID', fr: 'ID du Pool' },
  'pool.name': { en: 'Pool Name', fr: 'Nom du Pool' },
  'pool.target_yield': { en: 'Target Yield Range', fr: 'Plage de rendement cible' },
  'pool.status': { en: 'Status', fr: 'Statut' },
  'pool.active': { en: 'Active', fr: 'Actif' },
  'pool.inactive': { en: 'Inactive', fr: 'Inactif' },
  'pool.create_pool': { en: 'Create Pool', fr: 'Créer un Pool' },
  'pool.manage': { en: 'Manage Pools', fr: 'Gérer les Pools' },
  'pool.utilization': { en: 'Utilization Rate', fr: "Taux d'Utilisation" },
  'pool.health': { en: 'Pool Health', fr: 'Santé du Pool' },
  'pool.details': { en: 'Pool Details', fr: 'Détails du Pool' },
  'pool.configure_title': { en: 'Pool Configuration', fr: 'Configuration du Pool' },
  'pool.save_changes': { en: 'Save Changes', fr: 'Enregistrer les modifications' },

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
  'transaction.view_explorer': { en: 'View on Explorer', fr: "Voir sur l'Explorateur" },

  // Wallet
  'wallet.connect': { en: 'Connect Wallet', fr: 'Connecter le Portefeuille' },
  'wallet.disconnect': { en: 'Disconnect', fr: 'Déconnecter' },
  'wallet.address': { en: 'Address', fr: 'Adresse' },
  'wallet.balance': { en: 'Balance', fr: 'Solde' },
  'wallet.network': { en: 'Network', fr: 'Réseau' },

  // Admin
  'admin.smart_contract_mgmt': { en: 'Smart Contract Management', fr: 'Gestion des contrats intelligents' },
  'admin.deployed': { en: 'Deployed', fr: 'Déployé' },
  'admin.verified': { en: 'Verified', fr: 'Vérifié' },
  'admin.register_contract': { en: 'Register Contract', fr: 'Enregistrer un contrat' },
  'admin.no_contracts': { en: 'No contracts registered yet', fr: 'Aucun contrat enregistré' },
  'admin.contract_name': { en: 'Contract Name', fr: 'Nom du contrat' },
  'admin.contract_address': { en: 'Contract Address', fr: 'Adresse du contrat' },
  'admin.contract_type': { en: 'Contract Type', fr: 'Type de contrat' },
  'admin.description': { en: 'Description', fr: 'Description' },
  'admin.verified_explorer': { en: 'Verified on Explorer', fr: 'Vérifié sur Explorer' },

  // Monitoring
  'monitor.platform': { en: 'Platform Monitoring', fr: 'Surveillance de la plateforme' },
  'monitor.system_status': { en: 'System Status', fr: 'Statut du système' },
  'monitor.recent_events': { en: 'Recent Events', fr: 'Événements récents' },
  'monitor.blockchain_status': { en: 'Blockchain Status', fr: 'Statut Blockchain' },
  'monitor.latest_block': { en: 'Latest Block', fr: 'Dernier bloc' },
  'monitor.network': { en: 'Network', fr: 'Réseau' },
  'monitor.gas_price': { en: 'Gas Price', fr: 'Prix du gaz' },
  'monitor.rpc_status': { en: 'RPC Status', fr: 'Statut RPC' },
  'monitor.total_users': { en: 'Total Users', fr: 'Total utilisateurs' },
  'monitor.active_users': { en: 'Active Users', fr: 'Utilisateurs actifs' },
  'monitor.tx_today': { en: 'Tx Today', fr: "Tx Aujourd'hui" },
  'monitor.token_holders': { en: 'Token Holders', fr: 'Détenteurs de jetons' },
  'monitor.block_time': { en: 'Block Time', fr: 'Temps de bloc' },

  // Login / Auth
  'auth.login': { en: 'Login', fr: 'Connexion' },
  'auth.register': { en: 'Register', fr: "S'inscrire" },
  'auth.email': { en: 'Email', fr: 'E-mail' },
  'auth.password': { en: 'Password', fr: 'Mot de passe' },
  'auth.full_name': { en: 'Full Name', fr: 'Nom complet' },
  'auth.company_name': { en: 'Company Name', fr: 'Nom de la société' },
  'auth.wallet_address': { en: 'Wallet Address', fr: 'Adresse du portefeuille' },
  'auth.investor_type': { en: 'Investor Type', fr: "Type d'investisseur" },
  'auth.retail': { en: 'Retail', fr: 'Particulier' },
  'auth.institutional': { en: 'Institutional', fr: 'Institutionnel' },
  'auth.operator': { en: 'Industrial Operator', fr: 'Opérateur Industriel' },
  'auth.sign_in': { en: 'Sign In', fr: 'Se connecter' },
  'auth.sign_up': { en: 'Sign Up', fr: "S'inscrire" },
  'auth.no_account': { en: "Don't have an account?", fr: "Vous n'avez pas de compte?" },
  'auth.has_account': { en: 'Already have an account?', fr: 'Vous avez déjà un compte?' },
  'auth.demo_accounts': { en: 'Demo Accounts', fr: 'Comptes de démonstration' },

  // Industrial Operator
  'industrial.submit_asset': { en: 'Submit Asset for Certification', fr: "Soumettre un actif pour certification" },
  'industrial.asset_type': { en: 'Asset Type', fr: "Type d'actif" },
  'industrial.value': { en: 'Value', fr: 'Valeur' },
  'industrial.quantity': { en: 'Quantity', fr: 'Quantité' },
  'industrial.warehouse_location': { en: 'Warehouse Location', fr: 'Emplacement de lentrepôt' },
  'industrial.certify': { en: 'Certify Asset', fr: 'Certifier lactif' },
  'industrial.financing': { en: 'Financing', fr: 'Financement' },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Initialize from localStorage on first render
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ujamaa_language') as Language;
      if (saved === 'en' || saved === 'fr') return saved;
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('ujamaa_language', lang);
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
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
