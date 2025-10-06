import PlateInventoryManager from '@/components/equipment/plate-inventory-manager'

export const metadata = {
  title: 'Plate Inventory Manager - Astral Forge',
  description: 'Track and manage your weight plate inventory',
}

export default function PlateInventoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Plate Inventory Manager
          </h1>
          <p className="text-gray-400">
            Track your weight plates and check loading capabilities for your workouts.
          </p>
        </div>

        {/* Main Content */}
        <PlateInventoryManager location="home" />

        {/* Tips Section */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Tips for Managing Your Plate Inventory</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-purple-400 mb-2">Progressive Overload</h3>
              <p className="text-sm text-gray-400">
                Ensure you have small increment plates (1.25kg, 2.5kg) to progressively increase weight
                week-to-week for optimal strength gains.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-purple-400 mb-2">Efficient Loading</h3>
              <p className="text-sm text-gray-400">
                Having pairs of standard plates (5kg, 10kg, 20kg) allows for quick loading and
                symmetric bar loading during workouts.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-purple-400 mb-2">Budget Planning</h3>
              <p className="text-sm text-gray-400">
                Start with a basic set and add heavier plates as you progress. 25kg plates become
                essential once you&apos;re lifting 140kg+.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-purple-400 mb-2">Space Efficiency</h3>
              <p className="text-sm text-gray-400">
                Fewer larger plates take up less space than many smaller plates of the same total
                weight. Consider 25kg plates for heavy lifters.
              </p>
            </div>
          </div>
        </div>

        {/* Color Guide */}
        <div className="mt-6 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">IPF/IWF Plate Color Standards</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {[
              { weight: '25kg', color: 'Red', bg: '#ef4444' },
              { weight: '20kg', color: 'Blue', bg: '#3b82f6' },
              { weight: '15kg', color: 'Yellow', bg: '#eab308' },
              { weight: '10kg', color: 'Green', bg: '#22c55e' },
              { weight: '5kg', color: 'White', bg: '#f3f4f6' },
              { weight: '2.5kg', color: 'Dark Red', bg: '#991b1b' },
              { weight: '1.25kg', color: 'Chrome', bg: '#9ca3af' },
              { weight: '0.5kg', color: 'Light', bg: '#d1d5db' },
            ].map(item => (
              <div key={item.weight} className="text-center">
                <div
                  className="w-12 h-12 rounded-full mx-auto mb-2"
                  style={{ backgroundColor: item.bg }}
                />
                <div className="text-sm font-semibold text-white">{item.weight}</div>
                <div className="text-xs text-gray-400">{item.color}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
