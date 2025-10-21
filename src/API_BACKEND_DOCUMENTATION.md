# 📚 Documentation API Backend - Karis Continental

## 🎯 Vue d'ensemble

Cette documentation explique comment utiliser toutes les API disponibles dans le système back-office de Karis Continental pour connecter votre backend.

Le système est organisé en **modules par rôle** (Admin, Agent, Chauffeur) et **services spécialisés** (Trips, Tickets, Routes, Vehicles, etc.).

### ⚡ Important : Fetch est déjà implémenté !

**Oui, `fetch` est présent dans le code !** 🎉

- **Localisation** : `/back-office/services/BaseService.ts` (lignes 29-56)
- **État actuel** : Mode MOCK activé pour le développement (pas besoin de backend)
- **Pour production** : Désactiver le mode mock pour utiliser les vrais appels HTTP

📖 **Voir les détails** : `/back-office/EXEMPLE_FETCH_AXIOS.md` et `/back-office/CONFIG_BACKEND.md`

---

## 📁 Structure du Back-Office

```
/back-office/
├── modules/              # Modules principaux par rôle
│   ├── AdminModule.ts    # Orchestration Admin (accès complet)
│   ├── AgentModule.ts    # Orchestration Agent/Contrôleur
│   └── DriverModule.ts   # Orchestration Chauffeur
├── services/             # Services spécialisés
│   ├── AdminService.ts   # Service Admin global
│   ├── AgentService.ts   # Service Agent
│   ├── DriverService.ts  # Service Chauffeur
│   ├── TripService.ts    # Gestion des voyages
│   ├── TicketService.ts  # Gestion des billets
│   ├── RouteService.ts   # Gestion des trajets
│   ├── VehicleService.ts # Gestion des véhicules
│   ├── UserService.ts    # Gestion des utilisateurs
│   ├── ReportService.ts  # Génération de rapports
│   └── BaseService.ts    # Service de base (HTTP)
├── types/                # Types TypeScript
│   └── index.ts          # Toutes les interfaces
├── utils/                # Utilitaires
│   ├── EventBus.ts       # Bus d'événements centralisé
│   ├── Logger.ts         # Système de logging
│   └── SimpleEventEmitter.ts
└── index.ts              # Point d'entrée principal
```

---

## 🚀 Initialisation et Utilisation

### 1️⃣ Hook React personnalisé (Recommandé)

**Emplacement** : `/components/hooks/useBackOffice.ts`

```typescript
import { useBackOffice } from './components/hooks/useBackOffice';

function MonComposant() {
  const { 
    isInitialized, 
    isLoading, 
    module, 
    loadSectionData, 
    executeAction 
  } = useBackOffice({ 
    role: 'admin', // 'admin' | 'agent' | 'driver'
    userId: 'user-123' 
  });

  // Charger des données
  const chargerTrips = async () => {
    await loadSectionData('trips');
  };

  // Exécuter une action
  const creerTrip = async () => {
    const result = await executeAction('createTrip', {
      routeId: 'route-1',
      vehicleId: 'vehicle-1',
      driverId: 'driver-1',
      departure: 'Libreville',
      arrival: 'Port-Gentil',
      // ... autres données
    });
  };

  return <div>...</div>;
}
```

### 2️⃣ Utilisation directe des Modules

```typescript
import { BackOfficeFactory } from '../back-office';

// Initialiser le module pour un rôle
const adminModule = await BackOfficeFactory.initializeForDashboard('admin', 'admin-123');

// Utiliser les fonctions du module
const dashboardData = await adminModule.getDashboardData();
const trips = await adminModule.getAllTrips();
```

### 3️⃣ Utilisation directe des Services

```typescript
import { TripService, TicketService } from '../back-office/services';

const tripService = new TripService();
const ticketService = new TicketService();

// Récupérer tous les trips
const tripsResponse = await tripService.getAll({ page: 1, limit: 10 });

// Créer un billet
const ticketResponse = await ticketService.createTicket({
  tripId: 'trip-123',
  passengerName: 'Jean Dupont',
  passengerPhone: '+241 06 12 34 56',
  seatNumber: 'A12',
  price: 25000
});
```

---

## 📋 API par Service

### 🚌 **TripService** - Gestion des Voyages

**Base URL** : `/trips`  
**Fichier** : `/back-office/services/TripService.ts`

#### Opérations CRUD

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `getAll(params)` | `GET /trips` | Liste tous les voyages |
| `getById(id)` | `GET /trips/:id` | Récupère un voyage par ID |
| `create(data)` | `POST /trips` | Crée un nouveau voyage |
| `update(id, data)` | `PUT /trips/:id` | Met à jour un voyage |
| `delete(id)` | `DELETE /trips/:id` | Supprime un voyage |

#### Opérations de Statut

```typescript
// Démarrer un voyage
await tripService.startTrip('trip-123');
// PUT /trips/:id/start

// Terminer un voyage
await tripService.completeTrip('trip-123');
// PUT /trips/:id/complete

// Annuler un voyage
await tripService.cancelTrip('trip-123', 'Problème mécanique');
// PUT /trips/:id/cancel

// Retarder un voyage
await tripService.delayTrip('trip-123', 30, 'Embouteillage');
// PUT /trips/:id/delay
```

#### Recherche et Filtrage

