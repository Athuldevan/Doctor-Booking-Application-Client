import {
  Stethoscope,
  Users,
  Calendar,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
} from "lucide-react";

const stats = [
  {
    label: "Total Doctors",
    value: "48",
    change: "+12%",
    trend: "up",
    icon: Stethoscope,
    color: "text-blue-500 bg-blue-500/10",
  },
  {
    label: "Total Patients",
    value: "2,845",
    change: "+18%",
    trend: "up",
    icon: Users,
    color: "text-green-500 bg-green-500/10",
  },
  {
    label: "Appointments",
    value: "384",
    change: "+8%",
    trend: "up",
    icon: Calendar,
    color: "text-purple-500 bg-purple-500/10",
  },
  {
    label: "Revenue",
    value: "$12,480",
    change: "-3%",
    trend: "down",
    icon: DollarSign,
    color: "text-orange-500 bg-orange-500/10",
  },
];

const recentAppointments = [
  {
    id: 1,
    patient: "Sarah Johnson",
    doctor: "Dr. Rajesh Kumar",
    date: "Today, 10:30 AM",
    status: "confirmed",
  },
  {
    id: 2,
    patient: "Mike Chen",
    doctor: "Dr. Priya Sharma",
    date: "Today, 11:00 AM",
    status: "pending",
  },
  {
    id: 3,
    patient: "Emily Davis",
    doctor: "Dr. Ahmed Hassan",
    date: "Today, 2:00 PM",
    status: "confirmed",
  },
  {
    id: 4,
    patient: "James Wilson",
    doctor: "Dr. Lisa Wang",
    date: "Tomorrow, 9:00 AM",
    status: "pending",
  },
  {
    id: 5,
    patient: "Anna Smith",
    doctor: "Dr. Rajesh Kumar",
    date: "Tomorrow, 3:30 PM",
    status: "cancelled",
  },
];

const topDoctors = [
  { name: "Dr. Rajesh Kumar", specialty: "Cardiology", appointments: 142, rating: 4.9 },
  { name: "Dr. Priya Sharma", specialty: "Dermatology", appointments: 128, rating: 4.8 },
  { name: "Dr. Ahmed Hassan", specialty: "Neurology", appointments: 115, rating: 4.7 },
  { name: "Dr. Lisa Wang", specialty: "Pediatrics", appointments: 98, rating: 4.9 },
];

const statusColors: Record<string, string> = {
  confirmed: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  cancelled: "bg-danger/10 text-danger",
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="ui-card flex items-center gap-4 p-5"
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}
            >
              <stat.icon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted">{stat.label}</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
                <span
                  className={`flex items-center text-xs font-medium ${
                    stat.trend === "up" ? "text-success" : "text-danger"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {stat.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Recent Appointments */}
        <div className="ui-card lg:col-span-3">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="font-semibold text-foreground">
              Recent Appointments
            </h2>
            <button className="text-sm font-medium text-primary hover:underline">
              View all
            </button>
          </div>
          <div className="divide-y divide-border">
            {recentAppointments.map((apt) => (
              <div
                key={apt.id}
                className="flex items-center justify-between px-6 py-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {apt.patient.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {apt.patient}
                    </p>
                    <p className="text-xs text-muted">{apt.doctor}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden items-center gap-1.5 text-xs text-muted sm:flex">
                    <Clock className="h-3.5 w-3.5" />
                    {apt.date}
                  </div>
                  <span
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium capitalize ${
                      statusColors[apt.status]
                    }`}
                  >
                    {apt.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Doctors */}
        <div className="ui-card lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="font-semibold text-foreground">Top Doctors</h2>
            <button className="text-sm font-medium text-primary hover:underline">
              View all
            </button>
          </div>
          <div className="divide-y divide-border">
            {topDoctors.map((doc) => (
              <div key={doc.name} className="flex items-center gap-3 px-6 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                  {doc.name.charAt(4)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {doc.name}
                  </p>
                  <p className="text-xs text-muted">{doc.specialty}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">
                    ⭐ {doc.rating}
                  </p>
                  <p className="text-xs text-muted">
                    {doc.appointments} appts
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}