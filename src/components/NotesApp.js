import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Search, Plus, Edit3, Trash2, Tag, Save, X, FileText, 
  Bold, Italic, Underline, List, ListOrdered, LogOut, LogIn
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw'; 
import '../styles/NotesApp.css';
import Header from './Header';
import Footer from './Footer';
import AuthModal from './AuthModal';

const API_BASE_URL = process.env.REACT_APP_BACKEND_API_BASE_URL;

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const editorRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const applyFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  return (
    <div className="rich-editor-container">
      <div className="formatting-toolbar">
        <button 
          type="button" 
          className="format-button" 
          onMouseDown={(e) => {
            e.preventDefault();
            applyFormat('bold');
          }}
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button 
          type="button" 
          className="format-button" 
          onMouseDown={(e) => {
            e.preventDefault();
            applyFormat('italic');
          }}
          title="Italic"
        >
          <Italic size={16} />
        </button>
        <button 
          type="button" 
          className="format-button" 
          onMouseDown={(e) => {
            e.preventDefault();
            applyFormat('underline');
          }}
          title="Underline"
        >
          <Underline size={16} />
        </button>
        <button 
          type="button" 
          className="format-button" 
          onMouseDown={(e) => {
            e.preventDefault();
            applyFormat('insertUnorderedList');
          }}
          title="Bullet List"
        >
          <List size={16} />
        </button>
        <button 
          type="button" 
          className="format-button" 
          onMouseDown={(e) => {
            e.preventDefault();
            applyFormat('insertOrderedList');
          }}
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </button>
      </div>
      
      <div
        ref={editorRef}
        className={`rich-editor ${isFocused ? 'focused' : ''}`}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        data-placeholder={placeholder}
      />
    </div>
  );
};

