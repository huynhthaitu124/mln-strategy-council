import { describe, expect, it } from 'vitest';
import {
  calculateOutcome,
  canSelectCard,
  getRequiredText,
  levels,
  statLabels,
  toggleCard,
  uniqueSelectedCards,
} from './gameLogic';

describe('council strategy logic', () => {
  it('uses full Vietnamese labels for every national stat', () => {
    expect(statLabels).toEqual({
      production: 'Năng lực sản xuất',
      livelihood: 'Đời sống nhân dân',
      technology: 'Khoa học - công nghệ',
      solidarity: 'Đoàn kết xã hội',
    });
  });

  it('passes level 1 with a balanced founding coalition', () => {
    const outcome = calculateOutcome(levels[0], ['coordination', 'agri-subsidy', 'technical-training']);

    expect(outcome.passed).toBe(true);
    expect(outcome.failedStats).toEqual([]);
    expect(outcome.remainingBudget).toBe(0);
    expect(outcome.strategyRoute).toBe('Ổn định xã hội trước');
  });

  it('does not pass the agriculture crisis without an agriculture solution', () => {
    const outcome = calculateOutcome(levels[1], ['coordination', 'tax-cut']);

    expect(outcome.passed).toBe(false);
    expect(outcome.objectiveMet).toBe(false);
    expect(getRequiredText(levels[1]).join(' ')).toContain('Chọn một đường lối');
    expect(getRequiredText(levels[1]).join(' ')).toContain('Kỹ thuật hóa nông nghiệp');
  });

  it('passes the agriculture crisis when subsidy is paired with digital agriculture', () => {
    const outcome = calculateOutcome(levels[1], ['digital-agri', 'research-order', 'agri-subsidy']);

    expect(outcome.passed).toBe(true);
    expect(outcome.modifiers).toContain(
      'Khoán sản xuất kết hợp nông nghiệp số biến động lực nông dân thành năng lực phát triển dài hạn.',
    );
    expect(outcome.strategyRoute).toBe('Kỹ thuật hóa nông nghiệp');
  });

  it('requires factory expansion and technical training for industrialization', () => {
    const missingTraining = calculateOutcome(levels[2], ['factory-expansion', 'tax-increase', 'coordination']);
    const withTraining = calculateOutcome(levels[2], ['factory-expansion', 'technical-training', 'research-order']);

    expect(missingTraining.passed).toBe(false);
    expect(missingTraining.modifiers).toContain(
      'Mở rộng hạ tầng sản xuất thiếu đào tạo nghề làm công nghệ và đồng thuận xã hội chịu áp lực.',
    );
    expect(withTraining.passed).toBe(true);
  });

  it('makes contradictory tax policy costly', () => {
    const outcome = calculateOutcome(levels[3], ['tax-increase', 'tax-cut', 'interest-fund']);

    expect(outcome.passed).toBe(false);
    expect(outcome.modifiers).toContain(
      'Vừa tập trung quỹ đầu tư công vừa hỗ trợ giảm chi phí đại trà tạo tín hiệu chính sách mâu thuẫn.',
    );
    expect(outcome.stats.solidarity).toBeLessThan(levels[3].thresholds.solidarity);
  });

  it('passes conflict resolution with interest fund and coordination', () => {
    const outcome = calculateOutcome(levels[3], ['interest-fund', 'labor-protection', 'coordination']);

    expect(outcome.passed).toBe(true);
    expect(outcome.stats.solidarity).toBeGreaterThanOrEqual(78);
    expect(outcome.strategyRoute).toBe('Phúc lợi lao động');
  });

  it('requires import buffer but punishes it when it is not coordinated', () => {
    const looseBuffer = calculateOutcome(levels[4], ['import-buffer', 'technical-training', 'agri-subsidy']);
    const coordinatedBuffer = calculateOutcome(levels[4], [
      'import-buffer',
      'regional-linkage',
      'technical-training',
      'coordination',
    ]);

    expect(looseBuffer.passed).toBe(false);
    expect(looseBuffer.modifiers).toContain('Dự phòng chuỗi cung ứng thiếu điều phối tạo tâm lý phụ thuộc và giảm tự chủ.');
    expect(coordinatedBuffer.passed).toBe(true);
  });

  it('passes the final green knowledge economy only with technology and social balance', () => {
    const outcome = calculateOutcome(levels[5], [
      'digital-agri',
      'technical-training',
      'research-order',
      'interest-fund',
    ]);

    expect(outcome.passed).toBe(true);
    expect(outcome.failedStats).toEqual([]);
    expect(outcome.strategyRoute).toBe('Đổi mới sáng tạo tăng tốc');
  });

  it('supports multiple valid routes with different scores on the same level', () => {
    const safeRoute = calculateOutcome(levels[1], ['agri-subsidy', 'digital-agri', 'coordination']);
    const marketRoute = calculateOutcome(levels[1], ['agri-subsidy', 'digital-agri', 'market-linkage']);
    const techRoute = calculateOutcome(levels[1], ['digital-agri', 'research-order', 'agri-subsidy']);

    expect(safeRoute.passed).toBe(true);
    expect(marketRoute.passed).toBe(true);
    expect(techRoute.passed).toBe(true);
    expect(new Set([safeRoute.score, marketRoute.score, techRoute.score]).size).toBe(3);
    expect(techRoute.score).toBeGreaterThan(safeRoute.score);
  });

  it('keeps every advertised strategic route playable with non-identical scores', () => {
    for (const level of levels) {
      const routeOutcomes = level.strategyRoutes?.map((route) => calculateOutcome(level, route.cards)) ?? [];

      expect(routeOutcomes.every((outcome) => outcome.passed)).toBe(true);
      expect(new Set(routeOutcomes.map((outcome) => outcome.score)).size).toBe(routeOutcomes.length);
    }
  });

  it('deduplicates cards and enforces budget/max-card selection', () => {
    expect(uniqueSelectedCards(['coordination', 'coordination', 'tax-cut'], levels[0].hand)).toEqual([
      'coordination',
      'tax-cut',
    ]);

    let selected = toggleCard(levels[0], [], 'coordination');
    selected = toggleCard(levels[0], selected, 'agri-subsidy');
    selected = toggleCard(levels[0], selected, 'technical-training');

    expect(canSelectCard(levels[0], selected, 'credit-coop')).toBe(false);
    expect(toggleCard(levels[0], selected, 'credit-coop')).toEqual(selected);
  });
});
