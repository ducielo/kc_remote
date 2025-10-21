# ⚡ Référence Rapide - Dashboard Administrateur

## 🎯 Accès Rapide aux Nouvelles Fonctionnalités

### 💳 Paiements & Remboursements

**Comment approuver un remboursement ?**
```typescript
1. Allez dans : Dashboard Admin → Paiements & Remboursements
2. Cliquez sur l'onglet "Remboursements"
3. Trouvez la demande de remboursement (filtrez par statut: "pending")
4. Cliquez sur "Approuver"
5. Confirmez l'approbation
```

**Comment modifier un paiement échoué ?**
```typescript
1. Dashboard Admin → Paiements & Remboursements
2. Filtrez par statut: "failed"
3. Cliquez sur l'icône "Eye" pour voir les détails
4. Cliquez sur "Modifier"
5. Changez le statut vers "completed" ou "pending"
6. Ajoutez une référence de transaction si nécessaire
7. Sauvegardez
```

**Statistiques disponibles :**
- Total des paiements
- Montant total des revenus
- Paiements en attente / complétés / échoués
- Remboursements traités

---

### ⚖️ Litiges & Résolutions

**Comment résoudre un litige urgent ?**
```typescript
1. Dashboard Admin → Litiges & Résolutions
2. Filtrez par priorité: "urgent"
3. Cliquez sur le litige
4. Cliquez sur "Résoudre"
5. Choisissez l'action :
   - Remboursement complet (refund)
   - Remboursement partiel (partial-refund)
   - Compensation (compensation)
   - Explication (explanation)
6. Remplissez les détails
7. Confirmez la résolution
```

**Comment escalader un litige ?**
```typescript
1. Dashboard Admin → Litiges & Résolutions
2. Trouvez le litige concerné
3. Cliquez sur "Escalader"
4. Ajoutez une raison
5. La priorité passe automatiquement à "urgent"
```

**Statuts des litiges :**
- `open` - Nouveau litige
- `investigating` - En cours d'investigation
- `escalated` - Escaladé (priorité haute)
- `resolved` - Résolu
- `closed` - Fermé
- `rejected` - Rejeté

---

### 👥 Gestion des Voyageurs

**Comment ajouter un voyageur manuellement ?**
```typescript
1. Dashboard Admin → Gestion Voyageurs
2. Sélectionnez un trajet dans la liste déroulante
3. Cliquez sur "Ajouter un voyageur"
4. Remplissez le formulaire :
   - Nom du voyageur
   - Téléphone
   - Email (optionnel)
   - Numéro de siège (vérification auto de disponibilité)
   - Prix du billet
   - Méthode de paiement (cash, mobile-money, card)
   - Notes (optionnel)
5. Cliquez sur "Ajouter"
```

**Comment transférer un voyageur vers un autre trajet ?**
```typescript
1. Dashboard Admin → Gestion Voyageurs
2. Sélectionnez le trajet actuel
3. Trouvez le voyageur concerné
4. Cliquez sur "Transférer"
5. Choisissez le trajet de destination
6. Sélectionnez le nouveau siège
7. Ajoutez la raison du transfert (obligatoire)
8. Gérez la différence de prix si nécessaire
9. Confirmez le transfert
```

**Comment annuler un voyageur ?**
```typescript
1. Dashboard Admin → Gestion Voyageurs
2. Sélectionnez le trajet
3. Trouvez le voyageur
4. Cliquez sur "Supprimer"
5. Ajoutez la raison d'annulation (obligatoire)
6. Cochez "Demande de remboursement" si applicable
7. Confirmez
```

**Statuts des voyageurs :**
- `confirmed` - Réservation confirmée
- `checked-in` - Check-in effectué
- `boarded` - Embarqué
- `no-show` - Non présenté
- `cancelled` - Annulé
- `transferred` - Transféré vers un autre trajet

---

### 🔒 Contrôle d'Accès

**Comment créer un employé (agent ou chauffeur) ?**
```typescript
1. Dashboard Admin → Contrôle d'Accès
2. Cliquez sur le bouton "Créer un employé" (en haut à droite)
3. Remplissez le formulaire :
   - Choisissez le rôle : Agent/Contrôleur ou Chauffeur
   - Nom complet (obligatoire)
   - Téléphone (obligatoire)
   - Email (optionnel)
4. Cliquez sur "Créer l'employé"
5. Une fenêtre s'ouvre avec :
   - Nom d'utilisateur généré automatiquement
   - Mot de passe sécurisé généré
   - Lien de connexion spécifique au rôle
6. Copiez les identifiants (bouton copier pour chaque élément)
7. Envoyez ces informations à l'employé par email/SMS/WhatsApp
8. L'employé peut maintenant se connecter avec ses identifiants
```

