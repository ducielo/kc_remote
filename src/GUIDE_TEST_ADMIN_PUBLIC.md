# 🧪 Guide de Test : Synchronisation Admin → Public

## 🎯 Objectif

Valider que les trajets créés/modifiés/supprimés par l'admin apparaissent en temps réel sur la page publique.

---

## ⚡ Test Rapide (2 minutes)

### Prérequis
- Ouvrir 2 onglets de navigateur côte à côte

### Étapes

#### 1️⃣ **Préparation**

**Onglet 1 - Dashboard Admin :**
```
1. Aller sur http://localhost:5173/
2. Cliquer sur "Se connecter"
3. Sélectionner "Administrateur"
4. Entrer les identifiants admin
5. Vous êtes maintenant dans le Dashboard Admin
```

**Onglet 2 - Page Publique :**
```
1. Ouvrir un nouvel onglet
2. Aller sur http://localhost:5173/
3. Rester sur la page d'accueil publique
4. Scroller jusqu'à la section "Trajets disponibles"
```

---

#### 2️⃣ **Test 1 : Publier un trajet de démonstration**

**Dans l'onglet Dashboard Admin :**
```
1. Cliquer sur l'onglet "Gestion Opérationnelle"
2. Cliquer sur l'onglet "Trajets"
3. Cliquer sur le bouton "Test Sync" (avec icône 🌐)
4. Observer la notification : "🚀 Trajet de démonstration publié !"
```

**Dans l'onglet Page Publique :**
```
✅ Un nouveau trajet "Libreville → Oyem" apparaît instantanément
✅ Prix : 18 000 FCFA
✅ Horaire : 09:00 - 15:00
✅ Places : 40 disponibles
✅ Notification toast : "Nouveau trajet disponible: Libreville → Oyem"
```

**Résultat attendu :** ✅ Trajet visible en temps réel sans rechargement

---

#### 3️⃣ **Test 2 : Publier un trajet existant**

**Dans l'onglet Dashboard Admin :**
```
1. Dans la liste des trajets, trouver un trajet existant
2. Cliquer sur le bouton 🌐 (Globe) à côté du trajet
3. Observer la notification : "Trajet publié sur la page publique"
```

**Dans l'onglet Page Publique :**
```
✅ Le trajet apparaît dans "Trajets disponibles"
✅ Toutes les informations sont correctes (prix, horaires, places)
✅ Notification toast s'affiche
```

**Résultat attendu :** ✅ Trajet publié avec succès

---

#### 4️⃣ **Test 3 : Supprimer un trajet**

**Dans l'onglet Dashboard Admin :**
```
1. Dans la liste des trajets, trouver le trajet de démonstration
2. Cliquer sur le bouton 🗑️ (Trash) à côté du trajet
3. Observer la notification : "Trajet supprimé"
```

**Dans l'onglet Page Publique :**
```
✅ Le trajet disparaît instantanément de la liste
✅ Notification toast : "Un trajet a été retiré"
```

**Résultat attendu :** ✅ Trajet supprimé en temps réel

---

## 🔍 Tests Détaillés

### Test 4 : Créer un nouveau trajet complet

**Dashboard Admin :**
```
1. Cliquer sur "Nouveau Trajet"
2. Remplir le formulaire :
   - Départ : Libreville
   - Arrivée : Port-Gentil
   - Prix : 25 000 FCFA
   - Heure départ : 08:00
   - Heure arrivée : 14:30
   - Durée : 6.5 heures
   - Places : 50
3. Cocher "WiFi disponible" et "Climatisation"
4. Cliquer sur "Créer le trajet"
5. Cliquer sur le bouton 🌐 pour publier
```

**Page Publique :**
```
✅ Nouveau trajet visible
✅ Informations correctes (prix, horaires, amenities)
✅ Badge "WiFi" visible
✅ Possibilité de réserver
```

---

### Test 5 : Vérifier la persistance

**Étapes :**
```
1. Publier un trajet depuis l'admin
2. Rafraîchir la page publique (F5)
3. Vérifier que le trajet est toujours visible
```

**Résultat attendu :** 
⚠️ Le trajet peut disparaître car les données sont en mémoire  
✅ En production, les données seront persistées en base de données

---

### Test 6 : Tester avec plusieurs trajets

**Dashboard Admin :**
```
1. Publier 3 trajets différents :
   - Libreville → Oyem (18 000 FCFA)
   - Libreville → Franceville (35 000 FCFA)
   - Libreville → Lambaréné (12 000 FCFA)
2. Observer les 3 notifications
```

**Page Publique :**
```
✅ Les 3 trajets apparaissent dans l'ordre
✅ Possibilité de filtrer par ville
✅ Possibilité de rechercher
```

