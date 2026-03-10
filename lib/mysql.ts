import "server-only";

import mysql, {
  type Pool,
  type PoolOptions,
  type ResultSetHeader,
  type RowDataPacket,
} from "mysql2/promise";

let pool: Pool | undefined;
export type StatementValue = string | number | boolean | Date | null;

function getPoolOptions(): PoolOptions {
  const uri = process.env.DATABASE_URL?.trim();

  if (uri) {
    return {
      uri,
      waitForConnections: true,
      connectionLimit: 10,
      maxIdle: 10,
      enableKeepAlive: true,
      timezone: "Z",
    };
  }

  const host = process.env.MYSQL_HOST?.trim();
  const user = process.env.MYSQL_USER?.trim();
  const password = process.env.MYSQL_PASSWORD ?? "";
  const database = process.env.MYSQL_DATABASE?.trim();
  const port = Number(process.env.MYSQL_PORT ?? 3306);

  if (!host || !user || !database) {
    throw new Error(
      "缺少数据库配置，请设置 DATABASE_URL 或 MYSQL_HOST / MYSQL_USER / MYSQL_PASSWORD / MYSQL_DATABASE。"
    );
  }

  return {
    host,
    user,
    password,
    database,
    port,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    enableKeepAlive: true,
    timezone: "Z",
  };
}

function getPool() {
  pool ??= mysql.createPool(getPoolOptions());
  return pool;
}

export async function queryRows<T extends RowDataPacket[]>(
  sql: string,
  params: StatementValue[] = []
) {
  const [rows] = await getPool().query<T>(sql, params);
  return rows;
}

export async function executeStatement(
  sql: string,
  params: StatementValue[] = []
) {
  const [result] = await getPool().execute<ResultSetHeader>(sql, params);
  return result;
}
