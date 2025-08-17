// src/components/DataTable/DataTable.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { DataTable } from './DataTable';
import type { Column } from './DataTable';

type User = {
  id: number;
  name: string;
  email: string;
  age: number;
  active: boolean;
};

const columns: Column<User>[] = [
  { key: 'name', title: 'Name', dataIndex: 'name', sortable: true },
  { key: 'email', title: 'Email', dataIndex: 'email', sortable: true },
  { key: 'age', title: 'Age', dataIndex: 'age', sortable: true },
  { key: 'active', title: 'Active', dataIndex: 'active', render: (val) => val ? '✔️' : '❌' }
];

const demoData: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com', age: 28, active: true },
  { id: 2, name: 'Bob', email: 'bob@example.com', age: 32, active: false },
  { id: 3, name: 'Carol', email: 'carol@example.com', age: 24, active: true },
  { id: 4, name: 'Dave', email: 'dave@example.com', age: 36, active: false },
  { id: 5, name: 'Erin', email: 'erin@example.com', age: 22, active: true },
];

const meta: Meta<typeof DataTable<User>> = {
  title: 'Components/DataTable',
  component: DataTable,
  parameters: {
    docs: {
      description: {
        component: 'The DataTable component displays tabular data with column sorting, row selection, loading, and empty states.',
      },
    },
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DataTable<User>>;

export const Default: Story = {
  render: (args) => (
    <div className="max-w-2xl">
      <DataTable<User>
        {...args}
        data={demoData}
        columns={columns}
      />
    </div>
  ),
  args: {},
};

export const Sortable: Story = {
  render: () => (
    <div className="max-w-2xl">
      <DataTable<User>
        data={demoData}
        columns={columns.map(col => ({ ...col, sortable: true }))}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: { story: 'Columns are sortable. Click column headers to sort ascending/descending/none.' },
    },
  },
};

export const RowSelection: Story = {
  render: () => {
    const [selected, setSelected] = useState<User[]>([]);
    return (
      <div className="max-w-2xl">
        <DataTable<User>
          data={demoData}
          columns={columns}
          selectable
          onRowSelect={setSelected}
        />
        <div className="mt-4 text-sm text-neutral-700 dark:text-neutral-300">
          <strong>Selected rows:</strong> {selected.map((u) => u.name).join(', ') || <span>–</span>}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: { story: 'Rows can be selected (multi). Selected rows are shown below the table.' },
    },
  },
};

export const Loading: Story = {
  render: () => (
    <div className="max-w-2xl">
      <DataTable<User>
        data={demoData}
        columns={columns}
        loading
      />
    </div>
  ),
  parameters: {
    docs: {
      description: { story: 'Shows loading overlay.' },
    },
  },
};

export const EmptyState: Story = {
  render: () => (
    <div className="max-w-2xl">
      <DataTable<User>
        data={[]}
        columns={columns}
        emptyText="No users to show"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: { story: 'Shows a nice empty state with illustration and message.' },
    },
  },
};

export const AllFeatures: Story = {
  render: () => {
    const [selected, setSelected] = useState<User[]>([]);
    return (
      <div className="max-w-2xl">
        <DataTable<User>
          data={demoData}
          columns={columns.map(col => ({ ...col, sortable: true }))}
          selectable
          onRowSelect={setSelected}
          loading={false}
          pagination={true}
          pageSize={3}
        />
        <div className="mt-4 text-sm text-neutral-700 dark:text-neutral-300">
          <strong>Selected users:</strong> {selected.length ? selected.map((u) => u.name).join(', ') : '–'}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: { story: 'Combination: sorting, selection, pagination, example of state usage.' },
    },
  },
};

export const CustomRenderCell: Story = {
  render: () => {
    // Custom column with avatar rendering
    const userColumns: Column<User>[] = [
      {
        key: 'avatar',
        title: 'Avatar',
        dataIndex: 'name',
        render: (val) => (
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
            {String(val).charAt(0).toUpperCase()}
          </div>
        ),
      },
      ...columns,
    ];
    return (
      <div className="max-w-2xl">
        <DataTable<User>
          data={demoData}
          columns={userColumns}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: { story: 'Custom cell rendering example (user avatar column).' },
    },
  },
};

export const Responsive: Story = {
  render: () => (
    <div style={{ width: 350 }}>
      <DataTable<User>
        data={demoData}
        columns={columns}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: { story: 'Table is horizontally scrollable on small screens.' },
    },
  },
};

export const WithPagination: Story = {
  render: () => (
    <div className="max-w-2xl">
      <DataTable<User>
        data={[...Array(25)].map((_, i) => ({
          id: i + 1,
          name: `User${i + 1}`,
          email: `user${i + 1}@example.com`,
          age: 20 + (i % 10),
          active: i % 2 === 0,
        }))}
        columns={columns}
        pagination
        pageSize={5}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: { story: 'Pagination enabled, showing five rows per page.' },
    },
  },
};
