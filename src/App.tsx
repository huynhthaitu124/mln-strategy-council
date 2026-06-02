import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, HelpCircle, Play, RotateCcw, Trophy, X } from 'lucide-react';
import {
  type Level,
  type Outcome,
  type PolicyCardId,
  type StatKey,
  calculateOutcome,
  getRequiredText,
  levels,
  policyCards,
  representatives,
  statDescriptions,
  statLabels,
  toggleCard,
} from './gameLogic';
import { type LeaderboardState, fetchLeaderboard, submitScore } from './leaderboard';
import './styles.css';

type Screen = 'start' | 'game' | 'result' | 'complete' | 'leaderboard';

const statKeys: StatKey[] = ['production', 'livelihood', 'technology', 'solidarity'];
const sessionStorageKey = 'mln-strategy-session-v1';

type SavedGameSession = {
  playerName: string;
  levelIndex: number;
  selectedCards: PolicyCardId[];
  totalScore: number;
  startedAt: number;
};

function isPolicyCardId(value: string): value is PolicyCardId {
  return value in policyCards;
}

function readSavedGameSession(): SavedGameSession | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(sessionStorageKey);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<SavedGameSession>;
    const levelIndex = Number(parsed.levelIndex);
    if (!Number.isInteger(levelIndex) || levelIndex < 0 || levelIndex >= levels.length) return null;

    const selectedCards = Array.isArray(parsed.selectedCards)
      ? parsed.selectedCards.filter((id): id is PolicyCardId => typeof id === 'string' && isPolicyCardId(id))
      : [];

    return {
      playerName: typeof parsed.playerName === 'string' ? parsed.playerName : '',
      levelIndex,
      selectedCards,
      totalScore: typeof parsed.totalScore === 'number' ? parsed.totalScore : 0,
      startedAt: typeof parsed.startedAt === 'number' ? parsed.startedAt : Date.now(),
    };
  } catch {
    return null;
  }
}

function writeSavedGameSession(session: SavedGameSession) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(sessionStorageKey, JSON.stringify(session));
}

