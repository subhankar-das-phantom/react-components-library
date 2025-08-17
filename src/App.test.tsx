// src/App.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import App from './App';


describe('🎨 App Component Integration Tests', () => {
  beforeEach(() => {
    // Clear any previous timers
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('🚀 Initial Render', () => {
    it('should render both InputField and DataTable components with proper headings', () => {
      render(<App />);
      
      // Check for main section headings
      expect(screen.getByRole('heading', { name: /demo: inputfield/i, level: 1 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /demo: datatable/i, level: 1 })).toBeInTheDocument();
      
      // Check for form elements
      expect(screen.getByLabelText(/user name/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add user/i })).toBeInTheDocument();
      
      // Check for table
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getByText(/selected users/i)).toBeInTheDocument();
    });

    it('should display initial user data in the table', () => {
      render(<App />);
      
      // Check for initial users
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('alice@example.com')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
      expect(screen.getByText('Carol')).toBeInTheDocument();
      
      // Check for active/inactive indicators
      expect(screen.getAllByText('✔️')).toHaveLength(3); // Alice, Carol, Erin are active
      expect(screen.getAllByText('❌')).toHaveLength(2); // Bob, Dave are inactive
    });
  });

  describe('📝 InputField Functionality', () => {
    it('should validate empty input and show error message', () => {
      render(<App />);
      const addButton = screen.getByRole('button', { name: /add user/i });
      
      // Try to add user without name
      fireEvent.click(addButton);
      
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/user name/i)).toHaveAttribute('aria-invalid', 'true');
    });

    it('should clear error when user starts typing', () => {
      render(<App />);
      const input = screen.getByLabelText(/user name/i);
      const addButton = screen.getByRole('button', { name: /add user/i });
      
      // Trigger error first
      fireEvent.click(addButton);
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      
      // Start typing - error should clear
      fireEvent.change(input, { target: { value: 'John' } });
      expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument();
      expect(input).not.toHaveAttribute('aria-invalid', 'true');
    });

    it('should show loading state during user addition', async () => {
      render(<App />);
      const input = screen.getByLabelText(/user name/i);
      const addButton = screen.getByRole('button', { name: /add user/i });
      
      // Fill input and click add
      fireEvent.change(input, { target: { value: 'Frank' } });
      fireEvent.click(addButton);
      
      // Should show loading state
      expect(addButton).toBeDisabled();
      expect(input).toHaveAttribute('aria-busy', 'true');
      
      // Fast-forward time to complete loading
      vi.advanceTimersByTime(750);
      
      await waitFor(() => {
        expect(addButton).not.toBeDisabled();
        expect(input).not.toHaveAttribute('aria-busy', 'true');
        expect(input).toHaveValue(''); // Input should be cleared
      });
    });

    it('should successfully add a new user to the table', async () => {
      render(<App />);
      const input = screen.getByLabelText(/user name/i);
      const addButton = screen.getByRole('button', { name: /add user/i });
      
      // Add new user
      fireEvent.change(input, { target: { value: 'Grace' } });
      fireEvent.click(addButton);
      
      // Fast-forward time
      vi.advanceTimersByTime(750);
      
      await waitFor(() => {
        expect(screen.getByText('Grace')).toBeInTheDocument();
        expect(screen.getByText('grace@example.com')).toBeInTheDocument();
      });
      
      // Verify input is cleared after successful addition
      expect(input).toHaveValue('');
    });
  });

  describe('📊 DataTable Functionality', () => {
    it('should handle row selection properly', () => {
      render(<App />);
      const rowCheckboxes = screen.getAllByRole('checkbox', { name: /select row/i });
      const selectedUsersText = screen.getByText(/selected users:/i);
      
      // Initially no users selected
      expect(selectedUsersText.textContent).toMatch(/none/i);
      
      // Select first user (Alice)
      fireEvent.click(rowCheckboxes[0]);
      expect(selectedUsersText.textContent).toContain('Alice');
      expect(selectedUsersText.textContent).not.toMatch(/none/i);
      
      // Select second user (Bob) - should show both
      fireEvent.click(rowCheckboxes[1]);
      expect(selectedUsersText.textContent).toContain('Alice');
      expect(selectedUsersText.textContent).toContain('Bob');
    });

    it('should handle select all functionality', () => {
      render(<App />);
      const selectAllCheckbox = screen.getByRole('checkbox', { name: /select all/i });
      const selectedUsersText = screen.getByText(/selected users:/i);
      
      // Select all users
      fireEvent.click(selectAllCheckbox);
      
      // Should show all user names
      expect(selectedUsersText.textContent).toContain('Alice');
      expect(selectedUsersText.textContent).toContain('Bob');
      expect(selectedUsersText.textContent).toContain('Carol');
      expect(selectedUsersText.textContent).toContain('Dave');
      expect(selectedUsersText.textContent).toContain('Erin');
      
      // Deselect all
      fireEvent.click(selectAllCheckbox);
      expect(selectedUsersText.textContent).toMatch(/none/i);
    });

    it('should sort columns correctly', () => {
      render(<App />);
      
      // Test sorting by Age column
      const ageHeader = screen.getByText('Age');
      
      // Click to sort ascending
      fireEvent.click(ageHeader);
      expect(ageHeader.closest('th')).toHaveAttribute('aria-sort', 'ascending');
      
      // Get age values in order they appear
      const ageCells = screen.getAllByRole('cell').filter(cell => 
        ['22', '24', '28', '32', '36'].includes(cell.textContent ?? '')
      );
      
      // Should be in ascending order: 22, 24, 28, 32, 36
      expect(ageCells[0]).toHaveTextContent('22');
      expect(ageCells[1]).toHaveTextContent('24');
      expect(ageCells[2]).toHaveTextContent('28');
      
      // Click again to sort descending
      fireEvent.click(ageHeader);
      expect(ageHeader.closest('th')).toHaveAttribute('aria-sort', 'descending');
      
      const descendingAgeCells = screen.getAllByRole('cell').filter(cell => 
        ['22', '24', '28', '32', '36'].includes(cell.textContent ?? '')
      );
      
      // Should be in descending order: 36, 32, 28, 24, 22
      expect(descendingAgeCells[0]).toHaveTextContent('36');
      expect(descendingAgeCells[1]).toHaveTextContent('32');
    });

    it('should handle sorting by name alphabetically', () => {
      render(<App />);
      
      const nameHeader = screen.getByText('Name');
      
      // Click to sort by name ascending
      fireEvent.click(nameHeader);
      
      const nameRows = screen.getAllByRole('row').slice(1); // Skip header row
      const firstRowName = nameRows[0].querySelector('td')?.textContent;
      
      // First name should be Alice (alphabetically first)
      expect(firstRowName).toBe('Alice');
    });
  });

  describe('🔄 Pagination Functionality', () => {
    it('should handle pagination with multiple users', async () => {
      render(<App />);
      const input = screen.getByLabelText(/user name/i);
      const addButton = screen.getByRole('button', { name: /add user/i });
      
      // Add a 6th user to test pagination (pageSize is 5)
      fireEvent.change(input, { target: { value: 'Henry' } });
      fireEvent.click(addButton);
      
      vi.advanceTimersByTime(750);
      
      await waitFor(() => {
        expect(screen.getByText('Henry')).toBeInTheDocument();
      });
      
      // Should now have pagination controls
      expect(screen.getByText('Next')).toBeInTheDocument();
      expect(screen.getByText('Previous')).toBeInTheDocument();
      expect(screen.getByText(/showing/i)).toBeInTheDocument();
      
      // Next button should not be disabled (we have 6 users, showing 5)
      expect(screen.getByText('Next')).not.toBeDisabled();
      
      // Go to next page
      fireEvent.click(screen.getByText('Next'));
      
      // Should see Henry on the second page
      expect(screen.getByText('Henry')).toBeInTheDocument();
      
      // Previous button should now be enabled
      expect(screen.getByText('Previous')).not.toBeDisabled();
    });

    it('should show correct pagination info', async () => {
      render(<App />);
      const input = screen.getByLabelText(/user name/i);
      const addButton = screen.getByRole('button', { name: /add user/i });
      
      // Add multiple users to test pagination
      const newUsers = ['Isabella', 'Jack', 'Kate', 'Liam'];
      
      for (const userName of newUsers) {
        fireEvent.change(input, { target: { value: userName } });
        fireEvent.click(addButton);
        vi.advanceTimersByTime(750);
        await waitFor(() => expect(screen.getByText(userName)).toBeInTheDocument());
      }
      
      // Should show pagination info for 9 total users
      expect(screen.getByText(/showing 1 to 5 of 9 results/i)).toBeInTheDocument();
      expect(screen.getByText(/page 1 of 2/i)).toBeInTheDocument();
      
      // Go to page 2
      fireEvent.click(screen.getByText('Next'));
      expect(screen.getByText(/showing 6 to 9 of 9 results/i)).toBeInTheDocument();
      expect(screen.getByText(/page 2 of 2/i)).toBeInTheDocument();
    });
  });

  describe('🎯 Integration Scenarios', () => {
    it('should maintain selection when adding new users', async () => {
      render(<App />);
      const input = screen.getByLabelText(/user name/i);
      const addButton = screen.getByRole('button', { name: /add user/i });
      const selectedUsersText = screen.getByText(/selected users:/i);
      
      // Select Alice first
      const rowCheckboxes = screen.getAllByRole('checkbox', { name: /select row/i });
      fireEvent.click(rowCheckboxes[0]);
      expect(selectedUsersText.textContent).toContain('Alice');
      
      // Add new user
      fireEvent.change(input, { target: { value: 'Zoe' } });
      fireEvent.click(addButton);
      
      vi.advanceTimersByTime(750);
      
      await waitFor(() => {
        expect(screen.getByText('Zoe')).toBeInTheDocument();
      });
      
      // Alice should still be selected
      expect(selectedUsersText.textContent).toContain('Alice');
    });

    it('should handle form submission with Enter key', () => {
      render(<App />);
      const input = screen.getByLabelText(/user name/i);
      
      fireEvent.change(input, { target: { value: 'Oliver' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
      
      // Should show loading state even with Enter key
      expect(screen.getByRole('button', { name: /add user/i })).toBeDisabled();
    });

    it('should handle edge case with special characters in names', async () => {
      render(<App />);
      const input = screen.getByLabelText(/user name/i);
      const addButton = screen.getByRole('button', { name: /add user/i });
      
      // Test with special characters
      const specialName = "María José O'Connor-Smith";
      fireEvent.change(input, { target: { value: specialName } });
      fireEvent.click(addButton);
      
      vi.advanceTimersByTime(750);
      
      await waitFor(() => {
        expect(screen.getByText(specialName)).toBeInTheDocument();
      });
      
      // Email should be properly generated
      expect(screen.getByText('maría josé o\'connor-smith@example.com')).toBeInTheDocument();
    });
  });

  describe('♿ Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<App />);
      
      // Input should have proper labeling
      const input = screen.getByLabelText(/user name/i);
      expect(input).toHaveAttribute('aria-describedby');
      
      // Table should have proper structure
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
      
      // Headers should have proper scope
      const headers = screen.getAllByRole('columnheader');
      headers.forEach(header => {
        expect(header).toHaveAttribute('scope', 'col');
      });
      
      // Sortable headers should have aria-sort
      const nameHeader = screen.getByText('Name');
      expect(nameHeader.closest('th')).toHaveAttribute('aria-sort');
    });

    it('should handle keyboard navigation', () => {
      render(<App />);
      
      const input = screen.getByLabelText(/user name/i);
      const addButton = screen.getByRole('button', { name: /add user/i });
      
      // Tab navigation should work
      input.focus();
      expect(document.activeElement).toBe(input);
      
      fireEvent.keyDown(input, { key: 'Tab' });
      expect(document.activeElement).toBe(addButton);
    });
  });
});