**Format des identifiants générés :**
- **Agent** : Nom d'utilisateur = AG + initiales + nombre (ex: AGjd1234)
- **Chauffeur** : Nom d'utilisateur = DR + initiales + nombre (ex: DRjd5678)
- **Mot de passe** : 12 caractères aléatoires sécurisés

**Liens de connexion :**
- **Espace Agent** : `https://votredomaine.com/?login=agent`
- **Espace Chauffeur** : `https://votredomaine.com/?login=driver`

**Comment bloquer un agent ou chauffeur ?**
```typescript
1. Dashboard Admin → Contrôle d'Accès
2. Filtrez par rôle (agent ou driver)
3. Trouvez l'utilisateur concerné
4. Cliquez sur "Bloquer"
5. Ajoutez une raison de blocage (obligatoire)
6. Ajoutez des notes (optionnel)
7. Confirmez le blocage
```

**Comment suspendre temporairement un utilisateur ?**
```typescript
1. Dashboard Admin → Contrôle d'Accès
2. Trouvez l'utilisateur
3. Cliquez sur "Suspendre"
4. Ajoutez une raison (obligatoire)
5. Définissez une date d'expiration (optionnel)
6. Ajoutez des notes
7. Confirmez
```

**Comment gérer les permissions ?**
```typescript
1. Dashboard Admin → Contrôle d'Accès
2. Cliquez sur un utilisateur
3. Section "Permissions"
4. Cliquez sur "Gérer les permissions"
5. Cochez/décochez les permissions nécessaires
6. Sauvegardez
```

**Statuts d'accès :**
- `active` - Accès actif
- `suspended` - Suspendu temporairement
- `blocked` - Bloqué définitivement
- `inactive` - Inactif (jamais connecté)

---

## 🔄 Flux de Travail Typiques

### Traitement d'une Demande de Remboursement

```
1. Voyageur effectue un paiement (Front-Office)
   ↓
2. Voyageur ouvre un litige pour annulation
   ↓
3. Admin va dans "Litiges & Résolutions"
   ↓
4. Admin résout le litige avec action "refund"
   ↓
5. Une demande de remboursement est créée automatiquement
   ↓
6. Admin va dans "Paiements & Remboursements" → onglet "Remboursements"
   ↓
7. Admin approuve le remboursement
   ↓
8. Admin traite le remboursement (clique sur "Traiter")
   ↓
9. Admin complète le remboursement une fois le virement effectué
   ↓
10. Le voyageur reçoit son remboursement
```

### Gestion d'un Problème de Réservation

```
1. Voyageur signale un problème de siège
   ↓
2. Admin va dans "Litiges & Résolutions"
   ↓
3. Admin crée un litige (si pas créé automatiquement)
   ↓
4. Admin va dans "Gestion Voyageurs"
   ↓
5. Admin modifie le siège du voyageur
   ↓
6. Admin retourne dans "Litiges & Résolutions"
   ↓
7. Admin résout le litige avec action "explanation"
   ↓
8. Admin ferme le litige
```

### Blocage d'un Agent Problématique

```
1. Signalement d'un problème avec un agent
   ↓
2. Admin va dans "Contrôle d'Accès"
   ↓
3. Admin filtre par rôle "agent"
   ↓
4. Admin trouve l'agent concerné
   ↓
5. Admin vérifie l'historique de connexion
   ↓
6. Admin suspend temporairement l'agent (7 jours)
   ↓
7. Admin ajoute une note expliquant la raison
   ↓
8. L'agent ne peut plus se connecter pendant 7 jours
   ↓
9. Après 7 jours, l'accès est automatiquement rétabli
   OU
10. Admin décide de bloquer définitivement si nécessaire
```

---

## 🎨 Codes Couleur des Badges

### Paiements
- 🟢 **Vert** - Paiement complété
- 🟡 **Jaune** - Paiement en attente
- 🔴 **Rouge** - Paiement échoué
- 🟣 **Violet** - Remboursé

### Litiges
- 🔵 **Bleu** - Nouveau (open)
- 🟡 **Jaune** - En investigation
- 🔴 **Rouge** - Urgent (escalated)
- 🟢 **Vert** - Résolu
- ⚫ **Gris** - Fermé/Rejeté

### Voyageurs
- 🟢 **Vert** - Confirmé
- 🔵 **Bleu** - Check-in effectué
- 🟣 **Violet** - Embarqué
- 🟡 **Jaune** - No-show
- 🔴 **Rouge** - Annulé

### Contrôle d'Accès
- 🟢 **Vert** - Actif
- 🟡 **Jaune** - Suspendu
- 🔴 **Rouge** - Bloqué
- ⚫ **Gris** - Inactif

---

## ⚙️ Raccourcis Clavier (à venir)

Les raccourcis clavier seront ajoutés dans une future version :

