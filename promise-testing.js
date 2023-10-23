const fs = require("fs");
const readline = require("readline");
const validator = require("validator");
const promise = require("promise");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// create folder "data" if still empty
const lokasiDirr = "./data";
if (!fs.existsSync(lokasiDirr)) {
  fs.mkdirSync(lokasiDirr);
}

// create file "contacts.json" if still emptys
const filePath = `./data/contacts.json`;
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, `[]`, `utf-8`);
}

let namamu, nomormu, email;

function giveQuestion(question) {
  return new Promise((resolve, reject) => {
    rl.question(question, (answer) => {
      if (!answer) {
        reject(new Error("Inputan tidak boleh kosong..."));
      } else {
        resolve(answer);
      }
    });
  });
}

//fungsi mengambil nama dari user
function prosesNama() {
  giveQuestion("Masukan namamu: ")
    .then((nama) => {
      namamu = nama;
      prosesNomor();
    })
    .catch((error) => {
      console.error(error);
      prosesNama();
    });
}

// fungsi mengambil nomor handphone user
function prosesNomor() {
  giveQuestion("Berapa Nomormu: ")
    .then((nomor) => {
      //validasi nomor
      if (validator.isMobilePhone(nomor, "id-ID")) {
        nomormu = nomor;
        prosesEmail();
      } else {
        console.log(
          "Nomor yang anda masukan invalid, silahkan coba masukan kembali!!..."
        );
        prosesNomor();
      }
    })
    .catch((error) => {
      console.error(error);
      prosesNomor();
    });
}

// fungsi mengambil email dari user
function prosesEmail() {
  giveQuestion("Masukan Emailmu: ")
    .then((userEmail) => {
      //validasi email
      if (validator.isEmail(userEmail)) {
        email = userEmail;
        console.log("Data Tersimpan, Terima Kasih!!!!");
        rl.close();
        saveContact();
      } else {
        console.log(
          "Email yang anda masukan invalid, coba masukan kembali!!..."
        );
        prosesEmail();
      }
    })
    .catch((error) => {
      console.error(error);
      prosesEmail();
    });
}

//menyimpan data ke JSON
function saveContact() {
  // Membuat objek "contact" dengan data yang sudah dikumpulkan sebelumnya.
  const contact = { namamu, nomormu, email };

  //Membaca file JSON
  const file = fs.readFileSync(filePath, "utf8");
  const contacts = JSON.parse(file);

  //menambah kontak baru
  contacts.push(contact);

  //menyimpan data yang sudah diperbarui
  fs.writeFileSync(filePath, JSON.stringify(contacts));
}

prosesNama();
