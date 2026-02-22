-- ============================================
-- FAMILIE-APP – Supabase skjema
-- Lim inn dette i Supabase > SQL Editor > New query
-- ============================================

-- Brukerroller
CREATE TYPE user_role AS ENUM ('grandma', 'family', 'core');

-- Brukerprofiler (kobles til Supabase Auth)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'family',
  avatar_emoji TEXT DEFAULT '👤',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Innlegg på familieveggen
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID REFERENCES profiles(id) NOT NULL,
  caption TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reaksjoner på innlegg (hjerte)
CREATE TABLE reactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  emoji TEXT DEFAULT '❤️',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Minnespørsmål
CREATE TABLE memory_prompts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  active_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Farmors svar på minnespørsmål
CREATE TABLE memory_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt_id UUID REFERENCES memory_prompts(id),
  answer_text TEXT,
  audio_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daglig innsjekk (kun core)
CREATE TABLE health_checkins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  registered_by UUID REFERENCES profiles(id),
  mood TEXT NOT NULL, -- 'bra', 'ok', 'sliten', 'syk'
  note TEXT,
  checkin_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Avtaler (kun core)
CREATE TABLE appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  appointment_date TIMESTAMPTZ NOT NULL,
  driver TEXT,
  note TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Medisiner (kun core)
CREATE TABLE medications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  time_of_day TEXT NOT NULL, -- 'morgen', 'kveld', 'begge'
  taken_morning BOOLEAN DEFAULT FALSE,
  taken_evening BOOLEAN DEFAULT FALSE,
  med_date DATE DEFAULT CURRENT_DATE,
  updated_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;

-- Hjelpefunksjon: hent innlogget brukers rolle
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Profiler: alle innloggede kan se, kun egne kan redigere
CREATE POLICY "Alle ser profiler" ON profiles
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Egne profiler" ON profiles
  FOR UPDATE USING (id = auth.uid());

-- Innlegg: alle innloggede kan se, family/core kan poste
CREATE POLICY "Alle ser innlegg" ON posts
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "family og core kan poste" ON posts
  FOR INSERT WITH CHECK (get_my_role() IN ('family', 'core'));

-- Reaksjoner: alle innloggede
CREATE POLICY "Alle ser reaksjoner" ON reactions
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Alle kan reagere" ON reactions
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Slett egne reaksjoner" ON reactions
  FOR DELETE USING (user_id = auth.uid());

-- Minnespørsmål: alle innloggede kan se
CREATE POLICY "Alle ser spørsmål" ON memory_prompts
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Svar: alle kan se, grandma kan svare
CREATE POLICY "Alle ser svar" ON memory_answers
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "grandma kan svare" ON memory_answers
  FOR INSERT WITH CHECK (get_my_role() = 'grandma');

-- Helse: KUN core
CREATE POLICY "Kun core ser innsjekk" ON health_checkins
  FOR ALL USING (get_my_role() = 'core');
CREATE POLICY "Kun core ser avtaler" ON appointments
  FOR ALL USING (get_my_role() = 'core');
CREATE POLICY "Kun core ser medisiner" ON medications
  FOR ALL USING (get_my_role() = 'core');

-- ============================================
-- STORAGE BUCKET FOR BILDER
-- ============================================

-- Kjør dette i Supabase > Storage > New bucket
-- Navn: family-photos
-- Public: NEI (private bucket)

-- Policy for opplasting (family og core)
-- Supabase håndterer dette i Storage-panelet

-- ============================================
-- EKSEMPELDATA – noen minnespørsmål
-- ============================================

INSERT INTO memory_prompts (question, active_date) VALUES
  ('Hva er det beste minnet du har fra barndommen din?', CURRENT_DATE),
  ('Hva var favorittmaten din som barn?', CURRENT_DATE + 1),
  ('Husker du første dagen på skolen?', CURRENT_DATE + 2),
  ('Hvordan møtte du pappa?', CURRENT_DATE + 3),
  ('Hva drømte du om å bli da du var liten?', CURRENT_DATE + 4),
  ('Hva er du mest stolt av i livet ditt?', CURRENT_DATE + 5),
  ('Hva pleide dere å gjøre på søndager da du var liten?', CURRENT_DATE + 6),
  ('Husker du noe morsomt fra ungdomstiden din?', CURRENT_DATE + 7),
  ('Hva var det første du kjøpte med egne penger?', CURRENT_DATE + 8),
  ('Hva savner du mest fra «gamle dager»?', CURRENT_DATE + 9);
