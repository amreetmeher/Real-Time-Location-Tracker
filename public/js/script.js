const socket = io();
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.log(error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000, //miliseconds
      maximumAge: 0,
    }
  );
}
const map = L.map("map").setView([0, 0], 15);
L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "OpenStreetMap",
}).addTo(map);

const markers = {};

socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;
  map.setView([latitude, longitude], 20);
  if (markers[id]) {
    markers[id]
      .setLatLng([latitude, longitude])
      .bindPopup("Your Location")
      .openPopup();
  } else {
    markers[id] = L.marker([latitude, longitude])
      .addTo(map)
      .bindPopup("Your Location")
      .openPopup();
  }
});

socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});
