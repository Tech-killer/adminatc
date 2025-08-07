import React, { useEffect, useState } from "react";

const API_URL = "https://www.atcnagpur.com/atc/backend/slider.php";

const Admincommunity = () => {
  const [sliders, setSliders] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    image_url: "",
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
      if (data.success) setSliders(data.data);
      else setError(data.message);
    } catch (err) {
      setError("Error fetching sliders: " + err.message);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  // Input handler
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Add or Update
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

  // Edit
  const handleEdit = (slider) => {
    setFormData(slider);
    setIsEditing(true);
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this slider?")) return;
    try {
      const res = await fetch(API_URL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) fetchSliders();
      else setError(data.message);
    } catch (err) {
      setError("Error: " + err.message);
    }
  };

  // Reset
  const resetForm = () => {
    setFormData({
      id: null,
      image_url: "",
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
      <h2 className="text-3xl font-bold text-indigo-700 mb-6">Admin Community
      </h2>

      {error && <p className="text-red-600">{error}</p>}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow p-6 rounded-xl mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="image_url" value={formData.image_url} onChange={handleChange} placeholder="Image URL" className="border p-2 rounded" required />
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

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sliders.map((slider) => (
          <div key={slider.id} className="bg-white shadow rounded p-4">
            <img src={slider.image_url} alt={slider.title} className="w-full h-40 object-cover rounded mb-2" />
            <h3 className="font-bold">{slider.title}</h3>
            <p className="text-sm text-gray-600">{slider.sub_title}</p>
            <p className="text-sm">{slider.community}</p>
            <p className="text-xs">{slider.description}</p>
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs ${slider.appearance === "Y" ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"}`}>
              {slider.appearance === "Y" ? "Visible" : "Hidden"}
            </span>
            <div className="flex gap-3 mt-3">
              <button onClick={() => handleEdit(slider)} className="bg-blue-500 text-white px-3 py-1 rounded">Edit</button>
              <button onClick={() => handleDelete(slider.id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admincommunity;
