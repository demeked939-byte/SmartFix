import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import L from 'leaflet';
import {
  Navigation,
  MapPin,
  Compass,
  Phone,
  Radio,
  Clock,
  ShieldCheck,
  Sparkles,
  Maximize2,
  Minimize2,
  Layers,
  Play,
  Pause,
  RotateCcw,
  Zap,
  LocateFixed,
  Car,
  Home,
  CheckCircle2,
  Info,
  ZoomIn,
  ZoomOut,
  Target,
  Globe,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  FastForward,
  Map as MapIcon,
  Flame
} from 'lucide-react';
import { Booking, Technician } from '../types';
import { calculateDistanceKm, calculateEtaMinutes } from '../services/dispatchEngine';
import { soundFx } from '../utils/soundEffects';

interface SmartFixLiveMapProps {
  technician?: Technician;
  otherTechnicians?: Technician[];
  customerBooking?: Booking;
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
  showOtherTechs?: boolean;
  showDirections?: boolean;
  interactive?: boolean;
  mode?: 'technician' | 'customer' | 'admin';
  onTechnicianGpsChange?: (gps: { lat: number; lng: number; heading?: number; speedKmh?: number; addressLabel?: string }) => void;
  onSelectTechnician?: (techId: string) => void;
}

// Addis Ababa Core Hubs
const ADDIS_PRESETS = [
  { name: 'Bole Medhanialem', lat: 8.9950, lng: 38.7880, zone: 'Bole' },
  { name: 'Meskel Square', lat: 9.0104, lng: 38.7636, zone: 'Kirkos' },
  { name: 'Kazanchis / UNECA', lat: 9.0182, lng: 38.7694, zone: 'Yeka' },
  { name: 'Piassa / Churchill', lat: 9.0345, lng: 38.7518, zone: 'Arada' },
  { name: 'Sarbet (AU Area)', lat: 8.9880, lng: 38.7368, zone: 'Lideta' },
  { name: 'CMC & Megenagna', lat: 9.0232, lng: 38.8350, zone: 'Bole / Yeka' },
  { name: 'Gotera Interchange', lat: 8.9810, lng: 38.7580, zone: 'Nifas Silk' },
  { name: 'Mexico Square', lat: 9.0110, lng: 38.7450, zone: 'Kirkos' }
];

// Tile Providers for 100% Real Street, Dark, and Satellite Views
const MAP_LAYERS = {
  streets: {
    name: 'Modern Streets',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap &copy; CARTO'
  },
  satellite: {
    name: 'Satellite Aerial',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri World Imagery'
  },
  dark: {
    name: 'Night Radar',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap &copy; CARTO'
  }
};

