-- Add new fields to initiatives table for interest area and company profile
ALTER TABLE initiatives 
ADD COLUMN IF NOT EXISTS interest_area TEXT,
ADD COLUMN IF NOT EXISTS company_profile TEXT;

-- Add comment for documentation
COMMENT ON COLUMN initiatives.interest_area IS 'المجال الذي يهتم به صاحب المبادرة: زيادة صادرات، جلب استثمارات، بيع خدمات';
COMMENT ON COLUMN initiatives.company_profile IS 'اسم ملف بروفايل الشركة التي يمثلها أو يعمل فيها أو يمتلكها المتقدم';
