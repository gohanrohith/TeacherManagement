'use client';

import { Select } from '@/components/ui/select';

interface StatusDropdownProps {
  teacherId: string;
  currentStatus: string;
  updateStatusAction: (formData: FormData) => Promise<void>;
}

export default function StatusDropdown({ teacherId, currentStatus, updateStatusAction }: StatusDropdownProps) {
  return (
    <form action={updateStatusAction}>
      <input type="hidden" name="teacherId" value={teacherId} />
      <Select
        name="status"
        defaultValue={currentStatus}
        onChange={(e) => {
          const form = e.target.closest('form');
          if (form) form.requestSubmit();
        }}
        className={`px-3 sm:px-4 py-2 rounded-lg border-2 font-semibold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          currentStatus === 'approved'
            ? 'border-emerald-500 text-emerald-700 bg-emerald-50'
            : currentStatus === 'rejected'
            ? 'border-red-500 text-red-700 bg-red-50'
            : 'border-yellow-500 text-yellow-700 bg-yellow-50'
        }`}
      >
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </Select>
    </form>
  );
}
