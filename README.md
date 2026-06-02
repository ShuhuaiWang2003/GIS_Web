# GIS Lab 2026 Pollutant Layer Viewer

This repository contains a static web page for the GIS Lab 2026 map project.

The page is organized into three first-level pollutant categories:

- NO2
- PM2.5
- PM10

Each pollutant category contains three thematic map views:

- Pollution
- Land Cover
- Population

The maps use Leaflet with selectable OSM or satellite basemaps. GeoServer WMS layer placeholders are prepared in the HTML through `data-geoserver-url` and `data-layer` attributes.

## Displayed Outputs

The page displays selected chart and table outputs directly in the page. It does not include download links for the supporting files.

- `assets/data/landcover/zonal-statistics-lcc.png`: Land cover chart.
- `assets/data/landcover/bulgaria-2021-2023.xlsx`: Source workbook used to create the displayed land cover tables.
- `assets/data/population/pm10-population-exposure.png`: PM10 population exposure chart.

## Project Structure

- `index.html`: Main web page.
- `assets/css/custom.css`: Custom layout and map/card/table styling.
- `assets/js/map-demo.js`: Leaflet setup for the map cards.
- `assets/data/`: Supporting image and spreadsheet files used for page display.
- `LICENSE.txt`: Original HTML5 UP template license.

## Credits

The page is based on the Massively template by HTML5 UP.
