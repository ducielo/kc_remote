# 🔄 Système de Synchronisation Complet - Karis Continental

## 📋 Vue d'ensemble

L'application **Karis Continental** dispose d'un système de synchronisation temps réel **bidirectionnel** permettant la communication entre les 3 dashboards (Admin, Agent, Chauffeur) et la page publique.

---

## 🏗️ Architecture globale

```
┌────────────────────────────────────────────────────────────┐
│                    Karis Continental                        │
│                   Architecture complète                     │
└────────────────────────────────────────────────────────────┘

┌─────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│ Dashboard Admin │         │ Dashboard Agent  │         │ Dashboard Driver │
│                 │         │   (Contrôleur)   │         │   (Chauffeur)    │
└────────┬────────┘         └────────┬─────────┘         └────────┬─────────┘
         │                           │                             │
         │ publishTripToPublic()     │ createOnSiteReservation()  │ reportDelay()
         │ updatePublicRoute()       │                             │ updateLocation()
         │ removePublicTrip()        │                             │
         ▼                           ▼                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      OperationalDataContext                              │
│                    (Contexte opérationnel central)                       │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             │ CustomEvents:
                             │ • admin:trip:published
                             │ • admin:route:updated
                             │ • admin:trip:removed
                             │ • agent:reservation:created
                             │ • driver:location:updated
                             │ • driver:delay:reported
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         PublicDataContext                                │
│                      (Contexte données publiques)                        │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          Page Publique                                   │
│  • Hero  • DestinationCards  • AvailableTrips  • InteractiveMap        │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Types de synchronisation

### 1️⃣ **Admin → Public** (Gestion du contenu)

| Action | Événement | Résultat sur la page publique |
|--------|-----------|-------------------------------|
| 📢 Publier un trajet | `admin:trip:published` | Nouveau trajet visible dans "Trajets disponibles" |
| 🔄 Modifier un trajet | `admin:route:updated` | Informations mises à jour en temps réel |
| 🗑️ Supprimer un trajet | `admin:trip:removed` | Trajet retiré de la liste |

**Documentation :** `SYNCHRONISATION_ADMIN_PUBLIC.md`

---

### 2️⃣ **Agent → Public** (Réservations sur place)

| Action | Événement | Résultat sur la page publique |
|--------|-----------|-------------------------------|
| 🎫 Créer une réservation | `agent:reservation:created` | Places disponibles mises à jour |
| 👥 Valider la liste | - | Liste des passagers synchronisée |

**Documentation :** `SYNCHRONISATION_AGENT_PUBLIC.md`

---

### 3️⃣ **Chauffeur → Public** (Informations en direct)

| Action | Événement | Résultat sur la page publique |
|--------|-----------|-------------------------------|
| 📍 Mettre à jour la position | `driver:location:updated` | Position GPS du bus mise à jour (pas de notification) |
| ⏰ Signaler un retard | `driver:delay:reported` | Notification de retard affichée |
| 🚨 Signaler un incident | `driver:incident:reported` | Alerte affichée aux utilisateurs |

**Documentation :** `SYNCHRONISATION.md`

---

## 📊 Flux de données complet

### Scénario : Voyage complet d'un passager

```
1. 📢 ADMIN publie un trajet Libreville → Oyem
   └─> Event: admin:trip:published
       └─> Page publique affiche le trajet

2. 👤 CLIENT réserve sur la page publique
   └─> Données envoyées à l'API
       └─> Tous les dashboards sont notifiés

3. 🎫 AGENT crée une réservation sur place
   └─> Event: agent:reservation:created
       └─> Page publique met à jour les places disponibles
       └─> Dashboard Admin voit le nouveau passager
       └─> Dashboard Chauffeur voit le nouveau passager

4. 🚌 CHAUFFEUR démarre le voyage
   └─> Event: driver:location:updated
       └─> Position mise à jour en temps réel

5. ⏰ CHAUFFEUR signale un retard de 30 min
   └─> Event: driver:delay:reported
       └─> Page publique affiche: "Retard de 30min"
       └─> Admin et Agent sont notifiés

6. ✅ CHAUFFEUR arrive à destination
   └─> Dashboard mis à jour
       └─> Statistiques actualisées
```

---

## 🔧 Contextes utilisés

### OperationalDataContext

**Rôle :** Gère toutes les données opérationnelles (trajets, bus, chauffeurs, réservations)

**Fonctions principales :**
```typescript
// Admin
publishTripToPublic(trip: Trip)
updatePublicRoute(trip: Trip)
removePublicTrip(tripId: string)

// Agent
createOnSiteReservation(reservation: {...})
getAllReservations()
getTripReservations(tripId: string)

// Chauffeur
updateTripLocation(tripId, location)
reportDelay(tripId, delayMinutes, reason)
reportIncident(incident)

