import "server-only";

import { createHash, randomUUID } from "node:crypto";
import type { RowDataPacket } from "mysql2/promise";

import {
  executeStatement,
  queryRows,
  type StatementValue,
} from "@/lib/mysql";
import type {
  Article,
  Banner,
  ContactSubmission,
  Product,
  ProductCategory,
  SiteSetting,
} from "@/types";

function asBoolean(value: unknown) {
  return value === true || value === 1 || value === "1";
}

function asStringRecord(value: unknown): Record<string, string> | null {
  if (!value) return null;

  try {
    const parsed =
      typeof value === "string" ? JSON.parse(value) : (value as Record<string, unknown>);

    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    return Object.fromEntries(
      Object.entries(parsed).map(([key, item]) => [key, String(item ?? "")])
    );
  } catch {
    return null;
  }
}

type BannerRow = RowDataPacket & Banner;
type CategoryRow = RowDataPacket & ProductCategory;
type ProductRow = RowDataPacket &
  Omit<Product, "category" | "specifications" | "is_featured" | "is_published"> & {
    specifications: unknown;
    is_featured: number | boolean;
    is_published: number | boolean;
    category_ref_id: string | null;
    category_ref_name: string | null;
    category_ref_slug: string | null;
    category_ref_description: string | null;
    category_ref_sort_order: number | null;
    category_ref_created_at: string | null;
  };
type ArticleRow = RowDataPacket &
  Omit<Article, "is_featured" | "is_published"> & {
    is_featured: number | boolean;
    is_published: number | boolean;
  };
type SiteSettingRow = RowDataPacket & SiteSetting;
type ContactRow = RowDataPacket &
  Omit<ContactSubmission, "is_read"> & { is_read: number | boolean };
type AdminRow = RowDataPacket & {
  id: string;
  email: string;
  password_salt: string;
  password_hash: string;
};

type CountRow = RowDataPacket & {
  total: number;
};

function mapBanner(row: BannerRow): Banner {
  return {
    ...row,
    is_active: asBoolean(row.is_active),
  };
}

function mapCategory(row: CategoryRow): ProductCategory {
  return {
    ...row,
    sort_order: Number(row.sort_order ?? 0),
  };
}

function mapProduct(row: ProductRow): Product {
  const category = row.category_ref_id
    ? {
        id: row.category_ref_id,
        name: row.category_ref_name ?? "",
        slug: row.category_ref_slug ?? "",
        description: row.category_ref_description,
        sort_order: Number(row.category_ref_sort_order ?? 0),
        created_at: row.category_ref_created_at ?? row.created_at,
      }
    : null;

  return {
    id: row.id,
    category_id: row.category_id,
    name: row.name,
    slug: row.slug,
    summary: row.summary,
    description: row.description,
    specifications: asStringRecord(row.specifications),
    image_url: row.image_url,
    is_featured: asBoolean(row.is_featured),
    is_published: asBoolean(row.is_published),
    sort_order: Number(row.sort_order ?? 0),
    created_at: row.created_at,
    updated_at: row.updated_at,
    category,
  };
}

function mapArticle(row: ArticleRow): Article {
  return {
    ...row,
    is_featured: asBoolean(row.is_featured),
    is_published: asBoolean(row.is_published),
  };
}

function mapSiteSetting(row: SiteSettingRow): SiteSetting {
  return row;
}

function mapContact(row: ContactRow): ContactSubmission {
  return {
    ...row,
    is_read: asBoolean(row.is_read),
  };
}

export type ProductInput = {
  category_id: string | null;
  name: string;
  slug: string;
  summary: string | null;
  description: string | null;
  image_url: string | null;
  specifications: Record<string, string> | null;
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
};

export type ArticleInput = {
  title: string;
  slug: string;
  summary: string | null;
  content: string | null;
  cover_image_url: string | null;
  is_featured: boolean;
  is_published: boolean;
  published_at: string | null;
};

export type BannerInput = {
  title: string;
  subtitle: string | null;
  image_url: string;
  link_url: string | null;
  link_text: string | null;
  sort_order: number;
  is_active: boolean;
};

export async function getSiteSettings() {
  const rows = await queryRows<SiteSettingRow[]>(
    "SELECT id, `key`, value, label, updated_at FROM site_settings ORDER BY `key` ASC"
  );
  return rows.map(mapSiteSetting);
}

export async function getSettingsMap() {
  const settings = await getSiteSettings();
  return settings.reduce(
    (acc, setting) => ({ ...acc, [setting.key]: setting.value }),
    {} as Record<string, string | null>
  );
}

export async function getBanners(options?: { activeOnly?: boolean }) {
  const where = options?.activeOnly ? "WHERE is_active = 1" : "";
  const rows = await queryRows<BannerRow[]>(
    `SELECT id, title, subtitle, image_url, link_url, link_text, sort_order, is_active, created_at, updated_at
     FROM banners
     ${where}
     ORDER BY sort_order ASC, created_at DESC`
  );

  return rows.map(mapBanner);
}

export async function getProductCategories() {
  const rows = await queryRows<CategoryRow[]>(
    "SELECT id, name, slug, description, sort_order, created_at FROM product_categories ORDER BY sort_order ASC, created_at ASC"
  );
  return rows.map(mapCategory);
}

