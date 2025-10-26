import React, { useState, useEffect } from 'react';
import { useRouteForm } from './hooks/useRouteForm';
import { useAuth } from './hooks/useAuth';
import { useUser } from './hooks/useUser';
import { useRouteAreas } from './hooks/useRouteAreas';
import './App.css';

function App() {
  // Все переменные из useRouteForm
  const { 
    cities, 
    interests, 
    moods, 
    loading: formLoading, 
    error: formError,
    formState,
    generatedRoute,
    generating,
    generateError,
    currentRoute,
    routeLoading,
    routeError,
    setSelectedCity,
    toggleInterest,
    setSelectedMood,
    setLocalParams,
    setDescription,
    submitForm,
    loadRoute,
    cancelCurrentRoute,
    editRouteStatus,
    submitFeedback,
    isValid,
    isAuthenticated
  } = useRouteForm();

  const { 
    user, 
    loading: authLoading, 
    error: authError, 
    login, 
    register, 
    logout
  } = useAuth();

  const { 
    userProfile, 
    userRoutes, 
    userStatistics, 
    loading: userLoading, 
    error: userError, 
    loadUserData,
    updateUserRoutes 
  } = useUser();

  const { 
    areas, 
    loading: areasLoading, 
    error: areasError, 
    getAreas 
  } = useRouteAreas();

  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [routeFilter, setRouteFilter] = useState('');
  const [routeIdInput, setRouteIdInput] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [selectedCityForAreas, setSelectedCityForAreas] = useState('');

  // Загружаем данные пользователя при авторизации
  useEffect(() => {
    if (isAuthenticated) {
      loadUserData();
    }
  }, [isAuthenticated, loadUserData]);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (authMode === 'login') {
        await login(email, password);
      } else {
        await register(email, password);
      }
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error('Ошибка авторизации:', err);
    }
  };

  const handleSubmit = async () => {
    try {
      const result = await submitForm();
      console.log('Маршрут сгенерирован:', result);
      await loadUserData();
    } catch (err) {
      console.error('Ошибка:', err);
    }
  };

  const handleLoadRoute = async () => {
    if (!routeIdInput.trim()) return;
    try {
      const result = await loadRoute(routeIdInput);
      console.log('Маршрут загружен:', result);
    } catch (err) {
      console.error('Ошибка:', err);
    }
  };

  const handleCancelRoute = async () => {
    if (!routeIdInput.trim()) return;
    try {
      const result = await cancelCurrentRoute(routeIdInput, cancelReason);
      console.log('Маршрут отменен:', result);
      await loadUserData();
    } catch (err) {
      console.error('Ошибка:', err);
    }
  };

  const handleEditStatus = async (status) => {
    if (!routeIdInput.trim()) return;
    try {
      const result = await editRouteStatus(routeIdInput, status);
      console.log('Статус обновлен:', result);
      await loadUserData();
    } catch (err) {
      console.error('Ошибка:', err);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!routeIdInput.trim()) return;
    try {
      const result = await submitFeedback(routeIdInput, feedbackRating, feedbackComment);
      console.log('Отзыв отправлен:', result);
      setFeedbackRating(5);
      setFeedbackComment('');
    } catch (err) {
      console.error('Ошибка:', err);
    }
  };

  const handleLoadAreas = async () => {
    if (!selectedCityForAreas.trim()) return;
    try {
      const result = await getAreas(selectedCityForAreas);
      console.log('Районы загружены:', result);
    } catch (err) {
      console.error('Ошибка:', err);
    }
  };

  const handleFilterRoutes = async (status) => {
    setRouteFilter(status);
    try {
      await updateUserRoutes(status ? { status } : {});
    } catch (err) {
      console.error('Ошибка фильтрации:', err);
    }
  };

  if (formLoading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Загрузка данных формы...</h2>
        <p>Пожалуйста, подождите</p>
      </div>
    );
  }

  if (formError) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h2>Ошибка загрузки данных</h2>
        <p>{formError}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h1 style={{ margin: '0 0 10px 0', color: '#333' }}>🚗 Генератор маршрутов</h1>
        <p style={{ margin: '0', color: '#666' }}>Создайте идеальный маршрут для вашей прогулки</p>
      </header>
      
      {/* Блок авторизации */}
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: 'white' }}>
        <h2 style={{ marginTop: '0', color: '#333' }}>🔐 Авторизация</h2>
        
        {isAuthenticated ? (
          <div>
            <p style={{ fontSize: '16px', marginBottom: '15px' }}>
              ✅ Вы авторизованы как: <strong>{user?.email || 'Пользователь'}</strong>
            </p>
            <button 
              onClick={logout}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Выйти
            </button>
          </div>
        ) : (
          <form onSubmit={handleAuth}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontWeight: 'bold' }}>Email: </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ marginLeft: '10px', padding: '8px', width: '250px', border: '1px solid #ddd', borderRadius: '4px' }}
                required
                placeholder="your@email.com"
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontWeight: 'bold' }}>Пароль: </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ marginLeft: '10px', padding: '8px', width: '250px', border: '1px solid #ddd', borderRadius: '4px' }}
                required
                placeholder="Введите пароль"
              />
            </div>
            
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button 
                type="submit"
                disabled={authLoading}
                style={{ 
                  padding: '10px 20px', 
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  minWidth: '120px'
                }}
              >
                {authLoading ? 'Загрузка...' : (authMode === 'login' ? 'Войти' : 'Зарегистрироваться')}
              </button>
              
              <button 
                type="button"
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                style={{ 
                  padding: '10px 20px', 
                  backgroundColor: 'transparent',
                  color: '#007bff',
                  border: '1px solid #007bff',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                {authMode === 'login' ? 'Регистрация' : 'Вход'}
              </button>
            </div>
            
            {authError && (
              <div style={{ color: '#dc3545', marginTop: '10px', padding: '10px', backgroundColor: '#f8d7da', borderRadius: '4px' }}>
                <strong>Ошибка:</strong> {authError}
              </div>
            )}
          </form>
        )}
      </div>

      {/* Блок районов */}
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #17a2b8', borderRadius: '8px', backgroundColor: '#e3f2fd' }}>
        <h2 style={{ marginTop: '0', color: '#333' }}>🗺️ Районы города</h2>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold' }}>Выберите город для просмотра районов: </label>
          <select 
            value={selectedCityForAreas}
            onChange={(e) => setSelectedCityForAreas(e.target.value)}
            style={{ marginLeft: '10px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', minWidth: '200px' }}
          >
            <option value="">Выберите город</option>
            {cities.map(city => (
              <option key={city.id} value={city.id}>{city.name}</option>
            ))}
          </select>
          
          <button 
            onClick={handleLoadAreas}
            disabled={!selectedCityForAreas || areasLoading}
            style={{ 
              marginLeft: '10px',
              padding: '8px 16px', 
              backgroundColor: selectedCityForAreas ? '#17a2b8' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: selectedCityForAreas ? 'pointer' : 'not-allowed',
              fontSize: '14px'
            }}
          >
            {areasLoading ? 'Загрузка...' : 'Загрузить районы'}
          </button>
        </div>

        {areasError && (
          <div style={{ color: '#dc3545', marginTop: '10px', padding: '10px', backgroundColor: '#f8d7da', borderRadius: '4px' }}>
            <strong>Ошибка:</strong> {areasError}
          </div>
        )}

        {areas && (
          <div>
            <h3 style={{ color: '#333', marginBottom: '15px' }}>Районы {areas.city.name}:</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
              {areas.areas.map((area, index) => (
                <div key={index} style={{ padding: '15px', border: '1px solid #b3e5fc', borderRadius: '8px', backgroundColor: 'white' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#01579b' }}>{area.name}</h4>
                  <p style={{ margin: '0 0 10px 0', color: '#666', lineHeight: '1.4' }}>{area.description}</p>
                  {area.image_url && (
                    <img 
                      src={area.image_url} 
                      alt={area.name}
                      style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Блок генерации маршрута */}
      {isAuthenticated && (
        <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #007bff', borderRadius: '8px', backgroundColor: '#f0f8ff' }}>
          <h2 style={{ marginTop: '0', color: '#333' }}>🎯 Генерация маршрута</h2>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Город: </label>
            <select 
              onChange={(e) => {
                const city = cities.find(c => c.id === e.target.value);
                setSelectedCity(city || null);
              }}
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', minWidth: '250px' }}
            >
              <option value="">Выберите город</option>
              {cities.map(city => (
                <option key={city.id} value={city.id}>{city.name}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Интересы: </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '10px' }}>
              {interests.map(interest => (
                <label 
                  key={interest.id} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    padding: '12px', 
                    border: `2px solid ${formState.selectedInterests.some(i => i.id === interest.id) ? '#007bff' : '#ddd'}`, 
                    borderRadius: '8px', 
                    backgroundColor: formState.selectedInterests.some(i => i.id === interest.id) ? '#e3f2fd' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <input
                    type="checkbox"
                    onChange={() => toggleInterest(interest)}
                    checked={formState.selectedInterests.some(i => i.id === interest.id)}
                    style={{ marginRight: '10px', marginTop: '2px' }}
                  />
                  <span style={{ marginRight: '10px', fontSize: '20px' }}>{interest.emoji}</span>
                  <div>
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{interest.label}</div>
                    <div style={{ fontSize: '12px', color: '#666', lineHeight: '1.3' }}>{interest.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Настроение: </label>
            <select 
              onChange={(e) => {
                const mood = moods.find(m => m.id === e.target.value);
                setSelectedMood(mood || null);
              }}
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', minWidth: '250px' }}
            >
              <option value="">Выберите настроение</option>
              {moods.map(mood => (
                <option key={mood.id} value={mood.id}>{mood.emoji} {mood.label}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Дополнительные параметры: </label>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Бюджет: </label>
                <select 
                  value={formState.localParams.budget}
                  onChange={(e) => setLocalParams({ budget: e.target.value })}
                  style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', minWidth: '120px' }}
                >
                  <option value="economy">Эконом</option>
                  <option value="comfort">Комфорт</option>
                  <option value="premium">Премиум</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Транспорт: </label>
                <select 
                  value={formState.localParams.transport}
                  onChange={(e) => setLocalParams({ transport: e.target.value })}
                  style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', minWidth: '120px' }}
                >
                  <option value="walking">Пешком</option>
                  <option value="public">Общественный транспорт</option>
                  <option value="car">Автомобиль</option>
                  <option value="bicycle">Велосипед</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Длительность: </label>
                <select 
                  value={formState.localParams.duration}
                  onChange={(e) => setLocalParams({ duration: e.target.value })}
                  style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', minWidth: '120px' }}
                >
                  <option value="short">Короткая (1 час)</option>
                  <option value="medium">Средняя (2 часа)</option>
                  <option value="long">Длинная (3 часа)</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Описание: </label>
            <input
              type="text"
              placeholder="Опишите ваши пожелания (например: романтическая прогулка, семейный отдых...)"
              onChange={(e) => setDescription(e.target.value)}
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', width: '100%', maxWidth: '500px' }}
            />
          </div>

          <button 
            onClick={handleSubmit}
            disabled={!isValid || generating}
            style={{ 
              padding: '12px 24px', 
              backgroundColor: isValid ? '#007bff' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isValid ? 'pointer' : 'not-allowed',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            {generating ? '🔄 Генерация...' : '🚀 Сгенерировать маршрут'}
          </button>

          {!isValid && formState.selectedCity && (
            <div style={{ color: '#856404', marginTop: '10px', padding: '10px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
              ⚠️ Для генерации маршрута необходимо выбрать интересы и настроение
            </div>
          )}

          {generateError && (
            <div style={{ color: '#dc3545', marginTop: '10px', padding: '10px', backgroundColor: '#f8d7da', borderRadius: '4px' }}>
              <strong>Ошибка генерации:</strong> {generateError}
            </div>
          )}

          {generatedRoute && (
            <div style={{ marginTop: '20px', padding: '20px', border: '2px solid #28a745', borderRadius: '8px', backgroundColor: '#f8fff9' }}>
              <h3 style={{ marginTop: '0', color: '#155724' }}>✅ Маршрут успешно сгенерирован!</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <strong>ID маршрута:</strong>
                  <div style={{ fontFamily: 'monospace', background: '#f8f9fa', padding: '5px', borderRadius: '4px', marginTop: '5px' }}>
                    {generatedRoute.route_id}
                  </div>
                </div>
                <div>
                  <strong>Карта:</strong>
                  <div style={{ marginTop: '5px' }}>
                    <a 
                      href={generatedRoute.map_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ 
                        color: '#007bff', 
                        textDecoration: 'none',
                        padding: '5px 10px',
                        border: '1px solid #007bff',
                        borderRadius: '4px',
                        display: 'inline-block'
                      }}
                    >
                      📍 Открыть карту
                    </a>
                  </div>
                </div>
              </div>
              
              <h4 style={{ color: '#333', marginBottom: '15px' }}>Точки маршрута:</h4>
              <div style={{ display: 'grid', gap: '15px' }}>
                {generatedRoute.points.map((point, index) => (
                  <div key={point.id} style={{ padding: '15px', border: '1px solid #dee2e6', borderRadius: '8px', backgroundColor: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <h5 style={{ margin: '0', color: '#333', fontSize: '16px' }}>
                        {index + 1}. {point.name}
                      </h5>
                      <span style={{ 
                        padding: '4px 8px', 
                        backgroundColor: '#e9ecef', 
                        borderRadius: '12px', 
                        fontSize: '12px',
                        color: '#495057'
                      }}>
                        {point.visit_time}
                      </span>
                    </div>
                    <p style={{ margin: '0 0 10px 0', color: '#666', lineHeight: '1.4' }}>{point.description}</p>
                    <div>
                      {point.tags.map((tag, tagIndex) => (
                        <span 
                          key={tagIndex} 
                          style={{ 
                            marginRight: '8px', 
                            background: '#f8f9fa', 
                            padding: '4px 8px', 
                            borderRadius: '12px', 
                            fontSize: '12px',
                            color: '#495057',
                            border: '1px solid #dee2e6'
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Блок управления маршрутами */}
      {isAuthenticated && (
        <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #6f42c1', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
          <h2 style={{ marginTop: '0', color: '#333' }}>⚙️ Управление маршрутами</h2>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>ID маршрута: </label>
            <input
              type="text"
              placeholder="Введите route_id"
              value={routeIdInput}
              onChange={(e) => setRouteIdInput(e.target.value)}
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', width: '100%', maxWidth: '300px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <button 
              onClick={handleLoadRoute}
              disabled={!routeIdInput || routeLoading}
              style={{ 
                padding: '10px 16px', 
                backgroundColor: routeIdInput ? '#28a745' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: routeIdInput ? 'pointer' : 'not-allowed',
                fontSize: '14px'
              }}
            >
              {routeLoading ? '📥 Загрузка...' : '📥 Загрузить маршрут'}
            </button>

            <button 
              onClick={() => handleEditStatus('going')}
              disabled={!routeIdInput || routeLoading}
              style={{ 
                padding: '10px 16px', 
                backgroundColor: routeIdInput ? '#ffc107' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: routeIdInput ? 'pointer' : 'not-allowed',
                fontSize: '14px'
              }}
            >
              🚶 В процессе
            </button>

            <button 
              onClick={() => handleEditStatus('done')}
              disabled={!routeIdInput || routeLoading}
              style={{ 
                padding: '10px 16px', 
                backgroundColor: routeIdInput ? '#28a745' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: routeIdInput ? 'pointer' : 'not-allowed',
                fontSize: '14px'
              }}
            >
              ✅ Завершить
            </button>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Причина отмены"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', width: '150px' }}
              />
              <button 
                onClick={handleCancelRoute}
                disabled={!routeIdInput || routeLoading}
                style={{ 
                  padding: '10px 16px', 
                  backgroundColor: routeIdInput ? '#dc3545' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: routeIdInput ? 'pointer' : 'not-allowed',
                  fontSize: '14px'
                }}
              >
                ❌ Отменить
              </button>
            </div>
          </div>

          {/* Блок отзыва */}
          <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #fd7e14', borderRadius: '8px', backgroundColor: '#fff3cd' }}>
            <h4 style={{ marginTop: '0', color: '#333' }}>💬 Оставить отзыв о маршруте</h4>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>Оценка: </label>
                <select 
                  value={feedbackRating}
                  onChange={(e) => setFeedbackRating(parseInt(e.target.value))}
                  style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num} ⭐</option>
                  ))}
                </select>
              </div>
              
              <div style={{ flex: '1', minWidth: '200px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>Отзыв: </label>
                <input
                  type="text"
                  placeholder="Ваш отзыв (необязательно)"
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }}
                />
              </div>
              
              <div style={{ alignSelf: 'flex-end' }}>
                <button 
                  onClick={handleSubmitFeedback}
                  disabled={!routeIdInput || routeLoading}
                  style={{ 
                    padding: '10px 16px', 
                    backgroundColor: routeIdInput ? '#fd7e14' : '#ccc',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: routeIdInput ? 'pointer' : 'not-allowed',
                    fontSize: '14px'
                  }}
                >
                  📝 Отправить отзыв
                </button>
              </div>
            </div>
          </div>

          {routeError && (
            <div style={{ color: '#dc3545', marginTop: '10px', padding: '10px', backgroundColor: '#f8d7da', borderRadius: '4px' }}>
              <strong>Ошибка:</strong> {routeError}
            </div>
          )}

          {currentRoute && (
            <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #007bff', borderRadius: '8px', backgroundColor: '#f0f8ff' }}>
              <h3 style={{ marginTop: '0', color: '#333' }}>📋 Загруженный маршрут</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <strong>ID:</strong>
                  <div style={{ fontFamily: 'monospace', background: '#f8f9fa', padding: '5px', borderRadius: '4px', marginTop: '5px' }}>
                    {currentRoute.route_id}
                  </div>
                </div>
                <div>
                  <strong>Статус:</strong>
                  <div style={{ marginTop: '5px' }}>
                    <span style={{ 
                      padding: '6px 12px', 
                      borderRadius: '12px', 
                      fontSize: '14px',
                      backgroundColor: 
                        currentRoute.status === 'going' ? '#fff3cd' :
                        currentRoute.status === 'done' ? '#d4edda' :
                        currentRoute.status === 'cancelled' ? '#f8d7da' : '#e2e3e5',
                      color: 
                        currentRoute.status === 'going' ? '#856404' :
                        currentRoute.status === 'done' ? '#155724' :
                        currentRoute.status === 'cancelled' ? '#721c24' : '#383d41',
                      border: `1px solid ${
                        currentRoute.status === 'going' ? '#ffeaa7' :
                        currentRoute.status === 'done' ? '#c3e6cb' :
                        currentRoute.status === 'cancelled' ? '#f5c6cb' : '#d6d8db'
                      }`
                    }}>
                      {currentRoute.status === 'going' ? '🚶 Активный' :
                       currentRoute.status === 'done' ? '✅ Завершён' :
                       currentRoute.status === 'cancelled' ? '❌ Отменён' : currentRoute.status}
                    </span>
                  </div>
                </div>
                <div>
                  <strong>Длительность:</strong>
                  <div style={{ marginTop: '5px', fontSize: '16px', fontWeight: 'bold' }}>
                    {currentRoute.total_duration} мин
                  </div>
                </div>
                <div>
                  <strong>Стоимость:</strong>
                  <div style={{ marginTop: '5px', fontSize: '16px', fontWeight: 'bold', color: '#28a745' }}>
                    {currentRoute.total_cost} ₽
                  </div>
                </div>
              </div>
              
              <h4 style={{ color: '#333', marginBottom: '15px' }}>Точки маршрута:</h4>
              <div style={{ display: 'grid', gap: '15px' }}>
                {currentRoute.points.map((point, index) => (
                  <div key={point.id} style={{ padding: '15px', border: '1px solid #dee2e6', borderRadius: '8px', backgroundColor: 'white' }}>
                    <h5 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '16px' }}>
                      {index + 1}. {point.name}
                    </h5>
                    <p style={{ margin: '0 0 10px 0', color: '#666', lineHeight: '1.4' }}>{point.description}</p>
                    <p style={{ margin: '0', fontSize: '12px', color: '#6c757d' }}>
                      <strong>Координаты:</strong> {point.coordinates.lat.toFixed(4)}, {point.coordinates.lng.toFixed(4)}
                    </p>
                    {point.image_url && (
                      <img 
                        src={point.image_url} 
                        alt={point.name}
                        style={{ width: '100%', maxWidth: '200px', height: '120px', objectFit: 'cover', borderRadius: '4px', marginTop: '10px' }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Блок профиля пользователя */}
      {isAuthenticated && userProfile && (
        <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #007bff', borderRadius: '8px', backgroundColor: '#f0f8ff' }}>
          <h2 style={{ marginTop: '0', color: '#333' }}>👤 Профиль пользователя</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div>
              <strong>ID:</strong>
              <div style={{ marginTop: '5px', fontFamily: 'monospace', background: '#f8f9fa', padding: '5px', borderRadius: '4px' }}>
                {userProfile.id}
              </div>
            </div>
            <div>
              <strong>Email:</strong>
              <div style={{ marginTop: '5px' }}>{userProfile.email}</div>
            </div>
            <div>
              <strong>Имя пользователя:</strong>
              <div style={{ marginTop: '5px' }}>{userProfile.username}</div>
            </div>
            <div>
              <strong>Дата регистрации:</strong>
              <div style={{ marginTop: '5px' }}>{new Date(userProfile.date_joined).toLocaleDateString('ru-RU')}</div>
            </div>
          </div>
        </div>
      )}

      {/* Блок статистики */}
      {isAuthenticated && userStatistics && (
        <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #28a745', borderRadius: '8px', backgroundColor: '#f8fff9' }}>
          <h2 style={{ marginTop: '0', color: '#333' }}>📊 Статистика</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div style={{ textAlign: 'center', padding: '15px', border: '1px solid #dee2e6', borderRadius: '8px', backgroundColor: 'white' }}>
              <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '5px' }}>Всего маршрутов</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#007bff' }}>{userStatistics.total_routes}</div>
            </div>
            <div style={{ textAlign: 'center', padding: '15px', border: '1px solid #dee2e6', borderRadius: '8px', backgroundColor: 'white' }}>
              <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '5px' }}>Завершено</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#28a745' }}>{userStatistics.completed_routes}</div>
            </div>
            <div style={{ textAlign: 'center', padding: '15px', border: '1px solid #dee2e6', borderRadius: '8px', backgroundColor: 'white' }}>
              <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '5px' }}>Активные</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffc107' }}>{userStatistics.active_routes}</div>
            </div>
            <div style={{ textAlign: 'center', padding: '15px', border: '1px solid #dee2e6', borderRadius: '8px', backgroundColor: 'white' }}>
              <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '5px' }}>Общее время</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#17a2b8' }}>{userStatistics.total_duration_minutes} мин</div>
            </div>
            <div style={{ textAlign: 'center', padding: '15px', border: '1px solid #dee2e6', borderRadius: '8px', backgroundColor: 'white' }}>
              <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '5px' }}>Общая стоимость</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#6f42c1' }}>{userStatistics.total_cost} ₽</div>
            </div>
            <div style={{ textAlign: 'center', padding: '15px', border: '1px solid #dee2e6', borderRadius: '8px', backgroundColor: 'white' }}>
              <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '5px' }}>Уникальных мест</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#e83e8c' }}>{userStatistics.unique_places}</div>
            </div>
          </div>
          {userStatistics.favourite_city && (
            <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#fff3cd', borderRadius: '4px', textAlign: 'center' }}>
              <strong>🏆 Любимый город:</strong> {userStatistics.favourite_city}
            </div>
          )}
          {userStatistics.last_activity && (
            <div style={{ marginTop: '10px', textAlign: 'center', fontSize: '14px', color: '#6c757d' }}>
              Последняя активность: {new Date(userStatistics.last_activity).toLocaleString('ru-RU')}
            </div>
          )}
        </div>
      )}

      {/* Блок списка маршрутов пользователя */}
      {isAuthenticated && (
        <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #6f42c1', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
          <h2 style={{ marginTop: '0', color: '#333' }}>🗺️ Мои маршруты</h2>
          
          {/* Фильтры */}
          <div style={{ marginBottom: '20px' }}>
            <strong style={{ display: 'block', marginBottom: '10px' }}>Фильтр по статусу: </strong>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => handleFilterRoutes('')}
                style={{ 
                  padding: '8px 16px',
                  backgroundColor: !routeFilter ? '#007bff' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Все
              </button>
              <button 
                onClick={() => handleFilterRoutes('going')}
                style={{ 
                  padding: '8px 16px',
                  backgroundColor: routeFilter === 'going' ? '#ffc107' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Активные
              </button>
              <button 
                onClick={() => handleFilterRoutes('done')}
                style={{ 
                  padding: '8px 16px',
                  backgroundColor: routeFilter === 'done' ? '#28a745' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Завершённые
              </button>
              <button 
                onClick={() => handleFilterRoutes('cancelled')}
                style={{ 
                  padding: '8px 16px',
                  backgroundColor: routeFilter === 'cancelled' ? '#dc3545' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Отменённые
              </button>
            </div>
          </div>

          {userLoading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <p>Загрузка маршрутов...</p>
            </div>
          ) : userRoutes.length > 0 ? (
            <div style={{ display: 'grid', gap: '15px' }}>
              {userRoutes.map(route => (
                <div key={route.route_id} style={{ padding: '20px', border: '1px solid #dee2e6', borderRadius: '8px', backgroundColor: 'white' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div style={{ flex: '1' }}>
                      <h4 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '18px' }}>{route.description}</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
                        <div>
                          <strong>ID:</strong>
                          <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#6c757d', marginTop: '2px' }}>
                            {route.route_id}
                          </div>
                        </div>
                        <div>
                          <strong>Длительность:</strong>
                          <div style={{ marginTop: '2px' }}>{route.total_duration} мин</div>
                        </div>
                        <div>
                          <strong>Стоимость:</strong>
                          <div style={{ marginTop: '2px' }}>{route.total_cost} ₽</div>
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ 
                        padding: '6px 12px', 
                        borderRadius: '12px', 
                        fontSize: '12px',
                        backgroundColor: 
                          route.status === 'going' ? '#fff3cd' :
                          route.status === 'done' ? '#d4edda' :
                          route.status === 'cancelled' ? '#f8d7da' : '#e2e3e5',
                        color: 
                          route.status === 'going' ? '#856404' :
                          route.status === 'done' ? '#155724' :
                          route.status === 'cancelled' ? '#721c24' : '#383d41',
                        border: `1px solid ${
                          route.status === 'going' ? '#ffeaa7' :
                          route.status === 'done' ? '#c3e6cb' :
                          route.status === 'cancelled' ? '#f5c6cb' : '#d6d8db'
                        }`
                      }}>
                        {route.status === 'going' ? '🚶 Активный' :
                         route.status === 'done' ? '✅ Завершён' :
                         route.status === 'cancelled' ? '❌ Отменён' : route.status}
                      </span>
                      <div style={{ marginTop: '8px', fontSize: '12px', color: '#6c757d' }}>
                        Создан: {new Date(route.created_at).toLocaleDateString('ru-RU')}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6c757d' }}>
                        Обновлён: {new Date(route.updated_at).toLocaleDateString('ru-RU')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
              <p style={{ fontSize: '18px', marginBottom: '10px' }}>📭 У вас пока нет маршрутов</p>
              <p>Создайте свой первый маршрут используя форму выше!</p>
            </div>
          )}

          {userError && (
            <div style={{ color: '#dc3545', marginTop: '10px', padding: '10px', backgroundColor: '#f8d7da', borderRadius: '4px' }}>
              <strong>Ошибка загрузки маршрутов:</strong> {userError}
            </div>
          )}
        </div>
      )}

      {!isAuthenticated && (
        <div style={{ padding: '40px', border: '1px solid #ffc107', borderRadius: '8px', backgroundColor: '#fffbf0', textAlign: 'center' }}>
          <h3 style={{ color: '#856404', marginTop: '0' }}>🔒 Требуется авторизация</h3>
          <p style={{ color: '#856404', fontSize: '16px' }}>
            Для работы с маршрутами необходимо войти в систему или зарегистрироваться.
          </p>
        </div>
      )}
    </div>
  );
}

export default App;