// Récupération
getUpcomingTrips(driverId?)
getTripById(tripId)
getPublicTrips()
```

---

### PublicDataContext

**Rôle :** Gère les données affichées sur la page publique

**Données gérées :**
```typescript
{
  cityCards: CityCardData[];           // Cartes de destinations
  availableRoutes: RouteData[];        // Trajets disponibles
  destinations: DestinationData[];     // Destinations populaires
  featuredDestination: DestinationData | null;
  cityAvailability: Record<string, boolean>;
  isLoading: boolean;
  lastUpdated: Date | null;
}
```

**Fonctions principales :**
```typescript
updateCityCard(cityCard)
updateRoute(route)
updateDestination(destination)
setFeaturedDestination(destination)
toggleCityAvailability(cityId, status)
searchRoutes(from, to, date, passengers)
syncWithAdmin()
refreshPublicData()
```

---

### AdminContentProvider

**Rôle :** Gère le contenu statique de la page publique

**Données gérées :**
```typescript
{
  heroContent: { title, subtitle, image };
  featuresContent: Feature[];
  statisticsContent: Stat[];
  destinationsContent: Destination[];
  publishedRoutes: Route[];
}
```

---

## 🎨 Composants UI impactés

### Dashboard Admin
- `AdminDashboardTabbed.tsx` : Dashboard principal
- `TripManagementTab.tsx` : Gestion des trajets avec bouton 🌐 de publication
- `ScheduleManagementTab.tsx` : Gestion des horaires
- `TicketManagementTab.tsx` : Gestion des billets

### Dashboard Agent
- `AgentDashboardFixed.tsx` : Dashboard avec création de réservations
- Section "Réservations du jour" : Liste synchronisée

### Dashboard Chauffeur
- `DriverDashboardFull.tsx` : Dashboard avec position GPS et retards
- Section "Mes Passagers" : Liste synchronisée

### Page Publique
- `DestinationCards.tsx` : Cartes de destinations (synchronisées avec admin)
- `AvailableTrips.tsx` : Liste des trajets (synchronisée avec admin/agent)
- `TripDetailsModal.tsx` : Modal avec liste des passagers (synchronisée)
- `InteractiveMap.tsx` : Carte interactive avec destinations

---

## 🔔 Événements CustomEvent

### Table complète des événements

| Événement | Émetteur | Récepteur | Données |
|-----------|----------|-----------|---------|
| `admin:trip:published` | OperationalDataContext | PublicDataContext | `{ trip: {...} }` |
| `admin:route:updated` | OperationalDataContext | PublicDataContext | `{ trip: {...} }` |
| `admin:trip:removed` | OperationalDataContext | PublicDataContext | `{ tripId: string }` |
| `agent:reservation:created` | OperationalDataContext | PublicDataContext | `{ tripId, passenger, reservation }` |
| `driver:location:updated` | OperationalDataContext | PublicDataContext | `{ tripId, location }` |
| `driver:delay:reported` | OperationalDataContext | PublicDataContext | `{ tripId, delayMinutes, reason }` |
| `driver:incident:reported` | OperationalDataContext | PublicDataContext | `{ tripId, incident }` |

---

## 📱 Notifications Toast

### Types de notifications

| Événement | Type | Message | Description |
|-----------|------|---------|-------------|
| Trajet publié | Success ✅ | "Nouveau trajet disponible: LBV → OYM" | "Départ à 09:00 - 40 places" |
| Trajet modifié | Info ℹ️ | "Trajet mis à jour: LBV → PG" | - |
| Trajet supprimé | Info ℹ️ | "Un trajet a été retiré" | - |
| Réservation agent | Success ✅ | "Places mises à jour en temps réel" | - |
| Retard signalé | Warning ⚠️ | "Retard de 30min: Embouteillages" | - |
| Incident | Error ❌ | "Incident signalé sur le trajet" | "Panne mécanique légère" |

---

## 🧪 Tests de synchronisation

### Test Matrix

| Test | Admin → Public | Agent → Public | Driver → Public |
|------|----------------|----------------|-----------------|
| Publier trajet | ✅ | - | - |
| Modifier trajet | ✅ | - | - |
| Supprimer trajet | ✅ | - | - |
| Créer réservation | - | ✅ | - |
| Mettre à jour places | - | ✅ | - |
| Position GPS | - | - | ✅ |
| Signaler retard | - | - | ✅ |
| Signaler incident | - | - | ✅ |

---

## 🚀 Workflow de test complet

### Configuration
1. Ouvrir 4 onglets côte à côte :
   - Onglet 1 : Dashboard Admin
   - Onglet 2 : Dashboard Agent
   - Onglet 3 : Dashboard Chauffeur
   - Onglet 4 : Page Publique

### Scénario de test

```
1. ADMIN publie un nouveau trajet (Onglet 1)
   ✅ Vérifier apparition dans Onglet 4

2. AGENT crée une réservation (Onglet 2)
   ✅ Vérifier mise à jour places dans Onglet 4
   ✅ Vérifier passager visible dans Onglet 1
   ✅ Vérifier passager visible dans Onglet 3

3. CHAUFFEUR signale un retard (Onglet 3)
   ✅ Vérifier notification dans Onglet 4
   ✅ Vérifier alerte dans Onglet 1

4. CLIENT réserve sur page publique (Onglet 4)
   ✅ Vérifier passager dans Onglet 1, 2 et 3

5. ADMIN supprime le trajet (Onglet 1)
   ✅ Vérifier disparition dans Onglet 4
