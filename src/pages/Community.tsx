import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Users, MessageSquare, Plus, ArrowLeft, Hash, MoreVertical, Trash2, Edit2, Pin, PinOff, Bell, BellOff, X, MoreHorizontal, ShieldAlert, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { cn } from '../lib/utils';
import { Button } from '../components/Button';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, setDoc, serverTimestamp, getDoc, updateDoc, increment, deleteDoc, where, getDocs, writeBatch, deleteField } from 'firebase/firestore';

interface Message {
  id: string;
  userId: string;
  userName: string;
  userLevel: string;
  userAvatar: string;
  text: string;
  time: string;
  createdAt: any;
  isEdited?: boolean;
}

interface Forum {
  id: string;
  title: string;
  description: string;
  authorId: string;
  authorName: string;
  memberCount: number;
  isPinned?: boolean;
  pinnedMessage?: Message | null;
}

const ReadMoreText = ({ text, maxLength = 150, className = "", userContextUsername = "" }: { text: string; maxLength?: number; className?: string, userContextUsername?: string }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const renderText = (content: string) => {
    const parts = content.split(/(@\w+)/g);
    return parts.map((part, i) => {
      if (part.startsWith('@')) {
        const mentionedUsername = part.substring(1);
        const isMe = userContextUsername === mentionedUsername;
        return (
          <span key={i} className={cn(
            "font-bold px-1 rounded-md", 
            isMe ? "bg-yellow-300 text-slate-900 animate-pulse" : (className.includes('bg-primary-accent') ? "text-yellow-300" : "bg-primary-accent/20 text-primary-accent")
          )}>
            {part}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };
  
  if (text.length <= maxLength) {
    return <div className={className}>{renderText(text)}</div>;
  }
  
  return (
    <div className="flex flex-col items-start w-full">
      <div className={className}>
        {isExpanded ? renderText(text) : renderText(`${text.slice(0, maxLength)}...`)}
      </div>
      <button 
        onClick={() => setIsExpanded(!isExpanded)} 
        className={cn(
          "text-[10px] md:text-xs font-bold mt-1 hover:underline focus:outline-none",
          className.includes('bg-primary-accent') ? "text-yellow-200" : "text-primary-accent"
        )}
      >
        {isExpanded ? 'Sembunyikan' : 'Baca selengkapnya'}
      </button>
    </div>
  );
};

export default function Community() {
  const { user, addXp, updateProfile } = useAuthStore();
  const [forums, setForums] = useState<Forum[]>([]);
  const [activeForumId, setActiveForumId] = useState<string | null>(null);
  const activeForum = activeForumId ? forums.find(f => f.id === activeForumId) || null : null;
  const [messages, setMessages] = useState<Message[]>([]);
  const [forumMembers, setForumMembers] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newForumTitle, setNewForumTitle] = useState('');
  const [newForumDesc, setNewForumDesc] = useState('');
  const [input, setInput] = useState('');
  const [showForumSettings, setShowForumSettings] = useState(false);

  // Admin Edit State
  const [editingForum, setEditingForum] = useState<Forum | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [activeMemberSettingsId, setActiveMemberSettingsId] = useState<string | null>(null);
  const [activeMessageSettingsId, setActiveMessageSettingsId] = useState<string | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editMessageContent, setEditMessageContent] = useState('');

  // Fetch Forums
  useEffect(() => {
    // Remove orderBy to prevent dropping optimistic writes with serverTimestamp()
    const q = query(collection(db, 'forums'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedForums: Forum[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        fetchedForums.push({ 
          id: doc.id, 
          ...data,
          // Provide a fallback for local local pending writes where createdAt is null
          createdAt: data.createdAt || { toMillis: () => Date.now() }
        } as unknown as Forum);
      });
      
      // Sort locally
      fetchedForums.sort((a: any, b: any) => {
        return b.createdAt.toMillis() - a.createdAt.toMillis();
      });
      
      setForums(fetchedForums);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'forums');
    });

    return () => unsubscribe();
  }, []);

  // Fetch messages when a forum is active
  useEffect(() => {
    if (!activeForumId) {
      setMessages([]);
      return;
    }

    const messagesRef = collection(db, 'forums', activeForumId, 'messages');
    // Remove orderBy to prevent dropping optimistic messages
    const qMessages = query(messagesRef);
    const unsubscribeMessages = onSnapshot(qMessages, (snapshot) => {
      const fetchedMessages: any[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        fetchedMessages.push({ 
          id: doc.id, 
          ...data,
          createdAt: data.createdAt || { toMillis: () => Date.now(), toDate: () => new Date() }
        });
      });
      
      // Sort locally ascending
      fetchedMessages.sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis());
      
      // Format time
      const formattedMessages = fetchedMessages.map(msg => ({
        ...msg,
        time: msg.createdAt.toDate().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }).replace('.', ':')
      }));
      
      setMessages(formattedMessages as Message[]);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `forums/${activeForumId}/messages`);
    });

    // Fetch members
    const membersRef = collection(db, 'forums', activeForumId, 'members');
    const unsubscribeMembers = onSnapshot(membersRef, (snapshot) => {
      const fetchedMembers: any[] = [];
      snapshot.forEach((doc) => {
        fetchedMembers.push({ id: doc.id, ...doc.data() });
      });
      
      setForums((currentForums) => {
        const forumAuthorId = currentForums.find(f => f.id === activeForumId)?.authorId;
        
        // Sort members: author first
        fetchedMembers.sort((a, b) => {
          if (a.userId === forumAuthorId) return -1;
          if (b.userId === forumAuthorId) return 1;
          return 0; // maintain remaining order, or could sort by name
        });
      
        setForumMembers(fetchedMembers);
        return currentForums;
      });
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `forums/${activeForumId}/members`);
    });

    return () => {
      unsubscribeMessages();
      unsubscribeMembers();
    };
  }, [activeForumId]);

  const handleCreateForum = async () => {
    if (!newForumTitle.trim() || !user) return;
    
    const forumId = Date.now().toString();
    try {
      await setDoc(doc(db, 'forums', forumId), {
        title: newForumTitle,
        description: newForumDesc || 'Forum diskusi baru.',
        authorId: user.id,
        authorName: user.fullName || user.username || 'Explorer',
        memberCount: 1,
        isPinned: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp() // Add updatedAt so it validates correctly
      });
      // Menambahkan pembuat forum masuk ke dalam anggota forum secara otomatis
      await setDoc(doc(db, 'forums', forumId, 'members', user.id), {
        userId: user.id,
        userName: user.fullName || user.username || 'Explorer',
        joinedAt: serverTimestamp(),
        notificationsEnabled: true
      });

      setIsCreating(false);
      setNewForumTitle('');
      setNewForumDesc('');
    } catch (error: any) {
      alert(`Gagal membuat forum: ${error.message}`);
      // handleFirestoreError(error, OperationType.CREATE, `forums/${forumId}`);
    }
  };

  const handleJoinForum = async (forum: Forum) => {
    setActiveForumId(forum.id);
  };

  const executeJoinForum = async () => {
    if (!activeForum || !user) return;
    try {
      const memberRef = doc(db, 'forums', activeForum.id, 'members', user.id);
      await setDoc(memberRef, {
        userId: user.id,
        userName: user.fullName || user.username || 'Explorer',
        joinedAt: serverTimestamp(),
        notificationsEnabled: true
      });
      // Increment member count
      const forumRef = doc(db, 'forums', activeForum.id);
      await updateDoc(forumRef, {
        memberCount: increment(1),
        updatedAt: serverTimestamp()
      });
    } catch (error: any) {
      alert(`Gagal bergabung dengan forum: ${error.message}`);
    }
  };

  const handleToggleNotifications = async (memberId: string, currentStatus: boolean) => {
    if (!activeForum || !user || memberId !== user.id) return;
    try {
      const memberRef = doc(db, 'forums', activeForum.id, 'members', user.id);
      await updateDoc(memberRef, {
        notificationsEnabled: !currentStatus
      });
    } catch (error: any) {
      console.error("Gagal mengubah notifikasi:", error);
    }
  };

  const handleLeaveForum = async () => {
    if (!activeForum || !user) return;
    try {
      const batch = writeBatch(db);
      const memberRef = doc(db, 'forums', activeForum.id, 'members', user.id);
      const forumRef = doc(db, 'forums', activeForum.id);
      
      batch.delete(memberRef);
      batch.update(forumRef, {
        memberCount: increment(-1),
        updatedAt: serverTimestamp()
      });
      await batch.commit();
      
      setShowForumSettings(false);
      alert('Berhasil keluar dari forum.');
      setActiveForumId(null);
    } catch (error: any) {
      handleFirestoreError(error, OperationType.DELETE, `forums/${activeForum?.id}/members/${user?.id}`);
      alert(`Gagal keluar dari forum: ${error.message}`);
    }
  };

  const handleMakeModerator = async (memberId: string) => {
    if (!activeForum || !user) return;
    try {
      const memberRef = doc(db, 'forums', activeForum.id, 'members', memberId);
      await updateDoc(memberRef, {
        role: 'moderator',
        updatedAt: serverTimestamp()
      });
      alert('Berhasil menjadikan user sebagai moderator.');
    } catch (error: any) {
      handleFirestoreError(error, OperationType.UPDATE, `forums/${activeForum?.id}/members/${memberId}`);
      alert(`Gagal menjadikan moderator: ${error.message}`);
    }
  };

  const handleRemoveModerator = async (memberId: string) => {
    if (!activeForum || !user) return;
    try {
      const memberRef = doc(db, 'forums', activeForum.id, 'members', memberId);
      await updateDoc(memberRef, {
        role: 'member',
        updatedAt: serverTimestamp()
      });
      alert('Berhasil menghapus status moderator.');
    } catch (error: any) {
      handleFirestoreError(error, OperationType.UPDATE, `forums/${activeForum?.id}/members/${memberId}`);
      alert(`Gagal menghapus status moderator: ${error.message}`);
    }
  };

  const handleKickMember = async (memberId: string) => {
    if (!activeForum || !user) return;
    try {
      const batch = writeBatch(db);
      const memberRef = doc(db, 'forums', activeForum.id, 'members', memberId);
      const forumRef = doc(db, 'forums', activeForum.id);
      
      batch.delete(memberRef);
      batch.update(forumRef, {
        memberCount: increment(-1),
        updatedAt: serverTimestamp()
      });
      await batch.commit();
      
      alert('Berhasil mengeluarkan user.');
    } catch (error: any) {
      handleFirestoreError(error, OperationType.DELETE, `forums/${activeForum?.id}/members/${memberId}`);
      alert(`Gagal mengeluarkan user: ${error.message}`);
    }
  };

  const handlePinChatMessage = async (msg: Message) => {
    if (!activeForum || !user) return;
    try {
      await updateDoc(doc(db, 'forums', activeForum.id), {
        pinnedMessage: {
          id: msg.id,
          userId: msg.userId,
          userName: msg.userName,
          userLevel: msg.userLevel,
          userAvatar: msg.userAvatar,
          text: msg.text,
          time: msg.time || '',
          createdAt: msg.createdAt || serverTimestamp(),
        },
        updatedAt: serverTimestamp()
      });
      alert('Pesan berhasil disematkan.');
    } catch (error: any) {
      alert(`Gagal menyematkan pesan: ${error.message}`);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!activeForum || !user) return;
    try {
      await deleteDoc(doc(db, 'forums', activeForum.id, 'messages', messageId));
      setActiveMessageSettingsId(null);
    } catch (error: any) {
      handleFirestoreError(error, OperationType.DELETE, `forums/${activeForum.id}/messages/${messageId}`);
      alert(`Gagal menghapus pesan: ${error.message}`);
    }
  };

  const handleUpdateMessage = async (messageId: string) => {
    if (!activeForum || !user || !editMessageContent.trim()) return;
    try {
      await updateDoc(doc(db, 'forums', activeForum.id, 'messages', messageId), {
        text: editMessageContent.trim(),
        isEdited: true,
        updatedAt: serverTimestamp()
      });
      setEditingMessageId(null);
      setEditMessageContent('');
      setActiveMessageSettingsId(null);
    } catch (error: any) {
      handleFirestoreError(error, OperationType.UPDATE, `forums/${activeForum.id}/messages/${messageId}`);
      alert(`Gagal mengubah pesan: ${error.message}`);
    }
  };

  const handleUnpinChatMessage = async () => {
    if (!activeForum || !user) return;
    try {
      await updateDoc(doc(db, 'forums', activeForum.id), {
        pinnedMessage: deleteField(),
        updatedAt: serverTimestamp()
      });
    } catch (error: any) {
      alert(`Gagal membatalkan sematan: ${error.message}`);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !activeForum || !user) return;
    
    // Check if daily quest is completed
    const getWIBDateString = () => {
      const wibDate = new Date(new Date().getTime() + 7 * 60 * 60 * 1000);
      return wibDate.toISOString().split('T')[0];
    };
    const today = getWIBDateString();
    const isFirstMessageToday = user.lastCommunityMessageDate !== today;

    const messageText = input;
    setInput(''); // Optimistic clear

    const messageId = Date.now().toString();
    try {
      await setDoc(doc(db, 'forums', activeForumId, 'messages', messageId), {
        userId: user.id,
        userName: user.fullName || user.username || 'Explorer',
        userLevel: user.institution || user.tier || 'Sekolah Umum',
        userAvatar: user.avatar || '👤',
        text: messageText,
        createdAt: serverTimestamp()
      });

      if (isFirstMessageToday) {
        addXp(20);
        updateProfile({ lastCommunityMessageDate: today });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `forums/${activeForumId}/messages/${messageId}`);
    }
  };

  const togglePin = async (forum: Forum, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await updateDoc(doc(db, 'forums', forum.id), {
        isPinned: !forum.isPinned,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `forums/${forum.id}`);
    }
  };

  const deleteForum = async (forumId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteDoc(doc(db, 'forums', forumId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `forums/${forumId}`);
    }
  };

  const saveEditForum = async () => {
    if (!editingForum) return;
    try {
      await updateDoc(doc(db, 'forums', editingForum.id), {
        title: editTitle,
        description: editDesc,
        updatedAt: serverTimestamp()
      });
      setEditingForum(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `forums/${editingForum.id}`);
    }
  };

  const sortedForums = [...forums].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  return (
    <div className="w-full h-[calc(100dvh-96px)] md:h-[calc(100dvh-120px)] flex flex-col p-4 md:p-6 pt-24 md:pt-28 pb-4 md:pb-6 max-w-4xl mx-auto relative z-10">
      <div className="bg-white dark:bg-slate-900 rounded-[32px] md:rounded-[40px] border-2 border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] overflow-hidden flex flex-col h-full min-h-0">
        
        {/* Main State: Forum List */}
        {!activeForum && (
          <div className="flex flex-col h-full">
            {/* Header Card */}
            <div className="p-6 md:p-10 border-b-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
               <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white mb-2 md:mb-3 flex items-center gap-3">
                 <Users className="w-8 h-8 text-teal-500" />
                 Komunitas Kode.in
               </h1>
               <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base">Tempat berdiskusi, mengobrol, dan sharing ilmu dengan sesama pelajar kode!</p>
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                   <MessageSquare className="w-5 h-5 text-primary-accent" /> Forum Diskusi
                 </h2>
                 <Button onClick={() => setIsCreating(!isCreating)} variant="primary" className="py-2 px-4 text-sm rounded-xl">
                   {isCreating ? 'Batal' : <><Plus className="w-4 h-4 mr-1" /> Buat Forum</>}
                 </Button>
              </div>

              {isCreating && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700"
                >
                  <h3 className="font-bold text-slate-800 dark:text-white mb-4">Buat Forum Baru</h3>
                  <div className="space-y-3">
                    <input 
                      type="text" 
                      placeholder="Nama Forum (Contoh: Tim Lomba Web)" 
                      value={newForumTitle}
                      onChange={(e) => setNewForumTitle(e.target.value)}
                      className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary-accent dark:focus:border-primary-accent text-slate-800 dark:text-white"
                    />
                    <input 
                      type="text" 
                      placeholder="Deskripsi singkat..." 
                      value={newForumDesc}
                      onChange={(e) => setNewForumDesc(e.target.value)}
                      className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary-accent dark:focus:border-primary-accent text-slate-800 dark:text-white"
                    />
                    <div className="flex justify-end pt-2">
                      <Button onClick={handleCreateForum} variant="primary" className="py-2 px-6 rounded-xl">Mulai Forum</Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {sortedForums.length === 0 ? (
                <div className="text-center py-12">
                   <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                     <MessageSquare className="w-8 h-8 text-slate-400" />
                   </div>
                   <h3 className="font-bold text-slate-700 dark:text-slate-300">Belum ada forum</h3>
                   <p className="text-sm text-slate-500 mt-1">Jadilah yang pertama membuat forum diskusi!</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {sortedForums.map(forum => (
                    <div 
                      key={forum.id} 
                      onClick={() => handleJoinForum(forum)}
                      className={cn(
                        "p-5 border-2 hover:border-teal-200 dark:hover:border-teal-900/50 rounded-2xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all group relative",
                        forum.isPinned ? "border-amber-200 dark:border-amber-900/50 bg-amber-50/30 dark:bg-amber-900/10" : "border-slate-100 dark:border-slate-800"
                      )}
                    >
                      {forum.isPinned && (
                        <div className="absolute top-0 right-0 w-8 h-8 bg-amber-100 dark:bg-amber-900/50 rounded-bl-2xl rounded-tr-2xl flex items-center justify-center">
                          <Pin className="w-4 h-4 text-amber-600 dark:text-amber-500" />
                        </div>
                      )}
                      
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <Hash className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-800 dark:text-white mb-1 group-hover:text-primary-accent transition-colors truncate pr-6">{forum.title}</h3>
                          <p className="text-sm text-slate-500 line-clamp-2 mb-3">{forum.description}</p>
                          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
                            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {forum.memberCount} Anggota</span>
                            
                            {/* User/Admin Controls */}
                            {(user?.isAdmin || user?.id === forum.authorId) && (
                              <div className="relative">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveMenuId(activeMenuId === forum.id ? null : forum.id);
                                  }} 
                                  className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                                
                                {activeMenuId === forum.id && (
                                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg overflow-hidden z-20">
                                    {user?.isAdmin && (
                                      <button 
                                        onClick={(e) => { togglePin(forum, e); setActiveMenuId(null); }} 
                                        className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-amber-50 dark:hover:bg-amber-900/20 text-slate-700 dark:text-slate-300 transition-colors"
                                      >
                                        {forum.isPinned ? <PinOff className="w-4 h-4 text-amber-500" /> : <Pin className="w-4 h-4 text-amber-500" />}
                                        {forum.isPinned ? "Lepas Sematan" : "Sematkan Forum"}
                                      </button>
                                    )}
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingForum(forum);
                                        setEditTitle(forum.title);
                                        setEditDesc(forum.description);
                                        setActiveMenuId(null);
                                      }} 
                                      className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-700 dark:text-slate-300 transition-colors"
                                    >
                                      <Edit2 className="w-4 h-4 text-blue-500" /> Edit Forum
                                    </button>
                                    <button 
                                      onClick={(e) => { deleteForum(forum.id, e); setActiveMenuId(null); }} 
                                      className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                                    >
                                      <Trash2 className="w-4 h-4" /> Hapus Forum
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Modal Edit Forum */}
            <AnimatePresence>
              {editingForum && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800"
                  >
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Edit Forum</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Nama Forum</label>
                        <input 
                          type="text" 
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary-accent text-slate-800 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Deskripsi</label>
                        <textarea 
                          value={editDesc}
                          onChange={(e) => setEditDesc(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary-accent text-slate-800 dark:text-white resize-none h-24"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 mt-8">
                      <Button onClick={() => setEditingForum(null)} variant="ghost" className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700">Batal</Button>
                      <Button onClick={saveEditForum} variant="primary" className="flex-1 py-3 rounded-xl">Simpan</Button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

          </div>
        )}

        {/* Chat State: Inside a Forum */}
        {activeForum && (() => {
          const isJoined = forumMembers.some(m => m.userId === user?.id);
          const currentMember = forumMembers.find(m => m.userId === user?.id);
          
          return (
          <div className="flex flex-col h-full relative border-l border-slate-200 dark:border-slate-800">
            {/* Chat Header */}
            <div className="p-4 border-b-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4 min-w-0">
                <button 
                  onClick={() => setActiveForumId(null)}
                  className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 hover:text-primary-accent transition-colors shrink-0"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-slate-800 dark:text-white truncate flex items-center gap-2">
                    <Hash className="w-4 h-4 text-slate-400" /> {activeForum.title}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{activeForum.description} • Dibuat oleh {activeForum.authorId === user?.id ? (user?.fullName || user?.username) : activeForum.authorName}</p>
                </div>
              </div>
              
              <button 
                onClick={() => setShowForumSettings(true)}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors shrink-0"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            {/* Pinned Message Banner */}
            {activeForum.pinnedMessage && (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-900 flex items-start gap-3 shrink-0">
                <div className="mt-1 p-1 bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded-full shrink-0">
                  <Pin className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-yellow-800 dark:text-yellow-400">Pesan yang Disematkan</p>
                    {(currentMember?.role === 'moderator' || user?.id === activeForum.authorId || user?.isAdmin) && (
                      <button onClick={handleUnpinChatMessage} className="text-yellow-600 hover:text-yellow-800 dark:hover:text-yellow-200 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="text-sm text-yellow-900 dark:text-yellow-50 mt-0.5">
                    <span className="font-semibold">{activeForum.pinnedMessage.userId === user?.id ? (user?.fullName || user?.username) : activeForum.pinnedMessage.userName}:</span>
                    <ReadMoreText text={` ${activeForum.pinnedMessage.text}`} maxLength={50} className="whitespace-pre-wrap inline" userContextUsername={user?.username} />
                  </div>
                </div>
              </div>
            )}

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-white dark:bg-slate-900">
              {messages.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  Belum ada pesan. Jadilah yang pertama menyapa!
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={cn("flex gap-3 md:gap-4", msg.userId === user?.id ? "flex-row-reverse" : "")}>
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-lg md:text-xl shrink-0 mt-1">
                      {msg.userAvatar}
                    </div>
                    <div className={cn("flex flex-col max-w-[75%] md:max-w-[70%] group", msg.userId === user?.id ? "items-end" : "items-start")}>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-bold text-xs md:text-sm text-slate-700 dark:text-slate-300">{msg.userId === user?.id ? (user?.fullName || user?.username) : msg.userName}</span>
                        <span className="text-[10px] md:text-xs text-slate-400 font-medium px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-full">{msg.userLevel}</span>
                        <span className="text-[10px] md:text-xs text-slate-400">{msg.time}</span>
                      </div>
                      {msg.userId === activeForum.authorId && (
                        <span className="text-[10px] font-bold text-primary-accent mb-1 inline-block -mt-1 uppercase tracking-wider">Pembuat Forum</span>
                      )}
                      
                      <div className={cn("flex items-start gap-2", msg.userId === user?.id ? "flex-row-reverse" : "flex-row")}>
                        {editingMessageId === msg.id ? (
                          <div className={cn(
                            "p-3 md:p-4 rounded-2xl text-sm md:text-base min-w-[200px] shadow-sm",
                            msg.userId === user?.id 
                              ? "bg-primary-accent text-white rounded-tr-sm" 
                              : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm"
                          )}>
                            <textarea
                              value={editMessageContent}
                              onChange={(e) => setEditMessageContent(e.target.value)}
                              className="w-full text-sm bg-transparent border-b border-white/30 dark:border-slate-500 outline-none resize-none"
                              autoFocus
                              rows={2}
                            />
                            <div className="flex justify-end gap-3 mt-2">
                              <button onClick={() => setEditingMessageId(null)} className="text-xs opacity-70 hover:opacity-100">Batal</button>
                              <button onClick={() => handleUpdateMessage(msg.id)} className="text-xs font-bold bg-white/20 px-2 py-1 rounded">Simpan</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <ReadMoreText 
                              text={msg.text} 
                              maxLength={250} 
                              userContextUsername={user?.username}
                              className={cn(
                                "p-3 md:p-4 rounded-2xl text-sm md:text-base whitespace-pre-wrap break-words min-w-0 max-w-full",
                                msg.userId === user?.id 
                                  ? "bg-primary-accent text-white rounded-tr-sm" 
                                  : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm shadow-sm"
                              )}
                            />
                            
                            {(msg.userId === user?.id || currentMember?.role === 'moderator' || user?.id === activeForum.authorId || user?.isAdmin) && (
                              <div className="relative opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity mt-1">
                                <button
                                  onClick={() => setActiveMessageSettingsId(activeMessageSettingsId === msg.id ? null : msg.id)}
                                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 outline-none"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                                
                                <AnimatePresence>
                                  {activeMessageSettingsId === msg.id && (
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0.95 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.95 }}
                                      className={cn(
                                        "absolute top-full mt-1 w-32 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden z-20",
                                        msg.userId === user?.id ? "right-0" : "left-0"
                                      )}
                                    >
                                      {msg.userId === user?.id && (
                                        <button
                                          onClick={() => {
                                            setEditingMessageId(msg.id);
                                            setEditMessageContent(msg.text);
                                            setActiveMessageSettingsId(null);
                                          }}
                                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium border-b border-slate-100 dark:border-slate-700"
                                        >
                                          <Edit2 className="w-3.5 h-3.5" /> Edit
                                        </button>
                                      )}
                                      <button
                                        onClick={() => handleDeleteMessage(msg.id)}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" /> Hapus
                                      </button>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {msg.isEdited && !editingMessageId && (
                        <span className={cn("text-[9px] italic mt-0.5 opacity-60", msg.userId === user?.id ? "text-primary-accent" : "text-slate-400")}>diedit</span>
                      )}
                      
                      {(currentMember?.role === 'moderator' || user?.id === activeForum.authorId || user?.isAdmin) && (
                        <div className={cn("flex mt-1 w-full", msg.userId === user?.id ? "justify-end" : "justify-start")}>
                          <button 
                            onClick={() => handlePinChatMessage(msg)}
                            className="text-[10px] flex items-center gap-1 text-slate-400 hover:text-primary-accent transition-colors"
                          >
                            <Pin className="w-3 h-3" /> Sematkan
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Chat Input */}
            <div className="p-3 md:p-4 bg-white dark:bg-slate-900 border-t-2 border-slate-100 dark:border-slate-800 shrink-0">
              {isJoined ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={`Kirim pesan ke #${activeForum.title}...`}
                    className="flex-1 px-4 py-2.5 md:py-3 text-sm md:text-base bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-700 rounded-[16px] outline-none focus:border-primary-accent dark:focus:border-primary-accent text-slate-800 dark:text-white transition-colors"
                  />
                  <Button onClick={handleSend} variant="primary" className="px-4 md:px-6 rounded-[16px]">
                    <Send className="w-4 h-4 md:w-5 md:h-5" />
                  </Button>
                </div>
              ) : (
                <div className="flex justify-center">
                  <Button onClick={executeJoinForum} variant="primary" className="w-full md:w-auto px-8 rounded-xl py-3">
                    Gabung Forum untuk Merespon
                  </Button>
                </div>
              )}
            </div>
            
            {/* Settings Modal relative to chat */}
            <AnimatePresence>
              {showForumSettings && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: -20, x: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20, x: 20 }}
                  className="absolute top-16 right-4 z-20 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80%]"
                >
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                    <h3 className="font-bold text-slate-800 dark:text-white">Pengaturan Forum</h3>
                    <button onClick={() => setShowForumSettings(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {isJoined && currentMember && (
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                          {currentMember.notificationsEnabled ? <Bell className="w-4 h-4 text-primary-accent" /> : <BellOff className="w-4 h-4 text-slate-400" />}
                          <span className="text-sm font-medium">Ubah Notifikasi</span>
                        </div>
                        <button 
                          onClick={() => handleToggleNotifications(currentMember.id, currentMember.notificationsEnabled)}
                          className={cn(
                            "w-10 h-6 rounded-full flex items-center p-1 transition-colors",
                            currentMember.notificationsEnabled ? "bg-primary-accent" : "bg-slate-300 dark:bg-slate-700"
                          )}
                        >
                          <div className={cn(
                            "w-4 h-4 bg-white rounded-full shadow-sm transition-transform",
                            currentMember.notificationsEnabled ? "translate-x-4" : "translate-x-0"
                          )}></div>
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-4 flex-1 overflow-y-auto">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Anggota Forum ({forumMembers.length})</h4>
                    <div className="space-y-3">
                      {forumMembers.map(member => (
                        <div key={member.id} className="flex items-center gap-3 group relative">
                          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs">
                            👤
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{member.userId === user?.id ? (user?.fullName || user?.username) : member.userName}</p>
                            {member.userId === activeForum.authorId && (
                              <p className="text-[10px] text-primary-accent font-bold">Pembuat Forum</p>
                            )}
                            {member.role === 'moderator' && member.userId !== activeForum.authorId && (
                              <p className="text-[10px] text-green-500 font-bold">Moderator</p>
                            )}
                          </div>
                          {(user?.id === activeForum.authorId || currentMember?.role === 'moderator') && member.userId !== activeForum.authorId && (
                            <div className="relative">
                              <button 
                                onClick={() => setActiveMemberSettingsId(activeMemberSettingsId === member.id ? null : member.id)}
                                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors bg-transparent border-none opacity-0 group-hover:opacity-100 focus:opacity-100"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                              
                              <AnimatePresence>
                                {activeMemberSettingsId === member.id && (
                                  <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 py-1 z-30"
                                  >
                                    {member.role !== 'moderator' && user?.id === activeForum.authorId && (
                                      <button 
                                        onClick={() => {
                                          handleMakeModerator(member.id);
                                          setActiveMemberSettingsId(null);
                                        }}
                                        className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium flex items-center gap-2"
                                      >
                                        <ShieldAlert className="w-3.5 h-3.5 text-green-500" /> Jadikan Moderator
                                      </button>
                                    )}
                                    {member.role === 'moderator' && user?.id === activeForum.authorId && (
                                      <button 
                                        onClick={() => {
                                          handleRemoveModerator(member.id);
                                          setActiveMemberSettingsId(null);
                                        }}
                                        className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium flex items-center gap-2"
                                      >
                                        <ShieldAlert className="w-3.5 h-3.5 text-orange-500" /> Hapus Status Moderator
                                      </button>
                                    )}
                                    <button 
                                      onClick={() => {
                                        handleKickMember(member.id);
                                        setActiveMemberSettingsId(null);
                                      }}
                                      className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium flex items-center gap-2 border-t border-slate-100 dark:border-slate-700"
                                    >
                                      <LogOut className="w-3.5 h-3.5" /> Keluarkan User
                                    </button>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          )}
                        </div>
                      ))}
                      {forumMembers.length === 0 && (
                        <p className="text-sm text-slate-500">Belum ada anggota yang bergabung.</p>
                      )}
                    </div>
                  </div>
                  
                  {isJoined && (
                    <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-red-50 dark:bg-red-900/10">
                      <button 
                        onClick={handleLeaveForum}
                        className="w-full flex items-center justify-center gap-2 py-2 text-sm font-bold text-red-600 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Keluar Forum
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            
          </div>
          );
        })()}
      </div>
    </div>
  );
}
