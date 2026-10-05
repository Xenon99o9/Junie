const API_BASE_URL = "http://localhost:8000/api/"



// Récupérer des données (GET)
export async function apiFetchGet(endpoint: string) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`)

  if (!response.ok) {
    throw new Error("Erreur lors de la requête")
  }

  return await response.json()
}













// Envoyer de la donnée (POST)
export async function apiFetchPost(endpoint: string, data: any) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Erreur lors de l'envoi des données")
  }

  return await response.json()
}






// Mettre à jour une donnée précise (ex: apiFetchUpdate("cards", 5, {...}))
export async function apiFetchUpdate(resource: string, id: number, data: any) {
  // Construit automatiquement l'URL: http://localhost:8000/api/cards/5/
  const response = await fetch(`${API_BASE_URL}/${resource}/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`Erreur lors de la mise à jour de ${resource} (ID: ${id})`)
  }

  return await response.json()
}










// Supprimer une donnée précise (ex: apiFetchDelete("wires", 12))
export async function apiFetchDelete(resource: string, id: number) {
  const response = await fetch(`${API_BASE_URL}/${resource}/${id}/`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error(`Erreur lors de la suppression de ${resource} (ID: ${id})`)
  }

  if (response.status === 204) {
    return true
  }

  return await response.json()
}