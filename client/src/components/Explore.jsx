import { useRef, useEffect } from "react";

export default function DashboardCards() {
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const handleCardClick = (cardName) => {
    if (!mounted.current) return;
    
    const routes = {
      "POLLS": "/polls",
      "NOTICES": "/notices",
      "EVENTS": "/events",
      "Maintenance and Bills": "/maintenanceform",
      "Maintenance Dashboard": "/maintenancedashboard",
      "Media Upload": "/adminupload",
      "Media Gallery": "/mediagallery",
      "File a Complaint": "/filecomplaint",
      "Complaints Dashboard": "/admincomplaints",
      "Contacts Directory": "/contacts",
      "Visitor Records": "/visitors"
    };

    if (routes[cardName]) {
      window.location.href = routes[cardName];
    }
  };

  const cards = [
    {
      title: "POLLS",
      description: "Lets Vote!!",
      shortDesc: "Vote on community decisions",
      gradientFrom: "from-blue-500",
      gradientTo: "to-blue-600",
      textColor: "text-blue-100",
      icon: "fas fa-chart-bar"
    },
    {
      title: "NOTICES",
      description: "Get all the updates!!",
      shortDesc: "Important announcements",
      gradientFrom: "from-amber-500",
      gradientTo: "to-yellow-600",
      textColor: "text-amber-100",
      icon: "fas fa-bullhorn"
    },
    {
      title: "EVENTS",
      description: "Stay Updated!!",
      shortDesc: "Upcoming community events",
      gradientFrom: "from-green-500",
      gradientTo: "to-emerald-600",
      textColor: "text-green-100",
      icon: "fas fa-calendar-alt"
    },
    {
      title: "Maintenance and Bills",
      description: "Register Your Bills!!",
      shortDesc: "Record your maintenance and bill payments",
      gradientFrom: "from-purple-500",
      gradientTo: "to-violet-600",
      textColor: "text-purple-100",
      icon: "fas fa-file-invoice-dollar"
    },
    {
      title: "Maintenance Dashboard",
      description: "Register Your Bills!!",
      shortDesc: "Track and verify your status of payments",
      gradientFrom: "from-green-500",
      gradientTo: "to-green-600",
      textColor: "text-grey-100",
      icon: "fas fa-file-invoice-dollar"
    },
    {
      title: "Media Upload",
      description: "Upload your media easily and securely!!",
      shortDesc: "Share photos and videos",
      gradientFrom: "from-pink-500",
      gradientTo: "to-rose-600",
      textColor: "text-pink-100",
      icon: "fas fa-cloud-upload-alt"
    },
    {
      title: "Media Gallery",
      description: "See all the media!!",
      shortDesc: "Browse community media",
      gradientFrom: "from-indigo-500",
      gradientTo: "to-indigo-700",
      textColor: "text-indigo-100",
      icon: "fas fa-images"
    },
    {
      title: "File a Complaint",
      description: "File a complaint easily and securely!!",
      shortDesc: "Submit issues and concerns",
      gradientFrom: "from-red-500",
      gradientTo: "to-red-700",
      textColor: "text-red-100",
      icon: "fas fa-exclamation-circle"
    },
    {
      title: "Complaints Dashboard",
      description: "See all the complaints!!",
      shortDesc: "Track complaint status",
      gradientFrom: "from-orange-500",
      gradientTo: "to-orange-700",
      textColor: "text-orange-100",
      icon: "fas fa-tasks"
    },
    {
      title: "Contacts Directory",
      description: "Get all the contacts!!",
      shortDesc: "Find important contacts",
      gradientFrom: "from-teal-500",
      gradientTo: "to-teal-700",
      textColor: "text-teal-100",
      icon: "fas fa-address-book"
    },
    {
      title: "Visitor Records",
      description: "View and track all the visitors!",
      shortDesc: "Manage visitors and guests",
      gradientFrom: "from-cyan-500",
      gradientTo: "to-cyan-700",
      textColor: "text-cyan-100",
      icon: "fas fa-user-friends"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Community Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div 
            key={index}
            className={`bg-gradient-to-br ${card.gradientFrom} ${card.gradientTo} text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition duration-300 hover:-translate-y-1 cursor-pointer group`}
            onClick={() => handleCardClick(card.title)}
          >
            <div className="flex flex-col items-center text-center">
              <div className="text-3xl mb-4 group-hover:scale-110 transition duration-300">
                <i className={card.icon}></i>
              </div>
              <h4 className="text-lg font-bold">{card.title}</h4>
              <p className={`text-xs mt-2 ${card.textColor}`}>{card.shortDesc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}