```typescript
// Rechercher des voyages
await tripService.searchTrips({
  departure: 'Libreville',
  arrival: 'Port-Gentil',
  date: '2025-10-15',
  minPrice: 10000,
  maxPrice: 30000
});
// GET /trips/search?departure=Libreville&arrival=Port-Gentil&date=2025-10-15

// Voyages par trajet
await tripService.getTripsByRoute('route-123');
// GET /trips/route/:routeId

// Voyages par véhicule
await tripService.getTripsByVehicle('vehicle-123');
// GET /trips/vehicle/:vehicleId

// Voyages par chauffeur
await tripService.getTripsByDriver('driver-123');
// GET /trips/driver/:driverId

// Voyages par statut
await tripService.getTripsByStatus('active');
// GET /trips/status/:status

// Voyages par période
await tripService.getTripsByDateRange(
  new Date('2025-10-01'),
  new Date('2025-10-31')
);
// GET /trips/date-range?startDate=2025-10-01&endDate=2025-10-31
```

#### Gestion des Passagers

```typescript
// Liste des passagers d'un voyage
await tripService.getTripPassengers('trip-123');
// GET /trips/:id/passengers

// Mise à jour de la capacité
await tripService.updateAvailableSeats('trip-123', 35);
// PUT /trips/:id/seats
```

---

### 🎫 **TicketService** - Gestion des Billets

**Base URL** : `/tickets`  
**Fichier** : `/back-office/services/TicketService.ts`

#### Opérations CRUD

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `getAll(params)` | `GET /tickets` | Liste tous les billets |
| `getById(id)` | `GET /tickets/:id` | Récupère un billet par ID |
| `createTicket(data)` | `POST /tickets` | Crée un nouveau billet |
| `updateTicket(id, data)` | `PUT /tickets/:id` | Met à jour un billet |
| `delete(id)` | `DELETE /tickets/:id` | Supprime un billet |

#### Exemple de Création

```typescript
await ticketService.createTicket({
  tripId: 'trip-123',
  passengerName: 'Marie Nkomo',
  passengerPhone: '+241 06 23 45 67',
  passengerEmail: 'marie@email.com', // optionnel
  seatNumber: 'B05',
  price: 25000,
  paymentMethod: 'mobile-money' // 'cash' | 'mobile-money' | 'card'
});
// POST /tickets
// Génère automatiquement bookingReference et définit status='booked'
```

#### Recherche et Filtrage

```typescript
// Recherche par terme
await ticketService.searchTickets('Jean');
// GET /tickets/search?q=Jean

// Billets par voyage
await ticketService.getTicketsByTrip('trip-123');
// GET /tickets/trip/:tripId

// Billets par statut
await ticketService.getTicketsByStatus('paid');
// GET /tickets/status/:status
// Statuts: 'booked' | 'paid' | 'checked-in' | 'completed' | 'cancelled' | 'refunded'

// Billets par statut de paiement
await ticketService.getTicketsByPaymentStatus('pending');
// GET /tickets/payment-status/:paymentStatus
// PaymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'

// Billets par passager
await ticketService.getTicketsByPassenger('+241 06 12 34 56');
// GET /tickets/passenger?info=+241%2006%2012%2034%2056

// Billets par période
await ticketService.getTicketsByDateRange(
  new Date('2025-10-01'),
  new Date('2025-10-31')
);
// GET /tickets/date-range?startDate=2025-10-01&endDate=2025-10-31

// Billet par référence
await ticketService.getTicketByReference('KC-2025-ABC123');
// GET /tickets/reference/:bookingReference
```

#### Opérations sur les Billets

```typescript
// Valider un billet
await ticketService.validateTicket('ticket-123');
// POST /tickets/:id/validate

// Check-in passager
await ticketService.checkInPassenger('ticket-123');
// PUT /tickets/:id/check-in

// Annuler un billet
await ticketService.cancelTicket('ticket-123', 'Changement de plan');
// PUT /tickets/:id/cancel

// Initier un remboursement
await ticketService.initiateRefund('ticket-123', {
  reason: 'Annulation voyage',
  refundAmount: 25000,
  refundMethod: 'mobile-money'
});
// POST /tickets/:id/refund

// Marquer comme payé
await ticketService.markAsPaid('ticket-123', {
  paymentMethod: 'mobile-money',
  transactionId: 'TXN-123456'
});
// PUT /tickets/:id/mark-paid
```

---

### 🛣️ **RouteService** - Gestion des Trajets

**Base URL** : `/routes`  
**Fichier** : `/back-office/services/RouteService.ts`

#### Opérations CRUD

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `getAll(params)` | `GET /routes` | Liste tous les trajets |
| `getById(id)` | `GET /routes/:id` | Récupère un trajet par ID |
| `createRoute(data)` | `POST /routes` | Crée un nouveau trajet |
| `updateRoute(id, data)` | `PUT /routes/:id` | Met à jour un trajet |
| `delete(id)` | `DELETE /routes/:id` | Supprime un trajet |

#### Exemple de Création

```typescript
await routeService.createRoute({
  name: 'Libreville - Port-Gentil Express',
  departure: 'Libreville',
  arrival: 'Port-Gentil',
  duration: 480, // minutes
  distance: 350, // km
  basePrice: 25000,
  stops: [
    {
      name: 'Ndjolé',
      order: 1,
      arrivalTime: '10:30',
      departureTime: '10:45'
    },
    {
      name: 'Lambaréné',
      order: 2,
      arrivalTime: '12:00',
      departureTime: '12:30'
    }
  ],
  isActive: true
});
// POST /routes
```

#### Recherche et Filtrage