export function SmartFixLiveMap({
  technician,
  otherTechnicians = [],
  customerBooking,
  center,
  zoom = 15,
  height = '440px',
  showOtherTechs = true,
  showDirections = true,
  interactive = true,
  mode = 'technician',
  onTechnicianGpsChange,
  onSelectTechnician
}: SmartFixLiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Markers and Layers Refs
  const techMarkerRef = useRef<L.Marker | null>(null);
  const customerMarkerRef = useRef<L.Marker | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const otherMarkersGroupRef = useRef<L.LayerGroup | null>(null);

  // Map state
  const [activeLayer, setActiveLayer] = useState<'streets' | 'satellite' | 'dark'>('streets');
  const [isSimulatingDrive, setIsSimulatingDrive] = useState<boolean>(false);
  const [simSpeedMultiplier, setSimSpeedMultiplier] = useState<number>(1); // 1x, 3x, 6x
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [roadRoutePoints, setRoadRoutePoints] = useState<[number, number][]>([]);
  const [routeStepIndex, setRouteStepIndex] = useState<number>(0);
  const [showPresetsMenu, setShowPresetsMenu] = useState<boolean>(false);

  // Live positions
  const [techPos, setTechPos] = useState<{ lat: number; lng: number; heading: number; speedKmh: number }>(() => {
    if (technician?.currentGps) {
      return {
        lat: technician.currentGps.lat,
        lng: technician.currentGps.lng,
        heading: technician.currentGps.heading || 45,
        speedKmh: technician.currentGps.speedKmh || 0
      };
    }
    return { lat: 8.9984, lng: 38.7865, heading: 45, speedKmh: 24 };
  });

  const customerPos = useMemo(() => {
    if (customerBooking?.gpsCoordinates) {
      return customerBooking.gpsCoordinates;
    }
    if (customerBooking?.zone) {
      const z = customerBooking.zone.toLowerCase();
      if (z.includes('bole')) return { lat: 8.9920, lng: 38.7890 };
      if (z.includes('kazanchis')) return { lat: 9.0177, lng: 38.7667 };
      if (z.includes('sarbet')) return { lat: 8.9880, lng: 38.7368 };
      if (z.includes('cmc')) return { lat: 9.0232, lng: 38.8350 };
      if (z.includes('piassa')) return { lat: 9.0345, lng: 38.7523 };
    }
    return { lat: 9.0120, lng: 38.7750 };
  }, [customerBooking]);

  const techPosRef = useRef(techPos);
  techPosRef.current = techPos;

  // Sync tech position when prop changes
  useEffect(() => {
    if (technician?.currentGps) {
      const newPos = {
        lat: technician.currentGps.lat,
        lng: technician.currentGps.lng,
        heading: technician.currentGps.heading || 45,
        speedKmh: technician.currentGps.speedKmh || 0
      };
      setTechPos(newPos);
      techPosRef.current = newPos;
    }
  }, [technician?.currentGps?.lat, technician?.currentGps?.lng]);

  // Real OSRM Road Routing Calculation
  useEffect(() => {
    if (!showDirections) return;

    let isMounted = true;
    const fetchRealRoute = async () => {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${techPos.lng},${techPos.lat};${customerPos.lng},${customerPos.lat}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('OSRM network failure');
        const data = await res.json();
        if (data.routes && data.routes[0] && data.routes[0].geometry) {
          const coords: [number, number][] = data.routes[0].geometry.coordinates.map(
            (c: [number, number]) => [c[1], c[0]] // swap to [lat, lng]
          );
          if (isMounted && coords.length > 0) {
            setRoadRoutePoints(coords);
            setRouteStepIndex(0);
          }
          return;
        }
      } catch {
        // Fallback: Smooth interpolated street arc
      }

      // Procedural Fallback Route along Addis street points
      const steps = 30;
      const pts: [number, number][] = [];
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        // subtle curve to match Addis Ababa street curves
        const curveOffset = Math.sin(t * Math.PI) * 0.003;
        const lat = techPos.lat + (customerPos.lat - techPos.lat) * t + curveOffset;
        const lng = techPos.lng + (customerPos.lng - techPos.lng) * t - curveOffset * 0.6;
        pts.push([lat, lng]);
      }
      if (isMounted) {
        setRoadRoutePoints(pts);
        setRouteStepIndex(0);
      }
    };

    fetchRealRoute();

    return () => {
      isMounted = false;
    };
  }, [showDirections, customerPos.lat, customerPos.lng]);

  // Initialize Leaflet Map Instance
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const initialCenter = center
      ? [center.lat, center.lng]
      : [(techPos.lat + customerPos.lat) / 2, (techPos.lng + customerPos.lng) / 2];

    const map = L.map(mapContainerRef.current, {
      center: initialCenter as L.LatLngExpression,
      zoom: zoom,
      zoomControl: false,
      attributionControl: false,
      dragging: interactive,
      touchZoom: interactive,
      scrollWheelZoom: interactive,
      doubleClickZoom: interactive
    });

    const tileLayer = L.tileLayer(MAP_LAYERS[activeLayer].url, {
      maxZoom: 19,
      subdomains: ['a', 'b', 'c', 'd']
    }).addTo(map);

    mapInstanceRef.current = map;
    tileLayerRef.current = tileLayer;

    // Create layer groups for markers
    const otherGroup = L.layerGroup().addTo(map);
    otherMarkersGroupRef.current = otherGroup;

    // Click on map to interactively update customer destination / dispatch
    if (interactive) {
      map.on('click', (e: L.LeafletMouseEvent) => {
        if (soundEnabled) soundFx.playPing();
        // Recalculate route to new clicked coordinate
      });
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer when user toggles (Streets / Satellite / Dark)
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    tileLayerRef.current.setUrl(MAP_LAYERS[activeLayer].url);
  }, [activeLayer]);

  // Update Technician Marker with Custom 3D Vehicle Icon
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    const techIconHtml = `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
        <div style="position: absolute; width: 44px; height: 44px; top: -7px; left: -7px; border-radius: 50%; background: rgba(59, 130, 246, 0.25); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="position: relative; z-index: 10; width: 32px; height: 32px; border-radius: 12px; background: linear-gradient(135deg, #1E40AF 0%, #2563EB 100%); border: 2px solid #FFFFFF; box-shadow: 0 4px 12px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center;">
          <svg style="width: 18px; height: 18px; color: #FDE047; transform: rotate(${techPos.heading - 45}deg); transition: transform 0.4s ease;" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
          </svg>
        </div>
        <div style="margin-top: 4px; padding: 2px 6px; background: rgba(15, 23, 42, 0.95); border: 1px solid rgba(96, 165, 250, 0.5); border-radius: 12px; font-size: 10px; font-weight: 800; color: #FFFFFF; white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 4px;">
          <span style="width: 6px; height: 6px; border-radius: 50%; background: #10B981; display: inline-block;"></span>
          <span>${technician?.name ? technician.name.split(' ')[0] : 'Dawit'}</span>
          ${techPos.speedKmh > 0 ? `<span style="color: #FDE047; font-family: monospace; font-size: 9px;">${techPos.speedKmh} km/h</span>` : ''}
        </div>
      </div>
    `;

    const customTechIcon = L.divIcon({
      html: techIconHtml,
      className: 'smartfix-tech-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    if (!techMarkerRef.current) {
      const marker = L.marker([techPos.lat, techPos.lng], { icon: customTechIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: sans-serif; padding: 4px; font-size: 12px;">
          <b style="font-size: 13px; color: #1E3A8A;">${technician?.name || 'Dawit Tadesse'}</b>
          <div style="color: #64748B; font-size: 11px;">${technician?.specialty || 'Master Electrician'}</div>
          <div style="margin-top: 6px; padding: 4px 6px; background: #EFF6FF; border-radius: 6px; color: #1D4ED8; font-weight: bold;">
            📍 Zone: ${technician?.activeZone || 'Bole & Kazanchis'}
          </div>
          <div style="margin-top: 4px; color: #059669; font-weight: bold;">⭐ 4.98 (Guild Certified)</div>
        </div>
      `);
      techMarkerRef.current = marker;
    } else {
      techMarkerRef.current.setLatLng([techPos.lat, techPos.lng]);
      techMarkerRef.current.setIcon(customTechIcon);
    }
  }, [techPos.lat, techPos.lng, techPos.heading, techPos.speedKmh, technician?.name]);

  // Update Customer Marker with Home Pin
  useEffect(() => {
    if (!mapInstanceRef.current || !customerBooking) return;
    const map = mapInstanceRef.current;

    const custIconHtml = `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
        <div style="position: absolute; width: 38px; height: 38px; top: -5px; left: -5px; border-radius: 50%; background: rgba(239, 68, 68, 0.2); animation: pulse 2s infinite;"></div>
        <div style="position: relative; z-index: 10; width: 30px; height: 30px; border-radius: 10px; background: linear-gradient(135deg, #DC2626 0%, #EF4444 100%); border: 2px solid #FFFFFF; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white;">
          <svg style="width: 16px; height: 16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </div>
        <div style="margin-top: 3px; padding: 2px 6px; background: rgba(69, 10, 10, 0.95); border: 1px solid rgba(248, 113, 113, 0.5); border-radius: 10px; font-size: 9px; font-weight: 800; color: #FFFFFF; white-space: nowrap;">
          ${customerBooking.customerName.split(' ')[0]}
        </div>
      </div>
    `;

    const customCustIcon = L.divIcon({
      html: custIconHtml,
      className: 'smartfix-customer-marker',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });

    if (!customerMarkerRef.current) {
      const marker = L.marker([customerPos.lat, customerPos.lng], { icon: customCustIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: sans-serif; padding: 4px; font-size: 12px;">
          <b style="color: #DC2626;">Customer: ${customerBooking.customerName}</b>
          <div style="color: #475569; font-size: 11px;">Service: ${customerBooking.serviceName}</div>
          <div style="margin-top: 4px; font-size: 11px; color: #64748B;">${customerBooking.address}</div>
          <div style="margin-top: 6px; font-weight: bold; color: #2563EB;">Order #${customerBooking.id}</div>
        </div>
      `);
      customerMarkerRef.current = marker;
    } else {
      customerMarkerRef.current.setLatLng([customerPos.lat, customerPos.lng]);
      customerMarkerRef.current.setIcon(customCustIcon);
    }
  }, [customerPos.lat, customerPos.lng, customerBooking]);

  // Update Route Polyline
  useEffect(() => {
    if (!mapInstanceRef.current || !showDirections || roadRoutePoints.length === 0) return;
    const map = mapInstanceRef.current;

    if (routePolylineRef.current) {
      routePolylineRef.current.remove();
    }

    const polyline = L.polyline(roadRoutePoints, {
      color: '#2563EB',
      weight: 5,
      opacity: 0.85,
      lineCap: 'round',
      lineJoin: 'round',
      dashArray: isSimulatingDrive ? '8, 8' : undefined
    }).addTo(map);

    routePolylineRef.current = polyline;

    // Fit map bounds to show full route
    const bounds = L.latLngBounds(roadRoutePoints);
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
  }, [roadRoutePoints, showDirections, isSimulatingDrive]);

  // Render Other Online Technicians on Radar
  useEffect(() => {
    if (!otherMarkersGroupRef.current) return;
    const group = otherMarkersGroupRef.current;
    group.clearLayers();

    if (!showOtherTechs) return;

    otherTechnicians
      .filter(t => t.id !== technician?.id && t.currentGps)
      .forEach(t => {
        const otherIconHtml = `
          <div style="display: flex; flex-direction: column; align-items: center; opacity: 0.85;">
            <div style="width: 26px; height: 26px; border-radius: 8px; background: #1E293B; border: 1.5px solid #64748B; display: flex; align-items: center; justify-content: center; color: #60A5FA; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">
              <svg style="width: 14px; height: 14px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
                <circle cx="7" cy="17" r="2"/>
                <path d="M9 17h6"/>
                <circle cx="17" cy="17" r="2"/>
              </svg>
            </div>
            <span style="font-size: 8px; font-weight: bold; color: #CBD5E1; background: rgba(0,0,0,0.7); padding: 1px 4px; border-radius: 4px; margin-top: 2px;">
              ${t.name.split(' ')[0]}
            </span>
          </div>
        `;
        const icon = L.divIcon({
          html: otherIconHtml,
          className: 'other-tech-marker',
          iconSize: [26, 26],
          iconAnchor: [13, 13]
        });

        const marker = L.marker([t.currentGps!.lat, t.currentGps!.lng], { icon });
        marker.bindPopup(`
          <div style="font-family: sans-serif; font-size: 11px;">
            <b>${t.name}</b> (${t.specialty})<br/>
            <span style="color: #2563EB;">Zone: ${t.activeZone}</span><br/>
            <span style="color: #059669;">⭐ ${t.rating}</span>
          </div>
        `);
        marker.on('click', () => {
          if (onSelectTechnician) onSelectTechnician(t.id);
        });
        group.addLayer(marker);
      });
  }, [otherTechnicians, showOtherTechs, technician?.id, onSelectTechnician]);

  // Live Vehicle Animation along actual OSRM road geometry
  useEffect(() => {
    if (!isSimulatingDrive || roadRoutePoints.length === 0) return;

    if (soundEnabled && routeStepIndex === 0) {
      soundFx.playTripStart();
    }

    const intervalTime = Math.max(200, Math.floor(1000 / simSpeedMultiplier));

    const interval = setInterval(() => {
      setRouteStepIndex(prevIndex => {
        const nextIndex = prevIndex + 1;

        if (nextIndex >= roadRoutePoints.length) {
          setIsSimulatingDrive(false);
          if (soundEnabled) soundFx.playArrival();

          const finalPos = {
            lat: customerPos.lat,
            lng: customerPos.lng,
            heading: techPosRef.current.heading,
            speedKmh: 0
          };
          setTechPos(finalPos);
          techPosRef.current = finalPos;

          if (onTechnicianGpsChange) {
            onTechnicianGpsChange({
              lat: finalPos.lat,
              lng: finalPos.lng,
              heading: finalPos.heading,
              speedKmh: 0,
              addressLabel: 'Arrived at customer gate (Bole)'
            });
          }
          return roadRoutePoints.length - 1;
        }

        const currentPoint = roadRoutePoints[prevIndex];
        const nextPoint = roadRoutePoints[nextIndex];

        // Calculate heading bearing
        const dLat = nextPoint[0] - currentPoint[0];
        const dLng = nextPoint[1] - currentPoint[1];
        const y = Math.sin(dLng) * Math.cos(nextPoint[0]);
        const x =
          Math.cos(currentPoint[0]) * Math.sin(nextPoint[0]) -
          Math.sin(currentPoint[0]) * Math.cos(nextPoint[0]) * Math.cos(dLng);
        const brng = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;

        const baseSpeed = 28 + Math.floor(Math.random() * 18);
        const speedKmh = baseSpeed * (simSpeedMultiplier > 1 ? 1.5 : 1);

        const newPos = {
          lat: nextPoint[0],
          lng: nextPoint[1],
          heading: Math.round(brng),
          speedKmh: Math.round(speedKmh)
        };

        setTechPos(newPos);
        techPosRef.current = newPos;

        if (onTechnicianGpsChange) {
          onTechnicianGpsChange({
            lat: newPos.lat,
            lng: newPos.lng,
            heading: newPos.heading,
            speedKmh: newPos.speedKmh,
            addressLabel: `En route on Bole Africa Ave (${newPos.speedKmh} km/h)`
          });
        }

        // Smooth map camera follow
        if (mapInstanceRef.current) {
          mapInstanceRef.current.panTo([newPos.lat, newPos.lng], { animate: true, duration: 0.8 });
        }

        return nextIndex;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isSimulatingDrive, roadRoutePoints, simSpeedMultiplier, soundEnabled, customerPos, onTechnicianGpsChange]);

  // Recenter map bounds to include tech and destination
  const recenter = () => {
    if (!mapInstanceRef.current) return;
    if (roadRoutePoints.length > 0) {
      const bounds = L.latLngBounds(roadRoutePoints);
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
    } else {
      mapInstanceRef.current.setView([techPos.lat, techPos.lng], 15);
    }
  };

  // Reset Trip Simulation
  const handleResetTrip = () => {
    setIsSimulatingDrive(false);
    setRouteStepIndex(0);
    if (roadRoutePoints.length > 0) {
      const startPt = roadRoutePoints[0];
      const startPos = { lat: startPt[0], lng: startPt[1], heading: 45, speedKmh: 0 };
      setTechPos(startPos);
      techPosRef.current = startPos;
    }
    recenter();
  };

  // Quick Dispatch to Preset Addis Hub
  const dispatchToPreset = (preset: typeof ADDIS_PRESETS[0]) => {
    if (soundEnabled) soundFx.playPing();
    setShowPresetsMenu(false);
    const newDest = { lat: preset.lat, lng: preset.lng };
    if (customerBooking) {
      customerBooking.gpsCoordinates = newDest;
      customerBooking.address = `${preset.name}, ${preset.zone}`;
    }
    // Re-center
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([preset.lat, preset.lng], 15);
    }
  };

  const liveDistance = calculateDistanceKm(techPos.lat, techPos.lng, customerPos.lat, customerPos.lng);
  const liveEtaMinutes = calculateEtaMinutes(liveDistance);
  const showSimulationControls = mode !== 'customer' && showDirections;

  // Responsive height check
  const isCompactView = !isExpanded && (typeof height === 'number' ? height < 340 : false);

  return (
    <div
      className={`relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-950 transition-all duration-300 w-full ${
        isExpanded ? 'fixed inset-3 sm:inset-6 z-50 rounded-2xl shadow-2xl h-[calc(100vh-1.5rem)] sm:h-[calc(100vh-3rem)]' : ''
      }`}
      style={{ height: isExpanded ? undefined : height }}
    >
      {/* REAL LEAFLET MAP CONTAINER */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* TOP FLOATING HUD BAR (RADAR LOCK & COMPACT CONTROLS) */}
      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5 z-10 pointer-events-none flex-wrap">
        {/* Live GPS Lock Indicator */}
        <div className="pointer-events-auto px-2.5 py-1 rounded-xl bg-slate-950/90 backdrop-blur-md border border-white/15 text-white shadow-lg flex items-center gap-1.5 shrink-0">
          <div className="relative flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute" />
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="text-[10px] sm:text-[11px] font-extrabold flex items-center gap-1">
            <span className="text-emerald-400">GPS Live</span>
            <span className="text-slate-400 font-mono hidden md:inline">• Addis Ababa</span>
          </div>
        </div>

        {/* Action Controls Group: Layers, Sound, Recenter, Expand */}
        <div className="pointer-events-auto flex items-center gap-1 shrink-0 ml-auto">
          {/* Layer Selector Pill */}
          <div className="flex bg-slate-950/90 backdrop-blur-md border border-white/15 rounded-xl p-0.5 shadow-lg">
            <button
              type="button"
              onClick={() => setActiveLayer('streets')}
              title="Streets"
              className={`p-1 sm:px-2 sm:py-0.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                activeLayer === 'streets' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              <MapIcon className="w-3 h-3" />
              <span className="hidden sm:inline">Streets</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveLayer('satellite')}
              title="Satellite"
              className={`p-1 sm:px-2 sm:py-0.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                activeLayer === 'satellite' ? 'bg-emerald-600 text-white shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Globe className="w-3 h-3" />
              <span className="hidden sm:inline">Sat</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveLayer('dark')}
              title="Night Radar"
              className={`p-1 sm:px-2 sm:py-0.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                activeLayer === 'dark' ? 'bg-indigo-600 text-white shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Moon className="w-3 h-3" />
              <span className="hidden sm:inline">Dark</span>
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => setSoundEnabled(prev => !prev)}
            title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
            className={`p-1.5 rounded-xl backdrop-blur-md border border-white/15 text-[11px] transition-all shadow-md ${
              soundEnabled ? 'bg-blue-600 text-white' : 'bg-slate-950/90 text-slate-400'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Recenter */}
          <button
            type="button"
            onClick={recenter}
            title="Recenter Map"
            className="p-1.5 rounded-xl bg-slate-950/90 hover:bg-slate-900 text-emerald-400 border border-white/15 backdrop-blur-md transition-all shadow-md"
          >
            <Target className="w-3.5 h-3.5" />
          </button>

          {/* Full Screen */}
          <button
            type="button"
            onClick={() => setIsExpanded(prev => !prev)}
            title={isExpanded ? 'Minimize Map' : 'Full Screen'}
            className="p-1.5 rounded-xl bg-slate-950/90 hover:bg-slate-900 text-white border border-white/15 backdrop-blur-md transition-all shadow-md"
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* QUICK PRESET ADDIS HUBS (Only in simulation / tech / admin modes) */}
      {showSimulationControls && (
        <div className="absolute top-12 left-2.5 z-10">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPresetsMenu(prev => !prev)}
              className="px-2 py-1 rounded-xl bg-slate-950/90 hover:bg-slate-900 text-white border border-white/15 backdrop-blur-md text-[10px] font-bold flex items-center gap-1 shadow-md"
            >
              <MapPin className="w-3 h-3 text-amber-400" />
              <span>Addis Hubs</span>
            </button>

            {showPresetsMenu && (
              <div className="absolute top-7 left-0 w-48 bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 shadow-2xl space-y-0.5 z-30 animate-in fade-in max-h-56 overflow-y-auto">
                <div className="text-[9px] font-black text-slate-400 px-2 py-1 uppercase tracking-wider">
                  Select Landmark
                </div>
                {ADDIS_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => dispatchToPreset(p)}
                    className="w-full text-left px-2 py-1 rounded-lg hover:bg-blue-600/30 text-white text-[11px] font-semibold flex items-center justify-between transition-colors"
                  >
                    <span className="truncate">{p.name}</span>
                    <span className="text-[8px] text-slate-400 font-mono ml-1 shrink-0">{p.zone}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* BOTTOM DOCK (RESPONSIVE & NON-OVERFLOWING) */}
      <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 pointer-events-none">
        <div className="pointer-events-auto bg-slate-950/95 backdrop-blur-xl border border-white/20 rounded-2xl p-2.5 sm:p-3 shadow-2xl text-white space-y-2 max-w-full">
          {/* Main Info Row */}
          <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
            {/* ETA + Distance + Destination */}
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-600/30 border border-blue-400/40 text-blue-400 flex items-center justify-center shrink-0">
                <Navigation
                  className="w-4 h-4 text-amber-300 transition-transform duration-500"
                  style={{ transform: `rotate(${techPos.heading - 45}deg)` }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-base sm:text-lg font-black text-amber-300 tracking-tight whitespace-nowrap">
                    {liveEtaMinutes} Mins
                  </span>
                  <span className="text-[10px] sm:text-xs font-mono text-slate-300 whitespace-nowrap">
                    ({liveDistance} km)
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-400 truncate max-w-full">
                  {mode === 'customer'
                    ? (technician ? `${technician.name} • En Route` : 'Technician dispatched')
                    : (customerBooking?.address || 'Bole Medhanialem, Addis Ababa')}
                </p>
              </div>
            </div>

            {/* If Customer Mode: Quick Tech Contact Pill */}
            {mode === 'customer' && technician && (
              <div className="flex items-center gap-1 shrink-0">
                {technician.phone && (
                  <a
                    href={`tel:${technician.phone}`}
                    className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 shadow transition-colors"
                  >
                    <Phone className="w-3 h-3" />
                    <span className="hidden sm:inline">Call Tech</span>
                  </a>
                )}
              </div>
            )}

            {/* If Tech/Admin Mode: Simulation Controls */}
            {showSimulationControls && (
              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                {/* Speed Multiplier */}
                <button
                  type="button"
                  onClick={() => setSimSpeedMultiplier(prev => (prev === 1 ? 3 : prev === 3 ? 6 : 1))}
                  title="Speed Multiplier"
                  className="px-1.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-[10px] font-mono font-black"
                >
                  {simSpeedMultiplier}x
                </button>

                {/* Drive / Pause */}
                <button
                  type="button"
                  onClick={() => setIsSimulatingDrive(prev => !prev)}
                  className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-[10px] sm:text-[11px] font-black flex items-center gap-1 shadow-md transition-all ${
                    isSimulatingDrive
                      ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 animate-pulse'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white'
                  }`}
                >
                  {isSimulatingDrive ? (
                    <>
                      <Pause className="w-3 h-3" />
                      <span className="hidden xs:inline">In Motion</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3" />
                      <span>Drive</span>
                    </>
                  )}
                </button>

                {/* Reset */}
                <button
                  type="button"
                  onClick={handleResetTrip}
                  title="Reset Route"
                  className="p-1 sm:p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* Turn-by-Turn Instruction Strip */}
          {!isCompactView && (
            <div className="px-2 py-1 rounded-xl bg-blue-950/70 border border-blue-500/30 flex items-center justify-between text-[10px] gap-2">
              <div className="flex items-center gap-1.5 text-blue-200 min-w-0 flex-1">
                <Compass className="w-3 h-3 text-amber-400 shrink-0" />
                <span className="font-medium truncate">
                  {isSimulatingDrive
                    ? `En route to ${customerBooking?.address || 'destination'}`
                    : `Live Road GPS • High Precision OSRM Route`}
                </span>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[9px] font-mono text-emerald-300 font-bold">Live</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
