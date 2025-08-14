import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://www.atcnagpur.com/atc/backend/hero_api.php";

const AdminHero = () => {
  const [data, setData] = useState({
    importantLinks: [],
    notifications: [],
    employeeCorner: [],
  });

  const [section, setSection] = useState("importantLinks");
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [multiLang, setMultiLang] = useState(false);

  const resetForm = () => {
    setForm(
      multiLang
        ? { id: null, title_eng: "", title_mar: "", link: "", status: "Y" }
        : { id: null, title: "", link: "", status: "Y" }
    );
  };

  const fetchData = async (selectedSection = section) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}?action=fetch`);
      if (res.data.success) {
        // Sort data: visible items first (status Y), then hidden items (status N), then by ID
        const sortData = (items) => {
          return [...(items || [])].sort((a, b) => {
            const aVisible = (a.Status || a.status) === "Y" || (a.Status || a.status) === "y" || (a.Status || a.status) === 1 || (a.Status || a.status) === "1";
            const bVisible = (b.Status || b.status) === "Y" || (b.Status || b.status) === "y" || (b.Status || b.status) === 1 || (b.Status || b.status) === "1";
            
            // If visibility status is different, sort by visibility (visible first)
            if (aVisible !== bVisible) {
              return bVisible - aVisible; // true (1) - false (0) = 1, false (0) - true (1) = -1
            }
            
            // If same visibility status, sort by ID
            return a.id - b.id;
          });
        };

        const sortedData = {
          importantLinks: sortData(res.data.data.importantLinks),
          notifications: sortData(res.data.data.notifications),
          employeeCorner: sortData(res.data.data.employeeCorner),
        };
        
        setData(sortedData);

        const arr = sortedData[selectedSection];
        if (arr?.[0]?.title_eng !== undefined && arr?.[0]?.title_mar !== undefined) {
          setMultiLang(true);
        } else {
          setMultiLang(false);
        }

        resetForm();
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Failed to fetch data.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData(section);
    // eslint-disable-next-line
  }, [section]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = multiLang
        ? {
            id: form.id,
            title_eng: form.title_eng || "",
            title_mar: form.title_mar || "",
            link: form.link || "",
            status: form.status || "Y",
          }
        : {
            id: form.id,
            title: form.title || "",
            link: form.link || "",
            status: form.status || "Y",
          };

      if (form.id) {
        await axios.put(`${API_URL}?action=update&section=${section}&id=${form.id}`, payload);
        alert("Item updated successfully!");
      } else {
        await axios.post(`${API_URL}?action=add&section=${section}`, payload);
        alert("Item added successfully!");
      }

      resetForm();
      fetchData();
    } catch (err) {
      console.error("Submit error:", err);
      alert("Error saving item.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await axios.delete(`${API_URL}?action=delete&section=${section}&id=${id}`);
      alert("Item deleted successfully!");
      fetchData();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting item.");
    }
  };

  const handleEdit = (item) => {
    setForm(
      multiLang
        ? {
            id: item.id,
            title_eng: item.title_eng || "",
            title_mar: item.title_mar || "",
            link: item.link || "",
            status: item.Status || item.status || "Y", // Handle both Status and status
          }
        : {
            id: item.id,
            title: item.title || "",
            link: item.link || "",
            status: item.Status || item.status || "Y", // Handle both Status and status
          }
    );
  };

  // Enhanced status display component
  const StatusDisplay = ({ status }) => {
    // Handle both 'status' and 'Status' field names from API
    const statusValue = status || "";
    const isVisible = statusValue === "Y" || statusValue === "y" || statusValue === 1 || statusValue === "1";
    
    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
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

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">
        All important links, latest notification, and employeeCorner Admin Panel
      </h1>

      {/* Section Tabs */}
      <div className="flex justify-center gap-3 mb-6">
        {["importantLinks", "notifications", "employeeCorner"].map((sec) => (
          <button
            key={sec}
            onClick={() => {
              setSection(sec);
              fetchData(sec);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              section === sec ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {sec.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}
          </button>
        ))}
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md p-4 rounded-lg mb-6 border"
      >
        <h2 className="text-lg font-semibold mb-3">
          {form.id ? "Edit Item" : "Add New Item"} ({section.replace(/([A-Z])/g, " $1")})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {multiLang ? (
            <>
              <input
                type="text"
                name="title_eng"
                placeholder="Title (English)"
                value={form.title_eng || ""}
                onChange={handleChange}
                required
                className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="title_mar"
                placeholder="Title (Marathi)"
                value={form.title_mar || ""}
                onChange={handleChange}
                required
                className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </>
          ) : (
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={form.title || ""}
              onChange={handleChange}
              required
              className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
          <input
            type="url"
            name="link"
            placeholder="Redirect Link"
            value={form.link || ""}
            onChange={handleChange}
            required
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="status"
            value={form.status || "Y"}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Y">Show (Visible)</option>
            <option value="N">Hide (Hidden)</option>
          </select>
        </div>
        <button
          type="submit"
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors font-medium"
        >
          {form.id ? "Update Item" : "Add Item"}
        </button>
        {form.id && (
          <button
            type="button"
            onClick={resetForm}
            className="mt-4 ml-3 bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors font-medium"
          >
            Cancel
          </button>
        )}
      </form>

      {/* Data Table */}
      <div className="bg-white shadow-md rounded-lg border overflow-hidden">
        <div className="p-4 bg-gray-50 border-b">
          <h2 className="text-lg font-semibold capitalize">
            {section.replace(/([A-Z])/g, " $1")} Management
          </h2>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading...</p>
            </div>
          ) : (
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="border-r p-3 text-left font-medium">ID</th>
                  {multiLang ? (
                    <>
                      <th className="border-r p-3 text-left font-medium">Title (English)</th>
                      <th className="border-r p-3 text-left font-medium">Title (Marathi)</th>
                    </>
                  ) : (
                    <th className="border-r p-3 text-left font-medium">Title</th>
                  )}
                  <th className="border-r p-3 text-left font-medium">Link</th>
                  <th className="border-r p-3 text-left font-medium">Status</th>
                  <th className="p-3 text-center font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data[section]?.length > 0 ? (
                  data[section].map((item, index) => (
                    <tr key={item.id} className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                      <td className="border-r p-3 font-medium text-gray-700">{item.id}</td>
                      {multiLang ? (
                        <>
                          <td className="border-r p-3">{item.title_eng || '-'}</td>
                          <td className="border-r p-3">{item.title_mar || '-'}</td>
                        </>
                      ) : (
                        <td className="border-r p-3">{item.title || '-'}</td>
                      )}
                      <td className="border-r p-3">
                        {item.link ? (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline break-all"
                            title={item.link}
                          >
                            {item.link.length > 50 ? `${item.link.substring(0, 50)}...` : item.link}
                          </a>
                        ) : (
                          <span className="text-gray-400">No link</span>
                        )}
                      </td>
                      <td className="border-r p-3">
                        <StatusDisplay status={item.Status || item.status} />
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                            title="Edit item"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                            title="Delete item"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={multiLang ? 6 : 5} className="text-center py-8 text-gray-500">
                      <div className="flex flex-col items-center">
                        <div className="text-4xl mb-2">📝</div>
                        <p>No records found for {section.replace(/([A-Z])/g, " $1").toLowerCase()}.</p>
                        <p className="text-sm mt-1">Add your first item using the form above.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHero;