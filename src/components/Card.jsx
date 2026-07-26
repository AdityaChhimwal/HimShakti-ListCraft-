function Card({ title, description }) {
  return (
    <div className="border rounded-xl p-6 shadow-md hover:shadow-xl transition duration-300 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">

      <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">
        {title}
      </h3>

      <p className="text-gray-600 dark:text-gray-300">
        {description}
      </p>

    </div>
  );
}

export default Card;