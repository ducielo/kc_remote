import React, { useState } from 'react';
import { DevelopmentModeIndicator } from './components/DevelopmentModeIndicator';
import { Toaster } from './components/ui/sonner';
import { AuthProvider } from './components/AuthContext';
import { AdminContentProvider } from './components/contexts/AdminContentProvider';
import { PublicDataProvider } from './components/contexts/PublicDataContext';
import { RolePermissionProvider } from './components/contexts/RolePermissionContext';
import { OperationalDataProvider } from './components/contexts/OperationalDataContext';
import { AlertProvider } from './components/contexts/AlertContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Statistics } from './components/Statistics';
import { DestinationSection } from './components/DestinationSection';
import { DestinationCards } from './components/DestinationCards';
import { InteractiveMap } from './components/InteractiveMap';
import { PopularDestinationsGabon } from './components/PopularDestinationsGabon';
import { AvailableTrips } from './components/AvailableTrips';
import { Footer } from './components/Footer';
import { AuthenticationPage } from './components/AuthenticationPage';
import { ContactPage } from './components/ContactPage';
import { AuthenticatedApp } from './back-office/components/auth/AuthenticatedApp';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthentication, setShowAuthentication] = useState(false);
  const [showContactPage, setShowContactPage] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState<{
    role: 'admin' | 'agent' | 'driver';
  } | null>(null);

  const [searchResults, setSearchResults] = useState<{
    departure: string;
    arrival: string;
    date: string;
  } | null>(null);

  const handleSearch = (searchData: { departure: string; arrival: string; date: string; passengers: number }) => {
    setSearchResults({
      departure: searchData.departure,
      arrival: searchData.arrival,
      date: searchData.date
    });
    
    setTimeout(() => {
      const tripsSection = document.getElementById('available-trips');
      if (tripsSection) {
        tripsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleAuthenticated = (role: 'admin' | 'agent' | 'driver') => {
    setAuthenticatedUser({ role });
    setShowAuthentication(false);
  };

  const handleLogout = () => {
    setAuthenticatedUser(null);
  };

  // Écouter l'événement pour afficher la page de contact
  React.useEffect(() => {
    const handleShowContact = () => {
      setShowContactPage(true);
    };

    window.addEventListener('show-contact-page', handleShowContact);

    return () => {
      window.removeEventListener('show-contact-page', handleShowContact);
    };
  }, []);

  // Wrapper avec tous les providers
  const AppWithProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <AuthProvider>
      <AdminContentProvider>
        <PublicDataProvider>
          <RolePermissionProvider>
            <OperationalDataProvider>
              <AlertProvider>
                {children}
              </AlertProvider>
            </OperationalDataProvider>
          </RolePermissionProvider>
        </PublicDataProvider>
      </AdminContentProvider>
    </AuthProvider>
  );

  // Si l'utilisateur est authentifié, afficher le dashboard correspondant
  if (authenticatedUser) {
    return (
      <AppWithProviders>
        <AuthenticatedApp
          role={authenticatedUser.role}
          onLogout={handleLogout}
        />
        <Toaster />
        <DevelopmentModeIndicator />
      </AppWithProviders>
    );
  }

  // Interface publique complète de Karis Continental
  return (
    <AppWithProviders>
      <div className="min-h-screen bg-white">
        <Header 
          isMenuOpen={isMenuOpen} 
          setIsMenuOpen={setIsMenuOpen} 
          onShowAuth={() => setShowAuthentication(true)}
        />
        
        <main>
          <Hero onSearch={handleSearch} />
          <Features />
          <Statistics />
          <DestinationSection />
          <DestinationCards />
          <InteractiveMap />
          
          <div id="available-trips">
            <AvailableTrips searchResults={searchResults} />
          </div>
          
          <PopularDestinationsGabon />
        </main>
        
        <Footer />
        
        <Toaster />
        <DevelopmentModeIndicator />

        {/* Modal d'authentification */}
        {showAuthentication && (
          <AuthenticationPage
            onClose={() => setShowAuthentication(false)}
            onAuthenticated={handleAuthenticated}
          />
        )}

        {/* Page de contact */}
        {showContactPage && (
          <ContactPage onClose={() => setShowContactPage(false)} />
        )}
      </div>
    </AppWithProviders>
  );
}