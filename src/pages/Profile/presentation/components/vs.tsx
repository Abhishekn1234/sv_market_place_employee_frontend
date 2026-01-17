// const saveChanges = async () => {
//   if (!tempLocation) return;

//   let [lat, lng] = tempLocation;
//   let placeName = locationName;

//   // If using CURRENT mode, take the actual GPS
//   if (locationMode === "CURRENT" && currentLocation) {
//     lat = normalize(currentLocation.lat);
//     lng = normalize(currentLocation.lng);
//     placeName = await reverseGeocode(lat, lng);

//     // Update state so UI shows correct value
//     setTempLocation([lat, lng]);
//     setLocationName(placeName);
//   }

//   const payload: WorkerPayload = {
//     status: status || "ONLINE",
//     serviceTierIds: selectedTiers,
//     categoryIds: selectedCategories,
//     serviceRadius: radius,
//     location: { type: "Point", coordinates: [lng, lat] },
//   };

//   serviceSettingsMutation.mutate(payload, {
//     onSuccess: () => {
//       // Save both coordinates and name
//       localStorage.setItem(
//         "lastNotifiedLocation",
//         JSON.stringify({ lat, lng, placeName })
//       );

//       toast.success("Updated successfully");
//       setModalOpen(false);
//       setActiveTab("location");
//     },
//     onError: () => toast.error("Update failed"),
//   });
// };
