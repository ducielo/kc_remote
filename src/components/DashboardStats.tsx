import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Bus, 
  DollarSign, 
  Calendar,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface StatItem {
  id: string;
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  description: string;
  color: string;
}

interface DashboardStatsProps {
  className?: string;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ className = '' }) => {
  const [stats, setStats] = useState<StatItem[]>([
    {
      id: 'bookings',
      title: 'Réservations',
      value: '1,234',
      change: 12.5,
      trend: 'up',
      icon: <Users className="w-5 h-5" />,
      description: 'Ce mois',
      color: 'text-blue-600'
    },
    {
      id: 'revenue',
      title: 'Revenus',
      value: '2.5M XAF',
      change: 8.2,
      trend: 'up',
      icon: <DollarSign className="w-5 h-5" />,
      description: 'Ce mois',
      color: 'text-green-600'
    },
    {
      id: 'trips',
      title: 'Trajets actifs',
      value: '23',
      change: -2.1,
      trend: 'down',
      icon: <Bus className="w-5 h-5" />,
      description: 'En cours',
      color: 'text-purple-600'
    },
    {
      id: 'occupancy',
      title: 'Taux d\'occupation',
      value: '78%',
      change: 5.3,
      trend: 'up',
      icon: <Activity className="w-5 h-5" />,
      description: 'Moyenne',
      color: 'text-orange-600'
    }
  ]);

  const [isLoading, setIsLoading] = useState(true);

  // Simulate real-time data updates
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    
    const interval = setInterval(() => {
      setStats(prev => prev.map(stat => ({
        ...stat,
        change: stat.change + (Math.random() - 0.5) * 2,
        trend: Math.random() > 0.5 ? 'up' : stat.trend === 'up' ? 'down' : 'up'
      })));
    }, 10000); // Update every 10 seconds

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const getTrendIcon = (trend: StatItem['trend']) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getTrendColor = (trend: StatItem['trend']) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {stats.map((stat, index) => (
        <motion.div
          key={stat.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={stat.color}>
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {stat.description}
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  {getTrendIcon(stat.trend)}
                  <span className={`text-sm font-medium ${getTrendColor(stat.trend)}`}>
                    {Math.abs(stat.change).toFixed(1)}%
                  </span>
                </div>
              </div>
              
              {/* Progress bar for occupancy */}
              {stat.id === 'occupancy' && (
                <div className="mt-3">
                  <Progress 
                    value={parseInt(stat.value.replace('%', ''))} 
                    className="h-2"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};