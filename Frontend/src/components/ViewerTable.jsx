import React, { useState, useEffect } from 'react';
import DeleteCustomerModal from '../modals/DeleteCustomerModal';
import UpdateViewerDetailsModal from '../modals/UpdateViewerDetailsModal';
import NotesModal from '../modals/NotesModal';
import { fetchUsers } from '../api/fetchapi.js';
import './customerTable.css';
import { updateUser, deleteUser } from '../api/userApi.js'; // Ensure the file path is correct

// Pagination Component
const Pagination = ({ page, totalPages, onPageChange }) => (
  <div className='pagination-controls'>
    <button
      onClick={() => onPageChange(page - 1)}
      disabled={page === 1}
      className={`pagination-btn ${page === 1 ? 'disabled' : ''}`}
    >
      Previous
    </button>
    {Array.from({ length: totalPages }, (_, index) => {
      const pageNum = index + 1;
      if (
        pageNum === 1 ||
        pageNum === totalPages ||
        (pageNum >= page - 2 && pageNum <= page + 2)
      ) {
        return (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`pagination-btn ${page === pageNum ? 'active' : ''}`}
          >
            {pageNum}
          </button>
        );
      }
      if (pageNum === page - 3 || pageNum === page + 3) {
        return (
          <span key={pageNum} className='ellipsis'>
            ...
          </span>
        );
      }
      return null;
    })}
    <button
      onClick={() => onPageChange(page + 1)}
      disabled={page === totalPages}
      className={`pagination-btn ${page === totalPages ? 'disabled' : ''}`}
    >
      Next
    </button>
  </div>
);

// ViewerTable Component
const ViewerTable = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [recordsData, setRecordsData] = useState([]);
  const [selectedNotes, setSelectedNotes] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [currentCustomerId, setCurrentCustomerId] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openUpdateDetailsModal, setOpenUpdateDetailsModal] = useState(false);
  const [openNotesModal, setOpenNotesModal] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers(page, 100, search);
      setCustomers(Array.isArray(data.users) ? data.users : []);
      setTotalPages(data.totalPages || Math.ceil(data.total / 100));
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError('Error fetching customers');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleDelete = (id) => {
    setCurrentCustomer(
      customers.find((customer) => customer && customer._id === id)
    );
    setOpenDeleteModal(true);
  };

  const confirmDeleteCustomer = async () => {
    if (currentCustomer) {
      try {
        await deleteUser(currentCustomer._id);
        setCustomers((prev) =>
          prev.filter(
            (customer) => customer && customer._id !== currentCustomer._id
          )
        );
        setOpenDeleteModal(false);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Error deleting customer. Please try again.');
      }
    }
  };

  const handleEdit = (id) => {
    setCurrentCustomer(
      customers.find((customer) => customer && customer._id === id)
    );
    console.log(currentCustomer);
    setOpenUpdateDetailsModal(true);
  };

  const handleUpdateDetails = async (updatedData) => {
    try {
      const updatedCustomer = await updateUser(
        currentCustomer._id,
        updatedData
      );
      setCustomers((prev) =>
        prev.map((customer) =>
          customer && customer._id === updatedCustomer._id
            ? updatedCustomer
            : customer
        )
      );
      setOpenUpdateDetailsModal(false);
    } catch {
      setError('Error updating customer details.');
    }
  };

  const handleEye = (id) => {
    const customer = customers.find(
      (customer) => customer && customer._id === id
    );
    setSelectedNotes(customer.Notes); // Ensure selectedNotes reflects the current customer
    setCurrentCustomer(customer);
    setOpenNotesModal(true);
  };

  const handleNotesUpdated = () => {
    fetchCustomers(); // Refresh records after note update
  };

  // Function to fetch the record notes
  const loadNotes = async () => {
    try {
      console.log('note updated');
      fetchCustomers();
    } catch (error) {
      console.error('Error fetching record:', error);
    }
  };

  useEffect(() => {
    console.log('Fetching customers with:', { page, search });
    fetchCustomers();
    console.log(fetchCustomers());
  }, [page, search]);

  // Fetch notes when component mounts or when `currentCustomerId` changes
  useEffect(() => {
    if (currentCustomerId) {
      loadNotes();
    }
  }, [currentCustomerId]);

  return (
    <div className='customer-table-container'>
      <div className='table-header'>
        <h3>All Viewers</h3>
        <input
          type='text'
          placeholder='Search by name or email'
          value={search}
          onChange={handleSearch}
          className='search-bar'
        />
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className='error-message'>{error}</p>
      ) : (
        <>
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            <table className='customer-table'>
              <thead>
                <tr>
                  <th>Model Type</th>
                  <th>Stage Name</th>
                  <th>Instagram Link</th>
                  <th>Email Address</th>
                  <th>Notes</th>
                  <th>Follow-Up Date</th>
                  <th>Edit Note</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(
                  (customer) =>
                    customer && (
                      <tr key={customer._id}>
                        <td>{customer.Model_Type}</td>
                        <td>{customer.Stage_Name}</td>
                        <td>
                          <a
                            href={customer.Model_Insta_Link}
                            target='_blank'
                            rel='noopener noreferrer'
                          >
                            {customer.Model_Insta_Link}
                          </a>
                        </td>
                        <td>{customer.Email_Address}</td>
                        <td>{customer.Notes || ''}</td>
                        <td>
                          {customer.Follow_Up_Date}
                          {/* {(customer.Follow_Up_Date != undefined ||
                            customer.Follow_Up_Date != null ||
                            customer.Follow_Up_Date == '') && (
                            <span>
                              {new Date(
                                customer?.Follow_Up_Date
                              ).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </span>
                          )} */}
                        </td>
                        <td>
                          <button
                            className='notes-btn'
                            onClick={() => handleEye(customer._id)}
                          >
                            <i className='fa-solid fa-eye'></i>
                          </button>
                        </td>
                        <td>
                          <button
                            className='edit-btn'
                            onClick={() => handleEdit(customer._id)}
                          >
                            <i className='fa-solid fa-pencil'></i>
                          </button>
                        </td>
                        <td>
                          <button
                            className='delete-btn'
                            onClick={() => handleDelete(customer._id)}
                          >
                            <i className='fa-solid fa-trash'></i>
                          </button>
                        </td>
                      </tr>
                    )
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {openDeleteModal && (
        <DeleteCustomerModal
          setOpenDeleteModal={setOpenDeleteModal}
          confirmDeleteCategory={confirmDeleteCustomer}
        />
      )}
      {openUpdateDetailsModal && (
        <UpdateViewerDetailsModal
          CurrentCustomerId={currentCustomerId}
          setOpenUpdateDetailsModal={setOpenUpdateDetailsModal}
          handleUpdateDetails={handleUpdateDetails} // Pass the function as a prop
        />
      )}
      {openNotesModal && (
        <NotesModal
          customer={currentCustomer}
          setOpenNotesModal={setOpenNotesModal}
          initialNotes={selectedNotes}
          onNotesUpdated={handleNotesUpdated}
          currentCustomerId={currentCustomerId}
          onClose={() => setOpenNotesModal(false)}
        />
      )}
    </div>
  );
};

export default ViewerTable;
