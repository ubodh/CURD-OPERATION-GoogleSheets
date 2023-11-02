const express = require("express");
const { google } = require("googleapis");
const app = express();

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.get('/users', (req, res) => {
  res.render("index.ejs");
});

app.get('/', async (req, res) => {
  try {
    //googlesheets linke is below
    // https://docs.google.com/spreadsheets/d/1-BGDBH07qpgEbH-tF5E3t1Ft2UhToFuQWTF2CFs_aWQ/edit#gid=0

    // Load the service account credentials JSON file
    const auth = new google.auth.GoogleAuth({
      keyFile: "subodhDB.json", // Specify the correct path to your service account credentials file
      scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    // Create a client instance for authentication
    const client = await auth.getClient();

    // Create an instance of the Google Sheets API
    const googleSheets = google.sheets({ version: 'v4', auth: client });

    // Define the spreadsheetId for the Google Sheet you want to access
    const spreadsheetId = "1-BGDBH07qpgEbH-tF5E3t1Ft2UhToFuQWTF2CFs_aWQ"; // Replace with your actual spreadsheet ID

    // Get data from the spreadsheet
    const getData = await googleSheets.spreadsheets.values.get({
      spreadsheetId,
      range: "sheet1!A:C", // Specify the sheet name and desired range
    });

    // Data to append to the spreadsheet
    const valuesToAppend = [
      ['ravi kumar sharma', 'ravi@gmail.com', "22323232"],
      ['sovita kumar sharma', 'sovit@gmail.com', "1111111111"],
      ['mantu kumar ', 'mantu@gmail.com', "10000111111"],
    ];

    const updateData = await googleSheets.spreadsheets.values.update({
      auth,
      spreadsheetId,
      range: "Sheet1!A:C",
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [["Ganesh ji", "10@gmail.com", 34444444444]],
      }
    });

    const rows = getData.data.values;
    if (rows.length) {
      console.log('Data:');
      rows.forEach(row => {
        console.log(row.join(', '));
      });
    } else {
      console.log('No data found.');
    }

    // Append data to the spreadsheet
    const appendData = await googleSheets.spreadsheets.values.append({
      spreadsheetId,
      range: "sheet1!A:C",
      valueInputOption: "USER_ENTERED", // Use "USER_ENTERED" for formatting as a user would enter data
      resource: {
        values: valuesToAppend,
      },
    });

    // Send both responses in a single JSON object
    res.send({
      getData: getData.data,
      appendData: appendData.data,
      updateData: updateData.data,
    });

  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching or writing data to Google Sheets');
  }
});

app.listen(3200, () => {
  console.log('Server is running on port 3200');
});