export async function getProducts(options?: {
  publishedOnly?: boolean;
  featuredOnly?: boolean;
  categoryId?: string | null;
  excludeId?: string;
  limit?: number;
  slug?: string;
  id?: string;
}) {
  const clauses: string[] = [];
  const params: StatementValue[] = [];
  const safeLimit = options?.limit
    ? Math.max(1, Math.min(options.limit, 50))
    : null;

  if (options?.publishedOnly) {
    clauses.push("p.is_published = 1");
  }
  if (options?.featuredOnly) {
    clauses.push("p.is_featured = 1");
  }
  if (options?.categoryId) {
    clauses.push("p.category_id = ?");
    params.push(options.categoryId);
  }
  if (options?.excludeId) {
    clauses.push("p.id <> ?");
    params.push(options.excludeId);
  }
  if (options?.slug) {
    clauses.push("p.slug = ?");
    params.push(options.slug);
  }
  if (options?.id) {
    clauses.push("p.id = ?");
    params.push(options.id);
  }

  const whereClause = clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "";
  const limitClause = safeLimit ? "LIMIT ?" : "";
  if (safeLimit) {
    params.push(safeLimit);
  }

  const rows = await queryRows<ProductRow[]>(
    `SELECT
      p.id,
      p.category_id,
      p.name,
      p.slug,
      p.summary,
      p.description,
      p.specifications,
      p.image_url,
      p.is_featured,
      p.is_published,
      p.sort_order,
      p.created_at,
      p.updated_at,
      c.id AS category_ref_id,
      c.name AS category_ref_name,
      c.slug AS category_ref_slug,
      c.description AS category_ref_description,
      c.sort_order AS category_ref_sort_order,
      c.created_at AS category_ref_created_at
    FROM products p
    LEFT JOIN product_categories c ON c.id = p.category_id
    ${whereClause}
    ORDER BY p.sort_order ASC, p.created_at DESC
    ${limitClause}`,
    params
  );

  return rows.map(mapProduct);
}

export async function getProductBySlug(slug: string, publishedOnly = true) {
  const [product] = await getProducts({ slug, publishedOnly, limit: 1 });
  return product ?? null;
}

export async function getProductById(id: string) {
  const [product] = await getProducts({ id, limit: 1 });
  return product ?? null;
}

export async function getArticles(options?: {
  publishedOnly?: boolean;
  featuredOnly?: boolean;
  excludeId?: string;
  limit?: number;
  slug?: string;
  id?: string;
}) {
  const clauses: string[] = [];
  const params: StatementValue[] = [];
  const safeLimit = options?.limit
    ? Math.max(1, Math.min(options.limit, 50))
    : null;

  if (options?.publishedOnly) {
    clauses.push("is_published = 1");
  }
  if (options?.featuredOnly) {
    clauses.push("is_featured = 1");
  }
  if (options?.excludeId) {
    clauses.push("id <> ?");
    params.push(options.excludeId);
  }
  if (options?.slug) {
    clauses.push("slug = ?");
    params.push(options.slug);
  }
  if (options?.id) {
    clauses.push("id = ?");
    params.push(options.id);
  }

  const whereClause = clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "";
  const limitClause = safeLimit ? "LIMIT ?" : "";
  if (safeLimit) {
    params.push(safeLimit);
  }

  const rows = await queryRows<ArticleRow[]>(
    `SELECT id, title, slug, summary, content, cover_image_url, is_featured, is_published, published_at, created_at, updated_at
     FROM articles
     ${whereClause}
     ORDER BY COALESCE(published_at, created_at) DESC, created_at DESC
     ${limitClause}`,
    params
  );

  return rows.map(mapArticle);
}

export async function getArticleBySlug(slug: string, publishedOnly = true) {
  const [article] = await getArticles({ slug, publishedOnly, limit: 1 });
  return article ?? null;
}

export async function getArticleById(id: string) {
  const [article] = await getArticles({ id, limit: 1 });
  return article ?? null;
}

export async function getContacts(limit?: number) {
  const safeLimit = limit ? Math.max(1, Math.min(limit, 100)) : null;
  const rows = await queryRows<ContactRow[]>(
    `SELECT id, name, email, phone, company, message, is_read, created_at
     FROM contact_submissions
     ORDER BY created_at DESC
     ${safeLimit ? "LIMIT ?" : ""}`,
    safeLimit ? [safeLimit] : []
  );
  return rows.map(mapContact);
}

async function countRows(
  table: "products" | "articles" | "banners" | "contact_submissions",
  options?: { unreadOnly?: boolean }
) {
  const clauses: string[] = [];
  if (options?.unreadOnly) {
    clauses.push("is_read = 0");
  }
  const whereClause = clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "";
  const rows = await queryRows<CountRow[]>(`SELECT COUNT(*) AS total FROM ${table} ${whereClause}`);
  return Number(rows[0]?.total ?? 0);
}

