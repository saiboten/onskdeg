export const setPurchasesForUser = (data: any) => (
    {
      type: 'SET_USER_PURCHASES',
      ...data,
    }
  );
  
export const purchaseItem = (uid: string, itemid: string) => (
    {
      type: 'PURCHASE_ITEM',
      uid,
      itemid
    }
  );

  export const sellItem = (uid: string, itemid: string) => (
    {
      type: 'SELL_ITEM',
      uid,
      itemid
    }
  );