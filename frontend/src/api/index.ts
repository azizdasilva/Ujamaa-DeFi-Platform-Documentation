/**
 * API Module Exports
 * Ujamaa DeFi Platform
 */

export { default as apiClient } from './client';
export { default as authAPI } from './auth';
export { default as poolsAPI } from './pools';
export { default as investmentsAPI } from './investments';
export { default as assetsAPI } from './assets';
export { default as complianceAPI } from './compliance';
export { default as adminAPI } from './admin';

// Re-export types
export type * from './auth';
export type * from './pools';
export type * from './investments';
export type * from './assets';
export type * from './compliance';
export type * from './admin';
