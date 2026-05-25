import { defineMfe } from '@internal/mfe-runtime';
import { Checkout } from './Checkout';

export const bootstrap = defineMfe('mfe-checkout', Checkout);
