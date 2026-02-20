"use client";

import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Country } from "@/lib/types";
import {
  ARABIC_TO_ISO,
  STAGE_MAP_COLORS,
  COUNTRY_CENTROIDS,
} from "@/lib/country-geo";
import { getStageLabel } from "@/lib/business-logic";

// ---- Natural Earth TopoJSON -> GeoJSON helpers ----
// We load the 110m world TopoJSON and decode it to GeoJSON ourselves
// so we can match countries by their numeric id (ISO 3166-1 numeric)
const TOPO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// ISO A3 -> ISO numeric string for matching in Natural Earth data
const ISO_A3_TO_NUMERIC: Record<string, string> = {
  TUR: "792", SAU: "682", DEU: "276", GBR: "826", USA: "840", CAN: "124",
  CHN: "156", FRA: "250", NLD: "528", IRQ: "368", KWT: "414", ARE: "784",
  JOR: "400", EGY: "818", ITA: "380", MYS: "458", IDN: "360", SDN: "729",
  BEL: "056", LBY: "434", SWE: "752", QAT: "634", ESP: "724", JPN: "392",
  LBN: "422", RUS: "643", KOR: "410",
};

interface LeafletMapProps {
  countries: Country[];
  allCountries: Country[];
  onSelectCountry: (country: Country) => void;
  onHoverCountry: (country: Country | null) => void;
}

export interface LeafletMapRef {
  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;
}

// Simple TopoJSON -> GeoJSON decoder (avoids needing topojson-client)
function decodeTopojson(topo: {
  type: string;
  objects: Record<string, { type: string; geometries: Array<{
    type: string;
    id: string;
    arcs: number[][] | number[][][];
    properties: Record<string, string>;
  }> }>;
  arcs: number[][][];
  transform?: { scale: [number, number]; translate: [number, number] };
}) {
  const { arcs: rawArcs, transform } = topo;

  // Decode quantized arcs
  const decodedArcs: [number, number][][] = rawArcs.map((arc) => {
    let x = 0;
    let y = 0;
    return arc.map((point) => {
      x += point[0];
      y += point[1];
      if (transform) {
        return [
          x * transform.scale[0] + transform.translate[0],
          x * transform.scale[1] + transform.translate[1],
        ] as [number, number];
      }
      return [x, y] as [number, number];
    });
  });

  // Properly decode with delta + quantization
  const decodedArcsProper: [number, number][][] = rawArcs.map((arc) => {
    let px = 0;
    let py = 0;
    return arc.map((delta) => {
      px += delta[0];
      py += delta[1];
      if (transform) {
        return [
          px * transform.scale[0] + transform.translate[0],
          py * transform.scale[1] + transform.translate[1],
        ] as [number, number];
      }
      return [px, py] as [number, number];
    });
  });

  function resolveArc(index: number): [number, number][] {
    if (index >= 0) {
      return decodedArcsProper[index];
    }
    // Negative index means reversed arc
    return [...decodedArcsProper[~index]].reverse();
  }

  function resolveRing(indices: number[]): [number, number][] {
    let ring: [number, number][] = [];
    for (const idx of indices) {
      const arc = resolveArc(idx);
      // Skip first point of subsequent arcs to avoid duplication
      if (ring.length > 0) {
        ring = ring.concat(arc.slice(1));
      } else {
        ring = arc.slice();
      }
    }
    return ring;
  }

  const objectKey = Object.keys(topo.objects)[0];
  const geometries = topo.objects[objectKey].geometries;

  const features = geometries.map((geom) => {
    let coordinates: [number, number][][] | [number, number][][][] = [];

    if (geom.type === "Polygon") {
      coordinates = (geom.arcs as number[][]).map((ring) => resolveRing(ring));
    } else if (geom.type === "MultiPolygon") {
      coordinates = (geom.arcs as number[][][]).map((polygon) =>
        polygon.map((ring) => resolveRing(ring))
      );
    }

    return {
      type: "Feature" as const,
      id: geom.id,
      properties: geom.properties || {},
      geometry: {
        type: geom.type,
        coordinates,
      },
    };
  });

  return {
    type: "FeatureCollection" as const,
    features,
  };
}

