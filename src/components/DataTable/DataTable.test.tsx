// src/components/DataTable/DataTable.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DataTable } from './DataTable';
import type { Column } from './DataTable';

type User = {
  id: number;
  name: string;
  email: string;
  age: number;
  active: boolean;
};

const mockUsers: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com', age: 28, active: true },
  { id: 2, name: 'Bob', email: 'bob@example.com', age: 32, active: false },
  { id: 3, name: 'Carol', email: 'carol@example.com', age: 24, active: true },
];

const columns: Column<User>[] = [
  { key: 'name', title: 'Name', dataIndex: 'name', sortable: true },
  { key: 'email', title: 'Email', dataIndex: 'email', sortable: true },
  { key: 'age', title: 'Age', dataIndex: 'age', sortable: true },
  { key: 'active', title: 'Active', dataIndex: 'active' },
];

describe('DataTable', () => {
  it('renders table headers and data', () => {
    render(<DataTable data={mockUsers} columns={columns} />);
    
    // Check headers
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    
    // Check data
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('alice@example.com')).toBeInTheDocument();
    expect(screen.getByText('28')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<DataTable data={mockUsers} columns={columns} loading />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    // Table should still be present but with overlay
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('shows empty state when no data', () => {
    render(<DataTable data={[]} columns={columns} emptyText="No users found" />);
    
    expect(screen.getByText('No data')).toBeInTheDocument();
    expect(screen.getByText('No users found')).toBeInTheDocument();
    // Headers should still be present
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('handles column sorting', () => {
    render(<DataTable data={mockUsers} columns={columns} />);
    
    const nameHeader = screen.getByText('Name');
    expect(nameHeader.closest('th')).toHaveAttribute('aria-sort', 'none');
    
    // Click to sort ascending
    fireEvent.click(nameHeader);
    expect(nameHeader.closest('th')).toHaveAttribute('aria-sort', 'ascending');
    
    // Click again to sort descending
    fireEvent.click(nameHeader);
    expect(nameHeader.closest('th')).toHaveAttribute('aria-sort', 'descending');
    
    // Click again to remove sort
    fireEvent.click(nameHeader);
    expect(nameHeader.closest('th')).toHaveAttribute('aria-sort', 'none');
  });

  it('handles row selection', () => {
    const handleRowSelect = vi.fn();
    render(
      <DataTable 
        data={mockUsers} 
        columns={columns} 
        selectable 
        onRowSelect={handleRowSelect} 
      />
    );
    
    // Should have select all checkbox
    const selectAllCheckbox = screen.getByRole('checkbox', { name: /select all/i });
    expect(selectAllCheckbox).toBeInTheDocument();
    
    // Should have individual row checkboxes
    const rowCheckboxes = screen.getAllByRole('checkbox', { name: /select row/i });
    expect(rowCheckboxes).toHaveLength(3);
    
    // Click first row checkbox
    fireEvent.click(rowCheckboxes[0]);
    expect(handleRowSelect).toHaveBeenCalledWith([mockUsers[0]]);
    
    // Click select all
    fireEvent.click(selectAllCheckbox);
    expect(handleRowSelect).toHaveBeenLastCalledWith(mockUsers);
  });

  it('sorts data correctly', () => {
    render(<DataTable data={mockUsers} columns={columns} />);
    
    // Click age header to sort by age
    const ageHeader = screen.getByText('Age');
    fireEvent.click(ageHeader);
    
    // Get all age cells and verify ascending order
    const ageCells = screen.getAllByText(/^(24|28|32)$/);
    expect(ageCells[0]).toHaveTextContent('24');
    expect(ageCells[1]).toHaveTextContent('28');
    expect(ageCells[2]).toHaveTextContent('32');
    
    // Click again for descending
    fireEvent.click(ageHeader);
    const descendingAgeCells = screen.getAllByText(/^(24|28|32)$/);
    expect(descendingAgeCells[0]).toHaveTextContent('32');
    expect(descendingAgeCells[1]).toHaveTextContent('28');
    expect(descendingAgeCells[2]).toHaveTextContent('24');
  });

  it('handles custom render function', () => {
    const customColumns: Column<User>[] = [
      {
        key: 'status',
        title: 'Status',
        dataIndex: 'active',
        render: (value) => value ? '✅ Active' : '❌ Inactive'
      }
    ];
    
    render(<DataTable data={mockUsers} columns={customColumns} />);
    
    expect(screen.getByText('✅ Active')).toBeInTheDocument();
    expect(screen.getByText('❌ Inactive')).toBeInTheDocument();
  });

  it('applies correct ARIA attributes', () => {
    render(<DataTable data={mockUsers} columns={columns} />);
    
    // Table should have proper structure
    expect(screen.getByRole('table')).toBeInTheDocument();
    
    // Headers should have column scope
    const headers = screen.getAllByRole('columnheader');
    headers.forEach(header => {
      expect(header).toHaveAttribute('scope', 'col');
    });
    
    // Sortable headers should have aria-sort
    const nameHeader = screen.getByRole('columnheader', { name: /name/i });
    expect(nameHeader).toHaveAttribute('aria-sort', 'none');
  });

  it('handles pagination when enabled', () => {
    const manyUsers = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      age: 20 + i,
      active: i % 2 === 0
    }));
    
    render(
      <DataTable 
        data={manyUsers} 
        columns={columns} 
        pagination 
        pageSize={3} 
      />
    );
    
    // Should show pagination controls
    expect(screen.getByText(/showing/i)).toBeInTheDocument();
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    
    // Should only show 3 rows (pageSize)
    const nameColumn = screen.getAllByText(/^User \d+$/);
    expect(nameColumn).toHaveLength(3);
    
    // Click next page
    fireEvent.click(screen.getByText('Next'));
    
    // Should show next set of users
    expect(screen.getByText('User 4')).toBeInTheDocument();
  });

  it('handles row click events', () => {
    const handleRowClick = vi.fn();
    render(
      <DataTable 
        data={mockUsers} 
        columns={columns} 
        onRowClick={handleRowClick} 
      />
    );
    
    // Click on first row
    const firstRow = screen.getByText('Alice').closest('tr');
    fireEvent.click(firstRow!);
    
    expect(handleRowClick).toHaveBeenCalledWith(mockUsers[0], 0);
  });

  it('renders with different sizes', () => {
    const { rerender } = render(
      <DataTable data={mockUsers} columns={columns} size="sm" />
    );
    
    expect(screen.getByRole('table')).toHaveClass('text-sm');
    
    rerender(<DataTable data={mockUsers} columns={columns} size="lg" />);
    expect(screen.getByRole('table')).toHaveClass('text-lg');
  });

  it('handles non-sortable columns correctly', () => {
    const nonSortableColumns: Column<User>[] = [
      { key: 'name', title: 'Name', dataIndex: 'name', sortable: false },
      { key: 'email', title: 'Email', dataIndex: 'email' }, // no sortable prop = false
    ];
    
    render(<DataTable data={mockUsers} columns={nonSortableColumns} />);
    
    const nameHeader = screen.getByText('Name');
    
    // Should not have aria-sort attribute for non-sortable columns
    expect(nameHeader.closest('th')).not.toHaveAttribute('aria-sort');
    
    // Clicking should not change anything
    fireEvent.click(nameHeader);
    expect(nameHeader.closest('th')).not.toHaveAttribute('aria-sort');
  });
});
