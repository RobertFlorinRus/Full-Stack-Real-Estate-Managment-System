//Code tested in google chrome version 124.0.6367.156, windows 10

const baseUrl = "http://localhost:3000";

// TENANT FUNCTIONS
function createTenantObject() {
  return {
    title: document.getElementById("tenantTitle").value,
    otherTitle: document.getElementById("tenantOtherTitle").value || "",
    firstName: document.getElementById("tenantFirstName").value,
    surname: document.getElementById("tenantSurname").value,
    phone: document.getElementById("tenantPhone").value,
    email: document.getElementById("tenantEmail").value,
    addressLine1: document.getElementById("tenantAddress1").value,
    addressLine2: document.getElementById("tenantAddress2").value || "",
    town: document.getElementById("tenantTown").value,
    countyCity: document.getElementById("tenantCountyCity").value,
    eircode: document.getElementById("tenantEircode").value || "",
  };
}

function loadTenants() {
  fetch(`${baseUrl}/tenants`)
    .then((response) => response.json())
    .then((data) => {
      const listItems = data
        .map(
          (tenant) => `
                <li>
                    <strong>ID:</strong> ${tenant.id}<br>
                    <strong>Title:</strong> ${tenant.title} ${
            tenant.otherTitle ? "(" + tenant.otherTitle + ")" : ""
          }<br>
                    <strong>Name:</strong> ${tenant.firstName} ${
            tenant.surname
          }<br>
                    <strong>Phone:</strong> ${tenant.phone}<br>
                    <strong>Email:</strong> ${tenant.email}<br>
                    <strong>Address:</strong> ${tenant.addressLine1} ${
            tenant.addressLine2 ? tenant.addressLine2 : ""
          }, ${tenant.town}, ${tenant.countyCity}, ${
            tenant.eircode ? tenant.eircode : ""
          }<br>
                    <button onclick="deleteTenant(${tenant.id})">Delete</button>
                    <button onclick="editTenant(${tenant.id})">Edit</button>
                </li>
            `
        )
        .join("");
      document.getElementById("tenantsList").innerHTML = listItems;
    });
}

function addTenant() {
  fetch(`${baseUrl}/tenants`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(createTenantObject()),
  }).then(() => {
    loadTenants();
    document.getElementById("tenantForm").reset();
  });
}

function deleteTenant(id) {
  fetch(`${baseUrl}/tenants/${id}`, { method: "DELETE" }).then(() =>
    loadTenants()
  );
}

function editTenant(id) {
  fetch(`http://localhost:3000/tenants/${id}`)
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("editTenantFirstName").value = data.firstName;
      document.getElementById("editTenantSurname").value = data.surname;
      document.getElementById("editTenantPhone").value = data.phone;
      document.getElementById("editTenantEmail").value = data.email;
      document.getElementById("editTenantAddress1").value = data.addressLine1;
      document.getElementById("editTenantAddress2").value = data.addressLine2 || "";
      document.getElementById("editTenantTown").value = data.town;
      document.getElementById("editTenantCountyCity").value = data.countyCity;
      document.getElementById("editTenantEircode").value = data.eircode || "";

      document.getElementById("editTenantModal").style.display = "block";

      document.getElementById("editTenantForm").onsubmit = function (e) {
        e.preventDefault();
        updateTenant(id);
      };
    })
    .catch((error) => {
      console.error("Error fetching tenant:", error);
      alert("Failed to fetch tenant details.");
    });
}

