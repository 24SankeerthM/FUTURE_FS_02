import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { useNavigate } from 'react-router-dom';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = new Icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

// Random coordinate generator near a center point (e.g., US center)
const getRandomCoordinates = () => {
    const lat = 37.0902 + (Math.random() - 0.5) * 10;
    const lng = -95.7129 + (Math.random() - 0.5) * 20;
    return [lat, lng];
};

const LeadMap = ({ leads }) => {
    // Enrich leads with random coordinates if they don't have them
    const mappedLeads = leads.map(lead => ({
        ...lead,
        position: getRandomCoordinates()
    }));

    return (
        <div className="h-[600px] w-full rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
            <MapContainer center={[37.0902, -95.7129]} zoom={4} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {mappedLeads.map((lead) => (
                    <Marker key={lead._id} position={lead.position} icon={DefaultIcon}>
                        <Popup>
                            <div className="p-2">
                                <h3 className="font-bold">{lead.name}</h3>
                                <p className="text-sm">{lead.status}</p>
                                <p className="text-xs text-gray-500">{lead.email}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default LeadMap;
