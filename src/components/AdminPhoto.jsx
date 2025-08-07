import { useEffect, useState } from "react";

const API_URL = "https://www.atcnagpur.com/atc/backend/get_photos.php";

export default function AdminPhoto() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Add form state
  const [newPhoto, setNewPhoto] = useState({
    image_url: "",
    name: "",
    position: "",
    appearance: "Y",
  });

  // Edit form state
  const [editPhotoId, setEditPhotoId] = useState(null);
  const [editPhotoData, setEditPhotoData] = useState({
    image_url: "",
    name: "",
    position: "",
    appearance: "Y",
  });

  // ✅ Fetch photos
  const fetchPhotos = () => {
    setLoading(true);
    fetch(`${API_URL}?all=1`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPhotos(data.photos || []);
          setError(null);
        } else {
          setError(data.message || "Failed to load photos");
        }
      })
      .catch((err) => setError("Error fetching photos: " + err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  // ✅ Add photo
  const addPhoto = () => {
    setLoading(true);
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create", ...newPhoto }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPhotos([...photos, data.newPhoto]);
          setNewPhoto({ image_url: "", name: "", position: "", appearance: "Y" });
        } else {
          alert(data.message || "Failed to add photo");
        }
      })
      .catch((err) => alert("Error adding photo: " + err.message))
      .finally(() => setLoading(false));
  };

  // ✅ Save edited photo
  const saveEditPhoto = () => {
    setLoading(true);
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update", id: editPhotoId, ...editPhotoData }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPhotos(
            photos.map((p) =>
              p.id === editPhotoId ? { ...p, ...editPhotoData } : p
            )
          );
          setEditPhotoId(null);
        } else {
          alert(data.message || "Update failed");
        }
      })
      .catch((err) => alert("Error updating photo: " + err.message))
      .finally(() => setLoading(false));
  };

  // ✅ Delete photo
  const deletePhoto = (id) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) return;
    setLoading(true);
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPhotos(photos.filter((p) => p.id !== id));
        } else {
          alert(data.message || "Delete failed");
        }
      })
      .catch((err) => alert("Error deleting photo: " + err.message))
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Photo Management</h1>

      {loading && <p className="text-blue-600 mb-4">Loading...</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* --- Add New Photo Section --- */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Add New Photo</h2>
        <div className="bg-white shadow rounded p-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Image URL"
              value={newPhoto.image_url}
              onChange={(e) =>
                setNewPhoto({ ...newPhoto, image_url: e.target.value })
              }
              className="border p-2 rounded w-full sm:w-1/3"
            />
            <input
              type="text"
              placeholder="Name"
              value={newPhoto.name}
              onChange={(e) =>
                setNewPhoto({ ...newPhoto, name: e.target.value })
              }
              className="border p-2 rounded w-full sm:w-1/4"
            />
            <input
              type="text"
              placeholder="Position"
              value={newPhoto.position}
              onChange={(e) =>
                setNewPhoto({ ...newPhoto, position: e.target.value })
              }
              className="border p-2 rounded w-full sm:w-1/4"
            />
            <select
              value={newPhoto.appearance}
              onChange={(e) =>
                setNewPhoto({ ...newPhoto, appearance: e.target.value })
              }
              className="border p-2 rounded w-full sm:w-1/6"
            >
              <option value="Y">Show</option>
              <option value="N">Hide</option>
            </select>
            <button
              onClick={addPhoto}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Add Photo
            </button>
          </div>
        </div>
      </section>

      {/* --- Photo List Section --- */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Photo Gallery</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="bg-white shadow rounded p-4 flex flex-col items-center"
            >
              {editPhotoId === photo.id ? (
                <div className="w-full">
                  <input
                    type="text"
                    value={editPhotoData.image_url}
                    onChange={(e) =>
                      setEditPhotoData({
                        ...editPhotoData,
                        image_url: e.target.value,
                      })
                    }
                    className="border p-2 rounded w-full mb-2"
                  />
                  <input
                    type="text"
                    value={editPhotoData.name}
                    onChange={(e) =>
                      setEditPhotoData({
                        ...editPhotoData,
                        name: e.target.value,
                      })
                    }
                    className="border p-2 rounded w-full mb-2"
                  />
                  <input
                    type="text"
                    value={editPhotoData.position}
                    onChange={(e) =>
                      setEditPhotoData({
                        ...editPhotoData,
                        position: e.target.value,
                      })
                    }
                    className="border p-2 rounded w-full mb-2"
                  />
                  <select
                    value={editPhotoData.appearance}
                    onChange={(e) =>
                      setEditPhotoData({
                        ...editPhotoData,
                        appearance: e.target.value,
                      })
                    }
                    className="border p-2 rounded w-full mb-2"
                  >
                    <option value="Y">Show</option>
                    <option value="N">Hide</option>
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={saveEditPhoto}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditPhotoId(null)}
                      className="bg-gray-400 text-white px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <img
                    src={photo.image_url}
                    alt={photo.name}
                    className="w-40 h-40 object-cover rounded mb-3"
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
                      onClick={() => {
                        setEditPhotoId(photo.id);
                        setEditPhotoData(photo);
                      }}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deletePhoto(photo.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      ✕
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
