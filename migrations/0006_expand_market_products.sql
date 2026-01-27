-- Migration 0006: Expand Market Products
-- ============================================
-- Purpose: Add more Commodities and ETF products to XESTA Market

-- Insert additional Commodities (total: 5 commodities)
INSERT OR IGNORE INTO commodities (symbol, name, current_price, volatility) VALUES
  ('CRUDE', '原油（Crude Oil）', 9500.0, 0.025),
  ('PLATINUM', 'プラチナ（Platinum）', 4200.0, 0.015),
  ('COPPER', '銅（Copper）', 1100.0, 0.018);

-- Insert additional ETF Packs (total: 5+ ETF packs)
INSERT OR IGNORE INTO etf_packs (symbol, name, description, current_price, volatility, theme) VALUES
  ('HEALTH-PACK', '製薬・医療パック', '製薬・ヘルスケア企業の詰め合わせ', 16000.0, 0.028, 'healthcare'),
  ('AUTO-PACK', '自動車パック', 'EV・自動車関連企業の詰め合わせ', 14500.0, 0.032, 'automotive');

-- Note: This brings the total to:
-- - Commodities: 5 products (GOLD, SILVER, CRUDE, PLATINUM, COPPER)
-- - ETF Packs: 5 products (AI-PACK, GREEN-PACK, GAME-PACK, HEALTH-PACK, AUTO-PACK)
