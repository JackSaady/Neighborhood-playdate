
import React, { useState, useEffect } from 'react';
import { Home, Search, Calendar, MessageCircle, PlusCircle, Menu, Info, X } from 'lucide-react';
import Dashboard from './components/Dashboard';
import FamilyConnect from './components/FamilyConnect';
import SchedulePlaydate from './components/SchedulePlaydate';
import ActivityFinder from './components/ActivityFinder';
import Messaging from './components/Messaging';
import Profile from './components/Profile';
import Onboarding from './components/Onboarding';
import Settings from './components/Settings';
import Toast, { ToastType } from './components/Toast';
import { NEW_USER, MOCK_PLAYDATES, MOCK_MESSAGES, MOCK_PARENTS } from './constants';
import { Parent, Playdate, Message } from './types';

// Define view types
type View = 'dashboard' | 'connect' | 'schedule' | 'activities' | 'messages' | 'profile' | 'onboarding' | 'settings';

const App: React.FC = () => {
  // --- STATE WITH PERSISTENCE ---

  // User State
  const [currentUser, setCurrentUser] = useState<Parent>(() => {
    try {
        const saved = localStorage.getItem('app_user');
        return saved ? JSON.parse(saved) : NEW_USER;
    } catch (e) {
        return NEW_USER;
    }
  });

  // Playdates State
  const [playdates, setPlaydates] = useState<Playdate[]>(() => {
    try {
        const saved = localStorage.getItem('app_playdates');
        return saved ? JSON.parse(saved) : MOCK_PLAYDATES;
    } catch (e) {
        return MOCK_PLAYDATES;
    }
  });

  // Messages State
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
        const saved = localStorage.getItem('app_messages');
        return saved ? JSON.parse(saved) : MOCK_MESSAGES;
    } catch (e) {
        return MOCK_MESSAGES;
    }
  });

  // View State (Not persisted, always start fresh or based on user status)
  const [currentView, setCurrentView] = useState<View>(() => {
      // If user is loaded from storage but has no children, go to onboarding
      // If fresh new user, go to onboarding
      if (currentUser.children.length === 0) return 'onboarding';
      return 'dashboard';
  });
  
  const [viewParams, setViewParams] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  
  // Demo Disclaimer State
  const [showDisclaimer, setShowDisclaimer] = useState(() => {
      return !localStorage.getItem('app_disclaimer_dismissed');
  });

  // --- PERSISTENCE EFFECTS ---
  useEffect(() => {
    localStorage.setItem('app_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('app_playdates', JSON.stringify(playdates));
  }, [playdates]);

  useEffect(() => {
    localStorage.setItem('app_messages', JSON.stringify(messages));
  }, [messages]);


  // Helper to show toast
  const showToast = (message: string, type: ToastType = 'success') => {
      setToast({ message, type });
  };

  const dismissDisclaimer = () => {
      setShowDisclaimer(false);
      localStorage.setItem('app_disclaimer_dismissed', 'true');
  };

  // Navigation handler with optional params
  const navigate = (view: View, params?: any) => {
    setCurrentView(view);
    if (params) {
        setViewParams(params);
    } else {
        setViewParams(null);
    }
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const handleOnboardingComplete = () => {
    setCurrentView('dashboard');
    showToast("Welcome to the neighborhood!", 'success');
  };

  const handleSendMessage = (receiverId: string, content: string) => {
    const newMessage: Message = {
        id: `m_${Date.now()}`,
        senderId: currentUser.id,
        receiverId,
        content,
        timestamp: new Date().toISOString(),
        isRead: false
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSavePlaydate = (playdateInput: Playdate | Playdate[], invitees: string[], inviteMessage: string) => {
    const playdatesToSave = Array.isArray(playdateInput) ? playdateInput : [playdateInput];
    const isNew = !playdates.some(p => p.id === playdatesToSave[0].id);

    setPlaydates(prev => {
      let updatedList = [...prev];
      playdatesToSave.forEach(pd => {
          const index = updatedList.findIndex(p => p.id === pd.id);
          if (index >= 0) {
              // Update existing
              updatedList[index] = pd;
          } else {
              // Add new
              updatedList.push(pd);
          }
      });
      return updatedList;
    });

    // Send invites if any
    if (invitees.length > 0 && inviteMessage) {
        const primaryPlaydate = playdatesToSave[0];
        let details = `Playdate: ${primaryPlaydate.title}\nDate: ${primaryPlaydate.date} @ ${primaryPlaydate.time}`;
        
        if (playdatesToSave.length > 1) {
            details += `\n(Recurring event for ${playdatesToSave.length} weeks)`;
        }

        invitees.forEach(userId => {
            handleSendMessage(userId, `INVITATION: ${inviteMessage}\n\n${details}`);
        });
    }

    showToast(isNew ? "Playdate scheduled successfully!" : "Playdate updated!", 'success');
    navigate('dashboard');
  };

  const handleCancelPlaydate = (playdateId: string) => {
    const playdate = playdates.find(p => p.id === playdateId);
    if (!playdate) return;

    if (playdate.hostId === currentUser.id) {
        // HOST: Delete the entire playdate
        setPlaydates(playdates.filter(p => p.id !== playdateId));
        // Calculate attendees to notify (excluding self)
        const guestsCount = Math.max(0, playdate.attendees.length - 1);
        showToast(`Event cancelled. ${guestsCount} attendees notified.`, 'info');
    } else {
        // GUEST: Remove self from attendees
        const updatedPlaydate = {
            ...playdate,
            attendees: playdate.attendees.filter(id => id !== currentUser.id)
        };
        setPlaydates(playdates.map(p => p.id === playdateId ? updatedPlaydate : p));
        showToast(`You have left the playdate.`, 'info');
    }
  };

  // --- SIMULATION TOOLS (For Demo/Testing) ---
  const simulateIncomingMessage = () => {
      showToast("Simulating incoming message in 3 seconds...", 'info');
      setTimeout(() => {
          const sender = MOCK_PARENTS[0]; // David Chen
          const text = "Hey! Are you free for a playdate this weekend?";
          const msg: Message = {
              id: `m_sim_${Date.now()}`,
              senderId: sender.id,
              receiverId: currentUser.id,
              content: text,
              timestamp: new Date().toISOString(),
              isRead: false
          };
          setMessages(prev => [...prev, msg]);
          showToast(`New message from ${sender.name}`, 'info');
      }, 3000);
  };

  const simulateIncomingInvite = () => {
      showToast("Simulating invite in 3 seconds...", 'info');
      setTimeout(() => {
          const host = MOCK_PARENTS[1]; // Emily
          const date = new Date();
          date.setDate(date.getDate() + 3); // 3 days from now
          const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
          
          const newPlaydate: Playdate = {
              id: `pd_sim_${Date.now()}`,
              title: "Science Museum Trip",
              date: dateStr,
              time: "10:00",
              location: "City Science Center",
              description: "Going to check out the new dinosaur exhibit!",
              type: 'group',
              isPublic: false,
              hostId: host.id,
              attendees: [host.id, currentUser.id] // Automatically add us as invitee
          };

          setPlaydates(prev => [...prev, newPlaydate]);
          
          // Also send a message
          const msg: Message = {
              id: `m_sim_inv_${Date.now()}`,
              senderId: host.id,
              receiverId: currentUser.id,
              content: `INVITATION: We are going to the museum! Hope you can come.\n\nPlaydate: Science Museum Trip\nDate: ${dateStr} @ 10:00`,
              timestamp: new Date().toISOString(),
              isRead: false
          };
          setMessages(prev => [...prev, msg]);
          
          showToast(`You were invited to ${newPlaydate.title} by ${host.name}!`, 'success');
      }, 3000);
  };


  // Calculate unread messages for badge
  const unreadCount = messages.filter(m => m.receiverId === currentUser.id && !m.isRead).length;

  const renderContent = () => {
    switch (currentView) {
      case 'onboarding':
        return <Onboarding user={currentUser} onUpdateUser={setCurrentUser} onComplete={handleOnboardingComplete} />;
      case 'dashboard':
        return (
          <Dashboard 
            navigate={navigate} 
            playdates={playdates} 
            onCancelPlaydate={handleCancelPlaydate}
            currentUser={currentUser}
          />
        );
      case 'connect':
        return <FamilyConnect onMessageClick={(id) => navigate('messages', { targetUserId: id })} />;
      case 'schedule':
        return (
          <SchedulePlaydate 
            onSave={handleSavePlaydate} 
            onComplete={() => navigate('dashboard')} 
            existingPlaydates={playdates}
            currentUser={currentUser}
            initialData={viewParams?.playdate}
          />
        );
      case 'activities':
        return <ActivityFinder />;
      case 'messages':
        return (
            <Messaging 
                messages={messages} 
                onSendMessage={handleSendMessage} 
                initialChatId={viewParams?.targetUserId}
                initialGroupMembers={viewParams?.groupUserIds}
            />
        );
      case 'profile':
        return <Profile user={currentUser} onUpdateUser={setCurrentUser} navigate={navigate} />;
      case 'settings':
        return (
            <Settings 
                initialTab={viewParams?.tab} 
                onBack={() => navigate('profile')} 
                onSimulateMessage={simulateIncomingMessage}
                onSimulateInvite={simulateIncomingInvite}
            />
        );
      default:
        return (
          <Dashboard 
            navigate={navigate} 
            playdates={playdates} 
            onCancelPlaydate={handleCancelPlaydate}
            currentUser={currentUser}
          />
        );
    }
  };

  // Don't show navigation during onboarding
  if (currentView === 'onboarding') {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
             <header className="bg-white shadow-sm px-4 py-4 flex items-center justify-center">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">P</div>
                    <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">Playdate<span className="text-teal-500">Connect</span></h1>
                </div>
            </header>
            <main className="flex-1 container mx-auto max-w-5xl">
                {renderContent()}
            </main>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 pb-20 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('dashboard')}>
           <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">P</div>
           <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">Playdate<span className="text-teal-500">Connect</span></h1>
        </div>
        <div className="hidden md:flex items-center space-x-6">
            <NavButton active={currentView === 'dashboard'} onClick={() => navigate('dashboard')} icon={<Home size={18} />} label="Home" />
            <NavButton active={currentView === 'connect'} onClick={() => navigate('connect')} icon={<Search size={18} />} label="Find Families" />
            <NavButton active={currentView === 'activities'} onClick={() => navigate('activities')} icon={<Calendar size={18} />} label="Activities" />
            <NavButton active={currentView === 'messages'} onClick={() => navigate('messages')} icon={<MessageCircle size={18} />} label="Chat" badge={unreadCount} />
            <button 
              onClick={() => navigate('schedule')}
              className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 transition-colors shadow-md"
            >
              <PlusCircle size={18} />
              <span>New Playdate</span>
            </button>
            <div className="w-px h-6 bg-slate-200 mx-2"></div>
            <button onClick={() => navigate('profile')}>
              <img src={currentUser.photoUrl} alt="Me" className="w-8 h-8 rounded-full border-2 border-white shadow-sm object-cover" />
            </button>
        </div>
        <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <Menu size={24} />
        </button>
      </header>

      {/* Privacy / Demo Banner */}
      {showDisclaimer && (
          <div className="bg-indigo-600 text-white px-4 py-3 text-sm font-medium relative z-50">
              <div className="container mx-auto max-w-5xl flex items-start md:items-center gap-3 pr-6">
                  <Info className="flex-shrink-0 text-indigo-200" size={18} />
                  <p className="flex-1">
                      <span className="font-bold uppercase text-xs bg-indigo-500 px-1.5 py-0.5 rounded mr-2">Demo Mode</span>
                      Data is stored locally on your device. No real information is sent to a server. Use the "Simulate" buttons in Settings to test social features.
                  </p>
                  <button 
                    onClick={dismissDisclaimer}
                    className="absolute right-2 top-2 md:static p-1 hover:bg-indigo-500 rounded-full transition-colors"
                  >
                      <X size={16} />
                  </button>
              </div>
          </div>
      )}
      
      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b p-4 flex flex-col gap-3 shadow-lg relative z-40">
             <button onClick={() => navigate('profile')} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                <img src={currentUser.photoUrl} alt="Me" className="w-10 h-10 rounded-full object-cover" />
                <div className="text-left">
                    <p className="font-bold">{currentUser.name}</p>
                    <p className="text-xs text-slate-500">View Profile</p>
                </div>
             </button>
             <hr />
             <button onClick={() => navigate('schedule')} className="bg-teal-500 text-white p-3 rounded-lg font-bold">+ Schedule Playdate</button>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 container mx-auto max-w-5xl p-4 md:p-6">
        {renderContent()}
      </main>

      {/* Toast Container */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center py-2 px-2 pb-safe z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
         <MobileNavButton active={currentView === 'dashboard'} onClick={() => navigate('dashboard')} icon={<Home size={24} />} label="Home" />
         <MobileNavButton active={currentView === 'connect'} onClick={() => navigate('connect')} icon={<Search size={24} />} label="Families" />
         <div className="relative -top-5">
            <button 
                onClick={() => navigate('schedule')}
                className="bg-teal-500 text-white p-4 rounded-full shadow-lg hover:bg-teal-600 transition-transform active:scale-95"
            >
                <PlusCircle size={28} />
            </button>
         </div>
         <MobileNavButton active={currentView === 'activities'} onClick={() => navigate('activities')} icon={<Calendar size={24} />} label="Activities" />
         <MobileNavButton active={currentView === 'messages'} onClick={() => navigate('messages')} icon={<MessageCircle size={24} />} label="Chat" badge={unreadCount} />
      </div>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label, badge }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, badge?: number }) => (
    <button 
        onClick={onClick} 
        className={`flex items-center gap-2 font-semibold transition-colors relative ${active ? 'text-teal-600' : 'text-slate-500 hover:text-slate-800'}`}
    >
        <div className="relative">
            {icon}
            {badge && badge > 0 ? (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] min-w-[16px] h-4 rounded-full flex items-center justify-center px-1 border border-white">
                    {badge}
                </span>
            ) : null}
        </div>
        <span>{label}</span>
    </button>
);

const MobileNavButton = ({ active, onClick, icon, label, badge }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, badge?: number }) => (
    <button 
        onClick={onClick} 
        className={`flex flex-col items-center justify-center w-16 h-14 transition-colors relative ${active ? 'text-teal-600' : 'text-slate-400'}`}
    >
        <div className={`${active ? 'transform scale-110 transition-transform' : ''} relative`}>
            {icon}
            {badge && badge > 0 ? (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                    {badge}
                </span>
            ) : null}
        </div>
        <span className="text-[10px] font-medium mt-1">{label}</span>
    </button>
);

export default App;