```typescript
// Rechercher des trajets
await routeService.searchRoutes({
  departure: 'Libreville',
  arrival: 'Port-Gentil',
  province: 'Estuaire',
  maxDuration: 600,
  maxPrice: 30000,
  isActive: true
});
// GET /routes/search?departure=Libreville&arrival=Port-Gentil

// Trajets par province
await routeService.getRoutesByProvince('Estuaire');
// GET /routes/province/:province
// Provinces: 'Estuaire', 'Haut-Ogooué', 'Moyen-Ogooué', 'Ngounié', 
//            'Nyanga', 'Ogooué-Ivindo', 'Ogooué-Lolo', 'Ogooué-Maritime', 'Woleu-Ntem'

// Trajets actifs uniquement
await routeService.getActiveRoutes();
// GET /routes/active

// Trajets inactifs
await routeService.getInactiveRoutes();
// GET /routes/inactive

// Trajets par distance
await routeService.getRoutesByDistance(100, 500);
// GET /routes/distance-range?minDistance=100&maxDistance=500
```

#### Gestion des Arrêts

```typescript
// Ajouter un arrêt
await routeService.addStop('route-123', {
  name: 'Mouila',
  order: 3,
  arrivalTime: '14:00',
  departureTime: '14:15'
});
// POST /routes/:id/stops

// Mettre à jour un arrêt
await routeService.updateStop('route-123', 'stop-456', {
  arrivalTime: '14:30',
  departureTime: '14:45'
});
// PUT /routes/:routeId/stops/:stopId

// Supprimer un arrêt
await routeService.removeStop('route-123', 'stop-456');
// DELETE /routes/:routeId/stops/:stopId

// Réordonner les arrêts
await routeService.reorderStops('route-123', ['stop-1', 'stop-2', 'stop-3']);
// PUT /routes/:id/stops/reorder
```

#### Activation/Désactivation

```typescript
// Activer un trajet
await routeService.activate('route-123');
// PUT /routes/:id/activate

// Désactiver un trajet
await routeService.deactivate('route-123');
// PUT /routes/:id/deactivate
```

---

### 🚐 **VehicleService** - Gestion des Véhicules

**Base URL** : `/vehicles`  
**Fichier** : `/back-office/services/VehicleService.ts`

#### Opérations CRUD

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `getAll(params)` | `GET /vehicles` | Liste tous les véhicules |
| `getById(id)` | `GET /vehicles/:id` | Récupère un véhicule par ID |
| `createVehicle(data)` | `POST /vehicles` | Crée un nouveau véhicule |
| `updateVehicle(id, data)` | `PUT /vehicles/:id` | Met à jour un véhicule |
| `delete(id)` | `DELETE /vehicles/:id` | Supprime un véhicule |

#### Exemple de Création

```typescript
await vehicleService.createVehicle({
  plateNumber: 'GA 1234 AB',
  model: 'Sprinter',
  brand: 'Mercedes-Benz',
  capacity: 45,
  status: 'active',
  lastMaintenance: new Date('2025-09-15'),
  nextMaintenance: new Date('2025-12-15')
});
// POST /vehicles
```

#### Recherche et Filtrage

```typescript
// Recherche par terme (plaque, modèle, marque)
await vehicleService.searchVehicles('GA 1234');
// GET /vehicles/search?q=GA%201234

// Véhicules par statut
await vehicleService.getVehiclesByStatus('active');
// GET /vehicles/status/:status
// Statuts: 'active' | 'maintenance' | 'inactive'

// Véhicules disponibles
await vehicleService.getAvailableVehicles();
// GET /vehicles/available

// Véhicules par marque
await vehicleService.getVehiclesByBrand('Mercedes-Benz');
// GET /vehicles/brand/:brand

// Véhicules par capacité
await vehicleService.getVehiclesByCapacityRange(30, 50);
// GET /vehicles/capacity-range?minCapacity=30&maxCapacity=50

// Véhicules non assignés
await vehicleService.getUnassignedVehicles();
// GET /vehicles/unassigned
```

#### Affectation Chauffeur

```typescript
// Assigner à un chauffeur
await vehicleService.assignToDriver('vehicle-123', 'driver-456');
// PUT /vehicles/:vehicleId/assign-driver

// Retirer l'affectation
await vehicleService.unassignFromDriver('vehicle-123');
// PUT /vehicles/:vehicleId/unassign-driver

// Obtenir le chauffeur assigné
await vehicleService.getAssignedDriver('vehicle-123');
// GET /vehicles/:vehicleId/driver
```

#### Maintenance

```typescript
// Planifier maintenance
await vehicleService.scheduleMaintenance('vehicle-123', {
  type: 'routine',
  scheduledDate: new Date('2025-11-15'),
  description: 'Révision complète',
  estimatedCost: 150000
});
// POST /vehicles/:id/maintenance/schedule

// Démarrer maintenance
await vehicleService.startMaintenance('vehicle-123');
// PUT /vehicles/:id/maintenance/start

// Terminer maintenance
await vehicleService.completeMaintenance('vehicle-123', {
  completedAt: new Date(),
  actualCost: 145000,
  notes: 'Changement huile, filtres, plaquettes'
});
// PUT /vehicles/:id/maintenance/complete

// Historique maintenance
await vehicleService.getMaintenanceHistory('vehicle-123');
// GET /vehicles/:id/maintenance/history
```

#### Changement de Statut

```typescript
// Mettre en maintenance
await vehicleService.setMaintenance('vehicle-123');
// PUT /vehicles/:id/status/maintenance

// Activer
await vehicleService.setActive('vehicle-123');
// PUT /vehicles/:id/status/active

// Désactiver
await vehicleService.setInactive('vehicle-123');
// PUT /vehicles/:id/status/inactive
```

