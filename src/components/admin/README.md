# Composants Admin - Dashboard Karis Continental

Ce dossier contient les composants spécialisés pour le dashboard administrateur avec une structure organisée par fonctionnalités.

## 🎯 Architecture des onglets

### Onglets principaux disponibles dans `AdminDashboardTabbed`:

1. **🚌 Trajets** (`TripManagementTab`)
   - Création et gestion des trajets
   - Vue d'ensemble avec statistiques
   - Filtres par statut et ville
   - Actions CRUD complètes

2. **⏰ Horaires** (`ScheduleManagementTab`) 
   - Planification des horaires
   - Assignation bus/chauffeurs
   - Gestion des fréquences
   - Vue calendrier et cartes

3. **🎫 Billets** (`TicketManagementTab`)
   - Émission manuelle de billets
   - Recherche et filtres avancés
   - Gestion des paiements
   - Export et envoi

## 🚀 Fonctionnalités

### TripManagementTab
- ✅ Statistiques en temps réel
- ✅ Création de trajets avec toutes les options
- ✅ Liste complète avec actions
- ✅ Filtres par statut et ville
- ✅ Support des 9 provinces du Gabon

### ScheduleManagementTab  
- ✅ Vue en grille des horaires
- ✅ Gestion des fréquences (quotidien/hebdomadaire/personnalisé)
- ✅ Assignation automatique des ressources
- ✅ Activation/désactivation des horaires

### TicketManagementTab
- ✅ Interface complète de billetterie
- ✅ Recherche multi-critères
- ✅ Gestion des statuts et paiements
- ✅ Export PDF et envoi email
- ✅ Formulaire détaillé de création

## 🎨 Design System

- **Couleur principale**: `#C03618` (rouge Karis Continental)
- **Composants**: ShadCN/UI
- **Icons**: Lucide React
- **Animations**: Motion/React
- **Notifications**: Sonner

## 🔗 Intégration

```tsx
// Dans AdminDashboardTabbed.tsx
<Tabs value={selectedMainTab} onValueChange={setSelectedMainTab}>
  <TabsList className="grid w-full grid-cols-3">
    <TabsTrigger value="trajets">
      <Route className="h-4 w-4" />
      Trajets
    </TabsTrigger>
    <TabsTrigger value="horaires">
      <Clock className="h-4 w-4" />
      Horaires
    </TabsTrigger>
    <TabsTrigger value="billets">
      <Ticket className="h-4 w-4" />
      Billets
    </TabsTrigger>
  </TabsList>

  <TabsContent value="trajets">
    <TripManagementTab />
  </TabsContent>
  
  <TabsContent value="horaires">
    <ScheduleManagementTab />
  </TabsContent>
  
  <TabsContent value="billets">
    <TicketManagementTab />
  </TabsContent>
</Tabs>
```

## 📊 Contexts utilisés

- `useOperationalData()` - Données trajets, bus, chauffeurs
- `useAdminContent()` - Contenu admin
- `usePublicData()` - Synchronisation publique

## 🎯 Points d'extension

- [ ] Intégration API backend
- [ ] Notifications temps réel
- [ ] Export Excel/CSV
- [ ] Impression en masse
- [ ] Dashboard analytique avancé