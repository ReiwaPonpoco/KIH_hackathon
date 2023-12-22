window.onload = async () => {
	const { Map } = await google.maps.importLibrary("maps");
	let map;

	// VR
	const scene = document.querySelector("a-scene");

	// 位置情報の取得とマップの初期化
	initializeMap(scene);

	// メニューボタンのイベントリスナー設定
	setupMenuButton();
};

function initializeMap(scene) {
	navigator.geolocation.getCurrentPosition(
		async function (pos) {
			const posLat = pos.coords.latitude;
			const posLng = pos.coords.longitude;

			const mapEl = document.querySelector("#map");
			map = setupMap(mapEl, posLat, posLng);

			setupMapClickEvent(mapEl, map, posLat, posLng);

			try {
				const places = await fetchPlaces(posLat, posLng);
				console.log(places);
				renderPlaces(places, scene, posLat, posLng);
			} catch (err) {
				console.error("Error:", err);
				alert("Error: " + err.message);
			}
		},
		handleGeolocationError,
		{
			enableHighAccuracy: true,
			maximumAge: 0,
			timeout: 100000,
		}
	);
}

function setupMap(mapEl, posLat, posLng) {
	return new Map(mapEl, {
		center: { lat: posLat, lng: posLng },
		zoom: 15,
	});
}

function setupMapClickEvent(mapEl, map, posLat, posLng) {
	mapEl.addEventListener("click", () => {
		mapEl.setAttribute("full-size", "");
		setTimeout(() => {
			document.querySelector("#map-close-btn").addEventListener("click", () => {
				mapEl.removeAttribute("full-size");
				map.setCenter(new google.maps.LatLng(posLat, posLng));
				map.setZoom(15);
			});
		}, 100);
	});
}

async function fetchPlaces(posLat, posLng) {
	const functionUrl = `https://us-central1-foreignar.cloudfunctions.net/getPlaces?latitude=${posLat}&longitude=${posLng}`;
	const response = await fetch(functionUrl);
	return await response.json();
}

function renderPlaces(places, scene, posLat, posLng) {
	places.forEach(async (place, index) => {
		const latitude = place.geometry.location.lat;
		const longitude = place.geometry.location.lng;
		const entityEl = createPlaceElement(place, index, latitude, longitude);
		const iconAssetEl = createIconAsset(place, index);

		scene.appendChild(iconAssetEl);
		scene.appendChild(entityEl);
	});

	new google.maps.Marker({
		position: { lat: posLat, lng: posLng },
		map,
		title: "You",
	});
}

function createPlaceElement(place, index, latitude, longitude) {
	return document.createRange().createContextualFragment(`
    <a-entity gps-entity-place="latitude: ${latitude}; longitude: ${longitude};">
      <a-text value="${place.name}" look-at="[gps-camera]" scale="3 3 3" color="#ffffff" position="-0.8 0 0"></a-text>
      <a-image name="${place.name}" look-at="[gps-camera]" scale="0.8 0.8 0.8" src="#icon-${index}" position="0 0 0"></a-image>
    </a-entity>
  `);
}

function createIconAsset(place, index) {
	return document.createRange().createContextualFragment(`
    <a-assets>
      <img id="icon-${index}" src="${place.icon}" crossorigin="anonymous">
    </a-assets>
  `);
}

function handleGeolocationError(err) {
	console.error("Geolocation error:", err);
	alert("Geolocation error: " + err.message);
}

function setupMenuButton() {
	const menuBtn = document.querySelector("#menu-btn");
	const menu = document.querySelector("#menu");

	menuBtn.addEventListener("click", () => {
		menu.toggleAttribute("visible");
		menu.removeAttribute("init");
		menuBtn.toggleAttribute("open");
	});
}
