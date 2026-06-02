import { expect, test } from '@playwright/test';

const picksByLevel = [
  ['Điều hòa lợi ích xã hội', 'Khoán sản xuất - hợp tác xã mới', 'Đào tạo nghề - trí thức hóa công nhân'],
  ['Khoán sản xuất - hợp tác xã mới', 'Nông nghiệp số - chuỗi giá trị', 'Điều hòa lợi ích xã hội'],
  ['Công nghiệp hỗ trợ - hạ tầng sản xuất', 'Đào tạo nghề - trí thức hóa công nhân', 'Điều hòa lợi ích xã hội'],
  ['An sinh - nhà ở - phúc lợi lao động', 'Điều hòa lợi ích xã hội', 'Khoán sản xuất - hợp tác xã mới'],
  [
    'Dự phòng chuỗi cung ứng chiến lược',
    'Điều hòa lợi ích xã hội',
    'Nông nghiệp số - chuỗi giá trị',
    'Đào tạo nghề - trí thức hóa công nhân',
  ],
  [
    'Nông nghiệp số - chuỗi giá trị',
    'Đào tạo nghề - trí thức hóa công nhân',
    'An sinh - nhà ở - phúc lợi lao động',
    'Điều hòa lợi ích xã hội',
  ],
];

test('self-plays the council strategy game', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Hội Đồng Thời Kỳ Quá Độ' })).toBeVisible();
  await page.getByLabel('Tên người chơi').fill('Codex Selfplay');
  await page.getByRole('button', { name: /Bắt đầu/ }).click();

  for (let index = 0; index < picksByLevel.length; index += 1) {
    await expect(page.getByText(`Tình huống ${index + 1}/6`)).toBeVisible();
    await expect(page.getByText(/Năng lực sản xuất:/)).toBeVisible();
    await expect(page.getByText(/Đời sống nhân dân:/)).toBeVisible();
    await expect(page.getByText(/Khoa học - công nghệ:/)).toBeVisible();
    await expect(page.getByText(/Đoàn kết xã hội:/)).toBeVisible();

    for (const policyName of picksByLevel[index]) {
      await page.getByRole('button', { name: new RegExp(policyName) }).click();
    }

    await page.getByRole('button', { name: /Biểu quyết nghị quyết/ }).click();
    await expect(page.getByText('Thông qua nghị quyết')).toBeVisible();

    const nextLabel = index === picksByLevel.length - 1 ? /Xem tổng kết/ : /Tình huống tiếp theo/;
    await page.getByRole('button', { name: nextLabel }).click();
  }

  await expect(page.getByRole('heading', { name: /điểm/i })).toBeVisible();
  await expect(page.getByText('Bảng xếp hạng')).toBeVisible();
});
