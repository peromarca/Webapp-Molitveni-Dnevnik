const express = require('express');
const router = express.Router();
const { Client } = require('pg');
const bcrypt = require('bcrypt');


// Database konekcija (Docker compatible)
const con = new Client({
   host: process.env.DB_HOST || "localhost",
   user: process.env.DB_USER || "postgres",
   port: process.env.DB_PORT || 5432,
   password: process.env.DB_PASSWORD || "oblak333",
   database: process.env.DB_NAME || "dnevnik"
});


con.connect().then(() => {
   console.log("Uspesno povezivanje sa bazom podataka");
}).catch((err) => {
   console.log("Greska prilikom povezivanja sa bazom podataka: " + err);
});

router.get('/ispisiKorisnike', (req, res) => {
   const fetch_query = 'SELECT * FROM DnevnikUser';
   con.query(fetch_query, (err, result) => {
      if (err) {
         res.send("Greska prilikom izvrsavanja upita: " + err);
      } else {
         res.send("Podaci o korisnicima: " + JSON.stringify(result.rows));
      }

   });
});

router.get('/users', (req, res) => {
   const { email } = req.query;

   const query = 'SELECT username, email, idnum FROM DnevnikUser WHERE email = $1';
   con.query(query, [email], (err, result) => {
      if (err) {
         return res.json({ success: false, error: 'Greška servera' });
      }

      if (result.rows.length === 0) {
         return res.json({ success: false, error: 'Korisnik ne postoji' });
      }

      const user = result.rows[0];
      res.json({
         success: true,
         user: {
            ime: user.username,
            email: user.email,
            id: user.idnum
         }
      });
   });
});

// Dodajte novu rutu za registraciju
router.post('/register', async (req, res) => {
   try {
      const { ime, email, pass, pass2 } = req.body;

      // Validacija podataka
      if (!ime || !email || !pass || !pass2) {
         return res.json({ success: false, error: "Sva polja su obavezna" });
      }

      if (pass !== pass2) {
         return res.json({ success: false, error: "Lozinke se ne poklapaju" });
      }

      if (pass.length < 6) {
         return res.json({ success: false, error: "Lozinka mora imati najmanje 6 karaktera" });
      }

      // Proveri da li korisnik već postoji
      const check_query = 'SELECT * FROM DnevnikUser WHERE email = $1 OR username = $2';
      con.query(check_query, [email, ime], async (err, result) => {
         if (err) {
            console.log("Greška prilikom provere korisnika: " + err);
            return res.json({ success: false, error: "Greška prilikom provere korisnika" });
         }

         if (result.rows.length > 0) {
            return res.json({ success: false, error: "Korisnik sa tim email-om već postoji" });
         }

         // Ako korisnik ne postoji, pronađi maksimalni idnum
         const max_query = 'SELECT MAX(idnum) as max_id FROM DnevnikUser';
         con.query(max_query, async (err, maxResult) => {
            if (err) {
               console.log("Greška prilikom pronalaska max idnum: " + err);
               return res.json({ success: false, error: "Greška prilikom generisanja ID-a" });
            }

            // Ako nema korisnika u bazi, počni od 1, inače max + 1
            const maxId = maxResult.rows[0].max_id;
            const newIdnum = maxId ? maxId + 1 : 1;

            // Dodaj korisnika sa novim idnum
            const hashpass = await bcrypt.hash(pass, 10);
            const insert_query = 'INSERT INTO DnevnikUser (username, hashpass, idnum,email ) VALUES ($1, $2, $3, $4)';

            con.query(insert_query, [ime, hashpass, newIdnum, email], (err, result) => {
               if (err) {
                  console.log("Greška prilikom registracije korisnika: " + err);
                  return res.json({ success: false, error: "Greška prilikom registracije" });
               } else {
                  console.log("Korisnik uspešno registrovan sa idnum: " + newIdnum);

                  // ✅ PREBACI NA LOGIN PAGE
                  return res.json({ success: true, message: "Uspešno registrovan korisnik" });
               }
            });
         });
      });

   } catch (error) {
      console.log("Greška pri registraciji: " + error);
      return res.json({ success: false, error: "Serverska greška", ime: '', email: '', user: null });
   }
});

router.post('/login', (req, res) => {
   const { email, pass } = req.body;
   if (!email || !pass) {
      return res.json({ success: false, error: 'Sva polja su obavezna' });
   }
   if (!email.includes('@') || !email.includes('.')) {
      return res.json({ success: false, error: 'Neispravna email adresa' });
   }

   const check_query = 'SELECT * FROM DnevnikUser WHERE email = $1';
   con.query(check_query, [email], async (err, result) => {
      if (err) {
         console.log("Greška prilikom provere korisnika: " + err);
         return res.json({ success: false, error: 'Greška servera' });
      }

      if (result.rows.length === 0) {
         return res.json({ success: false, error: "Korisnik sa tim email-om ne postoji" });
      }
      if (await bcrypt.compare(pass, result.rows[0].hashpass)) {
         req.session.user = { id: result.rows[0].idnum, username: result.rows[0].username, email: result.rows[0].email };
         return res.json({
            success: true,
            user: req.session.user
         });
      }

      else {
         return res.json({ success: false, error: "Pogrešna lozinka" });
      }

   });


});

router.post('/logout', (req, res) => {
   req.session.destroy((err) => {
      if (err) {
         return res.json({ success: false, error: 'Greška pri odjavi' });
      }
      res.clearCookie('connect.sid');
      res.json({ success: true, message: 'Uspešno ste se odjavili' });
   });





});


router.get('/check-session', (req, res) => {
   if (req.session.user) {
      res.json({ success: true, user: req.session.user });
   } else {
      res.json({ success: false });
   }
});

module.exports = router;
