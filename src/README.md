# Karis Continental - Système de Gestion Intégré

## Vue d'ensemble

Application PWA complète inspirée de FlixBus pour le Gabon, développée avec React.js, TypeScript, Tailwind CSS 4, et intégrant 3 dashboards distincts selon les rôles utilisateurs.

## 🏗️ Architecture

### 1. Dashboard Administrateur (Admin)
**Extension du dashboard existant avec nouvelles fonctionnalités avancées**

#### 🔐 Rôles & Permissions
- Interface pour créer des rôles personnalisés
- Définition des permissions (lecture, écriture, validation, annulation, publication, remboursement)
- Association des rôles aux utilisateurs

#### 🛣️ Paramétrage Routes & Tarifs
- Configuration des itinéraires, prix, promotions
- Politiques d'annulation configurables
- Ajustement des règles en temps réel

#### 📊 Supervision Temps Réel
- Dashboard analytique : taux de remplissage, ventes, paiements, remboursements
- Affichage des trajets actifs, bus en route, état des réservations
- Graphiques et métriques en temps réel

#### 💳 Paiements & Remboursements (NOUVEAU)
- Gestion complète des paiements des voyageurs depuis l'espace public
- Mise à jour des statuts de paiement (pending, completed, failed, refunded)
- Traitement des demandes de remboursement
- Approbation/rejet des remboursements
- Statistiques et exports de paiements

#### ⚖️ Litiges & Résolutions (NOUVEAU)
- Résolution des problèmes et réclamations des voyageurs
- Processus de remboursement au bénéfice des voyageurs
- Système de priorisation et escalade (low, medium, high, urgent)
- Gestion des preuves et documents
- Assignation et suivi des litiges

#### 👥 Gestion des Voyageurs (NOUVEAU)
- Ajout, modification, suppression de voyageurs dans les trajets
- Transfert de voyageurs entre trajets
- Check-in et embarquement
- Historique complet des modifications
- Gestion manuelle des réservations

#### 🔒 Contrôle d'Accès (NOUVEAU)
- **Création de comptes employés** (agents et chauffeurs)
- **Génération automatique d'identifiants** (username + password)
- **Fourniture de liens de connexion** spécifiques par rôle
- Blocage et déblocage des agents et chauffeurs
- Gestion des permissions à la connexion
- Suspension temporaire ou définitive
- Historique de connexion et activités
- Réinitialisation des tentatives de connexion

### 2. Dashboard Agent/Contrôleur (Nouveau)
**Interface terrain pour les opérations quotidiennes**

#### Fonctionnalités Clés
- **Réservations sur place** : Formulaire rapide pour créer des réservations sans achat en ligne
- **Validation liste passagers** : Bouton "Valider" → génère un PDF figé et signé
- **Remboursements < 48h** : Interface pour initier des remboursements dans les délais
- **Rapprochement paiements** : Saisie de numéro de transaction et validation des paiements manquants

### 3. Dashboard Chauffeur (Nouveau)
**Espace mobile pour les conducteurs**

#### Fonctionnalités Clés
- **Consultation missions** : Calendrier des missions, horaires, villes, bus assigné
- **Liste passagers (offline)** : PDF téléchargeable, lisible sans connexion
- **Détails du bus** : Immatriculation, capacité, statut technique, prochaine révision
- **Signalement incidents** : Formulaire pour signaler pannes, accidents, incidents passagers

## 🎯 Critères d'Acceptation Implémentés

### ✅ Paiement Confirmé
- À la réception d'un webhook success → statut passe en "PAYÉE"
- SMS envoyé < 60s et billet PDF < 5min
- `API: sendPaymentSMS(ticketId)`, `generateTicketPDF(ticketId)`

### ✅ Validation Liste Agent
- Clic "Valider" → génère PDF horodaté immuable
- Accessible uniquement en lecture après validation
- `API: generatePassengerListPDF(tripId)`

### ✅ Alertes Maintenance J-15
- Tâche planifiée déclenche `maintenance.upcoming`
- Notification et badge automatiques
- `API: scheduleMaintenance(busId)`

### ✅ Alertes Contrat J-15
- Événement `sponsorship.starts_soon/ends_soon` à J-15
- Notification automatique Admin & Commercial
- `API: checkContractExpiry(contractId)`

