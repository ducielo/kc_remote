# 🔄 Système de Synchronisation Karis Continental

## Vue d'ensemble

Ce document explique comment le système de synchronisation fonctionne entre les différents dashboards (Admin, Agent Contrôleur, Chauffeur) et la page publique de Karis Continental.

## Architecture de Synchronisation

```
┌─────────────────────────────────────────────────────────────────┐
│                    SYSTÈME DE SYNCHRONISATION                    │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│  Admin Dashboard │         │ Agent Dashboard  │         │ Driver Dashboard │
│                  │         │                  │         │                  │
│  - Trajets       │         │  - Réservations  │         │  - Position GPS  │
│  - Horaires      │         │  - Validation    │         │  - Retards       │
│  - Destinations  │         │  - Paiements     │         │  - Incidents     │
└────────┬─────────┘         └────────┬─────────┘         └────────┬─────────┘
         │                            │                            │
         │ Publish                    │ Create                     │ Report
         │                            │                            │
         ▼                            ▼                            ▼
┌─────────────────────────────────────────────────────────────────┐
│              CONTEXTES DE SYNCHRONISATION                        │
│                                                                  │
│  AdminContentProvider  │  OperationalDataContext  │  PublicData │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ Events (CustomEvents API)
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      PAGE PUBLIQUE                               │
│                                                                  │
│  - AvailableTrips      - DestinationCards      - Statistics     │
│  - Hero                - InteractiveMap        - Features       │
└─────────────────────────────────────────────────────────────────┘
```

## 🎯 Flux de Synchronisation

### 1️⃣ Admin → Public

**Quoi:** Trajets, horaires, destinations, contenu

**Comment:**
```typescript
// Dans AdminContentProvider.tsx
const publishRoute = (route) => {
  // Publier le trajet
  setPublishedRoutes(prev => [...prev, route]);
  
  // Synchroniser avec PublicDataContext
  window.dispatchEvent(new CustomEvent('admin:route:published', {
    detail: { route }
  }));
};
```

**Résultat:** 
- Les trajets publiés apparaissent immédiatement dans `AvailableTrips`
- Les destinations activées s'affichent dans `DestinationCards`
- Les horaires sont mis à jour en temps réel

### 2️⃣ Agent Contrôleur → Public

**Quoi:** Réservations sur place, validation de listes, disponibilité des places

**Comment:**
```typescript
// Dans OperationalDataContext.tsx
const createOnSiteReservation = async (reservation) => {
  // Créer la réservation
  const passenger = { ...reservation, id: generateId() };
  
  // Mettre à jour le trajet
  updateTrip(reservation.tripId, trip => ({
    ...trip,
    currentOccupancy: trip.currentOccupancy + 1
  }));
  
  // 🔥 Synchroniser avec la page publique
  window.dispatchEvent(new CustomEvent('agent:reservation:created', {
    detail: { tripId: reservation.tripId, passenger }
  }));
};
```

**Résultat:**
- Les places disponibles sont mises à jour instantanément
- Les statistiques de remplissage sont actualisées
- Toast notification sur la page publique

### 3️⃣ Chauffeur → Public

**Quoi:** Position GPS, retards, incidents

**Comment:**
```typescript
// Dans OperationalDataContext.tsx
const updateTripLocation = async (tripId, location) => {
  // 🔥 Synchroniser avec la page publique
  window.dispatchEvent(new CustomEvent('driver:location:updated', {
    detail: { tripId, location }
  }));
};

const reportDelay = async (tripId, delayMinutes, reason) => {
  // Mettre à jour le statut du trajet
  updateTripStatus(tripId, 'departed');
  
  // 🔥 Synchroniser avec la page publique
  window.dispatchEvent(new CustomEvent('driver:delay:reported', {
    detail: { tripId, delayMinutes, reason }
  }));
};
```

**Résultat:**
- Position du bus affichée en temps réel sur `InteractiveMap`
- Alertes de retard visibles pour les utilisateurs
- Incidents affichés avec badges d'avertissement