---

### 👥 **UserService** - Gestion des Utilisateurs

**Base URL** : `/users`  
**Fichier** : `/back-office/services/UserService.ts`

#### Opérations CRUD

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `getAll(params)` | `GET /users` | Liste tous les utilisateurs |
| `getById(id)` | `GET /users/:id` | Récupère un utilisateur par ID |
| `create(data)` | `POST /users` | Crée un nouvel utilisateur |
| `update(id, data)` | `PUT /users/:id` | Met à jour un utilisateur |
| `delete(id)` | `DELETE /users/:id` | Supprime un utilisateur |

#### Exemple de Création

```typescript
await userService.create({
  email: 'agent@kariscontinental.ga',
  role: 'agent', // 'admin' | 'agent' | 'driver'
  firstName: 'Jean',
  lastName: 'Mbongo',
  phone: '+241 06 12 34 56',
  isActive: true,
  permissions: [
    {
      name: 'manage_tickets',
      module: 'tickets',
      action: 'manage'
    },
    {
      name: 'validate_passengers',
      module: 'trips',
      action: 'update'
    }
  ]
});
// POST /users
```

#### Recherche et Filtrage

```typescript
// Recherche par terme
await userService.searchUsers('Jean');
// GET /users/search?q=Jean

// Utilisateurs par rôle
await userService.getUsersByRole('agent');
// GET /users/role/:role

// Utilisateurs actifs
await userService.getActiveUsers();
// GET /users/active

// Utilisateurs inactifs
await userService.getInactiveUsers();
// GET /users/inactive
```

#### Gestion des Permissions

```typescript
// Assigner permission
await userService.assignPermission('user-123', {
  name: 'refund_tickets',
  module: 'tickets',
  action: 'manage'
});
// POST /users/:id/permissions

// Retirer permission
await userService.revokePermission('user-123', 'permission-456');
// DELETE /users/:userId/permissions/:permissionId

// Vérifier permission
await userService.hasPermission('user-123', 'manage_tickets');
// GET /users/:id/permissions/check?permission=manage_tickets
```

#### Activation/Désactivation

```typescript
// Activer utilisateur
await userService.activate('user-123');
// PUT /users/:id/activate

// Désactiver utilisateur
await userService.deactivate('user-123');
// PUT /users/:id/deactivate
```

---

### 📊 **ReportService** - Génération de Rapports

**Base URL** : `/reports`  
**Fichier** : `/back-office/services/ReportService.ts`

#### Génération de Rapports

```typescript
// Rapport journalier
await reportService.generateDailyReport({
  date: new Date('2025-10-09'),
  includeTrips: true,
  includeTickets: true,
  includeRevenue: true
});
// POST /reports/daily

// Rapport hebdomadaire
await reportService.generateWeeklyReport({
  startDate: new Date('2025-10-01'),
  endDate: new Date('2025-10-07')
});
// POST /reports/weekly

// Rapport mensuel
await reportService.generateMonthlyReport({
  year: 2025,
  month: 10
});
// POST /reports/monthly

// Rapport personnalisé
await reportService.generateCustomReport({
  type: 'revenue',
  startDate: new Date('2025-09-01'),
  endDate: new Date('2025-09-30'),
  groupBy: 'route',
  filters: {
    status: 'completed'
  }
});
// POST /reports/custom
```

#### Récupération de Rapports

```typescript
// Liste des rapports
await reportService.getAll({ page: 1, limit: 20 });
// GET /reports

// Rapport par ID
await reportService.getById('report-123');
// GET /reports/:id

// Rapports par type
await reportService.getByType('monthly');
// GET /reports/type/:type

// Rapports par période
await reportService.getByDateRange(
  new Date('2025-10-01'),
  new Date('2025-10-31')
);
// GET /reports/date-range?startDate=2025-10-01&endDate=2025-10-31

// Télécharger rapport PDF
await reportService.downloadReport('report-123', 'pdf');
// GET /reports/:id/download?format=pdf

// Télécharger rapport Excel
await reportService.downloadReport('report-123', 'excel');
// GET /reports/:id/download?format=excel
```

---

## 🔑 API par Rôle

### 👨‍💼 **AdminService** - Administrateur (Accès Complet)

**Fichier** : `/back-office/services/AdminService.ts`

L'administrateur a accès à **TOUTES** les fonctionnalités de tous les services. Il peut :

#### Vue d'ensemble système

```typescript
const adminService = new AdminService();

// Statut du système
await adminService.getSystemStatus();
// GET /admin/system/status

// Statistiques globales
await adminService.getSystemStats();
// GET /admin/system/stats

// Données dashboard complètes
await adminService.getDashboardData();
// Charge trips, users, vehicles, tickets, systemStatus en parallèle
```

#### Délégation aux services

```typescript
// Voyages
await adminService.getAllTrips({ page: 1, limit: 10 });
await adminService.createTrip({...});
await adminService.updateTrip('trip-123', {...});
await adminService.deleteTrip('trip-123');
await adminService.startTrip('trip-123');
await adminService.completeTrip('trip-123');

// Utilisateurs
await adminService.getAllUsers();
await adminService.createUser({...});
await adminService.updateUser('user-123', {...});
await adminService.deleteUser('user-123');
await adminService.assignUserPermission('user-123', {...});

// Véhicules
await adminService.getAllVehicles();
await adminService.createVehicle({...});
await adminService.updateVehicle('vehicle-123', {...});
await adminService.deleteVehicle('vehicle-123');

// Routes
await adminService.getAllRoutes();
await adminService.createRoute({...});
await adminService.updateRoute('route-123', {...});
await adminService.deleteRoute('route-123');

// Billets
await adminService.getAllTickets();
await adminService.refundTicket('ticket-123', {...});
await adminService.markTicketAsPaid('ticket-123', {...});

// Rapports
await adminService.generateReport('monthly', {...});
await adminService.getAllReports();
```