function updateTenant(id) {
  const updatedData = {
    firstName: document.getElementById("editTenantFirstName").value,
    surname: document.getElementById("editTenantSurname").value,
    phone: document.getElementById("editTenantPhone").value,
    email: document.getElementById("editTenantEmail").value,
    addressLine1: document.getElementById("editTenantAddress1").value,
    addressLine2: document.getElementById("editTenantAddress2").value || "",
    town: document.getElementById("editTenantTown").value,
    countyCity: document.getElementById("editTenantCountyCity").value,
    eircode: document.getElementById("editTenantEircode").value || "",
  };

  fetch(`http://localhost:3000/tenants/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  })
    .then((response) => {
      if (response.ok) {
        document.getElementById("editTenantModal").style.display = "none";
        alert("Tenant details updated successfully");
        fetchTenants();
      } else {
        alert("Failed to update tenant details.");
      }
    })
    .catch((error) => {
      console.error("Error updating tenant:", error);
      alert("An error occurred while updating tenant details.");
    });
}

function fetchTenants() {
  fetch("http://localhost:3000/tenants")
    .then((response) => response.json())
    .then((tenants) => {
      const tenantsList = document.getElementById("tenantsList");
      tenantsList.innerHTML = ""; 

      tenants.forEach((tenant) => {
        const listItem = document.createElement("li");

        listItem.innerHTML = `
                    <strong>ID:</strong> ${tenant.id}<br>
                    <strong>Title:</strong> ${tenant.title} ${
          tenant.otherTitle ? "(" + tenant.otherTitle + ")" : ""
        }<br>
                    <strong>Name:</strong> ${tenant.firstName} ${
          tenant.surname
        }<br>
                    <strong>Phone:</strong> ${tenant.phone}<br>
                    <strong>Email:</strong> ${tenant.email}<br>
                    <strong>Address:</strong> ${tenant.addressLine1} ${
          tenant.addressLine2 ? tenant.addressLine2 : ""
        }, ${tenant.town}, ${tenant.countyCity}, ${
          tenant.eircode ? tenant.eircode : ""
        }<br>
                    <button onclick="deleteTenant(${tenant.id})">Delete</button>
                    <button onclick="editTenant(${tenant.id})">Edit</button>
                `;

        tenantsList.appendChild(listItem);
      });
    })
    .catch((error) => console.error("Error fetching tenants:", error));
}

document.getElementById("tenantForm").onsubmit = function (e) {
  e.preventDefault();
  addTenant();
};

// LANDLORD FUNCTIONS
function createLandlordObject() {
  return {
    title: document.getElementById("landlordTitle").value,
    otherTitle: document.getElementById("landlordOtherTitle").value || "",
    firstName: document.getElementById("landlordFirstName").value,
    surname: document.getElementById("landlordSurname").value,
    phone: document.getElementById("landlordPhone").value,
    email: document.getElementById("landlordEmail").value,
    addressLine1: document.getElementById("landlordAddress1").value,
    addressLine2: document.getElementById("landlordAddress2").value || "",
    town: document.getElementById("landlordTown").value,
    countyCity: document.getElementById("landlordCountyCity").value,
    eircode: document.getElementById("landlordEircode").value || "",
    dateOfBirth: document.getElementById("landlordDob").value,
    permissionToRent: document.getElementById("landlordPermissionToRent").value,
    contactViaEmail: document.getElementById("landlordContactViaEmail").value,
  };
}

function loadLandlords() {
  fetch(`${baseUrl}/landlords`)
    .then((response) => response.json())
    .then((data) => {
      const listItems = data
        .map(
          (landlord) => `
                <li>
                    <strong>ID:</strong> ${landlord.id}<br>
                    <strong>Title:</strong> ${landlord.title} ${
            landlord.otherTitle ? "(" + landlord.otherTitle + ")" : ""
          }<br>
                    <strong>Name:</strong> ${landlord.firstName} ${
            landlord.surname
          }<br>
                    <strong>Date of Birth:</strong> ${new Date(
                      landlord.dob
                    ).toLocaleDateString()}<br>
                    <strong>Phone:</strong> ${landlord.phone}<br>
                    <strong>Email:</strong> ${landlord.email}<br>
                    <strong>Address:</strong> ${landlord.addressLine1} ${
            landlord.addressLine2 ? landlord.addressLine2 : ""
          }, ${landlord.town}, ${landlord.countyCity}, ${
            landlord.eircode ? landlord.eircode : ""
          }<br>
                    <strong>Permission to Rent:</strong> ${
                      landlord.permissionToRent
                    }<br>
                    <strong>Contact via Email:</strong> ${
                      landlord.contactViaEmail
                    }<br>
                    <button onclick="deleteLandlord(${
                      landlord.id
                    })">Delete</button>
                    <button onclick="editLandlord(${landlord.id})">Edit</button>
                </li>
            `
        )
        .join("");
      document.getElementById("landlordsList").innerHTML = listItems;
    });
}

function addLandlord() {
  fetch(`${baseUrl}/landlords`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(createLandlordObject()),
  }).then(() => {
    loadLandlords();
    document.getElementById("landlordForm").reset();
  });
}

function deleteLandlord(id) {
  fetch(`${baseUrl}/landlords/${id}`, { method: "DELETE" }).then(() =>
    loadLandlords()
  );
}

function editLandlord(id) {
  fetch(`${baseUrl}/landlords/${id}`)
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("editLandlordFirstName").value = data.firstName;
      document.getElementById("editLandlordSurname").value = data.surname;
      document.getElementById("editLandlordPhone").value = data.phone;
      document.getElementById("editLandlordEmail").value = data.email;
      document.getElementById("editLandlordAddress1").value = data.addressLine1;
      document.getElementById("editLandlordAddress2").value =
        data.addressLine2 || "";
      document.getElementById("editLandlordTown").value = data.town;
      document.getElementById("editLandlordCountyCity").value = data.countyCity;
      document.getElementById("editLandlordEircode").value = data.eircode || "";
      document.getElementById("editLandlordPermissionToRent").value =
        data.permissionToRent || "";
      document.getElementById("editLandlordContactViaEmail").value =
        data.contactViaEmail || "";

      document.getElementById("editLandlordModal").style.display = "block";

      document.getElementById("editLandlordForm").onsubmit = function (e) {
        e.preventDefault();
        updateLandlord(id);
      };
    })
    .catch((error) => {
      console.error("Error fetching landlord:", error);
      alert("Failed to fetch landlord details.");
    });
}

function updateLandlord(id) {
  const updatedData = {
    firstName: document.getElementById("editLandlordFirstName").value,
    surname: document.getElementById("editLandlordSurname").value,
    phone: document.getElementById("editLandlordPhone").value,
    email: document.getElementById("editLandlordEmail").value,
    addressLine1: document.getElementById("editLandlordAddress1").value,
    addressLine2: document.getElementById("editLandlordAddress2").value || "",
    town: document.getElementById("editLandlordTown").value,
    countyCity: document.getElementById("editLandlordCountyCity").value,
    eircode: document.getElementById("editLandlordEircode").value || "",
    permissionToRent: document.getElementById("editLandlordPermissionToRent")
      .value,
    contactViaEmail: document.getElementById("editLandlordContactViaEmail")
      .value,
  };

  fetch(`${baseUrl}/landlords/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  })
    .then((response) => {
      if (response.ok) {
        document.getElementById("editLandlordModal").style.display = "none";
        alert("Landlord details updated successfully");
        loadLandlords();
      } else {
        alert("Failed to update landlord details.");
      }
    })
    .catch((error) => {
      console.error("Error updating landlord:", error);
      alert("An error occurred while updating landlord details.");
    });
}