const NotesApp = () => {
  // State Otentikasi & Data 
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [notes, setNotes] = useState([]);

  // State UI 
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newNote, setNewNote] = useState({
    title: '',
    tags: '',
    content: '' 
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  // --- FUNGSI OTENTIKASI ---

  const handleAuthSuccess = (newToken, username) => {
    setUser({ username });
    setToken(newToken);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify({ username }));
    setShowAuthModal(false);
  };

  const handleLogout = async () => {
    if (token) {
        try {
          await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
          });
        } catch (error) {
          console.error('Logout API failed but proceeding with client logout:', error);
        }
    }

    setUser(null);
    setToken(null);
    setNotes([]); 
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsCreating(false);
    setEditingId(null);
    setNewNote({ title: '', tags: '', content: '' });
    alert('Logout berhasil!');
  };

  // --- FUNGSI API CATATAN (CRUD) ---

  const fetchNotes = useCallback(async () => {
    if (!token) {
      setNotes([]);
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/notes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const result = await response.json();
        const fetchedNotes = result?.data?.notes || []; 

        if (!Array.isArray(fetchedNotes)) {
            console.error("Fetched notes is not an array:", fetchedNotes);
            setNotes([]);
            return;
        }

        const formattedNotes = fetchedNotes.map(note => ({
          id: note._id, 
          title: note.title,
          tags: note.tags,
          content: note.content,
          createdAt: note.createdAt, 
          updatedAt: note.updatedAt,
        }));

        setNotes(formattedNotes);
      } else if (response.status === 401) {
        alert('Sesi berakhir. Silakan login kembali.');
        handleLogout(); 
      }
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchNotes();
    } else {
      setNotes([]); 
    }
  }, [token, fetchNotes]);

  const handleCreateNote = async () => {
    if (!token || (!newNote.title.trim() && !newNote.content.trim())) return;

    try {
      const response = await fetch(`${API_BASE_URL}/notes`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          title: newNote.title || 'Untitled',
          content: newNote.content,
          tags: newNote.tags
        })
      });

      const data = await response.json();

      if (data.success) {
        fetchNotes(); 
        setNewNote({ title: '', tags: '', content: '' });
        setIsCreating(false);
      } else {
        alert(`Gagal membuat catatan: ${data.message || 'Terjadi kesalahan.'}`);
      }

    } catch (error) {
      console.error('Create note failed:', error);
      alert('Koneksi gagal saat membuat catatan.');
    }
  };

  const handleUpdateNote = async () => {
    if (!token || !editingId || (!newNote.title.trim() && !newNote.content.trim())) return;

    try {
      const response = await fetch(`${API_BASE_URL}/notes/${editingId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          title: newNote.title || 'Untitled',
          content: newNote.content,
          tags: newNote.tags
        })
      });

      const data = await response.json();

      if (data.success) {
        fetchNotes(); 
        setNewNote({ title: '', tags: '', content: '' });
        setEditingId(null);
      } else {
        alert(`Gagal update catatan: ${data.message || 'Terjadi kesalahan.'}`);
      }

    } catch (error) {
      console.error('Update note failed:', error);
      alert('Koneksi gagal saat update catatan.');
    }
  };

  const handleDeleteNote = async (id) => {
    if (!token) return;
    
    if (window.confirm('Yakin ingin menghapus catatan ini?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await response.json();

        if (data.success) {
          fetchNotes(); 
        } else {
          alert(`Gagal menghapus catatan: ${data.message || 'Terjadi kesalahan.'}`);
        }
      } catch (error) {
        console.error('Delete note failed:', error);
        alert('Koneksi gagal saat menghapus catatan.');
      }
    }
  };

  // --- FUNGSI UTILITY ---

  const handleEditNote = (note) => {
    setNewNote({ title: note.title, tags: note.tags, content: note.content });
    setEditingId(note.id);
    setIsCreating(false);
  };

  const handleCancel = () => {
    setNewNote({ title: '', tags: '', content: '' });
    setIsCreating(false);
    setEditingId(null);
  };

  const parseTags = (tagsString) => tagsString.match(/#[\w\u00C0-\u017F]+/g) || [];

  const filteredNotes = notes.filter(note => {
    const searchLower = searchTerm.toLowerCase();
    return (
      note.title.toLowerCase().includes(searchLower) ||
      note.content.toLowerCase().includes(searchLower) ||
      note.tags.toLowerCase().includes(searchLower)
    );
  });

  // --- RENDER GUEST VIEW ---
  if (!user) {
    return (
      <div className="container">
        <Header 
          onShowLogin={() => { setAuthMode('login'); setShowAuthModal(true); }}
          onShowRegister={() => { setAuthMode('register'); setShowAuthModal(true); }}
          user={user} 
          onLogout={handleLogout}
        />
        <AuthModal
          isOpen={showAuthModal}
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onSwitchMode={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
          onAuthSuccess={handleAuthSuccess} 
        />
        <main className="main guest-view">
          <div className="guest-content">
            <h1 style={{color: '#e8e8e8', marginBottom: '16px'}}>Selamat Datang di Catatanku</h1>
            <p style={{color: '#ccc', fontSize: '16px', marginBottom: '32px'}}>
              Silakan <strong>Login</strong> atau <strong>Daftar</strong> untuk mulai membuat dan mengelola catatan Anda.
            </p>
            <div className="auth-buttons" style={{justifyContent: 'center', gap: '16px'}}>
              <button 
                className="auth-button login-button" 
                onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
              >
                <LogIn size={16} />
                Login
              </button>
              <button 
                className="auth-button register-button" 
                onClick={() => { setAuthMode('register'); setShowAuthModal(true); }}
              >
                Register
              </button>
            </div>
          </div>
        </main>
        <Footer totalNotes={0} />
      </div>
    );
  }

  // --- RENDER LOGGED IN VIEW ---
  return (
    <div className="container">
      <Header 
        onShowLogin={() => { setAuthMode('login'); setShowAuthModal(true); }}
        onShowRegister={() => { setAuthMode('register'); setShowAuthModal(true); }}
        user={user} 
        onLogout={handleLogout} 
      />

      <AuthModal
        isOpen={showAuthModal}
        mode={authMode}
        onClose={() => setShowAuthModal(false)}
        onSwitchMode={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
        onAuthSuccess={handleAuthSuccess} 
      />

      <main className="main">
        <div className="search-container">
          <div className="search-box">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              className="search-input"
              placeholder="Cari catatan, judul, atau tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className="create-button"
            onClick={() => setIsCreating(true)}
            disabled={isCreating || editingId}
          >
            <Plus size={16} />
            New Note
          </button>
        </div>

        {(isCreating || editingId) && (
          <div className="note-form">
            <h3 className="form-title">
              {editingId ? 'Edit Note' : `Create New Note (as ${user.username})`}
            </h3>
            
            <div className="input-group">
              <label className="label">Title</label>
              <input
                type="text"
                className="input"
                placeholder="Enter note title..."
                value={newNote.title}
                onChange={(e) => setNewNote({...newNote, title: e.target.value})}
              />
            </div>
            
            <div className="input-group">
              <label className="label">
                <Tag size={14} style={{marginRight: '6px'}} />
                Tags
              </label>
              <input
                type="text"
                className="input"
                placeholder="e.g., #important #work #ideas"
                value={newNote.tags}
                onChange={(e) => setNewNote({...newNote, tags: e.target.value})}
              />
            </div>
            
            <div className="input-group">
              <label className="label">Content</label>
              
              {/* GANTI TEXTAREA DENGAN RICH TEXT EDITOR */}
              <RichTextEditor
                value={newNote.content}
                onChange={(content) => setNewNote({...newNote, content})}
                placeholder="Write your note here... Use the toolbar to format text. Press Enter for new lines."
              />
              
              <div className="markdown-hint">
                💡 Tip: Tekan Enter untuk membuat baris baru. Gunakan toolbar untuk format teks (bold, italic, dll).
              </div>
            </div>
            
            <div className="form-actions">
              <button
                className="save-button"
                onClick={editingId ? handleUpdateNote : handleCreateNote}
              >
                <Save size={14} />
                {editingId ? 'Update Note' : 'Save Note'}
              </button>
              <button className="cancel-button" onClick={handleCancel}>
                <X size={14} />
                Cancel
              </button>
            </div>
          </div>
        )}
        
        {filteredNotes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <FileText size={48} />
            </div>
            <h3 style={{color: '#888', marginBottom: '8px'}}>
              {searchTerm ? 'No notes found' : 'No notes yet'}
            </h3>
            <p style={{color: '#666'}}>
              {searchTerm ? 'Try a different search term' : 'Click "New Note" to create your first note'}
            </p>
          </div>
        ) : (
          <div className="notes-grid">
            {filteredNotes.map((note) => (
              <div
                key={note.id} 
                className="note-card"
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#555';
                  e.currentTarget.querySelector('.note-actions').style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#404040';
                  e.currentTarget.querySelector('.note-actions').style.opacity = '0';
                }}
              >
                <div className="note-header">
                  <h4 className="note-title">{note.title}</h4>
                  <div className="note-actions">
                    <button
                      className="action-button"
                      onClick={() => handleEditNote(note)}
                      title="Edit note"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      className="action-button"
                      onClick={() => handleDeleteNote(note.id)}
                      title="Delete note"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                
                <div className="note-date">
                  Created: {note.createdAt}
                  {note.updatedAt !== note.createdAt && (
                    <span> • Updated: {note.updatedAt}</span>
                  )}
                </div>

                {note.tags && (
                  <div className="tags">
                    {parseTags(note.tags).map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                )}
                
                {/* TAMPILKAN CONTENT SEBAGAI HTML */}
                <div 
                  className="note-content"
                  dangerouslySetInnerHTML={{ __html: note.content || 'No content' }}
                />
                
                
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer totalNotes={notes.length} />
    </div>
  );
};

export default NotesApp;
