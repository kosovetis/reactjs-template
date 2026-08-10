// src/pages/WelcomePage.tsx
import { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { trackEvent, AnalyticsEvents } from '../utils/analytics';
import { colors, font, gradients, heroFade, highlightWord, ctaButton } from '../styles/tokens';

export default function WelcomePage() {
  const navigate = useNavigate();

  const handleStartClick = () => {
    trackEvent(AnalyticsEvents.TEST_STARTED);
    navigate('/test');
  };

  // Hero-подложка как на сайте: градиент персик→крем→бирюза, растворяющийся в белый
  const heroStyle: CSSProperties = {
    position: 'relative',
    background: gradients.hero,
    padding: '32px 24px 24px',
    overflow: 'hidden',
  };

  const heroFadeStyle: CSSProperties = {
    content: '""',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '56px',
    background: heroFade,
    pointerEvents: 'none',
    zIndex: 0,
  };

  const heroContentStyle: CSSProperties = {
    position: 'relative',
    zIndex: 1,
    maxWidth: '700px',
    margin: '0 auto',
  };

  const avatarGroupStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '24px',
  };

  const avatarStyle: CSSProperties = {
    width: '78px',
    height: '78px',
    borderRadius: '50%',
    backgroundColor: '#e5e7eb',
    objectFit: 'cover',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
  };

  // Рамки в три цвета палитры сайта: белая, глубокая бирюза, оранжевая
  const avatarLeftStyle: CSSProperties = { ...avatarStyle, zIndex: 3, position: 'relative', border: '3px solid rgba(255, 255, 255, 0.9)' };
  const avatarCenterStyle: CSSProperties = { ...avatarStyle, zIndex: 2, marginLeft: '-15px', border: `3px solid ${colors.baseDeep}` };
  const avatarRightStyle: CSSProperties = { ...avatarStyle, zIndex: 1, marginLeft: '-15px', border: `3px solid ${colors.accent}` };

  const titleStyle: CSSProperties = {
    fontFamily: font.display,
    fontSize: '22px',
    fontWeight: font.semibold,
    lineHeight: '1.35',
    letterSpacing: '-0.5px',
    color: colors.ink,
    textAlign: 'left',
    margin: 0,
  };

  const bodyStyle: CSSProperties = {
    maxWidth: '700px',
    margin: '0 auto',
    padding: '10px 24px 32px',
    fontFamily: font.text,
    color: colors.ink,
  };

  const textStyle: CSSProperties = {
    fontSize: '16px',
    lineHeight: '1.6',
    marginBottom: '16px',
    textAlign: 'left',
  };

  const listStyle: CSSProperties = {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 20px 0',
    textAlign: 'left',
  };

  const listItemStyle: CSSProperties = {
    fontSize: '16px',
    lineHeight: '1.6',
    marginBottom: '10px',
    display: 'flex',
    gap: '10px',
  };

  const checkStyle: CSSProperties = {
    color: colors.baseDeep,
    fontWeight: font.heading,
    flexShrink: 0,
  };

  // Плашка с таймингом — как теги-плашки на сайте
  const timingStyle: CSSProperties = {
    display: 'inline-block',
    background: colors.panel,
    border: `1px solid ${colors.panel2}`,
    borderRadius: '13px',
    padding: '8px 14px',
    fontSize: '15px',
    lineHeight: '1.5',
    color: colors.inkSoft,
  };

  const buttonStyle: CSSProperties = {
    ...ctaButton,
    width: '100%',
    padding: '16px 24px',
    fontSize: '17px',
    marginTop: '36px',
  };

  return (
    <div style={{ backgroundColor: colors.bg, minHeight: '100vh' }}>
      <div style={heroStyle}>
        <div style={heroFadeStyle}></div>
        <div style={heroContentStyle}>
          <div style={avatarGroupStyle}>
            <div style={{ ...avatarLeftStyle, backgroundImage: 'url(img/avatar1.png)' }}></div>
            <div style={{ ...avatarCenterStyle, backgroundImage: 'url(img/avatar2.png)' }}></div>
            <div style={{ ...avatarRightStyle, backgroundImage: 'url(img/avatar3.png)' }}></div>
          </div>
          <h1 style={titleStyle}>Определите архетип вашего бренда</h1>
        </div>
      </div>

      <div style={bodyStyle}>
        <p style={textStyle}>Привет! Я — Алина, автор этого теста.</p>
        <p style={textStyle}>
          Он основан на системе 12 архетипов Кэрол Пирсон и поможет вам лучше понять{' '}
          <span style={highlightWord}>ДНК вашего бренда</span>.
        </p>

        <ul style={listStyle}>
          <li style={listItemStyle}>
            <span style={checkStyle}>✓</span>
            <span><b>Результат:</b> вы узнаете свой основной и дополнительный архетипы.</span>
          </li>
          <li style={listItemStyle}>
            <span style={checkStyle}>✓</span>
            <span><b>Практика:</b> получите гайд с объяснением, как использовать эти знания.</span>
          </li>
        </ul>

        <span style={timingStyle}>
          Тест состоит из 14 вопросов и займёт <b>не больше 5-7 минут</b>.
        </span>

        <button
          style={buttonStyle}
          onClick={handleStartClick}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(236, 103, 45, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(236, 103, 45, 0.4)';
          }}
        >
          Начать тест
        </button>
      </div>
    </div>
  );
}
