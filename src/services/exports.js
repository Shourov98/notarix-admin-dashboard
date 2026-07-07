import { buildApiUrl } from "./httpClient";
import { getAdminSession } from "../utils/auth";

const buildExportQuery = (filters = {}, format = "csv") =>
  new URLSearchParams({
    ...Object.fromEntries(
      Object.entries(filters).filter(
        ([, value]) => value !== undefined && value !== null && value !== ""
      )
    ),
    format,
  }).toString();

/**
 * Download a CSV (or other binary) report from the admin API.
 * Triggers a file-save dialog in the browser.
 *
 * @param {string} path  e.g. "/admin/reports/orders"
 * @param {Object} [filters]  query-string filters
 * @param {string} [filename]  desired download filename
 * @returns {Promise<void>}
 */
export const downloadReport = async (path, filters = {}, filename = "report.csv") => {
  const session = getAdminSession();
  if (!session?.accessToken) {
    throw new Error("Admin session expired. Please sign in again.");
  }

  const query = buildExportQuery(filters);
  const url = buildApiUrl(`${path}${query ? `?${query}` : ""}`);

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Unable to download report (HTTP ${response.status}).`);
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
};
