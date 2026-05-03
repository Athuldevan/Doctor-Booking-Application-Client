// pages/admin/doctors/index.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Stethoscope } from "lucide-react";
import { useDeleteDoctor, useGetDoctors } from "../../hooks/useDoctor";
import PageHeader from "../../components/custom/PageHeader";
import SearchBar from "../../components/custom/SearchBar";
import EmptyState from "../../components/custom/EmptyState";
import DoctorTableRow from "../../components/Doctors/DoctorTableRow";
import DeleteModal from "../../components/custom/DeleteModel";
import type { IDoctor } from "./types/doctor";

export default function DoctorsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data } = useGetDoctors();
  const deleteMutation = useDeleteDoctor();

  const doctors = data?.data || data || [];
  const filtered = doctors.filter(
    (doc: IDoctor) =>
      doc.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialization?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Doctors"
        description="Manage all doctors"
        action={
          <button
            onClick={() => navigate("/admin/doctors/add")}
            className="btn-primary gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Doctor
          </button>
        }
      />

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search by name or specialization..."
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Stethoscope className="h-12 w-12" />}
          title="No doctors found"
          description="Add your first doctor to get started"
        />
      ) : (
        <div className="ui-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-muted">Doctor</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-muted">Specialization</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-muted">Experience</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-muted">Fee</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-muted">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-muted">Rating</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-muted">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((doc: IDoctor) => (
                <DoctorTableRow
                  key={doc._id}
                  doctor={doc}
                  onEdit={(id) => navigate(`/admin/doctors/${id}/edit`)}
                  onDelete={(id) => setDeleteId(id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <DeleteModal
        isOpen={!!deleteId}
        title="Delete Doctor?"
        message="This action cannot be undone."
        isLoading={deleteMutation.isPending}
        onClose={() => setDeleteId(null)}
        onConfirm={() =>
          deleteMutation.mutate(
            { _id: deleteId! },
            { onSuccess: () => setDeleteId(null) }
          )
        }
      />
    </div>
  );
}