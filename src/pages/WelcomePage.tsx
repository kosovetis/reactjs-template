// src/pages/WelcomePage.tsx
import { useNavigate } from 'react-router-dom';

export default function WelcomePage() {
  const navigate = useNavigate();

  // Стили
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center' as const,
    minHeight: '100vh',
    backgroundColor: 'white',
    padding: '24px',
    fontFamily: "'Montserrat', sans-serif",
    color: '#1f2937'
  };

  const avatarStyle = {
    width: '96px',
    height: '96px',
    borderRadius: '50%',
    backgroundColor: '#e5e7eb', // Заглушка для аватара
    marginBottom: '24px',
    objectFit: 'cover' as const,
    // Если у вас есть URL аватара, раскомментируйте и вставьте его
    // backgroundImage: 'url(URL_ВАШЕЙ_АВАТАРКИ)',
    // backgroundSize: 'cover',
  };

  const titleStyle = {
    fontSize: '22px',
    fontWeight: '700',
    marginBottom: '16px'
  };

  const textStyle = {
    fontSize: '16px',
    lineHeight: '1.6',
    maxWidth: '350px',
    marginBottom: '16px'
  };

  const listStyle = {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 24px 0',
    maxWidth: '350px',
    textAlign: 'left' as const,
  };

  const listItemStyle = {
    fontSize: '16px',
    marginBottom: '8px',
  };

  const buttonStyle = {
    width: '100%',
    maxWidth: '350px',
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
    marginTop: '16px',
  };

  return (
    <div style={containerStyle}>
      <div style={avatarStyle}></div>
      <h1 style={titleStyle}>Определите архетип вашего бренда</h1>
      <p style={textStyle}>Привет! Я — Алина, автор этого теста.</p>
      <p style={textStyle}>
        Он основан на системе 12 архетипов Кэрол Пирсон и поможет вам лучше понять ДНК вашего бренда.
      </p>

      <ul style={listStyle}>
        <li style={listItemStyle}>✅ <b>Результат:</b> Вы узнаете свой основной и дополнительный архетипы.</li>
        <li style={listItemStyle}>✅ <b>Практика:</b> Получите гайд с объяснением, как использовать эти знания.</li>
      </ul>

      <p style={textStyle}>
        Тест состоит из 14 вопросов и займёт не больше 5-7 минут.
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