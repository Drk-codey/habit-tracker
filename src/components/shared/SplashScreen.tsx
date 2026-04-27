export default function SplashScreen() {
  return (
    <div
      data-testid="splash-screen"
      className="flex items-center justify-center min-h-screen bg-green-50"
    >
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-700">Habit Tracker</h1>
        <p className="mt-2 text-green-500">Loading...</p>
      </div>
    </div>
  )
}