export async function getDashboardStats() {
  const [products, articles, banners, contacts, unreadContacts] = await Promise.all([
    countRows("products"),
    countRows("articles"),
    countRows("banners"),
    countRows("contact_submissions"),
    countRows("contact_submissions", { unreadOnly: true }),
  ]);

  return {
    products,
    articles,
    banners,
    contacts,
    unreadContacts,
  };
}

export async function verifyAdminCredentials(email: string, password: string) {
  const rows = await queryRows<AdminRow[]>(
    "SELECT id, email, password_salt, password_hash FROM admin_users WHERE email = ? LIMIT 1",
    [email]
  );
  const admin = rows[0];
  if (!admin) return null;

  const candidateHash = createHash("sha256")
    .update(`${admin.password_salt}${password}`)
    .digest("hex");

  if (candidateHash !== admin.password_hash) {
    return null;
  }

  return { id: admin.id, email: admin.email };
}

export async function createProduct(input: ProductInput) {
  const id = randomUUID();
  await executeStatement(
    `INSERT INTO products (
      id, category_id, name, slug, summary, description, specifications, image_url,
      is_featured, is_published, sort_order
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      input.category_id,
      input.name,
      input.slug,
      input.summary,
      input.description,
      input.specifications ? JSON.stringify(input.specifications) : null,
      input.image_url,
      input.is_featured,
      input.is_published,
      input.sort_order,
    ]
  );

  return getProductById(id);
}

export async function updateProduct(id: string, input: ProductInput) {
  await executeStatement(
    `UPDATE products SET
      category_id = ?,
      name = ?,
      slug = ?,
      summary = ?,
      description = ?,
      specifications = ?,
      image_url = ?,
      is_featured = ?,
      is_published = ?,
      sort_order = ?
    WHERE id = ?`,
    [
      input.category_id,
      input.name,
      input.slug,
      input.summary,
      input.description,
      input.specifications ? JSON.stringify(input.specifications) : null,
      input.image_url,
      input.is_featured,
      input.is_published,
      input.sort_order,
      id,
    ]
  );

  return getProductById(id);
}

export async function deleteProduct(id: string) {
  await executeStatement("DELETE FROM products WHERE id = ?", [id]);
}

export async function createArticle(input: ArticleInput) {
  const id = randomUUID();
  await executeStatement(
    `INSERT INTO articles (
      id, title, slug, summary, content, cover_image_url, is_featured, is_published, published_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)` ,
    [
      id,
      input.title,
      input.slug,
      input.summary,
      input.content,
      input.cover_image_url,
      input.is_featured,
      input.is_published,
      input.published_at,
    ]
  );

  return getArticleById(id);
}

export async function updateArticle(id: string, input: ArticleInput) {
  await executeStatement(
    `UPDATE articles SET
      title = ?,
      slug = ?,
      summary = ?,
      content = ?,
      cover_image_url = ?,
      is_featured = ?,
      is_published = ?,
      published_at = ?
    WHERE id = ?`,
    [
      input.title,
      input.slug,
      input.summary,
      input.content,
      input.cover_image_url,
      input.is_featured,
      input.is_published,
      input.published_at,
      id,
    ]
  );

  return getArticleById(id);
}

export async function deleteArticle(id: string) {
  await executeStatement("DELETE FROM articles WHERE id = ?", [id]);
}

export async function createBanner(input: BannerInput) {
  const id = randomUUID();
  await executeStatement(
    `INSERT INTO banners (
      id, title, subtitle, image_url, link_url, link_text, sort_order, is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      input.title,
      input.subtitle,
      input.image_url,
      input.link_url,
      input.link_text,
      input.sort_order,
      input.is_active,
    ]
  );

  const banners = await getBanners();
  return banners.find((banner) => banner.id === id) ?? null;
}

export async function updateBanner(id: string, input: BannerInput) {
  await executeStatement(
    `UPDATE banners SET
      title = ?,
      subtitle = ?,
      image_url = ?,
      link_url = ?,
      link_text = ?,
      sort_order = ?,
      is_active = ?
    WHERE id = ?`,
    [
      input.title,
      input.subtitle,
      input.image_url,
      input.link_url,
      input.link_text,
      input.sort_order,
      input.is_active,
      id,
    ]
  );

  const banners = await getBanners();
  return banners.find((banner) => banner.id === id) ?? null;
}

export async function deleteBanner(id: string) {
  await executeStatement("DELETE FROM banners WHERE id = ?", [id]);
}

export async function updateSiteSettings(values: Record<string, string | null>) {
  await Promise.all(
    Object.entries(values).map(([key, value]) =>
      executeStatement("UPDATE site_settings SET value = ? WHERE `key` = ?", [value, key])
    )
  );

  return getSiteSettings();
}

export async function markContactAsRead(id: string) {
  await executeStatement(
    "UPDATE contact_submissions SET is_read = 1 WHERE id = ?",
    [id]
  );
}

export async function createContactSubmission(input: {
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  message: string;
}) {
  const id = randomUUID();
  await executeStatement(
    `INSERT INTO contact_submissions (
      id, name, email, phone, company, message
    ) VALUES (?, ?, ?, ?, ?, ?)`,
    [id, input.name, input.email, input.phone, input.company, input.message]
  );
}
