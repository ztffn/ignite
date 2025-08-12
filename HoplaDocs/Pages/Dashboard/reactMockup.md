import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Clock, MapPin, FileText, Sun, ChevronRight, Wrench, User, Calendar, Utensils, Camera, X, Coffee, Navigation, Languages, Volume2, Phone } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Progress } from './ui/progress';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { HOPLA_COLORS } from './ui/utils';
import WeatherCard from './WeatherCard';
import TripChallengesCard from './TripChallengesCard';
import TravelToolkit from './TravelToolkit';

interface DashboardViewProps {
  trip: any;
  onBack: () => void;
  onShowProfile: () => void;
}

export default function DashboardView({ trip, onBack, onShowProfile }: DashboardViewProps) {
  const [headerExpanded, setHeaderExpanded] = useState(true);
  const [showToolkit, setShowToolkit] = useState(false);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const phraseCardRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState(0);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [isPressed, setIsPressed] = useState(false);
  const [challengesExpanded, setChallengesExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Auto-collapse header after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setHeaderExpanded(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Update current time every 30 seconds for better countdown accuracy
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000); // Update every 30 seconds for more responsive countdown

    return () => clearInterval(timer);
  }, []);

  // Enhanced scroll handling with direction detection
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;
      
      const scrollTop = scrollContainerRef.current.scrollTop;
      const scrollingUp = scrollTop < lastScrollTop;
      const scrollingDown = scrollTop > lastScrollTop;

      if (scrollingUp && !headerExpanded && scrollTop < 100) {
        setHeaderExpanded(true);
      }
      
      if (scrollingDown && headerExpanded && scrollTop > 20) {
        setHeaderExpanded(false);
      }

      setLastScrollTop(scrollTop);
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [headerExpanded, lastScrollTop]);

  // Mock phrases data
  const phrases = [
    {
      french: 'Où est la salle de bain?',
      phonetic: 'oo-eh lah sahl duh ban',
      english: 'Where is the bathroom?'
    },
    {
      french: 'Combien ça coûte?',
      phonetic: 'kom-bee-ahn sah koot',
      english: 'How much does this cost?'
    },
    {
      french: 'Je voudrais commander',
      phonetic: 'zhuh voo-dreh kom-ahn-day',
      english: 'I would like to order'
    },
    {
      french: 'Où est la station de métro?',
      phonetic: 'oo-eh lah stah-see-ohn duh may-tro',
      english: 'Where is the metro station?'
    },
    {
      french: 'Pouvez-vous m\'aider?',
      phonetic: 'poo-vay voo meh-day',
      english: 'Can you help me?'
    }
  ];

  // Enhanced touch handlers with spring physics
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setIsPressed(true);
    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - dragStart.x;
    setDragOffset(deltaX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setIsPressed(false);
    
    const threshold = 80; // Reduced threshold for more responsive interaction
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0 && currentPhraseIndex > 0) {
        setCurrentPhraseIndex(currentPhraseIndex - 1);
      } else if (dragOffset < 0 && currentPhraseIndex < phrases.length - 1) {
        setCurrentPhraseIndex(currentPhraseIndex + 1);
      }
    }
    setDragOffset(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsPressed(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.x;
    setDragOffset(deltaX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setIsPressed(false);
    
    const threshold = 80;
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0 && currentPhraseIndex > 0) {
        setCurrentPhraseIndex(currentPhraseIndex - 1);
      } else if (dragOffset < 0 && currentPhraseIndex < phrases.length - 1) {
        setCurrentPhraseIndex(currentPhraseIndex + 1);
      }
    }
    setDragOffset(0);
  };

  // Mock dashboard data

  // Create realistic demo times based on current time
  const now = new Date();

  // Helper function to create a date from time string (today)
  const parseActivityTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  // Helper function to format current activity remaining time
  const formatRemainingTime = (endTimeString: string, now: Date) => {
    const endTime = parseActivityTime(endTimeString);
    const diffMs = endTime.getTime() - now.getTime();
    
    if (diffMs <= 0) {
      return { text: 'Activity ended', color: 'text-muted-foreground' };
    }

    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const remainingMinutes = diffMinutes % 60;

    if (diffMinutes < 30) {
      return { 
        text: `${diffMinutes}m left`, 
        color: 'text-orange-500' 
      };
    } else if (diffHours === 0) {
      return { 
        text: `${diffMinutes}m left`, 
        color: 'text-muted-foreground' 
      };
    } else {
      if (remainingMinutes === 0) {
        return { 
          text: `${diffHours}h left`, 
          color: 'text-muted-foreground' 
        };
      } else {
        return { 
          text: `${diffHours}h ${remainingMinutes}m left`, 
          color: 'text-muted-foreground' 
        };
      }
    }
  };

  const currentActivity = {
    time: new Date(now.getTime() - 30 * 60 * 1000).toTimeString().slice(0, 5), // Started 30 min ago
    endTime: new Date(now.getTime() + 30 * 60 * 1000).toTimeString().slice(0, 5), // Ends in 30 min
    title: 'Lunch at Café de l\'Homme',
    location: 'Place du Trocadéro',
    note: 'The view of the Eiffel Tower here is *chef\'s kiss* 💋'
  };
  const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
  const inTwoHours = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  const in45Minutes = new Date(now.getTime() + 45 * 60 * 1000);
  const in10Minutes = new Date(now.getTime() + 10 * 60 * 1000);

  const nextActivities = [
    {
      id: '3',
      time: in10Minutes.toTimeString().slice(0, 5), // 10 minutes from now
      title: 'Seine River Cruise',
      location: 'Port de la Bourdonnais',
      icon: Navigation,
      type: 'Activity',
      colorTheme: HOPLA_COLORS.ACTIVITY
    },
    {
      id: '4',
      time: in45Minutes.toTimeString().slice(0, 5), // 45 minutes from now
      title: 'Afternoon Coffee',
      location: 'Café de Flore',
      icon: Coffee,
      type: 'Food',
      colorTheme: HOPLA_COLORS.FOOD
    },
    {
      id: '5',
      time: inTwoHours.toTimeString().slice(0, 5), // 2 hours from now
      title: 'Dinner at Le Jules Verne',
      location: 'Eiffel Tower',
      icon: Utensils,
      type: 'Food',
      colorTheme: HOPLA_COLORS.FOOD
    }
  ];

  // Helper function to format countdown time
  const formatTimeUntil = (activityTime: Date, now: Date) => {
    const diffMs = activityTime.getTime() - now.getTime();
    
    if (diffMs <= 0) {
      return { text: 'Started', color: 'text-muted-foreground', urgent: false };
    }

    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const remainingMinutes = diffMinutes % 60;

    if (diffMinutes < 15) {
      return { 
        text: `in ${diffMinutes}m`, 
        color: 'text-red-500', 
        urgent: true 
      };
    } else if (diffMinutes < 60) {
      return { 
        text: `in ${diffMinutes}m`, 
        color: 'text-orange-500', 
        urgent: false 
      };
    } else if (diffHours < 24) {
      if (remainingMinutes === 0) {
        return { 
          text: `in ${diffHours}h`, 
          color: 'text-muted-foreground', 
          urgent: false 
        };
      } else {
        return { 
          text: `in ${diffHours}h ${remainingMinutes}m`, 
          color: 'text-muted-foreground', 
          urgent: false 
        };
      }
    } else {
      return { 
        text: `tomorrow`, 
        color: 'text-muted-foreground', 
        urgent: false 
      };
    }
  };

  const quickActions = [
    { id: 'photo', icon: Camera, label: 'Photo', description: 'Quick photo', colorTheme: HOPLA_COLORS.ACTIVITY },
    { id: 'directions', icon: Navigation, label: 'Navigate', description: 'Get directions', colorTheme: HOPLA_COLORS.TRANSPORT },
    { id: 'translate', icon: Languages, label: 'Translate', description: 'Phrase help', colorTheme: HOPLA_COLORS.CULTURE },
    { id: 'emergency', icon: Phone, label: 'Emergency', description: 'Emergency contacts', colorTheme: HOPLA_COLORS.SAFETY }
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="relative">
        <div className={`transition-all duration-300 ${headerExpanded ? 'h-40' : 'h-16'} relative overflow-hidden`}>
          {headerExpanded && (
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800&h=200&fit=crop"
              alt="Paris skyline"
              className="w-full h-full object-cover opacity-80"
            />
          )}
          <div className={`absolute inset-0 ${headerExpanded ? 'bg-gradient-to-t from-black/50 to-transparent' : 'bg-card border-b border-border'}`} />
        </div>

        <div className="absolute top-4 left-4 right-4 z-10">
          <div className={`flex items-center ${headerExpanded ? 'justify-between' : 'justify-end'}`}>
            {headerExpanded && (
              <button 
                onClick={onBack}
                className="rounded-full p-2 transition-colors bg-black/20 backdrop-blur-sm text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className={`h-8 w-8 p-0 rounded-full ${
                  headerExpanded ? 'bg-black/20 backdrop-blur-sm' : 'bg-accent'
                }`}>
                  <Avatar className="h-7 w-7">
                    <AvatarImage src="/avatar.jpg" />
                    <AvatarFallback className={headerExpanded ? 'bg-white/20 text-white' : 'bg-muted'}>
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={onShowProfile} className="cursor-pointer">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          {headerExpanded ? (
            <div className="text-white pr-16">
              <h1 className="text-xl font-medium mb-1">🗼 Day 3 in Paris</h1>
              <p className="text-white/80 text-sm">Living your best café-hopping life</p>
            </div>
          ) : (
            <div className="flex items-center justify-between pr-16">
              <div>
                <h1 className="font-medium">Day 3 in Paris</h1>
                <p className="text-xs text-muted-foreground">12:30 PM • Sunny 22°C</p>
              </div>
              <Badge>
                Day 3 of 7
              </Badge>
            </div>
          )}
        </div>


      </div>

      {/* Main Content - Tighter Spacing */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-3 space-y-3 pt-5"
      >
        {/* Current Activity - Enhanced with Live Countdown */}
        <Card className={`p-3 border-l-4 border-l-[var(--color-orange-dark)] ${HOPLA_COLORS.FOOD.light}/50`}>
          <div className="flex items-center gap-2 mb-2">
            <Utensils className={`w-4 h-4 ${HOPLA_COLORS.FOOD.icon}`} />
            <Badge className="text-xs bg-[var(--color-orange-dark)] text-white">
              {currentActivity.time} - {currentActivity.endTime}
            </Badge>
            <span className={`text-xs font-medium ml-auto ${formatRemainingTime(currentActivity.endTime, currentTime).color}`}>
              ⏰ {formatRemainingTime(currentActivity.endTime, currentTime).text}
            </span>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">{currentActivity.title}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="w-3 h-3" />
              {currentActivity.location}
            </div>
            <p className="text-sm text-muted-foreground italic">{currentActivity.note}</p>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-7 text-xs">Directions</Button>
              <Button variant="outline" size="sm" className="h-7 text-xs">Menu</Button>
            </div>
          </div>
        </Card>

        {/* Enhanced Card Stack with Fixed Active Card Opacity */}
        <div 
          ref={phraseCardRef}
          className="relative h-32 cursor-grab active:cursor-grabbing select-none mx-6"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {phrases.map((phrase, index) => {
            const isActive = index === currentPhraseIndex;
            const offset = index - currentPhraseIndex;
            const absOffset = Math.abs(offset);
            
            // Enhanced positioning with rotation and better depth
            const baseTranslateX = offset * 20 + (isActive ? dragOffset * 0.7 : 0);
            const translateY = absOffset * 3; // Slight vertical stagger
            const rotation = offset * 2 + (isActive && dragOffset ? dragOffset * 0.018 : 0);
            const scale = isActive ? 1 : Math.max(0.92, 1 - absOffset * 0.04);
            
            // Enhanced shadow system for realistic depth
            let shadow = 'shadow-sm';
            if (isActive) {
              shadow = isPressed ? 'shadow-xl' : 'shadow-lg';
            } else if (absOffset === 1) {
              shadow = 'shadow-md';
            }
            
            let transform = `
              translateX(${baseTranslateX}px) 
              translateY(${translateY}px) 
              rotate(${rotation}deg) 
              scale(${scale})
            `;
            
            let zIndex = phrases.length - absOffset + (isActive && isPressed ? 10 : 0);
            
            // Fixed opacity - top card is fully opaque, background cards fade
            let opacity;
            if (isActive) {
              opacity = 1; // Top card is always fully opaque
            } else {
              opacity = Math.max(0.6, 1 - absOffset * 0.15);
            }
            
            // Hide cards that are too far away
            if (absOffset > 4) {
              opacity = 0;
            }

            // Fixed card styling - different for active vs background cards
            const cardClasses = isActive 
              ? `absolute inset-0 bg-white rounded-xl border border-border p-4 transition-all duration-300 ease-out ${shadow} ring-1 ring-primary/20`
              : `absolute inset-0 bg-gradient-to-br from-white to-gray-50/50 rounded-xl border border-border/60 p-4 transition-all duration-300 ease-out ${shadow}`;

            return (
              <div
                key={index}
                className={cardClasses}
                style={{
                  transform,
                  zIndex,
                  opacity,
                  transitionDuration: isDragging && isActive ? '0ms' : '300ms'
                }}
              >
                {/* Simplified card content - no completion tracking */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <p className="font-semibold text-base leading-snug text-gray-900">
                        {phrase.french}
                      </p>
                      <p className="text-xs text-gray-500 italic font-medium">
                        "{phrase.phonetic}"
                      </p>
                      <p className="text-sm text-gray-700">
                        {phrase.english}
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-16 w-16 p-0 ml-2 bg-primary/10 hover:bg-primary/20 rounded-2xl border-2 border-primary/20 hover:border-primary/30 transition-all duration-200 hover:scale-105"
                    >
                      <Volume2 className="w-8 h-8 text-primary" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Coming Up - Enhanced with Countdown */}
        <Card className="p-3">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Coming Up</span>
          </div>
          
          <div className="space-y-3">
            {nextActivities.map((activity) => {
              const ActivityIcon = activity.icon;
              const activityTime = parseActivityTime(activity.time);
              const countdown = formatTimeUntil(activityTime, currentTime);
              
              return (
                <div key={activity.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors">
                  <div className={`p-2 rounded-lg ${countdown.urgent ? 'bg-red-50' : activity.colorTheme.light}`}>
                    <ActivityIcon className={`w-4 h-4 ${countdown.urgent ? 'text-red-500' : activity.colorTheme.icon}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm line-clamp-1">{activity.title}</p>
                      <Badge 
                        variant={countdown.urgent ? "destructive" : "outline"} 
                        className={`text-xs shrink-0 ${countdown.urgent ? '' : `${activity.colorTheme.light} ${activity.colorTheme.dark} ${activity.colorTheme.border}`}`}
                      >
                        {activity.time}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {activity.location}
                      </p>
                      <span className={`text-xs font-medium ${countdown.color}`}>
                        {countdown.text}
                      </span>
                    </div>
                  </div>
                  
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </div>
              );
            })}
          </div>
        </Card>

        {/* Weather & Challenges - Dynamic Layout */}
        <div className="space-y-3">
          {challengesExpanded ? (
            <div className="space-y-3">
              <WeatherCard />
              <TripChallengesCard onExpandChange={setChallengesExpanded} />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <WeatherCard />
              <TripChallengesCard onExpandChange={setChallengesExpanded} />
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          {quickActions.map((action) => {
            const ActionIcon = action.icon;
            const colors = action.colorTheme;
            return (
              <button
                key={action.id}
                className={`flex items-center gap-3 p-3 rounded-lg border ${colors.border} hover:${colors.light} hover:${colors.border} transition-all group`}
                onClick={() => action.id === 'emergency' ? setShowToolkit(true) : console.log(`Quick action: ${action.id}`)}
              >
                <div className={`p-2 ${colors.light} rounded-lg group-hover:bg-opacity-80 transition-colors`}>
                  <ActionIcon className={`w-4 h-4 ${colors.icon}`} />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-sm">{action.label}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </button>
            );
          })}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowToolkit(true)}
          className="w-full h-9 text-sm bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 hover:from-primary/10 hover:to-primary/20 hover:border-primary/30"
        >
          <Wrench className="w-4 h-4 mr-2" />
          Open Travel Toolkit
        </Button>
      </div>

      {/* Enhanced Travel Toolkit */}
      {showToolkit && (
        <TravelToolkit 
          onClose={() => setShowToolkit(false)}
          currentLocation={trip?.currentCity || "Current City"}
          currentTime={new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          })}
        />
      )}
    </div>
  );
}