-- Create initiatives table for SBCB initiative registration portal

CREATE TABLE IF NOT EXISTS public.initiatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_name TEXT NOT NULL,
  applicant_email TEXT NOT NULL,
  applicant_phone TEXT NOT NULL DEFAULT '',
  target_country TEXT NOT NULL,
  proposed_sectors TEXT[] NOT NULL DEFAULT '{}',
  founding_members TEXT NOT NULL DEFAULT '',
  business_plan_summary TEXT NOT NULL DEFAULT '',
  attachments TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'مقدّم' CHECK (status IN ('مقدّم', 'قيد المراجعة', 'مقبول', 'مرفوض')),
  submitted_by TEXT NOT NULL DEFAULT '',
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewer_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.initiatives ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read initiatives (the app handles permission checks in code)
CREATE POLICY "Allow public read" ON public.initiatives
  FOR SELECT USING (true);

-- Allow anyone to insert (submissions come through the server API route with service_role)
CREATE POLICY "Allow public insert" ON public.initiatives
  FOR INSERT WITH CHECK (true);

-- Allow anyone to update (reviews come through the server API route with service_role)
CREATE POLICY "Allow public update" ON public.initiatives
  FOR UPDATE USING (true);

-- Seed data
INSERT INTO public.initiatives (applicant_name, applicant_email, applicant_phone, target_country, proposed_sectors, founding_members, business_plan_summary, attachments, status, submitted_by, submitted_at)
VALUES
  ('عمر الشامي', 'omar@example.com', '+90 532 987 6543', 'هولندا',
   ARRAY['التقنية', 'الزراعة'],
   '5 رجال أعمال سوريين مقيمين في هولندا، 3 شركاء هولنديين',
   'إنشاء مجلس أعمال سوري-هولندي يركز على تبادل الخبرات الزراعية والتقنية',
   ARRAY['business-plan.pdf', 'founders-cv.pdf'],
   'قيد المراجعة', 'u-004', '2026-02-10T10:00:00Z'),
  ('ليلى حداد', 'layla@example.com', '+39 06 123 4567', 'إيطاليا',
   ARRAY['الصناعات الغذائية', 'السياحة'],
   '7 أعضاء مؤسسين بين سوريا وإيطاليا',
   'تأسيس مجلس أعمال سوري-إيطالي متخصص في الصناعات الغذائية والسياحة',
   ARRAY['proposal.pdf'],
   'مقدّم', 'u-004', '2026-02-18T10:00:00Z');
