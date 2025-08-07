import type { LayoutLoad } from './$types';

export const load: LayoutLoad = ({ setHeaders }) => {
  setHeaders({
    'Cache-Control': 'public, max-age=31536000, immutable'
  });
};
