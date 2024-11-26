import React, { useState, useEffect } from 'react';
import './UpdateViewerDetailsModal.css';
import InputField from '../components/InputField';
import { updateUser, fetchUsers } from '../api/fetchapi';

const UpdateViewerDetailsModal = ({
  CurrentCustomerId,
  setOpenUpdateDetailsModal,
  handleUpdateDetails,
}) => {
  const [formData, setFormData] = useState({
    emailAddress: '',
    modelType: '',
    stageName: '',
    modelInstaLink: '',
    notes: '',
    noteDate: '',
  });

  // Fetch customer data when the modal opens
  useEffect(() => {
    const fetchCustomerData = async () => {
      if (CurrentCustomerId) {
        try {
          const customer = await fetchRecordById(CurrentCustomerId);
          setFormData({
            modelType: customer.Model_Type || '',
            stageName: customer.Stage_Name || '',
            modelInstaLink: customer.Model_Insta_Link || '',
            emailAddress: customer.Email_Address || '',
            notes: customer.Notes || '',
            noteDate: customer.NoteDate || '',
          });
        } catch (error) {
          console.error('Error fetching customer data:', error);
        }
      }
    };

    fetchCustomerData();
  }, [CurrentCustomerId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    await handleUpdateDetails(formData);
  };

  return (
    <div
      className='updateViewerDetailsModal-bg'
      onClick={() => setOpenUpdateDetailsModal(false)}
    >
      <div
        className='updateViewerDetailsModal-container'
        onClick={(e) => e.stopPropagation()}
      >
        <span onClick={() => setOpenUpdateDetailsModal(false)}>
          <i
            style={{
              backgroundColor: 'white',
              color: '#5932EA',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '1.5rem',
            }}
            className='fa-regular fa-circle-xmark cross'
          ></i>
        </span>
        <form className='updateForm' onSubmit={handleSubmit}>
          <div className='input-labels'>
            <InputField
              label='Model Type'
              type='text'
              name='modelType'
              value={formData.modelType} // Updated field name
              onChange={handleChange}
            />
            <InputField
              label='Stage Name'
              type='text'
              name='stageName'
              value={formData.stageName} // Updated field name
              onChange={handleChange}
            />
            <InputField
              label='Model Insta Link'
              type='text'
              name='modelInstaLink'
              value={formData.modelInstaLink} // Updated field name
              onChange={handleChange}
            />
            <InputField
              label='Email Address'
              type='email'
              name='emailAddress2' // New field
              value={formData.emailAddress2}
              onChange={handleChange}
            />
            <InputField
              label='Notes'
              type='text'
              name='notes' // New field
              value={formData.notes}
              onChange={handleChange}
            />
            <InputField
              label='Note Date'
              type='date'
              name='noteDate' // New field
              value={formData.noteDate}
              onChange={handleChange}
            />
          </div>
          <button type='submit' className='updateBtn'>
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateViewerDetailsModal;
