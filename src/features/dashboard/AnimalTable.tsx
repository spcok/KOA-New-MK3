import React, { useRef } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Bird } from 'lucide-react';

interface AnimalData {
  id: string;
  name: string;
  species: string;
  ring: string;
  todayWeight: string;
  todayFeed: string;
  lastFed: string;
  location: string;
}

const columnHelper = createColumnHelper<AnimalData>();

const columns = [
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => <span className="font-semibold text-slate-900">{info.getValue()}</span>,
  }),
  columnHelper.accessor('species', {
    header: 'Species',
    cell: (info) => <span className="text-slate-600">{info.getValue()}</span>,
  }),
  columnHelper.accessor('ring', {
    header: 'Ring/Microchip',
    cell: (info) => <span className="text-slate-500">{info.getValue() || '--'}</span>,
  }),
  columnHelper.accessor('todayWeight', {
    header: "Today's Weight",
    cell: (info) => <span className="text-slate-600">{info.getValue() || '--'}</span>,
  }),
  columnHelper.accessor('todayFeed', {
    header: "Today's Feed",
    cell: (info) => <span className="text-slate-600">{info.getValue() || '--'}</span>,
  }),
  columnHelper.accessor('lastFed', {
    header: 'Last Fed',
    cell: (info) => <span className="text-slate-500">{info.getValue() || '--'}</span>,
  }),
  columnHelper.accessor('location', {
    header: 'Location',
    cell: (info) => <span className="text-blue-600 font-medium">{info.getValue()}</span>,
  }),
];

export const AnimalTable = ({ activeCategory }: { activeCategory: string }) => {
  const data: AnimalData[] = [];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { rows } = table.getRowModel();
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64,
    overscan: 10,
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[400px]">
      <div className="w-full overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th 
                    key={header.id} 
                    className="px-6 py-3 font-medium whitespace-nowrap"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="relative divide-y divide-slate-100">
            {rows.length > 0 ? (
              <div
                ref={parentRef}
                className="overflow-y-auto"
                style={{ height: '400px' }}
              >
                <div
                  style={{
                    height: `${virtualizer.getTotalSize()}px`,
                    width: '100%',
                    position: 'relative',
                  }}
                >
                  {virtualizer.getVirtualItems().map((virtualItem) => {
                    const row = rows[virtualItem.index];
                    return (
                      <tr
                        key={row.id}
                        className="absolute w-full flex items-center bg-white hover:bg-slate-50 transition-colors text-sm"
                        style={{
                          height: `${virtualItem.size}px`,
                          transform: `translateY(${virtualItem.start}px)`,
                        }}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="px-6 py-4 flex-1 truncate">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </div>
              </div>
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-32 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                     <p className="text-sm font-medium text-slate-600">No records found.</p>
                     <p className="text-sm text-slate-500">Awaiting data engine sync...</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