## 🔧 Points d'Intégration API

### Dashboard Admin
```typescript
// Rôles & Permissions
API: assignRole(userId, roleId)
API: updateRoleConfig(roleId, settings)

// Routes & Tarifs
API: updateRouteConfig(routeId, settings)
API: getFillingRate()

// Supervision
API: getRealTimeStats()
API: getActiveTrips()

// Paiements & Remboursements (NOUVEAU)
API: getPayments(filters)
API: updatePayment(paymentId, updates)
API: completePayment(paymentId, transactionRef)
API: createRefund(refundData)
API: approveRefund(refundId, adminId)
API: rejectRefund(refundId, reason, adminId)

// Litiges & Résolutions (NOUVEAU)
API: getDisputes(filters)
API: createDispute(disputeData)
API: assignDispute(disputeId, assignedTo, adminId)
API: escalateDispute(disputeId, adminId, reason)
API: resolveDispute(disputeId, resolution)
API: addDisputeEvidence(disputeId, evidence)

// Gestion Voyageurs (NOUVEAU)
API: getPassengersByTrip(tripId)
API: addPassengerToTrip(tripData)
API: updatePassenger(passengerId, updates)
API: removePassengerFromTrip(passengerId, reason)
API: transferPassenger(passengerId, fromTripId, toTripId)
API: checkSeatAvailability(tripId, seatNumber)

// Contrôle d'Accès (NOUVEAU)
API: getAccessControls(filters)
API: activateUserAccess(userId, adminId)
API: suspendUserAccess(userId, reason, adminId)
API: blockUserAccess(userId, reason, adminId)
API: updateUserPermissions(userId, permissions, adminId)
API: forceLogout(userId, adminId, reason)
API: checkLoginPermission(userId)
```

### Dashboard Agent
```typescript
// Opérations terrain
API: createOnSiteReservation(data)
API: generatePassengerListPDF(tripId)
API: initiateRefund(ticketId)
API: reconcilePayment(transactionId)
```

### Dashboard Chauffeur
```typescript
// Missions & Bus
API: getUpcomingTrips(driverId)
API: getPassengerListPDF(tripId) // offline-ready
API: getBusDetails(busId)
API: reportIncident({type, description, location})
```

## 📱 Fonctionnalités Techniques

### Système de Notifications
- Notifications en temps réel entre dashboards
- Système d'alertes automatiques selon critères métier
- Badge et compteurs non lus

### Mode Hors Ligne (Driver)
- Liste passagers disponible offline
- Synchronisation différée des incidents
- Indicateur de statut réseau

### Validation & Logs
- Chaque action génère un log horodaté
- Validation des délais (48h pour remboursements)
- Logs d'audit pour traçabilité

## 🎨 Design System

### Couleurs Principales
- **Principal** : `rgba(192, 54, 24, 0.9)` (Rouge Karis)
- **Succès** : Vert pour validations et confirmations
- **Attention** : Orange pour alertes maintenance
- **Erreur** : Rouge pour incidents critiques

### Responsive Design
- Mobile-first pour dashboard chauffeur
- Tablet-friendly pour dashboard agent
- Desktop optimisé pour dashboard admin

## 🔐 Sécurité & Permissions

### Système de Rôles
- **Admin** : Accès complet à toutes fonctionnalités
- **Agent** : Opérations terrain + validations
- **Chauffeur** : Consultation missions + signalement incidents

### Contrôle d'Accès
- Vérification des permissions avant chaque action
- Séparation claire des responsabilités
- Logs d'audit pour toutes les actions sensibles

## 🚀 Prêt pour Production

### Backend Integration
- Tous les composants incluent des commentaires API détaillés
- Placeholders pour intégration immédiate
- Architecture modulaire pour extension

### Workflow Métier
- Implémente des flux métier authentiques
- Critères d'acceptation métier respectés
- Prêt pour utilisation réelle

### Communication Inter-Dashboard
- Contextes React partagés pour synchronisation temps réel
- Architecture scalable pour ajout de nouveaux rôles
- Système d'événements pour coordination globale

---

**Focus on production-ready UX, real-world workflow design, and backend-ready interactive components. The three dashboards communicate with a shared API but have clearly separated roles and permissions.**