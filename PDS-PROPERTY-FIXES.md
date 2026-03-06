# Personal Data Sheet - Property Name Corrections

This document lists all the property name mismatches that need to be fixed in the HTML template.

## TypeScript Interface Property Names (from pds.service.ts)

### Main PersonalDataSheet Properties:
- ✅ surname, first_name, middle_name - CORRECT
- ✅ date_of_birth, place_of_birth, sex, civil_status - CORRECT  
- ✅ height, weight, blood_type - CORRECT
- ✅ gsis_id_no, **pag_ibig_id_no** (not pagibig_id_no), philhealth_no, sss_no, tin_no - FIX NEEDED
- ✅ citizenship_type, **dual_citizenship_country** (not citizenship_country) - FIX NEEDED
- ✅ All residential_ and permanent_ address fields - CORRECT
- ✅ telephone_no, mobile_no, email_address - CORRECT
- ✅ spouse_surname, spouse_first_name, spouse_middle_name, spouse_name_ext - CORRECT
- ✅ spouse_occupation, spouse_employer, spouse_business_address - CORRECT
- ✅ **spouse_telephone** (not spouse_telephone_no) - FIX NEEDED
- ✅ father_surname, father_first_name, father_middle_name, father_name_ext - CORRECT
- ✅ **mother_surname** (not mother_maiden_name), mother_first_name, mother_middle_name - FIX NEEDED

### Status Fields:
- ✅ status: 'draft' | 'submitted' | 'approved' | 'returned'
- ✅ **remarks** (not return_reason) - for return reason - FIX NEEDED

### PDSEducation Properties:
- ✅ level, school_name - CORRECT
- ✅ **degree_course** (not basic_education_degree) - FIX NEEDED
- ✅ period_from, period_to (both are **numbers**, not strings)
- ✅ **highest_level_earned** (not highest_level or highest_level_units) - FIX NEEDED
- ✅ year_graduated (number), scholarship_honors - CORRECT

### PDSEligibility Properties:
- ✅ career_service, rating - CORRECT
- ✅ date_of_examination, place_of_examination - CORRECT
- ✅ license_number - CORRECT
- ✅ **license_validity** (not date_of_validity or validity_date) - FIX NEEDED

### PDSWorkExperience Properties:
- ✅ date_from, date_to, position_title, department_agency - CORRECT
- ✅ monthly_salary, salary_grade, status_of_appointment - CORRECT
- ✅ **is_government_service** (not government_service) - boolean - FIX NEEDED

###PDS PDSReference Properties:
- ✅ name, address - CORRECT
- ✅ **telephone_number** (not telephone_no or telephone) - FIX NEEDED

### Questionnaire Properties (Major Changes Required):

The HTML uses incorrect field names. Here's the correct mapping:

**Question 34** - Related to appointing authority:
- HTML uses: `q34_related_authority`, `q34_details`
- SHOULD BE: `q34_a_answer`, `q34_a_details`

**Question 35a** - Administrative offense:
- HTML uses: `q35a_admin_offense`, `q35a_details`
- SHOULD BE: `q35_a_answer`, `q35_a_details`

**Question 35b** - Criminal charge:
- HTML uses: `q35b_criminal_charge`, `q35b_details`
- SHOULD BE: `q35_b_answer`, `q35_b_details`

**Question 36** - Convicted:
- HTML uses: `q36_convicted`, `q36_details`
- SHOULD BE: `q36_answer`, `q36_details` (+ q36_date_filed, q36_case_status)

**Question 37** - Separated from service:
- HTML uses: `q37_separated_service`, `q37_details`
- SHOULD BE: `q37_answer`, `q37_details`

**Question 38a** - Candidate:
- HTML uses: `q38a_candidate`, `q38a_details`
- SHOULD BE: `q38_answer`, `q38_details`

**Question 38b** - Resigned before election:
- HTML uses: `q38b_resigned`, `q38b_details`
- SHOULD BE: `q39_answer`, `q39_details`

**Question 39** - Immigrant:
- HTML uses: `q39_immigrant`, `q39_details`
- SHOULD BE: `q40_answer`, `q40_details`

**Question 40a** - Indigenous:
- HTML uses: `q40a_indigenous`, `q40a_details`
- SHOULD BE: `q41_answer`, `q41_country`

**Question 40b** - PWD:
- HTML uses: `q40b_pwd`, `q40b_details`
- SHOULD BE: `q42_answer`, `q42_group` or `q43_answer`, `q43_id_no`

**Question 40c** - Solo parent:
- HTML uses: `q40c_solo_parent`, `q40c_details`
- SHOULD BE: `q44_answer`, `q44_id_no`

## Quick Fix Commands

Use VS Code's Find & Replace (Ctrl+H) in the HTML file:

1. **Status field**: Replace `pds().return_reason` with `pds().remarks`

2. **PAG-IBIG**: Replace `pds().pagibig_id_no` with `pds().pag_ibig_id_no`

3. **Dual citizenship**: Replace `pds().citizenship_country` with `pds().dual_citizenship_country`

4. **Spouse phone**: Replace `pds().spouse_telephone_no` with `pds().spouse_telephone`

5. **Mother surname**: Replace `pds().mother_maiden_name` with `pds().mother_surname`

6. **Education degree**: Replace `edu.basic_education_degree` and `newEducation.basic_education_degree` with `degree_course`

7. **Education highest level**: Replace `newEducation.highest_level_units` with `newEducation.highest_level_earned`

8. **Eligibility validity**: Replace `elig.date_of_validity` and `newEligibility.date_of_validity` with `license_validity`

9. **Work gov service**: Replace `work.government_service` and `newWorkExperience.government_service` with `is_government_service`

10. **Reference phone**: Replace `ref.telephone_no` and `newReference.telephone_no` with `telephone_number`

11. **Questionnaire fields**: This requires manual editing - use the mapping above

## Additional Fixes Needed:

1. In `newEducation.period_from` and `period_to` - these should accept numbers (year format like 2020) not text

2. Add input types for year fields:
   ```html
   <input type="number" [(ngModel)]="newEducation.period_from" placeholder="YYYY" min="1900" max="2100">
   ```

3. The questionnaire section needs complete refactoring to use the correct q34_a_answer format instead of q34_related_authority format

## Testing Checklist:

After fixing property names:
- [ ] Personal Information section fields save correctly
- [ ] Family Background section works
- [ ] Education entries can be added/removed
- [ ] Civil Service Eligibility entries work
- [ ] Work Experience entries work
- [ ] Voluntary Work entries work
- [ ] Training entries work
- [ ] Other Info (Skills/Recognition/Membership) works
- [ ] References work
- [ ] Questionnaire answers are saved
- [ ] Photo upload works
- [ ] Signature upload works
- [ ] Save Draft functionality works
- [ ] Submit for Approval works
- [ ] Form is readonly when status is 'submitted' or 'approved'
