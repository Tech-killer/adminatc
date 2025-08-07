import React, { useState, useEffect } from "react";

const API_URL = "https://www.atcnagpur.com/atc/backend/get_feature.php";

const AdminFeature = () => {
  const [photos, setPhotos] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    image_url: "",
    name: "",
    position: "",
    appearance: "Y",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Fetch photos from backend
  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();

      if (data.success) {
        // Normalize response so keys match formData
        const normalized = data.photos.map((p) => ({
          id: p.id,
          image_url: p.image,
          name: p.title,
          position: p.category,
          appearance: p.appearance || "Y",
        }));
        setPhotos(normalized);
        setError(null);
      } else {
        setError(data.message || "No photos found.");
      }
    } catch (err) {
      setError("Error fetching photos: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  // ✅ Handle form input changes
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ✅ Add or Update photo
  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = isEditing ? "PUT" : "POST";

    try {
      setLoading(true);
      const res = await fetch(API_URL, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        fetchPhotos();
        resetForm();
      } else {
        setError(data.message || "Operation failed.");
      }
    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete photo
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) return;
    try {
      setLoading(true);
      const res = await fetch(API_URL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();

      if (data.success) {
        setPhotos((prev) => prev.filter((p) => p.id !== id));
      } else {
        setError(data.message || "Delete failed.");
      }
    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Edit photo
  const handleEdit = (photo) => {
    setFormData(photo);
    setIsEditing(true);
  };

  // ✅ Reset form
  const resetForm = () => {
    setFormData({
      id: null,
      image_url: "",
      name: "",
      position: "",
      appearance: "Y",
    });
    setIsEditing(false);
    setError(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6">
        Admin Feature Gallery
      </h2>

      {loading && <p className="text-blue-600 mb-4">Loading...</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-6 mb-8 border border-gray-200"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="image_url"
            placeholder="Image URL"
            value={formData.image_url}
            onChange={handleChange}
            className="border p-2 rounded-lg"
            required
          />
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 rounded-lg"
            required
          />
          <input
            type="text"
            name="position"
            placeholder="Position"
            value={formData.position}
            onChange={handleChange}
            className="border p-2 rounded-lg"
          />
          <select
            name="appearance"
            value={formData.appearance}
            onChange={handleChange}
            className="border p-2 rounded-lg"
          >
            <option value="Y">Show</option>
            <option value="N">Hide</option>
          </select>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {isEditing ? "Update Photo" : "Add Photo"}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center border border-gray-200"
          >
            <img
              src={photo.image_url}
              alt={photo.name}
              className="w-40 h-40 object-cover rounded-lg mb-3"
            />
            <h3 className="font-semibold">{photo.name}</h3>
            <p className="text-sm text-gray-600">{photo.position}</p>
            <span
              className={`mt-2 text-xs px-3 py-1 rounded-full ${
                photo.appearance === "Y"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {photo.appearance === "Y" ? "Visible" : "Hidden"}
            </span>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => handleEdit(photo)}
                className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(photo.id)}
                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminFeature;
