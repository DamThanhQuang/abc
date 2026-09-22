// Shared by Prisma's pg adapter and the read-only maintenance scripts.
// Server callers only: never expose the returned connection string to clients.

/** @param {string | undefined} connectionString */
export function databaseConnectionConfig(connectionString) {
  const ca = process.env.DATABASE_SSL_CA?.trim().replaceAll("\\n", "\n");
  if (!ca) return { connectionString };
  if (!connectionString) throw new Error("Database connection URL is required.");
  if (!ca.includes("-----BEGIN CERTIFICATE-----")) throw new Error("DATABASE_SSL_CA must contain a PEM certificate.");
  const url = new URL(connectionString);
  // node-postgres replaces the ssl object when SSL query parameters exist.
  // Remove those parameters so the explicitly supplied CA remains effective.
  for (const key of ["sslmode", "sslcert", "sslrootcert", "sslkey", "ssl"]) url.searchParams.delete(key);
  return {
    connectionString: url.toString(),
    ssl: { ca, rejectUnauthorized: true },
  };
}
