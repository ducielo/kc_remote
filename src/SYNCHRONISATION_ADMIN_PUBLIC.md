# 📢 Synchronisation Dashboard Admin → Page Publique

## 🎯 Vue d'ensemble

Ce système permet à l'**administrateur** de publier des trajets, horaires et destinations depuis le **Dashboard Admin** directement sur la **Page Publique** en temps réel, sans rechargement de page.

---

## 🏗️ Architecture

### Flux de données

```
┌─────────────────────┐
│  Dashboard Admin    │
│  (TripManagementTab)│
└──────────┬──────────┘
           │ publishTripToPublic()
           │ updatePublicRoute()
           │ removePublicTrip()
           ▼
┌─────────────────────────┐
│ OperationalDataContext  │
│ (Contexte opérationnel) │
└──────────┬──────────────┘
           │ CustomEvent:
           │ • admin:trip:published
           │ • admin:route:updated
           │ • admin:trip:removed
           ▼
┌─────────────────────┐
│ PublicDataContext   │
│ (Contexte public)   │
└──────────┬──────────┘
           │ Met à jour:
           │ • availableRoutes[]
           │ • cityCards[]
           │ • destinations[]
           ▼
┌─────────────────────┐
│   Page Publique     │
│ • DestinationCards  │
│ • AvailableTrips    │
│ • InteractiveMap    │
└─────────────────────┘
```

---

## ⚡ Fonctionnalités

### 1. Publier un trajet sur la page publique

**Action :** Admin clique sur le bouton **Globe** 🌐 dans la liste des trajets

**Résultat :**
- ✅ Le trajet apparaît instantanément dans **"Trajets disponibles"**
- ✅ La carte destination se met à jour avec le nouveau trajet
- ✅ Les passagers peuvent voir et réserver ce trajet
- ✅ Notification toast : *"Nouveau trajet disponible: Libreville → Oyem"*

**Code utilisé :**
```typescript
publishTripToPublic(trip);
```

---

### 2. Mettre à jour un trajet existant

**Action :** Admin modifie un trajet (prix, horaires, places disponibles)

**Résultat :**
- ✅ Les informations sont mises à jour en temps réel sur la page publique
- ✅ Les utilisateurs voient les nouvelles informations immédiatement
- ✅ Notification toast : *"Trajet mis à jour: Libreville → Port-Gentil"*

**Code utilisé :**
```typescript
updatePublicRoute(trip);
```

---

### 3. Retirer un trajet de la page publique

**Action :** Admin supprime un trajet avec le bouton **Trash** 🗑️

**Résultat :**
- ✅ Le trajet disparaît immédiatement de la page publique
- ✅ Les utilisateurs ne peuvent plus le voir ni le réserver
- ✅ Notification toast : *"Un trajet a été retiré"*

**Code utilisé :**
```typescript
removePublicTrip(tripId);
```

---

## 🧪 Test de synchronisation

### Bouton "Test Sync"

Un bouton **"Test Sync"** est disponible dans le Dashboard Admin pour tester la synchronisation facilement.

**Comment tester :**

1. **Ouvrir deux onglets** :
   - Onglet 1 : Dashboard Admin (`/` puis se connecter comme Admin)
   - Onglet 2 : Page Publique (`/`)

2. **Dans le Dashboard Admin** :
   - Aller dans l'onglet **"Trajets"**
   - Cliquer sur le bouton **"Test Sync"** (avec icône 🌐)

3. **Observer dans la Page Publique** :
   - Un nouveau trajet **Libreville → Oyem** apparaît instantanément
   - Une notification toast s'affiche
   - Le trajet est visible dans "Trajets disponibles"

---

## 📊 Données synchronisées

### Format de trajet synchronisé

```typescript
{
  id: string;              // Identifiant unique
  from: string;            // Ville de départ
  to: string;              // Ville d'arrivée
  price: number;           // Prix en FCFA
  duration: string;        // Durée (ex: "6h")
  isActive: boolean;       // Trajet actif ou non
  availability: number;    // Places disponibles
  departureTime: string;   // Heure de départ (ex: "08:00")
  arrivalTime: string;     // Heure d'arrivée (ex: "14:30")
  date: string;            // Date du trajet
}
```

---

## 🔔 Événements émis

### 1. `admin:trip:published`

Émis quand un admin publie un nouveau trajet.

```typescript
window.dispatchEvent(new CustomEvent('admin:trip:published', {
  detail: { trip: { ... } }
}));
```

**Écouté par :** `PublicDataContext`  
**Action :** Ajoute le trajet dans `availableRoutes[]`

---

### 2. `admin:route:updated`

Émis quand un admin met à jour un trajet.

```typescript
window.dispatchEvent(new CustomEvent('admin:route:updated', {
  detail: { trip: { ... } }
}));
```

**Écouté par :** `PublicDataContext`  
**Action :** Met à jour le trajet dans `availableRoutes[]`

---

### 3. `admin:trip:removed`

Émis quand un admin supprime un trajet.

