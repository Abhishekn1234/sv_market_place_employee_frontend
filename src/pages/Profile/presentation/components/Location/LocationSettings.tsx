import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useLocationContext } from "@/context/LocationContext";
import { useDynamicLocation } from "@/utils/useNotification";
import { useServiceTier } from "@/pages/Servicesettings/presentation/hooks/useServiceTier";
import { useServiceCategory } from "@/pages/Servicesettings/presentation/hooks/useServiceCategory";
import { useServiceSettings } from "@/pages/Servicesettings/presentation/hooks/useServicesettings";
import { useAuthStore } from "@/core/store/auth";
import { initLeafletIcons,normalize } from "@/components/common/CommonMap";
import { reverseGeocode } from "@/components/common/CommonMap";


import EmployeeDetails from "./EmployeeDetails";
import LocationModal from "./LocationModal";
import type { WorkerPayload } from "@/pages/Servicesettings/domain/entities/servicesettings";
import  type { TabType } from "@/pages/Profile/domain/entities/tabtype";


initLeafletIcons();

interface Props {
  setActiveTab: (tab: TabType) => void;
}

export default function LocationSettings({ setActiveTab }: Props) {
  useDynamicLocation();
  const { currentLocation } = useLocationContext();
  const { data: serviceTiers } = useServiceTier();
  const { data: serviceCategories } = useServiceCategory();
  const serviceSettingsMutation = useServiceSettings();

  const getEmployeeStatus = () => {
    const { user } = useAuthStore.getState();
    const status = user?.worker?.status;
    return status === "ONLINE" ? "ONLINE" : "OFFLINE";
  };
    const hasAllRequiredDocuments = () => {
    const { user} = useAuthStore.getState();
    const documents = user?.documents;

    if (!Array.isArray(documents)) return false;

    const requiredDocs = ["idProof", "addressProof", "photoProof"];

    return requiredDocs.every((docType) =>
      documents.some((doc) => doc.documentType === docType)
    );
  };


  const [status, setStatus] = useState(getEmployeeStatus());
  const [selectedTiers, setSelectedTiers] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [tempLocation, setTempLocation] = useState<[number, number] | null>(null);
  const [locationName, setLocationName] = useState("");
  const [radius, setRadius] = useState(1000);
  const [modalOpen, setModalOpen] = useState(false);
  const [locationMode, setLocationMode] = useState<"CURRENT" | "MANUAL">("CURRENT");


useEffect(() => {
  const init = async () => {
    const { user } = useAuthStore.getState();
   
    if (!user) return;

    setStatus(user.worker?.status ?? "OFFLINE");
    setRadius(user.worker?.serviceRadius ?? 500);
    setSelectedTiers(user.worker?.serviceTierIds ?? []);
    setSelectedCategories(user.worker?.categoryIds ?? []);

 
    if (user.location?.coordinates?.length === 2) {
      const [lng, lat] = user.location.coordinates;
      setTempLocation([normalize(lat), normalize(lng)]);


      const placeName = await reverseGeocode(normalize(lat), normalize(lng));
      setLocationName(placeName);
    }
  };
  init();
}, []);


 
  useEffect(() => {
    if (!currentLocation || locationMode !== "CURRENT") return;
    const lat = normalize(currentLocation.lat);
    const lng = normalize(currentLocation.lng);
    setTempLocation([lat, lng]);
    reverseGeocode(lat, lng).then(setLocationName);
  }, [currentLocation, locationMode]);

  // const saveChanges = () => {
  //   if (!tempLocation) return;
  //   const [lat, lng] = tempLocation;
  //   const payload:WorkerPayload = {
  //     status: status || "ONLINE",
  //     serviceTierIds: selectedTiers,
  //     categoryIds: selectedCategories,
  //     serviceRadius: radius,
  //     location: { type: "Point", coordinates: [lng, lat] },
  //   };

  //   serviceSettingsMutation.mutate(payload, {
  //     onSuccess: () => {
  //       localStorage.setItem("lastNotifiedLocation", JSON.stringify({ lat, lng }));
  //       toast.success("Updated successfully");
  //       setModalOpen(false);
  //       setActiveTab("location");
  //     },
  //     onError: () => toast.error("Update failed"),
  //   });
  // };

  const saveChanges = () => {
  if (!tempLocation) return;
  const [lat, lng] = tempLocation;

  const payload: WorkerPayload = {
   status: status,
    serviceTierIds: selectedTiers,
    categoryIds: selectedCategories,
    serviceRadius: radius,
    location: { type: "Point", coordinates: [lng, lat] },
  };

  serviceSettingsMutation.mutate(payload, {
    onSuccess: () => {
      
      useAuthStore.getState().updateWorker({
  serviceTierIds: selectedTiers,
  categoryIds: selectedCategories,
  serviceRadius: radius,
  location: { type: "Point", coordinates: [lng, lat] },
});

      toast.success("Updated successfully");
      setModalOpen(false);
      setActiveTab("location");
    },
    onError: () => toast.error("Update failed"),
  });
};



  if (!tempLocation) return null;

  return (
    <div className="max-w-3xl mx-auto p-6">
     <EmployeeDetails
  status={status}
  locationName={locationName}
  serviceTiers={serviceTiers}
  serviceCategories={serviceCategories}
  selectedTiers={selectedTiers}
  selectedCategories={selectedCategories}
  onEdit={() => {
    if (!hasAllRequiredDocuments()) {
      toast.error(
        "Please upload ID Proof, Address Proof and Photo before editing location"
      );
      return;
    }
    setModalOpen(true);
  }}
/>


      {modalOpen && (
        <LocationModal
          tempLocation={tempLocation}
          locationMode={locationMode}
          setLocationMode={setLocationMode}
          setTempLocation={setTempLocation}
          locationName={locationName}
          setLocationName={setLocationName}
          radius={radius}
          setRadius={setRadius}
          serviceTiers={serviceTiers}
          serviceCategories={serviceCategories}
          selectedTiers={selectedTiers}
          setSelectedTiers={setSelectedTiers}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          saveChanges={saveChanges}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
