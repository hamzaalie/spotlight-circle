# 📊 CSV Import Feature - Professional Bulk Import

Complete guide for the CSV import feature that allows administrators to bulk import professionals into Spotlight Circles.

---

## 📋 Overview

The CSV import feature enables administrators to:
- Import multiple professionals at once from a CSV file
- Preview data before importing
- See real-time import progress
- View detailed success/failure results
- Download a template CSV file

---

## 🎯 Features

### ✅ Data Validation
- Email format validation
- Required field checking
- Duplicate email detection
- URL format validation
- Automatic data cleaning (trimming whitespace)

### ✅ Smart Processing
- Automatic referral slug generation (unique)
- Category matching by name
- Default password assignment
- User analytics initialization
- Transaction-based imports (all-or-nothing per user)

### ✅ Error Handling
- Individual record error reporting
- Continue processing on single failures
- Detailed error messages
- Import summary statistics

### ✅ User Experience
- CSV preview (first 5 rows)
- Real-time progress indicator
- Success/failure breakdown
- Downloadable template file
- Clear instructions

---

## 📄 CSV Format

### Required Columns

| Column Name | Description | Example |
|------------|-------------|---------|
| **Email** | Professional's email (must be unique) | john.doe@example.com |
| **First Name** | First name | John |
| **Last Name** | Last name | Doe |
| **City** | City location | New York |
| **Zip Code** | Postal code (5+ digits) | 10001 |
| **Title** | Job title/profession | Real Estate Agent |

### Optional Columns

| Column Name | Description | Example |
|------------|-------------|---------|
| Company | Company name | Acme Corp |
| Phone | Phone number | (555) 123-4567 |
| Website | Website URL | https://example.com |
| Street | Street address | 123 Main St |
| State | State (2-letter code) | NY |
| Country | Country code | US |
| Sub Category | Professional category | Real Estate |

### CSV Example

```csv
Company,Email,Street,City,State,Zip Code,Country,Phone,Website,Sub Category,First Name,Last Name,Title
Acme Corp,john.doe@example.com,123 Main St,New York,NY,10001,US,(555) 123-4567,https://example.com,Real Estate,John,Doe,Real Estate Agent
Smith Legal,jane.smith@example.com,456 Oak Ave,Los Angeles,CA,90001,US,(555) 987-6543,https://smith-legal.com,Legal,Jane,Smith,Attorney
```

---

## 🔧 Technical Implementation

### File Structure

```
src/
├── app/
│   ├── admin/
│   │   └── import/
│   │       └── page.tsx                 # Import page
│   └── api/
│       └── admin/
│           └── import/
│               └── professionals/
│                   └── route.ts         # API endpoint
└── components/
    └── admin/
        └── CSVImportClient.tsx          # Client component
```

### API Endpoint

**POST** `/api/admin/import/professionals`

**Request Body:**
```json
{
  "professionals": [
    {
      "Email": "john.doe@example.com",
      "First Name": "John",
      "Last Name": "Doe",
      "Company": "Acme Corp",
      "Title": "Real Estate Agent",
      "Phone": "(555) 123-4567",
      "Website": "https://example.com",
      "Street": "123 Main St",
      "City": "New York",
      "State": "NY",
      "Zip Code": "10001",
      "Country": "US",
      "Sub Category": "Real Estate"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "summary": {
    "total": 50,
    "successful": 48,
    "failed": 2
  },
  "results": [
    {
      "success": true,
      "email": "john.doe@example.com",
      "name": "John Doe"
    },
    {
      "success": false,
      "email": "duplicate@example.com",
      "name": "Jane Smith",
      "error": "Email already exists"
    }
  ]
}
```

---

## 🔄 Import Process Flow

```
1. Admin uploads CSV file
   ↓
2. Client-side preview (first 5 rows)
   ↓
3. Admin clicks "Import Professionals"
   ↓
4. Parse entire CSV file
   ↓
5. Send to API endpoint
   ↓
6. For each professional:
   a. Validate data
   b. Check for duplicate email
   c. Generate unique referral slug
   d. Find matching category
   e. Hash default password
   f. Create user + profile + analytics
   ↓
7. Return results summary
   ↓
8. Display success/failure breakdown
```

