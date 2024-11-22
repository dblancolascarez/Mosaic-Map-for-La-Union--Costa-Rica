// Crear el mapa
var map = L.map('map').setView([9.7489, -83.7534], 10); // Coordenadas centrales de Costa Rica

// Agregar la capa base de relieve sombreado de CartoDB
var baseLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 18
}).addTo(map);

// Cargar múltiples GeoJSON
var geojsonLayers = {
    "Capa 1 - Ríos": L.geoJSON(null, { style: { color: 'blue' } }).addTo(map),
    "Capa 2 - Carreteras": L.geoJSON(null, { style: { color: 'red' } }).addTo(map),
    "Capa 3 - Límites": L.geoJSON(null, { style: { color: 'green' } }).addTo(map),
    "Capa 3.2 - Límites distritos": L.geoJSON(null, { style: { color: 'green' } }).addTo(map),
    "Capa 4 - Poblados": L.geoJSON(null, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, { radius: 6, fillColor: 'blue', color: 'blue', weight: 1, opacity: 1, fillOpacity: 0.6 });
        }
    }).addTo(map),
    "Capa 5 - Hospitales": L.geoJSON(null, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, { radius: 6, fillColor: 'red', color: 'red', weight: 1, opacity: 1, fillOpacity: 0.6 });
        }
    }).addTo(map),
    "Capa 6 - Gasolineras": L.geoJSON(null, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, { radius: 6, fillColor: 'green', color: 'green', weight: 1, opacity: 1, fillOpacity: 0.6 });
        }
    }).addTo(map),
    "Capa 7 - Escuelas": L.geoJSON(null, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, { radius: 6, fillColor: 'purple', color: 'purple', weight: 1, opacity: 1, fillOpacity: 0.6 });
        }
    }).addTo(map),
    "Capa 8 - Clínicas": L.geoJSON(null, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, { radius: 6, fillColor: 'orange', color: 'orange', weight: 1, opacity: 1, fillOpacity: 0.6 });
        }
    }).addTo(map),
    "Capa 9 - Bancos": L.geoJSON(null, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, { radius: 6, fillColor: 'darkblue', color: 'darkblue', weight: 1, opacity: 1, fillOpacity: 0.6 });
        }
    }).addTo(map)
};

// Función para cargar GeoJSON desde un archivo
function loadGeoJSON(url, layer) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            layer.addData(data);
            if (layer === geojsonLayers["Capa 1 - Ríos"] || layer === geojsonLayers["Capa 4 - Poblados"] || layer === geojsonLayers["Capa 5 - Hospitales"] || layer === geojsonLayers["Capa 6 - Gasolineras"] || layer === geojsonLayers["Capa 7 - Escuelas"] || layer === geojsonLayers["Capa 8 - Clínicas"] || layer === geojsonLayers["Capa 9 - Bancos"]) {
                addLabels(layer, data); // Llamar a la función de etiquetas
            }
        })
        .catch(error => console.error('Error cargando GeoJSON:', error));
}

// Función para agregar etiquetas de texto a los puntos
function addLabels(layer, data) {
    data.features.forEach(feature => {
        var latlng;
        var label;

        // Para los puntos
        if (feature.geometry.type === "Point") {
            latlng = L.latLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]);

            // Verificar si es gasolinera o una estación con un nombre
            if (feature.properties.NOMBRE_REC) {
                label = feature.properties.NOMBRE_REC; // Nombre de gasolinera
            } else if (feature.properties.NOMBRE) {
                label = feature.properties.NOMBRE; // Nombre genérico para otros puntos
            } else if (feature.properties.BANCO) {
                label = feature.properties.BANCO; // Nombre del banco
            }

            // Crear un texto como etiqueta, con un pequeño desplazamiento para evitar solapamientos
            L.tooltip({
                permanent: true,
                className: "map-label",
                offset: [0, -10] // Ajustar el desplazamiento para evitar solapamientos
            })
            .setLatLng(latlng)
            .setContent(label)
            .addTo(layer);

        } else if (feature.geometry.type === "MultiLineString") {
            // Solo agregar un label para el primer punto del río
            var coordinates = feature.geometry.coordinates[0]; // Solo tomamos el primer segmento de la línea
            latlng = L.latLng(coordinates[0][1], coordinates[0][0]);
            label = feature.properties.NOMBRE || "Río desconocido"; // Asumir nombre del río

            // Crear un texto como etiqueta para los ríos
            L.tooltip({
                permanent: true,
                className: "map-label",
                offset: [0, -10]
            })
            .setLatLng(latlng)
            .setContent(label)
            .addTo(layer);
        }
    });
}

