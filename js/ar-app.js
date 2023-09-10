window.onload = async () => {
  const { Map } = await google.maps.importLibrary("maps");
  let map;

  // VR
  const scene = document.querySelector("a-scene");

  navigator.geolocation.getCurrentPosition(
    async function (pos) {
      const posLat = pos.coords.latitude;
      const posLng = pos.coords.longitude;

      const mapEl = document.querySelector("#map");

      map = new Map(mapEl, {
        center: {
          lat: posLat,
          lng: posLng,
        },
        zoom: 15,
      });

      mapEl.addEventListener("click", () => {
        mapEl.setAttribute("full-size", "");

        setTimeout(() => {
          document
            .querySelector("#map-close-btn")
            .addEventListener("click", () => {
              mapEl.removeAttribute("full-size");
              map.setCenter(new google.maps.LatLng(posLat, posLng));
              map.setZoom(15);
            });
        }, 100);
      });

      try {
        const functionUrl = `https://us-central1-foreignar.cloudfunctions.net/getPlaces?latitude=${posLat}&longitude=${posLng}`;
        const response = await fetch(functionUrl);
        const places = await response.json();

        console.log(places);

        places.forEach(async (place, index) => {
          const latitude = place.geometry.location.lat;
          const longitude = place.geometry.location.lng;

          // テキスト、アイコン
          const entityEl = document.createRange().createContextualFragment(`
          <a-entity
            gps-entity-place="latitude: ${latitude}; longitude: ${longitude};"
          >
            <a-text
              value="${place.name}"
              look-at="[gps-camera]"
              scale="3 3 3"
              color="#ffffff"
              position="-0.8 0 0"
            ></a-text>
            <a-image
              name="${place.name}"
              look-at="[gps-camera]"
              scale="0.8 0.8 0.8"
              src="#icon-${index}"
              position="0 0 0"
            ></a-image>
          </a-entity>
          `);

          entityEl.addEventListener("loaded", () => {
            window.dispatchEvent(new CustomEvent("gps-entity-place-loaded"));
          });

          // アイコン画像のアセット
          const iconAssetEl = document.createRange().createContextualFragment(`
            <a-assets>
              <img id="icon-${index}" src="${place.icon}" crossorigin="anonymous">
            </a-assets>`);

          scene.appendChild(iconAssetEl);
          scene.appendChild(entityEl);

          //   let markerLatLng = {
          //     lat: place.geometry.location.lat,
          //     lng: place.geometry.location.lng,
          //   };

          //   // marker
          //   let marker = new google.maps.Marker({
          //     position: markerLatLng,
          //     map,
          //     title: place.name,
          //     label: {
          //       text: place.name || "?",
          //       fontSize: "24px",
          //     },
          //   });

          //   // info window
          //   let infoWindow = new google.maps.InfoWindow({
          //     position: markerLatLng,
          //     content: `
          //       <div class="infowin-container">
          //         ${place.name}
          //       </div>
          //     `,
          // });

          //   marker.addListener("click", () => {
          //     infoWindow.open(map, marker);
          //   });
        });

        new google.maps.Marker({
          position: {
            lat: posLat,
            lng: posLng,
          },
          map,
          title: "You",
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
    menu.removeAttribute("init");
    menuBtn.toggleAttribute("open");
  });
};