- `Ctrl + P` : Aller à Paiements
- `Ctrl + L` : Aller à Litiges
- `Ctrl + V` : Aller à Voyageurs
- `Ctrl + A` : Aller à Contrôle d'Accès
- `Ctrl + S` : Sauvegarder (dans les formulaires)
- `Esc` : Fermer le modal/dialog actif

---

## 🔍 Filtres et Recherche

### Paiements
- **Statut :** pending, completed, failed, refunded
- **Méthode :** mobile-money, card, cash
- **Date :** Plage de dates personnalisée
- **Recherche :** Nom, email, téléphone, référence de transaction

### Litiges
- **Statut :** open, investigating, escalated, resolved, closed, rejected
- **Type :** payment, service, refund, booking, driver, vehicle, other
- **Priorité :** low, medium, high, urgent
- **Recherche :** Référence de réservation, nom du voyageur

### Voyageurs
- **Trajet :** Sélection du trajet
- **Statut :** confirmed, checked-in, boarded, no-show, cancelled, transferred
- **Recherche :** Nom, email, téléphone, numéro de siège

### Contrôle d'Accès
- **Rôle :** agent, driver
- **Statut d'accès :** active, suspended, blocked, inactive
- **Recherche :** Nom, email, téléphone

---

## 📊 Exports Disponibles

Toutes les sections permettent d'exporter les données en format CSV :

- **Paiements** → Export CSV avec filtres appliqués
- **Litiges** → Export CSV avec filtres appliqués
- **Voyageurs** → Export liste des voyageurs par trajet
- **Contrôle d'Accès** → Export des contrôles d'accès

**Comment exporter ?**
1. Appliquez les filtres souhaités
2. Cliquez sur le bouton "Export CSV"
3. Le fichier CSV est téléchargé automatiquement

---

## 🚨 Actions Importantes à Retenir

### ✅ À FAIRE :
- **Créer les comptes employés dès leur embauche**
- **Envoyer immédiatement les identifiants aux nouveaux employés**
- **Conserver une copie sécurisée des identifiants générés**
- Toujours ajouter une raison lors de modifications de voyageurs
- Vérifier la disponibilité des sièges avant d'ajouter un voyageur
- Documenter les résolutions de litiges avec des notes claires
- Approuver les remboursements rapidement (< 48h)
- Vérifier l'historique de connexion avant de bloquer un utilisateur

### ❌ À ÉVITER :
- **Ne jamais partager les identifiants par des canaux non sécurisés**
- **Ne pas créer de comptes pour des personnes non employées**
- **Ne pas réutiliser les mots de passe**
- Ne jamais supprimer un voyageur sans raison valide
- Ne pas bloquer un utilisateur sans investigation préalable
- Ne pas approuver un remboursement sans vérifier le litige associé
- Ne pas modifier un paiement complété sans raison majeure
- Ne pas ignorer les litiges urgents

---

## 🔗 Liens Rapides Documentation

- **[Guide Complet des Fonctionnalités Admin](/back-office/ADMIN_DASHBOARD_FEATURES.md)** - Documentation détaillée
- **[Système de Gestion Paiements/Litiges](/back-office/PAYMENT_DISPUTE_SYSTEM.md)** - Documentation technique
- **[README Back-Office](/back-office/README.md)** - Architecture générale
- **[Index Documentation](/INDEX_DOCUMENTATION.md)** - Toute la documentation

---

## 💡 Conseils et Astuces

### Optimisation du Workflow
1. **Utilisez les filtres** : Gagnez du temps en filtrant les données pertinentes
2. **Favoris** : Ajoutez les sections fréquemment utilisées en favori dans votre navigateur
3. **Recherche globale** : Utilisez la barre de recherche pour trouver rapidement un voyageur ou un paiement
4. **Statistiques** : Consultez les statistiques en haut de chaque section pour une vue d'ensemble rapide

### Résolution Rapide
- **Litiges urgents** : Traitez-les en priorité (triés automatiquement en haut)
- **Remboursements** : Approuvez les demandes légitimes sous 24h
- **Voyageurs no-show** : Marquez-les après le départ du bus pour libérer les statistiques

### Sécurité
- **Double vérification** : Vérifiez toujours avant de bloquer un utilisateur définitivement
- **Historique** : Consultez l'historique complet avant toute action importante
- **Notes** : Documentez toujours vos actions pour la traçabilité

---

## 📞 Support

**En cas de problème :**
1. Vérifiez cette référence rapide
2. Consultez la [documentation complète](/back-office/ADMIN_DASHBOARD_FEATURES.md)
3. Vérifiez les logs dans la console du navigateur (F12)
4. Contactez le support technique

---

**Dernière mise à jour :** 10 Octobre 2025  
**Version :** 1.0.0
