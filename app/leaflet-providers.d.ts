// src/leaflet-providers.d.ts
import 'leaflet';

declare module 'leaflet' {
  namespace TileLayer {
    namespace Provider {
      const providers: {
        [key: string]: {
          url: string;
          options?: {
            maxZoom?: number;
            minZoom?: number;
            attribution?: string;
          };
        };
      };
    }
  }
}
