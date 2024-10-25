const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const MONGODB_URI =
  "mongodb+srv://RobertRus:lFfCC7WUMdQxaUEV@cluster0.qgyu2qn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB successfully.");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Common Schema for Personal Details
const personalDetailsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    enum: ["Mx", "Ms", "Mr", "Mrs", "Miss", "Dr", "Other"],
  },
  otherTitle: { type: String },
  firstName: { type: String, required: true },
  surname: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  town: { type: String, required: true },
  countyCity: { type: String, required: true },
  eircode: { type: String },
});

// Tenant Schema
const tenantSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  ...personalDetailsSchema.obj,
});
const Tenant = mongoose.model("Tenant", tenantSchema);

// Landlord Schema
const landlordSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  ...personalDetailsSchema.obj,
  dateOfBirth: { type: Date, required: true },
  permissionToRent: { type: String, enum: ["Y", "N"], required: true },
  contactViaEmail: { type: String, enum: ["Y", "N"], required: true },
});
const Landlord = mongoose.model("Landlord", landlordSchema);

// Contract Schema
const contractSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  contractDate: { type: Date, required: true },
  propertyAddress: { type: String, required: true },
  tenantIds: {
    type: [Number],
    required: true,
    validate: {
      validator: function (value) {
        return value.length > 0 && value.length <= 3;
      },
      message: "A contract must include between 1 and 3 tenants.",
    },
  },
  landlordId: { type: Number, required: true },
  feeMonthly: { type: Number, required: true },
  propertyDoorNumber: { type: String, required: true },
  contractLength: {
    type: String,
    enum: ["Month", "Year", "Permanent"],
    required: true,
  },
  propertyType: {
    type: String,
    enum: ["Apartment", "Semi-Detached", "Detached", "Other"],
    required: true,
  },
  otherPropertyType: { type: String },
});

const Contract = mongoose.model("Contract", contractSchema);

// Function to get the next ID
async function getNextId(model) {
  const latestEntry = await model.findOne().sort({ id: -1 }).exec();
  return latestEntry ? latestEntry.id + 1 : 1;
}

// Adding new Tenants
app.post("/tenants", async (req, res) => {
  try {
    const nextId = await getNextId(Tenant);
    const newTenant = new Tenant({ ...req.body, id: nextId });
    await newTenant.save();
    res.status(201).send(newTenant);
  } catch (error) {
    res.status(400).send({ message: error.message, error });
  }
});

// Fetch all Tenants
app.get("/tenants", async (req, res) => {
  try {
    const tenants = await Tenant.find({});
    res.send(tenants);
  } catch (error) {
    res.status(500).send({ message: error.message, error });
  }
});

// Fetch Tenants by ID
app.get("/tenants/:id", async (req, res) => {
  try {
    const tenant = await Tenant.findOne({ id: req.params.id });
    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }
    res.json(tenant);
  } catch (error) {
    console.error("Error fetching tenant:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// Update an existing Tenant by id
app.put("/tenants/:id", async (req, res) => {
  try {
    const tenant = await Tenant.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!tenant) return res.status(404).send({ message: "Tenant not found." });
    res.send(tenant);
  } catch (error) {
    res.status(500).send({ message: error.message, error });
  }
});

// Remove a Tenant by id
app.delete("/tenants/:id", async (req, res) => {
  try {
    const tenant = await Tenant.findOneAndDelete({ id: req.params.id });
    if (!tenant) return res.status(404).send({ message: "Tenant not found." });
    res.send({ message: "Tenant successfully deleted." });
  } catch (error) {
    res.status(500).send({ message: error.message, error });
  }
});

// Adding new Landlords
app.post("/landlords", async (req, res) => {
  try {
    const nextId = await getNextId(Landlord);
    const newLandlord = new Landlord({ ...req.body, id: nextId });
    await newLandlord.save();
    res.status(201).send(newLandlord);
  } catch (error) {
    res.status(400).send({ message: error.message, error });
  }
});

// Fetch all Landlords
app.get("/landlords", async (req, res) => {
  try {
    const landlords = await Landlord.find({});
    res.send(landlords);
  } catch (error) {
    res.status(500).send({ message: error.message, error });
  }
});

// Fetch :andlord by id
app.get("/landlords/:id", async (req, res) => {
  try {
    const landlord = await Landlord.findOne({ id: req.params.id });

    if (!landlord) {
      return res.status(404).json({ error: "Landlord not found" });
    }

    res.json(landlord);
  } catch (error) {
    console.error("Error fetching landlord:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// Update an existing Landlord by id
app.put("/landlords/:id", async (req, res) => {
  try {
    const landlord = await Landlord.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!landlord)
      return res.status(404).send({ message: "Landlord not found." });
    res.send(landlord);
  } catch (error) {
    res.status(500).send({ message: error.message, error });
  }
});

// Remove a Landlord by id
app.delete("/landlords/:id", async (req, res) => {
  try {
    const landlord = await Landlord.findOneAndDelete({ id: req.params.id });
    if (!landlord)
      return res.status(404).send({ message: "Landlord not found." });
    res.send({ message: "Landlord successfully deleted." });
  } catch (error) {
    res.status(500).send({ message: error.message, error });
  }
});

// Adding new Contracts
app.post("/contracts", async (req, res) => {
  try {
    const nextId = await getNextId(Contract);
    const newContract = new Contract({ ...req.body, id: nextId });
    await newContract.save();
    res.status(201).send(newContract);
  } catch (error) {
    res.status(400).send({ message: error.message, error });
  }
});

// Fetch all Contracts
app.get("/contracts", async (req, res) => {
  try {
    const contracts = await Contract.find({})
      .populate("tenantIds")
      .populate("landlordId");
    res.send(contracts);
  } catch (error) {
    res.status(500).send({ message: error.message, error });
  }
});

// Fetch Contracts by id
app.get("/contracts/:id", async (req, res) => {
  try {
    const contractId = parseInt(req.params.id, 10);

    if (isNaN(contractId)) {
      return res.status(400).json({ error: "Invalid contract ID" });
    }

    const contract = await Contract.findOne({ id: contractId });

    if (!contract) {
      return res.status(404).json({ error: "Contract not found" });
    }

    res.json(contract);
  } catch (error) {
    console.error("Error fetching contract:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// Update an existing Contract by id
app.put("/contracts/:id", async (req, res) => {
  try {
    const contract = await Contract.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!contract)
      return res.status(404).send({ message: "Contract not found." });
    res.send(contract);
  } catch (error) {
    res.status(500).send({ message: error.message, error });
  }
});

// Remove a Contract by id
app.delete("/contracts/:id", async (req, res) => {
  try {
    const contract = await Contract.findOneAndDelete({ id: req.params.id });
    if (!contract)
      return res.status(404).send({ message: "Contract not found." });
    res.send({ message: "Contract successfully deleted." });
  } catch (error) {
    res.status(500).send({ message: error.message, error });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));