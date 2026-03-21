import React, { useState, useEffect } from "react";
import axios from "axios";
import {OrbitProgress} from "react-loading-indicators"
const ReportList = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null); // For the Modal
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${backendUrl}/api/report/display_report`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setReports(response.data);
    } catch (err) {
      setError("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Reports Analytics
            </h1>
            <p className="text-slate-500 mt-2">
              Manage and review generated reports
            </p>
          </div>
          <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-semibold">
            {reports.length} Total Reports
          </span>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-96">
          <OrbitProgress
            variant="track-disc"
            dense={false}
            color={[
              "#FBBC05",
              "#FFBB00",
              "#EA4335",
              "#F65314",
              "#34A853",
              "#7CBB00",
              "#4286F4",
              "#00A1F1",
            ]}
            size="large"
            text=""
            textColor=""
          />
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
            <p className="text-gray-400 text-lg">
              No reports found in the archive.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {reports.map((report) => (
              <div
                key={report._id}
                className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="9 17v-2m3 2v-4m3 4v-6m2 10H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <span className="text-xs font-medium text-gray-400">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {report.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-4">
                    {report.body}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-7 w-7 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 uppercase">
                        {report.createdBy?.username?.substring(0, 2) || "??"}
                      </div>
                      <span className="text-xs font-semibold text-slate-500">
                        {report.createdBy?.username || "Unknown"}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center"
                    >
                      View Report
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- BIG VIEW MODAL --- */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-800">
                Report Details
              </h2>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-8 overflow-y-auto">
              <h1 className="text-3xl font-black text-slate-900 mb-6">
                {selectedReport.title}
              </h1>

              <section className="mb-8">
                <h4 className="text-xs uppercase tracking-widest font-bold text-blue-600 mb-3">
                  Main Content
                </h4>
                <div className="text-slate-700 leading-loose whitespace-pre-wrap bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  {selectedReport.body}
                </div>
              </section>

              <section>
                <h4 className="text-xs uppercase tracking-widest font-bold text-emerald-600 mb-3">
                  Conclusion
                </h4>
                <div className="text-slate-700 italic border-l-4 border-emerald-500 pl-4 py-2">
                  {selectedReport.conclusion}
                </div>
              </section>
            </div>

            <div className="p-6 bg-slate-50 border-t border-gray-100 flex justify-between text-sm text-slate-500">
              <p>
                Author:{" "}
                <span className="font-semibold text-slate-700">
                  {selectedReport.createdBy?.username}
                </span>
              </p>
              <p>{new Date(selectedReport.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportList;
