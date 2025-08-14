import { useEffect, useState } from "react";

export default function Admin() {
  // -------------------- STATES --------------------
  const [texts, setTexts] = useState([]);
  const [scrollerImages, setScrollerImages] = useState([]);

  // Add new
  const [newText, setNewText] = useState({ text: "", text_mar: "", appearance: "Y" });
  const [newImage, setNewImage] = useState({ file: null, title: "", description: "", appearance: "Y" });

  // Edit
  const [editTextId, setEditTextId] = useState(null);
  const [editTextData, setEditTextData] = useState({ text: "", text_mar: "", appearance: "Y" });

  const [editImageId, setEditImageId] = useState(null);
  const [editImageData, setEditImageData] = useState({ file: null, image_url: "", title: "", description: "", appearance: "Y" });

  // -------------------- COMPONENTS --------------------
  const StatusDisplay = ({ status }) => {
    const isVisible = status === "Y" || status === "y" || status === 1 || status === "1";
    return (
      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${isVisible ? "bg-green-100 text-green-800 border border-green-200" : "bg-red-100 text-red-800 border border-red-200"}`}>
        <span className="mr-1">●</span>
        {isVisible ? "Visible" : "Hidden"}
      </span>
    );
  };

  // -------------------- FETCH DATA --------------------
  const fetchData = () => {
    fetch("https://www.atcnagpur.com/atc/backend/scroller.php?action=fetch")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTexts((data.texts || []).sort((a, b) => a.id - b.id));
          setScrollerImages((data.images || []).sort((a, b) => a.id - b.id));
        }
      })
      .catch(err => console.error("Fetch error:", err));
  };

  useEffect(() => { fetchData(); }, []);

  // -------------------- TEXT CRUD --------------------
  const addText = () => {
    if (!newText.text.trim()) return alert("Please enter English text");
    fetch("https://www.atcnagpur.com/atc/backend/scroller.php?action=add_text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newText),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTexts([...texts, data.newText].sort((a, b) => a.id - b.id));
          setNewText({ text: "", text_mar: "", appearance: "Y" });
        } else alert(data.message);
      })
      .catch(() => alert("Error adding text"));
  };

  const saveEditText = () => {
    if (!editTextData.text.trim()) return alert("Please enter English text");
    fetch(`https://www.atcnagpur.com/atc/backend/scroller.php?action=edit_text&id=${editTextId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editTextData),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTexts(texts.map(t => t.id === editTextId ? { ...t, ...editTextData } : t));
          setEditTextId(null);
        } else alert(data.message);
      })
      .catch(() => alert("Error updating text"));
  };

  const deleteText = id => {
    if (!confirm("Are you sure?")) return;
    fetch(`https://www.atcnagpur.com/atc/backend/scroller.php?action=delete_text&id=${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setTexts(texts.filter(t => t.id !== id));
        else alert("Error deleting text");
      })
      .catch(() => alert("Error deleting text"));
  };

  // -------------------- IMAGE CRUD --------------------
  const addImage = () => {
    if (!newImage.file) return alert("Please select a PNG or JPEG image");
    const formData = new FormData();
    formData.append("file", newImage.file);
    formData.append("title", newImage.title);
    formData.append("description", newImage.description);
    formData.append("appearance", newImage.appearance);

    fetch("https://www.atcnagpur.com/atc/backend/scroller.php?action=add_image", {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setScrollerImages([...scrollerImages, data.newImage].sort((a, b) => a.id - b.id));
          setNewImage({ file: null, title: "", description: "", appearance: "Y" });
        } else alert(data.message);
      })
      .catch(() => alert("Error adding image"));
  };

  const saveEditImage = () => {
    if (!editImageData.file && !editImageData.image_url) return alert("Please select a PNG or JPEG image");
    const formData = new FormData();
    if (editImageData.file) formData.append("file", editImageData.file);
    formData.append("existing_image", editImageData.image_url || "");
    formData.append("title", editImageData.title);
    formData.append("description", editImageData.description);
    formData.append("appearance", editImageData.appearance);

    fetch(`https://www.atcnagpur.com/atc/backend/scroller.php?action=edit_image&id=${editImageId}`, {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setScrollerImages(scrollerImages.map(img => img.id === editImageId ? { ...img, ...data.updatedImage } : img));
          setEditImageId(null);
        } else alert(data.message);
      })
      .catch(() => alert("Error updating image"));
  };

  const deleteImage = id => {
    if (!confirm("Are you sure?")) return;
    fetch(`https://www.atcnagpur.com/atc/backend/scroller.php?action=delete_image&id=${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setScrollerImages(scrollerImages.filter(img => img.id !== id));
        else alert("Error deleting image");
      })
      .catch(() => alert("Error deleting image"));
  };

  // -------------------- JSX --------------------
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Scroller Admin Panel</h1>

        {/* ---------- SCROLLER TEXT ---------- */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Scrolling Texts</h2>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">{texts.length} items</span>
          </div>

          {/* Add Text */}
          <div className="bg-white p-6 mb-6 rounded-lg shadow border grid grid-cols-1 md:grid-cols-4 gap-4">
            <input type="text" placeholder="English Text *" value={newText.text} onChange={e => setNewText({ ...newText, text: e.target.value })} className="border p-2 rounded" />
            <input type="text" placeholder="Marathi Text" value={newText.text_mar} onChange={e => setNewText({ ...newText, text_mar: e.target.value })} className="border p-2 rounded" />
            <select value={newText.appearance} onChange={e => setNewText({ ...newText, appearance: e.target.value })} className="border p-2 rounded">
              <option value="Y">Show</option>
              <option value="N">Hide</option>
            </select>
            <button onClick={addText} className="bg-green-600 text-white px-4 py-2 rounded">Add Text</button>
          </div>

          {/* Manage Text */}
          <div className="bg-white p-4 rounded-lg shadow border divide-y">
            {texts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No texts found.</div>
            ) : texts.map(txt => (
              <div key={txt.id} className="py-3 flex justify-between items-start">
                {editTextId === txt.id ? (
                  <div className="flex-1 space-y-2">
                    <input type="text" value={editTextData.text} onChange={e => setEditTextData({ ...editTextData, text: e.target.value })} className="border p-2 rounded w-full" placeholder="English Text" />
                    <input type="text" value={editTextData.text_mar} onChange={e => setEditTextData({ ...editTextData, text_mar: e.target.value })} className="border p-2 rounded w-full" placeholder="Marathi Text" />
                    <select value={editTextData.appearance} onChange={e => setEditTextData({ ...editTextData, appearance: e.target.value })} className="border p-2 rounded w-full">
                      <option value="Y">Show</option>
                      <option value="N">Hide</option>
                    </select>
                    <div className="flex gap-2 mt-2">
                      <button onClick={saveEditText} className="bg-green-600 text-white px-3 py-1 rounded flex-1">Save</button>
                      <button onClick={() => setEditTextId(null)} className="bg-gray-500 text-white px-3 py-1 rounded flex-1">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1"><span>ID: {txt.id}</span><StatusDisplay status={txt.appearance} /></div>
                      <p className="font-medium">{txt.text}</p>
                      <p className="text-gray-600 text-sm">{txt.text_mar}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditTextId(txt.id); setEditTextData(txt); }} className="bg-blue-600 text-white px-3 py-1 rounded">Edit</button>
                      <button onClick={() => deleteText(txt.id)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ---------- SCROLLER IMAGES ---------- */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Scroller Images</h2>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">{scrollerImages.length} items</span>
          </div>

          {/* Add Image */}
          <div className="bg-white p-6 mb-6 rounded-lg shadow border grid grid-cols-1 md:grid-cols-4 gap-4">
            <input type="file" accept=".png,.jpeg,.jpg" onChange={e => setNewImage({ ...newImage, file: e.target.files[0] })} className="border p-2 rounded" />
            <input type="text" placeholder="Title" value={newImage.title} onChange={e => setNewImage({ ...newImage, title: e.target.value })} className="border p-2 rounded" />
            <input type="text" placeholder="Description" value={newImage.description} onChange={e => setNewImage({ ...newImage, description: e.target.value })} className="border p-2 rounded" />
            <select value={newImage.appearance} onChange={e => setNewImage({ ...newImage, appearance: e.target.value })} className="border p-2 rounded">
              <option value="Y">Show</option>
              <option value="N">Hide</option>
            </select>
            <button onClick={addImage} className="bg-blue-600 text-white px-4 py-2 rounded">Add Image</button>
          </div>

          {/* Manage Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {scrollerImages.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">No images found.</div>
            ) : scrollerImages.map(img => (
              <div key={img.id} className="bg-white shadow rounded overflow-hidden border">
                {editImageId === img.id ? (
                  <div className="p-4 space-y-2">
                    <input type="file" accept=".png,.jpeg,.jpg" onChange={e => setEditImageData({ ...editImageData, file: e.target.files[0] })} className="border p-2 rounded w-full" />
                    <input type="text" value={editImageData.title} onChange={e => setEditImageData({ ...editImageData, title: e.target.value })} className="border p-2 rounded w-full" placeholder="Title" />
                    <input type="text" value={editImageData.description} onChange={e => setEditImageData({ ...editImageData, description: e.target.value })} className="border p-2 rounded w-full" placeholder="Description" />
                    <select value={editImageData.appearance} onChange={e => setEditImageData({ ...editImageData, appearance: e.target.value })} className="border p-2 rounded w-full">
                      <option value="Y">Show</option>
                      <option value="N">Hide</option>
                    </select>
                    <div className="flex gap-2 mt-2">
                      <button onClick={saveEditImage} className="bg-green-600 text-white px-3 py-1 rounded flex-1">Save</button>
                      <button onClick={() => setEditImageId(null)} className="bg-gray-500 text-white px-3 py-1 rounded flex-1">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <img src={img.image_url} alt={img.title} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span>ID: {img.id}</span>
                        <StatusDisplay status={img.appearance} />
                      </div>
                      <h3 className="font-semibold">{img.title || "Untitled"}</h3>
                      <p className="text-sm text-gray-600">{img.description || "No description"}</p>
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => { setEditImageId(img.id); setEditImageData(img); }} className="bg-blue-600 text-white px-3 py-1 rounded flex-1">Edit</button>
                        <button onClick={() => deleteImage(img.id)} className="bg-red-600 text-white px-3 py-1 rounded flex-1">Delete</button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
