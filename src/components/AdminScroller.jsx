import { useEffect, useState } from "react";

export default function Admin() {
  const [texts, setTexts] = useState([]);
  const [scrollerImages, setScrollerImages] = useState([]);

  // Add states
  const [newText, setNewText] = useState({ text: "", text_mar: "", appearance: "Y" });
  const [newImage, setNewImage] = useState({ image_url: "", title: "", description: "", appearance: "Y" });

  // Edit states
  const [editTextId, setEditTextId] = useState(null);
  const [editTextData, setEditTextData] = useState({ text: "", text_mar: "", appearance: "Y" });

  const [editImageId, setEditImageId] = useState(null);
  const [editImageData, setEditImageData] = useState({ image_url: "", title: "", description: "", appearance: "Y" });

  // Enhanced status display component
  const StatusDisplay = ({ status, size = "sm" }) => {
    const isVisible = status === "Y" || status === "y" || status === 1 || status === "1";
    
    const sizeClasses = size === "sm" ? "text-xs px-2 py-1" : "text-sm px-3 py-1";
    
    return (
      <span
        className={`inline-flex items-center rounded-full font-semibold ${sizeClasses} ${
          isVisible 
            ? "bg-green-100 text-green-800 border border-green-200" 
            : "bg-red-100 text-red-800 border border-red-200"
        }`}
      >
        <span className="mr-1">
          {isVisible ? "●" : "●"}
        </span>
        {isVisible ? "Visible" : "Hidden"}
      </span>
    );
  };

  // ✅ Fetch Data
  const fetchData = () => {
    fetch("https://www.atcnagpur.com/atc/backend/scroller.php?action=fetch")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Sort data by ID in ascending order
          const sortedTexts = (data.texts || []).sort((a, b) => a.id - b.id);
          const sortedImages = (data.images || []).sort((a, b) => a.id - b.id);
          
          setTexts(sortedTexts);
          setScrollerImages(sortedImages);
        }
      })
      .catch((err) => console.error("Fetch error:", err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Add Text
  const addText = () => {
    if (!newText.text.trim()) {
      alert("Please enter English text");
      return;
    }

    fetch("https://www.atcnagpur.com/atc/backend/scroller.php?action=add_text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newText),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTexts([...texts, data.newText].sort((a, b) => a.id - b.id));
          setNewText({ text: "", text_mar: "", appearance: "Y" });
          alert("Text added successfully!");
        } else alert(data.message);
      })
      .catch((err) => {
        console.error("Add text error:", err);
        alert("Error adding text");
      });
  };

  // ✅ Edit Text
  const saveEditText = () => {
    if (!editTextData.text.trim()) {
      alert("Please enter English text");
      return;
    }

    fetch(`https://www.atcnagpur.com/atc/backend/scroller.php?action=edit_text&id=${editTextId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editTextData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTexts(texts.map((t) => (t.id === editTextId ? { ...t, ...editTextData } : t)));
          setEditTextId(null);
          alert("Text updated successfully!");
        } else alert(data.message);
      })
      .catch((err) => {
        console.error("Edit text error:", err);
        alert("Error updating text");
      });
  };

  // ✅ Delete Text
  const deleteText = (id) => {
    if (!confirm("Are you sure you want to delete this text?")) return;

    fetch(`https://www.atcnagpur.com/atc/backend/scroller.php?action=delete_text&id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTexts(texts.filter((t) => t.id !== id));
          alert("Text deleted successfully!");
        } else {
          alert("Error deleting text");
        }
      })
      .catch((err) => {
        console.error("Delete text error:", err);
        alert("Error deleting text");
      });
  };

  // ✅ Add Image
  const addImage = () => {
    if (!newImage.image_url.trim()) {
      alert("Please enter image URL");
      return;
    }

    fetch("https://www.atcnagpur.com/atc/backend/scroller.php?action=add_image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newImage),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setScrollerImages([...scrollerImages, data.newImage].sort((a, b) => a.id - b.id));
          setNewImage({ image_url: "", title: "", description: "", appearance: "Y" });
          alert("Image added successfully!");
        } else alert(data.message);
      })
      .catch((err) => {
        console.error("Add image error:", err);
        alert("Error adding image");
      });
  };

  // ✅ Edit Image
  const saveEditImage = () => {
    if (!editImageData.image_url.trim()) {
      alert("Please enter image URL");
      return;
    }

    fetch(`https://www.atcnagpur.com/atc/backend/scroller.php?action=edit_image&id=${editImageId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editImageData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setScrollerImages(scrollerImages.map((img) =>
            img.id === editImageId ? { ...img, ...editImageData } : img
          ));
          setEditImageId(null);
          alert("Image updated successfully!");
        } else alert(data.message);
      })
      .catch((err) => {
        console.error("Edit image error:", err);
        alert("Error updating image");
      });
  };

  // ✅ Delete Image
  const deleteImage = (id) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    fetch(`https://www.atcnagpur.com/atc/backend/scroller.php?action=delete_image&id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setScrollerImages(scrollerImages.filter((img) => img.id !== id));
          alert("Image deleted successfully!");
        } else {
          alert("Error deleting image");
        }
      })
      .catch((err) => {
        console.error("Delete image error:", err);
        alert("Error deleting image");
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Scroller Admin Panel</h1>

        {/* --- Texts Section --- */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-semibold text-gray-700">Scrolling Texts</h2>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {texts.length} items
            </span>
          </div>

          {/* Add New Text */}
          <div className="bg-white shadow-lg rounded-lg p-6 mb-6 border">
            <h3 className="font-semibold mb-4 text-lg text-gray-700">Add New Text</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="English Text *"
                value={newText.text}
                onChange={(e) => setNewText({ ...newText, text: e.target.value })}
                className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Marathi Text"
                value={newText.text_mar}
                onChange={(e) => setNewText({ ...newText, text_mar: e.target.value })}
                className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <select
                value={newText.appearance}
                onChange={(e) => setNewText({ ...newText, appearance: e.target.value })}
                className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="Y">Show (Visible)</option>
                <option value="N">Hide (Hidden)</option>
              </select>
              <button
                onClick={addText}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Add Text
              </button>
            </div>
          </div>

          {/* Existing Texts */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden border">
            <div className="p-4 bg-gray-50 border-b">
              <h3 className="font-semibold text-gray-700">Manage Texts</h3>
            </div>
            <div className="divide-y">
              {texts.length > 0 ? (
                texts.map((txt) => (
                  <div key={txt.id} className="p-4 hover:bg-gray-50 transition-colors">
                    {editTextId === txt.id ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <input
                            type="text"
                            value={editTextData.text}
                            onChange={(e) => setEditTextData({ ...editTextData, text: e.target.value })}
                            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="English Text"
                          />
                          <input
                            type="text"
                            value={editTextData.text_mar}
                            onChange={(e) => setEditTextData({ ...editTextData, text_mar: e.target.value })}
                            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Marathi Text"
                          />
                          <select
                            value={editTextData.appearance}
                            onChange={(e) => setEditTextData({ ...editTextData, appearance: e.target.value })}
                            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="Y">Show (Visible)</option>
                            <option value="N">Hide (Hidden)</option>
                          </select>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={saveEditText} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                            Save Changes
                          </button>
                          <button onClick={() => setEditTextId(null)} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start">
                        <div className="flex-1 mr-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm text-gray-500 font-medium">ID: {txt.id}</span>
                            <StatusDisplay status={txt.appearance} />
                          </div>
                          <p className="font-medium text-gray-800 mb-1">{txt.text || "No English text"}</p>
                          <p className="text-gray-600 text-sm">{txt.text_mar || "No Marathi text"}</p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => { setEditTextId(txt.id); setEditTextData(txt); }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteText(txt.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <div className="text-4xl mb-2">📝</div>
                  <p>No scrolling texts found.</p>
                  <p className="text-sm mt-1">Add your first text using the form above.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* --- Images Section --- */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-semibold text-gray-700">Scroller Images</h2>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
              {scrollerImages.length} items
            </span>
          </div>

          {/* Add New Image */}
          <div className="bg-white shadow-lg rounded-lg p-6 mb-6 border">
            <h3 className="font-semibold mb-4 text-lg text-gray-700">Add New Image</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <input
                type="text"
                placeholder="Image URL *"
                value={newImage.image_url}
                onChange={(e) => setNewImage({ ...newImage, image_url: e.target.value })}
                className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Title"
                value={newImage.title}
                onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Description"
                value={newImage.description}
                onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
                className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={newImage.appearance}
                onChange={(e) => setNewImage({ ...newImage, appearance: e.target.value })}
                className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Y">Show (Visible)</option>
                <option value="N">Hide (Hidden)</option>
              </select>
              <button
                onClick={addImage}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Add Image
              </button>
            </div>
          </div>

          {/* Existing Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {scrollerImages.length > 0 ? (
              scrollerImages.map((img) => (
                <div key={img.id} className="bg-white shadow-lg rounded-lg overflow-hidden border hover:shadow-xl transition-shadow">
                  {editImageId === img.id ? (
                    <div className="p-4 space-y-3">
                      <input
                        type="text"
                        value={editImageData.image_url}
                        onChange={(e) => setEditImageData({ ...editImageData, image_url: e.target.value })}
                        className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Image URL"
                      />
                      <input
                        type="text"
                        value={editImageData.title}
                        onChange={(e) => setEditImageData({ ...editImageData, title: e.target.value })}
                        className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Title"
                      />
                      <input
                        type="text"
                        value={editImageData.description}
                        onChange={(e) => setEditImageData({ ...editImageData, description: e.target.value })}
                        className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Description"
                      />
                      <select
                        value={editImageData.appearance}
                        onChange={(e) => setEditImageData({ ...editImageData, appearance: e.target.value })}
                        className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Y">Show (Visible)</option>
                        <option value="N">Hide (Hidden)</option>
                      </select>
                      <div className="flex gap-2">
                        <button onClick={saveEditImage} className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-1">
                          Save
                        </button>
                        <button onClick={() => setEditImageId(null)} className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-1">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="relative">
                        <img 
                          src={img.image_url} 
                          alt={img.title || "Image"} 
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="hidden w-full h-48 bg-gray-200 items-center justify-center text-gray-500">
                          <span>Image not found</span>
                        </div>
                        <div className="absolute top-2 right-2">
                          <StatusDisplay status={img.appearance} />
                        </div>
                        <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                          ID: {img.id}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-800 mb-2">{img.title || "Untitled"}</h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{img.description || "No description"}</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => { setEditImageId(img.id); setEditImageData(img); }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-1"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteImage(img.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-1"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                <div className="text-6xl mb-4">🖼️</div>
                <p className="text-lg">No scroller images found.</p>
                <p className="text-sm mt-1">Add your first image using the form above.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}