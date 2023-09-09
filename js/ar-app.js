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

        console.log(places);

        places.forEach((place, index) => {
          const latitude = place.geometry.location.lat;
          const longitude = place.geometry.location.lng;

          const textEl = document.createRange().createContextualFragment(`
            <a-text
              gps-entity-place="latitude: ${latitude}; longitude: ${longitude};"
              value="${place.name}"
              look-at="[gps-camera]"
              scale="3 3 3"
              color="#0289f0"
            ></a-text>`);

          textEl.addEventListener("loaded", () => {
            window.dispatchEvent(new CustomEvent("gps-entity-place-loaded"));
          });

          const iconAssetEl = document.createRange().createContextualFragment(`
            <a-assets>
              <img id="icon-${index}" src="${place.icon}">
            </a-assets>`);

          const iconEl = document.createRange().createContextualFragment(`
            <a-image
              gps-entity-place="latitude: ${latitude}; longitude: ${longitude};"
              name="${place.name}"
              look-at="[gps-camera]"
              scale="1 1 1"
              src="#icon-${index}"
            ></a-image>`);

          scene.appendChild(textEl);
          scene.appendChild(iconAssetEl);
          scene.appendChild(iconEl);
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
