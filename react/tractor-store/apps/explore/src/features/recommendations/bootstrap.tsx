import { defineMfe } from '@internal/mfe-runtime';
import { Recommendations } from './Recommendations';

export const bootstrap = defineMfe('mfe-recommendations', Recommendations, {
  observedAttributes: ['skus'],
});
