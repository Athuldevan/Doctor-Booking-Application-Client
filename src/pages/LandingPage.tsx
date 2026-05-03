// pages/LandingPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  Shield,
  Star,
  Heart,
  Users,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Menu,
  X,
  CheckCircle,
  Stethoscope,
  Activity,
  Award,
} from "lucide-react";

const stats = [
  { label: "Verified Doctors", value: "500+", icon: Stethoscope },
  { label: "Happy Patients", value: "50,000+", icon: Users },
  { label: "Appointments Booked", value: "100,000+", icon: Calendar },
  { label: "Years of Trust", value: "10+", icon: Award },
];

const features = [
  {
    icon: Calendar,
    title: "Easy Scheduling",
    description:
      "Book appointments in seconds. Choose your preferred date, time, and doctor with just a few clicks.",
  },
  {
    icon: Shield,
    title: "Verified Doctors",
    description:
      "All doctors are thoroughly verified and credentialed. Your health is in safe, trusted hands.",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description:
      "Access healthcare anytime. Browse doctors and book appointments around the clock.",
  },
  {
    icon: Star,
    title: "Patient Reviews",
    description:
      "Read genuine patient reviews and ratings to choose the best doctor for your needs.",
  },
  {
    icon: Heart,
    title: "Personalized Care",
    description:
      "Get matched with specialists who understand your unique health requirements.",
  },
  {
    icon: Activity,
    title: "Health Records",
    description:
      "Keep all your medical records, prescriptions, and history in one secure place.",
  },
];

const specialties = [
  { name: "Cardiology", icon: "🫀" },
  { name: "Dermatology", icon: "🧴" },
  { name: "Neurology", icon: "🧠" },
  { name: "Orthopedics", icon: "🦴" },
  { name: "Pediatrics", icon: "👶" },
  { name: "Dentistry", icon: "🦷" },
  { name: "Ophthalmology", icon: "👁️" },
  { name: "General Medicine", icon: "💊" },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Patient",
    avatar: "SJ",
    rating: 5,
    text: "MedBook made finding a specialist so easy. I booked my appointment in under 2 minutes and the doctor was amazing!",
  },
  {
    name: "Dr. Michael Chen",
    role: "Cardiologist",
    avatar: "MC",
    rating: 5,
    text: "As a doctor, this platform has streamlined my practice. Managing appointments has never been this efficient.",
  },
  {
    name: "Emily Rodriguez",
    role: "Patient",
    avatar: "ER",
    rating: 5,
    text: "The review system helped me choose the right doctor. I felt confident walking into my appointment. Highly recommend!",
  },
];

