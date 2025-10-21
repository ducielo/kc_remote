# 🧪 Guide de Test - Synchronisation Agent → Public

Ce guide vous montre comment tester la synchronisation entre le dashboard de l'agent contrôleur et la page publique.

## 🎯 Objectif

Vérifier que lorsqu'un agent crée une réservation dans son dashboard, elle apparaît :
1. ✅ Dans la liste "Réservations du jour" du dashboard agent
2. ✅ Dans le modal "Détails du trajet" sur la page publique

---

## 📋 Prérequis

- Application Karis Continental lancée
- Accès au dashboard Agent Contrôleur
- Accès à la page publique (dans un autre onglet si possible)

---

## 🔬 Test 1 : Création d'une Réservation

### Étape 1 : Ouvrir le Dashboard Agent

1. Cliquer sur **"Espace Professionnel"** dans le header
2. Sélectionner **"Agent Contrôleur"**
3. Se connecter (les identifiants sont pré-remplis)
4. Vous arrivez sur le dashboard agent

### Étape 2 : Créer une Réservation

1. Vous êtes par défaut sur l'onglet **"Réservations sur place"**
2. Remplir le formulaire :
   - **Nom du passager :** Jean-Pierre Moukassa
   - **Téléphone :** +241 06 99 88 77
   - **Email :** jp.moukassa@email.com (optionnel)
   - **Trajet :** Sélectionner "Libreville → Port-Gentil (08:00)"
   - **Numéro de siège :** A15
   - **Mode de paiement :** Espèces
   - **Montant :** 25000

3. Cliquer sur **"Créer la réservation"** (bouton orange)

### Étape 3 : Vérifier dans le Dashboard Agent

✅ **Résultat attendu :**
- Toast de succès avec le numéro de ticket (ex: "Ticket: TK123456")
- La nouvelle réservation apparaît dans le tableau "Réservations du jour" ci-dessous
- Le formulaire est réinitialisé

📸 **Capture d'écran :**
![Image de la section réservations](image-placeholder)

---

## 🔬 Test 2 : Vérification sur la Page Publique

### Étape 1 : Aller sur la Page Publique

1. Ouvrir un nouvel onglet (ou retourner à la page d'accueil)
2. Descendre jusqu'à la section **"Trajets disponibles"**
3. Trouver le trajet **"Libreville → Port-Gentil"** (08:00)

### Étape 2 : Ouvrir les Détails du Trajet

1. Cliquer sur le bouton **"Voir Détails"** du trajet
2. Un modal s'ouvre avec 2 onglets : **Informations** et **Passagers**

### Étape 3 : Vérifier l'Onglet Passagers

1. Cliquer sur l'onglet **"Passagers"**
2. ✅ **Résultat attendu :**
   - Vous voyez la réservation que vous venez de créer
   - Détails affichés : Ticket (TK123456), Jean-Pierre Moukassa, +241 06 99 88 77, Siège A15, 25000 XAF, Statut "Payé"

3. Le compteur des passagers dans l'onglet indique : **"Passagers (X)"** où X est le nombre total

---

## 🔬 Test 3 : Synchronisation Temps Réel

### Scénario : Deux onglets ouverts simultanément

1. **Onglet 1 :** Dashboard Agent
2. **Onglet 2 :** Page Publique avec le modal "Détails du trajet" ouvert sur l'onglet "Passagers"

### Actions :

1. Dans l'onglet 1 (Agent), créer une nouvelle réservation
2. Observer l'onglet 2 (Public)

✅ **Résultat attendu :**
- Un toast apparaît : "Une nouvelle réservation a été ajoutée à ce trajet"
- La liste des passagers se met à jour automatiquement
- Le compteur "Passagers (X)" s'incrémente

🎨 **Indicateur visuel :**
- En bas à droite de la page, un panneau vert "Synchronisation en temps réel" apparaît
- Il affiche : "Nouvelle réservation: Jean-Pierre Moukassa"

---

## 🔬 Test 4 : Multiples Réservations

### Objectif : Créer 3 réservations successives

1. Créer la réservation 1 :
   - Nom : Alice Obame
   - Téléphone : +241 06 11 22 33
   - Trajet : Libreville → Franceville (06:00)
   - Siège : B10
   - Montant : 35000

2. Créer la réservation 2 :
   - Nom : Bruno Nze
   - Téléphone : +241 06 44 55 66
   - Trajet : Libreville → Franceville (06:00)
   - Siège : B11
   - Montant : 35000

3. Créer la réservation 3 :
   - Nom : Claire Ndong
   - Téléphone : +241 06 77 88 99
   - Trajet : Libreville → Franceville (06:00)
   - Siège : B12
   - Montant : 35000

### Vérification :

✅ **Dashboard Agent :**
- Les 3 réservations apparaissent dans le tableau
- Triées par ordre de création (la plus récente en haut)

✅ **Page Publique (Modal Détails du trajet Libreville → Franceville) :**
- Onglet "Passagers (3)"
- Les 3 réservations sont listées dans le tableau
- Informations complètes pour chaque passager

---

## 🐛 Debugging

### Si la réservation n'apparaît pas dans le Dashboard Agent :

1. Ouvrir la console (F12)
2. Chercher le message : `✅ Agent → Public sync: Nouvelle réservation créée`
3. Vérifier que `getAllReservations()` retourne bien les données

### Si la réservation n'apparaît pas dans le Modal Public :

1. Ouvrir la console (F12)
2. Chercher l'événement : `agent:reservation:created`
3. Vérifier que le `tripId` correspond bien au trajet sélectionné

### Commandes de debug dans la console :

```javascript
// Voir toutes les réservations
window.addEventListener('agent:reservation:created', (e) => {
  console.log('🎫 Réservation créée:', e.detail);
});

// Forcer un rafraîchissement
window.location.reload();
```

---

## 📊 Données de Test Pré-remplies

Pour faciliter les tests, utilisez ces données :

| Nom | Téléphone | Trajet | Siège | Montant |
|-----|-----------|--------|-------|---------|
| Jean Obiang | +241 06 12 34 56 | LBV → PG (08:00) | A12 | 25000 |
| Marie Ella | +241 06 23 45 67 | LBV → FCV (06:00) | B05 | 35000 |
| Paul Biyogo | +241 06 34 56 78 | LBV → Oyem (09:30) | C08 | 22000 |
| Sophie Mba | +241 06 45 67 89 | LBV → PG (14:00) | A20 | 22000 |

---

## ✅ Checklist de Validation

- [ ] La réservation créée apparaît dans "Réservations du jour" (Dashboard Agent)
- [ ] Le toast de succès affiche le numéro de ticket
- [ ] Le formulaire se réinitialise après création
- [ ] La réservation apparaît dans le modal "Détails du trajet" (Page Publique)
- [ ] L'onglet "Passagers" affiche le bon nombre de réservations
- [ ] Le panneau de synchronisation temps réel s'affiche en bas à droite
- [ ] Les informations du passager sont complètes et correctes
- [ ] Le statut du paiement est correct (Payé/En attente)
- [ ] Plusieurs réservations peuvent être créées successivement

---

## 🎥 Vidéo Démo

_(À venir : Enregistrez une vidéo de démonstration de 2 minutes)_

---

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez que tous les providers sont actifs dans `App.tsx`
2. Consultez `/SYNCHRONISATION.md` pour la documentation complète
3. Vérifiez la console pour les erreurs JavaScript

---

**Dernière mise à jour :** 8 octobre 2025  
**Version :** 1.0.0  
**Testé par :** Équipe Karis Continental
