(function () {
	"use strict";

	var TILE_SIZE = 256;

	function getNumber(value, fallback) {
		var parsed = parseFloat(value);
		return Number.isFinite(parsed) ? parsed : fallback;
	}

	function lonLatToWorld(lng, lat, zoom) {
		var sinLat = Math.sin(lat * Math.PI / 180);
		var scale = TILE_SIZE * Math.pow(2, zoom);

		return {
			x: (lng + 180) / 360 * scale,
			y: (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * scale
		};
	}

	function worldToLonLat(x, y, zoom) {
		var scale = TILE_SIZE * Math.pow(2, zoom);
		var lng = x / scale * 360 - 180;
		var n = Math.PI - 2 * Math.PI * y / scale;
		var lat = 180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));

		return { lng: lng, lat: lat };
	}

	function getTileUrl(type, x, y, zoom) {
		var wrappedX = ((x % Math.pow(2, zoom)) + Math.pow(2, zoom)) % Math.pow(2, zoom);

		if (type === "satellite") {
			return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/" + zoom + "/" + y + "/" + wrappedX;
		}

		return "https://tile.openstreetmap.org/" + zoom + "/" + wrappedX + "/" + y + ".png";
	}

	function buildWmsUrl(baseUrl, layerName, bounds, width, height) {
		var params = new URLSearchParams({
			service: "WMS",
			version: "1.1.1",
			request: "GetMap",
			layers: layerName,
			styles: "",
			bbox: [bounds.west, bounds.south, bounds.east, bounds.north].join(","),
			srs: "EPSG:4326",
			width: String(Math.round(width)),
			height: String(Math.round(height)),
			format: "image/png",
			transparent: "true"
		});

		return baseUrl + (baseUrl.indexOf("?") === -1 ? "?" : "&") + params.toString();
	}

	function buildLegendUrl(baseUrl, layerName, styleName) {
		var params = new URLSearchParams({
			service: "WMS",
			version: "1.1.1",
			request: "GetLegendGraphic",
			format: "image/png",
			layer: layerName,
			legend_options: "forceLabels:on;fontAntiAliasing:true"
		});

		if (styleName) {
			params.set("style", styleName);
		}

		return baseUrl + (baseUrl.indexOf("?") === -1 ? "?" : "&") + params.toString();
	}

	function getLegendNode(mapNode) {
		var legendNode = mapNode.querySelector(".map-legend");

		if (!legendNode) {
			legendNode = document.createElement("div");
			legendNode.className = "map-legend";
			legendNode.hidden = true;
			legendNode.innerHTML = '<img alt="Selected layer legend" />';
			mapNode.appendChild(legendNode);
		}

		return legendNode;
	}

	function renderSimpleMap(shell) {
		var mapNode = shell.querySelector(".pollutant-map");
		var basemapSelect = shell.querySelector(".basemap-select");
		var layerSelect = shell.querySelector(".layer-select");
		var statusNode = shell.querySelector(".map-status");

		if (!mapNode || !basemapSelect || !layerSelect) {
			return;
		}

		var rect = mapNode.getBoundingClientRect();
		var width = Math.max(rect.width, 320);
		var height = Math.max(rect.height, 280);
		var zoom = getNumber(mapNode.dataset.mapZoom, 7);
		var centerLat = getNumber(mapNode.dataset.mapCenterLat, 42.7);
		var centerLng = getNumber(mapNode.dataset.mapCenterLng, 25.4);
		var center = lonLatToWorld(centerLng, centerLat, zoom);
		var topLeft = {
			x: center.x - width / 2,
			y: center.y - height / 2
		};
		var bottomRight = {
			x: center.x + width / 2,
			y: center.y + height / 2
		};
		var startTileX = Math.floor(topLeft.x / TILE_SIZE);
		var endTileX = Math.floor(bottomRight.x / TILE_SIZE);
		var startTileY = Math.floor(topLeft.y / TILE_SIZE);
		var endTileY = Math.floor(bottomRight.y / TILE_SIZE);
		var maxTile = Math.pow(2, zoom) - 1;
		var selectedOption = layerSelect.options[layerSelect.selectedIndex];
		var label = selectedOption ? selectedOption.dataset.label || selectedOption.textContent : "";
		var layerName = selectedOption ? selectedOption.dataset.layer || "" : "";
		var geoserverUrl = selectedOption ? selectedOption.dataset.geoserverUrl || "" : "";
		var styleName = selectedOption ? selectedOption.dataset.style || "" : "";
		var shouldShowLegend = selectedOption && selectedOption.dataset.hasLegend === "true" && geoserverUrl && layerName;
		var boundsNorthWest = worldToLonLat(topLeft.x, topLeft.y, zoom);
		var boundsSouthEast = worldToLonLat(bottomRight.x, bottomRight.y, zoom);
		var html = "";

		for (var tileX = startTileX; tileX <= endTileX; tileX += 1) {
			for (var tileY = startTileY; tileY <= endTileY; tileY += 1) {
				if (tileY < 0 || tileY > maxTile) {
					continue;
				}

				html += '<img class="simple-map-tile" alt="" src="' + getTileUrl(basemapSelect.value, tileX, tileY, zoom) + '" style="left:' + (tileX * TILE_SIZE - topLeft.x) + 'px; top:' + (tileY * TILE_SIZE - topLeft.y) + 'px;" />';
			}
		}

		if (selectedOption && selectedOption.value !== "none" && geoserverUrl && layerName) {
			html += '<img class="simple-map-overlay" alt="' + label + '" src="' + buildWmsUrl(geoserverUrl, layerName, {
				west: boundsNorthWest.lng,
				north: boundsNorthWest.lat,
				east: boundsSouthEast.lng,
				south: boundsSouthEast.lat
			}, width, height) + '" />';

			if (statusNode) {
				statusNode.textContent = "Displaying GeoServer WMS layer: " + layerName;
			}
		} else if (selectedOption && selectedOption.value !== "none") {
			if (statusNode) {
				statusNode.textContent = "Selected layer: " + label + ". Add a GeoServer WMS URL and layer name to display it.";
			}
		} else if (statusNode) {
			statusNode.textContent = "No overlay selected.";
		}

		html += '<div class="map-attribution">' + (basemapSelect.value === "satellite" ? "Tiles &copy; Esri" : "&copy; OpenStreetMap contributors") + '</div>';
		mapNode.innerHTML = html;

		var legendNode = getLegendNode(mapNode);
		var legendImage = legendNode.querySelector("img");

		if (shouldShowLegend && legendImage) {
			legendImage.src = buildLegendUrl(geoserverUrl, layerName, styleName);
			legendImage.alt = label + " legend";
			legendNode.hidden = false;
		} else {
			if (legendImage) {
				legendImage.removeAttribute("src");
			}

			legendNode.hidden = true;
		}
	}

	function initializeSimpleMap(shell) {
		var controls = shell.querySelectorAll(".basemap-select, .layer-select");

		controls.forEach(function (control) {
			control.addEventListener("change", function () {
				renderSimpleMap(shell);
			});
		});

		renderSimpleMap(shell);
		window.addEventListener("resize", function () {
			renderSimpleMap(shell);
		});
	}

	function renderOutputViewer(viewer) {
		var categorySelect = viewer.querySelector(".output-category-select");
		var panels = viewer.querySelectorAll(".output-panel");
		var selectedCategory = categorySelect ? categorySelect.value : "";

		panels.forEach(function (panel) {
			panel.hidden = panel.dataset.outputPanel !== selectedCategory;
		});
	}

	function initializeOutputViewer(viewer) {
		var categorySelect = viewer.querySelector(".output-category-select");

		if (categorySelect) {
			categorySelect.addEventListener("change", function () {
				renderOutputViewer(viewer);
			});
		}

		renderOutputViewer(viewer);
	}

	document.addEventListener("DOMContentLoaded", function () {
		document.querySelectorAll(".pollutant-map-shell").forEach(initializeSimpleMap);
		document.querySelectorAll(".output-viewer").forEach(initializeOutputViewer);
	});
}());