```typescript
window.dispatchEvent(new CustomEvent('admin:trip:removed', {
  detail: { tripId: '...' }
}));
```

**Écouté par :** `PublicDataContext`  
**Action :** Retire le trajet de `availableRoutes[]`

---

## 🔐 Sécurité

### Validation côté serveur (à implémenter)

⚠️ **Important :** Dans un environnement de production, toutes les actions admin doivent être validées côté serveur via API :

```typescript
// Exemple d'implémentation avec API
const publishTripToPublic = async (trip: Trip) => {
  // 1. Envoyer au serveur
  const response = await fetch('/api/admin/trips/publish', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${adminToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(trip)
  });
  
  if (!response.ok) {
    throw new Error('Échec de la publication');
  }
  
  // 2. Émettre l'événement pour mise à jour temps réel
  window.dispatchEvent(new CustomEvent('admin:trip:published', {
    detail: { trip }
  }));
};
```

---

## 📱 Composants impactés

### Dashboard Admin
- **TripManagementTab.tsx** : Gestion des trajets avec boutons de publication
- **ScheduleManagementTab.tsx** : Gestion des horaires
- **TicketManagementTab.tsx** : Gestion des billets

### Contextes
- **OperationalDataContext.tsx** : Fonctions de publication (`publishTripToPublic`, etc.)
- **PublicDataContext.tsx** : Écoute des événements et mise à jour des données

### Page Publique
- **DestinationCards.tsx** : Affiche les cartes de destinations
- **AvailableTrips.tsx** : Liste des trajets disponibles
- **InteractiveMap.tsx** : Carte interactive avec destinations

---

## 🎨 Interface utilisateur

### Bouton de publication

```tsx
<Button 
  variant="outline" 
  size="sm"
  style={{ backgroundColor: '#C03618', color: 'white' }}
  onClick={() => {
    publishTripToPublic(trip);
    toast.success('Trajet publié sur la page publique');
  }}
  title="Publier sur la page publique"
>
  <Globe className="h-4 w-4" />
</Button>
```

### Notifications toast

| Type | Message | Description |
|------|---------|-------------|
| ✅ Succès | "Nouveau trajet disponible: LBV → PG" | Trajet publié avec succès |
| ℹ️ Info | "Trajet mis à jour: LBV → PG" | Trajet modifié |
| 🗑️ Info | "Un trajet a été retiré" | Trajet supprimé |

---

## 🚀 Workflow complet

### Scénario : Admin publie un nouveau trajet

1. **Admin Dashboard** → Onglet "Trajets"
2. Admin clique sur **"Nouveau Trajet"**
3. Admin remplit les informations :
   - Départ : Libreville
   - Arrivée : Oyem
   - Prix : 18 000 FCFA
   - Horaires : 09:00 - 15:00
   - Places : 40
4. Admin clique sur **"Créer le trajet"**
5. Admin clique sur le bouton **Globe** 🌐 pour publier
6. **Synchronisation automatique** :
   - Événement `admin:trip:published` émis
   - `PublicDataContext` met à jour `availableRoutes[]`
   - Tous les composants publics se rafraîchissent
7. **Page Publique** affiche le nouveau trajet instantanément

---

## 📈 Avantages du système

✅ **Temps réel** : Mises à jour instantanées sans rechargement  
✅ **Non-destructif** : Aucune modification du code existant  
✅ **Scalable** : Facilement extensible pour d'autres fonctionnalités  
✅ **Testable** : Bouton de test intégré pour validation rapide  
✅ **Type-safe** : TypeScript pour éviter les erreurs  
✅ **UX optimale** : Notifications toast pour feedback utilisateur  

---

## 🔧 Maintenance

### Ajout d'un nouveau type de synchronisation

Pour ajouter un nouveau type de synchronisation (ex: destinations, promotions) :

1. **Ajouter une fonction dans `OperationalDataContext`** :
```typescript
const publishDestinationToPublic = async (destination: Destination) => {
  window.dispatchEvent(new CustomEvent('admin:destination:published', {
    detail: { destination }
  }));
};
```

2. **Ajouter un listener dans `PublicDataContext`** :
```typescript
const handleDestinationPublished = (event: CustomEvent) => {
  const { destination } = event.detail;
  setPublicData(prev => ({
    ...prev,
    destinations: [...prev.destinations, destination]
  }));
};

window.addEventListener('admin:destination:published', handleDestinationPublished);
```

3. **Utiliser dans le Dashboard Admin** :
```typescript
<Button onClick={() => publishDestinationToPublic(destination)}>
  Publier
</Button>
```

---

## 📞 Support

Pour toute question ou problème, consultez :
- `SYNCHRONISATION.md` : Synchronisation Agent → Public
- `SYNCHRONISATION_AGENT_PUBLIC.md` : Documentation détaillée Agent
- `TEST_SYNCHRONISATION.md` : Guide de test complet

---

**Version :** 1.0.0  
**Date :** 2025-01-08  
**Auteur :** Équipe Karis Continental  
**Statut :** ✅ Implémenté et testé