## 📡 Événements Personnalisés (CustomEvents)

### Liste des événements

| Événement | Source | Destination | Payload |
|-----------|--------|-------------|---------|
| `admin:route:published` | Admin | Public | `{ route }` |
| `admin:schedule:updated` | Admin | Public | `{ schedule }` |
| `admin:destination:activated` | Admin | Public | `{ destination }` |
| `agent:reservation:created` | Agent | Public | `{ tripId, passenger }` |
| `agent:list:validated` | Agent | Public | `{ tripId, validatedAt }` |
| `driver:location:updated` | Chauffeur | Public | `{ tripId, location }` |
| `driver:delay:reported` | Chauffeur | Public | `{ tripId, delayMinutes, reason }` |
| `driver:incident:reported` | Chauffeur | Public | `{ tripId, incident }` |

### Écouter un événement

```typescript
// Dans PublicDataContext.tsx
useEffect(() => {
  const handleAgentReservation = (event: CustomEvent) => {
    const { tripId, passenger } = event.detail;
    
    // Mettre à jour l'état
    setAvailableRoutes(prev => prev.map(route => {
      if (route.id === tripId) {
        return { ...route, availability: route.availability - 1 };
      }
      return route;
    }));
    
    // Notification
    toast.success('Places mises à jour en temps réel');
  };

  window.addEventListener('agent:reservation:created', handleAgentReservation);
  
  return () => {
    window.removeEventListener('agent:reservation:created', handleAgentReservation);
  };
}, []);
```

## 🧪 Tester la Synchronisation

### Test 1: Admin → Public

1. Ouvrir le Dashboard Admin
2. Aller dans l'onglet "Trajets"
3. Créer un nouveau trajet
4. ✅ Vérifier que le trajet apparaît dans `AvailableTrips` sur la page publique

### Test 2: Agent → Public

1. Ouvrir le Dashboard Agent Contrôleur
2. Aller dans l'onglet "Réservations sur place"
3. Créer une nouvelle réservation
4. ✅ Vérifier que les places disponibles diminuent sur la page publique
5. ✅ Vérifier la notification toast

### Test 3: Chauffeur → Public

1. Ouvrir le Dashboard Chauffeur
2. Démarrer un trajet
3. ✅ Vérifier que la position GPS est mise à jour
4. Signaler un retard
5. ✅ Vérifier l'alerte de retard sur la page publique

## 🔧 Debugging

### Activer les logs de synchronisation

```typescript
// Dans votre navigateur (DevTools Console)
window.addEventListener('agent:reservation:created', (e) => {
  console.log('🎫 Réservation créée:', e.detail);
});

window.addEventListener('driver:location:updated', (e) => {
  console.log('📍 Position mise à jour:', e.detail);
});

window.addEventListener('driver:delay:reported', (e) => {
  console.log('⏰ Retard signalé:', e.detail);
});
```

### Vérifier l'état des contextes

```typescript
// Dans React DevTools
// Chercher "PublicDataProvider" et inspecter:
// - availableRoutes
// - cityCards
// - destinations
// - lastUpdated
```

## 📊 Métriques de Synchronisation

Le système track automatiquement:
- ✅ Nombre d'événements émis par dashboard
- ✅ Temps de latence de synchronisation
- ✅ Taux de réussite des synchronisations
- ✅ Erreurs de synchronisation

Accès aux métriques:
```typescript
// Dans la console du navigateur
window.__SYNC_METRICS__
```

## 🚀 Performance

- **Latence moyenne:** < 100ms
- **Événements par seconde:** Illimité (throttle recommandé pour GPS)
- **Taille des payloads:** < 5KB par événement
- **Stockage local:** Utilisé pour mode hors ligne

## 📚 Ressources

- [React Context API](https://react.dev/reference/react/useContext)
- [CustomEvent API](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent)
- [Event-driven Architecture](https://en.wikipedia.org/wiki/Event-driven_architecture)

---

**Dernière mise à jour:** 8 octobre 2025
**Version:** 1.0.0
**Auteur:** Équipe Karis Continental
