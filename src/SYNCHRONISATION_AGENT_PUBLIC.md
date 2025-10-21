# 🔄 Synchronisation Agent Contrôleur → Page Publique

## 📖 Vue d'ensemble

Ce document explique le système de synchronisation en temps réel entre le **Dashboard Agent Contrôleur** et la **Page Publique** de Karis Continental.

---

## ✨ Fonctionnalités

### 1️⃣ Création de Réservations sur Place

**Workflow :**

```
Agent remplit formulaire
        ↓
Clique "Créer la réservation"
        ↓
createOnSiteReservation() → OperationalDataContext
        ↓
┌─────────────────────────────────────────┐
│  1. Génère ticket unique (TK123456)     │
│  2. Crée objet passager                 │
│  3. Ajoute à allReservations            │
│  4. Met à jour currentOccupancy         │
│  5. Émet événement CustomEvent          │
└─────────────────────────────────────────┘
        ↓
┌──────────────────┬──────────────────────┐
│  Dashboard Agent │   Page Publique      │
├──────────────────┼──────────────────────┤
│  • Table mise    │  • Modal "Détails    │
│    à jour        │    du trajet"        │
│  • Toast succès  │  • Onglet Passagers  │
│  • Badge sync    │  • Toast info        │
└──────────────────┴──────────────────────┘
```

---

## 🎯 Points de Synchronisation

### Dashboard Agent → Page Publique

| Quoi | Où dans Agent | Où dans Public | Événement |
|------|---------------|----------------|-----------|
| Nouvelle réservation | Table "Réservations du jour" | Modal > Onglet Passagers | `agent:reservation:created` |
| Validation liste | Onglet "Validation listes" | Badge statut trajet | `agent:list:validated` |
| Rapprochement paiement | Onglet "Rapprochement" | Statistiques | `agent:payment:reconciled` |

---

## 💻 Implémentation Technique

### Contexte : `OperationalDataContext.tsx`

```typescript
// État des réservations
const [allReservations, setAllReservations] = useState([...]);

// Fonction de création
const createOnSiteReservation = async (reservation) => {
  // 1. Générer le passager
  const newPassenger = {
    id: `passenger_${Date.now()}`,
    ticketId: `TK${Date.now().toString().slice(-6)}`,
    name: reservation.passengerName,
    phone: reservation.passengerPhone,
    // ... autres champs
  };

  // 2. Créer l'objet réservation complet
  const fullReservation = {
    ...newPassenger,
    tripId: reservation.tripId,
    amount: reservation.amount,
    departure: trip.departure,
    arrival: trip.arrival,
    // ... autres champs
  };

  // 3. Ajouter à la liste
  setAllReservations(prev => [fullReservation, ...prev]);

  // 4. Mettre à jour le trajet
  setTrips(prev => prev.map(t => {
    if (t.id === reservation.tripId) {
      return {
        ...t,
        passengers: [...t.passengers, newPassenger],
        currentOccupancy: t.currentOccupancy + 1
      };
    }
    return t;
  }));

  // 🔥 5. Émettre l'événement de synchronisation
  window.dispatchEvent(new CustomEvent('agent:reservation:created', {
    detail: { 
      tripId: reservation.tripId, 
      passenger: newPassenger,
      reservation: fullReservation
    }
  }));

  return { success: true, reservation: fullReservation };
};
```

### Composant : `AgentDashboardFixed.tsx`

```typescript
export const AgentDashboardFixed = ({ agentId }) => {
  const { createOnSiteReservation, getAllReservations } = useOperationalData();
  
  // Récupérer toutes les réservations
  const todayReservations = getAllReservations();

  const handleCreateReservation = async () => {
    const result = await createOnSiteReservation(reservationForm);
    
    toast.success('Réservation créée avec succès', {
      description: `Ticket: ${result.reservation?.ticketId}`
    });
    
    // Le formulaire se réinitialise
    // La table se met à jour automatiquement via getAllReservations()
  };

  return (
    <div>
      {/* Formulaire de création */}
      
      {/* Table des réservations */}
      <Table>
        <TableBody>
          {todayReservations.map(reservation => (
            <TableRow key={reservation.id}>
              <TableCell>{reservation.passengerName}</TableCell>
              <TableCell>{reservation.ticketId}</TableCell>
              {/* ... autres cellules */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
```