---

### 👮 **AgentService** - Agent/Contrôleur

**Fichier** : `/back-office/services/AgentService.ts`

L'agent gère les opérations terrain : billets, validation passagers, check-in.

#### Gestion des voyages (lecture principalement)

```typescript
const agentService = new AgentService();

// Mes voyages
await agentService.getMyTrips();
// GET /agent/trips/my

// Voyages du jour
await agentService.getTodayTrips();
// GET /agent/trips/today

// Voyages actifs par trajet
await agentService.getActiveTripsByRoute('route-123');
// GET /agent/trips/route/:routeId/active

// Détails voyage avec passagers
await agentService.getTripDetails('trip-123');
// GET /agent/trips/:id/details

// Mettre à jour statut voyage
await agentService.updateTripStatus('trip-123', 'active', 'Départ confirmé');
// PUT /agent/trips/:id/status

// Signaler retard
await agentService.reportTripDelay('trip-123', 15, 'Trafic dense');
// PUT /agent/trips/:id/delay

// Signaler incident
await agentService.reportTripIncident('trip-123', {
  type: 'mechanical',
  description: 'Crevaison',
  severity: 'medium'
});
// POST /agent/trips/:id/incident
```

#### Gestion des billets (création, validation, check-in)

```typescript
// Mes billets
await agentService.getMyTickets();
// GET /agent/tickets/my

// Billets par voyage
await agentService.getTicketsByTrip('trip-123');
// GET /agent/tickets/trip/:tripId

// Créer billet sur place
await agentService.createTicket({
  tripId: 'trip-123',
  passengerName: 'Paul Obame',
  passengerPhone: '+241 06 11 22 33',
  seatNumber: 'A14',
  price: 25000,
  paymentMethod: 'cash'
});
// POST /agent/tickets

// Mettre à jour billet
await agentService.updateTicket('ticket-123', {
  seatNumber: 'B10'
});
// PUT /agent/tickets/:id

// Check-in passager
await agentService.checkInPassenger('ticket-123');
// PUT /agent/tickets/:id/check-in

// Annuler billet
await agentService.cancelTicket('ticket-123', 'Demande client');
// PUT /agent/tickets/:id/cancel

// Traiter remboursement
await agentService.processRefund('ticket-123', {
  reason: 'Annulation voyage',
  refundAmount: 25000,
  refundMethod: 'cash'
});
// POST /agent/tickets/:id/refund

// Rechercher billets
await agentService.searchTickets('Obame');
// GET /agent/tickets/search?q=Obame

// Valider billet
await agentService.validateTicket('ticket-123');
// POST /agent/tickets/:id/validate
```

#### Validation des listes de passagers

```typescript
// Obtenir liste passagers
await agentService.getPassengerList('trip-123');
// GET /agent/trips/:id/passenger-list

// Valider liste passagers
await agentService.validatePassengerList('trip-123');
// POST /agent/trips/:id/validate-list

// Exporter liste PDF
await agentService.exportPassengerListPDF('trip-123');
// GET /agent/trips/:id/passenger-list/pdf
```

#### Rapprochement paiements

```typescript
// Rapprocher paiement
await agentService.reconcilePayment({
  transactionId: 'TXN-789',
  ticketId: 'ticket-123',
  amount: 25000,
  paymentMethod: 'mobile-money'
});
// POST /agent/payments/reconcile

// Mes rapprochements
await agentService.getMyReconciliations();
// GET /agent/payments/reconciliations

// Statistiques du jour
await agentService.getDailyStats();
// GET /agent/stats/daily
```

---

### 🚗 **DriverService** - Chauffeur

**Fichier** : `/back-office/services/DriverService.ts`

Le chauffeur gère ses voyages et son véhicule.

#### Gestion des voyages

```typescript
const driverService = new DriverService();

// Mes voyages
await driverService.getMyTrips();
// GET /driver/trips/my

// Mes voyages par statut
await driverService.getMyTrips('active');
// GET /driver/trips/my?status=active

// Voyages du jour
await driverService.getTodayTrips();
// GET /driver/trips/today

// Voyage en cours
await driverService.getCurrentTrip();
// GET /driver/trips/current

// Voyages à venir
await driverService.getUpcomingTrips();
// GET /driver/trips/upcoming

// Passagers d'un voyage
await driverService.getTripPassengers('trip-123');
// GET /driver/trips/:id/passengers

// Démarrer voyage
await driverService.startTrip('trip-123');
// PUT /driver/trips/:id/start

// Terminer voyage
await driverService.completeTrip('trip-123', {
  actualArrivalTime: new Date(),
  fuelLevel: 55,
  notes: 'Voyage terminé sans incident'
});
// PUT /driver/trips/:id/complete

// Mettre en pause
await driverService.pauseTrip('trip-123', 'Pause déjeuner');
// PUT /driver/trips/:id/pause

// Reprendre
await driverService.resumeTrip('trip-123');
// PUT /driver/trips/:id/resume

// Signaler retard
await driverService.reportTripDelay('trip-123', 20, 'Contrôle routier');
// PUT /driver/trips/:id/delay
```

