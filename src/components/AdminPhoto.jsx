import { useEffect, useState } from "react";

const API_URL = "https://www.atcnagpur.com/atc/backend/get_photos.php";
const IMAGE_BASE_URL = "https://www.atcnagpur.com/atc/backend/photos-2025/";

export default function AdminPhoto() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [newPhoto, setNewPhoto] = useState({
    file: null,
    preview: "",
    name: "",
    position: "",
    appearance: "Y",
  });

  const [editPhotoId, setEditPhotoId] = useState(null);
  const [editPhotoData, setEditPhotoData] = useState({
    file: null,
    preview: "",
    name: "",
    position: "",
    appearance: "Y",
    existing_image: "", // <-- track original image URL
  });

  const revokePreview = (url) => { if (url) URL.revokeObjectURL(url); };

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}?action=read&all=1`, { method: "GET", cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        // Sort photos: visible items first, then hidden items
        const sortedPhotos = [...(Array.isArray(data.photos) ? data.photos : [])].sort((a, b) => {
          const aVisible = a.appearance === "Y" || a.appearance === "y" || a.appearance === 1 || a.appearance === "1";
          const bVisible = b.appearance === "Y" || b.appearance === "y" || b.appearance === 1 || b.appearance === "1";
          
          // If visibility status is different, sort by visibility (visible first)
          if (aVisible !== bVisible) {
            return bVisible - aVisible; // true (1) - false (0) = 1, false (0) - true (1) = -1
          }
          
          // If same visibility status, sort by ID
          return a.id - b.id;
        });
        
        setPhotos(sortedPhotos);
      } else setError(data.message || "Failed to load photos");
    } catch (err) { setError("Error fetching photos: " + err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchPhotos();
    return () => {
      revokePreview(newPhoto.preview);
      revokePreview(editPhotoData.preview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateImage = (file) => {
    if (!file) return "No file selected";
    if (!file.type.startsWith("image/")) return "Please select an image file";
    if (file.size > 8 * 1024 * 1024) return "File too large (max 8MB)";
    return null;
  };

  const addPhoto = async () => {
    if (!newPhoto.file) return alert("Please select an image file");
    const err = validateImage(newPhoto.file);
    if (err) return alert(err);

    setLoading(true);
    const formData = new FormData();
    formData.append("action", "create");
    formData.append("file", newPhoto.file, newPhoto.file.name);
    formData.append("name", newPhoto.name);
    formData.append("position", newPhoto.position);
    formData.append("appearance", newPhoto.appearance);

    try {
      const res = await fetch(API_URL, { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        fetchPhotos();
        revokePreview(newPhoto.preview);
        setNewPhoto({ file: null, preview: "", name: "", position: "", appearance: "Y" });
      } else alert(data.message || "Failed to add photo");
    } catch (err) { alert("Error adding photo: " + err.message); }
    finally { setLoading(false); }
  };

  const saveEditPhoto = async () => {
    if (!editPhotoId) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("action", "update");
    formData.append("id", editPhotoId);

    // send new file if selected
    if (editPhotoData.file) {
      const err = validateImage(editPhotoData.file);
      if (err) { alert(err); setLoading(false); return; }
      formData.append("file", editPhotoData.file, editPhotoData.file.name);
    } else {
      // send existing image URL to preserve it
      formData.append("existing_image", editPhotoData.existing_image);
    }

    formData.append("name", editPhotoData.name);
    formData.append("position", editPhotoData.position);
    formData.append("appearance", editPhotoData.appearance);

    try {
      const res = await fetch(API_URL, { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        fetchPhotos();
        revokePreview(editPhotoData.preview);
        setEditPhotoId(null);
      } else alert(data.message || "Update failed");
    } catch (err) { alert("Error updating photo: " + err.message); }
    finally { setLoading(false); }
  };

  const deletePhoto = async (id) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) return;

    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        body: new URLSearchParams({ action: "delete", id: String(id) }),
      });
      const data = await res.json();
      if (data.success) fetchPhotos();
      else alert(data.message || "Delete failed");
    } catch (err) { alert("Error deleting photo: " + err.message); }
    finally { setLoading(false); }
  };

  const getImageSrc = (url) => (!url ? "" : /^https?:\/\//i.test(url) ? url : IMAGE_BASE_URL + url.replace(/^\/+/, ""));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Photo Management</h1>
      {loading && <p className="text-blue-600 mb-4">Loading...</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Add New Photo */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Add New Photo</h2>
        <div className="bg-white shadow rounded p-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  revokePreview(newPhoto.preview);
                  setNewPhoto({ ...newPhoto, file, preview: URL.createObjectURL(file) });
                }
              }}
              className="border p-2 rounded w-full sm:w-1/3"
            />
            {newPhoto.preview && <img src={newPhoto.preview} alt="Preview" className="w-16 h-16 object-cover rounded" />}
            <input type="text" placeholder="Name" value={newPhoto.name} onChange={(e) => setNewPhoto({ ...newPhoto, name: e.target.value })} className="border p-2 rounded w-full sm:w-1/4" />
            <input type="text" placeholder="Position" value={newPhoto.position} onChange={(e) => setNewPhoto({ ...newPhoto, position: e.target.value })} className="border p-2 rounded w-full sm:w-1/4" />
            <select value={newPhoto.appearance} onChange={(e) => setNewPhoto({ ...newPhoto, appearance: e.target.value })} className="border p-2 rounded w-full sm:w-1/6">
              <option value="Y">Show</option>
              <option value="N">Hide</option>
            </select>
            <button onClick={addPhoto} className="bg-green-600 text-white px-4 py-2 rounded">Add Photo</button>
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Photo Gallery</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <div key={photo.id} className="bg-white shadow rounded p-4 flex flex-col items-center">
              {editPhotoId === photo.id ? (
                <div className="w-full">
                  <input type="file" accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      revokePreview(editPhotoData.preview);
                      setEditPhotoData({ ...editPhotoData, file, preview: URL.createObjectURL(file) });
                    }
                  }} className="border p-2 rounded w-full mb-2" />
                  {editPhotoData.preview && <img src={editPhotoData.preview} alt="Preview" className="w-20 h-20 object-cover rounded mb-2" />}
                  <input type="text" value={editPhotoData.name} onChange={(e) => setEditPhotoData({ ...editPhotoData, name: e.target.value })} className="border p-2 rounded w-full mb-2" />
                  <input type="text" value={editPhotoData.position} onChange={(e) => setEditPhotoData({ ...editPhotoData, position: e.target.value })} className="border p-2 rounded w-full mb-2" />
                  <select value={editPhotoData.appearance} onChange={(e) => setEditPhotoData({ ...editPhotoData, appearance: e.target.value })} className="border p-2 rounded w-full mb-2">
                    <option value="Y">Show</option>
                    <option value="N">Hide</option>
                  </select>
                  <div className="flex gap-2">
                    <button onClick={saveEditPhoto} className="bg-green-600 text-white px-3 py-1 rounded">Save</button>
                    <button onClick={() => { revokePreview(editPhotoData.preview); setEditPhotoId(null); }} className="bg-gray-400 text-white px-3 py-1 rounded">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <img src={getImageSrc(photo.image_url)} alt={photo.name} className="w-40 h-40 object-cover rounded mb-3" onError={(e) => { e.currentTarget.src = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="12" fill="#9ca3af">No Image</text></svg>'); }} />
                  <h3 className="font-semibold">{photo.name}</h3>
                  <p className="text-sm text-gray-600">{photo.position}</p>
                  <span className={`mt-2 text-xs px-3 py-1 rounded-full ${photo.appearance === "Y" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{photo.appearance === "Y" ? "Visible" : "Hidden"}</span>
                  <div className="flex gap-3 mt-4">
                    <button onClick={() => {
                      setEditPhotoId(photo.id);
                      setEditPhotoData({ file: null, preview: "", name: photo.name || "", position: photo.position || "", appearance: photo.appearance || "Y", existing_image: photo.image_url });
                    }} className="bg-blue-600 text-white px-3 py-1 rounded">Edit</button>
                    <button onClick={() => deletePhoto(photo.id)} className="bg-red-500 text-white px-3 py-1 rounded">✕</button>
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
