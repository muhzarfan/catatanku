import React, { useState } from 'react';
import { X, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import '../styles/NotesApp.css';

const API_BASE_URL = process.env.REACT_APP_BACKEND_API_BASE_URL;

const AuthModal = ({ isOpen, mode, onClose, onSwitchMode, onAuthSuccess }) => {
  const [formData, setFormData] = useState({
    name: '', 
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (mode === 'register') {
      if (!formData.name.trim()) {
        newErrors.name = 'Username wajib diisi';
      }
      
      if (!formData.email.trim()) {
        newErrors.email = 'Email wajib diisi';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Format email tidak valid';
      }

      if (!formData.password) {
        newErrors.password = 'Password wajib diisi';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password minimal 6 karakter';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Konfirmasi password wajib diisi';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Password tidak cocok';
      }

    } else { // Login
      if (!formData.name.trim()) {
        newErrors.name = 'Username wajib diisi'; 
      }

      if (!formData.password) {
        newErrors.password = 'Password wajib diisi';
      } 
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    let endpoint = '';
    let body = {};

    if (mode === 'login') {
      endpoint = `${API_BASE_URL}/auth/login`;
      body = { username: formData.name, password: formData.password };
    } else { // register
      endpoint = `${API_BASE_URL}/auth/register`;
      body = { 
        username: formData.name, 
        email: formData.email, 
        password: formData.password 
      };
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (data.success) {
        if (mode === 'register') {
          alert('Pendaftaran berhasil! Silakan masuk.');
          onSwitchMode();
        } else {
          // Asumsi API login mengembalikan token dan info user di 'data'
          const token = data.data.token;
          const user = data.data.user || { username: formData.name }; 
          
          onAuthSuccess(token, user.username); 
          alert(`Login berhasil sebagai ${user.username}!`);
          resetForm();
          onClose();
        }
      } else {
        alert(`Autentikasi gagal: ${data.message || 'Terjadi kesalahan. Cek kredensial Anda.'}`);
      }

    } catch (error) {
      console.error('API Error:', error);
      alert('Koneksi gagal atau server bermasalah.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSwitchMode = () => {
    resetForm();
    onSwitchMode();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {mode === 'login' ? 'Masuk ke Akun' : 'Daftar Akun Baru'}
          </h2>
          <button className="modal-close" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label className="label">
              <User size={14} style={{marginRight: '6px'}} />
              Username
            </label>
            <input
              type="text"
              name="name" 
              className={`input ${errors.name ? 'input-error' : ''}`}
              placeholder="Masukkan username"
              value={formData.name}
              onChange={handleInputChange}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          {mode === 'register' && (
            <div className="input-group">
              <label className="label">
                <Mail size={14} style={{marginRight: '6px'}} />
                Email
              </label>
              <input
                type="email"
                name="email"
                className={`input ${errors.email ? 'input-error' : ''}`}
                placeholder="Masukkan email"
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
          )}

          <div className="input-group">
            <label className="label">
              <Lock size={14} style={{marginRight: '6px'}} />
              Password
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                className={`input password-input ${errors.password ? 'input-error' : ''}`}
                placeholder="Masukkan password"
                value={formData.password}
                onChange={handleInputChange}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          {mode === 'register' && (
            <div className="input-group">
              <label className="label">
                <Lock size={14} style={{marginRight: '6px'}} />
                Konfirmasi Password
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  className={`input password-input ${errors.confirmPassword ? 'input-error' : ''}`}
                  placeholder="Konfirmasi password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>
          )}

          <button type="submit" className="auth-submit-button" disabled={isLoading}>
            {isLoading ? 'Memproses...' : (mode === 'login' ? 'Masuk' : 'Daftar')}
          </button>

          <div className="auth-switch">
            <p>
              {mode === 'login' 
                ? 'Belum punya akun? ' 
                : 'Sudah punya akun? '
              }
              <button 
                type="button" 
                className="auth-switch-button" 
                onClick={handleSwitchMode}
              >
                {mode === 'login' ? 'Daftar di sini' : 'Masuk di sini'}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
