(function () {
	"use strict";

	var TILE_SIZE = 256;
	var BULGARIA_CENTER_LAT = 42.7661;
	var BULGARIA_CENTER_LNG = 25.2383;
	var BULGARIA_DEFAULT_ZOOM = 7;
	var SCALE_LINE_MAX_WIDTH = 120;
	var MIN_ZOOM = 5;
	var MAX_ZOOM = 12;
	var MAX_WEB_MERCATOR_LAT = 85.05112878;
	var SLD_LEGEND_CACHE = {};
	var LOCAL_SLD_LEGENDS = {
		"assets/legend/no2/2023_12.qml": {
			type: "gradient",
			title: "CAMS NO2 2023 12",
			startColor: "#000000",
			endColor: "#ffffff",
			startLabel: "1.12537 \u00b5g/m\u00b3",
			endLabel: "24.9375 \u00b5g/m\u00b3"
		},
		"assets/legend/no2/average_2023.qml": {
			type: "gradient",
			title: "Average NO2 2023",
			startColor: "#000000",
			endColor: "#ffffff",
			startLabel: "1.09367 \u00b5g/m\u00b3",
			endLabel: "14.0088 \u00b5g/m\u00b3"
		},
		"assets/legend/no2/concentration.sld": {
			type: "items",
			title: "NO2 Concentration 2023",
			items: [
				{ color: "#d9e6f7", label: "Level 1 (<=10 ug/m3)" },
				{ color: "#a9c4e8", label: "Level 2 (>10 and <=25 ug/m3)" }
			]
		},
		"assets/legend/no2/bulgria_no2_2021_2023_AMAC_map_geoserver.sld": {
			type: "items",
			title: "Bulgaria NO2 2021-2023 AMAC map",
			items: [
				{ color: "#3462cf", label: "<= -5,0000" },
				{ color: "#8b97cc", label: "-5,0000 - -2,0000" },
				{ color: "#dadbc5", label: "-2,0000 - 0,0000" },
				{ color: "#f7d59e", label: "0,0000 - 2,0000" },
				{ color: "#e08865", label: "2,0000 - 5,0000" },
				{ color: "#c44539", label: "> 5,0000" }
			]
		},
		"assets/legend/no2/bivariate.sld": {
			type: "symbol",
			title: "NO2 Population Bivariate",
			fill: "#f3a6b2",
			stroke: "#232323",
			label: "NO2 Population Bivariate"
		},
		"assets/legend/no2/chart.sld": {
			type: "items",
			title: "NO2 Population Chart",
			items: [
				{ color: "#ffffff", label: "Class 1 (\u226410 \u00b5g/m\u00b3)" },
				{ color: "#e0ffff", label: "Class 2 (10\u201325 \u00b5g/m\u00b3)" }
			]
		},
		"assets/legend/no2/zonal%20statistics.sld": {
			type: "pattern",
			title: "NO2 Built Area Land Cover Zonal Statistics",
			label: "Zonal statistics pattern fill"
		},
		"assets/legend/no2/zonal statistics.sld": {
			type: "pattern",
			title: "NO2 Built Area Land Cover Zonal Statistics",
			label: "Zonal statistics pattern fill"
		},
		"assets/legend/pm25/cams.qml": {
			type: "gradient",
			title: "CAMS PM2.5 2023 12",
			startColor: "#000000",
			endColor: "#ffffff",
			startLabel: "2.9502 \u00b5g/m\u00b3",
			endLabel: "40.2601 \u00b5g/m\u00b3"
		},
		"assets/legend/pm25/average_2023.qml": {
			type: "gradient",
			title: "Average PM2.5 2023",
			startColor: "#000000",
			endColor: "#ffffff",
			startLabel: "7.15668 \u00b5g/m\u00b3",
			endLabel: "17.5338 \u00b5g/m\u00b3"
		},
		"assets/legend/pm25/concentration.qml": {
			type: "items",
			title: "PM2.5 Concentration 2023",
			items: [
				{ color: "#d9e6f7", label: "Level 1 (<=5 ug/m3)" },
				{ color: "#a9c4e8", label: "Level 2 (>5 and <=10 ug/m3)" }
			]
		},
		"assets/legend/pm25/chart.sld": {
			type: "items",
			title: "PM2P5 POPULATION CHART",
			items: [
				{ color: "#ffffff", label: "Class 1 (\u22645 \u00b5g/m\u00b3)" },
				{ color: "#e0ffff", label: "Class 2 (>5 and \u226410 \u00b5g/m\u00b3)" }
			]
		},
		"assets/legend/pm25/zonal-statistics.sld": {
			type: "pattern",
			title: "PM2P5 Crops Land Cover Zonal Statistics",
			label: "Zonal statistics pattern fill"
		},
		"assets/legend/pm10/2023_12.qml": {
			type: "gradient",
			title: "CAMS PM10 2023 12",
			startColor: "#000000",
			endColor: "#ffffff",
			startLabel: "6.88499 \u00b5g/m\u00b3",
			endLabel: "36.1638 \u00b5g/m\u00b3"
		},
		"assets/legend/pm10/average_2023.qml": {
			type: "gradient",
			title: "Average PM10 2023",
			startColor: "#000000",
			endColor: "#ffffff",
			startLabel: "10.5651 \u00b5g/m\u00b3",
			endLabel: "23.0106 \u00b5g/m\u00b3"
		},
		"assets/legend/pm10/concentration.sld": {
			type: "items",
			title: "PM10 Concentration 2023",
			items: [
				{ color: "#d9e6f7", label: "Level 1 (<=15 ug/m3)" },
				{ color: "#a9c4e8", label: "Level 2 (>15 and <=31 ug/m3)" }
			]
		},
		"assets/legend/pm10/chart.sld": {
			type: "items",
			title: "PM10 Population Chart",
			items: [
				{ color: "#fffffe", label: "Class 1 (\u226415 \u00b5g/m\u00b3)" },
				{ color: "#ddfffd", label: "Class 2 (15\u201331 \u00b5g/m\u00b3)" }
			]
		},
		"assets/legend/pm10/zonal-statistics.sld": {
			type: "pattern",
			title: "PM10 Trees Land Cover Zonal Statistics",
			label: "Zonal statistics pattern fill"
		},
		"assets/legend/lcc/esri_10m_lcc_legend.qml": {
			type: "items",
			title: "Land Cover Change 2021-2023",
			items: [
				{ color: "#4d4d4d", label: "Water to Water" },
				{ color: "#358221", label: "Water to Trees" },
				{ color: "#87d19e", label: "Water to Flooded Vegetation" },
				{ color: "#ffdb5c", label: "Water to Crops" },
				{ color: "#ed022a", label: "Water to Built Area" },
				{ color: "#ede9e4", label: "Water to Bare Ground" },
				{ color: "#f2faff", label: "Water to Snow/Ice" },
				{ color: "#c8c8c8", label: "Water to Clouds" },
				{ color: "#c6ad8d", label: "Water to Rangeland" },
				{ color: "#1a5bab", label: "Trees to Water" },
				{ color: "#4d4d4d", label: "Trees to Trees" },
				{ color: "#87d19e", label: "Trees to Flooded Vegetation" },
				{ color: "#ffdb5c", label: "Trees to Crops" },
				{ color: "#ed022a", label: "Trees to Built Area" },
				{ color: "#ede9e4", label: "Trees to Bare Ground" },
				{ color: "#f2faff", label: "Trees to Snow/Ice" },
				{ color: "#c8c8c8", label: "Trees to Clouds" },
				{ color: "#c6ad8d", label: "Trees to Rangeland" },
				{ color: "#1a5bab", label: "Flooded Vegetation to Water" },
				{ color: "#358221", label: "Flooded Vegetation to Trees" },
				{ color: "#4d4d4d", label: "Flooded Vegetation to Flooded Vegetation" },
				{ color: "#ffdb5c", label: "Flooded Vegetation to Crops" },
				{ color: "#ed022a", label: "Flooded Vegetation to Built Area" },
				{ color: "#ede9e4", label: "Flooded Vegetation to Bare Ground" },
				{ color: "#f2faff", label: "Flooded Vegetation to Snow/Ice" },
				{ color: "#c8c8c8", label: "Flooded Vegetation to Clouds" },
				{ color: "#c6ad8d", label: "Flooded Vegetation to Rangeland" },
				{ color: "#1a5bab", label: "Crops to Water" },
				{ color: "#358221", label: "Crops to Trees" },
				{ color: "#87d19e", label: "Crops to Flooded Vegetation" },
				{ color: "#4d4d4d", label: "Crops to Crops" },
				{ color: "#ed022a", label: "Crops to Built Area" },
				{ color: "#ede9e4", label: "Crops to Bare Ground" },
				{ color: "#f2faff", label: "Crops to Snow/Ice" },
				{ color: "#c8c8c8", label: "Crops to Clouds" },
				{ color: "#c6ad8d", label: "Crops to Rangeland" },
				{ color: "#1a5bab", label: "Built Area to Water" },
				{ color: "#358221", label: "Built Area to Trees" },
				{ color: "#87d19e", label: "Built Area to Flooded Vegetation" },
				{ color: "#ffdb5c", label: "Built Area to Crops" },
				{ color: "#4d4d4d", label: "Built Area to Built Area" },
				{ color: "#ede9e4", label: "Built Area to Bare Ground" },
				{ color: "#f2faff", label: "Built Area to Snow/Ice" },
				{ color: "#c8c8c8", label: "Built Area to Clouds" },
				{ color: "#c6ad8d", label: "Built Area to Rangeland" },
				{ color: "#1a5bab", label: "Bare Ground to Water" },
				{ color: "#358221", label: "Bare Ground to Trees" },
				{ color: "#87d19e", label: "Bare Ground to Flooded Vegetation" },
				{ color: "#ffdb5c", label: "Bare Ground to Crops" },
				{ color: "#ed022a", label: "Bare Ground to Built Area" },
				{ color: "#4d4d4d", label: "Bare Ground to Bare Ground" },
				{ color: "#f2faff", label: "Bare Ground to Snow/Ice" },
				{ color: "#c8c8c8", label: "Bare Ground to Clouds" },
				{ color: "#c6ad8d", label: "Bare Ground to Rangeland" },
				{ color: "#1a5bab", label: "Snow/Ice to Water" },
				{ color: "#358221", label: "Snow/Ice to Trees" },
				{ color: "#87d19e", label: "Snow/Ice to Flooded Vegetation" },
				{ color: "#ffdb5c", label: "Snow/Ice to Crops" },
				{ color: "#ed022a", label: "Snow/Ice to Built Area" },
				{ color: "#ede9e4", label: "Snow/Ice to Bare Ground" },
				{ color: "#4d4d4d", label: "Snow/Ice to Snow/Ice" },
				{ color: "#c8c8c8", label: "Snow/Ice to Clouds" },
				{ color: "#c6ad8d", label: "Snow/Ice to Rangeland" },
				{ color: "#1a5bab", label: "Clouds to Water" },
				{ color: "#358221", label: "Clouds to Trees" },
				{ color: "#87d19e", label: "Clouds to Flooded Vegetation" },
				{ color: "#ffdb5c", label: "Clouds to Crops" },
				{ color: "#ed022a", label: "Clouds to Built Area" },
				{ color: "#ede9e4", label: "Clouds to Bare Ground" },
				{ color: "#f2faff", label: "Clouds to Snow/Ice" },
				{ color: "#4d4d4d", label: "Clouds to Clouds" },
				{ color: "#c6ad8d", label: "Clouds to Rangeland" },
				{ color: "#1a5bab", label: "Rangeland to Water" },
				{ color: "#358221", label: "Rangeland to Trees" },
				{ color: "#87d19e", label: "Rangeland to Flooded Vegetation" },
				{ color: "#ffdb5c", label: "Rangeland to Crops" },
				{ color: "#ed022a", label: "Rangeland to Built Area" },
				{ color: "#ede9e4", label: "Rangeland to Bare Ground" },
				{ color: "#f2faff", label: "Rangeland to Snow/Ice" },
				{ color: "#c8c8c8", label: "Rangeland to Clouds" },
				{ color: "#4d4d4d", label: "Rangeland to Rangeland" }
			]
		}
	};

	function getNumber(value, fallback) {
		var parsed = parseFloat(value);
		return Number.isFinite(parsed) ? parsed : fallback;
	}

	function clamp(value, min, max) {
		return Math.min(Math.max(value, min), max);
	}

	function normalizeLng(lng) {
		return ((lng + 180) % 360 + 360) % 360 - 180;
	}

	function lonLatToWorld(lng, lat, zoom) {
		var safeLat = clamp(lat, -MAX_WEB_MERCATOR_LAT, MAX_WEB_MERCATOR_LAT);
		var sinLat = Math.sin(safeLat * Math.PI / 180);
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
		var zoom = clamp(Math.round(getNumber(mapNode.dataset.mapZoom, BULGARIA_DEFAULT_ZOOM)), MIN_ZOOM, MAX_ZOOM);
		var centerLat = clamp(getNumber(mapNode.dataset.mapCenterLat, BULGARIA_CENTER_LAT), -MAX_WEB_MERCATOR_LAT, MAX_WEB_MERCATOR_LAT);
		var centerLng = normalizeLng(getNumber(mapNode.dataset.mapCenterLng, BULGARIA_CENTER_LNG));
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

	function escapeHtml(value) {
		return String(value || "")
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#39;");
	}

	function cleanColor(value, fallback) {
		return /^#[0-9a-f]{3,8}$/i.test(value || "") ? value : fallback;
	}

	function getElementsByLocalName(root, localName) {
		return Array.prototype.slice.call(root.getElementsByTagName("*")).filter(function (node) {
			return node.localName === localName;
		});
	}

	function getFirstTextByLocalName(root, localName) {
		var node = getElementsByLocalName(root, localName)[0];

		return node ? node.textContent.trim() : "";
	}

	function getSymbolParameter(root, parameterName) {
		var parameter = getElementsByLocalName(root, "SvgParameter").concat(getElementsByLocalName(root, "CssParameter")).filter(function (node) {
			return node.getAttribute("name") === parameterName;
		})[0];

		return parameter ? parameter.textContent.trim() : "";
	}

	function getOnlineResourceHref(root) {
		var resource = getElementsByLocalName(root, "OnlineResource")[0];

		if (!resource) {
			return "";
		}

		return resource.getAttribute("xlink:href") || resource.getAttributeNS("http://www.w3.org/1999/xlink", "href") || resource.getAttribute("href") || "";
	}

	function parseSldLegend(xmlText, fallbackTitle) {
		var parser = new DOMParser();
		var xml = parser.parseFromString(xmlText, "application/xml");
		var parserError = getElementsByLocalName(xml, "parsererror")[0];
		var colorEntries = getElementsByLocalName(xml, "ColorMapEntry");
		var title = getFirstTextByLocalName(xml, "Title") || fallbackTitle;
		var fillColor;
		var strokeColor;
		var graphicHref;
		var hasLabels;

		if (parserError) {
			return {
				type: "error",
				title: fallbackTitle,
				message: "Legend could not be read."
			};
		}

		if (colorEntries.length) {
			hasLabels = colorEntries.some(function (entry) {
				return entry.getAttribute("label");
			});

			if (colorEntries.length === 2 && !hasLabels) {
				return {
					type: "gradient",
					title: title,
					startColor: cleanColor(colorEntries[0].getAttribute("color"), "#000000"),
					endColor: cleanColor(colorEntries[1].getAttribute("color"), "#ffffff"),
					startLabel: colorEntries[0].getAttribute("quantity") || "",
					endLabel: colorEntries[1].getAttribute("quantity") || ""
				};
			}

			return {
				type: "items",
				title: title,
				items: colorEntries.map(function (entry) {
					return {
						color: cleanColor(entry.getAttribute("color"), "#cccccc"),
						label: entry.getAttribute("label") || entry.getAttribute("quantity") || "Value"
					};
				})
			};
		}

		fillColor = getSymbolParameter(xml, "fill");
		strokeColor = getSymbolParameter(xml, "stroke");

		if (fillColor) {
			return {
				type: "symbol",
				title: title,
				fill: cleanColor(fillColor, "#cccccc"),
				stroke: cleanColor(strokeColor, "#232323"),
				label: fallbackTitle
			};
		}

		graphicHref = getOnlineResourceHref(xml);

		if (graphicHref) {
			return {
				type: "pattern",
				title: title,
				label: "Pattern fill: " + graphicHref
			};
		}

		return {
			type: "error",
			title: fallbackTitle,
			message: "No visible legend rule was found."
		};
	}

	function buildSldLegendHtml(model) {
		var html = '<div class="sld-legend"><strong class="sld-legend-title">' + escapeHtml(model.title) + "</strong>";

		if (model.type === "gradient") {
			html += '<span class="sld-gradient" style="background:linear-gradient(90deg, ' + model.startColor + ', ' + model.endColor + ')"></span>';
			html += '<span class="sld-gradient-labels"><em>' + escapeHtml(model.startLabel) + '</em><em>' + escapeHtml(model.endLabel) + "</em></span>";
		} else if (model.type === "items") {
			html += '<ul class="sld-legend-items">';
			model.items.forEach(function (item) {
				html += '<li><span class="sld-swatch" style="background:' + item.color + '"></span><span>' + escapeHtml(item.label) + "</span></li>";
			});
			html += "</ul>";
		} else if (model.type === "symbol") {
			html += '<ul class="sld-legend-items"><li><span class="sld-swatch" style="background:' + model.fill + '; border-color:' + model.stroke + '"></span><span>' + escapeHtml(model.label) + "</span></li></ul>";
		} else if (model.type === "pattern") {
			html += '<ul class="sld-legend-items"><li><span class="sld-swatch sld-pattern-swatch"></span><span>' + escapeHtml(model.label) + "</span></li></ul>";
		} else {
			html += '<p class="sld-legend-note">' + escapeHtml(model.message) + "</p>";
		}

		return html + "</div>";
	}

	function renderSldLegend(legendNode, sldUrl, label) {
		var token = String(Date.now()) + String(Math.random());
		var localModel = LOCAL_SLD_LEGENDS[sldUrl] || LOCAL_SLD_LEGENDS[decodeURIComponent(sldUrl || "")];

		legendNode.dataset.legendToken = token;
		legendNode.classList.remove("map-legend-large");
		legendNode.hidden = false;

		if (localModel) {
			legendNode.innerHTML = buildSldLegendHtml(localModel);
			return;
		}

		legendNode.innerHTML = '<div class="sld-legend"><strong class="sld-legend-title">' + escapeHtml(label) + '</strong><p class="sld-legend-note">Loading legend...</p></div>';
		(SLD_LEGEND_CACHE[sldUrl] || (SLD_LEGEND_CACHE[sldUrl] = fetch(sldUrl).then(function (response) {
			if (!response.ok) {
				throw new Error("Legend file not found");
			}

			return response.text();
		}).then(function (text) {
			return parseSldLegend(text, label);
		}).catch(function () {
			return {
				type: "error",
				title: label,
				message: "Legend file could not be loaded."
			};
		}))).then(function (model) {
			if (legendNode.dataset.legendToken !== token) {
				return;
			}

			legendNode.innerHTML = buildSldLegendHtml(model);
			legendNode.hidden = false;
		});
	}

	function renderGeoServerLegend(legendNode, geoserverUrl, layerName, styleName, label) {
		legendNode.classList.remove("map-legend-large");
		legendNode.hidden = false;
		legendNode.innerHTML = '<img alt="' + escapeHtml(label) + ' legend" src="' + escapeHtml(buildLegendUrl(geoserverUrl, layerName, styleName)) + '" />';
	}

	function renderImageLegend(legendNode, imageUrl, label) {
		legendNode.classList.add("map-legend-large");
		legendNode.hidden = false;
		legendNode.innerHTML = '<img class="map-legend-image map-legend-image-large" alt="' + escapeHtml(label) + ' legend" src="' + escapeHtml(imageUrl) + '" />';
	}

	function updateLoadingProgress(mapNode, percent) {
		var loadingNode = mapNode.querySelector(".map-loading");
		var labelNode = loadingNode ? loadingNode.querySelector("[data-loading-label]") : null;
		var barNode = loadingNode ? loadingNode.querySelector("[data-loading-bar]") : null;

		if (!loadingNode) {
			return;
		}

		loadingNode.hidden = false;

		if (labelNode) {
			labelNode.textContent = "Loading " + percent + "%";
		}

		if (barNode) {
			barNode.style.width = percent + "%";
		}
	}

	function trackMapImageLoading(mapNode, statusNode, layerName) {
		var loadingNode = mapNode.querySelector(".map-loading");
		var images = Array.prototype.slice.call(mapNode.querySelectorAll("img")).filter(function (image) {
			return image.getAttribute("src");
		});
		var token = String(Date.now()) + String(Math.random());
		var loaded = 0;

		if (!loadingNode || !images.length) {
			return;
		}

		mapNode.dataset.loadingToken = token;
		updateLoadingProgress(mapNode, 0);

		function markComplete() {
			var percent;

			if (mapNode.dataset.loadingToken !== token) {
				return;
			}

			loaded += 1;
			percent = Math.round(loaded / images.length * 100);
			updateLoadingProgress(mapNode, percent);

			if (statusNode && layerName) {
				statusNode.textContent = percent < 100
					? "Loading GeoServer WMS layer: " + layerName + " (" + percent + "%)"
					: "Displaying GeoServer WMS layer: " + layerName;
			}

			if (loaded >= images.length) {
				window.setTimeout(function () {
					if (mapNode.dataset.loadingToken === token) {
						loadingNode.hidden = true;
					}
				}, 350);
			}
		}

		images.forEach(function (image) {
			if (image.complete) {
				markComplete();
				return;
			}

			image.addEventListener("load", markComplete, { once: true });
			image.addEventListener("error", markComplete, { once: true });
		});
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
		var legendImageUrl = selectedOption ? selectedOption.dataset.legendImage || "" : "";
		var legendSldUrl = selectedOption ? selectedOption.dataset.legendSld || "" : "";
		var isPanning = mapNode._panState && mapNode._panState.active;
		var shouldShowImageLegend = selectedOption && !isPanning && legendImageUrl;
		var shouldShowSldLegend = selectedOption && !isPanning && legendSldUrl;
		var shouldShowLegend = selectedOption && !isPanning && selectedOption.dataset.hasLegend === "true" && geoserverUrl && layerName;
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

		if (selectedOption && selectedOption.value !== "none" && geoserverUrl && layerName && !isPanning) {
			html += '<img class="simple-map-overlay" alt="' + label + '" src="' + buildWmsUrl(geoserverUrl, layerName, {
				west: boundsNorthWest.lng,
				north: boundsNorthWest.lat,
				east: boundsSouthEast.lng,
				south: boundsSouthEast.lat
			}, geometry.width, geometry.height) + '" />';

			if (statusNode) {
				statusNode.textContent = "Loading GeoServer WMS layer: " + layerName + " (0%)";
			}
		} else if (selectedOption && selectedOption.value !== "none" && geoserverUrl && layerName && isPanning) {
			if (statusNode) {
				statusNode.textContent = "Release the map to reload GeoServer WMS layer: " + layerName;
			}
		} else if (selectedOption && selectedOption.value !== "none") {
			if (statusNode) {
				statusNode.textContent = "Selected layer: " + label + ". Add a GeoServer WMS URL and layer name to display it.";
			}
		} else if (statusNode) {
			statusNode.textContent = mapNode.dataset.emptyStatus || "No overlay selected.";
		}

		html += '<div class="map-control-stack">';
		html += '<button type="button" class="map-control-button" data-map-action="home" title="Home / Reset View" aria-label="Home / Reset View">&#8962;</button>';
		html += '<button type="button" class="map-control-button" data-map-action="fullscreen" title="Full Screen" aria-label="Full Screen">&#x26F6;</button>';
		html += '</div>';
		html += '<div class="map-mouse-position" aria-live="polite">Lat -, Lon -</div>';
		html += '<div class="map-scale-line"><span style="width:' + scaleLine.width + 'px"></span><strong>' + scaleLine.label + '</strong></div>';
		html += '<div class="map-attribution">' + (basemapSelect.value === "satellite" ? "Tiles &copy; Esri" : "&copy; OpenStreetMap contributors") + '</div>';
		html += '<div class="map-loading" hidden><span data-loading-label>Loading 0%</span><i><b data-loading-bar style="width:0%"></b></i></div>';
		mapNode.innerHTML = html;

		var legendNode = getLegendNode(mapNode);

		if (shouldShowImageLegend) {
			renderImageLegend(legendNode, legendImageUrl, label);
		} else if (shouldShowSldLegend) {
			renderSldLegend(legendNode, legendSldUrl, label);
		} else if (shouldShowLegend) {
			renderGeoServerLegend(legendNode, geoserverUrl, layerName, styleName, label);
		} else {
			legendNode.dataset.legendToken = "";
			legendNode.classList.remove("map-legend-large");
			legendNode.innerHTML = '<img alt="Selected layer legend" />';
			legendNode.hidden = true;
		}

		trackMapImageLoading(mapNode, statusNode, isPanning ? "" : layerName);
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

	function scheduleMapRender(shell) {
		var mapNode = shell.querySelector(".pollutant-map");

		if (!mapNode || mapNode._renderFrame) {
			return;
		}

		mapNode._renderFrame = window.requestAnimationFrame(function () {
			mapNode._renderFrame = null;
			renderSimpleMap(shell);
		});
	}

	function updateMapCenterFromWorld(mapNode, worldPoint, zoom) {
		var scale = TILE_SIZE * Math.pow(2, zoom);
		var safeWorldY = clamp(worldPoint.y, 0, scale);
		var center = worldToLonLat(worldPoint.x, safeWorldY, zoom);

		mapNode.dataset.mapCenterLat = String(clamp(center.lat, -MAX_WEB_MERCATOR_LAT, MAX_WEB_MERCATOR_LAT));
		mapNode.dataset.mapCenterLng = String(normalizeLng(center.lng));
		mapNode.dataset.mapZoom = String(zoom);
	}

	function isMapControlTarget(target) {
		return target && target.closest && target.closest(".map-control-stack, .map-legend, .map-loading");
	}

	function startMapPan(shell, event) {
		var mapNode = shell.querySelector(".pollutant-map");
		var geometry;

		if (!mapNode || event.button !== 0 || isMapControlTarget(event.target)) {
			return;
		}

		geometry = getMapGeometry(mapNode);
		mapNode._panState = {
			active: true,
			startX: event.clientX,
			startY: event.clientY,
			startCenterWorld: lonLatToWorld(geometry.centerLng, geometry.centerLat, geometry.zoom),
			zoom: geometry.zoom
		};
		mapNode.classList.add("is-panning");
		event.preventDefault();
	}

	function continueMapPan(shell, event) {
		var mapNode = shell.querySelector(".pollutant-map");
		var state = mapNode ? mapNode._panState : null;
		var deltaX;
		var deltaY;

		if (!mapNode || !state || !state.active) {
			return;
		}

		deltaX = event.clientX - state.startX;
		deltaY = event.clientY - state.startY;
		updateMapCenterFromWorld(mapNode, {
			x: state.startCenterWorld.x - deltaX,
			y: state.startCenterWorld.y - deltaY
		}, state.zoom);
		scheduleMapRender(shell);
		event.preventDefault();
	}

	function finishMapPan(shell) {
		var mapNode = shell.querySelector(".pollutant-map");
		var wasActive = mapNode && mapNode._panState && mapNode._panState.active;

		if (!mapNode || !mapNode._panState) {
			return;
		}

		mapNode._panState.active = false;
		mapNode.classList.remove("is-panning");

		if (wasActive) {
			if (mapNode._renderFrame) {
				window.cancelAnimationFrame(mapNode._renderFrame);
				mapNode._renderFrame = null;
			}

			renderSimpleMap(shell);
		}
	}

	function zoomMapWithWheel(shell, event) {
		var mapNode = shell.querySelector(".pollutant-map");
		var geometry;
		var rect;
		var cursorX;
		var cursorY;
		var nextZoom;
		var cursorLngLat;
		var cursorWorld;

		if (!mapNode || !event.ctrlKey) {
			return;
		}

		event.preventDefault();
		geometry = getMapGeometry(mapNode);
		rect = mapNode.getBoundingClientRect();
		cursorX = clamp(event.clientX - rect.left, 0, geometry.width);
		cursorY = clamp(event.clientY - rect.top, 0, geometry.height);
		nextZoom = clamp(geometry.zoom + (event.deltaY < 0 ? 1 : -1), MIN_ZOOM, MAX_ZOOM);

		if (nextZoom === geometry.zoom) {
			return;
		}

		cursorLngLat = worldToLonLat(
			geometry.topLeft.x + cursorX,
			geometry.topLeft.y + cursorY,
			geometry.zoom
		);
		cursorWorld = lonLatToWorld(cursorLngLat.lng, cursorLngLat.lat, nextZoom);
		updateMapCenterFromWorld(mapNode, {
			x: cursorWorld.x - cursorX + geometry.width / 2,
			y: cursorWorld.y - cursorY + geometry.height / 2
		}, nextZoom);
		renderSimpleMap(shell);
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
			mapNode.dataset.mapHomeCenterLat = mapNode.dataset.mapHomeCenterLat || mapNode.dataset.mapCenterLat || String(BULGARIA_CENTER_LAT);
			mapNode.dataset.mapHomeCenterLng = mapNode.dataset.mapHomeCenterLng || mapNode.dataset.mapCenterLng || String(BULGARIA_CENTER_LNG);
			mapNode.dataset.mapHomeZoom = mapNode.dataset.mapHomeZoom || mapNode.dataset.mapZoom || String(BULGARIA_DEFAULT_ZOOM);
			mapNode.dataset.mapCenterLat = mapNode.dataset.mapCenterLat || mapNode.dataset.mapHomeCenterLat;
			mapNode.dataset.mapCenterLng = mapNode.dataset.mapCenterLng || mapNode.dataset.mapHomeCenterLng;
			mapNode.dataset.mapZoom = mapNode.dataset.mapZoom || mapNode.dataset.mapHomeZoom;

			mapNode.addEventListener("mousedown", function (event) {
				startMapPan(shell, event);
			});
			mapNode.addEventListener("mousemove", function (event) {
				if (mapNode._panState && mapNode._panState.active) {
					return;
				}

				updateMousePosition(shell, event);
			});
			mapNode.addEventListener("mouseleave", function () {
				if (!mapNode._panState || !mapNode._panState.active) {
					clearMousePosition(shell);
				}
			});
			mapNode.addEventListener("wheel", function (event) {
				zoomMapWithWheel(shell, event);
			}, { passive: false });
			document.addEventListener("mousemove", function (event) {
				continueMapPan(shell, event);
			});
			document.addEventListener("mouseup", function () {
				finishMapPan(shell);
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
