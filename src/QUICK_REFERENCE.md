# ⚡ Quick Reference - Karis Continental

## 🎯 SÉPARATION FRONT/BACK EFFECTUÉE

### ✅ CE QUI A ÉTÉ FAIT

1. **Structure créée** : `/back-office/components/` avec sous-dossiers
2. **AuthenticatedApp migré** : Fonctionne depuis `/back-office/components/auth/`
3. **3 proxies créés** : AdminDashboardTabbed, AgentDashboardFixed, DriverDashboardSimple
4. **App.tsx mis à jour** : Import depuis back-office
5. **Documentation complète** : 6 guides (2500+ lignes)

### ⏳ CE QUI RESTE À FAIRE

**43 composants à migrer** de `/components/` vers `/back-office/components/`

Voir : `/back-office/GUIDE_MIGRATION_COMPOSANTS.md`

---

## 📁 STRUCTURE

### Front-Office : `/components/`
**Composants publics** : Header, Hero, Features, Footer, AvailableTrips, etc.

### Back-Office : `/back-office/`
**Composants privés** : Dashboards, Gestion, Auth  
**Services API** : AdminService, AgentService, DriverService, etc.  
**Logique métier** : Modules, Types, Utils

---

## 🚀 UTILISATION

### Importer AuthenticatedApp
```tsx
import { AuthenticatedApp } from './back-office/components/auth/AuthenticatedApp';
```

### Utiliser un service API
```tsx
import { TripService } from '../back-office/services/TripService';
const trips = await TripService.getPublishedTrips();
```

### Configurer le backend
```typescript
// /back-office/services/BaseService.ts
private static USE_MOCK = true; // true = mock, false = prod
```

---

## 📚 DOCUMENTATION

**Commencez ici :**
1. [INDEX_DOCUMENTATION.md](/INDEX_DOCUMENTATION.md) - Index complet
2. [RECAPITULATIF_SEPARATION.md](/RECAPITULATIF_SEPARATION.md) - Récap complet
3. [/back-office/GUIDE_MIGRATION_COMPOSANTS.md](/back-office/GUIDE_MIGRATION_COMPOSANTS.md) - Guide migration

**Référence rapide :**
- [TABLEAU_IMPORTS.md](/back-office/TABLEAU_IMPORTS.md) - Chemins d'imports
- [VERIFICATION_SEPARATION.md](/back-office/VERIFICATION_SEPARATION.md) - Tests

**Guides complets :**
- [BACK_OFFICE_INTEGRATION_GUIDE.md](/back-office/BACK_OFFICE_INTEGRATION_GUIDE.md) - Intégration
- [SEPARATION_FRONT_BACK_OFFICE.md](/SEPARATION_FRONT_BACK_OFFICE.md) - Structure

---

## 🔧 MIGRATION RAPIDE

### Étapes pour migrer un composant

1. **Lire** : `/components/MonComposant.tsx`
2. **Identifier** : Tous les imports
3. **Calculer** : Nouveaux chemins (voir tableau)
4. **Copier** : Dans `/back-office/components/[categorie]/MonComposant.tsx`
5. **Mettre à jour** : Tous les imports
6. **Tester** : L'application

### Chemins d'imports depuis dashboards/admin/

```tsx
// Components UI
import { Button } from '../../../../components/ui/button';

// Contextes
import { useAuth } from '../../../../components/AuthContext';

// Services
import { AdminService } from '../../../services/AdminService';

// Composants de gestion
import { TripManagement } from '../../management/shared/TripManagement';
```

Voir : `/back-office/TABLEAU_IMPORTS.md` pour tous les cas

---

## ✅ VÉRIFICATION

### Tests rapides

```bash
# 1. Application démarre
npm run dev

# 2. Page publique fonctionne
# → Ouvrir http://localhost:5173

# 3. Dashboards accessibles
# → Se connecter (admin/agent/driver)
```

### Checklist

- [ ] App démarre sans erreur
- [ ] Page publique OK
- [ ] Connexion dashboards OK
- [ ] Pas d'erreur console

---

## 📊 PROGRESSION

**Composants migrés :** 1/47 (2.1%)  
**Avec proxies :** 4/47 (8.5%)  
**Prochaine étape :** Remplacer les 3 proxies

---

## 🔗 LIENS RAPIDES

**Documentation :**
- [Index](/INDEX_DOCUMENTATION.md)
- [Récapitulatif](/RECAPITULATIF_SEPARATION.md)
- [Guide migration](/back-office/GUIDE_MIGRATION_COMPOSANTS.md)

**Fichiers clés :**
- [App.tsx](/App.tsx)
- [AuthenticatedApp](/back-office/components/auth/AuthenticatedApp.tsx)
- [BaseService](/back-office/services/BaseService.ts)

---

**Date :** 10 Octobre 2025  
**Phase :** 1/3 complétée ✅  
**Statut :** Application fonctionnelle - Migration progressive en cours
