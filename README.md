# GIS Lab 2026 Air Pollution Web Map

This repository contains a static web page for the GIS Lab 2026 air pollution map project.

The current draft includes three pollutant categories:

- PM2.5
- PM10
- NO2

Each category contains reserved GeoServer image placeholders. The final GeoServer WMS or exported map image URLs can be added later in `index.html` through the empty `data-geoserver-url` fields.

## Project Structure

- `index.html`: Main web page.
- `assets/css/custom.css`: Custom styling for the project layout and GeoServer placeholders.
- `assets/`: HTML5 UP template styles, scripts, and web fonts.
- `images/`: Template background and image assets.
- `LICENSE.txt`: Original HTML5 UP template license.

## GeoServer Placeholder Fields

The map slots are marked with attributes such as:

```html
data-geoserver-url=""
data-layer="pm25_concentration"
data-style=""
data-format="image/png"
```

When the GeoServer layers are ready, replace the empty URL values or add image sources inside the placeholder blocks.

## Preview

Open `index.html` in a browser, or serve the folder with any local static file server.

## Credits

The page is based on the Massively template by HTML5 UP.