#### Gestion du véhicule

```typescript
// Mon véhicule
await driverService.getMyVehicle();
// GET /driver/vehicle/my

// Mettre à jour localisation
await driverService.updateVehicleLocation({
  lat: 0.4162,
  lng: 9.4673,
  speed: 80
});
// PUT /driver/vehicle/location

// Inspection pré-voyage
await driverService.performPreTripInspection({
  fuelLevel: 95,
  tiresCondition: 'good',
  brakesCondition: 'good',
  lightsCondition: 'good',
  odometerReading: 125430,
  notes: 'Véhicule en bon état'
});
// POST /driver/vehicle/pre-trip-inspection

// Inspection post-voyage
await driverService.performPostTripInspection({
  fuelLevel: 40,
  odometerReading: 125780,
  cleanlinessRating: 4,
  issues: [],
  notes: 'Nettoyage requis'
});
// POST /driver/vehicle/post-trip-inspection

// Signaler problème véhicule
await driverService.reportVehicleIssue({
  type: 'mechanical',
  description: 'Bruit suspect au freinage',
  severity: 'medium',
  requiresImmediate: false
});
// POST /driver/vehicle/issue

// Mettre à jour niveau carburant
await driverService.updateFuelLevel(75);
// PUT /driver/vehicle/fuel-level

// Enregistrer achat carburant
await driverService.recordFuelPurchase({
  amount: 45000,
  liters: 50,
  station: 'Total Libreville Centre',
  receipt: 'REC-123456',
  odometerReading: 125650
});
// POST /driver/vehicle/fuel-purchase
```

#### Historiques et statistiques

```typescript
// Mon historique
await driverService.getMyTripHistory();
// GET /driver/trips/history

// Mes statistiques
await driverService.getMyStats();
// GET /driver/stats

// Mes gains
await driverService.getMyEarnings('2025-10');
// GET /driver/earnings?period=2025-10
```

---

## 🎭 Types et Interfaces

**Fichier** : `/back-office/types/index.ts`

### Types Principaux

```typescript
// Utilisateur
interface User {
  id: string;
  email: string;
  role: 'admin' | 'agent' | 'driver';
  firstName: string;
  lastName: string;
  phone?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  permissions: Permission[];
}

// Voyage
interface Trip {
  id: string;
  routeId: string;
  vehicleId: string;
  driverId: string;
  departure: string;
  arrival: string;
  departureTime: Date;
  arrivalTime: Date;
  price: number;
  availableSeats: number;
  totalSeats: number;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled' | 'delayed';
  createdAt: Date;
  updatedAt: Date;
}

// Billet
interface Ticket {
  id: string;
  tripId: string;
  passengerName: string;
  passengerPhone: string;
  passengerEmail?: string;
  seatNumber: string;
  price: number;
  status: 'booked' | 'paid' | 'checked-in' | 'completed' | 'cancelled' | 'refunded';
  bookingReference: string;
  paymentMethod: 'cash' | 'mobile-money' | 'card';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  checkedInAt?: Date;
  checkedInBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Route/Trajet
interface Route {
  id: string;
  name: string;
  departure: string;
  arrival: string;
  duration: number; // minutes
  distance: number; // km
  stops: RouteStop[];
  isActive: boolean;
  basePrice: number;
  createdAt: Date;
  updatedAt: Date;
}

// Véhicule
interface Vehicle {
  id: string;
  plateNumber: string;
  model: string;
  brand: string;
  capacity: number;
  status: 'active' | 'maintenance' | 'inactive';
  lastMaintenance?: Date;
  nextMaintenance?: Date;
  assignedDriverId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Réponse API standard
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  errors?: string[];
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}
```

---

## 🔧 Configuration et Utilitaires

### EventBus - Bus d'événements

**Fichier** : `/back-office/utils/EventBus.ts`

```typescript
import { EventBus } from '../back-office/utils/EventBus';

// Écouter un événement
EventBus.on('trip:created', (tripData) => {
  console.log('Nouveau voyage créé:', tripData);
});

// Émettre un événement
EventBus.emit('trip:created', { id: 'trip-123', departure: 'Libreville' });

// Retirer un écouteur
const handler = (data) => console.log(data);
EventBus.on('trip:updated', handler);
EventBus.off('trip:updated', handler);
```

### Logger - Système de logging

**Fichier** : `/back-office/utils/Logger.ts`

```typescript
import { Logger } from '../back-office/utils/Logger';

// Différents niveaux
Logger.debug('Message de debug');
Logger.info('Information');
Logger.warn('Avertissement');
Logger.error('Erreur', error);

// Avec contexte
Logger.info('Action utilisateur', {
  userId: 'user-123',
  action: 'create_trip',
  timestamp: new Date()
});

// Récupérer les logs
const logs = Logger.getLogs();
const errorLogs = Logger.getLogs('ERROR');
```

---

## 🔗 Intégration avec les Contexts React

### AdminContentProvider

**Fichier** : `/components/contexts/AdminContentProvider.tsx`

```typescript
import { useAdminContent } from './contexts/AdminContentProvider';

function MonComposant() {
  const {
    publishedTrips,
    publishedHoraires,
    isPublished,
    publishTrip,
    unpublishTrip
  } = useAdminContent();

  // Publier un voyage
  const handlePublish = () => {
    publishTrip({
      id: 'trip-123',
      departure: 'Libreville',
      arrival: 'Port-Gentil',
      // ...
    });
  };
}
```

### PublicDataContext

**Fichier** : `/components/contexts/PublicDataContext.tsx`

