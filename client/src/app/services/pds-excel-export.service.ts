import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { PersonalDataSheet } from './pds.service';

@Injectable({
  providedIn: 'root',
})
export class PDSExcelExportService {
  async exportToExcel(pds: PersonalDataSheet): Promise<void> {
    try {
      // Load the template
      const response = await fetch('/assets/template - pds .xlsx');
      const arrayBuffer = await response.arrayBuffer();

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(arrayBuffer);

      // Get all worksheets (template has 4 main sheets + 1 lookup)
      const sheet1 = workbook.getWorksheet(1); // Personal Info, Family, Education
      const sheet2 = workbook.getWorksheet(2); // Eligibility, Work Experience
      const sheet3 = workbook.getWorksheet(3); // Voluntary Work, Training, Other Info
      const sheet4 = workbook.getWorksheet(4); // Questionnaire, References

      if (!sheet1 || !sheet2 || !sheet3 || !sheet4) {
        throw new Error('One or more worksheets not found in template');
      }

      // ===== SHEET 1: PERSONAL INFORMATION =====

      // Basic Personal Information - Column D is the WHITE input cell (next to gray labels in C)
      this.setCellValue(sheet1, 'D10', pds.surname?.toUpperCase()); // Row 10: SURNAME
      this.setCellValue(sheet1, 'D11', pds.first_name?.toUpperCase()); // Row 11: FIRST NAME
      this.setCellValue(sheet1, 'O11', pds.name_extension?.toUpperCase()); // Row 11: NAME EXTENSION (far right)
      this.setCellValue(sheet1, 'D12', pds.middle_name?.toUpperCase()); // Row 12: MIDDLE NAME

      // Date of Birth (Row 13) - Column D
      this.setCellValue(sheet1, 'D13', this.formatDate(pds.date_of_birth));

      // Place of Birth (Row 15) - Column C (merged cell area)
      this.setCellValue(sheet1, 'C15', pds.place_of_birth);

      // Sex at Birth (Row 16) - Column C
      this.setCellValue(sheet1, 'C16', pds.sex);

      // Civil Status (Row 17-18) - Column D
      this.setCellValue(sheet1, 'D17', pds.civil_status);

      // Height (Row 22-23) - Column D
      this.setCellValue(sheet1, 'D22', pds.height);

      // Weight (Row 24) - Column D
      this.setCellValue(sheet1, 'D24', pds.weight);

      // Blood Type (Row 25-26) - Column D
      this.setCellValue(sheet1, 'D25', pds.blood_type);

      // Citizenship (Row 13) - Column H
      this.setCellValue(sheet1, 'H13', pds.citizenship_type);
      if (pds.citizenship_type === 'Dual Citizenship' && pds.dual_citizenship_country) {
        this.setCellValue(sheet1, 'O15', pds.dual_citizenship_country); // Row 15: Country field
      }

      // Government IDs - Column D for input (next to gray labels)
      this.setCellValue(sheet1, 'D27', pds.gsis_id_no); // Row 27: UMID ID NO
      this.setCellValue(sheet1, 'D29', pds.pag_ibig_id_no); // Row 29: PAG-IBIG ID NO
      this.setCellValue(sheet1, 'C31', pds.philhealth_no); // Row 31: PHILHEALTH NO (starts at C)
      this.setCellValue(sheet1, 'C32', pds.sss_no); // Row 32: PhilSys Number (starts at C)
      this.setCellValue(sheet1, 'D33', pds.tin_no); // Row 33: TIN NO
      this.setCellValue(sheet1, 'B34', pds.agency_employee_no); // Row 34: AGENCY EMPLOYEE NO (starts at B)

      // Residential Address - Right side of sheet (columns H-O)
      // Row 18: House/Block/Lot No. and Street
      const resHouseStreet = [pds.residential_house_no, pds.residential_street]
        .filter((x) => x)
        .join(', ');
      this.setCellValue(sheet1, 'O18', resHouseStreet);

      // Row 21: Subdivision/Village and Barangay
      const resSubdivBarangay = [pds.residential_subdivision, pds.residential_barangay]
        .filter((x) => x)
        .join(', ');
      this.setCellValue(sheet1, 'O21', resSubdivBarangay);

      // Row 23: City/Municipality and Province
      const resCityProvince = [pds.residential_city, pds.residential_province]
        .filter((x) => x)
        .join(', ');
      this.setCellValue(sheet1, 'O23', resCityProvince);

      // Row 24: ZIP CODE
      this.setCellValue(sheet1, 'I24', pds.residential_zip_code);

      // Permanent Address - Right side of sheet (columns H-O)
      // Row 26: House/Block/Lot No. and Street
      const permHouseStreet = [pds.permanent_house_no, pds.permanent_street]
        .filter((x) => x)
        .join(', ');
      this.setCellValue(sheet1, 'O26', permHouseStreet);

      // Row 28: Subdivision/Village and Barangay
      const permSubdivBarangay = [pds.permanent_subdivision, pds.permanent_barangay]
        .filter((x) => x)
        .join(', ');
      this.setCellValue(sheet1, 'O28', permSubdivBarangay);

      // Row 30: City/Municipality and Province
      const permCityProvince = [pds.permanent_city, pds.permanent_province]
        .filter((x) => x)
        .join(', ');
      this.setCellValue(sheet1, 'O30', permCityProvince);

      // Row 31: ZIP CODE
      this.setCellValue(sheet1, 'I31', pds.permanent_zip_code);

      // Contact Information - Column H (right side)
      this.setCellValue(sheet1, 'H32', pds.telephone_no); // Row 32: TELEPHONE NO
      this.setCellValue(sheet1, 'H33', pds.mobile_no); // Row 33: MOBILE NO
      this.setCellValue(sheet1, 'H34', pds.email_address); // Row 34: E-MAIL ADDRESS

      // ===== FAMILY BACKGROUND =====

      // Spouse (Row 36-42) - Column C for input
      this.setCellValue(sheet1, 'C36', pds.spouse_surname?.toUpperCase());
      this.setCellValue(sheet1, 'C37', pds.spouse_first_name?.toUpperCase());
      this.setCellValue(sheet1, 'H37', pds.spouse_name_ext?.toUpperCase());
      this.setCellValue(sheet1, 'C38', pds.spouse_middle_name?.toUpperCase());
      this.setCellValue(sheet1, 'C39', pds.spouse_occupation);
      this.setCellValue(sheet1, 'C40', pds.spouse_employer);
      this.setCellValue(sheet1, 'C41', pds.spouse_business_address);
      this.setCellValue(sheet1, 'C42', pds.spouse_telephone);

      // Children (starting at row 36, columns I-N for name and date)
      if (pds.children && pds.children.length > 0) {
        let childRow = 36;
        pds.children.forEach((child, index) => {
          if (index < 12) {
            // Template capacity
            this.setCellValue(sheet1, `I${childRow}`, child.child_name?.toUpperCase());
            this.setCellValue(sheet1, `N${childRow}`, this.formatDate(child.date_of_birth));
            childRow++;
          }
        });
      }

      // Father (Row 43-45) - Column C for input
      this.setCellValue(sheet1, 'C43', pds.father_surname?.toUpperCase());
      this.setCellValue(sheet1, 'C44', pds.father_first_name?.toUpperCase());
      this.setCellValue(sheet1, 'H44', pds.father_name_ext?.toUpperCase());
      this.setCellValue(sheet1, 'C45', pds.father_middle_name?.toUpperCase());

      // Mother's Maiden Name (Row 47-49) - Column C for input
      this.setCellValue(sheet1, 'C47', pds.mother_surname?.toUpperCase());
      this.setCellValue(sheet1, 'C48', pds.mother_first_name?.toUpperCase());
      this.setCellValue(sheet1, 'C49', pds.mother_middle_name?.toUpperCase());

      // ===== EDUCATIONAL BACKGROUND =====
      // Education section starts after row 50 (need to verify exact rows)
      if (pds.education && pds.education.length > 0) {
        const eduRows: { [key: string]: number } = {
          ELEMENTARY: 52,
          SECONDARY: 53,
          VOCATIONAL: 54,
          COLLEGE: 55,
          'GRADUATE STUDIES': 56,
        };

        pds.education.forEach((edu) => {
          const row = eduRows[edu.level];
          if (row) {
            this.setCellValue(sheet1, `C${row}`, edu.school_name);
            this.setCellValue(sheet1, `G${row}`, edu.degree_course);
            this.setCellValue(sheet1, `K${row}`, edu.period_from);
            this.setCellValue(sheet1, `L${row}`, edu.period_to);
            this.setCellValue(sheet1, `M${row}`, edu.highest_level_earned);
            this.setCellValue(sheet1, `N${row}`, edu.year_graduated);
            this.setCellValue(sheet1, `O${row}`, edu.scholarship_honors);
          }
        });
      }

      // ===== SHEET 2: ELIGIBILITY & WORK EXPERIENCE =====

      // Civil Service Eligibility (starting at row 5)
      if (pds.eligibilities && pds.eligibilities.length > 0) {
        let eligRow = 5;
        pds.eligibilities.forEach((elig, index) => {
          if (index < 7) {
            // Template capacity
            this.setCellValue(sheet2, `B${eligRow}`, elig.career_service);
            this.setCellValue(sheet2, `F${eligRow}`, elig.rating);
            this.setCellValue(sheet2, `G${eligRow}`, this.formatDate(elig.date_of_examination));
            this.setCellValue(sheet2, `H${eligRow}`, elig.place_of_examination);
            this.setCellValue(sheet2, `I${eligRow}`, elig.license_number);
            this.setCellValue(sheet2, `J${eligRow}`, this.formatDate(elig.license_validity));
            eligRow++;
          }
        });
      }

      // Work Experience (starting at row 18 - rows 15-17 are headers)
      if (pds.work_experiences && pds.work_experiences.length > 0) {
        let workRow = 18;
        pds.work_experiences.forEach((work, index) => {
          if (index < 28) {
            // Template capacity
            this.setCellValue(sheet2, `B${workRow}`, this.formatDate(work.date_from));
            this.setCellValue(sheet2, `C${workRow}`, this.formatDate(work.date_to));
            this.setCellValue(sheet2, `D${workRow}`, work.position_title);
            this.setCellValue(sheet2, `G${workRow}`, work.department_agency);
            this.setCellValue(sheet2, `J${workRow}`, work.status_of_appointment);
            this.setCellValue(sheet2, `K${workRow}`, work.is_government_service ? 'Y' : 'N');
            workRow++;
          }
        });
      }

      // ===== SHEET 3: VOLUNTARY WORK, TRAINING, OTHER INFO =====

      // Voluntary Work (starting at row 6)
      if (pds.voluntary_works && pds.voluntary_works.length > 0) {
        let volRow = 6;
        pds.voluntary_works.forEach((vol, index) => {
          if (index < 7) {
            // Template capacity
            this.setCellValue(sheet3, `B${volRow}`, vol.organization_name);
            this.setCellValue(sheet3, `E${volRow}`, this.formatDate(vol.date_from));
            this.setCellValue(sheet3, `F${volRow}`, this.formatDate(vol.date_to));
            this.setCellValue(sheet3, `G${volRow}`, vol.number_of_hours);
            this.setCellValue(sheet3, `H${volRow}`, vol.position_nature_of_work);
            volRow++;
          }
        });
      }

      // Learning and Development / Training (starting at row 18 - rows 14-17 are headers)
      if (pds.trainings && pds.trainings.length > 0) {
        let trainRow = 18;
        pds.trainings.forEach((train, index) => {
          if (index < 21) {
            // Template capacity
            this.setCellValue(sheet3, `B${trainRow}`, train.title);
            this.setCellValue(sheet3, `E${trainRow}`, this.formatDate(train.date_from));
            this.setCellValue(sheet3, `F${trainRow}`, this.formatDate(train.date_to));
            this.setCellValue(sheet3, `G${trainRow}`, train.number_of_hours);
            this.setCellValue(sheet3, `H${trainRow}`, train.type_of_ld);
            this.setCellValue(sheet3, `I${trainRow}`, train.conducted_by);
            trainRow++;
          }
        });
      }

      // Other Information (starting at row 42 - row 40-41 are headers)
      if (pds.other_info && pds.other_info.length > 0) {
        const skills = pds.other_info.filter((info) => info.info_type === 'SKILL');
        const recognitions = pds.other_info.filter((info) => info.info_type === 'RECOGNITION');
        const memberships = pds.other_info.filter((info) => info.info_type === 'MEMBERSHIP');

        // Skills (Column B, starting row 42)
        let skillRow = 42;
        skills.forEach((skill, index) => {
          if (index < 7) {
            this.setCellValue(sheet3, `B${skillRow}`, skill.details);
            skillRow++;
          }
        });

        // Recognitions (Column D, starting row 42)
        let recogRow = 42;
        recognitions.forEach((recog, index) => {
          if (index < 7) {
            this.setCellValue(sheet3, `D${recogRow}`, recog.details);
            recogRow++;
          }
        });

        // Memberships (Column J, starting row 42)
        let memberRow = 42;
        memberships.forEach((member, index) => {
          if (index < 7) {
            this.setCellValue(sheet3, `J${memberRow}`, member.details);
            memberRow++;
          }
        });
      }

      // ===== SHEET 4: QUESTIONNAIRE & REFERENCES =====

      // Questionnaire (Yes/No questions) - starting around row 13
      // Q34a (Row 13-14)
      this.setCellValue(sheet4, 'G13', pds.q34_a_answer ? 'YES' : 'NO');
      this.setCellValue(sheet4, 'G14', pds.q34_a_details);

      // Q34b (Row 18-21)
      this.setCellValue(sheet4, 'G18', pds.q34_b_answer ? 'YES' : 'NO');
      this.setCellValue(sheet4, 'G19', pds.q34_b_details);

      // Q35a (Row 13-16)
      this.setCellValue(sheet4, 'G13', pds.q35_a_answer ? 'YES' : 'NO');
      this.setCellValue(sheet4, 'G14', pds.q35_a_details);

      // Q35b (Row 18-21)
      this.setCellValue(sheet4, 'G18', pds.q35_b_answer ? 'YES' : 'NO');
      this.setCellValue(sheet4, 'G19', pds.q35_b_details);

      // Q36 (Row 23-26)
      this.setCellValue(sheet4, 'G23', pds.q36_answer ? 'YES' : 'NO');
      this.setCellValue(sheet4, 'G24', pds.q36_details);

      // Q37 (Row 27-30)
      this.setCellValue(sheet4, 'G27', pds.q37_answer ? 'YES' : 'NO');
      this.setCellValue(sheet4, 'G28', pds.q37_details);

      // Q38 (Row 31-33)
      this.setCellValue(sheet4, 'G31', pds.q38_answer ? 'YES' : 'NO');
      this.setCellValue(sheet4, 'G32', pds.q38_details);

      // Q39 (Row 34-36)
      this.setCellValue(sheet4, 'G34', pds.q39_answer ? 'YES' : 'NO');
      this.setCellValue(sheet4, 'G35', pds.q39_details);

      // Q40 (Row 37-40)
      this.setCellValue(sheet4, 'G37', pds.q40_answer ? 'YES' : 'NO');
      this.setCellValue(sheet4, 'G38', pds.q40_details);

      // Q41 (Row 41-44)
      this.setCellValue(sheet4, 'G41', pds.q41_answer ? 'YES' : 'NO');
      this.setCellValue(sheet4, 'H38', pds.q41_country);

      // Q42 (Row 43-44)
      this.setCellValue(sheet4, 'G43', pds.q42_answer ? 'YES' : 'NO');
      this.setCellValue(sheet4, 'G44', pds.q42_group);

      // Q43 (Row 45-46)
      this.setCellValue(sheet4, 'G45', pds.q43_answer ? 'YES' : 'NO');
      this.setCellValue(sheet4, 'G46', pds.q43_id_no);

      // Q44 (Row 47-48)
      this.setCellValue(sheet4, 'G47', pds.q44_answer ? 'YES' : 'NO');
      this.setCellValue(sheet4, 'G48', pds.q44_id_no);

      // References (starting around row 51)
      if (pds.references && pds.references.length > 0) {
        let refRow = 51;
        pds.references.forEach((ref, index) => {
          if (index < 3) {
            // Template capacity
            this.setCellValue(sheet4, `C${refRow}`, ref.name);
            this.setCellValue(sheet4, `G${refRow}`, ref.address);
            this.setCellValue(sheet4, `K${refRow}`, ref.telephone_number);
            refRow++;
          }
        });
      }

      // Government ID (approximate rows)
      this.setCellValue(sheet4, 'C55', pds.government_issued_id);
      this.setCellValue(sheet4, 'C56', pds.government_id_number);
      this.setCellValue(sheet4, 'C57', this.formatDate(pds.government_id_date_issued));

      // Generate the file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const fileName = `PDS_${pds.surname}_${pds.first_name}_${new Date().getTime()}.xlsx`;
      saveAs(blob, fileName);
    } catch (error) {
      console.error('Error exporting PDS to Excel:', error);
      throw error;
    }
  }

  private setCellValue(worksheet: ExcelJS.Worksheet, cellAddress: string, value: any): void {
    const cell = worksheet.getCell(cellAddress);
    if (cell) {
      cell.value = value || '';
    }
  }

  private formatDate(dateString?: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }
}
