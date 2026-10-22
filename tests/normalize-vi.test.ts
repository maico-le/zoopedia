import { describe, it, expect } from 'vitest';
import { removeVietnameseAccents, matchVietnameseText } from '../src/lib/normalize-vi';

describe('Vietnamese Text Normalization', () => {
  it('should remove accents and normalize correctly', () => {
    expect(removeVietnameseAccents('Hổ')).toBe('ho');
    expect(removeVietnameseAccents('Động vật')).toBe('dong vat');
    expect(removeVietnameseAccents('Cọp Đông Dương')).toBe('cop dong duong');
    expect(removeVietnameseAccents('Ông Ba Mươi')).toBe('ong ba muoi');
  });

  it('should match search queries ignoring accents', () => {
    expect(matchVietnameseText('Hổ Đông Dương', 'dong duong')).toBe(true);
    expect(matchVietnameseText('Panthera tigris (Hổ)', 'ho')).toBe(true);
    expect(matchVietnameseText('Báo hoa mai', 'bao')).toBe(true);
  });
});