function clearSavedGameSession() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(sessionStorageKey);
}

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}:${rest.toString().padStart(2, '0')}`;
}

function StartScreen({
  playerName,
  setPlayerName,
  onStart,
  onOpenLeaderboard,
}: {
  playerName: string;
  setPlayerName: (value: string) => void;
  onStart: () => void;
  onOpenLeaderboard: () => void;
}) {
  return (
    <section className="start-screen">
      <div className="start-visual" />
      <div className="start-copy">
        <p className="eyebrow">MLN131_SPST · Sản phẩm sáng tạo</p>
        <h1>Hội Đồng Thời Kỳ Quá Độ</h1>
        <p>
          Vào vai Nhà nước điều tiết chiến lược: chọn chính sách, cân bằng lợi ích và xây dựng
          khối liên minh công nhân - nông dân - trí thức qua {levels.length} khủng hoảng.
        </p>
        <label htmlFor="playerName">Tên người chơi</label>
        <div className="start-actions">
          <input
            id="playerName"
            maxLength={24}
            value={playerName}
            onChange={(event) => setPlayerName(event.target.value)}
            placeholder="Nhập tên"
          />
          <button className="primary-button" onClick={onStart} disabled={!playerName.trim()}>
            <Play size={20} />
            Bắt đầu
          </button>
        </div>
        <button className="secondary-button start-leaderboard-button" type="button" onClick={onOpenLeaderboard}>
          <Trophy size={20} />
          Xem bảng xếp hạng
        </button>
      </div>
    </section>
  );
}

function StatBars({ stats, thresholds }: { stats: Record<StatKey, number>; thresholds: Record<StatKey, number> }) {
  return (
    <section className="stat-board" aria-label="Chỉ số quốc gia">
      {statKeys.map((key) => {
        const passed = stats[key] >= thresholds[key];
        return (
          <article className="stat-item" key={key}>
            <div className="stat-head">
              <span>{statLabels[key]}</span>
              <b>{stats[key]}</b>
            </div>
            <div className="stat-track">
              <i className={passed ? 'ok' : ''} style={{ width: `${stats[key]}%` }} />
            </div>
            <small>
              Mục tiêu {thresholds[key]} · {statDescriptions[key]}
            </small>
          </article>
        );
      })}
    </section>
  );
}

function LevelBrief({ level }: { level: Level }) {
  const requiredText = getRequiredText(level);

  return (
    <aside className="level-brief">
      <p className="panel-label">
        Tình huống {level.id}/{levels.length}
      </p>
      <h2>{level.title}</h2>
      <p>{level.crisis}</p>
      <div className="objective-box">
        <strong>Nhiệm vụ chiến lược</strong>
        <span>{level.objective}</span>
      </div>
      {requiredText.length > 0 && (
        <div className="required-box">
          {requiredText.map((text) => (
            <span key={text}>{text}</span>
          ))}
        </div>
      )}
      <div className="source-box">
        <strong>Căn cứ lịch sử/lý luận</strong>
        <span>{level.sourceNote}</span>
      </div>
    </aside>
  );
}

function getRepresentativeContext(level: Level, id: string) {
  const contexts: Record<number, Record<string, string>> = {
    1: {
      workers: 'Nhà máy thiếu vật tư, năng suất thấp; cần khôi phục sản xuất và kỷ luật lao động.',
      farmers: 'Thiếu lương thực là nút thắt sống còn; cần quyền chủ động và động lực sản xuất.',
      intellectuals: 'Tri thức kỹ thuật cần đi vào cải tiến sản xuất, không chỉ dừng ở kế hoạch hành chính.',
      state: 'Cần sửa cách điều phối bao cấp, giữ ổn định nhưng giải phóng sức sản xuất.',
    },
    2: {
      workers: 'Cần nguồn nguyên liệu ổn định từ nông nghiệp để công nghiệp chế biến phát triển.',
      farmers: 'Được giải phóng động lực sản xuất nhưng cần hợp tác để không bị thị trường ép giá.',
      intellectuals: 'Cần chuyển kỹ thuật giống, thủy lợi, bảo quản và quản trị vào nông nghiệp hàng hóa.',
      state: 'Cần mở cơ chế thị trường nhưng vẫn tổ chức định hướng và bảo vệ nhóm yếu thế.',
    },
    3: {
      workers: 'Từ lao động giản đơn phải chuyển thành công nhân kỹ thuật trong khu công nghiệp.',
      farmers: 'Dịch chuyển đất đai và lao động tạo cơ hội mới nhưng cũng làm sinh kế nông thôn mong manh.',
      intellectuals: 'Kỹ sư, trường nghề và viện nghiên cứu phải gắn với nhà máy, không đứng ngoài sản xuất.',
      state: 'Cần phát triển hạ tầng, công nghiệp hỗ trợ và phúc lợi cho lao động nhập cư.',
    },
    4: {
      workers: 'Áp lực chi phí sống, năng suất và an toàn lao động làm nhu cầu phúc lợi rõ hơn.',
      farmers: 'Rủi ro giá cả, đất đai và tiêu chuẩn xuất khẩu khiến nông dân cần liên kết mạnh hơn.',
      intellectuals: 'Sáng tạo cần thể chế khuyến khích, bảo vệ chuyên môn và đặt hàng nghiên cứu thực chất.',
      state: 'Cần điều tiết lợi ích để hội nhập không làm tăng khoảng cách xã hội.',
    },
    5: {
      workers: 'Dễ mất việc khi đơn hàng và logistics đứt gãy; cần đào tạo lại và mạng an sinh.',
      farmers: 'Hạn mặn, thiên tai và biến động thị trường đòi hỏi nông nghiệp thích ứng khí hậu.',
      intellectuals: 'Cần dữ liệu, công nghệ bảo quản, logistics và cảnh báo rủi ro để tăng sức chống chịu.',
      state: 'Cần dự phòng chiến lược nhưng không thay thế xây dựng nội lực và liên kết vùng.',
    },
    6: {
      workers: 'Cần kỹ năng số, kỹ năng xanh và khả năng làm việc với hệ thống tự động hóa.',
      farmers: 'Nông nghiệp thông minh phải giúp nông dân tăng thu nhập, không chỉ tăng tiêu chuẩn.',
      intellectuals: 'Đội ngũ trí thức là nguồn lực đặc biệt trong đổi mới sáng tạo và phát triển bền vững.',
      state: 'Cần xã hội hóa thành quả tri thức qua giáo dục, sản xuất và phúc lợi công bằng.',
    },
  };

  return contexts[level.id]?.[id] ?? level.objective;
}

const representativeStats: Record<string, StatKey> = {
  workers: 'production',
  farmers: 'livelihood',
  intellectuals: 'technology',
  state: 'solidarity',
};

function CouncilRoom({
  level,
  selectedCards,
  outcome,
}: {
  level: Level;
  selectedCards: PolicyCardId[];
  outcome: Outcome;
}) {
  const moodByRep = outcome?.forceMoods;

  return (
    <section className="council-room">
      <img className="room-bg" src="/council-assets/council-room.png" alt="" />
      <div className="representatives">
        {representatives.map((rep) => (
          <article className={`representative representative-${rep.id}`} key={rep.id}>
            <img src={rep.sprite} alt={rep.name} />
            <div>
              <b>{rep.name}</b>
              <span>{rep.role}</span>
              <small>
                {rep.id === 'state'
                  ? rep.expectation
                  : moodByRep?.[rep.id as keyof typeof moodByRep] ?? rep.expectation}
              </small>
              <strong>{statLabels[representativeStats[rep.id]]}: {outcome.stats[representativeStats[rep.id]]}</strong>
              <em>Mục tiêu {level.thresholds[representativeStats[rep.id]]}</em>
              <p>{getRepresentativeContext(level, rep.id)}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="policy-table" aria-label="Chính sách đã chọn">
        {selectedCards.length === 0 ? (
          <span className="empty-selection">Chọn chính sách để đặt lên bàn hội đồng</span>
        ) : (
          selectedCards.map((id) => (
            <img key={id} src={policyCards[id].sprite} alt={policyCards[id].name} title={policyCards[id].name} />
          ))
        )}
      </div>
    </section>
  );
}

function PolicyHand({
  level,
  selectedCards,
  onToggle,
}: {
  level: Level;
  selectedCards: PolicyCardId[];
  onToggle: (id: PolicyCardId) => void;
}) {
  const spent = selectedCards.reduce((sum, id) => sum + policyCards[id].cost, 0);

  return (
    <section className="policy-panel">
      <div className="panel-title-row">
        <div>
          <p className="panel-label">Hội đồng chính sách</p>
          <h3>
            Ngân sách {level.budget - spent}/{level.budget}
          </h3>
        </div>
        <span>
          {selectedCards.length}/{level.maxCards} chính sách
        </span>
      </div>
      <div className="policy-grid">
        {level.hand.map((id) => {
          const card = policyCards[id];
          const selected = selectedCards.includes(id);
          const disabled =
            !selected &&
            (selectedCards.length >= level.maxCards || spent + card.cost > level.budget);
          return (
            <button
              className={`policy-card ${selected ? 'selected' : ''}`}
              disabled={disabled}
              key={id}
              onClick={() => onToggle(id)}
              type="button"
            >
              <img src={card.sprite} alt="" />
              <span className="policy-copy">
                <small>{card.category} · {card.cost} ngân sách</small>
                <b>{card.name}</b>
                <em>{card.description}</em>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function HowToPlayModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="how-to-modal" role="dialog" aria-modal="true" aria-labelledby="how-to-title">
        <button className="icon-button modal-close" type="button" onClick={onClose} aria-label="Đóng hướng dẫn">
          <X size={20} />
        </button>
        <div className="modal-header">
          <p className="panel-label">Hướng dẫn chơi</p>
          <h2 id="how-to-title">Điều hành hội đồng chiến lược</h2>
          <p>
            Mục tiêu của bạn là chọn đúng chính sách cho từng giai đoạn lịch sử để giữ vững liên minh
            công nhân - nông dân - trí thức trong thời kỳ quá độ.
          </p>
        </div>
        <div className="how-to-grid">
          <article>
            <b>1. Đọc tình huống</b>
            <span>Mỗi level có khủng hoảng riêng, căn cứ lịch sử/lý luận và nhiệm vụ chiến lược.</span>
          </article>
          <article>
            <b>2. Quan sát 4 lực lượng</b>
            <span>Mỗi đại diện cho một chỉ số: sản xuất, đời sống, khoa học - công nghệ, đoàn kết xã hội.</span>
          </article>
          <article>
            <b>3. Chọn chính sách</b>
            <span>Mỗi chính sách tốn ngân sách. Chọn quá lệch hoặc sai thời kỳ sẽ hụt mục tiêu.</span>
          </article>
          <article>
            <b>4. Tìm cộng hưởng</b>
            <span>Một số cặp chính sách tạo combo mạnh, ví dụ đào tạo nghề đi cùng công nghiệp hỗ trợ.</span>
          </article>
          <article>
            <b>5. Biểu quyết</b>
            <span>Khi đủ tự tin, bấm biểu quyết. Nếu chưa đạt, bạn có thể thử lại level đó.</span>
          </article>
          <article>
            <b>6. Hoàn thành 6 level</b>
            <span>Điểm cuối cùng được gửi lên bảng xếp hạng sau khi vượt qua toàn bộ chuỗi khủng hoảng.</span>
          </article>
        </div>
        <div className="modal-actions">
          <button className="primary-button" type="button" onClick={onClose}>
            <Play size={18} />
            Đã hiểu, bắt đầu chơi
          </button>
        </div>
      </section>
    </div>
  );
}

function ResultScreen({
  level,
  outcome,
  onRetry,
  onNext,
}: {
  level: Level;
  outcome: Outcome;
  onRetry: () => void;
  onNext: () => void;
}) {
  return (
    <section className="result-screen">
      <div className={`result-banner ${outcome.passed ? 'passed' : 'failed'}`}>
        {outcome.passed ? <CheckCircle2 size={34} /> : <AlertTriangle size={34} />}
        <div>
          <p>{outcome.passed ? 'Thông qua nghị quyết' : 'Nghị quyết chưa đạt'}</p>
          <h2>{outcome.passed ? `+${outcome.score} điểm` : 'Cần điều chỉnh chiến lược'}</h2>
        </div>
      </div>
      <StatBars stats={outcome.stats} thresholds={level.thresholds} />
      <div className="result-details">
        <article>
          <h3>Phân tích lý luận</h3>
          <p>{level.theoryNote}</p>
        </article>
        <article>
          <h3>Tác động chính sách</h3>
          {outcome.modifiers.length > 0 ? (
            outcome.modifiers.map((text) => <p key={text}>{text}</p>)
          ) : (
            <p>Chưa có cộng hưởng đặc biệt giữa các chính sách.</p>
          )}
          {!outcome.objectiveMet && <p>Điều kiện nhiệm vụ chiến lược chưa được đáp ứng.</p>}
        </article>
      </div>
      <div className="result-actions">
        <button className="secondary-button" onClick={onRetry}>
          <RotateCcw size={18} />
          Thử lại
        </button>
        {outcome.passed && (
          <button className="primary-button" onClick={onNext}>
            {level.id === levels.length ? 'Xem tổng kết' : 'Tình huống tiếp theo'}
          </button>
        )}
      </div>
    </section>
  );
}

function LeaderboardPanel({ leaderboard }: { leaderboard: LeaderboardState }) {
  return (
    <div className="leaderboard">
      <div className="panel-title-row">
        <div>
          <p className="panel-label">Bảng xếp hạng</p>
          <h3>{leaderboard.mode === 'online' ? 'Online leaderboard' : 'Offline leaderboard'}</h3>
        </div>
      </div>
      {leaderboard.entries.length === 0 ? (
        <p>Chưa có điểm nào được ghi nhận.</p>
      ) : (
        leaderboard.entries.map((entry, index) => (
          <article className="score-row" key={`${entry.player_name}-${entry.score}-${index}`}>
            <b>{index + 1}</b>
            <span>{entry.player_name}</span>
            <strong>{entry.score}</strong>
            <small>{formatDuration(entry.duration_seconds)}</small>
          </article>
        ))
      )}
    </div>
  );
}

function CompleteScreen({
  score,
  duration,
  leaderboard,
  playerName,
}: {
  score: number;
  duration: number;
  leaderboard: LeaderboardState;
  playerName: string;
}) {
  return (
    <section className="complete-screen">
      <div className="complete-hero">
        <Trophy size={38} />
        <p>Liên minh bền vững</p>
        <h2>{score} điểm</h2>
        <span>
          {playerName} · Hoàn thành trong {formatDuration(duration)}
        </span>
      </div>
      <LeaderboardPanel leaderboard={leaderboard} />
    </section>
  );
}

function LeaderboardScreen({
  leaderboard,
  onBack,
}: {
  leaderboard: LeaderboardState;
  onBack: () => void;
}) {
  return (
    <section className="leaderboard-screen">
      <div className="leaderboard-hero">
        <Trophy size={34} />
        <p className="panel-label">Bảng xếp hạng</p>
        <h1>Những nhà quản lý chiến lược xuất sắc</h1>
        <span>Điểm được sắp theo tổng điểm cao nhất, nếu bằng điểm thì thời gian hoàn thành nhanh hơn đứng trước.</span>
        <button className="secondary-button" type="button" onClick={onBack}>
          Quay lại nhập tên
        </button>
      </div>
      <LeaderboardPanel leaderboard={leaderboard} />
    </section>
  );
}

export default function App() {
  const initialSession = useMemo(() => readSavedGameSession(), []);
  const [screen, setScreen] = useState<Screen>(initialSession ? 'game' : 'start');
  const [playerName, setPlayerName] = useState(initialSession?.playerName ?? '');
  const [levelIndex, setLevelIndex] = useState(initialSession?.levelIndex ?? 0);
  const [selectedCards, setSelectedCards] = useState<PolicyCardId[]>(initialSession?.selectedCards ?? []);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [totalScore, setTotalScore] = useState(initialSession?.totalScore ?? 0);
  const [startedAt, setStartedAt] = useState(initialSession?.startedAt ?? Date.now());
  const [duration, setDuration] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardState>({ entries: [], mode: 'offline' });
  const [submitted, setSubmitted] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const level = levels[levelIndex];
  const preview = useMemo(() => calculateOutcome(level, selectedCards), [level, selectedCards]);

  useEffect(() => {
    void fetchLeaderboard().then(setLeaderboard);
  }, []);

  useEffect(() => {
    if (screen !== 'game' && screen !== 'result') return;

    writeSavedGameSession({
      playerName,
      levelIndex,
      selectedCards,
      totalScore,
      startedAt,
    });
  }, [levelIndex, playerName, screen, selectedCards, startedAt, totalScore]);

  function startGame() {
    setStartedAt(Date.now());
    setLevelIndex(0);
    setSelectedCards([]);
    setOutcome(null);
    setTotalScore(0);
    setSubmitted(false);
    setShowGuide(true);
    setScreen('game');
  }

  function openLeaderboard() {
    setScreen('leaderboard');
  }

  function resolveLevel() {
    const finalOutcome = calculateOutcome(level, selectedCards);
    setOutcome(finalOutcome);
    setScreen('result');
  }

  function retryLevel() {
    setSelectedCards([]);
    setOutcome(null);
    setScreen('game');
  }

  async function nextLevel() {
    if (!outcome?.passed) return;
    const nextScore = totalScore + outcome.score;
    setTotalScore(nextScore);
    setOutcome(null);
    setSelectedCards([]);

    if (levelIndex === levels.length - 1) {
      const finalDuration = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
      setDuration(finalDuration);
      setScreen('complete');
      clearSavedGameSession();
      if (!submitted) {
        setSubmitted(true);
        const state = await submitScore({
          player_name: playerName.trim() || 'Người chơi',
          score: nextScore,
          completed_levels: levels.length,
          duration_seconds: finalDuration,
        });
        setLeaderboard(state);
      }
      return;
    }

    setLevelIndex((current) => current + 1);
    setScreen('game');
  }

  if (screen === 'start') {
    return (
      <StartScreen
        playerName={playerName}
        setPlayerName={setPlayerName}
        onStart={startGame}
        onOpenLeaderboard={openLeaderboard}
      />
    );
  }

  if (screen === 'leaderboard') {
    return <LeaderboardScreen leaderboard={leaderboard} onBack={() => setScreen('start')} />;
  }

  if (screen === 'result' && outcome) {
    return <ResultScreen level={level} outcome={outcome} onRetry={retryLevel} onNext={nextLevel} />;
  }

  if (screen === 'complete') {
    return (
      <CompleteScreen
        score={totalScore}
        duration={duration}
        leaderboard={leaderboard}
        playerName={playerName.trim() || 'Người chơi'}
      />
    );
  }

  return (
    <main className="app-shell">
      <header className="top-bar">
        <div>
          <p className="eyebrow">Hội Đồng Thời Kỳ Quá Độ</p>
          <h1>{level.title}</h1>
        </div>
      </header>
      <section className="game-layout">
        <CouncilRoom level={level} selectedCards={selectedCards} outcome={preview} />
        <div className="action-bar">
          <div>
            <b>Chọn tối đa {level.maxCards} chính sách</b>
            <span>Điểm sẽ chỉ tính khi nghị quyết đạt đủ ngưỡng và điều kiện nhiệm vụ.</span>
          </div>
          <div className="action-buttons">
            <button className="secondary-button" type="button" onClick={() => setShowGuide(true)}>
              <HelpCircle size={18} />
              Hướng dẫn
            </button>
            <button className="primary-button" onClick={resolveLevel} disabled={selectedCards.length === 0}>
              <Play size={20} />
              Biểu quyết nghị quyết
            </button>
          </div>
        </div>
        <section className="bottom-panels">
          <LevelBrief level={level} />
          <PolicyHand
            level={level}
            selectedCards={selectedCards}
            onToggle={(id) => setSelectedCards((current) => toggleCard(level, current, id))}
          />
        </section>
      </section>
      {showGuide && <HowToPlayModal onClose={() => setShowGuide(false)} />}
    </main>
  );
}
