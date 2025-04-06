import React, { useEffect, useState } from "react";
import axios from "axios";

const ContactsList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

 
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
    const societyId = user.societyId; 

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/contacts/${societyId}`, {
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

    fetchContacts();
  }, []);

  if (loading) return <div className="text-center py-4">Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Important Contacts</h2>
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
