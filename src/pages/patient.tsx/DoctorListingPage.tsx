// pages/patient/DoctorListPage.tsx
import { useState } from "react";
import { Stethoscope } from "lucide-react";
import { useGetDoctors } from "../../hooks/useDoctor";
import FilterChips from "../../components/custom/FilterChip";
import SearchBar from "../../components/custom/SearchBar";
import PageHeader from "../../components/custom/PageHeader";
import EmptyState from "../../components/custom/EmptyState";
import DoctorCard from "../../components/Doctors/DoctorCard";
import type { IDoctor } from "../doctor/types/doctor";

const specializations = [
  { value: "", label: "All" },
  { value: "cardiology", label: "🫀 Cardiology" },
  { value: "dermatology", label: "🧴 Dermatology" },
  { value: "neurology", label: "🧠 Neurology" },
  { value: "orthopedics", label: "🦴 Orthopedics" },
  { value: "pediatrics", label: "👶 Pediatrics" },
  { value: "dentistry", label: "🦷 Dentistry" },
  { value: "ophthalmology", label: "👁️ Ophthalmology" },
  { value: "general", label: "💊 General" },
];

export default function DoctorListPage() {
  const [search, setSearch] = useState("");
  const [spec, setSpec] = useState("");

  const query = spec ? { specialization: spec } : undefined;
  const { data } = useGetDoctors();

  const doctors = data?.data || data || [];
  const filtered = doctors.filter((doc: IDoctor) =>
    doc.user?.name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <PageHeader
        title="Find a Doctor"
        description="Browse and book with our verified doctors"
      />

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search by name or city..."
      />

      <FilterChips
        options={specializations}
        selected={spec}
        onChange={setSpec}
      />

      <p className="text-sm text-muted">{filtered.length} doctors found</p>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Stethoscope className="h-12 w-12" />}
          title="No doctors found"
          description="Try a different specialization"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((doc: IDoctor) => (
            <DoctorCard key={doc._id} doctor={doc} variant="patient" />
          ))}
        </div>
      )}
    </div>
  );
}