### Modal : `TripDetailsModal.tsx`

```typescript
export const TripDetailsModal = ({ trip, isOpen }) => {
  const { getTripReservations } = useOperationalData();
  const [tripReservations, setTripReservations] = useState([]);

  // 🔥 Écouter les nouvelles réservations
  useEffect(() => {
    const handleNewReservation = (event: any) => {
      const { tripId } = event.detail;
      if (trip && trip.id === tripId) {
        setTripReservations(getTripReservations(trip.id));
        toast.info('Une nouvelle réservation a été ajoutée');
      }
    };
    
    window.addEventListener('agent:reservation:created', handleNewReservation);
    return () => window.removeEventListener('agent:reservation:created', handleNewReservation);
  }, [trip]);

  // 🔥 Charger les réservations à l'ouverture
  useEffect(() => {
    if (trip && isOpen) {
      setTripReservations(getTripReservations(trip.id));
    }
  }, [trip, isOpen]);

  return (
    <Modal>
      <Tabs>
        <TabsList>
          <TabsTrigger value="info">Informations</TabsTrigger>
          <TabsTrigger value="passengers">
            Passagers ({tripReservations.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="passengers">
          <Table>
            {tripReservations.map(reservation => (
              <TableRow key={reservation.id}>
                <TableCell>{reservation.ticketId}</TableCell>
                <TableCell>{reservation.passengerName}</TableCell>
                <TableCell>{reservation.seatNumber}</TableCell>
                <TableCell>{reservation.amount} XAF</TableCell>
                <TableCell>
                  <Badge>{reservation.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </TabsContent>
      </Tabs>
    </Modal>
  );
};
```

---

## 🎨 Interface Utilisateur

### Dashboard Agent

```
┌─────────────────────────────────────────────────────────────┐
│  Dashboard Agent Contrôleur                                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  📊 Statistiques                                            │
│  ┌──────────────┬──────────────┬──────────────┬────────┐   │
│  │ Réservations │ Trajets à    │ Montant      │ Qualité│   │
│  │ du jour      │ valider      │ encaissé     │ service│   │
│  │     15       │     8        │  375K XAF    │  98%   │   │
│  │ 🟢 Sync      │              │              │        │   │
│  └──────────────┴──────────────┴──────────────┴────────┘   │
│                                                              │
│  📝 Nouvelle réservation sur place                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Nom du passager: [Jean-Pierre Moukassa        ]       │ │
│  │ Téléphone:       [+241 06 99 88 77            ]       │ │
│  │ Trajet:          [LBV → Port-Gentil (08:00)  ▼]       │ │
│  │ Siège:           [A15                         ]       │ │
│  │ Montant:         [25000                       ]       │ │
│  │                                                        │ │
│  │  [  ✚  Créer la réservation  ]                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  📋 Réservations du jour                                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Passager          │ Trajet      │ Siège │ Montant     │ │
│  ├───────────────────┼─────────────┼───────┼─────────────┤ │
│  │ Jean-Pierre M.    │ LBV → PG    │ A15   │ 25000 XAF  │ │
│  │ +241 06 99 88 77  │ 08:00       │       │ ✅ Payé    │ │
│  ├───────────────────┼─────────────┼───────┼─────────────┤ │
│  │ Alain Mbongo      │ LBV → PG    │ A12   │ 25000 XAF  │ │
│  │ +241 06 12 34 56  │ 08:00       │       │ ✅ Payé    │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ✅ 2 réservation(s) synchronisée(s) avec la page publique │
└─────────────────────────────────────────────────────────────┘
```

### Page Publique - Modal Détails du Trajet

