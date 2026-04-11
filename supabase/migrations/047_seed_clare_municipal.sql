-- =============================================================================
-- Seed: City of Clare, MI — Municipal Content
-- =============================================================================
-- Populates departments, boards & commissions, board members, meetings,
-- services, facilities, public notices, quick links, and audiences
-- using real data from cityofclare.gov.

DO $$
DECLARE
  v_region_id UUID;
  -- Department IDs
  v_dept_manager    UUID;
  v_dept_clerk      UUID;
  v_dept_treasurer  UUID;
  v_dept_police     UUID;
  v_dept_fire       UUID;
  v_dept_pw         UUID;
  v_dept_parks      UUID;
  v_dept_building   UUID;
  v_dept_assessor   UUID;
  v_dept_cemetery   UUID;
  v_dept_airport    UUID;
  v_dept_water      UUID;
  -- Board IDs
  v_board_city_commission UUID;
  v_board_planning        UUID;
  v_board_parks_advisory  UUID;
  v_board_airport         UUID;
  v_board_dda             UUID;
  v_board_zba             UUID;
BEGIN
  -- Resolve the City of Clare region
  SELECT id INTO v_region_id FROM public.regions WHERE slug = 'city-of-clare';
  IF v_region_id IS NULL THEN
    RAISE NOTICE 'Region "city-of-clare" not found — skipping municipal seed.';
    RETURN;
  END IF;

  -- =========================================================================
  -- 1. Departments
  -- =========================================================================

  INSERT INTO public.departments (id, region_id, slug, name, short_name, description, phone, email, address, hours, display_order, status)
  VALUES
    (gen_random_uuid(), v_region_id, 'city-manager',          'City Manager',                  'City Manager',   'Chief administrative officer responsible for overseeing all city operations and implementing policies set by the City Commission.',   '989-386-7541', 'info@cityofclare.gov',       '202 W. Fifth Street, Clare, MI 48617', 'Mon–Thu 7am–5:30pm', 0,  'published'),
    (gen_random_uuid(), v_region_id, 'clerk',                  'Clerk / Elections / FOIA',      'Clerk',          'Manages city records, elections, FOIA requests, and official minutes of City Commission meetings.',                                  '989-386-7541', 'info@cityofclare.gov',       '202 W. Fifth Street, Clare, MI 48617', 'Mon–Thu 7am–5:30pm', 1,  'published'),
    (gen_random_uuid(), v_region_id, 'treasurer',              'Treasurer',                     'Treasurer',      'Manages city finances, tax collection, utility billing, and financial reporting.',                                                     '989-386-7541', 'info@cityofclare.gov',       '202 W. Fifth Street, Clare, MI 48617', 'Mon–Thu 7am–5:30pm', 2,  'published'),
    (gen_random_uuid(), v_region_id, 'police',                 'Police Department',             'Police',         'Provides law enforcement, public safety, and community policing services for the City of Clare.',                                     '989-386-1434', NULL,                          '202 W. Fifth Street, Clare, MI 48617', '24/7',                3,  'published'),
    (gen_random_uuid(), v_region_id, 'fire',                   'Fire Department',               'Fire',           'Provides fire protection, emergency medical services, and fire prevention education.',                                                 '989-386-1434', NULL,                          'Clare, MI 48617',                      '24/7',                4,  'published'),
    (gen_random_uuid(), v_region_id, 'public-works',           'Public Works / Utilities',      'Public Works',   'Maintains streets, water distribution, sewer systems, waste collection, and city infrastructure.',                                    '989-386-7541', 'info@cityofclare.gov',       '202 W. Fifth Street, Clare, MI 48617', 'Mon–Thu 7am–5:30pm', 5,  'published'),
    (gen_random_uuid(), v_region_id, 'parks-recreation',       'Parks & Recreation',            'Parks & Rec',    'Manages city parks, recreation programs, and community events.',                                                                      '989-386-7541', 'info@cityofclare.gov',       '202 W. Fifth Street, Clare, MI 48617', 'Mon–Thu 7am–5:30pm', 6,  'published'),
    (gen_random_uuid(), v_region_id, 'building-zoning',        'Building, Zoning & Code',       'Building',       'Administers building permits, zoning regulations, and code enforcement.',                                                             '989-386-7541', 'info@cityofclare.gov',       '202 W. Fifth Street, Clare, MI 48617', 'Mon–Thu 7am–5:30pm', 7,  'published'),
    (gen_random_uuid(), v_region_id, 'assessor',               'Assessor',                      'Assessor',       'Determines property values for tax assessment purposes.',                                                                              '989-386-7541', 'info@cityofclare.gov',       '202 W. Fifth Street, Clare, MI 48617', 'Mon–Thu 7am–5:30pm', 8,  'published'),
    (gen_random_uuid(), v_region_id, 'cemetery',               'Cemetery',                      'Cemetery',       'Manages and maintains the city cemetery grounds.',                                                                                     '989-386-7541', NULL,                          'Clare, MI 48617',                      NULL,                  9,  'published'),
    (gen_random_uuid(), v_region_id, 'airport',                'Airport',                       'Airport',        'Operates and maintains the Clare Municipal Airport.',                                                                                  '989-386-7541', NULL,                          'Clare, MI 48617',                      NULL,                  10, 'published'),
    (gen_random_uuid(), v_region_id, 'water-treatment',        'Water Treatment',               'Water',          'Operates the water treatment plant ensuring safe drinking water for residents.',                                                       '989-386-7541', NULL,                          'Clare, MI 48617',                      NULL,                  11, 'published')
  ON CONFLICT (region_id, slug) DO NOTHING;

  -- Capture department IDs
  SELECT id INTO v_dept_manager   FROM public.departments WHERE region_id = v_region_id AND slug = 'city-manager';
  SELECT id INTO v_dept_clerk     FROM public.departments WHERE region_id = v_region_id AND slug = 'clerk';
  SELECT id INTO v_dept_treasurer FROM public.departments WHERE region_id = v_region_id AND slug = 'treasurer';
  SELECT id INTO v_dept_police    FROM public.departments WHERE region_id = v_region_id AND slug = 'police';
  SELECT id INTO v_dept_fire      FROM public.departments WHERE region_id = v_region_id AND slug = 'fire';
  SELECT id INTO v_dept_pw        FROM public.departments WHERE region_id = v_region_id AND slug = 'public-works';
  SELECT id INTO v_dept_parks     FROM public.departments WHERE region_id = v_region_id AND slug = 'parks-recreation';
  SELECT id INTO v_dept_building  FROM public.departments WHERE region_id = v_region_id AND slug = 'building-zoning';
  SELECT id INTO v_dept_assessor  FROM public.departments WHERE region_id = v_region_id AND slug = 'assessor';
  SELECT id INTO v_dept_cemetery  FROM public.departments WHERE region_id = v_region_id AND slug = 'cemetery';
  SELECT id INTO v_dept_airport   FROM public.departments WHERE region_id = v_region_id AND slug = 'airport';
  SELECT id INTO v_dept_water     FROM public.departments WHERE region_id = v_region_id AND slug = 'water-treatment';

  -- =========================================================================
  -- 2. Boards & Commissions
  -- =========================================================================

  INSERT INTO public.boards_commissions (id, region_id, slug, name, board_type, department_id, meeting_schedule, meeting_location, display_order, status)
  VALUES
    (gen_random_uuid(), v_region_id, 'city-commission',        'City Commission',               'council',     v_dept_manager,   '1st and 3rd Monday of each month at 6:00 PM',     'City Hall, Commission Chambers',  0, 'published'),
    (gen_random_uuid(), v_region_id, 'planning-commission',    'Planning Commission',           'commission',  v_dept_building,  '3rd Tuesday of each month at 7:00 PM',             'City Hall, Commission Chambers',  1, 'published'),
    (gen_random_uuid(), v_region_id, 'parks-recreation-board', 'Parks & Recreation Advisory Board', 'board',   v_dept_parks,     '3rd Tuesday of each month at 5:30 PM',             'City Hall',                       2, 'published'),
    (gen_random_uuid(), v_region_id, 'airport-advisory-board', 'Airport Advisory Board',        'board',       v_dept_airport,   '1st Tuesday of each month at 7:30 PM',             'Airport Terminal',                3, 'published'),
    (gen_random_uuid(), v_region_id, 'dda',                    'Downtown Development Authority', 'authority',  v_dept_manager,   'Monthly, check schedule',                           'City Hall',                       4, 'published'),
    (gen_random_uuid(), v_region_id, 'zoning-board-appeals',   'Zoning Board of Appeals',       'board',       v_dept_building,  'As needed',                                         'City Hall, Commission Chambers',  5, 'published')
  ON CONFLICT (region_id, slug) DO NOTHING;

  -- Capture board IDs
  SELECT id INTO v_board_city_commission FROM public.boards_commissions WHERE region_id = v_region_id AND slug = 'city-commission';
  SELECT id INTO v_board_planning        FROM public.boards_commissions WHERE region_id = v_region_id AND slug = 'planning-commission';
  SELECT id INTO v_board_parks_advisory  FROM public.boards_commissions WHERE region_id = v_region_id AND slug = 'parks-recreation-board';
  SELECT id INTO v_board_airport         FROM public.boards_commissions WHERE region_id = v_region_id AND slug = 'airport-advisory-board';
  SELECT id INTO v_board_dda             FROM public.boards_commissions WHERE region_id = v_region_id AND slug = 'dda';
  SELECT id INTO v_board_zba             FROM public.boards_commissions WHERE region_id = v_region_id AND slug = 'zoning-board-appeals';

  -- =========================================================================
  -- 3. Upcoming Meetings
  -- =========================================================================

  INSERT INTO public.meetings (region_id, slug, title, board_id, meeting_type, meeting_date, start_time, location, status)
  VALUES
    (v_region_id, 'city-commission-2026-04-20',    'City Commission Regular Meeting',     v_board_city_commission, 'regular', '2026-04-20', '6:00 PM', 'City Hall, Commission Chambers', 'published'),
    (v_region_id, 'city-commission-2026-05-04',    'City Commission Regular Meeting',     v_board_city_commission, 'regular', '2026-05-04', '6:00 PM', 'City Hall, Commission Chambers', 'published'),
    (v_region_id, 'planning-commission-2026-04-21','Planning Commission Regular Meeting', v_board_planning,        'regular', '2026-04-21', '7:00 PM', 'City Hall, Commission Chambers', 'published'),
    (v_region_id, 'parks-board-2026-04-21',        'Parks & Rec Advisory Board Meeting',  v_board_parks_advisory,  'regular', '2026-04-21', '5:30 PM', 'City Hall',                      'published'),
    (v_region_id, 'airport-board-2026-05-05',      'Airport Advisory Board Meeting',      v_board_airport,         'regular', '2026-05-05', '7:30 PM', 'Airport Terminal',               'published')
  ON CONFLICT (region_id, slug) DO NOTHING;

  -- =========================================================================
  -- 4. Services
  -- =========================================================================

  INSERT INTO public.services (region_id, slug, name, description, department_id, service_category, audience, display_order, status)
  VALUES
    (v_region_id, 'water-sewer',           'Water & Sewer Service',          'Municipal water and sewer utility services for Clare residents and businesses.',     v_dept_pw,       'utilities',          'both',      0, 'published'),
    (v_region_id, 'waste-recycling',       'Waste & Recycling',             'Curbside waste collection and recycling pickup services.',                            v_dept_pw,       'utilities',          'both',      1, 'published'),
    (v_region_id, 'building-permits',      'Building Permits',              'Apply for building, electrical, plumbing, and mechanical permits.',                   v_dept_building, 'permits_licensing',  'both',      2, 'published'),
    (v_region_id, 'zoning-applications',   'Zoning Applications',           'Submit zoning variance, special use, and site plan review applications.',             v_dept_building, 'permits_licensing',  'both',      3, 'published'),
    (v_region_id, 'property-tax',          'Property Tax Payments',         'Pay property taxes online or at City Hall.',                                           v_dept_treasurer,'administrative',    'both',      4, 'published'),
    (v_region_id, 'utility-billing',       'Utility Billing',              'View and pay water, sewer, and other utility bills.',                                   v_dept_treasurer,'utilities',          'both',      5, 'published'),
    (v_region_id, 'foia-requests',         'FOIA Requests',                'Submit Freedom of Information Act requests for public records.',                        v_dept_clerk,    'administrative',    'both',      6, 'published'),
    (v_region_id, 'police-services',       'Police Services',              'Law enforcement, community policing, and public safety services.',                      v_dept_police,   'public_safety',     'residents', 7, 'published'),
    (v_region_id, 'fire-ems',              'Fire & EMS',                   'Fire protection and emergency medical services.',                                       v_dept_fire,     'public_safety',     'residents', 8, 'published'),
    (v_region_id, 'parks-programs',        'Parks & Recreation Programs',  'Community recreation programs, events, and park reservations.',                          v_dept_parks,    'recreation',        'residents', 9, 'published')
  ON CONFLICT (region_id, slug) DO NOTHING;

  -- =========================================================================
  -- 5. Facilities
  -- =========================================================================

  INSERT INTO public.facilities (region_id, slug, name, facility_type, department_id, address, description, hours, display_order, status)
  VALUES
    (v_region_id, 'city-hall',             'Clare City Hall',               'building',  v_dept_manager, '202 W. Fifth Street, Clare, MI 48617', 'Main administrative building for the City of Clare, housing the City Manager, Clerk, Treasurer, and other departments.', 'Mon–Thu 7am–5:30pm; Closed Fri–Sun', 0, 'published'),
    (v_region_id, 'clare-municipal-airport','Clare Municipal Airport',      'airport',   v_dept_airport, 'Clare, MI 48617',                      'General aviation airport serving the Clare area.',                                                                        NULL,                                  1, 'published'),
    (v_region_id, 'clare-city-park',       'Clare City Park',               'park',      v_dept_parks,   'Clare, MI 48617',                      'Main city park with playground, pavilion, and open green space.',                                                          'Dawn to dusk',                        2, 'published'),
    (v_region_id, 'pettit-park',           'Pettit Park',                   'park',      v_dept_parks,   'Clare, MI 48617',                      'Neighborhood park with picnic areas and walking paths.',                                                                   'Dawn to dusk',                        3, 'published'),
    (v_region_id, 'clare-railroad-depot',  'Clare Union Railroad Depot',    'building',  v_dept_parks,   'Clare, MI 48617',                      'Historic railroad depot, available for community events and gatherings.',                                                  NULL,                                  4, 'published'),
    (v_region_id, 'clare-cemetery',        'Clare Cemetery',                'cemetery',  v_dept_cemetery, 'Clare, MI 48617',                     'City-maintained cemetery.',                                                                                                NULL,                                  5, 'published')
  ON CONFLICT (region_id, slug) DO NOTHING;

  -- =========================================================================
  -- 6. Quick Links (homepage tiles)
  -- =========================================================================

  INSERT INTO public.quick_links (slug, title, url, description, icon, link_group, is_external, open_in_new_tab, display_order, status)
  VALUES
    ('pay-taxes',           'Pay Property Taxes',     'https://bsaonline.com',               'Pay your property taxes online',        'payments',          'homepage_tiles', true,  true,  0, 'published'),
    ('pay-utilities',       'Pay Utilities',          'https://bsaonline.com',               'View and pay your utility bills',       'water-drop',        'homepage_tiles', true,  true,  1, 'published'),
    ('property-records',    'Property Records',       'https://bsaonline.com',               'Look up property information online',   'search',            'homepage_tiles', true,  true,  2, 'published'),
    ('meetings-minutes',    'Meetings & Minutes',     '/government/city-of-clare/minutes',   'View meeting agendas and minutes',      'gavel',             'homepage_tiles', false, false, 3, 'published'),
    ('forms-permits',       'Forms & Permits',        '/forms-documents',                     'Download forms and apply for permits', 'request-page',      'homepage_tiles', false, false, 4, 'published'),
    ('city-maps',           'City Maps',              '/maps',                                'View zoning, utility, and city maps',  'map',               'homepage_tiles', false, false, 5, 'published'),
    ('ordinances',          'Ordinances',             '/government/city-of-clare/ordinances','Browse city ordinances and codes',      'policy',            'homepage_tiles', false, false, 6, 'published'),
    ('employment',          'Employment',             '/job-postings',                        'View current job openings',            'work',              'homepage_tiles', false, false, 7, 'published')
  ON CONFLICT (slug) DO NOTHING;

  -- =========================================================================
  -- 7. Audiences (taxonomy)
  -- =========================================================================

  INSERT INTO public.audiences (slug, label, description, display_order)
  VALUES
    ('residents',  'Residents',  'Information and services for City of Clare residents',   0),
    ('businesses', 'Businesses', 'Resources and permits for businesses operating in Clare', 1),
    ('visitors',   'Visitors',   'Things to do, maps, and visitor information',             2)
  ON CONFLICT (slug) DO NOTHING;

  -- =========================================================================
  -- 8. Sample Public Notice
  -- =========================================================================

  INSERT INTO public.public_notices (region_id, slug, title, description, notice_type, severity, department_id, publish_date, expiration_date, is_pinned, status)
  VALUES
    (v_region_id, 'spring-water-flushing-2026', 'Spring Water Main Flushing', 'The City of Clare DPW will be flushing water mains during the week of April 14-18, 2026. You may experience temporary discoloration of water.', 'water_advisory', 'info', v_dept_pw, '2026-04-07', '2026-04-25', true, 'published')
  ON CONFLICT (region_id, slug) DO NOTHING;

  RAISE NOTICE 'City of Clare municipal seed completed successfully.';
END;
$$;