---

## 🛡️ Security & Validation

### Email Validation
- Must be valid email format
- Must be unique (not already in system)
- Case-insensitive checking

### Required Fields
- Email, First Name, Last Name, City, Zip Code, Title

### Data Sanitization
- All input trimmed of whitespace
- Empty strings converted to null
- URLs validated if provided

### Default Password
- All imported users get: `Welcome2024!`
- Must be changed on first login
- Password is hashed using bcrypt

### Transaction Safety
- Each user creation wrapped in transaction
- Rollback on failure
- Continue with next user on error

---

## 📊 Database Operations

### User Creation
```typescript
await prisma.$transaction(async (tx) => {
  // Create user with profile
  const user = await tx.user.create({
    data: {
      email: validated.email,
      password: hashedPassword,
      role: 'PROFESSIONAL',
      profile: {
        create: {
          firstName: validated.firstName,
          lastName: validated.lastName,
          companyName: validated.company,
          profession: validated.profession,
          categoryId: matchedCategoryId,
          phone: validated.phone,
          website: validated.website,
          city: validated.city,
          state: validated.state,
          zipCode: validated.zipCode,
          referralSlug: uniqueSlug,
          services: [],
        },
      },
    },
  });

  // Create analytics record
  await tx.userAnalytics.create({
    data: { userId: user.id },
  });
});
```

### Slug Generation
```typescript
// Convert name to slug format
const baseSlug = `${firstName}-${lastName}`
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

// Ensure uniqueness
let referralSlug = baseSlug;
let counter = 1;
while (await prisma.profile.findUnique({ where: { referralSlug } })) {
  referralSlug = `${baseSlug}-${counter}`;
  counter++;
}
```

---

## 🎨 User Interface

### Import Page Features

1. **Instructions Card**
   - Required vs optional fields
   - CSV format guide
   - Default password notice
   - Download template button

2. **File Upload Area**
   - Drag & drop support
   - Click to browse
   - File name display
   - CSV-only acceptance

3. **Data Preview Table**
   - First 5 rows shown
   - Name, Email, Company, Title, Location
   - Helps verify correct format

4. **Progress Indicator**
   - Animated spinner during import
   - "Importing professionals..." message

5. **Results Summary**
   - Total records count
   - Successful imports (green)
   - Failed imports (red)

6. **Detailed Results**
   - Scrollable list
   - Success/failure icons
   - Error messages for failures
   - Email and name for each record

---

## 🚨 Error Messages

### Common Errors

**"Email already exists"**
- User with that email already registered
- Action: Skip or update existing user manually

**"Invalid email format"**
- Email address malformed
- Action: Fix email in CSV

**"Required field missing"**
- Missing First Name, Last Name, City, Zip Code, or Title
- Action: Add missing data

**"Invalid website URL"**
- Website URL malformed
- Action: Correct URL format or leave blank

**"Import failed"**
- General error during processing
- Action: Check server logs

---

## 📝 Usage Instructions

### For Administrators

1. **Prepare CSV File**
   - Use provided template or match column names
   - Ensure all required fields are filled
   - Validate email addresses are unique

2. **Access Import Page**
   - Navigate to Admin Panel
   - Click "Import Professionals" in sidebar

3. **Upload CSV**
   - Click upload area or drag file
   - Review preview of first 5 rows
   - Verify data looks correct

4. **Import**
   - Click "Import Professionals" button
   - Wait for processing to complete
   - Review results summary

5. **Check Results**
   - Note successful imports count
   - Review any failures
   - Fix issues and re-import failed records

6. **Notify Users**
   - Email imported professionals
   - Provide login instructions
   - Share default password: `Welcome2024!`
   - Instruct to change password immediately

---

## 🔐 Post-Import Actions

### What Happens After Import