function fetchLandlords() {
  fetch("http://localhost:3000/landlords")
    .then((response) => response.json())
    .then((landlords) => {
      const landlordsList = document.getElementById("landlordsList");
      landlordsList.innerHTML = ""; 

      landlords.forEach((landlord) => {
        const listItem = document.createElement("li");

        listItem.innerHTML = `
                    <strong>ID:</strong> ${landlord.id}<br>
                    <strong>Title:</strong> ${landlord.title} ${
          landlord.otherTitle ? "(" + landlord.otherTitle + ")" : ""
        }<br>
                    <strong>Name:</strong> ${landlord.firstName} ${
          landlord.surname
        }<br>
                    <strong>Date of Birth:</strong> ${landlord.dob}<br>
                    <strong>Phone:</strong> ${landlord.phone}<br>
                    <strong>Email:</strong> ${landlord.email}<br>
                    <strong>Address:</strong> ${landlord.addressLine1} ${
          landlord.addressLine2 ? landlord.addressLine2 : ""
        }, ${landlord.town}, ${landlord.countyCity}, ${
          landlord.eircode ? landlord.eircode : ""
        }<br>
                    <button onclick="deleteLandlord(${
                      landlord.id
                    })">Delete</button>
                    <button onclick="editLandlord(${landlord.id})">Edit</button>
                `;

        landlordsList.appendChild(listItem);
      });
    })
    .catch((error) => console.error("Error fetching landlords:", error));
}

document.getElementById("landlordForm").onsubmit = function (e) {
  e.preventDefault();
  addLandlord();
};

// CONTRACT FUNCTIONS
function createContractObject() {
  return {
    contractDate: document.getElementById("contractDate").value,
    propertyAddress: document.getElementById("propertyAddress").value,
    propertyDoorNumber: document.getElementById("propertyDoorNumber").value,
    feeMonthly: parseFloat(document.getElementById("feeMonthly").value),
    contractLength: document.getElementById("contractLength").value,
    propertyType: document.getElementById("propertyType").value,
    otherPropertyType: document.getElementById("otherPropertyType").value || "",
  };
}

