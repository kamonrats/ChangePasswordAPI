const express = require("express");
const stringSimilarity = require("string-similarity");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Load a mock data from JSON file
const users = require("./db");

//Base URI
app.get("/", (req, res) => {
  console.log(`[INFO] Base URI called`);
  res.send("Hello World!");
});

//Get all users
app.get("/users", (req, res) => {
  console.log(`[INFO] Get all users`);
  res.json(users);
});

//Get a specific user by id
app.get("/users/:id", (req, res) => {
  console.log(`[INFO] Get specific user`);
  res.json(users.find((user) => user.id === req.params.id));
});

//Verify old password and update new password
app.put("/users/:id/password", (req, res) => {
  const updateIndex = users.findIndex((user) => user.id === req.params.id);
  var changed = false;
  var oldpwd = req.body.oldPassword;
  var newpwd = req.body.newPassword;

  var changed = ChangePassword(updateIndex, oldpwd, newpwd);

  res.json(changed);
});

function ChangePassword(currentIndex, oldPassword, newPassword) {
  if (oldPassword == users[currentIndex].password) {
    console.log(`[INFO] Old password has been verified and it is valid`);

    var similarity = stringSimilarity.compareTwoStrings(
      oldPassword,
      newPassword
    );
    console.log(`[INFO] Password Similarity = ${similarity}`);
    if (similarity <= 0.8) {
      const patt = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$&\*])(?=.{18,})[a-zA-Z0-9!@#\$&\*]+$/;
      var matchedResult = newPassword.match(patt);
      if (matchedResult == newPassword) {
        console.log(
          `[INFO] New password is matched with the criteria about characters`
        );
      } else {
        console.log(
          `[ERROR] New password is invalid such less than 18, at least 1 character should be capital, lower letter, number and special character`
        );
        return false;
      }
      var exceedSpecial = checkNoOfSpecialChar(newPassword, 4);
      if (exceedSpecial == false) {
        console.log(`[INFO] Special characters is within length`);
      } else {
        console.log(`[ERROR] Special characters is more than limits`);
        return false;
      }
      var repeated = checkRepeatedString(newPassword);
      if (repeated == false) {
        console.log(`[INFO] No repeated characters`);
      } else {
        console.log(
          `[ERROR] Over limit repeated characters detected e.g. aaaaa, 11111`
        );
        return false;
      }

      var percentNum = checkPercentNumber(newPassword);
      if (percentNum < 50) {
        console.log(`[INFO] Numbers are less than 50% of the whole password`);
      } else {
        console.log(`[ERROR] Numbers are equal to or over than 50% of the whole password`); //[Som] add "equal to"
        return false;
      }
      users[currentIndex].password = newPassword;
      console.log(`[INFO] Password has been changed successfully`);
      console.log(`=============================================`);
      return true;
    }
  }
  console.log(`[ERROR] Old password is invalid`);
  return false;
}

function checkPercentNumber(myString) {
  const regex = /([0-9])/g;
  var noNumber = 0;
  var arrNumber = myString.match(regex);
  noNumber = arrNumber.length;
  percentNum = (100 * noNumber) / myString.length;
  console.log(`[INFO] Percentage of Number is ${percentNum}`);
  return percentNum;
}

function checkNoOfSpecialChar(myString, myLength) {
  const regex = /([!@#\$&\*])/g;
  var noSpecial = 0;
  var arrSpecial = myString.match(regex);
  noSpecial = arrSpecial.length;
  if (noSpecial > myLength) {
    return true;
  }
  return false;
}

function checkRepeatedString(myString) {
  const regex = /([a-zA-Z0-9!@#\$&\*])\1{4}/g;
  let m;
  var found = false;

  while ((m = regex.exec(myString)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    // The result can be accessed through the `m`-variable.
    m.forEach((match, groupIndex) => {
      console.log(
        `[ERROR] Found repeated string match, group ${groupIndex}: ${match}`
      );
    });
    found = true;
  }
  return found;
}

app.listen(port, () => console.log(`My app listening on port ${port}!`));
