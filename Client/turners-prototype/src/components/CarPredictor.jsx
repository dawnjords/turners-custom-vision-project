import { useState } from "react";

function CarPredictor() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [topPrediction, setTopPrediction] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const upload = e.target.files[0];
    if (upload) {
      setFile(upload);
      setPreview(URL.createObjectURL(upload));
      setTopPrediction(null);
      setError("");
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("http://localhost:4000/api/predict", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "prediction failed");

      setTopPrediction(data.top);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="rounded-lg border bg-white p-4 space-y-4">
        <h3 className="block text-sm font-medium">
          Upload an image of your vehicle here
        </h3>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mt-2 block w-full text-sm
                       file:mr-4 file:py-2 file:px-3
                       file:rounded-md file:border-0
                       file:bg-gray-100 file:text-gray-700
                       hover:file:bg-gray-200"
        />
        <button
          onClick={handleUpload}
          disabled={!file}
          className="px-4 py-2 rounded-md bg-gray-600 text-white
                     disabled:opacity-50"
        >
          Upload
        </button>

        {preview && (
          <div className="overflow-hidden rounded-md border">
            <img
              src={preview}
              alt="uploaded image"
              className="w-full max-h-[420px] object-cover"
            />
          </div>
        )}

        {error && <p className="text-red-500">{error}</p>}
        {topPrediction && (
          <div className="mt-6 rounded-lg border bg-white p-4">
            <h4 className="font-semibold">Result</h4>
            <p className="mt-1">
              Vehicle Type: {topPrediction.tag} (Confidence:
              {topPrediction.probability}%)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CarPredictor;