function loadContracts() {
  fetch(`${baseUrl}/contracts`)
    .then((response) => response.json())
    .then((data) => {
      const listItems = data
        .map((contract) => {
          const tenantIdsList = contract.tenantIds.join(", ");
          return `
                    <li>
                        <strong>ID:</strong> ${contract.id}<br>
                        <strong>Contract Date:</strong> ${new Date(
                          contract.contractDate
                        ).toLocaleDateString()}<br>
                        <strong>Property Address:</strong> ${
                          contract.propertyAddress
                        }<br>
                        <strong>Door Number:</strong> ${
                          contract.propertyDoorNumber
                        }<br>
                        <strong>Fee Monthly:</strong> ${
                          contract.feeMonthly
                        } EUR<br>
                        <strong>Contract Length:</strong> ${
                          contract.contractLength
                        }<br>
                        <strong>Property Type:</strong> ${
                          contract.propertyType
                        } ${
            contract.otherPropertyType
              ? "(" + contract.otherPropertyType + ")"
              : ""
          }<br>
                        <strong>Tenant IDs:</strong> ${tenantIdsList}<br>
                        <strong>Landlord ID:</strong> ${contract.landlordId}<br>
                        <button onclick="deleteContract(${
                          contract.id
                        })">Delete</button>
                        <button onclick="editContract(${
                          contract.id
                        })">Edit</button>
                    </li>
                `;
        })
        .join("");
      document.getElementById("contractsList").innerHTML = listItems;
    });
}

function addContract() {
  const contractData = {
    contractDate: document.getElementById("contractDate").value,
    propertyAddress: document.getElementById("propertyAddress").value,
    propertyDoorNumber: document.getElementById("propertyDoorNumber").value,
    feeMonthly: document.getElementById("feeMonthly").value,
    contractLength: document.getElementById("contractLength").value,
    propertyType: document.getElementById("propertyType").value,
    otherPropertyType: document.getElementById("otherPropertyType").value,
    tenantIds: document
      .getElementById("tenantIds")
      .value.split(",")
      .map((id) => id.trim()), 
    landlordId: document.getElementById("landlordId").value,
  };

  fetch("http://localhost:3000/contracts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contractData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to create contract");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Contract added:", data);
      loadContracts();
      document.getElementById("contractForm").reset();
    })
    .catch((error) => {
      console.error("Error adding contract:", error);
      alert("Failed to add contract: " + error.message);
    });
}

document.getElementById("contractForm").onsubmit = function (e) {
  e.preventDefault(); 
  addContract(); 
};

function deleteContract(id) {
  fetch(`${baseUrl}/contracts/${id}`, { method: "DELETE" }).then(() =>
    loadContracts()
  );
}

function editContract(id) {
  fetch(`http://localhost:3000/contracts/${id}`)
    .then((response) => response.json())
    .then((contract) => {
      document.getElementById("editContractDate").value =
        contract.contractDate.split("T")[0];
      document.getElementById("editPropertyAddress").value =
        contract.propertyAddress;
      document.getElementById("editPropertyDoorNumber").value =
        contract.propertyDoorNumber;
      document.getElementById("editFeeMonthly").value = contract.feeMonthly;
      document.getElementById("editContractLength").value =
        contract.contractLength;
      document.getElementById("editPropertyType").value = contract.propertyType;
      document.getElementById("editOtherPropertyType").value =
        contract.otherPropertyType || "";
      document.getElementById("editTenantIds").value =
        contract.tenantIds.join(", ");
      document.getElementById("editLandlordId").value = contract.landlordId;

      document.getElementById("editContractModal").style.display = "block";

      document.getElementById("editContractForm").onsubmit = function (e) {
        e.preventDefault();
        updateContract(id);
      };
    })
    .catch((error) => {
      console.error("Error fetching contract:", error);
      alert("Failed to fetch contract details.");
    });
}

function updateContract(id) {
  const updatedContract = {
    contractDate: document.getElementById("editContractDate").value,
    propertyAddress: document.getElementById("editPropertyAddress").value,
    propertyDoorNumber: document.getElementById("editPropertyDoorNumber").value,
    feeMonthly: parseFloat(document.getElementById("editFeeMonthly").value),
    contractLength: document.getElementById("editContractLength").value,
    propertyType: document.getElementById("editPropertyType").value,
    otherPropertyType:
      document.getElementById("editOtherPropertyType").value || "",
    tenantIds: document
      .getElementById("editTenantIds")
      .value.split(",")
      .map((id) => parseInt(id.trim())),
    landlordId: parseInt(document.getElementById("editLandlordId").value),
  };

  fetch(`http://localhost:3000/contracts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedContract),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to update contract");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Contract updated:", data);
      loadContracts(); 
      document.getElementById("editContractModal").style.display = "none";
    })
    .catch((error) => {
      console.error("Error updating contract:", error);
      alert("Failed to update contract: " + error.message);
    });
}

document.getElementById("editContractForm").onsubmit = function (e) {
  e.preventDefault();
  updateContract(id);
};

document.getElementById("contractForm").onsubmit = function (e) {
  e.preventDefault();
  addContract();
};

loadTenants();
loadLandlords();
loadContracts();