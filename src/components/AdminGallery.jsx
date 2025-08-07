import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://www.atcnagpur.com/atc/atcbackend/get_photos.php";

const AdminGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [newPhoto, setNewPhoto] = useState({ image_url: "", name: "", position: "" });

  // ✅ Fetch photos
  const fetchPhotos = () => {
    axios
      .post(API_URL, { action: "read" })
      .then((res) => {
        if (res.data.success) {
          setPhotos(res.data.photos);
        } else {
          alert("Failed to load photos: " + res.data.message);
        }
      })
      .catch((err) => console.error("Error fetching photos:", err));
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  // ✅ Add new photo
  const addPhoto = () => {
    if (!newPhoto.image_url || !newPhoto.name || !newPhoto.position) {
      alert("Please fill all fields");
      return;
    }
    axios
      .post(API_URL, { action: "create", ...newPhoto })
      .then((res) => {
        if (res.data.success) {
          alert("Photo Added Successfully!");
          fetchPhotos();
          setNewPhoto({ image_url: "", name: "", position: "" });
        } else {
          alert("Error: " + res.data.message);
        }
      })
      .catch((err) => console.error("Error adding photo:", err));
  };

  // ✅ Update position to hidden
  const hidePhoto = (id) => {
    const photo = photos.find((p) => p.id === id);
    if (!photo) return;
    axios
      .post(API_URL, { action: "update", ...photo, position: "hidden" })
      .then((res) => {
        if (res.data.success) {
          alert("Photo Hidden!");
          fetchPhotos();
        } else {
          alert("Error hiding photo: " + res.data.message);
        }
      })
      .catch((err) => console.error("Error hiding photo:", err));
  };

  // ✅ Delete photo
  const deletePhoto = (id) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) return;
    axios
      .post(API_URL, { action: "delete", id })
      .then((res) => {
        if (res.data.success) {
          alert("Photo Deleted!");
          fetchPhotos();
        } else {
          alert("Error deleting photo: " + res.data.message);
        }
      })
      .catch((err) => console.error("Error deleting photo:", err));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-center text-indigo-700 mb-8">
        Admin Photo Gallery
      </h2>

      {/* Add Photo Section */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Add New Photo</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <textarea
            placeholder="Image URL"
            value={newPhoto.image_url}
            className="border p-3 rounded-lg w-full h-20 resize-none"
            onChange={(e) => setNewPhoto({ ...newPhoto, image_url: e.target.value })}
          />
          <textarea
            placeholder="Name"
            value={newPhoto.name}
            className="border p-3 rounded-lg w-full h-20 resize-none"
            onChange={(e) => setNewPhoto({ ...newPhoto, name: e.target.value })}
          />
          <textarea
            placeholder="Position"
            value={newPhoto.position}
            className="border p-3 rounded-lg w-full h-20 resize-none"
            onChange={(e) => setNewPhoto({ ...newPhoto, position: e.target.value })}
          />
        </div>
        <button
          className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow-md"
          onClick={addPhoto}
        >
          ➕ Add Photo
        </button>
      </div>

      {/* Photos Table */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Manage Photos</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="border p-3">Preview</th>
              <th className="border p-3">Name</th>
              <th className="border p-3">Position</th>
              <th className="border p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {photos.map((photo) => (
              <tr key={photo.id} className="text-center hover:bg-gray-50 transition">
                <td className="border p-3">
                  <img
                    src={photo.image_url}
                    alt={photo.name}
                    className="w-20 h-20 object-cover rounded-lg mx-auto"
                  />
                </td>
                <td className="border p-3 font-medium whitespace-pre-line">{photo.name}</td>
                <td className="border p-3 whitespace-pre-line">{photo.position}</td>
                <td className="border p-3 space-x-2">
                  {photo.position !== "hidden" && (
                    <button
                      onClick={() => hidePhoto(photo.id)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
                    >
                      Hide
                    </button>
                  )}
                  <button
                    onClick={() => deletePhoto(photo.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {photos.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-gray-500">
                  No photos found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminGallery;
