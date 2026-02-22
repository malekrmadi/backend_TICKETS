const API_URL = "http://localhost:5000/api";

export async function processExcelFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/process`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Erreur inconnue" }));
    throw new Error(err.error || "Erreur serveur");
  }

  return response.json();
}