```typescript
import { usePublicData } from './contexts/PublicDataContext';

function MonComposant() {
  const {
    trips,
    schedules,
    getPublicTrips,
    getPublicSchedules
  } = usePublicData();

  // Récupérer les données publiques
  useEffect(() => {
    const data = getPublicTrips();
    console.log('Voyages publics:', data);
  }, []);
}
```

### OperationalDataContext

**Fichier** : `/components/contexts/OperationalDataContext.tsx`

```typescript
import { useOperationalData } from './contexts/OperationalDataContext';

function MonComposant() {
  const {
    trips,
    tickets,
    getUpcomingTrips,
    validatePassengerList
  } = useOperationalData();

  // Valider liste passagers
  const handleValidate = async () => {
    const result = await validatePassengerList('trip-123');
    if (result.success) {
      toast.success('Liste validée');
    }
  };
}
```

---

## 📝 Exemples Complets d'Intégration

### Exemple 1 : Créer un voyage complet (Admin)

```typescript
import { useBackOffice } from './components/hooks/useBackOffice';
import { toast } from 'sonner';

function CreateTripForm() {
  const { module, executeAction } = useBackOffice({
    role: 'admin',
    userId: 'admin-123'
  });

  const handleSubmit = async (formData) => {
    try {
      // Créer le voyage
      const tripResult = await executeAction('createTrip', {
        routeId: formData.routeId,
        vehicleId: formData.vehicleId,
        driverId: formData.driverId,
        departure: formData.departure,
        arrival: formData.arrival,
        departureTime: formData.departureTime,
        arrivalTime: formData.arrivalTime,
        price: formData.price,
        totalSeats: formData.totalSeats,
        availableSeats: formData.totalSeats,
        status: 'scheduled'
      });

      if (tripResult.success) {
        toast.success('Voyage créé avec succès');
        
        // Publier immédiatement sur le site public
        publishTrip(tripResult.data);
      }
    } catch (error) {
      toast.error('Erreur lors de la création');
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Exemple 2 : Check-in passager (Agent)

```typescript
import { AgentService } from '../back-office/services/AgentService';
import { toast } from 'sonner';