```
┌─────────────────────────────────────────────────────────────┐
│  📍 Détails du trajet                                   ✖   │
│  Libreville → Port-Gentil                                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [ Informations ]  [ Passagers (2) ]                        │
│                    ─────────────────                         │
│                                                              │
│  📋 Liste des passagers réservés                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Ticket  │ Passager         │ Siège │ Montant │ Statut │ │
│  ├─────────┼──────────────────┼───────┼─────────┼────────┤ │
│  │ TK12345 │ Jean-Pierre M.   │ A15   │ 25000   │ Payé   │ │
│  │         │ +241 06 99 88 77 │       │         │ 🟢     │ │
│  ├─────────┼──────────────────┼───────┼─────────┼────────┤ │
│  │ TK001   │ Alain Mbongo     │ A12   │ 25000   │ Payé   │ │
│  │         │ +241 06 12 34 56 │       │         │ 🟢     │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│                     [ Réserver maintenant ]                  │
└─────────────────────────────────────────────────────────────┘

                          🟢 Synchronisation temps réel
                          ┌──────────────────────────────┐
                          │ Nouvelle réservation:        │
                          │ Jean-Pierre Moukassa        │
                          │ 14:32:15                    │
                          └──────────────────────────────┘
```

---

## 🔍 Débogage

### Logs de Console

Activez les logs pour suivre la synchronisation :

```typescript
// Dans OperationalDataContext.tsx
console.log('✅ Agent → Public sync: Nouvelle réservation créée', newPassenger);

// Dans TripDetailsModal.tsx
console.log('📥 Événement reçu: agent:reservation:created', event.detail);
console.log('🔄 Mise à jour des réservations pour le trajet', tripId);
```

### Événements à Surveiller

```javascript
// Écouter dans la console du navigateur
window.addEventListener('agent:reservation:created', (e) => {
  console.log('🎫 Nouvelle réservation:', e.detail);
});
```

---

## 📊 Données de Test

### Réservations Pré-chargées

Au démarrage, 2 réservations sont disponibles :

| Ticket | Passager | Trajet | Siège | Montant | Statut |
|--------|----------|--------|-------|---------|--------|
| TK001 | Alain Mbongo | LBV → PG (08:00) | A12 | 25000 XAF | Payé |
| TK002 | Marie Nkomo | LBV → FCV (06:00) | B05 | 35000 XAF | En attente |

### Créer une Réservation de Test

```
Nom: Jean-Pierre Moukassa
Téléphone: +241 06 99 88 77
Email: jp.moukassa@email.com
Trajet: Libreville → Port-Gentil (08:00)
Siège: A15
Montant: 25000
Paiement: Espèces
```

---

## ✅ Checklist de Validation

Après création d'une réservation, vérifiez :

- [ ] Toast de succès avec numéro de ticket dans le dashboard agent
- [ ] Nouvelle ligne dans la table "Réservations du jour"
- [ ] Statistique "Réservations du jour" incrémentée
- [ ] Badge vert "Synchronisé avec la page publique"
- [ ] Toast d'information sur la page publique (si modal ouvert)
- [ ] Onglet "Passagers (X)" avec X incrémenté
- [ ] Nouvelle ligne dans la table des passagers du modal
- [ ] Panneau vert en bas à droite avec notification

---

## 🚀 Performance

- **Latence de synchronisation :** < 100ms
- **Taille de l'événement :** ~ 2KB
- **Fréquence maximale :** Illimitée (pas de throttle)
- **Compatibilité :** Tous les navigateurs modernes

---

## 📚 Fichiers Concernés

```
/components/
  ├── contexts/
  │   └── OperationalDataContext.tsx    ← État + fonctions sync
  ├── AgentDashboardFixed.tsx           ← Dashboard agent
  ├── TripDetailsModal.tsx              ← Modal page publique
  └── SyncDemoPanel.tsx                 ← Notifications temps réel

/App.tsx                                 ← Providers wrapping
```

---

**Dernière mise à jour :** 8 octobre 2025  
**Version :** 1.0.0  
**Auteur :** Équipe Karis Continental
