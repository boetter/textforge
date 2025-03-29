export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} AI Tekstforbedring
          </p>
          <p className="text-sm text-gray-500 max-w-md text-center md:text-right">
            Dette værktøj bruger tredjeparts AI-modeller til at forbedre din tekst. Dine data kan blive behandlet i henhold til hver models vilkår.
          </p>
        </div>
      </div>
    </footer>
  );
}
