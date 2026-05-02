import React from 'react';

const Table = ({ headers, children, className = "" }) => {
  return (
    <div className={`overflow-x-auto rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-sm ${className}`}>
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-700 dark:bg-slate-900">
          <tr>
            {headers.map((header, idx) => (
              <th 
                key={idx} 
                className="px-6 py-4 text-sm font-black text-white uppercase tracking-wider border-b-2 border-slate-600 dark:border-slate-700 whitespace-nowrap"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y-2 divide-slate-100 dark:divide-slate-700/50 bg-white dark:bg-transparent">
          {children}
        </tbody>
      </table>
    </div>
  );
};

export const TableRow = ({ children, className = "", onClick, style }) => (
  <tr 
    onClick={onClick}
    style={style}
    className={`hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors ${onClick ? 'cursor-pointer' : ''} ${className}`}
  >
    {children}
  </tr>
);

export const TableCell = ({ children, className = "" }) => (
  <td className={`px-6 py-4 text-base font-semibold text-slate-700 dark:text-slate-200 ${className}`}>
    {children}
  </td>
);

export default Table;