const DEFAULT_CENTER: [number, number] = [28, 30];
const DEFAULT_ZOOM = 2.5;

const LeafletMap = forwardRef<LeafletMapRef, LeafletMapProps>(
  function LeafletMap({ countries, allCountries, onSelectCountry, onHoverCountry }, ref) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const geoLayerRef = useRef<L.GeoJSON | null>(null);
    const markersLayerRef = useRef<L.LayerGroup | null>(null);
    const [geoData, setGeoData] = useState<ReturnType<typeof decodeTopojson> | null>(null);

    // Build lookup: ISO numeric -> Country
    const numericToCountry = useMemo(() => {
      const map: Record<string, Country> = {};
      for (const c of allCountries) {
        const iso3 = ARABIC_TO_ISO[c.country_name_ar];
        if (iso3) {
          const num = ISO_A3_TO_NUMERIC[iso3];
          if (num) map[num] = c;
        }
      }
      return map;
    }, [allCountries]);

    // Filtered ISO set
    const filteredNumerics = useMemo(() => {
      const set = new Set<string>();
      for (const c of countries) {
        const iso3 = ARABIC_TO_ISO[c.country_name_ar];
        if (iso3) {
          const num = ISO_A3_TO_NUMERIC[iso3];
          if (num) set.add(num);
        }
      }
      return set;
    }, [countries]);

    useImperativeHandle(ref, () => ({
      zoomIn: () => mapInstanceRef.current?.zoomIn(),
      zoomOut: () => mapInstanceRef.current?.zoomOut(),
      resetView: () => {
        mapInstanceRef.current?.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
      },
    }));

    // Fetch TopoJSON data once
    useEffect(() => {
      fetch(TOPO_URL)
        .then((res) => res.json())
        .then((topo) => {
          const geojson = decodeTopojson(topo);
          setGeoData(geojson);
        })
        .catch((err) => console.error("Failed to load world data:", err));
    }, []);

    // Initialize Leaflet map
    useEffect(() => {
      if (!mapContainerRef.current || mapInstanceRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        minZoom: 2,
        maxZoom: 8,
        zoomControl: false,
        attributionControl: false,
        maxBounds: [
          [-85, -180],
          [85, 180],
        ],
        maxBoundsViscosity: 1.0,
      });

      // OpenStreetMap Tile Layer - clean cartographic style
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {
          subdomains: "abcd",
          maxZoom: 19,
        }
      ).addTo(map);

      // Attribution
      L.control
        .attribution({ position: "bottomright", prefix: false })
        .addAttribution(
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        )
        .addTo(map);

      mapInstanceRef.current = map;
      markersLayerRef.current = L.layerGroup().addTo(map);

      return () => {
        map.remove();
        mapInstanceRef.current = null;
      };
    }, []);

    // Render GeoJSON boundaries and markers when data changes
    useEffect(() => {
      const map = mapInstanceRef.current;
      if (!map || !geoData) return;

      // Clear previous layers
      if (geoLayerRef.current) {
        map.removeLayer(geoLayerRef.current);
      }
      if (markersLayerRef.current) {
        markersLayerRef.current.clearLayers();
      }

      // Add GeoJSON country boundaries
      geoLayerRef.current = L.geoJSON(geoData as unknown as GeoJSON.GeoJsonObject, {
        style: (feature) => {
          const id = feature?.id as string;
          const country = numericToCountry[id];
          const isFiltered = filteredNumerics.has(id);

          if (country && isFiltered) {
            const stageColor = STAGE_MAP_COLORS[country.stage];
            return {
              fillColor: stageColor?.fill || "#94a3b8",
              fillOpacity: stageColor?.fillOpacity || 0.4,
              color: stageColor?.stroke || "#64748b",
              weight: 1.5,
              opacity: 0.9,
            };
          }

          // Non-tracked or filtered out countries
          return {
            fillColor: "#e8ecf0",
            fillOpacity: 0.6,
            color: "#c8cdd3",
            weight: 0.5,
            opacity: 0.5,
          };
        },
        onEachFeature: (feature, layer) => {
          const id = feature.id as string;
          const country = numericToCountry[id];
          if (!country || !filteredNumerics.has(id)) return;

          layer.on({
            mouseover: (e) => {
              const target = e.target;
              const stageColor = STAGE_MAP_COLORS[country.stage];
              target.setStyle({
                weight: 3,
                color: stageColor?.stroke || "#1e293b",
                fillOpacity: (stageColor?.fillOpacity || 0.4) + 0.2,
              });
              target.bringToFront();
              onHoverCountry(country);
            },
            mouseout: (e) => {
              geoLayerRef.current?.resetStyle(e.target);
              onHoverCountry(null);
            },
            click: () => {
              onSelectCountry(country);
            },
          });
        },
      }).addTo(map);

      // Add pulse markers at centroids
      for (const country of countries) {
        const iso3 = ARABIC_TO_ISO[country.country_name_ar];
        if (!iso3) continue;
        const coords = COUNTRY_CENTROIDS[iso3];
        if (!coords) continue;

        const stageColor = STAGE_MAP_COLORS[country.stage];
        const fill = stageColor?.fill || "#64748b";

        // Create a pulsing div icon
        const icon = L.divIcon({
          className: "sbcb-pulse-marker",
          html: `
            <div style="position:relative;width:24px;height:24px;">
              <div style="
                position:absolute;top:50%;left:50%;
                width:10px;height:10px;
                transform:translate(-50%,-50%);
                background:${fill};
                border:2px solid #fff;
                border-radius:50%;
                box-shadow:0 0 6px ${fill}80;
                z-index:2;
              "></div>
              <div style="
                position:absolute;top:50%;left:50%;
                width:24px;height:24px;
                transform:translate(-50%,-50%);
                background:${fill}30;
                border:1.5px solid ${fill}60;
                border-radius:50%;
                animation:sbcb-pulse 2s ease-out infinite;
                z-index:1;
              "></div>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker(coords, { icon })
          .on("click", () => onSelectCountry(country))
          .on("mouseover", () => onHoverCountry(country))
          .on("mouseout", () => onHoverCountry(null));

        // Tooltip with country name
        marker.bindTooltip(
          `<div style="font-family:'IBM Plex Sans Arabic',sans-serif;font-size:12px;font-weight:600;text-align:center;direction:rtl;">
            ${country.country_name_ar}
            <br/>
            <span style="font-size:10px;font-weight:400;color:${fill};">${getStageLabel(country.stage)} - ${country.score_total}/100</span>
          </div>`,
          {
            direction: "top",
            offset: [0, -14],
            className: "sbcb-tooltip",
          }
        );

        markersLayerRef.current?.addLayer(marker);
      }
    }, [geoData, countries, numericToCountry, filteredNumerics, onSelectCountry, onHoverCountry]);

    return (
      <>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @keyframes sbcb-pulse {
                0% { transform: translate(-50%,-50%) scale(0.5); opacity: 1; }
                100% { transform: translate(-50%,-50%) scale(2); opacity: 0; }
              }
              .sbcb-pulse-marker {
                background: transparent !important;
                border: none !important;
              }
              .sbcb-tooltip {
                font-family: 'IBM Plex Sans Arabic', sans-serif !important;
                border-radius: 8px !important;
                padding: 6px 10px !important;
                border: 1px solid #d4d8dc !important;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
              }
              .leaflet-container {
                background: #f0f4f8 !important;
                border-radius: 0.5rem;
              }
            `,
          }}
        />
        <div ref={mapContainerRef} className="h-full w-full" />
      </>
    );
  }
);

export default LeafletMap;
