import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Edit, Eye, Download, Search, Filter, Ticket, CreditCard, Phone, Mail, User, MapPin } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { toast } from 'sonner';
import { useOperationalData } from '../contexts/OperationalDataContext';

export const TicketManagementTab: React.FC = () => {
  const { trips } = useOperationalData();
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Générer des billets d'exemple
  const tickets = Array.from({ length: 20 }, (_, i) => ({
    id: `ticket-${i + 1}`,
    reference: `KC-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
    passenger: {
      name: `Passager ${i + 1}`,
      phone: `+241 ${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
      email: `passager${i + 1}@email.com`,
      idNumber: `${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`
    },
    trip: trips[i % trips.length],
    seat: Math.floor(Math.random() * 40) + 1,
    price: trips[i % trips.length]?.price || 15000,
    status: ['confirmed', 'pending', 'cancelled', 'used'][Math.floor(Math.random() * 4)],
    paymentMethod: ['cash', 'mobile', 'card'][Math.floor(Math.random() * 3)],
    paymentStatus: Math.random() > 0.2 ? 'paid' : 'pending',
    bookingDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    travelDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: i % 3 === 0 ? 'Bagages supplémentaires' : i % 5 === 0 ? 'Demande siège fenêtre' : ''
  }));

  // Statistiques
  const stats = {
    totalTickets: tickets.length,
    confirmedTickets: tickets.filter(t => t.status === 'confirmed').length,
    pendingTickets: tickets.filter(t => t.status === 'pending').length,
    totalRevenue: tickets.filter(t => t.paymentStatus === 'paid').reduce((sum, t) => sum + t.price, 0)
  };

  // Filtrer les billets
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = searchQuery === '' || 
      ticket.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.passenger.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.passenger.phone.includes(searchQuery);
    
    const matchesStatus = selectedStatus === 'all' || ticket.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateTicket = () => {
    // API: createTicket()
    toast.success('Billet créé avec succès');
    setShowNewTicketModal(false);
  };

  const handleDownloadTicket = (ticketId: string) => {
    // API: generateTicketPDF(ticketId)
    toast.success('Billet téléchargé');
  };

  const handleSendTicket = (ticketId: string) => {
    // API: sendTicketByEmail(ticketId)
    toast.success('Billet envoyé par email');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'used': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmé';
      case 'pending': return 'En attente';
      case 'cancelled': return 'Annulé';
      case 'used': return 'Utilisé';
      default: return status;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'cash': return 'Espèces';
      case 'mobile': return 'Mobile Money';
      case 'card': return 'Carte bancaire';
      default: return method;
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Billets</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalTickets}</p>
              </div>
              <Ticket className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Confirmés</p>
                <p className="text-2xl font-bold text-green-600">{stats.confirmedTickets}</p>
              </div>
              <Ticket className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En Attente</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingTickets}</p>
              </div>
              <Ticket className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenus</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.totalRevenue.toLocaleString()}
                </p>
              </div>
              <CreditCard className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et actions */}
      <div className="flex justify-between items-center space-x-4">
        <div className="flex space-x-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher par référence, nom ou téléphone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="confirmed">Confirmés</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="cancelled">Annulés</SelectItem>
              <SelectItem value="used">Utilisés</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Trajet" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les trajets</SelectItem>
              {trips.map((trip) => (
                <SelectItem key={trip.id} value={trip.id}>
                  {trip.departure} → {trip.arrival}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Dialog open={showNewTicketModal} onOpenChange={setShowNewTicketModal}>
          <DialogTrigger asChild>
            <Button style={{ backgroundColor: '#C03618' }} className="text-white">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Billet
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Créer un nouveau billet</DialogTitle>
              <DialogDescription>
                Émettez un billet manuel pour un passager
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* Informations passager */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Informations du passager
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="passenger-name">Nom complet *</Label>
                    <Input id="passenger-name" placeholder="Jean Dupont" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passenger-phone">Téléphone *</Label>
                    <Input id="passenger-phone" placeholder="+241 01 23 45 67" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="passenger-email">Email</Label>
                    <Input id="passenger-email" type="email" placeholder="jean.dupont@email.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passenger-id">Pièce d'identité</Label>
                    <Input id="passenger-id" placeholder="Numéro CNI/Passeport" />
                  </div>
                </div>
              </div>

              {/* Détails du voyage */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Détails du voyage
                </h4>
                <div className="space-y-2">
                  <Label htmlFor="trip-select">Trajet *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un trajet..." />
                    </SelectTrigger>
                    <SelectContent>
                      {trips.filter(t => t.status === 'active').map((trip) => (
                        <SelectItem key={trip.id} value={trip.id}>
                          {trip.departure} → {trip.arrival} - {trip.departureTime} ({trip.price.toLocaleString()} FCFA)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="travel-date">Date de voyage *</Label>
                    <Input id="travel-date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seat-number">Numéro de siège</Label>
                    <Input id="seat-number" type="number" placeholder="12" min="1" max="50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seat-preference">Préférence siège</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Aucune" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Aucune préférence</SelectItem>
                        <SelectItem value="window">Près de la fenêtre</SelectItem>
                        <SelectItem value="aisle">Côté allée</SelectItem>
                        <SelectItem value="front">Avant du bus</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Paiement */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Informations de paiement
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ticket-price">Prix (FCFA) *</Label>
                    <Input id="ticket-price" type="number" placeholder="15000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payment-method">Méthode de paiement *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Espèces</SelectItem>
                        <SelectItem value="mobile">Mobile Money</SelectItem>
                        <SelectItem value="card">Carte bancaire</SelectItem>
                        <SelectItem value="transfer">Virement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payment-status">Statut paiement</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="En cours..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paid">Payé</SelectItem>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="failed">Échoué</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Notes supplémentaires */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Notes et demandes spéciales</h4>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes supplémentaires</Label>
                  <Textarea 
                    id="notes" 
                    placeholder="Bagages supplémentaires, demandes spéciales, remarques..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Options d'envoi */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Options d'envoi</h4>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="send-email" className="rounded" defaultChecked />
                    <Label htmlFor="send-email">Envoyer le billet par email</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="send-sms" className="rounded" />
                    <Label htmlFor="send-sms">Envoyer confirmation par SMS</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="print-ticket" className="rounded" />
                    <Label htmlFor="print-ticket">Imprimer le billet immédiatement</Label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowNewTicketModal(false)}>
                Annuler
              </Button>
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Aperçu
              </Button>
              <Button 
                style={{ backgroundColor: '#C03618' }} 
                className="text-white"
                onClick={handleCreateTicket}
              >
                <Ticket className="h-4 w-4 mr-2" />
                Émettre le billet
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table des billets */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des billets ({filteredTickets.length})</CardTitle>
          <CardDescription>
            Gérez tous les billets émis pour vos trajets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Référence</TableHead>
                  <TableHead>Passager</TableHead>
                  <TableHead>Trajet</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Siège</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Paiement</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.slice(0, 15).map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{ticket.reference}</div>
                        <div className="text-sm text-gray-500">
                          {ticket.bookingDate}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{ticket.passenger.name}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {ticket.passenger.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {ticket.trip.departure} → {ticket.trip.arrival}
                        </div>
                        <div className="text-sm text-gray-500">
                          {ticket.trip.departureTime}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{ticket.travelDate}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">Siège {ticket.seat}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {ticket.price.toLocaleString()} FCFA
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{getPaymentMethodLabel(ticket.paymentMethod)}</div>
                        <Badge 
                          variant={ticket.paymentStatus === 'paid' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {ticket.paymentStatus === 'paid' ? 'Payé' : 'En attente'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(ticket.status)}>
                        {getStatusLabel(ticket.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownloadTicket(ticket.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSendTicket(ticket.id)}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredTickets.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucun billet trouvé pour les critères sélectionnés
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};