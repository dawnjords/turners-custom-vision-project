import CarPredictor from "./components/CarPredictor";

function App() {
  return (
    <div className="bg-gray-50">
      {/* header */}
      <header className="sticky top-0 w-full bg-white mb-2">
        <div className="mx-auto flex max-w-6xl h-24 justify-between items-center">
          <img src="/logo.png" alt="turners" />
        </div>
      </header>
      <div className="mx-auto max-w-5xl">
        <CarPredictor apiUrl="/api/predict" formFieldName="image" />
      </div>
    </div>
  );
}

export default App;
