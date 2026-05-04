import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Stethoscope, 
  Search, 
  Filter, 
  ArrowRight,
  ChevronRight
} from "lucide-react";
import { useGetDoctors } from "../../hooks/useDoctor";
import PageHeader from "../../components/custom/PageHeader";
import EmptyState from "../../components/custom/EmptyState";
import type { IDoctor } from "../doctor/types/doctor";

export default function PatientDoctorsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("All");

  const { data: doctorsData, isLoading: doctorsLoading } = useGetDoctors();
  const doctors = doctorsData?.data || doctorsData || [];

  // Extract all unique specializations
  const specializations = useMemo<string[]>(() => {
    const specs = new Set(doctors.map((d: IDoctor) => d.specialization));
    return ["All", ...Array.from(specs)] as string[];
  }, [doctors]);

  // Filter doctors based on search and specialization
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc: IDoctor) => {
      const matchesSearch = doc.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
                          doc.specialization?.toLowerCase().includes(search.toLowerCase());
      const matchesSpec = selectedSpecialization === "All" || doc.specialization === selectedSpecialization;
      return matchesSearch && matchesSpec;
    });
  }, [doctors, search, selectedSpecialization]);



  if (doctorsLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-muted">Finding the best doctors for you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <PageHeader
          title="Find Your Specialist"
          description="Book an appointment with top-rated medical professionals"
        />
      </div>

      {/* Advanced Filters */}
      <div className="grid gap-4 md:grid-cols-12">
        <div className="relative md:col-span-7 lg:col-span-8">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by doctor name or condition..."
            className="ui-input h-14 pl-12 shadow-sm"
          />
        </div>
        
        <div className="relative md:col-span-5 lg:col-span-4">
          <Filter className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="ui-input h-14 pl-12 appearance-none shadow-sm cursor-pointer"
            >
              {specializations.map((spec: string) => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          <ChevronRight className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-muted pointer-events-none" />
        </div>
      </div>

      {filteredDoctors.length === 0 ? (
        <EmptyState
          icon={<Stethoscope className="h-16 w-16 text-primary/20" />}
          title="No doctors matched your criteria"
          description="Try broadening your search or choosing a different specialization"
          action={
            <button 
              onClick={() => {setSearch(""); setSelectedSpecialization("All");}}
              className="btn-secondary"
            >
              Clear all filters
            </button>
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredDoctors.map((doc: IDoctor) => {
            return (
              <div 
                key={doc._id} 
                className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-border bg-surface p-2 transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
              >
                {/* Card Header/Profile */}
                <div className="flex items-start gap-4 p-4">
                  <div className="relative">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary ring-4 ring-background transition-transform group-hover:scale-105">
                      {doc.user?.name?.charAt(0) || "D"}
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-background bg-success shadow-sm" title="Online" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        Dr. {doc.user?.name}
                      </h3>
                    </div>
                    <p className="text-sm font-medium text-primary/80 uppercase tracking-wider">{doc.specialization}</p>
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-muted">
                      <span>{doc.experience} yrs exp</span>
                    </div>
                  </div>
                </div>



                {/* Footer Action */}
                <div className="p-4 pt-2">
                  <div className="mb-4 flex items-center justify-between border-b border-border/50 pb-4">
                    <div>
                      <p className="text-[10px] font-semibold text-muted uppercase tracking-wider">Consultation Fee</p>
                      <p className="text-xl font-black text-foreground">₹{doc.consultationFee}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/patient/doctors/${doc._id}`)}
                    className="btn-primary group/btn w-full h-12 gap-2 rounded-2xl"
                  >
                    <span>View Profile</span>
                    <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
