// src/components/DataTable/DataTable.tsx
import React, { useState, useMemo } from 'react';

export interface Column<T> {
  key: string;
  title: string;
  dataIndex: keyof T;
  sortable?: boolean;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  selectable?: boolean;
  onRowSelect?: (selectedRows: T[]) => void;
  className?: string;
  rowKey?: keyof T | ((record: T) => string | number);
  pagination?: boolean;
  pageSize?: number;
  onRowClick?: (record: T, index: number) => void;
  emptyText?: string;
  size?: 'sm' | 'md' | 'lg';
  striped?: boolean;
  bordered?: boolean;
}

type SortDirection = 'asc' | 'desc' | null;

interface SortState {
  column: string | null;
  direction: SortDirection;
}

/**
 * DataTable component with sorting, selection, loading, and empty states
 * - Generic type T for flexible data structure
 * - Column sorting with visual indicators
 * - Row selection (single/multiple)
 * - Loading spinner overlay
 * - Empty state with customizable message
 * - Responsive design with horizontal scroll
 * - Accessibility with proper ARIA attributes
 */
export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  selectable = false,
  onRowSelect,
  className = '',
  rowKey = 'id',
  pagination = false,
  pageSize = 10,
  onRowClick,
  emptyText = 'No data available',
  size = 'md',
  striped = true,
  bordered = false,
}: DataTableProps<T>) {
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());
  const [sortState, setSortState] = useState<SortState>({ column: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);

  // Generate row key
  const getRowKey = (record: T, index: number): string | number => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return record[rowKey] ?? index;
  };

  // Sort data based on current sort state
  const sortedData = useMemo(() => {
    if (!sortState.column || !sortState.direction) {
      return data;
    }

    const column = columns.find(col => col.key === sortState.column);
    if (!column) return data;

    return [...data].sort((a, b) => {
      const aValue = a[column.dataIndex];
      const bValue = b[column.dataIndex];

      if (aValue === bValue) return 0;
      if (aValue == null) return sortState.direction === 'asc' ? -1 : 1;
      if (bValue == null) return sortState.direction === 'asc' ? 1 : -1;

      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortState.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, sortState, columns]);

  // Paginate data if pagination is enabled
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, pagination, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Handle column sorting
  const handleSort = (column: Column<T>) => {
    if (!column.sortable) return;

    setSortState(prev => {
      if (prev.column === column.key) {
        // Cycle through: asc -> desc -> null
        const newDirection = prev.direction === 'asc' ? 'desc' : prev.direction === 'desc' ? null : 'asc';
        return { column: newDirection ? column.key : null, direction: newDirection };
      } else {
        return { column: column.key, direction: 'asc' };
      }
    });
  };

  // Handle row selection
  const handleRowSelect = (rowKey: string | number, selected: boolean) => {
    const newSelected = new Set(selectedRows);
    if (selected) {
      newSelected.add(rowKey);
    } else {
      newSelected.delete(rowKey);
    }
    setSelectedRows(newSelected);

    if (onRowSelect) {
      const selectedData = data.filter((record, index) => 
        newSelected.has(getRowKey(record, index))
      );
      onRowSelect(selectedData);
    }
  };

  // Handle select all
  const handleSelectAll = (selected: boolean) => {
    const newSelected = new Set<string | number>();
    if (selected) {
      paginatedData.forEach((record, index) => {
        newSelected.add(getRowKey(record, index));
      });
    }
    setSelectedRows(newSelected);

    if (onRowSelect) {
      const selectedData = selected ? paginatedData : [];
      onRowSelect(selectedData);
    }
  };

  const isAllSelected = paginatedData.length > 0 && 
    paginatedData.every((record, index) => selectedRows.has(getRowKey(record, index)));
  const isIndeterminate = !isAllSelected && 
    paginatedData.some((record, index) => selectedRows.has(getRowKey(record, index)));

  // Size styles
  const sizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const cellPadding = {
    sm: 'px-3 py-2',
    md: 'px-4 py-3',
    lg: 'px-6 py-4',
  };

  // Base table classes
  const tableClasses = [
    'w-full',
    'border-collapse',
    sizeStyles[size],
    bordered ? 'border border-neutral-200 dark:border-neutral-700' : '',
    className,
  ].filter(Boolean).join(' ');

  const getSortIcon = (column: Column<T>) => {
    if (!column.sortable) return null;
    
    const isActive = sortState.column === column.key;
    const direction = isActive ? sortState.direction : null;

    return (
      <span className="ml-2 inline-flex flex-col">
        <svg
          className={`w-3 h-3 ${
            direction === 'asc' ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-400'
          } -mb-1`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        <svg
          className={`w-3 h-3 ${
            direction === 'desc' ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-400'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </span>
    );
  };

  const renderCell = (column: Column<T>, record: T, index: number) => {
    const value = record[column.dataIndex];
    
    if (column.render) {
      return column.render(value, record, index);
    }
    
    return value?.toString() ?? '';
  };

  if (loading) {
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-white/50 dark:bg-neutral-900/50 flex items-center justify-center z-10">
          <div className="flex items-center space-x-2">
            <svg
              className="animate-spin h-6 w-6 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            <span className="text-neutral-600 dark:text-neutral-400">Loading...</span>
          </div>
        </div>
        <div className="opacity-50 pointer-events-none">
          <table className={tableClasses}>
            <thead className="bg-neutral-50 dark:bg-neutral-800">
              <tr>
                {selectable && (
                  <th className={`${cellPadding[size]} text-left`}>
                    <div className="w-4 h-4 bg-neutral-300 dark:bg-neutral-600 rounded animate-pulse" />
                  </th>
                )}
                {columns.map((column) => (
                  <th key={column.key} className={`${cellPadding[size]} text-left`}>
                    <div className="h-4 bg-neutral-300 dark:bg-neutral-600 rounded animate-pulse" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 3 }).map((_, index) => (
                <tr key={index}>
                  {selectable && (
                    <td className={cellPadding[size]}>
                      <div className="w-4 h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={column.key} className={cellPadding[size]}>
                      <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg">
        <table className={tableClasses}>
          <thead className="bg-neutral-50 dark:bg-neutral-800">
            <tr>
              {selectable && (
                <th 
                  className={`${cellPadding[size]} text-left font-medium text-neutral-900 dark:text-neutral-100`}
                  scope="col"
                >
                  <input
                    type="checkbox"
                    className="rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                    disabled
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`${cellPadding[size]} text-left font-medium text-neutral-900 dark:text-neutral-100 ${
                    column.sortable ? 'cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700' : ''
                  }`}
                  scope="col"
                  style={{ width: column.width }}
                  onClick={() => handleSort(column)}
                  aria-sort={
                    sortState.column === column.key
                      ? sortState.direction === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : column.sortable
                      ? 'none'
                      : undefined
                  }
                >
                  <div className="flex items-center">
                    {column.title}
                    {getSortIcon(column)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
        </table>
        <div className="py-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-neutral-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-neutral-900 dark:text-neutral-100">
            No data
          </h3>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {emptyText}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-neutral-200 dark:border-neutral-700 rounded-lg">
      <div className="overflow-x-auto">
        <table className={tableClasses}>
          <thead className="bg-neutral-50 dark:bg-neutral-800">
            <tr>
              {selectable && (
                <th 
                  className={`${cellPadding[size]} text-left font-medium text-neutral-900 dark:text-neutral-100`}
                  scope="col"
                >
                  <input
                    type="checkbox"
                    className="rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                    checked={isAllSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = isIndeterminate;
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`${cellPadding[size]} text-left font-medium text-neutral-900 dark:text-neutral-100 ${
                    column.sortable ? 'cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700 user-select-none' : ''
                  }`}
                  scope="col"
                  style={{ width: column.width, textAlign: column.align || 'left' }}
                  onClick={() => handleSort(column)}
                  aria-sort={
                    sortState.column === column.key
                      ? sortState.direction === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : column.sortable
                      ? 'none'
                      : undefined
                  }
                >
                  <div className="flex items-center">
                    {column.title}
                    {getSortIcon(column)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-700">
            {paginatedData.map((record, index) => {
              const key = getRowKey(record, index);
              const isSelected = selectedRows.has(key);
              return (
                <tr
                  key={key}
                  className={`
                    ${striped && index % 2 === 1 ? 'bg-neutral-50 dark:bg-neutral-800/50' : ''}
                    ${onRowClick ? 'cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800' : ''}
                    ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                  `}
                  onClick={() => onRowClick?.(record, index)}
                >
                  {selectable && (
                    <td className={cellPadding[size]}>
                      <input
                        type="checkbox"
                        className="rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                        checked={isSelected}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleRowSelect(key, e.target.checked);
                        }}
                        aria-label={`Select row ${index + 1}`}
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`${cellPadding[size]} text-neutral-900 dark:text-neutral-100`}
                      style={{ textAlign: column.align || 'left' }}
                    >
                      {renderCell(column, record, index)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {pagination && totalPages > 1 && (
        <div className="bg-white dark:bg-neutral-900 px-4 py-3 border-t border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
          <div className="flex items-center">
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              Showing{' '}
              <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span>
              {' '}to{' '}
              <span className="font-medium">
                {Math.min(currentPage * pageSize, sortedData.length)}
              </span>
              {' '}of{' '}
              <span className="font-medium">{sortedData.length}</span>
              {' '}results
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm text-black dark:text-neutral-300 border border-neutral-300 dark:border-neutral-600 rounded hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm  text-neutral-700 dark:text-neutral-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm text-black dark:text-neutral-300 border border-neutral-300 dark:border-neutral-600 rounded hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
