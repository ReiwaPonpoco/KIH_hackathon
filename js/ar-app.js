// ページの読み込みが完了したら実行
window.onload = async () => {
  // Google Mapsのライブラリをインポート
  const { Map } = await google.maps.importLibrary("maps");
  let map;

  // ARのシーンを取得
  const scene = document.querySelector("a-scene");

  // ユーザーの現在位置を取得
  navigator.geolocation.getCurrentPosition(
    async function (pos) {
      // 現在の緯度と経度を取得
      const posLat = pos.coords.latitude;
      const posLng = pos.coords.longitude;

      // マップの設定と表示
      const mapEl = document.querySelector("#map");
      map = new Map(mapEl, {
        center: {
          lat: posLat,
          lng: posLng,
        },
        zoom: 15,
      });

      // マップをクリックしたときの動作
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
        // Firebase Cloud Functionsから周辺の場所の情報を取得
        const functionUrl = `https://us-central1-foreignar.cloudfunctions.net/getPlaces?latitude=${posLat}&longitude=${posLng}`;
        const response = await fetch(functionUrl);
        const places = await response.json();

        console.log(places);

        // 取得した場所の情報をAR上に表示
        places.forEach(async (place, index) => {
          const latitude = place.geometry.location.lat;
          const longitude = place.geometry.location.lng;

          // テキストとアイコンの生成
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

          // AR上の情報が読み込まれたときのイベント
          entityEl.addEventListener("loaded", () => {
            window.dispatchEvent(new CustomEvent("gps-entity-place-loaded"));
          });

          // アイコン画像のアセットを生成
          const iconAssetEl = document.createRange().createContextualFragment(`
            <a-assets>
              <img id="icon-${index}" src="${place.icon}" crossorigin="anonymous">
            </a-assets>`);

          // シーンにアセットとエンティティを追加
          scene.appendChild(iconAssetEl);
          scene.appendChild(entityEl);
        });

        // ユーザーの現在位置にマーカーを表示
        new google.maps.Marker({
          position: {
            lat: posLat,
            lng: posLng,
          },
          map,
          title: "You",
        });
      } catch (err) {
        // エラーハンドリング
        console.error("Error:", err);
        alert("Error: " + err.message);
      }
    },
    (err) => {
      // 位置情報の取得に失敗したときのエラーハンドリング
      console.error("Geolocation error:", err);
      alert("Geolocation error: " + err.message);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 100000,
    }
  );

  // メニューボタンの動作
  const menuBtn = document.querySelector("#menu-btn");
  const menu = document.querySelector("#menu");

  menuBtn.addEventListener("click", () => {
    menu.toggleAttribute("visible");
    menu.removeAttribute("init");
    menuBtn.toggleAttribute("open");
  });
};
