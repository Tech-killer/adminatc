import React, { useState, useEffect } from "react";

const API_URL = "https://www.atcnagpur.com/atc/backend/get_feature.php";

async function readJsonSafe(res) {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return await res.json();
  const text = await res.text();
  return { success: false, message: `Non-JSON response (${res.status})`, raw: text };
}

export default function AdminFeature() {
  const [photos, setPhotos] = useState([]);
  const [formData, setFormData] = useState({ id: null, name: "", position: "", appearance: "Y" });
  const [imageFile, setImageFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL, { method: "GET" });
      const data = await readJsonSafe(res);
      if (!res.ok || !data.success) throw new Error(data.message || `HTTP ${res.status}`);
      setPhotos(data.photos || []);
      setError(null);
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPhotos(); }, []);

  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleFileChange = (e) => setImageFile(e.target.files?.[0] || null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.name) return setError("Name is required");
      setLoading(true);

      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("position", formData.position);
      fd.append("appearance", formData.appearance);
      if (imageFile) fd.append("image", imageFile);

      if (isEditing && formData.id) {
        fd.append("_method", "PUT"); // tunnel PUT
        fd.append("id", formData.id);
      }

      const res = await fetch(API_URL, { method: "POST", body: fd });
      const data = await readJsonSafe(res);

      if (!res.ok || !data.success) throw new Error(data.message || `HTTP ${res.status}`);
      await fetchPhotos();
      resetForm();
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this photo?")) return;
    try {
      setLoading(true);
      const fd = new FormData();
      fd.append("_method", "DELETE");
      fd.append("id", id);
      const res = await fetch(API_URL, { method: "POST", body: fd });
      const data = await readJsonSafe(res);
      if (!res.ok || !data.success) throw new Error(data.message || `HTTP ${res.status}`);
      setPhotos((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (photo) => {
    setFormData({
      id: photo.id,
      name: photo.title || "",
      position: photo.category || "",
      appearance: photo.appearance || "Y",
    });
    setImageFile(null);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" }); // optional: scroll to form
  };

  const resetForm = () => {
    setFormData({ id: null, name: "", position: "", appearance: "Y" });
    setImageFile(null);
    setIsEditing(false);
    setError(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6">Admin Feature Gallery</h2>

      {loading && <p className="text-blue-600 mb-4">Loading...</p>}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4 whitespace-pre-wrap">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-6 mb-8 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="file" accept="image/png, image/jpeg" onChange={handleFileChange} className="border p-2 rounded-lg" />
          <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="border p-2 rounded-lg" required />
          <input type="text" name="position" placeholder="Position" value={formData.position} onChange={handleChange} className="border p-2 rounded-lg" />
          <select name="appearance" value={formData.appearance} onChange={handleChange} className="border p-2 rounded-lg">
            <option value="Y">Show</option>
            <option value="N">Hide</option>
          </select>
        </div>

        <div className="flex gap-4 mt-6">
          <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50">
            {isEditing ? "Update Photo" : "Add Photo"}
          </button>
          {isEditing && (
            <button type="button" onClick={resetForm} className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {photos.map((photo) => (
          <div key={photo.id} className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center border border-gray-200">
            <img src={photo.image} alt={photo.title} className="w-40 h-40 object-cover rounded-lg mb-3" />
            <h3 className="font-semibold">{photo.title}</h3>
            <p className="text-sm text-gray-600">{photo.category}</p>
            <span className={`mt-2 text-xs px-3 py-1 rounded-full ${photo.appearance === "Y" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {photo.appearance === "Y" ? "Visible" : "Hidden"}
            </span>
            <div className="flex gap-3 mt-4">
              <button onClick={() => handleEdit(photo)} className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600">Edit</button>
              <button onClick={() => handleDelete(photo.id)} className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
