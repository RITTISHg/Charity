import React, { useState, useEffect } from "react";

export function AdminDashboard() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch donation data when component mounts
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/getFormData');

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setDonations(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching donation data:", err);
      setError("Failed to load donation data. Please try again later.");
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredDonations = donations.filter(donation => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (donation.type && donation.type.toLowerCase().includes(searchLower)) ||
      (donation.organisation && donation.organisation.toLowerCase().includes(searchLower)) ||
      (donation.city && donation.city.toLowerCase().includes(searchLower)) ||
      (donation.street && donation.street.toLowerCase().includes(searchLower))
    );
  });

  // Calculate statistics
  const totalBags = donations.reduce((total, donation) => total + (donation.bags || 0), 0);
  const uniqueLocations = new Set(donations.map(d => d.city)).size;
  const uniqueOrganizations = new Set(donations.map(d => d.organisation)).size;

  // Get donation types and their counts
  const donationTypes = donations.reduce((acc, donation) => {
    if (donation.type) {
      acc[donation.type] = (acc[donation.type] || 0) + 1;
    }
    return acc;
  }, {});

  return (
    <div style={styles.pageContainer}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h2 style={styles.sidebarTitle}>Donation Admin</h2>
        </div>
        <div style={styles.sidebarMenu}>
          <div
            style={activeTab === 'dashboard' ? {...styles.sidebarMenuItem, ...styles.activeMenuItem} : styles.sidebarMenuItem}
            onClick={() => setActiveTab('dashboard')}
          >
            <span style={styles.menuIcon}>📊</span> Dashboard
          </div>
          <div
            style={activeTab === 'donations' ? {...styles.sidebarMenuItem, ...styles.activeMenuItem} : styles.sidebarMenuItem}
            onClick={() => setActiveTab('donations')}
          >
            <span style={styles.menuIcon}>🎁</span> Donations
          </div>
          <div
            style={activeTab === 'analytics' ? {...styles.sidebarMenuItem, ...styles.activeMenuItem} : styles.sidebarMenuItem}
            onClick={() => setActiveTab('analytics')}
          >
            <span style={styles.menuIcon}>📈</span> Analytics
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.topBar}>
          <h1 style={styles.title}>
            {activeTab === 'dashboard' && 'Dashboard Overview'}
            {activeTab === 'donations' && 'Donation Management'}
            {activeTab === 'analytics' && 'Donation Analytics'}
          </h1>
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search donations..."
              style={styles.searchInput}
              value={searchTerm}
              onChange={handleSearch}
            />
            <button style={styles.refreshButton} onClick={fetchDonations}>
              🔄 Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p style={styles.loadingText}>Loading donation data...</p>
          </div>
        ) : error ? (
          <div style={styles.errorContainer}>
            <p style={styles.errorText}>{error}</p>
            <button
              style={styles.retryButton}
              onClick={fetchDonations}
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <div style={styles.dashboardContent}>
                <div style={styles.statsGrid}>
                  <div style={{...styles.statCard, ...styles.statCardPrimary}}>
                    <div style={styles.statIcon}>📦</div>
                    <div style={styles.statInfo}>
                      <h3 style={styles.statTitle}>Total Donations</h3>
                      <p style={styles.statValue}>{donations.length}</p>
                    </div>
                  </div>
                  <div style={{...styles.statCard, ...styles.statCardSuccess}}>
                    <div style={styles.statIcon}>🛍️</div>
                    <div style={styles.statInfo}>
                      <h3 style={styles.statTitle}>Total Bags</h3>
                      <p style={styles.statValue}>{totalBags}</p>
                    </div>
                  </div>
                  <div style={{...styles.statCard, ...styles.statCardInfo}}>
                    <div style={styles.statIcon}>📍</div>
                    <div style={styles.statInfo}>
                      <h3 style={styles.statTitle}>Unique Locations</h3>
                      <p style={styles.statValue}>{uniqueLocations}</p>
                    </div>
                  </div>
                  <div style={{...styles.statCard, ...styles.statCardWarning}}>
                    <div style={styles.statIcon}>🏢</div>
                    <div style={styles.statInfo}>
                      <h3 style={styles.statTitle}>Organizations</h3>
                      <p style={styles.statValue}>{uniqueOrganizations}</p>
                    </div>
                  </div>
                </div>

                <div style={styles.recentDonationsContainer}>
                  <h2 style={styles.sectionTitle}>Recent Donations</h2>
                  <div style={styles.recentDonationsTable}>
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th style={styles.tableHeader}>Type</th>
                          <th style={styles.tableHeader}>Bags</th>
                          <th style={styles.tableHeader}>Location</th>
                          <th style={styles.tableHeader}>Organisation</th>
                          <th style={styles.tableHeader}>Contact</th>
                        </tr>
                      </thead>
                      <tbody>
                        {donations.slice(0, 5).map((donation, index) => (
                          <tr key={index} style={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
                            <td style={styles.tableCell}>{donation.type}</td>
                            <td style={styles.tableCell}>{donation.bags}</td>
                            <td style={styles.tableCell}>
                              {donation.city}, {donation.street}
                            </td>
                            <td style={styles.tableCell}>{donation.organisation}</td>
                            <td style={styles.tableCell}>{donation.phone}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'donations' && (
              <div style={styles.donationsContent}>
                {filteredDonations.length === 0 ? (
                  <p style={styles.noDonationsText}>No donations found matching your search.</p>
                ) : (
                  <div style={styles.tableContainer}>
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th style={styles.tableHeader}>Type</th>
                          <th style={styles.tableHeader}>Bags</th>
                          <th style={styles.tableHeader}>Location</th>
                          <th style={styles.tableHeader}>Organisation</th>
                          <th style={styles.tableHeader}>Contact</th>
                          <th style={styles.tableHeader}>Pickup Date</th>
                          <th style={styles.tableHeader}>Notes</th>
                          <th style={styles.tableHeader}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredDonations.map((donation, index) => (
                          <tr key={index} style={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
                            <td style={styles.tableCell}>{donation.type}</td>
                            <td style={styles.tableCell}>{donation.bags}</td>
                            <td style={styles.tableCell}>
                              {donation.city}, {donation.street}
                            </td>
                            <td style={styles.tableCell}>{donation.organisation}</td>
                            <td style={styles.tableCell}>{donation.phone}</td>
                            <td style={styles.tableCell}>
                              {donation.day}, {donation.time}
                            </td>
                            <td style={styles.tableCell}>{donation.notes}</td>
                            <td style={styles.tableCell}>
                              <button style={styles.actionButton}>View</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'analytics' && (
              <div style={styles.analyticsContent}>
                <div style={styles.analyticsGrid}>
                  <div style={styles.analyticsCard}>
                    <h3 style={styles.analyticsTitle}>Donation Types</h3>
                    <div style={styles.donationTypesContainer}>
                      {Object.entries(donationTypes).map(([type, count], index) => (
                        <div key={index} style={styles.donationTypeItem}>
                          <div style={styles.donationTypeLabel}>{type}</div>
                          <div style={styles.donationTypeBar}>
                            <div
                              style={{
                                ...styles.donationTypeProgress,
                                width: `${(count / donations.length) * 100}%`,
                                backgroundColor: getRandomColor(index)
                              }}
                            ></div>
                          </div>
                          <div style={styles.donationTypeCount}>{count}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={styles.analyticsCard}>
                    <h3 style={styles.analyticsTitle}>Donation Summary</h3>
                    <div style={styles.summaryStats}>
                      <div style={styles.summaryStat}>
                        <div style={styles.summaryLabel}>Average Bags per Donation</div>
                        <div style={styles.summaryValue}>
                          {(totalBags / donations.length).toFixed(1)}
                        </div>
                      </div>
                      <div style={styles.summaryStat}>
                        <div style={styles.summaryLabel}>Most Common Type</div>
                        <div style={styles.summaryValue}>
                          {Object.entries(donationTypes).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Helper function to generate random colors for charts
function getRandomColor(index) {
  const colors = [
    '#4caf50', '#2196f3', '#ff9800', '#e91e63',
    '#9c27b0', '#3f51b5', '#00bcd4', '#009688'
  ];
  return colors[index % colors.length];
}

const styles = {
  pageContainer: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: 'Roboto, Arial, sans-serif',
    backgroundColor: '#f8f9fa',
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#2c3e50',
    color: 'white',
    boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
  },
  sidebarHeader: {
    padding: '1.5rem',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  sidebarTitle: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: '500',
  },
  sidebarMenu: {
    padding: '1rem 0',
  },
  sidebarMenuItem: {
    padding: '0.75rem 1.5rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    fontSize: '1rem',
  },
  activeMenuItem: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderLeft: '4px solid #3498db',
  },
  menuIcon: {
    marginRight: '0.75rem',
    fontSize: '1.2rem',
  },
  mainContent: {
    flex: 1,
    padding: '1.5rem',
    overflowY: 'auto',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    padding: '0 0 1rem 0',
    borderBottom: '1px solid #e0e0e0',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: '500',
    color: '#2c3e50',
    margin: 0,
  },
  searchContainer: {
    display: 'flex',
    gap: '0.5rem',
  },
  searchInput: {
    padding: '0.5rem 1rem',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    fontSize: '0.9rem',
    width: '250px',
  },
  refreshButton: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid rgba(0, 0, 0, 0.1)',
    borderRadius: '50%',
    borderTop: '4px solid #3498db',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: '1rem',
    fontSize: '1rem',
    color: '#666',
  },
  errorContainer: {
    textAlign: 'center',
    padding: '2rem',
    backgroundColor: '#fff8f8',
    border: '1px solid #ffcdd2',
    borderRadius: '8px',
    margin: '2rem 0',
  },
  errorText: {
    color: '#d32f2f',
    marginBottom: '1rem',
    fontSize: '1rem',
  },
  retryButton: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  dashboardContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.5rem',
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  statCardPrimary: {
    borderTop: '4px solid #3498db',
  },
  statCardSuccess: {
    borderTop: '4px solid #2ecc71',
  },
  statCardInfo: {
    borderTop: '4px solid #9b59b6',
  },
  statCardWarning: {
    borderTop: '4px solid #f39c12',
  },
  statIcon: {
    fontSize: '2.5rem',
    opacity: '0.8',
  },
  statInfo: {
    flex: 1,
  },
  statTitle: {
    margin: '0 0 0.5rem 0',
    color: '#7f8c8d',
    fontSize: '0.9rem',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  statValue: {
    margin: 0,
    fontSize: '2rem',
    fontWeight: '600',
    color: '#2c3e50',
  },
  recentDonationsContainer: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '500',
    color: '#2c3e50',
    marginTop: 0,
    marginBottom: '1.5rem',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid #ecf0f1',
  },
  recentDonationsTable: {
    overflowX: 'auto',
  },
  donationsContent: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.9rem',
  },
  tableHeader: {
    backgroundColor: '#f8f9fa',
    padding: '1rem',
    textAlign: 'left',
    fontWeight: '600',
    color: '#2c3e50',
    borderBottom: '2px solid #ecf0f1',
  },
  tableCell: {
    padding: '1rem',
    borderBottom: '1px solid #ecf0f1',
    color: '#34495e',
  },
  evenRow: {
    backgroundColor: 'white',
  },
  oddRow: {
    backgroundColor: '#f8f9fa',
  },
  actionButton: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '0.5rem 0.75rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.8rem',
  },
  noDonationsText: {
    textAlign: 'center',
    padding: '3rem',
    color: '#7f8c8d',
    fontSize: '1rem',
  },
  analyticsContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  analyticsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '1.5rem',
  },
  analyticsCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  },
  analyticsTitle: {
    fontSize: '1.25rem',
    fontWeight: '500',
    color: '#2c3e50',
    marginTop: 0,
    marginBottom: '1.5rem',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid #ecf0f1',
  },
  donationTypesContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  donationTypeItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  donationTypeLabel: {
    width: '120px',
    fontSize: '0.9rem',
    color: '#34495e',
    fontWeight: '500',
  },
  donationTypeBar: {
    flex: 1,
    height: '12px',
    backgroundColor: '#ecf0f1',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  donationTypeProgress: {
    height: '100%',
    borderRadius: '6px',
  },
  donationTypeCount: {
    width: '40px',
    textAlign: 'right',
    fontSize: '0.9rem',
    color: '#34495e',
    fontWeight: '600',
  },
  summaryStats: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  summaryStat: {
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #ecf0f1',
  },
  summaryLabel: {
    fontSize: '0.9rem',
    color: '#7f8c8d',
    marginBottom: '0.5rem',
  },
  summaryValue: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#2c3e50',
  },
};
