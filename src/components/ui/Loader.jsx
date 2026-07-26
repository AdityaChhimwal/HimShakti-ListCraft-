/**
 * Loader Component
 * Displays a simple loading spinner.
 */

function Loader() {
  return (
    <div className="flex justify-center items-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-green-700"></div>
    </div>
  );
}

export default Loader;