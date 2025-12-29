import { connectDB } from "@/lib/db";
import { Teacher } from "@/lib/models/Teacher";
import { revalidatePath } from "next/cache";
import LogoutButton from "@/components/LogoutButton";
import AdminTable from "@/components/AdminTable";

export const dynamic = "force-dynamic";

async function deleteTeacher(formData: FormData) {
  "use server";
  const teacherId = formData.get("teacherId");
  if (!teacherId || typeof teacherId !== "string") return;

  await connectDB();
  await Teacher.findByIdAndDelete(teacherId);
  revalidatePath("/admin");
}

async function updateStatus(formData: FormData) {
  "use server";
  const teacherId = formData.get("teacherId");
  const newStatus = formData.get("status");
  if (!teacherId || typeof teacherId !== "string" || !newStatus) return;

  await connectDB();
  await Teacher.findByIdAndUpdate(teacherId, { status: newStatus });
  revalidatePath("/admin");
}

export default async function AdminDashboard() {
  await connectDB();
  const teachers = await Teacher.find({}).sort({ createdAt: -1 }).lean();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">EduCentral Admin</h1>
            <p className="text-sm sm:text-base text-slate-600 mt-1">Teacher Management Dashboard</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <div className="bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-900 px-3 sm:px-6 py-2 sm:py-3 rounded-full font-semibold text-xs sm:text-base flex-1 sm:flex-none text-center">
              Total: {teachers.length}
            </div>
            <LogoutButton />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white p-3 sm:p-6 rounded-lg sm:rounded-xl shadow-sm border border-emerald-200">
            <div className="text-emerald-600 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">Approved</div>
            <div className="text-xl sm:text-3xl font-bold">{teachers.filter((t: any) => t.status === 'approved').length}</div>
          </div>
          <div className="bg-white p-3 sm:p-6 rounded-lg sm:rounded-xl shadow-sm border border-yellow-200">
            <div className="text-yellow-600 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">Pending</div>
            <div className="text-xl sm:text-3xl font-bold">{teachers.filter((t: any) => t.status === 'pending').length}</div>
          </div>
          <div className="bg-white p-3 sm:p-6 rounded-lg sm:rounded-xl shadow-sm border border-red-200">
            <div className="text-red-600 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">Rejected</div>
            <div className="text-xl sm:text-3xl font-bold">{teachers.filter((t: any) => t.status === 'rejected').length}</div>
          </div>
        </div>

        {/* Teachers Table */}
        {teachers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <p className="text-slate-500 text-lg">No teacher registrations yet.</p>
          </div>
        ) : (
          <AdminTable
            teachers={JSON.parse(JSON.stringify(teachers))}
            updateStatusAction={updateStatus}
            deleteTeacherAction={deleteTeacher}
          />
        )}
      </div>
    </div>
  );
}
