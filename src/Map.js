import React, { useEffect, useRef, useState } from "react";

const Map = ({ accidents }) => {
    const [map, setMap] = useState(null);
    const [geocoder, setGeocoder] = useState(null);
    const markersRef = useRef([]);

    // 🔹 Típushoz tartozó színes ikonok
    const getMarkerIcon = (type) => {
        const colorMap = {
            "Ütközés": "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
            "Gázolás": "http://maps.google.com/mapfiles/ms/icons/orange-dot.png",
            "Koccanás": "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
            "Borulás": "http://maps.google.com/mapfiles/ms/icons/purple-dot.png",
            "Tömegbaleset": "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        };
        return colorMap[type] || "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
    };

    useEffect(() => {
        const initializeMap = () => {
            const mapInstance = new window.google.maps.Map(document.getElementById("map"), {
                zoom: 7,
                center: { lat: 47.4979, lng: 19.0402 }, // Budapest középen
            });
            setMap(mapInstance);
            setGeocoder(new window.google.maps.Geocoder());
        };

        if (!map) {
            initializeMap();
        }
    }, [map]);

    useEffect(() => {
        if (!map || !geocoder) return;

        // 🔹 Régi markerek eltávolítása
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        // 🔹 Új markerek hozzáadása
        accidents.forEach(accident => {
            if (accident.latitude && accident.longitude) {
                // 🔹 Van koordináta -> direkt marker
                const marker = new window.google.maps.Marker({
                    map: map,
                    position: {
                        lat: parseFloat(accident.latitude),
                        lng: parseFloat(accident.longitude)
                    },
                    title: accident.accident_type,
                    icon: getMarkerIcon(accident.accident_type),
                });

                const infoWindow = new window.google.maps.InfoWindow({
                    content: `
                        <div>
                            <h3>${accident.accident_type}</h3>
                            <p><strong>Helyszín:</strong> ${accident.location}, ${accident.city}</p>
                            <p><strong>Dátum:</strong> ${new Date(accident.date).toLocaleDateString()}</p>
                        </div>
                    `,
                });

                marker.addListener("click", () => {
                    infoWindow.open(map, marker);
                });

                markersRef.current.push(marker);
            } else {
                // 🔹 Nincs koordináta -> geocoder-rel lekérjük
                const address = `${accident.location}, ${accident.city}, Hungary`;

                geocoder.geocode({ address: address }, (results, status) => {
                    if (status === "OK" && results[0]) {
                        const marker = new window.google.maps.Marker({
                            map: map,
                            position: results[0].geometry.location,
                            title: accident.accident_type,
                            icon: getMarkerIcon(accident.accident_type),
                        });

                        const infoWindow = new window.google.maps.InfoWindow({
                            content: `
                                <div>
                                    <h3>${accident.accident_type}</h3>
                                    <p><strong>Helyszín:</strong> ${accident.location}, ${accident.city}</p>
                                    <p><strong>Dátum:</strong> ${new Date(accident.date).toLocaleDateString()}</p>
                                </div>
                            `,
                        });

                        marker.addListener("click", () => {
                            infoWindow.open(map, marker);
                        });

                        markersRef.current.push(marker);
                    } else {
                        console.error("❌ Geokódolási hiba:", status, "Cím:", address);
                    }
                });
            }
        });

    }, [map, geocoder, accidents]);

    return (
        <div style={{ position: 'relative' }}>
            {/* 🔹 Térkép */}
            <div id="map" style={{ width: "100%", height: "500px" }}></div>

            {/* 🔹 Jelmagyarázat */}
            <div
                style={{
                    position: "absolute",
                    top: 70,
                    left: 10,
                    backgroundColor: "white",
                    padding: "10px",
                    borderRadius: "8px",
                    boxShadow: "0 0 6px rgba(0,0,0,0.3)",
                    fontSize: "14px",
                    zIndex: 5,
                }}
            >
                <strong>📍 Jelmagyarázat:</strong>
                <ul style={{ paddingLeft: '15px', marginTop: '5px', marginBottom: '0' }}>
                    <li><span style={{ color: 'red' }}>●</span> Ütközés</li>
                    <li><span style={{ color: 'orange' }}>●</span> Gázolás</li>
                    <li><span style={{ color: 'yellow' }}>●</span> Koccanás</li>
                    <li><span style={{ color: 'purple' }}>●</span> Borulás</li>
                    <li><span style={{ color: 'blue' }}>●</span> Tömegbaleset</li>
                    <li><span style={{ color: 'green' }}>●</span> Egyéb</li>
                </ul>
            </div>
        </div>
    );
};

export default Map;
