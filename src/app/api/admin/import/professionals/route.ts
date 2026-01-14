import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { z } from 'zod';

// Validation schema for CSV row
const professionalSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  company: z.string().optional(),
  profession: z.string().min(1),
  title: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  street: z.string().optional(),
  city: z.string().min(1),
  state: z.string().optional(),
  zipCode: z.string().min(5),
  country: z.string().default('US'),
  subCategory: z.string().optional(),
});

interface ImportResult {
  success: boolean;
  email: string;
  name: string;
  error?: string;
}

/**
 * POST /api/admin/import/professionals
 * Import professionals from CSV file
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    // Check admin access
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Parse CSV data from request
    const { professionals } = await req.json();

    if (!Array.isArray(professionals) || professionals.length === 0) {
      return NextResponse.json(
        { error: 'No professionals data provided' },
        { status: 400 }
      );
    }

    const results: ImportResult[] = [];
    let successCount = 0;
    let failureCount = 0;

    // Process each professional
    for (const prof of professionals) {
      try {
        // Validate data
        const validated = professionalSchema.parse({
          email: prof.email?.trim(),
          firstName: prof.firstName?.trim(),
          lastName: prof.lastName?.trim(),
          company: prof.company?.trim() || '',
          profession: prof.profession?.trim() || 'Professional',
          title: prof.title?.trim() || '',
          phone: prof.phone?.trim() || '',
          website: prof.website?.trim() || '',
          street: prof.street?.trim() || '',
          city: prof.city?.trim(),
          state: prof.state?.trim() || '',
          zipCode: prof.zipCode?.trim(),
          country: prof.country?.trim() || 'US',
          subCategory: prof.subCategory?.trim() || '',
        });

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
          where: { email: validated.email },
        });

        if (existingUser) {
          results.push({
            success: false,
            email: validated.email,
            name: `${validated.firstName} ${validated.lastName}`,
            error: 'Email already exists',
          });
          failureCount++;
          continue;
        }

        // Generate default password (user will need to reset)
        const defaultPassword = await hashPassword('Welcome2024!');

        // Generate unique referral slug
        const baseSlug = `${validated.firstName}-${validated.lastName}`
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        
        let referralSlug = baseSlug;
        let slugExists = await prisma.profile.findUnique({
          where: { referralSlug },
        });
        
        let counter = 1;
        while (slugExists) {
          referralSlug = `${baseSlug}-${counter}`;
          slugExists = await prisma.profile.findUnique({
            where: { referralSlug },
          });
          counter++;
        }

        // Find matching category
        let categoryId = null;
        if (validated.subCategory) {
          const category = await prisma.category.findFirst({
            where: {
              name: {
                contains: validated.subCategory,
                mode: 'insensitive',
              },
              isActive: true,
            },
          });
          categoryId = category?.id || null;
        }

        // Create user and profile in a transaction
        await prisma.$transaction(async (tx) => {
          const user = await tx.user.create({
            data: {
              email: validated.email,
              password: defaultPassword,
              role: 'PROFESSIONAL',
              profile: {
                create: {
                  firstName: validated.firstName,
                  lastName: validated.lastName,
                  companyName: validated.company || null,
                  profession: validated.profession,
                  categoryId,
                  phone: validated.phone || null,
                  website: validated.website || null,
                  city: validated.city,
                  state: validated.state || null,
                  zipCode: validated.zipCode,
                  referralSlug,
                  services: [],
                },
              },
            },
          });

          // Create analytics record
          await tx.userAnalytics.create({
            data: {
              userId: user.id,
            },
          });
        });

        results.push({
          success: true,
          email: validated.email,
          name: `${validated.firstName} ${validated.lastName}`,
        });
        successCount++;

      } catch (error) {
        console.error('Error importing professional:', error);
        
        const email = prof.email?.trim() || 'unknown';
        const name = `${prof.firstName || ''} ${prof.lastName || ''}`.trim() || 'Unknown';
        
        // Provide user-friendly error messages
        let errorMessage = 'Import failed';
        if (error instanceof z.ZodError) {
          const issues = error.issues.map(issue => {
            if (issue.path.includes('email')) return 'Invalid email address';
            if (issue.path.includes('firstName')) return 'First name is required';
            if (issue.path.includes('lastName')) return 'Last name is required';
            if (issue.path.includes('profession')) return 'Profession is required';
            if (issue.path.includes('city')) return 'City is required';
            if (issue.path.includes('zipCode')) return 'Valid zip code is required';
            return issue.message;
          });
          errorMessage = issues[0] || 'Invalid data format';
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
        
        results.push({
          success: false,
          email,
          name,
          error: errorMessage,
        });
        failureCount++;
      }
    }

    return NextResponse.json({
      success: true,
      summary: {
        total: professionals.length,
        successful: successCount,
        failed: failureCount,
      },
      results,
    });

  } catch (error) {
    console.error('Error in CSV import:', error);
    return NextResponse.json(
      { error: 'Failed to import professionals' },
      { status: 500 }
    );
  }
}