---

## 📊 Console de débogage

### Vérifier les événements émis

**Ouvrir la console du navigateur (F12) :**

Dans le **Dashboard Admin**, après avoir publié un trajet :
```
✅ Admin → Public sync: Trajet publié sur la page publique
```

Dans la **Page Publique**, après réception :
```
✅ 📢 Sync reçu: Trajet publié par l'admin
✅ Données reçues : { trip: { ... } }
```

---

## ⚠️ Problèmes courants

### Le trajet n'apparaît pas sur la page publique

**Solutions :**
1. Vérifier que les deux onglets sont sur le même domaine (localhost)
2. Ouvrir la console et vérifier les erreurs
3. Rafraîchir la page publique
4. Vérifier que PublicDataContext est bien chargé

---

### La notification n'apparaît pas

**Solutions :**
1. Vérifier que le composant `<Toaster />` est présent dans App.tsx
2. Vérifier la console pour des erreurs
3. Tester avec un autre navigateur

---

### Les données ne persistent pas après rafraîchissement

**Explication :**
- En développement, les données sont stockées en mémoire
- En production, utiliser une base de données (Supabase, Firebase, etc.)
- Pour tester la persistance, utiliser localStorage temporairement

---

## 🎯 Checklist de validation

Cochez chaque élément après validation :

- [ ] ✅ Publier un trajet de démonstration fonctionne
- [ ] ✅ Le trajet apparaît instantanément sur la page publique
- [ ] ✅ Les notifications toast s'affichent correctement
- [ ] ✅ Supprimer un trajet fonctionne
- [ ] ✅ Le trajet disparaît de la page publique
- [ ] ✅ Publier plusieurs trajets fonctionne
- [ ] ✅ Les informations affichées sont correctes (prix, horaires, places)
- [ ] ✅ Les événements sont loggés dans la console
- [ ] ✅ Aucune erreur dans la console
- [ ] ✅ Le design UI n'est pas cassé

---

## 🚀 Tests avancés

### Test de performance

**Objectif :** Vérifier que la synchronisation est instantanée

```
1. Chronométrer le temps entre :
   - Clic sur "Test Sync" dans l'admin
   - Apparition du trajet sur la page publique
   
Résultat attendu : < 100ms
```

---

### Test de charge

**Objectif :** Publier plusieurs trajets rapidement

```
1. Cliquer sur "Test Sync" 10 fois rapidement
2. Vérifier que les 10 trajets apparaissent
3. Vérifier qu'il n'y a pas de doublons
4. Vérifier que la page reste réactive
```

---

### Test multi-onglets

**Objectif :** Vérifier la synchronisation sur plusieurs onglets

```
1. Ouvrir 3 onglets de la page publique
2. Publier un trajet depuis l'admin
3. Vérifier que le trajet apparaît dans les 3 onglets simultanément
```

**Résultat attendu :** ✅ Synchronisation sur tous les onglets

---

## 📸 Captures d'écran attendues

### Dashboard Admin - Liste des trajets
```
┌─────────────────────────────────────────────────────┐
│ Trajet              | Prix      | Actions           │
├─────────────────────────────────────────────────────┤
│ Libreville → Oyem   | 18000 FCFA| [✏️] [👁️] [🌐] [🗑️] │
│ Libreville → PG     | 25000 FCFA| [✏️] [👁️] [🌐] [🗑️] │
└─────────────────────────────────────────────────────┘
```

### Page Publique - Trajets disponibles
```
┌─────────────────────────────────────────────────────┐
│ 🚌 Libreville → Oyem                                │
│ Départ : 09:00 | Arrivée : 15:00                    │
│ Prix : 18 000 FCFA | 40 places disponibles          │
│ [Réserver maintenant]                                │
└─────────────────────────────────────────────────────┘
```

---

## ✅ Validation finale

**Le système est validé si :**

1. ✅ Tous les tests rapides passent
2. ✅ Aucune erreur dans la console
3. ✅ Les notifications s'affichent correctement
4. ✅ La synchronisation est instantanée (< 1 seconde)
5. ✅ Le design UI n'est pas cassé
6. ✅ Les données sont cohérentes entre admin et public

---

## 📞 Support

**En cas de problème :**
- Consulter `SYNCHRONISATION_ADMIN_PUBLIC.md` pour la documentation complète
- Vérifier la console du navigateur pour les erreurs
- Tester dans un navigateur différent
- Vérifier que tous les contextes sont bien chargés dans App.tsx

---

**Version :** 1.0.0  
**Date :** 2025-01-08  
**Statut :** ✅ Prêt pour les tests