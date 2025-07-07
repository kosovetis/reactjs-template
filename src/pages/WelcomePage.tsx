// src/pages/WelcomePage.tsx
import { useNavigate } from 'react-router-dom';

export default function WelcomePage() {
  const navigate = useNavigate();

  // Стили
  const containerStyle = {
    backgroundColor: 'white',
    padding: '40px 24px 24px 24px',
    fontFamily: "'Montserrat', sans-serif",
    color: '#1f2937'
  };

  const avatarGroupStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '24px',
  };

  const avatarStyle = {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#e5e7eb',
    border: '3px solid white',
    objectFit: 'cover' as const,
    backgroundSize: 'cover',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    backgroundPosition: 'center',
  };

  const avatarLeftStyle = { ...avatarStyle, zIndex: 3, position: 'relative' as const };
  const avatarCenterStyle = { ...avatarStyle, zIndex: 2, marginLeft: '-15px' };
  const avatarRightStyle = { ...avatarStyle, zIndex: 1, marginLeft: '-15px' };

  const titleStyle = {
    fontSize: '22px',
    fontWeight: '700',
    marginBottom: '16px',
    textAlign: 'left' as const,
  };

  const textStyle = {
    fontSize: '16px',
    lineHeight: '1.6',
    marginBottom: '16px',
    textAlign: 'left' as const,
  };

  const listStyle = {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 24px 0',
    textAlign: 'left' as const,
  };

  const listItemStyle = {
    fontSize: '16px',
    marginBottom: '8px',
  };

  const buttonStyle = {
    width: '100%',
    padding: '16px 24px',
    background: '#2563eb',
    color: 'white',
    borderRadius: '12px',
    cursor: 'pointer',
    border: 'none',
    fontSize: '18px',
    fontWeight: '600',
    fontFamily: "'Montserrat', sans-serif",
    transition: 'background-color 0.2s ease',
    marginTop: '48px',
  };

  return (
    <div style={containerStyle}>
      <div style={avatarGroupStyle}>
        {/* --- ИЗМЕНЕНИЯ ЗДЕСЬ --- */}
        <div style={{...avatarLeftStyle, backgroundImage: 'url(img/avatar1.png)'}}></div>
        <div style={{...avatarCenterStyle, backgroundImage: 'url(img/avatar2.png)'}}></div>
        <div style={{...avatarRightStyle, backgroundImage: 'url(img/avatar3.png)'}}></div>
      </div>

      <h1 style={titleStyle}>Определите архетип вашего бренда</h1>
      <p style={textStyle}>Привет! Я — Алина, автор этого теста.</p>
      <p style={textStyle}>
        Он основан на системе 12 архетипов Кэрол Пирсон и поможет вам лучше понять ДНК вашего бренда.
      </p>

      <ul style={listStyle}>
        <li style={listItemStyle}>✅ <b>Результат:</b> вы узнаете свой основной и дополнительный архетипы.</li>
        <li style={listItemStyle}>✅ <b>Практика:</b> получите гайд с объяснением, как использовать эти знания.</li>
      </ul>

      <p style={textStyle}>
        ⏱️ Тест состоит из 14 вопросов и займёт <b>не больше 5-7 минут</b>.
      </p>

      <button
        style={buttonStyle}
        onClick={() => navigate('/test')}
      >
        Начать тест
      </button>
    </div>
  );
}