import React, { useEffect, useState } from "react";

const API_URL = "https://www.atcnagpur.com/atc/backend/slider.php";

const AdminCommunity = () => {
  const [sliders, setSliders] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    file: null,
    existing_image: "",
    title: "",
    sub_title: "",
    community: "",
    description: "",
    appearance: "Y",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch sliders
  const fetchSliders = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (data.success) {
        // Sort sliders: visible items first, then hidden items
        const sortedSliders = [...(data.data || [])].sort((a, b) => {
          const aVisible = a.appearance === "Y" || a.appearance === "y" || a.appearance === 1 || a.appearance === "1";
          const bVisible = b.appearance === "Y" || b.appearance === "y" || b.appearance === 1 || b.appearance === "1";
          
          // If visibility status is different, sort by visibility (visible first)
          if (aVisible !== bVisible) {
            return bVisible - aVisible; // true (1) - false (0) = 1, false (0) - true (1) = -1
          }
          
          // If same visibility status, sort by ID
          return a.id - b.id;
        });
        
        setSliders(sortedSliders);
      } else setError(data.message);
    } catch (err) {
      setError("Error fetching sliders: " + err.message);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, file: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const fd = new FormData();
      if (isEditing) fd.append("id", formData.id);
      if (formData.file) fd.append("file", formData.file);
      else if (isEditing) fd.append("existing_image", formData.existing_image);

      fd.append("title", formData.title);
      fd.append("sub_title", formData.sub_title);
      fd.append("community", formData.community);
      fd.append("description", formData.description);
      fd.append("appearance", formData.appearance);

      const res = await fetch(API_URL, { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        fetchSliders();
        resetForm();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Edit slider
  const handleEdit = (slider) => {
    setFormData({
      id: slider.id,
      file: null,
      existing_image: slider.image_url,
      title: slider.title,
      sub_title: slider.sub_title,
      community: slider.community,
      description: slider.description,
      appearance: slider.appearance,
    });
    setIsEditing(true);
  };

  // Delete slider
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this slider?")) return;
    const fd = new FormData();
    fd.append("delete_id", id);
    try {
      const res = await fetch(API_URL, { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) fetchSliders();
      else setError(data.message);
    } catch (err) {
      setError("Error: " + err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      file: null,
      existing_image: "",
      title: "",
      sub_title: "",
      community: "",
      description: "",
      appearance: "Y",
    });
    setIsEditing(false);
    setError(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6">Admin Community</h2>
      {error && <p className="text-red-600">{error}</p>}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow p-6 rounded-xl mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="file"
            onChange={handleChange}
            className="border p-2 rounded"
          />
          {formData.existing_image && !formData.file && (
            <img src={formData.existing_image} alt="Preview" className="w-40 h-40 object-cover rounded mb-2" />
          )}
          <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="border p-2 rounded" required />
          <input name="sub_title" value={formData.sub_title} onChange={handleChange} placeholder="Sub Title" className="border p-2 rounded" />
          <input name="community" value={formData.community} onChange={handleChange} placeholder="Community" className="border p-2 rounded" />
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="border p-2 rounded col-span-2"></textarea>
          <select name="appearance" value={formData.appearance} onChange={handleChange} className="border p-2 rounded">
            <option value="Y">Show</option>
            <option value="N">Hide</option>
          </select>
        </div>
        <div className="mt-4 flex gap-4">
          <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded">
            {isEditing ? "Update" : "Add"}
          </button>
          {isEditing && (
            <button type="button" onClick={resetForm} className="bg-gray-400 text-white px-4 py-2 rounded">
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Slider List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sliders.map((slider) => (
          <div key={slider.id} className="bg-white shadow rounded p-4">
            <img src={slider.image_url} alt={slider.title} className="w-full h-40 object-cover rounded mb-2" />
            <h3 className="font-bold">{slider.title}</h3>
            <p className="text-sm text-gray-600">{slider.sub_title}</p>
            <p className="text-sm">{slider.community}</p>
            <p className="text-xs">{slider.description}</p>
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs ${slider.appearance==="Y"?"bg-green-200 text-green-700":"bg-red-200 text-red-700"}`}>
              {slider.appearance==="Y"?"Visible":"Hidden"}
            </span>
            <div className="flex gap-3 mt-3">
              <button onClick={()=>handleEdit(slider)} className="bg-blue-500 text-white px-3 py-1 rounded">Edit</button>
              <button onClick={()=>handleDelete(slider.id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCommunity;
