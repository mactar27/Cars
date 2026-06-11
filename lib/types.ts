// Data model mirroring the relational schema: Categorie -> Marque -> Modele (Vehicule).
// Kept framework-agnostic so it maps cleanly onto the MySQL `car` database later.

export type CategorySlug =
  | "citadines"
  | "berlines"
  | "suv"
  | "utilitaires"

export type ServiceType = "location" | "vente"

export type VehicleCondition = "Neuf" | "Occasion"

export type FuelType = "Essence" | "Diesel" | "Électrique" | "Hybride"

export type Transmission = "Manuelle" | "Automatique"

export interface Category {
  slug: CategorySlug
  name: string
  description: string
}

// Rental-specific pricing (tarification à la journée)
export interface RentalInfo {
  pricePerDay: number // EUR / jour
  includedKm: number // kilométrage inclus par jour
  available: boolean
}

// Sale-specific pricing (prix de vente ferme)
export interface SaleInfo {
  price: number // EUR, prix ferme
  modelYear: number // année du modèle
  mileage: number // kilométrage au compteur
  condition: VehicleCondition
}

export interface Vehicle {
  id: string
  slug: string
  brand: string // Marque
  model: string // Modèle
  category: CategorySlug
  services: ServiceType[] // un véhicule peut être en location, en vente, ou les deux
  fuel: FuelType
  transmission: Transmission
  seats: number
  power: number // chevaux
  image: string
  gallery: string[]
  tagline: string
  rental?: RentalInfo
  sale?: SaleInfo
}
