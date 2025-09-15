import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GoogleMap from "../components/GoogleMap/GoogleMap";

export function CharityDashboard() {
  const navigate = useNavigate();
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check authentication when component mounts
  useEffect(() => {
    const authData = localStorage.getItem('charityAuth');
    if (!authData) {
      navigate('/charity-login');
      return;
    }

    try {
      const { isAuthenticated } = JSON.parse(authData);
      if (!isAuthenticated) {
        navigate('/charity-login');
      }
    } catch (err) {
      navigate('/charity-login');
    }
  }, [navigate]);
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statsData, setStatsData] = useState({
    total: 0,
    pending: 0,
    scheduled: 0,
    completed: 0
  });

  useEffect(() => {
    // Fetch pickup data when component mounts
    fetchPickups();
  }, []);

  useEffect(() => {
    // Update stats whenever pickups data changes
    const stats = pickups.reduce((acc, pickup) => {
      acc.total++;
      acc[pickup.status]++;
      return acc;
    }, { total: 0, pending: 0, scheduled: 0, completed: 0 });
    setStatsData(stats);
  }, [pickups]);

  const fetchPickups = async () => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      
      console.log('Fetching pickups from API...');
      const response = await fetch('http://localhost:5000/api/charity/pickups');
      console.log('API Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Received pickup data:', data);
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received from server');
      }
      
      setPickups(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching pickup data:", err);
      setError(err.message || "Failed to load pickup data. Please try again later.");
      setPickups([]); // Clear any partial data
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusUpdate = async (pickupId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/charity/pickups/${pickupId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Refresh the pickups list
      fetchPickups();
    } catch (err) {
      console.error("Error updating pickup status:", err);
      setError("Failed to update pickup status. Please try again.");
    }
  };

  const filteredPickups = pickups.filter(pickup => {
    const matchesSearch = pickup.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pickup.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || pickup.status === activeTab;
    return matchesSearch && matchesTab;
  });

  if (loading) {
    return <div style={styles.loadingContainer}>Loading...</div>;
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorMessage}>
          <h3 style={styles.errorTitle}>Error Loading Data</h3>
          <p>{error}</p>
          <button 
            onClick={fetchPickups}
            style={styles.retryButton}
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  const handleSchedulePickup = (pickup) => {
    setSelectedPickup(pickup);
    setShowModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('charityAuth');
    navigate('/charity-login');
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPickup(null);
  };

  return (
    <div style={styles.pageContainer}>
      {/* Modal for scheduling pickup */}
      {showModal && selectedPickup && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>Schedule Pickup</h2>
            <div style={styles.modalContent}>
              <div style={styles.modalDetails}>
                <p><strong>Donor:</strong> {selectedPickup.donorName}</p>
                <p><strong>Location:</strong> {selectedPickup.location}</p>
                <p><strong>Items:</strong> {selectedPickup.items}</p>
                <p><strong>Preferred Date:</strong> {selectedPickup.preferredDate}</p>
              </div>
              <div style={styles.mapContainer}>
                <GoogleMap location={selectedPickup.location} />
              </div>
              <div style={styles.modalActions}>
                <button
                  onClick={() => {
                    handleStatusUpdate(selectedPickup.id, 'scheduled');
                    closeModal();
                  }}
                  style={{...styles.modalButton, backgroundColor: '#87ceeb'}}
                >
                  Confirm Schedule
                </button>
                <button
                  onClick={closeModal}
                  style={{...styles.modalButton, backgroundColor: '#ddd'}}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h2 style={styles.sidebarTitle}>Charity Portal</h2>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
        <div style={styles.statsContainer}>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>{statsData.total}</span>
            <span style={styles.statLabel}>Total Pickups</span>
          </div>
          <div style={styles.statCard}>
            <span style={{...styles.statNumber, color: '#ffd700'}}>{statsData.pending}</span>
            <span style={styles.statLabel}>Pending</span>
          </div>
          <div style={styles.statCard}>
            <span style={{...styles.statNumber, color: '#87ceeb'}}>{statsData.scheduled}</span>
            <span style={styles.statLabel}>Scheduled</span>
          </div>
          <div style={styles.statCard}>
            <span style={{...styles.statNumber, color: '#90ee90'}}>{statsData.completed}</span>
            <span style={styles.statLabel}>Completed</span>
          </div>
        </div>
        <div style={styles.sidebarMenu}>
          <div
            style={activeTab === 'pending' ? {...styles.sidebarMenuItem, ...styles.activeMenuItem} : styles.sidebarMenuItem}
            onClick={() => setActiveTab('pending')}
          >
            <span style={styles.menuIcon}>⏳</span> Pending Pickups
          </div>
          <div
            style={activeTab === 'scheduled' ? {...styles.sidebarMenuItem, ...styles.activeMenuItem} : styles.sidebarMenuItem}
            onClick={() => setActiveTab('scheduled')}
          >
            <span style={styles.menuIcon}>📅</span> Scheduled
          </div>
          <div
            style={activeTab === 'completed' ? {...styles.sidebarMenuItem, ...styles.activeMenuItem} : styles.sidebarMenuItem}
            onClick={() => setActiveTab('completed')}
          >
            <span style={styles.menuIcon}>✅</span> Completed
          </div>
          <div
            style={activeTab === 'all' ? {...styles.sidebarMenuItem, ...styles.activeMenuItem} : styles.sidebarMenuItem}
            onClick={() => setActiveTab('all')}
          >
            <span style={styles.menuIcon}>📋</span> All Pickups
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.header}>
          <h1 style={styles.title}>Donation Pickups</h1>
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search by donor or location..."
              value={searchTerm}
              onChange={handleSearch}
              style={styles.searchInput}
            />
          </div>
        </div>

        <div style={styles.pickupsGrid}>
          {filteredPickups.map((pickup) => (
            <div key={pickup.id} style={styles.pickupCard}>
              <div style={styles.cardHeader}>
                <h3 style={styles.donorName}>{pickup.donorName}</h3>
                <span style={{
                  ...styles.status,
                  backgroundColor: 
                    pickup.status === 'pending' ? '#ffd700' :
                    pickup.status === 'scheduled' ? '#87ceeb' :
                    '#90ee90'
                }}>
                  {pickup.status}
                </span>
              </div>
              <div style={styles.pickupDetails}>
                <p><strong>Location:</strong> {pickup.location}</p>
                <p><strong>Items:</strong> {pickup.items}</p>
                <p><strong>Preferred Date:</strong> {pickup.preferredDate}</p>
                <p><strong>Contact:</strong> {pickup.contact}</p>
              </div>
              <div style={styles.cardActions}>
                {pickup.status === 'pending' && (
                  <button
                    onClick={() => handleSchedulePickup(pickup)}
                    style={{...styles.actionButton, backgroundColor: '#87ceeb'}}
                  >
                    Schedule Pickup
                  </button>
                )}
                {pickup.status === 'scheduled' && (
                  <button
                    onClick={() => handleStatusUpdate(pickup.id, 'completed')}
                    style={{...styles.actionButton, backgroundColor: '#90ee90'}}
                  >
                    Mark as Completed
                  </button>
                )}
                <button
                  onClick={() => {
                    setSelectedPickup(pickup);
                    setShowModal(true);
                  }}
                  style={{...styles.actionButton, backgroundColor: '#f8f9fa', border: '1px solid #ddd'}}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    position: 'relative',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    width: '90%',
    maxWidth: '800px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    maxHeight: '90vh',
    overflow: 'hidden',
  },
  modalTitle: {
    fontSize: '20px',
    color: '#333',
    marginBottom: '20px',
  },
  modalContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxHeight: '80vh',
    overflowY: 'auto',
  },
  mapContainer: {
    width: '100%',
    height: '400px',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid #ddd',
  },
  modalDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  modalActions: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
  },
  modalButton: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
    padding: '20px 0',
    borderBottom: '1px solid #eee',
    marginBottom: '20px',
  },
  statCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    padding: '15px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  statNumber: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: '12px',
    color: '#666',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 16px',
    cursor: 'pointer',
    marginTop: '10px',
    width: '100%',
  },
  sidebar: {
    width: '250px',
    backgroundColor: 'white',
    boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
    padding: '20px',
  },
  sidebarHeader: {
    marginBottom: '30px',
  },
  sidebarTitle: {
    fontSize: '20px',
    color: '#333',
  },
  sidebarMenu: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  sidebarMenuItem: {
    padding: '12px',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    ':hover': {
      backgroundColor: '#f0f0f0',
    },
  },
  activeMenuItem: {
    backgroundColor: '#e6f3ff',
    color: '#3498db',
  },
  menuIcon: {
    marginRight: '10px',
  },
  mainContent: {
    flex: 1,
    padding: '30px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  title: {
    fontSize: '24px',
    color: '#333',
  },
  searchContainer: {
    width: '300px',
  },
  searchInput: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
  },
  pickupsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  pickupCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  donorName: {
    fontSize: '18px',
    color: '#333',
    margin: 0,
  },
  status: {
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#333',
  },
  pickupDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '15px',
  },
  cardActions: {
    display: 'flex',
    gap: '10px',
  },
  actionButton: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    color: '#333',
    fontWeight: 'bold',
    width: '100%',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    fontSize: '18px',
  },
  errorContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8d7da',
    padding: '20px',
  },
  errorMessage: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    maxWidth: '500px',
  },
  errorTitle: {
    color: '#dc3545',
    marginBottom: '15px',
    fontSize: '20px',
  },
  retryButton: {
    backgroundColor: '#0d6efd',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    marginTop: '15px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};
