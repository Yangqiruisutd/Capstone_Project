import React, { useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";

const CSVFileDrop = () => {
  const [csvData, setCsvData] = useState(null);
  const [response, setResponse] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "text/csv") {
      const reader = new FileReader();
      reader.onload = (event) => {
        const csvString = event.target.result;
        parseCSV(csvString);
      };
      reader.readAsText(file);
    } else {
      alert("Please select a CSV file.");
    }
  };

  const parseCSV = (csvString) => {
    const rows = csvString.split("\n");
    const results = rows.map((row) => row.split(","));
    console.log(results); // Log parsed data to the console
    setCsvData(results);

    // Send parsed CSV data to server
    sendCSVData(results);
  };

  const sendCSVData = async (csvData) => {
    try {
      const formData = new FormData();
      const file = new File([csvData], "data.csv", { type: "text/csv" });
      formData.append("csvFile", file);

      // Make HTTP POST request to server
      const response = await axios.post('http://ec2-3-1-100-195.ap-southeast-1.compute.amazonaws.com:3000/upload', formData)
      console.log(response.data);
      setResponse(response.data);
    } catch (error) {
      console.error("Error sending CSV data:", error);
    }
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      {csvData ? (
        <div>
          <p>CSV file parsed</p>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      ) : (
        <p>Select a CSV file to upload</p>
      )}
    </div>
  );
};

export default CSVFileDrop;
