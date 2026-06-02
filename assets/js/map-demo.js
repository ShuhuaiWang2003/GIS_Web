(function () {
	"use strict";

	function getNumber(value, fallback) {
		var parsed = parseFloat(value);
		return Number.isFinite(parsed) ? parsed : fallback;
	}

	function createBaseLayers() {
		return {
			osm: L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
				maxZoom: 19,
				attribution: "&copy; OpenStreetMap contributors"
			}),
			satellite: L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
				maxZoom: 19,
				attribution: "Tiles &copy; Esri"
			})
		};
	}

	function initializeCategoryMap(mapNode) {
		var card = mapNode.closest(".thematic-map-card");
		var basemapSelect = card ? card.querySelector(".basemap-select") : null;
		var statusNode = card ? card.querySelector(".map-status") : null;
		var center = [
			getNumber(mapNode.dataset.mapCenterLat, 45.46),
			getNumber(mapNode.dataset.mapCenterLng, 9.19)
		];
		var zoom = getNumber(mapNode.dataset.mapZoom, 8);
		var geoserverUrl = mapNode.dataset.geoserverUrl;
		var layerName = mapNode.dataset.layer;
		var baseLayers = createBaseLayers();
		var activeBaseLayer = baseLayers.osm;
		var map = L.map(mapNode).setView(center, zoom);
		var overlay = null;

		activeBaseLayer.addTo(map);

		if (geoserverUrl && layerName) {
			overlay = L.tileLayer.wms(geoserverUrl, {
				layers: layerName,
				format: "image/png",
				transparent: true,
				tiled: true,
				opacity: 0.75,
				attribution: "GeoServer WMS"
			}).addTo(map);

			if (statusNode) {
				statusNode.textContent = "Displaying GeoServer WMS layer: " + layerName;
			}
		}

		if (basemapSelect) {
			basemapSelect.addEventListener("change", function () {
				var selected = basemapSelect.value;
				var nextLayer = baseLayers[selected] || baseLayers.osm;

				if (activeBaseLayer) {
					map.removeLayer(activeBaseLayer);
				}

				activeBaseLayer = nextLayer.addTo(map);

				if (overlay) {
					overlay.bringToFront();
				}
			});
		}

		setTimeout(function () {
			map.invalidateSize();
		}, 300);
	}

	document.addEventListener("DOMContentLoaded", function () {
		if (!window.L) {
			return;
		}

		document.querySelectorAll(".category-map").forEach(initializeCategoryMap);
	});
}());
