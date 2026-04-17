export const isBusinessOwner = (user) => user?.role === 'business_owner';

export const hasEmploymentIncome = (user) =>
  user?.incomeSources?.includes('employment');

export const hasBusinessIncome = (user) =>
  user?.incomeSources?.includes('self_employed');

export const isGSTRegistered = (user) => Boolean(user?.businessInfo?.gstRegistered);
export const hasEmployees = (user) => Boolean(user?.businessInfo?.hasEmployees);
export const hasInventory = (user) => Boolean(user?.businessInfo?.hasInventory);
