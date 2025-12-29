'use client';

import { useState } from 'react';
import { Eye, Filter, X, Pencil } from 'lucide-react';
import Image from 'next/image';

const BRANCHES = ['All Branches', 'Greenwood High School - Erragattugutta', 'Greenwood High School - Hunter Road', 'Abhyaas The Global School - Bhimavaram', 'Greenwood High School - Mancherial', 'Greenwood High School - Gopalpur', 'Greenwood High School - Naimangar'];
const CLASSES = ['All Classes', 'Nursery', 'LKG', 'UKG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];
const SUBJECTS = ['All Subjects', 'English', 'Mathematics', 'Science', 'Social Studies', 'Hindi', 'Telugu', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Commerce', 'Accountancy', 'Economics', 'Physical Education', 'Arts', 'Music'];

interface Teacher {
  _id: any;
  full_name: string;
  email: string;
  phone: string;
  current_branch: string;
  current_class?: string;
  current_subject?: string;
  status: string;
  profilePic?: string;
  aadhar_number: string;
  date_of_birth: string;
  gender: string;
  blood_group?: string;
  emergency_contact_name?: string;
  emergency_contact_relation?: string;
  emergency_contact_mobile?: string;
  street: string;
  pincode: string;
  state: string;
  tenth: any;
  twelfth: any;
  ug: any;
  pg?: any[];
  bed?: any;
  med?: any;
  previous_school_name?: string;
  previous_classes_taught?: string[];
  previous_subjects_taught?: string[];
  current_school: string;
  bank_name: string;
  account_number: string;
  ifsc_code: string;
  pan_number: string;
  pf_number?: string;
  esi_number?: string;
  createdAt: string;
}

interface AdminTableProps {
  teachers: Teacher[];
  updateStatusAction: (formData: FormData) => Promise<void>;
  deleteTeacherAction: (formData: FormData) => Promise<void>;
}

export default function AdminTable({ teachers, updateStatusAction, deleteTeacherAction }: AdminTableProps) {
  const [selectedBranch, setSelectedBranch] = useState('All Branches');
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [viewingTeacher, setViewingTeacher] = useState<Teacher | null>(null);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  // Filter teachers based on selected filters
  const filteredTeachers = teachers.filter((teacher) => {
    const branchMatch = selectedBranch === 'All Branches' || teacher.current_branch === selectedBranch;
    const classMatch = selectedClass === 'All Classes' || teacher.current_class === selectedClass;
    const subjectMatch = selectedSubject === 'All Subjects' || teacher.current_subject === selectedSubject;
    return branchMatch && classMatch && subjectMatch;
  });

  const clearFilters = () => {
    setSelectedBranch('All Branches');
    setSelectedClass('All Classes');
    setSelectedSubject('All Subjects');
  };

  return (
    <>
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-slate-900">Filter Teachers</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Branch</label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full h-10 px-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            >
              {BRANCHES.map((branch) => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full h-10 px-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            >
              {CLASSES.map((cls) => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full h-10 px-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            >
              {SUBJECTS.map((subject) => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full h-10 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </button>
          </div>
        </div>

        <div className="mt-4 text-sm text-slate-600">
          Showing <span className="font-bold text-emerald-600">{filteredTeachers.length}</span> of <span className="font-bold">{teachers.length}</span> teachers
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Teacher</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Branch</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Class/Subject</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredTeachers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                    No teachers found matching the selected filters.
                  </td>
                </tr>
              ) : (
                filteredTeachers.map((teacher) => (
                  <tr key={teacher._id.toString()} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                          {teacher.profilePic ? (
                            <Image src={teacher.profilePic} alt={teacher.full_name} width={40} height={40} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-sm">
                              {teacher.full_name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate">{teacher.full_name}</p>
                          <p className="text-xs text-slate-500">{new Date(teacher.createdAt).toLocaleDateString('en-IN')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-slate-900">{teacher.email}</p>
                      <p className="text-xs text-slate-500">{teacher.phone}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-slate-900 max-w-xs truncate">{teacher.current_branch}</p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        {teacher.current_class && (
                          <span className="inline-block px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-semibold">
                            {teacher.current_class}
                          </span>
                        )}
                        {teacher.current_subject && (
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                            {teacher.current_subject}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <form action={updateStatusAction}>
                        <input type="hidden" name="teacherId" value={teacher._id.toString()} />
                        <select
                          name="status"
                          defaultValue={teacher.status}
                          onChange={(e) => {
                            const form = e.target.closest('form');
                            if (form) form.requestSubmit();
                          }}
                          className={`px-3 py-1.5 rounded-lg border-2 font-semibold text-xs focus:outline-none focus:ring-2 ${
                            teacher.status === 'approved'
                              ? 'border-emerald-500 text-emerald-700 bg-emerald-50'
                              : teacher.status === 'rejected'
                              ? 'border-red-500 text-red-700 bg-red-50'
                              : 'border-yellow-500 text-yellow-700 bg-yellow-50'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </form>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setViewingTeacher(teacher)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </button>
                        <button
                          onClick={() => setEditingTeacher(teacher)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs flex items-center gap-1 transition-colors"
                        >
                          <Pencil className="w-3 h-3" />
                          Edit
                        </button>
                        <form action={deleteTeacherAction}>
                          <input type="hidden" name="teacherId" value={teacher._id.toString()} />
                          <button
                            type="submit"
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-xs transition-colors"
                            onClick={(e) => {
                              if (!confirm('Are you sure you want to delete this teacher?')) {
                                e.preventDefault();
                              }
                            }}
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {viewingTeacher && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-emerald-50 to-blue-50 p-6 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden">
                  {viewingTeacher.profilePic ? (
                    <Image src={viewingTeacher.profilePic} alt={viewingTeacher.full_name} width={64} height={64} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-2xl">
                      {viewingTeacher.full_name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{viewingTeacher.full_name}</h2>
                  <p className="text-slate-600">{viewingTeacher.email}</p>
                </div>
              </div>
              <button
                onClick={() => setViewingTeacher(null)}
                className="p-2 hover:bg-white rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Personal Info */}
                <div className="space-y-3">
                  <h3 className="font-bold text-slate-900 text-lg border-b-2 border-emerald-200 pb-2">Personal Information</h3>
                  <DetailRow label="Aadhar" value={viewingTeacher.aadhar_number} mono />
                  <DetailRow label="Date of Birth" value={viewingTeacher.date_of_birth} />
                  <DetailRow label="Gender" value={viewingTeacher.gender} />
                  {viewingTeacher.blood_group && <DetailRow label="Blood Group" value={viewingTeacher.blood_group} />}
                  <DetailRow label="Phone" value={viewingTeacher.phone} />
                  {viewingTeacher.emergency_contact_name && (
                    <>
                      <div className="pt-2 border-t border-emerald-100">
                        <p className="text-xs text-slate-500 font-bold mb-2">Emergency Contact</p>
                        <DetailRow label="Name" value={viewingTeacher.emergency_contact_name} />
                        {viewingTeacher.emergency_contact_relation && <DetailRow label="Relation" value={viewingTeacher.emergency_contact_relation} />}
                        {viewingTeacher.emergency_contact_mobile && <DetailRow label="Mobile" value={viewingTeacher.emergency_contact_mobile} mono />}
                      </div>
                    </>
                  )}
                  <DetailRow label="Address" value={`${viewingTeacher.street}, ${viewingTeacher.state} - ${viewingTeacher.pincode}`} />
                </div>

                {/* Education */}
                <div className="space-y-3">
                  <h3 className="font-bold text-slate-900 text-lg border-b-2 border-blue-200 pb-2">Education</h3>
                  <div>
                    <p className="text-xs text-slate-500">10th Standard</p>
                    <p className="font-semibold text-slate-900">{viewingTeacher.tenth.board} ({viewingTeacher.tenth.year}) - {viewingTeacher.tenth.percentage}%</p>
                    {viewingTeacher.tenth.certificate && (
                      <a href={viewingTeacher.tenth.certificate} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">View Certificate</a>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">12th Standard</p>
                    <p className="font-semibold text-slate-900">{viewingTeacher.twelfth.board} ({viewingTeacher.twelfth.year}) - {viewingTeacher.twelfth.percentage}%</p>
                    {viewingTeacher.twelfth.certificate && (
                      <a href={viewingTeacher.twelfth.certificate} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">View Certificate</a>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Undergraduate</p>
                    <p className="font-semibold text-slate-900">{viewingTeacher.ug.degree} - {viewingTeacher.ug.university}</p>
                    <p className="text-sm text-slate-600">({viewingTeacher.ug.year}) - {viewingTeacher.ug.percentage}%</p>
                    {viewingTeacher.ug.certificate && (
                      <a href={viewingTeacher.ug.certificate} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">View Certificate</a>
                    )}
                  </div>
                  {viewingTeacher.pg && viewingTeacher.pg.length > 0 && viewingTeacher.pg.map((pg: any, idx: number) => (
                    <div key={idx}>
                      <p className="text-xs text-slate-500">Postgraduate {idx + 1}</p>
                      <p className="font-semibold text-slate-900">{pg.degree} - {pg.university}</p>
                      <p className="text-sm text-slate-600">({pg.year}) - {pg.percentage}%</p>
                      {pg.certificate && (
                        <a href={pg.certificate} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">View Certificate</a>
                      )}
                    </div>
                  ))}
                </div>

                {/* Professional */}
                <div className="space-y-3">
                  <h3 className="font-bold text-slate-900 text-lg border-b-2 border-purple-200 pb-2">Professional</h3>
                  {viewingTeacher.bed && viewingTeacher.bed.board && (
                    <div>
                      <p className="text-xs text-slate-500">B.Ed</p>
                      <p className="font-semibold text-slate-900">{viewingTeacher.bed.board} ({viewingTeacher.bed.year})</p>
                      <p className="text-sm text-slate-600">{viewingTeacher.bed.percentage}%</p>
                      {viewingTeacher.bed.certificate && (
                        <a href={viewingTeacher.bed.certificate} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">View Certificate</a>
                      )}
                    </div>
                  )}
                  {viewingTeacher.med && viewingTeacher.med.board && (
                    <div>
                      <p className="text-xs text-slate-500">M.Ed</p>
                      <p className="font-semibold text-slate-900">{viewingTeacher.med.board} ({viewingTeacher.med.year})</p>
                      <p className="text-sm text-slate-600">{viewingTeacher.med.percentage}%</p>
                      {viewingTeacher.med.certificate && (
                        <a href={viewingTeacher.med.certificate} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">View Certificate</a>
                      )}
                    </div>
                  )}
                </div>

                {/* Previous Employment */}
                {viewingTeacher.previous_school_name && (
                  <div className="space-y-3">
                    <h3 className="font-bold text-slate-900 text-lg border-b-2 border-orange-200 pb-2">Previous Employment</h3>
                    <DetailRow label="School" value={viewingTeacher.previous_school_name} />
                    {viewingTeacher.previous_classes_taught && viewingTeacher.previous_classes_taught.length > 0 && (
                      <div>
                        <p className="text-xs text-slate-500">Classes Taught</p>
                        <p className="text-sm font-medium text-slate-900">{viewingTeacher.previous_classes_taught.join(', ')}</p>
                      </div>
                    )}
                    {viewingTeacher.previous_subjects_taught && viewingTeacher.previous_subjects_taught.length > 0 && (
                      <div>
                        <p className="text-xs text-slate-500">Subjects Taught</p>
                        <p className="text-sm font-medium text-slate-900">{viewingTeacher.previous_subjects_taught.join(', ')}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Current School */}
                <div className="space-y-3">
                  <h3 className="font-bold text-slate-900 text-lg border-b-2 border-emerald-200 pb-2">Current School</h3>
                  <DetailRow label="Branch" value={viewingTeacher.current_branch} />
                  {viewingTeacher.current_class && <DetailRow label="Class" value={viewingTeacher.current_class} />}
                  {viewingTeacher.current_subject && <DetailRow label="Subject" value={viewingTeacher.current_subject} />}
                </div>

                {/* Bank Details */}
                <div className="space-y-3">
                  <h3 className="font-bold text-slate-900 text-lg border-b-2 border-blue-200 pb-2">Bank & Official Details</h3>
                  <DetailRow label="Bank" value={viewingTeacher.bank_name} />
                  <DetailRow label="Account No." value={viewingTeacher.account_number} mono />
                  <DetailRow label="IFSC Code" value={viewingTeacher.ifsc_code} mono />
                  <DetailRow label="PAN" value={viewingTeacher.pan_number} mono />
                  {viewingTeacher.pf_number && <DetailRow label="PF Number" value={viewingTeacher.pf_number} mono />}
                  {viewingTeacher.esi_number && <DetailRow label="ESI Number" value={viewingTeacher.esi_number} mono />}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-slate-50 p-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setViewingTeacher(null)}
                className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingTeacher && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-2xl font-bold">Edit Teacher Details</h2>
                <p className="text-blue-100 text-sm">Update information for {editingTeacher.full_name}</p>
              </div>
              <button
                onClick={() => setEditingTeacher(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Edit Form */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const payload = Object.fromEntries(formData.entries());

                try {
                  const res = await fetch(`/api/teachers/${editingTeacher._id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                  });

                  if (res.ok) {
                    alert('Teacher updated successfully!');
                    setEditingTeacher(null);
                    window.location.reload();
                  } else {
                    const error = await res.json();
                    alert(error.error || 'Failed to update teacher');
                  }
                } catch (error) {
                  alert('Failed to update teacher');
                }
              }}
              className="p-6 space-y-6"
            >
              {/* Personal Information */}
              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-bold text-lg text-slate-900 mb-4">Personal Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="full_name"
                      defaultValue={editingTeacher.full_name}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Email *</label>
                    <input
                      type="email"
                      name="email"
                      defaultValue={editingTeacher.email}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Phone *</label>
                    <input
                      type="text"
                      name="phone"
                      defaultValue={editingTeacher.phone}
                      required
                      maxLength={10}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Date of Birth *</label>
                    <input
                      type="date"
                      name="date_of_birth"
                      defaultValue={editingTeacher.date_of_birth}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Gender *</label>
                    <select
                      name="gender"
                      defaultValue={editingTeacher.gender}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Blood Group</label>
                    <select
                      name="blood_group"
                      defaultValue={editingTeacher.blood_group || ''}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-bold text-lg text-slate-900 mb-4">Emergency Contact</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Contact Name</label>
                    <input
                      type="text"
                      name="emergency_contact_name"
                      defaultValue={editingTeacher.emergency_contact_name || ''}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Relationship</label>
                    <select
                      name="emergency_contact_relation"
                      defaultValue={editingTeacher.emergency_contact_relation || ''}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Relation</option>
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Brother">Brother</option>
                      <option value="Sister">Sister</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Contact Mobile</label>
                    <input
                      type="text"
                      name="emergency_contact_mobile"
                      defaultValue={editingTeacher.emergency_contact_mobile || ''}
                      maxLength={10}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-bold text-lg text-slate-900 mb-4">Address</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Street *</label>
                    <input
                      type="text"
                      name="street"
                      defaultValue={editingTeacher.street}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      defaultValue={editingTeacher.pincode}
                      required
                      maxLength={6}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">State *</label>
                    <input
                      type="text"
                      name="state"
                      defaultValue={editingTeacher.state}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Current School Details */}
              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-bold text-lg text-slate-900 mb-4">Current School Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Branch *</label>
                    <select
                      name="current_branch"
                      defaultValue={editingTeacher.current_branch}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {BRANCHES.filter(b => b !== 'All Branches').map(branch => (
                        <option key={branch} value={branch}>{branch}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Class</label>
                    <select
                      name="current_class"
                      defaultValue={editingTeacher.current_class || ''}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Class</option>
                      {CLASSES.filter(c => c !== 'All Classes').map(cls => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Subject</label>
                    <select
                      name="current_subject"
                      defaultValue={editingTeacher.current_subject || ''}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Subject</option>
                      {SUBJECTS.filter(s => s !== 'All Subjects').map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-bold text-lg text-slate-900 mb-4">Bank Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Bank Name *</label>
                    <input
                      type="text"
                      name="bank_name"
                      defaultValue={editingTeacher.bank_name}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Account Number *</label>
                    <input
                      type="text"
                      name="account_number"
                      defaultValue={editingTeacher.account_number}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">IFSC Code *</label>
                    <input
                      type="text"
                      name="ifsc_code"
                      defaultValue={editingTeacher.ifsc_code}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">PAN Number *</label>
                    <input
                      type="text"
                      name="pan_number"
                      defaultValue={editingTeacher.pan_number}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">PF Number</label>
                    <input
                      type="text"
                      name="pf_number"
                      defaultValue={editingTeacher.pf_number || ''}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">ESI Number</label>
                    <input
                      type="text"
                      name="esi_number"
                      defaultValue={editingTeacher.esi_number || ''}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-slate-50 p-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingTeacher(null)}
                  className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function DetailRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`text-sm font-semibold text-slate-900 ${mono ? 'font-mono' : ''}`}>{value}</p>
    </div>
  );
}
