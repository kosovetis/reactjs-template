// src/pages/WelcomePage.tsx
import { useNavigate } from 'react-router-dom';

export default function WelcomePage() {
  const navigate = useNavigate();

  // Стили
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    // Выравнивание по левому краю для всего контейнера
    alignItems: 'flex-start' as const, 
    justifyContent: 'space-between', // Распределяем пространство
    minHeight: '100vh',
    backgroundColor: 'white',
    padding: '40px 24px 24px 24px', // Уменьшили верхний отступ
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
  };

  const avatarLeftStyle = { ...avatarStyle, zIndex: 3, position: 'relative' as const };
  const avatarCenterStyle = { ...avatarStyle, zIndex: 2, marginLeft: '-20px' };
  const avatarRightStyle = { ...avatarStyle, zIndex: 1, marginLeft: '-20px' };

  const titleStyle = {
    fontSize: '22px',
    fontWeight: '700',
    marginBottom: '16px',
    textAlign: 'left' as const, // Явное выравнивание по левому краю
  };

  const textStyle = {
    fontSize: '16px',
    lineHeight: '1.6',
    marginBottom: '16px',
    textAlign: 'left' as const, // Явное выравнивание по левому краю
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
    marginTop: '24px', // Добавили отступ сверху для кнопки
  };

  return (
    <div style={containerStyle}>
      {/* Этот div обертка нужен, чтобы верхняя часть контента была сгруппирована */}
      <div>
        <div style={avatarGroupStyle}>
          <div style={{...avatarLeftStyle, backgroundImage: 'url(/img/avatar1.png)'}}></div>
          <div style={{...avatarCenterStyle, backgroundImage: 'url(/img/avatar2.png)'}}></div>
          <div style={{...avatarRightStyle, backgroundImage: 'url(/img/avatar3.png)'}}></div>
        </div>

        <h1 style={titleStyle}>Определите архетип вашего бренда</h1>
        <p style={textStyle}>Привет! Я — Алина, автор этого теста.</p>
        <p style={textStyle}>
          Он основан на системе 12 архетипов Кэрол Пирсон и поможет вам лучше понять ДНК вашего бренда.
        </p>

        <ul style={listStyle}>
          {/* "вы" и "получите" теперь с маленькой буквы */}
          <li style={listItemStyle}>✅ <b>Результат:</b> вы узнаете свой основной и дополнительный архетипы.</li>
          <li style={listItemStyle}>✅ <b>Практика:</b> получите гайд с объяснением, как использовать эти знания.</li>
        </ul>

        {/* Добавили эмоджи и жирный шрифт */}
        <p style={textStyle}>
          ⏱️ Тест состоит из 14 вопросов и займёт <b>не больше 5-7 минут</b>.
        </p>
      </div>

      {/* Кнопка остается внизу */}
      <button
        style={buttonStyle}
        onClick={() => navigate('/test')}
      >
        Начать тест
      </button>
    </div>
  );
}