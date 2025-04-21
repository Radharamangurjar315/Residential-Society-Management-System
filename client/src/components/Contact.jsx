import React, { useEffect, useState } from "react";
import axios from "axios";

const ContactsList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [phone, setPhone] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const societyId = user?.societyId;

  const fetchContacts = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/contacts/${societyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setContacts(res.data);
    } catch (err) {
      console.error("Failed to fetch contacts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleAddContact = async (e) => {
    e.preventDefault();
    try {
      const newContact = { name, designation, phone };
      await axios.post(`${process.env.REACT_APP_API_URL}/api/contacts/add`, newContact, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage("Contact added successfully!");
      setName("");
      setDesignation("");
      setPhone("");
      setShowForm(false);
      fetchContacts(); // Refresh list after adding
    } catch (err) {
      console.error("Failed to add contact:", err);
      setMessage("Error adding contact");
    }
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Important Contacts</h2>

      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {showForm ? "Cancel" : "Add Contact"}
      </button>

      {showForm && (
        <form
          onSubmit={handleAddContact}
          className="mb-6 bg-gray-100 p-4 rounded-lg space-y-3"
        >
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded border border-gray-300"
            required
          />
          <input
            type="text"
            placeholder="Designation"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            className="w-full p-2 rounded border border-gray-300"
            required
          />
          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2 rounded border border-gray-300"
            required
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Save Contact
          </button>
          {message && <p className="text-sm text-gray-700">{message}</p>}
        </form>
      )}

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {contacts.map((contact) => (
          <div
            key={contact._id}
            className="bg-white shadow-md rounded-2xl p-4 hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold">{contact.name}</h3>
            <p className="text-gray-600">{contact.designation}</p>
            <a href={`tel:${contact.phone}`} className="text-blue-500 block mt-2">
              📞 {contact.phone}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactsList;
