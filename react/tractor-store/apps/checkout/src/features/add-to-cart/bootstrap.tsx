import { defineMfe } from '@internal/mfe-runtime';
import { AddToCart } from './AddToCart';

export const bootstrap = defineMfe('mfe-add-to-cart', AddToCart, {
  observedAttributes: ['sku'],
});
