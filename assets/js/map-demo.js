(function () {
	"use strict";

	var TILE_SIZE = 256;
	var BULGARIA_CENTER_LAT = 42.7661;
	var BULGARIA_CENTER_LNG = 25.2383;
	var BULGARIA_DEFAULT_ZOOM = 7;
	var SCALE_LINE_MAX_WIDTH = 120;

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

	function getMapGeometry(mapNode) {
		var rect = mapNode.getBoundingClientRect();
		var width = Math.max(rect.width, 320);
		var height = Math.max(rect.height, 280);
		var zoom = getNumber(mapNode.dataset.mapZoom, BULGARIA_DEFAULT_ZOOM);
		var centerLat = getNumber(mapNode.dataset.mapCenterLat, BULGARIA_CENTER_LAT);
		var centerLng = getNumber(mapNode.dataset.mapCenterLng, BULGARIA_CENTER_LNG);
		var center = lonLatToWorld(centerLng, centerLat, zoom);
		var topLeft = {
			x: center.x - width / 2,
			y: center.y - height / 2
		};
		var bottomRight = {
			x: center.x + width / 2,
			y: center.y + height / 2
		};

		return {
			width: width,
			height: height,
			zoom: zoom,
			centerLat: centerLat,
			centerLng: centerLng,
			topLeft: topLeft,
			bottomRight: bottomRight
		};
	}

	function getNiceDistance(maxDistance) {
		var distance = Math.max(maxDistance, 1);
		var base = Math.pow(10, Math.floor(Math.log10(distance)));
		var candidates = [1, 2, 5, 10];
		var niceDistance = base;

		candidates.forEach(function (candidate) {
			var value = candidate * base;

			if (value <= distance) {
				niceDistance = value;
			}
		});

		return niceDistance;
	}

	function getScaleLine(centerLat, zoom) {
		var metersPerPixel = 156543.03392 * Math.cos(centerLat * Math.PI / 180) / Math.pow(2, zoom);
		var distance = getNiceDistance(metersPerPixel * SCALE_LINE_MAX_WIDTH);
		var width = Math.max(Math.round(distance / metersPerPixel), 24);
		var label = distance >= 1000 ? (distance / 1000) + " km" : distance + " m";

		return {
			label: label,
			width: width
		};
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

		var geometry = getMapGeometry(mapNode);
		var startTileX = Math.floor(geometry.topLeft.x / TILE_SIZE);
		var endTileX = Math.floor(geometry.bottomRight.x / TILE_SIZE);
		var startTileY = Math.floor(geometry.topLeft.y / TILE_SIZE);
		var endTileY = Math.floor(geometry.bottomRight.y / TILE_SIZE);
		var maxTile = Math.pow(2, geometry.zoom) - 1;
		var selectedOption = layerSelect.options[layerSelect.selectedIndex];
		var label = selectedOption ? selectedOption.dataset.label || selectedOption.textContent : "";
		var layerName = selectedOption ? selectedOption.dataset.layer || "" : "";
		var geoserverUrl = selectedOption ? selectedOption.dataset.geoserverUrl || "" : "";
		var styleName = selectedOption ? selectedOption.dataset.style || "" : "";
		var shouldShowLegend = selectedOption && selectedOption.dataset.hasLegend === "true" && geoserverUrl && layerName;
		var boundsNorthWest = worldToLonLat(geometry.topLeft.x, geometry.topLeft.y, geometry.zoom);
		var boundsSouthEast = worldToLonLat(geometry.bottomRight.x, geometry.bottomRight.y, geometry.zoom);
		var html = "";
		var scaleLine = getScaleLine(geometry.centerLat, geometry.zoom);

		for (var tileX = startTileX; tileX <= endTileX; tileX += 1) {
			for (var tileY = startTileY; tileY <= endTileY; tileY += 1) {
				if (tileY < 0 || tileY > maxTile) {
					continue;
				}

				html += '<img class="simple-map-tile" alt="" src="' + getTileUrl(basemapSelect.value, tileX, tileY, geometry.zoom) + '" style="left:' + (tileX * TILE_SIZE - geometry.topLeft.x) + 'px; top:' + (tileY * TILE_SIZE - geometry.topLeft.y) + 'px;" />';
			}
		}

		if (selectedOption && selectedOption.value !== "none" && geoserverUrl && layerName) {
			html += '<img class="simple-map-overlay" alt="' + label + '" src="' + buildWmsUrl(geoserverUrl, layerName, {
				west: boundsNorthWest.lng,
				north: boundsNorthWest.lat,
				east: boundsSouthEast.lng,
				south: boundsSouthEast.lat
			}, geometry.width, geometry.height) + '" />';

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

		html += '<div class="map-control-stack">';
		html += '<button type="button" class="map-control-button" data-map-action="home" title="Home / Reset View" aria-label="Home / Reset View">&#8962;</button>';
		html += '<button type="button" class="map-control-button" data-map-action="fullscreen" title="Full Screen" aria-label="Full Screen">&#x26F6;</button>';
		html += '</div>';
		html += '<div class="map-mouse-position" aria-live="polite">Lat -, Lon -</div>';
		html += '<div class="map-scale-line"><span style="width:' + scaleLine.width + 'px"></span><strong>' + scaleLine.label + '</strong></div>';
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

	function updateMousePosition(shell, event) {
		var mapNode = shell.querySelector(".pollutant-map");
		var positionNode = mapNode ? mapNode.querySelector(".map-mouse-position") : null;

		if (!mapNode || !positionNode) {
			return;
		}

		var rect = mapNode.getBoundingClientRect();
		var geometry = getMapGeometry(mapNode);
		var point = worldToLonLat(
			geometry.topLeft.x + event.clientX - rect.left,
			geometry.topLeft.y + event.clientY - rect.top,
			geometry.zoom
		);

		positionNode.textContent = "Lat " + point.lat.toFixed(4) + ", Lon " + point.lng.toFixed(4);
	}

	function clearMousePosition(shell) {
		var positionNode = shell.querySelector(".map-mouse-position");

		if (positionNode) {
			positionNode.textContent = "Lat -, Lon -";
		}
	}

	function resetMapView(shell) {
		var mapNode = shell.querySelector(".pollutant-map");

		if (!mapNode) {
			return;
		}

		mapNode.dataset.mapCenterLat = mapNode.dataset.mapHomeCenterLat || String(BULGARIA_CENTER_LAT);
		mapNode.dataset.mapCenterLng = mapNode.dataset.mapHomeCenterLng || String(BULGARIA_CENTER_LNG);
		mapNode.dataset.mapZoom = mapNode.dataset.mapHomeZoom || String(BULGARIA_DEFAULT_ZOOM);
		renderSimpleMap(shell);
	}

	function toggleFullScreen(mapNode) {
		if (!mapNode) {
			return;
		}

		if (document.fullscreenElement === mapNode && document.exitFullscreen) {
			document.exitFullscreen();
		} else if (mapNode.requestFullscreen) {
			mapNode.requestFullscreen();
		}
	}

	function initializeSimpleMap(shell) {
		var mapNode = shell.querySelector(".pollutant-map");
		var controls = shell.querySelectorAll(".basemap-select, .layer-select");

		if (mapNode) {
			mapNode.dataset.mapHomeCenterLat = mapNode.dataset.mapHomeCenterLat || String(BULGARIA_CENTER_LAT);
			mapNode.dataset.mapHomeCenterLng = mapNode.dataset.mapHomeCenterLng || String(BULGARIA_CENTER_LNG);
			mapNode.dataset.mapHomeZoom = mapNode.dataset.mapHomeZoom || String(BULGARIA_DEFAULT_ZOOM);
			mapNode.dataset.mapCenterLat = mapNode.dataset.mapCenterLat || mapNode.dataset.mapHomeCenterLat;
			mapNode.dataset.mapCenterLng = mapNode.dataset.mapCenterLng || mapNode.dataset.mapHomeCenterLng;
			mapNode.dataset.mapZoom = mapNode.dataset.mapZoom || mapNode.dataset.mapHomeZoom;

			mapNode.addEventListener("mousemove", function (event) {
				updateMousePosition(shell, event);
			});
			mapNode.addEventListener("mouseleave", function () {
				clearMousePosition(shell);
			});
			mapNode.addEventListener("click", function (event) {
				var target = event.target;
				var button = target && target.closest ? target.closest("[data-map-action]") : null;

				if (!button || !mapNode.contains(button)) {
					return;
				}

				if (button.dataset.mapAction === "home") {
					resetMapView(shell);
				} else if (button.dataset.mapAction === "fullscreen") {
					toggleFullScreen(mapNode);
				}
			});
		}

		controls.forEach(function (control) {
			control.addEventListener("change", function () {
				renderSimpleMap(shell);
			});
		});

		renderSimpleMap(shell);
		window.addEventListener("resize", function () {
			renderSimpleMap(shell);
		});
		document.addEventListener("fullscreenchange", function () {
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
