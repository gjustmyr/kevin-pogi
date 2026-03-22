const db = require("./models");
const Faculty = db.Faculty;
const FacultyCredential = db.FacultyCredential;
const CredentialCertificate = db.CredentialCertificate;

async function testCertificates() {
  try {
    console.log("Testing certificate associations...\n");

    // Get all faculty with credentials and certificates
    const faculty = await Faculty.findAll({
      include: [
        {
          model: FacultyCredential,
          as: "faculty_credential",
          required: false,
          include: [
            {
              model: CredentialCertificate,
              as: "credential_certificates",
              required: false,
            },
          ],
        },
      ],
      limit: 5,
    });

    console.log(`Found ${faculty.length} faculty members\n`);

    faculty.forEach((f) => {
      console.log(`Faculty: ${f.first_name} ${f.last_name}`);
      if (f.faculty_credential) {
        console.log(`  - Has credentials: YES`);
        console.log(`  - Education: ${f.faculty_credential.education}`);
        if (f.faculty_credential.credential_certificates) {
          console.log(
            `  - Certificates: ${f.faculty_credential.credential_certificates.length}`,
          );
          f.faculty_credential.credential_certificates.forEach((cert) => {
            console.log(`    * ${cert.certificate_name}`);
          });
        } else {
          console.log(`  - Certificates: NONE (null)`);
        }
      } else {
        console.log(`  - Has credentials: NO`);
      }
      console.log("");
    });

    // Check total certificates in database
    const totalCerts = await CredentialCertificate.count();
    console.log(`\nTotal certificates in database: ${totalCerts}`);

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

testCertificates();
