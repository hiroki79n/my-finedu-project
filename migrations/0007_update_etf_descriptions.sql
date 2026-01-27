-- Migration 0007: Update ETF Pack descriptions with detailed composition
-- ============================================
-- Purpose: Add detailed descriptions of ETF pack contents and constituent stocks

UPDATE etf_packs SET description = 
'【構成銘柄】ソフトバンクG、LINEヤフー、トレンドマイクロ
【テーマ】AI・機械学習・クラウドサービス
【特徴】次世代テクノロジーの成長性に投資。高リターン・高ボラティリティ型。'
WHERE symbol = 'AI-PACK';

UPDATE etf_packs SET description = 
'【構成銘柄】ファーストリテイリング(ユニクロ)、農業関連企業
【テーマ】食品・農業・アパレル
【特徴】生活必需品セクター。安定性重視のディフェンシブ投資。'
WHERE symbol = 'GREEN-PACK';

UPDATE etf_packs SET description = 
'【構成銘柄】任天堂、ソニーグループ
【テーマ】ゲーム・エンターテインメント
【特徴】世界的ゲーム企業への集中投資。高成長が期待できる攻めの選択。'
WHERE symbol = 'GAME-PACK';

UPDATE etf_packs SET description = 
'【構成銘柄】武田薬品、第一三共
【テーマ】製薬・医療・ヘルスケア
【特徴】高齢化社会で需要増。長期安定成長が見込める分野。'
WHERE symbol = 'HEALTH-PACK';

UPDATE etf_packs SET description = 
'【構成銘柄】トヨタ自動車、EV関連企業
【テーマ】自動車・電気自動車・モビリティ
【特徴】EVシフトで変革期。円安メリット大。輸出企業の代表格。'
WHERE symbol = 'AUTO-PACK';
