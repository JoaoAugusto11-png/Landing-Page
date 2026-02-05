const form = document.getElementById("lead-form");
const statusEl = document.getElementById("form-status");
const mapElement = document.getElementById("map");

const cityCoordinates = {
  AC: { lat: -9.9765, lng: -67.8243, label: "Rio Branco" },
  AL: { lat: -9.6498, lng: -35.7089, label: "Maceió" },
  AP: { lat: 0.0349, lng: -51.0694, label: "Macapá" },
  AM: { lat: -3.119, lng: -60.0217, label: "Manaus" },
  BA: { lat: -12.9714, lng: -38.5014, label: "Salvador" },
  CE: { lat: -3.7319, lng: -38.5267, label: "Fortaleza" },
  DF: { lat: -15.7939, lng: -47.8828, label: "Brasília" },
  ES: { lat: -20.2976, lng: -40.2958, label: "Vitória" },
  GO: { lat: -16.6869, lng: -49.2648, label: "Goiânia" },
  MA: { lat: -2.5307, lng: -44.3068, label: "São Luís" },
  MT: { lat: -15.6014, lng: -56.0979, label: "Cuiabá" },
  MS: { lat: -20.4697, lng: -54.6201, label: "Campo Grande" },
  MG: { lat: -19.9167, lng: -43.9345, label: "Belo Horizonte" },
  PA: { lat: -1.4558, lng: -48.4902, label: "Belém" },
  PB: { lat: -7.115, lng: -34.8641, label: "João Pessoa" },
  PR: { lat: -25.4284, lng: -49.2733, label: "Curitiba" },
  PE: { lat: -8.0476, lng: -34.877, label: "Recife" },
  PI: { lat: -5.0892, lng: -42.8019, label: "Teresina" },
  RJ: { lat: -22.9068, lng: -43.1729, label: "Rio de Janeiro" },
  RN: { lat: -5.7945, lng: -35.211, label: "Natal" },
  RS: { lat: -30.0346, lng: -51.2177, label: "Porto Alegre" },
  RO: { lat: -8.7619, lng: -63.9039, label: "Porto Velho" },
  RR: { lat: 2.8235, lng: -60.6758, label: "Boa Vista" },
  SC: { lat: -27.5954, lng: -48.548, label: "Florianópolis" },
  SP: { lat: -23.5505, lng: -46.6333, label: "São Paulo" },
  SE: { lat: -10.9472, lng: -37.0731, label: "Aracaju" },
  TO: { lat: -10.24, lng: -48.3558, label: "Palmas" },
};

const STORAGE_KEY = "semijoias_clientes";

const map = L.map(mapElement).setView([-14.235, -51.9253], 4);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

const markersLayer = L.layerGroup().addTo(map);

const loadLeads = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const saveLeads = (leads) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
};

const renderMarkers = () => {
  markersLayer.clearLayers();
  const leads = loadLeads();

  leads.forEach((lead) => {
    const coords = cityCoordinates[lead.estado];
    if (!coords) return;

    const marker = L.circleMarker([coords.lat, coords.lng], {
      radius: 7,
      color: "#b9865b",
      fillColor: "#b9865b",
      fillOpacity: 0.9,
    });

    marker.bindPopup(
      `<strong>${lead.nome}</strong><br />${lead.cidade} - ${lead.estado}<br />${lead.preferencia}`
    );

    marker.addTo(markersLayer);
  });
};

const showStatus = (message, isError = false) => {
  statusEl.textContent = message;
  statusEl.style.color = isError ? "#b42318" : "#9b6a41";
};

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const lead = {
    nome: formData.get("nome").trim(),
    email: formData.get("email").trim(),
    telefone: formData.get("telefone").trim(),
    cidade: formData.get("cidade").trim(),
    estado: formData.get("estado"),
    preferencia: formData.get("preferencia"),
    mensagem: formData.get("mensagem").trim(),
    createdAt: new Date().toISOString(),
  };

  if (!cityCoordinates[lead.estado]) {
    showStatus("Selecione um estado válido.", true);
    return;
  }

  const leads = loadLeads();
  leads.push(lead);
  saveLeads(leads);

  form.reset();
  showStatus("Cadastro enviado! Em breve entrarei em contato.");
  renderMarkers();
});

renderMarkers();
