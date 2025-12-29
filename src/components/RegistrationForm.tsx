'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CldUploadWidget } from 'next-cloudinary';
import { 
  CheckCircle, Upload, Plus, X, ArrowLeft, 
  User, MapPin, GraduationCap, Briefcase, 
  Building2, FileText, ChevronRight 
} from 'lucide-react';
import { cn } from "@/lib/utils";

const CLASSES = ['Nursery', 'LKG', 'UKG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];
const SUBJECTS = ['English', 'Mathematics', 'Science', 'Social Studies', 'Hindi', 'Telugu', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Commerce', 'Accountancy', 'Economics', 'Physical Education', 'Arts', 'Music'];
const BRANCHES = ['Greenwood High School - Erragattugutta', 'Greenwood High School - Hunter Road', 'Abhyaas The Global School - Bhimavaram', 'Greenwood High School - Mancherial', 'Greenwood High School - Gopalpur', 'Greenwood High School - Naimangar'];

const teacherSchema = z.object({
  aadhar_number: z.string().length(12, 'Aadhar must be 12 digits').regex(/^\d+$/, 'Only numbers'),
  full_name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().length(10, 'Phone must be 10 digits').regex(/^\d+$/, 'Only numbers'),
  date_of_birth: z.string().min(1, 'DOB required'),
  gender: z.string().min(1, 'Gender required'),
  street: z.string().min(5, 'Street address required'),
  pincode: z.string().length(6, 'Pincode must be 6 digits').regex(/^\d+$/, 'Only numbers'),
  state: z.string().min(2, 'State required'),
  tenth_board: z.string().min(1, '10th board required'),
  tenth_year: z.string().min(4, 'Year required'),
  tenth_percentage: z.string().min(1, 'Percentage required'),
  twelfth_board: z.string().min(1, '12th board required'),
  twelfth_year: z.string().min(4, 'Year required'),
  twelfth_percentage: z.string().min(1, 'Percentage required'),
  ug_degree: z.string().min(1, 'UG degree required'),
  ug_university: z.string().min(1, 'University required'),
  ug_year: z.string().min(4, 'Year required'),
  ug_percentage: z.string().min(1, 'Percentage required'),
  current_branch: z.string().min(1, 'Branch required'),
  bank_name: z.string().min(1, 'Bank name required'),
  account_number: z.string().min(9, 'Account number required'),
  ifsc_code: z.string().min(11, 'IFSC code required'),
  pan_number: z.string().length(10, 'PAN must be 10 characters'),
});

type FormData = z.infer<typeof teacherSchema>;

interface PGQualification {
  degree: string; university: string; year: string; percentage: string; certificate: string;
}

export default function RegistrationForm({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [profilePic, setProfilePic] = useState('');
  const [tenthCert, setTenthCert] = useState('');
  const [twelfthCert, setTwelfthCert] = useState('');
  const [ugCert, setUgCert] = useState('');
  const [bedCert, setBedCert] = useState('');
  const [medCert, setMedCert] = useState('');
  const [pgQualifications, setPgQualifications] = useState<PGQualification[]>([]);
  const [bedData, setBedData] = useState({ board: '', year: '', percentage: '' });
  const [medData, setMedData] = useState({ board: '', year: '', percentage: '' });
  const [previousSchool, setPreviousSchool] = useState('');
  const [previousClasses, setPreviousClasses] = useState<string[]>([]);
  const [previousSubjects, setPreviousSubjects] = useState<string[]>([]);
  const [currentClass, setCurrentClass] = useState('');
  const [currentSubject, setCurrentSubject] = useState('');
  const [pfNumber, setPfNumber] = useState('');
  const [esiNumber, setEsiNumber] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactRelation, setEmergencyContactRelation] = useState('');
  const [emergencyContactMobile, setEmergencyContactMobile] = useState('');
  const [aadharValue, setAadharValue] = useState('');
  const [aadharChecking, setAadharChecking] = useState(false);
  const [aadharExists, setAadharExists] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    resolver: zodResolver(teacherSchema),
  });

  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const totalSteps = 7;

  const stepsInfo = [
    { id: 1, label: 'Profile', icon: User },
    { id: 2, label: 'Address', icon: MapPin },
    { id: 3, label: 'Education', icon: GraduationCap },
    { id: 4, label: 'Higher Ed', icon: GraduationCap },
    { id: 5, label: 'Experience', icon: Briefcase },
    { id: 6, label: 'Organization', icon: Building2 },
    { id: 7, label: 'Review', icon: FileText },
  ];

  const addPGQualification = () => setPgQualifications([...pgQualifications, { degree: '', university: '', year: '', percentage: '', certificate: '' }]);
  const removePGQualification = (index: number) => setPgQualifications(pgQualifications.filter((_, i) => i !== index));
  const updatePGQualification = (index: number, field: keyof PGQualification, value: string) => {
    const updated = [...pgQualifications];
    updated[index][field] = value;
    setPgQualifications(updated);
  };

  // Real-time Aadhar validation
  useEffect(() => {
    const checkAadhar = async () => {
      if (aadharValue.length === 12 && /^\d{12}$/.test(aadharValue)) {
        setAadharChecking(true);
        try {
          const res = await fetch('/api/teachers/check-aadhar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ aadhar_number: aadharValue }),
          });
          const data = await res.json();
          setAadharExists(data.exists);
        } catch (error) {
          console.error('Aadhar check error:', error);
        } finally {
          setAadharChecking(false);
        }
      } else {
        setAadharExists(false);
      }
    };

    const timeoutId = setTimeout(checkAadhar, 500);
    return () => clearTimeout(timeoutId);
  }, [aadharValue]);

  const onSubmit = async (data: FormData) => {
    // Prevent submission if Aadhar already exists
    if (aadharExists) {
      alert('This Aadhar number is already registered. Please use a different Aadhar number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        aadhar_number: data.aadhar_number,
        profilePic,
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        date_of_birth: data.date_of_birth,
        gender: data.gender,
        blood_group: bloodGroup,
        emergency_contact_name: emergencyContactName,
        emergency_contact_relation: emergencyContactRelation,
        emergency_contact_mobile: emergencyContactMobile,
        street: data.street,
        pincode: data.pincode,
        state: data.state,
        tenth: { board: data.tenth_board, year: data.tenth_year, percentage: data.tenth_percentage, certificate: tenthCert },
        twelfth: { board: data.twelfth_board, year: data.twelfth_year, percentage: data.twelfth_percentage, certificate: twelfthCert },
        ug: { degree: data.ug_degree, university: data.ug_university, year: data.ug_year, percentage: data.ug_percentage, certificate: ugCert },
        pg: pgQualifications,
        bed: { ...bedData, certificate: bedCert },
        med: { ...medData, certificate: medCert },
        previous_school_name: previousSchool,
        previous_classes_taught: previousClasses,
        previous_subjects_taught: previousSubjects,
        current_school: data.current_branch.split(' - ')[0],
        current_branch: data.current_branch,
        current_class: currentClass,
        current_subject: currentSubject,
        bank_name: data.bank_name,
        account_number: data.account_number,
        ifsc_code: data.ifsc_code,
        pan_number: data.pan_number,
        pf_number: pfNumber,
        esi_number: esiNumber,
      };

      const res = await fetch('/api/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const result = await res.json();
        alert(result.error || 'Registration failed');
        setIsSubmitting(false);
        return;
      }
      setIsSuccess(true);
    } catch (error) {
      alert('Registration failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full border-none shadow-2xl animate-in zoom-in duration-300">
          <CardContent className="pt-10 pb-10 text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">Registration Complete</h2>
              <p className="text-slate-500 px-4">Your application has been securely submitted. Our administrative team will process it shortly.</p>
            </div>
            <Button onClick={onBack} size="lg" className="w-full bg-emerald-600 hover:bg-emerald-700">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-emerald-100">
      <div className="max-w-5xl mx-auto px-4 py-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="space-y-2">
            <Button variant="ghost" onClick={onBack} className="pl-0 text-slate-500 hover:text-emerald-600 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
            </Button>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Teacher Registration
            </h1>
            <p className="text-slate-500">Official onboarding portal for Greenwood Educational Institutions.</p>
          </div>
          
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm">
            <span className="text-sm font-medium text-slate-600">Progress</span>
            <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${(step / totalSteps) * 100}%` }} />
            </div>
            <span className="text-xs font-bold text-emerald-600">{Math.round((step / totalSteps) * 100)}%</span>
          </div>
        </div>

        {/* Desktop Step Indicator */}
        <nav className="hidden lg:block mb-10">
          <ol className="flex items-center w-full">
            {stepsInfo.map((s, idx) => {
              const Icon = s.icon;
              const isCompleted = step > s.id;
              const isActive = step === s.id;
              return (
                <li key={s.id} className={cn("flex items-center relative", idx !== stepsInfo.length - 1 ? "w-full" : "")}>
                  <div className="flex flex-col items-center group cursor-default">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 z-10",
                      isCompleted ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" : 
                      isActive ? "bg-white border-2 border-emerald-600 text-emerald-600 scale-110 shadow-lg" : 
                      "bg-white border border-slate-200 text-slate-400"
                    )}>
                      {isCompleted ? <CheckCircle className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <span className={cn("absolute -bottom-6 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap", isActive ? "text-emerald-600" : "text-slate-400")}>
                      {s.label}
                    </span>
                  </div>
                  {idx !== stepsInfo.length - 1 && (
                    <div className={cn("h-[2px] w-full mx-2 rounded", isCompleted ? "bg-emerald-600" : "bg-slate-200")} />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Mobile Progress Bar */}
        <div className="lg:hidden mb-6 flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
             <span className="text-sm font-bold text-emerald-600">Step {step}: {stepsInfo[step-1].label}</span>
             <span className="text-xs text-slate-400 font-medium">{step}/{totalSteps}</span>
        </div>

        <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-6 px-8">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700">
                  {(() => { const Icon = stepsInfo[step-1].icon; return <Icon className="w-5 h-5" />; })()}
               </div>
               <div>
                  <CardTitle className="text-xl text-slate-800">{stepsInfo[step-1].label} Details</CardTitle>
                  <CardDescription>Fill in the required information to proceed.</CardDescription>
               </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

              {/* STEP 1: Profile & Personal */}
              {step === 1 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                  <div className="flex flex-col md:flex-row items-center gap-8 pb-4 border-b border-slate-50">
                    <div className="relative group">
                      <div className={cn(
                        "w-36 h-36 rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-all",
                        profilePic ? "border-emerald-500" : "border-slate-300 hover:border-emerald-400"
                      )}>
                        {profilePic ? (
                          <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center p-4">
                            <Upload className="w-8 h-8 mx-auto text-slate-300 group-hover:text-emerald-500 transition-colors" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-2 block">Upload Photo</span>
                          </div>
                        )}
                      </div>
                      <CldUploadWidget uploadPreset={uploadPreset} onSuccess={(result: any) => setProfilePic(result.info.secure_url)}>
                        {({ open }) => (
                          <button type="button" onClick={() => open()} className="absolute -bottom-2 -right-2 bg-white shadow-lg border border-slate-100 p-2 rounded-xl text-emerald-600 hover:text-emerald-700 transition-transform hover:scale-110">
                            <Plus className="w-5 h-5" />
                          </button>
                        )}
                      </CldUploadWidget>
                      {profilePic && (
                         <button type="button" onClick={() => setProfilePic('')} className="absolute -top-2 -right-2 bg-red-50 text-red-600 p-1.5 rounded-lg hover:bg-red-100">
                            <X className="w-4 h-4" />
                         </button>
                      )}
                    </div>
                    <div className="flex-1 space-y-4 w-full">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                             <Label className="text-slate-700">Aadhar Number <span className="text-red-400">*</span></Label>
                             <div className="relative">
                               <Input
                                 {...register('aadhar_number')}
                                 value={aadharValue}
                                 onChange={(e) => {
                                   const value = e.target.value.replace(/\D/g, '');
                                   setAadharValue(value);
                                   setValue('aadhar_number', value);
                                 }}
                                 placeholder="12-digit number"
                                 className={cn(
                                   "bg-slate-50 border-slate-200 focus:bg-white transition-all pr-10",
                                   aadharExists && "border-red-500 focus:border-red-500"
                                 )}
                                 maxLength={12}
                               />
                               {aadharChecking && (
                                 <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                   <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                                 </div>
                               )}
                               {!aadharChecking && aadharValue.length === 12 && aadharExists && (
                                 <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                   <X className="w-5 h-5 text-red-500" />
                                 </div>
                               )}
                               {!aadharChecking && aadharValue.length === 12 && !aadharExists && (
                                 <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                   <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                   </svg>
                                 </div>
                               )}
                             </div>
                             {aadharExists && (
                               <p className="text-red-500 text-xs font-semibold flex items-center gap-1">
                                 <X className="w-4 h-4" />
                                 This Aadhar number is already registered
                               </p>
                             )}
                             {errors.aadhar_number && <p className="text-red-500 text-[10px] font-bold uppercase italic">{errors.aadhar_number.message}</p>}
                          </div>
                          <div className="space-y-2">
                             <Label className="text-slate-700">Full Name <span className="text-red-400">*</span></Label>
                             <Input {...register('full_name')} placeholder="Legal name as per Aadhar" className="bg-slate-50 border-slate-200" />
                             {errors.full_name && <p className="text-red-500 text-[10px] font-bold uppercase italic">{errors.full_name.message}</p>}
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-slate-700">Email Address <span className="text-red-400">*</span></Label>
                      <Input {...register('email')} type="email" placeholder="example@email.com" className="bg-slate-50 border-slate-200" />
                      {errors.email && <p className="text-red-500 text-xs italic">{errors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700">Phone Number <span className="text-red-400">*</span></Label>
                      <Input {...register('phone')} placeholder="Primary contact" maxLength={10} className="bg-slate-50 border-slate-200" />
                      {errors.phone && <p className="text-red-500 text-xs italic">{errors.phone.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700">Date of Birth <span className="text-red-400">*</span></Label>
                      <Input {...register('date_of_birth')} type="date" className="bg-slate-50 border-slate-200 block w-full" />
                      {errors.date_of_birth && <p className="text-red-500 text-xs italic">{errors.date_of_birth.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700">Gender <span className="text-red-400">*</span></Label>
                      <Select {...register('gender')}>
                        <option value="">Select Option</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </Select>
                      {errors.gender && <p className="text-red-500 text-xs italic">{errors.gender.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700">Blood Group</Label>
                      <Select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} className="bg-slate-50 border-slate-200">
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </Select>
                    </div>
                  </div>

                  {/* Emergency Contact Section */}
                  <div className="border-t border-slate-200 pt-6 mt-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Emergency Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label className="text-slate-700">Contact Person Name</Label>
                        <Input value={emergencyContactName} onChange={(e) => setEmergencyContactName(e.target.value)} placeholder="Father/Spouse name" className="bg-slate-50 border-slate-200" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700">Relationship</Label>
                        <Select value={emergencyContactRelation} onChange={(e) => setEmergencyContactRelation(e.target.value)} className="bg-slate-50 border-slate-200">
                          <option value="">Select Relation</option>
                          <option value="Father">Father</option>
                          <option value="Mother">Mother</option>
                          <option value="Spouse">Spouse</option>
                          <option value="Brother">Brother</option>
                          <option value="Sister">Sister</option>
                          <option value="Other">Other</option>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700">Mobile Number</Label>
                        <Input value={emergencyContactMobile} onChange={(e) => setEmergencyContactMobile(e.target.value)} placeholder="10-digit mobile" maxLength={10} className="bg-slate-50 border-slate-200" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Address */}
              {step === 2 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-medium">Street Address / Local Area</Label>
                    <Textarea {...register('street')} placeholder="House No., Street Name, Landmark..." className="min-h-[120px] bg-slate-50 resize-none border-slate-200" />
                    {errors.street && <p className="text-red-500 text-xs italic">{errors.street.message}</p>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-medium">Pincode</Label>
                      <Input {...register('pincode')} placeholder="6-digit code" maxLength={6} className="bg-slate-50 border-slate-200" />
                      {errors.pincode && <p className="text-red-500 text-xs italic">{errors.pincode.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-medium">State</Label>
                      <Input {...register('state')} placeholder="e.g. Telangana" className="bg-slate-50 border-slate-200" />
                      {errors.state && <p className="text-red-500 text-xs italic">{errors.state.message}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3 & 4: General Educational Section Redesign */}
              {(step === 3 || step === 4) && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
                  {/* Internal helper for upload UI */}
                  {step === 3 && (
                    <div className="space-y-6">
                      {[
                        { id: 'tenth', label: '10th Standard', cert: tenthCert, set: setTenthCert, fields: ['tenth_board', 'tenth_year', 'tenth_percentage'] },
                        { id: 'twelfth', label: '12th Standard', cert: twelfthCert, set: setTwelfthCert, fields: ['twelfth_board', 'twelfth_year', 'twelfth_percentage'] },
                        { id: 'ug', label: 'Undergraduate', cert: ugCert, set: setUgCert, fields: ['ug_degree', 'ug_university', 'ug_year', 'ug_percentage'] }
                      ].map((edu) => (
                        <div key={edu.id} className="p-6 rounded-2xl bg-slate-50/50 border border-slate-200 space-y-4">
                          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                             <h3 className="font-bold text-slate-800 uppercase text-xs tracking-widest">{edu.label}</h3>
                             {edu.cert && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-bold">Uploaded</span>}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                             {edu.fields.map(field => (
                               <div key={field} className="space-y-1">
                                 <Label className="text-[11px] font-bold text-slate-500 uppercase">{field.split('_')[1]}</Label>
                                 <Input {...register(field as any)} className="h-9 text-sm bg-white" placeholder="..." />
                               </div>
                             ))}
                             <div className="space-y-1">
                               <Label className="text-[11px] font-bold text-slate-500 uppercase">Document</Label>
                               <CldUploadWidget uploadPreset={uploadPreset} onSuccess={(res: any) => edu.set(res.info.secure_url)}>
                                  {({ open }) => (
                                    <Button type="button" variant="outline" size="sm" onClick={() => open()} className="w-full h-9 text-xs border-dashed border-slate-300">
                                      {edu.cert ? 'Replace File' : 'Upload File'}
                                    </Button>
                                  )}
                               </CldUploadWidget>
                             </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {step === 4 && (
                    <div className="space-y-6">
                       {/* B.Ed & M.Ed */}
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-4">
                            <h3 className="font-bold text-indigo-900 text-sm">B.Ed Qualification</h3>
                            <Input value={bedData.board} onChange={(e) => setBedData({...bedData, board: e.target.value})} placeholder="Board/University" className="bg-white" />
                            <div className="grid grid-cols-2 gap-2">
                               <Input value={bedData.year} onChange={(e) => setBedData({...bedData, year: e.target.value})} placeholder="Year" />
                               <Input value={bedData.percentage} onChange={(e) => setBedData({...bedData, percentage: e.target.value})} placeholder="%" />
                            </div>
                            <CldUploadWidget uploadPreset={uploadPreset} onSuccess={(res: any) => setBedCert(res.info.secure_url)}>
                              {({ open }) => (
                                <Button type="button" variant="ghost" size="sm" onClick={() => open()} className="w-full text-xs text-indigo-600 hover:bg-white border border-indigo-100 border-dashed">
                                  {bedCert ? 'Certificate Attached ✓' : 'Add Certificate'}
                                </Button>
                              )}
                            </CldUploadWidget>
                          </div>

                          <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-4">
                            <h3 className="font-bold text-purple-900 text-sm">M.Ed Qualification</h3>
                            <Input value={medData.board} onChange={(e) => setMedData({...medData, board: e.target.value})} placeholder="Board/University" className="bg-white" />
                            <div className="grid grid-cols-2 gap-2">
                               <Input value={medData.year} onChange={(e) => setMedData({...medData, year: e.target.value})} placeholder="Year" />
                               <Input value={medData.percentage} onChange={(e) => setMedData({...medData, percentage: e.target.value})} placeholder="%" />
                            </div>
                            <CldUploadWidget uploadPreset={uploadPreset} onSuccess={(res: any) => setMedCert(res.info.secure_url)}>
                              {({ open }) => (
                                <Button type="button" variant="ghost" size="sm" onClick={() => open()} className="w-full text-xs text-purple-600 hover:bg-white border border-purple-100 border-dashed">
                                  {medCert ? 'Certificate Attached ✓' : 'Add Certificate'}
                                </Button>
                              )}
                            </CldUploadWidget>
                          </div>
                       </div>

                       {/* PG Dynamic */}
                       <div className="space-y-4">
                          <div className="flex justify-between items-center">
                             <h3 className="font-bold text-slate-800">Additional PG / PhD</h3>
                             <Button type="button" onClick={addPGQualification} size="sm" className="bg-slate-800 hover:bg-slate-900 text-xs h-8">
                                <Plus className="w-3 h-3 mr-2" /> Add Record
                             </Button>
                          </div>
                          {pgQualifications.map((pg, idx) => (
                            <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white relative grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Input value={pg.degree} onChange={(e) => updatePGQualification(idx, 'degree', e.target.value)} placeholder="Degree" />
                                <Input value={pg.university} onChange={(e) => updatePGQualification(idx, 'university', e.target.value)} placeholder="University" />
                                <div className="flex gap-2">
                                   <Input value={pg.year} onChange={(e) => updatePGQualification(idx, 'year', e.target.value)} placeholder="Year" className="w-20" />
                                   <CldUploadWidget uploadPreset={uploadPreset} onSuccess={(res: any) => updatePGQualification(idx, 'certificate', res.info.secure_url)}>
                                      {({ open }) => <Button type="button" variant="outline" size="sm" onClick={() => open()} className="shrink-0"><Upload className="w-4 h-4" /></Button>}
                                   </CldUploadWidget>
                                   <Button type="button" variant="ghost" onClick={() => removePGQualification(idx)} className="text-red-500 hover:bg-red-50"><X className="w-4 h-4" /></Button>
                                </div>
                            </div>
                          ))}
                       </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 5: Previous Employment */}
              {step === 5 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-bold uppercase text-[11px] tracking-wider">Most Recent Institution</Label>
                    <Input value={previousSchool} onChange={(e) => setPreviousSchool(e.target.value)} placeholder="Organization Name" className="bg-slate-50" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-slate-800 font-bold">Classes Taught</Label>
                      <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        {CLASSES.map(cls => (
                          <button
                            type="button"
                            key={cls}
                            onClick={() => previousClasses.includes(cls) ? setPreviousClasses(previousClasses.filter(c => c !== cls)) : setPreviousClasses([...previousClasses, cls])}
                            className={cn(
                              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                              previousClasses.includes(cls) ? "bg-emerald-600 text-white shadow-md scale-105" : "bg-white text-slate-600 border border-slate-200 hover:border-emerald-300"
                            )}
                          >
                            {cls}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-slate-800 font-bold">Core Subjects</Label>
                      <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        {SUBJECTS.map(subj => (
                          <button
                            type="button"
                            key={subj}
                            onClick={() => previousSubjects.includes(subj) ? setPreviousSubjects(previousSubjects.filter(s => s !== subj)) : setPreviousSubjects([...previousSubjects, subj])}
                            className={cn(
                              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                              previousSubjects.includes(subj) ? "bg-blue-600 text-white shadow-md scale-105" : "bg-white text-slate-600 border border-slate-200 hover:border-blue-300"
                            )}
                          >
                            {subj}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 6: Current School & Bank Details */}
              {step === 6 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
                  <div className="p-6 rounded-2xl bg-emerald-50/30 border border-emerald-100 space-y-4">
                    <Label className="text-emerald-900 font-bold flex items-center gap-2">
                       <Building2 className="w-4 h-4" /> Employment Branch <span className="text-red-400">*</span>
                    </Label>
                    <Select {...register('current_branch')}>
                      <option value="">Locate your branch</option>
                      {BRANCHES.map(branch => (
                        <option key={branch} value={branch}>{branch}</option>
                      ))}
                    </Select>
                    {errors.current_branch && <p className="text-red-500 text-xs">{errors.current_branch.message}</p>}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                      <div className="space-y-2">
                        <Label className="text-emerald-900 font-bold">Current Class</Label>
                        <Select value={currentClass} onChange={(e) => setCurrentClass(e.target.value)}>
                          <option value="">Select Class</option>
                          {CLASSES.map(cls => (
                            <option key={cls} value={cls}>{cls}</option>
                          ))}
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-emerald-900 font-bold">Current Subject</Label>
                        <Select value={currentSubject} onChange={(e) => setCurrentSubject(e.target.value)}>
                          <option value="">Select Subject</option>
                          {SUBJECTS.map(subj => (
                            <option key={subj} value={subj}>{subj}</option>
                          ))}
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">Financial Disclosures</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <Label className="text-xs uppercase text-slate-400 font-bold">Bank Name</Label>
                        <Input {...register('bank_name')} placeholder="Full bank name" className="bg-slate-50" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs uppercase text-slate-400 font-bold">Account Number</Label>
                        <Input {...register('account_number')} placeholder="Account Number" className="bg-slate-50" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs uppercase text-slate-400 font-bold">IFSC Code</Label>
                        <Input {...register('ifsc_code')} placeholder="11 characters" maxLength={11} className="bg-slate-50" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs uppercase text-slate-400 font-bold">PAN Number</Label>
                        <Input {...register('pan_number')} placeholder="Alphanumeric PAN" maxLength={10} className="bg-slate-50" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-100 pt-4">
                      <Input value={pfNumber} onChange={(e) => setPfNumber(e.target.value)} placeholder="Provident Fund (PF) No." className="bg-slate-50 border-dashed" />
                      <Input value={esiNumber} onChange={(e) => setEsiNumber(e.target.value)} placeholder="ESI Number" className="bg-slate-50 border-dashed" />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 7: Review & Submit */}
              {step === 7 && (
                <div className="animate-in zoom-in-95 duration-500 space-y-8">
                  <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                       <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden shrink-0">
                          {profilePic ? <img src={profilePic} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-200" />}
                       </div>
                       <div className="text-center md:text-left space-y-1">
                          <h3 className="text-2xl font-bold text-slate-900">{watch('full_name')}</h3>
                          <p className="text-emerald-700 font-medium">{watch('email')} • {watch('phone')}</p>
                          <p className="text-slate-500 text-sm">Reviewing application for <strong>{watch('current_branch')}</strong></p>
                          {(currentClass || currentSubject) && (
                            <p className="text-slate-600 text-sm font-medium">
                              {currentClass && <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs mr-2">{currentClass}</span>}
                              {currentSubject && <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">{currentSubject}</span>}
                            </p>
                          )}
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                       <h4 className="font-bold text-xs uppercase tracking-widest text-slate-400">Identification</h4>
                       <div className="space-y-3">
                          <div className="flex justify-between border-b border-slate-50 pb-2">
                             <span className="text-sm text-slate-500">Aadhar Number</span>
                             <span className="text-sm font-bold">{watch('aadhar_number')}</span>
                          </div>
                          <div className="flex justify-between">
                             <span className="text-sm text-slate-500">Date of Birth</span>
                             <span className="text-sm font-bold">{watch('date_of_birth')}</span>
                          </div>
                       </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                       <h4 className="font-bold text-xs uppercase tracking-widest text-slate-400">Bank Details</h4>
                       <div className="space-y-3">
                          <div className="flex justify-between border-b border-slate-50 pb-2">
                             <span className="text-sm text-slate-500">Bank</span>
                             <span className="text-sm font-bold">{watch('bank_name')}</span>
                          </div>
                          <div className="flex justify-between">
                             <span className="text-sm text-slate-500">PAN Number</span>
                             <span className="text-sm font-bold uppercase">{watch('pan_number')}</span>
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 text-center">
                    <p className="text-xs text-amber-800 font-medium">
                       By clicking submit, you certify that all information provided is accurate and all uploaded documents are authentic.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-100">
                {step > 1 && (
                  <Button type="button" variant="outline" onClick={() => setStep(step - 1)} className="flex-1 h-12 text-slate-600 hover:bg-slate-50 border-slate-200">
                    Go Back
                  </Button>
                )}
                {step < totalSteps ? (
                  <Button type="button" onClick={() => setStep(step + 1)} className="flex-[2] h-12 bg-slate-900 hover:bg-slate-800 shadow-lg shadow-slate-200">
                    Continue to Next Step <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting} className="flex-[2] h-12 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200">
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Finalizing Registration...
                      </div>
                    ) : 'Complete Submission'}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}