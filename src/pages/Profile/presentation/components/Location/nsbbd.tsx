// import {  useEffect, useState } from "react";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Circle,
//   useMap,
// } from "react-leaflet";

// import "leaflet/dist/leaflet.css";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { PencilIcon } from "lucide-react";
// import { toast } from "react-toastify";

// import { useLocationContext } from "@/context/LocationContext";
// import { useDynamicLocation } from "@/utils/useNotification";
// import { useServiceTier } from "@/pages/Servicesettings/presentation/hooks/useServiceTier";
// import { useServiceCategory } from "@/pages/Servicesettings/presentation/hooks/useServiceCategory";
// import { useServiceSettings } from "@/pages/Servicesettings/presentation/hooks/useServicesettings";

// import type { WorkerPayload, WorkerStatus } from "@/pages/Servicesettings/domain/entities/servicesettings";
// import { useAuthStore } from "@/core/store/auth";
// import { initLeafletIcons, normalize } from "./Location/leaflet";
// import { reverseGeocode } from "./Location/reverseGeocode";
// import { getLastNotifiedLocation } from "./Location/LastSavedNotification";
// // import { socket } from "@/core/Websocket/socket";

// /* ---------------- Leaflet Fix ---------------- */
// initLeafletIcons();


// /* ---------- Map Helpers ---------- */
// const RecenterMap = ({ location }: { location: [number, number] }) => {
//   const map = useMap();
//   useEffect(() => {
//     map.setView(location, map.getZoom(), { animate: true });
//   }, [location]);
//   return null;
// };

// const ManualLocationPicker = ({
//   enabled,
//   onPick,
// }: {
//   enabled: boolean;
//   onPick: (lat: number, lng: number) => void;
// }) => {
//   const map = useMap();

//   useEffect(() => {
//     if (!enabled) return;

//     const handler = (e: any) => {
//       onPick(e.latlng.lat, e.latlng.lng);
//     };

//     map.on("click", handler);
//     return () => {
//       map.off("click", handler);
//     };
//   }, [enabled]);

//   return null;
// };

// type TabType = "location" | "profile" | "password";

// interface Props {
//   setActiveTab: (tab: TabType) => void;
// }

// export default function LocationSettings({ setActiveTab }: Props) {
//   useDynamicLocation();
//   const { currentLocation } = useLocationContext();

//   const { data: serviceTiers } = useServiceTier();
//   const { data: serviceCategories } = useServiceCategory();
//   const serviceSettingsMutation = useServiceSettings();
//  const getEmployeeStatus = (): WorkerStatus | null => {
//   const { employeeData } = useAuthStore.getState();

//   const status = employeeData?.user?.status as WorkerStatus | undefined;

//   if (!status) return null;

//   return status === "ONLINE" ? "ONLINE" : "OFFLINE";
// };


//   const [status, setStatus] = useState<WorkerStatus | null>(() =>
//   getEmployeeStatus()
// );

//   const [selectedTiers, setSelectedTiers] = useState<string[]>([]);
//   const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
//   const [tempLocation, setTempLocation] =
//     useState<[number, number] | null>(null);
//   const [locationName, setLocationName] = useState("");
//   const [radius, setRadius] = useState(1000);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [locationMode, setLocationMode] =
//     useState<"CURRENT" | "MANUAL">("CURRENT");

//   /* ---------- INIT ---------- */
// useEffect(() => {
//   const init = async () => {
//     /* ---------- LOCATION ---------- */
//     const last = await getLastNotifiedLocation();
//     if (last) {
//       setTempLocation([normalize(last.lat), normalize(last.lng)]);
//       setLocationName(last.placeName);
//     }

//     /* ---------- AUTH STORE ---------- */
//     const { employeeData } = useAuthStore.getState();
//     const user = employeeData?.user;

//     if (!user) return;

//     /* ---------- STATUS ---------- */
//     if (user.status) {
//       setStatus(user.status); // already typed as WorkerStatus
//     }

//     /* ---------- SERVICE SETTINGS ---------- */
//     setRadius(user.serviceRadius ?? 500);
//     setSelectedTiers(user.serviceTierIds  ?? []);
//     setSelectedCategories(user.categoryIds  ?? []);
//   };

//   init();
// }, []);


//   /* ---------- GPS Sync ---------- */
//   useEffect(() => {
//     if (!currentLocation || locationMode !== "CURRENT") return;

//     const lat = normalize(currentLocation.lat);
//     const lng = normalize(currentLocation.lng);

//     setTempLocation([lat, lng]);
//     reverseGeocode(lat, lng).then(setLocationName);
//   }, [currentLocation, locationMode]);

//   /* ---------- Save ---------- */
//   const saveChanges = () => {
//   if (!tempLocation) return;

//   const [lat, lng] = tempLocation;

//   const payload: WorkerPayload = {
//     status: status || "ONLINE",
//     serviceTierIds: selectedTiers,
//     categoryIds: selectedCategories,
//     serviceRadius: radius,
//     location: { type: "Point", coordinates: [lng, lat] },
//   };

//   serviceSettingsMutation.mutate(payload, {
//     onSuccess: () => {
//       // 🔔 Emit socket event
//       // socket.emit("worker:location-updated", {
//       //   lat,
//       //   lng,
//       //   status: payload.status,
//       //   radius,
//       // });

//       localStorage.setItem(
//         "lastNotifiedLocation",
//         JSON.stringify({ lat, lng })
//       );

//       toast.success("Updated successfully");
//       setModalOpen(false);
//       setActiveTab("location");
//     },
//     onError: () => toast.error("Update failed"),
//   });
// };


