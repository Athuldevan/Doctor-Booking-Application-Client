import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  ChevronRight,
  ShieldCheck,
  Award,
  BookOpen
} from "lucide-react";
import { useGetDoctor } from "../../hooks/useDoctor";
import PageHeader from "../../components/custom/PageHeader";

export default function PatientDoctorDetailsPage() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { data: doctor, isLoading } = useGetDoctor(doctorId || "");

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="flex h-96 items-center justify-center text-muted">
        Doctor not found
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/patient/doctors")}
          className="rounded-xl border border-border p-2.5 text-muted transition hover:bg-surface hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <PageHeader 
          title="Doctor Profile" 
          description="Detailed information about the specialist" 
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="ui-card overflow-hidden">
            <div className="bg-primary/5 p-8 text-center border-b border-border">
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10 text-3xl font-bold text-primary ring-8 ring-background">
                {doctor.user?.name?.charAt(0)}
              </div>
              <h2 className="text-2xl font-bold text-foreground">Dr. {doctor.user?.name}</h2>
              <p className="mt-1 font-medium text-primary uppercase tracking-wider text-sm">
                {doctor.specialization}
              </p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 text-sm text-muted">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/50">
                  <Award className="h-4 w-4 text-primary" />
                </div>
                <span>{doctor.experience} Years Experience</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/50">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                </div>
                <span>Verified Specialist</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/50">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
                <span>English, Hindi</span>
              </div>
            </div>

            <div className="border-t border-border bg-secondary/20 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Consultation Fee</p>
                  <p className="text-2xl font-black text-foreground">₹{doctor.consultationFee}</p>
                </div>
                <button 
                  onClick={() => navigate(`/patient/doctors/${doctor._id}/book`)}
                  className="btn-primary gap-2"
                >
                  Book Now
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="ui-card p-6 space-y-4">
            <h3 className="font-bold text-foreground">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted">
                <Phone className="h-4 w-4 text-primary" />
                <span>{doctor.user?.phone || "+91 98765 43210"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted">
                <Mail className="h-4 w-4 text-primary" />
                <span className="truncate">{doctor.user?.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-8 space-y-6">
          <div className="ui-card p-8 space-y-6">
            <section className="space-y-3">
              <h3 className="text-xl font-bold text-foreground">About Dr. {doctor.user?.name}</h3>
              <p className="leading-relaxed text-muted">
                {doctor.bio || "Dr. " + doctor.user?.name + " is a highly skilled " + doctor.specialization + " with over " + doctor.experience + " years of experience in providing exceptional medical care. They are committed to delivering personalized treatment plans and staying at the forefront of medical advancements to ensure the best outcomes for their patients."}
              </p>
            </section>

            <hr className="border-border" />

            <section className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">Practice Location</h3>
              <div className="flex items-start gap-4 rounded-2xl border border-border bg-secondary/20 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{doctor.hospital || "City Medical Center"}</h4>
                  <p className="text-sm text-muted mt-1">{doctor.city || "Mumbai"}, Maharashtra</p>
                  <p className="text-xs text-muted/60 mt-2 italic">Mon - Sat | 09:00 AM - 05:00 PM</p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">Next Available Slot</h3>
              <div className="flex items-center justify-between rounded-2xl bg-success/5 border border-success/20 p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-success">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-success">Available Today</p>
                    <p className="text-xs text-muted mt-0.5">4 slots remaining</p>
                  </div>
                </div>
                <button 
                  onClick={() => navigate(`/patient/doctors/${doctor._id}/book`)}
                  className="rounded-xl bg-success px-6 py-3 text-sm font-bold text-white shadow-lg shadow-success/20 transition hover:bg-success/90"
                >
                  View All Slots
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