Each imported professional:
- ✅ Has an account created
- ✅ Can log in with default password
- ✅ Has a profile page at `/p/[slug]`
- ✅ Has a unique QR code (generated on first access)
- ✅ Can access the dashboard
- ✅ Can onboard and complete profile
- ✅ Can connect with partners
- ✅ Can create referrals

### Recommended Admin Follow-up

1. **Send Welcome Emails**
   - Include login URL
   - Provide default password
   - Link to getting started guide

2. **Monitor First Logins**
   - Track which users have logged in
   - Send reminders to inactive users

3. **Verify Data Quality**
   - Check profiles for completeness
   - Follow up on missing information

---

## 🧪 Testing

### Test CSV Data

```csv
Company,Email,Street,City,State,Zip Code,Country,Phone,Website,Sub Category,First Name,Last Name,Title
Test Corp 1,test1@example.com,100 Test St,Austin,TX,78701,US,(512) 555-0001,https://test1.com,Real Estate,Alice,Anderson,Agent
Test Corp 2,test2@example.com,200 Test Ave,Boston,MA,02101,US,(617) 555-0002,https://test2.com,Legal,Bob,Brown,Attorney
Test Corp 3,test3@example.com,300 Test Blvd,Chicago,IL,60601,US,(312) 555-0003,https://test3.com,Healthcare,Carol,Clark,Therapist
```

### Test Scenarios

1. **Valid Import**
   - All required fields present
   - All emails unique
   - Should succeed

2. **Duplicate Email**
   - Email already in database
   - Should fail with error message

3. **Missing Required Field**
   - Missing First Name or other required field
   - Should fail with validation error

4. **Invalid Email**
   - Malformed email address
   - Should fail with validation error

5. **Invalid Website URL**
   - Non-URL in website field
   - Should fail with validation error

6. **Mixed Results**
   - Some valid, some invalid records
   - Should process valid ones, report failures

---

## 📊 Admin Dashboard Access

**URL:** `/admin/import`

**Access Requirements:**
- Must be logged in
- Must have ADMIN role
- Redirects to `/dashboard` if not admin

**Navigation:**
- Accessible from admin sidebar
- Icon: Upload (↑)
- Label: "Import Professionals"

---

## 🔄 Alternative Column Names

The system accepts flexible column naming:

| Standard Name | Also Accepts |
|---------------|--------------|
| First Name | FirstName |
| Last Name | LastName |
| Zip Code | ZipCode |
| Sub Category | SubCategory |

This allows compatibility with various CSV export formats.

---

## 💡 Best Practices

### For CSV Preparation

1. **Clean Your Data**
   - Remove duplicate emails
   - Trim whitespace
   - Validate phone numbers
   - Check URL formats

2. **Use Template**
   - Download template from import page
   - Match column names exactly
   - Include all required fields

3. **Test Small Batches**
   - Import 5-10 records first
   - Verify results
   - Then import full dataset

4. **Keep Backup**
   - Save original CSV file
   - Note import date/time
   - Track who performed import

### For Large Imports

- Process in batches of 100-200
- Monitor server resources
- Allow adequate time between batches
- Verify each batch before continuing

---

## 🚀 Future Enhancements

Potential improvements:

- [ ] Email notification to imported professionals
- [ ] Custom password setting per user
- [ ] Photo upload via CSV (URLs)
- [ ] Excel file support (.xlsx)
- [ ] Batch update existing users
- [ ] Import scheduling
- [ ] Import history log
- [ ] Rollback failed imports
- [ ] Category auto-creation
- [ ] Geocoding addresses
- [ ] Import templates library

---

## 📞 Support

### Common Issues

**Q: Import is taking too long**
A: Large files (>500 records) may take several minutes. Please wait.

**Q: Some records failed**
A: Check the detailed results for error messages. Fix issues in CSV and re-import.

**Q: Can I update existing users?**
A: Not yet. Currently only creates new users. Manual updates required.

**Q: What if emails are duplicated within the CSV?**
A: First occurrence will succeed, subsequent will fail with "Email already exists"

---

**CSV Import Feature Complete! Administrators can now bulk import professionals efficiently. 📊**