//   if (!tempLocation) return null;

//   return (
//     <div className="max-w-3xl mx-auto p-6">
//       {/* Header */}
//       <div className="flex justify-between mb-4">
//         <h2 className="text-xl font-semibold">Employee Details</h2>
//         <Button onClick={() => setModalOpen(true)}>
//           <PencilIcon className="w-4 h-4 mr-2" /> Edit
//         </Button>
//       </div>

//       {/* Display */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//         <div className="rounded-lg border bg-white p-4">
//           <p className="text-sm text-gray-500 mb-1">Status</p>
//           <span className="font-medium text-blue-600">{status}</span>
//         </div>

//         <div className="rounded-lg border bg-white p-4">
//           <p className="text-sm text-gray-500 mb-1">Location</p>
//           <span className="font-medium">{locationName}</span>
//         </div>
//         <div className="rounded-lg border bg-white p-4">
//   <Label className="text-sm text-gray-500">Service Tiers</Label>
//   <div className="flex flex-wrap gap-2 mt-2">
//     {serviceTiers
//       ?.filter((t) => selectedTiers.includes(t._id))
//       .map((tier) => (
//         <span
//           key={tier._id}
//           className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs"
//         >
//           {tier.displayName}
//         </span>
//       ))}
//   </div>
// </div>

// <div className="rounded-lg border bg-white p-4">
//   <Label className="text-sm text-gray-500">Service Categories</Label>
//   <div className="flex flex-wrap gap-2 mt-2">
//     {serviceCategories
//       ?.filter((c) => selectedCategories.includes(c._id))
//       .map((cat) => (
//         <span
//           key={cat._id}
//           className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs"
//         >
//           {cat.name}
//         </span>
//       ))}
//   </div>
// </div>

//       </div>

//       {/* Modal */}
//       {modalOpen && (
//         <div className="border rounded p-4 space-y-5">
//           {/* Location Mode */}
//           <div>
//             <Label>Location Mode</Label>
//             <div className="flex gap-4 mt-2">
//               <label className="flex items-center gap-2">
//                 <input
//                   type="radio"
//                   checked={locationMode === "CURRENT"}
//                   onChange={() => setLocationMode("CURRENT")}
//                 />
//                 Current Location
//               </label>
//               <label className="flex items-center gap-2">
//                 <input
//                   type="radio"
//                   checked={locationMode === "MANUAL"}
//                   onChange={() => setLocationMode("MANUAL")}
//                 />
//                 Manual Location
//               </label>
//             </div>
//           </div>

//           {/* Map */}
//           <MapContainer center={tempLocation} zoom={13} className="h-64">
//             <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
//             <RecenterMap location={tempLocation} />

//             <ManualLocationPicker
//               enabled={locationMode === "MANUAL"}
//               onPick={async (lat, lng) => {
//                 const nLat = normalize(lat);
//                 const nLng = normalize(lng);
//                 setTempLocation([nLat, nLng]);
//                 setLocationName(await reverseGeocode(nLat, nLng));
//               }}
//             />

//             <Marker
//               position={tempLocation}
//               draggable={locationMode === "MANUAL"}
//               eventHandlers={{
//                 dragend: async (e) => {
//                   const pos = e.target.getLatLng();
//                   const nLat = normalize(pos.lat);
//                   const nLng = normalize(pos.lng);
//                   setTempLocation([nLat, nLng]);
//                   setLocationName(await reverseGeocode(nLat, nLng));
//                 },
//               }}
//             />

//             <Circle center={tempLocation} radius={radius} />
//           </MapContainer>

//           {/* Radius */}
//           <div>
//             <Label>Service Radius (km)</Label>
//             <input
//               type="number"
//               value={radius / 1000}
//               onChange={(e) => setRadius(Number(e.target.value) * 1000)}
//               className="w-full border rounded px-3 py-2"
//             />
//           </div>
//           <div>
//   <Label>Service Categories</Label>
//   <div className="flex flex-wrap gap-2 mt-2">
//     {serviceCategories?.map((cat) => {
//       const active = selectedCategories.includes(cat._id);

//       return (
//         <button
//           key={cat._id}
//           type="button"
//           onClick={() =>
//             setSelectedCategories((prev) =>
//               active
//                 ? prev.filter((id) => id !== cat._id)
//                 : [...prev, cat._id]
//             )
//           }
//           className={`px-3 py-1 rounded border text-sm transition ${
//             active
//               ? "bg-green-600 text-white"
//               : "bg-white text-gray-700"
//           }`}
//         >
//           {cat.name}
//         </button>
//       );
//     })}
//   </div>
//   <div>
//   <Label>Service Tiers</Label>
//   <div className="flex flex-wrap gap-2 mt-2">
//     {serviceTiers?.map((tier) => {
//       const active = selectedTiers.includes(tier._id);

//       return (
//         <button
//           key={tier._id}
//           type="button"
//           onClick={() =>
//             setSelectedTiers((prev) =>
//               active
//                 ? prev.filter((id) => id !== tier._id)
//                 : [...prev, tier._id]
//             )
//           }
//           className={`px-3 py-1 rounded border text-sm transition ${
//             active
//               ? "bg-blue-600 text-white"
//               : "bg-white text-gray-700"
//           }`}
//         >
//           {tier.displayName}
//         </button>
//       );
//     })}
//   </div>
// </div>

// </div>


//           {/* Actions */}
//           <div className="flex justify-end gap-2">
//             <Button variant="outline" onClick={() => setModalOpen(false)}>
//               Cancel
//             </Button>
//             <Button onClick={saveChanges}>Update</Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
