import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';

interface AnimalData {
  id: string;
  name: string;
  species: string;
  location: string;
  currentWeight: string;
  targetWeight: string;
}

const columnHelper = createColumnHelper<AnimalData>();

const columns = [
  columnHelper.accessor('name', {
    header: 'Animal',
    cell: (info) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-200 rounded-full flex-shrink-0" />
        <span className="font-bold text-slate-900">{info.getValue()}</span>
      </div>
    ),
  }),
  columnHelper.accessor('species', {
    header: 'Species',
  }),
  columnHelper.accessor('location', {
    header: 'Location',
  }),
  columnHelper.accessor('currentWeight', {
    header: 'Weight',
    cell: (info) => (
      <div className="flex flex-col">
        <span className="text-slate-900 font-medium">{info.getValue() || '--'}</span>
        <span className="text-xs text-slate-400">Target: {info.row.original.targetWeight || '--'}</span>
      </div>
    ),
  }),
  columnHelper.display({
    id: 'feed',
    header: 'Feed',
    cell: () => (
      <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
    ),
  }),
];

export const AnimalTable = () => {
  const table = useReactTable({
    data: [], // Blank Slate
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 border-bottom border-slate-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          <tr>
            <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400">
              <div className="flex flex-col items-center gap-2">
                <p className="text-lg font-medium">No animals in this category</p>
                <p className="text-sm italic text-slate-300">Awaiting engine connection...</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};