function PassengerCheckIn({ tripId }) {
  const agentService = new AgentService();
  const [passengers, setPassengers] = useState([]);

  useEffect(() => {
    loadPassengers();
  }, [tripId]);

  const loadPassengers = async () => {
    const result = await agentService.getTicketsByTrip(tripId);
    if (result.success) {
      setPassengers(result.data);
    }
  };

  const handleCheckIn = async (ticketId) => {
    const result = await agentService.checkInPassenger(ticketId);
    
    if (result.success) {
      toast.success('Passager enregistré');
      loadPassengers(); // Recharger la liste
    } else {
      toast.error('Erreur lors du check-in');
    }
  };

  return (
    <div>
      {passengers.map(passenger => (
        <div key={passenger.id}>
          <span>{passenger.passengerName}</span>
          <button onClick={() => handleCheckIn(passenger.id)}>
            Check-in
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Exemple 3 : Suivi de voyage en temps réel (Chauffeur)

```typescript
import { DriverService } from '../back-office/services/DriverService';
import { toast } from 'sonner';

function ActiveTripMonitor() {
  const driverService = new DriverService();
  const [currentTrip, setCurrentTrip] = useState(null);

  useEffect(() => {
    loadCurrentTrip();
    
    // Mise à jour position toutes les 30s
    const locationInterval = setInterval(() => {
      updateLocation();
    }, 30000);

    return () => clearInterval(locationInterval);
  }, []);

  const loadCurrentTrip = async () => {
    const result = await driverService.getCurrentTrip();
    if (result.success && result.data) {
      setCurrentTrip(result.data);
    }
  };

  const updateLocation = async () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        await driverService.updateVehicleLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          speed: position.coords.speed || 0
        });
      });
    }
  };

  const handleStartTrip = async () => {
    const result = await driverService.startTrip(currentTrip.id);
    if (result.success) {
      toast.success('Voyage démarré');
      loadCurrentTrip();
    }
  };

  const handleCompleteTrip = async () => {
    const result = await driverService.completeTrip(currentTrip.id, {
      actualArrivalTime: new Date(),
      fuelLevel: 55,
      notes: 'Voyage terminé sans incident'
    });
    
    if (result.success) {
      toast.success('Voyage terminé');
      setCurrentTrip(null);
    }
  };

  if (!currentTrip) return <div>Aucun voyage en cours</div>;

  return (
    <div>
      <h2>{currentTrip.departure} → {currentTrip.arrival}</h2>
      <p>Statut: {currentTrip.status}</p>
      
      {currentTrip.status === 'scheduled' && (
        <button onClick={handleStartTrip}>Démarrer</button>
      )}
      
      {currentTrip.status === 'active' && (
        <button onClick={handleCompleteTrip}>Terminer</button>
      )}
    </div>
  );
}
```

---

## 🚨 Gestion des Erreurs

Toutes les API retournent une structure `ApiResponse` standardisée :

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  errors?: string[];
  meta?: {...};
}
```

### Exemple de gestion d'erreurs

```typescript
const result = await tripService.createTrip(tripData);

if (result.success) {
  // Succès
  console.log('Voyage créé:', result.data);
  toast.success('Voyage créé avec succès');
} else {
  // Erreur
  console.error('Erreurs:', result.errors);
  result.errors?.forEach(error => {
    toast.error(error);
  });
}
```

---

## 📌 Points Importants

### 1. Configuration Backend : Mode Mock vs Mode Production

**ACTUELLEMENT** : Tous les services sont en **mode MOCK** (données de test).

#### ✅ Comment `fetch` est utilisé dans BaseService.ts

Le fichier `/back-office/services/BaseService.ts` contient **DÉJÀ** l'implémentation avec `fetch` (lignes 29-56) :

```typescript
// Mode production : vrais appels API avec fetch
protected async request<R>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  data?: any
): Promise<ApiResponse<R>> {
  // En mode développement, utiliser les données mockées
  if (this.isDevelopmentMode) {
    return this.handleMockRequest<R>(method, url, data);
  }

  // Mode production : vrais appels API avec fetch
  try {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.getAuthToken(),
      },
    };

    if (data && method !== 'GET') {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${this.baseUrl}${url}`, options);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error [${method} ${url}]:`, error);
    return {
      success: false,
      errors: [error instanceof Error ? error.message : 'Erreur inconnue']
    };
  }
}
```

#### 🔄 Activer le vrai backend (désactiver le mode mock)

**Option 1 : Via localStorage (pour tester en développement)**

Dans la console du navigateur :
```javascript
localStorage.setItem('karis_use_real_api', 'true');
// Puis recharger la page
```

**Option 2 : Modifier BaseService.ts directement**

Dans `/back-office/services/BaseService.ts`, ligne 7-9 :

```typescript
// AVANT (Mode Mock)
protected baseUrl: string = '/api';
protected endpoint: string;
protected isDevelopmentMode: boolean = true;

// APRÈS (Mode Production avec votre backend)
protected baseUrl: string = process.env.REACT_APP_API_URL || 'https://api.kariscontinental.ga';
protected endpoint: string;
protected isDevelopmentMode: boolean = false; // ⬅️ Changer à false
```

**Option 3 : Utiliser des variables d'environnement (Recommandé pour production)**

Créer un fichier `.env` à la racine :
```bash
REACT_APP_API_URL=https://api.kariscontinental.ga
REACT_APP_USE_MOCK=false
```

Puis dans `BaseService.ts` :
```typescript
protected isDevelopmentMode: boolean = process.env.REACT_APP_USE_MOCK === 'true';
protected baseUrl: string = process.env.REACT_APP_API_URL || 'http://localhost:8000';
```

#### 🌐 Alternative : Utiliser Axios au lieu de Fetch

Si vous préférez **axios**, voici comment modifier `BaseService.ts` :

**1. Installer axios** (déjà disponible, pas besoin d'installer) :
```typescript
import axios, { AxiosRequestConfig } from 'axios';
```

**2. Remplacer la méthode `request()` dans BaseService.ts** :

```typescript
protected async request<R>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  data?: any
): Promise<ApiResponse<R>> {
  if (this.isDevelopmentMode) {
    return this.handleMockRequest<R>(method, url, data);
  }

  try {
    const config: AxiosRequestConfig = {
      method,
      url: `${this.baseUrl}${url}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.getAuthToken(),
      },
      data: method !== 'GET' ? data : undefined,
      params: method === 'GET' ? data : undefined,
    };

    const response = await axios(config);
    
    return {
      success: true,
      data: response.data,
      meta: response.data.meta
    };
  } catch (error: any) {
    console.error(`API Error [${method} ${url}]:`, error);
    
    return {
      success: false,
      errors: [
        error.response?.data?.message || 
        error.message || 
        'Erreur de connexion au serveur'
      ]
    };
  }
}
```

#### 📡 Configuration des endpoints backend

Votre backend doit exposer les endpoints suivants :

**Base URL** : `https://api.kariscontinental.ga` ou `http://localhost:8000`

**Headers requis pour toutes les requêtes** :
```
Content-Type: application/json
Authorization: Bearer {token}
```

**Format de réponse standardisé** :
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

**En cas d'erreur** :
```json
{
  "success": false,
  "errors": ["Message d'erreur 1", "Message d'erreur 2"],
  "message": "Description de l'erreur"
}
```

### 2. Authentification

Actuellement sans authentification réelle. Pour l'ajouter :

```typescript
// Dans BaseService.ts
protected async request<T>(method: string, endpoint: string, data?: any) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.getAuthToken()}`
  };
  
  // ... reste du code
}

private getAuthToken(): string {
  return localStorage.getItem('authToken') || '';
}
```

### 3. Pagination

Toutes les méthodes `getAll()` acceptent des paramètres de pagination :

```typescript
await tripService.getAll({
  page: 1,
  limit: 20,
  sortBy: 'departureTime',
  sortOrder: 'asc'
});
```

### 4. Validation

Les services incluent des validations intégrées :
- Champs requis
- Formats (email, téléphone, plaque)
- Valeurs numériques positives
- Dates cohérentes

---

## 🎓 Ressources Supplémentaires

- **Guide de synchronisation** : `/SYNCHRONISATION.md`
- **Guide de test admin/public** : `/GUIDE_TEST_ADMIN_PUBLIC.md`
- **Back-office README** : `/back-office/README.md`
- **Types complets** : `/back-office/types/index.ts`

---

## 💡 Support

Pour toute question sur l'utilisation des API :

1. Consultez les exemples ci-dessus
2. Vérifiez les types dans `/back-office/types/index.ts`
3. Regardez les implémentations dans `/back-office/services/`
4. Testez avec le hook `useBackOffice`

---

**Dernière mise à jour** : 9 octobre 2025  
**Version** : 1.0.0  
**Projet** : Karis Continental PWA