import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./App.css";

const API =
  process.env.REACT_APP_API_URL ||
  "https://real-time-reporting.onrender.com";

export default function Dashboard({ goBack }) {
  const [reports, setReports] = useState([]);

  /* ================= FETCH REPORTS ================= */

  const fetchReports = useCallback(async () => {
    try {
      const res = await axios.get(
        `${API}/api/reports`
      );

      setReports(res.data || []);

    } catch (err) {
      console.error("Fetch Error:", err);
      alert("Failed to fetch reports");
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  /* ================= DOWNLOAD PDF ================= */

  const downloadPDF = async (id) => {
    try {
      const res = await axios.get(
        `${API}/api/reports/${id}/download`,
        {
          responseType: "blob",
        }
      );

      const fileURL = window.URL.createObjectURL(
        new Blob([res.data], {
          type: "application/pdf",
        })
      );

      const link = document.createElement("a");

      link.href = fileURL;
      link.download = "report.pdf";

      document.body.appendChild(link);

      link.click();

      link.remove();

    } catch (err) {
      console.error("Download Error:", err);
      alert("Download failed");
    }
  };

  /* ================= PREVIEW PDF ================= */

  const previewPDF = (id) => {
    window.open(
      `${API}/api/reports/${id}`,
      "_blank"
    );
  };

  /* ================= DELETE REPORT ================= */

  const deleteReport = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this report?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${API}/api/reports/${id}`
      );

      fetchReports();

      alert("Report deleted");

    } catch (err) {
      console.error("Delete Error:", err);
      alert("Delete failed");
    }
  };

  return (
    <div className="main">

      <div className="card">

        <h2>Reports Dashboard</h2>

        <div className="table-container">

          <table>

            <thead>
              <tr>
                <th>Site</th>
                <th>Work</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {reports.length > 0 ? (
                reports.map((r) => (
                  <tr key={r._id}>

                    <td>{r.siteName}</td>

                    <td>{r.workType}</td>

                    <td>{r.priority}</td>

                    <td>{r.status}</td>

                    <td>{r.dateTime || "-"}</td>

                    <td>
                      <div className="actions">

                        <button
                          className="btn btn-preview"
                          onClick={() =>
                            previewPDF(r._id)
                          }
                        >
                          Preview
                        </button>

                        <button
                          className="btn btn-download"
                          onClick={() =>
                            downloadPDF(r._id)
                          }
                        >
                          Download
                        </button>

                        <button
                          className="btn btn-delete"
                          onClick={() =>
                            deleteReport(r._id)
                          }
                        >
                          Delete
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "20px",
                    }}
                  >
                    No Reports Found
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

        <button
          className="button"
          onClick={goBack}
        >
          Back to Form
        </button>

      </div>

    </div>
  );
}
