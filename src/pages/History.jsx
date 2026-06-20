import React, { useState, useEffect } from 'react';
import * as historyApi from '../api/historyApi';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Globe, 
  Mail, 
  Users, 
  History as HistoryIcon,
  Download,
  ChevronLeft,
  ChevronRight,
  FileText,
  Trash2,
  Check
} from 'lucide-react';
import toast from 'react-hot-toast';

const History = () => {
  const [historyList, setHistoryList] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedModule, setSelectedModule] = useState('');

  const fetchHistory = async (page, module = '') => {
    setLoading(true);
    try {
      const response = await historyApi.getHistory(page, 5, module);
      setHistoryList(response.data.history);
      setPagination(response.data.pagination);
      setSelectedIds([]); // Clear selection on reload
    } catch (err) {
      console.error(err);
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(currentPage, selectedModule);
  }, [currentPage, selectedModule]);

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    setCurrentPage(page);
  };

  const handleSelectRow = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const allVisibleIds = historyList.map(row => row.id);
    const isAllSelected = allVisibleIds.every(id => selectedIds.includes(id));

    if (isAllSelected) {
      setSelectedIds(prev => prev.filter(id => !allVisibleIds.includes(id)));
    } else {
      setSelectedIds(prev => {
        const newIds = allVisibleIds.filter(id => !prev.includes(id));
        return [...prev, ...newIds];
      });
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete the ${selectedIds.length} selected history records?`)) return;

    try {
      await historyApi.deleteHistory(selectedIds, false);
      toast.success('Selected history entries deleted.');
      setSelectedIds([]);
      const newPage = (historyList.length === selectedIds.length && currentPage > 1) ? currentPage - 1 : currentPage;
      setCurrentPage(newPage);
      fetchHistory(newPage, selectedModule);
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete selected history');
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm('Are you sure you want to delete your entire history? This action cannot be undone.')) return;

    try {
      await historyApi.deleteHistory([], true);
      toast.success('Entire history deleted successfully.');
      setSelectedIds([]);
      setCurrentPage(1);
      fetchHistory(1, selectedModule);
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete all history');
    }
  };

  const handleExportCSV = () => {
    if (historyList.length === 0) {
      toast.error('No history to export');
      return;
    }
    const headers = ['Module', 'Input', 'Output', 'Date'];
    const csvRows = [headers.join(',')];
    historyList.forEach(row => {
      const dateStr = new Date(row.created_at).toLocaleString();
      const escapedInput = `"${row.input.replace(/"/g, '""')}"`;
      const escapedOutput = `"${row.output.replace(/"/g, '""')}"`;
      csvRows.push([row.module, escapedInput, escapedOutput, `"${dateStr}"`].join(','));
    });
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'easywithai_history.csv');
    a.click();
    toast.success('CSV history exported');
  };

  const handleExportJSON = () => {
    if (historyList.length === 0) {
      toast.error('No history to export');
      return;
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(historyList, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', 'easywithai_history.json');
    a.click();
    toast.success('JSON data history exported');
  };

  const getModuleIcon = (module) => {
    switch (module) {
      case 'Translator':
        return (
          <div className="w-8 h-8 rounded-lg bg-purple-100 text-[#6C4CF1] dark:bg-purple-950/20 dark:text-[#A793FF] flex items-center justify-center shrink-0">
            <Globe size={16} />
          </div>
        );
      case 'Email Generator':
        return (
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Mail size={16} />
          </div>
        );
      case 'Entity Recognition':
        return (
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Users size={16} />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 flex items-center justify-center shrink-0">
            <HistoryIcon size={16} />
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left max-w-6xl mx-auto">
      {/* Top Header & Export Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">
            History
          </h1>
          <p className="text-[14px] text-gray-500 dark:text-gray-400">
            View your past AI interactions
          </p>
        </div>

        {/* Exports & Deletion Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {selectedIds.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 text-red-650 hover:bg-red-500/20 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-900/30 font-semibold rounded-xl text-[13px] shadow-sm transition-all duration-200 cursor-pointer"
            >
              <Trash2 size={15} />
              <span>Delete Selected ({selectedIds.length})</span>
            </button>
          )}

          {historyList.length > 0 && (
            <button
              onClick={handleDeleteAll}
              className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-[#16171D] border border-gray-150 dark:border-gray-800 hover:bg-red-50/50 dark:hover:bg-red-950/10 hover:border-red-150 dark:hover:border-red-900/30 text-gray-550 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 font-semibold rounded-xl text-[13px] shadow-sm transition-all duration-200 cursor-pointer"
            >
              <Trash2 size={15} />
              <span>Clear All History</span>
            </button>
          )}

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-150 dark:bg-[#16171D] dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl text-[13px] shadow-sm transition-all duration-200 cursor-pointer"
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-150 dark:bg-[#16171D] dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl text-[13px] shadow-sm transition-all duration-200 cursor-pointer"
          >
            <FileText size={15} />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-1.5 border-b border-gray-100 dark:border-gray-800">
        {[
          { label: 'All Activities', value: '' },
          { label: 'Translations', value: 'Translator' },
          { label: 'Emails Generated', value: 'Email Generator' },
          { label: 'Entity Extractions', value: 'Entity Recognition' }
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setSelectedModule(tab.value);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition-all duration-150 cursor-pointer
              ${selectedModule === tab.value
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white dark:bg-[#16171D] border border-gray-155 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table Container Card */}
      <div className="bg-white dark:bg-[#16171D] border border-gray-100 dark:border-gray-800/80 rounded-card shadow-subtle overflow-hidden flex flex-col justify-between min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/30 border-b border-gray-100 dark:border-gray-800 text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider text-[11px] text-left select-none">
                <th className="py-4 px-6 w-12 text-center">
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      className={`w-4.5 h-4.5 border rounded-md flex items-center justify-center transition-all duration-150 cursor-pointer focus:outline-none
                        ${historyList.length > 0 && historyList.every(row => selectedIds.includes(row.id))
                          ? 'bg-primary border-primary text-white'
                          : 'bg-transparent border-gray-300 dark:border-gray-700 hover:border-primary dark:hover:border-primary-light text-transparent'
                        }
                      `}
                      aria-label="Select all logs"
                    >
                      {historyList.length > 0 && historyList.every(row => selectedIds.includes(row.id)) && (
                        <Check size={10} className="stroke-[3.5] text-white shrink-0" />
                      )}
                    </button>
                  </div>
                </th>
                <th className="py-4 px-6">Module</th>
                <th className="py-4 px-6">Input</th>
                <th className="py-4 px-6">Output</th>
                <th className="py-4 px-6">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <LoadingSpinner />
                      <span className="text-gray-400 text-[13px]">Retrieving logs...</span>
                    </div>
                  </td>
                </tr>
              ) : historyList.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center text-gray-400 dark:text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <HistoryIcon size={32} className="text-gray-300 dark:text-gray-700" />
                      <span className="font-semibold text-[14px]">No interactions found</span>
                      <span className="text-[11px] mt-0.5">Your past AI operations will be logged here.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                historyList.map((row) => (
                  <tr key={row.id} className={`hover:bg-gray-50/30 dark:hover:bg-gray-800/10 transition-colors duration-150 ${selectedIds.includes(row.id) ? 'bg-primary/5 dark:bg-primary/5' : ''}`}>
                    {/* Checkbox */}
                    <td className="py-4.5 px-6 text-center select-none">
                      <div className="flex justify-center">
                        <button
                          type="button"
                          onClick={() => handleSelectRow(row.id)}
                          className={`w-4.5 h-4.5 border rounded-md flex items-center justify-center transition-all duration-150 cursor-pointer focus:outline-none
                            ${selectedIds.includes(row.id)
                              ? 'bg-primary border-primary text-white'
                              : 'bg-transparent border-gray-300 dark:border-gray-700 hover:border-primary dark:hover:border-primary-light text-transparent'
                            }
                          `}
                          aria-label={`Select log ${row.id}`}
                        >
                          {selectedIds.includes(row.id) && (
                            <Check size={10} className="stroke-[3.5] text-white shrink-0" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Module */}
                    <td className="py-4.5 px-6 font-semibold text-gray-900 dark:text-white">
                      <div className="flex items-center gap-3">
                        {getModuleIcon(row.module)}
                        <span>{row.module}</span>
                      </div>
                    </td>

                    {/* Input */}
                    <td className="py-4.5 px-6 text-gray-600 dark:text-gray-300 max-w-[200px] truncate">
                      {row.input}
                    </td>

                    {/* Output */}
                    <td className="py-4.5 px-6 text-gray-600 dark:text-gray-300 max-w-[300px] truncate text-left">
                      {row.output}
                    </td>

                    {/* Date */}
                    <td className="py-4.5 px-6 text-gray-500 dark:text-gray-500 whitespace-nowrap">
                      <div className="flex flex-col text-[13px] leading-tight">
                        <span className="font-semibold text-gray-700 dark:text-gray-400">
                          {new Date(row.created_at).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                        <span className="text-[11px] text-gray-400 dark:text-gray-600 mt-0.5">
                          {new Date(row.created_at).toLocaleTimeString(undefined, {
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {!loading && pagination.totalPages > 1 && (
          <div className="py-4 px-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-center gap-1">
            {/* Prev */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Numbers */}
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => handlePageChange(num)}
                className={`w-8 h-8 rounded-lg text-[13px] font-bold transition-all duration-150 cursor-pointer
                  ${num === currentPage 
                    ? 'bg-primary text-white shadow-md shadow-primary/20' 
                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                  }
                `}
              >
                {num}
              </button>
            ))}

            {/* Next */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.totalPages}
              className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
