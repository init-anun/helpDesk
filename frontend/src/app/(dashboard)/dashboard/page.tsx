export default function DashboardPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard
        </h1>

        <p className="mt-2 text-gray-500">
          Welcome to your HelpDesk dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Patients
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            0
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Today's Appointments
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            0
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Pending Bills
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            0
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Therapists
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            0
          </p>
        </div>
      </div>
    </div>
  );
}
