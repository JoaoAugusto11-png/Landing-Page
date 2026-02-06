const form = document.getElementById("lead-form");
const statusEl = document.getElementById("form-status");

const STORAGE_KEY = "paris_folheados_leads";

const loadLeads = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const saveLeads = (leads) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
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
    interesse: formData.get("preferencia"),
    mensagem: formData.get("mensagem").trim(),
    createdAt: new Date().toISOString(),
  };

  const leads = loadLeads();
  leads.push(lead);
  saveLeads(leads);

  form.reset();
  showStatus("Solicitação enviada! Em breve entraremos em contato.");
});
