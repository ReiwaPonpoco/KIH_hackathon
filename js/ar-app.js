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

          // テキスト
          const textEl = document.createRange().createContextualFragment(`
            <a-text
              gps-entity-place="latitude: ${latitude}; longitude: ${longitude};"
              value="${place.name}"
              look-at="[gps-camera]"
              scale="3 3 3"
              color="#ffffff"
            ></a-text>`);

          textEl.addEventListener("loaded", () => {
            window.dispatchEvent(new CustomEvent("gps-entity-place-loaded"));
          });

          // アイコン画像のアセット
          const iconAssetEl = document.createRange().createContextualFragment(`
            <a-assets>
              <img id="icon-${index}" src="${place.icon}">
            </a-assets>`);

          // ARアイコン
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

  const menuBtn = document.querySelector("#menu-btn");
  const menu = document.querySelector("#menu");

  menuBtn.addEventListener("click", () => {
    menu.toggleAttribute("visible");
    menuBtn.toggleAttribute("open");
  });
};
