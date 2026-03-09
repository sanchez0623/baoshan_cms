-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- Banners (hero slider)
-- ============================================================
CREATE TABLE banners (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  subtitle    TEXT,
  image_url   TEXT NOT NULL,
  link_url    TEXT,
  link_text   TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- Public can read active banners
CREATE POLICY "Public read active banners"
  ON banners FOR SELECT
  USING (is_active = true);

-- Authenticated users (admins) can do everything
CREATE POLICY "Admins manage banners"
  ON banners FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- Product Categories
-- ============================================================
CREATE TABLE product_categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read categories"
  ON product_categories FOR SELECT
  USING (true);

CREATE POLICY "Admins manage categories"
  ON product_categories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Seed default categories for optical communications
INSERT INTO product_categories (name, slug, description, sort_order) VALUES
  ('光纤光缆', 'optical-fiber-cables', '各类光纤光缆产品，适用于通信网络建设', 1),
  ('光模块', 'optical-modules', '高速光收发模块，支持多种速率和接口', 2),
  ('无源光器件', 'passive-optical-components', '分路器、连接器、适配器等无源器件', 3),
  ('有源设备', 'active-equipment', 'OLT、ONU及其他有源光网络设备', 4),
  ('测试仪表', 'test-instruments', '光纤测试、OTDR及网络测试仪器', 5);

-- ============================================================
-- Products
-- ============================================================
CREATE TABLE products (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id     UUID REFERENCES product_categories(id) ON DELETE SET NULL,
  name            TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  summary         TEXT,
  description     TEXT,
  specifications  JSONB,
  image_url       TEXT,
  is_featured     BOOLEAN NOT NULL DEFAULT false,
  is_published    BOOLEAN NOT NULL DEFAULT true,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published products"
  ON products FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins manage products"
  ON products FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- Articles (News / Blog)
-- ============================================================
CREATE TABLE articles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  summary         TEXT,
  content         TEXT,
  cover_image_url TEXT,
  is_featured     BOOLEAN NOT NULL DEFAULT false,
  is_published    BOOLEAN NOT NULL DEFAULT true,
  published_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published articles"
  ON articles FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins manage articles"
  ON articles FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- Site Settings (key-value store)
-- ============================================================
CREATE TABLE site_settings (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key         TEXT NOT NULL UNIQUE,
  value       TEXT,
  label       TEXT NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read settings"
  ON site_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins manage settings"
  ON site_settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Seed default site settings
INSERT INTO site_settings (key, label, value) VALUES
  ('site_name', '网站名称', '宝山光通信'),
  ('site_tagline', '网站副标题', '专业光通信产品与解决方案提供商'),
  ('company_name', '公司名称', '宝山光通信科技有限公司'),
  ('company_address', '公司地址', '上海市宝山区'),
  ('company_phone', '联系电话', '021-XXXXXXXX'),
  ('company_email', '电子邮箱', 'info@baoshan-optic.com'),
  ('icp_number', 'ICP备案号', '沪ICP备XXXXXXXXX号'),
  ('about_content', '关于我们内容', '宝山光通信科技有限公司专注于光通信产品的研发、生产和销售，致力于为客户提供高品质的光纤、光缆、光模块及系统解决方案。'),
  ('wechat_qrcode', '微信二维码URL', NULL),
  ('footer_description', '页脚描述', '专业光通信产品与解决方案');

-- ============================================================
-- Contact Submissions
-- ============================================================
CREATE TABLE contact_submissions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  company     TEXT,
  message     TEXT NOT NULL,
  is_read     BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can insert
CREATE POLICY "Public can submit contact"
  ON contact_submissions FOR INSERT
  WITH CHECK (true);

-- Only authenticated can read
CREATE POLICY "Admins read contacts"
  ON contact_submissions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins manage contacts"
  ON contact_submissions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- Updated_at triggers
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER banners_updated_at
  BEFORE UPDATE ON banners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