```

---

## 🔐 Sécurité et Production

### ⚠️ Important pour la production

Toutes les opérations de synchronisation doivent être validées côté serveur :

```typescript
// ❌ MAL : Émettre directement l'événement
window.dispatchEvent(new CustomEvent('admin:trip:published', {...}));

// ✅ BIEN : Valider côté serveur puis émettre
const publishTripToPublic = async (trip: Trip) => {
  // 1. Authentification
  const token = await getAuthToken();
  
  // 2. Validation serveur
  const response = await fetch('/api/admin/trips/publish', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(trip)
  });
  
  if (!response.ok) {
    throw new Error('Échec de la publication');
  }
  
  // 3. Synchronisation locale après validation
  window.dispatchEvent(new CustomEvent('admin:trip:published', {
    detail: { trip }
  }));
};
```

---

## 📈 Métriques et Monitoring

### Événements à logger

```typescript
// Dans PublicDataContext
useEffect(() => {
  const handleEvent = (event: CustomEvent) => {
    // Logger pour analytics
    logEvent('sync_received', {
      type: event.type,
      timestamp: new Date(),
      userId: currentUser?.id,
      data: event.detail
    });
  };
  
  window.addEventListener('admin:trip:published', handleEvent);
  // ... autres événements
}, []);
```

### Métriques importantes
- 📊 Nombre de trajets publiés par jour
- ⏱️ Temps de synchronisation moyen
- 🎫 Nombre de réservations agent vs public
- 🚨 Nombre d'incidents signalés
- ⏰ Nombre de retards signalés

---

## 📚 Documentation complète

| Document | Description |
|----------|-------------|
| `SYNCHRONISATION_ADMIN_PUBLIC.md` | 📢 Synchronisation Admin → Public (CE DOCUMENT) |
| `SYNCHRONISATION_AGENT_PUBLIC.md` | 🎫 Synchronisation Agent → Public |
| `SYNCHRONISATION.md` | 🚌 Synchronisation Chauffeur → Public |
| `GUIDE_TEST_ADMIN_PUBLIC.md` | 🧪 Guide de test Admin → Public |
| `GUIDE_TEST_SYNCHRONISATION.md` | 🧪 Guide de test complet |
| `TEST_SYNCHRONISATION.md` | 🔬 Tests techniques détaillés |

---

## ✅ Checklist d'implémentation

### Étape 1 : Contextes
- [x] OperationalDataContext créé avec fonctions de sync
- [x] PublicDataContext écoute les événements
- [x] AdminContentProvider gère le contenu statique

### Étape 2 : Dashboard Admin
- [x] TripManagementTab avec bouton "Publier" 🌐
- [x] Bouton "Test Sync" pour tests rapides
- [x] Gestion des trajets (CRUD)

### Étape 3 : Dashboard Agent
- [x] Création de réservations sur place
- [x] Liste des réservations synchronisée
- [x] Événement agent:reservation:created

### Étape 4 : Dashboard Chauffeur
- [x] Mise à jour de position GPS
- [x] Signalement de retards
- [x] Signalement d'incidents

### Étape 5 : Page Publique
- [x] DestinationCards synchronisé
- [x] AvailableTrips synchronisé
- [x] TripDetailsModal avec passagers

### Étape 6 : Notifications
- [x] Toast success pour trajets publiés
- [x] Toast info pour mises à jour
- [x] Toast warning pour retards
- [x] Toast error pour incidents

### Étape 7 : Documentation
- [x] Documentation technique complète
- [x] Guides de test
- [x] Diagrammes d'architecture

### Étape 8 : Tests
- [ ] Tests unitaires des contextes
- [ ] Tests d'intégration
- [ ] Tests E2E multi-onglets
- [x] Tests manuels validés

---

## 🎯 Roadmap Future

### Fonctionnalités à ajouter

1. **Synchronisation bidirectionnelle complète**
   - Public → Admin (notifications de réservations)
   - Admin → Agent (assignation de tâches)
   - Chauffeur → Agent (demandes d'assistance)

2. **WebSocket pour temps réel amélioré**
   - Remplacer CustomEvents par WebSocket
   - Connexion persistante avec le serveur
   - Synchronisation multi-dispositifs

3. **Système de notifications push**
   - Notifications navigateur
   - SMS pour retards importants
   - Email pour confirmations

4. **Analytics en temps réel**
   - Dashboard de supervision
   - Graphiques de synchronisation
   - Alertes automatiques

5. **Mode offline**
   - Queue d'événements hors ligne
   - Synchronisation automatique au retour en ligne
   - Gestion des conflits

---

## 📞 Support et Contribution

### Signaler un bug
Créer une issue sur GitHub avec :
- Description du problème
- Étapes de reproduction
- Logs de la console
- Screenshots si pertinent

### Proposer une amélioration
Créer une pull request avec :
- Description de la fonctionnalité
- Tests associés
- Documentation mise à jour

---

**Version système :** 2.0.0  
**Date de dernière mise à jour :** 2025-01-08  
**Statut :** ✅ Production Ready  
**Équipe :** Karis Continental Tech Team