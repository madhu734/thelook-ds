/**
 * DataLayer Utility for Google Tag Manager (GA4 E-commerce & Custom Events)
 * Website: The Look (ds.tmadhu.me)
 */

// Helper to push to window.dataLayer safely
export const pushToDataLayer = (event, data = {}) => {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];

  // Per Google Analytics 4 eCommerce guidelines, clear previous ecommerce object
  if (data.ecommerce) {
    window.dataLayer.push({ ecommerce: null });
  }

  window.dataLayer.push({
    event,
    ...data
  });
};

/**
 * 1. View Item List (Catalog / Collection page load)
 */
export const trackViewItemList = (items, listName = 'Winter Collection') => {
  if (!items || items.length === 0) return;
  pushToDataLayer('view_item_list', {
    ecommerce: {
      item_list_id: 'thelook_winter_collection',
      item_list_name: listName,
      items: items.slice(0, 20).map((item, index) => ({
        item_id: String(item.id || item.designId || index),
        item_name: item.badgeEn || item.design_variant || (item.category === 'hoodie' ? 'The Look Hoodie' : 'The Look Bonded Jacket'),
        item_category: item.category || 'jacket',
        item_variant: item.colorId || '',
        price: Number(item.price || 0),
        index: index + 1
      }))
    }
  });
};

/**
 * 2. View Item (Product viewed / detail opened)
 */
export const trackViewItem = (item, selectedSize = 'L') => {
  if (!item) return;
  const price = Number(item.price || (item.category === 'hoodie' ? 650 : 1350));
  pushToDataLayer('view_item', {
    ecommerce: {
      currency: 'BDT',
      value: price,
      items: [{
        item_id: String(item.id || item.designId || 'thelook_item'),
        item_name: item.badgeEn || item.design_variant || (item.category === 'hoodie' ? 'The Look Hoodie' : 'The Look Bonded Jacket'),
        item_category: item.category || 'jacket',
        item_variant: item.colorId || '',
        item_size: selectedSize,
        price: price,
        quantity: 1
      }]
    }
  });
};

/**
 * 3. Add to Cart / Bag
 */
export const trackAddToCart = (item, selectedSize = 'L', quantity = 1, unitPrice = null) => {
  if (!item) return;
  const price = Number(unitPrice || item.price || (item.category === 'hoodie' ? 650 : 1350));
  const qty = Number(quantity || 1);
  pushToDataLayer('add_to_cart', {
    ecommerce: {
      currency: 'BDT',
      value: price * qty,
      items: [{
        item_id: String(item.id || item.designId || 'thelook_item'),
        item_name: item.badgeEn || item.design_variant || (item.category === 'hoodie' ? 'The Look Hoodie' : 'The Look Bonded Jacket'),
        item_category: item.category || 'jacket',
        item_variant: item.colorId || '',
        item_size: selectedSize,
        price: price,
        quantity: qty
      }]
    }
  });
};

/**
 * 4. Begin Checkout (Checkout Drawer opened / starting order form)
 */
export const trackBeginCheckout = (item, selectedSize = 'L', quantity = 1, unitPrice = null) => {
  if (!item) return;
  const price = Number(unitPrice || item.price || (item.category === 'hoodie' ? 650 : 1350));
  const qty = Number(quantity || 1);
  pushToDataLayer('begin_checkout', {
    ecommerce: {
      currency: 'BDT',
      value: price * qty,
      items: [{
        item_id: String(item.id || item.designId || 'thelook_item'),
        item_name: item.badgeEn || item.design_variant || (item.category === 'hoodie' ? 'The Look Hoodie' : 'The Look Bonded Jacket'),
        item_category: item.category || 'jacket',
        item_variant: item.colorId || '',
        item_size: selectedSize,
        price: price,
        quantity: qty
      }]
    }
  });
};

/**
 * 5. Purchase (Order submitted successfully)
 */
export const trackPurchase = ({
  orderId,
  totalAmount,
  item,
  selectedSize = 'L',
  quantity = 1,
  unitPrice = null,
  customerInfo = {}
}) => {
  const price = Number(unitPrice || item?.price || (item?.category === 'hoodie' ? 650 : 1350));
  const qty = Number(quantity || 1);
  const total = Number(totalAmount || price * qty);

  pushToDataLayer('purchase', {
    ecommerce: {
      transaction_id: orderId,
      value: total,
      currency: 'BDT',
      tax: 0,
      shipping: 0,
      customer: {
        phone: customerInfo.phone || '',
        name: customerInfo.name || '',
        zone: customerInfo.zone || ''
      },
      items: [{
        item_id: String(item?.id || item?.designId || 'thelook_item'),
        item_name: item?.badgeEn || item?.design_variant || (item?.category === 'hoodie' ? 'The Look Hoodie' : 'The Look Bonded Jacket'),
        item_category: item?.category || 'jacket',
        item_variant: item?.colorId || '',
        item_size: selectedSize,
        price: price,
        quantity: qty
      }]
    }
  });
};