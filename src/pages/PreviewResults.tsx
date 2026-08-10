// src/pages/PreviewResults.tsx
// Превью страницы результатов с демо-данными — чтобы смотреть вёрстку
// без прохождения теста. Открывается по /#/preview.
// События в Метрику из превью не отправляются (tracking={false}).
import { useNavigate } from 'react-router-dom';
import Results from '../Results';
import { blocks, idToArch } from '../phrases';

// Демо-распределение: лидеры стабильны (Творец, Маг), а остальные 10 архетипов
// ротируются по блокам — так у всех 12 шкалы частично заполнены (для проверки цветов).
const LEADERS = ['creator', 'magician'];
const REST = ['rebel', 'hero', 'sage', 'explorer', 'lover', 'jester', 'caregiver', 'everyman', 'ruler', 'innocent'];

export default function PreviewResults() {
  const navigate = useNavigate();

  const results = blocks.map((block, blockIndex) => {
    const picks = [
      ...LEADERS,
      REST[(blockIndex * 3) % REST.length],
      REST[(blockIndex * 3 + 1) % REST.length],
      REST[(blockIndex * 3 + 2) % REST.length],
    ];
    const ranked = picks
      .map((arch) => block.find((it) => it.archetype === arch)?.id)
      .filter(Boolean) as string[];
    return { blockIndex, selected: ranked, ranked };
  });

  return <Results results={results} idToArch={idToArch} onRestart={() => navigate('/')} tracking={false} />;
}
