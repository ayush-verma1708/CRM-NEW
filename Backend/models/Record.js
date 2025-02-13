import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema(
  {
    Magazine: { type: String },
    Currency: { type: String },
    Amount: { type: Number },
    Status: { type: String },
    Payment_Type: { type: String },
    Payment_Method: { type: String },
    // First_Name: { type: String },
    // Last_Name: { type: String },
    Full_Name: { type: String },
    Country_Code: { type: String },
    Email: { type: String },
    Phone: { type: String },
    Address: { type: String },
    State: { type: String },
    Zip_Code: { type: String },
    Order_id: { type: String },
    Product: { type: String },
    Quantity: { type: Number },
    Discount: { type: Number },
    Shipping: { type: Number },
    Notes: { type: String }, // Add Notes field
    NoteDate: { type: Date }, // Add NoteDate field

    Model_Type: { type: String },
    Stage_Name: { type: String },
    Model_Insta_Link: { type: String },
    Email_Address: { type: String },
    Photographer_Insta_Link: { type: String },
    Mua_Stage_Name: { type: String },
    Mua_Insta_link: { type: String },
    Phone_Number_2: { type: String },
    Email_Address_2: { type: String },
    Country: { type: String },
    Date_Of_Birth: { type: Date },
    Notes: { type: String }, // Added field for notes
    Follow_Up_Date: { type: Date }, // Added field for note date
  },
  { timestamps: true }
);

export default mongoose.model('Record', recordSchema);
