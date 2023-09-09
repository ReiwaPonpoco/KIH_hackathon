window.onload = () => {
  const scene = document.querySelector("a-scene");

  navigator.geolocation.getCurrentPosition(
    async function (position) {
      try {
        const functionUrl = `https://us-central1-foreignar.cloudfunctions.net/getPlaces?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`;
        const response = await fetch(functionUrl);
        const places = await response.json();

        // alert(position.coords.latitude + " : " + position.coords.longitude);
        // alert(JSON.stringify(places)); // データの確認

        places.forEach((place) => {
          const latitude = place.geometry.location.lat;
          const longitude = place.geometry.location.lng;

          const placeText = document.createElement("a-text");
          placeText.setAttribute(
            "gps-entity-place",
            `latitude: ${latitude}; longitude: ${longitude};`
          );
          placeText.setAttribute("value", place.name);
          placeText.setAttribute("look-at", "[gps-camera]");
          placeText.setAttribute("scale", "3 3 3");
          placeText.setAttribute("color", "black");

          placeText.addEventListener("loaded", () => {
            window.dispatchEvent(new CustomEvent("gps-entity-place-loaded"));
          });

          scene.appendChild(placeText);
        });
      } catch (err) {
        console.error("Error:", err);
        alert("Error: " + err.message);
      }
    },
    (err) => {
      console.error("Geolocation error:", err);
      alert("Geolocation error: " + err.message);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 100000,
    }
  );
};
