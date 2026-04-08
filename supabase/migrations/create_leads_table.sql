-- Chạy SQL này trong Supabase Dashboard → SQL Editor
-- hoặc trong mục Table Editor → New table

CREATE TABLE IF NOT EXISTS leads (
  id              UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  source          TEXT          NOT NULL,           -- 'facebook_message' | 'facebook_comment' | 'tiktok' | 'website'
  platform_user_id TEXT,                            -- PSID (Facebook) hoặc user ID của nền tảng khác
  sender_name     TEXT,                             -- Tên người gửi
  raw_message     TEXT,                             -- Nội dung tin nhắn/bình luận gốc
  phone           TEXT,                             -- SĐT trích xuất từ nội dung
  email           TEXT,                             -- Email trích xuất từ nội dung
  address         TEXT,                             -- Địa chỉ trích xuất từ nội dung
  name            TEXT,                             -- Tên khách hàng trích xuất từ nội dung
  created_at      TIMESTAMPTZ   DEFAULT NOW()
);

-- Index để query theo source
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);

-- Index để query theo platform_user_id (ví dụ: tìm tất cả tin nhắn từ 1 khách)
CREATE INDEX IF NOT EXISTS idx_leads_platform_user_id ON leads(platform_user_id);

-- Index để tra cứu theo SĐT
CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads(phone);