// Cargar los archivos GeoJSON
loadGeoJSON('FILES/Lineas/rios.geojson', geojsonLayers["Capa 1 - Ríos"]);
loadGeoJSON('FILES/Lineas/carreteras.geojson', geojsonLayers["Capa 2 - Carreteras"]);
loadGeoJSON('FILES/Lineas/canton_LaUnion.geojson', geojsonLayers["Capa 3 - Límites"]);
loadGeoJSON('FILES/Lineas/distritos.geojson', geojsonLayers["Capa 3.2 - Límites distritos"]);

loadGeoJSON('FILES/Puntos/poblados.geojson', geojsonLayers["Capa 4 - Poblados"]);
loadGeoJSON('FILES/Puntos/hospitales.geojson', geojsonLayers["Capa 5 - Hospitales"]);
loadGeoJSON('FILES/Puntos/gasolineras.geojson', geojsonLayers["Capa 6 - Gasolineras"]);
loadGeoJSON('FILES/Puntos/escuelas.geojson', geojsonLayers["Capa 7 - Escuelas"]);
loadGeoJSON('FILES/Puntos/clinicas.geojson', geojsonLayers["Capa 8 - Clínicas"]);
loadGeoJSON('FILES/Puntos/bancos.geojson', geojsonLayers["Capa 9 - Bancos"]);

// Función para actualizar la visibilidad según el zoom
function updateLayerVisibility() {
    var zoom = map.getZoom();
    
    // Puntos 
    if (zoom < 15) {
        map.removeLayer(geojsonLayers["Capa 4 - Poblados"]);
        map.removeLayer(geojsonLayers["Capa 5 - Hospitales"]);
        map.removeLayer(geojsonLayers["Capa 6 - Gasolineras"]);
        map.removeLayer(geojsonLayers["Capa 7 - Escuelas"]);
        map.removeLayer(geojsonLayers["Capa 8 - Clínicas"]);
        map.removeLayer(geojsonLayers["Capa 9 - Bancos"]);
    } else {
        map.addLayer(geojsonLayers["Capa 4 - Poblados"]);
        map.addLayer(geojsonLayers["Capa 5 - Hospitales"]);
        map.addLayer(geojsonLayers["Capa 6 - Gasolineras"]);
        map.addLayer(geojsonLayers["Capa 7 - Escuelas"]);
        map.addLayer(geojsonLayers["Capa 8 - Clínicas"]);
        map.addLayer(geojsonLayers["Capa 9 - Bancos"]);
    }

    // Carreteras
    if (zoom < 14) {
        map.removeLayer(geojsonLayers["Capa 2 - Carreteras"]);
    } else {
        map.addLayer(geojsonLayers["Capa 2 - Carreteras"]);
    }

    if (zoom < 13) {
        map.removeLayer(geojsonLayers["Capa 1 - Ríos"]);
    } else {
        map.addLayer(geojsonLayers["Capa 1 - Ríos"]);
    }

    // Límites
    if (zoom < 12) {
        map.removeLayer(geojsonLayers["Capa 3.2 - Límites distritos"]);
    } else {
        map.addLayer(geojsonLayers["Capa 3.2 - Límites distritos"]);
    }
}

// Crear un control personalizado para mostrar los colores asociados a cada capa
var infoControl = L.control({ position: 'topleft' });

infoControl.onAdd = function () {
    var div = L.DomUtil.create('div', 'info-control'); // Crear el contenedor del control
    div.innerHTML = `
        <strong>Colores de las capas:</strong><br>
        <span style="color: blue;">● Poblados</span><br>
        <span style="color: red;">● Hospitales</span><br>
        <span style="color: green;">● Gasolineras</span><br>
        <span style="color: purple;">● Escuelas</span><br>
        <span style="color: orange;">● Clínicas</span><br>
        <span style="color: darkblue;">● Bancos</span><br>
        <span style="color: blue;">● Ríos</span><br>
        <span style="color: red;">● Carreteras</span><br>
        <span style="color: green;">● Límites</span><br>
        <span style="color: green;">● Límites distritos</span>
    `;
    return div;
};

// Agregar el control al mapa
infoControl.addTo(map);

// Monitorear cambios de zoom
map.on('zoomend', updateLayerVisibility);

// Llamar la función para aplicar el zoom inicial
updateLayerVisibility();

// Agregar controles para alternar capas
L.control.layers(null, geojsonLayers).addTo(map);