const steps = [
  {
    step: "01",
    title: "Search a Doctor",
    description:
      "Browse through our extensive list of verified specialists and general practitioners.",
  },
  {
    step: "02",
    title: "Check Availability",
    description:
      "View real-time availability and choose a time slot that works best for you.",
  },
  {
    step: "03",
    title: "Book Appointment",
    description:
      "Confirm your booking instantly. Receive confirmation via email and SMS.",
  },
  {
    step: "04",
    title: "Get Care",
    description:
      "Visit your doctor at the scheduled time. Your health journey begins here.",
  },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0b1120] text-gray-100">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0b1120]/80 backdrop-blur-lg border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400">
                <Stethoscope className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Med<span className="text-blue-400">Book</span>
              </span>
            </div>

            <div className="hidden items-center gap-8 md:flex">
              {[
                "Features",
                "Specialties",
                "How It Works",
                "Testimonials",
                "Contact",
              ].map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-sm font-medium text-gray-400 transition-colors hover:text-blue-400"
                >
                  {link}
                </a>
              ))}
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:text-white"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/register")}
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-500 hover:shadow-blue-500/40"
              >
                Get Started
              </button>
            </div>

            <button
              className="rounded-lg p-2 hover:bg-white/5 md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="space-y-3 border-t border-white/5 bg-[#0f1729] px-4 py-4 md:hidden">
            {[
              "Features",
              "Specialties",
              "How It Works",
              "Testimonials",
              "Contact",
            ].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                className="block py-2 text-sm font-medium text-gray-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link}
              </a>
            ))}
            <hr className="border-white/10" />
            <button
              onClick={() => navigate("/login")}
              className="w-full rounded-xl border border-white/10 py-2.5 text-sm font-medium text-gray-300"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/register")}
              className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-medium text-white"
            >
              Get Started
            </button>
          </div>
        )}
      </nav>

      <section className="overflow-hidden px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-400">
                <CheckCircle className="h-4 w-4" />
                Trusted by 50,000+ patients
              </div>

              <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                Your Health,{" "}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Our Priority
                </span>
              </h1>

              <p className="max-w-lg text-lg leading-relaxed text-gray-400">
                Find and book appointments with the best doctors near you.
                Quality healthcare is just a click away — fast, easy, and
                secure.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={() => navigate("/register")}
                  className="group flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-blue-600/30 transition-all hover:from-blue-500 hover:to-blue-400 hover:shadow-blue-500/50"
                >
                  Book Appointment
                  <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-gray-300 transition-all hover:border-white/20 hover:bg-white/10"
                >
                  <Stethoscope className="h-5 w-5" />
                  I'm a Doctor
                </button>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-3">
                  {[
                    "bg-blue-500",
                    "bg-green-500",
                    "bg-purple-500",
                    "bg-orange-500",
                  ].map((color, i) => (
                    <div
                      key={i}
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#0b1120] text-xs font-bold text-white ${color}`}
                    >
                      {["A", "B", "C", "D"][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">
                    4.9/5 from 2,000+ reviews
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-blue-600 to-cyan-500 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="mx-auto mb-3 h-8 w-8 text-blue-100" />
                <p className="text-3xl font-bold text-white sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-blue-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="bg-[#0f1729] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-400">
              Why Choose Us
            </p>
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
              Everything You Need for Better Healthcare
            </h2>
            <p className="text-gray-400">
              We provide a comprehensive platform that connects patients with
              quality healthcare professionals seamlessly.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-white/5 bg-white/[0.02] p-8 transition-all duration-300 hover:border-blue-500/30 hover:bg-white/[0.04]"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 transition-colors duration-300 group-hover:bg-blue-600">
                  <feature.icon className="h-7 w-7 text-blue-400 transition-colors duration-300 group-hover:text-white" />
                </div>
                <h3 className="mb-3 text-lg font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="leading-relaxed text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="specialties" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-400">
              Our Specialties
            </p>
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
              Find the Right Specialist
            </h2>
            <p className="text-gray-400">
              We cover a wide range of medical specialties to meet all your
              healthcare needs.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {specialties.map((spec) => (
              <button
                key={spec.name}
                className="group rounded-2xl border border-white/5 bg-white/[0.02] p-6 text-center transition-all duration-300 hover:border-blue-500/30 hover:bg-white/[0.04]"
              >
                <span className="mb-3 block text-4xl">{spec.icon}</span>
                <p className="text-sm font-semibold text-gray-300 transition-colors group-hover:text-blue-400">
                  {spec.name}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-[#0f1729] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-400">
              How It Works
            </p>
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
              Book in 4 Simple Steps
            </h2>
            <p className="text-gray-400">
              Getting quality healthcare has never been this simple and fast.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((item, index) => (
              <div key={item.step} className="relative text-center">
                {index < steps.length - 1 && (
                  <div className="absolute top-8 left-[60%] hidden h-0.5 w-[80%] bg-gradient-to-r from-blue-500/40 to-blue-500/0 lg:block" />
                )}

                <div className="relative mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-xl font-bold text-white shadow-lg shadow-blue-600/25">
                  {item.step}
                </div>
                <h3 className="mb-3 text-lg font-semibold text-white">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-400">
              Testimonials
            </p>
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
              What Our Users Say
            </h2>
            <p className="text-gray-400">
              Real stories from patients and doctors who trust our platform.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 transition-shadow duration-300 hover:shadow-xl hover:shadow-blue-500/5"
              >
                <div className="mb-4 flex items-center gap-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="mb-6 leading-relaxed text-gray-400">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-sm font-bold text-white">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-blue-600 to-cyan-500 py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl">
            Ready to Take Control of Your Health?
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-blue-100">
            Join thousands of patients who trust MedBook for their healthcare
            needs. Book your first appointment today — it's free to get started.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <button
              onClick={() => navigate("/register")}
              className="group flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-semibold text-blue-600 shadow-xl transition-all hover:bg-gray-50"
            >
              Get Started Free
              <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => navigate("/login")}
              className="flex items-center justify-center gap-2 rounded-2xl border-2 border-white/30 px-8 py-4 text-base font-semibold text-white transition-all hover:border-white/60"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      <footer id="contact" className="bg-[#070d1a] pt-20 pb-8 text-gray-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400">
                  <Stethoscope className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">
                  Med<span className="text-blue-400">Book</span>
                </span>
              </div>
              <p className="text-sm leading-relaxed">
                Connecting patients with quality healthcare professionals. Your
                health journey starts here.
              </p>
              <div className="flex gap-4">
                {[Mail, Phone, MapPin].map((Icon, i) => (
                  <div
                    key={i}
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-white/5 transition-colors hover:bg-blue-600"
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {[
                  "Find Doctors",
                  "Book Appointment",
                  "Our Specialties",
                  "Patient Reviews",
                ].map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm transition-colors hover:text-blue-400"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
                For Doctors
              </h4>
              <ul className="space-y-3">
                {[
                  "Join as Doctor",
                  "Doctor Dashboard",
                  "Manage Schedule",
                  "Patient Records",
                ].map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm transition-colors hover:text-blue-400"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
                Contact Us
              </h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-blue-400" />
                  support@medbook.com
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-blue-400" />
                  +1 (555) 123-4567
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-blue-400" />
                  San Francisco, CA
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
            <p className="text-xs">
              © {new Date().getFullYear()} MedBook. All rights reserved.
            </p>
            <div className="flex gap-6">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
                (link) => (
                  <a
                    key={link}
                    href="#"
                    className="text-xs transition-colors hover:text-blue-400"
                  >
                    {link}
                  </a>
                ),
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
