import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A company must have a name'],
      unique: true,
    },
    address: {
      type: String,
      required: [true, 'A company must have an address'],
    },
    industry: {
      type: String,
      required: [true, 'A company must have an industry'],
    },
    established: {
      type: Date,
      required: [true, 'A company must have an established date'],
    },
    employees: {
      type: Number,
      required: [true, 'A company must have number of employees'],
    },
    stories: [
      {
        title: String,
        story: String,
      },
    ],
    images: [
      {
        url: String,
      },
    ],
  },
  { timestamps: true },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const Company = mongoose.model('About', companySchema);

export default Company;
