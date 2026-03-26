-- =============================================================================
-- Unicorn.Gives Content Seed Migration (auto-generated)
-- Generated: 2026-03-26T05:31:04.117Z
-- =============================================================================

DO $$
DECLARE
  lincoln_id UUID;
  clare_county_id UUID;
  horn_id UUID;
  mane_id UUID;
BEGIN
  SELECT id INTO lincoln_id FROM public.regions WHERE slug = 'lincoln-township';
  SELECT id INTO clare_county_id FROM public.regions WHERE slug = 'clare-county';
  SELECT id INTO horn_id FROM public.partners WHERE slug = 'the-horn';
  SELECT id INTO mane_id FROM public.partners WHERE slug = 'the-mane';

  IF lincoln_id IS NULL THEN
    RAISE EXCEPTION 'Lincoln Township region not found!';
  END IF;
  IF clare_county_id IS NULL THEN
    RAISE EXCEPTION 'Clare County region not found!';
  END IF;

-- =============================================================================
-- Contacts (51)
-- =============================================================================

INSERT INTO public.contacts (region_id, slug, name, role, department, phone, phone_ext, email, address, hours, website, display_order, status, created_at, updated_at)
VALUES
(clare_county_id, 'allisha-gary', 'Allisha Gary', 'Veterans Service Officer', 'Clare County Veterans Services', '(989) 539-3273', NULL, NULL, '225 W Main St Harrison MI 48625', 'Mon-Fri 8am-4:30pm', NULL, 36, 'published', now(), now()),
(clare_county_id, 'andrew-santini', 'Andrew Santini', 'Prosecuting Attorney', 'Clare County Prosecutor', '(989) 539-9831', NULL, NULL, NULL, 'Mon-Fri 8am-4:30pm (closed noon-1pm)', NULL, 23, 'published', now(), now()),
(clare_county_id, 'bob-dodson', 'Bob Dodson', 'Director', 'Clare County Animal Shelter', '(989) 539-3221', NULL, NULL, NULL, 'Mon-Fri 10am-4pm', NULL, 28, 'published', now(), now()),
(lincoln_id, 'carol-majewski', 'Carol Majewski', 'Clerk', 'Lincoln Township Board', '(989) 588-9841', '2', NULL, NULL, NULL, NULL, 2, 'published', now(), now()),
(lincoln_id, 'casey-guthrie', 'Casey Guthrie', 'Assessor', 'Lincoln Township Assessment', '(231) 350-9123', NULL, NULL, NULL, NULL, NULL, 13, 'published', now(), now()),
(clare_county_id, 'christiane-rathke', 'Christiane Rathke', 'District Administrator & Soil Erosion Agent', 'Clare Conservation District', '(989) 539-6401', NULL, NULL, NULL, NULL, 'https://clarecd.org', 30, 'published', now(), now()),
(clare_county_id, 'colleen-ritchie', 'Colleen Ritchie', 'Deputy Drain Commissioner', 'Clare County Drain Commission', '(989) 539-7320', NULL, NULL, '225 W Main St Harrison MI 48625', NULL, NULL, 28, 'published', now(), now()),
(clare_county_id, 'dale-majewski-commissioner', 'Dale Majewski', 'Commissioner District 2', 'Clare County Board of Commissioners', '(989) 429-8887', NULL, 'majewskid@clareco.net', NULL, NULL, NULL, 41, 'published', now(), now()),
(lincoln_id, 'dale-majewski-fire', 'Dale Majewski', 'Fire Chief', 'Lincoln Township Fire Department', '(989) 429-8887', NULL, NULL, NULL, NULL, NULL, 12, 'published', now(), now()),
(clare_county_id, 'david-hoefling', 'David Hoefling', 'Commissioner District 5', 'Clare County Board of Commissioners', '(989) 424-1997', NULL, 'hoeflingd@clareco.net', NULL, NULL, NULL, 44, 'published', now(), now()),
(lincoln_id, 'dick-hassberger', 'Dick Hassberger', 'Zoning Administrator', 'Lincoln Township Zoning', '(989) 588-9841', '5', NULL, NULL, NULL, NULL, 10, 'published', now(), now()),
(clare_county_id, 'emerson-corder', 'Emerson Corder', 'Airport Manager', 'Clare County Airport', '(989) 329-3981', NULL, NULL, NULL, NULL, NULL, 30, 'published', now(), now()),
(clare_county_id, 'gabe-ambrozaitis', 'Gabe Ambrozaitis', 'Commissioner District 7', 'Clare County Board of Commissioners', '(989) 329-0865', NULL, 'ambrozaitisg@clareco.net', NULL, NULL, NULL, 46, 'published', now(), now()),
(clare_county_id, 'george-gilmore', 'George Gilmore', 'Commissioner District 8', 'Clare County Board of Commissioners', '(989) 329-5776', NULL, 'gilmoreg@clareco.net', NULL, NULL, NULL, 47, 'published', now(), now()),
(clare_county_id, 'jack-kleinhardt', 'Jack Kleinhardt', 'Commissioner District 6', 'Clare County Board of Commissioners', '(989) 339-7257', NULL, 'jackkleinhardt@gmail.com', NULL, NULL, NULL, 45, 'published', now(), now()),
(clare_county_id, 'jacob-gross', 'Jacob Gross', 'Commissioner District 3', 'Clare County Board of Commissioners', '(989) 506-2163', NULL, 'grossj@clareco.net', NULL, NULL, NULL, 42, 'published', now(), now()),
(clare_county_id, 'jason-pernick', 'Jason Pernick', 'Assistant Prosecuting Attorney', 'Clare County Prosecutor', '(989) 539-9831', NULL, NULL, NULL, 'Mon-Fri 8am-4:30pm (closed noon-1pm)', NULL, 24, 'published', now(), now()),
(lincoln_id, 'jeff-simons', 'Jeff Simons', 'Trustee', 'Lincoln Township Board', '(989) 433-6069', NULL, NULL, NULL, NULL, NULL, 4, 'published', now(), now()),
(clare_county_id, 'jeffery-haskell', 'Jeffery Haskell', 'Commissioner District 4', 'Clare County Board of Commissioners', '(989) 429-1201', NULL, 'haskellj@clareco.net', NULL, NULL, NULL, 43, 'published', now(), now()),
(clare_county_id, 'jenny-beemer-fritzinger', 'Jenny Beemer-Fritzinger', 'County Treasurer', 'Clare County Treasury', '(989) 539-7801', NULL, NULL, NULL, NULL, NULL, 22, 'published', now(), now()),
(clare_county_id, 'jerry-becker', 'Jerry Becker', 'Emergency Management Director', 'Clare County Emergency Services', '(989) 539-6161', NULL, NULL, NULL, NULL, NULL, 26, 'published', now(), now()),
(clare_county_id, 'jody-pieprzyk', 'Jody Pieprzyk', 'Human Resources Director', 'Clare County Administration', '(989) 539-2510', NULL, NULL, '225 W Main St Harrison MI 48625', 'Mon-Fri 8am-4:30pm', NULL, 21, 'published', now(), now()),
(clare_county_id, 'joe-nash', 'Joe Nash', 'District Forester', 'Clare Conservation District', '(989) 539-6401', NULL, NULL, NULL, NULL, 'https://clarecd.org', 33, 'published', now(), now()),
(clare_county_id, 'john-wilson', 'John Wilson', 'Sheriff', 'Clare County Sheriff', '(989) 539-7166', NULL, NULL, '255 W Main St, Harrison, MI 48625', NULL, NULL, 24, 'published', now(), now()),
(clare_county_id, 'josh-chapman', 'Josh Chapman', 'IT Director', 'Clare County Information Technology', '(989) 539-6402', '5032', NULL, '225 W Main St Harrison MI 48625', NULL, NULL, 32, 'published', now(), now()),
(clare_county_id, 'joshua-farrell', 'Joshua Farrell', 'Judge', '80th District Court', '(989) 539-7173', NULL, NULL, '225 W Main St, Harrison, MI 48625', NULL, NULL, 50, 'published', now(), now()),
(clare_county_id, 'joy-bringold', 'Joy Bringold', 'Finance Director', 'Clare County Administration', '(989) 539-2510', NULL, NULL, '225 W Main St Harrison MI 48625', 'Mon-Fri 8am-4:30pm', NULL, 22, 'published', now(), now()),
(clare_county_id, 'karl-hauser', 'Karl Hauser', 'Director', 'Clare County Veterans Services', '(989) 539-3273', NULL, NULL, NULL, NULL, NULL, 29, 'published', now(), now()),
(clare_county_id, 'karyn-tomczyk', 'Karyn Tomczyk', 'Assistant Prosecuting Attorney', 'Clare County Prosecutor', '(989) 539-9831', NULL, NULL, NULL, 'Mon-Fri 8am-4:30pm (closed noon-1pm)', NULL, 24, 'published', now(), now()),
(lincoln_id, 'ken-logan', 'Ken Logan', 'Ordinance Enforcement Officer', 'Lincoln Township Zoning', '(989) 588-9841', '8', NULL, NULL, NULL, NULL, 11, 'published', now(), now()),
(clare_county_id, 'kim-keeley', 'Kim Keeley', 'Victim/Witness Advocate', 'Clare County Prosecutor', '(989) 539-9831', NULL, NULL, NULL, 'Mon-Fri 8am-4:30pm (closed noon-1pm)', NULL, 24, 'published', now(), now()),
(clare_county_id, 'lori-mott', 'Lori Mott', 'Clerk & Register of Deeds', 'Clare County Clerk', '(989) 539-7131', NULL, NULL, NULL, NULL, 'https://clareclerkrod.com', 21, 'published', now(), now()),
(clare_county_id, 'lori-phelps', 'Lori Phelps', 'County Administrator', 'Clare County Administration', '(989) 539-2510', NULL, NULL, '225 W Main St, Harrison, MI 48625', 'Mon-Fri 8am-4:30pm', NULL, 20, 'published', now(), now()),
(lincoln_id, 'maggie-carey', 'Maggie Carey', 'Treasurer', 'Lincoln Township Board', '(989) 588-9841', '3', NULL, NULL, NULL, NULL, 3, 'published', now(), now()),
(clare_county_id, 'marcy-klaus', 'Marcy Klaus', 'Judge', 'Probate/Family Court', '(989) 539-7109', NULL, NULL, NULL, NULL, NULL, 52, 'published', now(), now()),
(clare_county_id, 'marlana-terrian', 'Marlana Terrian', 'Central Dispatch Director', 'Clare County Central Dispatch 911', '(989) 539-7166', '4226', NULL, '225 W Main St Harrison MI 48625', NULL, NULL, 31, 'published', now(), now()),
(clare_county_id, 'marlene-housler', 'Marlene Housler', 'Commissioner District 1', 'Clare County Board of Commissioners', '(989) 802-3978', NULL, 'houslerm@clareco.net', NULL, NULL, NULL, 40, 'published', now(), now()),
(clare_county_id, 'michelle-ambrozaitis', 'Hon. Michelle J. Ambrozaitis', 'Circuit Court Judge', 'Clare County 55th Circuit Court', '(989) 539-7131', NULL, NULL, '225 W Main St Harrison MI 48625', NULL, NULL, 52, 'published', now(), now()),
(clare_county_id, 'mike-dittenber', 'Mike Dittenber', 'District Forester', 'Clare Conservation District', '(989) 539-6401', NULL, NULL, NULL, NULL, NULL, 31, 'published', now(), now()),
(lincoln_id, 'mike-tobin', 'Mike Tobin', 'Trustee', 'Lincoln Township Board', '(989) 588-9841', '6', NULL, NULL, NULL, NULL, 5, 'published', now(), now()),
(clare_county_id, 'pete-preston', 'Pete Preston', 'Director', 'Clare County Equalization', '(989) 539-7894', NULL, NULL, NULL, NULL, NULL, 27, 'published', now(), now()),
(clare_county_id, 'rickie-fancon', 'Rickie Fancon', 'Commissioner District 9', 'Clare County Board of Commissioners', '(989) 240-0142', NULL, 'rickieglenn2014@gmail.com', NULL, NULL, NULL, 48, 'published', now(), now()),
(clare_county_id, 'sara-schneider', 'Sara Schneider', 'Equalization Clerk', 'Clare County Equalization', '(989) 539-7894', NULL, NULL, '225 W Main St Harrison MI 48625', 'Mon-Fri 8am-4:30pm', NULL, 29, 'published', now(), now()),
(clare_county_id, 'scott-moore', 'Scott Moore', 'Friend of the Court Director', 'Clare County Friend of the Court', '(989) 539-0800', NULL, NULL, '225 W Main St Harrison MI 48625', 'Mon-Fri 8am-4:30pm', NULL, 53, 'published', now(), now()),
(clare_county_id, 'stacy-pechacek', 'Stacy Pechacek', 'Chief Deputy Clerk', 'Clare County Clerk & Register of Deeds', '(989) 539-7131', NULL, NULL, NULL, NULL, 'https://clareclerkrod.com', 25, 'published', now(), now()),
(clare_county_id, 'steven-worpell', 'Steven Worpell', 'Court Administrator', 'Clare County 80th District Court', '(989) 539-7173', NULL, NULL, '225 W Main St Harrison MI 48625', NULL, NULL, 51, 'published', now(), now()),
(clare_county_id, 'tara-hovey', 'Tara Hovey', 'Judge', '55th Circuit Court', '(989) 539-7131', NULL, NULL, NULL, NULL, NULL, 51, 'published', now(), now()),
(clare_county_id, 'toni-maize', 'Toni Maize', 'Administrative Assistant', 'Clare Conservation District', '(989) 539-6401', NULL, NULL, NULL, NULL, 'https://clarecd.org', 34, 'published', now(), now()),
(clare_county_id, 'tracy-brubaker', 'Tracy Brubaker', 'Deputy Director', 'Clare County Equalization', '(989) 539-7894', NULL, NULL, '225 W Main St Harrison MI 48625', 'Mon-Fri 8am-4:30pm', NULL, 29, 'published', now(), now()),
(lincoln_id, 'troy-kibbey', 'Troy Kibbey', 'Supervisor', 'Lincoln Township Board', '(989) 588-9841', '4', NULL, '175 Lake George Ave, PO Box 239, Lake George, MI 48633', NULL, NULL, 1, 'published', now(), now()),
(clare_county_id, 'william-faber', 'William Faber', 'Drain Commissioner', 'Clare County Drain Commission', '(989) 539-7320', NULL, NULL, NULL, NULL, NULL, 25, 'published', now(), now())
ON CONFLICT (region_id, slug) DO UPDATE SET name = EXCLUDED.name, role = EXCLUDED.role, department = EXCLUDED.department, phone = EXCLUDED.phone;

-- =============================================================================
-- Minutes (139)
-- =============================================================================

INSERT INTO public.minutes (region_id, slug, title, date, meeting_type, status, source, body, pdf_url, attendees_present, attendees_absent, attendees_also_present, created_at, published_at)
VALUES
(lincoln_id, '2014-01-13-board-meeting', 'Board Meeting — January 13, 2014', '2014-01-13', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 p.m.

Pledge of Allegiance.

**Roll Call:** Present was Zimmerman, Tobin, Bridges, Carey and Majewski.
**Also present** was County Comm./Fire Chief Majewski, Lakes Dir. Carey and 7 other interested persons.

---

Minutes of the December 2013 regular meeting approved as presented.

Treasurer''s report was accepted as presented.

Treasurer Carey gave the board an update on the Rubbish Assessment. Currently expenditures are exceeding income approximately $15,000. However, the fund has a balance which we are pulling from. There will need to be an increase of a few dollars on the rubbish assessment in a year or two.

Motion by Bridges to approve the monthly bills, second by Tobin, roll call vote, 5 yes, motion carried.

---

**Public Comment:** There was none offered.

Commissioner Majewski said that the Court House security training had started on Friday January 10, 2014. There will be another training held on Friday January 17, 2014. Majewski said that Michigan is considering a bill requiring front license plates on cars and trucks.

Fire Chief Majewski reported that the department has received a donation in the amount of $2500 from Trans Canada Pipeline Company for the purpose of purchasing 2 gas detection monitors. These monitors have been purchased. There were 33 rescue, 1 fire related runs for the month of December, 402 runs for 2013.

Tobin reminded everyone that the new day for Planning Meetings is the first Tuesday after the regular Township Board meeting at 7:00 p.m. *(There will be no Planning Meetings in February and March unless something comes up that needs attention.)*

ZA Carey reported 1 zoning application for a garage, 1 zoning application approved, zero denied and no ordinance complaints for December 2013.

Motion by Zimmerman to adopt resolution number 011314-A a resolution regarding grant seeking authority for certain Township officials, second by Tobin, roll call vote, 5 yes, motion carried.

Zimmerman reminded everyone that we are in need of Planning Commission and Zoning Board of Appeals members.

Carey gave an update on the Fire Works Ordinance and handed out a draft for review and consideration at our February meeting.

---

**Public Comment:** 2 comments were offered on private roads and the stump on Lake Dr. in the area of 1650 which seems to be impeding the plow.

Motion by Bridges to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 7:30 p.m.

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2014-02-10-board-meeting', 'Board Meeting — February 10, 2014', '2014-02-10', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 p.m.

Pledge of Allegiance.

**Roll Call:** Present was Carey, Bridges, Tobin, Zimmerman and Majewski.
**Also present** was Building Insp. Mantei, County Commissioner/Fire Chief D. Majewski, Rep. Johnson and 6 other interested persons.

---

Minutes of the 13 January, 2014 regular meeting approved as presented.

Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, 5 yes, motion carried.

Supervisor Zimmerman read correspondence from Consumers Energy, Attorney Dreyer and Merle Harmon.

Rep. Joel Johnston reported that townships will see a 3% increase in revenue sharing. He discussed the City of Detroit bankruptcy and the effects on pensioners.

Commissioner Majewski reported that Laboda was elected as Chair and Majewski was elected as Vice Chair of the County Board of Commissioners. BOC meetings will remain on the 3rd Wednesday of each month at 9:00 a.m.; the Governor has recommended that Counties receive full revenue sharing in fiscal year 2015.

The fire department had 20 rescue, 1 mutual aid and 1 gas leak related runs for January 2014. One fire fighter will be attending FFI training and two will challenge the FFII test.

Motion by Zimmerman to approve a fire fund expenditure of $2259.00 for the purpose of Lake Painting to epoxy the floor of the front bay, second by Tobin, all in favor, motion carried.

Motion by Majewski to approve a general fund expenditure of $300 for the purpose of Hawk Electric installing a light at the Shingle Lake Park, second by Zimmerman, all in favor, motion carried.

There were 47 Building permits issued for 2013.

Motion by Carey to adopt resolution number 021014-A, a resolution that repeals Ordinance 41 of November 12, 2012 - The Fireworks Ordinance and enacts the revised Ordinance 41 for the Control and Use of Fireworks, second by Zimmerman, roll call vote, 5 yes, resolution adopted.

Motion by Zimmerman to appoint Jerry Bridges to the Zoning Board of Appeals for a term of 3 years (to 2/10/2017) second by Tobin, all in favor, motion carried.

---

Motion by Zimmerman to approve a 1.5% CPI for Lincoln Sanitation, which equates to 15 cents per livable dwelling and to increase the house count by 12 to 1915, pursuant to further investigation, effective March 01, 2014, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to utilize Michigan Chloride for road brining at a one cent per gallon increase over last year, second by Carey, all in favor, motion carried.

**Public Comment:** Several comments were heard regarding the Consumers correspondence and one comment was made regarding a credit card scam where a mysterious charge of $9.84 is showing on bills.

Motion by Bridges to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 8:00 p.m.

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2014-03-10-board-meeting', 'Board Meeting — March 10, 2014', '2014-03-10', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 p.m.

Pledge of Allegiance.

**Roll Call:** Present were Carey, Zimmerman, Majewski, Tobin and Bridges.
**Also present** was Fire Chief/County Comm. D. Majewski, Zoning Admin./Lakes Dir. R. Carey, Building Insp. Mantei and 3 other interested persons.

---

Minutes of the 10 February, 2014 meeting approved as presented.

Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, 5 yes, motion carried.

Commissioner Majewski reported that he had brought the matter of court house security to the Board of Commissioners at their February meeting and further efforts toward more security was denied.

**Public Comment:** None offered.

Chief Majewski reported 23 rescue, 3 fire, 1 power line and 1 mutual aid related runs for February, 61 runs year to date.

Motion by Zimmerman to approve the Fire Chief attending the annual safety conference in Lansing, second by Tobin, all in favor, motion carried.

---

Supervisor Zimmerman opened the public hearing portion of the meeting.

Supervisor Zimmerman explained the purpose of the public hearing is to gather input and comments regarding the proposed acquisition of a tanker truck through the USDA in the form of grant and the balance in the form of an installment loan.

Zimmerman commented on the importance of maintaining our fleet and replacing the aged vehicles. Majewski commented on the financing. Tobin inquired if the fire fund can afford an installment loan. Chief Majewski commented that the fire fund can indeed afford an installment loan. Sharon Bridges commented that she is all for the protection of the community and the fire fighters. Tom Godau said that he is in full support of the proposed project. Cindy Englehardt said that she is in full support of the project.

Motion by Majewski to adopt resolution number 031014-A, a resolution authorizing the Lincoln Township Clerk to proceed with this funding opportunity, second by Zimmerman, roll call vote, 5 yes, resolution adopted.

There being no further comments offered, Supervisor Zimmerman closed the hearing portion of the meeting at 7:28 p.m.

---

Motion by Zimmerman to adopt resolution number 031014-B, a resolution to amend the Fireworks Ordinance Number 41, to correct a typographical error wherein the word "City" be changed to "Township", second by Bridges, roll call vote, 5 yes, motion carried.

Motion by Majewski to approve a general fund budget adjustment in the amount of $8613.43, second by Zimmerman, all in favor, motion carried.

Motion by Majewski to approve a fire fund budget adjustment in the amount of $1659.97, second by Zimmerman, all in favor, motion carried.

Motion by Majewski to approve a law fund budget adjustment in the amount of $200.00, second by Zimmerman, all in favor, motion carried.

Motion by Zimmerman to increase the Zoning Liability Coverage with Burnham and Flower to $1,000,000.00, in an amount not to exceed $273.00, second by Bridges, all in favor, motion carried.

Motion by Majewski that Lincoln Township retain Burnham and Flower as our primary insurance carrier, second by Tobin, all in favor, motion carried.

Sheriff''s Deputy Roland gave the police report.

Zimmerman attended the White Birch workshop recently. White Birch has contracted with Michigan Chloride for road brining. Dennis will do a Memorandum of Understanding regarding our agreement with White Birch that they shall reimburse the Township for brine used on the roads within the Association.

---

**Public Comment:**

M. Carey made comment regarding the recent depreciation on the Pipeline pipe in the ground. This will reduce our taxable value by $10,000,000.00 in Lincoln Township.

R. Carey said that he and Mantei will be out looking for building and zoning violations.

Godau asked who is responsible for determining the cause of a fire. Chief Majewski said that our people make an initial determination. If our fire department cannot make a determination they call the Fire Marshall, if there is a death they immediately involve the State.

Sharon Bridges commented on the abuses of the emergency services, specifically individuals who repeatedly call 911, but then refuse help when rescuers arrive. Zimmerman said that there isn''t anything that the Township can do. We have to answer the 911 call. He added that if a caller is calling 911 for fraudulent purposes that would be an issue for Central Dispatch.

Motion by Bridges to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 7:55 p.m.

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2014-04-14-board-meeting', 'Board Meeting — April 14, 2014', '2014-04-14', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 p.m.

Pledge of Allegiance.

**Roll Call:** Present were Zimmerman, Tobin, Bridges and Majewski. Carey, absent excused.
**Also present** was Deputy Vanbonn, County Commissioner Grim, Farwell Village Pres. Grim, Building Inspector Mantei, County Comm./Fire Chief Majewski and 4 other interested persons.

---

Minutes of the 10 March 2014 regular meeting approved as presented.

Treasurer''s report was approved as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, all in favor, motion carried.

Correspondence received from the Road Commission, MDOT, MDEQ, MEDCO and Lincoln Sanitation was reviewed.

County Commissioners Grim and Majewski reported on the Health Summit to be held on April 22nd, the Freedom Park ground breaking on April 25th, the recent agreement to purchase of the K of C building adjacent to the County Building for Senior Services and the hiring of a new IT person.

**Public Comment:** None offered.

Chief Majewski reported 24 rescue and 3 fire related runs for the month of March, 91 runs year to date.

Motion by Zimmerman to adopt resolution number 041414-A, a resolution regarding the Michigan Township Participating Plan Risk Reduction Grant Opportunity, second by Tobin, roll call vote, all in favor, resolution adopted.

Motion by Zimmerman to approve the bid from Lake Painting of $12,980.00 for the purpose of prepping and painting the Township Hall, second by Bridges, all in favor, motion carried.

Motion by Zimmerman to approve the bid from Ideal Sealcoating of $1325.00 for the purpose of crack filling and sealcoating the Township Hall parking lot, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to approve the bid from Ideal Sealcoating of $837.00 for the purpose of crack filling the cemetery roads, second by Bridges, all in favor, motion carried.

---

**Public Comment:** Comment was offered by 5 individuals regarding the ZBA, bidding process, the compost field, and the memorandum of understanding with White Birch about road brining.

Motion by Bridges to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 7:42 p.m.

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2014-05-12-board-meeting', 'Board Meeting — May 12, 2014', '2014-05-12', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 p.m.

Pledge of Allegiance.

**Roll Call:** Present was Zimmerman, Majewski, Carey, Tobin and Bridges.
**Also present** was Zoning Admin. Carey, County Comm. Grim, Fire Chief/Comm. D. Majewski, Building Insp. Mantei, and 11 other interested persons.

---

Minutes of the 14 April, 2014 meeting approved as presented.

Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills, seconded by Tobin, roll call vote, 5 yes, motion carried.

Motion by Majewski to pay the Sheriffs bill when it arrives and the Gateway bill once the account activity is verified and the clerk is satisfied that the balance due is correct, second by Zimmerman, roll call vote, 5 yes, motion carried.

Commissioner Grim reported on the new medical examiner and that there are 7 paramedics and fireman in the County training to be deputy medical examiners. Commissioner Majewski reported that MMR is giving a free 1 hour CPR non-certification training at Lake of the Pines on June 14, 2014 at 11:00 AM.

Motion by Zimmerman to approve a fire fund expenditure of $250.00 for the purpose of additional insurance for the Smoke House demonstration at the EXPO on June 21st, second by Tobin, all in favor, motion carried.

---

**Public Comment:** There was comment offered from a citizen who was recently issued a zoning violation. The citizen was directed to the Planning Commission Meeting on 13 May, 2014.

Fire Chief Majewski reported 29 rescue, 8 fire, and 3 power line related runs for the month of April, 122 runs year to date.

Motion by Zimmerman to approve the 2014 Equalization Contract, second by Carey, all in favor, motion carried.

Motion by Zimmerman to approve Cindy Englehardts ZBA status from alternate to regular member, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to adopt resolution number 051214-A, a resolution regarding the occurrence of indebtedness for the purpose of purchasing a Tanker Truck, second by Tobin, roll call vote, 5 yes, motion carried.

Motion by Zimmerman to adopt resolution number 051214-B, a resolution regarding the execution and delivery of an installment purchase/note agreement, second by Tobin, roll call vote, 5 yes, motion carried.

Motion by Zimmerman to adopt resolution number 051214-C, a wage and salary resolution for elected officials for the annual meeting, which reflects no increase in wage or salary for elected officials, second by Bridges, roll call vote, 5 yes, motion carried.

Motion by Zimmerman to allow a flag pole to be erected at the Citizens Corner in honor of all Veterans as requested by Jan Penton and that the pole be placed behind the bench along the fence, it cannot block visibility and that proper flag protocols are observed and that the flag be appropriately lit, second by Tobin, all in favor, motion carried.

Motion by Majewski to approve a general fund expenditure of not to exceed $600.00 for the purpose of Michigan Election Resources printed and mailing the voters registration cards to every voter in Lincoln Township to reflect the Senate District change, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to approve a general fund expenditure of $380.00 for the purpose of purchasing a monitor and printer for the clerk''s office, second by Bridges, all in favor, motion carried.

---

**Public Comment:** A citizen apologized for an earlier outburst and there was comment and discussion on the Davis St. private road issue.

Motion by Bridges to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 7:55 p.m.

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2014-05-12-sheriff-meeting', 'Special Meeting — Sheriff Budget Review — May 12, 2014', '2014-05-12', 'Special Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 6:30 p.m.

**Present** was Zimmerman, Majewski, Carey, Bridges and Tobin.
**Also present** was Undersheriff Miedzianowski, Deputy VanBoon, Commissioner Majewski and R. Carey.

---

Carey explained the Law Budget and the impact of the recent pipeline depreciation factor on that budget. The revenue for 2013 is $128,000 and the revenue for 2014 is anticipated to be approximately $112,000.

Further discussion included that we are looking at a budget of $80,000 for wages and $30,000 for vehicle mileage. Carey stated that good fiscal management says that there should be 1 years'' worth of retained earnings in the fund balance; the township is willing to dip in to that balance to keep our coverage at the current level.

Miedzianowski offered that he will speak with the Sheriff and the Union about utilizing less senior officers in Lincoln Township in order to conserve funds.

For 2014 and 2015 the board will consider a budget of $117,000 which will use $5000 of retained earnings.

Miedzianowski will contact Carey regarding further discussion and budget comparison.

Motion by Majewski to adjourn the meeting, second by Carey, all in favor, meeting adjourned at 6:48 p.m.

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2014-06-09-board-meeting', 'Board Meeting — June 9, 2014', '2014-06-09', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 p.m.

Pledge of Allegiance.

**Roll Call:** Present was Zimmerman, Majewski, Carey, Tobin and Bridges.
**Also present** was Zoning Admin. Carey, County Comm. Grim, Fire Chief/Comm. D. Majewski, Farwell Village Pres. Grim, Building Insp. Mantei, and 13 other interested persons.

---

Minutes of the 12 May, 2014 Special Meeting approved as presented.

Minutes of the 12 May, 2014 Regular Meeting approved as presented.

Treasurer''s report was accepted as presented.

Motion by Tobin to pay the monthly bills, seconded by Bridges, roll call vote, 5 yes, motion carried.

Zimmerman read a Thank You card from the Lake George Boosters Club.

**Public Comment:** One comment was offered on the blight process guidelines.

Fire Chief Majewski reported that there is a new applicant for the fire department. The applicant, Tim Bailey, comes to Lincoln Township with FF I and II and his MFR License. Bailey is from Greenwood Township. Bailey will join the department pending physical and background. Jennifer Milan has graduated from MFR class. Keller and Logan will challenge the FFII test. There were 32 rescue, 5 fire and 1 power line related runs for May 2014. 153 year to date.

Motion by Majewski to approve a general fund expenditure of not to exceed $1500 for the purpose of having sand put on all three beaches, second by Zimmerman, all in favor, motion carried.

Motion by Zimmerman to adopt resolution number 060914-A, a resolution regarding the change in ownership of Lincoln Sanitation and that the Township will continue service with American per the Acknowledgment, Agreement and Consent to Assign Solid Waste Collection and Disposal Agreement with American Waste, Inc.; and includes the Acknowledgement of Services Different than Contract Language, second by Tobin, roll call vote, 5 yes, motion carried.

Motion by Majewski to approve the contract set forth by Michigan Decorations for our annual holiday decorations in the amount of $940.00, second by Zimmerman, all in favor, motion carried.

---

Motion by Majewski to approve a general fund expenditure of $11,336 and a fire fund expenditure of $18,496 (total of $29,832.00) for the purpose of the Township insurance premium from July 01, 2014 to June 30, 2015, second by Zimmerman, all in favor, motion carried.

Motion by Zimmerman to put the 2 slides, 3 sets of bleachers and monkey bars up for bid, second by Bridges, all in favor, motion carried.

Dennis read a letter from Ken Osborn regarding the success of the recycling event. We will plan another one in the future.

The Expo is June 21, 2014. The recycle bin will moved over to the compost field for the June recycling as the area will be needed for parking for the EXPO.

The Townships Budget and Annual Meeting will be on June 24, 2014 at 4:00 PM.

The LGPOA will be selling raffle tickets at Jays Sporting Goods on June 13, 14, and 15. The raffle tickets are for the Shingle Lake Improvement Project that the LGPOA is working on.

The LGPOA will be hosting the annual Boaters Safety on June 28th at the Township Hall from 9:00 AM to 4:00 PM for ages 12 years and older; lunch is provided and the event is free of charge.

**Public Comment:** Commissioner Grim commented on how beautiful Lake George is looking.

Motion by Tobin to adjourn the meeting, second by Bridges, all in favor, meeting adjourned at 7:44 p.m.

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2014-07-14-board-meeting', 'Board Meeting — July 14, 2014', '2014-07-14', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 p.m.

Pledge of Allegiance.

**Roll Call:** Present was Zimmerman, Majewski, Carey, Tobin and Bridges.
**Also present** was Zoning Admin. Carey, County Comm. Grim, Fire Chief/Comm. D. Majewski, Farwell Village Pres. Grim, Building Insp. Mantei, Sheriff''s Deputy VanBonn and 9 other interested persons.

---

Minutes of the 09 June, 2014 regular meeting accepted as presented.

Treasurer''s report was approved as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, all in favor, motion carried.

**Public Comment:** None offered.

Chief Majewski reported that the department had recently participated in a joint hazmat training with Mt. Pleasant Fire Department, whom we have a mutual aid agreement with. The training was very good and well attended.

There were 17 rescue, 1 fire and 2 power line related runs for the month of June, 205 runs year to date.

Motion by Zimmerman to approve trading in the unused backhoe for $3500.00 and using that value towards an RTV to be used for wild land firefighting and snow removal and approve an additional $6000.00 for the same RTV to be purchased from Capitol equipment, 50% from the general fund and 50% from the fire fund, second by Bridges, all in favor, motion carried.

---

There were 3 bids for the play equipment received.

Motion by Zimmerman to accept the bid from Dee Dee Johnston of $100 for the small slide, second by Carey, all in favor, motion carried.

Motion by Zimmerman to accept the bid from Joe Johnston of $100 for the larger slide, second by Carey, all in favor, motion carried.

Motion by Zimmerman to accept the bid from Dale Majewski of $75.00 for the bleachers, second by Bridges, all in favor, motion carried.

Motion by Majewski to accept the settlement of attorney fees from Schunk in the amount of $500.00 upon clarification from Attorney Dreyer as to whether or not that $500.00 includes the most recent billing of $185.00 paid by the Township; If it does not include the $185.00 already paid by the Township, Majewski will negotiate the settlement of $685.00, second by Zimmerman, all in favor, motion carried.

Motion by Zimmerman to adopt resolution number 071414-A, a resolution recognizing the Hamlin Field Recreation Committee, second by Bridges, roll call vote, 5 yes, resolution adopted.

---

**Public Comment:** There were 6 comments made regarding the LGPOA boat parade, safe water activities, public and private lake easements, gates at Shingle Lake Park and the Fire Works Ordinance.

Motion by Tobin to adjourn the meeting, second by Bridges, all in favor, meeting adjourned at 7:37 p.m.

Respectfully Submitted,
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2014-07-14-election-commission', 'Election Commission Meeting — July 14, 2014', '2014-07-14', 'Election Commission', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:37 p.m.

**Present** was Zimmerman, Carey and Majewski.

---

Motion by Zimmerman, second by Carey, to approve the slate of Election Inspectors for the August 5, 2014 Primary Election as presented:

Judy Palkoski -- D, Tina VanDyke -- D, Deb Briggs -- R, Patt Lambert -- R

Deb Sherrod -- D, Sheryl Judd -- D, Roger Carey -- R, Nancy House -- D

Two alternates.

All in favor, motion carried.

Motion by Zimmerman to adjourn the meeting, second by Carey, all in favor, meeting adjourned at 7:39 p.m.

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2014-08-11-board-meeting', 'Board Meeting — August 11, 2014', '2014-08-11', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 p.m.

Pledge of Allegiance.

**Roll Call:** Present was Zimmerman, Majewski, Tobin, Bridges and Carey.
**Also present** was County Commissioner Grim, Fire Chief/Commissioner D. Majewski, Zoning Admin. Carey, Building Inspector Mantei and 6 other interested persons.

---

Minutes of the July 14, 2014 regular meeting approved as presented.

Minutes of the July 14, 2014 Election Commission Meeting approved as presented.

Treasurer''s report accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, all in favor by roll call, motion carried.

Commissioner Grim reported that Senior Services will be putting a millage request on the November ballot. Grim also reported that the BOC has approved a request from the Sheriff to set up an alternate dispatch center at the Clare Public Safety Building; this is in the event that the current location is disabled for some reason, they will still be able to operate 911 from the south end.

Commissioner Majewski reported that Commissioner Laboda Dist. #5, has resigned his position and that the Board of Commissioners is accepting applications from interested persons from District #5. Majewski was asked by the Garfield Township Supervisor, Dave Byl, to be on their (fire) Engine Committee.

**Public Comment:** 1 comment was offered complimenting the new paint job on the Township Hall.

Chief Majewski welcomed Timothy Bailey to the Fire Dept.; Tim comes to Lincoln Township medically trained and FFI trained. Majewski said that he had recently submitted a bill to Consumers Energy in the amount of $4800.00 for a run involving their lines in a roadway. There were 34 rescue, 3 fire and 6 power line related runs for July, 249 year to date.

Tobin reported that he is working on the updates for cemetery page of the web site.

Motion by Zimmerman to approve the Property Line Adjustment Application w/declaimer added, second by Tobin, all in favor, motion carried.

---

**Public Comment:** Clerk Majewski explained that it has been reported that an individual has been seen and videotaped recently allowing two leashed dogs to urinate on the Veterans Memorial Stone at the Citizens Park. Same individual was also seen throwing dog feces into the park after the animal had obviously defecated on nearby property. The situation has been reported to law enforcement.

Motion by Bridges to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 7:42 p.m.

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2014-08-14-special-meeting', 'Special Meeting — Tanker Truck Purchase — August 14, 2014', '2014-08-14', 'Special Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 10:03 a.m.

Zimmerman stated the purpose of the meeting was to consider a resolution regarding the cost of the Tanker Truck that the Township is purchasing from CSI. The cost of the vehicle has increased to $198,861.00.

Motion by Zimmerman to adopt resolution number 081414-A, a resolution that authorizes the Lincoln Township Clerk and Supervisor to enter into the appropriate agreement(s) to expend (updated price) $198,861.00 for the new fire truck from CSI Emergency Apparatus, Inc. of Grayling Michigan, second by Tobin, roll call vote revealed 5 yes, resolution adopted.

**Public Comment:** None offered.

Motion by Zimmerman to adjourn the meeting, second by Carey, all in favor, meeting adjourned at 10:05 a.m.

Respectfully Submitted,
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2014-09-08-board-meeting', 'Board Meeting — September 8, 2014', '2014-09-08', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 p.m.

Pledge of Allegiance.

**Roll Call:** Present was Zimmerman, Majewski, Carey, Bridges and Tobin.
**Also present** were 14 other interested persons.

---

Minutes of the 11 August 2014 regular meeting accepted as presented.

Minutes of the 14 August Special meeting accepted as presented.

Treasurer''s report was approved as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, 5 yes, motion carried.

Zimmerman acknowledged correspondence in the form of a petition (copy) signed by many Pinora Park Property Owners was received. There will be no action on this petition.

County Commissioner Grim said that County Commissioner Dale Majewski had been appointed to the Chair position and that County Commissioner Jack Kleinhardt had been appointed as Vice Chair. Grim also reported that the new date for the Health Dept. to move to its new home is Dec. 05, 2014.

County Commissioner Majewski reported that the Board of Commissioners had appointed Donald David to fill the vacancy left by Rick Laboda on the Board of Commissioners; and that Julie Lightfoot of Freeman Township has been appointed to fill the vacancy on the Road Commission Board.

**Public Comment:** None offered.

Fire Chief Dale Majewski reported that Joe Snover has applied to the department. Pending physical and background, he will be a member of the department on 9/15/2014. There were 32 rescue, 3 fire, 2 power line related runs for August, 274 year to date.

Deputy Dawson gave an update on the secondary/alternate 911 location in Clare. This is a location that can be utilized to run the County 911 system in the event that the Harrison Dispatch Center is somehow rendered unusable. The Deputy reminds everyone to abide by the ORV Ordinance as they are giving citations. The biggest concern is the children under 12 operating on the roads; and wearing no helmets.

Motion by Zimmerman to approve the assessor contract with Cushman Appraisals for 2 years, September 08, 2014 to September 08, 2016 in the amount of $2600.00 per month, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to appoint Kim Hamilton to the Planning Commission, second by Tobin, all in favor, motion carried.

---

Motion by Zimmerman to approve the Hamlin Field Recreation Committee to hold a haunted house/forest at the Hamlin Field from Oct. 23 through Oct. 25, 2014 for the public, second by Tobin, all in favor, motion carried.

Update on the post office: Paul thinks that the revenue is close and that we may be able to remain open for 6 hours per day. He won''t know for sure until the end of September.

Zimmerman said that there will be a senior millage increase on the ballot in November. In 2015 there will be 565 Clare County residents turning 55 years old. Currently Clare County Senior Services staff and volunteers have saved 27 lives; this is primarily due to home delivered meal volunteers finding clients in need of critical care upon arriving with their meal.

Zimmerman said to stay tuned for changes to the State Fireworks Ordinance. He will keep us updated.

Zimmerman also reported that there has been a traffic study and land survey done in Lake George regarding a Dollar Store. There have been no permits applied for at this time.

There is an IRS scam going on where the caller claims to be from the IRS and they demand payment of back due taxes. Zimmerman reminds everyone, the IRS does not do business by phone or email. They will contact you by US Mail if they need to.

**Public Comment:** There were 2 comments offered.

Motion by Bridges to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 7:37 p.m.

Respectfully submitted,
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2014-10-13-board-meeting', 'Board Meeting — October 13, 2014', '2014-10-13', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 p.m.

Pledge of Allegiance.

**Roll Call:** Present was Zimmerman, Majewski, Carey, Tobin and Bridges.
**Also present** was Fire Chief/Commissioner D. Majewski, Commissioner Grim, Zoning Admin. Carey, Building Insp. Mantei, Sheriff Deputy Dawson and 12 other interested persons.

---

Minutes of the 08 September, 2014 regular meeting approved as presented.

Treasurer''s report was accepted as presented.

Motion by Tobin to pay the monthly bills, second by Bridges, roll call vote, 5 yes, motion carried.

Zimmerman read correspondence from the insurance company regarding the subrogation on the most recent damages done to a light pole downtown. He also acknowledged correspondence regarding DEQ permits and applications for seawalls for Parsons, Coon and Howe and a meeting notice from the road commission.

Commissioners Grim and Majewski gave the County report. Parks and Rec needs 2 more board members. Interested persons should contact the County Administrator. The County did not approve the NORESCO proposal for energy efficient upgrades. The County will investigate other options.

Road Commissioner Lightfoot reported that the road commission is working on brush hogging and new signs. She reminded everyone to "shake your mailbox" and make sure the post is firmly in the ground. The plows will be doing their work soon and throwing the snow. One way to help reduce snow at the end of your drive is to clear the left side well. Also, a reminder that it is unlawful to push/plow your snow across a roadway.

**Public Comment:** There was one comment offered regarding campers in White Birch.

Fire Chief Majewski reported that there were 26 rescue, 1 fire and 4 power line related runs for the month of September; 325 year to date.

Rolf Hudson reported that the LGPOA had netted $4000 from the recent raffle done for the development project for the Shingle Lake Park. Hudson said there is $6200 in the fund.

Deputy Dawson reported that a local woman had been scammed out of $5000; apparently the victim of a lottery scam.

---

Motion by Zimmerman to adopt resolution number 101314-A, a resolution to renew the contract with Consumers Energy for lighting services, second by Tobin, roll call vote, 5 yes, resolution adopted.

Motion by Zimmerman to adopt resolution number 101314-B, a resolution regarding the Township participating in the fire insurance withholding program, second by Bridges, roll call vote, 5 yes, resolution adopted.

Motion by Zimmerman to approve a general fund expenditure of $595.00 for the APEX software for the assessor and $295.00 annual maintenance, second by Bridges, all in favor, motion carried.

**Public Comment:** There were three items offered for discussion; appointing an alternate to the ZBA, the difficulty seeing around the corner of Park St. and Lake George Ave. and the young people being banned from using the Wi-Fi at the Township Hall. Children under the age of 18 must be accompanied by a parent due to the excessive amount of vandalism at the hall. The ban may be lifted on November 30, 2014 per the Clerks discretion. When/if the ban is lifted, the ban is subject to immediate reinstatement if the vandalism recurs.

Motion by Zimmerman to adjourn the meeting, second by Bridges, all in favor, meeting adjourned at 8:35 p.m.

Respectfully submitted,
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2014-11-10-board-meeting', 'Board Meeting — November 10, 2014', '2014-11-10', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 p.m.

**Roll Call:** Present was Zimmerman, Majewski, Bridges, Tobin and Carey.
**Also present** was Deputy Dawson, Building Insp. Mantei, Fire Chief/County Commissioner D. Majewski, County Commissioner Grim, Road Commissioner Lightfoot, Zoning Admin. Carey and 9 other interested persons.

---

Minutes of the 13 October 2014 regular meeting accepted as presented.

Minutes of the 13 October 2014 Elections Commission meeting approved as presented.

Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, 5 yes, motion carried.

**Public Comment:** There were two comments offered.

Chief Majewski reported that the fire department open house held on Oct. 31st was attended by 80 children and 50 adults. There were 30 rescue and 1 mutual aid related runs for the month of October; 352 runs year to date.

Deputy Dawson reminded everyone to be careful with the approaching hunting season opening as car deer accidents increase during this time of year. Dawson reported that he had recently arrested 4 individuals in Lincoln Township for possession of marijuana for possible individual sale, possible home invasion and methamphetamines.

Motion by Zimmerman to adopt the poverty threshold as outlined, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to appoint Kim Smith as an alternate member of the Zoning Board of Appeals, second by Carey, all in favor, motion carried.

Motion by Zimmerman to appoint Tami McCaslin as an alternate member of the Zoning Board of Appeals, second by Carey, all in favor, motion carried.

There were 134 kids at the annual Trunk or Treat. The Spook House held at Luke Hamlin Field was well attended. Recommendations for next year are a potty and orange type lights at the entrance drive.

Motion by Zimmerman that Lincoln Township object to the transfer of the 7 unsold properties: 010-700-535-00, 010-700-567-00, 010-700-574-00, 010-720-713-00, 010-746-159-00, 010-746-160-00 and 010-746-189-00, at the Clare County "No minimum Bid" auction, second by Carey, all in favor, motion carried.

---

Motion by Zimmerman to accept the 2.5%, approximately $4.25 rate increase on the EPS (security system) located at 175 Lake George Ave., second by Tobin, all in favor, motion carried.

Motion by Zimmerman to accept the 2.5%, $4.25 rate increase on the EPS (security system) located at 310 Bringold Ave., second by Tobin, all in favor, motion carried.

Motion by Zimmerman to purchase a rain/snow cover for the RTV from Capitol Equipment for $465.00, second by Carey, all in favor, motion carried.

The Annual Children''s visit with Santa will be held on Sunday, December 14, 2014 at the Township Hall.

Board of Review will meet on December 09, 2014 at 6:00 PM for errors only.

**Public Comment:** 4 comments were offered.

Motion by Zimmerman to adjourn the meeting, second by Bridges, all in favor, meeting adjourned at 7:45 p.m.

Respectfully submitted,
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2014-12-08-board-meeting', 'Board Meeting — December 8, 2014', '2014-12-08', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 p.m.

Pledge of Allegiance.

**Roll Call:** Present were Zimmerman, Majewski, Bridges, Tobin and Carey.
**Also present** was Fire Chief/County Commissioner Majewski, County Commissioner Grim, Building Insp. Mantei, Zoning Admin. Carey, Deputy Dawson, ZBA Chair Godau and 3 other interested persons.

---

Minutes of the 10 November, 2014 regular meeting approved as presented.

Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, 5 yes, motion carried.

Zimmerman read correspondence regarding a sea wall permit for the Kim Smith property located on Lake George.

Zimmerman thanked Commissioner Grim for her years of service to Lincoln Township and Clare County.

Commissioner Grim reported that American Waste has purchased the old Transit Building and that the County had increased the Building Inspector, Mark Fitzpatrick, duties to include County Maintenance.

Fire Chief Majewski reported 33 rescue and 2 fire related runs for November, 378 runs year to date. He also reported that he had found the water heater at the fire hall rusted out on the bottom and leaking. It was replaced on 12/08/2014.

Deputy Dawson gave the law enforcement report. The burglary on Old State is in the hands of the prosecutor. There was a lot of evidence collected and processed. The suspects are juveniles, but Dawson has requested that they be charged as adults. He also reported that he has seen quite a few individuals on the lakes and he urges everyone to use caution as the ice is unpredictable, especially with the mild temperatures.

Zoning Administrator Carey reported that he had recently spoke with Det. Vredevelt about the rental units in Bertha Lake on Finley Lake Ave. (a.k.a the old store). There have been several complaints received by the Township as well as other agencies regarding water and sewer problems, heating unit problems and mold issues. The issue is in the hands of the prosecuting attorney.

---

Motion by Zimmerman to appoint Steve Bryant, Roger Carey and Cindy Englehardt to the Board of Review for the Jan. 01, 2015 through Dec. 31, 2016 term, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to appoint Joe Rentz as an alternate to the Board of Review for the Jan. 01, 2015 through Dec. 31, 2016 term, second by Carey, all in favor, motion carried.

Zimmerman read correspondence from Enviorscience regarding the suspension of operations. There was discussion regarding how this would affect the Special Assessment for the Control of Aquatic Nuisance on Silver Lake. The Assessment is to collect $45,000 over a period of 5 years; during that time the contract with Enviorscience is to treat the lake with 33,000 weevils and surveys. To date 32,400 weevils have been planted. The Township has paid out $27,000 which exceeds what has been collected to date. The assessment owes the Township approximately $10,000 and another $8,400 for the 2014 season. Next winters (2015) taxes will leave about $1900 outstanding to be collected in 2016 winter tax. Only time will tell if the planted weevils have improved the lake.

The BOR will meet on 12/09/14 for the purpose of errors, exemptions, late-PRE''s, not assessments.

The annual children''s visit with Santa is on 12/14/14 at 1:00 PM to 3:00 PM at the Township Hall.

**Public Comment:** Godau wished everyone Happy Holidays and thanked the Board for a fine job in 2014.

Motion by Bridges to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 7:37 p.m.

Respectfully Submitted,
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2015-01-12-board-meeting', 'Board Meeting — January 12, 2015', '2015-01-12', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 p.m.

Pledge of Allegiance.

**Roll Call:** Present was Zimmerman, Majewski, Carey, Tobin and Bridges.
**Also present** was Building Insp. Mantei, Zoning Admin. R. Carey, Fire Chief/County Commissioner D. Majewski and 9 other interested persons.

---

Minutes of the 08 December, 2014 meeting accepted as presented.

Treasurer''s report was approved as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, 5 yes, motion carried.

---

Commissioner Majewski reported that the Board of Commissioners is still working on how best to utilize the space recently vacated by the Health Department, the Clerk''s office recently added a temporary employee to help with court document filings and other tasks as assigned.

**Public Comment:** There was a question regarding the recycling program sponsored by Waste Management. Clerk Majewski explained that the program is free to our residents and that the Township''s role is to provide a spot for the collection bin the 3rd weekend of each month. Beyond that, the Township does not control or pay for the service.

Chief Majewski reported that there were 34 rescue, 1 fire and one mutual aid related runs for the month of December, 402 runs for 2014. New firefighter, Joe Snover, is taking the Fire Fighter I class.

---

Motion by Zimmerman to accept the proposal from the Landplan for updating and revising the Zoning Ordinance in the amount not to exceed $16,850.00, second by Bridges, all in favor, motion carried.

**Public Comment:** There was one comment offered.

Motion by Bridges and seconded by Tobin to adjourn the meeting, all in favor, meeting adjourned at 7:38 p.m.

Respectfully Submitted,

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2015-02-09-board-meeting', 'Board Meeting — February 9, 2015', '2015-02-09', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM.

Pledge of Allegiance.

**Roll Call:** Present was Zimmerman, Tobin, Majewski, Carey and Bridges.
**Also present** was Lakes Dir./Zoning Admin. R. Carey, County Commissioner/Fire Chief D. Majewski, Building Inspector Mantei, Rep. Joel Johnston, County Commissioner Pitchford, Deputy VanBonn and 6 other interested persons.

---

Minutes of the 12 January, 2015 regular meeting approved as presented.

Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, all in favor, motion carried.

---

Zimmerman read correspondence from the MDEQ regarding the Featherston''s 260 ft. of seawall permit being approved.

Rep. Johnston gave an update on the ballot issue in May that is asking voters to approve an increase in the state sales tax from 6 cents to 7 cents on the dollar.

Commissioner D. Majewski reported that the Board of Commissioners will be having two meetings a month, on the 1st and 3rd Wednesdays starting at 9:00 AM. Commissioner Majewski also reviewed the new public act to permit golf carts on local roads.

Commissioner Pitchford reported that the court house would be getting new LED lights.

**Public Comment:** There was none offered.

---

Chief Majewski reported 29 rescue, 3 fire and 2 mutual aid related runs for the month of January; 43 runs year to date.

Motion by Zimmerman to approve a fire fund expenditure of $1000.00 for the purpose of purchasing a trailer for the RTV so that it can be on the trailer and ready to go for grass fires, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to approve resolution number 020915-A, a resolution regarding the Memorandum of Understanding with Senior Services, roll call vote, all in favor, motion carried.

---

**Public Comment:** Englehardt asked if the Township would be doing any projects at the Shingle Lake Park this year; it was discussed that there are no planned projects for that park. Figley inquired about the upcoming meeting with the Landplan regarding the new Zoning Ordinance. The meeting will be on February 23, 2015 at 3:00 PM at the Township hall.

Motion by Bridges to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 7:50 PM.

Respectfully submitted,

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2015-03-09-board-meeting', 'Board Meeting — March 9, 2015', '2015-03-09', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM.

**Roll Call:** Present was Zimmerman, Majewski, Carey and Bridges. Absent and excused was Tobin.
**Also present** was Zoning Admin. Carey, Building Insp. Mantei, County Comm./Fire Chief Majewski, County Comm. Pitchford, Road Commissioner Lightfoot, Road Comm. Engineer Gupta, Road Maint. Manager Dave Sunday and 9 other interested persons.

---

Minutes of the 09 February regular meeting approved as presented.

Minutes of the 23 February Special Joint Meeting w/ Landplan approved as presented.

Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills, second by Zimmerman, roll call vote, 4 yes, motion carried.

---

Commissioner Majewski reported that the ballot language for the 05 May 2015 has been approved. The 11th annual Paula Pirnstill Health Fair will be on April 18th at the Farwell High School.

Road Commissioner Lightfoot and Road Commission Engineer Gupta reviewed the proposal on the 05 May, 2015 ballot.

**Public Comment:** None offered.

---

Chief Majewski explained the Active 911 paging system that will allow fire fighters to receive calls over their cellular phones. This is on an elective basis. Four of the County Fire Departments and Central Dispatch will share 1/5th in the cost to upgrade the 911 system with the module for Active 911.

Motion by Zimmerman to approve a fire fund expenditure of $973.00, one time fee, to Clare County for 1/5th the cost of the Active 911 Module, plus $10 per phone, per year, for fire fighters wishing to utilize the application, second by Bridges, all in favor, motion carried.

Chief Majewski explained that the C70 Chevrolet Tanker that is being replaced by the Tanker that is in production has had a transmission failure. Under the circumstances that the tender is being replaced in a few short months it may not be worth investing the money to fix it and selling it in "as is" condition, disclosing to the purchaser the transmission issue. Chief Majewski reported 31 rescue, 1 power line and 1 fire related runs for the month of February, 75 runs year to date.

The building department reported 67 permits issued for 2014.

---

Zimmerman explained that he would like to continue using Michigan Chloride for our road brining just before the 3 major holidays and otherwise on an as needed basis.

Motion by Zimmerman to continue using Michigan Chloride for our road brining purposes, second by Carey, all in favor, motion carried.

Motion by Zimmerman to approve a CPI increase of 1.6% for American Waste, per our contract, second by Bridges, all in favor, motion carried.

Motion by Zimmerman to authorize R. Carey to attend a Shoreline Zoning Seminar in Traverse City at a cost of $55.00 plus mileage, second by Bridges, all in favor, motion carried.

Motion by Zimmerman to authorize Clerk Majewski, Zoning Admin. Carey and ZBA Chairman Godau to attend a Settlement Conference in Bay City, and to approve a maximum of $20.00 meal allowance plus mileage, second by Bridges, all in favor, motion carried.

Clerk Majewski reported that the fire department has updated, added and reviewed the following SOG''s: Powerline Event, Response -- Auto Collision, Response -- Confined Space, Response -- Pipeline Emergency, Response -- Railway, Response -- Structure Fire, Response -- Water Rescue, Response -- Wild Land Fire, Response -- Rescue, Response -- Call, SCBA/Respirators, Severe Weather Event, Vehicle Inspection Fleet, Social Media Policy and Safe Work Environment.

Motion by Zimmerman to adopt the Social Media policy for all township employees and add it to the personnel policy, second by Carey, all in favor, motion carried.

Announcements: Neighborhood Watch will be 09 April, 2015 at the Township Hall at 2:00 PM. The annual Easter Egg Hunt will be 04 April, 2015 at the Shingle Lake Park at 11:00 AM.

**Public Comment:** Comment was offered on waste haulers and frost laws.

Motion by Bridges to adjourn the meeting, second by Carey, all in favor, meeting adjourned at 8:05 PM.

Respectfully Submitted,

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2015-03-09-special-meeting', 'Special Meeting — Pension Plan — March 9, 2015', '2015-03-09', 'Special Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 6:00 PM.

**Roll Call:** Present was Zimmerman, Majewski, Carey and Bridges. Absent and excused was Tobin.
**Also present** was R. Carey, D. Majewski and Natalie Braden.

---

Natalie Braden of Burnham and Flower explained that the Township pension plan has been in one of the original guaranteed interest accounts and is now open to adding mutual funds.

Natalie explained that each pensioned position will pick their choices of the offered mutual funds and bonds.

Natalie will return to Lincoln Township on 06 April 2015 to work with the fire fighters on the choices available to them.

**Public Comment:** None offered.

Motion by Bridges to adjourn the meeting, second by Zimmerman, all in favor, meeting adjourned at 6:35 PM.

Respectfully Submitted,

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2015-04-13-board-meeting', 'Board Meeting — April 13, 2015', '2015-04-13', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM.

Pledge of Allegiance.

**Roll Call:** Present was Zimmerman, Bridges, Tobin, Carey and Majewski.
**Also present** was Deputy VanBonn, Building Insp. Mantei, Zoning Admin. Carey, County Commission/Fire Chief Majewski, County Commissioner Pitchford and 8 other interested persons.

---

Minutes of the 09 March regular meeting approved as presented.

Minutes of the 09 March special meeting with Burnham & Flower approved as presented.

Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, all in favor, roll-call vote, 5 yes, motion carried.

---

Supervisor Zimmerman acknowledged 2 articles of correspondence received from Ed Roy, the attorney for Tom and Angie Schunk.

County Commissioners Majewski and Pitchford reported that the 30 year old HVAC units are being replaced at the County Building, the County budgeting process is starting and the County Parks and Rec plan has been approved.

**Public Comment:** None offered.

---

Fire Chief Majewski reported that the new tanker chassis is wired and progressing. There have been many calls on the old tanker, but no offers yet. There were 2 fire, 26 rescue and 1 power line related runs for the month of March, 110 year to date.

There was some discussion on Charter TV versus Direct TV for the fire hall and township hall. To add basic Charter TV to the Fire Hall it would be $68 per month additional to the current phone and internet fees of $138.00. Clerk Majewski did not think that the explanation from Charter for such a high increase was satisfactory. Chief will find out how much it will be for Direct TV for the basic service.

The April Planning meeting for 14 April, 2015 is being cancelled due to lack of quorum.

Lakes Director Carey reported that stricter drunken boating laws take effect this spring. The legal limit for operating watercraft and off road vehicles while intoxicated will be 0.08 percent. Carey also reported that the recent Shoreline Zoning training he attended was very informative.

---

Undersheriff Miedzianwski requested that the board consider purchasing 2 Prima Facie body mics w/ camera and audio for the Lincoln deputies. One body mic will be assigned to each of the two deputies assigned to Lincoln Township. The total cost of the mics is $575.00 each. The Sheriff''s department will be responsible for maintenance.

Motion by Zimmerman to approve a law fund expenditure of $1,150.00 for the purpose of purchasing two Prima Facie Body Mics for use by the Clare County Sheriff''s Department Deputies assigned to Lincoln Township, second by Bridges, all in favor, motion carried.

Announcements: The Easter Egg Hunt was fun and attended by approximately 60 children. There will be a meeting with the Landplan regarding the Zoning Ordinance Initiative on 27 April, 2015 at 3:30 PM. The next Neighborhood Watch monthly meeting is 14 May, 2015 at 2:00 PM at the Township Hall. The Expo is set for 20 June, 2015.

**Public Comment:** Rolf Hudson said that the LGPOA has about $6,000.00+ for the Shingle Lake Park Project. Ideas were shared on how to best use the money. A pavilion is planned and hopefully some sort of dressing room. Merle Harmon said that the yard waste pick up will start on April 23rd and continue for 8 weeks.

Motion by Bridges to adjourn the meeting, second by Tobin, all in favor, motion carried. Meeting adjourned at 7:42 PM.

Respectfully Submitted,

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2015-05-11-board-meeting', 'Board Meeting — May 11, 2015', '2015-05-11', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM.

Pledge of Allegiance.

**Roll Call:** Present was Zimmerman, Majewski, Tobin, Bridges and Carey.
**Also present** was Fire Chief/County Comm. D. Majewski, Building Insp. Mantei, Zoning Admin./Lakes Dir. Carey, Deputy VanBonn, Road Comm. Lightfoot and 4 other interested persons.

---

Minutes of the 13 April, 2015 meeting approved as presented.

Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, all in favor, motion carried.

---

Commissioner Majewski gave the County report. Dispatch will be upgrading 3 computers and the body mics/cameras have been approved for purchase.

**Public Comment:** None offered.

---

Chief Majewski reported 32 rescue, 3 mutual aid and 2 fire runs for the month of April, 149 year to date.

Motion by Zimmerman to authorize a fire fund expenditure of $2,259 for the purpose of Lake Painting putting the floor epoxy on the back fire hall bay, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to approve a fire fund expenditure of $29.00 per month for Direct TV at the fire hall, second by Bridges, all in favor, motion carried.

Motion by Zimmerman to adopt resolution 051115-A, a resolution to accept for consideration, a recommendation by the supervisor for pay/wage rate for elected officials, second by Carey, roll call vote, 5 yes, resolution adopted.

Motion by Zimmerman to authorize Majewski, Zimmerman, R. Carey and Godau to attend a facilitation meeting on 15 May, 2015 regarding pending litigation and to allow $20.00 each for meals and to reimburse mileage, second by Tobin, all in favor, motion carried.

Zimmerman said that he had set this time aside on the agenda for the Schunk attorney Ed Roy, who wished to address the board. Zimmerman had set time aside last month as well. Mr. Roy has not shown up to address the board in either April or May as requested and will not be afforded any additional specific time to address the board in the future except through public comment time.

---

Motion by Majewski to approve the agreement with Hometown Decoration and Display, LLC for the holiday lighting in the downtown at $66 per ornament that includes installation and removal, second by Zimmerman, all in favor, motion carried.

The annual/budget meeting will be on 26 June, 2015 at 4:00 PM.

**Public Comment:** There were comments regarding the LGPOA Shingle Lake Pavilion Project, the Active 911, the water well at Silver Lake Park, the "blind" corner at Lake George Ave. and Park St.

Motion by Zimmerman to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 7:48 PM.

Respectfully Submitted,

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2015-06-08-board-meeting', 'Board Meeting — June 8, 2015', '2015-06-08', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM.

Pledge of Allegiance.

**Roll Call:** Present was Carey, Zimmerman, Tobin, Bridges and Majewski.
**Also present** was Zoning Admin. R. Carey, Building Insp. Mantei, Deputy Piwowar, ZBA Chair Godau, Fire Chief/County Comm. D. Majewski, and 3 other interested persons.

---

Minutes of the 11 May, 2015 regular meeting approved as presented.

Minutes of the 01 June, 2015 special meeting approved as presented.

Treasurer''s report accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, 5 yes, motion carried.

---

Zimmerman read correspondence from the CMDHD regarding public beach monitoring. In Clare County they are only testing Wilson State Park for E.coli.

Commissioner D. Majewski reported the CMDHD has requested a 5% increase. The board of commissioners is considering renting out the office area left vacant at the county building by the health department.

Zimmerman reported that he has been in discussion with the road commission regarding limestone for Whitney St. and gravel for Old State Rd. north of Mannsiding Road.

Larry Clever from Burnham and Flower, the township insurance company, reviewed the entire policy, including liability, inland marine, workers compensation and the accident and health for the fire department.

Motion by Majewski to renew the MTPP package policy, Travelers Inland Marine and Provident Public Official AD&D at a premium of $27,315.00, and renew the Terrorism Coverages and Increase Property Values by 6% (property and contents) at a premium of $228.00, total of $27,543.00, second by Zimmerman, all in favor, motion carried.

There was discussion on the fire department Provident Accident & Health policy and the Accidental Death & Dismemberment Proposal. It was decided that Chief Majewski will discuss these policies with the fire department personnel at their meeting on June 15, 2015 and report back to the board.

**Public Comment:** There was one comment offered.

---

Chief Majewski reported that Joe Snover has successfully completed and passed the FFI class. The new tanker is still on schedule for a July 01, 2015 delivery. We will be needing to replace 2 to 3 sets of turn out gear promptly after the new fiscal year on July 01, 2015. There were 49 rescue, 4 fire, and 1 mutual aid related runs for the month of May, making May 2015 the busiest month on record.

Clerk Majewski reported that she will pursue a small grant opportunity to get baby swings for each park. There is some water erosion creeping up on the swing set at the Bertha Lake Park that Dale, Dennis and Roger will evaluate. The board agreed that Clerk Majewski can pick up a couple baskets of flowers for the front yard at the township hall. Marilyn Hudson has completed the annual landscaping at the cemetery and it is beautiful.

Supervisor Zimmerman gave the Sheriff''s report, building report followed by R. Carey who gave the zoning and lakes reports. Both Bertha Lake and Shingle Lake have some Eurasian Water Milfoil, while Lake George is looking good. There will be chemical treatments. Silver Lake has been chosen for a hybrid Eurasian Milfoil study as it has never been treated with chemicals.

---

Old Business:

Motion by Majewski to authorize the building inspector to issue a certificate of occupancy pertaining to the Schultz modular home with limitations on the deck, provided that they sign and have notarized a statement that the township reserves the right to administer the zoning ordinance without compromise relative to the platform structure that is the subject of litigation and waiving liability against the township as a result of issuing the certificate of occupancy, second by Tobin, roll call vote: Carey -- yes, Zimmerman -- No, Tobin -- Yes, Bridges -- No, Majewski -- Yes, motion carried.

Motion by Zimmerman to authorize a general fund expenditure of $1636.03 for the Michigan Township Association annual dues and legal defense, second by Carey, all in favor, motion carried.

Motion by Zimmerman to accept the resignation of Brent Coates from the Planning Commission, second by Tobin, all in favor, motion carried.

**Public Comment:** There were three comments offered.

Motion by Bridges to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 8:10 PM.

Respectfully Submitted,

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2015-07-13-board-meeting', 'Board Meeting — July 13, 2015', '2015-07-13', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM.

Pledge of Allegiance.

**Roll Call:** Present was Zimmerman, Majewski, Tobin, Carey and Bridges.
**Also present** was Firefighter Witchell, Road Commissioner Lightfoot, Fire Chief/County Commissioner D. Majewski, Transit Director Pirnstill, Building Insp. Mantei, Zoning Admin. Carey, Sheriff''s Deputy Piwowar and 12 other interested persons.

---

Minutes of the 08 June 2015 meeting approved as presented.

Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, all in favor, motion carried.

**Public Comment:** There was one comment offered regarding the Friends of the Park meeting at the Shingle Lake Park.

---

Chief Majewski reported that the state had recently done the annual inspection on the MFR unit which went very well; the inspector said that it was the cleanest station in the state of Michigan. The new truck will be delivered in a few days and Joe Snover has successfully completed the Firefighter I & II course. There were 42 rescue, 2 power line related runs for the month of May, 245 runs year to date.

C. Majewski reported that the baby swing for Bertha Lake Park and Silver Lake Park are due in this week and that the plan for Bertha Lake Park should be ready for the August meeting for the board''s consideration.

Deputy Piwowar showed those present the new body mic/cameras.

Motion by Zimmerman to approve a general fund expenditure of not to exceed $1550.00 for the purpose of purchasing a new mower deck for the Kubota, second by Tobin, all in favor, motion carried.

**Public Comment:** There were 4 comments offered regarding having the deputy out in the Silver Lake area more often; enforcing the golf cart laws; calling dispatch to report a problem and compliments to the Marine Division for a job well done.

Motion by Zimmerman to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 7:44 PM.

Respectfully Submitted,

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2015-08-10-board-meeting', 'Board Meeting — August 10, 2015', '2015-08-10', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM.

Pledge of Allegiance.

**Roll Call:** Present was Zimmerman, Carey, Bridges, Tobin and Majewski.
**Also present** was Lakes Dir. R. Carey, Building Insp. Mantei, Road Comm. Lightfoot, Fire Chief/County Comm. D. Majewski, Sheriff''s Deputy Piwowar and 6 other interested persons.

---

Minutes of the 13 July 2015 meeting approved as presented.

Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, 5 yes, motion carried.

---

Zimmerman reported on the invasive species Giant Hogweed. The plant can grow to 12 feet in height and has been compared to Queen Anne''s Lace. Coming in to contact with the plant can cause serious reactions, such as blisters.

Commissioner Majewski reported that the annual Household Hazardous Waste collection is on September 16, 2015 from 10:00 AM until 2:00 PM at the Northern Oaks facility in Harrison.

Road Commissioner Lightfoot reported that the chip sealing in the county is underway and that a portion of Bringold in Lincoln Township was down and that they would be back out in a week or so to seal it.

**Public Comment:** None offered.

---

Chief Majewski reported that the new tanker is here and in service. It is a beautiful piece of apparatus and he thanked the citizens for their support in this project. There were 31 rescue, 3 fire, and 23 power line related runs for the month of July, 270 runs year to date.

Motion by Zimmerman to adopt the Driving Authorized Emergency Vehicles Policy as presented, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to authorize Zimmerman to sign the contract for the Whitney St. limestone project at a cost of $4800.00, second by Carey, all in favor, motion carried.

Motion by Zimmerman to authorize Zimmerman to sign the contract for the Old State Rd. gravel project at a cost of $60,069.00, second by Carey, all in favor, motion carried.

---

Motion by Majewski to approve a general fund expenditure of not to exceed $550.00 for the purpose of purchasing a weather proof message display case to be mounted upon the cemetery maintenance building for display of the cemetery rules/ordinance, second by Zimmerman, all in favor, motion carried.

Motion by Zimmerman to authorize the clerk to pay the balance due of $1783.00, second by Tobin, all in favor, motion carried.

**Public Comment:** Comments were made regarding the length of boats and speed limits on Lake George, golf cart and ATV rules and having a drop box at the hall.

Motion to adjourn the meeting by Bridges, second by Tobin, all in favor, meeting adjourned at 7:52 PM.

Respectfully submitted,

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2015-09-14-board-meeting', 'Board Meeting — September 14, 2015', '2015-09-14', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM.

Pledge of Allegiance.

**Roll Call:** Present was Supervisor Zimmerman, Clerk C. Majewski, Treasurer M. Carey, Trustee Bridges, Trustee Tobin.
**Also present** was Zoning Admin. Carey, Building Insp. Mantei, Firefighter Witchell, Zoning Brd. Chair Godau, Deputy Piwowar, Fire Chief/County Comm. D. Majewski and 7 other interested persons.

---

The Minutes of the regular monthly meeting on 10 August, 2015 were approved as presented.

The Treasurer''s report was approved as presented.

Moved by Bridges, seconded by Tobin to approve the monthly bills for payment, roll call vote, motion carried.

---

Zimmerman read correspondence regarding the annual children''s visit with Santa (Dec. 13, 2015) and Halloween Trunk or Treat and Fire Hall Halloween Open House (Oct. 31, 2015); a sea wall permit for the Verhelle''s at 1748 Lake Dr.; legislation regarding banning the Sky Lanterns; and an annual report submitted by Connie Tuck of the Hamlin Recreational Committee.

Commissioner D. Majewski gave the County report including that the Days Inn in Clare is now a homeless Veterans shelter with room for 200+ individuals. The Sheriff''s Dept. will be holding an auction on September 26 at 10:00 AM.

**Public Comment:** There was one comment offered regarding the household hazardous waste drop off.

---

Chief D. Majewski reported that the fire department has a new member, Shannon Barry. Shannon comes to Lincoln Township from Garfield Township and is Fire Fighter I and II trained as well as having her Medical First Responder License. There were 43 rescue, 2 power line related runs for August, 302 runs year to date.

Clerk Majewski reported that there had been damage done to the Loon sign at the Shingle Lake Park and that the 5 year review of the park grant is almost complete.

There were 8 Zoning permits issued, 12 ordinance violations including noise, dogs and off premise signs; and there were 7 building permits issued for the month of August.

---

Moved by Zimmerman to approve the use of the Luke Hamlin Field by the Hamlin Recreation Committee for "Luke''s Spook House" on Oct. 16 & 17 and 23 & 24, 2015 at 7-10 PM, seconded by Tobin, motion carried.

Moved by Carey to approve the purchase of a drop box for the township hall at a cost of $284.93, seconded by Tobin, motion carried.

Zimmerman presented a check from the Bertha Lake Property Owners Association for the annual Children''s visit with Santa.

The fall leaf pickup will be starting soon. Get your leaves out early as there is an end date which is yet to be determined by American Waste/Lincoln Sanitation. Leaves put out late will sit all winter and be a soggy mess for the property owner. Paper bagged leaves can also be taken to the compost field on Wednesday, Friday and Sunday 9:00 AM to Noon. The compost field will be closing for the season on Sunday November 22, 2015.

**Public Comment:** There was one comment offered about the light at Silver Lake Park.

Moved by Bridges to adjourn the meeting, seconded by Tobin, motion carried, meeting adjourned at 7:42 PM.

Respectfully Submitted,

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2015-10-12-board-meeting', 'Board Meeting — October 12, 2015', '2015-10-12', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM.

Pledge of Allegiance.

**Roll Call:** Present was Carey, Bridges, Tobin, Zimmerman and Majewski.
**Also present** was Deputy Dawson, Zoning Admin. R. Carey, Fire Chief/County Commissioner D. Majewski, Road Commission Chair Lightfoot, Building Inspector Mantei and 5 other interested persons.

---

Minutes of the 14 September, 2015 regular meeting approved as presented.

Treasurer''s report was accepted as presented.

Motion by Bridges and seconded by Tobin to pay the monthly bills, roll call vote, 5 yes, motion carried.

---

Zimmerman presented correspondence regarding a MDEQ permit for a seawall at the William Harvey residence.

Commissioner Majewski reported on a new telephone application that would alert users about situations such as weather warnings and road closures. It was agreed that we should have more information on the topic. Commissioner Majewski learned that Verizon is putting a tower in Freeman Township.

Road Commissioner Julie Lightfoot gave an update on the line striping in Lincoln Township -- this project is complete. Julie informed us that there is some extra money available from the state for projects next year and Arthur Rd., Finley Lake Ave., and Jefferson are being recommended for chip seal. In addition, if citizens are aware of a sign that is in bad shape, bullet riddled, faded color, let Supervisor Zimmerman or Julie Lightfoot know the location.

**Public Comment:** None offered.

---

Chief Majewski reported that Fire Fighter Snover is scheduled to attend Medical First Responder Training. There were 26 rescue and one fire related runs for September, 329 year to date.

Clerk Majewski reported that Fleming Marine is scheduled to evaluate the leaning pylon on the fishing platform at Shingle Lake Park and the beach erosion at the Bertha Lake Park. They will give us a plan and estimate for repairs.

Deputy Dawson gave a report on the recent home invasions and breaking and entering''s in the Silver Lake area. Two suspects have been arrested and are lodged at the Clare County Jail. Dawson reported that the ORV enforcement is a priority and they are working on keeping the youngsters off of the roads in golf carts.

---

Motion by Zimmerman to approve a general fund expenditure of $75.00 plus mileage for Zoning Administrator R. Carey to attend a MAP workshop on Shoreline Master Planning on November 18, 2015, second by Tobin, all in favor, motion carried.

Motion by Carey to approve a general fund expenditure of $75.00 plus mileage for Tami McCaslin and any other Planning Commissioner member to attend a MAP workshop on Shoreline Master Planning on November 18, 2015, second by Tobin, all in favor, motion carried.

The Halloween Spook House at the Hamlin Field will be on Oct. 16 & 17; and Oct. 23 & 24, 7 PM to 10 PM. The annual Trunk or Treat at the Township Hall will be on Oct. 31 from 5:30 PM to 6:30 PM.

The board discussed the recent offer from the Clare County Road Commission on matching funds available for chip seal or gravel projects for 2016. With regard to the chip seal, we understand that the road commission intends to do a section of Arthur Rd., from Cedar Rd., south on Finley Lake Rd., to Jefferson and then Jefferson to Old State with the extra funding awarded by the state. It was a consensus that Lincoln Township would like our project to be chip seal south on Old State, two miles to Adams Rd.; and this would be the project where we would take advantage of the $20,000 in matching funds. For graveling in 2016, we would like Browns Rd. from Hemlock to Hazel Trl., (just beyond and east of the railroad tracks). This is a distance of approximately 2.5 miles.

American Waste will be starting the fall leaf pick up soon!

Supervisor Zimmerman gave several legislative updates regarding speed limits, medical marijuana, WOTUS, rental inspections and invasive species.

**Public Comment:** 3 comments were offered regarding the light at Silver Lake Park, the removal of the dock at the public boat launch on Lake George and the improved sight at the corner of Lake George Ave. and Park St. since the no parking area was designated.

Motion by Bridges to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 7:48 PM.

Respectfully Submitted,

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2015-11-09-board-meeting', 'Board Meeting — November 9, 2015', '2015-11-09', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM.

Pledge of Allegiance.

**Roll Call:** Present was Majewski, Zimmerman, Carey, Bridges, Tobin.
**Also present** was Building Insp. Mantei, Zoning Admin. Carey, Fire Chief Majewski, Sheriff Deputy Dawson and 6 other interested persons.

---

Minutes of the 12 October 2015 meeting approved as presented.

Minutes of the 30 October 2015 elections commission approved as presented.

Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll vote, 5 yes, motion carried.

---

Correspondence: Bulkhead permit was received of the Foley property.

County Commissioner D. Majewski reported that there will be an event at the Freedom Park across from the Court House on Veterans Day honoring our veterans at 11:00 AM. He also reported that the Board of Commissioners had promoted Lori Ware to Community Services Director. She will be handling special projects, grants, and county building improvements, as well as the building department and Senior Services.

**Public Comment:** There were two comments offered on roads and street lights.

---

Fire Chief Majewski reported that there were 32 rescue and 1 fire related runs for the month of October; 373 year to date.

Deputy Dawson educated everyone on the credit card skimmers used at gas stations. Dawson also reported that a female had been arrested in the Township for methamphetamine possession.

Motion by Zimmerman to adopt resolution number 110915-A, a resolution regarding the Consumers Energy street lighting work agreement, second by Tobin, roll call, all in favor, resolution adopted.

Motion by Zimmerman to adopt resolution number 110915-B, a resolution regarding amendments to the retirement plan to comply with law, at no cost to the township, second by Bridges, roll call, all in favor, motion carried.

---

Announcements: The annual Trunk or Treat was attended by 135 children and the Fire Department Open House was attended by 100 individuals. The fall yard waste pick up will be until December 3rd.

**Public Comment:** Deputy Dawson said that it is not wise to drive through the piles of leaves along the road as they have been getting reports of bricks and other vehicle damaging items being "hidden" in the piles.

Motion by Bridges to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 7:48 PM.

Respectfully Submitted,

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2015-12-14-board-meeting', 'Board Meeting — December 14, 2015', '2015-12-14', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM.

Pledge of Allegiance.

**Roll Call:** Present was Zimmerman, Carey, Tobin, Majewski. Absent and excused was Bridges.
**Also present** was Fire Chief/Commissioner Majewski, Zoning Admin./Lakes Director Carey, Sheriff''s Deputy Dawson, Road Comm. Lightfoot, Building Insp. Mantei, ZBA Chair Godau, County Clerk Mayfield and 3 other interested persons.

---

Minutes of the 09 November, 2015 regular meeting accepted as presented.

Treasurer''s report was accepted as presented.

Motion by Zimmerman to pay the monthly bills, second by Tobin, roll call vote, 5 yes, motion carried.

---

Julie Lightfoot reported on the recent article in the paper that said that there wouldn''t be plowing on the weekends; she said that the road commission will be plowing on weekends. Lightfoot also reported that the legislation regarding increasing the vehicle registration fees passed and those fees shall increase 20% starting in 2017. There was discussion on possible legislation regarding Amish buggy safety, the carbide horse shoes and wagon wheels damaging roadways.

**Public Comment:** None offered.

---

Fire Chief Majewski reported that there is one applicant to the department, pending background and physical, he hopes to add Corey Fulger to the roster. Fulger comes to Lincoln Township fully trained with FF I & II and an MFR license. There were 20 rescue, 4 fire, and 1 mutual aid related runs for November, 410 year to date.

Deputy Dawson explained that there has been some trouble with trespassers on the pipeline property. He wanted to inform everyone that there is no trespassing on the gas company property for any reason including "just going for a walk". Officials from the gas company have told law enforcement to cite all trespassers. Dawson also added to the Amish buggy issue explaining the difficulty he has had with identification, and contacting family if there is an accident.

County Clerk Mayfield reported on the legislation to abolish straight ticket and no reason absentee voting. She also reported that there will no longer be a gun board and concealed weapons permits will continue to be issued through the clerk''s office. Mayfield is working on programming for a fraud alert system through her office.

---

Zimmerman explained that there has been a complaint regarding the in home business, ABD Detailing, operated by Adam and Betty Nolen. The Zoning Administrator has taken in to consideration that the new Zoning Ordinance is nearing completion within the next few months and the property in question will likely conform at that time and has decided to allow an extension to this until such time as the Board approves the new Zoning Ordinance. The board, by consensus, agrees and turned the issue over to the Zoning Administrator for appropriate resolution, as the Township Board does not interrupt the Zoning Ordinance.

Motion by Zimmerman to object to the transfer back to the Township 4 parcels located in the White Birch Lakes: 010-740-776-00, 010-746-009-00, 101-746-213-00 and 010-746-295-00, second by Carey, all in favor, motion carried.

Motion by Zimmerman to approve a general fund expenditure of not to exceed $250.00 for the purpose of purchasing a printer for the clerk''s office, second by Tobin, all in favor, motion carried. (Note that the printer approved in the previous fiscal year was not purchased)

Clerk Majewski reported on the annual Children''s visit with Santa held on December 13, 2015. The party was attended by approximately 140 children plus adults.

Motion by Zimmerman to appeal case number 2014-900525-AA, in the matter of Schultz v Lincoln Township Zoning Board of Appeals, second by Tobin, roll call vote, Zimmerman -- yes, Tobin -- yes, Carey -- no, Majewski -- no, motion failed.

---

Announcements: Board of Review will meet on December 15, 2015 at 6:00 PM for the purpose of Late Principle Exemption Requests, and certain other exemption requests. This meeting is not for appealing Property Tax Assessments.

**Public Comment:** There were 3 comments offered. Godau wished everyone a Merry Christmas and a Happy New Year and thanked the board and township employees for their service.

Motion by Carey to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 8:17 PM.

Respectfully Submitted,

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2016-01-11-board-meeting', 'Board Meeting — January 11, 2016', '2016-01-11', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM.

Pledge of allegiance.

**Roll Call:** Present was Zimmerman, Majewski, Carey, Bridges and Tobin. **Also present** was Building Insp. Mantei, Fire Chief/County Comm. D. Majewski, Sheriff Wilson, Deputy Bolander, Zoning Admin. R. Carey, 911 Director Brubaker, Firefighter Englehardt and 19 other interested persons.

Minutes of the 14 December 2015 regular meeting approved as presented.

Treasurer''s report was accepted as presented.

Motion by Bridges to approve the monthly bills, second by Tobin, roll call vote, 5 yes, motion carried.

Zimmerman read correspondence from Charter Communications regarding a price adjustment/increase and reviewed one sea wall permit.

Commissioner D. Majewski gave the County report including a recent presentation by I.T. Right that the Board of Commissioners is considering; there is an opening for a deputy treasurer in Jenny Beemer-Fitzinger''s office and the Board of Commissioners has approved a sliding fine scale for those who do not get proper mechanical, electrical and plumbing permits.

Tom Brubaker gave a report on 911 and the surcharge ballot request that will be on the March 8, 2016 ballot.

**Public Comment:** None offered.

Chief Majewski gave the fire department report. Korey Fulger has passed the required vetting and was suited up on 1/11/2016. There were 27 rescue, 3 fire, and 2 mutual aid related runs for December, 425 runs for 2015.

---

New Business:

Chief Majewski reported that the 1997 rescue unit had been taken in for a vibration in the front end and the brakes needing replacement. When the vehicle was inspected at McGuire Chevrolet it was found that the A-Arms are 70% rotted as well as the supporting structure around the gas tank. Repair estimate is $10,000 for a new frame. The vehicle is not safe to drive at this point. Discussion about repairs or purchasing a new or used vehicle transpired. Chief Majewski has gotten quotes for new vehicles from Benchley Bros. and High Point. The range is $47,000 to 51,000, plus approximately $6000 for CSI to transfer the lights, radios, and compartment box.

Motion by Zimmerman to authorize the purchase of a GMC Yukon for $47,000 the purpose of replacing the 1997 rescue unit, second by Bridges, all in favor, motion carried.

Clerk Majewski and Treasurer Carey shall meet in the near future to review the fire fund budget.

Motion by Zimmerman to adopt resolution number 011116-A, a resolution giving the clerk authority to seek and enter in to an agreement for a loan or grant for a rescue replacement vehicle, second by Tobin, roll call vote, 5 yes, resolution adopted.

The board shall meet again for finalizing the purchase of a replacement rescue vehicle.

**Public Comment:** There was one comment offered.

Motion by Bridges to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 7:36 PM.

---

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2016-01-18-special-meeting', 'Special Meeting — Law Budget/Fire Department Rescue Unit — January 18, 2016', '2016-01-18', 'Special Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 10:18 AM.

**Roll Call:** Present was Zimmerman, Carey, Bridges, Tobin and Majewski.
**Also present** was Fire Chief Majewski and Assistant Fire Chief Cogswell. Invited and absent -- Sheriff Wilson and Undersheriff Miedzianowski. One other interested person present.

---

Clerk Majewski reviewed the minutes of 12 May 2014 meeting with Miedzianowski where the impact of the pipeline depreciation factor was explained to him by Treasurer Carey. Revenue in the law fund would be decreasing by approximately $16,000; going from $128,000 in 2013 to $112,000 in 2014. At that time it was agreed that Miedzianowski would utilize less senior officers in Lincoln Township in order to conserve funds and the Township would apply $5000 in retained earnings to keep the coverage at the current level for 2014/2015. The board would be considering total law budget expenditures for the 2014/2015 year of $117,000; that amount being comprised of the estimated $112,000 in tax revenue and an additional $5000 in retained earnings.

By consensus the board agreed that a letter shall be drafted to the Sheriff in regards to the budget constraints and that this board has decided that in order for Lincoln Township to stay within the budgeted amount for 2015/2016 the Sheriff will not be able to provide services in excess of $7958.35 for the months of February, March, April, May and June and that the anticipated amount to be budgeted for the 2016/2017 year will not exceed $9400.00 per month in services. Zimmerman will work on an updated contract. Suggestions for the contract are that it is in one year increments, that it does not renew automatically, that the annual amount be in monthly installments that are the same each month and that we meet with the Sheriff at least bi-annually.

---

The replacement rescue unit was discussed. The original 2015 GMC Yukon vehicle quoted at $47,000 (for the vehicle only) by Benchley Bros. in Clare was found to be unavailable. A 2016 GMC Yukon was quoted at $49,966.71, plus $6500.00 for CSI to do the equipment changeover and $500.00 for incidentals (floor mats, mud flaps, etc...) for a total of $56,966.71.

Motion by Zimmerman to approve a fire fund expenditure of $56,966.71 for the purchase of and equipping the 2016 GMC Yukon from Benchley Bros. in Clare, second by Tobin, all in favor, motion carried.

---

**Public Comment:** None offered.

Motion by Zimmerman to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 11:05 AM.

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2016-02-08-board-meeting', 'Board Meeting — February 8, 2016', '2016-02-08', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM.

Pledge of Allegiance.

**Roll Call:** Present was Zimmerman, Majewski, Carey, Bridges and Tobin. **Also present** was Building Insp. Mantei, Zoning Admin. R. Carey, Fire Chief/County Comm. D. Majewski, and 8 other interested persons.

Minutes of the 11 January 2016 regular meeting approved as presented.

Minutes of the 18 January 2016 special meeting regarding the law budget and rescue unit approved as presented.

Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, all in favor, motion carried.

Zimmerman reviewed correspondence from the MDEQ (seawall permit -- Lapworth), MDEQ regarding the compost field, and the CMDHD regarding water test procedures.

Commissioner Majewski reported that the County is still considering options for IT at the County and that the County Treasurer was in the process of interviewing for the open position.

**Public Comment:** None offered.

Chief Majewski reported that the new rescue unit is in service and still needs the identification stripping and stickers. New firefighter, Korey Fulger has passed physical and background and has been geared up. There were 26 rescue, 2 fire, 2 power line and 1 mutual aid related runs for January, 41 year to date.

Motion by Zimmerman to reappoint Kim Hamilton, Tami McCaslin and Gary Szczepanski to the Planning Commission, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to appoint Sharon Bridges to the Planning Commission, second by Carey, all in favor, motion carried.

The board affirmed Michael Tobin as liaison to the Planning Commission.

---

Motion by Zimmerman to accept the pricing, unchanged from 2015, for Michigan Chloride to brine the roads, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to adopt resolution number 020816-A, a resolution regarding the curbside rubbish pickup annual per household cost from $130.00 to $140.00, second by Carey, roll call vote, 5 yes, resolution adopted.

Motion by Zimmerman to re-appoint Tom Godau to the ZBA, second by Bridges, all in favor, motion carried.

Motion by Zimmerman to approve a general fund expenditure of not to exceed $250.00 for the purpose of notary bonds for the clerk and treasurer, second by Tobin, all in favor, motion carried.

There was one utility bill for the cemetery that is yet unreceived.

Motion by Zimmerman to pay the remainder of the utility bills (consumers energy-cemetery) when it arrives, second by Tobin, all in favor, motion carried.

**Public Comment:** There were several comments offered regarding the brining chemical, how many times we brine, sea wall permits and marine patrol.

Motion by Zimmerman to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 7:42 PM.

---

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2016-02-08-election-commission', 'Election Commission — February 8, 2016', '2016-02-08', 'Election Commission', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:42 PM.

**Roll Call:** Present was Zimmerman, Majewski and Carey.

Motion by Zimmerman to appoint Sheryl Judd (D), Deb Sherrod (D), Tina VanDyke (D) and Patt Lambert (R) as election inspectors for the March 08, 2016 Presidential Primary Election.

**Public Comment:** None offered.

Motion by Carey to adjourn the meeting, second by Zimmerman, all in favor, meeting adjourned at 7:43 PM.

---

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2016-03-14-board-meeting', 'Board Meeting — March 14, 2016', '2016-03-14', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM.

Pledge of Allegiance.

**Roll Call:** Present was Zimmerman, Majewski, Carey, Bridges and Tobin. **Also present** was Fire Chief/County Comm. D. Majewski, Building Insp. Mantei, Lakes Dir./Zoning Admin. R. Carey, Road Commissioner J. Lightfoot, ZBA Chair Godau, ZBA Secretary Englehardt, and 3 other interested persons.

Minutes of the 08 February 2016 regular meeting approved as presented.

Minutes of the 08 February 2016 election commission approved as presented.

Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, all in favor, motion carried.

Zimmerman read correspondence from the DEQ regarding the Fry/Beers seawall permit and read a letter from DTE regarding rate adjustments.

Commissioner Majewski said that the County will be doing LED lights at the County Building and that the North elevator will be getting some much needed repairs. He also said that the airport will be getting some runway repairs.

Road Commissioner Lightfoot explained the recent road closures in the County which are primarily due to the spring thaw causing deep ruts and mud so deep as to make roads impassable.

**Public Comment:** None offered.

Fire Chief Majewski reported 25 rescue, 2 fire, 3 powerline and 1 mutual aid related runs for February, 80 runs year to date.

Mike Tobin reported that the next regular planning commission meeting will be on 12 April 2016 and the Land Plan Zoning Ordinance meeting will be on 20 April 2016.

Motion by Zimmerman to approve the Clare County Road Commission Agreement regarding the gravel projects on Browns Road at a cost of $94,131.00 and Monroe Road at a cost of $38,448.43, second by Tobin, all in favor, motion carried.

---

Motion by Majewski to refund the hall use maintenance fee of $125.00 to Tammy Navarro due to the severe plumbing failure at the Township Hall during her event, second by Zimmerman, all in favor, motion carried.

Motion by Zimmerman to approve the annual maintenance contract with 1st Rate Office Systems for the Sharp AR 201 Copier, aka the upstairs copier, in the amount of $300.00, second by Tobin, all in favor, motion carried.

**Public Comment:** None offered.

Motion by Bridges to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 7:29 PM.

---

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2016-04-11-board-meeting', 'Board Meeting — April 11, 2016', '2016-04-11', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM.

Pledge of Allegiance.

**Roll Call:** Present was Zimmerman, Majewski, Carey, Bridges. Absent/excused, Tobin. **Also present** was County Clerk Mayfield, Fire Chief/County Comm. D. Majewski, Zoning Admin. R. Carey, Building Insp. Mantei, Undersheriff Midge, and 20 other interested persons.

Minutes of the 14 March 2016 regular meeting approved as presented.

Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills, second by Zimmerman, roll call vote, 4 yes, motion carried.

Zimmerman read correspondence regarding the state wide tornado warning test. Zimmerman also read a letter from Consumer Energy and he explained the "smart meters" mentioned. He also commented on having had conversation with Harmony Nowlin about natural gas service for White Birch, Bertha Lake and Cedar Ave. He has sent maps to DTE Energy.

County Commissioner D. Majewski reported that there will be a meeting at the Road Commission on May 11th at 2:00 PM and again at 7:00 PM for the purpose of Construction Program Overview, past, present and future. Majewski also reported that the county is entering in to an Airport Authority with the City of Harrison and Hayes Township.

County Clerk Pam Mayfield reported on the new elections equipment that will be rolling out in 2017 to replace the current 14+ year old equipment. She encouraged citizens who wish to vote absentee to be proactive and get their application in to their clerk as soon as possible and return ballots in a timely manner. Most clerks in the county are experiencing significant delays with mail. This year there is a May 3rd election, August 2nd primary and a November 8th General. Mayfield also encouraged citizens to consider signing up for the Property Fraud Alert at www.pfa.us.landrecords.com.

**Public Comment:** There were 2 comments offered, one on the Health Fair and one regarding voting precincts.

Fire Chief Majewski reported 35 rescue and 5 power line related runs for March 2016. There are 3 new applicants pending for the fire departments. The new rescue unit is in service. The chief reminds everyone to get burn permits before burning.

---

Motion by Zimmerman to adopt resolution number 041116-A, a resolution regarding "Mary''s Lane" recognizing it as a private road, for the Master Street Address Guide, second by Bridges, roll call vote, all in favor, resolution adopted.

Motion by Zimmerman to adopt resolution number 041116-B, a resolution regarding Internet Banking with Isabella Bank, second by Bridges, roll call vote, all in favor, motion carried.

Motion by Zimmerman to renew the Equalization Contract, second by Carey, all in favor, motion carried.

Motion by Zimmerman to refund Charles Sterner $450.00 for a withdrawn ZBA fee, second by Bridges, all in favor, motion carried.

Jan Penton reviewed the Expo being held on Saturday June 18th. There will be a car show and bike corner, raffle, vendors, hot dogs, and the fire department will be bringing the Smoke House.

Motion by Zimmerman to approve a general fund expenditure of $202.00 plus mileage for the purpose of the Clerk and Deputy Clerk attending an MTA conference in Mt. Pleasant on 12 May, 2016, second by Carey, all in favor, motion carried.

Motion by Zimmerman to approve a general fund expenditure of $228.00 plus shipping for the purpose of purchasing 6 looper tubes and chain (traffic control stanchions) for elections precinct organization, second by Bridges, all in favor, motion carried.

Announcements: Zoning Board of Appeals annual meeting will be 13 April, 2016 at 7 PM. Public test of election equipment will be 14 April, 2016 at 5 PM. Planning Commission Land Plan Zoning Initiative meeting will be 20 April, 2016 at 10 AM.

**Public Comment:** Mark Lightfoot read a letter that he had written to the board on 28 March, 2016 regarding law enforcement in Lincoln Township. Undersheriff Midge commented on the department''s practices and procedures. There was positive comment on the Monroe Road gravel project and the boater''s safety class being on June 25th this year.

Motion by Bridges to adjourn the meeting, second by Zimmerman, all in favor, meeting adjourned at 8:30 PM.

---

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2016-05-09-board-meeting', 'Board Meeting — May 9, 2016', '2016-05-09', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM.

Pledge of Allegiance.

**Roll Call:** Present was Zimmerman, Carey, Majewski, Tobin and Bridges. **Also present** was County Commissioner D. Majewski, Zoning Admin. R. Carey, Building Insp. Mantei, Sheriff John Wilson, Lt. Ed Williams, Deputy Binger, and 15 other interested persons.

Minutes of the 11 April 2016 meeting approved as presented.

Minutes of the 28 April 2016 special meeting approved as presented.

Minutes of the 11 April 2016 election commission meeting reviewed.

Treasurer''s report was received as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, 5 yes, motion carried.

Zimmerman reviewed correspondence from Consumers, Clare County Road Commission and Sheriff''s Dept.

**Public Comment:** One comment offered regarding lake treatment.

Chief Majewski reminded everyone that you must get a burn permit at the state wide permit line. Tickets are being issued and the DNR is billing if they have to come out to help stop a fire. Lincoln Township welcomes a new fire fighter, Janeen Johnson. The fire department recently hosted continuing education for area Medical First Responders.

Mike Tobin said that he has identified 25 of the 193 unmarked burials at the cemetery. The 193 burials were located by sonar; Mike has been digging through old records to match up the spots with a person/family.

Sheriff John Wilson thanked the fire department for their assistance at the recent armed standoff on Jefferson. The Sheriff''s Department has added 4 new members to the dive team. There will be a special tribute to Law Enforcement Officers in honor of Law Enforcement Week. The event will take place on May 20, 2016 at the Sheriff''s Department at 9:00 AM. Everyone is invited. The Marine Safety class will be held at the Lincoln Township Hall on 25 June, 2016 from 9:00 AM to 3:00 PM. Preregistration is required, lunch is provided. Register at the Lake George Depot or with the CCSD.

---

The first road brining will be on or about 19 May, 2016 and then again before the July 4th holiday and Labor Day holiday.

Motion by Zimmerman to adopt resolution number 050916-A, a resolution regarding freezing the wages of elected officials, second by Tobin, roll call vote, 5 yes, resolution declared adopted.

The Lincoln Township Board will hold the annual meeting and budget hearing on 24 June, 2016 at 5:00 PM.

The Neighborhood Watch Expo will be on 18 June, 2016.

The Silver Lake Property Owners Meeting will be on 28 May, 2016 at the Silver Lake Park at 10:00 AM.

The Bertha Lake Property Owners Meeting will be on 28 May, 2016 at the Twp. Hall at 11:00 AM.

The Lake George/Shingle Lake Property Owners Meeting will be on 29 May, 2016 at the Twp. Hall at 10:00 AM.

**Public Comment:** Several comments offered on smaller truck for the tight areas for brining, parks, Verizon tower, and seasonal activities for kids.

Motion by Bridges to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 7:52 PM.

---

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2016-06-13-board-meeting', 'Board Meeting — June 13, 2016', '2016-06-13', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM.

Pledge of Allegiance.

**Roll Call:** Present was Zimmerman, Majewski, Tobin and Bridges. Absent excused, Carey. **Also present** was Zoning Admin R. Carey, Fire Chief/County Commissioner D. Majewski, Building Insp. Mantei, and 10 other interested persons.

Minutes of the 09 May, 2016 meeting approved as presented.

Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, 4 yes, motion carried.

Commissioner D. Majewski reported that the space vacated by the Health Department is being renovated. It will be utilized for County offices such as the Administrator, I.T. and the Emergency Manager. The roof project is complete on the main court house.

**Public Comment:** There were several comments regarding horses in the park, a two year old alone in the park, a Pitbull biting someone just outside the park entrance. Tammy McCaslin introduced the SLPOA President, Dave Chatfield.

Chief D. Majewski reported on the recent power outages and lines down on Arbor Dr. and that he has sent an invoice to Consumers for the fire department expenses.

Motion by Zimmerman to accept the Shingle Lake Park Pavilion Project as presented by LGPOA representatives Rolf Hudson and Merle Harmon. The Lake George Property Owners Association will hire Pioneer Pole Buildings, Inc. to erect a 24X32X10 Pavilion with Enclosed Gable and vented eave overhang over the existing pad. The expense of $7120.00 to be paid by the LGPOA, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to remove the unapproved memorial that has been erected to a deceased individual at the Bertha Lake Park, and that the Township adopt a policy that such memorials not be allowed in the Township Parks, second by Bridges, all in favor, motion carried.

Motion by Zimmerman to cast our vote for Earl for the Michigan Township Participating Plan Board of Directors, second by Bridges, all in favor, motion carried.

---

Motion by Zimmerman to approve the chip and seal project, Arthur and Jackson to Cedar and Finley Lake, Old State from Jefferson to Township line at a cost of $146,330.00, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to adopt resolution number 161316-A, a resolution regarding the First Right of Refusal on foreclosed properties, and to decline the purchase of any properties as presented by the County Treasurer, second by Tobin, roll call vote, 4 yes, motion carried.

Motion by Majewski to approve a fire fund expenditure for the firefighters Provident Policies; Accident and Health and Accidental Death and Dismemberment, for 2016/2017, in the amount of $4927.00, second by Zimmerman, all in favor, motion carried.

Motion by Majewski to approve a dual fund expenditure of $5252.00 (General Fund: $1996.00 and Fire Fund: $3256.00) for the workers compensation policy for 2016/2017, second by Zimmerman, all in favor, motion carried.

Motion by Majewski to approve a dual fund expenditure of $29,743.00 (General fund: $11,302.00 and Fire Fund: $18,441.00) for the property and liability insurance renewal for 2016/2017, second by Zimmerman, all in favor, motion carried.

Next road Brining will be 24 June, 2016. Township Annual Meeting is 24 June, 2016 at 5PM, Marine Safety class is 25 June, 2016 at 9AM to 3PM.

**Public Comment:** Two comments offered regarding the parades and FDIC.

Motion by Tobin to adjourn the meeting, second by Majewski, all in favor, meeting adjourned at 7:52 PM.

---

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2016-07-11-board-meeting', 'Board Meeting — July 11, 2016', '2016-07-11', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM.

Pledge of Allegiance.

**Roll Call:** Present was Majewski, Carey, Zimmerman, Bridges and Tobin. **Also present** was Building Insp. Mantei, County Comm./Fire Chief D. Majewski, Zoning Admin./Lakes Dir. R. Carey, 18 other interested persons.

Minutes of the 13 June 2016 regular meeting approved as presented.

Treasurer''s report accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, 5 yes, motion carried.

Zimmerman read correspondence from Tara Hovey, Consumers Energy, and the Health Department.

Commissioner Majewski reported on the County budget process.

Zimmerman reported on behalf of Road Commissioner Julie Lightfoot.

Tom Pirnstill reported on the Transit. All vets ride for a $1.00, over age 80 ride for free with the VIP Gold Card.

**Public Comment:** 1 comment offered on the wash out on Ojibway.

Chief Majewski reminds everyone to call for your burn permit; and campfires are allowed in a ring/pit. He suggests one foot deep, 1 foot tall ring type barrier, such as stone, brick or metal ring. There were 35 rescue, 2 power line and 1 fire related runs for June.

Rolf Hudson gave a report on the Shingle Lake Park Pavilion Project. The LGPOA received a grant in the amount of $3000.00 from the Friends of Parks and Recreation to go towards the project. A post for tying boats to at the launch at Shingle was suggested. A hitching post is planned for our Amish visitors. Signs regarding littering were suggested and buoys around the swimming area were requested. Concern about swimmers out in the lake being hit by boaters was discussed.

The board gave the clerk the go ahead to price out having natural gas piped to the kitchen for a stove.

Zimmerman reported on the Hamlin Field Committee planning several events this year, such as a 5K run, volley ball, music, clean-up day, and the spook house.

---

Absent Voter ballots are available for the August 2, 2016 primary election. Contact the clerk if you need one for either August or November at clm@lincolntwp.com or 989-588-9069. Applications also available at the hall on the table to the left of the front door.

**Public Comment:** Two comments were offered.

Motion by Bridges to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 8:18 PM.

---

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2016-09-12-board-meeting', 'Board Meeting — September 12, 2016', '2016-09-12', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM.

Pledge of Allegiance.

**Roll Call:** Present was Zimmerman, Majewski, Bridges, Carey and Tobin. **Also present** was Zoning Admin. R. Carey, Building Insp. Mantei, County Comm./Fire Chief D. Majewski and 13 other interested persons.

Minutes of the 08 August 2016 regular meeting approved as presented.

Treasurer''s report accepted as presented. Carey reported that the interest earned is up a bit.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, 5 yes, motion carried.

Zimmerman reviewed correspondence from the CCRC, the MDEQ on seawall permits for Frader and Hamilton, and from DTE regarding electric street lamp price increase. The township gets their power from Consumers.

D. Majewski reported that the county remains focused on the budget; the MSU Extension remain in the budget as well as the EMD will remain full time.

**Public Comment:** There were two comments offered; one regarding the nice road work done and one about an abandoned vehicle in the area of the rehab center.

Chief Majewski reported on the cost of the EPI pens. They cost $1200 for 2 adult and 2 child on the rig at all times. Before it became a mandate, they were $75.00 each.

There were 43 rescue, 1 fire, and 1 power line related runs for the month of August, 335 runs year to date.

Clerk Majewski reported that the repairs to the recently vandalized pump at Bertha Lake Park were $250.00.

Zoning Administrator Carey requested to attend a land division and sign trainings. These are budgeted.

Zimmerman explained that the Bertha Lake Property Owners Association wishes to increase their Special Assessment district for the control of weeds and invasive species from $110.00 per year per riparian to $120.00 per year per riparian.

---

Motion by Zimmerman to adopt resolution number 091216-A, a resolution regarding updating/revising the Lincoln Township Policy Regarding the Public Request for the Inspection of Documents, as suggested by the AMAR Audit, second by Tobin, roll call vote, 5 yes, resolution adopted.

The new gas line has been run and the new stove installed at the Township Hall by and for the Senior Services Dining Center.

The Pavilion at the Shingle Lake Park is up and beautiful. Many thanks to the Lake George Property Owners Association.

Clerk Majewski is accepting Absent Voter Applications for the November 08, 2016 Presidential Election. Please contact her at 989-588-9069 or clm@lincolntwp.com to get your application if you will be unable to attend the polls. Do this as soon as possible.

October 10, 2016 the Lincoln Township Board will host a 6 PM employee, appointee and volunteer recognition. Regular meeting to follow no sooner than 7 PM. Refreshments will be served. All are invited to attend! Come out and meet those who serve you.

**Public Comment:** Comments offered were regarding vacation rental properties, vandalized pump at Hamlin Field, street light at Monroe and Jackson, and lack of marine patrol on the lakes.

Motion by Bridges to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 7:48 PM.

---

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2016-10-10-board-meeting', 'Board Meeting — October 10, 2016', '2016-10-10', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM.

Pledge of Allegiance.

**Roll Call:** Present was Carey, Tobin, Bridges, Zimmerman and Majewski. **Also present** was Fire Chief/County Comm. D. Majewski, Zoning Admin R. Carey, Building Insp. Mantei, Superintendent of Farwell Area School Seiter, Sheriff''s Deputy Powowar, Road Comm. Lightfoot, County Comm. Pitchford and 20 other interested persons.

Minutes of the September 12, 2016 regular meeting approved as presented.

Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, 5 yes, motion carried.

Correspondence was read by Zimmerman regarding the Shaw seawall permit, the CCRC match program and the opening of the Harrison Farmers Market.

**Public Comment:** None offered.

Chief Majewski gave the fire department report with 35 rescue, 1 fire, 1 power line related runs for September, 352 runs year to date.

Clerk Majewski reported that the outhouse at the Silver Lake Park is rotting and will research replacement options in the spring.

There was discussion on the recycling proposal that Majewski sought from American Waste. Zimmerman explained that with the problems we have been having with the current program we are researching possible future options. The American Waste proposal, while free, requires a 3 year contract extension. There was no action taken and a work shop on the matter shall take place in the future.

Motion by Zimmerman to appoint Steve Bryant, Cindy Engelhardt, Joe Rentz and Roger Carey to the Board of Review for two year terms, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to appoint Marshall Swanson to the ZBA for a three year term, second by Bridges, all in favor, motion carried.

---

Announcements:

The annual Trunk or Treat will be held on 31 October, 2016 at 5:00 PM. Trunkers should be ready for treaters by 4:45 PM.

The Fire Department will be having an Open House with donuts and cider also on October 31, 2016 at 5:00 PM at the fire hall.

Luke''s Spook House is cancelled for 2016.

**Public Comment:** Many Thanks to all our employees, appointees and volunteers. There is nothing to be done with the wounded goose, the DNR advised to let nature take its course. There will be a ZBA meeting on Wednesday 12 October, 2016 at 7:00 PM.

Motion by Tobin to adjourn the meeting, second by Bridges, all in favor, meeting adjourned at 7:50 PM.

---

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2016-11-14-board-meeting', 'Board Meeting — November 14, 2016', '2016-11-14', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM.

Pledge of Allegiance.

**Roll Call:** Present was Zimmerman, Carey, Bridges, Majewski. Absent/excused: Tobin. **Also present** was County Commissioner/Fire Chief D. Majewski, Zoning Admin. R. Carey, Planning Member S. Bridges and Greenwood Township Supervisor Elect Jess McClaughry.

Minutes of the 10 October 2016 regular meeting approved as presented.

Treasurer''s report accepted as presented.

Motion by Bridges to pay the monthly bills, second by Zimmerman, roll call vote, 4 yes, motion carried.

Zimmerman reviewed correspondence from Trans Canada regarding the process of odorizing wells. There was a DEQ permit issued for shoreline protection (riprap) at the McCarty residence and a new vinyl seawall permit issued at the Beam residence.

Commissioner D. Majewski gave the County report. The IT department is using Kelly Services to fill the department''s vacancy. Jim Shuster was promoted to Director of IT.

**Public Comment:** None offered.

Chief Majewski gave the fire department report. There is a new applicant, Dan French. There will be one attending the Fire Fighter I class in Isabella County. There were 36 rescue, 2 fire, and 1 mutual aid related runs for October, 391 year to date.

Clerk Majewski gave the cemetery report: We intend to be posting for closed bid the lawn maintenance and spring and fall clean-up of the cemetery in February 2017 for consideration at our March 2017 meeting.

Motion by Zimmerman and second by Bridges to accept the annual audit as presented, all in favor, motion carried.

Motion by Zimmerman and seconded by Bridges to adopt resolution 111416-A, a resolution regarding the poverty threshold guidelines for property tax exemption, roll call, 4 yes, one absent, resolution adopted.

---

Motion by Zimmerman and seconded by Carey to adopt resolution 111416-B, a resolution regarding the objection to the transfer of foreclosed and unsold properties, roll call, 4 yes, one absent, resolution adopted.

Motion by Zimmerman and seconded by Bridges to adopt resolution number 111416-C, a resolution regarding the Clare County Hazard Mitigation Plan, roll call, 4 yes, one absent, resolution adopted.

Motion by Zimmerman and seconded by Carey to adopt resolution number 111416-D, a resolution regarding the State and Federal Funding Appropriated for the Maintenance, Repair and Improvement of Clare County Roads be retained specifically for that purpose, roll call, 4 yes, one absent, resolution adopted.

There was discussion about the letter received from Undersheriff Miedzianowski wherein he explained that the department had not utilized the monthly allotted amount of $9350.00. The monthly billing was $8805.57. He requested the difference be put forward to November 2016.

The board decided to have a workshop on November 22, 2016 at 10 AM.

Motion by Majewski to not extend the unused allocated funds for October law enforcement of $544.43 to November 2016, second by Zimmerman, all in favor, motion carried.

**Public Comment:** 3 comments were offered regarding the proposed recycling dog house, road patrol millage, and campers rubbish fee in White Birch.

Motion to adjourn the meeting by Bridges, seconded by Carey, all in favor, meeting adjourned at 7:48 PM.

---

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2016-12-12-board-meeting', 'Board Meeting — December 12, 2016', '2016-12-12', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM.

Pledge of Allegiance.

**Roll Call:** Present was Zimmerman, Majewski, Bridges, Tobin. Absent/excused Carey. **Also present** was Zoning Admin. R. Carey, County Commissioner/Fire Chief D. Majewski, Deputy Piwowar, Building Inspector Mantei and 6 other interested persons.

Minutes of the 14 November 2016 regular meeting approved as presented.

Minutes of the 22 November 2016 special workshop approved as presented.

Treasurer''s report accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call, 4 yes, motion carried.

Zimmerman reviewed correspondence from the DEQ regarding the seawall permit for Kibbey, and DTE regarding natural gas in the White Birch area.

County Commissioner D. Majewski reported that the county had appointed Michael Conway as Citizen At Large to the 911 Board. The new Chair and Vice Chair will be chosen at the County Board of Commissioners meeting in January.

Chief Majewski reported that there were 28 rescue related runs for the month of November, 424 year to date. Fire Fighters French and Jousma-Johnson will attend Fire Fighter I class in Isabella County.

**Public Comment:** None offered.

Motion by Zimmerman to appoint Deb Sorgi as alternate to the Board of Review for a 2 year term commencing 01 January 2017, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to authorize Clerk Majewski to attend the Schunk arbitration meeting on behalf of the Township on 03 January 2017 and to be reimbursed for related mileage cost, second by Bridges, all in favor, motion carried.

Road Brining for the 2017 season has been tentatively scheduled for 19 May, 27 June, and 25 August.

---

Motion by Zimmerman to acknowledge receipt of the resolution from the Planning Commission regarding the recommendation of the new Zoning Ordinance, second by Tobin, all in favor, motion carried.

The Board will hold a workshop on 10 January 2017 at 4:00 PM for the purpose of reviewing and considering the recommendations of the Planning Commission in regards to the proposed Zoning Ordinance.

The Board will meet with the Sheriff in February 2017 for the purpose of contracted services; date and time to be announced.

December Board of Review will be 13 December 2016 at 6:00 PM for late PRE''s and any errors.

**Public Comment:** There were 4 comments offered.

Motion by Bridges, second by Tobin to adjourn the meeting, all in favor, meeting adjourned at 7:18 PM.

---

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2017-01-09-board-meeting', 'Board Meeting — January 9, 2017', '2017-01-09', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM.

Pledge of Allegiance.

**Roll call present was:** Zimmerman, Majewski, Bridges, Tobin, Carey. **Also present was** Zoning Admin. R. Carey, County Commissioner/Fire Chief D. Majewski, Deputy Piwowar, Building Inspector Mantei and 7 other interested persons.

---

Minutes of the 12 December 2016 meeting approved as presented.

Treasurer''s report accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call, 5 yes, motion carried.

---

Zimmerman reviewed correspondence from the DEQ regarding the seawall permit for Eilelberg. The permit was denied.

County Commissioner D. Majewski reported that Board of Commissioners are still working on budget issues.

Rick Outman, In District (33) Liaison for Senator Judy Emmons introduced himself. He can be contacted at 989-560-3301 or rickoutman@aol.com for constituent problems.

---

**Public Comment:** R. Carey requested a copy of the Eikleberg seawall denial.

Fire Chief D. Majewski explained that the department has replaced the door jamb spreader. There were 452 runs in 2016; there have been 29 rescue, 1 powerline, 1 gas leak and 1 fire related runs for the month of December 2016.

Deputy Piwowar reported that there has been frequent shop lifting events at the Dollar General. The person/persons consume items and leave the wrappers and containers behind. A suspect has been arrested and is awaiting arraignment.

Motion by Majewski to approve the Mediation Settlement Agreement in the Lincoln Township vs. Schunk, Clare County Case No. 15-900493-CZ as presented, Second by Zimmerman, roll call revealed 5 yes, motion carried.

---

There will be a Zoning Workshop on 10 January, 2017 at 4:00 PM at the Township Hall.

The Building Inspector''s new email address is: build@lincolntwp.com

**Public Comment:** C. Englehardt requested explanation of the aforementioned Settlement Agreement. Zimmerman explained that since the matter is of a legal nature, he could make no public comment at this time.

Motion by Bridges, second by Tobin to adjourn the meeting, all in favor, meeting adjourned at 7:20 PM.

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2017-02-13-board-meeting', 'Board Meeting — February 13, 2017', '2017-02-13', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM.

Pledge of Allegiance.

**Roll call present was:** Zimmerman, Majewski, Bridges, Tobin and Carey. **Also present was** Building Insp. Mantei, Zoning Admin. R. Carey, Sheriff Deputy Piwowar and 4 other interested persons.

---

Minutes of the 09 January 2017 meeting approved as presented.

Treasurer''s report accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, 5 yes, motion carried.

---

Supervisor Zimmerman read correspondence Charter regarding price adjustments, from Consumers regarding the upcoming tree trimming and from the Clare County Road Commission regarding weight restrictions.

County Commissioner D. Majewski reported that the Board of Commissioners had elected as their Chair, Karen Lipovsky and Vice Chair Jack Kleinhardt. It was also reported that there was an increase in Gypsy Moth egg masses noted in Freeman and Hayes Township.

---

**Public Comment:** Inquiry regarding the possibility of putting a guard rail across from J&D Market at the hill where it washes out.

Fire Chief D. Majewski reported that the spring time is expected to be dry and he reminds everyone to be sure and get your burn permits. There were 36 Rescue, 3 fire, 1 power line and 1 gas leak related runs for January.

Motion by Zimmerman to grant an extension to 01 May 2017 to Faust and Neill to become in compliance with the zoning ordinance, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to approve the gravel projects for the Silver Lake area: Maple Street, Woodland Walk, Lincoln Rd. and South Street at a cost of $13,525.00, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to approve the new building permit fee schedule as presented, effective 13 February 2017, second by Bridges, all in favor, motion carried.

---

There was discussion on the letter recently received from the MDEQ regarding the compost field being out of compliance. The Township needs to come up with a plan that encourages the reduction of onsite compostable materials by 75% that was on site at the beginning of the calendar year.

There was discussion regarding the Canoe Subdivision private series of roads and the maintenance that the township is able to provide. Currently there is a special assessment for the services the township is able to provide, which is snow plowing, brine and blading. There is no sanding or salting capabilities. The special assessment is currently over budget. There are about 83 properties affected.

**Public Comment:** Inquiry was made as to how the graveling project roads were chosen in Silver Lake; it was noted that no one lives on Woodland Walk, however, it is a public road. It was asked if the gravel will extend to the boat ramp as the area is in need.

The Planning Commission will meet on 14 February 2017 and the Township Board will hold a work shop on the proposed Zoning Ordinance of 20 February 2017 at 10:00 AM.

Motion by Zimmerman to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 7:59 PM.

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2017-02-20-workshop', 'Workshop — Zoning Ordinance Review — February 20, 2017', '2017-02-20', 'Workshop', 'approved', 'pdf', 'Called to order at 10:00 AM by Supervisor Zimmerman.

**Roll Call:**
**Present -- From Township Board:** Dennis Zimmerman, Carol Majewski, Maggie Carey, Mike Tobin, Jerry Bridges.
**Also Present:** Kim Hamilton, Tami McCaslin, Sharon Bridges, Werner Mantei, Roger Carey and Tom Godau.

**Purpose of Workshop:** To review and discuss the November 29, 2016 Draft/Proposed Zoning Ordinance.

---

Carol Majewski gave a brief overview of the financial impact of the two year process.

**Public Comment Period #1:** One comment was made.

---

**Deliberation by the Township Board of Trustees:**

Supervisor Zimmerman asked for comments.

M. Carey began with Section 2.3(B)(5) Inspections and Violations: Consensus by the board to make the change per the attorney''s letter of January 18, 2017.

The next item of discussion concerned Section 2.4(A)(2): Buildings and Structures Not Associated with Single-Family or Two-Family Dwellings. Consensus arrived by board to approve the language as written.

Next item: Section 2.4(C)(3a) Expiration of Permits. Consensus arrived by board to leave the language as written.

Next item: 2.10(B) Violations are Municipal Civil Infractions. Consensus arrived by board to make the change per the attorney''s letter of January 18, 2017. The Board will ask the attorney to update the procedures to reflect that the citations will come from the Township and not the Zoning Administrator. Also, the board will ask the attorney to update the entire section on ALL police ordinances.

Next item: Section 3.4 change per attorney''s letter of January 18, 2017.

Next item: Table 3.1 word change from "that" to "than".

Next item: Table 3-4(5)(c) Ordinary High Water Mark Setback. Proposed changes discussed regarding the fifty (50) feet minimum setback from the ordinary high water mark.

Next item: Table 3-4(6)(b) Side Yard Setbacks. R-2 District side yard setbacks for principal buildings discussed.

---

Next item: 11.4(3) Nonconforming Structures. Consensus arrived by board to allow rebuilding in the footprint if the structure cannot be made to meet the setbacks. Consensus arrived by board to keep the language from the original, existing ordinance.

Consensus arrived by board to change the new ordinance language to reflect revisions to Section 11.4(A)(1) regarding nonconforming structures and Section 11.4(A)(5a) regarding nonconformity existing at the time of Ordinance adoption.

Next issue: Section 14.8(C): No changes.

Next issue: Section 16.3(E)(7) Eliminate the Signs No Longer Applicable subsection.

Next issue: 16.6(2) Entrance Signs: To add an item (d) regarding driveway entrances or gateway structures.

---

Next issue: Section 20.8(5)(C): Recreational Vehicles Used as Temporary Dwellings on Vacant Lots. On the attorney''s recommendation, the board came to a consensus to change the language.

Next issue: Section 20.9(B) Permit Required: Change 120 feet to 60 feet.

Next issue: Section 20.9(E)(3) Total Area of All Accessory Buildings. The board came to a consensus to eliminate the text of (3) except for the first sentence and retain the table.

Next issue: 20.12 Setback Exceptions for Residential Outdoor Living Areas (Patios, Decks, Unenclosed Porches, Etc.) Consider changing paragraph 20.12(B) Standards.

Next issue: 20.20 Prohibited Vehicles. Changes to calendar days from two (2) to four (4) and gross vehicle weight rating from 12,000 to 15,000 pounds.

Next issue: Section 15.4 Clear Vision does not match Section 20.15 Clear Vision Zones. Ask Mark why this is so.

Next issue: Change regarding fences or walls near roads and clear vision zones.

---

Next issue: Allow mini storage in Light Industrial zoned properties. Table 3-3.

Next issue: Allow single home dwellings in commercial zoned properties. Table 3-3. Carol will ask about this.

Next issue: "RV storage may be allowed on vacant lot" should be included in Section 20.26 Supplemental Provisions.

Next issue: In definitions of structure, add item from Roger & Werner concerning building materials.

Next issue: Day care in definitions. As per letter from attorney, the age ranges in the current definitions need to be removed in order to include infants. Carol wants to add a definition of an adult day care facility.

Next issue: Definitions -- need a better definition of awning; Building: add permanent, temporary, or portable structure; Add definitions for building envelope and building footprint; Add definition for grade; Lot of premise and lot of record both need to be added; Motor vehicle and vehicle need to be defined; Tent needs to be defined (including wigwam & teepee).

Motion by Supervisor Zimmerman, second by Trustee Bridges to adjourn, all in favor, meeting adjourned at 3:25 PM.

*Respectfully Submitted,*
*Deb Sherrod, Deputy Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2017-03-13-board-meeting', 'Board Meeting — March 13, 2017', '2017-03-13', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM.

Pledge of Allegiance.

**Roll call present were:** Zimmerman, Carey, Majewski, Bridges and Tobin. **Also present were** Fire Chief/County Commissioner D. Majewski, Zoning Admin. R. Carey, Building Insp. Mantei, County Clerk Martin, Deputy Piwowar and 11 other interested persons.

---

Minutes of the 13 February 2017 regular meeting approved as presented.

Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, 5 yes, motion carried.

---

Supervisor Zimmerman read correspondence from the DEQ regarding the Piggott seawall permit and from Rolf Hudson regarding the proposed Zoning Ordinance.

County Commissioner Dale Majewski updated on the Emergency Management Plan, the budgeting process and reminded everyone that the Paula Pirnstill Health Fair is April 15th.

County Clerk Lori Martin updated on the new elections equipment. The clerk''s office is working on collecting the unpaid fines/restitution from 1000 defendants. Martin said that she hopes to visit each township quarterly.

---

**Public Comment:** There were six comments regarding the proposed Zoning Ordinance.

Fire Chief Majewski reported 31 rescue runs for the month of February, 92 runs year to date. The annual truck maintenance is underway and please remember to call for your burn permit.

Motion by Majewski to renew the Charter franchise agreement with 0% franchise fees and 0% PEG fees, second by Zimmerman, roll call, all in favor, motion carried.

**Public Comment:** Comments were made regarding the Charter Franchise Agreement, Smart Meters, and more on the proposed Zoning Ordinance.

Motion by Bridges to adjourn the meeting, second by Carey, all in favor, meeting adjourned at 7:58 PM.

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2017-04-10-board-meeting', 'Board Meeting — April 10, 2017', '2017-04-10', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM. Pledge of Allegiance.

**Roll Call:** Present was Carey, Majewski, Zimmerman, Bridges and Tobin.
**Also present** was Building Insp. Mantei, Zoning Admin. Carey, Deputy Piwowar, Fire Chief/County Comm. D. Majewski and 23 other interested persons.

---

Minutes of the 13 March 2017 meeting approved as presented.

Treasurer''s report accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, 5 yes, and motion carried.

---

Zimmerman reviewed correspondence from the MDEQ regarding the Lubeski seawall.

County Commissioner D. Majewski gave the County report. The County continues to work on the budget. The Paula Pirnstill Health Fair is Saturday April 15th at the Farwell High School.

---

**Public Comment:**
Supervisor Zimmerman read correspondence regarding zoning in Lincoln Township. A reminder that Rep. Jason Wentworth will be at the Pere Marquette Library in Clare on the second Monday of every month 2:30 PM to 4:00 PM. Tami McCaslin would like to attend an online citizen Planner Course being offered for half price. Comments regarding the trailers being parked on the downtown lot next to the Swiss Inn were made. There was a request for a street light at the corner of Monroe and Jackson.

---

Fire Chief Majewski reported that the burn ban has been lifted; please call for your burn permit. There were 32 rescue, 5 fire and 11 power line related runs for the month of March 2017, 130 runs year to date.

Zimmerman gave the Sheriff''s report. There were 272 incidents including 119 property checks in Lincoln Township, 3298 Incidents County wide.

---

Zimmerman reviewed the only bid received for the lawn maintenance at the Cemetery, and spring and fall clean up at the Shingle Lake, Bertha Lake and Silver Lake parks. The bid was as follows:

- Cemetery spring clean-up - $375.00, fall clean-up - $700.00, mowing - $160.00
- Shingle Lake Park spring clean-up $400.00, fall clean-up - $700.00
- Bertha Lake Park spring clean-up - $175.00, fall clean-up - $275.00
- Silver Lake Park spring clean-up - $250.00, fall clean-up - $350.00

This is a slight increase over last year of $50.00 total.

Motion by Zimmerman to accept the bid from Elm Creek Lawn and Landscape as presented, second by Tobin, all in favor, motion carried.

---

**Public Comment:**
There was comment regarding seeking a grant or other funding for a siren at White Birch. There was comment regarding the progress of the Zoning Ordinance initiative and about utilizing the Sheriff to do patrol on Lake George this summer. It was reported that the boat ramp at the Shingle Lake Park is slippery. It was asked why the Township contracts out some lawn maintenance at the Cemetery and Parks.

Motion by Bridges to adjourn the meeting, second by Tobin, all in favor, meeting adjourn at 7:27 PM.

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2017-04-25-workshop', 'Workshop — Zoning Ordinance Revisions — April 25, 2017', '2017-04-25', 'Workshop', 'approved', 'pdf', 'Called to order at 4:00 PM by Supervisor Zimmerman.

**Purpose of Workshop:** To review and discuss revisions and proposals to the draft Zoning Ordinance.

**Roll Call:**
**Present -- From Township Board:** Dennis Zimmerman, Carol Majewski, Maggie Carey, Mike Tobin, Jerry Bridges.
**Absent:** None.
**Public:** LandPlan Consultant Mark Eidelson, Tami McCaslin, Sharon Bridges, Gary Szczepanski, Werner Mantei, Roger Carey, and 17 other interested persons.

---

**Public Comment Period #1:**

1. Kim Hamilton made comments about his experiences with decks within 40 feet of the water; his knowledge of granting variances in terms of older, established properties and the reason for including variable setbacks in the new ordinance.
2. Trustee Tobin addressed Hamilton''s remarks concerning nonconforming structures, setbacks, and decks.
3. Comment about the reasons for ordinances and common sense zoning.
4. Rolf Hudson commented about the positive process of this ordinance revision with Mark Eidelson''s advice. He is encouraging the board to listen to the Planning Commission''s recommendation.
5. Comments made about the lot behind the Swiss Inn; the Guzowski''s proposed construction on Cedar Rd.; and a brush pile on the corner of Arbor Dr. and Lake George Ave.
6. Trustee Tobin interjected that these issues do not only concern property on area lakes.
7. Bob Guzowski made comments about setbacks and nonconformity on his property.
8. Supervisor Zimmerman addressed the points made by Kim Hamilton, granting variances, setbacks, nonconforming structures, encroachment. He also brought up the square footage limit on accessory buildings and the issue of contiguous property for accessory buildings.

---

Supervisor Zimmerman then asked for comments from LandPlan Consultant Mark Eidelson. He addressed some of the above comments and issues. Eidelson reinforced that the draft ZO will not make currently conforming structures become nonconforming. He then addressed some of the changes proposed by the Planning Commission in February and March of 2017. He asked for clarification of these items so that he can include them correctly in the new ZO.

Supervisor Zimmerman asked Eidelson for his opinion on each of the 15 or so items. Eidelson then summarized each item:

a. R-2 District side yard setbacks.

b. Section 11.4 A3 nonconforming structure being destroyed by natural disaster or fire must be rebuilt in current footprint. His proposed revision is in subsection (a) which removes the need to refer the matter to the ZA. Board agrees with Eidelson''s recommendations in this section with a change in time period of 2 years.

c. Section 11.4 A1 about increasing nonconformity of nonconforming structure. His revisions clarify this matter through examples. The Board had wanted to take out the examples.

d. Subsection 11.4 A2 same issue as above: Board wants to keep this language.

e. 11.4 A5a same issue as above: Board wants to delete this language.

f. Article 16.6 B2 dealing with signs. Mark presented better language.

g. Section 20.8 B5 subsection c pertains to recreational vehicles used as temporary dwellings. Eidelson and township''s legal counsel have expressed concern regarding enforcement of this portion of the ordinance by the township. Board agreed to eliminate this subsection.

h. Clear vision zones addressed in two places; Mark will rectify, keeping 20.15, correcting the oversight.

i. Eidelson asked if the board wants to allow mini storage by right or special use? Table 3.3 revised to allow by right. Board said to change it to "by right".

j. Table 3.4 board wants to authorize single family dwellings in commercial district by right. Mark is recommending against this. He will make it so that in the case of a disaster, the dwelling will be allowed to be rebuilt by special permit. Board agreed.

k. Section 20.26 concerns a section of a previous ordinance and to bring it back into the new ordinance about storage of recreational vehicles. Mark will insert that language. Board concurs with this.

l. All other concerns have to do with definitions. Eidelson recommends adding "child" to child daycare facilities and "adult" to adult daycare facilities. These will be by special use in residential zones. Awning definition to be modified. Board agreed not to include the term "temporary" in the definition of building. Board agrees not to insert definitions for building envelope and building footprint. Board agrees with Eidelson''s revision about the term grade. Eidelson recommends not defining lot of record and lot of premise. Board agrees. Definition of vehicle or motor vehicle: Eidelson recommends removing "motor" in all instances. Board agrees. Definitions of tent, wigwam, and teepee: he recommends that tent be defined and then include that the other terms can be used as alternatives. Board agrees.

Eidelson will add new section regarding the storage of recreational vehicles.

Another change given to Mark was: Section 20.9(B) Permit Required: Change 120 feet to 60 feet.

Carol Majewski asked Eidelson about how townships deal with historical buildings. Eidelson replied that it is not uncommon to have provisions regarding changes made to historical buildings. The township would need to develop a sound reason and policy for this exception.

---

Eidelson will make the revisions and return the revised draft to the board.

**Deliberation by the Township Board of Trustees:** No further comments.

**Public Comment Period #2:**

1. Several comments on storage buildings on non-contiguous property. This will be addressed by the Planning Commission.
2. Tom Godau asked a question clarifying a dimension.
3. A question regarding the zoning map; Eidelson said that it is up to date.
4. Bob Guzowski commented about the lack of attention to the RR zones and that some of the limits there for accessory buildings should be made more generous or flexible in terms of size and number of buildings. Deb Sherrod publicly agreed with Guzowski. The board asked Eidelson to offer some alternative standards to Section 20.9 subsection e & f.

Motion by Supervisor Zimmerman, second by Trustee Bridges to adjourn the meeting, meeting adjourned at 7:00 PM.

*Respectfully Submitted,*
*Deb Sherrod, Deputy Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2017-05-02-special-meeting', 'Special Meeting — Interim Zoning Administrator Appointment — May 2, 2017', '2017-05-02', 'Special Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 4:31PM.

**Roll Call:** Present was Zimmerman, Majewski, Bridges. Absent/excused was Carey and Tobin.
**Also present** was D. Majewski and C. Sterner.

---

Zimmerman stated the purpose of the meeting is to consider the appointment of an interim/temporary Zoning Administrator and to set a wage and mileage reimbursement.

Motion by Majewski to appoint Rod Williams as interim/temporary Zoning Administrator at the hourly rate of $18.50 and .445 cents per mile reimbursement, second by Zimmerman, all in favor, motion carried.

---

**Public Comment:** None offered.

Motion by Zimmerman to adjourn the meeting, second by Majewski, all in favor, meeting adjourned at 4:35 PM.

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2017-05-08-board-meeting', 'Board Meeting — May 8, 2017', '2017-05-08', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM.

Pledge of Allegiance.

**Roll call present was:** Zimmerman, Carey, Bridges, Majewski and Tobin. **Also present was** Building Insp. Mantei, Zoning Admin. Williams, Zoning Board of Appeals Chair Godau, Planning Chair McCaslin, Planning Member S. Bridges, Fire Chief/County Comm. D. Majewski, and 21 other interested persons.

---

Minutes of the 10 April, 2017 regular meeting approved as presented.

Minutes of the 02 May, 2017 special meeting approved as presented.

Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, 5 yes, motion carried.

---

Zimmerman read correspondence from Consumers Energy regarding a hearing on May 09, 2017 to seek authorization for an increase in rates.

County Commissioner D. Majewski reported that the County Board of Commissioners had formally dissolved the County Planning Commission and that the animal shelter would be increasing the adoption cost from $15.00 to $30.00. The increase is to help offset spays, neuters and shots that each pet receives prior to adoption. Majewski also reported on a recent meeting with Rep. Janson Wentworth regarding unfunded mandates and the disbursement of funds to municipalities meant to replace the personal property tax.

---

**Public Comment:**

1. Dennis Shaw commented on a zoning denial letter for a garage on a non-contiguous lot.
2. Darcy LaFave commented on the non-buildable lot in the downtown.

Fire Chief Majewski reported that the fire danger is high and there is no open burning at this time, but you can burn in a pit. There is one Fire Fighter nearing completion of the Fire Fighter 1 Class. There were 30 rescue, 2 fire and 1 power line related runs for April, 161 runs year to date.

Zimmerman introduced Rod Williams, the interim Zoning Administrator.

Motion by Zimmerman to appoint Dawn Holzer to the Planning Commission to finish the vacated term to 2019, second by Bridges, all in favor, motion carried.

---

Motion by Zimmerman to adopt resolution 050817-A, a resolution regarding freezing the Board of Trustees wages for the 2017/2018 fiscal year, second by Tobin, roll call vote, 5 yes, resolution adopted.

Motion by Zimmerman to accept the updated bids from the Clare County Road Commission for the Jackson Ave and Silver Lake Sub. 23A Gravel projects in the amount of the Township share of $82,486.00 less the amount of $13,525.00 previously approved in February 2017, leaving $68,961.00; and to approve the Township Share of $14,191.73 for the Finley Lake Ave. Chip and Fog project, second by Tobin, all in favor, motion carried.

Zimmerman gave an update on the Monroe and Jackson Ave. street light project.

Motion by Zimmerman to approve the annual Parcels Maintenance Equalization in the amount of $3913.00 and the Contract for services outlining costs per parcel and additional costs such as printing tax bills, personal property tax statements, mapping, labels, assessment change notices and extra copies, second by Carey, all in favor, motion carried.

---

**Public Comment:**

1. Jan Penton gave an update of the Expo and Car Show on June 17th and further commented on being happy about people being able to make improvements to their property.
2. There was comment regarding cell phone towers.
3. Darcy LaFave asked if Township Employees are required to obtain building and zoning permits. She further commented that she has researched through FOIA and found that the building inspector hasn''t paid for permits.
4. Tom Godau said that there will be a meeting of the ZBA on 10 May, 2017. He also inquired as to when the new Zoning Ordinance might be finalized.
5. There was a comment regarding the boat ramp at the Shingle Lake Park being slippery with algae.
6. There was a question regarding the 02 May, 2017 meeting and what that was regarding.
7. There was a question from a citizen regarding the status of a blight complaint.
8. Charlie Sterner inquired about the status of 3 zoning permits he had applied for.
9. Edie Archbold commented on the yard waste on the corner of Windover Lake Dr. and Lake George Ave.

Motion by Zimmerman to adjourn the meeting, second by Bridges, all in favor, meeting adjourned at 7:44 PM.

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2017-06-12-board-meeting', 'Board Meeting — June 12, 2017', '2017-06-12', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM.

Pledge of Allegiance.

**Roll call present was:** Bridges, Carey, Majewski, Zimmerman and Tobin. **Also present was** County Clerk Martin, Building Insp. Mantei, Fire Chief/County Commissioner D. Majewski, Zoning Admin. Williams, and 23 other interested persons.

---

Minutes of the 08 May 2017 regular meeting approved as presented.

Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, 5 yes, motion carried.

---

Zimmerman read correspondence from the DEQ regarding a seawall permit at 392 W. Shingle Lake Dr.

Commissioner D. Majewski reported that the MSU Extension office was celebrating 100 years in Clare County; the County has recently changed their workers comp carrier, saving the County $40,000. The Board of Commissioners continues to work on the budget.

County Clerk L. Martin reported that the new voting machines will arrive in August with Training in September and will be ready for November if needed. The lobby for the Circuit Court is complete. The clerk''s office sent out 5000 jury questionnaires for the 2018 jury needs.

---

**Public Comment:** Comment regarding the drain near the fire hall and had a ticket been issued to the fire dept., Zimmerman said no tickets had been issued. There was a thank you for having the sticks and yard debris removed from the road edge by Arbor and Davis; White Birch resident Steve Bryant commented on the proposed Zoning Ordinance regarding camping; comment on the need for a dock near the Shingle Lake Park boat ramp and a complaint about equipment possibly being parked on an easement in the area of 1231 Arbor.

Fire Chief Majewski reported 33 rescue, 1 fire, and 2 power line related runs for May, 201 runs year to date. He also announced that Trans Canada had generously donated $2500 for the purpose of Project Smoke Alarm. This is for handing out smoke alarms and carbon monoxide detectors at the EXPO. Chief Majewski reported that the recent MI OSHA inspection went very well.

---

Motion by Zimmerman to approve a general fund expenditure of $1824.00 to renew the Surrey Township Library Agreement, second by Tobin, all in favor, motion carried.

Zimmerman recently met with representatives from the Bertha Lake area regarding the Canoe Subdivision Special Assessment District for road maintenance. The roads (Cochise, Pocahontas, and Lake) are plowed by the Township and graded by others. The property owners present expressed that the roads need more attention and it was agreed to increase the special assessment to $6250.00 in order to cover the increasing costs of such maintenance.

Motion by Zimmerman to approve a general fund expenditure of $2600.00 per month to renew the Cushman''s Appraisal Agreement for Assessor Services, second by Bridges, all in favor, motion carried.

Motion by Majewski to approve a shared general fund and fire fund expenditure of $27,738.00 for the Property and Casualty Insurance, Terrorism coverages, and Cyber and Privacy Coverage, second by Zimmerman, all in favor, motion carried.

Motion by Zimmerman to approve a fire fund expenditure of $4046.00 for the Fire Department Provident Accident and Health Policy, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to approve a fire fund expenditure of $620.00 for the Fire Department Provident 24 hour Accidental Death and Dismemberment policy, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to approve a shared fire fund and general fund expenditure of $1636.80 for the MTA annual membership fee, second by Bridges, all in favor, motion carried.

Motion by Majewski to approve a shared general fund and fire fund expenditure of $5016.00 for the Workers Compensation insurance, second by Zimmerman, all in favor, motion carried.

Motion by Zimmerman to adopt resolution number 061217-A, a resolution regarding the First Right of Refusal on 25 properties in foreclosure as presented by County Treasurer Fritzinger, second by Bridges, roll call vote, 5 yes, resolution adopted.

---

There was discussion on the proposed zoning ordinance as it pertains to wording on placement of signs in limited visibility areas, corners and rights of way. It was agreed that we should include wording that persons placing signs in these areas have permission of the property owner. Sharon Bridges, Steve Bryant and one other White Birch property owner expressed concerns and offered that White Birch would be willing to assist with the additional costs of adding the new district to the ordinance, which is estimated at $1500.00. Options and recommendations were presented that Majewski had gotten from Mark Eidelson and the township''s legal counsel. It was agreed that the proposed zoning ordinance should reflect that a new zoning district be established for White Birch that would allow camping from May 01 to Nov. 01 without campers needing to remove their camper each 30 days or be limited to only 90 days camping per year.

Motion by Majewski to approve a general fund expenditure of $1500.00 for the purpose of establishing a new zoning district in the proposed zoning ordinance for White Birch Lakes Recreational Association area upon White Birch approval of the expenditure and reimbursement to the Township, second by Zimmerman, all in favor, motion carried.

**Public Comment:** Planning Chair McCaslin wishes to attend some training in August with other members of the planning commission. There was comment on the fish survey results, the "lego" seawall, and the proposed dock at Shingle Lake Park boat launch.

Motion by Bridges to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 8:12 PM.

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2017-07-10-board-meeting', 'Board Meeting — July 10, 2017', '2017-07-10', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM.

Pledge of Allegiance.

**Roll call present were:** Zimmerman, Majewski, Carey, Tobin, and Bridges. **Also present was** Building Insp. Mantei, Zoning Admin. Williams, Fire Chief/County Comm. D. Majewski and 16 other interested persons.

---

Minutes of the 12 June 2017 regular meeting approved as presented.

Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, 5 yes, motion carried.

---

Zimmerman reviewed correspondence from Consumers Energy and the seawall permits from the DEQ for Paetz and English.

Commissioner D. Majewski reported that foreclosures are down this year, the County Board of Commissioners approved a narcotics K9 unit, gave the go ahead to hire an attorney for the Prosecutor''s office and approved Senior Services to hire a director for the Adult Day Care.

---

**Public Comment:** A thank you to Dale Majewski and John Cogswell for fixing the fence at Shingle Lake Park; comments were made regarding the recent boating accident on Lake George, the time it took for the Sheriff to arrive, no ambulance until one was flagged down that happened to be passing by. Comments on the July 4th parade route not being properly blocked to traffic, and discussion on 911 calls for an ambulance are transferred to MMR''s dispatchers in Saginaw.

Fire Chief D. Majewski reported that the fire department had not received tones for the boat accident. They were at the hall wrapping up another call when they heard radio traffic regarding the incident. They then called dispatch and reported to that scene with the booms to try and control the fuel leak. It was difficult to contain the spill due to the many gawkers driving up and making waves, the wind speed being high and changing direction. The Chief has ordered a dozen booms and 100 absorbent pads. A new fire fighter has been added to the roster. Dan Twork hails from Texas and has 15 years of experience in fire suppression. The Chief is working with the state to transfer his training to Michigan. There were 35 rescue, 2 fire and 1 power line related runs for June, 239 year to date. Current roster of the LTFD is 17 members, 0 cadets.

---

Motion by Zimmerman to approve a general fund expenditure of $295.00 for the purpose of purchasing a wireless modem for the new elections equipment, second by Tobin, all in favor, motion carried.

There will be a new Title V trainee at the Township. Christine Amidon is from Silver Lake and will be assisting with document preservation, and elections and other duties as assigned. The Older Worker Program is funded by Region Area Agency on Aging and the trainee wages are paid through that agency.

---

**Public Comment:** There was comment regarding the golf carts being out of control in the Silver Lake area. Further comments were that the golf carts and side by sides are being driven by young children and late at night. Marshall Swanson expressed that he was not in favor of putting a dock at the Shingle Lake boat launch and Tami McCaslin also expressed that she was not in favor of putting a dock at the Silver Lake boat launch as it would take up a lot of space where the beach is. Dale Majewski reported that there appears to be oak wilt in the Shingle Lake Park and there is a tree leaning towards the new pavilion. Supervisor Zimmerman will call the arborist to evaluate and treat both situations.

Motion by Zimmerman to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 7:40 PM.

*Respectfully Submitted,*
*Carol L. Majewski*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2017-08-14-board-meeting', 'Board Meeting — August 14, 2017', '2017-08-14', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7PM.

Pledge of Allegiance.

**Roll Call:** Present was Zimmerman, Majewski, Tobin, Bridges, Carey. **Also present** was Fire Chief/County Comm. D. Majewski, Deputy Jerkovich, Reserve Dep. Curtis, Undersheriff Miedzianowski, ZA Williams and 19 other interested persons.

Minutes of the 10 July 2017 meeting approved as presented.

Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, 5 yes, motion carried.

D. Majewski explained the phone scam using the fire department phone number. Scammers are able to enter phone numbers in so that when they call, a particular number shows up in the caller ID, giving the person answering the call the impression that it is a known person calling, a trusted person or organization. The Fire Department is not giving away a 4 day trip anywhere. Please notify the township if you receive such a call.

**Public Comment:** None offered.

There were 38 rescue, 1 mutual aid and 2 fire related runs for July; 275 year to date.

Parks: Several trees at the Shingle Lake Park have been removed due to Oak Wilt and decay. The park also has quite an ant problem, which is likely causing some of the issues with the decay on the trees. The arborist will be back out to do injections on the remaining oaks to hopefully stop the infection and he will also treat for the ants. Five of the picnic tables at the park have had new boards put on them.

---

Motion by Tobin to approve a general fund expenditure of $125.00 for the purpose of the Township buying back 5 cemetery lots from Henry Beatty, second by Zimmerman, all in favor, motion carried.

Motion by Majewski to appoint Mary Jean Abbott as Zoning Administrator at the current monthly salary of $619.00 plus vehicle mileage, effective immediately, second by Tobin, all in favor, motion carried.

Motion by Majewski to appoint Rod Williams as assistant to the newly appointed Zoning Administrator, at the rate of $18.50 per hour, plus vehicle mileage, for a 90 day transition period, second by Zimmerman, all in favor, motion carried.

Motion by Zimmerman to adopt resolution number 081417-A, a resolution regarding a street light at Monroe and Jackson, roll call vote, 5 yes, resolution adopted.

Motion by Zimmerman to adopt resolution number 081417-B, a resolution regarding giving the clerk authorization to enter in to a grant agreement for the purpose of purchasing new elections equipment, second by Bridges, roll call vote, 5 yes, resolution adopted.

Motion by Zimmerman to adopt resolution number 081417-C, a resolution regarding adopting the July 24, 2017 Zoning Ordinance with revisions to square foot of assessor buildings and revision to wording on camping in the R2A district, second by Tobin, roll call vote, Carey -- No, Tobin -- Yes, Bridges -- Yes, Majewski -- Yes, Zimmerman -- Yes, 1 No, 4 yes, resolution adopted.

Motion by Zimmerman to adopt resolution number 081417-D, a resolution regarding approving the law enforcement contract with the Clare County Sheriff''s Department, second by Bridges, 5 yes, resolution adopted.

**Public Comment:** Comments were offered on a blight situation, vehicles on an easement, Oak Wilt, enforcement on golf carts and jet skis.

Motion by Bridges to adjourn, second by Tobin, all in favor, meeting adjourned at 7:37 PM.

---

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2017-08-14-special-meeting', 'Special Meeting — Sheriff Contract Review — August 14, 2017', '2017-08-14', 'Special Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 6PM.

**Roll Call:** Present was Zimmerman, Majewski, Carey, Bridges, Tobin.
**Also present** was Undersheriff Miedzianowski, Deputy Jerkovich, Reserve Deputy Curtis, Fire Chief D. Majewski, and Planning Chair McCaslin.

---

Zimmerman explained that the reason for the meeting was to review the proposed contract with the Clare County Sheriff''s Dept. for Law Enforcement Services. The current contract is due for renewal September 2017.

**Public Comment:** One comment offered regarding the Golf Carts being out of control.

Zimmerman read the proposed contract for law enforcement services.

Much discussion ensued regarding hours, time spent out of the Township and the township paying for time and mileage when the car is not in Lincoln Township.

Carey expressed that the County bookkeeping process should not impact the Township. The contracted amount of $108,000 per year paid in monthly installments of $9000.00 is the amount -- how the County wishes to reflect that in their books is up to them.

Bridges explained how he uses the daily logs to figure time actually spent in the Township versus time spent out of the township on our clock.

Motion by Bridges to forward the contract to the regular monthly meeting for consideration, second by Tobin, all in favor, motion carried.

---

Motion by Bridges to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 6:30PM.

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2017-09-11-board-meeting', 'Board Meeting — September 11, 2017', '2017-09-11', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM.

**Roll Call:** Present was Zimmerman, Carey, Bridges, Tobin and Majewski.
**Also present** was Zoning Administrators Abbott and Williams, Building Insp. Mantei, Deputy Jerkovich, County Clerk Martin, and 8 other interested persons.

---

August 14, 2017 regular meeting minutes approved as presented.

August 14, 2017 special meeting regarding the law enforcement contract approved as presented.

Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, 5 yes, motion carried.

---

Zimmerman reviewed correspondence from the DEQ regarding seawalls at the Stieber, Birch, Levi and Clark residences all located on Lake George.

County Commissioner D. Majewski reported that the animal shelter has received a grant in the amount of $5000 for the purpose of spaying and neutering. The Verizon tower project permit located in Freeman Township has been renewed. The County has agreed on a tentative budget of 12.6 million dollars.

County Clerk Lori Martin reported that her office is taking debit and credit cards in all department areas now. The new election equipment has been delivered county wide.

---

**Public Comment:** There was comment regarding the anti-gerrymandering ballot initiative.

Chief Majewski reported 26 rescue and 1 power line related runs for the month of August, 313 year to date. The Chief applied for and received a grant in the amount of $4000.00 from Home Depot for the purpose of purchasing smoke detectors, carbon monoxide detectors and fire extinguishers for the annual EXPO.

Trustee/Cemetery Commissioner Tobin said that there are several dead dwarf spruce and dilapidated decorations at the cemetery that will be removed.

**Public Comment:** Comments: vulgar graffiti at Silver Lake Park on the slide, fence and gas pig in Lake St. at Bertha Lake and White Birch Lakes is interested in a warning siren.

Motion by Zimmerman to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 7:40 PM.

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2017-10-09-board-meeting', 'Board Meeting — October 9, 2017', '2017-10-09', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM.

Pledge of Allegiance.

**Roll call present were:** Zimmerman, Carey, Majewski, Tobin, and Bridges. **Also present was** Building Insp. Mantei, Deputy Pivovar, Zoning Admin. Abbott, Zoning Admin. Williams, County Commissioner/Fire Chief D. Majewski and 14 other interested persons.

---

Minutes of the 11 September 2017 regular meeting approved as presented.

Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, 5 yes, motion carried.

---

Zimmerman reviewed seawall permits for Bergey and Ross and reminded everyone that some of the zoning forms have been updated on the website.

Commissioner D. Majewski reported that the County Board of Commissioners had done a resolution recognizing David Zinn for his heroic actions in regards to saving the person on the burning transit bus. The BOC also recognized the airport''s 5 year plan that includes repairs to the runway, lighting and finishing the pilots lounge; which will enable the airport to apply for certain grants. The County also approved a 12.6 million dollar budget.

---

**Public Comment:** None offered.

Chief Majewski reported that there were 2 fire fighters slated to attend the Fire Fighter I course starting in December at the Surrey Fire Hall. There will be an open house at the Lincoln Township Fire Dept. on 31 October at 5:00 PM for the public; candy for the children and refreshments will be served. There were 33 rescue, 1 powerline, 1 fire and 1 mutual aid related runs for the month of September, 367 year to date.

Supervisor Zimmerman read a letter from Roger Carey regarding the cost of the muck pellets and the overall benefit to the 292 lakefront owners.

Motion by Zimmerman to approve a general fund expenditure of $825.00 for the purpose of 3 individuals to attend the Citizen Planner Class, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to approve a general fund expenditure of $900.00 plus lodging, meals and mileage for the Zoning Administrator to attend the 2 day Zoning Administrators Certification Class, second by Bridges, all in favor, motion carried.

Supervisor Zimmerman explained that there is a grant available from the Township''s insurance carrier that will help defray the cost of the certification class. The Township can apply for one grant per fiscal year.

---

Zimmerman read a letter from the Planning Commission regarding "opting out" of allowing medical marihuana facilities in the township. Presently there are 3 options that the Township can take; "opt in", "opt out" and "do nothing". We are monitoring the situation and have submitted a letter requesting the advice of our attorney in regards to the best option(s) for the township as it pertains to our zoning and what changes may need to be made if we "opt in" or "opt out".

Motion by Zimmerman to "do nothing" in regards to allowing medical marihuana facilities in the township at this time, second by Bridges, all in favor, motion carried.

The annual Trunk or Treat will be at the Township Hall on 31 October, 2017 at 5:00 PM.

**Public Comment:** Many comments were offered regarding boat wakes, medical marihuana legislation, the process for clearing up blight, lake front assessments and how they work.

Motion by Bridges to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 7:40 PM.

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2017-11-13-board-meeting', 'Board Meeting — November 13, 2017', '2017-11-13', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM.

Pledge of Allegiance.

**Roll call present was:** Bridges, Tobin, Majewski, Carey and Zimmerman. **Also present was** Building Insp. Mantei, Zoning Administrators Abbott and Williams, Fire Chief Majewski and 12 other interested persons.

---

Minutes of the 09 October 2017 meeting approved as presented.

Treasurer''s report accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, 5 yes, and motion carried.

---

County Commissioner D. Majewski reported that the County was accepting resumes to fill the Building Official position, as well as an office position in the Clerk''s office. The Public Works Board was appointed to 2020 and the Board of Canvassers had also been appointed until 2021.

**Public Comment:** None Offered.

Fire Chief D. Majewski reported that the open house on Oct. 31st had 75 children and 50 adults in attendance. Reminder to be sure and get your burn permit and better yet, bag your leaves up in paper bags and American waste will haul them away or take leaves to the compost field Wed., Fri., or Sunday 9AM to noon. There were 34 rescue, 1 fire, and one powerline related runs for October, 390 runs year to date.

---

Clerk Majewski announced that the Township had received a dividend check from Accident Fund Workers Compensation for $922.00 for another work safe year! The Township has not had a workers comp claim in over 7 years thanks to training of employees and utilizing safety precautions and equipment. Good job to our employees!

The Neighborhood Watch Expo will be June 16, 2018. Mark your calendars.

There was some vandalism at the Township Hall; the electrical conduit from the lighted sign to the building was pulled out. The electrician did have to come out to make repairs in the amount of $193.00.

**Public Comment:** Sharon Bridges offered that White Birch had experienced vandalism at their club house; they suspected it was persons using the Wi-Fi at night. They now shut their Wi-Fi off at 9PM and haven''t had any problems since. There was a camper complaint on the Zoning Ordinance; the White Birch property owner feels that the limit on the number of campers on a lot is too restrictive.

Motion by Bridges to adjourn, second by Tobin, all in favor, meeting adjourned at 7:18 PM.

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2017-12-11-board-meeting', 'Board Meeting — December 11, 2017', '2017-12-11', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM.

Pledge of Allegiance.

**Roll call present was:** Bridges, Tobin, Majewski, Carey and Zimmerman. **Also present was** Building Insp. Mantei, Zoning Admin. Abbott, Fire Chief Majewski, Lakes Director R. Carey and 5 other interested persons.

---

Minutes of the 13 November 2017 meeting approved as presented.

Treasurer''s report accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, 5 yes, and motion carried.

---

Dennis Adler from Mid-Michigan Community College gave a brief report on the offerings at MMCC.

District #1 County Commissioner D. Majewski reported that the County had hired a new building inspector and that there is still a position open in the Clerk''s office.

**Public Comment:** None Offered.

Fire Chief D. Majewski reported that a new firefighter has joined the department. Robert Lightfoot comes to Lincoln Township Fire Department trained in Fire Fighter I and II and he holds numerous other trainings and certificates. Fire Fighters Twork and French are attending the Fire Fighter I & II class. There were 32 rescue, 1 power line, 1 mutual aid and 1 fire related runs for November, 421 runs year to date.

---

Lake Commissioner R. Carey has submitted to the MDNR an application for buoy permit for Shingle Lake. If the permit is granted, we will need chains and anchors for the 4 buoys.

Motion by Zimmerman to adopt resolution 121117-A, a resolution regarding rejecting the tax delinquent properties, second by Tobin, all in favor on roll call, resolution adopted.

**Public Comment:** Comment was offered on the buoys at Shingle Lake Park and also on the parking along Finley Lake Ave. in the area of 3705-3900.

Motion by Zimmerman to adjourn, second by Tobin, all in favor, meeting adjourned at 7:22 PM.

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2018-01-08-board-meeting', 'Board Meeting — January 8, 2018', '2018-01-08', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM.

Pledge of Allegiance.

**Roll Call:** Present were Zimmerman, Majewski, Carey, Tobin and Bridges.
**Also present** was Zoning Admin. Abbott and Williams, Lakes Dir. R. Carey, Building Insp. Mantei, Planning Chair McCaslin, Fire Chief Majewski and one other interested person.

---

Minutes of the 11 December 2017 regular meeting approved as presented.

Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, 5 yes, motion carried.

---

**Public Comment:** One comment offered regarding "no parking" signs on Finley Lake Ave.

Motion by Zimmerman to approve a general fund expenditure of $73.60 ($36.80 each) for two no parking signs in the area of the rental units located on Finley Lake Ave. in Bertha Lake, second by Tobin, all in favor, motion carried.

---

Chief D. Majewski said that on a recent run the new door spreader was used to gain entry in to a home and it worked perfectly with no damage whatsoever to the door or structure. There will be a CPR refresher course at the Township Hall on 07 January, 2018 instructed by MMR at no charge to the Fire Dept. There were 36 rescue, 1 fire, 3 power line related runs for the month of December, 452 runs for 2017.

Motion by Zimmerman to approve a fire fund expenditure of $1390.00 for the purpose of purchasing two Mustang Water Rescue suits, second by Bridges, all in favor, motion carried.

---

**Public Comment:** Williams gave a report regarding civil infractions.

Motion by Bridges to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 7:26 PM.

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2018-02-12-board-meeting', 'Board Meeting — February 12, 2018', '2018-02-12', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM.

Pledge of Allegiance.

**Roll Call:** Present was Zimmerman, Majewski, Carey, Bridges and Tobin.
**Also present** was Fire Chief/County Comm. D. Majewski, Zoning Admin. Abbott, Zoning Admin. Williams, Planning Chair McCaslin, Building Insp. Mantei, County Clerk Martin, Deputy Gruno, ZBA Member Engelhardt and Planning Member S. Bridges.

---

Minutes of the 08 January, 2018 regular meeting approved as presented.

Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, all in favor, motion carried.

---

Commissioner D. Majewski reported that the Board of Commissioners had decided to table the invitation to join the class action suit regarding the opioid drug manufacturers until they have had further opportunity to review.

County Clerk Martin reported that there is no indication at this date that there will be a May election. There will be election inspector training in July, and she hopes to have this type of training every year rather than every other year. She has hired two people; one replaces an employee who moved on, and another to help with the large increase in the court docket.

Supervisor Zimmerman gave a report on his recent visit to Lansing to attend the Capitol Conference that included information on rubbish and landfills, disabled military veterans property tax exemptions, pension reform, driver responsibility fees, no fault insurance, changes to personal property taxation, income taxes, prevailing wages, elections, local control, property tax delinquencies and the replacement bond for the Clean Michigan Initiative.

---

**Public Comment:** None offered.

---

Chief Majewski reported 24 rescue, 1 fire, 1 power line and 2 mutual aid related runs for January, 37 runs year to date. There were a total of 456 runs for the year 2017. The fire department is reviewing bids for the annual hose and ladder testing. There will be a continuing education weekender at the fire hall in April where our Medical First Responders can get their CEU credits. This will be open to other fire departments as well.

Deputy Gruno reported that it has been fairly quiet in the Township. There have been some break-ins in the White Birch area and she did have a pursuit that passed through the Township.

---

Motion by Zimmerman to approve the rubbish contract with American Waste for three years as presented, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to approve a general fund expenditure of not to exceed $2000.00 for the purpose of purchasing one Electronic Poll Book Laptop for elections and one laptop for the Zoning Administrator, second by Bridges, all in favor, motion carried.

Motion by Zimmerman to adopt resolution 021218-A, a resolution to repeal Ordinance #4, also known as the Trailer House and Mobile Home Ordinance, second by Tobin, roll call vote, all in favor, resolution adopted.

Motion by Zimmerman to adopt resolution 021218-B, a resolution to repeal Ordinance #15, also known as the Building Ordinance, second by Bridges, roll call vote, all in favor, resolution adopted.

---

**Public Comment:** One comment offered regarding MTA legislation.

Motion by Tobin to adjourn the meeting, second by Bridges, all in favor, meeting adjourned at 7:44 PM.

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2018-03-12-board-meeting', 'Board Meeting — March 12, 2018', '2018-03-12', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7PM.

Pledge of Allegiance.

**Roll Call:** Present was Zimmerman, Majewski, Bridges, Tobin and Carey.
**Also present** at the meeting was Planning Chair McCaslin, Lakes Dir. R. Carey, Zoning Admin. Abbott, ZBA Chair Godau, Deputy Gruno, Building Insp. Mantei, Planning Member Engelhardt and 1 other interested person.

---

Minutes of the 12 February, 2018 meeting approved as presented.

Treasurer''s report accepted as presented.

Motion by Tobin to pay the monthly bills as presented, second by Tobin, roll call vote, 5 yes, motion carried.

---

County Commissioner D. Majewski reported that the Sheriff''s department would be replacing bullet proof vests; Dave Coker has been appointed to the Parks and Rec board through March 31, 2021. The Veteran''s Freedom Park will be getting a new bronze statue of a Korean War veteran. There were many fund raisers to pay for the statue. The footings for the Verizon Tower at Ashard and 115 and the project should be completed sometime this summer.

---

**Public Comment:** There was comment regarding the No Parking signs in Bertha Lake.

---

Fire Chief Majewski reported that there were 36 Rescue, 3 Fire and 1 mutual aid related runs for February, 72 runs year to date. The fire department is currently working on an ISO rating review in hopes of lowering the ratings for both Lincoln and Freeman Townships.

Motion by Majewski to approve general fund budget adjustments in the amount of $25,398.66 as presented, second by Zimmerman, all in favor, motion carried.

Motion by Zimmerman to approve the 2018 Local Road Estimate/Agreement with the Clare County Road Commission regarding the Harding Ave. gravel project, from Monroe North to the township line in the amount of $51,000.00 (fifty one thousand dollars), second by Tobin, all in favor, motion carried.

---

**Public Comment:** There will be a ZBA hearing on 14 March at 7PM, there was comment on property values; Supervisor Zimmerman said that Lake George, Silver and Shingle Lakes were about the same, White Birch was down a bit and Bertha Lake was up a bit. There was comment on a person going around to businesses in Garfield Township claiming to be collecting donations on behalf of the Lincoln Township Fire Department. The Lincoln Township Fire Department does not solicit donations over the phone or door to door. There was comment about contacting DTE and Charter to see if they will consider putting gas and cable in White Birch.

Motion by Bridges and seconded by Tobin to adjourn the meeting, all in favor, meeting adjourned at 7:18 PM.

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2018-04-09-board-meeting', 'Board Meeting — April 9, 2018', '2018-04-09', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7PM.

Pledge of Allegiance.

**Roll Call:** Present was Zimmerman, Majewski, Tobin, Bridges and Carey.
**Also present** was Fire Chief/County Commissioner D. Majewski, Zoning Admin. Abbott, Lakes Dir. R. Carey, Deputy Gruno, Sheriff Wilson, and 9 other interested persons.

---

Minutes of the 12 March 2018 regular meeting approved as presented.

Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, 5 yes, motion carried.

---

Commissioner D. Majewski reported that Michelle Ambrozaitis has been appointed to the Parks and Rec Board; the County Clerk''s office is in the process of filling a clerical position. It was reported that the last spray for Gypsy Moth in Clare County was in 2012. There will be a spray this year in Frost, Franklin, Hayes, Lincoln, Freeman, Greenwood and Hatton Townships.

Sheriff Wilson reported on the need for a security wall in the jail to safely separate inmate areas. Overdose incidents are on the rise, there have been 5 last week.

---

**Public Comment:** Comments to the negative were made on the Harding Road gravel project.

---

Fire Chief Majewski reported that Fire Fighter Twork is doing well in class and will graduate the end of the month. The ISO audit is going well and there are indications that the rating will decrease slightly which is good news for home owners insurance. There were 27 rescue and 1 fire related runs for March 2018, 98 runs year to date.

There was discussion on putting a basketball court in the Shingle Lake Park. The Friends of the Parks have a grant opportunity available that, if granted, would help to fund the project. It is estimated at around $3800.00 for the cement pad and hoop. Audience members inquired if the pad could be made big enough to accommodate a Pickle Court. Rolf Hudson offered that the LGPOA may consider some funding for the project. Further info on this at a future meeting.

The Hamlin Field was discussed. There will be a volunteer assisted community cleanup day scheduled there when the weather improves. The dilapidated fencing around one field will be removed and the good parts will be used to repair the other fence.

Deputy Gruno reported that it has been fairly quiet in the Township with the exception of a young male runaway (found), a couple domestic assaults, 1 OUI, 3 fugitive arrests and one no insurance.

R. Carey provided information on the Michigan Waterways Commission Resolution No. 02-2018-01, regarding legislation containing, but not limited to, registering all rigid-hulled kayaks and canoes at a rate not to exceed $10.00/yr., and increasing the registration fees for all vessels. Citizens are encouraged to contact their state legislators regarding implementing these registration fees on such vessels.

---

Motion by Zimmerman to approve a general fund expenditure of $1013.13 for the purpose of Harrison Lumber replacing the kitchen floor in the Township Hall, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to approve a fire fund expenditure of $25,000.00 for the purpose of replacing turnout gear and to authorize the Clerk to pursue grant opportunities for the purpose of securing financial assistance for the purchase, if available, second by Tobin, all in favor, motion carried.

Discussion on the grant opportunity available for razing and demolishing structures through the County.

Motion by Zimmerman to approve the annual grounds maintenance with Elm Creek for the 2018 season as presented: Bertha Lake Park: Spring Cleanup - $150.00, Fall Cleanup - $275.00, Cemetery: Spring Cleanup - $350.00, Fall Cleanup - $750.00, Mowing and Trimming: $170.00 each, Shingle Lake Park: Spring Cleanup - $350.00, Fall Clean up - $750.00, Silver Lake Park - Spring Cleanup - $250.00, Fall Cleanup $375.00, second by Tobin, all in favor, motion carried.

---

**Public Comment:** There was comment regarding if the ISO rating would be helped by White Birch had a fire station.

Motion by Bridges to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 8:08PM.

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2018-05-14-board-meeting', 'Board Meeting — May 14, 2018', '2018-05-14', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7PM.

Pledge of Allegiance.

**Roll Call:** Present was Zimmerman, Majewski, Bridges, Tobin and Carey.
**Also present** was Fire Chief/County Comm. D. Majewski, Building Insp. Mantei, Zoning Admin. Abbott, Lakes Comm. R. Carey, and 8 other interested persons.

---

Minutes of the 09 April, 2018 regular meeting approved as presented.

Treasurer''s report was accepted as read.

Motion by Bridges to pay the monthly bills, second by Tobin, roll-call vote, 5 yes, motion carried.

---

Commissioner D. Majewski reported that the County had hired an I.T. Director, part-time at 20-25 hours a week.

---

**Public Comment:** A sincere apology was issued to all those present from a gentleman who felt his behavior at the April meeting warranted a public apology. Apology was graciously accepted by all. A question was asked of Commissioner Majewski regarding the recent hire of the I.T. Director and why said position was not posted. Commissioner Majewski stated that he had voted no on the hire for that very reason and that such a concern would be best brought to the entire Board of Commissioners.

---

Fire Chief Majewski reported 1 fire, 28 rescue, 2 power line and 3 mutual aid runs for April, 145 year to date. It was also reported that Fire Fighter Don Twork was doing well in the Fire Fighter I class and is expected to graduate soon. The ISO is recommending that the rating for Lincoln Township/Freeman Township be lowered to an 8B for homeowners living 5 miles by road from the fire hall, thus yielding an approximate savings of 9% on homeowners insurance. It is recommended that citizens notify their carrier as soon as the reduction in ISO rating is official. Official notice will be posted on the Township website and in future minutes. Notice is expected in about 2 months.

Tobin reported that there are few shrubs in the cemetery which have become unsightly and will be removed per our ordinance.

---

Motion by Zimmerman to appoint Roger Carey to the Zoning Board of Appeals, second by Bridges, all in favor, motion carried.

Motion by Zimmerman to adopt resolution number 051418-A, a resolution to exercise First-Right-of-Refusal (for purchase) the 2018 properties that are now in tax delinquent foreclosure; the township rejects the transfer of these properties to the ownership of Lincoln Township, second by Tobin, roll call vote, all in favor, resolution adopted.

Motion by Zimmerman to accept the 2018-2019 Clare County Equalization Contract, second by Majewski, all in favor, motion carried.

Motion by Zimmerman to adopt resolution number 051418-B, a resolution to consider the Supervisor''s recommendation for a wage increase for elected officials for fiscal year 2018/2019, not to exceed the Michigan CPI of 2.1%, rounded to the nearest dollar, second by Tobin, roll call vote, 5 yes, resolution adopted.

Motion by Zimmerman to approve a general fund expenditure of not to exceed $1000.00 (one thousand) for the purpose of purchasing 4 tires and a front end alignment for the maintenance truck, second by Bridges, all in favor, motion carried.

Motion by Zimmerman to adopt resolution number 051418-C a resolution amending the zoning map as follows: To C-1 Local Commercial, 101-008-304-07; 010-008-304-19; 010-008-304-20; 010-263-025-00; 010-263-027-02; 010-263-031-00; 010-264-008-00; 010-265-001-01; 010-261-017-0; and to I-1 Light Industrial, 010-008-301-02; 010-008-301-16; 010-008-301-17, second by Bridges, roll call vote, 5 yes, resolution adopted.

Motion by Majewski to approve a general fund expenditure of $2255.00 for the clerk''s annual hardware support and cloud storage from Cogitate Inc. for the 2018-2019 fiscal year, second by Zimmerman, all in favor, motion carried.

---

Discussion regarding the basketball/pickle ball court. It was agreed that building something that can be utilized by both basketball and pickle ball is the way to go. Carey added that encouraging outdoor activity and play is important. The court could have other uses as well, such as chalk drawing, hop scotch, skating and badminton. Park users may wish to put up a canopy and use the area for a function. Rolf Hudson said that he would be presenting the plan to the Lake George Property Owners to see if they would like to donate to the project. Clerk Majewski has written the Friends of Clare County Parks a grant requesting financial assistance with the project.

Motion by Carey to approve the construction of a basketball/pickle ball court at the Shingle Lake Park, at a cost of $7050.00, second by Tobin, all in favor, motion carried.

The Hadeka property was discussed and it was decided that further consideration of pursuing an available grant to raze the blighted structure is not in the best interest of the Township.

The owner of the old school house wishes to donate the property to the Township. The board will see the property and building and further discussion will be had at a future meeting.

There will be some areas of the Township sprayed for Gypsy Moth. If your property is included in the various spray zones you have likely received a letter from the Conservation District to "opt out" if you wish. The spraying will be sometime between May 29 and June 01, 2018.

Motion by Zimmerman to refer to the ZBA for interpretation the question of whether an easement constitutes a property line to determine if a back lot property is contiguous to a lake front property, specifically the Drew property as presented, and to make such interpretation and hear the revised request at no cost to the Drew''s, second by Carey, all in favor, motion carried.

Announcements: The Neighborhood Watch Expo is on Saturday June 16th from 9AM to 3PM.

---

**Public Comment:** Boaters Safety is on June 23, 2018 at 8 Point Lake, call Joe Rentz for registration information. The trees cutters in the area, Davies and Asplund, do not appear to be properly treating the oak stumps and there is concern about the Oak Wilt spreading; the maps for the Gypsy Moth spray area will be on the township website; the question was raised if it is possible to have the deputy split some of their time between the road and the lake.

Motion by Bridges to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 7:58PM.

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2018-06-11-board-meeting', 'Board Meeting — June 11, 2018', '2018-06-11', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM.

Pledge of Allegiance.

**Roll Call:** Present was Zimmerman, Majewski, Carey, Bridges, Tobin.
**Also present** was Zoning Admin. Abbott, Building Insp. Mantei, Lakes Director R. Carey, Jon Johnson of Burnham and Flower, and 3 other interested persons.

---

Minutes of the 14 May, 2018 regular meeting approved as presented.

Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, all in favor, motion carried.

---

Correspondence/Public Notice regarding the seawall permits for 1945 Arbor Dr. (Bringer) and 1935 Arbor Dr. (Drabczyk) were reviewed.

County Commissioner D. Majewski reported that Concealed Permit Licenses have a new style and are soon to be renewable online. Mary Cooper was hired as the new court clerk and Shelly Path did a presentation on opioid use in Clare County; a study found that for each 10,000 people in Clare County there were 15,992 prescriptions filled.

---

**Public Comment:** Rolf Hudson made comments regarding the Lake George Lake Level. Other comments were made regarding the levels at White Birch Lakes as well as Silver Lake.

---

Fire Chief D. Majewski reported that the fire department will have the smoke house at the EXPO on June 16th. The fire department will also be drawing for smoke detectors, carbon monoxide detectors, fire extinguishers and Nest cameras again this year. A generous donation was received from the Home Depot for the raffle items. There were 26 rescue, 1 fire, 2 power line and 1 mutual aid runs for the month of May, 170 runs year to date.

Lakes Director R. Carey reported that there is legislation to improve inspections and maintenance of septic systems. The House Bills are 5752 and 5753.

---

Motion by Majewski to approve a general fund expenditure of not to exceed $1600.00 (one thousand six hundred) for the purpose of site plan review on-site workshop for township officials and appointees, second by Zimmerman, all in favor, motion carried.

Motion by Zimmerman to approve a general fund expenditure of $1549.00 (one thousand five hundred forty nine) for the purpose of sealcoating the township hall parking lot, work to be performed by I-Deal Sealcoating, second by Bridges, all in favor, motion carried.

Motion by Zimmerman to approve a general fund expenditure of $1716.00 (one thousand seven hundred sixteen) for the purpose of Hometown Decorations providing, putting up, and taking down, the annual holiday decorations, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to approve a general fund expenditure of $850.00 (eight hundred fifty) for removing two oak trees, grinding the stumps and hauling away the wood, from the yard at the township hall, second by Bridges, all in favor, motion carried.

---

Jon Johnson, Account Manager from the Townships insurer, Burnham and Flower, reviewed the township''s coverages.

Motion by Zimmerman to approve $28,878.00 (twenty-eight thousand eight hundred seventy eight) for the annual General Liability coverages, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to approve the Casualty Limited Terrorism Coverage in the amount of $75.00 (seventy-five) and the Property Limited Terrorism Coverage in the amount of $49.00 (forty-nine), second by Tobin, all in favor, motion carried.

Motion by Zimmerman to increase the liability limit from $4,000,000.00 to $5,000,000.00, at a cost of $1,338.00, (one thousand three hundred thirty eight) second by Bridges, Majewski - yes, Zimmerman - yes, Bridges - yes, Carey - no, Tobin - no, motion carried.

Motion by Zimmerman to approve the Non-Monetary Defense Cost Coverage from $50,000.00 to $250,000.00 per suit/$250,000.00 aggregate, at a cost of $250.00, (two hundred fifty) second by Bridges, all in favor, motion carried.

Motion by Zimmerman to approve the Fire Fighters Provident Accident and Health coverage at a cost of $4046.00, (four thousand forty six), second by Tobin, all in favor, motion carried.

Motion by Zimmerman to approve the Fire Fighters Accidental Death and Dismemberment coverage in the amount of $620.00 (six hundred twenty), second by Tobin, all in favor, motion carried.

Motion by Zimmerman to increase the cost of a land division/lot splits and combines application to $75.00 (seventy-five) effective June 12, 2018, second by Bridges, all in favor, motion carried.

Motion by Zimmerman to enter in to a two year contract with Rebecca Taylor, MAAO/A, Level III, for assessing services at an annual cost of $42,000.00 (forty two thousand) paid in equal monthly installments, effective 12 June, 2018, second by Tobin, all in favor, motion carried.

---

**Public Comment:** None offered.

Motion by Zimmerman to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 7:55 PM.

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2018-07-09-board-meeting', 'Board Meeting — July 9, 2018', '2018-07-09', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7PM.

Pledge of Allegiance.

**Roll Call:** Present was Zimmerman, Majewski, Carey, Bridges and Tobin.
**Also present** was Building Insp. Mantei, Zoning Admin. Abbott, 911 Director Marlana Terrian, Lakes Dir. R. Carey, Fire Chief D. Majewski and 11 other interested persons.

---

Minutes of the 11 June, 2018 regular meeting approved as presented.

Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, all in favor, motion carried.

---

Zimmerman read correspondence from Consumers Energy regarding a meeting on July 16, 2018 at 9AM in Lansing.

County Commissioner D. Majewski said that there will be a land auction on 04 August 2018 at Noon at the Doherty in Clare. There is a vacancy in the Treasurer''s office. The BOC has hired Maximus to perform a study on the actual revenue being generated by the inmates who are jailed from other jurisdictions.

---

**Public Comment:** There were several comments offered pertaining to township officials trespassing, and calling on Sunday; speed limit signs in residential areas, maintenance at the Silver Lake Park, street lights out on North St., Woodland Walk, no sheriff presence on the recent holiday, trees hanging in the view of street signs, and the recent gravel project causing run off.

---

Fire Chief Majewski updated on the ISO rating. Effective 01 October 2018 the rating will be an 8B for those living within 5 miles by road from the fire hall. All others will be a 10 rating. Homeowners should contact their insurance company after 01 Oct., 2018 for the new rate. There were 32 rescue, 1 fire, and 1 powerline related runs for June, 211 year to date.

Lakes Director R. Carey reported that he had been hearing complaints about people allowing their friends, relatives and others to park boat on their lakefront. Regulation of private boat docking on inland lakes is covered under Part 301 of the Inland Lakes and Streams section of the Natural Resources and Environmental Protection Act, Public Act 451 of 1994.

---

**Public Comment:** Comments made regarding children under 12 being unsupervised at parks and section 20.25 in Ord. 44, as it pertains to mooring a boat at the dock of friend or relative.

Motion by Bridges to adjourn the meeting, seconded by Tobin, all in favor, meeting adjourned at 7:50PM.

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2018-08-13-board-meeting', 'Board Meeting — August 13, 2018', '2018-08-13', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM.

Pledge of Allegiance.

**Roll Call:** Present was Zimmerman, Majewski, Bridges, Carey, and Tobin.
**Also present** was Building Insp. Mantei, County Transit Director Tom Pirnstill, Zoning Admin. Abbott, Sheriff''s Deputy Gerbe, County Commissioner/Fire Chief D. Majewski, and 9 other interested persons.

---

Minutes of 09 July 2018 meeting approved as presented.

Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, 5 yes, motion carried.

---

County Commissioner D. Majewski reported that they are busy with the 2018/2019 budget.

Tom Pirnstill did a presentation on the County Transit. It included information on the revenue sources for the agency, expenditures, equipment, ridership, partnerships, facilities and proposed projects. Veterans ride for $1.00, age 80+ ride for free, reservations are requested at least 24 hours in advance. Dispatch: (989) 539-1473.

---

**Public Comment:** There was comment on wood being stolen from private property along the Harding Rd. project area. Comment on buoys for Shingle Lake Park, and comment from a property owner on Maple St. in Silver Lake regarding her frustrations with the height of the newly graveled road causing water run-off in to her house.

---

Chief D. Majewski reported that there have been 240 runs year to date.

Motion by Zimmerman to approve the Road Construction Agreement with the Clare County Road Commission for the Chip Seal Project on Mannsiding Road as amended in the amount of $79,848.72, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to approve Chad Bauer to make repairs to and gravel the roads in the Special Assessment District in Canoe Subdivision in the amount of $6000.00, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to refund Stewart Drew the $75.00 lot split fee, second by Bridges, Zimmerman - yes, Carey - No, Tobin - No, Majewski - No, Bridges - No, motion declined.

Zimmerman reminded everyone that the recyclables trailer that is in the municipal parking every third weekend is only for recyclables. There have been many bags of household trash and construction materials being left.

The church has offered to donate the bell to the Township and we are trying to make arrangements to get it down.

---

**Public Comment:** There is free clothing available at Living Hope Church in Farwell; there was comment on an 80 year old woman being arrested in Lincoln Township for marijuana possession. The elderly female had her medical marijuana card, but it had expired.

Motion by Tobin to adjourn the meeting, second by Zimmerman, all in favor, meeting adjourned at 8:02 PM.

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2018-09-10-board-meeting', 'Board Meeting — September 10, 2018', '2018-09-10', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7PM.

Pledge of Allegiance.

**Roll Call:** Present was Zimmerman, Majewski, Tobin, Carey, and Bridges.
**Also present** was Building Insp. Mantei, Zoning Admin. Abbott, Lakes Director R. Carey, Fire Chief/Commissioner D. Majewski, County Commissioner Bristol, County Clerk Martin, Region Area Agency On Aging Contract Manager S. Dudewicz and 9 other interested persons.

---

Minutes of the 13 August 2018 regular meeting approved as presented.

Treasurer''s report was accepted as presented. Treasurer Carey said that the audit went exceedingly well, our very best one yet.

Motion by Bridges to pay the monthly bills, second by Tobin, roll vote, 5 yes, motion carried.

---

Commissioner D. Majewski said that they are finalizing the budget process at the County. The budget was balanced by taking $200,000.00 from fund balance. Majewski was opposed to that action and voted no.

Stacey Dudewicz from Region VII Area Agency on Aging gave a presentation on services offered by the Agency in the 10 county district that includes Clare County. Mike Tobin is on the Agency Board of Directors and Commissioner Bristol is on the Agency Advisory Council.

County Clerk Martin said that straight-ticket voting is off the November ballot following an US Sixth Circuit Appeals Court Action. Martin said that there will be 3 statewide proposals on the November ballot regarding, Marijuana, Gerrymandering and Automatic Election Day Voter Registration. Martin''s office is actively pursuing the collection of victim restitution and county fines. There is currently about 2.2 million dollars owed to the county and victims from as long ago as the mid 1980''s.

---

**Public Comment:** Roger Carey said that he had caught a raccoon that was acting funny; the DNR had tested the animal and found it to have canine distemper.

---

Chief D. Majewski reported that the month of August has been the busy month in the department''s history. The recent storm had caused 21 power line runs alone. Chief Majewski said that in two instances, citizens had taken risks around the down power lines. He reminded everyone to stay back from down lines no less than 25 feet and that you cannot tell if a power line is charged by looking at it; also, keep in mind that when generators run, there is a risk of back feeding a line. Chief Majewski explained that the sirens did not sound for that storm because they only sound for tornado warning -- a three minute continuous blast is a warning blast and you should take cover. The one minute "warble" is the all clear. Chief Majewski reported that Lt. Ken Logan has retired and that Timothy Bailey has been selected to take over the Lt. Records.

---

The Silver Lake Property Owners Association has requested that the outhouse at the Silver Lake Park be removed and replaced by a porta john for the summer season. Clerk Majewski will get cost estimates for removal of the outhouse and for filling in the pit.

Motion by Zimmerman to accept the bid from Medco Tree of $600.00 for the purpose of cleaning up the oak trees taken down during the August storm at the Shingle Lake Park, including debris removal, and stump grinding, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to accept the bid from Medco Tree of $1275.00 for the purpose of cleaning up the oak trees taken down during the August storm at the Bertha Lake Park, including debris removal, and stump grinding, second by Tobin, all in favor, motion carried.

The Township has asked the Gas Company to assist with the tree damage at the Hamlin Field.

---

**Public Comment:** There was much comment on the health department proposal that septic tanks be inspected at point of sale. McCaslin and Carey encouraged the County Commissioners present to take a lead on this as it would enforce proper septic systems to be in place, especially on the lakes in the county. The Planning Commission will look at the Zoning Ordinance as it pertains to engineered drawings.

Motion by Tobin to adjourn the meeting, second by Bridges, all in favor, meeting adjourned at 8:07 PM.

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2018-10-08-board-meeting', 'Board Meeting — October 8, 2018', '2018-10-08', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM.

Pledge of Allegiance.

**Roll Call:** Present was Zimmerman, Majewski, Tobin, Bridges and Carey.
**Also present** was Building Insp. Mantei, Fire Chief/County Comm. D. Majewski, Deputy Gruno, Lakes Dir. R. Carey and 5 other interested persons.

---

Minutes of the 10 September 2018 regular meeting approved as presented.

Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, 5 yes, motion carried.

---

Correspondence from the DEQ regarding seawall permits for Willis on Shingle Lake and Johnson on Lake George were reviewed. Additionally, a general permit authorization for West Bay Geophysical was reviewed.

County Commissioner D. Majewski reported on Senate Bill 1031 regarding exempting utilities from personal property tax. He also reported that the county budget for 2018-2019 is settled with $110,000.00 being taken from fund balance, which he was not in favor of.

---

**Public Comment:** There was comment regarding the condition of Harding Avenue.

---

Fire Chief D. Majewski said that the new turnout gear is in and issued. The USDA has granted $11,000.00 towards the purchase of the gear. There were 34 rescue, 1 fire, and 2 power line related runs for the month of September, 373 runs year to date.

Clerk Majewski presented a new Pavilion/Property Use Agreement for citizens to fill out when they wish to reserve one of the park pavilions, township hall or municipal parking area. This new agreement is more detailed and will hopefully help those using the properties for a public purpose to understand that they may need a license from the Health Department to serve certain types of food to the public.

Clerk Majewski reported that there has been no bid received back from the excavator in regards to filling in the outhouse septic at the Silver Lake Park.

Trustee Tobin reported that there have been some Japanese Pines removed from the cemetery due to disease.

Deputy Gruno reported on the crime spree at White Birch Lakes. There have been many items stolen, such as dirt bikes, quads and golf carts. Several homes, garages and sheds have been broken in to.

Lakes Director R. Carey reported that it is against the law, and considered littering to put your grass clippings and leaves in to the lake.

The Michigan Shoreland Stewards Program has recognized Roger and Maggie Carey with a Silver Certificate for having maintained their shoreline in a manner that reduces negative impacts on inland lakes through having high levels of natural vegetation and no seawall. Congratulations to the Careys!

---

Motion by Zimmerman to renew the AT&T Metro Act Right of Way Permit Extension to 30 June, 2024, second by Tobin, all in favor, motion carried.

The annual Trunk or Treat will on 31 October 2018 at the Township Hall from 5:00 PM to 6:00 PM.

---

**Public Comment:** The plan for the run off in the area of Hunters and Maple St. is to put in up to 6 seepage basins. The location of those basins is yet to be determined. Fire Chief Majewski mentioned that we may need to amend ordinance 33 regarding the charges to utility companies if the SB 1031 on utilities being exempted from Personal Property Tax goes through.

Motion by Bridges to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 7:36 PM.

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2018-11-12-board-meeting', 'Board Meeting — November 12, 2018', '2018-11-12', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM.

Pledge of Allegiance.

**Roll Call:** Present was Majewski, Zimmerman, Tobin, Bridges, Carey.
**Also present** was Deputy Gruno, Building Insp. Mantei, Zoning Admin. Abbott, Fire Chief Majewski and 7 other interested persons.

---

Minutes of the 08 October 2018 regular meeting approved as presented.

Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills as presented, second by Tobin, roll call vote, all in favor, motion carried.

---

Commissioner D. Majewski reported that the vacancy in the Veterans Affairs office has been filled by Carl Houser. The Sheriff''s Department is providing a liaison officer to the Mid-Michigan Community College; the position is being funded by MMCC.

---

**Public Comment:** There was comment regarding the condition of Harding Ave.

---

Fire Chief Majewski reported that the open house on October 31st went well, with 65 children, plus adults in attendance. There were 41 rescue, 2 fire, and 1 power line related runs for October, 375 year to date.

Deputy Gruno reported that a suspect has been arrested in the White Birch Lakes breaking and entering spree. Most of the stolen property has been recovered.

Lakes Director R. Carey has applied for and received the buoy permit for the 2019 season at Silver Lake Park.

---

Motion by Zimmerman to appoint as regular members of the Board of Review: Cindy Engelhardt, Steve Bryant, and Roger Carey; and Joe Rentz and Deb Trim as alternate members, all for a two year term, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to adopt resolution 111218-A, a resolution regarding adopting the Federal Guidelines for Poverty/Hardship Exemption Income Thresholds and Township Asset Test, second by Carey, roll call vote, 5 yes, resolution adopted.

Motion by Zimmerman to adopt resolution 111218-B, a resolution regarding waiving penalties for non-filling or late filing of property transfer affidavits, second by Bridges, roll call vote, all in favor, resolution adopted.

Motion by Majewski to approve a wage increase for elections inspectors from $10.67 per hour increase to $11.50 per hour and to increase the elections chairperson from $11.76 per hour to $12.89 per hour, effective 06 November 2018, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to approve a road fund expenditure of $6350.00 for the purpose of Robin Harsh Excavating installing four 24 inch leach basins at $900.00 each and regrade yards and install topsoil and hydro seed at $2750.00, in the Silver Lake project area, second by Tobin, all in favor, motion carried.

Motion by Majewski to approve a general fund expenditure of not to exceed $650.00 for the purpose of Hanner Excavating crushing the privy pit tank and backfilling the hole at Silver Lake Park with sand at a cost of $400.00 and allowing for $250.00 to have the pit pumped if necessary, bid included a $100 donation credit, second by Carey, all in favor, motion carried.

Motion by Majewski to approve a general fund expenditure of $266.00 for the purpose of purchasing 12 civil infraction books from Government Systems for the zoning department, second by Zimmerman, all in favor, motion carried.

Motion by Zimmerman to accept and approve the annual audit from Weinlander Fitzhugh, second by Bridges, all in favor, motion carried.

Motion by Zimmerman to accept at no cost, the two government surplus pickups for the fire department as command vehicles, to be returned to the state when their use is no longer needed by the township, second by Bridges, all in favor, motion carried.

---

Announcements: There were 809 ballots cast in Lincoln Township on 06 November, 2018. There were 90+ kids plus adults in attendance at the annual Trunk or Treat, the township will be reviewing and preparing to update the 2011 Personnel Manual to include the Earned Sick Time Act Legislation requirements.

Motion by Zimmerman to adopt resolution 111218-C a resolution opposing SB 396, which is a senate bill proposing certain exemptions from frost laws, second by Bridges, roll call vote, 5 yes, resolution adopted.

---

**Public Comment:** Appreciation for opposing SB 396 and the ISO fire rating has been updated effective 01 October, 2018. The information for your insurance company can be found at the township website: www.lincolntwp.com. For informational purposes, a resident, whose home is approximately 1 mile from the fire hall, saved $200 dollars on home owners insurance. Please let your carrier know of the change in ISO rating.

Motion by Bridges to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 7:45 PM.

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2018-12-10-board-meeting', 'Board Meeting — December 10, 2018', '2018-12-10', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM.

**Roll Call:** Present were Zimmerman, Majewski, Tobin, Bridges and Carey.
**Also present** was Lakes Dir. R. Carey, Zoning Admin. Abbott, County Clerk Martin, Commissioner/Fire Chief D. Majewski, Deputy Gruno and 4 other interested persons.

---

Minutes of the 12 November 2018 regular meeting approved as presented.

Treasurer''s report accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, all in favor, motion carried.

---

County Commissioner D. Majewski reported that two correction officers'' positions and one assistant prosecutor position have been approved to fill due to vacancies. Cindy Engelhardt thanked Commissioner Majewski for not supporting a tax payer funded seminar to Mackinaw Island at $750.00 per night at the Grand Hotel for a county official.

County Clerk Lori Martin reported that persons holding a CPL will be able to renew online soon; there will be a link on the county website at www.clareco.net. New applicants will still need to apply in person. Clerk Martin said that they are having difficulty getting jurors to participate. She is planning some educational articles for citizens on the importance of serving. Mike Tobin inquired as to how the fines and restitution collection was going. Martin said that the revenue from those sources was up about $2000.00 per month in the first 6 months. Debtors are receiving monthly text messages to remind them to make their payment. There is still 2.2 million outstanding.

---

**Public Comment:** None offered.

Fire Chief D. Majewski reported 408 runs year to date. November saw 31 rescue, 1 fire, and 1 gas leak related runs.

Motion by Zimmerman to approve an expenditure not to exceed $2000.00 for the purpose of replacing one LED bulb unit in a street lamp and one unit in reserve, second by Tobin, all in favor, motion carried.

Clerk Majewski informed the board that there may be a need to increase the zoning appeal fee in the near future. The current fee of $450.00 is covering the expense, however, that is only because the current Planning Commission rep to the Zoning Board of Appeals, T. McCaslin, volunteers her services to both Planning and Zoning. That saves one meeting per diem of $51.12. Should that situation change, there will be a need to increase. Majewski will report back as needed.

There were 100 plus kids at the annual Christmas visit with Santa.

---

**Public Comment:** Marion Waite reported that her neighbor appears to have replaced a roof without a permit. Zimmerman will check on that.

Motion by Zimmerman to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 7:29 PM.

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2019-01-14-board-meeting', 'Board Meeting — January 14, 2019', '2019-01-14', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM.

Pledge of Allegiance.

**Roll Call:** Present was Zimmerman, Majewski, Bridges, Carey, and Tobin.
**Also present** was Zoning Admin. Abbott, Sheriff''s Deputy Gerbe, Lakes Dir. R. Carey, Planning Vice Chair S. Bridges, ZBA Sec. C. Engelhardt, Fire Chief/Comm. D. Majewski and one other interested persons.

---

Minutes of the 10 December 2018 regular meeting approved as presented.

Treasurer''s report was accepted as presented.

**Public Comment:** None offered.

Motion by Bridges to pay the monthly bills, second by Tobin, roll-call vote, 5 yes, motion carried.

---

Deputy Gerbe reported that all is well and quiet in the township at this time.

Motion by Zimmerman to appoint Tami McCaslin, Sharon Bridges, Gary Szczepanski, and Dawn Holzer to the planning commission for a term ending February 2022, second by Bridges, all in favor, motion carried.

Motion by Zimmerman to appoint Roger Carey as a member and Gary Szczepanski as an alternate member from Planning to the Zoning Board of Appeals for a term ending February 2022, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to appoint Kenneth Beougher as an alternate member of the Zoning Board of Appeals for a term ending February 2022, second by Carey, all in favor, motion carried.

There was discussion regarding civil infractions verse criminal infractions in regards to the township non zoning ordinances. Zimmerman recommends a work shop meeting for that purpose due to the several ordinance needing consideration individually.

---

**Public Comment:** There was further comment on the civil infractions. Zimmerman clarified that it would be on our police power ordinances. There was a question regarding the status of the sale of the bar.

Motion by Zimmerman to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 7:21 PM.

*Respectfully Submitted,*

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2019-02-11-board-meeting', 'Board Meeting — February 11, 2019', '2019-02-11', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM.

Pledge of Allegiance.

**Roll Call:** Present was Zimmerman, Carey, Majewski, Tobin and Bridges.
**Also present** was Deputy Gerbe, Building Insp. Mantei, Zoning Admin. Abbott, County Clerk Martin, Fire Chief/Commissioner D. Majewski, and 6 other interested persons.

---

Minutes of the 14 January 2019 regular meeting approved as presented.

Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, 5 yes, motion carried.

---

Supervisor Zimmerman read correspondence from the MDEQ regarding the seawall permit for Flaishans at 331 Parkway.

County Clerk Martin gave an update on recouping the fines, costs and restitutions owed to the county and victims. They are able to send payment reminders via text now and that is working well. There will be an election in May for the Farwell Area Schools for a bond millage request.

Commissioner D. Majewski reported that the Board of Commissioners have chosen Jack Kleinhardt as their new chairperson and committee assignments have been done. Commissioner Majewski has been selected to vice chair the Central Michigan District Health Department Board.

---

**Public Comment:** It was noted that the Planning Meeting date was listed incorrectly on the agenda. Correction was announced.

---

Fire Chief Majewski reported that there have been 56 runs year to date, and 31 rescue, 2 fire and 1 powerline related runs for January 2019. The Chief reported that the Lincoln Township Fire Department is the recipient of a $5000.00 grant from Trans Canada for the purpose of purchasing smoke detectors, CO detectors, fire extinguishers and other home safety equipment for their Safety Program. The program is working. The homeowner of a recent house fire reported that had it not been for the smoke alarm given to them by LTFD, they may not have been alerted to the fire. Kudos to our fire department for a job well done and for their commitment to the safety of our community and citizens.

Treasurer Carey explained that the funds currently held at the Mercantile Bank are basically drawing zero interest. She has found a CD that will pay 3% interest for 60 months or another that will pay approximately 2.97% interest for 25 months.

Motion by Carey to convert the Mercantile Money Market account to the CD of the treasurer''s choice, second by Zimmerman, all in favor, motion carried.

Motion by Zimmerman to approve the contract with Kent Communications to produce and mail our assessment change notices for a general fund expenditure of $1472.63, second by Tobin, all in favor, motion carried.

---

Motion by Zimmerman to waive the fee for the Jeff Drew appeal of the zoning administrator''s decision, to be held on 13 March 2019, due to procedural errors at meeting held previously in May 2018, second by Majewski, all in favor, motion carried.

Motion by Zimmerman to adopt resolution number 011119-A, a resolution regarding adopting Lincoln Township Ordinance 46, an Ordinance to Prohibit Recreational Marihuana Establishments in Lincoln Township, second by Bridges, roll call vote, 5 yes, resolution adopted.

Motion by Zimmerman to adopt resolution number 011119-B, a resolution regarding amending the penalty from a misdemeanor penalty to a civil infraction penalty for first and second offenses, in Sec. 8 of Ordinance Number 22, also known as the Boating Ordinance, second by Tobin, roll call vote, 5 yes, resolution adopted.

Motion by Zimmerman to adopt resolution number 011119-C, a resolution regarding amending the penalty from a misdemeanor penalty to a civil infraction penalty for first and second offenses, in Sec. 7 of Ordinance Number 26, also known as the Noise Ordinance, second by Tobin, roll call vote, 5 yes, resolution adopted.

Motion by Zimmerman to adopt resolution number 011119-D, a resolution regarding amending the penalty from a misdemeanor penalty to a civil infraction penalty for the first and second offenses, in Sec. 8 of Ordinance Number 29, also known as the Dog Ordinance, second by Bridges, roll call vote, 5 yes, resolution adopted.

Motion by Zimmerman to adopt resolution number 011119-E, a resolution regarding amending the penalty from a misdemeanor penalty to a civil infraction penalty for the first and second offenses, in Sec. 10 of Ordinance 30, also known as the Parks and Public Grounds Ordinance, second by Tobin, roll call vote, 5 yes, resolution adopted.

Motion by Zimmerman to adopt resolution number 011119-F, a resolution regarding amending the penalty from a misdemeanor penalty to a civil infraction penalty for the first and second offenses, in Sec. 7 of Ordinance 32, also known as the Nuisance and Blight Ordinance, second by Bridges, roll call vote, 5 yes, resolution adopted.

Motion by Zimmerman to adopt resolution number 011119-G, a resolution regarding amending the penalty from a misdemeanor penalty to a civil infraction penalty for the first and second offenses, in Sec. 7 of Ordinance 38, also known as the Lake, Dock and Boat Ordinance, second by Bridges, roll call vote, 5 yes, resolution adopted.

Motion by Zimmerman to adopt resolution number 011119-H, a resolution regarding amending the penalty from a misdemeanor to a civil infraction penalty for the first and second offenses, in Sec. 15 of Ordinance 42, also known as the Cemetery Ordinance, second by Tobin, roll call vote, 5 yes, resolution adopted.

---

**Public Comment:** There was a request to clarify Recreational Marihuana V Medical Marihuana and further clarify the purpose of the aforementioned Ordinance 46, a.k.a, Prohibition of Recreational Marihuana Establishments. Zimmerman explained that the new ordinance, Number 46, is to prohibit a "store front" in Lincoln Township, it does not prohibit the use of medical or recreational marihuana.

Motion by Bridges to adjourn the meeting, all in favor, meeting adjourned at 7:45 PM.

*Respectfully Submitted,*

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2019-03-11-board-meeting', 'Board Meeting — March 11, 2019', '2019-03-11', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM.

Pledge of Allegiance.

**Roll Call:** Present was Zimmerman, Majewski, Bridges, Tobin and Carey.
**Also present** was Lakes Dir. R. Carey, Planning Vice Chair S. Bridges, Fire Chief/County Commissioner D. Majewski and one other interested persons.

---

Minutes of the 11 February 2019 regular meeting approved as presented, with the correction regarding the amount approved for the contract with Kent Communications; from $1472.63, corrected to $2034.04.

Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, 5 yes, motion carried.

---

Zimmerman reviewed correspondence from the MDEQ regarding seawalls for Flaishans on Parkway and Delpiombo on W. Lake George Drive.

County Commissioner D. Majewski reported that there are areas in Lincoln Township that are a part of the Gypsy Moth spray area. Property owners in those areas will be receiving their cards notifying them of the spray soon. The County Board of Commissioners has approved the lease agreement for 2 animal control trucks.

There was some discussion regarding changing the street lights over to LED. The new LED street light on Monroe Rd. costs approximately $8.75 per month. The other 73 HP Sodium street lights range in cost from $13.60 each to $26.66 each depending on lumens and watts.

Motion by Carey to actively pursue changing the street lights to LED, second by Tobin, all in favor, motion carried.

---

**Public Comment:** There was none offered.

---

Chief D. Majewski reported that there were 38 rescue, 1 fire and 1 power line related runs for the month of February, 90 runs year to date. There was discussion regarding the training requirements for Fire Fighters and Medical First Responders and that the classes are making it tough to recruit new members.

Motion by Zimmerman to approve using the credit card points for Subway Cards for fire department and staff on duty, second by Tobin, all in favor, motion carried.

Zimmerman read correspondence from Mark Lightfoot regarding the body cameras that the township purchased for our deputies to wear while on duty in the township. Mr. Lightfoot feels strongly that the board should pass a resolution or add to the contract that the cameras be in operation at all times; and if additional batteries or car chargers for those units are needed that those items be purchased.

R. Carey shared information on SB 1072, a bill amending Part 13 (Permits) and Part 413 (Transgenic and Nonnative Organisms) of the Natural Resources and Environmental Protection. Included in the new law: that a person shall not launch or transport watercraft or trailers unless they are free of aquatic organisms, including plants; Transport a watercraft without removing all drain plugs and draining all water from bilges, ballast tanks and live wells; and release unused bait into the water.

Road brining tentative dates are May 09, June 21 and August 28.

---

**Public Comment:** There will be ZBA hearing on 13 March, 2019 at 7:00 PM.

Motion by Tobin to adjourn the meeting, second by Bridges, all in favor, meeting adjourned at 7:25 PM.

*Respectfully Submitted,*

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2019-04-08-board-meeting', 'Board Meeting — April 8, 2019', '2019-04-08', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM.

Pledge of Allegiance.

**Roll Call:** Present was Bridges, Zimmerman, Majewski, Tobin, and Carey.
**Also present** was Deputy Gerbe, Building Insp. Mantei, Zoning Admin. Abbott, Lakes Dir. R. Carey, Fire Chief/County Comm. D. Majewski, and 6 other interested persons.

---

Minutes of the 11 March, 2019 regular meeting approved as presented.

Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, 5 yes, motion carried.

---

Supervisor Zimmerman reviewed correspondence from the State Department of Treasury reminding Michiganders that a Principal Residence Exemption -- known as a PRE -- does NOT expire. There have been inaccurate posts shared on social media claiming that Michigan taxpayers will experience a surge in property taxes due to their PRE expiring after 25 years. This is a false claim and there is NO expiration date on a PRE unless you move. Supervisor Zimmerman also reported on the roadside brush spray program performed by the Clare County Road Commission. Similar to Gypsy Moth spraying, if you are in an effected area, you should be receiving a card in the mail.

County Commissioner D. Majewski reported that the Board of Commissioners have approved for Central Dispatch to get an upgraded phone system; Hayes Township Supervisor Terry Acton has been appointed to the Air Port Board; there was a lump sum incentive pay approved for elected officials and department heads.

---

**Public Comment:** Farwell Area Schools Superintendent reported on the upcoming school bond proposal. There was comment on White Birch Lakes not being included on the brush spray program; this is because it is a private association. There was a request to allow the Pickle Ball players permanently paint stripes on the wood floor of the Township Hall. It was recommended by the Board that there are reasonable alternatives that are not permanent, such as vinyl lines.

---

The Fire Chief reminded everyone that this is the grass fire season and to be sure and call for your burn permit; and remember that burning status can change from morning to afternoon. Fires that get out of control are your responsibility, even if you have a burn permit. Because of the grant from Trans Canada there will be a good stock of safety items at the Expo on Father''s Day weekend, such as, smoke detectors, CO2 detectors, and fire extinguishers.

The Board reviewed the request from the MTA regarding the issue of Michigan Townships having the option of holding township board member elections on the nonpartisan ballot. After some discussion, there was no action taken.

Treasurer Carey presented a petition to the Planning Chair, Tami McCaslin, regarding items needing review in the Zoning Ordinance 44. After some discussion and clarification, it was recommended that the Planning Commission hold a workshop in the near future, and then hold a public hearing as required by the Zoning Ordinance and Michigan Zoning Enabling Act on that petition and other items as deemed necessary by the Planning Commission.

Majewski presented the annual costs of spring and fall clean up at the parks and cemetery and the per mow at the cemetery. Bertha Lake: $150 for spring cleanup, and $275 for fall clean up; Shingle Lake: $350 spring cleanup, $750 fall cleanup; Cemetery: $350 for spring cleanup, $750 for fall cleanup and $170 per mow. There was no agreement presented for Silver Lake. Majewski will contact them for the agreement for Silver Lake.

Motion by Majewski to approve the parks and cemetery 2019 ground maintenance services as presented by Elm Creek, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to approve the installation of 2 additional leach basins at a cost of $900.00 each in the Silver Lake gravel project area, second by Majewski, all in favor, motion carried.

---

**Public Comment:** Tami McCaslin asked where the additional leach basis will be. Those will be placed in the area of the Amidon and Moore residences. Cindy Engelhardt would like the info on the website to give a definition of a variance and an appeal.

Motion by Zimmerman to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 7:50 PM.

*Respectfully Submitted,*

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2019-05-13-board-meeting', 'Board Meeting — May 13, 2019', '2019-05-13', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM.

Pledge of Allegiance.

**Roll Call:** Present was Zimmerman, Majewski, Bridges and Tobin. Carey -- absent excused.
**Also present** was Zoning Admin. Abbott, Building Insp. Mantei, Fire Chief D. Majewski and Lakes Director R. Carey and 4 other interested persons.

---

Minutes of the 08 April, 2019 regular meeting approved as presented.

Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, all in favor, motion carried.

---

**Public Comment:** A question was asked about why a seawall permit application be denied by the DEQ? Supervisor Zimmerman said that if an area is delineated as a wetland, that would be a reason for denial.

---

Fire Chief Majewski reported that there were 33 rescue, 5 fire and 1 power line related runs for the month of April; 167 runs year to date. Plans for the EXPO on June 15th are going good. The fire department will be giving out fire detectors, CO2 detectors, fire extinguishers and they will be doing drawings for the Ring Doorbells and Home Security Camera Systems. Goodies for the kids.

Clerk Majewski reported that there had been a request for new fence at the beach at Silver Lake Park. Maintenance will be going out to evaluate the fence.

Lakes Director Roger Carey reported that there had been information posted on social media regarding Lake George being polluted or something to that effect. It was explained that this brown color are tannins, much like the tannins from a tea bag; only the lake tannins are from certain coniferous trees as well as other flowering plants. These tannins leach from the plants to the soil, and then to the ground water and that will drain to the lake giving off that tea color in the water.

Supervisor Zimmerman explained that he and Lakes Director Roger Carey work with PLM (Professional Lakes Management). PLM has a team of expert biologists, foresters, ecologists and managers that the Township has worked with for 20 plus years to preserve and protect desirable plant life, while controlling unwanted "invasive weed" species. The waters of several of our lakes are tested annually by Supervisor Zimmerman. Lincoln Township participates in the Cooperative Lakes Monitoring Program, which is a citizen based monitoring program; CLMP goals are to measure baseline water quality and document water quality trends. For more information on the CLMP visit the Michigan Department of Environment, Great Lakes and Energy, or EGLE. If you have any questions, comments or concerns about Lake George, Shingle Lake, Bertha Lake or Silver Lake please call Roger or Dennis.

Supervisor Zimmerman reported that the drainage basins are in and seeding and landscaping are ongoing in the Silver Lake area.

Motion by Zimmerman to adopt resolution number 051319-A, a resolution regarding considering fiscal year 2019 wage limitation for elected officials at the CPI 2.4%, second by Tobin, roll call vote, 4 yes, 1 absent, resolution adopted.

---

Announcements:

- Silver Lake Property Owners Association will meet on May 25th at 10AM at the Silver Lake Park Pavilion.
- Bertha Lake Property Owners Association will meet on May 25th at 11AM at the Township Hall.
- Lake George Boosters Club Bake Sale is on May 25th at 9AM to Noon in the municipal parking lot.
- Lake George Property Owners Association Meeting is May 26th at 10AM at the Township Hall.
- Lincoln Township Budget Hearing and Annual Meeting is June 27th at 4PM at the Township Hall.

Reminder: Organizations requesting use of the Hall or other township facilities need to submit a request form to the Clerk.

---

**Public Comment:** R. Carey voiced his opposition to the Muck Pellet Program being used at the channel.

Motion by Tobin to adjourn the meeting, second by Bridges, all in favor, meeting adjourned at 7:37 PM.

*Respectfully Submitted,*

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2019-06-06-special-meeting', 'Special Meeting — Insurance Review — June 6, 2019', '2019-06-06', 'Special Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 10:09 AM.

**Roll Call:** Present was Zimmerman, Majewski, Carey. Absent and excused were Tobin and Bridges.
**Also present** was Jon Johnson from Burnham and Flower Insurance Agency.

---

Jon Johnson gave an overview of the proposed liability/casualty and property coverages for the plan year 2019-2020. The Township is a member of the Michigan Participating Plan, has received $4001.30 in dividends to date, has received $5000.00 in grant for back up cameras for the fire vehicles and has taken advantage of the available reimbursement for sending one individual per year to the Michigan Citizen Planner Certification.

The Michigan Participating Plan''s risk control provides an inspection for the township approximately once every third year, has sample policy and procedures set up and provides seminars and presentations free of charge.

Jon reviewed each section of the bind request, reviewed parks, hall, fire hall, compost field, municipal parking area, special events and both cemeteries. He explained coverages and how they work. Discussed wind damages, building contents, replacement cost valuation, earthquake and flood coverages. The Silver Lake Park restroom was removed from the property coverage list and the Smoke House was removed because the fire department will not be borrowing that from Mt. Pleasant Fire this year.

The Michigan Participating Plan provides the bulk of the Townships liability and property coverage and is $20,795 for the plan year. This includes, but is not limited to, comprehensive general liability, employee benefits liability, public official''s liability, law enforcement liability, automobile liability, property coverage, electronic data coverage, crime and bonding, and electronic data processing coverage.

The Travelers Policy includes the fire/rescue vehicles and inland marine policy and is $7864 annually.

The Cyber and Privacy Liability Coverage is $972 annually.

The Provident Board of Trustees AD&D is $565 annually.

The Terrorism coverages for casualty and property are combined a total of $134 annually.

The Fire Department Provident A&H on duty is $4046, and the Fire Department Provident 24 Hour AD&D is $620.00 annually.

---

Motion by Zimmerman to adjourn the meeting, second by Majewski, all in favor, meeting adjourned at 10:56 AM.

*Respectfully Submitted,*

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2019-06-10-board-meeting', 'Board Meeting — June 10, 2019', '2019-06-10', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM. Pledge of Allegiance.

**Roll Call:** Present was Zimmerman, Majewski, Carey, Tobin and Bridges.
**Also present** was D. Majewski, R. Carey, W. Mantei, J. Abbot, T. McCaslin, L. Martin and 3 other interested persons.

---

Minutes of the 13 May 2019 regular monthly meeting were approved as presented.

Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll-call vote, 5 yes, motion carried.

---

County Clerk Lori Martin reported that the 07 May 2019 School Election went well; 15% of registered voters voted, 49% of those ballots were cast by absentee ballot. Martin thanked Clerk Majewski and Deputy Clerk Sherrod for helping out at the recent election inspector training. Martin took the Voter Assist Terminal to the Harrison High School so that students could interact with the machine. Martin plans to visit Farwell and Clare Schools and hopes to make it an annual visit to familiarize students with the voting process. Martin contacted Secretary of State Joslyn Benson and asked her to come visit Clare County. Benson''s office responded favorably and she plans to visit in the future.

County Commissioner Dale Majewski reported that Jennifer Martin from 44 North, Advanced Benefits Solutions, reviewed the inmate health insurance with the County Board of Commissioners. He also reported that the Tobacco Drain Project Grant was approved at 2.2 million dollars.

---

**Public Comment:** Steve Chapman of Finley Lake Ave. stated his case regarding having recently received a blight citation.

Chief Majewski reported 44 rescue and 2 fire related runs for the month of May, 198 runs year to date.

---

Motion by Zimmerman to approve a general and fire fund expenditure of $1754.15 for the purpose of Michigan Township Association Dues and Legal Defense, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to approve a general fund expenditure of $1824.00 for the purpose of the annual Library Contract with Surrey Township Library, second by Majewski, all in favor, motion carried.

Motion by Zimmerman to approve general fund expenditure of $3906.00 for the purpose of the Clare County Equalization Contract performing tax preparation services, second by Bridges, all in favor, motion carried.

Motion by Zimmerman to approve a general fund expenditure of $2452.65 for the purpose of the accepting the proposal from KCI, to prepare the tax bills for mailing, postage and envelopes, seal, sort and mail, second by Bridges, all in favor, motion carried.

Motion by Zimmerman to approve a general fund expenditure of $11,500.00 for the purpose of accepting the proposal from the Clare County Road Commission for Asphalt Overlay on Park St./Bringold Ave. for $9000.00 township share, AND for Chip Seal on Lake St. for $2500.00 township share, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to approve total expenditures of $34,996.00 for the purpose of the renewal of the township insurance policies including: Michigan Twp. Par Plan Package (liability and property) for $20,795.00; Travelers Fire/Rescue for $7864.00; Cyber & Privacy Liability for $972.00; Trustee''s AD&D for $565.00; Firefighter''s (on duty) Accident and Health for $4046.00; Firefighter''s Accidental Death and Dismemberment 24 hr. for $620.00; Casualty Limited Terrorism for $85.00; Property Limited Terrorism for $49.00. Seconded by Bridges, all in favor, motion carried.

Motion by Zimmerman to adopt the proposed Zoning Ordinance text amendments as follows:

Article 2, General Administration, Enforcement and Penalties; Section 2.2 A2: changed "movement or demolition" to "movement OR demolition."

Article 2, General Administration, Enforcement and Penalties; Section 2.2 C1: changed "movement or demolition" to "movement OR demolition."

Article 8, Zoning Board of Appeals, Section 8.7, C1: added language that the preparation of plot plans, site plans, elevation drawings or similar drawings MAY be required by a registered land surveyor or registered engineer at the discretion of the Zoning Board of Appeals Chairperson.

Article 14, Environmental Protection, Section 14.8 D: added new item 2 regarding stairways not more than five (5) feet in width, stairway landings, and related construction standards, renumbering subsequent items.

The motion to adopt the proposed Zoning Ordinance text amendments was seconded by Carey, roll-call vote: Carey -- yes, Tobin -- No, Bridges -- No, Zimmerman -- Yes, Majewski -- Yes, three yes, two no, motion carried.

Motion by Zimmerman to amend his previous motion to adopt the proposed Zoning Ordinance text amendments to reflect that the last sentence of the new wording in Article 14, Environmental Protection, Section 14.8 D2 be struck through. Carey amended her second to the motion, roll-call vote: Carey -- yes, Bridges -- No, Tobin -- Yes, Majewski -- Yes, Zimmerman -- Yes, four yes, one no, motion carried.

Motion by Zimmerman to adopt resolution number 061019-A, a resolution regarding acquisition of certain tax delinquent properties and the township elects to not purchase these properties and waives its First Right of Refusal, second by Bridges, roll-call vote, 5 yes, motion carried.

---

**Public Comment:**
Comment on buoys for Shingle Lake beach and Silver Lake beach. The buoys are ready, and we need help getting them in as the township does not own a water craft. Pat Swanson volunteered her vessel to transport the guys and the buoys to the proper locations at Shingle Lake.

Mike Tobin said that he has had a couple complaints that the cemetery doesn''t look good. He reminded everyone that it is not a perpetual care cemetery. It has been mowed and trimmed regularly, and cleaned up in the spring and fall.

Motion to adjourn the meeting by Tobin, second by Bridges, all in favor. Meeting adjourned at 8:10 PM.

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2019-07-08-board-meeting', 'Board Meeting — July 8, 2019', '2019-07-08', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM.

Pledge of Allegiance.

**Roll Call:** Present was Zimmerman, Carey, Bridges, Tobin and Majewski.
**Also present** was Building Insp. Mantei, Lakes Director Carey, and 2 other interested persons.

---

Minutes of the June 06, 2019 special meeting with Jon Johnson of Burnham and Flower approved as presented.

Minutes of the June 10, 2019 regular meeting approved as presented.

Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, all in favor, motion carried.

---

Supervisor Zimmerman acknowledged correspondence from EGLE regarding seawall permits for Ed Zimmerman on Oak Tree St., Kuhn on Lake Dr., Weyher on Arbor Dr., and Olsen on Forest Blvd.

Commissioner D. Majewski reported that the Clare County Board of Commissioners had appointed Charles Dorcey to the Jury Board; have approved a resolution for Grey Lake in regards to appointing a Lake Board, and have started the process of investigating the possibility of bringing the Clare County Road Commission under the Board of Commissioners.

Guest Comment: Tim Haskins, Clare County Road Commissioner made a statement regarding the tumult at the Road Commission and answered questions asked.

---

**Public Comment:** None Offered.

---

Chief Majewski reported that the EXPO was a roaring success and he thanked Trans Canada for their continued partnership and generous donation which provided items for handing out to the public. There were 34 rescue, 1 fire and 1 power line related runs for June, 216 runs year to date.

Clerk Majewski reported that the provider of the porta johns at Shingle Lake Park and Silver Lake Park had finally returned our calls regarding the horrendous condition of the johns. He said that he was unable to service the units because his equipment was down. Fortunately another provider was found and they brought out fresh johns on July 5th. There was a request to post "no fishing" signs at the Silver Lake Park beach area due to hooks and line being found there. The township will not post signs restricting fishing from the park at this time.

Lakes Director R. Carey reported that persons using the DNR boat launch on Lake George are now required to have a Recreation Passport on their vehicle to be on the premises. Certain plate types, such as ex-POW, disabled vet, and Medal of Honor plates are not required to have the Recreation Passport.

Motion by Zimmerman to approve the Region 7 Area Agency of Aging Worksite Agreement, second by Tobin, all in favor, motion carried.

---

Motion by Zimmerman to approve separating the Zoning Administrator and Ordinance Enforcement Officer jobs and responsibilities, second by Bridges, all in favor, motion carried.

Motion by Zimmerman to approve a salary of $300.00 per month for the position of Ordinance Enforcement Officer, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to accept the resignation of Zoning Administrator Mary Abbott, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to accept the resignation of Planning Member Sharon Bridges, second by Carey, all in favor, motion carried.

Motion by Zimmerman to accept the resignation of Planning Member Dawn Holzer, second by Bridges, all in favor, motion carried.

The board discussed aspects of the Zoning Ordinance that still need amending. There will be a public hearing on 12 August, 2019. Clerk Majewski will get the details put together and published.

---

**Public Comment:** There were questions regarding the removal of Deepak Gupta from his position at the Clare County Road Commission. Commissioner Haskins declined to comment based on employee privacy.

Motion to adjourn the meeting by Zimmerman, second by Tobin, all in favor, meeting adjourned at 7:45 P.M.

*Respectfully Submitted,*

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2019-08-12-board-meeting', 'Board Meeting — August 12, 2019', '2019-08-12', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM.

Pledge of Allegiance.

**Roll Call:** Present was Zimmerman, Majewski, Tobin, Carey and Bridges.
**Also present** was Fire Chief D. Majewski, Lakes Dir. R. Carey, Building Insp. Mantei, Deputy Huck and 6 other interested persons.

---

Minutes of the July 08, 2019 meeting approved as presented.

Treasurer''s report accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, all in favor, motion carried.

Correspondence: EGLE Permits for a seawall at 1221 Arbor and 1723 Arbor.

County Commissioner D. Majewski reported that there will be an approximate savings on the County health care premium of $100,000.00. However, the DHS increased the county share for the mandated health care program (Medicaid) and that will cost $100,000.00.

---

## Public Hearing — Zoning Ordinance Amendments

At 7:11 PM, Supervisor Zimmerman opened the Public Hearing regarding the proposed amendments to Ordinance #44, The Lincoln Township Zoning Ordinance; for which a Public Notice was published on 25 July, 2019 in the Clare County Cleaver.

**Public Comment:** None offered.

Motion by Zimmerman to adopt resolution 081219-A, a resolution amending the Zoning Ordinance as follows: Article 20.9, E3, Total Area of All Accessory Buildings. Strike the last sentence: The maximum total square foot area of all accessory buildings for a dwelling shall comply with the area limitations of the following table. In the case of a nonconforming lot due to deficient lot area, the maximum permitted total square foot area of all accessory buildings shall be reduced by the same percentage (%) as the percentage by which the lot area is less than the minimum required lot area for the district. Second by Carey, roll call vote, 5 yes, resolution adopted.

Motion by Zimmerman to adopt resolution number 081219-B, a resolution to amend the Zoning Ordinance as follows: Article 14, Section 14.8, B1 Natural Feature Set Back Required. Strike sixty (60); add fifty (50): Unless otherwise specified in this Ordinance, a natural features setback of fifty (50) feet shall be maintained from the natural feature edge for all buildings, and any structures in excess of three (3) feet in height above the ground below, except that where there exists one (1) or more dwellings located along such natural feature within one hundred fifty (150) feet of a side lot line of the lot on which construction is proposed, the required setback shall be the average setback of such existing dwellings, measured from the natural feature edge. However, in no case shall such natural feature setback be less than twenty-five (25) feet nor shall such setback be required to be greater than fifty (50) feet. Second by Tobin, roll call vote, 5 yes, resolution adopted.

Motion by Zimmerman to adopt resolution number 081219-C, a resolution to amend the Zoning Ordinance as follows: Article 3, Footnotes for Table 3-4, 5b and 5c: Correct typographical errors: from "Article 2" to "Article 21" - Definitions in both sentences. AND Article 20, Section 20.11 Fences and Walls; correct typographical error in A6. "See Section 20.20" to "See Section 20.15" regarding clear vision zones. Seconded by Tobin, roll call vote, 5 yes, resolution adopted.

Motion by Zimmerman to leave the definition of the word structure as it is currently defined in the Zoning Ordinance, second by Carey, all in favor, motion carried.

Motion by Carey to adopt resolution number 081219-E, a resolution to amend the Zoning Ordinance as follows: Article 20.9, E3, Total Area of All Accessory Buildings: Strike last sentence. The maximum total square foot area of all accessory buildings for a dwelling shall comply with the area limitations of the following table. In the case of a nonconforming lot due to deficient lot area, the maximum permitted total square foot area of all accessory buildings shall be reduced by the same percentage (%) as the percentage by which the lot area is less than the minimum required lot area for the district. Second by Bridges, roll call vote, all in favor, resolution adopted.

Motion by Zimmerman to adopt resolution 081219-F, a resolution to amend the Zoning Ordinance as follows: Article 21, Definitions; amend definition of Kennel from three (3) or more to four (4) or more. Kennel: A lot or premises on which four (4) or more dogs, or four (4) or more cats, or four (4) or more similar animals, three (3) months of age or older, are kept for compensation, either permanently or temporarily, for the purposes of breeding, boarding, housing, leasing, sale, or transfer. Second by Tobin, roll call vote, all in favor, resolution adopted.

Motion by Zimmerman to not amend the definition of the word "minor" in the Lincoln Township Ordinance 34, the Parental Responsibility and Hours of Curfew Ordinance, to "under (18) eighteen years of age", as recommended, second by Carey, all in favor, motion carried.

Motion by Carey to not make the recommended change to the Lincoln Township Ordinance 30, the Parks and Public Grounds Ordinance, in regards to adding "service animals" to Section 4: General Unlawful Acts, 4.14, second by Zimmerman, all in favor, motion carried.

---

**Public Comment:** There will be a ZBA Hearing on September 06, 2019 at 7:00 PM.

The Public Hearing was closed at 7:48 PM.

---

Fire Chief D. Majewski reported 68 total runs for the month of July. 58 rescue, 5 fire, 4 powerline, and 1 weather related calls. This is the most runs on record for any month. Year to date is 330 runs.

Clerk Majewski reported that there is a Risk Reduction grant opportunity from the Michigan Townships Participating Plan in October and Clerk Majewski will seek a grant for security cameras for the Shingle Lake Park at that time.

Motion by Zimmerman to approve a general fund expenditure of $2800 for the purpose of Rustic Hardwood Flooring, Bill Sian, to sand and refinish the front area of the Township Hall wood floor, second by Bridges, all in favor, motion carried.

Motion by Zimmerman to approve a fire fund expenditure of $17,250.00, for the purpose of Britton Roofing replacing a Duro-Last roof, new fascia, tear off and clean up, on the front of the fire hall, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to approve a fire fund expenditure of $15,945.85, for the purpose of CSI Apparatus repairing the chain case, and rebuild pump and gear box on the Engine, second by Bridges, all in favor, motion carried.

Motion by Zimmerman to appoint Dean Kress to the position of Ordinance Enforcement Officer, effective September 01, 2019, second by Bridges, all in favor, motion carried.

Motion by Zimmerman to appoint Roger Carey as Zoning Administrator, effective September 07, 2019, second by Bridges, 4 in favor, Treasurer Carey abstains, motion carried.

---

**Public Comment:** Comment regarding little kids driving around on golf carts in the Silver Lake area; comment on a benefit dinner for Tina VanDyke on Friday August 23rd from 5:30PM to 8:30PM.

Motion by Bridges to adjourn the meeting, all in favor, meeting adjourned at 8:05 PM.

*Respectfully Submitted,*

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2019-09-09-board-meeting', 'Board Meeting — September 9, 2019', '2019-09-09', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7PM.

Pledge of Allegiance.

**Roll Call:** Present was Zimmerman, Majewski, Bridges, Tobin and Carey.
**Also present** was Fire Chief/County Comm. D. Majewski, Zoning Administrator R. Carey, County Clerk Martin, and 2 other interested persons.

---

Minutes of the 12 August 2019 meeting approved as presented.

Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, all in favor, motion carried.

---

Reports were given by Commissioner Majewski, County Clerk Martin and Veterans Director Karl Hauser.

**Public Comment:** None Offered.

---

The fire department had 57 runs in August; 402 runs year to date. Engine One should be back in service this week.

The waters are off in the parks and cemetery in preparation for the winter months.

Zimmerman reported on his visits over the Labor Day weekend with the area property associations.

Silver Lake reported some street lights out, and concerns about golf carts being driven recklessly by adults and being driven by children under the age of 16. At Bertha Lake there was discussion about a few docks that may be dangerous due to disrepair, and the rough roads in Canoe subdivision. Shingle Lake property owners have noticed some shenanigans going on at the park; seems to be a lot of trash being strew about the park, particularly baby diapers. Lake George had complaints in regards to the golf carts being driven by children, mini bikes being driven on Arbor Dr. by children, and lots of careless and sometimes reckless behavior on Lake George such as, boats driving too close to docks, swimmers and other boaters/skier/wakeboarders in violation of the 100 foot rule. Also, lots of concern about the wake boats and the damage being caused to shorelines and seawalls.

---

**Public Comment:** Cindy Englehardt offered that persons with concerns about those wake boats should contact their representatives and complain to the DNR-EGLE. It was also mentioned that the Sheriff''s Department had been called to the Shingle Lake Park quite a few times this summer for fights and alcohol consumption.

Motion by Bridges to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 7:40 PM.

*Respectfully Submitted,*

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2019-10-14-board-meeting', 'Board Meeting — October 14, 2019', '2019-10-14', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM. Pledge of Allegiance.

**Roll Call:** Present was Zimmerman, Carey, Bridges, Majewski; absent-excused Tobin.
**Also present** was Fire Chief D. Majewski, Zoning Admin./Lakes Dir. R. Carey, Building Insp. Mantei and 3 other interested persons.

---

Minutes of the 09 September, 2019 regular meeting approved as presented.

Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills, second by Zimmerman, roll call vote, 4 yes, motion carried.

---

Zimmerman reviewed seawall permits from the EGLE for 744 Forest and 199 Windover.

The Superintendent of Farwell Area Schools gave a presentation in regards to the upcoming ballot proposal.

---

**Public Comment:** Cindy Engelhardt inquired as to how many square miles the township is; 36 sq. miles. She also inquired as to the population on Lake George; the 2010 census has us at about 1820 in population, however there is nothing that specifically identifies how many of that number are on Lake George.

Chief Majewski reported 26 rescue, 2 power line and 2 mutual aid runs for the month of September, 389 runs year to date. The Fire Department will have an Open House on Halloween from 5PM to 7PM. Donuts, Cider and Candy for the kids.

---

Motion by Majewski to approve a budget adjustment in the amount of $17,250.00 to the fire department building improvements line, for the new Dura Last roof, second by Zimmerman, all in favor, motion carried.

Motion by Carey to approve a general fund expenditure of not to exceed $7500.00 for the purpose of purchasing the GIS mapping for subdivisions, pending outcome of county action on same, second by Zimmerman, all in favor, motion carried.

---

Announcements:
Trunk or Treat is Oct. 31 at 5PM to 6PM at the township hall. School Election Nov. 05, 2019. Polls are open 7AM to 8PM.

**Public Comment:** There was a question in regards to zoning along Cedar Rd. for acres needed to have livestock.

Motion by Bridges to adjourn the meeting, second by Zimmerman, all in favor, meeting adjourned at 7:29PM.

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2019-11-11-board-meeting', 'Board Meeting — November 11, 2019', '2019-11-11', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order; there was a moment of silence after the following from our Supervisor. "Please, share a moment of silence to commemorate those that served in the past, those that stand on that wall, today, and especially, those that gave up all their tomorrows, so we could be here tonight."

Pledge of Allegiance.

**Roll Call:** Present was Zimmerman, Majewski, Carey, Bridges, and Tobin.
**Also present** was Building Insp. Mantei, Zoning Admin. R. Carey, Fire Chief/County Comm. D. Majewski. Guest: Road Commissioner Haskin. Other interested persons, 2.

---

Minutes of the 14 October 2019 meeting approved as presented.

Treasurer''s report accepted as presented. Treasurer Carey reported that KCI will be doing the printed, stuffing and bulk mailing of the tax bills again this year, and they are still saving us money.

Motion by Bridges to pay the monthly bills, second by Tobin, roll-call vote, 5 yes, and motion carried.

---

Zimmerman reviewed correspondence. EGLE reports that a seawall permit has been issued at 1020 Forest Blvd.

Road Commissioner Haskin made comments in regards to the Clare County Board of Commissioners recent action to put the question as to whether the Road Commission management should be under the County Board of Commissioners or remain under their own board of commissioners, on the ballot for the people to decide. Haskin said that Duane Rodgers has been hired as the new Manager. Haskin gave a brief account of Mr. Rodgers work history and education.

Supervisor Zimmerman asked Haskin what the road commission is doing to rectify the dangerous situation on Harding Ave; a one mile gravel project that has been ongoing for 2 years. Zimmerman visited the project site on approximately 12 October, 2019, at which time he noted that the sand base was very squashy and loose; he felt that the situation could easily pull a car off into the ditch. Clerk Majewski went out to the project site on 14 October, 2019 and found that the sand base was washing into the ditches. Culverts are 3/4''s full of sand. The gravel was laid down late October. The township received an email from 911 Director Marlana Terrain that the road was closed; emergency vehicles may get stuck and they should try to avoid. Zimmerman and Chief Majewski checked the road at that time and found that the gravel was washing off and there were deep erosion lines. Zimmerman asked Haskin what is the road commissions plan to fix this problem? Haskin had no answer.

Motion by Zimmerman to adopt resolution number 111119-A, a resolution to indicate the dissatisfaction on behalf of Lincoln Township (T 18 N R5 W) with the Clare County Road Commission due the state and condition of Harding Road in the Northeast Quadrant of the Township, one mile in length, between Monroe and Gladwin Road(s), second by Bridges, roll call vote, 5 yes, resolution adopted.

---

County Commissioner D. Majewski updated the board on the Court House security and the process concerning the proposed ballot initiative in regards to moving the Clare County Road Commission under the BOC. There will be 2 public hearings on the matter. The first one is on November 20, 2019. Treasurer Carey asked if Commissioner Majewski would check on the status of County Clerk Martin''s project to put deeds on the county website.

**Public Comment:** None Offered.

---

The Fire Chief reported that there have been 422 runs year to date. In October 2019 there were 32 rescue, and 2 power line related runs. The annual DOT inspection for the Tankers has been scheduled with CSI. The rescue had a recall on a programming issue and that has been resolved.

Clerk Majewski updated the board on the James and Robinson violations. Both situations are working their way through the legal system. There have been citations issued on both properties.

Zimmerman gave an update on the generator for the Township Hall. We have another bid, and it is from Heckman Electric in Harrison. Clerk Majewski will contact Heckman for more information.

Motion by Zimmerman to adopt resolution number 111119-B, a resolution regarding the Memorandum of Understanding with FEMA for use of the Lincoln Township Hall as a "post disaster" shelter, second by Carey, roll call vote, 5 yes, and motion carried.

Motion by Zimmerman to adopt the approved Michigan Hardship Guidelines and Township Asset Test, for Property Tax Relief request(s) for 2020, second by Carey, all in favor, motion carried.

Motion by Zimmerman to allow the use of the Township Hall for "pickle ball", with specific scheduling, equipment use and participant eligibility to be under the authority of the Township Clerk, second by Bridges, all in favor, motion carried.

Motion by Zimmerman to allow the use of the Township Hall for Pilates, Zumba and similar activities, with specific scheduling, equipment use and participant eligibility to be under the authority of the Township Clerk, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to allow the use of the Township Hall for the Kid''s Christmas Party on Sunday, 08 December, 2019, with specific scheduling and equipment use to be under the authority of the Township Clerk, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to allow the use of the Hamlin Field and Park for the annual "Kid''s" Easter Egg Hunt in April 2020 (date and time t.b.a.) with specific scheduling and equipment use to be under the authority of the Township Clerk, second by Tobin, all in favor, motion carried.

---

**Public Comment:** There was comment on how good the exercise activities offered at the hall are for people, including those that visit from neighboring townships. Tobin asked Haskin why Deepak Gupta had been let go. Haskin said he could not disclose that and that Gupta had signed a non-disclosure. Tobin said that it doesn''t seem right that the Road Commission has let two people go in the last few years and the tax payers are forking the bill for their settled contracts amount to several hundreds of thousands of dollars.

Motion by Tobin to adjourn the meeting, second by Bridges, all in favor, meeting adjourned at 7:52PM.

*Respectfully Submitted,*

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2019-12-09-board-meeting', 'Board Meeting — December 9, 2019', '2019-12-09', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7PM.

Pledge of Allegiance.

**Roll Call:** Present was Zimmerman, Majewski, Carey, Bridges, and Tobin.
**Also present** was Building Insp. Mantei, Zoning Admin. R. Carey, Fire Chief/County Comm. D. Majewski, Ord. Enforcement D. Kress, Deputy Gerbe. Other interested persons, 2.

---

Minutes of the 11 November, 2019 meeting approved as presented.

Treasurer''s report accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll-call vote, 5 yes, and motion carried.

---

Zimmerman reviewed correspondence.

County Commissioner D. Majewski reported that there is the possibility of several county wide ballot proposals in 2020 starting with the March Presidential Primary. On the March Primary is the Transit request for increase and Mid-Michigan College request for increase. Those also considering 2020 millage requests are the Sheriff''s Dept. for a road patrol millage, Clare County for Gypsy Moth Millage, the MSU Extension for a millage to fund the extension office, and the County for a Headlee override.

Commissioner Majewski said that he thinks that before Clare County asks for more tax dollars it really ought to get its own house in order and learn to live within their means and stop taking from fund balance. Commissioner Majewski said he has not voted to approve a county budget in the last several years because of the continued deficit spending habits of the County.

---

**Public Comment:** Cindy Engelhardt asked if it is true that Clare County has the lowest paid Deputies in the state. No one knew the answer.

---

The Fire Chief reported that there have been 484 runs year to date. In November 2019 there were 47 rescue, and 2 power line, 1 fire, and 2 mutual aid related runs.

Motion by Zimmerman to authorize a fire fund expenditure of $7886.60 for repairs to the Engine #1 at CSI, second by Bridges, all in favor, motion carried.

Motion by Majewski to approve a budget adjustment of $1852.12 to line 101-265-930-00, repairs and maintenance, for repairs done to the maint. vehicle which were reimbursed by the insurance company for car-v-deer accident, second by Zimmerman, all in favor, motion carried.

Motion by Zimmerman to approve a rubbish fund expenditure of $5446.35, ($605.15 monthly X 9 mos.) a retroactive payment for March 2019 through November 2019 to cover the cost of the 3% annual increase for rubbish services, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to approve the annual 3% increase for rubbish services per the contract, for the balance of the contract year, from December 2019 through February 2020, further, that the following contract year being March 2020 through February 2021 also be approved at a rate of 3% per the contract, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to approve the bid from Heckman Electric for the purchase and installation of a 27K Generac Generator for the Township Hall, in the amount of $18,103.00, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to adopt resolution number 120919-A, a resolution regarding the township rejecting the offer of acquiring the tax delinquent unsold properties, second by Tobin, roll call vote, 5 yes, resolution adopted.

---

**Public Comment:** BOR is Tuesday and where do delinquent properties go? The Land Bank to be sold at auction.

Motion by Bridges to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 7:27PM.

*Respectfully Submitted,*

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2020-01-13-board-meeting', 'Board Meeting — January 13, 2020', '2020-01-13', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7PM.

Pledge of Allegiance.

**Roll Call:** Present were Zimmerman, Carey, Bridges, Majewski and Tobin. **Also present:** Fire Chief Majewski, Zoning Admin. Carey, Sheriff Wilson, Deputy Huck and 2 other interested persons.

---

Minutes of the 09 December, 2019 meeting approved as presented.

Treasurer''s report accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, 5 yes, motion carried.

---

County Commissioner D. Majewski reported that the County Board of Commissioners has agreed to appoint 2 additional road commissioners. The Board of Commissioners is accepting applications to fill those positions and then the positions will go on the August 2020 primary and November 2020 General election. Persons interested in running for those positions should contact the County Clerk''s Office for filing information.

There was discussion about the blight situation at the rental unit located at 150 Arthur Rd and owned by Floyd and Joan Robinson. The tenant, Loren Robinson, has been issued several citations from the Clare County Sheriff''s Department. The situation is currently working its way through the legal system.

**Public Comment:** None Offered.

---

Chief Majewski reported that there had been a recent run to White Birch Lakes for a CO2 detector going off. Turns out that the CO2 detector this family had was given to them by the Fire Department at the annual Neighborhood Watch EXPO in Lake George.

Cemetery Commissioner Tobin said that due to the rainy weather in the fall, Elm Creek was not able to complete the leaf clean up. They will be out first thing in the spring.

Deputy Huck reported on some breaking and entering''s in the Township. An arrest has been made and the situation is being investigated. Some of the stolen property was recovered.

---

Motion by Zimmerman to approve the grant application to the State of Michigan Bureau of Elections for the shared tabulator funding, and to approve the 50% matching funds of $2647.50 for the tabulator if the grant funds are made available to Lincoln Township, second by Carey, all in favor, motion carried.

There was discussion on the ballot tabulator and the ballot marking machine also known as the ICP and ICX. The State of Michigan has covered the maintenance agreement cost for 5 years. The township is required to take over maintenance costs for the next 5 years. The cost will be approximately $3050.00 total for the 5 years; payable in 2021.

There was discussion in regards to the disposal of the old generator and garage door openers from the fire hall. None of the items are in working order. The service agency for the generator, Apcom Electric, said that the parts needed to fix it are not only difficult to find, they exceed the value of the unit.

Motion by Zimmerman to allow maintenance to take the items discussed to scrap for metal weight, second by Tobin, all in favor, motion carried.

**Public Comment:** None Offered.

---

Motion by Bridges to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 7:52PM.

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2020-02-10-board-meeting', 'Board Meeting — February 10, 2020', '2020-02-10', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7PM.

Pledge of Allegiance.

**Roll Call:** Board members present were Zimmerman, Majewski, Bridges, Carey and Tobin. **Also present:** Zoning Admin. R. Carey, Ordinance Enf. Officer D. Kress, Fire Chief/County Commissioner D. Majewski and John Cottenham from the US Census Bureau.

---

Minutes of the 13 January 2020 regular meeting approved as presented.

Treasurer''s report was presented and accepted.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, 5 yes, motion carried.

---

Zimmerman reviewed correspondence from EGLE regarding a seawall permit at 903 Arbor Dr. (Wiesenburger)

County Commissioner D. Majewski updated the board on adding two commissioners to the road commission. He said that there were 15 applications submitted and one has withdrawn.

John Cottenham, US Census Recruiter, did a presentation on the need for enumerators in Clare County. Hours are 20 to 40 per week, $16 per hour and mileage reimbursed at the federal rate. Applications are being taken at the Michigan Works Office in Harrison.

**Public Comment:** None Offered.

---

Fire Chief D. Majewski reported 36 rescue, 2 fire, 1 mutual aid related runs for January; 39 runs year to date.

Planning Commission still needs members and there will be no February meeting.

Dennis read a letter of resignation from Cindy Engelhardt from the Zoning Board of Appeals effective at the end of her term in May 2020 or before if we find someone to fill her seat.

Motion by Zimmerman to accept the resignation of Cindy Engelhardt from the Zoning Board of Appeals with regrets, second by Tobin, all in favor, motion carried. Zimmerman offered our many thanks to Cindy for her service.

Motion by Zimmerman to approve a general fund expenditure of $102.79 for the purpose of purchasing a bar code scanner for checking in AV ballots in to the Qualified Voters File, second by Tobin, all in favor, motion carried.

**Public Comment:** None Offered.

---

Motion by Bridges to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 7:31PM.

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2020-03-09-board-meeting', 'Board Meeting — March 9, 2020', '2020-03-09', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7PM.

**Roll Call:** Present were Zimmerman, Majewski, Tobin, Bridges and Carey. **Also present:** Ord. Enforcement Officer D. Kress, Zoning Admin. R. Carey, Fire Chief/Commissioner D. Majewski, Road Commissioner M. Harmon and 5 other interested persons.

---

Minutes of the 10 February 2020 regular meeting approved as presented.

Treasurer''s report accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, 5 yes, motion carried.

---

Commissioner D. Majewski reported that there are tentative discussions on putting a millage request on the ballot for Gypsy Moth Suppression; the County Board of Commissioners has appointed Merle Harmon and Bill Simpson to the Road Commission Board; the County continues to struggle with budget issues and there is the potential for cuts to non-mandated services and personnel.

Road Commissioner M. Harmon reported that the plan for Harding Road is to lay down quick lime a.k.a., calcium carbonate which costs $5000.00 to $6000.00 for the mile. Harmon plans to keep this topic on the Road Commission meeting agenda until it is resolved. Harmon said that citizens can reach him by email at Clarecountyroads@gmail.com or by calling the road commission office.

**Public Comment:** There was question on seawall permits and a question in regards to having the township do a five year plan so that grants can be applied for. There is already a five year plan; it is referred to as the Recreation Plan.

---

Motion by Zimmerman to renew the Compost Field Site Registration with the State of Michigan and to approve a general fund expenditure of $600.00 for the registration fee, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to adopt resolution number 030920-A, a resolution regarding the Clare County Community Development to conduct building inspections and issue building permits in the Township of Lincoln, second by Bridges, roll call vote, 5 yes, resolution adopted.

Motion by Zimmerman to adopt resolution number 030920-B, a resolution regarding the policies for the 2020 Board of Review, second by Tobin, roll call vote, 5 yes, resolution adopted.

Motion by Zimmerman to renew the Assessors Contract with Taylor Assessing to March 31, 2022, second by Majewski, all in favor, motion carried.

**Public Comment:** Comments made regarding the trailer that burned by the fire hall and other rotting trailers on Shingle Lake Dr. and comment on chickens and roosters.

---

Motion by Bridges to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 7:56PM.

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2020-03-11-special-meeting', 'Special Meeting — Security Camera System — March 11, 2020', '2020-03-11', 'Special Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 3PM.

**Roll Call:** Present were Zimmerman, Majewski, Tobin, Bridges and Carey. **Also present:** Jason Gregory from JML Commnorth Blutech Data, LLC.

---

Supervisor Zimmerman stated that the reason for the special meeting with Jason Gregory was to discuss and consider a camera security system.

There was discussion in regards to the need for a system, the benefits to the community, how it might assist law enforcement, the insurance company, the location of cameras and the proposed cameras capabilities.

Jason Gregory explained how the system works, definition of the cameras and options available. The bid received would be for 10 cameras at a cost of $10,470.00. There is no monthly maintenance fee. It was agreed that the primary problem area in the township is the Shingle Lake Park, other areas, such as downtown and township hall and fire hall may benefit from camera surveillance. The Sheriff would be able to view footage remotely from Central Dispatch. The system would record for 14 days. Permission must be sought from Consumers to place cameras on those poles.

The company will perform lighting tests in town and test a "license plate camera" and get back to the township with results.

The proposed project will be reviewed and considered at the 13 April 2020 regular meeting.

**Public Comment:** None offered.

---

Motion by Carey to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 3:42PM.

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2020-05-11-board-meeting', 'Board Meeting (Zoom) — May 11, 2020', '2020-05-11', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:01 PM.

Pledge of Allegiance.

**Roll Call:** Present were Zimmerman, Majewski, Carey, Tobin and Bridges. **Also present:** Freeman Township Supervisor Housler, Zoning Admin./Lakes Dir. R. Carey and Commissioner/Fire Chief D. Majewski, Planning Member McCaslin, and Sharon Bridges.

---

Minutes of the 09 March 2020 Regular meeting approved as presented.

Minutes of the 11 March 2020 Special meeting approved as presented.

No minutes for April 2020 due to no meeting being held for lack of quorum.

Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, 5 yes, motion carried.

---

Supervisor Zimmerman reviewed correspondence from EGLE in regards to a sea-wall permit for Bringedahl and a permit for a pole structure in a wet land for Beeman.

County Commissioner D. Majewski said that the County Board of Commissioners has suspended all hiring, travel and non-mandated spending and ordered a 10% reduction in each department; the company that cleans the Court House will reduce to halls and bathrooms and staff will clean their own offices. The payroll dept. has reduced by one person, the animal control department has reduced by one person. There will likely be more cuts to come in the near future. Wording for the Animal Control August ballot initiative and for the MSU Extension August ballot initiative were approved.

---

Motion by Zimmerman to approve the Professional Lakes Management Proposals for Lake George a range of $17,500-$25,000, Shingle Lake a range of $7,000-$10,000 and Bertha Lake a range of $8,000-$10,000, second by Carey, all in favor, motion carried.

Motion by Zimmerman to approve a general fund expenditure of $1159.06 for the purpose of purchasing 6 sneeze guards for elections, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to approve a general fund expenditure of $200.00 plus shipping, for the purpose of purchasing 10 corrugated plastic table top voting privacy screens, second by Majewski, all in favor, motion carried.

Motion by Zimmerman to approve a budget adjustment to the township hall equipment line 101-265-977-01, in the amount of $14,603.00 for the generator, second by Carey, all in favor, motion carried.

Motion by Zimmerman to approve the Clare County Equalization Contract in the amount of $3920.00, second by Tobin, all in favor, motion carried.

---

Zimmerman announced that the annual Budget Meeting and Annual Corporate Meeting will be 25 June 2020 at 4:00PM.

Motion by Zimmerman to adopt resolution number 051120-A, a resolution regarding the Supervisor''s recommendation for a wage freeze for elected officials for fiscal year 2020, second by Bridges, roll call vote, 5 yes, resolution adopted.

Motion by Zimmerman to adopt resolution number 051120-B, a resolution regarding an Employee Firearms Policy, second by Tobin, roll call vote, 5 yes, resolution adopted.

Motion by Zimmerman to adopt resolution number 051120-C, a resolution regarding the Capitalization Policy, second by Carey, roll call vote, 5 yes, resolution adopted.

Motion by Zimmerman to adopt resolution number 051120-D, a resolution regarding the Election Emergency Response Plan, second by Bridges, roll call vote, 5 yes, resolution adopted.

Motion by Zimmerman to adopt resolution number 051120-E, a resolution to adopt the FEMA Guidelines in response to the COVID-19 Pandemic, second by Tobin, roll call vote, 5 yes, resolution adopted.

Motion by Zimmerman to adopt resolution number 051120-F, a resolution to adopt the CDC Guidelines in response to the COVID-19 Pandemic, second by Majewski, roll call vote, 5 yes, resolution adopted.

---

Zoning Administrator R. Carey presented 4 zoning ordinance amendments for consideration. The proposed amendments will be presented to Planning and the Township''s legal counsel for review.

Announcements:

- Clare County handling the township''s building permits now.
- Dust control brining for 2020 will be done on or about 11 May, 01 July and 28 August.
- Consumers has been changing out street lights to the LEDs. There have been approximately 15 changed out so far.

Chief Majewski reported that the Fire Department has received a grant from Trans Canada in the amount of $5000.00 for purchasing items such as, CO2 detectors, smoke detectors, and fire extinguishers for the community safety program. There were 21 rescue, and 2 fire related runs for April, 135 runs year to date.

Social distancing signs have been ordered for the parks.

The cemetery has been "spring cleaned".

Motion by Zimmerman to appoint Sharon Bridges to the Planning Commission, second by Majewski, all in favor, motion carried.

**Public Comment:** Tami McCaslin said that Silver Lake area has been brined and that she had noticed some of the new LED street lights. Dennis Zimmerman and Al Housler shared their recent discussions with the road commission regarding the chip seal joint townships project on Hemlock (the dividing line of Lincoln and Freeman Townships). The estimate for that project is $23,000.00 per township and will likely be a 2021 project.

---

Motion by Bridges to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 7:44PM.

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2020-06-08-board-meeting', 'Board Meeting — June 8, 2020', '2020-06-08', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM.

Pledge of Allegiance.

**Roll Call:** Present were Zimmerman, Majewski, Carey, Bridges and Tobin. **Also present:** Road Commissioner Bill Simpson, Deputy Oster, County Comm./Fire Chief D. Majewski and 13 other interested persons.

---

Minutes of the 11 May 2020 regular meeting approved as presented.

Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, 5 yes, motion carried.

---

Road Commissioner Bill Simpson introduced himself and took information in regards to a stop sign at Woodland Walk and Hunter in Silver Lake.

County Commissioner D. Majewski gave an update on the County''s budget struggles. They have implemented a 10% reduction in each department; there have been layoffs, the cleaning contract has been reduced. There will be 3 millage requests on the August ballot pertaining to the Animal Shelter, MSU Extension and 911 Surcharge.

**Public Comment:** Comments and questions included: 2 trailers on Shingle Lake Dr. that are blighted, need beach sand at Shingle, fish stocking at Silver, weeds in the beach area at Silver, 35 chickens at Silver Lake causing issue with odor and attracting vermin, wake boats causing shore damage on Lake George, meth problem at Bertha Lake, and repairs to a permanent dock.

---

Chief D. Majewski reported 40 rescue, 6 fire, and 1 power line related runs for May, 179 runs year to date.

Porta Johns for Shingle Lake and Silver Lake are on hold at this time due to the Covid 19. We will get them in as soon as we can.

Tina VanDyke''s funeral service will be Saturday June 20th at Campbell Stocking in Farwell from 11AM to 1PM. Tina served Lincoln Township in several capacities over 20 years; on the Board of Review, as Deputy Clerk and as an Elections Inspector. Tina was a friend to many and will be missed greatly.

Zimmerman reported that the Harding Rd. project and the Lake St. project are complete and that the Chip Seal on Hemlock joint project with Freeman Township is slated for 2021.

Motion by Zimmerman to approve a road fund expenditure of $1628.76 for Lake St. and $51,000.00 for Harding Ave., second by Bridges, all in favor, motion carried.

---

Motion by Zimmerman to approve the annual Michigan Township Association Dues of $1802.58 and Legal Defense of $54.08, for the fiscal year July 01, 2020 to June 30, 2021, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to approve a general fund expenditure of $1900.00 for the MTA online unlimited learning access and bonus courses for Elected Officials, Planning Board, Zoning Board and Board of Review, second by Carey, all in favor, motion carried.

Motion by Majewski to approve a fire fund expenditure of $4065.00 for the fire department Provident Accident and Health Plan for fiscal year July 01, 2020 to June 30, 2021, second by Carey, all in favor, motion carried.

**Public Comment:** There are 3 trees near the Shingle Lake boat launch that appear to be dead.

---

Motion by Bridges to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 7:55 PM.

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2020-07-13-board-meeting', 'Board Meeting — July 13, 2020', '2020-07-13', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7PM.

Pledge of Allegiance.

**Roll Call:** Present were Zimmerman, Majewski, Carey, Bridges, and Tobin. **Also present:** Zoning Admin R. Carey, Fire Chief/Commissioner D. Majewski, and 9 other interested persons.

---

Minutes of the 08 June, 2020 meeting approved as presented.

Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call, 5 yes, motion carried.

---

County Commissioner D. Majewski said that the court house is open, masks are required for entrance. The Gypsy Moth proposal will go on the November ballot. Call Melissa Townsend at the Conservation District 989-539-6401 to report Gypsy Moth. There have been 31 cases of Covid 19 in Clare County and 3 deaths.

**Public Comment:** Comments in regards to Woodland Walk in Silver Lake and plans to proceed with improvements there. Numerous complaints regarding a group of kids using sexually explicit and vulgar language at the Silver Lake Park Beach; these complaints have been sent to the Sheriff.

---

Chief Majewski reported 31 rescue, 3 powerline and 1 mutual aid related runs for the month of June, 2020. 295 year to date.

Motion by Zimmerman to adopt resolution number 071320-A, a resolution to exercise "First Right of Refusal" on tax delinquent properties, second by Carey, roll call vote, 5 yes, resolution adopted.

Motion by Zimmerman to authorize the clerk to apply for the Michigan Department of Treasury Hazard Pay Premium Program Grant for our eligible first responders in amount of $1000.00 each, to agree to pay the associated payroll taxes and fringes, and that the hazard pay is contingent upon receipt of the grant, second by Bridges, all in favor, motion carried.

Motion by Zimmerman to authorize publishing notice for a Planning Commission public hearing on 11 August, 2020 at 7PM for the purpose of hearing comments in regards to proposed amendments to the zoning ordinance, second by Bridges, all in favor, motion carried.

Motion by Zimmerman to waive the $450.00 fee for a variance application filed by the Lake George Boosters Club, second by Tobin, roll call vote, Zimmerman -- yes, Tobin -- yes, Carey -- No, Majewski -- No, Bridges -- No, motion failed.

Motion by Majewski to approve the Region VII Area Agency on Aging Older Worker Program annual agreement, second by Zimmerman, all in favor, motion carried.

Motion by Zimmerman to approve a general fund expenditure of $144.00 plus shipping for 2 swing seats and chains for the swing set at the Shingle Lake Park, second by Carey, all in favor, motion carried.

**Public Comment:** None offered.

---

Motion by Bridges to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 7:48 PM.

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2020-08-10-board-meeting', 'Board Meeting (Zoom) — August 10, 2020', '2020-08-10', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:02 PM.

**Roll Call:** Present were Zimmerman, Carey, Bridges, Tobin and Majewski. **Also present:** Fire Chief Majewski, Zoning Admin. R. Carey, Planning Member McCaslin, Doug Jacobson, MMCC Board Trustee, and 1 other interested person.

---

Minutes of the 13 July 2020 regular meeting were approved as presented.

Treasurer''s report was accepted as presented.

Motion by Tobin to pay the monthly bills, second by Bridges, roll call vote, 5 yes, motion carried.

---

County Commissioner D. Majewski reported that the budgeting process is underway. The millage for animal control passed, so that will free up some funds for other departments.

Doug Jacobson, Trustee from Mid Michigan Community College said that the annual BBQ has been cancelled. He also reported that some classes will be held online and by Zoom this fall. There will need to be some in person classes. Face Shields and masks and other PPE and precautions will be utilized. There will be no fall sports this year.

Chief Majewski reported that the fire department personnel are wearing PPE at the hall, in equipment and on runs.

The swings for the park came; however, the clevises need replacement and those are being ordered.

Planning will have a special hearing at 7PM on 8/11/20 for the purpose of considering amending the Zoning Ordinance. Recommendations will be forwarded to the Board for consideration in September.

---

Motion by Zimmerman to approve the road construction agreement for chip sealing 3.1 miles of Hemlock Rd, in the amount of $31,506.00 Lincoln Township share, second by Tobin, all in favor, motion carried. (This is a shared project with Freeman Township and the Road Commission.)

Motion by Zimmerman to appoint Deb Trim as Ordinance Enforcement Officer effective 10 August, 2020, second by Bridges, all in favor, motion carried.

Zimmerman advised the board that the clerk needs some space on the main level of the Township Hall to store the growing amount of election equipment and supplies. A wall will need to be constructed in the back room for security purposes.

Brining will be on or about 28 August 2020 prior to the Labor Day weekend.

**Public Comment:** Comments were made in regards to a gun shot in the beach area of Silver Lake; and a domesticated duck family having been dropped off at the Silver Lake Beach.

---

Motion by Tobin to adjourn the meeting, second by Bridges, Meeting adjourned at 7:25 PM.

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2020-09-14-board-meeting', 'Board Meeting (Zoom) — September 14, 2020', '2020-09-14', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7PM.

**Roll Call:** Present were Zimmerman, Majewski, Carey, Bridges and Tobin. **Also present:** Fire Chief D. Majewski and Zoning Admin. R. Carey, T. McCaslin and one other interested person.

---

Minutes of the 13 July 2020 regular meeting held by Zoom, approved as presented.

Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, 5 yes, motion carried.

---

County Commissioner D. Majewski said that the Gypsy Moth millage proposal will be on the November ballot. There will be spraying for the mosquito spread Eastern Equine Encephalitis; the spray area includes areas in Clare County where the virus has been identified. Treasurer Carey asked Commissioner Majewski to inquire to equalization about the plat map overlays and if there will be a charge to the townships for that service.

Chief Majewski reported 38 Rescue, 1 Fire, and 1 Powerline related runs for August, 316 year to date.

Chief Majewski reported that he is making some changes to the fire officer''s duties and adding a Lieutenant of Compliance and Safety; and adding to the Assistant Chief the NFIRS reporting.

There was discussion in regards to suspending the cadet program. It was agreed that it is best to suspend the program due to possibly exposing cadets to Covid-19.

There were hypodermic needles found in the porta john at Shingle Lake Park.

---

Motion by Zimmerman to approve a special assessment expenditure of $4500.00 for the purpose of Bauer Excavating doing the leveling and grading in Canoe Sub, second by Tobin, all in favor, motion carried.

The board discussed the municipal security camera project. The project is on hold indefinitely due to the unknown financial impacts of Covid-19.

Carey said that a camera at Shingle Lake Park would probably help with the vandalism and other shenanigans at the park; Tobin said that a camera in the downtown may have helped law enforcement solve the hit and run on the corner. Another light pole has been hit and badly damaged and no one knows who hit it.

Motion by Majewski to approve the townships legal counsel to proceed with the acquisition of the old school house, second by Zimmerman, all in favor, motion carried.

Motion by Carey to for Tobin to look in to the deed issue and title issue on the old school house prior to sending it to legal counsel, second by Bridges, all in favor, motion carried.

Motion by Zimmerman to approve a general fund expenditure of $500.00 for the purpose of purchasing stamps for the Absent Voter ballots, second by Tobin, all in favor, motion carried.

---

Motion by Zimmerman to appoint Richard Hassberger to the Planning Commission from September 14, 2020 to September 30, 2023, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to approve the Michigan Chloride bill of $11,349.64 for the fall road brining, as well as a portion of the May 2020 brining, which was not invoiced until late August, second by Bridges, all in favor, motion carried.

The plans for Halloween are that we will proceed with caution and make decision as we get closer.

Planning will bring its Zoning Ordinance Amendment recommendations to the board in October.

Tobin request that a sign be put up at the hall in regards to the hall being open only to essential workers and staff; all others by appointment.

There will be a ballot drop box out front of the hall for absentee ballot returns.

**Public Comment:** There were 2 comments; one in regards to blight in the Silver Lake area and one about the camera vendor that White Birch used for their camera system.

---

Motion by Zimmerman to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 8:15 PM.

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2020-10-12-board-meeting', 'Board Meeting — October 12, 2020', '2020-10-12', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7PM. Meeting held in person and by Zoom.

**Roll Call:** Present in person were Zimmerman, Majewski, Carey, Tobin and Bridges.
**Also present** in person was D. Majewski, R. Carey and one other interested person. Present by Zoom was T. McCaslin.

---

Minutes of the 14 September, 2020 meeting approved as presented.

Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll-call vote, 5 yes, motion carried.

---

County Commissioner D. Majewski reported that the 2020/2021 budget has been adopted; the animal shelter millage approval helped to bring balance to the county budget. The bond resolution for the building purchase for the Senior Center in Clare was adopted. The 1 mil proposal for Gypsy moth suppression is on the November 3rd ballot.

Fire Chief D. Majewski reported 21 rescue, 1 power line and 1 fire related runs for August 2020; 320 runs year to date. There is a new applicant to the fire department, Louis Velazco. The Fire Fighter I class has been moved to January due to the ongoing Covid restrictions for class size. The Fire Department received the $14,000.00 hazard pay grant from the CARES ACT. The firefighters/medical first responders are very appreciative.

Zoning Administrator R. Carey will attend a virtual class on Land Divisions on October 22, 2020. Tami McCaslin will participate as well.

---

Motion by Zimmerman to authorize Clerk Majewski to expend the $5000.00 grant from Tech and Civic Life for election supplies including, but not limited to, postage, PPE, technology, wages, and signs, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to approve a general fund expenditure of $5,500.00 for the purpose of removing the 7 dead or dying oak trees near the pavilion and remove 4 trees near boat launch, grind stumps, remove debris, at the Shingle Lake Park, second by Bridges, all in favor, motion carried.

---

Motion by Zimmerman and seconded by Bridges to approve the zoning ordinance text amendments in regards to the definition of "attached garage" as recommended by the planning commission: A garage structurally attached to a building by either shared wall construction or by a fully and structurally enclosed corridor or similar fully enclosed architectural feature no more than eight (8) feet in length and five (5) feet wide. Roll vote, 5 yes, motion carried.

Motion by Zimmerman and seconded by Majewski to approve the zoning ordinance text amendments in regards to adding language to 20.9 Accessory Structures and Buildings as recommended by the planning commission, specifying that a building shall be considered an accessory building where such building is not structurally attached to the principal building by either shared wall construction or by a fully and structurally enclosed corridor or similar fully enclosed architectural feature no more than eight (8) feet in length and five (5) feet wide. Roll call vote, 5 yes, motion carried.

Motion by Zimmerman and seconded by Carey to approve the zoning ordinance text amendments in regards to recreational vehicle set backs in Sec. 20.8, to be consistent with dwellings as recommended by the planning commission, removing the requirement for a minimum distance of one hundred (100) feet from the front lot line. Roll call vote, 5 yes, motion carried.

Motion by Zimmerman to renew the Professional Lakes Management Contract for 2021 to include for Bertha Lake a range of $8000.00 to $10,500.00, for Shingle Lake a range of $7000.00 to $10,000.00 and for Lake George a range of $17,500.00 to $25,000.00, second by Tobin, all in favor, motion carried.

---

**Public Comment:** None offered.

Motion by Bridges to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 7:32 PM.

*Respectfully Submitted,*
*Carol L Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2020-11-09-board-meeting', 'Board Meeting — November 9, 2020', '2020-11-09', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM.

**Roll Call:** Present were Zimmerman, Majewski, Carey, Bridges and Tobin. **Also present:** Fire Chief D. Majewski, Zoning Admin. R. Carey, Rick Fancon from American Waste and 5 other interested persons. Virtually by Zoom was C. Tobin and R. Hassberger. All attendees in person observed social distancing and wore a mask.

---

Minutes of the 12 October 2020 meeting approved as presented.

Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, 5 yes, motion carried.

---

Chief D. Majewski reported 35 rescue, 2 powerline and 1 fire related runs for October.

Because of a request by the Township Clerk, and the cooperation of Sheriff Wilson and Undersheriff Midge, Sheriff''s Deputy Huckstein was in attendance at the polls on November 3rd all day. Several voters made a point to tell the Clerk that they appreciated Huck being around; that it made them feel safe and secure. The whole day went by fairly smooth, and the election staff were grateful to Huck for being there.

Rick Fancon from American Waste-GFL explained the proposed contract addendum, including the recycling birdhouse. American can provide a recycling collection birdhouse that does not require sorting, at the municipal parking area. The birdhouse will be there all the time. There is a cost for the service and that is approximately $5900.00 per year depending on how much is collected. It can be cancelled at any time. Concerns are persons from outside Lincoln Township using it. We will have to monitor and see if that is a problem.

---

Motion by Zimmerman to approve the American Waste Agreement Addendum, extending the contract three (3) years to February 29th, 2024; and to approve the first year of service at $11.90 per home, per month. Additionally, adding the birdhouse for collecting recycling for $5900.00 per year, second by Tobin, roll call vote, 5 yes.

Motion by Zimmerman to approve the Clare County Interlocal Agreement for County Designated Assessor (Jamie Houserman), second by Carey, all in favor, motion carried.

Motion by Zimmerman to appoint Marla Beougher to a 3 year term on the Zoning Board of Appeals, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to appoint Steve Bryant, Roger Carey, Cynthia Engelhardt, Joe Rentz -- alternate and Deb Trim -- alternate, for 2021-2022, second by Bridges, all in favor, motion carried.

Motion by Zimmerman to approve the Board of Review Poverty Threshold Amounts for the 2021 tax year as recommended by the I.R.S., second by Carey, all in favor, motion carried.

Motion by Zimmerman to adopt resolution number 110920-A, a resolution recognizing Becky Branam, Connie Tuck and Taby Simon for their outstanding contribution to the community in the careful planning and implementation of CDC guidelines during the Covid 19 Pandemic in order to safely have the Halloween Walk held at the Luke Hamlin Field on October 24th; second by Carey, roll call vote, 5 yes, resolution adopted.

---

Motion by Zimmerman to accept the Township''s annual audit done by Weinlander Fitzhugh, second by Tobin, all in favor, motion carried. Treasurer Carey stated that the audit found that there were no practical difficulties encountered, no misstatements and all the numbers balance.

Motion by Zimmerman to purchase from the INA Store one Kubota tractor in the amount of $22,500.00; including $1000 in dealer incentives and $10,000 on trade, second by Bridges, all in favor, motion carried.

Dennis reviewed potential road projects for 2021 which included Browns, Forest/Bungo/Ojibway/Ash and Arbor Dr. There was discussion on Ultra-Thin Asphalt in comparison to Chip and Fog. Dennis explained that Arbor and Forest projects would have a combined $40,000 Road Commission match and the Browns Rd gravel would be half of $99,969.45.

Motion by Zimmerman to approve a road fund expenditure of $49,984.73 township share, for the purpose of graveling Browns Road, East of the railroad tracks to the East end, second by Carey, all in favor, motion carried.

Motion by Zimmerman to approve a road fund expenditure of $92,000.00 less a yet to be determined portion of $40,000 Road Commission match for the purpose of Ultra-Thin Asphalt on Arbor Dr., second by Bridges, all in favor, motion carried.

Motion by Zimmerman to approve a road fund expenditure of $181,500.00 less the remainder of the $40,000 Road Commission matching funds, for the purpose of Ultra-Thin Asphalt on Forest/Bungo/Ojibway/Ash, second by Tobin, all in favor, motion carried.

**Public Comment:** Comment on a Variance hearing being held on December 09, 2020 and a question about clarifying the location of the Browns Rd. project.

---

Motion by Zimmerman to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 7:47 PM.

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2020-12-14-board-meeting', 'Board Meeting (Zoom) — December 14, 2020', '2020-12-14', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM.

**Roll Call:** Present were Majewski, Carey, Tobin, Bridges and Zimmerman. **Also present:** Fire Chief/County Comm. D. Majewski, Zoning Admin. R. Carey, and 5 other interested persons.

---

Minutes of the 09 November 2020 regular meeting approved as presented.

Treasurer Carey explained that she had received many calls from tax payers in regards to the increase in their taxes. There were 3 millage proposals passed by voters this year -- animal control, gypsy moth and 4-H. The addition of these millages increased tax bills. Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, all in favor by roll call, motion carried.

---

Supervisor Zimmerman reviewed correspondence from Mariann Anthony in regards to the conditions of North St., Hunter Dr. and Silver Lake Dr. She would like the township to gravel those roads. Zimmerman explained that he had sent over an email to the CCRC''s Leonard and Bondy for a price.

Commissioner D. Majewski reported that the Register of Deeds will now charge a Notary fee of $5.00. Clare County Senior Services has purchased a 2015 van for distribution and meal delivery in the Lake George area.

The Fire Chief reported 35 rescue, and 1 fire related runs for November. 402 runs year to date. Luis Velazco will attend Fire Fighter 1 class in January.

---

Zimmerman motioned to appoint Robert Keller as a regular member of the Zoning Board of Appeals, second by Tobin, all in favor, motion carried.

Motion by Zimmerman and seconded by Majewski to appoint Jamie Lease as an alternate member of the Zoning Board of Appeals, all in favor, motion carried.

Motion by Tobin to approve increasing the burial fees at the Lincoln Township Cemetery and the Kilbourn Cemetery effective on January 01, 2021:

- Open/Close for casket burial in summer: from $400.00 to $450.00
- Open/Close for casket burial in winter: from $600.00 to $650.00
- Cremation burial: from $200.00 to $250.00
- Infant burial: from $200.00 to $250.00
- Sat., Sun and Holiday burials additional remains at $75.00
- Costs include a 20 inch by 32-inch headstone foundation; larger add $0.20/sq. inch

Seconded by Zimmerman, all in favor, motion carried.

**Public Comment:** There were 2 comments in regards to the Silver Lake roads, paving, petition, and emergency vehicles being able to get through ok. Discussion on sending out a survey to the residents of Silver Lake in regards to the roads.

---

Motion by Bridges to adjourn, second by Tobin, all in favor, meeting adjourned at 7:30 PM.

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2021-01-11-board-meeting', 'Board Meeting — January 11, 2021', '2021-01-11', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM. Meeting held by Zoom (Electronic Transfer).

**Roll Call:** Present was Zimmerman, Majewski, Tobin, Carey and Bridges.
**Also present** by Zoom was Fire Chief D. Majewski, Lakes Director/Zoning Admin. R. Carey, Planning Members Hassberger and McCaslin and Dep. Clerk Sherrod.

---

Minutes of the 14 December, 2020 regular monthly meeting by Zoom were approved as presented.

Treasurer''s report was accepted as presented. Carey reported that income is up a bit in comparison to the same time last year.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call, all in favor, motion carried.

---

Commissioner D. Majewski reported that the Central Mich. Dist. Health Dept. has started giving the Covid Vaccine. The contract for spraying Gypsy Moth has been signed and it covers about 20,000 acres in comparison to last year''s 9,000 acres. Mike Tobin was appointed to the Region 7 Area Agency on Aging Board and Sandy Bristol was appointed to represent Clare County at the Region 7 meetings.

Chief Majewski reported that there were 51 rescue, 1 fire, 3 power line and 1 mutual aid runs for December 2020, 452 runs year to date. Fire Fighter Luis Velazco is in Fire Fighter I class.

---

Tobin reported on the school house proposal. It would be between $5000 and $8000 just to patch the holes in roof and windows so that the building is closed up to the elements. The building has no heat, no bathroom, and no handicap accessibility, needs all new windows and a new roof and we are not sure about the septic and well. After discussion about the badly deteriorated condition of the building it was decided that the township would not further pursue the offer from Mr. Wyman. We will concentrate on preserving the townships current assets, such as the township hall, cemetery and parks.

---

**Public Comment:** One comment was offered regarding the building report being made available to the planning commission.

Motion by Bridges to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 7:25 PM.

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2021-02-08-board-meeting', 'Board Meeting — February 8, 2021', '2021-02-08', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM. Meeting held by Zoom.

**Roll Call:** Present by Electronic Transmission (Zoom): Zimmerman, Majewski, Tobin, Carey and Bridges.
**Also present** were D. Majewski, R. Carey and D. Hassberger.

---

Minutes of the 11 January 2021 meeting were approved as presented.

The Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, 5 yes, motion carried.

---

County Commissioner D. Majewski reported that it is anticipated that the jail will lose approximately $400,000.00 in revenue due to federal inmates being housed elsewhere. The Board of Commissioners appointed Jeff Haskell as Chair and Dale Majewski as Vice Chair.

Chief Majewski reported that the fire department is very busy; mostly rescue runs. The Covid vaccine was offered to fire department personnel. There were 4 first responders who took advantage of the opportunity.

---

There was no old business.

There was no new business.

---

**Public Comment:** There was one comment offered in regards to water tests at the parks.

Motion by Bridges to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 7:13 PM.

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2021-03-08-board-meeting', 'Board Meeting — March 8, 2021', '2021-03-08', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM. Meeting held by Zoom.

**Roll Call:** Present by Electronic Transmission (Zoom): Zimmerman, Majewski, Tobin, Carey and Bridges.
**Also present** were D. Majewski, R. Carey and D. Hassberger.

---

Minutes of the 08 February 2021 meeting were approved as presented.

The Treasurer''s report was accepted as presented. The township is done collecting taxes now until July.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, 5 yes, motion carried.

---

There were two seawall permits from EGLE, both on Shingle Lake at the Woodman and McGue residences.

County Commissioner D. Majewski reported that the Board of Commissioners is considering hiring a parttime IT person or contracting some IT out.

Chief Majewski reported that the fire department had 37 rescue, 1 fire and 1 mutual aid related runs in February, 100 runs year to date.

---

Motion by Zimmerman to approve a general fund expenditure of $2717.00 for the purpose of Cadillac Garage Door replacing the door on the maintenance barn, second by Bridges, all in favor, motion carried.

Motion by Zimmerman to approve a fire fund expenditure of $2350.00 for the purpose of Hogger''s to replace the deteriorating fire dept. sign and stripping the heavy rescue, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to approve the American Waste annual contracted CPI of 3%, making the per house from $11.19 each week, to $11.90 each week, increasing the annual monthly payment to $22,752.00, second by Carey, roll call vote, 5 yes, motion carried.

Comments: Zimmerman commented that the light outside the vault is out and he also made a reminder about Board of Review.

Motion by Zimmerman to approve a law fund expenditure of $9000.00, the monthly contracted amount for the month of February 2021, second by Tobin, roll call vote, 5 yes, motion carried.

---

**Public Comment:** None offered.

Motion by Bridges to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 7:23 PM.

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2021-04-12-board-meeting', 'Board Meeting (Zoom) — April 12, 2021', '2021-04-12', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM.

**Roll Call:** Present by Electronic Transmission (Zoom): Zimmerman, Majewski, Tobin, Carey and Bridges. **Also present:** D. Majewski, R. Carey, D. Hassberger and T. McCaslin.

---

Minutes of the 08 March, 2021 meeting were approved as presented.

The Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, 5 yes, motion carried.

---

There was one seawall permit issued on Oak Tree St. on Lake George.

County Commissioner D. Majewski reported that there have been at least 70 properties opting out of the Gypsy Moth spraying throughout Clare County. There will be approximately 20,000 acres sprayed. Clare County will receive approximately six million dollars from the American Recovery Act.

Chief Majewski reported that the fire department had 40 rescue, 7 fire and 1 gas leak related runs in March, 153 runs year to date. A grant application requesting $30,000.00 for the purpose of purchasing a set of Jaws has been submitted to TC Energy for consideration.

---

Motion by Zimmerman to approve a general fund expenditure of $2706.00 each year for the years 2021, 2022, and 2023 for the purpose of Hometown Decorations putting up the holiday lighting and garlands, and to authorize the clerk to sign that agreement on behalf of the township, second by Majewski, all in favor, motion carried.

Motion by Zimmerman to approve the contracts with Elm Creek and authorize the clerk to sign the agreements for lawn maintenance and spring and fall clean up as follows: Bertha Lake Park, $150.00 spring clean-up and $275.00 fall cleanup; Cemetery, $170.00 per mow, $350.00 spring clean-up and $750.00 fall clean-up; Shingle Lake Park, $350.00 spring clean-up, and $750.00 fall clean-up; Silver Lake Park, $250.00 spring clean-up and $375.00 fall clean up, second by Tobin, all in favor, motion carried.

Motion by Tobin to approve the agreement with Elm Creek in the amount of $970.00 for the purpose of a 3 step process to eliminate weeds and fertilize the grass at the cemetery, second by Zimmerman, all in favor, motion carried.

Motion by Zimmerman to approve a 1.4% CPI increase for the assessor, retroactive to 01 April, 2021 and that we will not consider extending the current contract to 2024 as requested by the Taylor Assessing, second by Tobin, roll call vote, 5 yes, motion carried.

---

The tentative dates for road brining will be May 17th, June 30th, and August 27th.

**Public Comment:** Comments were made on road graveling on Browns and possibly Hickory, and new banners for the light poles.

Motion by Zimmerman to approve a general fund expenditure of not to exceed $800.00 for the purpose of purchasing the large hanging flower baskets for downtown for this 2021 season, second by Tobin, all in favor, motion carried.

Treasurer Carey updated the board on her computer. It is 12 years old and in need of upgrading. She is considering options.

**Public Comment:** None offered.

---

Motion by Bridges to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 7:51 PM.

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2021-05-10-board-meeting', 'Board Meeting — May 10, 2021', '2021-05-10', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7PM. Meeting held by electronic transmission (Zoom).

**Roll Call:** Present by electronic transmission was Zimmerman, Tobin, Majewski, Carey and Bridges.
**Also present** were Zoning Admin. R. Carey, Fire Chief D. Majewski, Planning Member McCaslin, Deputy Clerk Sherrod, and Planning Chair Hassberger.

---

Minutes of the 12 April 2021 regular meeting approved as presented.

Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, all in favor, motion carried.

---

County Commissioner D. Majewski reported that the Board of Commissioners had approved to hire through Kelly Services for a temporary IT person to get needed items caught up. They will evaluate the need to permanently hire an additional IT person in 6 mos.; the Board of Commissioners also approved for the auction of 8 sheriff vehicles and a front-end loader. The repairs to the front doors of the court house were also approved.

Chief Majewski reported that there were 33 rescue, 1 fire, and 1 mutual aid related runs for April, 206 runs year to date. Chief Majewski welcomed Charles Walker to the fire department; he has passed physical and background and will be suited up this week.

---

Motion by Majewski to approve a general fund expenditure of $85.00 for the purpose of the Zoning Administrator attending the electronic training Michigan Sign Regulation Guidebook Training, sponsored by MSU on May 24, 2021, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to add Planning Member Tami McCaslin on for the training Michigan Sign Regulation Guidebook Training at a cost of $85.00, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to approve a general fund expenditure of $20.00 for the purpose of Planning Member Tami McCaslin attending the MTA electronic training All Things Non-Conforming, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to approve a road fund expenditure of $6,250.00 (50% of project total of $12,500.00) for the purpose of clearing trees from the road right of way on Old State Ave, from Mannsiding Rd. to Jefferson Rd., per the agreement with the Clare County Road Commission dated 22 April, 2021, second by Carey, all in favor, motion carried.

Motion by Zimmerman to approve a road fund expenditure of $213,000.00 (project total: $253,000, CCRC Match $40,000.00) for the purpose of engineering and preparing the roadbed and for an ultrathin paving recap on Arbor, Forest, Ojibway, Bungo, Oaktree, Maple and Lake Dr., per the agreement with Clare County Road Commission dated April 2021, second by Tobin, all in favor, motion carried.

Motion by Carey to approve the annual Equalization contract as presented, Option #3, Full Service, Calculating, Balancing and Processing Tax Billing, at $1.50 per parcel service fee, and additionally, Option 3b, Assessment Change Notices at .20 (twenty cents) per parcel, and additional printing services at .15 (fifteen cents) per single- or double-sided page, second by Zimmerman, all in favor, motion carried.

Motion by Zimmerman to adopt resolution number 051021-A, a resolution to consider at the annual meeting on June 28, 2021 at 4PM, a CPI increase of 1.4% for the elected officials, second by Carey, roll vote 5 yes, motion carried.

Zoning Admin. Roger Carey presented a proposed amendment to the zoning ordinance definitions. Supervisor Zimmerman turned the proposed amendment over to Planning Commission Chair Hassberger so that they can discuss and consider a public hearing.

Motion by Zimmerman to amend the 2020-2021 general fund budget to increase expenditures $34,852.00; the fire fund 2020-2021 budget to increase expenditures $19,000; and to the law fund 2020-2021 budget to increase expenditures $138.00, second by Carey, all in favor, motion carried.

Annual Meeting and Budget Hearing 28 June, 2021 at 4PM at the Township Hall.

---

**Public Comment:** The ZBA will have their annual meeting 12 May 2021 at 7PM.

Motion by Tobin to adjourn the meeting, second by Bridges, all in favor, meeting adjourn at 7:32 PM.

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2021-06-14-board-meeting', 'Board Meeting — June 14, 2021', '2021-06-14', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 p.m. Those present recited the Pledge of Allegiance.

**Roll Call:** Present were Trustees: Carey, Bridges, Tobin and Zimmerman. Absent and excused for a family emergency was Majewski.
**Also present** were R. Carey -- Zoning Administrator, D. Hassberger -- Planning Commission Chair, T. McCaslin -- Planning Commission, C. Engelhardt -- Board of Review, and seventeen (17) other interested persons.

---

Minutes of the 10 May, 2021 Regular Monthly Meeting were reviewed and approved as presented.

Carey presented the May Treasurer''s Report for review and it was accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin. Roll Call vote showed all in favor and the Motion carried.

---

There were no Guest Speakers.

There was no Fire Department, nor Fire Chief''s Report.

There was nothing new to report from the Parks Commission, other than arrangements have been made to install the swim buoys on both Silver Lake and Shingle Lake, likely this week, and that the Porta-Johns will be installed for the season at the parks, probably this week.

It was reported by Tobin -- Liaison to the Planning Commission that the next regular P.C. Meeting will be Tuesday, 06-15-2021.

There was nothing new to report by the Cemetery Commission.

Zimmerman presented the CCSD Police Incident Report for May with 394 Incidents; and the Clare County Building Department Report for May with 8 new permits; and the Zoning Administrator''s Report with 14 applications, of which 13 were approved, 1 is NOT within the authority of the Township to either approve or deny.

There was no update on the Ordinance Enforcement Activities.

There was nothing new to report from the Lakes Commission.

---

There was no Old, nor Unfinished Business.

Under New Business the following six (6) items were presented:

1. Motion by Zimmerman, with a Second by Tobin to renew the Worker''s Comp. Coverage(s) from the Accident Fund, thru the Burnham & Flowers Insurance Agency at a cost of $4,536.00. Motion Carried without objection.

2. Motion by Zimmerman, with a Second by Bridges to renew the General Insurance & Liability Coverage from Michigan Townships Participating Plan, thru Burnham & Flowers Insurance Agency at a cost of $33,936.75, plus $144.00 for Limited Terrorism Coverage, plus $25.00 Non-Monetary Defense Cost Coverage. Totaling $34,105.75. Motion Carried without objection.

3. Motion by Zimmerman, with a Second by Carey to renew Michigan Townships Association (MTA) Dues, in the amount of $1,874.68, plus $56.24 for Legal Defense Fund, plus $1,900.00 for MTA on-line Learning Subscription (Premium Pass). Totaling $3,830.52. Motion Carried without objection.

4. Announcement: TC Energy Foundation awarded the Township the Grant Request for $30,000.00 made by Majewski for new Jaws-of-Life for the Township Fire Department.

5. Announcement: The second (2nd) Dust Control Brining Treatment will take place on 30 June (Wednesday) providing that weather is favorable.

6. Announcement: The Annual Township Budget Hearing, followed immediately by the Annual Municipal Corporate Meeting will be held on Monday, 28 June, 2021 at 4 p.m. at the Lincoln Township Hall.

---

**Public Comment:**

- T. Vajcner of White Birch (W.B.) addressing the regulations on Campers and Temporary Structures such as Canopies on Vacant Lots, and the size of the lots and their resp. regulations.
- D. Sloane of W.B. addressing regulations and enforcement of regulations regarding what may be considered as "Camping Accessories."
- M. Brooks of W.B. questioning Ordinance Interpretation, Vague and Confusing Ordinance Wording, that temporary Umbrellas, Tarps, Tents, etc. may be considered structures. Section 3.1 seems to conflict with other Sections.
- B. Cooley of W.B. supports increasing campers per lot to two (2), and requests a cleaner definition of "Structures".
- Unidentified opposes regulations preventing canopies over picnic tables.
- C. Engelhardt of Lake George requested information about resuming Pilates, Pickle Ball, and Zumba at the Township Hall, i.e. when will that be allowed by COVID restrictions, or by their removal.
- Sharon Szczepanski of Lake George concerned about this year''s Gypsy Moth Treatment, who to contact, if the Township could do anything, if ineffective treatment could be refunded, etc.
- L. Cooley of W.B. expressed support for having multiple campers on single lots, as well as temporary storage buildings or structures for storage and other types of recreation.
- R. Teeder of W.B. expressed support for having multiple campers on single lots, as well as disagreeing with some definitions in the Zoning Ordinance.
- Unidentified of W.B. stated that current regulations seem to NOT allow for having guests and/or extended family, which could and should generate revenue locally and property sales within W.B., if amended.
- B. Height spoke to the upcoming White Birch Board elections, and that by next month that Board would be working on some sort of proposal to bring before the Planning Commission, for more flexible regulations.

Note: most people were allowed to, and spoke multiple times, usually in favor or to emphasize something that someone else had commented on.

Motion by Tobin to adjourn the meeting, Second by Bridges. The meeting adjourned at 8:14 p.m.

*Respectfully Submitted,*
*Dennis Zimmerman, Lincoln Township Supervisor*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2021-07-12-board-meeting', 'Board Meeting — July 12, 2021', '2021-07-12', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7:00 PM.

**Roll Call:** Present was Zimmerman, Majewski, Bridges, Tobin, and Carey.
**Also present** was Fire Chief/County Comm. D. Majewski, Ord. Enforcement Trim, Zoning Admin R. Carey, Deputy Huck, and 21 other interested persons.

---

The 14 June, 2021 regular meeting minutes approved as presented.

The Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, all in favor, motion carried.

---

Fire Chief Majewski reported 31 rescue, 1 fire and 1 weather related runs for June, 285 runs year to date.

Motion by Zimmerman to approve a fire fund expenditure of $586.00 for the purpose of the annual premium for the fire fighter''s Provident 24-Hour AD&D, second by Bridges, all in favor, motion carried.

Discussion on bidding out old Jaws of Life.

---

Motion by Zimmerman and seconded by Tobin to adopt resolution number 071221-A, a resolution regarding adding the definition of Lot, Triple Frontage, to the Zoning Ordinance, Article 21, as follows:

Lot, Triple Frontage: A corner lot with street frontage on three (3) sides shall have the following lot lines for setback purposes. A. if the dwelling is oriented toward one of the two (2) parallel streets, the lot shall have two (2) front lot lines and two (2) front yards, and two (2) side lot lines and two (2) side yards, and no rear lot line nor rear yard. B. If the dwelling is oriented toward the middle street, the lot shall have three (3) front lot lines and three (3) front yards butting the streets and a rear lot line and a rear yard.

On roll call, Zimmerman, Carey, Tobin and Majewski voted yes, and Bridges voted no; resolution 071221-A was adopted.

---

**Public Comment:** McCaslin and S. Bridges oppose resolution 071221-A. There were many comments made on the number of campers allowed on lots, storage structures, canopies, tents trailers and interpretations of the zoning ordinance. Also commented on were the Pilates, Pickle Ball and Zoomba activities resuming and some discussion about the weeds encroaching on the beach at Silver Lake.

Motion by Bridges to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 8:27PM.

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2021-08-09-board-meeting', 'Board Meeting — August 9, 2021', '2021-08-09', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7PM.

**Roll Call:** Present was Zimmerman, Majewski, Carey, Bridges, and Tobin.
**Also present** at the meeting was Lakes Director R. Carey, Fire Chief/County Comm. D. Majewski, and 26 other interested persons.

---

Minutes of the 12 July 2021 meeting were approved as presented.

Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, all in favor, motion carried.

---

Motion by Zimmerman to authorize the expense of $7250.00 for the purpose of Right of Way stump removal along Old State Ave. between Mannsiding Rd. and Jefferson Rd., according to the Clare County Road Commission 2021 Local Road Estimate dated 14 July, 2021, second by Bridges, all in favor, motion carried.

Motion by Zimmerman to accept the single bid received in regards to the Halmatro Jaws of Life, from Iron Mounty Fire Department in the amount of $50.00 (fifty dollars), second by Tobin, all in favor, motion carried.

Motion by Zimmerman to adopt resolution number 080921-A, a resolution regarding amending the Guidelines and Application For Hardship/Poverty Exemptions(s), in order to comply with the AMAR Standards, second by Carey, roll call vote, 5 yes, resolution adopted.

---

Discussion: Considering ultra-thin on township hall parking lot. Proposed long term rental ordinance up for consideration and working on wording.

---

**Public Comment:** There were several comments made in regards to the multiple campers on lots, recreational camping/campers being allowed accessory buildings/tents/canopies or utility trailers for storage.

Motion by Bridges to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 7:21PM.

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2021-09-13-board-meeting', 'Board Meeting — September 13, 2021', '2021-09-13', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7PM.

**Roll Call:** Present was Zimmerman, Carey, Bridges, Tobin, and Majewski.
**Also present** were Commissioner/Fire Chief D. Majewski, Zoning Admin. R. Carey, Sheriff Wilson and Undersheriff Miedzianowski and 6 other interested persons.

---

Minutes of the 09 August, 2021 meeting approved as presented.

Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, motion carried.

---

County Commissioner Majewski reported that the county budgeting process was going well and it seems that they have a balanced budget. The Board of Commissioners recently approved to upgrade/replace some of the HVAC, purchase an OVC Light for sanitizing purposes and premium pay out of ARPA funds received.

Sheriff Wilson gave an annual report on total incidents within the township from 01 January, 2021 to current day. Sheriff Wilson also reported on the fentanyl, meth and heroin increase in the area. The jail has 128 inmates at this time; no cases of covid at this time. They did have 30 cases in the spring, however, they have been able to space inmates and implement other protocols, such as quarantine new inmates, to mitigate the spread of the virus. The Sheriff also reported that they are utilizing a great tool called AVL, Automatic Vehicle Locator, which gives such information as vehicle location, speed, braking, and is also used to locate an officer who is not responding. The Sheriff also talked about the items that he is able to get from the military surplus; for example, he recently got a $9000.00 Compressor out of Fort Meade Maryland for free -- he just had to make arrangements to pick it up.

Fire Chief D. Majewski reported that there were 47 rescue, 10 power line and 1 fire related runs for August, 382 runs year to date.

---

The Arbor, Forest, Ojibaway ultra-thin and wedging project ended above original quote. On 10 May, 2021 the board approved an amount of $213,000.00 Township share with a CCRC match of $40,000.00, total cost of $253,000.00.

Motion by Zimmerman to approve an updated road fund expenditure of $244,950.00 Township share for the Arbor/Forest/Ojibway ultra-thin paving and wedging recently completed, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to authorize the Clerk to proceed with the removal of the outhouse at Bertha Lake, and have a porta john placed during the summer months, second by Bridges, all in favor, motion carried.

Zimmerman reported that he had requested a bid from Henry Tree Services for the removal of storm damage/downed trees in the Shingle Lake Park as well as removal of 4 standing dead (oak wilt) also at Shingle Lake Park.

By consensus, the board approved for Treasurer Carey to investigate a scanner for tax payment checks that will connect directly to the bank and make the process much more efficient.

Clerk Majewski requested that Conti Corporation, heating and cooling specialists, bid on a new heating, ventilation and cooling system for the township hall. They have been out on 13 September, 2021 and done an evaluation and will send along the bid when it is finalized. This project is intended to be an ARPA funds project; whenever those funds are finally made available to the township.

---

**Public Comment:** There were several comments offered.

Motion by Tobin to adjourn the meeting, second by Bridges, meeting adjourned at 8:54 PM.

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2021-10-11-board-meeting', 'Board Meeting — October 11, 2021', '2021-10-11', 'Board Meeting', 'approved', 'pdf', 'Supervisor Zimmerman called the meeting to order at 7PM.

**Roll Call:** Present was Zimmerman, Majewski, Carey, Tobin and Bridges.
**Also present** was Zoning Admin./Lakes Dir. R. Carey, Fire Chief/County Commissioner D. Majewski, Fire Fighter Witchell, Planning Chair Hassberger and 8 other interested persons.

---

Minutes of the 13 September, 2021 regular meeting approved as presented.

Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, 5 yes, motion carried.

---

Fire Chief Majewski reported 42 rescue, 7 powerline related runs for September, 419 runs year to date. The new Jaws that were purchased with the grant money from Trans Canada are in service. The folks from Iron Mt. will be down this week to pick up the old set.

Many thanks to Marilyn Hudson for all her work on the flowers and landscaping at the cemetery. It is beautiful!

Zoning Admin. has the boards approval to see the attorney in regards writing civil infraction tickets.

---

Motion by Zimmerman to authorize payment of $29,000.00 to Apollo Fire Apparatus for the Hurst (Jaws) Spreader Package, Ram Package and associated batteries, chargers and power supply, second by Bridges, all in favor, motion carried.

Motion by Zimmerman to approve a general fund expenditure in the amount of $4300.00 to Hillbilly Tree Service for removal of 8 dead and/or dangerous trees, and associated debris clean up and stump removal, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to renew the Apex Sketching Software maintenance to 11/14/2022, in the amount of $470.00, second by Bridges, all in favor, motion carried.

Motion by Zimmerman to authorize the proposed management program from PLM for Bertha Lake for the year 2022 in the amount of not to exceed $10,500.00, second by Bridges, all in favor, motion carried.

Motion by Zimmerman to authorize the proposed management program from PLM for Lake George for the year 2022 in the amount of not to exceed $25,000.00, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to authorize the proposed management program from PLM for Shingle Lake for the year 2022 in the amount of not to exceed $10,000.00, second by Bridges, all in favor, motion carried.

---

2022 Dust Control tentative dates: May 23, 2022, June 28, 2022, and Sept. 02, 2022.

Kids Trunk or Treat is Oct. 31, 2021 at 5PM to 6PM in the parking lot of the township hall.

Fire Dept. Halloween Open House also on Oct. 31, 2021 from 5PM to 7PM at the fire station. Treats and cider provided.

---

**Public Comment:** There were 3 comments offered; topics included -- when will the gravel be put down on the sides of Forest; Gypsy moth egg mass counts, and reminder to park for Trunk or Treat early, about 4:30PM.

Motion by Bridges to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 7:24 PM.

*Respectfully Submitted,*
*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2024-01-08-board-meeting', 'Board Meeting — January 8, 2024', '2024-01-08', 'Board Meeting', 'approved', 'transcribed', 'The meeting was called to order by Supervisor Zimmerman at 7:00 p.m.

**Roll Call:** Present was Zimmerman, Majewski, Carey, and Tobin. Absent and excused was Bridges.
**Also present** was Planning Chair Blaisdell, Planning Member Ostrowski, ZBA Member Simons, Zoning Admin. Hassberger, Lakes Director R. Carey and Fire Chief/County Commissioner D. Majewski and 7 other interested persons.

---

Minutes of the 11 December 2023 regular meeting approved as presented.

Treasurer''s report was accepted as presented.

Motion by Tobin to pay the monthly bills, second by Zimmerman, roll call vote, 4 yes, motion carried.

---

Chief D. Majewski reported that there were 498 runs in 2023; 36 rescues, 1 power line, 1 mutual aid and 1 fire related runs for December, 39 year to date.

---

Motion by Zimmerman to authorize the payment of $2,698.16 to Mt. Pleasant Sash and Door for the maintenance barn south side garage door replacement, second by Tobin, all in favor, motion carried.

Motion by Majewski to approve the bid from Mid-Michigan Security Systems in the amount of $546.80 for equipment installation and $535.00 for labor for upgrading the security system at the Township Hall, and $27.50 per month monitoring/test of that security system, second by Zimmerman, all in favor, motion carried.

Motion by Zimmerman to adopt resolution number 010824-A, a resolution regarding adopting the Federal Poverty Threshold Guidelines, second by Tobin, roll call vote, 4 yes, motion carried.

---

**Public Comment:** There were 5 comments offered on the topics of the municipal parking area curbing, Hazardous Waste Charge Back Ordinance, the annual Household Waste collection in September, Northern Oaks takes 4 tires per year per resident of Clare County, complaints on the 5% increase in taxes and the new gun laws.

Motion by Tobin to adjourn the meeting, second by Zimmerman, all in favor, meeting adjourned at 7:32 p.m.

Respectfully Submitted,

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2024-01-26-election-inspector-appointment', 'Election Inspector Appointment — January 26, 2024', '2024-01-26', 'Election Inspector Appointment', 'approved', 'transcribed', 'Supervisor Zimmerman called the meeting to order at 10:00 AM.

**Present:** Zimmerman, Majewski, and Carey.

---

Zimmerman stated the purpose of the meeting is to appoint election inspectors for the February 27, 2024 Presidential Primary Election.

Motion by Majewski to appoint Bob Guzowski -- D, Sue Guzowski -- D, Sheryl Judd -- D, Deb Sherrod -- D, Bob Klenke -- R, Mary Klenke -- R, Kay Little -- R, Karen Westphal -- R and Carol Majewski -- D alternate if needed; second by Zimmerman, all in favor, motion carried.

---

**Public Comment:** None offered.

Motion to adjourn by Carey, seconded by Majewski, all in favor, meeting adjourned at 10:01 AM.

Respectfully Submitted,

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2024-02-12-board-meeting', 'Board Meeting — February 12, 2024', '2024-02-12', 'Board Meeting', 'approved', 'transcribed', 'Supervisor Zimmerman called the meeting to order at 7:00 PM.

**Roll Call:** Present was Supervisor Zimmerman, Clerk C. Majewski, Treasurer M. Carey, Trustee Tobin, and Trustee Bridges.
**Also present** was Fire Chief/Commissioner D. Majewski, Zoning Admin Hassberger, Planning Chairperson Blaisdell, ZBA alt. Simon, Drain Commissioner Faber, Sheriff''s Deputy Oster, Lakes Director R. Carey and 2 other interested persons.

---

Minutes of the 08 January, 2024 regular meeting approved as presented.

Treasurer''s report was accepted as presented.

Motion by Bridges to pay the monthly bills, second by Tobin, roll call vote, 5 yes, motion carried.

---

Commissioner D. Majewski gave the county report. The meeting with Mobile Medical Response Ambulance Service went well with approximately 100 in attendance. They discussed response times and staffing issues. The County Board of Commissioners has appointed a committee to further explore options.

Drain Commissioner Bill Faber explained projects slated for Lincoln Township. They will be changing the staff meters/gauges at the Lake George boat launch and the Lake George spill way.

Fire Chief Majewski reported that the new Engine is slated for completion and delivery in about 4 weeks. There has been no movement on the sale of the old Engine. He may need to make arrangements with another company to broker the sale of the 2001 Pierce Custom Contender. There are 3 in fire fighter school right now and 2 will be taking officer''s training in March.

Tobin reported that the Master Plan Public Hearing will be at the Planning Commission March 12, 2024 at 7PM.

---

Motion by Majewski to approve general fund expenditure of $600.00 for the purpose of purchasing plants and flowers for the Citizen''s Corner and Township Hall, second by Zimmerman, all in favor, motion carried.

Motion by Zimmerman to approve a general fund expenditure for the Holiday Lighting Agreement with Home Town Decorations for 2024 -- 2026 inclusive, in the amount of $2,706.00 per year, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to approve the AT&T Metro Act Right of Way Extension Agreement through June 30, 2028, second by Carey, all in favor, motion carried.

---

Announcements:

- The ISO rating of the township fire district was recently reviewed and it will remain at 8B for those living within 5 miles of the fire hall.
- The SPARKS Grant has been submitted.
- Frost Laws have been on for 2 weeks.
- Annual Easter Egg Hunt will be on March 24, 2024 from 2pm to 4pm at the Hamlin Field.
- The board will review partnering with other townships in a "Recycle Day" where we would split the costs for our residents to take electronics, metals, shredding, tires and batteries.
- The LGPOA is sponsoring a Boaters Safety Class on June 29th. Details can be obtained from the LGPOA.

---

**Public Comment:** There were comments offered on the Sparks Grant, repairs possibly being needed on the boat launch at Silver Lake and putting a dock at the beach on Silver Lake.

Motion by Zimmerman to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 7:35pm.

Respectfully Submitted,

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2024-03-11-board-meeting', 'Board Meeting — March 11, 2024', '2024-03-11', 'Board Meeting', 'approved', 'transcribed', 'Supervisor Zimmerman called the meeting to order at 7:00 pm.

**Members Present:** Supervisor Zimmerman, Clerk Majewski, Treasurer Carey, Trustee Tobin and Trustee Bridges.
**Staff Present:** Fire Chief/County Commissioner Majewski, Zoning Admin. Hassberger, Planning Chair Blaisdell, Planning Member Ostrowski, Lakes Director R. Carey
**Also present** were Sheriff''s Deputy Oster, and 6 other interested persons.

---

Minutes of the 11 February 2024 regular meeting approved with no corrections.

Treasurer''s report was accepted as presented.

Motion by Tobin, seconded by Carey to pay the monthly bills, roll call vote, 5 yes, **CARRIED**.

---

Commissioner D. Majewski reported that the Spongy Moth (aka Gypsy Moth), 911, Senior Services and Animal Shelter will have renewal millages on the August 2024 ballot. The county has put a 9 acre piece of land up for sale in the Temple area; Judge Ferrell requested that the Board of Commissioners consider that courthouse visitors and staff use the one entrance and exit where the metal detector and x-ray machine are and that judges and prosecuting attorney are exempt from that entrance requirement.

Chief Majewski reported that there were 40 rescue, 2 fire and 1 mutual aid related runs for February, and 74 runs year to date. Those in training are doing well thus far and will graduate in a few weeks; the new Engine is slated to be delivered in early April, the fire truck broker has 3 departments interested in the old engine.

---

There was discussion in regards to putting a dock at the Silver Lake Park as requested by Silver Lake resident Mariann Anthony. The size of the area was discussed, as well as the probable difficulty with managing boats mooring on a dock and people fishing with hooks off the dock in the swimming area and the conflict and safety concerns it would present with swimmers. **No action was taken.**

Motion by Zimmerman, seconded by Tobin to install one LED street light in the area of 455 and 445 Arbor Dr., for $100.00 installation fee, and $15.00 per month electrical usage, all in favor, **CARRIED**.

Motion by Zimmerman, seconded by Tobin to adopt resolution number 031124-A, a resolution to adopt the Hazardous Spill Cost Recovery Ordinance #45, roll call vote, 5 yes, **CARRIED**.

---

Clerk Majewski reported that she has contacted Attorney Chris Patterson in regards to the old school house. He will work on getting that property ownership transferred to the township. The township did not get the grant to stabilize and rehabilitate the structure from the state. The County Treasurer, Jenny Beemer Fritzinger, has been out to look at the building and has had discussion with Clerk Majewski that there may be some funds available for stabilization and rehab through the county. Possible rehab project ideas were discussed.

Motion by Zimmerman, seconded by Tobin to increase the cost for Special Use Permits without special meeting from $125.00 to $150.00 for the purpose of covering the costs of required public published notices and mailed notices and time, all in favor, **CARRIED**.

Motion by Zimmerman, seconded by Tobin to approve the road construction agreement with the Clare County Road Commission for the 1 mile of millings (asphalt and tire chips) project on Monroe Road, for a cost of $62,262.33, township share, all in favor, **CARRIED**.

*Supervisor Zimmerman will discuss an optional 2nd mile with the CCRC.

Motion by Zimmerman, seconded by Tobin to approve a road construction agreement with the Clare County Road Commission for 22A Gravel, tree and stump removal, drainage/ditching and culvert placement on Bringold Ave., from Browns Rd. south 4,412 feet, for a cost of $116,874.95 township share, all in favor, **CARRIED**.

Motion by Zimmerman, seconded by Tobin to approve a road construction agreement with the Clare County Road Commission to approve asphalt overlay on Jefferson Ave from Finely Lake west to the gravel in the amount of $25,000.00 township share; to approve ultra thin overlay on Shingle Lake Dr. from Bringold west to the end in the amount of $45,000.00 township share; and crack seal Bringold, Ashard and Hickory south of Mannsiding, in the amount of $8,000.00; total of all three projects included in agreement is $78,000.00, all in favor, **CARRIED**.

---

The Township will add a 4th brining to the calendar this year due to the uncharacteristic dry winter. The extra brining is tentatively scheduled for April 22, 2024.

The Presidential Primary Election held on February 27, 2024 went very well. Lincoln Township passed the canvass with flying colors. Clerk Majewski expressed her gratitude for our wonderful election inspectors. It is a very long day, up to 18 or more hours and Deb, Sheryl, Bob K., Mary, Sue, Bob G., Kay, and Karen all did an excellent job and we are very proud of them!

The annual Easter Egg Hunt is Sunday March 24th, 2pm to 4pm at the Hamlin Field.

---

**Public Comment:** There was comment offered in regards to when the Monroe Rd. project will start.

Motion by Zimmerman to adjourn the meeting, all in favor, meeting adjourned at 7:35 PM.

Respectfully Submitted,

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2024-04-08-board-meeting', 'Board Meeting — April 8, 2024', '2024-04-08', 'Board Meeting', 'approved', 'transcribed', 'Supervisor Zimmerman called the meeting to order at 7:00 pm.

**Members Present:** Zimmerman, Majewski, Carey, and Tobin.
**Members Absent:** Bridges
**Staff Present:** Fire Chief/County Commissioner D. Majewski, Planning Chair Blaisdell, Planning Member Ostrowski, Zoning Admin. Hassberger
**Also present** were Sheriff''s Deputy Oster, and 3 other interested persons.

---

Minutes of the 11 March 2024 regular meeting were approved as presented.

Treasurer''s report was accepted as presented.

Motion by Tobin, seconded by Zimmerman to pay the monthly bills, roll call vote, 4 yes, **CARRIED**.

---

County Commissioner D. Majewski reported that work on the county budget is underway. Animal Control Director Rudy Hicks is retiring and Bob Dobson will be taking over. The county clerk''s office is getting some new elections software that will get election results to the website in real time.

Chief Majewski reported 25 rescue, 1 fire and 1 power line related runs for March, 102 runs year to date. Three members have completed the fire fighter training and have passed their practical test and are awaiting results of the written exam. The fire department has added 2 new recruits. Welcome Hunter Lewis and David Riley. The Engine has sold to a fire department in Arkansas. There is no open burning at this time.

---

Motion by Zimmerman and seconded by Carey to approve the real estate donation agreement for the property with the parcel ID number of 010-222-004-00, also known as the Old School House on Arthur Rd., all in favor, **CARRIED**.

Motion by Zimmerman and seconded by Tobin to adopt resolution number 040824-A, a resolution to accept the donation from Stephenson-Wyman Funeral Home, Inc. roll call vote, 4 yes, **CARRIED/RESOLUTION ADOPTED**.

Motion by Zimmerman and seconded by Tobin to approve a general fund expenditure of $1750.00 for Wade Trim to update the Zoning Map with deliverables including Adobe PDF file, 2 large 24"X36" maps and 25 11"X17" maps, and to allow an additional $450.00 for the purpose of Wade Trim attending a meeting if needed, all in favor, **CARRIED**.

Motion by Zimmerman and seconded by Tobin to approve the road construction agreement dated 18 March, 2024 in the amount of $72,936.70 township share, for Monroe Rd. (from Harding Ave. to Dead End) for shape and grade, minor tree removal/trimming, minor drainage, haul and placement of Asphalt Millings, all in favor, **CARRIED**.

Motion by Zimmerman and seconded by Tobin to approve the road construction agreement dated 01 April, 2024 in the amount of $130,976.20 township share, for Jackson Ave. (from Browns Rd. to Adams Rd.) for shape, grade, and place 6" MDOT spec 22A or 22A modified gravel; deliver and place topsoil on the front slope of ditch and hydroseed full length both sides, all in favor, **CARRIED**.

---

**Public Comment:** Three questions were asked about road project costs, the donation of property and storage units:

1. It was explained that the township share of the costs of the approved road projects is half of the total costs.
2. The township wishes to preserve the historical site known as the Old School House that is being donated by Stephenson Wyman Funeral Home Inc.
3. The ground work and leveling going on East of the Old School House and across the street from the Compost Field is preparation for additional storage units.

---

Motion by Tobin and seconded by Carey that the meeting adjourn, all in favor, meeting adjourned at 7:25 pm.

Respectfully Submitted,

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2024-05-13-board-meeting', 'Board Meeting — May 13, 2024', '2024-05-13', 'Board Meeting', 'approved', 'transcribed', 'Supervisor Zimmerman called the meeting to order at 7:00 PM.

Pledge of Allegiance.

**Members Present:** Zimmerman, Majewski, Tobin, Carey
**Members Absent/Excused:** Bridges
**Staff Present:** Fire Chief/County Commissioner D. Majewski, Zoning Admin. Hassberger, Planning Members Blaisdell, McCaslin and Ostrowski
**Also Present:** Sheriff''s Deputy Oster and 3 other interested persons.

---

Minutes of the 08 April, 2024 meeting approved as presented.

Treasurer''s report was accepted as presented.

Motion by Zimmerman to pay the monthly bills, second by Tobin, roll call vote, all in favor, motion carried.

County Commissioner D. Majewski reported that the wording for millage renewals on the August 2024 ballot were approved; the County Clerk''s request for technology upgrades for elections was not approved, however, Commissioner Majewski did support the request. Pete Preston from Equalization reported that Clare County would likely see an increase in taxable value to the capped max of 5%.

Chief D. Majewski reported that the new Engine is due for delivery to the township on May 20th. The fire department will give away their smoke and CO detectors at their fire station on parade day, July 6th IF the Hot Rods and Hot Dogs EXPO does not happen Father''s Day weekend.

Zimmerman reported that he is looking into the brining company sending up a small truck for the Woodland Walk and the end of Browns Road.

Motion by Majewski to approve the Fire Department AD&D Policy for the 25 fiscal year at $4081.00, second by Zimmerman, all in favor, motion carried.

Motion by Majewski to approve the Elected AD&D Policy for the 25 fiscal year at $565.00, second by Zimmerman, all in favor, motion carried.

Motion by Zimmerman to approve the annual membership to the Michigan Association of Planning for $650.00, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to approve the Equalization Contract, option 3, full service, in the amount of $5938.50, second by Carey, all in favor, motion carried.

Motion by Zimmerman to approve a road construction agreement with the Clare County Road Commission for 300 feet of asphalt overlay on Lincoln Road East of Finley Lake, all in favor, motion carried.

Motion by Zimmerman to adopt resolution number 051324-A, a resolution regarding a wage freeze for elected officials for the 25 fiscal year, second by Carey, roll call vote, 4 yes, resolution adopted.

Motion by Zimmerman to adopt resolution number 051324-B, a resolution to adopt the revised Master Plan, second by Tobin, roll call vote, 4 yes, resolution adopted.

Zimmerman read a letter of resignation effective May 31, 2024 from Blight Enforcement Officer Deb Trim. Trim will assist her replacement with training until July 31, 2024.

Motion by Zimmerman to accept with regret, the resignation from Trim, second by Carey, all in favor, motion carried.

Motion by Zimmerman to appoint the Ordinance Enforcement Assistant Ken Logan to the position of Ordinance Enforcement Officer, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to adopt resolution 151324-C, a resolution regarding changes in lighting service with Consumers Energy, second by Tobin, roll call 4 yes, resolution adopted.

Motion by Zimmerman to approve a LED street lamp at 445-455 Arbor Dr., for $100.00, second by Tobin, all in favor, motion carried.

Discussion about pole structure at Compost Field. Table until June.

---

Public Comments offered on blight at 108 N. St., Bertha Lake Park Porta John needs to put back inside of park and not at boat launch, updates on broadband, cell phone tower(s) and what the township plans to do with the old School House.

Motion by Tobin and seconded by Carey to adjourn the meeting, all in favor, meeting adjourned at 7:55 pm.

---

Respectfully Submitted,

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2024-06-19-annual-meeting', 'Annual Meeting — June 19, 2024', '2024-06-19', 'Annual Meeting', 'approved', 'transcribed', 'Supervisor Zimmerman called the meeting to order at 10:29 AM.

**Members Present:** Zimmerman, Carey, Majewski, Tobin and Sherrod
**Staff Present:** Fire Chief D. Majewski

---

Minutes from the FY 2024 Annual Corporate meeting held on 29 June 2023 accepted as presented.

Motion by Majewski to adopt resolution number 061924-A, a resolution to adopt the FY 2025 budget, in accordance with the General Appropriations Act, second by Carey, roll call vote, 5 yes, motion carried.

Motion by Zimmerman to retain Adrew Thompson of PDKST Attorneys at Law; and to retain Chris Patterson of the law firm FSBR PLC as township legal representation, second by Carey, all in favor, motion carried.

Motion by Majewski to retain the Weinlander Fitzhugh CPA''s as the township auditor/accountant, second by Tobin, all in favor, motion carried.

Motion by Carey to retain the Huntington Bank, Mercantile Bank and Isabella Bank as depositories for township funds, second by Zimmerman, all in favor, motion carried.

Motion by Zimmerman to adopt resolution number 051324-A, a resolution wherein the recommendation is to **not** increase the wages of the elected officials, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to approve the Malley Well Drilling bid for the new wells at the Silver Lake Park in the amount of $7758.00 and Bertha Lake Park in the amount of $8578.00, total: $16,336.00, second by Tobin, all in favor, motion carried.

Motion by Majewski to approve the updated property and liability insurance bid from MMRMA that now includes the new fire truck to a total of $35,682 for FY 2025, second by Carey, all in favor, motion carried.

There is no invoice for the workers comp yet. Majewski has reached out to the insurance agent to send an invoice.

Motion by Zimmerman to approve the Wage/Salary/Per Diem Schedule for Non-Elected Township Employees and appointees as presented and included in the FY 25 budget, second by Sherrod, all in favor, motion carried.

---

Public Comment: None Offered.

Motion by Carey to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 10:58 AM.

---

Respectfully Submitted,

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2024-06-19-budget-meeting', 'Budget Meeting — June 19, 2024', '2024-06-19', 'Budget Meeting', 'approved', 'transcribed', 'Supervisor Zimmerman called the meeting to order at 10:02 AM.

**Members Present:** Zimmerman, Carey, Majewski, Tobin and Sherrod
**Staff Present:** Fire Chief D. Majewski

---

Minutes from the FY 2024 Budget meeting held on 29 June 2023 accepted as presented.

## Review of proposed budget

Projected Revenues and Expenses for Fiscal Year 2024/2025 are anticipated as follows:

- Fire Fund: Projected Revenue: $318,883.00; Projected Expenses $294,306.00
- Law Fund: Projected Revenue: $191,815.00; Projected Expenses $119,705.00
- Liq. Fund: Projected Revenue: $691.00; Projected Expenses $691.00
- Gen. Fund: Projected Revenue: $1,072,329.00; Projected Expenses $1,268,914.00

Discussion items:

1. Discussion on increasing the township hall repairs and maintenance $15,000.00 for the purpose of upgrading the upstairs bathrooms with flooring, paint and new toilets/urinals.
2. Create new expense line for parks and utilities in order to reduce redundancy.
3. Add an additional payroll line for Canoe Sub, Tice Trail and West Lake George Dr. S/A''s to better track the expenses.
4. Chief Majewski requested that Air Packs (SCBA) be budgeted at $45,000.00
5. Compost field will need account adjustments for the pole structure.

Motion by Majewski to adjust the general fund budget $29,942.00, second by Carey, all in favor, motion carried.

Motion by Majewski to adjust the fire fund budget $272,354.00, second by Carey, all in favor, motion carried.

Motion by Majewski to adjust the law fund budget $60.00, second by Carey, all in favor, motion carried.

There are no budget adjustments to the Liquor Fund. There will be a transfer of funds from liquor to law in the amount of $691.03.

Motion by Zimmerman to send proposed/projected budget to the annual meeting for consideration, second by Carey, all in favor, motion carried.

---

Public Comment: None.

Motion by Carey to adjourn the meeting, second by Sherrod, all in favor, meeting adjourned at 10:28 AM.

---

Respectfully Submitted,

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2024-07-08-appointment-of-inspectors', 'Appointment of Inspectors — July 8, 2024', '2024-07-08', 'Appointment of Inspectors', 'approved', 'transcribed', 'Supervisor Zimmerman called the meeting to order at 6:55 PM.

**Present:** Zimmerman, Majewski, and Carey.

---

Zimmerman stated the purpose of the meeting is to appoint election inspectors for the August 06, 2024 Presidential Primary Election.

Motion by Zimmerman to approve the January 26, 2024 Election Commission minutes as presented, second by Carey, all in favor, motion carried.

Motion by Majewski to appoint Deb Briggs -- R, Bob Klenke -- R, Mary Klenke -- R, Kay Little -- R, Karen Westphal -- R, Bob Guzowski -- D, Sue Guzowski -- D, Sheryl Judd -- D, and Deb Sherrod -- D as Election Inspectors for the August 06, 2024 Presidential Primary election, second by Zimmerman, all in favor, motion carried.

---

Public Comment: None Offered.

Motion by Carey to adjourn the meeting, second by Majewski, all in favor, meeting adjourned at 6:58 PM.

---

Respectfully Submitted,

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2024-07-08-board-meeting', 'Board Meeting — July 8, 2024', '2024-07-08', 'Board Meeting', 'approved', 'transcribed', 'Supervisor Zimmerman called the meeting to order at 7:00 PM.

Pledge of Allegiance.

**Members Present:** Zimmerman, Majewski, Carey, Sherrod, Tobin.
**Members Absent:** None
**Staff Present:** Zoning Admin. Hassberger, Planning Members Szczpanski, McCaslin and Ostrowski, Lakes Dir. R. Carey, Fire Chief/County Comm. D. Majewski
**Other Present:** Deputy Oster and 12 other interested persons.

---

Minutes of the 10 June, 2024 meeting approved as presented.

Treasurer''s report was accepted as presented.

Motion by Sherrod to pay the monthly as presented, second by Tobin, roll call vote, 5 yes, motion carried.

Several candidates for office and speakers addressed the group.

Chief Majewski gave the fire department report with 31 rescues, 3 fire and 1 weather related runs for the month of June, 230 runs year to date. Chief Majewski reviewed the events of 05 July in regards to the confirmed EF1 Tornado in Lincoln Township. He confirmed that the Silver Lake Siren did not sound. ProComm is coming out to make the needed repairs. He urged everyone to stay away from downed power lines and trees. Power lines are frequently entangled in trees and are not easy to see. Please wait for Consumers to clear the way. Chief Majewski also thanked the many people who called to see if there was anything they could do to help.

Motion by Zimmerman to appoint Jeff Simons, as a Regular member of the Zoning Board of Appeals, second by Tobin, all in favor, motion carried.

Motion by Zimmerman to authorize the clerk to purchase a computer and printer, not to exceed $1500.00, to be utilized by Ordinance Enforcement and Fire Department Lieutenant, second by Carey, all in favor, motion carried.

Announcements: July BOR July 16, 2024 at 6 pm. Mutual Mistakes of Facts and Clerical Errors, Qualified Forestry, Qualified Ag Poverty Exemptions.

---

Public Comment: There were 6 comments shared about the Spongy Moth Millage, Monroe Rd. being very nice, reminder to vote in the primary election, ordinance enforcement procedures, directional signs indicating where the Bertha Lake Park and Silver Lake Park are, and the Clare County Fair.

Motion by Zimmerman to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 8:06 pm.

---

Respectfully Submitted,

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2024-07-10-testing-minutes', 'Testing Minutes — July 10, 2024', '2024-07-10', 'Testing Minutes', 'approved', 'transcribed', 'The meeting was called to order by Clerk Majewski at 10:00 AM.

**Present:** Clerk Majewski, Treasurer Carey''s authorized assistant Deb Sherrod, Supervisor Zimmerman''s authorized assistant Sheryl Judd. There was no public present.

---

The State of Michigan Compiled Laws (MCL 168.798) requires that prior to each election all electronic tabulating equipment must be tested to verify that the equipment is performing properly, the ballots have been properly prepared for each precinct and that the programs will accurately count votes. It is the responsibility of the election commission or its authorized assistant(s) (r 168.776) to conduct a preliminary and public accuracy test where a "test deck" of voted ballots is tabulated by the electronic equipment and the results are verified against predetermined results.

On 10 July 2024 a preliminary test was performed on ICP Tabulator AAFAKEL0088 and Tabulator AAFAJK10568. There were no concerns in regards to the accuracy of the preliminary testing of either tabulator.

On 10 July 2024, immediately following the preliminary testing of both Lincoln Township tabulators, a Public Test was performed on ICP1 AAFAKEL0088. There were no concerns in regards to the accuracy of the public testing of the tabulator. The tabulator memory devices were sealed with: AAFAKEL0088 -- 0039511 and 44462 and AAFAJK10568 -- 44455 and 44466.

The VAT, serial number 6DPW7300GC was tested and there were no concerns found during testing. The memory device was sealed with seal number 039512.

ICP and VAT related testing ballots and testing materials were stowed in an approved ballot container (red bag) with seal number 0025296 on 7/10/24.

---

Public Comment: None Offered.

---

Respectfully Submitted,

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2024-08-19-board-meeting', 'Board Meeting — August 19, 2024', '2024-08-19', 'Board Meeting', 'approved', 'transcribed', 'Clerk Majewski called the meeting to order at 10:00 AM.

**Members Present:** Carey, Majewski, Tobin, Sherrod
**Members Absent:** None
**Staff Present:** Fire Chief D. Majewski, Zoning Admin. Hassberger, Asst. Fire Chief J. Cogswell, Sexton J. Smith
**Also Present:** Three other interested persons.

---

Majewski made a motion to appoint Carey as meeting chairperson, seconded by Tobin, all in favor, motion carried.

Carey acknowledged the death of our Supervisor, Dennis Zimmerman. Carey explained that the board has 45 days from the date of death to appoint an individual to fulfill the term left vacant. Carey reviewed the statutory and other non-statutory duties of the Township Supervisor. Discussion was had in regards to the busy upcoming tax season, and the November election approaching making it difficult on the treasurer and clerk to absorb duties of the office of Supervisor.

Majewski proposed that Troy Kibbey is the only person who has submitted candidate paperwork for the office of Supervisor for the November election and she feels it is reasonable to appoint him to finish Supervisor Zimmerman''s term, ending Nov. 20, 2024, if he wishes to accept.

Tobin requested that he be allowed to chair the September regular meeting of the board.

Carey moved to appoint Troy Kibbey to fulfill the term of Supervisor Zimmerman, second by Tobin, roll call vote, 4 yes, motion carried.

Mr. Kibbey accepted the appointment to the office of Township Supervisor.

---

Public Comment: None offered.

Motion by Majewski to appoint Roger Carey to Lakes Director, second by Tobin, all in favor, motion carried.

Motion by Majewski to adjourn the meeting, second by Sherrod, all in favor, meeting adjourned at 10:20 AM.

---

Respectfully Submitted,

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2024-09-09-board-meeting', 'Board Meeting — September 9, 2024', '2024-09-09', 'Board Meeting', 'approved', 'transcribed', 'Trustee Tobin spoke of the hard work and dedication of Dennis Zimmerman during his 24 plus years as Township Supervisor. Dennis passed away on August 16, 2024.

Trustee Tobin introduced newly appointed Supervisor Troy Kibbey.

Supervisor Kibbey called the meeting to order at 7:04 PM.

Pledge of Allegiance.

**Roll Call/Members Present:** Kibbey, Carey, Tobin, Sherrod and Majewski
**Staff Present:** Chief D. Majewski, Zoning Admin. Hassberger, Lakes Dir. R. Carey, Planning Members Blaisdell, Ostrowski, Szczepanski and McCaslin, Ord. Enf./Fire Lt. Logan, Asst. Fire Chief Cogswell, Fire Fighters F. Witchell and C. Witchell, Sexton Smith, ZBA Member Simons
**Other Present:** Sheriff Wilson, Deputy Oster and 41 other interested persons, friends, family and neighbors of Supervisor Zimmerman.

---

Motion by Tobin to approve the minutes of the 13 August, 2024 regular meeting and the 19 August, 2024 Special meeting, second by Sherrod, 5 yes, motion carried.

Motion by Sherrod to pay the monthly bills, second by Tobin, roll call vote, five yes, motion carried.

Motion by Tobin to accept the treasurer''s report as presented, second by Sherrod, all in favor, motion carried.

---

Chief Majewski reported 321 runs year to date with 33 rescues, 1 fire, 15 powerline and 2 mutual aid related runs for the month of August 2024. Fire Fighter and Trustee Jerry Bridges funeral will be on Friday September 20th in Farwell at Campbell Stocking funeral home; Visitation is at 11am, funeral is at 12pm. Luncheon follows at the White Birch Campground.

Two bids for surveying the old school house were considered. Timothy Bebee of CMS & D submitted a bid for $1,450.00; and Frank Willis of LCM Surveying & Engineering submitted a bid for $850.00.

Motion by Tobin to approve the bid from Frank Willis to survey the old school house property in the amount of $850.00, second by Carey, all in favor, motion carried.

It was explained that the recycle bins have been moved to the Compost Field. They are accessible Monday -- Friday 7am to 5pm and Sunday 9am to noon. The gate will be moved back in the next week so that the bins are accessible all day, every day.

---

Public Comment: There were comments about the GFL trucks leaking fluids, ZBA is doing a training on Thursday, and Stephanie from the Mid-Michigan Community Action Agency explained that they have funding available for delinquent taxes, weatherization, critical home repair, and well and septic. Former State Representative Jeff Pepper spoke of Dennis'' knowledge of Lakes, Rivers, and all things Riparian.

Dennis'' niece, Morgan, read a page of numbered notes found on her uncle''s desk after his death. The following is what was written in those notes:

1. No matter how trivial, silly, or petty the complaint, it is probably based on a legitimate concern.
2. If a person is interested enough or concerned or mad enough to show up at a hearing or meeting, the complaint likely has merit.
3. Assume all problems are worthy of at least some consideration. Help that person and focus and explain what, how, where, why.
4. Prioritize (i.e. time/money, budgeting) and be prepared to explain -- anticipate complaints and objections.
5. Encourage different opinions -- you may not only get better ideas, but you turn enemies to supporters.
6. Keep your own remarks brief, but on point.
7. Appoint good people -- let them take the job and make it theirs. (i.e. planning commission, fire chief etc.) Don''t micromanage. You will be pleasantly surprised.

Everyone present was invited to stay for sweet treats and refreshments in honor of Supervisor Zimmerman.

Motion by Sherrod to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 7:38 PM.

---

These minutes are respectfully submitted and dedicated to our friends and fellow board members, Dennis Ray Zimmerman and Jerry Vance Bridges. May they rest in eternal peace.

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2024-10-10-testing-minutes', 'Testing Minutes — October 10, 2024', '2024-10-10', 'Testing Minutes', 'approved', 'transcribed', 'The meeting was called to order by Supervisor Kibbey at 2:05 PM.

**Present:** Clerk Majewski, Treasurer Carey''s authorized assistant Sheryl Judd, Supervisor Kibbey, Deputy Clerk Sherrod, Election Inspector Guzowski, Surrey Township Clerk Bradbury. There was no public present.

---

The State of Michigan Compiled Laws (MCL 168.798) requires that prior to each election all electronic tabulating equipment must be tested to verify that the equipment is performing properly, the ballots have been properly prepared for each precinct and that the programs will accurately count votes. It is the responsibility of the election commission or its authorized assistant(s) (r 168.776) to conduct a preliminary and public accuracy test where a "test deck" of voted ballots is tabulated by the electronic equipment and the results are verified against predetermined results.

On 10 Oct. 2024 a preliminary test was performed on ICP2 Tabulator VAL23490047-004 and ICP2 Tabulator 23490031-004. There were no concerns in regards to the accuracy of the preliminary testing of either tabulator.

On 10 Oct. 2024, at 2:05 PM, immediately following the preliminary testing of both Lincoln Township tabulators, a Public Test was performed on ICP2 VAL23490047-004. There were no concerns in regards to the accuracy of the public testing of the tabulator and the tabulators were sealed with: VAL23490047-004 -- 74557 and 74566. (original seal 74555 failed) VAL 234490031-004 -- 74554 and 74562.

The VAT, serial number 6DPW7300GC was tested and there were no concerns found during testing. The memory device was sealed with seal number 74565.

ICP and VAT related testing ballots and testing materials were stowed in an approved ballot container (red bag) with seal number 0062484 on 10/10/24.

---

Public Comment: None Offered.

---

Respectfully Submitted,

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2024-10-14-board-meeting', 'Board Meeting — October 14, 2024', '2024-10-14', 'Board Meeting', 'approved', 'transcribed', 'Supervisor Kibbey called the meeting to order at 7:00 PM.

**Members Present:** Carey, Majewski, Kibbey, Tobin and Sherrod.
**Members Absent:** None
**Staff Present:** Fire Chief D. Majewski, Zoning Admin. Hassberger, Planning Chair Blaisdell, Ord. Enf. Logan, Zoning Brd. Member Simons.
**Others:** Deputy Oster and 4 other interested persons.

---

Motion by Tobin to approve the 09 September 2024 minutes, second by Sherrod, all in favor, motion carried.

Motion by Sherrod to approve the treasurer''s report, second by Tobin, all in favor, motion carried.

Motion by Sherrod to pay the monthly bills, second by Tobin, roll call vote, 5 yes, motion carried.

---

Commissioner D. Majewski reported that the Board of Commissioners approved the 2025 county budget. They approved a $25 per diem increase for the Board of Canvassers and Jury Board; the contracts with the unions have been ratified and negotiations went well; the contract with Region Area Agency on Aging was approved on behalf of Senior Services.

Karen Tomczyk, candidate for the 55th Court Circuit Judge, introduced herself and said a few words about her qualifications and background.

Mike Tobin, candidate for Lincoln Township Trustee said a few words about the importance of voting and encouraged everyone to vote.

Fire Chief Majewski said that they have had 384 runs year to date; 44 rescue related runs in September. There are 2 new fire fighters. Chief Majewski anticipates that there will be 4 students for the Fire Fighter 1 and 2 class coming this fall. There will be an Open House at the Fire Station on Oct. 31, 2024 from 5PM to 7PM for the Trick or Treaters to get a nice treat, enjoy donuts and cider and see the equipment. Everyone is welcome! Lt. Logan is working on quotes for 4 new SCBA. Fire Fighter Fred Witchell is retiring and everyone is invited to the fire station on October 26th from 1PM to 4PM for refreshments in honor of Fred.

---

Motion by Carey to approve an amount not to exceed $1,200.00 for the purpose of purchasing a computer for the cemetery department, second by Sherrod, all in favor, motion carried.

Motion by Tobin to approve the proposed price increases associated with burials with an effective date of 01 January 2025, as presented:

- Plots: unchanged at $100.00 each
- Open/Close a grave: Summer - $550.00
- Open/Close a grave: Winter - $750.00
- Cremation Burial: $360.00
- Infant Burial: $250.00
- Sat., Sun., Holiday Burial: $125.00
- Foundations standard size of 20" x 32" - $150.00
- Larger Foundations - additional .30/sq. inch

Second by Sherrod, all in favor, motion carried.

Motion by Tobin to approve the bid from Blain Excavating in the amount of $4,200.00 for the purpose of clearing the area between the municipal parking and the boat launch of brush and debris, second by Sherrod, all in favor, motion carried.

Motion by Tobin to approve the bid from Blain Excavating in the amount of $7,500.00 for the purpose of laying down crushed asphalt from the Arthur Road entrance of the compost field to the pole structure entrance, second by Carey, all in favor, motion carried.

---

Public Comment: Concerns about the Monroe Rd project were discussed. Kibbey will investigate.

Motion to adjourn the meeting by Sherrod, second by Tobin, all in favor, meeting adjourned at 7:29 PM.

---

Respectfully Submitted,

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2024-10-14-election-minutes', 'Election Minutes — October 14, 2024', '2024-10-14', 'Election Minutes', 'approved', 'transcribed', 'Supervisor Kibbey called the meeting to order at 7:31 PM.

**Present:** Kibbey, Carey and Majewski.

---

Motion by Majewski to appoint Election Inspectors: Deb Briggs R, Bob Klenke R, Mary Klenke R, Kay Little R, Karen Westphall R, Deb Sherrod D, Sheryl Judd D, Bob Guzowski D, Sue Guzowski D, for the November 5, 2024 General/Presidential Election, second by Carey, all in favor, motion carried.

Motion by Kibbey to approve the ICP Tabulator testing minutes from 10 July 2024, second by Carey, all in favor, motion carried.

Motion by Kibbey to approve the ICP Tabulator testing minutes from 10 October 2024, second by Carey, all in favor, motion carried.

---

Public Comment: None Offered.

Motion by Kibbey to adjourn the meeting, second by Carey, all in favor, meeting adjourned at 7:33 PM.

---

Respectfully Submitted,

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2024-12-09-board-meeting', 'Board Meeting — December 9, 2024', '2024-12-09', 'Board Meeting', 'approved', 'transcribed', 'Supervisor Kibbey called the meeting to order at 7:00 PM.

**Members Present:** Carey, Majewski, Tobin, Kibbey and Simons.
**Members Absent:** None
**Staff Present:** Fire Chief D. Majewski, Zoning Admin, Asst. Fire Chief and Ord. Enf. Logan, Planning Chair Blaisdell, Planning member Ostrowski, Lakes Commissioner R. Carey
**Also Present:** 11 other interested persons.

---

Motion by Simons to approve the 11 November 2024 minutes as presented, second by Tobin, all in favor, motion carried.

Motion by Simons to approve the treasurer''s report as presented, second by Tobin, all in favor, motion carried.

Motion by Simons to pay the monthly bills as presented, second by Tobin, roll call vote, 5 yes, motion carried.

---

County Commissioner D. Majewski reported that the law suit that Prosecutor Ambrozatias had against the County Board of Commissioners was dismissed by the appeals court. The suit cost the taxpayers $80,000.00 in legal fees; the BOC is considering options for recovering those legal fees.

Chief D. Majewski reported 43 Rescue, 1 fire, 1 powerline and 473 year to date. We have one fire fighter in class and the new air packs are in service.

Mike Tobin expressed his gratitude to Marilyn Hudson for her volunteer gardening at the cemetery. She keeps it looking beautiful and we are so lucky to have her and very thankful for her.

---

Motion by Tobin to approve the budget adjustments as presented by Majewski, $162,832.00 general fund, $7,305.00 fire fund, second by Simons, all in favor, motion carried.

Motion by Kibbey to appoint Paula Keasey as a member on the Zoning Board of Appeals, second by Tobin, all in favor, motion carried.

Motion by Kibbey to appoint Bob Keasey and Deb Sherrod as members on the Board of Review, second by Carey, all in favor, motion carried.

Motion by Simons to adopt Ordinance 120924-A, an ordinance to change the zoning classification of properties 010-007-402-74 and 010-007-402-78, property situated at 400 S. Bringold, from R1 (residential one) to C2 (commercial two), as recommended by the Planning Commission, second by Tobin, roll call vote, 5 yes, motion adopted.

---

Public comment: Comments were made in regards to the Verizon Tower going in on Cedar, blight concerns, future paving of Monroe Rd. and comments were heard in regards to the assessor, Becky Taylor, being rude and using unfair tactics in assessing and in dealing with the public. The board is aware of the situation and will be addressing the issue in the coming days.

Motion by Tobin to adjourn the meeting, second by Simons, all in favor, meeting adjourned at 7:30 PM.

---

Respectfully Submitted,

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2025-01-20-special-meeting', 'Special Meeting — January 20, 2025', '2025-01-20', 'Special Meeting', 'approved', 'transcribed', 'Supervisor Kibbey called the meeting to order at 4pm.

**Members Present:** Carey, Majewski, Kibbey, Simons, Tobin

**Others Present:** Assessor Casey Guthrie

---

There were 6 proposals submitted:

- Spicer Group contract price was $98,000
- Williams & Works contract price was $100,000.00
- Rowe contract price was $98,600.00
- Johnson Hill contract price was $95,750
- Fleis & Vandenbrink contract price was $96,000.00
- Prein & Newhof contract price was $88,000.00

There was discussion on the scoring, proposals contents, project scope items and what will be allowed in the project. The park already has water and electricity. This grants main scope items are bathrooms, mixed use court, and sensory/play equipment. Other items may be allowed if there is any funding after the main scope items and if approved by CMF-DNR.

Majewski recommended the board approve the Prein & Newhof proposal for a varied reasons; Prein & Newhof has completed projects elsewhere in the county; they are 36 miles from the project location, their proposal was complete, detailed and understandable and finally, it was the lowest cost at $88,000.00.

---

Motion by Carey to adopt resolution number 012025-A, a resolution pertaining to the securing of the Prime Professional and Construction Management Services for the project Find Your Joy at Shingle Lake Park, second by Tobin, roll call vote, 5 yes, resolution adopted.

---

Public Comment: None Offered.

Motion to adjourn the meeting by Simons, second by Tobin, all in favor, meeting adjourned at 5:05pm.

---

Respectfully Submitted,

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2025-02-10-board-meeting', 'Board Meeting — February 10, 2025', '2025-02-10', 'Board Meeting', 'approved', 'transcribed', 'Supervisor Kibbey called the meeting to order at 7:00pm.

Pledge of Allegiance.

**Members Present:** Kibbey, Carey, Majewski, Simons, Tobin.

**Staff Present:** D. Majewski, D. Hassberger, P. Blaisdell, R. Carey

**Also Present:** Deputy Bret Holmes, and two other interested persons.

---

Motion by Tobin to approve the minutes of January 13, 2025 regular meeting and January 20, 2025 special meeting, second by Simons, all in favor, motion carried.

Motion by Tobin to accept the treasurer''s report as presented, second by Simons, all in favor, motion carried.

Motion by Simons to pay the monthly bills, second by Tobin, Roll call vote, 5 yes, motion carried.

---

County Commissioner D. Majewski reported that the new chairperson of the County Board of Commissioners is George Gilmore and the Vice Chair is Rickie Fancon. The Board of Commissions passed a temporary hiring freeze at their last meeting.

Chief D. Majewski reported that there have been 46 runs year to date, with 25 rescue, 3 fire and 3 gas leak related runs for the month of January.

---

Motion by Tobin to approve the proposal from Wade Trim for the purpose of updating the township Recreation Plan, in the amount of $9,200.00, second by Simons, roll call vote, 5 yes, motion carried.

---

Public Comment: Majewski will get bids for the bathroom floors; they are squishy. Comment was made on the eliminating the zoning permit fee for recreational vehicle and temporary storage on vacant lots; Franklin Township webmaster introduced himself; Discussion on the Northern Pike size in Lake George and the need or approval from the DNR to catch smaller fish to reduce the number as the fishes are not growing because of over population.

Motion by Simons to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 7:36pm.

---

Respectfully Submitted,

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2025-03-10-board-meeting', 'Board Meeting — March 10, 2025', '2025-03-10', 'Board Meeting', 'approved', 'transcribed', 'Supervisor Kibbey called the meeting to order at 7:00 PM.

Pledge of Allegiance.

**Members Present:** Kibbey, Carey, Majewski, Tobin. Absent Excused Simons.

**Staff Present:** D. Majewski, D. Hassberger, P. Blaisdell, R. Carey, J. Ostrowski

**Also Present:** 4 other interested persons

---

Motion by Tobin to approve the February 10, 2025 minutes, second by Carey, all in favor, motion carried.

Motion by Tobin to accept the treasurers report as presented, second by Kibbey, all in favor, motion carried.

Motion by Kibbey to pay the monthly bills, second by Tobin, roll call vote, 4 yes, motion carried.

---

Clay and Hanna Unicorn presented their proposal on the Unicorn Gardening Club. They are planning to plant and maintain native perennials & pollinators, grow a community garden at the Horn, install educational signage, host workshops and hands on learning experiences. They wish to plant at the Veteran''s Corner, the Welcome signs, parks and other public properties. Their meetings will be on Mondays starting in April. The board supports this project and further information will be forthcoming in April.

Chief Majewski reported that there were 25 rescues, 3 fire and 3 gas leak related runs in February, and 79 runs year to date.

Clerk Majewski explained the Forestry Grant that is being submitted for the purpose of removing 16 diseased trees at the Shingle Lake Park, and purchasing, planting and maintaining 60 trees. The amount being requested is $34,200.00.

Planning Chair Blaisdell reported that the Planning Commission is working on finalizing the zoning map and the work on the Recreation Plan is underway. They will be considering a request from TMobile to put service on the new Verizon Tower at Ringley''s Corner.

---

Motion by Tobin to adopt resolution 031025-A, a resolution pertaining to the fee structure of the Zoning Permit for Recreational Vehicles and Temporary Structures, second by Carey, roll call vote, 4 yes, motion carried.

Motion by Kibbey to approve the required letter to employees explaining the Earned Sick Time Act, second by Tobin, all in favor, motion carried.

Motion by Tobin to approve the quote from Integral Builders of $15,280.84 for the purpose of materials and labor involved in remodeling the township hall upstairs bathrooms, including, flooring, sub flooring, toilets, baseboards, and men''s room partition, second by Carey, all in favor, motion carried.

Motion by Tobin to renew the service proposals for the spring and fall clean-up at Shingle Lake Park at $450 spring/$900 fall, Bertha Lake Park $295 spring/$325 fall, Silver Lake Park $325 spring/$450 fall, and Cemetery mowing weekly at $190, spring clean-up $650 and fall clean-up $1250 and fertilization per season $1400, second by Carey, all in favor, motion carried.

---

Public Comment: When is the resolution effective; that would be immediate and any already paid for the 2025 season will be reimbursed/returned. There was comment on many campers at White Birch have refused to get a zoning permit. There was one comment on the pricing for Monroe Rd.

Motion by Carey to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 7:38 PM.

---

Respectfully Submitted,

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2025-04-14-board-meeting', 'Board Meeting — April 14, 2025', '2025-04-14', 'Board Meeting', 'approved', 'transcribed', 'Supervisor Kibbey called the meeting to order at 7:00 PM.

Pledge of Allegiance.

**Members Present:** Kibbey, Carey, Majewski, Tobin and Simons.

**Staff Present:** D. Majewski, D. Hassberger, P. Blaisdell, R. Carey, J. Ostrowski

**Also Present:** 12 other interested persons

---

Motion by Tobin to approve the March 10, 2025 minutes, second by Carey, all in favor, motion carried.

Motion by Simons to accept the treasurers report as presented, second by Tobin, all in favor, motion carried.

Motion by Simons to pay the monthly bills, second by Tobin, roll call vote, 5 yes, motion carried.

---

County Commissioner D. Majewski reported that their monthly meetings will continue to have the Zoom option available to those who wish to attend by electronic transmission. The board decided to do away with the Committee of the Whole meetings. Amtrak will be running from Lansing to Mackinaw with a stop in Clare. It will be possible to ride from Clare to Mackinaw and possibly in the future, from Clare to Chicago.

Chief Majewski reported that there were 36 rescues, 8 fire related runs in March, and 135 runs year to date. Fire fighter Hunter Lewis has graduated from Fire Fighter 1 class; there are two in Medical First Responder. There is a new applicant, Nathon Rohrbacher. The fire department will be having a pancake breakfast on Saturday May 24, 2025 from 9AM to Noon at the Township Hall. The Fire Department received a grant from TC Energy in the amount of $5,000.00 for their safety program. Question from public: Is there a fine involved if you burn during a ban. Answer: Yes, a $500 fine is available courtesy of the DNR if they so deem a fine is necessary. Chief Majewski encourages everyone to call the burn permit line before you burn: 866-922-2876.

Tobin reported that Marilyn Hudson has agreed to do the flower beds at the cemetery again this year. Thank you Marilyn!

---

Motion by Tobin to adopt resolution 041425-A, a resolution regarding the paid sick time for employees of the township, second by Simons, roll call vote 5 yes, resolution adopted.

Motion by Tobin to approve a general fund expenditure of $700.00 for the purpose of purchasing flowers for landscape downtown, Veteran''s Corner and Township Hall, second by Simons, all in favor, motion carried.

Motion by Simons to approve a general fund expenditure of $9,200.00 to Blain Excavating for the purpose of a 1650 gal septic tank, and extending the drain field at the township hall, second by Carey, all in favor, motion carried.

Motion by Carey to approve a general fund expenditure of $2,080.07 for the purpose of replacing the lap top computers for the supervisor and for the clerk, second by Tobin, all in favor, motion carried.

---

Public Comment:

Rolf Hudson commented on the lake levels. Cindy Englehardt commented on the wake boats damaging the shores and if they can be banned from the lakes. Jeff Simons announced that the Conservation District Board, of which he is a member, has hired a Forester.

The 2025 Brining schedule is April 23rd, May 21st, June 24th and Aug. 28th.

Hanna and Clay Unicorn gave an update on the garden club plans. Hanna has contacted Miss Dig and they would like to plant flowers the area between the sidewalk and road from the Dollar Store to the Veteran''s Corner. Hanna has presented a raised bed design and costs for the board''s consideration. Hanna is approved to purchase flowers with the $700.00 in earlier approved funds.

Question from Roy Birdsall about sign for blind drive on Monroe; Troy will check on that. Troy explained that budget for the roads, how the funds are and should be expended. The road millage is due to be on the ballot in 2026.

Motion by Simons to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 7:58 PM.

---

Respectfully Submitted,

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2025-04-21-elections', 'Elections — April 21, 2025', '2025-04-21', 'Elections', 'approved', 'transcribed', 'Supervisor Kibbey called the meeting to order at 11:45 AM.

**Present:** Kibbey, Carey and Majewski.

---

Motion by Majewski and second by Carey to appoint as election inspectors for the 06 May 2025 Special Election:

- Deb Sherrod, D
- Sheryl Judd, D
- Carol Majewski, D
- Bob Guzowski, D
- Mary Sue Guzowski, D
- Linda Boos, R
- Deb Briggs, R
- Bob Klenke, R
- Karen Westphal, R
- Kay Little, R

All in favor, motion carried.

---

Public Comment: None Offered.

Motion by Kibbey to adjourn the meeting, second by Carey, all in favor, meeting adjourned at 11:47 AM.

---

Respectfully Submitted,

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2025-05-12-board-meeting', 'Board Meeting — May 12, 2025', '2025-05-12', 'Board Meeting', 'approved', 'transcribed', 'Supervisor Kibbey called the meeting to order at 7PM.

**Members Present:** Kibbey, Majewski, Carey, Simons. Tobin was absent and excused.

**Staff Present:** D. Hassberger, D. Majewski.

**Also Present:** Road Commission representatives D. Bondie and D. Rogers and 10 other interested persons.

---

Motion by Carey to approve the 21 April 2025 workshop minutes as presented, second by Simons, all in favor, motion carried.

Motion by Carey to approve the 08 April 2025 regular meeting minutes as presented, second by Simons, all in favor, motion carried.

Motion by Simons to approve the treasurer''s report as submitted, second by Kibbey, all in favor, motion carried.

Motion by Kibbey to pay the monthly bills as presented, second by Simons, roll call vote, 4 yes, one absent, motion carried.

---

County Commissioner D. Majewski reported that there is a household waste collection at the Northern Oaks facility in Harrison on 2 August 2025 from 9AM to 2PM.

Kibbey introduced D. Bondie and D. Rogers of the Clare County Road Commission. Discussion on projects ensued. Bringold Ave. south of Browns Rd. is nearing completion, stumps, tree removal, ditches, hydroseeding, culverts, and 6" 22A gravel. Projects under consideration are 1.5" asphalt overlay of Old State Rd. from Jefferson Rd. to Adams Rd.) and the Oakdale Resort Sub project that includes shape, grade and place 4" of MDOT spec. 22A or 22A modified gravel on Lake Dr., Center St. and Pine St.

---

Public Comment:

R. Hudson commented that the same area, Lake St., Center and Pine have been looking to do special assessment for paving. M. Hudson inquired about water run off; Bondie said there will be valley gutters in the project. Other comments included trees being very close to proposed project area, and costs are generally divided by either owner or lots and spread over a 10-year period. Moving on to stripping, D. Rogers explained that the stripers will be in the area soon and the road commission will split the cost of stripping 50/50 with the township if we want to do that. He will send over an estimate for Lincoln Township to consider. R. Hudson appreciates the speed limit signs. The Road Commission does not do "kids playing" signs due to liability issues.

Kibbey explained that Monroe Rd. has had a lot of money spent on it for gravel, and ditches, chip seal. To pave that road, the owners on Monroe will have to consider a special assessment district like others have done. (Arbor Dr., Forest, Shingle Lake Dr., Park St.) The township will do maintenance of roads, such as chip seal, and gravel.

---

Hanna updated the Sidewalk Bloom project. They will be planting on Monday 19 May from 9AM to Noon and then 4PM to 7PM.

D. Majewski gave the fire department report with 172 runs to date. There were 44 rescue and 1 fire related runs in April. There is no open burning until we get significant rain; you may burn in a fire pit. There are 2 in Medical First Responder class. The fire department will be having a Pancake and Sausage Breakfast on Saturday 24 May at the township hall from 9AM to Noon to raise funds for water rescue equipment.

Kibbey relayed information regarding the lake levels being down significantly and his conversation with the Drain Commissioner, Bill Faber. There is nothing to be done about it except pray for rain.

---

Motion by Kibbey to adopt resolution number 051225-A, a resolution to allow the board to consider a wage increase for the elected officials not to exceed 2.5% based of the COLA rounded up to the nearest one dollar, second by Carey, roll call vote, 4 yes, one absent, resolution adopted.

Motion by Kibbey to approve the Equalization Maintenance Contract for July 01, 2025 -- June 30, 2026, for 3964 parcels, including the standard service and GIS/Shapefiles full services, for $5,946.00, second by Carey, roll call vote, 4 yes, one absent, motion carried.

Motion by Kibbey to approve a fire fund expenditure of $4,081.00 for the firefighter''s life insurance policy and additionally, $586.00 for the firefighters Accidental Death and Dismemberment insurance policy, second by Carey, roll call vote, 4 yes, one absent, motion carried.

Motion by Kibbey to approve the Freeman Township Fire Protection and Emergency Services Agreement, commencing on April 01, 2025, and ending on March 31, 2035, in the amount of $90,526.91 yearly with an adjusted annual increase equal to the Michigan Consumer Price Index, second by Carey, all in favor, motion carried.

Motion by Kibbey to approve the road construction agreement for Lake Dr., Center St., and Pine St., including shaping, grading and placing 4" MDOT 22A or 22A modified gravel, for a township share of the costs $15,785.50, second by Carey, roll call vote, 4 yes, one absent, motion carried.

Motion by Kibbey to approve the road construction agreement for 1.5 inches of asphalt overlay with gravel shoulders on Old State Rd from Jefferson Rd. to Adams Rd. including engineering, prepare the roadbed for paving and oversee the contractor, for a township share of $201,414.30, second by Simons, roll call vote, 4 yes, one absent, motion carried.

Motion by Kibbey to agree to Michigan Chloride Sales .22 cents per gallon cost for road brine, second by Simons, roll call vote, 4 yes, one absent, motion carried.

---

Public Comment:

Comments received regarding compost field always being open right now and that there is quite a lot of garbage being left behind; lots of non-recyclables being left, such as tires, windows, doors, grills, and general household garbage. If the abuse keeps up, we will not be able to keep it open all the time and will need to go back to the monitored hours. There were 3 more comments made about roads being more pliable for grading when it is warm out, filling holes in chip seal and that everyone wants to do as much as possible with funding available for roads.

Motion by Simons to adjourn the meeting, second by Carey, all in favor, meeting adjourned at 8:18 PM.

---

Respectfully Submitted,

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2025-06-09-board-meeting', 'Board Meeting — June 9, 2025', '2025-06-09', 'Board Meeting', 'approved', 'transcribed', 'Supervisor Kibbey called the meeting to order at 7PM.

**Members Present:** Kibbey, Majewski, Carey, Simons and Tobin.
**Staff Present:** D. Hassberger, D. Majewski and R. Carey. **Also Present:** Deputy Oster and 7 other interested persons.

---

Motion by Simons to approve the 12 May 2025 meeting minutes as presented, second by Tobin, all in favor, motion carried.

Motion by Tobin to approve the treasurer''s report as submitted, second by Simons, all in favor, motion carried.

Motion by Simons to pay the monthly bills as presented, second by Tobin, roll call vote, 5 yes, motion carried.

---

Fire Chief D. Majewski reported that Pancake Breakfast raised $2500 for water rescue equipment. There are 2 in Medical First Responder Class and 2 officers in Fire Officer 1 training. There were 50 rescue and 1 fire related runs for May, 232 runs year to date.

Clerk Majewski reported that the township has received a grant in the amount of $34,200 for the purpose of removing dead trees from the Shingle Lake Park and purchasing and planting sixty 10-gallon size trees throughout the township.

Tobin reported that the Planning Commission is meeting on 10 June 2025 at 7PM for their regular meeting. They are working on the 5-year Recreation Plan with Wade Trim.

---

Motion by Tobin to approve the annual Michigan Townships Association Dues, Legal Defense and Online Learning Portal in the amount of $4483.54; second by Simons, roll call vote, 5 yes, motion carried.

Motion by Simons to approve a general fund expenditure of not to exceed $700.00 for the purpose of purchasing a power washer for the maintenance department, second by Carey, roll call vote, 5 yes, motion carried.

---

**Public Comment:**

There were comments and discussions on the blight situations in the township. Kibbey explained that there is an updated Blight Ordinance being reviewed at this time. He also commented that the Ordinance Enforcement Officer, Ken Logan is working hard, sending letters and monitoring clean up.

The Budget Meeting will be on 26 June 2025 at 5PM and the Annual Meeting will immediately follow.

---

Motion by Simons to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 7:25 PM.

---

Respectfully Submitted,

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2025-06-26-annual-meeting', 'Annual Meeting — June 26, 2025', '2025-06-26', 'Annual Meeting', 'approved', 'transcribed', 'Supervisor Kibbey called the meeting to order at 5:42PM.

**Members Present:** Kibbey, Majewski, Carey, Simons and Tobin.
**Staff Present:** D. Majewski. **Also Present:** 1 other interested person.

---

Motion by Carey to approve the 19 June 2024 annual meeting minutes as presented, second by Tobin, all in favor, motion carried.

Discussion on proposed wage increases ensued. The elected members of the board have not had a wage increase in 2 years.

Motion by Kibbey to affirm the previously adopted resolution 051325-A and increase the elected officials'' wages by the cost-of-living allowance of 2.5% rounded up to the nearest one-dollar, effective July 01, 2025, second by Carey, roll call vote, 5 yes, motion carried.

Motion by Kibbey to approve an increase of 3.5% rounded up to the nearest half or one dollar for all employees'' and appointees'' wages, salary and per diem schedule, roll call vote, 5 yes, motion carried.

Consideration of the Sexton''s wages shall be tabled until the regular 14 July 2025 meeting due to not having the necessary fee schedule for burials readily available for comparison and review.

Motion by Kibbey to adopt resolution number 062625-A, also known as the Budget General Appropriations Act, as presented, second by Carey, roll call vote, 5 yes, motion carried.

---

Motion by Kibbey to retain the legal counsel of Andrew Thompson of PDKST Attorneys at Law, and to retain Chris Patterson of the firm FSBR PLC, second by Carey, all in favor, motion carried.

Motion by Kibbey to retain the firm of Weinlander Fitzhugh as accountant and auditors for the township, second by Simons, all in favor, motion carried.

Motion by Kibbey to retain Huntington Bank, Mercantile Bank, and Isabella Bank as township funds depositories, second by Carey, all in favor, motion carried.

Motion by Kibbey to approve the renewal of the township''s property and liability insurance with the Michigan Municipal Risk Management Authority for the fiscal year 2025/2026, in the amount of $40,364.00, second by Carey, all in favor, motion carried.

Motion by Kibbey to approve the renewal of the Accident Fund Workers Compensation policy in the amount of $7741.00 (fire fund $4799 and gen fund $2942), second by Carey, all in favor, motion carried.

---

Motion by Kibbey to approve the proposal from Phoenix Custom Concrete in the amount of $28,900.00 for the purpose of pouring and stamping concrete along Lake George Ave from the Dollar General Store to the Duncan St. in the spaces between the curb and sidewalk, second by Carey, all in favor, motion carried.

Motion by Kibbey to approve the proposals from Mt. Pleasant Sash and Door of $3880.00 for the purpose of replacing at the fire station, the 2 back bay garage door openers AND secondly, a bid in the amount of $2800.00 for the purpose of replacing the outside office door with a metal door and frame, total of $6680.00 for both projects, second by Tobin, all in favor, motion carried.

Motion by Kibbey to approve the proposal from Michael Keyser of Prescription Rain Lawn Sprinkling in the amount of $6100.00, to install sprinkler system at the township hall ($3250) and the Citizens Corner ($2850.00) adjacent to the township hall, second by Simons, all in favor, motion carried.

Motion by Kibbey to approve the proposal of $7107.00 from Consumers Energy to install a line extension ($3207.00) to service 536 Arthur Rd, the compost field barn, and for the forestry work, trimming, and clearing for the line extension ($3900.00), second by Tobin, all in favor, motion carried.

---

Public Comment: None offered.

Motion by Kibbey to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 6:58PM.

---

Respectfully Submitted,

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2025-06-26-budget-meeting', 'Budget Meeting — June 26, 2025', '2025-06-26', 'Budget Meeting', 'approved', 'transcribed', 'Supervisor Kibbey called the meeting to order at 5:12PM.
Pledge of Allegiance was recited.

**Members Present:** Kibbey, Majewski, Carey, Simons and Tobin.
**Staff Present:** D. Majewski. **Also Present:** 1 other interested person.

---

Motion by Tobin to approve the 19 June 2024 budget meeting minutes as presented, second by Carey, all in favor, motion carried.

---

**Discussion**

Treasurer Carey explained the purpose of revenues and expenses of each of the four funds that the township currently has: those being the General Fund, Fire Fund, Law Fund and Liquor License Fund. Each fund derives its revenue from taxes, voted millages, special assessments, state revenue sharing, constitutional revenue sharing and various other incomes, such as donations, zoning permits and interest.

Projected Revenues and Expenses for Fiscal Year 2025/2026 were reviewed and are anticipated as follows:

| Fund | Projected Revenue | Projected Expenses |
|------|------------------:|-------------------:|
| Fire Fund | $332,744.00 | $307,070.00 |
| Law Fund | $198,677.00 | $131,680.00 |
| Liq. Fund | $261.00 | $261.00 |
| Gen. Fund | $1,556,922.00 | $1,511,522.00 |

---

Motion by Majewski to adjust the 2024/2025 General Fund Budget $101,147.06, second by Carey, all in favor, motion carried.

Motion by Kibbey to adjust the 2024/2025 Fire Fund Budget $23,106.12, second by Carey, all in favor, motion carried.

There were no adjustments needed for the Law fund or Liquor License Fund.

Motion by Kibbey to forward the proposed fiscal year budget 2025-2026 forward to the Annual Meeting of the Electorate for consideration and adoption, second by Simons, all in favor, motion carried.

---

**Public Comment:** one comment/request for copy of proposed budget.

Motion to adjourn the meeting by Kibbey, second by Tobin, meeting adjourned at 5:42PM.

---

Respectfully Submitted,

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2025-07-14-board-meeting', 'Board Meeting — July 14, 2025', '2025-07-14', 'Board Meeting', 'approved', 'transcribed', 'Supervisor Kibbey called the meeting to order at 7PM and the Pledge of Allegiance was recited.

**Members Present:** Kibbey, Majewski, Carey, Simons and Tobin.
**Staff Present:** D. Hassberger, D. Majewski and R. Carey. **Also Present:** Deputy Oster and 17 other interested persons.

---

Motion by Simons to approve the minutes of the 09 June 2025 regular meeting and the 26 June 2025 Budget Hearing and 26 June 2025 Annual Meeting as presented, second by Tobin all in favor, motion carried.

Motion by Simons to approve the treasurer''s report as submitted, second by Tobin, all in favor, motion carried.

Motion by Simons to pay the monthly bills as presented, second by Tobin, roll call vote, 5 yes, motion carried.

---

Fire Chief D. Majewski reported that the 2 individuals in MFR class are doing well. There is a new applicant, John Sullivan. Chief Majewski reported that Lt. Terry Brown has passed away. Lt. Brown was a member of the Lincoln Township Fire Department for over 26 years. He will be greatly missed. There were 301 runs year to date; 53 rescue and 3 fire related runs in June.

Tobin reported that the Planning Commission meeting on 15 July 2025 has been cancelled.

---

Motion by Tobin to approve the renewal of the Provident AD&D Policy for the 5 elected in the amount of $565.00, effective 01 July 2025 to 01 July 2026, second by Majewski, all in favor, motion carried.

Motion by Tobin to adopt ordinance number 071425-A an ordinance that amends the zoning map to assign zoning 9 properties found to be not previously zoned as follows:

*Medium Density Residential (R-2) Zoning District: Seven parcels numbered:*

- 18-010-273-006-00 -- 221 W. Arthur Rd.
- 18-010-273-004-00 -- 460 Harry Kress Dr.
- 18-010-273-002-00 -- 412 Harry Kress Dr.
- 18-010-273-001-50 -- 309 Lincoln Ave.
- 18-010-273-001-00 -- No address
- 18-010-007-403-01 -- No address
- 18-010-180-010-00 -- 533 W. Shingle Lake Dr.

*Low Density Residential (R-1) Zoning District: Two parcels numbered:*

- 18-010-007-402-42 -- 523 W. Shingle Lake Dr.
- 18-010-007-402-12 -- 473 W. Shingle Lake Dr.

The motion to adopt ordinance 071425-A was seconded by Simons, roll call vote, 5 yes, resolution adopted.

---

Motion by Tobin to adopt the Anti Blight and Anti Nuisance Ordinance Number 48 and to replace and repeal the Ordinance #32, also known as the Nuisance Ordinance of 2005, second by Simons, roll call vote, 5 yes, ordinance adopted.

Motion by Simons to approve an increase in the sexton wages as presented on a per burial basis:

- Open and close a burial summer: $450
- Open and close a burial winter: $650
- Cremation burial: $250
- Infant Burial: $190
- Sat., Sun., and holidays: $100 additional fee

Second by Tobin, all in favor, motion carried.

Motion by Tobin to approve the purchase of 5 concrete planters for the downtown area at a cost of $3795.00 total from Doty and Sons Concrete Products, Including the 5 pots ($575.00 each), two coats of sealer ($52.00 each), packing and shipping with liftgate ($660.00), second by Carey, all in favor, motion carried.

---

**Public Comment:** Cost associated with planters; that there should be basic rules that all short term rentals should have to post; that the township should look in to a rental ordinance; that the township should look in to a grass height ordinance because the person recommending it has gotten bad reviews on their rental due to the neighbors tall grass; that we should see if each business in town will "sponsor a planter"; it was suggested that the fire department monitor and enforce tall grass; Monroe road paving petition did not get a good response; comments on zoning setbacks, possible violations and survey requirements, legal remedies and who is responsible and finally, comment on the house on Park St. crushed by the tree.

---

Motion by Carey to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 8:08 PM.

---

Respectfully Submitted,

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2025-08-11-board-meeting', 'Board Meeting — August 11, 2025', '2025-08-11', 'Board Meeting', 'approved', 'transcribed', 'Supervisor Kibbey called the meeting to order at 7PM. Pledge of Allegiance.

**Roll Call of members present:** Supervisor Kibbey, Clerk Majewski, Treasurer Carey, Trustee Tobin and Trustee Simons.
**Staff Present:** Fire Chief D. Majewski, Lakes Comm. R. Carey, Planning Member T. McCaslin
**Other Present:** 27

---

Motion by Simons, seconded by Tobin to approve the 14 July 2025 regular meeting minutes as presented, all in favor, CARRIED.

Motion by Simons, seconded by Tobin to accept the treasurer''s report as presented, all in favor, CARRIED.

Motion by Simons, seconded by Tobin to pay the monthly bills as presented, roll call vote, all in favor, CARRIED.

---

Fire Chief D. Majewski reported that there were 55 rescues, 1 fire, 2 mutual aid and 3 power line related runs for the month of July, 340 runs year to date. The Ice Water Rescue Sled purchased with the proceeds from the pancake breakfast, generator raffle and individual donations is in service. Chief Majewski thanked everyone for their generous support.

Lakes Director R. Carey reviewed Senate Bill 778/Public Act 56; legislation that defines and restricts the type of activities that may legally occur at public road ends that terminate on Michigan''s inland lakes and streams.

---

**Old Business:** None

**New Business:** None

**Public Comment:** Comments were received from 4 people.

---

Motion to adjourn the meeting by Simons, seconded by Carey, all in favor, meeting adjourned at 7:18PM.

---

Respectfully Submitted,

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2025-09-08-board-meeting', 'Board Meeting — September 8, 2025', '2025-09-08', 'Board Meeting', 'approved', 'transcribed', 'Supervisor Kibbey called the meeting to order at 7:00 PM.

**Roll Call of Members present:** Kibbey, Majewski, Carey, Tobin. Absent/Excused: Simons.
**Staff Present:** Fire Chief D. Majewski, Lakes Dir. R. Carey, Zoning Admin. Hassberger, Planning Commission Members Blaisdell, McCaslin, Ostrowski and Szczepanski, Sheriff Dep. Oster, Zoning Board of Appeals Member Lease
**Other Present:** 9

---

Motion by Tobin to approve the 11 August 2025 regular meeting and the 28 August 2025 special community forum minutes as submitted, second by Carey, all in favor, motion approved.

Motion by Tobin to approve the treasurers report as submitted, second by Majewski, roll call vote, 4 yes, motion carried.

Motion by Tobin to pay the monthly bills as presented, second by Carey, roll call vote, 4 yes, motion carried.

---

County Commissioner D. Majewski reported that the Spongy Moth (formerly known as the Gypsy Moth) millage will be reduced from 1 mil to .6 as there is no need to over collect and have a large fund balance.

Fire Chief D. Majewski reported 30 rescues and 3 fire runs for August 2025, and 376 runs year to date. There are 2 in Medical First Responder Class.

---

**Committee News and Reports:**

The Planning meets 09 September at 7:00 PM and are working on a text amendment request and the Recreation Plan.

Trustee Tobin reported that the winter burial rates will go into effect on 01 October 2025.

Lakes Director R. Carey reported that he has applied for the Shingle Lake Buoy permit for the 2026 season.

DNR put stone in at the boat launch to help fill the hole that had formed at the end of the launch.

The Loon that had the net wrapped around its head appears to be doing well. After the human attempts to help did not pan out, the Loon''s baby ended up picking the net off its parent.

---

Motion by Tobin to approve the expenditure of $1050.00 for Blain''s Excavating to put in topsoil at the Silver Lake Park to repair the area torn up by putting in the new well, second by Kibbey, all in favor, motion carried.

Public Comment: There were 9 comments offered.

Motion by Carey to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 7:32 PM.

---

Respectfully Submitted,

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2025-10-08-workshop', 'Workshop — October 8, 2025', '2025-10-08', 'Workshop', 'approved', 'transcribed', 'Supervisor Kibbey called the workshop to order at 11:11 AM.

**Present in person:** Kibbey, Majewski, Carey, Tobin.
**Present by electronic transmission:** Simons
**Others present:** Zero

---

Supervisor Kibbey explained the reason for the workshop was to review the Sheriff''s contract and consider costs associated with law enforcement services.

Supervisor Kibbey explained that Undersheriff Williams met with Kibbey and Carey on about 05 September. There have been no contract negotiations/renewal since 2017. Current rate is $9000.00 per month. The department''s sheriff is asking for an annual increase in the range of $168,000.00, or $14,000.00 per month, for 10 hours per day, 7 days per week.

Carey explained the current voted millage revenue is approximately $180,000.00. We are currently paying $9000.00 per month ($108,000.00 annually) to the Clare County Sheriff''s Department and $844.00 per month to our Ordinance Enforcement personnel. Carey further explained that we carry 2 plus years in reserve funds (fund balance) for unexpected expenses, economic downturn, and budgeting flexibility, all of which are crucial to maintain financial stability.

Kibbey said that Williams would like to see an annual COLA increase built into our contract. Majewski said that building in automatic increases is not something she is comfortable with. Considering an annual increase based on COLA or some other factor is appropriate. It is not automatic for township employees, appointees or boards; it shouldn''t be for anyone else.

Simons spoke about the concept of getting what you pay for and what we would get if we didn''t pay anything. We already pay taxes (over and above the millage) to the county that fund the Sheriff''s department just like every other township. Simons went on to say that under the circumstances that the voters approved this millage, we have a duty to utilize it to its fullest potential.

Kibbey said that it does seem like quite a jump to go from $9000.00 to $14,000.00, but if you consider that this agreement/contract has not been updated since 2017, nearly 8 years, the difference between what we are paying to what they would like us to pay is $60,000.00; broken down annually equates to an annual increase of $7500.00 or $625 per month. With that perspective in mind, it makes sense to be firm in the agreement that contract increases be negotiated no less than every three years or when the Sheriff''s department is doing their union negotiations.

Various comments were made; no other township pays a millage like ours. What is the time spent by the sheriff department in those communities that do not pay extra and what are factors affecting overall service and response time; population density, location, and needs. Set a definitive number of hours per day, days per week in the contract. We need to consider putting wording in the contract that the costs associated will only be paid for time inside the township of Lincoln. We all want them to leave the township when they are needed elsewhere in the county to help, and to back up fellow officers, or other emergency situations. But, if they leave, we are not paying for that time out of the township and our monthly amount should reflect time out of the township and the amount adjusted accordingly.

Simons added that if the Sheriff does not have representation at our meeting when this contract is considered, he will not be voting in the affirmative for any changes to the current contract. It was agreed that we all feel the same way and action will be tabled if there is no appropriate representation from the Sheriff''s department.

---

Public Comment: None Offered.

Motion by Carey to adjourn the workshop, second by Majewski, 4 present in person in favor, workshop adjourned at 12:10 PM.

Respectfully Submitted,

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2025-10-13-board-meeting', 'Board Meeting — October 13, 2025', '2025-10-13', 'Board Meeting', 'approved', 'transcribed', 'Supervisor Kibbey called the meeting to order at 7:00PM.

**Present:** Kibbey, Majewski, Carey, Tobin and Simons
**Staff Present:** Fire Chief D. Majewski, Planning Chair Blaisdell, Planning Member Ostrowski, ZBA Member Lease, Lakes Dir. R. Carey, Zoning Admin. Hassberger
**Others present:** Deputy Oster and 13 other interested people

---

Motion by Tobin to approve the 08 October 2025 Special Workshop minutes and the 08 September 2025 regular monthly meeting minutes as presented, second by Carey, all in favor, motion carried.

Motion by Majewski to approve the treasurer''s report as submitted, second by Simons, all in favor, motion carried.

Motion by Tobin to approve the monthly bills as presented, second by Simons, roll call vote, 5 yes, motion carried.

**Public Comment:** There were 5 comments made.

Chief D. Majewski reported that there have been 422 runs year to date. There were 42 rescues, 5 fire, 1 power line and 2 mutual aid runs for the month of September. Tabatha Simon and Glen Kelbey have graduated from Medical First Responder Class and Ben Garver has completed Fire Officer One Class. New applicant, Kevin McNutt, comes to the department with 23 years of experience in the fire service. Welcome aboard Kevin and thank you for joining the team! The fire department will hold their annual open house on 31 October from 5PM to 7PM. Donuts, cider and treats to be served.

Supervisor Kibbey read a letter from the Lake George Property Owners Association to the Fire Department. They have donated $500.00 to the department. Thank you LGPOA for your support of the fire department and its members.

R. Carey reported that he has met with the DNR and is awaiting the approval of the buoy permit for Shingle Lake Park for the 2026 season.

Motion by Carey to approve the amount of $120.00 per year, plus an additional $75.00 if the transfer is troublesome, for Bruce Goodwin to assume the duties of webmaster, second by Tobin, all in favor, motion carried.

---

Kibbey''s Community News and Notes:

- We are working on the renewal of the Special Assessment Districts for control of aquatic nuisance for Shingle Lake, Lake George, and Bertha Lake. There will be hearings, mailings and districts to outline. Stay tuned.
- The Sheriff''s contract is due for renewal. Carey is working on the contract wording.
- The Special Assessment district for paving in the Oakdale Sub is progressing. Petitions are in and it appears that at least 51% are in favor. Kibbey is working with the road commission on the quotes for the project. Hearings will be scheduled.
- Committee info: **School House Committee** is Marilyn Hudson, Holly Brown, Dawn Kibbey, Deb Briggs and Dick Hassberger. **Parks and Flowers Committee** are Marilyn Hudson, Deb Briggs, Christy Oliver, Mariann Anthony, Tami McCaslin and Mark Simon. **Short Term Rental Committee** are Tami McCaslin, Tanya Robertson, Rolf Hudson, Jamie Lease, Holly Brown and Rebecca Ewald.
- Carol Majewski, Connie Tuck and Vonda Kushmaul made the pink bows for the light poles downtown for Breast Cancer Awareness month. Sadly, not 30 minutes passed and one of the bows was taken. We aren''t giving up though -- November will be red, white and blue bows for Veterans Day. Anyone who would like to donate a bow please have it to the hall by November 10, 2025, please.
- Trunk or Treat at the Township Hall on 31 October 2025 at 5PM. Trunkers line up by 4:45PM please.

---

Motion by Tobin to adjourn the meeting, second by Simons, all in favor, meeting adjourned at 7:40PM.

Respectfully Submitted,

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2025-10-23-bid-packet-opening', 'Find Your Joy Bid Packet Opening — October 23, 2025', '2025-10-23', 'Bid Packet Opening', 'approved', 'transcribed', 'Supervisor Kibbey called the meeting to order at 4:00PM.

**Members present:** Kibbey, Majewski, Simons. There being no necessity for the full board to meet for the opening of bids and no other business or actions, Tobin and Carey are excused.
**Staff Present:** 0
**Other Present:** Engineer Connie Houk and 5 other interested people.

---

Connie Houk said that there were 5 bids submitted in total, three for the site and bathhouse portion of the project and two for the playground portion of the project.

For the Site and Bathhouse:

1. From Cole Inc., the bid is $850,875.00
2. From Horizon Builders, the bid is $640,943.75
3. From Schepke Consulting, the bid is $621,274.00

For the Playground:

1. Park Vision, the bid is $223,360.00
2. Gametime/Sinclair, the bid is $198,994.00

The bidders present were thanked for their bids. Connie will take the bid packets to copy and prepare for submission to CMF for review. Bids exceed the grant amount; some items will need to be reconsidered or reduced. Supervisor Kibbey noted that at first glance, lighting and electrical seemed to be quite costly and could be considered for reduction or removal. Connie will report back with suggestions and updated costs. We would like to be able to select contractors at our next board meeting on 10 November 2025.

---

Motion by Majewski to adjourn the meeting, second by Simons, all in favor, meeting adjourned at 4:42PM.

Respectfully Submitted,

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2025-11-10-board-meeting', 'Board Meeting — November 10, 2025', '2025-11-10', 'Board Meeting', 'approved', 'transcribed', 'Supervisor Kibbey called the meeting to order at 4:00PM.

**Members present:** Kibbey, Majewski, Simons, Carey and Tobin.
**Staff Present:** Zoning Admin Hassberger, Lakes Dir. R. Carey, Fire Chief D. Majewski, Planning Member McCaslin
**Other Present:** Deputy Oster and Undersheriff Williams and 13 other interested people.

---

Motion by Tobin to approve the 13 October 2025 regular meeting minutes as presented, second by Tobin, all in favor, motion carried.

Motion by Simons and seconded by Tobin to approve the 23 October 2025 special meeting to open bids for the Shingle Lake Park grant as presented, all in favor, motion carried.

Motion by Simons to approve the treasurer''s report as submitted, second by Tobin, all in favor, motion carried.

Supervisor Kibbey would like a committee report from the Parks Committee, Short Term Rental Committee and School House Committee for input and feedback next month.

Chief Majewski reported that there are 428 runs year to date, 32 rescues, 2 fires, 2 power line and one mutual aid related runs for October. CPR recertification class has been completed. The fire department welcomes Kevin McNutt to the department. McNutt comes to the department with 23 years of experience in the fire service; Fire Fighter one, Fire Officer 1, 2 and 3 and Haz Mat training among others.

Clerk Majewski reported that Lincoln Township has received a grant in the amount of $150,000.00 from the Consumers Energy Foundation Prosperity Award to support Bertha''s New Beat project. Planned improvements to the Bertha Lake Park include play equipment, increased accessibility, an overland fishing platform and hand railing by the steps.

Supervisor Kibbey reported that the process for the road commission to deed the Silver Lake Park to Lincoln Township is progressing. The request requires application fee of $1000.00. Currently the township is allowed to occupy and maintain the property, but a deed is required for some grant opportunities.

Lakes Director Carey reported that the buoy permit for Shingle Lake Park is still in progress.

---

Supervisor Kibbey explained that after that meeting Lincoln Township resident Jamie Lease expressed that had she known we were seeking to replace our webmaster she would have applied. The position was not publicly posted and therefore Majewski and Kibbey met with Lease to discuss the position.

Motion by Treasurer Carey to rescind her motion from the 13 October 2025 meeting: "to approve the amount of $120.00 per year, plus an additional $75.00 if the transfer is troublesome for Bruce Goodwin to assume the duties of webmaster." Second by Tobin to rescind his second of that motion, all in favor, motion to rescind carried.

Motion by Carey to appoint Jamie Lease as the webmaster effective immediately, to redesign, increase ADA compliance and manage the township website, second by Tobin, all in favor, motion carried.

---

Supervisor Kibbey explained that Treasurer Carey had appointed Mara Kalat as her Deputy Treasurer. Treasurer Carey introduced Mara, and shared that Mara and her family are township residents and that Mara who comes to us with experience in using the treasurer software, BS&A. Carey explained that her long-time deputy, Deb Trim has retired effective 10 November 2025. Treasurer Carey and the board wish to thank Deb Trim for her dedication and service to the Township.

The four signatures for the depositories and banking at Isabella Bank, Huntington Bank and Mercantile will need to be updated to reflect: Deb Sorgi Trim will need to be removed from the signature cards. Margaret Carey, Treasurer; Mara Kalat, Deputy Treasurer; Carol Majewski, Clerk; and Deborah Sherrod, Deputy Clerk will need to sign the new cards.

The Recreation Plan Draft is available at the township hall for review for anyone interested. The board will have a hearing and consider it at our regular meeting 12 January 2026 at 7PM.

---

Supervisor Kibbey reviewed the law contract update. He explained that the current contract was approved in 2017 at $9000.00 per month from the voted millage funds for up to 10 hours a day, 7 days a week for patrols and law enforcement. There was considerable discussion on the contract review process, the costs associated with rising operational expenses such as wages, training, equipment and fuel for the patrols in the township. Trustee Simons pointed out that this service is provided by a voted millage intended to increase patrols and provide crime prevention over and above the already funded operational expenses shared by the entire county through our property taxes. Kibbey explained that the Sheriff''s department is currently operating at a deficit in the township; costs exceed the revenue received from the township for extra hours provided. Carey has reviewed the Law Fund and has concluded that there are sufficient operating funds available to increase the monthly contract to $14,000.00 per month, for 70 hours per week, as near to 10 hours per day, 7 days a week as possible. Less hours will result in lower monthly charge or the making up of those hours. Paperwork to the clerk will remain the same.

Motion by Tobin to approve the Law Contract with the Clare County Sheriff''s Department as presented and to increase the monthly payment from $9000.00 to $14,000.00 per month effective with the November 2025 payment, second by Simons, roll call vote, 5 yes, motion carried.

---

Public Comment: there were 2 comments offered.

Motion by Simons to adjourn the meeting, second by Carey, all in favor, meeting adjourned at 7:49PM.

Respectfully Submitted,

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2025-12-08-board-meeting', 'Board Meeting — December 8, 2025', '2025-12-08', 'Board Meeting', 'approved', 'transcribed', 'Supervisor Kibbey called the meeting to order at 7:00 PM.

**Roll Call of Members present:** Kibbey, Majewski, Carey, Tobin and Simons.
**Staff Present:** Fire Chief D. Majewski, Zoning Admin. Hassberger, Planning Commission Members Blaisdell, McCaslin, Ostrowski, Sheriff Dep. Oster, ZBA Member/Web Manager Lease
**Other Present:** 11

---

Motion by Simons to approve the 10 November 2025 regular meeting minutes as submitted, second by Tobin, all in favor, motion approved.

Motion by Simons to approve the treasurers report as presented, second by Tobin, all in favor, motion carried.

Motion by Tobin to pay the monthly bills as presented, second by Simons, roll call vote, 5 yes, motion carried.

Fire Chief D. Majewski reported 45 rescues, 1 mutual aid and 1 fire runs for November 2025, and 510 runs year to date.

---

Committee News and Reports:

The Planning Meeting for Tuesday 09 December 2025 is cancelled.

Kibbey explained that the township webpage and emails have not been working for approximately 10 days. We have been unable to restore the website or email. To keep an online presence, and email capabilities for township business we need to consider getting a new domain name and rebuilding the website.

Motion by Tobin to approve the proposal from NSO, our current IT provider, to create a basic web homepage, 7 emails, domain, set up DNS and add domain to Microsoft 365 per quote, in an amount not to exceed $2500.00, second by Simons, all in favor, motion carried.

---

Public Comment: There were 2 comments offered.

Motion by Simons to adjourn the meeting, second by Tobin, all in favor, meeting adjourned at 7:14 PM.

Respectfully Submitted,

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now()),
(lincoln_id, '2026-03-09-board-meeting', 'Board Meeting — March 9, 2026', '2026-03-09', 'Board Meeting', 'pending', 'transcribed', 'Supervisor Kibbey called the meeting to order at 7:00 PM.

**Roll Call of Members present:** Kibbey, Majewski, Carey, Tobin. Absent: Simons.
**Staff Present:** Fire Chief D. Majewski, Zoning Admin. Hassberger, Planning Commission Members Blaisdell, McCaslin, Ostrowski, Zoning Board of Appeals Member Lease
**Other Present:** 7

---

Motion by Carey to approve the 09 February 2026 regular meeting, second by Tobin, all in favor, motion approved.

Motion by Tobin to approve the treasurer''s report as submitted, second by Kibbey, all in favor, motion carried.

Motion by Tobin to pay the monthly bills as presented, second by Carey, roll call vote, all in favor, motion carried.

Fire Chief D. Majewski reported that there have been 137 runs year to date, with 43 rescue, 10 fire, and 2 mutual aid related runs for the month of February 2026. There are currently 11 active firefighters.

---

Motion by Tobin to adopt resolution number 030926-A, a resolution concerning the public hearing scheduled for 08 May 2026 at 4PM regarding the renewal of the Lake George special assessment district for the control of aquatic weeds and lake maintenance, second by Carey, roll call vote, 4 yes, resolution adopted.

Motion by Tobin to adopt resolution number 030926-B, a resolution concerning the public hearing scheduled for 08 May 2026 at 4PM regarding the renewal of the Shingle Lake special assessment district for the control of aquatic weeds and lake maintenance, second by Carey, roll call vote, 4 yes, resolution adopted.

Motion by Tobin to adopt resolution number 030926-C, a resolution concerning the public hearing scheduled for 08 May 2026 at 4PM regarding the renewal of the Bertha Lake special assessment district for the control of aquatic weeds and lake maintenance, second by Carey, roll call vote, 4 yes, resolution adopted.

Motion by Carey to adopt resolution number 030926-D, a resolution regarding the poverty tax exemption guidelines, second by Tobin, roll call vote, 4 yes, resolution adopted.

Motion by Kibbey to approve the non-refundable fee of $1,000.00 to the Clare County Road Commission for the purpose of the petition request for the abandonment of a portion of Lincoln Road (Silver Lake Park and boat launch), second by Tobin, all in favor, motion carried.

Motion by Tobin to approve the contract from Michigan Chloride Sales Dust Control in the amount of $33,700.00 road fund expense, for the purpose of brining roads on or about 4/22/26, 5/20/26, 6/24/26 and 8/28/26, second by Carey, roll call vote, 4 yes, motion carried.

Motion by Kibbey to appoint Rolf Hudson to the Zoning Board of Appeals as an alternate member, second by Tobin, all in favor, motion carried.

Motion by Majewski to approve the early voting agreement with Clare County for the 9 days early voting for 2026 and 2027, in the amount of $758.00 per election, second by Tobin, all in favor, motion carried.

---

Public Comment: there were 5 comments offered.

Motion by Tobin to adjourn the meeting, second by Carey, all in favor, meeting adjourned at 7:28 PM.

Respectfully Submitted,

*Carol L. Majewski, Clerk*', NULL, '{}', '{}', '{}', now(), now())
ON CONFLICT (region_id, slug) DO UPDATE SET title = EXCLUDED.title, body = EXCLUDED.body, status = EXCLUDED.status;

-- =============================================================================
-- Ordinances (17)
-- =============================================================================

INSERT INTO public.ordinances (region_id, slug, title, number, description, body, category, adopted_date, amended_date, pdf_url, status, created_at, published_at)
VALUES
(lincoln_id, 'ord-22-boating', 'Boating', 22, 'Regulates boating activities on township lakes', 'This ordinance sets rules for boating on lakes within Lincoln Township. It covers speed limits, operating hours, and safe boating practices to protect both residents and the environment. If you boat on any township lake, you are expected to follow these regulations.', 'environment', '2017-08-14', NULL, '/documents/ordinances/ord-22.pdf', 'published', now(), now()),
(lincoln_id, 'ord-26-noise', 'Noise', 26, 'Noise regulations and quiet hours', 'This ordinance establishes quiet hours and noise limits to help keep the township peaceful for everyone. It defines what counts as excessive or unreasonable noise and sets time-of-day restrictions. Violations can result in fines or other enforcement action.', 'public-safety', '2017-08-14', NULL, '/documents/ordinances/ord-26.pdf', 'published', now(), now()),
(lincoln_id, 'ord-27-land-division', 'Land Division', 27, 'Rules for dividing and splitting parcels', 'This ordinance governs how property owners can divide or split their land into smaller parcels. It sets requirements for minimum lot sizes, road frontage, and the approval process. If you are considering dividing your property, you must follow these procedures and obtain township approval.', 'property', '2017-08-14', NULL, '/documents/ordinances/ord-27.pdf', 'published', now(), now()),
(lincoln_id, 'ord-28-electric-franchise', 'Electric Franchise', 28, 'Electric utility franchise agreement', 'This ordinance establishes the franchise agreement between Lincoln Township and its electric utility provider. It grants the utility company the right to install and maintain electrical infrastructure within township rights-of-way. The agreement outlines the terms, duration, and conditions of the franchise.', 'infrastructure', '2017-08-14', NULL, '/documents/ordinances/ord-28.pdf', 'published', now(), now()),
(lincoln_id, 'ord-29-dog-control', 'Control of Dogs', 29, 'Dog licensing, leash laws, and dangerous dog provisions', 'This ordinance requires dogs in the township to be licensed and kept under their owner''s control at all times. It includes leash requirements, provisions for dealing with dangerous dogs, and rules about barking and nuisance behavior. Dog owners are responsible for any damage or injuries caused by their pets.', 'public-safety', '2017-08-14', NULL, '/documents/ordinances/ord-29.pdf', 'published', now(), now()),
(lincoln_id, 'ord-30-parks', 'Parks & Public Grounds', 30, 'Rules for use of township parks and public areas', 'This ordinance sets the rules for using township parks and public grounds. It covers hours of operation, permitted activities, and prohibitions to keep these spaces safe and enjoyable for everyone. Residents and visitors are expected to respect park property and follow posted regulations.', 'environment', '2017-08-14', NULL, '/documents/ordinances/ord-30.pdf', 'published', now(), now()),
(lincoln_id, 'ord-32-nuisance-blight', 'Nuisance & Blight', 32, 'Defines and prohibits blight conditions; enforcement procedures for property maintenance', 'This ordinance defines what constitutes blight or a nuisance on private property, such as junk vehicles, excessive debris, or unsafe structures. It establishes enforcement procedures, including notices and timelines for property owners to correct violations. The goal is to maintain community standards and protect property values throughout the township.', 'property', '2017-08-14', NULL, '/documents/ordinances/ord-32.pdf', 'published', now(), now()),
(lincoln_id, 'ord-33-emergency-services', 'Emergency Services', 33, 'Emergency services provisions', 'This ordinance establishes the framework for emergency services in Lincoln Township. It covers the provision of fire, rescue, and emergency medical response within the township. The ordinance outlines funding, mutual aid agreements, and coordination with county emergency services.', 'public-safety', '2017-08-14', NULL, '/documents/ordinances/ord-33.pdf', 'published', now(), now()),
(lincoln_id, 'ord-34-parental-responsibility', 'Parental Responsibility', 34, 'Parents'' legal responsibility for minors'' actions', 'This ordinance holds parents and legal guardians responsible for the conduct of their minor children within the township. If a minor causes property damage or engages in prohibited behavior, the parent or guardian may be held liable. The ordinance is intended to encourage parental supervision and accountability.', 'public-safety', '2017-08-14', NULL, '/documents/ordinances/ord-34.pdf', 'published', now(), now()),
(lincoln_id, 'ord-35-lot-splitting', 'Lot Splitting', 35, 'Specific regulations for splitting existing lots', 'This ordinance provides specific rules for splitting existing lots within the township. It details the application process, required surveys, and minimum standards that new lots must meet. Property owners must receive approval from the township before any lot split can be recorded.', 'property', '2017-08-14', NULL, '/documents/ordinances/ord-35.pdf', 'published', now(), now()),
(lincoln_id, 'ord-38-lake-dock-boat', 'Lake, Dock & Boat', 38, 'Regulations for docks, boat hoists, and waterfront structures', 'This ordinance regulates docks, boat hoists, swim platforms, and other waterfront structures on township lakes. It sets size limits, placement requirements, and seasonal installation rules. Lakefront property owners must comply with these standards when installing or maintaining any structure along the shoreline.', 'environment', '2017-08-14', NULL, '/documents/ordinances/ord-38.pdf', 'published', now(), now()),
(lincoln_id, 'ord-39-flood-plain', 'Flood Plain Management', 39, 'Floodplain development restrictions and requirements', 'This ordinance restricts development in designated floodplain areas to protect residents and property from flood damage. It requires permits for any construction or fill activity within floodplain zones and sets elevation and design standards. The regulations help the township participate in the National Flood Insurance Program.', 'environment', '2017-08-14', NULL, '/documents/ordinances/ord-39.pdf', 'published', now(), now()),
(lincoln_id, 'ord-40-planning-act', 'Michigan Planning Enabling Act', 40, 'Adoption of state planning enabling act provisions', 'This ordinance formally adopts the provisions of Michigan''s Planning Enabling Act for Lincoln Township. It establishes the legal basis for the township''s planning commission and its authority to create and maintain a master plan. The ordinance ensures the township''s planning activities comply with state law.', 'zoning', '2017-08-14', NULL, '/documents/ordinances/ord-40.pdf', 'published', now(), now()),
(lincoln_id, 'ord-41-fireworks', 'Fireworks Control', 41, 'When and where fireworks can be used in the township', 'This ordinance regulates the use of consumer fireworks within Lincoln Township. It specifies the dates and times when fireworks are permitted and designates areas where they may not be used. Violations may result in fines, and the ordinance aligns with Michigan state fireworks law while adding local restrictions.', 'public-safety', '2017-08-14', NULL, '/documents/ordinances/ord-41.pdf', 'published', now(), now()),
(lincoln_id, 'ord-42-cemeteries', 'Cemeteries', 42, 'Rules governing township cemeteries', 'This ordinance establishes the rules for township-maintained cemeteries. It covers plot purchases, burial procedures, monument and marker standards, and maintenance responsibilities. Families and funeral providers must follow these guidelines when using township cemetery facilities.', 'general', '2017-08-14', NULL, '/documents/ordinances/ord-42.pdf', 'published', now(), now()),
(lincoln_id, 'ord-44-zoning', 'Zoning Ordinance', 44, 'The comprehensive zoning ordinance governing land use, setbacks, permitted uses, and special exceptions', 'This is the township''s comprehensive zoning ordinance, which controls how land can be used throughout Lincoln Township. It defines zoning districts, setback requirements, permitted and conditional uses, and the process for obtaining variances or special exceptions. Property owners should consult this ordinance before building, renovating, or changing the use of their property.', 'zoning', '2017-08-14', NULL, '/documents/ordinances/ord-44.pdf', 'published', now(), now()),
(lincoln_id, 'ord-46-marijuana', 'Prohibition of Recreational Marijuana Establishments', 46, 'Bans recreational marijuana businesses in the township', 'This ordinance prohibits recreational marijuana establishments from operating within Lincoln Township. It bans dispensaries, grow operations, processing facilities, and other commercial marijuana businesses. The ordinance was adopted under the authority granted to municipalities by Michigan''s recreational marijuana law.', 'general', '2017-08-14', NULL, '/documents/ordinances/ord-46.pdf', 'published', now(), now())
ON CONFLICT (region_id, slug) DO UPDATE SET title = EXCLUDED.title, body = EXCLUDED.body;

-- =============================================================================
-- News (7)
-- =============================================================================

INSERT INTO public.news (slug, title, description, body, date, author_name, category, source, source_url, featured, impact, image_url, visibility, status, created_at, published_at)
VALUES
('board-meeting-schedule-2026', '2026 Board of Commissioners Meeting Schedule', 'Regular meeting dates for the Clare County Board of Commissioners in 2026', 'The Clare County Board of Commissioners meets on the 3rd Wednesday of each month at 9:00 AM at 225 W Main St, Harrison. 2026 dates: April 15, May 20, June 17, July 15, August 19, September 16, September 30, October 21, November 12, December 16. Meetings are open to the public. Virtual attendance is available via Zoom. Contact (989) 539-2510 for more information.', '2026-01-01', 'Clare County Administration', 'public-notice', 'Clare County', 'https://www.clareco.net', true, NULL, NULL, 'global', 'published', now(), now()),
('county-budget-fy2026', 'Clare County FY2026 Budget Approved', 'The Board of Commissioners approved the fiscal year 2026 county budget', 'The Clare County Board of Commissioners approved the fiscal year 2026 budget at their December meeting. The budget covers county operations including all departments, courts, and services. County offices are located at 225 W Main St, Harrison, MI 48625. The full budget document is available through the County Administrator''s office at (989) 539-2510.', '2025-12-16', 'Clare County Administration', 'government-action', 'Clare County', 'https://www.clareco.net', false, NULL, NULL, 'global', 'published', now(), now()),
('county-services-directory', 'Clare County Services Directory', 'A guide to county government services and how to access them', 'Clare County government offices are open Monday through Friday, 8am to 4:30pm at 225 W Main St, Harrison, MI 48625 (PO Box 438). Main phone: (989) 539-2510. Key services include property tax payments (Treasurer, 989-539-7801), dog licensing (Treasurer), vital records (Clerk, 989-539-7131), building permits (clareco-buildingdev.net), FOIA requests (FOIA@clareco.net), GIS/property maps (app.fetchgis.com/clare), and election information (clareclerkrod.com/election/).', '2026-03-01', 'Clare County Administration', 'public-notice', 'Clare County', 'https://www.clareco.net', false, NULL, NULL, 'global', 'published', now(), now()),
('gardening-club-launches', 'Lincoln Township Gardening Club: Dig In This Spring!', 'Join our new weekly gardening club with Saturday meetups and monthly classes', 'Spring is here, and so is the Lincoln Township Gardening Club. Whether you have been gardening for decades or have never touched a trowel, this new weekly club is your invitation to get your hands dirty alongside your neighbors.

## What to Expect

The Gardening Club meets every Saturday morning at The Horn in Lake George. Each week brings a mix of hands-on activity and friendly conversation:

- **Hands-on gardening** — Work together on community plots and individual projects
- **Tips and technique sharing** — Learn from experienced local gardeners and share what you know
- **Seed and plant swaps** — Bring extras from your garden, take home something new
- **Community plot maintenance** — Help tend shared garden spaces that benefit the whole township

## Monthly Classes

On the first Saturday of each month, we host a special class focused on a single topic. Upcoming sessions will cover subjects like:

- Composting basics and building healthy soil
- Native Michigan plants for pollinators and wildlife
- Container gardening for small spaces and beginners
- Seasonal planning and succession planting
- Preserving your harvest

Each class is designed to be practical and hands-on. You will leave with knowledge you can put to work in your own yard that same day.

## All Skill Levels Welcome

You do not need experience, tools, or a green thumb to join. The whole point is learning together and building community around something we all share — a love of growing things. Beginners are especially encouraged to come out and give it a try.

## Details

- **When:** Every Saturday, 9:00 AM
- **Where:** The Horn, Lake George village
- **Monthly Class:** First Saturday of each month (same time, same place)
- **Cost:** Free and open to all

## How to Join

Just show up on a Saturday morning. No registration required. If you want to learn more or have questions before your first visit, stop by The Horn during regular hours or check the [events page](/events-horn) for details.

See you in the garden.', '2026-03-22', 'The Horn', 'community', NULL, NULL, false, NULL, '/images/news-community.jpg', 'global', 'published', now(), now()),
('our-mission-building-community', 'Our Mission: Building a Stronger Lincoln Township Together', 'Why Unicorn Gives exists and how we''re investing in our community''s future', 'Unicorn Gives was founded with a simple belief: small communities thrive when people invest in them — not just with money, but with time, energy, and genuine care. Lincoln Township is our home, and we are committed to making it stronger for everyone who lives here.

## Three Pillars of Community Investment

Our work is built around three connected efforts, each playing a different role in strengthening the township:

### The Horn — Community Center

[The Horn](/about-the-horn) is our physical home base in Lake George village. A renovated historic building, it serves as a community gathering space, artisan goods shop, and event venue. It is the place where neighbors meet, local makers sell their work, and new ideas take root.

### The Mane — Local Business Revitalization

[The Mane](/about-the-mane) represents our investment in local commerce. By operating and supporting small businesses in the township, we help keep economic activity local and create opportunities for residents. A healthy local economy means a healthier community.

### Civic Engagement — Township Transparency

This website is our third pillar. We believe residents deserve easy access to information about how their township operates — meeting schedules, budgets, public notices, and planning decisions. An informed community is an empowered community. We publish township information here so that everyone can participate in the decisions that affect their daily lives.

## Our Values

Everything we do is guided by four core principles:

- **Community First** — Every decision starts with the question: does this benefit the people who live here?
- **Transparency** — We share information openly, whether it is about our own programs or township government
- **Inclusion** — Our doors, programs, and information are open to everyone in the township
- **Action** — Good intentions matter, but results matter more. We show up and do the work.

## How You Can Help

Building a stronger community is not a one-organization job. Here is how you can be part of it:

- **[Volunteer](/volunteer)** — Lend your time and skills to community programs and events
- **[Attend Events](/events)** — Show up, connect with neighbors, and be part of what is happening
- **[Stay Informed](/news)** — Follow the news and subscribe for updates on township matters
- **[Visit The Horn](/about-the-horn)** — Support local artisans and be part of our gathering space

Lincoln Township has a bright future. We are glad you are here to help build it.', '2026-03-15', 'Unicorn Gives', 'community', NULL, NULL, false, NULL, '/images/news-forest.jpg', 'global', 'published', now(), now()),
('the-horn-grand-opening', 'The Horn: From Historic Grocery to Community Hub', 'How a beloved Lake George landmark was transformed into a vibrant community center and artisan goods shop', 'In the heart of Lake George village, a building with decades of history has found new life. The former Lake George Grocery — a longtime staple of the community — has been transformed into The Horn, a community center and artisan goods shop serving Lincoln Township and beyond.

## A Building Worth Saving

Lake George Grocery was more than a store. It was a gathering point, a place where neighbors ran into each other and caught up on local news. When the opportunity arose to purchase the building in 2021, Unicorn saw a chance to preserve that spirit while giving the space a new purpose.

## The Transformation

With a $200,000 investment in renovations, the building was carefully updated while honoring its character. The result is a flexible, welcoming space that serves the community in multiple ways. After months of work, The Horn soft-launched in 2022 and has been growing ever since.

## What The Horn Offers

Today, The Horn is a true community hub:

- **Artisan Goods Shop** — Locally made products, handcrafted goods, and unique finds from Michigan makers
- **Community Gathering Space** — A comfortable area for meetups, clubs, and casual connection
- **Event Venue** — Host to workshops, seasonal markets, classes, and celebrations throughout the year
- **Local Commerce Hub** — A place where small producers and artisans can reach customers and build their businesses

## The Vision

The Horn exists to give Lincoln Township a living room — a place where people come together not because they have to, but because they want to. Whether you are shopping for a handmade gift, attending a gardening club meeting, or just stopping in to say hello, The Horn is here for you.

## Come Visit

The Horn is located in downtown Lake George village. Stop by during our regular hours to browse the shop, learn about upcoming events, or just see the space for yourself. Check our [hours and location](/hours-horn) for details, or visit the [events page](/events-horn) to see what is coming up next.

We would love to see you there.', '2026-03-20', 'Unicorn Gives', 'community', NULL, NULL, true, NULL, '/images/news-building.jpg', 'global', 'published', now(), now()),
('welcome-to-unicorn-gives', 'Welcome to the New Unicorn Gives Community Hub', 'Introducing our expanded website serving all of Lincoln Township — your central source for local news, events, and government transparency', 'We are excited to announce the launch of the expanded Unicorn Gives community hub — your central destination for everything happening in Lincoln Township.

For too long, finding basic information about our township meant digging through scattered sources, attending meetings you might not know about, or relying on word of mouth. That changes today. This site brings it all together in one place, for everyone.

## What You Will Find Here

Our new website brings together information from across the community:

- **Township Government** — Board meeting minutes, budgets, public notices, and the transparency our residents deserve
- **Unicorn Gives** — Our nonprofit programs, volunteer opportunities, and community initiatives
- **The Horn** — Events, hours, membership info, and everything happening at our community center in Lake George
- **The Mane** — Services, appointments, and news from our local salon and boutique

## Why We Built This

Lincoln Township deserves a central place to stay informed. Whether you want to know when the next board meeting is, what events are coming up at The Horn, or how your tax dollars are being spent, it should be easy to find. This site is our commitment to openness and community connection.

## Get Involved

There are many ways to be part of what we are building:

- [Browse community events](/events) and mark your calendar
- [Volunteer your time](/volunteer) with Unicorn Gives
- [Visit The Horn](/about-the-horn) in downtown Lake George
- [Check out public notices](/public-notices) and stay informed on township business

We are just getting started. Watch this space for more news, events, and community updates as we grow together.', '2026-03-25', 'Unicorn Gives', 'community', NULL, NULL, true, NULL, '/images/news-community.jpg', 'global', 'published', now(), now())
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, body = EXCLUDED.body;

-- =============================================================================
-- Events (22)
-- =============================================================================

INSERT INTO public.events (slug, title, description, body, date, end_date, time, location, category, recurring, recurrence_rule, registration_url, cost, visibility, status, created_at, published_at)
VALUES
('board-of-commissioners-meeting', 'Clare County Board of Commissioners Meeting', 'Regular monthly meeting of the Clare County Board of Commissioners', 'Regular meeting of the Clare County Board of Commissioners. Open to the public. 2026 meeting dates: April 15, May 20, June 17, July 15, August 19, September 16, September 30, October 21, November 12, December 16. Virtual attendance via Zoom available.', '2026-04-15', NULL, '9:00 AM', '225 W Main St, Harrison, MI 48625', 'government', true, '3rd Wednesday monthly', NULL, 'Free', 'global', 'published', now(), now()),
('clare-county-fair', 'Clare County Fair', 'One of Michigan''s longest-running county fairs, since 1883', 'Running since 1883, the Clare County Fair is a week-long tradition featuring livestock shows, carnival rides, demolition derby, live entertainment, and 4-H exhibits at the fairgrounds in Harrison.', '2026-07-18', '2026-07-25', 'Gates open at 8am daily', 'Clare County Fairgrounds, Harrison, MI', 'community', true, 'Annually in July', NULL, 'Varies', 'global', 'published', now(), now()),
('conservation-board-april-2026', 'Conservation District Board Meeting', 'Regular monthly meeting of the Clare Conservation District Board of Directors', 'The Clare Conservation District Board meets monthly to discuss conservation programs, projects, and district business. Meetings are open to the public.', '2026-04-21', NULL, '6:30 PM', 'Harrison District Library, Harrison, MI', 'conservation', true, '3rd Tuesday monthly', NULL, NULL, 'global', 'published', now(), now()),
('county-commissioners-april-2026', 'Clare County Board of Commissioners Meeting', 'Regular monthly meeting of the Clare County Board of Commissioners', 'The Clare County Board of Commissioners meets monthly to conduct county business. Meetings are open to the public.', '2026-04-15', NULL, '9:00 AM', 'Clare County Courthouse, 225 W Main St, Harrison, MI', 'government', true, '3rd Wednesday monthly', NULL, NULL, 'global', 'published', now(), now()),
('drain-board-meeting', 'Clare County Drain Board Meeting', 'Regular meeting of the Clare County Drainage Board', 'Meetings of the Clare County Drainage Board address drainage district matters, drain maintenance, and improvement projects. Meeting dates are posted on the county calendar. Contact the Drain Commissioner at (989) 539-7320.', '2026-04-15', NULL, 'TBD', '225 W Main St, Harrison, MI 48625', 'government', true, 'As scheduled', NULL, 'Free', 'global', 'published', now(), now()),
('farwell-farmers-market', 'Farwell Farmers Market', 'Fresh local produce, baked goods, and crafts every Saturday morning', 'The Farwell Farmers Market features local growers and makers every Saturday morning from May through October, 9am to 1pm. Find fresh produce, baked goods, honey, preserves, and handmade crafts.', '2026-05-02', '2026-10-31', '9am-1pm', 'Downtown Farwell, MI', 'community', true, 'Saturdays, May through October', NULL, 'Free admission', 'global', 'published', now(), now()),
('frostbite-festival', 'Frostbite Festival', 'Harrison''s winter celebration with ice fishing, snowmobile events, and more', 'Harrison''s Frostbite Festival celebrates winter on Budd Lake and throughout downtown. Events include ice fishing contests, snowmobile racing, winter games, and warming stations with hot cocoa.', '2026-01-24', '2026-01-25', NULL, 'Harrison, MI — Budd Lake and downtown', 'community', true, 'Annually in January', NULL, 'Free', 'global', 'published', now(), now()),
('holiday-lights-festival', 'Farwell Holiday Lights Festival', 'Holiday celebration with light displays and community festivities', 'Farwell welcomes the holiday season with festive light displays, visits with Santa, carolers, hot chocolate, and community spirit throughout the village.', '2026-12-05', NULL, '5pm-9pm', 'Village of Farwell, MI', 'community', true, 'Annually in early December', NULL, 'Free', 'global', 'published', now(), now()),
('irish-festival', 'Clare Irish Festival', 'Annual celebration of Clare''s Irish heritage with music, food, and family fun', 'Clare''s signature celebration of its Irish heritage. Live Irish music, traditional food, green beer, parade, and family activities throughout downtown. Clare was named after County Clare, Ireland in 1843.', '2026-03-14', NULL, 'All Day', 'Downtown Clare, McEwan Street', 'community', true, 'Annually in March', NULL, 'Free', 'global', 'published', now(), now()),
('lake-daze', 'Lake Daze Festival', 'Summer community celebration in Lake, Michigan', 'The community of Lake celebrates summer with the annual Lake Daze festival, featuring food, games, fireworks, and small-town fun.', '2026-07-04', NULL, NULL, 'Lake, MI', 'community', true, 'Annually around July 4th', NULL, 'Free', 'global', 'published', now(), now()),
('lake-improvement-board-meeting', 'Lake Improvement Board Meeting', 'Meetings for Clare County lake improvement boards', 'Clare County lake improvement boards meet to address lake management, weed control, water quality, and special assessments. Multiple boards serve different lakes. Meeting schedules are posted on the county calendar.', '2026-04-15', NULL, 'TBD', '225 W Main St, Harrison, MI 48625', 'government', true, 'As scheduled', NULL, 'Free', 'global', 'published', now(), now()),
('lumberjack-festival', 'Farwell Lumberjack Festival', 'Celebrating Farwell''s logging heritage with competitions and family fun', 'Farwell honors its logging heritage with lumberjack competitions, live music, craft vendors, food, and family activities. The village was a hub for Michigan''s lumber industry in the 1800s.', '2026-08-15', '2026-08-16', NULL, 'Village of Farwell, MI', 'community', true, 'Annually in August', NULL, 'Free', 'global', 'published', now(), now()),
('native-plant-pickup-flowers', 'Native Plant Sale Pickup (Wildflowers & Garden Kits)', 'Pick up your pre-ordered wildflowers and garden kits from the Clare Conservation District spring plant sale', 'Pick up your pre-ordered wildflowers and garden kits from the Clare Conservation District''s annual spring plant sale. Pickup runs May 21-23. Bring your order confirmation and a vehicle suitable for transporting your plants.', '2026-05-21', NULL, '9:00 AM - 4:00 PM', 'Harrison City Hall Maintenance Shop, 2105 Sullivan Dr, Harrison, MI', 'conservation', false, NULL, NULL, NULL, 'global', 'published', now(), now()),
('native-plant-pickup-trees', 'Native Plant Sale Pickup (Trees & Shrubs)', 'Pick up your pre-ordered native trees and shrubs from the Clare Conservation District spring plant sale', 'Pick up your pre-ordered native trees and shrubs from the Clare Conservation District''s annual spring plant sale. Pickup runs May 7-9. Bring your order confirmation and a vehicle suitable for transporting your plants.', '2026-05-07', NULL, '9:00 AM - 4:00 PM', 'Harrison City Hall Maintenance Shop, 2105 Sullivan Dr, Harrison, MI', 'conservation', false, NULL, NULL, NULL, 'global', 'published', now(), now()),
('planning-commission-april-2026', 'Planning Commission Meeting', 'Regular monthly meeting of the Lincoln Township Planning Commission', 'The Planning Commission meets monthly to review site plans, zoning requests, and land use matters. Meetings are open to the public.', '2026-04-14', NULL, '7:00 PM', 'Lincoln Township Hall, 175 Lake George Ave, Lake George, MI', 'government', true, '1st Tuesday after 2nd Monday monthly', NULL, NULL, 'global', 'published', now(), now()),
('sad-hearings-may-2026', 'Special Assessment District Public Hearings (Shingle, Bertha & Lake George)', 'Public hearings for Special Assessment Districts on Shingle Lake, Lake Bertha, and Lake George', 'Lincoln Township will hold public hearings for the Special Assessment Districts on Shingle Lake, Lake Bertha, and Lake George. Property owners within these SAD boundaries are encouraged to attend and provide input on the proposed assessments for lake maintenance and improvement projects.', '2026-05-08', NULL, '4:00 PM', 'Lincoln Township Hall, 175 Lake George Ave, Lake George, MI', 'government', false, NULL, NULL, NULL, 'global', 'published', now(), now()),
('summer-concert-series', 'Summer Concert Series', 'Free Thursday evening concerts in Shamrock Park', 'Bring a lawn chair and enjoy free live music at Shamrock Park in Clare every Thursday evening from June through July, 6-8pm.', '2026-06-04', '2026-07-30', '6pm-8pm', 'Shamrock Park, Clare, MI', 'community', true, 'Thursdays, June through July', NULL, 'Free', 'global', 'published', now(), now()),
('summerfest', 'Clare Summerfest', 'Summer celebration in downtown Clare with music, vendors, and activities', 'Downtown Clare comes alive for Summerfest weekend with live music, food vendors, craft booths, and family activities along McEwan Street.', '2026-06-20', '2026-06-21', '10am-10pm', 'Downtown Clare, McEwan Street', 'community', true, 'Annually in June', NULL, 'Free', 'global', 'published', now(), now()),
('twp-board-april-2026', 'Lincoln Township Board Meeting', 'Regular monthly meeting of the Lincoln Township Board of Trustees', 'The Lincoln Township Board meets on the second Monday of each month to conduct regular township business. Meetings are open to the public and include time for public comment.', '2026-04-13', NULL, '7:00 PM', 'Lincoln Township Hall, 175 Lake George Ave, Lake George, MI', 'government', true, '2nd Monday monthly', NULL, NULL, 'global', 'published', now(), now()),
('twp-board-may-2026', 'Lincoln Township Board Meeting', 'Regular monthly meeting of the Lincoln Township Board of Trustees', 'The Lincoln Township Board meets on the second Monday of each month to conduct regular township business. Meetings are open to the public and include time for public comment.', '2026-05-11', NULL, '7:00 PM', 'Lincoln Township Hall, 175 Lake George Ave, Lake George, MI', 'government', true, '2nd Monday monthly', NULL, NULL, 'global', 'published', now(), now()),
('vernal-pool-monitoring', 'Vernal Pool Monitoring Event', 'Learn how to identify and monitor vernal pools, critical seasonal wetland habitats for amphibians and invertebrates', 'Join the Clare Conservation District for a hands-on vernal pool monitoring event. Learn how to identify vernal pools, the unique seasonal wetlands that provide critical breeding habitat for salamanders, frogs, and aquatic invertebrates. No experience necessary.', '2026-05-29', NULL, 'TBD', 'Clare Conservation District Habitat Education Property, Clare County, MI', 'conservation', false, NULL, NULL, NULL, 'global', 'published', now(), now()),
('yoders-auction', 'Yoder''s Quilt Auction & Flea Market', 'Amish quilt auction and flea market near Clare', 'The local Amish community hosts quilt auctions and flea markets at Yoder''s on Leaton Road. Handcrafted quilts, furniture, baked goods, and produce. Contact (989) 386-2872 for schedule. Note: closed Thursdays.', '2026-05-01', NULL, 'Fridays and Saturdays, seasonal', '10885 N Leaton Rd, Clare, MI', 'community', true, 'Fridays and Saturdays, seasonal', NULL, 'Free admission', 'global', 'published', now(), now())
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, body = EXCLUDED.body;

-- =============================================================================
-- Guides (25)
-- =============================================================================

INSERT INTO public.guides (slug, title, description, body, category, scenario, icon, jurisdiction, last_verified, status, created_at, published_at)
VALUES
('animal-shelter-adoption', 'Adopting from the Clare County Animal Shelter', 'How to adopt a pet from the county animal shelter', 'The Clare County Animal Shelter is open for adoptions 10am to 4pm, Monday through Friday. Located in Harrison. Walk-ins welcome to view available animals. Adoption fees vary. The shelter also handles stray animal reports and animal control services. After-hours animal emergencies: (989) 539-1336 (Central Dispatch).', 'services', 'I want to adopt a dog or cat — how does the county shelter work?', '🐾', 'county', '2026-03-26', 'published', now(), now()),
('appeal-assessment', 'Appealing Your Property Assessment', 'How to challenge your property tax assessment in Grant Township, Clare County, Michigan. Board of Review process and Michigan Tax Tribunal options.', 'Every year, the township assessor determines the assessed value of your property. If you believe your assessment is too high — meaning it does not reflect what your property would actually sell for — you have the right to appeal.

## Steps to Appeal

1. **Review your assessment notice.** You will receive it in February. It shows your property''s assessed value (which should be roughly 50% of market value) and taxable value. Make sure the property details (acreage, square footage, number of bedrooms) are correct.
2. **Talk to the assessor first.** Call Casey Guthrie at (231) 350-9123 before the Board of Review meets. Sometimes errors in property data can be corrected without a formal appeal. Casey can explain how your value was calculated.
3. **Gather your evidence.** Strong appeals include:
   - Recent sale prices of comparable properties nearby
   - A recent appraisal of your property
   - Photos showing condition issues that affect value
   - Documentation of damage, flooding, or other problems
4. **Attend the March Board of Review.** The Board of Review meets in March (exact dates are posted at the township office and on the website). You can appear in person or submit a written appeal by letter. Bring copies of all your evidence.
5. **Present your case clearly.** Explain why you believe the assessed value exceeds 50% of your property''s true market value. Stick to facts and comparable sales — emotion will not move the board.
6. **Receive the decision.** The Board of Review will notify you of their decision in writing.

## If You Disagree with the Board of Review

You can appeal further to the **Michigan Tax Tribunal**. For residential property valued under $100,000, use the Small Claims Division (simpler, no lawyer needed). The filing deadline is **July 31** of the tax year. Visit [michigan.gov/taxtrib](https://michigan.gov/taxtrib) for forms and instructions.

## Key Details

- **The Board of Review cannot raise your assessment** based on your appeal. You will not be penalized for showing up.
- **You must appeal to the Board of Review first** before going to the Michigan Tax Tribunal.
- **Deadline matters.** If you miss the March Board of Review, your next chance is the following year (with limited exceptions for July and December sessions).', 'taxes', 'I think my property assessment is wrong — how do I appeal?', '📊', 'township', '2026-03-25', 'published', now(), now()),
('blight-notice', 'I Got a Blight or Nuisance Notice', 'What to do if you receive a blight or nuisance violation notice in Grant Township, Clare County, Michigan. Steps to comply, appeal, and avoid fines.', 'Getting a blight or nuisance notice in the mail can feel alarming, but it is not a fine — it is a heads-up that something on your property needs attention. The township enforces these rules under **Ordinance 32: Nuisance & Blight** to keep the community safe and property values stable.

## What Counts as Blight

Common violations include junk vehicles (unregistered, inoperable, or missing parts), accumulated trash or debris, overgrown vegetation blocking roads or sidewalks, abandoned appliances, and dilapidated structures. If it creates a health hazard, attracts pests, or drags down the neighborhood, it likely qualifies.

## Steps to Handle Your Notice

1. **Read the notice carefully.** It will describe the specific violation, the ordinance section, and your deadline to fix it — typically 30 days.
2. **Contact Ken Logan** at (989) 588-9841 ext. 8 if anything is unclear. He can explain exactly what needs to change.
3. **Fix the issue within the deadline.** Remove junk vehicles, clean up debris, mow overgrowth, or demolish unsafe structures.
4. **Document your cleanup.** Take dated photos showing the property before and after. This protects you if there is a dispute.
5. **Notify the enforcement officer** once the work is done so they can close out the violation.

## If You Want to Appeal

You have the right to appeal the notice. Submit a written appeal to the Township Board before your compliance deadline. You will get a hearing where you can present your case. Bring photos and any evidence supporting your position.

## Common Mistakes

- **Ignoring the notice.** It will not go away. Fines and legal action can follow.
- **Partial cleanup.** Make sure you address everything listed in the notice, not just the most visible item.
- **Assuming a fence hides the problem.** Screening junk behind a fence does not fix a blight violation unless the ordinance specifically allows it.', 'property', 'I got a blight/nuisance notice — what do I do?', '📋', 'township', '2026-03-25', 'published', now(), now()),
('build-pole-barn', 'Building a Pole Barn or Accessory Building', 'Step-by-step guide to building a pole barn, garage, or accessory building in Grant Township, Clare County. Permits, setbacks, and inspections explained.', 'Putting up a pole barn, detached garage, or shed is one of the most common building projects in the township. You will need approvals from two places — the township for zoning and the county for building — so plan ahead.

## Steps to Get Started

1. **Check your zoning district.** Call Dick Hassberger at (989) 588-9841 ext. 5 to confirm what is allowed on your parcel. Residential, agricultural, and commercial zones have different rules for accessory buildings.
2. **Know your setbacks.** Accessory buildings typically must be set back a minimum distance from property lines, roads, and your primary structure. Setbacks vary by zone — Dick can tell you the exact numbers for your property.
3. **Apply for a township zoning permit.** Submit the Zoning Permit Application to the township office with a site plan showing the building location, dimensions, and distances to property lines.
4. **Apply for a county building permit.** Once your zoning permit is approved, contact the Clare County Building Department at (989) 539-2761. You will need construction plans, including foundation details and structural specs.
5. **Schedule inspections.** The county requires inspections at key stages — typically foundation, framing, and final. Do not pour concrete or close up walls before the inspector signs off.
6. **Get your certificate of occupancy.** After the final inspection passes, you are good to go.

## Key Details

- **Cost:** Township zoning permits are typically $50-$100. County building permits vary by project size.
- **Timeline:** Allow 2-4 weeks for permit processing. Do not start building before both permits are in hand.
- **Size limits:** Accessory buildings generally cannot be larger than your primary structure. Confirm the maximum allowed square footage for your zone.

## Common Mistakes

- **Skipping the zoning permit.** The county will not issue a building permit without township zoning approval first.
- **Building too close to the property line.** This is the most common violation and can result in an order to move or remove the structure.
- **Starting work before permits are issued.** Building without permits can result in fines, a stop-work order, or being required to tear down the structure.', 'property', 'I want to build a pole barn or accessory building', '🏗️', 'township', '2026-03-25', 'published', now(), now()),
('building-permit', 'Getting a Building Permit', 'How to get a building permit in Clare County, Michigan. When you need one, where to apply, and what inspections are required.', 'Almost any construction project — new buildings, additions, decks, electrical work, plumbing, mechanical systems — requires a building permit from Clare County. The process starts at the township level, then moves to the county.

## Do I Need a Permit?

You likely need a permit if you are:
- Building anything new (house, garage, pole barn, shed over 200 sq ft)
- Adding on to an existing structure
- Doing electrical, plumbing, or mechanical work
- Installing or replacing a roof (in some cases)
- Putting in a deck or porch

You probably do **not** need one for minor repairs, painting, or small sheds under 200 square feet. When in doubt, call the county at (989) 539-2761.

## Steps to Get Your Permit

1. **Get a township zoning permit first.** Contact Dick Hassberger at (989) 588-9841 ext. 5. Submit a Zoning Permit Application with a site plan. The township confirms your project meets local zoning rules.
2. **Apply for the county building permit.** Bring your approved zoning permit plus construction plans to the Clare County Building Department. Plans should include dimensions, materials, structural details, and a site drawing.
3. **Pay the permit fee.** Fees are based on project value and type. Expect $75-$300 for typical residential projects.
4. **Post your permit.** Display it at the job site where inspectors can see it.
5. **Call for inspections.** The county requires inspections at specific stages — footing, framing, insulation, and final are common. Schedule each one before moving to the next phase.
6. **Get final approval.** Once the final inspection passes, you receive a certificate of completion.

## Key Details

- **Timeline:** Permit review typically takes 1-2 weeks.
- **Permits expire** if work does not start within 6 months.
- **Contractors** should pull their own permits for trade work (electrical, plumbing).

## Common Mistakes

- **Skipping the township step.** The county requires zoning approval before they will process your building permit.
- **Starting work before the permit is issued.** This can result in double fees, stop-work orders, or required demolition.
- **Not scheduling inspections.** Covering up work before an inspection means you may have to tear it out so the inspector can see it.', 'property', 'I need a building permit — where do I start?', '🔨', 'county', '2026-03-25', 'published', now(), now()),
('burn-permit', 'Getting a Burn Permit', 'How to get a burn permit in Clare County, Michigan. Rules for open burning, what you can and can''t burn, and fire safety contacts.', 'In Michigan, you need a burn permit from the DNR before doing any open burning outdoors. Permits are free, quick to get, and required by law. Burning without one can result in fines — and if your fire spreads, you are liable for suppression costs.

## How to Get a Burn Permit

1. **Call the Michigan DNR burn permit line** at **1-866-922-2876**. This is an automated system available 24/7.
2. **Or go online** at Michigan.gov/BurnPermit.
3. **Answer a few questions** about your location and what you plan to burn.
4. **Get your permit number.** The system issues permits based on current fire danger conditions. If conditions are too dry or windy, permits will be denied for that day.
5. **Burn during permitted hours only.** Burning is generally allowed from 6 PM to 8 AM during fire season (typically March through May). Outside fire season, daytime burning may be permitted depending on conditions.

## What You Can Burn

- Brush and woody debris from your own property
- Leaves and yard waste (check local rules)
- Campfires in a proper fire ring

## What You Cannot Burn

- **Household garbage or trash** — this is illegal in Michigan
- **Construction materials, plastics, or treated wood**
- **Tires, furniture, or appliances**
- **Anything during a burn ban** — these are issued when fire danger is extreme

## Fire Safety Rules

- Keep your fire at least **50 feet from any structure**
- Have water or a fire extinguisher on hand
- Never leave a fire unattended
- Make sure the fire is **completely out** before you leave — drown, stir, and feel for heat

## Local Fire Department Info

The fire department siren test runs on the **first Thursday of every month at 3:00 PM**. If you hear the siren at any other time, it signals an actual emergency.

For fire emergencies, call **911**. For non-emergency fire questions, contact Fire Chief Dale Majewski at (989) 429-8887.', 'safety', 'How do I get a burn permit?', '🔥', 'state', '2026-03-25', 'published', now(), now()),
('county-gis-maps', 'Using Clare County GIS Maps', 'How to look up property information, parcels, and zoning using the county GIS system', 'Step-by-step guide to using the Fetch GIS portal at app.fetchgis.com/clare. Search by address or parcel number. View property boundaries, ownership, assessed values, and zoning. The BS&A Online portal (bsaonline.com) provides additional property tax and assessment data. For questions about assessments, contact the Equalization Department.', 'property', 'I want to look up property boundaries, ownership, or zoning information — how do I use the county maps?', '🗺️', 'county', '2026-03-26', 'published', now(), now()),
('county-road-issues', 'Reporting Road Problems', 'How to report potholes, road damage, or maintenance needs on county roads', 'The Clare County Road Commission is a separate entity from county government and maintains county roads, bridges, and rights-of-way. Report potholes, road damage, fallen trees, flooding, or other road hazards by calling (989) 539-2151 during business hours. For after-hours emergencies affecting road safety, call Central Dispatch at (989) 539-1336. Note: city streets in Clare and Harrison are maintained by their respective city governments, not the Road Commission.', 'services', 'There''s a pothole or road damage on my road — how do I report it?', '🚧', 'county', '2026-03-26', 'published', now(), now()),
('dog-license', 'Licensing Your Dog', 'How to license your dog in Clare County, Michigan, including costs, where to apply, rabies vaccination requirements, and late fees.', 'Michigan law requires all dogs over four months old to be licensed. It is not optional — it is the law, and it helps reunite lost dogs with their owners. Licenses are handled through the Clare County Treasurer''s Office.

## How to Get a Dog License

1. **Get your dog vaccinated for rabies.** You will need a current rabies vaccination certificate from your veterinarian. The vaccine must be up to date at the time of licensing.
2. **Visit the County Treasurer''s Office** at the Clare County Building, 225 W. Main St., Harrison. Bring your rabies certificate.
3. **Pay the license fee** and receive your tag. Attach the tag to your dog''s collar.

## License Costs

| Type | On Time | Late (after June 1) |
|---|---|---|
| Spayed/neutered | $10 | $30 |
| Not spayed/neutered | $25 | $50 |
| Senior citizen (65+), spayed/neutered | $10 | $30 |
| Replacement tag | $5 | — |

**Unsanctioned (unlicensed) dog fine:** Up to $70 plus the license fee.

Licenses run from January 1 through December 31 each year. You can renew starting in December for the following year. After June 1, late fees apply automatically.

## Key Details

- **Who needs a license:** All dogs over four months old living in Clare County.
- **Proof of rabies:** Required every time you license or renew.
- **Multiple dogs:** Each dog needs its own license.
- **Where to pay:** County Treasurer''s Office only. Licenses are not available at the township level.

## Lost or Found Dogs

If your dog goes missing or you find a stray, contact Animal Control Officer Bob Dodson at **(989) 539-3221**. The dog license tag is the fastest way for animal control to identify a dog and contact its owner.

The Clare County Animal Shelter holds strays and works to reunite pets with owners. Check with them if your dog is lost — and make sure that license tag is on the collar.', 'services', 'How do I license my dog?', '🐕', 'county', '2026-03-25', 'published', now(), now()),
('drain-commissioner', 'Reporting Drainage Issues', 'How to report flooding, drainage problems, or ditch maintenance needs', 'The Clare County Drain Commissioner manages county drains, drainage districts, and stormwater infrastructure. Report drainage issues, blocked culverts, or flooding to the Drain Commissioner''s office at (989) 539-7320. The office is at 225 W Main St, Harrison. Drainage Board meetings are held as needed to address district-wide matters. For emergency flooding or road washouts, contact Central Dispatch at (989) 539-1336.', 'property', 'My property has drainage problems or flooding — who do I contact?', '🌊', 'county', '2026-03-26', 'published', now(), now()),
('emergency-alerts', 'Signing Up for Emergency Alerts', 'How to sign up for emergency alerts in Clare County, Michigan, including text alerts, Smart911, text-to-911, and NOAA weather radio information.', 'Clare County has several ways to keep you informed during emergencies — severe weather, road closures, missing persons, and other critical events. Signing up takes a few minutes and could make a real difference when it matters.

## Text Alerts (Fastest Way)

1. **Text the word "ClareCoAlerts" to 67283** from your cell phone.
2. You will receive a confirmation message. Reply to confirm your subscription.
3. You will now get text alerts for emergencies in Clare County.

This is the fastest way to get notified. Alerts go out for severe weather, evacuations, road closures, and other urgent situations.

## Smart911

1. **Go to Smart911.com** and create a free account.
2. Enter your household information — names, medical conditions, pets, and your address.
3. When you call 911, dispatchers automatically see your profile, which helps them send the right help faster.

Smart911 is especially valuable if someone in your household has medical conditions, mobility limitations, or communication challenges.

## Text-to-911

If you cannot safely make a voice call, you can **text 911** in Clare County. This works for:

- Situations where speaking would put you in danger
- Deaf or hard-of-hearing callers
- Medical emergencies where you cannot speak

Always call if you can. Text if you cannot.

## NOAA Weather Alerts

A NOAA weather radio provides automated alerts for severe weather, even when the power is out. You can buy one at most hardware stores for $20-40. Clare County is covered by the Houghton Lake transmitter.

## Important Numbers to Save

| Purpose | Number |
|---|---|
| **Emergencies** | 911 |
| **Non-emergency dispatch** | (989) 539-1336 (24/7) |
| **Central Dispatch office** | (989) 539-7166 |
| **Emergency Management** | (989) 539-6161 |', 'safety', 'How do I sign up for emergency alerts?', '🚨', 'county', '2026-03-25', 'published', now(), now()),
('foia-request', 'Submitting a FOIA Request', 'How to submit a Freedom of Information Act (FOIA) request in Clare County, Michigan at the township or county level, including timelines, fees, and appeal process.', 'Michigan''s Freedom of Information Act (FOIA) gives you the right to request public records from any government body — the township, the county, or any public agency. You do not need to explain why you want the records, and the government must respond within 5 business days.

## What You Can Request

FOIA covers most government records, including:
- Meeting minutes and agendas
- Budgets and financial reports
- Contracts and agreements
- Correspondence (emails, letters)
- Permits and applications
- Personnel records (with some exemptions)

Some records are exempt from FOIA, including certain law enforcement investigation files, attorney-client communications, and personal information protected by privacy laws.

## How to Submit a Request

1. **Decide who has the records.** Township records (zoning, local meetings, township finances) go to the Township Clerk. County records (court records, county budgets, sheriff records) go to the County FOIA Coordinator.
2. **Write your request.** Be as specific as possible — dates, names, and subject matter help staff find what you need quickly. You can use the FOIA Request Form or write your own letter.
3. **Submit your request:**
   - **Township:** Mail, deliver, or email to Clerk Carol Majewski at (989) 588-9841 ext. 2
   - **County:** Email FOIA@clareco.net or call (989) 539-2588

## Timelines and Fees

- **Response deadline:** 5 business days. The government may extend this by 10 additional business days with written notice.
- **Fees:** You may be charged for copies (typically $0.10/page), labor to find records (hourly rate), and postage. You can request a detailed cost itemization before paying.
- **Fee waivers:** The first $20 of search costs is waived. Indigent individuals and nonprofit organizations may qualify for reduced fees.

## If Your Request Is Denied

1. You will receive a written denial explaining the reason and the specific FOIA exemption cited.
2. **Appeal to the head of the public body** within 180 days.
3. If the appeal is denied, you can file a lawsuit in Circuit Court.', 'government', 'How do I submit a FOIA request?', '📄', 'township', '2026-03-25', 'published', now(), now()),
('free-forestry-advice', 'Getting Free Forestry Advice', 'How to get free professional forestry advice in Clare County, Michigan through the Conservation District Forester, including habitat planning, pest management, and federal program connections.', 'If you own wooded land in Clare County, you have access to a free professional forester through the Conservation District. Mike Dittenber is the District Forester, and his job is to help private landowners make good decisions about their trees and forests — at no cost.

## What You Get

Mike provides free on-site evaluations covering:

- **Tree species identification** and health assessment
- **Wildlife habitat improvement** — what to plant, cut, or leave standing for deer, turkey, songbirds, and pollinators
- **Pest and disease management** — identifying oak wilt, emerald ash borer, spongy moths, and other threats
- **Timber stand improvement** — which trees to thin, which to keep, and when
- **Tree planting recommendations** — species selection for your soil type and goals
- **Forest stewardship plans** — written management plans for your property

## How to Get Started

1. **Call (989) 539-6401** and ask for Mike Dittenber, or stop by the Conservation District office at 545 N. McEwan St. in Harrison.
2. **Describe your property and goals.** Whether you want better deer habitat, timber income, fire protection, or just healthier woods, Mike can help.
3. **Schedule a site visit.** Mike will walk your property with you and give specific recommendations based on what he sees.
4. **Get a written plan** if you want one. Forest stewardship plans are useful for applying to cost-share programs and qualifying for tax benefits.

## Connections to State and Federal Programs

Mike can connect you with programs that help pay for conservation work:

- **EQIP (Environmental Quality Incentives Program):** Federal cost-share for practices like tree planting, invasive species removal, and wildlife habitat improvements.
- **CSP (Conservation Stewardship Program):** Payments for maintaining and improving existing conservation practices.
- **Qualified Forest Program:** A Michigan property tax program that reduces taxes on managed forestland. See our separate guide for details.

## Key Details

- **Cost:** Free. The District Forester position is funded to serve private landowners.
- **Property size:** No minimum. Mike helps owners of 5 acres and 500 acres alike.
- **Timeline:** Site visits are typically scheduled within a few weeks of your call.', 'nature', 'I want free forestry advice for my property', '🌲', 'county', '2026-03-25', 'published', now(), now()),
('native-plants', 'Getting Started with Native Plants', 'How to buy native plants and trees in Clare County, Michigan through the Conservation District plant sale, plus invasive species tools and local conservation resources.', 'The Clare Conservation District runs an annual native plant sale every spring. It is the easiest and most affordable way to get Michigan-native trees, shrubs, and wildflowers for your property. Whether you want to restore a meadow, stabilize a shoreline, or attract pollinators, this is where to start.

## How to Order

1. Watch for the Conservation District catalog, usually available in late winter. You can pick one up at their office at 545 N. McEwan St. in Harrison or request one by calling (989) 539-6401.
2. Review the catalog for available species. They typically carry conifers, hardwood seedlings, native wildflower plugs, seed mixes, and shrubs suited to northern Michigan.
3. Fill out the order form and return it with payment before the deadline (orders usually close in early April).
4. Pick up your plants at the scheduled dates:
   - **Trees and shrubs:** May 7-9
   - **Wildflowers and plugs:** May 21-23
5. Plant according to the included care instructions. The District staff are happy to answer questions about spacing and site prep.

## Tool Rental for Invasive Species

The Conservation District rents tools to help you manage invasive species on your property. Equipment like brush cutters and herbicide applicators are available at $12-25 per day. Call (989) 539-6401 to check availability and reserve.

## Tips for Success

- **Match plants to your site.** Sun, shade, wet, dry — native species have preferences. Ask Mike Dittenber for free advice on what grows best where you are.
- **Start small.** A 10x10 ft native planting is a great first project.
- **Remove invasives first.** Planting natives into a patch of autumn olive or garlic mustard sets them up to fail. Clear the area before you plant.
- **Be patient.** Most native plantings take 2-3 growing seasons to establish. The first year they sleep, the second year they creep, the third year they leap.', 'nature', 'I want to support conservation with native plants — how do I get started?', '🌿', 'county', '2026-03-25', 'published', now(), now()),
('pay-property-taxes', 'Paying Your Property Taxes', 'How to pay property taxes in Grant Township, Clare County, Michigan. Payment methods, deadlines, and what happens if you pay late.', 'Property taxes in Michigan are billed twice a year — summer and winter. The township treasurer handles collection during the initial payment window, then unpaid taxes roll over to the county.

## Payment Deadlines

- **Summer taxes:** Due **September 14**. Bills go out in July.
- **Winter taxes:** Due **December 14** without penalty. You can pay winter taxes through **February 14** with a small penalty added.
- After February 14, all unpaid taxes are turned over to the Clare County Treasurer and additional penalties and interest apply.

## How to Pay

1. **By mail.** Send a check or money order to the Grant Township Treasurer at the township office. Include your tax bill stub.
2. **In person.** Visit the township office during business hours. Cash, check, and money order are accepted.
3. **Online.** Pay at [bsaonline.com](https://bsaonline.com) using a credit card, debit card, or e-check. Note: **credit and debit card payments carry a 3% convenience fee.** E-check fees are lower.
4. **Through your mortgage company.** If your taxes are escrowed, your lender pays directly. Verify with your mortgage company that payments are being made on time.

## What Happens If You Pay Late

- After the September or December deadline, a **1% penalty per month** is added.
- After February 14, unpaid taxes transfer to the **Clare County Treasurer** at (989) 539-7801. At that point, additional interest and fees accumulate.
- After several years of non-payment, the property can go to **tax foreclosure sale**. Do not let it get to this point — contact the county treasurer to set up a payment plan if you are struggling.

## Key Details

- **Partial payments** are accepted by the township treasurer before the delinquency deadline.
- **If you recently purchased your property,** you may not receive a bill if the address has not been updated. You are still responsible for payment. Call Maggie Carey at (989) 588-9841 ext. 3 to confirm your bill.
- **Keep your receipts.** Always retain proof of payment for your records.', 'taxes', 'How do I pay my property taxes?', '💰', 'township', '2026-03-25', 'published', now(), now()),
('principal-residence-exemption', 'Claiming the Principal Residence Exemption', 'How to claim the Principal Residence Exemption (PRE) in Grant Township, Clare County, Michigan to reduce your property taxes.', 'The Principal Residence Exemption (PRE) is one of the biggest tax savings available to Michigan homeowners. It exempts your primary home from up to 18 mills of school operating taxes — which can save you hundreds or even thousands of dollars per year.

## Who Qualifies

You qualify if the property is your **primary residence** — the place where you live most of the year, where you are registered to vote, and where you file your Michigan income tax from. You can only claim the exemption on one property.

## How to Claim It

1. **Fill out Form 2368** — the Principal Residence Exemption Affidavit. You can get it from the township office or download it from the Michigan Department of Treasury website.
2. **Submit it to the township assessor.** File it with Casey Guthrie by **June 1** to receive the exemption on that year''s summer tax bill. If you file after June 1 but before November 1, it takes effect the following year.
3. **You only need to file once** as long as you continue to live in the home. You do not need to reapply each year.

## If You Move

When you move out of the home — whether you sell it, rent it, or simply stop living there — you **must** file a **Rescind form (Form 2602)** within 90 days. Failing to rescind when required can result in penalties, back taxes, and interest.

## How Much You Save

The exemption removes up to 18 mills of school operating taxes from your bill. On a home with a taxable value of $50,000, that is roughly **$900 per year** in savings. The exact amount depends on your local millage rates.

## Key Details

- **New homeowners:** File as soon as you move in. Do not assume the previous owner''s exemption transfers to you — it does not.
- **Rental properties** do not qualify. If you rent out your home, you must rescind the exemption.
- **Seasonal or vacation homes** do not qualify. It must be where you actually live.

## Common Mistakes

- **Forgetting to file after buying a home.** The exemption is not automatic. You must submit the affidavit.
- **Keeping the exemption after moving out.** Michigan audits these. If you are caught claiming a PRE on a property that is not your primary residence, you will owe back taxes plus penalties.
- **Missing the June 1 deadline.** Filing late means waiting until the next tax year for savings.', 'taxes', 'How do I claim the principal residence exemption?', '🏠', 'township', '2026-03-25', 'published', now(), now()),
('property-split', 'Dividing or Splitting Your Property', 'How to split or divide your land in Grant Township, Clare County, Michigan. Requirements, applications, and Planning Commission review process.', 'If you want to sell part of your land, give a parcel to a family member, or create a separate buildable lot, you will need to go through the township''s land division process. This is governed by **Ordinance 27: Land Division** and **Ordinance 35: Lot Splitting**, along with Michigan''s Land Division Act.

## Before You Start

Not every parcel can be split. To be eligible, the resulting lots typically must:
- Meet the minimum lot size for your zoning district
- Have adequate road frontage
- Be able to support a well and septic system (if not on municipal services)
- Comply with all current zoning setback requirements

## Steps to Split Your Property

1. **Talk to the Zoning Administrator first.** Call Dick Hassberger at (989) 588-9841 ext. 5. He can review your parcel and let you know if a split is feasible before you spend money on surveys.
2. **Hire a licensed surveyor.** You will need a professional survey showing the proposed division, existing structures, easements, and dimensions of all resulting parcels.
3. **Submit a Land Division Application.** Bring your completed application and survey to the township office. Include a description of both the parent parcel and the proposed new parcels.
4. **Planning Commission review.** The Planning Commission will review your application at their next meeting. They check that both parcels meet zoning requirements and that the split does not create landlocked parcels or other problems.
5. **Get approval and record the deed.** Once approved, you can record the new parcel descriptions with the Clare County Register of Deeds.

## Key Details

- **Cost:** Application fees plus surveyor costs (surveys typically run $500-$1,500 depending on complexity).
- **Timeline:** Plan for 4-8 weeks from application to approval, depending on the Planning Commission meeting schedule.
- **Michigan law limits** the number of times a parcel can be divided. Your parent parcel''s division history matters.

## Common Mistakes

- **Splitting before checking zoning.** If the resulting lots are too small or lack road frontage, the split will be denied.
- **Selling land before the split is recorded.** The legal division must be completed and recorded with the county before any transfer.
- **Forgetting about easements.** Existing utility or access easements can complicate a split. Your surveyor should identify these early.', 'property', 'I want to divide or split my property', '📐', 'township', '2026-03-25', 'published', now(), now()),
('qualified-forest-program', 'Qualified Forest Program Tax Savings', 'How the Qualified Forest Program works in Michigan. Save on property taxes if you own 20+ acres of forested land in Clare County.', 'If you own 20 or more acres of forested land in Michigan, the Qualified Forest Program (QFP) can significantly reduce your property taxes. Enrolled parcels are exempt from the school operating millage — the same millage that the Principal Residence Exemption covers for homeowners — saving you up to 18 mills.

## How It Works

The QFP is a state program that encourages landowners to actively manage their forests. In exchange for following a professional forest management plan, you get a property tax reduction on the forested portion of your land. The program is managed by the Michigan Department of Natural Resources (DNR).

## Steps to Enroll

1. **Check eligibility.** Your property must be at least **20 contiguous acres** of forested land. It does not need to be 100% wooded, but the primary character must be forest. The land can include your home site.
2. **Contact the district forester.** Call Mike Dittenber at (989) 539-6401. He covers the Clare County area and can visit your property to assess whether it qualifies.
3. **Get a forest management plan.** A registered forester (the DNR can help you find one) will create a plan for your property. The plan covers timber stand types, recommended harvests, wildlife habitat, and management activities over a multi-year period.
4. **Submit your application.** File it with the DNR along with your forest management plan. Applications are due by **September 1** for the following tax year.
5. **Follow the plan.** Once enrolled, you are committed to carrying out the management activities in your plan. The DNR may inspect your property to verify compliance.

## What You Save

Enrolled parcels are exempt from up to **18 mills** of school operating taxes — the largest single component of most property tax bills. On a parcel with a taxable value of $40,000, that could mean roughly **$720 per year** in savings.

## Key Details

- **It is a long-term commitment.** Parcels must stay enrolled for a minimum period or face penalties for withdrawal.
- **Public access is not required.** Unlike the Commercial Forest program, the QFP does not require you to open your land to public hunting or recreation.
- **You can still use the land.** Hunting, hiking, and enjoying your property are all fine. The plan is about sustainable forest management, not locking up the land.
- **Timber harvests** recommended in your plan can also generate income.

## Common Mistakes

- **Assuming any wooded land qualifies.** The 20-acre minimum is firm, and the land must be primarily forested.
- **Ignoring the management plan.** Enrolling and then doing nothing can result in removal from the program and back taxes.
- **Not knowing about the program at all.** Many eligible landowners miss out simply because they have never heard of the QFP. If you own wooded acreage, it is worth a phone call to find out.', 'taxes', 'What is the Qualified Forest Program and can I save on taxes?', '🌲', 'state', '2026-03-25', 'published', now(), now()),
('register-to-vote', 'Registering to Vote and Absentee Ballots', 'How to register to vote, request an absentee ballot, and find your polling location in Clare County, Michigan.', 'Every Michigan citizen 18 or older has the right to vote. You can register at any time, vote absentee without giving a reason, and even register on Election Day. Here is how it all works in Clare County.

## How to Register to Vote

1. **Online:** Go to Michigan.gov/Vote and follow the prompts. You will need your Michigan driver''s license or state ID number.
2. **By mail:** Download a voter registration form from Michigan.gov/Vote, fill it out, and mail it to Clerk Carol Majewski at the Township Hall.
3. **In person:** Visit the Township Hall during office hours. Bring your Michigan driver''s license or state ID, or a document showing your name and current address.
4. **On Election Day:** You can register and vote the same day at the Township Clerk''s office. Bring proof of residency (driver''s license, utility bill, bank statement, or government mail with your name and address).

## Absentee Voting

Any registered voter in Michigan can vote absentee. You do not need a reason.

1. **Request an absentee ballot** by submitting an Absentee Ballot Application to the Township Clerk. You can mail it, drop it off, or submit it online at Michigan.gov/Vote.
2. **Permanent absentee voter list:** Ask the Clerk to add you to the permanent list, and you will automatically receive an application before every election.
3. **Return your ballot** by mail or drop it in the **ballot drop box at Township Hall**. Ballots must be received by 8:00 PM on Election Day.

## Key Details

- **Registration deadline:** 15 days before the election for mail and online registration. Same-day registration is available in person.
- **ID requirement:** Photo ID at the polls, or you can sign an affidavit if you do not have one.
- **Find your polling location:** Check Michigan.gov/Vote or call the Clerk at (989) 588-9841 ext. 2.

## Help Run Elections

Clare County needs election inspectors for every election. If you are interested in serving, contact Clerk Carol Majewski. Training is provided, and inspectors are paid for their time.', 'government', 'How do I register to vote or get an absentee ballot?', '🗳️', 'township', '2026-03-25', 'published', now(), now()),
('report-non-emergency', 'Reporting a Non-Emergency to the Sheriff', 'How to report non-emergency incidents to the Clare County Sheriff, file reports, get accident reports, fingerprinting, and animal control contacts.', 'Not everything requires a 911 call. For situations that are not life-threatening and not actively in progress, the Clare County Sheriff''s Office has a non-emergency line and in-person services.

## When to Call 911 vs. Non-Emergency

**Call 911** for:
- Crimes in progress
- Medical emergencies
- Fires
- Accidents with injuries
- Any situation where someone is in immediate danger

**Call non-emergency (989) 539-1336** for:
- Property damage you discovered after the fact
- Noise complaints
- Suspicious activity that is not an immediate threat
- Requesting a welfare check
- Following up on a previous report
- General questions for the sheriff''s office

The non-emergency line is staffed 24 hours a day, 7 days a week through Central Dispatch.

## How to File a Report

1. **Call (989) 539-1336** and describe the situation. A dispatcher will determine whether a deputy needs to respond or if a report can be taken by phone.
2. **Get a report number.** Keep this for your records and for insurance purposes.
3. **For in-person reports,** visit the Sheriff''s Office at 225 W. Main St. in Harrison during business hours.

## Getting Copies of Reports

- **Accident reports:** Available from the Sheriff''s Office. There may be a small fee for copies.
- **Incident reports:** Request through the office or via FOIA if needed.

## Fingerprinting Services

The Sheriff''s Office provides fingerprinting for employment, licensing, and background checks.

- **Hours:** Monday through Friday, 8:30 AM - 3:30 PM
- **Location:** 225 W. Main St., Harrison
- **No appointment needed** — walk-ins are welcome

## Animal Control

For stray animals, aggressive dogs, or animal welfare concerns, contact Animal Control Officer Bob Dodson at **(989) 539-3221**. Animal control handles:

- Stray and loose animals
- Dog bite reports
- Animal cruelty complaints
- Lost and found pets (check the county animal shelter)', 'safety', 'I need to report a non-emergency to the sheriff', '🛡️', 'county', '2026-03-25', 'published', now(), now()),
('rv-on-vacant-lot', 'Putting an RV or Temporary Storage on a Vacant Lot', 'Rules for placing an RV, camper, or temporary storage on vacant property in Grant Township, Clare County, Michigan.', 'If you own a vacant lot in the township and want to park an RV, camper, or place a temporary storage unit on it, you cannot just drop it off and go. The township has rules about what is allowed, for how long, and under what conditions.

## Steps to Follow

1. **Contact the Zoning Administrator.** Call Dick Hassberger at (989) 588-9841 ext. 5 before you move anything onto the property. He will tell you what is permitted in your specific zoning district.
2. **Apply for a special zoning permit.** Fill out the Zoning Permit for RVs/Temporary Storage. You will need to describe what you are placing, where on the lot it will sit, and how long it will be there.
3. **Meet the requirements.** Common conditions include:
   - The RV or storage unit must be in good condition (no junk or deteriorating units)
   - It must be placed at least the minimum setback distance from property lines and roads
   - You cannot use an RV as a permanent residence on a vacant lot without proper septic, well, and electrical hookups
   - Temporary storage units may have a time limit (often 6-12 months)
4. **Keep the property maintained.** Mow the grass, keep the area clean, and make sure your RV or storage unit does not become a blight issue.
5. **Renew or remove on time.** If your permit has an expiration date, either renew it before it lapses or remove the unit.

## Key Details

- **Living in an RV** on vacant land is generally not allowed without meeting the same requirements as a permanent dwelling — septic system, well or water supply, and electrical service.
- **Storage containers** (shipping containers, semi-trailers) may face additional restrictions depending on your zone.
- **No permit means enforcement.** If you skip the permit, you risk a nuisance notice and fines.

## Common Mistakes

- **Assuming your own land means no rules apply.** Zoning rules apply to all parcels regardless of ownership.
- **Leaving an RV year-round without a permit.** Even seasonal use needs approval.
- **Using a storage unit as a living space.** This is a code violation and a safety hazard.', 'property', 'I want to put an RV or temporary storage on my vacant lot', '🚐', 'township', '2026-03-25', 'published', now(), now()),
('soil-erosion-permit', 'Getting a Soil Erosion Permit', 'When you need a soil erosion permit in Clare County, Michigan, how to apply, and what inspections are required for projects near water or on large sites.', 'Michigan law requires a soil erosion and sedimentation control (SESC) permit for earth-moving projects near water or on larger parcels. The Clare Conservation District handles these permits locally. Getting one before you dig protects waterways, keeps you legal, and avoids costly fines.

## Do I Need a Permit?

You need a soil erosion permit if your project meets **either** of these thresholds:

- **Near water:** Any earth disturbance of 225 square feet or more within 500 feet of a lake, stream, river, or wetland.
- **Large sites:** Any earth disturbance of 1 acre or more, regardless of distance to water.

Common projects that trigger permits include driveways, foundations, ponds, grading, shoreline work, and septic system installations near water.

## How to Apply

1. **Call Christiane Rathke** at (989) 539-6401 before you start. She can tell you quickly whether your project needs a permit.
2. **Submit an application** to the Clare Conservation District at 545 N. McEwan St., Harrison. Include a site plan showing the work area, waterways, and erosion control measures you plan to use (silt fencing, straw blankets, etc.).
3. **Pay the permit fee.** Fees vary by project size.
4. **Get your permit** before any earth-moving begins. Typical turnaround is a few business days for straightforward projects.
5. **Install erosion controls** before starting work. The District will inspect your site.
6. **Final inspection.** Once the site is stabilized (ground cover re-established), request a final inspection to close out the permit.

## Larger or Complex Projects

If your project involves wetland fill, stream crossings, or other impacts to regulated waters, you may also need a permit from EGLE (Michigan Department of Environment, Great Lakes, and Energy). Christiane can help you determine whether a state permit applies and point you in the right direction.

## Common Mistakes

- **Starting work before the permit is issued.** This can result in fines and a stop-work order.
- **Skipping erosion controls.** Bare soil washes into waterways fast, especially on slopes. Install silt fencing and seed exposed areas promptly.
- **Forgetting to request final inspection.** Your permit stays open until the site is signed off.', 'nature', 'I need a soil erosion permit for my project near water', '🏗️', 'county', '2026-03-25', 'published', now(), now()),
('spongy-moth', 'Dealing with Spongy Moths and Invasive Species', 'How to identify, report, and treat spongy moths and other invasive species in Clare County, Michigan. Tool rentals, treatment options, and local resources.', 'Spongy moths (formerly called gypsy moths) are one of the most damaging invasive pests in Michigan. Their caterpillars strip leaves from oaks, aspens, and other hardwoods, weakening and sometimes killing trees over repeated years. Clare County has active monitoring and treatment programs through the Conservation District.

## How to Identify Spongy Moths

- **Egg masses** (fall-spring): Tan, fuzzy patches about the size of a quarter, found on tree trunks, firewood, outdoor furniture, and vehicles.
- **Caterpillars** (May-July): Hairy caterpillars with pairs of blue and red dots running down their backs.
- **Adults** (July-August): Males are brown and fly; females are white with dark markings and do not fly.

## What to Do

1. **Check your property** in late winter or early spring for egg masses. Scrape them into a bucket of soapy water to destroy them.
2. **Contact Toni Maize** at (989) 539-6401 to report heavy infestations. The Conservation District tracks populations and coordinates treatment.
3. **Set traps.** The District can supply or recommend pheromone traps to monitor moth activity on your property.
4. **Consider treatment.** For significant infestations, aerial spraying with Foray 48B (a biological insecticide made from Bt bacteria) is the most common approach. It targets caterpillars and is safe for people, pets, and wildlife. The District coordinates group treatment areas to keep costs down.
5. **Rent tools.** The Conservation District rents invasive-species management equipment at $12-25 per day — brush cutters, sprayers, and applicators.

## Other Invasive Species

The Central Michigan Cooperative Invasive Species Management Area (CM-CISMA) covers Clare County and provides identification help, educational workshops, and management resources for invasives like autumn olive, phragmites, and Japanese knotweed. Contact the Conservation District to connect with CM-CISMA programs.

## Common Mistakes

- **Do not move firewood.** Spongy moth egg masses hitchhike on firewood. Buy it where you burn it.
- **Do not wait.** Small populations are easier to manage. Scraping 20 egg masses now prevents thousands of caterpillars later.
- **Do not use broad-spectrum insecticides.** They kill beneficial insects along with the moths. Bt-based products like Foray 48B are targeted and effective.', 'nature', 'I have spongy moths or invasive species on my property', '🦋', 'county', '2026-03-25', 'published', now(), now()),
('veterans-services', 'Clare County Veterans Services', 'Benefits assistance, claims support, and resources for veterans', 'The Clare County Veterans Services office assists veterans and their families with VA benefits claims, healthcare enrollment, pension applications, and connecting to state and federal resources. Located at 225 W Main St, Harrison. Open Monday through Friday, 8am to 4:30pm. Both Karl Hauser (Director) and Allisha Gary (VSO) can help with claims filing and benefits questions. No appointment needed but recommended for complex claims.', 'services', 'I''m a veteran — what services and benefits help are available in Clare County?', '🎖️', 'county', '2026-03-26', 'published', now(), now()),
('zoning-variance', 'Applying for a Zoning Variance', 'How to apply for a zoning variance through the Grant Township Zoning Board of Appeals in Clare County, Michigan.', 'A zoning variance lets you do something that the zoning ordinance normally would not allow — like building closer to a property line than the setback requires, or putting a structure on a lot that does not quite meet size requirements. Variances are granted by the Zoning Board of Appeals (ZBA), not the Zoning Administrator.

## When You Need a Variance

You need a variance when your project does not meet the standard zoning rules and there is no other way to accomplish it. Common examples include:
- A setback that cannot be met due to lot shape or size
- A building that slightly exceeds height or coverage limits
- A use that is not quite permitted in your zone but is close

A variance is **not** a way around the rules — you must show that strict application of the ordinance creates an unnecessary hardship specific to your property.

## Steps to Apply

1. **Confirm you need a variance.** Talk to Dick Hassberger at (989) 588-9841 ext. 5 first. Sometimes there is a simpler path, like adjusting your plans to meet the setback.
2. **Fill out the ZBA Application for Variance.** Describe your property, your proposed project, and why you cannot meet the standard requirements. Be specific about the hardship.
3. **Submit the application and fee.** Turn it in to the township office. The application fee covers the cost of the public hearing notice.
4. **Public hearing notice goes out.** The township notifies neighboring property owners by mail and publishes a notice in the local newspaper. This happens at least 15 days before the hearing.
5. **Attend the ZBA hearing.** Present your case to the board. Bring a site plan, photos, and any supporting documents. Neighbors may speak for or against your request.
6. **ZBA makes a decision.** The board votes at the hearing or shortly after. They can approve, deny, or approve with conditions.

## Key Details

- **Application fee:** Typically $200-$400 (covers public notice costs).
- **Timeline:** 4-6 weeks from application to hearing, depending on the ZBA meeting schedule.
- **Approval is not guaranteed.** The ZBA must find that the hardship is unique to your property and not self-created.

## Common Mistakes

- **Claiming financial hardship.** The fact that meeting the setback makes your project more expensive is generally not enough. The hardship must relate to the physical characteristics of your property.
- **Starting work before getting the variance.** If you build first and apply later, the ZBA is less likely to be sympathetic.
- **Not attending the hearing.** If you do not show up, the ZBA will likely deny your application.', 'property', 'I need a zoning variance — how does that work?', '⚖️', 'township', '2026-03-25', 'published', now(), now())
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, body = EXCLUDED.body, scenario = EXCLUDED.scenario;


-- Guide contacts for: animal-shelter-adoption
DELETE FROM public.guide_contacts WHERE guide_id = (SELECT id FROM public.guides WHERE slug = 'animal-shelter-adoption');
INSERT INTO public.guide_contacts (guide_id, name, role, phone, email, display_order)
VALUES
((SELECT id FROM public.guides WHERE slug = 'animal-shelter-adoption'), 'Bob Dodson', 'Animal Shelter Director', '(989) 539-3221', NULL, 0);

-- Guide contacts for: appeal-assessment
DELETE FROM public.guide_contacts WHERE guide_id = (SELECT id FROM public.guides WHERE slug = 'appeal-assessment');
INSERT INTO public.guide_contacts (guide_id, name, role, phone, email, display_order)
VALUES
((SELECT id FROM public.guides WHERE slug = 'appeal-assessment'), 'Casey Guthrie', 'Township Assessor', '(231) 350-9123', NULL, 0),
((SELECT id FROM public.guides WHERE slug = 'appeal-assessment'), 'Grant Township Board of Review', 'Board of Review', '(989) 588-9841', NULL, 1);

-- Guide contacts for: blight-notice
DELETE FROM public.guide_contacts WHERE guide_id = (SELECT id FROM public.guides WHERE slug = 'blight-notice');
INSERT INTO public.guide_contacts (guide_id, name, role, phone, email, display_order)
VALUES
((SELECT id FROM public.guides WHERE slug = 'blight-notice'), 'Ken Logan', 'Ordinance Enforcement Officer', '(989) 588-9841 ext. 8', NULL, 0),
((SELECT id FROM public.guides WHERE slug = 'blight-notice'), 'Dick Hassberger', 'Zoning Administrator', '(989) 588-9841 ext. 5', NULL, 1);

-- Guide contacts for: build-pole-barn
DELETE FROM public.guide_contacts WHERE guide_id = (SELECT id FROM public.guides WHERE slug = 'build-pole-barn');
INSERT INTO public.guide_contacts (guide_id, name, role, phone, email, display_order)
VALUES
((SELECT id FROM public.guides WHERE slug = 'build-pole-barn'), 'Dick Hassberger', 'Zoning Administrator', '(989) 588-9841 ext. 5', NULL, 0),
((SELECT id FROM public.guides WHERE slug = 'build-pole-barn'), 'Clare County Building Department', 'Building Inspector', '(989) 539-2761', NULL, 1);

-- Guide forms for: build-pole-barn
DELETE FROM public.guide_forms WHERE guide_id = (SELECT id FROM public.guides WHERE slug = 'build-pole-barn');
INSERT INTO public.guide_forms (guide_id, name, url, format, display_order)
VALUES
((SELECT id FROM public.guides WHERE slug = 'build-pole-barn'), 'Zoning Permit Application', '/forms/zoning-permit-application.pdf', 'PDF', 0),
((SELECT id FROM public.guides WHERE slug = 'build-pole-barn'), 'Building Permit Application', '/forms/building-permit-application.pdf', 'PDF', 1);

-- Guide contacts for: building-permit
DELETE FROM public.guide_contacts WHERE guide_id = (SELECT id FROM public.guides WHERE slug = 'building-permit');
INSERT INTO public.guide_contacts (guide_id, name, role, phone, email, display_order)
VALUES
((SELECT id FROM public.guides WHERE slug = 'building-permit'), 'Clare County Building Department', 'Building Permits & Inspections', '(989) 539-2761', NULL, 0),
((SELECT id FROM public.guides WHERE slug = 'building-permit'), 'Dick Hassberger', 'Zoning Administrator', '(989) 588-9841 ext. 5', NULL, 1);

-- Guide forms for: building-permit
DELETE FROM public.guide_forms WHERE guide_id = (SELECT id FROM public.guides WHERE slug = 'building-permit');
INSERT INTO public.guide_forms (guide_id, name, url, format, display_order)
VALUES
((SELECT id FROM public.guides WHERE slug = 'building-permit'), 'Building Permit Application', '/forms/building-permit-application.pdf', 'PDF', 0),
((SELECT id FROM public.guides WHERE slug = 'building-permit'), 'Zoning Permit Application', '/forms/zoning-permit-application.pdf', 'PDF', 1);

-- Guide contacts for: burn-permit
DELETE FROM public.guide_contacts WHERE guide_id = (SELECT id FROM public.guides WHERE slug = 'burn-permit');
INSERT INTO public.guide_contacts (guide_id, name, role, phone, email, display_order)
VALUES
((SELECT id FROM public.guides WHERE slug = 'burn-permit'), 'Dale Majewski', 'Fire Chief', '(989) 429-8887', NULL, 0);

-- Guide contacts for: county-gis-maps
DELETE FROM public.guide_contacts WHERE guide_id = (SELECT id FROM public.guides WHERE slug = 'county-gis-maps');
INSERT INTO public.guide_contacts (guide_id, name, role, phone, email, display_order)
VALUES
((SELECT id FROM public.guides WHERE slug = 'county-gis-maps'), 'Pete Preston', 'Equalization Director', '(989) 539-7894', NULL, 0);

-- Guide forms for: county-gis-maps
DELETE FROM public.guide_forms WHERE guide_id = (SELECT id FROM public.guides WHERE slug = 'county-gis-maps');
INSERT INTO public.guide_forms (guide_id, name, url, format, display_order)
VALUES
((SELECT id FROM public.guides WHERE slug = 'county-gis-maps'), 'Clare County GIS Portal', 'https://app.fetchgis.com/clare', 'Web', 0);

-- Guide contacts for: county-road-issues
DELETE FROM public.guide_contacts WHERE guide_id = (SELECT id FROM public.guides WHERE slug = 'county-road-issues');
INSERT INTO public.guide_contacts (guide_id, name, role, phone, email, display_order)
VALUES
((SELECT id FROM public.guides WHERE slug = 'county-road-issues'), 'Clare County Road Commission', 'Road Maintenance', '(989) 539-2151', NULL, 0);

-- Guide contacts for: dog-license
DELETE FROM public.guide_contacts WHERE guide_id = (SELECT id FROM public.guides WHERE slug = 'dog-license');
INSERT INTO public.guide_contacts (guide_id, name, role, phone, email, display_order)
VALUES
((SELECT id FROM public.guides WHERE slug = 'dog-license'), 'Jenny Beemer-Fritzinger', 'County Treasurer', '(989) 539-7801', NULL, 0),
((SELECT id FROM public.guides WHERE slug = 'dog-license'), 'Bob Dodson', 'Animal Control Officer', '(989) 539-3221', NULL, 1);

-- Guide contacts for: drain-commissioner
DELETE FROM public.guide_contacts WHERE guide_id = (SELECT id FROM public.guides WHERE slug = 'drain-commissioner');
INSERT INTO public.guide_contacts (guide_id, name, role, phone, email, display_order)
VALUES
((SELECT id FROM public.guides WHERE slug = 'drain-commissioner'), 'William Faber', 'Drain Commissioner', '(989) 539-7320', NULL, 0),
((SELECT id FROM public.guides WHERE slug = 'drain-commissioner'), 'Colleen Ritchie', 'Deputy Drain Commissioner', '(989) 539-7320', NULL, 1);

-- Guide contacts for: emergency-alerts
DELETE FROM public.guide_contacts WHERE guide_id = (SELECT id FROM public.guides WHERE slug = 'emergency-alerts');
INSERT INTO public.guide_contacts (guide_id, name, role, phone, email, display_order)
VALUES
((SELECT id FROM public.guides WHERE slug = 'emergency-alerts'), 'Marlana Terrian', 'Central Dispatch Director', '(989) 539-7166 ext. 4226', NULL, 0),
((SELECT id FROM public.guides WHERE slug = 'emergency-alerts'), 'Jerry Becker', 'Emergency Management Director', '(989) 539-6161', NULL, 1);

-- Guide contacts for: foia-request
DELETE FROM public.guide_contacts WHERE guide_id = (SELECT id FROM public.guides WHERE slug = 'foia-request');
INSERT INTO public.guide_contacts (guide_id, name, role, phone, email, display_order)
VALUES
((SELECT id FROM public.guides WHERE slug = 'foia-request'), 'Carol Majewski', 'Township Clerk', '(989) 588-9841 ext. 2', 'clerk@unicorntownship.org', 0),
((SELECT id FROM public.guides WHERE slug = 'foia-request'), 'Clare County FOIA Coordinator', 'County FOIA', '(989) 539-2588', 'FOIA@clareco.net', 1);

-- Guide forms for: foia-request
DELETE FROM public.guide_forms WHERE guide_id = (SELECT id FROM public.guides WHERE slug = 'foia-request');
INSERT INTO public.guide_forms (guide_id, name, url, format, display_order)
VALUES
((SELECT id FROM public.guides WHERE slug = 'foia-request'), 'FOIA Request Form', '/forms/foia-request.pdf', 'PDF', 0),
((SELECT id FROM public.guides WHERE slug = 'foia-request'), 'Detailed Cost Itemization Request', '/forms/foia-cost-itemization.pdf', 'PDF', 1);

-- Guide contacts for: free-forestry-advice
DELETE FROM public.guide_contacts WHERE guide_id = (SELECT id FROM public.guides WHERE slug = 'free-forestry-advice');
INSERT INTO public.guide_contacts (guide_id, name, role, phone, email, display_order)
VALUES
((SELECT id FROM public.guides WHERE slug = 'free-forestry-advice'), 'Mike Dittenber', 'District Forester', '(989) 539-6401', NULL, 0);

-- Guide contacts for: native-plants
DELETE FROM public.guide_contacts WHERE guide_id = (SELECT id FROM public.guides WHERE slug = 'native-plants');
INSERT INTO public.guide_contacts (guide_id, name, role, phone, email, display_order)
VALUES
((SELECT id FROM public.guides WHERE slug = 'native-plants'), 'Christiane Rathke', 'District Administrator', '(989) 539-6401', NULL, 0),
((SELECT id FROM public.guides WHERE slug = 'native-plants'), 'Mike Dittenber', 'District Forester', '(989) 539-6401', NULL, 1);

-- Guide contacts for: pay-property-taxes
DELETE FROM public.guide_contacts WHERE guide_id = (SELECT id FROM public.guides WHERE slug = 'pay-property-taxes');
INSERT INTO public.guide_contacts (guide_id, name, role, phone, email, display_order)
VALUES
((SELECT id FROM public.guides WHERE slug = 'pay-property-taxes'), 'Maggie Carey', 'Township Treasurer', '(989) 588-9841 ext. 3', NULL, 0),
((SELECT id FROM public.guides WHERE slug = 'pay-property-taxes'), 'Jenny Beemer-Fritzinger', 'Clare County Treasurer', '(989) 539-7801', NULL, 1);

-- Guide contacts for: principal-residence-exemption
DELETE FROM public.guide_contacts WHERE guide_id = (SELECT id FROM public.guides WHERE slug = 'principal-residence-exemption');
INSERT INTO public.guide_contacts (guide_id, name, role, phone, email, display_order)
VALUES
((SELECT id FROM public.guides WHERE slug = 'principal-residence-exemption'), 'Casey Guthrie', 'Township Assessor', '(231) 350-9123', NULL, 0);

-- Guide forms for: principal-residence-exemption
DELETE FROM public.guide_forms WHERE guide_id = (SELECT id FROM public.guides WHERE slug = 'principal-residence-exemption');
INSERT INTO public.guide_forms (guide_id, name, url, format, display_order)
VALUES
((SELECT id FROM public.guides WHERE slug = 'principal-residence-exemption'), 'Principal Residence Exemption Affidavit (Form 2368)', '/forms/principal-residence-exemption-affidavit.pdf', 'PDF', 0),
((SELECT id FROM public.guides WHERE slug = 'principal-residence-exemption'), 'Rescind Principal Residence Exemption (Form 2602)', '/forms/rescind-principal-residence-exemption.pdf', 'PDF', 1);

-- Guide contacts for: property-split
DELETE FROM public.guide_contacts WHERE guide_id = (SELECT id FROM public.guides WHERE slug = 'property-split');
INSERT INTO public.guide_contacts (guide_id, name, role, phone, email, display_order)
VALUES
((SELECT id FROM public.guides WHERE slug = 'property-split'), 'Dick Hassberger', 'Zoning Administrator', '(989) 588-9841 ext. 5', NULL, 0),
((SELECT id FROM public.guides WHERE slug = 'property-split'), 'Grant Township Planning Commission', 'Planning Commission', '(989) 588-9841', NULL, 1);

-- Guide forms for: property-split
DELETE FROM public.guide_forms WHERE guide_id = (SELECT id FROM public.guides WHERE slug = 'property-split');
INSERT INTO public.guide_forms (guide_id, name, url, format, display_order)
VALUES
((SELECT id FROM public.guides WHERE slug = 'property-split'), 'Land Division Application', '/forms/land-division-application.pdf', 'PDF', 0);

-- Guide contacts for: qualified-forest-program
DELETE FROM public.guide_contacts WHERE guide_id = (SELECT id FROM public.guides WHERE slug = 'qualified-forest-program');
INSERT INTO public.guide_contacts (guide_id, name, role, phone, email, display_order)
VALUES
((SELECT id FROM public.guides WHERE slug = 'qualified-forest-program'), 'Mike Dittenber', 'District Forester, Michigan DNR', '(989) 539-6401', NULL, 0);

-- Guide contacts for: register-to-vote
DELETE FROM public.guide_contacts WHERE guide_id = (SELECT id FROM public.guides WHERE slug = 'register-to-vote');
INSERT INTO public.guide_contacts (guide_id, name, role, phone, email, display_order)
VALUES
((SELECT id FROM public.guides WHERE slug = 'register-to-vote'), 'Carol Majewski', 'Township Clerk', '(989) 588-9841 ext. 2', NULL, 0),
((SELECT id FROM public.guides WHERE slug = 'register-to-vote'), 'Lori Mott', 'County Clerk', '(989) 539-7131', NULL, 1);

-- Guide forms for: register-to-vote
DELETE FROM public.guide_forms WHERE guide_id = (SELECT id FROM public.guides WHERE slug = 'register-to-vote');
INSERT INTO public.guide_forms (guide_id, name, url, format, display_order)
VALUES
((SELECT id FROM public.guides WHERE slug = 'register-to-vote'), 'Absentee Ballot Application', '/forms/absentee-ballot-application.pdf', 'PDF', 0);

-- Guide contacts for: report-non-emergency
DELETE FROM public.guide_contacts WHERE guide_id = (SELECT id FROM public.guides WHERE slug = 'report-non-emergency');
INSERT INTO public.guide_contacts (guide_id, name, role, phone, email, display_order)
VALUES
((SELECT id FROM public.guides WHERE slug = 'report-non-emergency'), 'Sheriff John Wilson', 'Clare County Sheriff', '(989) 539-7166', NULL, 0),
((SELECT id FROM public.guides WHERE slug = 'report-non-emergency'), 'Central Dispatch', 'Non-Emergency Line (24/7)', '(989) 539-1336', NULL, 1),
((SELECT id FROM public.guides WHERE slug = 'report-non-emergency'), 'Bob Dodson', 'Animal Control Officer', '(989) 539-3221', NULL, 2);

-- Guide contacts for: rv-on-vacant-lot
DELETE FROM public.guide_contacts WHERE guide_id = (SELECT id FROM public.guides WHERE slug = 'rv-on-vacant-lot');
INSERT INTO public.guide_contacts (guide_id, name, role, phone, email, display_order)
VALUES
((SELECT id FROM public.guides WHERE slug = 'rv-on-vacant-lot'), 'Dick Hassberger', 'Zoning Administrator', '(989) 588-9841 ext. 5', NULL, 0);

-- Guide forms for: rv-on-vacant-lot
DELETE FROM public.guide_forms WHERE guide_id = (SELECT id FROM public.guides WHERE slug = 'rv-on-vacant-lot');
INSERT INTO public.guide_forms (guide_id, name, url, format, display_order)
VALUES
((SELECT id FROM public.guides WHERE slug = 'rv-on-vacant-lot'), 'Zoning Permit for RVs/Temporary Storage', '/forms/zoning-permit-rv-storage.pdf', 'PDF', 0);

-- Guide contacts for: soil-erosion-permit
DELETE FROM public.guide_contacts WHERE guide_id = (SELECT id FROM public.guides WHERE slug = 'soil-erosion-permit');
INSERT INTO public.guide_contacts (guide_id, name, role, phone, email, display_order)
VALUES
((SELECT id FROM public.guides WHERE slug = 'soil-erosion-permit'), 'Christiane Rathke', 'District Administrator & Soil Erosion Agent', '(989) 539-6401', NULL, 0);

-- Guide contacts for: spongy-moth
DELETE FROM public.guide_contacts WHERE guide_id = (SELECT id FROM public.guides WHERE slug = 'spongy-moth');
INSERT INTO public.guide_contacts (guide_id, name, role, phone, email, display_order)
VALUES
((SELECT id FROM public.guides WHERE slug = 'spongy-moth'), 'Toni Maize', 'Spongy Moth Coordinator', '(989) 539-6401', NULL, 0);

-- Guide contacts for: veterans-services
DELETE FROM public.guide_contacts WHERE guide_id = (SELECT id FROM public.guides WHERE slug = 'veterans-services');
INSERT INTO public.guide_contacts (guide_id, name, role, phone, email, display_order)
VALUES
((SELECT id FROM public.guides WHERE slug = 'veterans-services'), 'Karl Hauser', 'Veterans Services Director', '(989) 539-3273', NULL, 0),
((SELECT id FROM public.guides WHERE slug = 'veterans-services'), 'Allisha Gary', 'Veterans Service Officer', '(989) 539-3273', NULL, 1);

-- Guide contacts for: zoning-variance
DELETE FROM public.guide_contacts WHERE guide_id = (SELECT id FROM public.guides WHERE slug = 'zoning-variance');
INSERT INTO public.guide_contacts (guide_id, name, role, phone, email, display_order)
VALUES
((SELECT id FROM public.guides WHERE slug = 'zoning-variance'), 'Tamara McCaslin', 'ZBA Chair', '(989) 588-9841', NULL, 0),
((SELECT id FROM public.guides WHERE slug = 'zoning-variance'), 'Dick Hassberger', 'Zoning Administrator', '(989) 588-9841 ext. 5', NULL, 1);

-- Guide forms for: zoning-variance
DELETE FROM public.guide_forms WHERE guide_id = (SELECT id FROM public.guides WHERE slug = 'zoning-variance');
INSERT INTO public.guide_forms (guide_id, name, url, format, display_order)
VALUES
((SELECT id FROM public.guides WHERE slug = 'zoning-variance'), 'ZBA Application for Variance', '/forms/zba-variance-application.pdf', 'PDF', 0);


-- =============================================================================
-- Pages (71)
-- =============================================================================

INSERT INTO public.pages (slug, title, description, body, category, subcategory, nav_title, hide_from_nav, display_order, status, last_updated, created_at, published_at)
VALUES
('about-the-horn', 'The Horn', 'The Horn — a non-profit membership club and community center in Lake George, Michigan', '## Community Club & Center

The Horn is a nonprofit community space designed to bring people together. Housed in the historic former Lake George Grocery building, The Horn is a place to connect, host gatherings, attend events, and simply spend time in good company — a space rooted in belonging.

Open to the public daily from **10 AM – 2 PM**, and available to members **24/7**.

### Our Story

The building was purchased in 2021 and underwent extensive renovation to transform it from the old Lake George Grocery into a welcoming community space. The Horn soft launched in 2022 with a simple goal: give people a place where they belong.

The renovation preserved the character of this historic village building while creating a flexible space for socializing, events, and community connection.

### What We Offer

- **Members-Only Club** — 24/7 access to a private community space with games, Wi-Fi, kitchen, and more
- **VIP Lounge** — An adults-only space for members who want to BYOB and smoke indoors
- **Community Gathering Space** — A welcoming place to connect with neighbors and friends during public hours
- **Events & Entertainment** — Game nights, bonfire nights, potlucks, and community programming year-round with discounted member rates
- **Late-Night Safe Space** — A comfortable place to hang out when everywhere else is closed
- **Work-Friendly Environment** — Free Wi-Fi and a quiet daytime setup for remote work and projects

### Become a Member

The Horn offers individual, couple, and family memberships starting at **$40/month**, with an optional VIP add-on for **$20/month** more. Members get 24/7 key access, discounted event rates, exclusive events, and a real community.

Memberships launch **Memorial Weekend** — sign up early at **[horn.love](https://horn.love)**.

**[See Membership Details & Pricing](/membership)**

### Events

Check our [events page](/events-horn) for what''s coming up at The Horn.

### Hours & Contact

Open to the public **10 AM – 2 PM daily**. Members have 24/7 access.

For location and contact details, visit our [hours & contact page](/hours-horn).

### Part of the Community

The Horn is part of the Unicorn Gives community network, working alongside:
- [Unicorn Gives](/about-unicorn-gives)
- [The Mane](/about-the-mane)', 'Community', 'The Horn', NULL, false, 24, 'published', '2026-03-25T00:00:00.000Z'::timestamptz, now(), now()),
('about-the-mane', 'The Mane', 'The Mane boutique salon in Lincoln Township — hair, beauty, and self-care services', '## The Mane — Boutique Salon

The Mane is a full-service salon located at 300 Lake George St in the village of Lake George, Michigan. We offer hair, color, nail, and beauty services in a welcoming, community-focused environment.

### Our Story

Originally established in 2005 as Expressions Hair Studio, the salon was rebranded in 2021 under new ownership by Hanna Unicorn. The Mane carries forward a long tradition of quality hair care in Lake George while bringing a fresh commitment to organic, high-quality products and community connection.

### What Sets Us Apart

We use trusted, professional-grade brands including **All-Nutrient**, **Sukesha**, and **I.N.O.** — products chosen for their quality ingredients and results. Our stylists and technicians take the time to understand what each client needs, whether that is a quick trim or a complete color transformation.

### Services

We offer a full range of hair services — cuts, color, highlights, perms, styling, and waxing — along with a complete nail services menu including acrylics, gel, manicures, and pedicures. Visit our [services page](/services-mane) for the full menu and pricing.

### Now Hiring

The Mane is currently hiring licensed stylists and barbers. If you are passionate about your craft and want to be part of a community-focused salon, reach out to learn about opportunities.

### Book an Appointment

Ready to book? Visit our [appointment page](/book-appointment) to schedule your visit online or by phone.

### Hours & Contact

For hours, location, and contact details, visit our [hours & contact page](/hours-mane).

### Part of the Community

The Mane is part of the Unicorn Gives community network in Lake George, working alongside:
- [Unicorn Gives](/about-unicorn-gives)
- [The Horn](/about-the-horn)', 'Community', 'The Mane', NULL, false, 28, 'published', '2026-03-25T00:00:00.000Z'::timestamptz, now(), now()),
('about-unicorn-gives', 'About Unicorn Gives', 'Learn about Unicorn Gives, a non-profit organization serving the Lincoln Township community', '## Our Mission

Unicorn Gives is a non-profit organization dedicated to strengthening the Lincoln Township community through events, outreach, and bringing people together.

### What We Do

We organize community events, support local initiatives, and work to keep residents connected and informed about what''s happening in our township.

### Our Values

- **Community First** — Everything we do serves our neighbors
- **Transparency** — Open communication and accountability
- **Inclusion** — Welcoming all members of our community
- **Action** — Turning ideas into impact

### Get Involved

There are many ways to be part of what we''re building:

- [Volunteer with us](/volunteer)
- [Support our mission](/donate)
- [Attend our events](/events)
- [Visit The Horn](/about-the-horn) — our community center

### Contact

Reach out to learn more about Unicorn Gives and how you can get involved.

*Contact information coming soon.*', 'Community', 'Unicorn Gives', NULL, false, 20, 'published', '2026-03-25T00:00:00.000Z'::timestamptz, now(), now()),
('amish-community', 'Clare County Amish Community', 'A Swiss-descended Amish community with unique traditions', '## A Living Heritage

Clare County is home to a Swiss-descended Amish community whose presence adds a distinctive thread to the cultural fabric of the region. Centered around the Leaton Road area north of Clare, this settlement has maintained its traditions of faith, craftsmanship, and agrarian life for generations. The community is modest in size but rich in the skills and customs that its members carry forward from one generation to the next.

## Yoder''s Market & Auctions

The most visible gathering point for visitors and locals alike is Yoder''s, located at 10885 N Leaton Rd, Clare. Yoder''s hosts a popular Quilt Auction & Flea Market along with a Horse Auction, held on Fridays and Saturdays during the seasonal months. The quilt auctions attract buyers from well beyond the county, as the handcrafted quilts produced by community members are known for their meticulous stitching, vivid patterns, and durability. The flea market offers a mix of produce, baked goods, handmade furniture, tools, and household items.

**Contact:** (989) 386-2872

## What to Expect

Visitors to the Amish community can find a variety of handcrafted goods, including quilts, wooden furniture, fresh-baked pies and breads, jams, and seasonal produce. Many items are sold directly from home-based shops along rural roads, often marked by simple hand-lettered signs.

**Please note:** Most Amish businesses close on Thursdays, which is traditionally observed as a day of rest and community activity. Plan your visit accordingly to avoid arriving on a day when shops and markets are shuttered.

## Visiting with Respect

The Amish way of life values simplicity, humility, and privacy. Visitors are welcome, but a few courtesies go a long way. Please ask before taking photographs of individuals, homes, or property. Avoid using drones or recording devices near residences. Keep vehicle speeds low on the rural roads where horse-drawn buggies share the pavement, especially at dawn and dusk when visibility is limited. A respectful visit benefits everyone and helps ensure that the community remains open and welcoming to future guests.', 'History', 'Cultural Heritage', NULL, false, 22, 'published', '2026-03-26T00:00:00.000Z'::timestamptz, now(), now()),
('arts-entertainment', 'Arts & Entertainment', 'Theaters, galleries, outdoor fun, and live music', 'Clare County offers a variety of arts, entertainment, and family-friendly attractions that keep visitors and residents entertained year-round.

## Movie Theater

The Ideal Theatre (607 N McEwan St, Clare, 989-386-9968) is a classic small-town cinema in the heart of downtown Clare, showing current releases at affordable prices. It has been a fixture of the McEwan Street scene for decades.

## Family Fun

Snowbird Lanes (3185 N Clare Ave, Harrison, 989-539-7242) offers bowling for all ages in a casual, family-friendly setting. 4X Adventureland (501 Fairlane St, Harrison, 989-539-3604) features mini golf, an arcade, and go-karts, making it a popular stop for families visiting the Harrison area during the summer.

## Gaming & Casino

Soaring Eagle Casino and Resort, operated by the Saginaw Chippewa Indian Tribe, is located just south of Clare County and offers gaming, live entertainment, dining, and hotel accommodations.

## Public Art

The Clare Art Alley and the Destination Clare Art Sculpture Walk bring visual art into the public spaces of downtown Clare. Rotating sculptures and murals add color and interest to a stroll through the business district.

## Live Music

The Summer Concert Series at Shamrock Park in Clare runs on Thursdays from June through July, 6 to 8 PM. The free outdoor concerts feature a variety of musical acts and draw families and neighbors to the park each week. Bring a lawn chair or blanket and enjoy an evening of live music under the trees.', 'Directory', NULL, NULL, false, 55, 'published', '2026-03-26T00:00:00.000Z'::timestamptz, now(), now()),
('assessor', 'Assessor', 'Lincoln Township property assessment information and contact details', '## Township Assessor

The Assessor establishes the taxable value of all property in Lincoln Township.

### Contact Information

**Casey Guthrie, Township Assessor**
- Phone: (231) 350-9123

**Lincoln Township Office**
- Phone: (989) 588-9841
- For assessment questions and information

**Online Property Assessment Data**
- [lincolntwp.is.bsasoftware.com](http://lincolntwp.is.bsasoftware.com/)
- View property assessment records and tax information

### Key Services

**Property Assessments**
- Annual property value assessments
- Property tax valuations
- Property classification

**Assessment Information**
- Property characteristics and details
- Assessment history
- Taxable value calculations

**Exemptions & Appeals**
- Homestead exemptions
- Principal residence exemptions
- Assessment appeals (March Board of Review)
- Poverty exemptions

### Important Dates

**March Board of Review**
- Assessment appeals and adjustments
- Specific dates announced annually
- Contact township office for schedule

**Assessment Notice Mailing**
- Assessment notices mailed in March
- Review your assessment notice carefully
- Contact assessor with questions

### Property Tax Information

**Tax Payments**
- Summer taxes due: September 14
- Winter taxes due: February 14
- Contact: Township Treasurer at 989-588-2574

[View property tax FAQs →](/faq#treasurer)

### Clare County Equalization Department

The County Equalization Department works with township assessors to ensure fair and uniform property assessments across the county.

**Clare County Equalization**
- Phone: 989-539-7111
- Address: 225 West Main, Harrison, MI 48625
- Website: [clareco.net](https://clareco.net/)

**Services**
- Equalization studies
- Assessment review and oversight
- Property transfer review
- County-wide assessment coordination

### Assessment Appeals Process

**Step 1: Review Your Assessment Notice**
Your assessment notice is mailed in March. Review it carefully when received.

**Step 2: Contact the Assessor**
If you believe your assessment is incorrect, contact the assessor, Casey Guthrie, at (231) 350-9123 or the township office at (989) 588-9841.

**Step 3: March Board of Review**
If you cannot resolve the issue with the assessor, you may appeal to the March Board of Review:
- File written appeal
- Attend Board of Review meeting
- Present evidence for your case

**Step 4: Michigan Tax Tribunal**
If you disagree with the Board of Review decision, you may appeal to the Michigan Tax Tribunal.

### Frequently Asked Questions

[Get answers to frequently asked questions about assessments and property taxes →](/faq#assess)

### Related Resources

- [Property Tax Information](/faq#treasurer)
- [Board of Review Information](/faq#assess)
- [Township Board Contact](/board)
- [Frequently Asked Questions](/faq)
- [Clare County Website](https://clareco.net/)
- [Community Resources](/links)', 'Services', 'Other Services', NULL, false, 10, 'published', '2025-01-19T00:00:00.000Z'::timestamptz, now(), now()),
('atv-orv-trails', 'ATV & ORV Trails', '55+ miles of off-road trails through state forest land', 'Clare County is a popular destination for off-road riding, with extensive trail systems winding through state forest land in the northern half of the county.

The Leota ORV Trailhead serves as the main access point for over 55 miles of designated trails open to larger ORVs, along with hundreds of additional miles of routes available for ATVs and quads. The trails pass through a mix of pine forests, hardwoods, and sandy terrain typical of northern Lower Michigan.

The Fur Farm Snowmobile Trail runs north of Harrison through state forest and is groomed during the winter season for snowmobile use.

For trail information, permits, and conditions, contact the DNR Harrison Field Office at (989) 539-6411. Downloadable maps are available for the following trail systems:

- Forest Roads
- Leota Trail
- Denton Creek West
- Snowmobile Trail systems

Riders should check current trail conditions and carry a valid ORV permit before heading out. Some trails have seasonal closures during spring thaw to prevent damage.', 'Recreation', NULL, NULL, false, 41, 'published', '2026-03-26T00:00:00.000Z'::timestamptz, now(), now()),
('board-minutes', 'Board Meeting Minutes', 'Lincoln Township Board of Trustees meeting minutes and archives', 'Regular board meetings are held on the second Monday of each month at 7:00 PM at Lincoln Township Hall, 175 Lake George Ave, Lake George, MI 48633. Special meetings are posted no less than 18 hours in advance on the front door of the township hall.

**Accessibility:** Individuals with disabilities requiring auxiliary aids or services should contact Carol Majewski, Clerk at [989-588-9841 ext. 2](tel:989-588-9841) or [clm@lincolntwp.com](mailto:clm@lincolntwp.com). PO Box 239, Lake George, MI 48633. Please provide as much notice as possible so proper arrangements can be made.

*The most recent minutes are pending approval at the next board meeting.*

---

## Complete Minutes Archive

Our full archive of **139 meeting minutes** from 2014 through 2026 is available with search, filter, and sort at the [Meeting Minutes Archive](/minutes).

The archive includes Board of Trustees, Planning Commission, and ZBA minutes with attendance records and keyword search.

**[Browse the Full Archive &rarr;](/minutes)**

---

## Planning Commission Meeting Minutes

Planning Commission meeting minutes will be posted as they become available. The Planning Commission meets on the first Tuesday after the second Monday of each month at 7:00 PM at Lincoln Township Hall.

For historical Planning Commission minutes (2008–2015), see the [Planning Commission page](/planning-commission).', 'Government', 'Board & Leadership', NULL, false, 9, 'published', '2026-03-25T00:00:00.000Z'::timestamptz, now(), now()),
('boating-canoeing', 'Boating & Canoeing', '18 lakes with public launches and 330 miles of paddling rivers', 'Clare County is home to 18 lakes with public boat launches, making it easy to get out on the water whether you prefer powerboating, pontoon cruising, or paddling. Lakes with public access include Arnold, Budd, Cranberry, Crooked, Eight Point, Five Lakes, Lake George, Lily, Shamrock, Windover, and several others spread across the county.

Over 330 miles of rivers and streams flow through Clare County, providing outstanding opportunities for canoeing and kayaking. The Muskegon River is the most popular paddling waterway, offering a gentle current through wooded corridors and scenic stretches. The Tobacco River and Cedar River provide additional options for river paddlers looking for quieter water and a more secluded experience.

## Canoe & Kayak Rentals

Duggan''s Canoe Livery offers canoe and kayak rentals on the Muskegon River with trips of varying lengths to suit beginners and experienced paddlers alike.

- **Address:** 3240 N Temple Dr, Harrison
- **Phone:** (989) 539-7149

Whether you are launching a boat on Budd Lake for a day of fishing or paddling a canoe down the Muskegon, Clare County''s waterways are among its greatest natural assets.', 'Recreation', NULL, NULL, false, 42, 'published', '2026-03-26T00:00:00.000Z'::timestamptz, now(), now()),
('book-appointment', 'Book an Appointment', 'Schedule an appointment at The Mane boutique salon in Lincoln Township', '## Book an Appointment

Schedule your visit to The Mane in Lake George, MI.

### Online Booking

Book your appointment online through **Square Appointments** at any time. Select your stylist or technician, choose your service, and pick a time that works for you.

### Call to Book

Prefer to book by phone? Call us at **(989) 588-6988** during business hours and we will get you on the schedule.

### Email

You can also reach us at **hanna@unicorn.love** with questions or booking requests.

### Walk-Ins

Walk-ins are welcome based on availability. For the best chance of getting in same-day, we recommend calling ahead.

### Before Your Visit

- View our [service menu](/services-mane) to plan your visit
- Check our [hours & contact page](/hours-mane) for availability

### Cancellation Policy

We ask that you provide **24 hours notice** if you need to cancel or reschedule your appointment. This allows us to offer the time slot to other clients. Thank you for being considerate of our team''s time.', 'Community', 'The Mane', NULL, false, 30, 'published', '2026-03-25T00:00:00.000Z'::timestamptz, now(), now()),
('budget', 'Budget & Finances', 'Lincoln Township annual budget, spending reports, and financial information', '## Township Financial Overview

Lincoln Township is committed to financial transparency and accountability to its residents.

### Annual Budget

The township budget is approved annually by the Board of Trustees. Budget documents and summaries will be posted here as they become available.

*Budget documents coming soon.*

### Revenue Sources

- Property tax millage
- State revenue sharing
- Fees and permits
- Special assessments

### How Funds Are Used

- Road maintenance and improvements
- Fire department operations
- Parks and cemetery maintenance
- Township administration
- Building and zoning services

### Request Financial Information

Residents may request detailed financial records through a [FOIA request](/foia).

For questions about the township budget, contact:
- **Treasurer**: Maggie Carey — [989-588-2574](tel:989-588-2574)
- **Supervisor**: Troy Kibbey — [(989) 588-9841 ext. 4](tel:989-588-9841)', 'Government', 'Budget & Finances', NULL, false, 5, 'published', '2026-03-25T00:00:00.000Z'::timestamptz, now(), now()),
('calendar', 'Lincoln Township Events Calendar', 'Board meetings, events, and important dates for Lincoln Township', '## Events Calendar

### Regular Meeting Schedule

**Board of Trustees**
- Regular meetings held throughout the year
- Location: Lincoln Township Hall
- [View meeting minutes →](/board-minutes)

**Planning Commission**
- Meeting schedule varies
- [More information →](/planning-commission)

**Zoning Board of Appeals**
- Meets as needed
- [More information →](/zba)

### Important Dates

**Tax Deadlines**
- Summer taxes due: September 14
- Winter taxes due: February 14

**Elections**
- [View election information and dates →](/elections)

### Special Meetings

Special meetings are posted at Township Hall at least 18 hours in advance as required by Michigan''s Open Meetings Act.

### Contact

For current meeting schedules and dates, contact the Township Clerk:
- **Carol Majewski**
- Phone: 989-588-9069
- Email: clm@lincolntwp.com', 'Government', 'Meetings & Calendar', NULL, false, 205, 'published', '2025-01-19T00:00:00.000Z'::timestamptz, now(), now()),
('camping-campgrounds', 'Camping & Campgrounds', 'State parks, recreation areas, and family campgrounds', 'Clare County has campgrounds to suit every style, from full-service state park facilities on the lakeshore to quiet family campgrounds tucked into the countryside.

Wilson State Park sits on the western shore of Budd Lake in Harrison and is one of the most popular campgrounds in the region. The park offers modern campsites with electric hookups, a swimming beach, boat launch, picnic areas, and direct access to the Pere Marquette Rail Trail. Reservations are recommended during summer months.

Herrick Recreation Area, located east of Clare, provides a more rustic camping experience along with hiking trails, fishing access, and a peaceful wooded setting away from town.

| Campground | Address | Phone |
|------------|---------|-------|
| Wilson State Park | 910 First St, Harrison | (989) 539-3021 |
| Herrick Recreation Area | 6320 E Herrick Rd, Clare | (989) 386-2010 |
| Hidden Hill Family Campground | 300 N Clare Ave, Harrison | (989) 539-9372 |
| Countryside Campground | 805 Byfield, Harrison | (989) 539-5468 |
| Pettit Park | N McEwan St, Clare | (989) 386-7541 |', 'Recreation', NULL, NULL, false, 44, 'published', '2026-03-26T00:00:00.000Z'::timestamptz, now(), now()),
('cemeteries', 'Lincoln Township Cemeteries', 'Information about Lincoln Township Cemetery and Kilbourn Cemetery including plots, fees, and burial services', 'Lincoln Township has ownership and control of two separate cemeteries: the Township Cemetery and the [Kilbourn Cemetery](#kilbourn-cemetery).

[Lincoln Township Cemeteries Ordinance](/ordinances/42.pdf)

---

### Lincoln Township Cemetery

The Lincoln Township Cemetery is located on Lake Street and contains over 1,300 spaces. This is NOT a Perpetual Care cemetery, but every effort is made to keep the premises in good and peaceful order.

#### Cemetery Records

- [List by Blocks — Numerically](/docs/cemetery/linctwp_cemetery_blocks.pdf)
- [List by Deed — Alphabetically](/docs/cemetery/linctwp_cemetery_deed_alphabetical.pdf)
- [List by Interred Surname — Alphabetically](/docs/cemetery/linctwp_cemetery_interred_alphabetical.pdf)

*The Cemetery Files were last updated 6/9/2021.*

#### Plot Costs & Burial Fees

**Plot Cost:** $100.00 each

|  | Foundation in place | 12" x 24" Foundation | Larger Foundations |
| --- | --- | --- | --- |
| **Open & close burial — Summer** | $315.00 | $400.00 | $440.00 |
| **Open & close burial — Winter** | $503.00 | $600.00 | $625.00 |
| **Cremation / Infant burial** | $95.00 | $200.00 | $220.00 |

Saturday, Sunday, and Holidays: $75.00 additional cost.

---

### Kilbourn Cemetery

The smaller of the two, Kilbourn Cemetery was a private cemetery abandoned by the Reorganized Church of Jesus Christ of Latter-day Saints. Ownership was assumed by Lincoln Township and the cemetery is maintained out of respect for those who are interred there.

**Location:** Jackson Ave. between Browns and Adams Rd. (west side, closer to Adams than Browns). It''s easy to miss — look for the two small headstones. Be careful, the area usually has quite a bit of poison ivy. Wear long pants!

*Leave a penny on the Kilbourn headstone — it''s a long-standing tradition.*

---

### Contact Information

- **Mike Tobin**, Cemetery Commissioner — Office: (989) 588-9841, Home: (989) 588-2311
- **Jeffrey Smith**, Sexton — (989) 588-9294
- **Carol Majewski**, Township Clerk — (989) 588-9069, Email: [clm@lincolntwp.com](mailto:clm@lincolntwp.com)

Need to do some cemetery name or grave searches? Visit [FindAGrave.com](http://www.findagrave.com/).', 'Community', 'Facilities', NULL, false, 12, 'published', '2025-01-19T00:00:00.000Z'::timestamptz, now(), now()),
('clare-community', 'City of Clare', 'Gateway to the North — festivals, downtown dining, and rail trails', '## Gateway to the North

Clare sits at the crossroads of US-10 and US-127, earning its long-held title as the Gateway to the North. For generations, travelers heading up through Michigan''s mitten have paused here to stretch their legs, grab a bite, and soak in the character of a small city that punches well above its weight. With a population of roughly 3,200, Clare balances the friendliness of a tight-knit community with an energy that draws visitors year-round.

## Downtown Clare

The heart of the city runs along McEwan Street, where a walkable downtown district mixes independent shops, restaurants, and genuine curiosities. Chief among them is Cops & Doughnuts, a bakery that gained national fame after a group of local police officers banded together to save the century-old Clare City Bakery from closing. The shop has since been featured on network television and attracts fans from across the country. A few doors down, Four Leaf Brewing offers craft beer in a relaxed taproom setting, while other storefronts along the block showcase antiques, gifts, and local art.

Anchoring the downtown skyline is the Doherty Hotel, a landmark built in 1924 that once hosted governors, gangsters, and traveling salesmen alike. The hotel remains a working property and a tangible link to the era when Clare was booming with lumber money and rail traffic.

## Pere Marquette Rail Trail

One of Clare''s greatest assets stretches well beyond city limits. The Pere Marquette Rail Trail follows a former railroad corridor for roughly 30 paved miles between Clare and Midland, passing through farmland, forests, and small communities along the way. The trail is open to cyclists, walkers, joggers, and inline skaters, making it one of the most popular multi-use paths in central Michigan. Trailheads in Clare provide convenient parking and access.

## Annual Events

Clare keeps a full calendar of community celebrations. The Irish Festival honors the county''s namesake roots with music, dancing, and plenty of green. Summerfest fills the downtown streets with vendors, live entertainment, and family activities. Throughout the warmer months, the Summer Concert Series at Shamrock Park brings free live music to the community on weekend evenings. These events, along with seasonal parades and holiday gatherings, reinforce the strong civic pride that defines life in Clare.', 'Community', 'Community Profiles', NULL, false, 10, 'published', '2026-03-26T00:00:00.000Z'::timestamptz, now(), now()),
('clare-county-history', 'Clare County History', 'From Kaykakee to Clare — two centuries of Michigan history', '## From Kaykakee to Clare

Clare County''s recorded history stretches back to 1840, when the Michigan legislature organized the territory and named it Kaykakee, honoring a Sauk chief whose people had long inhabited the region. The name lasted only three years. In 1843, an Irish surveyor working in the area successfully petitioned to rename the county after County Clare in Ireland, planting a cultural seed that still blooms in the community''s Irish festivals and green-themed celebrations today.

## The Logging Era

The story of Clare County in the latter half of the 1800s is inseparable from the story of Michigan timber. Vast stands of white pine blanketed the region, and as demand for lumber surged across a rapidly industrializing nation, logging camps sprang up throughout the county. Railroads pushed into the forest to haul out the cut, and boomtowns appeared almost overnight along the tracks. Sawmills ran day and night, and the population swelled with lumberjacks, teamsters, cooks, and the merchants who served them. By the early 1900s, however, the great pines had been largely exhausted, and the county faced the difficult transition that followed the end of every timber boom.

## Prohibition and the Purple Gang

Clare County''s history took a darker turn during the Prohibition era, when the remote forests and quiet backroads made the region attractive to organized crime. The Purple Gang, a notorious Detroit-based criminal organization, maintained connections in the area. In 1938, Isaiah Leebove, an attorney linked to the gang, was murdered in a case that drew statewide attention and underscored the reach of Prohibition-connected violence into rural Michigan. The episode remains one of the more dramatic chapters in the county''s past.

## WPA Legacy

The Great Depression hit Clare County hard, but it also left behind an enduring artistic legacy. During the 1930s, the Works Progress Administration funded a series of murals that were installed in public buildings across the county. Today, WPA-era murals can still be found at Clare Middle School, the US Post Office in Clare, and the Doherty Hotel. These works depict scenes of local life, industry, and landscape, and they stand as both historical artifacts and genuine works of art.

## From Lumber to Land

As the timber industry faded, Clare County reinvented itself. Farmland replaced cutover forest, and agriculture became a mainstay of the local economy. The county''s abundant lakes and rivers, once used to float logs downstream, gradually attracted a new kind of visitor — vacationers, anglers, hunters, and families looking for a quiet retreat in the north woods. Tourism and recreation grew steadily through the twentieth century and remain vital to the county''s identity and livelihood today.', 'History', 'County History', NULL, false, 20, 'published', '2026-03-26T00:00:00.000Z'::timestamptz, now(), now()),
('compost', 'Lincoln Township Compost Yard', 'Lincoln Township compost facility hours, location, and accepted materials', '## Lincoln Township Compost Field

**Open** Wednesday, Friday, and Sunday, 9:00 AM to Noon, April 1st through November 30th (unless there is snow, then it could close for the season earlier).

Contact Troy Kibbey at (989) 588-9841 ext. 4 or Mike Tobin at 989-588-2311 if needed outside regular hours.

The compost field is located on Arthur Road just east of, and across the road from the Church.

### Accepted Materials

- Leaves and grass clippings — either in brown paper leaf bags or loose. **NO PLASTIC BAGS!**
- Brush in the pit — no logs or limbs bigger than 2 inches diameter

### Not Accepted

- No household refuse, tires, appliances, car parts, planters, etc.

Free compost when available.

Thank you all in advance for your cooperation.', 'Services', 'Other Services', NULL, false, 13, 'published', '2025-01-19T00:00:00.000Z'::timestamptz, now(), now()),
('county-courts', 'Clare County Courts', 'District, circuit, and probate court information', '## Court System Overview

Clare County''s judicial system comprises three courts, all located at the county government complex at **225 W Main St, Harrison, MI 48625**. Together, these courts handle criminal cases, civil disputes, family matters, probate proceedings, and small claims for residents of Clare County and, in some cases, neighboring Gladwin County.

---

## 80th District Court

- **Judge:** Hon. Joshua M. Farrell
- **Phone:** (989) 539-7173

The 80th District Court handles misdemeanor criminal cases, civil cases involving claims up to $25,000, landlord-tenant disputes, traffic violations, and small claims. The court also conducts arraignments and preliminary examinations for felony cases before they are bound over to Circuit Court.

---

## 55th Circuit Court

- **Judges:** Hon. Tara S. Hovey and Hon. Michelle J. Ambrozaitis
- **Phone:** (989) 539-7131
- **Jurisdiction:** Serves both Clare and Gladwin counties

The 55th Circuit Court is the trial court of general jurisdiction, handling felony criminal cases, civil cases with claims exceeding $25,000, domestic relations matters including divorce and custody, and appeals from District Court. The court serves both Clare County and Gladwin County.

---

## Probate & Family Court

- **Judge:** Hon. Marcy A. Klaus
- **Phone:** (989) 539-7109
- **Jurisdiction:** Serves both Clare and Gladwin counties

The Probate and Family Court oversees estate administration, guardianships, conservatorships, mental health commitments, juvenile matters, and adoptions. As with the Circuit Court, this court serves residents of both Clare and Gladwin counties.

---

## Contact & Directions

All three courts are located at:

**225 W Main St, Harrison, MI 48625**

Court hours generally follow the county office schedule of Monday through Friday, 8:00 AM to 4:30 PM. For specific hearing schedules, filing requirements, or other questions, contact the appropriate court directly using the phone numbers listed above.', 'Government', 'Courts', NULL, false, 31, 'published', '2026-03-26T00:00:00.000Z'::timestamptz, now(), now()),
('county-departments', 'Clare County Departments', 'Directory of county government departments, offices, and services', '## County Government Directory

Clare County government operates from its main offices at **225 W Main St, Harrison, MI 48625**. General office hours are **Monday through Friday, 8:00 AM to 4:30 PM**, unless otherwise noted for a specific department.

For FOIA (Freedom of Information Act) requests, contact: **FOIA@clareco.net** | Fax: **(989) 539-2588**

---

### Administration
- **Phone:** (989) 539-2510
- **Address:** 225 W Main St, Harrison, MI 48625

### Airport
- **Phone:** (989) 329-3981

### Animal Shelter
- **Phone:** (989) 539-3221
- **Hours:** 10:00 AM – 4:00 PM
- **After-hours emergencies:** (989) 539-1336

### Board of Commissioners
- **Meetings:** 3rd Wednesday of each month at 9:00 AM
- **Location:** County Building, 225 W Main St, Harrison

### Building & Community Development
- **Website:** [clareco-buildingdev.net](http://clareco-buildingdev.net)

### Central Dispatch (911)
- **Emergency:** 911
- **Administration:** (989) 539-7166
- **Non-emergency dispatch:** (989) 539-1336

### Conservation District
- **Phone:** (989) 539-6401
- **Website:** [clarecd.org](http://clarecd.org)

### Clerk & Register of Deeds
- **Phone:** (989) 539-7131
- **Website:** [clareclerkrod.com](http://clareclerkrod.com)

### Drain Commissioner
- **Phone:** (989) 539-7320

### Elections
- **Website:** [clareclerkrod.com/election/](http://clareclerkrod.com/election/)

### Emergency Services
- **Phone:** (989) 539-6161

### Equalization
- **Phone:** (989) 539-7894

### Friend of the Court
- **Phone:** (989) 539-0800

### Information Technology
- **Phone:** (989) 539-6402

### Prosecutor
- **Phone:** (989) 539-9831

### Sheriff
- **Phone:** (989) 539-7166

### Treasurer
- **Phone:** (989) 539-7801

### Veterans Services
- **Phone:** (989) 539-3273

---

For general inquiries about Clare County government services, contact the Administration office at **(989) 539-2510** during regular business hours.', 'Government', 'County Services', NULL, false, 30, 'published', '2026-03-26T00:00:00.000Z'::timestamptz, now(), now()),
('county-elections', 'Clare County Elections', 'Voter registration, election dates, and absentee voting', '## Elections in Clare County

Elections in Clare County are administered by the Clare County Clerk''s office, which oversees voter registration, ballot preparation, absentee voting, and the certification of results for all federal, state, and local elections held within the county.

## Online Election Portal

The Clare County Clerk maintains an online election portal where residents can access essential election services:

**[clareclerkrod.com/election/](http://clareclerkrod.com/election/)**

Through the portal, you can:

- **Register to vote** or update your existing registration
- **Check your voter registration status** to confirm your information is current and correct
- **Request an absentee ballot** for upcoming elections
- **View sample ballots** to review candidates and proposals before Election Day
- **Find your polling location** based on your registered address

## Voter Registration

Michigan residents who are United States citizens and at least 18 years of age by Election Day are eligible to register to vote. Registration can be completed online, by mail, or in person at the County Clerk''s office. Michigan allows same-day voter registration at your local clerk''s office, though registering in advance helps ensure a smooth experience on Election Day.

## Absentee Voting

Michigan voters may request an absentee ballot for any reason. Ballots can be requested through the online portal or by contacting the Clerk''s office directly. Completed absentee ballots must be received by your local clerk by 8:00 PM on Election Day to be counted.

## Contact

For questions about voter registration, absentee ballots, election dates, or any other election-related matter:

- **Phone:** (989) 539-7131
- **Office:** Clare County Clerk, 225 W Main St, Harrison, MI 48625
- **Website:** [clareclerkrod.com/election/](http://clareclerkrod.com/election/)', 'Government', 'Elections', NULL, false, 32, 'published', '2026-03-26T00:00:00.000Z'::timestamptz, now(), now()),
('dining-clare', 'Dining in Clare', 'Restaurants, cafes, and eateries in the City of Clare', 'The City of Clare offers a wide selection of dining options along McEwan Street and throughout town, from locally famous doughnut shops and craft breweries to family restaurants and international cuisine.

| Restaurant | Address | Phone |
|-----------|---------|-------|
| 505 Cafe'' | 505 N McEwan St | (989) 424-6602 |
| Bucilli''s Pizza of Clare | 1541 N McEwan St | (989) 386-7231 |
| Cops & Doughnuts | 521 N McEwan St | (989) 386-2241 |
| Dairy Phil | 1131 N McEwan St | (989) 386-2647 |
| Doherty Hotel Restaurant | 604 N McEwan St | (989) 386-3441 |
| Four Leaf Brewing | 412 McEwan St | (989) 424-6114 |
| Mancino''s of Clare | 10348 S Clare Ave | (989) 386-6000 |
| McEwan Street Fudge & Ice Cream | 511 N McEwan St | (989) 424-6156 |
| Mulberry Cafe | 120 E Fifth St | (989) 386-6120 |
| Ruckle''s Pier | 405 N McEwan St | (989) 386-9531 |
| Ruk Thai Kitchen | 1446 N McEwan St | (989) 418-5008 |
| The Evening Post Bar & Grill | 114 W Fourth St | (989) 386-5990 |
| The Trap Door | 501 N McEwan St | (989) 418-6024 |
| Timeout Tavern | 601 N McEwan St | (989) 424-6077 |
| Whitehouse Restaurant | 613 N McEwan St | (989) 386-9551 |', 'Directory', NULL, NULL, false, 50, 'published', '2026-03-26T00:00:00.000Z'::timestamptz, now(), now()),
('dining-farwell-area', 'Dining in Farwell & Surrounding Area', 'Restaurants in Farwell, Lake, and Lake George', 'Farwell and the surrounding communities of Lake and Lake George offer a variety of dining spots, from classic diners and pizza shops to lakeside bars and neighborhood gathering places.

| Restaurant | Address | Phone |
|-----------|---------|-------|
| Big R''s Hogs & Dogs | 1876 W Ludington Dr, Farwell | (989) 544-4066 |
| Birchwood Restaurant | 2497 W Cadillac Dr, Farwell | (989) 588-2061 |
| Bond''s DJ Lounge | 210 W Main St, Farwell | (989) 588-6704 |
| Bucilli''s Pizza of Farwell | 203 E Main St, Farwell | (989) 588-9919 |
| Buckhorn Saloon | 10092 Cadillac Dr, Lake | (231) 734-5599 |
| Conlay''s Cafe | 2105 W Ludington Dr, Farwell | (989) 588-7220 |
| Lake Restaurant | 8200 W Ludington Dr, Farwell | (989) 544-2721 |
| Lakeside Bar & Grill | 7807 Mystic Lake Dr, Farwell | (989) 544-3502 |
| Swiss Inn Bar & Grill | 105 Park Ave, Lake George | (989) 588-4211 |
| The Nest | 310 W Main St, Farwell | (989) 544-4555 |', 'Directory', NULL, NULL, false, 51, 'published', '2026-03-26T00:00:00.000Z'::timestamptz, now(), now()),
('dining-harrison', 'Dining in Harrison', 'Restaurants and eateries in Harrison and Leota', 'Harrison and the nearby community of Leota offer a range of dining options, from family restaurants and pizzerias to casual pubs serving the lake and trail crowd.

| Restaurant | Address | Phone |
|-----------|---------|-------|
| Hang''s Chinese | 711 N 1st St, Harrison | (989) 539-1210 |
| Jackie''s Airport Restaurant | 4557 N Clare Ave, Harrison | (989) 368-1105 |
| Jackpine Restaurant | 231 E Main St, Harrison | (989) 539-6162 |
| Mama Cillie''s Pizzeria | 642 N 1st St, Harrison | (989) 539-5600 |
| Monte''s Family Restaurant | 3897 N Clare Ave, Harrison | (989) 539-2262 |
| Mr. Vetoes Pizza | 6948 E Townline Lake Rd, Harrison | (989) 539-3500 |
| Sheri''s Family Diner | 316 Park St, Harrison | (989) 539-2531 |
| Trails End Pub - Leota | 10141 N Finley Lake Ave, Harrison | (989) 539-9644 |
| Trails End Restaurant | 963 N 1st St, Harrison | (989) 630-0124 |', 'Directory', NULL, NULL, false, 52, 'published', '2026-03-26T00:00:00.000Z'::timestamptz, now(), now()),
('donate', 'Donate', 'Support Unicorn Gives and community programs in Lincoln Township', '## Support Our Community

Unicorn Gives is a non-profit supporting the Lincoln Township community. Your donations go directly toward the programs, events, and spaces that bring our community together.

### Where Your Money Goes

Every dollar supports our community:

- **Community Events & Programming** — Funding events, workshops, and gatherings at The Horn
- **Facility Maintenance & Improvements** — Keeping our community spaces welcoming and functional
- **Outreach & Volunteer Coordination** — Engaging residents and connecting them with opportunities to get involved
- **Local Business Support Initiatives** — Strengthening the economic fabric of Lake George and Lincoln Township

### How to Donate

Online donation options are currently being set up. Subscribe to our mailing list at [/subscribe](/subscribe) to be notified when online donations go live.

In the meantime, if you would like to make a donation or discuss how you can support Unicorn Gives, please reach out to us directly through our [contact page](/hours-horn) or at any community event.

### Other Ways to Support

- [Volunteer your time](/volunteer)
- Attend and promote our [events](/events)
- Spread the word about [Unicorn Gives](/about-unicorn-gives)

### Transparency

Unicorn Gives is committed to financial accountability. Financial information is available, and we believe the community should always have visibility into how resources are being used. Visit our [financial reports page](/financial-reports) for more details.', 'Community', 'Unicorn Gives', NULL, false, 23, 'published', '2026-03-25T00:00:00.000Z'::timestamptz, now(), now()),
('election-center', 'Election Center', 'Everything you need to know about voting in Clare County — registration, absentee ballots, polling locations, and upcoming elections', '## Register to Vote

Michigan offers online voter registration through the [Michigan Voter Information Center](https://mvic.sos.state.mi.us/). You can register at any time — there is no deadline for in-person registration with your local clerk.

**To register you need:**
- Valid Michigan driver''s license or state ID
- Be a U.S. citizen, at least 18 years old on Election Day
- Be a resident of your city or township for at least 30 days

**Register online:** [Michigan Voter Information Center](https://mvic.sos.state.mi.us/)
**Register in person:** Lincoln Township Clerk''s Office, 175 Lake George Ave, Lake George, MI

## Absentee Voting

Any registered voter in Michigan can vote by absentee ballot — no reason required.

**How to get an absentee ballot:**
1. Request an application from the Township Clerk at (989) 588-9841 ext. 2
2. Complete and return the application
3. Receive your ballot by mail
4. Return your completed ballot by mail or drop it in the **ballot drop box at Lincoln Township Hall**

**Permanent absentee voter list:** Ask the Clerk to add you so you automatically receive an application before every election.

## Upcoming Elections

Contact the Township Clerk or visit the [Michigan Voter Information Center](https://mvic.sos.state.mi.us/) for upcoming election dates, your polling location, and sample ballots.

## Become an Election Inspector

Clare County is recruiting election inspectors for upcoming elections. Inspectors help run polling locations on Election Day. Contact the County Clerk at (989) 539-7131 to volunteer.

## Key Contacts

- **Carol Majewski**, Lincoln Township Clerk — [(989) 588-9841 ext. 2](tel:9895889841)
- **Lori Mott**, Clare County Clerk — [(989) 539-7131](tel:9895397131)
- **Ballot Drop Box** — Lincoln Township Hall, 175 Lake George Ave, Lake George, MI', 'Government', 'Transparency', NULL, false, 30, 'published', '2026-03-25T00:00:00.000Z'::timestamptz, now(), now()),
('events-horn', 'Events at The Horn', 'Upcoming events, recurring schedules, and happenings at The Horn community center', '## Events at The Horn

The Horn hosts a variety of community events and gatherings in the heart of Lake George. From markets and meetups to workshops and celebrations, there is always something in the works.

### Recurring Events

**Lincoln Township Gardening Club**
Every Saturday, 9:00 AM. Weekly hands-on gardening meetups with seed swaps, tips, and community plot maintenance. On the first Saturday of each month, a special class is held on topics like composting, native Michigan plants, container gardening, and seasonal planning. Free and open to all skill levels — beginners welcome. [Read the full announcement](/news/gardening-club-launches)

### Upcoming Events

Additional events will be posted here as they are scheduled. Subscribe to stay in the loop.

### Host Your Event

The Horn''s space is available for community events and private bookings. Whether you are planning a meeting, a workshop, a celebration, or something else entirely, reach out to inquire about availability and details.

### Stay Updated

The best way to hear about new events is to subscribe to our mailing list:
- **[Subscribe for event announcements](/subscribe)**

You can also follow along on social media or check back here regularly.

### More

- [Community Events Calendar](/events)
- [About The Horn](/about-the-horn)
- [News & Updates](/news)', 'Community', 'The Horn', NULL, false, 25, 'published', '2026-03-25T00:00:00.000Z'::timestamptz, now(), now()),
('events', 'Community Events', 'Upcoming community events in Lincoln Township from Unicorn Gives, The Horn, The Mane, and more', '## Community Events

Your one-stop view of everything happening in Lincoln Township — from Unicorn Gives initiatives and Horn gatherings to township meetings and community activities.

### Recurring Events

**Gardening Club — Weekly Saturdays**
Every Saturday, 9:00 AM at The Horn, Lake George village. Hands-on gardening, seed swaps, tips, and community plot work. On the first Saturday of each month, a special topic class is held (composting, native plants, container gardening, and more). Free and open to all skill levels. [Learn more](/news/gardening-club-launches)

**Township Board Meeting — Second Monday of Each Month**
7:00 PM at Township Hall. Open to all residents. Agendas and minutes are posted on the [public notices](/public-notices) page when available.

**Planning Commission — First Tuesday After Second Monday**
7:00 PM at Township Hall. Reviews zoning, land use, and development matters. Open to the public.

### Upcoming Events

Check back regularly for newly announced events, or subscribe to stay in the loop.

### Submit an Event

Community organizations and township departments can submit events for listing. Contact [Unicorn Gives](/about-unicorn-gives) to have your event posted.

### Event Sources

Events are gathered from across the community:

- [Unicorn Gives](/about-unicorn-gives) — community programs and initiatives
- [The Horn](/about-the-horn) — community center events and gatherings
- [The Mane](/about-the-mane) — salon specials and community days
- [Township Board](/calendar) — government meetings and public hearings
- [Public Notices](/public-notices) — official township announcements', 'News & Events', 'Community Events', NULL, false, 48, 'published', '2026-03-25T00:00:00.000Z'::timestamptz, now(), now()),
('faq', 'Frequently Asked Questions', 'Frequently asked questions about Lincoln Township services, permits, taxes, and more', '## Frequently Asked Questions

*[Clerk](#clerk) | [Treasurer](#treasurer) | [Zoning Admin](#zoning) | [Building Department](#building) | [Assessing](#assess) | [County Transit](#countytransit)*

---

### Township Clerk FAQs {#clerk}

**Where is the Lake George Senior Center located?**
175 Lake George Avenue, Lake George

**What are the hours?**
9:00 AM to 1:30 PM

**Does Lincoln Township have Senior Housing?**
No, we do not have Senior Housing in Lincoln Township. However there are several senior apartments located in Clare County:
- Farwell — Pinehurst: 989-588-3360
- Clare — Clarecastle: 989-386-3280; Horizon Living Center: 989-386-4900
- This is only a partial list

**What kind of Senior Transportation is available?**
Clare County Senior Services offers medical transportation. Call 989-539-8870 if you are a senior in need of a ride to a medical appointment. Veterans Services also provides medical and other transportation.

**What is required to reserve the Township Hall or Township property such as the pavilion at one of the parks?**
Contact the Clerk at (989) 588-9841 ext. 2.

**Where do I go to register to vote?**
Any Secretary of State Office, the Township Clerk ((989) 588-9841 ext. 2), or other designated state agency such as FIA.

**How do I get an absentee ballot?**
Contact the Clerk at (989) 588-9841 ext. 2.

**Who can be on the permanent absentee list?**
Any registered voter age 60 years or over may request to be on the permanent list. Contact the Clerk ((989) 588-9841 ext. 2) to have a signature card sent.

**Where do I get a dog license?**
At the Clare County Treasurer''s Office located in the court house at 225 W. Main St., Harrison, MI.

**How do I find my septic tank?**
Start at the Clare County Environmental Health Department (989-539-6731).

**How do I call the Transit for a ride?**
By calling 989-539-1473.

**Where is the nearest Hospital?**
The Mid-Michigan Medical Center is located in Clare at 703 N. McEwan St. 989-802-5000.

**Is there an Urgent Care in the area?**
Yes. The Urgent Care is located in Clare at 700 W. Fifth St. 989-386-9911.

**I will be having some excavating done on my property. Should I call MISS DIG?**
It is always best to call MISS Dig at 811 before any digging is done. You will need to call at least 3 full days before digging.

---

### Township Treasurer FAQs {#treasurer}

**When are Tax Bills sent out?**
Tax Bills are mailed on or around July 1st and December 1st.

**What address are Tax Bills mailed to?**
Tax Bills are mailed to the most current address on file for the Property Owner as recorded on the Deed UNLESS an alternate Taxpayer Address is requested and provided.

**My mortgage company pays my taxes through escrow. How is that mailing handled?**
The original Tax Bill will still be mailed to the address of record. This is informational for the property owner so that you will know what your tax obligation is for the year. A copy of this bill will be forwarded to your mortgage company for payment.

**Are receipts mailed out?**
Yes, receipts are mailed UNLESS you are paying with one of the larger mortgage company escrow options. These large batch payments do not generate individual receipts for mailing. However, individual receipts are generated on-line and can be printed per your request.

**How can I get copies of my tax bills or receipts?**
Copies of bills and receipts can be obtained three ways:
- Printed on-line at lincolntwp.com
- Call the Treasurer''s office at 989-588-2574
- Email a request to mc@lincolntwp.com

**When are taxes due?**
- Summer Taxes are due on September 14th
- Winter Taxes are due on December 14th
- Any taxes not received by these dates will have interest and penalty attached to them
- Any taxes not received by March 1st will be turned over to the Clare County Treasurer as delinquent and cannot be paid to Lincoln Township

**How can I pay my taxes?**
- Lincoln Township Treasurer, PO Box 239, Lake George, MI 48633
- Taxes can be paid in person at the Treasurer''s office in the Township Hall during scheduled office hours
- Taxes can be paid on-line at www.lincolntwp.com

**Can I pay with a credit or debit card?**
Credit and Debit Cards are ONLY accepted if paying on-line at www.lincolntwp.com. A 3% charge is added by the credit card processing company to cover fees.

**Is there an electronic option available that does not include a 3% processing fee?**
Yes. There is a direct bank transfer option available through the lincolntwp.com payment link. A flat fee is assessed that is much less than the 3% credit/debit card fee.

**What are the Treasurer''s office hours?**
Office hours vary from month-to-month. Hours are posted on-line at www.lincolntwp.com, on the doors at the Township Hall, and on the telephone greeting at 989-588-2574. During Winter months, hours are subject to change during severe weather. If local schools are closed the office is likely to be closed also.

---

### Township Zoning FAQs {#zoning}

**Where do I get Township Zoning information?**
See the [Lincoln Township Zoning page](/zoning) for ordinance details, or call the Zoning Administrator, Dick Hassberger, at (989) 588-9841 ext. 5. You can email him at [zoning@lincolntwp.com](mailto:zoning@lincolntwp.com).

---

### Township Building Department FAQs {#building}

**When can I speak with the Building Inspector?**
Call (989) 539-2761.

**How do I schedule an inspection?**
Call 989-539-2741. The individual who filed the permit application must schedule inspections with the Building Inspector.

**What do I need permits for?**
Call (989) 539-2761, follow prompts. Also, download information [HERE](/docs/faq_when_permit.pdf).

**Where can I get a Building Permit?**
At [lincolntwp.com/forms/building_permit_all-in-one.pdf](/forms/building_permit_all-in-one.pdf).

**Where do I get an electrical, mechanical or plumbing permit?**
Contact [Clare County Community Services](https://clareco-buildingdev.net/) at 989-539-2761.

---

### Assessing FAQs {#assess}

**What is the difference between S.E.V. and taxable value?**
S.E.V. stands for State Equalized Value which is 50% of Market Value. Taxable Value is the value that you pay your taxes on (this came about when Proposal A was voted in by the taxpayers in 1993). Beginning in 1994 your S.E.V. was capped and could only increase yearly by the rate of inflation or 5%, whichever is less. If anything new is added to the property, 50% of the appraised value of this new item is added to your taxable value. Also if you just purchased your home, in the following year your taxable value will be uncapped, and your taxes will be based on S.E.V. In subsequent years you will be increasing by the taxable value rule.

**Why are my neighbor''s taxes less than mine when we have the exact same house?**
Sometime it may appear that you have the same house, but on closer observation they may have a larger home, garage, deck, shed, lot etc., or your house may be newer by a few years. All of the aforementioned would affect the appraised value of your house and reflect a difference in your taxes. Also, if you purchased your home in the prior year, your taxable value would have been uncapped and you will be paying taxes on your S.E.V.

**I am not satisfied with the value placed on my home. I feel there has been a mistake made.**
If you believe a mistake has been made in the appraisal of your property, the first thing to do would be to come into the office and inquire in the Assessing Department to have your appraisal explained. If you are not satisfied with their explanation, and feel you are over assessed, you can appeal to the March Board of Review.

**Should I call the office if I see an appraiser taking a picture of my house?**
If it is a Township appraiser he is only doing his job. In the past we had black and white photographs, today we are trying to update our records with digital colored photographs which can be accessed from our computers.

---

### County Transit FAQs {#countytransit}

**What kind of Senior Transportation is available?**
Clare County Transit provides Public Transportation to all citizens in Clare County. For more information go to the [Clare County Transit Website](http://www.clarecountytransit.org/).', 'Information', 'Resources', NULL, false, 10, 'published', '2025-01-19T00:00:00.000Z'::timestamptz, now(), now()),
('farwell-community', 'Village of Farwell', 'Rich logging heritage with a vibrant community spirit', '## Roots in the Timber

Farwell is a village of approximately 850 residents whose identity is deeply intertwined with Michigan''s logging era. In the late 1800s, the surrounding forests fueled a booming timber industry, and Farwell grew up as a hub for the workers, mills, and railroads that made it all possible. Though the great pines are long since harvested, the community has never forgotten where it came from.

## Preserving the Past

The Farwell Historical Museum stands as the village''s dedicated keeper of that heritage. Inside, visitors find artifacts, photographs, and exhibits that tell the story of logging camps, sawmills, and the families who built their lives around the timber trade. The museum is a labor of love maintained by local volunteers and serves as both an educational resource and a gathering point for residents who want to stay connected to the community''s roots.

## Markets, Festivals & Gatherings

Farwell keeps its calendar lively with events that draw neighbors together. The Farmers Market runs on Saturdays from 9 AM to 1 PM, May through October, offering locally grown produce, baked goods, and handmade crafts. The annual Lumberjack Festival pays tribute to the village''s timber origins with contests, demonstrations, and family entertainment. The Labor Day Celebration marks the unofficial end of summer with parades, food vendors, and live music. As the year winds down, the Holiday Lights Festival brightens the village with seasonal decorations, caroling, and community cheer.

## Recreation

Golfers in the area benefit from Eagle Glen Golf Course, located nearby and known for its well-maintained fairways and welcoming atmosphere. The surrounding countryside also provides ample opportunity for hunting, fishing, and trail riding, making Farwell a solid base for anyone looking to explore Clare County''s outdoor offerings.', 'Community', 'Community Profiles', NULL, false, 12, 'published', '2026-03-26T00:00:00.000Z'::timestamptz, now(), now()),
('financial-reports', 'Financial Reports', 'Lincoln Township audit reports, financial disclosures, and fiscal accountability documents', '## Financial Reports & Disclosures

Lincoln Township maintains financial records in accordance with Michigan state requirements. Audit reports and financial disclosures are posted here for public review.

### Audit Reports

Annual audit reports will be posted as they become available.

*Audit reports coming soon.*

### Financial Disclosures

- Annual financial statements
- Fund balance reports
- Revenue and expenditure summaries

### Public Accountability

All financial records are public information. You may also:

- Attend [Board of Trustees meetings](/board-minutes) where financial matters are discussed
- Submit a [FOIA request](/foia) for specific financial documents
- Review the [annual budget](/budget) for planned expenditures

### Contact

For financial questions or to request documents:
- **Treasurer**: Maggie Carey — [989-588-2574](tel:989-588-2574)', 'Government', 'Budget & Finances', NULL, false, 6, 'published', '2026-03-25T00:00:00.000Z'::timestamptz, now(), now()),
('fire', 'Lincoln Township Fire Department', 'Lincoln Township Fire Department information, burn permits, safety resources, and emergency contacts', 'The Lincoln Township Fire Department is a volunteer fire department established and operated pursuant to the laws of the State of Michigan. Under the supervision of the Lincoln Township Board, the department is responsible for fire and rescue protection throughout Lincoln and Freeman Townships, along with any mutual aid contracts.

## Township Sirens

- **Tornado Warning Siren:** A three-minute continuous blast
- **All Clear:** Intermittent siren after the warning
- **Siren Test:** 1st Thursday of each month at 3:00 PM

## Burn Permits

The number for burn permits is **1-866-922-2676** (toll-free statewide system).

- [DNR Burn Permit Management System](http://www.dnr.state.mi.us/burnpermits/)
- [Open Burning Regulations in Michigan](https://www.michigan.gov/documents/deq/deq-aqd-open-burning-brochure_273553_7.pdf)

## Officers & Personnel

**Officers:**
- **Chief:** Dale Majewski — [(989) 429-8887](tel:989-429-8887)
- **Assistant Chief:** John (Toby) Cogswell
- **Captain:** Ken Logan
- **Lieutenant:** Fred Witchell

**Firefighters:**
- Terry Brown, MFR
- Ben Garver
- Chick Witchell

## Contact

**Fire Chief Dale Majewski**
Phone: [(989) 429-8887](tel:989-429-8887)
Address: 310 Bringold Ave, Lake, MI 48632

## Volunteer

The Lincoln Township Fire Department is always looking for dedicated volunteers. If you''re interested in serving your community, contact Fire Chief Dale Majewski or attend a board meeting to learn more.', 'Services', 'Public Safety', NULL, false, 15, 'published', '2026-03-25T00:00:00.000Z'::timestamptz, now(), now()),
('fishing-guide', 'Fishing in Clare County', 'Lakes, rivers, and public access points for anglers', 'Clare County''s motto of "Twenty Lakes in Twenty Minutes" speaks to just how accessible the fishing is here. With dozens of lakes, hundreds of miles of rivers, and public access sites scattered across the county, anglers of all experience levels will find productive water close at hand.

Budd Lake in Harrison is the county''s largest and most popular fishing lake at 175 acres. It offers panfish, bass, pike, and walleye, with a public boat launch and shore fishing available through Wilson State Park. Crooked Lake, Eight Point Lake, Perch Lake, and Shamrock Lake also have public access points and support a variety of warm-water species.

The Muskegon River is the county''s premier river fishery, drawing fly anglers and conventional fishers alike for trout, steelhead, and smallmouth bass. Its clean, cold water and steady flow make it one of the best trout streams in the Lower Peninsula. The Tobacco River and Cedar River provide additional river fishing opportunities, with quieter stretches that are well suited for wading and bank fishing.

Wilson State Park on Budd Lake offers a paved boat launch, fish cleaning station, and shore fishing areas, making it one of the most convenient access points in the county. A valid Michigan fishing license is required for anglers 17 and older.', 'Recreation', NULL, NULL, false, 46, 'published', '2026-03-26T00:00:00.000Z'::timestamptz, now(), now()),
('foia', 'Freedom of Information Act (FOIA)', 'Freedom of Information Act (FOIA) request procedures and forms for Lincoln Township', 'Michigan''s Freedom of Information Act (FOIA) provides the public with the right to access government records. Lincoln Township is committed to transparency and provides the following documents to help you understand and exercise your rights under FOIA.

### FOIA Documents

- [Lincoln Township''s Policy Regarding the Inspection of Public Records, Including Property Tax Records](/docs/foia/foia_lincolntwp_policy.pdf)
- [Public Summary of FOIA Procedures and Guidelines](/docs/foia/foia_public_procedures_guidelines.pdf)
- [FOIA Procedures and Guidelines](/docs/foia/foia_procedures_guidelines.pdf)
- [FOIA Forms Packet](/docs/foia/foia_forms.pdf)
- [Lincoln Township FOIA Request for Detailed Cost Itemization](/docs/foia/foia_cost_itemization.pdf)

### How to Submit a Request

To submit a FOIA request, download the [FOIA Forms Packet](/docs/foia/foia_forms.pdf) and return the completed form to:

**Carol Majewski, Township Clerk**
- Phone: (989) 588-9841 ext. 2
- Email: [clm@lincolntwp.com](mailto:clm@lincolntwp.com)
- Mail: P.O. Box 239, Lake George, MI 48633', 'Information', 'Resources', NULL, false, 6, 'published', '2025-01-19T00:00:00.000Z'::timestamptz, now(), now()),
('forms-permits', 'Forms & Permits Hub', 'All downloadable forms and permit applications for Lincoln Township and Clare County — building, zoning, FOIA, elections, and more', '## Building & Construction

| Form | Format | Source |
|------|--------|--------|
| [Building Permit Application](/forms/building-permit.pdf) | PDF | Clare County |
| [Plumbing Permit Application](/forms/plumbing-permit.pdf) | PDF | Clare County |
| [Electrical Permit Application](/forms/electrical-permit.pdf) | PDF | Clare County |
| [Mechanical Permit Application](/forms/mechanical-permit.pdf) | PDF | Clare County |

## Zoning

| Form | Format | Source |
|------|--------|--------|
| [Zoning Permit Application](/forms/zoning-permit.pdf) | PDF | Lincoln Township |
| [Zoning Permit for RVs/Temporary Storage](/forms/rv-zoning-permit.pdf) | PDF | Lincoln Township |
| [Special Exemption Use Permit](/forms/special-exemption-use.pdf) | PDF | Lincoln Township |
| [Home Occupation Permit](/forms/home-occupation-permit.pdf) | PDF | Lincoln Township |
| [ZBA Application for Variance](/forms/zba-variance.pdf) | PDF | Lincoln Township |
| [Petition for Text Amendment](/forms/text-amendment-petition.pdf) | PDF | Lincoln Township |

## Property

| Form | Format | Source |
|------|--------|--------|
| [Parcel Division Application](/forms/parcel-division.pdf) | PDF | Lincoln Township |
| [Principal Residence Exemption Affidavit](/forms/principal-residence-exemption.pdf) | PDF | State of Michigan |
| [Rescind Principal Residence Exemption](/forms/rescind-pre.pdf) | PDF | State of Michigan |
| [Property Transfer Affidavit](/forms/property-transfer.pdf) | PDF | State of Michigan |

## Government & Records

| Form | Format | Source |
|------|--------|--------|
| [FOIA Request Form](/forms/foia-request.pdf) | PDF | Lincoln Township |
| [FOIA Detailed Cost Itemization](/forms/foia-cost-itemization.pdf) | PDF | Lincoln Township |
| [Absentee Ballot Application](/forms/absentee-ballot.pdf) | PDF | State of Michigan |
| [Application for Commission Appointment](/forms/commission-appointment.pdf) | PDF | Lincoln Township |
| [Ordinance Violation Report](/forms/ordinance-violation-report.pdf) | PDF | Lincoln Township |

## Facilities

| Form | Format | Source |
|------|--------|--------|
| [Township Park Pavilion Use Agreement](/forms/pavilion-use-agreement.pdf) | PDF | Lincoln Township |
| [Township Hall Use Agreement](/forms/hall-use-agreement.pdf) | PDF | Lincoln Township |

## Fire & Safety

| Form | Format | Source |
|------|--------|--------|
| [Fireworks Display Permit Application](/forms/fireworks-permit.pdf) | PDF | Lincoln Township |

---

**Need a form not listed here?** Contact the Township Office at [(989) 588-9841](tel:9895889841) or check the [Clare County website](https://clareco.net).

**Note:** Some forms may require in-person submission. Call ahead to confirm what you need to bring.', 'Services', 'Building & Development', NULL, true, 5, 'published', '2026-03-25T00:00:00.000Z'::timestamptz, now(), now()),
('golf-courses', 'Golf Courses', 'Five courses from championship links to casual nine-hole play', 'Clare County offers five golf courses ranging from full championship layouts to a relaxed nine-hole course where you can walk up and play without a tee time. Whether you are a serious golfer or just looking for a casual round, you will find a course that fits.

| Course | Location | Phone | Details |
|--------|----------|-------|---------|
| Eagle Glen | 1251 Clubhouse Dr, Farwell | (989) 588-4424 | Par 72, 6,602 yards |
| Snow Snake Ski & Golf | 3407 E Mannsiding Rd, Harrison | (989) 539-6583 | Par 71, 6,025 yards |
| Firefly Golf Links | 7795 S Clare Ave, Clare | (989) 386-3510 | Par 72, est. 1930s |
| Tamaracks | 8900 N Clare Ave, Harrison | (989) 539-5441 | Par 70, 5,760 yards |
| Devil''s Knob | 3897 N Rodgers Ave, Harrison | — | 9-hole, no tee times needed |', 'Recreation', NULL, NULL, false, 43, 'published', '2026-03-26T00:00:00.000Z'::timestamptz, now(), now()),
('harrison-community', 'City of Harrison', 'Clare County seat — lakes, trails, and small-town charm', '## The County Seat

Harrison serves as the seat of Clare County government and carries the well-earned nickname "Twenty Lakes in Twenty Minutes." The city of roughly 2,100 residents is surrounded by an extraordinary concentration of inland lakes, making it one of central Michigan''s most appealing destinations for fishing, boating, swimming, and simply watching the sunset over still water.

## Budd Lake & Wilson State Park

The crown jewel is Budd Lake, a 175-acre lake that sits right within the city limits. Its clear water and sandy bottom draw swimmers in summer and ice anglers in winter. Wilson State Park occupies a prime stretch of Budd Lake''s shoreline, offering modern campsites, a public beach, picnic areas, and a boat launch. The park is one of the most visited state parks in the region, and reservations fill quickly during peak season.

## Traditions Old and New

Community traditions run deep in Harrison. The Clare County Fair has been a fixture since 1883, making it one of the longest continuously operating county fairs in Michigan. Livestock shows, carnival rides, demolition derbies, and pie contests bring the county together every summer. When temperatures drop, the Frostbite Festival transforms downtown Harrison into a winter celebration with ice sculptures, chili cook-offs, snowmobile events, and family activities that prove the fun does not stop when the snow flies.

## Education & Community

Mid Michigan College maintains a campus in Harrison, providing accessible higher education and workforce training to residents across the region. The college anchors a broader network of community resources, including the Pere Marquette District Library and local parks, that contribute to Harrison''s reputation as a welcoming place to live, work, and raise a family.', 'Community', 'Community Profiles', NULL, false, 11, 'published', '2026-03-26T00:00:00.000Z'::timestamptz, now(), now()),
('hiking-biking-trails', 'Hiking & Biking Trails', 'Paved rail trails, woodland pathways, and cross-state bike routes', 'Clare County offers a variety of trails for hikers, bikers, and outdoor enthusiasts of all skill levels, from paved rail trails ideal for family outings to rugged woodland pathways winding through lakes and wetlands.

## Pere Marquette Rail Trail

The Pere Marquette Rail Trail stretches 30 miles along a paved surface from Clare to Midland, following a former railroad corridor as part of the national rails-to-trails movement. The flat, paved path is perfect for biking, walking, jogging, and rollerblading. Trailheads with parking are available in Clare, Coleman, Sanford, and Midland. The trail connects to the larger Mid-Michigan trail network and is open year-round for non-motorized use.

## Green Pine Lake Pathway

Located in eastern Clare County, the Green Pine Lake Pathway covers 13 miles of trail through a scenic landscape of lakes, woodlands, and wetlands. The pathway includes loops of varying length for different ability levels, including a 1-mile interpretive loop that highlights the area''s natural features and ecology. The trail system is managed by the Michigan DNR and is popular for hiking in warmer months and cross-country skiing in winter.

## Mid Michigan College Trails

Mid Michigan College in Harrison maintains a network of campus trails that are open to the public year-round. The trails wind through wooded areas surrounding the campus and provide a convenient option for a quick walk or jog without venturing far from town.

## US Bike Route 20

US Bike Route 20 is a 175-mile designated cycling route that runs from Marine City on the Lake Huron shore to Ludington on Lake Michigan. The route passes directly through Clare County, giving long-distance cyclists a chance to experience the area''s rolling farmland, small towns, and forested stretches. Signage along the route helps riders navigate county roads and connects to local services in Clare and Harrison.', 'Recreation', NULL, NULL, false, 40, 'published', '2026-03-26T00:00:00.000Z'::timestamptz, now(), now()),
('historic-landmark-tour', 'Historic Landmark Tour', 'WPA murals, historic hotels, and architectural treasures', '## Self-Guided Historic Tour

Clare County preserves a collection of historic landmarks that reward a leisurely afternoon of exploration. Whether you are a history enthusiast, an architecture buff, or simply curious about the stories behind the buildings you pass every day, this self-guided tour connects the dots between the county''s most significant sites.

## WPA-Era Murals

Among the county''s most treasured cultural assets are the murals created during the 1930s under the Works Progress Administration. The WPA employed artists across the country to bring art into public spaces during the Great Depression, and Clare County was fortunate to receive several installations that survive to this day.

- **Clare Middle School** — Murals here depict scenes of community life and the natural landscape, offering a window into how residents saw themselves and their surroundings during a difficult era.
- **US Post Office (Clare)** — The post office mural follows the WPA tradition of illustrating local industry and daily life, rendered in the bold, confident style characteristic of the period.
- **Doherty Hotel** — The hotel''s interior features additional WPA artwork that complements its grand early-twentieth-century architecture.

Mural tours are available by appointment through the Clare County Convention & Visitors Bureau at **(989) 386-9979**.

## The Doherty Hotel

Built in 1924, the Doherty Hotel is one of Michigan''s grand small-town hotels. With 157 rooms, the property was ambitious for a community of Clare''s size, and it quickly became a social and commercial hub. The hotel hosted politicians, entertainers, and business travelers during its heyday, and its ballroom and dining room saw countless community celebrations. The building''s brick facade and period details remain largely intact, making it a landmark worth visiting whether or not you are staying the night.

## Farwell Historical Museum

Located in the Village of Farwell, the historical museum preserves artifacts and stories from the county''s logging era. Photographs, tools, documents, and personal items bring to life the people who worked the timber camps and built the communities that survive today. The museum operates on a seasonal schedule with hours maintained by dedicated local volunteers.

## Planning Your Visit

The landmarks described here are spread across Clare County and can be visited in any order. Most are accessible during regular business hours, though the mural tours and museum may require advance arrangements. Contact the Clare County Convention & Visitors Bureau for current schedules, maps, and additional recommendations.', 'History', 'Landmarks', NULL, false, 21, 'published', '2026-03-26T00:00:00.000Z'::timestamptz, now(), now()),
('hours-horn', 'The Horn — Hours & Contact', 'Hours, location, and contact information for The Horn community center and membership club', '## Hours & Access

### Public Hours

The Horn is open to everyone — no membership required — during public hours:

**10:00 AM – 2:00 PM, Daily**

Stop by to check out the space, browse artisan goods, or just hang out. Everyone is welcome.

### Member Access

Members enjoy **24/7 key access**, 365 days a year. Your place, anytime.

Free parking is available around the clock.

**[Become a Member →](/membership)**

---

## Location

The Horn is located in the historic former Lake George Grocery building in Lake George, MI.

---

## Stay in the Loop

The best way to stay up to date on hours, events, and what''s happening at The Horn:
- **Subscribe** to our mailing list at [/subscribe](/subscribe) for announcements
- Follow us on social media for the latest updates

---

## Find Us

- [About The Horn](/about-the-horn)
- [Events at The Horn](/events-horn)
- [Become a Member](/membership)', 'Community', 'The Horn', NULL, false, 27, 'published', '2026-03-25T00:00:00.000Z'::timestamptz, now(), now()),
('hours-mane', 'The Mane — Hours & Contact', 'Hours, location, and contact information for The Mane boutique salon', '## Hours & Contact

### Location

300 Lake George St
Lake George, MI 48633

### Hours

Hours may vary. Call ahead or book online for the most up-to-date availability.

### Contact

- **Phone:** (989) 588-6988
- **Email:** hanna@unicorn.love
- **Online Booking:** Available through Square Appointments — visit our [appointment page](/book-appointment)

### Social Media

Follow us for updates, inspiration, and appointment openings:
- **Facebook:** @themane.lg
- **Instagram:** @themane.lg

### Find Us

- [About The Mane](/about-the-mane)
- [Our Services](/services-mane)
- [Book an Appointment](/book-appointment)', 'Community', 'The Mane', NULL, false, 31, 'published', '2026-03-25T00:00:00.000Z'::timestamptz, now(), now()),
('index', 'Unicorn Gives | Lincoln Township Community Hub', 'Your community hub for Lincoln Township, Clare County, Michigan', '## Welcome to Your Community Hub

Unicorn Gives brings together everything happening in Lincoln Township, Clare County, Michigan — from government transparency to community events, all in one place.

### Our Community

- [Unicorn Gives](/about-unicorn-gives) — Non-profit community organization
- [The Horn](/about-the-horn) — Community center and club
- [The Mane](/about-the-mane) — Boutique salon

### Township Government

- [Board of Trustees](/board)
- [Board Meeting Minutes](/board-minutes)
- [Meeting Calendar](/calendar)
- [Budget & Finances](/budget)
- [Public Notices](/public-notices)

### Services

- [Building Department](/building)
- [Fire Department](/fire)
- [Permits & Forms](/permits-forms)
- [Election Information](/elections)

### Community Resources

- [Parks & Recreation](/parks)
- [Senior Services](/seniors)
- [Township Lakes](/lakes)
- [Cemeteries](/cemeteries)
- [Community Events](/events)
- [News & Updates](/news)

### Planning & Zoning

- [Zoning Information](/zba)
- [Planning Commission](/planning-commission)
- [Ordinances](/ordinances)

### Contact Information

**Lincoln Township Office**
- Phone: 989-588-9841

**Key Contacts**
- **Supervisor**: Troy Kibbey — (989) 588-9841 ext. 4
- **Clerk**: Carol Majewski — (989) 588-9069
- **Treasurer**: Maggie Carey — (989) 588-2574
- **Zoning Administrator**: Dick Hassberger — (989) 588-9841 ext. 5
- **Assessor**: Casey Guthrie — (231) 350-9123
- **Ordinance Enforcement**: Ken Logan — (989) 588-9841 ext. 8

### Stay Connected

- [Subscribe to Updates](/subscribe)
- [Frequently Asked Questions](/faq)
- [Freedom of Information Act (FOIA)](/foia)
- [Helpful Links](/links)
- [Plat Maps](/plat-maps)', NULL, NULL, NULL, false, 1, 'published', '2026-03-25T00:00:00.000Z'::timestamptz, now(), now()),
('lake-george-leota-community', 'Lake George & Leota', 'Logging railroad heritage along the Muskegon River', '## Along the Muskegon

Lake George and Leota occupy a stretch of eastern Clare County where the Muskegon River winds through forests, wetlands, and open fields. These small communities grew up alongside the logging railroads that once hauled timber out of the surrounding backcountry. The railroads are gone, but the landscape they helped shape remains remarkably wild, and the area attracts those who value solitude, natural beauty, and a slower pace of life.

## Green Pine Lake Pathway

The Green Pine Lake Pathway is one of the area''s finest outdoor resources. The trail system covers roughly 13 miles of well-marked routes that loop through a varied terrain of lakes, mature woodlands, and wetland areas. Hikers, cross-country skiers, and nature enthusiasts find a trail network that feels genuinely remote, despite being accessible by county road. The pathway passes several small lakes and offers frequent encounters with wildlife, making it a favorite among birders and photographers alike.

## Kirtland''s Warbler Habitat

This corner of Clare County holds special ecological significance as habitat for the Kirtland''s Warbler, one of the rarest songbirds in North America. The warbler nests almost exclusively in young jack pine forests, and careful land management in the region has helped the species recover from dangerously low numbers. Guided birding tours are sometimes available during the nesting season, offering a rare chance to see and hear this remarkable bird in its natural environment.

## A Baseball Connection

Local history carries a surprising tie to professional baseball. Hamlin Field bears the name of Luke Hamlin, a Clare County native who pitched for the Brooklyn Dodgers during the 1930s and 1940s. Known to fans as "Hot Potato" Hamlin, he compiled a respectable major league career and remained a source of hometown pride long after his playing days ended. The field named in his honor keeps that connection alive for a new generation.', 'Community', 'Community Profiles', NULL, false, 14, 'published', '2026-03-26T00:00:00.000Z'::timestamptz, now(), now()),
('lake-lake-station-community', 'Lake & Lake Station', 'Quiet lakeside communities with Pere Marquette Railway heritage', '## Railway Roots

The communities of Lake and Lake Station owe their beginnings to the Pere Marquette Railway, which once ran a whistle stop through this stretch of Clare County. When trains paused here to take on water and passengers, a small settlement took shape around the tracks. The railway may no longer stop, but its legacy is etched into the landscape. A 1930s concrete coal dock still stands as a local landmark, a quiet monument to the era when rail was king and small depots dotted the Michigan countryside.

## Life on the Water

True to their name, Lake and Lake Station are surrounded by water. Perch Lake, Crooked Lake, and Eight Point Lake all lie within easy reach, providing residents and visitors with dependable fishing, kayaking, and swimming throughout the warmer months. In winter, ice fishing shanties appear on the lakes almost overnight, and snowmobile trails connect the area to a broader network that stretches across the county. The pace of life here is unhurried, shaped by the seasons and the rhythms of the water.

## Community Gathering

The Lake Daze festival is the highlight of the summer social calendar, bringing the community together for a weekend of food, games, music, and neighborly camaraderie. It is the kind of event where everyone knows someone, and newcomers are welcomed without hesitation.

The Fraternal Order of Eagles maintains a headquarters in the area, serving as both a social club and a charitable organization that supports local causes. The Eagles hall hosts dinners, fundraisers, and community events throughout the year, providing an important gathering space for residents of these close-knit lakeside communities.', 'Community', 'Community Profiles', NULL, false, 13, 'published', '2026-03-26T00:00:00.000Z'::timestamptz, now(), now()),
('lakes-bertha', 'Bertha Lake', 'Bertha Lake information, parks, and resources', '## Bertha Lake

Bertha Lake is one of Lincoln Township''s beautiful natural resources, providing recreation and enjoyment for residents and visitors.

### Township Park

Lincoln Township maintains a public park at Bertha Lake with access for residents and guests.

[Learn more about our parks →](/parks)

### Lake Management

For lake-related questions or concerns, contact the Lake Commissioner:

**Lincoln Township Office**
- Phone: (989) 588-9841

### Resources for Lake Property Owners

- [All Township Lakes](/lakes)
- [Lake Management Information](/lakes)
- [Shoreland Zoning Information](/zoning)
- [Dock and Lake Ordinances](/ordinances)

### Lake Management Resources

- [10 Ways to Protect Your Lake](/docs/lakes/10ways_protect_lake.pdf)
- [Lake Lingo: Cutting Through the Jargon (Michigan Lakes Info)](/docs/lakes/lake_lingo.pdf)
- [Lake Water Quality (Michigan Lakes Info)](/docs/lakes/lake_quality.pdf)
- [Lake Water Quality: Are We Winning the War?](/docs/lakes/lakes_winning_war.pdf)
- [Shoreland Overlay Zoning (National Lakes Assessment)](/docs/lakes/shoreland_overlay_zoning.pdf)
- [Watershed Management](/docs/lakes/watershed_management.pdf)', 'Natural Resources', 'Lakes', NULL, false, 999, 'published', '2025-01-19T00:00:00.000Z'::timestamptz, now(), now()),
('lakes-lakegeorge', 'Lake George', 'Lake George information, management resources, and water quality data', 'Lake George is one of Lincoln Township''s most cherished natural resources, providing recreation and enjoyment for residents and visitors alike.

### Lake Evaluation

- [Evaluation Record of Lake George (PLM)](/docs/lakes/lake_evaluation_lkgeorge.pdf)

### Lake Management

- [Cooperative Lakes Monitoring Program — CLMP (DEQ)](/docs/lakes/clmp_lakegeorge.pdf)
- [Lake George Management Program 2019 (PLM Lake & Land Management Corp.)](/docs/lakes/management_plan_lakegeorge.pdf)
- [Leaf Litter Notice (DEQ)](/docs/lakes/leaf_litter_notice.pdf)

### Water Quality Resources

- [Secchi Disk Transparency (Michigan Clean Water Corps)](/docs/lakes/secchi_disk_transparency.pdf) — What do measurements with a Secchi Disk tell us about a lake?
- [Lake Water Quality (Michigan Lakes Info)](/docs/lakes/lake_quality.pdf)
- [Lake Water Quality: Are We Winning the War?](/docs/lakes/lakes_winning_war.pdf)

### Lake Protection & Zoning

- [Protecting Michigan''s Inland Lakes: A Guide for Local Governments (DEQ)](/docs/lakes/protecting_inland_lakes.pdf)
- [10 Ways to Protect Your Lake (Michigan Lakes Info)](/docs/lakes/10ways_protect_lake.pdf)
- [Lake Lingo: Cutting Through the Jargon (Michigan Lakes Info)](/docs/lakes/lake_lingo.pdf)
- [Shoreland Overlay Zoning (National Lakes Assessment)](/docs/lakes/shoreland_overlay_zoning.pdf)
- [Watershed Management](/docs/lakes/watershed_management.pdf)

### Contact

For lake-related questions or concerns, contact the Lincoln Township Office at (989) 588-9841.

### Resources for Lake Property Owners

- [All Township Lakes](/lakes)
- [Shoreland Zoning Information](/zoning)
- [Dock and Lake Ordinances](/ordinances)', 'Natural Resources', 'Lakes', NULL, false, 999, 'published', '2025-01-19T00:00:00.000Z'::timestamptz, now(), now()),
('lakes-shingle', 'Shingle Lake', 'Shingle Lake information, parks, and resources', '## Shingle Lake

Shingle Lake is one of Lincoln Township''s beautiful natural resources, providing recreation and enjoyment for residents and visitors.

### Township Park

Lincoln Township maintains a public park at Shingle Lake with access for residents and guests.

[Learn more about our parks →](/parks)

### Lake Management

For lake-related questions or concerns, contact the Lake Commissioner:

**Lincoln Township Office**
- Phone: (989) 588-9841

### Resources for Lake Property Owners

- [All Township Lakes](/lakes)
- [Lake Management Information](/lakes)
- [Shoreland Zoning Information](/zoning)
- [Dock and Lake Ordinances](/ordinances)', 'Natural Resources', 'Lakes', NULL, false, 999, 'published', '2025-01-19T00:00:00.000Z'::timestamptz, now(), now()),
('lakes-silver', 'Silver Lake', 'Silver Lake information, parks, and resources', '## Silver Lake

Silver Lake is one of Lincoln Township''s beautiful natural resources, providing recreation and enjoyment for residents and visitors.

### Township Park

Lincoln Township maintains a public park at Silver Lake with access for residents and guests.

[Learn more about our parks →](/parks)

### Lake Management

For lake-related questions or concerns, contact the Lake Commissioner:

**Lincoln Township Office**
- Phone: (989) 588-9841

### Resources for Lake Property Owners

- [All Township Lakes](/lakes)
- [Lake Management Information](/lakes)
- [Shoreland Zoning Information](/zoning)
- [Dock and Lake Ordinances](/ordinances)

### Lake Management Resources

- [10 Ways to Protect Your Lake](/docs/lakes/10ways_protect_lake.pdf)
- [Lake Lingo: Cutting Through the Jargon (Michigan Lakes Info)](/docs/lakes/lake_lingo.pdf)
- [Lake Water Quality (Michigan Lakes Info)](/docs/lakes/lake_quality.pdf)
- [Lake Water Quality: Are We Winning the War?](/docs/lakes/lakes_winning_war.pdf)
- [Shoreland Overlay Zoning (National Lakes Assessment)](/docs/lakes/shoreland_overlay_zoning.pdf)
- [Watershed Management](/docs/lakes/watershed_management.pdf)', 'Natural Resources', 'Lakes', NULL, false, 999, 'published', '2025-01-19T00:00:00.000Z'::timestamptz, now(), now()),
('lakes', 'Lakes', 'Information about Lincoln Township lakes including Lake George, Shingle, Bertha, and Silver', '## Lincoln Township Lakes

Click the links below for information about our lakes:

- [Lake George](/lakes-lakegeorge)
- [Shingle Lake](/lakes-shingle)
- [Bertha Lake](/lakes-bertha)
- [Silver Lake](/lakes-silver)

### Contact

For lake-related questions or concerns, contact the Lincoln Township Office at (989) 588-9841.', 'Natural Resources', 'Lakes', NULL, false, 10, 'published', '2025-01-19T00:00:00.000Z'::timestamptz, now(), now()),
('links', 'Community Resources & Links', 'Helpful links to Clare County services, schools, and community resources', '## Community Resources & Links

### Clare County Government

**Clare County Main Website**
- [clareco.net](https://clareco.net/)
- Address: 225 West Main, Harrison, MI 48625
- Phone: 989-539-2510

### County Departments & Services

**Building & Development**
- Clare County Building Department
- Phone: 989-539-2761
- Services: Building permits, inspections

**Elections & Voting**
- Clare County Clerk
- Phone: 989-539-7131
- Website: [clareclerkrod.com](http://clareclerkrod.com/)

**Property Records**
- Register of Deeds
- Phone: 989-539-9942
- Services: Property records, deed registration

**Property Taxes**
- County Treasurer
- Phone: 989-539-7109
- Services: Property tax information and payment

**Health Services**
- Central Michigan District Health Department
- Phone: 989-773-5921
- Website: [cmdhd.org](https://www.cmdhd.org/)
- Services: Septic permits, well permits, immunizations, health inspections

**Law Enforcement**
- Clare County Sheriff''s Office
- Phone: 989-539-7166
- Emergency: 911

**Road Maintenance**
- Clare County Road Commission
- Phone: 989-539-7691
- Services: County road maintenance, road concerns

**Veterans Services**
- Clare County Veterans Services
- Phone: 989-539-7108
- Resources: [Disabled Veterans Property Tax Exemption Form](http://clareco.net/veterans/docs/vets_property_tax_exemption.pdf)

**Conservation & Environment**
- Clare Conservation District
- Phone: 989-539-9364
- Website: [clarecd.org](http://www.clarecd.org/)
- Services: Soil erosion control, conservation planning

**Senior Services**
- Clare County Senior Services / Council on Aging
- Website: [clareseniorservices.org](http://www.clareseniorservices.org/)
- Services: Meals, activities, transportation, support

**County Extension**
- MSU Extension - Clare County
- Services: 4-H, agriculture, nutrition education

**GIS & Maps**
- FetchGIS Portal
- Access via [clareco.net](https://clareco.net/)
- Services: Property maps, GIS data

### Lincoln Township Services

**Property Assessment Data**
- [lincolntwp.is.bsasoftware.com](http://lincolntwp.is.bsasoftware.com/)
- Services: Property assessment records, tax information

**Township Plat Maps**
- [View plat maps →](/plat-maps)

### Schools

**Farwell Area Schools**
- [farwellschools.net](http://www.farwellschools.net/)

**Harrison Community Schools**
- [harrisonschools.com](http://www.harrisonschools.com/)

### Libraries

**Surrey Township Public Library**
- [stpl.org](http://www.stpl.org/)
- Services: Books, programs, community resources

### Local Organizations

**Farwell Chamber of Commerce**
- [farwellareachamber.com](http://www.farwellareachamber.com/)

**Lake George Property Owners Association**
- [lgpoa.net](http://www.lgpoa.net/)

**Lake George Booster''s Club**
- [lakegeorgeboostersclub.org](http://www.lakegeorgeboostersclub.org/)

### Environmental & Water Resources

**Muskegon River Watershed Assembly**
- [mrwa.org/mrwa-home](http://mrwa.org/mrwa-home/)
- Coverage: Approximately 29 sections of Lincoln Township

**Partnership for the Saginaw Bay Watershed**
- [psbw.org](http://psbw.org/)
- Coverage: Approximately 7 sections of Lincoln Township

**Michigan Waterfront Alliance**
- [mwai.org](https://mwai.org/)

**Michigan Chapter, North American Lakes Management Society**
- [mcnalms.org](http://mcnalms.org/)

**Michigan''s Water Strategy**
- [View PDF](http://www.michigan.gov/documents/deq/deq-ogl-waterstrategy_538161_7.pdf)

### State Resources

**Michigan Townships Association**
- [michigantownships.org](http://www.michigantownships.org/)

**Michigan Public Service Commission**
- [michigan.gov/mpsc](http://www.michigan.gov/mpsc/)
- Services: Video/cable TV complaints
- [Consumer Tips on Filing Complaints](http://www.michigan.gov/documents/mpsc/video_cable_complaints_437708_7.pdf)

**Michigan Department of Environment**
- YouTube: [youtube.com/michigandeq](https://www.youtube.com/michigandeq)
- Videos: Recycling, open burning, drug disposal, invasive species

### Other Resources

**Government Surplus Auctions**
- [govdeals.com](https://www.govdeals.com/)
- Services: Surplus equipment auctions

**Local News**
- TV 9&10 News
- [9and10news.com](http://www.9and10news.com/)

### Related Township Pages

- [Board of Trustees](/board)
- [Building Department](/building)
- [Permits & Forms](/permits-forms)
- [Fire Department](/fire)
- [Frequently Asked Questions](/faq)
- [Freedom of Information Requests](/foia)', 'Information', 'Resources', NULL, false, 10, 'published', '2025-01-19T00:00:00.000Z'::timestamptz, now(), now()),
('lodging', 'Lodging & Accommodations', 'Hotels, motels, and cottages in Clare County', 'Clare County offers more than 325 rooms across hotels, motels, and cottage properties in Clare and Harrison. Whether you are visiting for a weekend on the lake, a round of golf, or a snowmobile trip, you will find comfortable accommodations close to the action.

| Property | Address | Phone | Type |
|----------|---------|-------|------|
| Best Western | 10100 S Clare Ave, Clare | (989) 229-3000 | Hotel |
| Doherty Hotel | 604 N McEwan St, Clare | (989) 386-3441 | Historic Hotel (1924) |
| Quality Inn | 10318 S Clare Ave, Clare | (989) 386-1111 | Hotel |
| Lone Pine Motel | 1508 N McEwan St, Clare | (989) 386-7787 | Motel |
| Lakeside Motel & Cottages | 515 E Park St, Harrison | (989) 539-0706 | Waterfront |', 'Directory', NULL, NULL, false, 53, 'published', '2026-03-26T00:00:00.000Z'::timestamptz, now(), now()),
('membership', 'Join The Horn', 'Become a member of The Horn — Lake George''s community club with 24/7 access, events, a cigar lounge, game nights, and more', '## Your Place. Anytime.

The Horn is a nonprofit community space designed to bring people together — a place rooted in belonging. Members get 24/7 access to a space where you can work during the day, unwind at night, and connect with like-minded people any time in between.

Whether you''re looking for a late-night safe hangout, a quiet space to be productive, or a crew to share a bonfire with — this is it. No cover. No closing time. Just your place.

The community you''ve been waiting for is ready to welcome you.

---

## Membership Plans

| | Individual | Couple / +1 | Family |
|---|---|---|---|
| **Monthly** | **$40/mo** | **$60/mo** | **$100/mo** |
| Members | 1 | 2 | Up to 4 |
| 24/7 Key Access | ✓ | ✓ | ✓ |
| All Member Benefits | ✓ | ✓ | ✓ |
| Discounted Event Rates | ✓ | ✓ | ✓ |
| Bring a Guest | ✓ | ✓ | ✓ |

### Add VIP — $20/mo extra

Want more? Add VIP to any membership for just **$20 extra per month**. VIP unlocks the **adults-only space** — also open 24/7 — where you can bring your own drinks and smoke indoors. A private space within the space.

> **Not a member yet?** The Horn is open to the public daily from **10 AM – 2 PM**. Stop by, see the space, and meet the community before you commit.

---

## What You Get

### 24/7 Access
This is your place — come anytime, day or night. Members get key access around the clock, 365 days a year. Work from here during the day. Hang out after midnight. It''s always open for you.

### Members-Only Cigar Lounge
A dedicated lounge space for members to relax, socialize, and enjoy. Step away from the noise and settle in.

### Free Wi-Fi & Work-Friendly Space
Need a place to get things done? The Horn has reliable Wi-Fi and a comfortable setup for remote work, studying, or creative projects. Productive days, relaxed nights — all under one roof.

### Late-Night Safe Hangout
A safe, welcoming place to be after 2 AM. No bar scene, no pressure — just good company and a comfortable space when everywhere else is closed.

### Game Nights & Entertainment
Board games, video games, TVs, and music — all available to members. Regular game nights bring the community together for some friendly competition.

### Discounted Event Rates
Members enjoy discounted rates on events at The Horn — whether you''re celebrating a birthday, hosting a gathering, or joining one of our special community events.

### Events — Indoors & Out
Bonfire nights, seasonal gatherings, potlucks, and more. Members get access to exclusive events plus priority for all public programming at The Horn.

### Bring a Guest
Members can bring a guest to share the experience. Show a friend what The Horn is all about.

### Food & Kitchen Access
Members can use the kitchen for their own food prep and customization. We also host occasional potluck nights where the community comes together over a shared table.

### Free Parking (24/7)
Dedicated parking available around the clock — no meters, no hassle, no matter what time you stop by.

### Exclusive Community
This isn''t just a membership — it''s a community. Connect with your neighbors, meet new people, and be part of something that''s genuinely ours.

---

## Why People Join

- **"This is my place."** — A space that feels like yours, not someone else''s business
- **Late-night safe space** — Somewhere to go when everything else is closed
- **Social connection** — Meet like-minded people and build real friendships
- **Escape boredom & loneliness** — There''s always something to do and someone to hang with
- **Productivity + escape** — Work during the day, chill at night
- **Be part of something** — An exclusive community built by and for people in Lake George

---

## Sign Up Early

Memberships are launching by **Memorial Weekend** — but you don''t have to wait. Sign up early at **[horn.love](https://horn.love)** to unlock your spot.

You can also visit The Horn during public hours (**10 AM – 2 PM daily**) to see the space and sign up in person.

**[Sign Up at horn.love](https://horn.love)** · **[Contact Us](/hours-horn)** · **[Events at The Horn](/events-horn)** · **[About The Horn](/about-the-horn)**', 'Community', 'The Horn', NULL, false, 26, 'published', '2026-03-25T00:00:00.000Z'::timestamptz, now(), now()),
('minutes-archive', 'Meeting Minutes Archive', 'Lincoln Township meeting minutes — all years, searchable and filterable', 'This page has been replaced by our comprehensive **[Meeting Minutes Archive](/minutes)** which includes:

- **139 meeting minutes** from 2014 through 2026
- Full-text search across all minutes
- Filter by meeting type (Board Meeting, Special Meeting, Workshop, Election, etc.)
- Filter by year
- Attendance records for each meeting

**[Browse the Full Archive &rarr;](/minutes)**

---

## Historical Note: 2005–2010 Minutes

The original Lincoln Township website (lincolntwp.com) hosted board meeting minutes from 2005 through 2010 as individual HTML pages. When the domain was lost, most of these pages were not preserved by web archives. The dates that were referenced include meetings from March 2005 through December 2010 (approximately 60 meetings).

If you need access to minutes from this period, please contact Lincoln Township directly via [FOIA request](/foia) or contact the Clerk at [clm@lincolntwp.com](mailto:clm@lincolntwp.com).', 'Government', 'Board & Leadership', NULL, false, 31, 'published', '2026-03-25T00:00:00.000Z'::timestamptz, now(), now()),
('newsletters', 'Lincoln Township Newsletter', 'Township newsletter archives and subscription information', '## Township Newsletter

Stay informed about Lincoln Township news, events, and updates.

### Newsletter Archive

*Newsletter archives are currently being organized and will be posted here as they become available.*

### Stay Connected

To receive township updates and announcements:

**Contact the Township Clerk**:
- Carol Majewski
- Phone: 989-588-9069
- Email: clm@lincolntwp.com

### Other Ways to Stay Informed

- [Board Meeting Minutes](/board-minutes)
- [Meeting Calendar](/calendar)
- [Frequently Asked Questions](/faq)', 'Community', 'Resources', NULL, false, 26, 'published', '2025-01-19T00:00:00.000Z'::timestamptz, now(), now()),
('ordinances-zoning-ord-creation', 'Zoning Ordinance Initiative', 'Documents and meeting minutes from the 2015-2017 zoning ordinance update process', '## Zoning Ordinance Initiative: 2015 - 2017

Landplan Incorporated, Rural Community Planning & Zoning Services has been hired to assist Lincoln Township in the preparation of an updated Zoning Ordinance that reflects current State of Michigan laws and requirements. Documents pertaining to this process are posted below as they become available for the public to view.

### Drafts and Documents

- [Zoning Ordinance Draft of July 24, 2017](/docs/zoning_ord_creation/draft_zoningord_7-24-17.pdf) (1.2 MB) — [Zoning Ordinance Map Draft](/docs/zoning_ord_creation/draft_zoning_map7-24-17.pdf) — posted 7/24/2017
- [Zoning Ordinance Draft of November 29, 2016](/docs/zoning_ord_creation/draft_zoningord_11-29-16.pdf) (1.4 MB)
- [Zoning Ordinance Draft #3, 7/22/2016](/docs/zoning_ord_creation/draft3_zoningord_revised7-22-16.pdf) (1.3 MB) — posted 7/26/2016
- [Zoning Ordinance Map Draft](/docs/zoning_ord_creation/draft_zoning_map7-22-16.pdf) — posted 7/26/2016
- [Initial LandPlan Draft, 2/27/2016](/docs/zoning_ord_creation/initial_landplan_draft2-27-16.pdf) — posted 3/25/2016
- [Revised Draft Article 16: SIGNS, 11/6/2015](/docs/zoning_ord_creation/draft_article9_signs11-6-15.pdf) — posted 11/10/2015
- [R-2 Special Setback Regulations and Keyhole Regulations: Draft 11/4/2015](/docs/zoning_ord_creation/draft_special_setback_regulations-keyhole_regulations_11-4-15.pdf) — posted 11/10/2015
- [Remaining Draft Portions of the New Zoning Ordinance; Articles 12-19](/docs/zoning_ord_creation/draft_zoningord_part3.pdf) — posted 10/5/2015
- [Additional Draft Portions of the new Zoning Ordinance/Articles; 3-5, & 20-22](/docs/zoning_ord_creation/draft_zoningord_part2.pdf) — posted 9/21/2015
- [Initial Draft Portions of the new Zoning Ordinance/Articles; 1, 2, & 6-11](/docs/zoning_ord_creation/draft_zoningord_part1.pdf) — posted 4/30/2015

### Meeting Minutes

- [Meeting Minutes 5/12/2015](/docs/zoning_ord_creation/landplan_blueprint_meeting_minutes5-12-15.pdf) (approved minutes) — posted 7/1/2015
- [6/30/15 Meeting Agenda](/docs/zoning_ord_creation/landplan_agenda_meeting6-30-15.pdf) — posted 6/17/2015
- [Meeting Minutes 4/27/2015](/docs/zoning_ord_creation/landplan_blueprint_meeting_minutes4-27-15.pdf) (approved minutes) — posted 7/1/2015
- [4/27/15 Meeting Agenda](/docs/zoning_ord_creation/landplan_agenda_meeting4-27-15.pdf) — posted 4/13/2015
- [Meeting Minutes 2/23/2015](/docs/zoning_ord_creation/landplan_blueprint_meeting_minutes2-23-15.pdf) (approved minutes) — posted 7/1/2015
- [New Zoning Ordinance / February 23 Blueprint Meeting](/docs/zoning_ord_creation/landplan_blueprint_meeting2-23-15.pdf) — posted 2/21/15', 'Planning & Zoning', 'Regulations', NULL, false, 999, 'published', '2026-01-14T00:00:00.000Z'::timestamptz, now(), now()),
('ordinances', 'Lincoln Township Ordinances', 'Lincoln Township ordinances, regulations, and municipal codes', '## Township Ordinances

- Ordinance 30 — Control of Dogs Ordinance
- Ordinance 32 — Parks & Public Grounds Ordinance
- Ordinance 33 — Nuisance & Blight Ordinance
- Ordinance 34 — Emergency Services
- Ordinance 35 — Parental Responsibility Ordinance
- Ordinance 38 — Lot Splitting Ordinance
- Ordinance 39 — Lake, Dock & Boat Ordinance
- Ordinance 40 — Flood Plain Management
- Ordinance 41 — Michigan Planning Enabling Act
- Ordinance 42 — Fireworks Control
- Ordinance 46 — Cemeteries Ordinance
- Ordinance 46 — Prohibition of Rec. Marijuana Establishments
- [Ordinance 44 — Zoning Ordinance](/zoning) — available at Township Hall or by request

### Ordinance Enforcement

**Ken Logan, Ordinance Enforcement Officer**
- Phone: (989) 588-9841 ext. 8

### Additional Resources

- Lincoln Township Master Plan', 'Planning & Zoning', 'Regulations', NULL, false, 17, 'published', '2025-01-19T00:00:00.000Z'::timestamptz, now(), now()),
('parks-recreation', 'Parks & Recreation Areas', 'City parks, state parks, and public recreation areas across Clare County', 'Clare County''s parks and recreation areas provide green space, waterfront access, and places to gather throughout the year. From state-managed facilities to neighborhood parks, there is something for every age and interest.

## Wilson State Park

Located in Harrison on the shore of Budd Lake, Wilson State Park is the county''s premier outdoor destination. The park features modern campsites, a sandy swimming beach, a boat launch, picnic shelters, and a playground. It connects directly to the Pere Marquette Rail Trail, making it a convenient base for both water and trail activities.

## Shamrock Park

Shamrock Park in Clare is a community gathering spot known for its summer concert series. The park offers open green space, a pavilion, and a welcoming atmosphere for families and events throughout the warmer months.

## Pettit Park

Situated along the river on N McEwan Street in Clare, Pettit Park provides camping facilities and riverside access. It is a convenient stop for travelers and a popular spot for picnics and short stays.

## Herrick Recreation Area

East of Clare off Herrick Road, this recreation area offers hiking trails, rustic camping, and a quiet natural setting. It is well suited for those looking to explore the woods and enjoy a slower pace.

## Pere Marquette Linear Park

Running alongside the Pere Marquette Rail Trail, this linear park provides rest areas, benches, and trailside amenities for walkers and cyclists making their way between Clare and points east.

## Harrison Parks

Jay''s Park in Harrison offers playground equipment, open fields, and space for community activities. Additional parks in the Harrison area include Addington Park, Lily Lake Park, Stevens Park, and Townline Lake Park, each providing neighborhood-level recreation, picnic areas, and lake or green space access for residents and visitors.', 'Recreation', NULL, NULL, false, 45, 'published', '2026-03-26T00:00:00.000Z'::timestamptz, now(), now()),
('parks', 'Parks', 'Lincoln Township parks at Bertha Lake, Shingle Lake, and Silver Lake with amenities and pavilion rental', 'Lincoln Township maintains public parks on the shores of Shingle Lake, Bertha Lake, and Silver Lake, offering recreation and natural beauty for residents and visitors.

### Pavilion Rental

The Shingle Lake Park pavilion is available for reservation. Download and return the application to reserve your date.

- [Township Park Pavilion Use Agreement](/forms/twp_park_use_agreement.pdf)

**Return application to:**
Carol Majewski, Clerk — P.O. Box 239, Lake George, MI 48633

---

### Bertha Lake Park

**Location:** 781 Pine St., Bertha Lake

Bertha Lake Park provides lakefront access and green space for the community.

[Learn more about Bertha Lake](/lakes-bertha)

---

### Shingle Lake Park

**Location:** 483 Park St., Lake George

Shingle Lake Park features a pavilion available for community events and private gatherings.

- [Download the Park Pavilion Use Agreement](/forms/twp_park_use_agreement.pdf)

[Learn more about Shingle Lake](/lakes-shingle)

---

### Silver Lake Park

**Location:** 110 Lincoln Rd., Silver Lake

Silver Lake Park offers lakefront access for residents and visitors.

[Learn more about Silver Lake](/lakes-silver)

---

### Contact

For park-related questions or pavilion reservations, contact the Township Clerk at (989) 588-9841 ext. 2.', 'Community', 'Facilities', NULL, false, 20, 'published', '2025-01-19T00:00:00.000Z'::timestamptz, now(), now()),
('permits-forms', 'Permits & Forms', 'Download building permits, zoning permits, and other township forms', '## Permits & Forms

### Understanding Township vs County Permits

Lincoln Township works with **Clare County** to provide permit services. Here''s what you need to know:

**County-Level Permits** (Clare County)
- Building permits
- Plumbing permits
- Electrical permits
- Mechanical permits
- Contact: 989-539-2761

**Township-Level Permits** (Lincoln Township)
- Zoning permits
- Park pavilion use
- Contact: (989) 588-9841 ext. 5

## Building & Construction Permits

### Getting Started with a Building Project

**Important: Both a Building Permit AND a Zoning Permit are required for most construction projects.**

### Step-by-Step Guide

1. **Contact the Zoning Administrator** to discuss your project
   - Dick Hassberger: (989) 588-9841 ext. 5 or zoning@lincolntwp.com

2. **Download and complete application forms** (see below)

3. **Submit Building Permit applications** to Clare County Building Department
   - Address: 225 W. Main St., P.O. Box 438, Harrison, MI 48625
   - Phone: 989-539-2761

4. **Submit Zoning Permit applications** to Lincoln Township Zoning Administrator
   - Dick Hassberger, P.O. Box 239, Lake George, MI 48633
   - Phone: (989) 588-9841 ext. 5

5. **Pay permit fees** when applications are approved

6. **Schedule inspections** with Clare County Building Department (989-539-2761)

[View detailed building permit information →](/building)

### Building Permit Forms

**County-Level Permits** (Submit to Clare County)
- Building Permit Application - 989-539-2761
- Plumbing Permit Application - Nate Caulkins: 989-539-2741
- Electrical Permit Application
- Mechanical Permit Application - Nate Caulkins: 989-539-2741

**Township-Level Permits** (Submit to Lincoln Township)
- Zoning Permit Application - Dick Hassberger: (989) 588-9841 ext. 5

### Additional Construction Permits

**Soil Erosion Control**
If your project disturbs soil, contact:
- Clare Conservation District
- Phone: 989-539-9364
- Website: [clarecd.org/se.html](http://www.clarecd.org/se.html)

**Septic System Permits**
For septic system installation or repair:
- Central Michigan District Health Department
- Phone: 989-773-5921
- Website: [cmdhd.org](https://www.cmdhd.org/)

## Parks & Recreation Forms

### Park Pavilion Rental

Reserve a pavilion at Bertha Lake, Shingle Lake, or Silver Lake parks:
- Park Pavilion Use Agreement
- Contact: Township Supervisor at 989-588-9841

[View parks information →](/parks)

## Township Records & Information

### Freedom of Information Act (FOIA) Requests

Submit requests for public records:
- [FOIA Request Information & Form →](/foia)
- Contact: Township Clerk at 989-588-9069

### Cemetery Information

Information about cemetery plots and services:
- [Cemetery Information →](/cemeteries)

### Property Tax Information

For property tax questions:
- Contact: Township Treasurer Maggie Carey at 989-588-2574
- [View FAQs →](/faq#treasurer)

## County-Level Services

### Clare County Departments

For services beyond township level:

**County Clerk** (Elections, Records)
- Phone: 989-539-7131
- Website: [clareclerkrod.com](http://clareclerkrod.com/)

**County Treasurer** (Property Taxes)
- Phone: 989-539-7109
- Address: 225 W. Main St., Harrison, MI 48625

**Register of Deeds** (Property Records)
- Phone: 989-539-9942
- Address: 225 W. Main St., Harrison, MI 48625

**Health Department** (Septic, Well, Food Service)
- Central Michigan District Health Department
- Phone: 989-773-5921
- Website: [cmdhd.org](https://www.cmdhd.org/)

**Sheriff''s Office** (Law Enforcement)
- Phone: 989-539-7166
- Emergency: 911

**Road Commission** (County Roads)
- Clare County Road Commission
- Phone: 989-539-7691

[View complete county services directory →](/links)

## Additional Resources

- [Building Department Information](/building)
- [Zoning Information](/zba)
- [Planning Commission](/planning-commission)
- [Township Ordinances](/ordinances)
- [Frequently Asked Questions](/faq)
- [Clare County Website](https://clareco.net/)', 'Services', 'Building & Development', NULL, false, 12, 'published', '2025-01-19T00:00:00.000Z'::timestamptz, now(), now()),
('planning-commission', 'Planning Commission', 'Planning Commission meeting minutes, agendas, and zoning information', '## Planning Commission

[Subscribe for notifications when minutes are updated](/subscribe)

### Current Members

- Phil Blisdell, Chair
- Jim Ostrowski, Vice Chair
- Gary Szczepanski, Secretary
- Tami McCaslin, ZBA ex Officio
- Mike Tobin, Township Board ex Officio

### Meeting Minutes

The Planning Commission meets the 1st Tuesday (after the 2nd Monday) each month at 7:00 PM.

The approval of the latest minutes will be voted on at the next meeting.

#### Zoning Ordinance Initiative Meeting Minutes: 2015

- [Meeting Minutes 5/12/2015](/docs/zoning_ord_creation/landplan_blueprint_meeting_minutes5-12-15.pdf) — posted 7/1/2015
- [Meeting Minutes 4/27/2015](/docs/zoning_ord_creation/landplan_blueprint_meeting_minutes4-27-15.pdf) — posted 7/1/2015
- [Meeting Minutes 2/23/2015](/docs/zoning_ord_creation/landplan_blueprint_meeting_minutes2-23-15.pdf) — posted 7/1/2015

---

### Archive: 2008-2010 Planning Commission Minutes

- [12-21-10](/archive/planning_minutes/plancomm_min12-21-10.pdf)
- [10-19-10](/archive/planning_minutes/plancomm_min10-19-10.pdf)
- [9-21-10](/archive/planning_minutes/plancomm_min9-21-10.pdf)
- [8-17-10](/archive/planning_minutes/plancomm_min8-17-10.pdf)
- [7-20-10](/archive/planning_minutes/plancomm_min7-20-10.pdf)
- [6-15-10](/archive/planning_minutes/plancomm_min6-15-10.pdf)
- [5-18-10](/archive/planning_minutes/plancomm_min5-18-10.pdf)
- [4-20-10](/archive/planning_minutes/plancomm_min4-20-10.pdf)
- [3-16-10](/archive/planning_minutes/plancomm_min3-16-10.pdf)
- [2-16-10](/archive/planning_minutes/plancomm_min2-16-10.pdf)
- [1-19-10](/archive/planning_minutes/plancomm_min1-19-10.pdf)
- [12-14-09](/archive/planning_minutes/plancomm_min12-14-09.pdf)
- [11-17-09](/archive/planning_minutes/plancomm_min11-17-09.pdf)
- [10-20-09](/archive/planning_minutes/plancomm_min10-20-09.pdf)
- [8-18-09](/archive/planning_minutes/plancomm_min8-18-09.pdf)
- [7-21-09](/archive/planning_minutes/plancomm_min7-21-09.pdf)
- [6-16-09](/archive/planning_minutes/plancomm_min6-16-09.pdf)
- [4-28-09](/archive/planning_minutes/plancomm_min4-28-09.pdf)
- [4-21-09](/archive/planning_minutes/plancomm_min4-21-09.pdf)
- [3-17-09](/archive/planning_minutes/plancomm_min3-17-09.pdf)
- [1-20-09](/archive/planning_minutes/plancomm_min1-20-09.pdf)
- [10-21-08](/archive/planning_minutes/plancomm_min10-21-08.pdf)
- [7-15-08](/archive/planning_minutes/plancomm_min7-15-08.pdf)
- [6-17-08](/archive/planning_minutes/plancomm_min6-17-08.pdf)
- [2-19-08](/archive/planning_minutes/plancomm_min2-19-08.pdf)', 'Planning & Zoning', 'Commissions', NULL, false, 10, 'published', '2025-01-19T00:00:00.000Z'::timestamptz, now(), now()),
('plat-maps', 'Lincoln Township Plat Maps', 'Subdivision plat maps and property information for Lincoln Township', 'Below you will find plat maps for Lincoln Township organized by section (metes and bounds), White Birch subdivisions, and other named subdivisions.

---

### Metes & Bounds by Section

| Section | Section |
| --- | --- |
| [Section 1](/docs/plat-maps/metes_bounds/Sec1.pdf) | [Section 19](/docs/plat-maps/metes_bounds/Sec19.pdf) |
| [Section 4](/docs/plat-maps/metes_bounds/Sec4.pdf) | [Section 20](/docs/plat-maps/metes_bounds/Sec20.pdf) |
| [Section 5](/docs/plat-maps/metes_bounds/Sec5.pdf) | [Section 21](/docs/plat-maps/metes_bounds/Sec21.pdf) |
| [Section 6](/docs/plat-maps/metes_bounds/Sec6.pdf) | [Section 22](/docs/plat-maps/metes_bounds/Sec22.pdf) |
| [Section 7](/docs/plat-maps/metes_bounds/Sec7.pdf) | [Section 22, Bertha Lake](/docs/plat-maps/metes_bounds/Sec22BerthaLake.pdf) |
| [Section 7, NW 1/4](/docs/plat-maps/metes_bounds/Sec7NWquarter.pdf) | [Section 22, SE 1/4 of SE 1/4](/docs/plat-maps/metes_bounds/Sec22SEquarter_SEquarter.pdf) |
| [Section 7, SE 1/4](/docs/plat-maps/metes_bounds/Sec7SEquarter.pdf) | [Section 23, Hilliard Hills](/docs/plat-maps/metes_bounds/Sec23HilliardHills.pdf) |
| [Section 8](/docs/plat-maps/metes_bounds/Sec8.pdf) | [Section 24](/docs/plat-maps/metes_bounds/Sec24.pdf) |
| [Section 8, Bearly Addition](/docs/plat-maps/metes_bounds/Sec8BearlyAddition.pdf) | [Section 25](/docs/plat-maps/metes_bounds/Sec25.pdf) |
| [Section 8, NW 1/4](/docs/plat-maps/metes_bounds/Sec8NWquarter.pdf) | [Section 26, White Birch Lakes](/docs/plat-maps/metes_bounds/Sec26WBL.pdf) |
| [Section 8, SE 1/4 of SW 1/4, Gov. Lot 2](/docs/plat-maps/metes_bounds/Sec8SEquarter_SWquarter_GovLot2.pdf) | [Section 27, White Birch Lakes](/docs/plat-maps/metes_bounds/Sec27WBL.pdf) |
| [Section 8, SW 1/4](/docs/plat-maps/metes_bounds/Sec8SWquarter.pdf) | [Section 28](/docs/plat-maps/metes_bounds/Sec28.pdf) |
| [Section 8, W 1/2 of NW 1/4 of SW 1/4](/docs/plat-maps/metes_bounds/Sec8Whalf_NWquarter_SWquarter.pdf) | [Section 29](/docs/plat-maps/metes_bounds/Sec29.pdf) |
| [Section 9](/docs/plat-maps/metes_bounds/Sec9.pdf) | [Section 30](/docs/plat-maps/metes_bounds/Sec30.pdf) |
| [Section 10](/docs/plat-maps/metes_bounds/Sec10.pdf) | [Section 30, NW 1/4](/docs/plat-maps/metes_bounds/Sec30NWquarter.pdf) |
| [Section 11](/docs/plat-maps/metes_bounds/Sec11.pdf) | [Section 30, SW 1/4 Silver Lake](/docs/plat-maps/metes_bounds/Sec30SWquarterSilverLake.pdf) |
| [Section 12](/docs/plat-maps/metes_bounds/Sec12.pdf) | [Section 31](/docs/plat-maps/metes_bounds/Sec31.pdf) |
| [Section 13](/docs/plat-maps/metes_bounds/Sec13.pdf) | [Section 32](/docs/plat-maps/metes_bounds/Sec32.pdf) |
| [Section 14](/docs/plat-maps/metes_bounds/Sec14.pdf) | [Section 33](/docs/plat-maps/metes_bounds/Sec33.pdf) |
| [Section 15](/docs/plat-maps/metes_bounds/Sec15.pdf) | [Section 34](/docs/plat-maps/metes_bounds/Sec34.pdf) |
| [Section 16](/docs/plat-maps/metes_bounds/Sec16.pdf) | [Section 35](/docs/plat-maps/metes_bounds/Sec35.pdf) |
| [Section 16, Gov. Lot 5](/docs/plat-maps/metes_bounds/Sec16GovLot5.pdf) | [Section 36](/docs/plat-maps/metes_bounds/Sec36.pdf) |

---

### White Birch Subdivisions

| Subdivision | Subdivision |
| --- | --- |
| [White Birch No. 1](/docs/plat-maps/white_birch/WB_1.pdf) | [White Birch No. 5](/docs/plat-maps/white_birch/WB_5.pdf) |
| [White Birch No. 2](/docs/plat-maps/white_birch/WB_2.pdf) | [White Birch No. 6](/docs/plat-maps/white_birch/WB_6.pdf) |
| [White Birch No. 3](/docs/plat-maps/white_birch/WB_3.pdf) | [White Birch No. 7](/docs/plat-maps/white_birch/WB_7.pdf) |
| [White Birch No. 4](/docs/plat-maps/white_birch/WB_4.pdf) | |

---

### Named Subdivisions (Bertha Pleasure Resort through Woodmere)

- [Bertha Pleasure Resort, First Addition](/docs/plat-maps/bertha_through_woodmere/BerthaPleasureResortFirstAddition.pdf)
- [Bertha Pleasure Resort, Section 22](/docs/plat-maps/bertha_through_woodmere/BerthaPleasureResortSec22.pdf)
- [Canoe Subdivision, Section 22](/docs/plat-maps/bertha_through_woodmere/CanoeSubSec22.pdf)
- [Davis Subdivision, Section 7](/docs/plat-maps/bertha_through_woodmere/DavisSubSec7.pdf)
- [East Old Grade Subdivision, Section 7](/docs/plat-maps/bertha_through_woodmere/EastOldGradeSub.Sec7.pdf)
- [Fairview Subdivision](/docs/plat-maps/bertha_through_woodmere/FairviewSub.pdf)
- [Hilliard Hills, Section 23](/docs/plat-maps/bertha_through_woodmere/HilliardHillsSec23.pdf)
- [Holmes Development No. 1, Section 7](/docs/plat-maps/bertha_through_woodmere/HolmesDevelopmentNo1Sec7.pdf)
- [Lake George Summer Resort, Blk 7 — Vacated Portion Pearl St.](/docs/plat-maps/bertha_through_woodmere/LakeGeorgeSummerResortBlk7VacatedPortionPearlSt.pdf)
- [Lake George Summer Resort](/docs/plat-maps/bertha_through_woodmere/LakeGeorgeSummerResort.pdf)
- [Lake Wood Subdivision](/docs/plat-maps/bertha_through_woodmere/LakeWoodSub.pdf)
- [Lincoln No. 1, Section 16](/docs/plat-maps/bertha_through_woodmere/LincolnNo1Sec16.pdf)
- [Lincoln Resort](/docs/plat-maps/bertha_through_woodmere/LincolnResort.pdf)
- [Oakdale Resort](/docs/plat-maps/bertha_through_woodmere/OakdaleResort.pdf)
- [Oakwood, Section 8](/docs/plat-maps/bertha_through_woodmere/OakwoodSec8.pdf)
- [Parkway, Section 7](/docs/plat-maps/bertha_through_woodmere/ParkwaySec7.pdf)
- [Pinora Park First Addition, Section 30](/docs/plat-maps/bertha_through_woodmere/PinoraParkFirstAdditionSec30.pdf)
- [Pinora Park, Section 30](/docs/plat-maps/bertha_through_woodmere/PinoraParkSec30.pdf)
- [Pinora Park, Vacated Lot](/docs/plat-maps/bertha_through_woodmere/PinoraParkVacatedLot.pdf)
- [Shermans Subdivision, Section 30](/docs/plat-maps/bertha_through_woodmere/ShermansSubSec30.pdf)
- [Sherwoods Addition, Lake George Summer Resort](/docs/plat-maps/bertha_through_woodmere/SherwoodsAddition_LkGeorgeSummerResort.pdf)
- [Shore Wood Summer Resort](/docs/plat-maps/bertha_through_woodmere/ShoreWoodSummerResort.pdf)
- [Silver Lake Shores, Section 30](/docs/plat-maps/bertha_through_woodmere/SilverLakeShoresSec30.pdf)
- [Stiner Subdivision No. 2](/docs/plat-maps/bertha_through_woodmere/StinerSubNo2.pdf)
- [Stiner Subdivision, Section 16](/docs/plat-maps/bertha_through_woodmere/StinerSubSec16.pdf)
- [Summer Set First Addition](/docs/plat-maps/bertha_through_woodmere/SummerSetFirstAddition.pdf)
- [Summer Set, Section 22](/docs/plat-maps/bertha_through_woodmere/SummerSetSec22.pdf)
- [Swissholme Village No. 1, Section 13](/docs/plat-maps/bertha_through_woodmere/SwissholmeVillageNo1Sect13.pdf)
- [Tindall Subdivision, Section 30](/docs/plat-maps/bertha_through_woodmere/TindallSubSec30.pdf)
- [Tompkins Resort, Section 17](/docs/plat-maps/bertha_through_woodmere/TompkinsResortSec17.pdf)
- [West Old Grade, Section 7](/docs/plat-maps/bertha_through_woodmere/WestOldGradeSec7.pdf)
- [Whispering Oaks, Section 16](/docs/plat-maps/bertha_through_woodmere/WhisperingOaksSec16.pdf)
- [Wigwah Trails, Section 21](/docs/plat-maps/bertha_through_woodmere/WigwahTrailsSec21.pdf)
- [Woodland Estates Lake George, Section 16](/docs/plat-maps/bertha_through_woodmere/WoodlandEstatesLakeGeorgeSec16.pdf)
- [Woodmere First Addition, Section 16](/docs/plat-maps/bertha_through_woodmere/WoodmereFirstAdditionSec16.pdf)
- [Woodmere Government Lots 1, 2, 3 & 4, Section 17](/docs/plat-maps/bertha_through_woodmere/WoodmereGovLots1_2_3_4Sec17.pdf)', 'Information', 'Resources', NULL, false, 4, 'published', '2025-01-19T00:00:00.000Z'::timestamptz, now(), now()),
('programs', 'Programs', 'Current programs and community initiatives run by Unicorn Gives', '## Programs & Initiatives

Unicorn Gives coordinates community initiatives for Lincoln Township through its partner establishments, The Horn and The Mane. Our programs focus on community building, local economic support, and bringing people together.

### Current Initiatives

- **Community Events at The Horn** — Hosting gatherings, markets, and events that give residents a reason to come together in the heart of Lake George
- **Supporting Local Artisans & Small Businesses** — Providing retail space and visibility for area makers and entrepreneurs through The Horn
- **Volunteer Coordination** — Connecting community members with meaningful ways to contribute their time and skills

### Building & Revitalization

Unicorn Gives has invested directly in the Lake George community through:
- **The Horn Renovation** — Transforming the historic former Lake George Grocery building into a community gathering space
- **The Mane Revitalization** — Continuing and expanding a local salon business that has served the community since 2005
- **Township Engagement** — Working with Lincoln Township on initiatives that benefit residents

### Propose a Program

New programs are developed based on community needs. Have an idea? Get involved through [volunteering](/volunteer) or attend an event at [The Horn](/events-horn) and let us know what you would like to see.

### Partners

We collaborate with local organizations including:
- [The Horn Community Center](/about-the-horn)
- [The Mane Boutique Salon](/about-the-mane)
- Lincoln Township Board of Trustees', 'Community', 'Unicorn Gives', NULL, false, 21, 'published', '2026-03-25T00:00:00.000Z'::timestamptz, now(), now()),
('public-notices', 'Public Notices', 'Official public notices, hearing schedules, and important deadlines for Lincoln Township and Clare County residents', '## Active Notices

### Special Assessment District (SAD) Public Hearings
**Date:** Friday, May 8, 2026 at 4:00 PM
**Location:** Lincoln Township Hall, 175 Lake George Ave, Lake George, MI

Three separate public hearings will be held for:
- **Shingle Lake SAD** — Special assessment for lake management
- **Bertha Lake SAD** — Special assessment for lake management
- **Lake George SAD** — Special assessment for lake management

Affected property owners in these SAD districts are encouraged to attend. You may also submit written comments to the Township Clerk before the hearing date.

---

## Regular Meeting Schedules

| Body | Schedule | Time | Location |
|------|----------|------|----------|
| **Township Board** | 2nd Monday monthly | 7:00 PM | Lincoln Township Hall |
| **Planning Commission** | 1st Tuesday after 2nd Monday | 7:00 PM | Lincoln Township Hall |
| **ZBA** | As needed (1st Wed after 2nd Monday) | 7:00 PM | Lincoln Township Hall |
| **County Commissioners** | 3rd Wednesday monthly | 9:00 AM | Clare County Courthouse |
| **Conservation District** | 3rd Tuesday monthly | 6:30 PM | Harrison District Library |

## How to Stay Informed

- **Subscribe:** [Sign up for email updates](/subscribe) to get meeting reminders and public notices
- **Emergency alerts:** Text "ClareCoAlerts" to 67283
- **Meeting minutes:** [View board meeting minutes](/board-minutes)
- **FOIA:** [Submit a public records request](/foia)

## Legal Notices

Michigan legal notices are published through the state system at [Michigan Public Notices](https://www.michiganpublicnotices.com/).

## Contact

Questions about public notices? Contact the Township Clerk:
- **Carol Majewski** — [(989) 588-9841 ext. 2](tel:9895889841)', 'Government', 'Transparency', NULL, false, 31, 'published', '2026-03-25T00:00:00.000Z'::timestamptz, now(), now()),
('seniors', 'Senior Services', 'Senior services, dining center, activities, and resources for Lincoln Township residents', '## Senior Services

### Lincoln Township Senior Dining Center

**Location**
175 Lake George Ave., Lake George, MI 48633

**Hours**
Monday through Friday, 9:30 AM to 1:30 PM

**Phone**
989-588-9841 ext. 1

**Lunch Program**
- Call the day before to reserve lunch
- Free for those 60+ years old ($2.25 donation recommended)
- $5.00 for those under 60
- [Download Monthly Lunch Menus](https://clarecoseniors-coa.net/menus/)

**Activities**
The Senior Center offers a variety of activities including:
- Bingo
- Euchre
- Music
- Wii gaming
- Special events and parties

**Contact**
Call Deb at 988-9841 ext. 1 for information.

### Clare County Senior Services

**Clare County Council on Aging**
- Phone: 989-539-8870
- Website: [clarecoseniors-coa.net](https://clarecoseniors-coa.net/)
- [Monthly Activities Calendar](https://clarecoseniors-coa.net/activities/)

**Nutrition Director**
- Carol Majewski
- Email: majewskic@clareco.net
- Phone: 989-539-8870

**Services Offered**
- Meals and nutrition programs
- Transportation assistance
- Activities and social programs
- Information and assistance
- Health and wellness programs

### Resources for Seniors

#### Veterans Benefits

**Disabled Veterans Property Tax Exemption**
- [Information and FAQs](http://www.michigan.gov/documents/taxes/Disabled_Veterans_Exemption_FAQ_082614_466519_7.pdf)
- Download Exemption Form

**Veterans Services**
- Clare County Veterans Services: 989-539-7108
- [Military.com Veterans Benefits](http://www.military.com/benefits)

#### Legal & Financial Resources

- [Legal Resources for Seniors](https://www.justgreatlawyers.com/legal-resources-considerations-seniors-special-needs)
- Services for Seniors: Laws and Programs
- Protect Yourself from Abuse & Fraud

#### Health & Wellness

- [Advanced Care Planning](http://www.eldercare.gov/Public/Resources/Advanced_Care/Index.aspx)
- [Central Michigan Region Alzheimer''s Association](http://www.alz.org/gmc/index.asp)
  - Phone: 800-272-3900 or 989-839-9910
- [Elder Care Resources](http://www.eldercare.gov/Public/Resources/Index.aspx)

#### Home & Safety

- [Home Accommodations for Seniors](http://www.homeadvisor.com/r/budget-friendly-smart-home-accommodations-for-seniors-and-individuals-with-special-needs/)
- [Tips to Declutter and Organize Your Home](https://www.yourstoragefinder.com/declutter-and-organize-your-home-seniors-special-needs)
- Disaster Preparedness for Seniors

#### Family Resources

- GrandFacts: Fact Sheets for Grandparents
- [Senior Preferences: Guide to Community Resources](http://www.seniorpreferences.com/)

### Active Aging

**Growing Bolder**
Visit the [Growing Bolder website](http://growingbolder.com/) to see exciting things seniors are doing! A great resource for 50+ seniors.

### Contact Information

**For Township Senior Services**
- Lincoln Township Senior Dining Center
- Phone: 989-588-9841 ext. 1

**For County Senior Services**
- Clare County Council on Aging
- Phone: 989-539-8870
- Website: [clarecoseniors-coa.net](https://clarecoseniors-coa.net/)

**For Issues Important to Senior Citizens**
- Carol Majewski, Nutrition Director
- Email: majewskic@clareco.net
- Phone: 989-539-8870

### Related Resources

- [Community Resources & Links](/links)
- [Frequently Asked Questions](/faq)
- [Board of Trustees](/board)', 'Community', 'Resources', NULL, false, 10, 'published', '2025-01-19T00:00:00.000Z'::timestamptz, now(), now()),
('services-mane', 'The Mane — Services', 'Service menu and offerings at The Mane boutique salon in Lincoln Township', '## Our Services

The Mane offers a full range of hair and nail services at our Lake George salon. All hair services use professional-grade products from All-Nutrient, Sukesha, and I.N.O.

### Our Team

- **Hanna Unicorn** — Owner & Stylist. Licensed in 2016, MJ Murphy Beauty College.
- **Hannah "Eileen" Herd** — Nail Technician. Licensed in 2023, MJ Murphy Beauty College. Joined The Mane in 2022.
- **Katie McComber** — Stylist. Licensed in 2022, Protege Academy. Specializes in personalized color work.

---

### Hair Services

#### Cuts & Grooming
| Service | Price |
|---|---|
| Buzz Cut | $15 |
| Clipper Cut | $20 |
| Scissor Cut | $25 |
| Beard Trim | $10 |
| Bang Trim | $10 |
| Kids Cut | $15 - $20 |

#### Color
| Service | Price |
|---|---|
| Root Touch-Up | $55 |
| All-Over Color | $65+ |
| Partial Highlights | $75+ |
| Full Highlights | $95+ |
| Color Correction | $95+/hr |

#### Styling & Treatments
| Service | Price |
|---|---|
| Perm | $65+ |
| Up-Do | $45+ |
| Special Occasion Style | $55+ |
| Deep Conditioning Treatment | $15 - $25 |
| Scalp Massage | $15 |
| Gloss / Glaze | $35 - $45 |

#### Waxing
| Service | Price |
|---|---|
| Eyebrow Wax | $10 |
| Lip or Chin Wax | $10 |

---

### Nail Services

#### Acrylic Nails
| Service | Price |
|---|---|
| Full Set Acrylics | $35 |
| Acrylic Fill | $23 |
| Acrylic Overlay | $30 |

#### Gel Nails
| Service | Price |
|---|---|
| Hard Gel Full Set | $40 |
| Hard Gel Fill | $23 |
| Gel Overlay | $35 |
| Builder Gel | $49 |

#### Manicures
| Service | Price |
|---|---|
| Classic Manicure | $20 |
| Gel Manicure | $30 |
| Deluxe Manicure | $37 |

#### Pedicures
| Service | Price |
|---|---|
| Classic Pedicure | $35 |
| Gel Pedicure | $40 |
| Deluxe Pedicure | $45 |

#### Add-Ons
| Add-On | Price |
|---|---|
| Gel Polish Upgrade | $10 |
| Nail Art | from $5 |
| Gems / Decals | $1 - $3 |
| French Tips | $5 |
| Soak Off | $10 - $20 |

---

### eGift Cards

eGift Cards are available starting at $10 — a great option for birthdays, holidays, or just because. Ask in-salon or contact us for details.

### Book an Appointment

Ready to schedule? Visit our [appointment page](/book-appointment) or call (989) 588-6988.

### Contact

For questions about our services, visit our [hours & contact page](/hours-mane).', 'Community', 'The Mane', NULL, false, 29, 'published', '2026-03-25T00:00:00.000Z'::timestamptz, now(), now()),
('shopping', 'Shopping', 'Sporting goods, Amish crafts, and local markets', 'Clare County has a mix of specialty retailers, downtown shops, and local markets that reflect the area''s outdoor character and rural heritage.

Jay''s Sporting Goods (8800 S Clare Ave, Clare) is a regional destination for outdoor gear, drawing customers from across mid-Michigan. The store carries a full range of hunting, fishing, camping, and sporting equipment along with clothing and footwear for every season.

Downtown Clare''s McEwan Street is the heart of the local shopping scene, with a walkable stretch of shops, boutiques, gift stores, and specialty retailers. The downtown district has seen steady revitalization and is a pleasant place to browse on a weekend afternoon.

Amish-made goods are available in the area around Leaton Road, where visitors can find handcrafted quilts, solid wood furniture, baked goods, and other handmade items. Several small roadside shops and home-based businesses serve the community, though hours and availability can vary.

The Farwell Farmers Market runs on Saturdays from 9 AM to 1 PM, May through October, offering locally grown produce, baked goods, honey, and seasonal items from area farms and artisans.', 'Directory', NULL, NULL, false, 54, 'published', '2026-03-26T00:00:00.000Z'::timestamptz, now(), now()),
('subscribe', 'Subscribe', 'Stay updated with Lincoln Township news and announcements', '## Stay Updated

Receive notifications about Lincoln Township meetings, news, and important announcements.

### How to Subscribe

**Contact the Township Clerk** to be added to our notification list:

- **Carol Majewski, Township Clerk**
- Phone: 989-588-9069
- Email: clm@lincolntwp.com

### What You Can Receive

- Board meeting notices
- Township newsletters
- Important announcements
- Community updates

### Alternative Information Sources

- [Board Meeting Calendar](/calendar)
- [Meeting Minutes](/board-minutes)
- [Newsletter Archive](/newsletters)
- [Frequently Asked Questions](/faq)', 'Information', 'Resources', NULL, false, 33, 'published', '2025-01-19T00:00:00.000Z'::timestamptz, now(), now()),
('volunteer', 'Volunteer', 'Volunteer opportunities with Unicorn Gives in Lincoln Township', '## Volunteer With Us

Unicorn Gives relies on the energy and commitment of community volunteers. Whether you have an hour or a whole weekend, there is a way to help.

### How You Can Help

- **Event Support** — Help set up, run, and break down community events at The Horn
- **Outreach** — Assist with community engagement, spreading the word about programs and events
- **Skills-Based Volunteering** — Contribute professional services such as design, photography, accounting, or trades work
- **Committee Work** — Join a planning or governance committee to help shape community initiatives

### Get Started

Ready to volunteer? Here is how to get involved:

- **Come to an event** — Visit an upcoming event at [The Horn](/events-horn) and talk with our team about opportunities
- **Contact us directly** — Reach out to Unicorn Gives through our [contact information](/hours-horn) and let us know what you are interested in
- **Subscribe** — Sign up at [/subscribe](/subscribe) to hear about volunteer calls and upcoming needs

### Why Volunteer?

- Meet your neighbors and build connections
- Make a real difference in Lincoln Township
- Gain experience and develop new skills
- Be part of something meaningful

### Learn More

- [About Unicorn Gives](/about-unicorn-gives)
- [Current Programs](/programs)
- [Upcoming Events](/events)', 'Community', 'Unicorn Gives', NULL, false, 22, 'published', '2026-03-25T00:00:00.000Z'::timestamptz, now(), now()),
('winter-sports', 'Winter Sports', 'Skiing, snowmobiling, and winter recreation', 'When snow covers Clare County, the outdoor recreation does not stop. Downhill skiing, snowmobiling, cross-country skiing, and ice fishing keep residents and visitors active all winter long.

## Downhill Skiing & Snowboarding

Snow Snake Ski & Golf (3407 E Mannsiding Rd, Harrison, 989-539-6583) is the county''s winter sports hub, offering downhill skiing, snowboarding, and snow tubing. The facility has runs for beginners through intermediate skiers, a lodge, and rental equipment. It is a popular destination for families and school groups throughout the season.

## Snowmobiling

The Fur Farm Snowmobile Trail runs north of Harrison through state forest land, connecting to a broader network of groomed trails across northern Lower Michigan. The trail system provides miles of riding through pine and hardwood forests. Riders should carry a valid snowmobile registration and check grooming reports before heading out.

## Cross-Country Skiing

The Green Pine Lake Pathway in eastern Clare County offers 13 miles of ungroomed trails through lakes, woodlands, and wetlands that are well suited for cross-country skiing when snow conditions allow. The varied terrain and quiet setting make it a favorite for Nordic skiers looking for a peaceful outing.

## Ice Fishing

With dozens of lakes across the county, ice fishing is one of the most popular winter pastimes. Budd Lake, Shamrock Lake, Crooked Lake, and many smaller lakes draw anglers for panfish, pike, and walleye once safe ice forms, typically from late December through early March.', 'Recreation', NULL, NULL, false, 47, 'published', '2026-03-26T00:00:00.000Z'::timestamptz, now(), now()),
('zba-plancomm-minutes', 'ZBA & Planning Commission Minutes', 'Meeting minutes for the Planning Commission and Zoning Board of Appeals', '## Planning Commission and Zoning Board of Appeals Meeting Minutes

The Planning Committee meets the 1st Tuesday (after the 2nd Monday) each month, 7:00 PM.

ZBA Meetings are scheduled only as needed, and ONLY Approved Minutes may be posted.
ZBA Meeting notices are posted at least 15 days before their date. Check the homepage for meeting notices.

[Subscribe to be notified whenever the Planning Commission or ZBA minutes are updated.](/subscribe)

For Minutes from 2011-2013 see [below](#2011-2013).
For Minutes from 2008-2010 see [below](#older).

---

### Planning Commission Minutes: 2014 to Present {#2014+}

The approval of the latest minutes will be voted on at the next meeting.

### ZBA Minutes: 2014 to Present

Approval does not happen until there is another variance request.

---

### Planning Commission and ZBA Minutes: 2011-2013 {#2011-2013}

**Planning Commission Meeting Minutes 2011-2013**
The approval of the latest minutes will be voted on at the next meeting.

**Zoning Board of Appeals Meeting Minutes (Approved) 2011-2013**
Approval does not happen until there is another variance request.

---

### Archive: 2008-2010 Minutes {#older}

#### Planning Commission Minutes (Approved)

- [12-21-10](/archive/planning_minutes/plancomm_min12-21-10.pdf)
- [10-19-10](/archive/planning_minutes/plancomm_min10-19-10.pdf)
- [9-21-10](/archive/planning_minutes/plancomm_min9-21-10.pdf)
- [8-17-10](/archive/planning_minutes/plancomm_min8-17-10.pdf)
- [7-20-10](/archive/planning_minutes/plancomm_min7-20-10.pdf)
- [6-15-10](/archive/planning_minutes/plancomm_min6-15-10.pdf)
- [5-18-10](/archive/planning_minutes/plancomm_min5-18-10.pdf)
- [4-20-10](/archive/planning_minutes/plancomm_min4-20-10.pdf)
- [3-16-10](/archive/planning_minutes/plancomm_min3-16-10.pdf)
- [2-16-10](/archive/planning_minutes/plancomm_min2-16-10.pdf)
- [1-19-10](/archive/planning_minutes/plancomm_min1-19-10.pdf)
- [12-14-09](/archive/planning_minutes/plancomm_min12-14-09.pdf)
- [11-17-09](/archive/planning_minutes/plancomm_min11-17-09.pdf)
- [10-20-09](/archive/planning_minutes/plancomm_min10-20-09.pdf)
- [8-18-09](/archive/planning_minutes/plancomm_min8-18-09.pdf)
- [7-21-09](/archive/planning_minutes/plancomm_min7-21-09.pdf)
- [6-16-09](/archive/planning_minutes/plancomm_min6-16-09.pdf)
- [4-28-09](/archive/planning_minutes/plancomm_min4-28-09.pdf)
- [4-21-09](/archive/planning_minutes/plancomm_min4-21-09.pdf)
- [3-17-09](/archive/planning_minutes/plancomm_min3-17-09.pdf)
- [1-20-09](/archive/planning_minutes/plancomm_min1-20-09.pdf)
- [10-21-08](/archive/planning_minutes/plancomm_min10-21-08.pdf)
- [7-15-08](/archive/planning_minutes/plancomm_min7-15-08.pdf)
- [6-17-08](/archive/planning_minutes/plancomm_min6-17-08.pdf)
- [2-19-08](/archive/planning_minutes/plancomm_min2-19-08.pdf)

#### ZBA Minutes (Approved)

These minutes are approved. Approval does not happen until there is another variance request.

- [8-20-10](/archive/zoning_minutes/zba_min8-20-10.pdf)
- [6-25-10](/archive/zoning_minutes/zba_min6-25-10.pdf)
- [5-7-10](/archive/zoning_minutes/zba_min5-7-10.pdf)
- [3-12-10](/archive/zoning_minutes/zba_min3-12-10.pdf)
- [6-2-09](/archive/zoning_minutes/zba_min6-2-09.pdf)
- [7-28-08 and 7-29-08](/archive/zoning_minutes/zba_min7-28-08and7-29-08.pdf)
- [5-20-08](/archive/zoning_minutes/zba_min5-20-08.pdf)', 'Planning & Zoning', 'Commissions', NULL, false, 999, 'published', '2026-01-14T00:00:00.000Z'::timestamptz, now(), now()),
('zba', 'Zoning Board of Appeals', 'Zoning Board of Appeals information, meeting minutes, and variance applications', '## Zoning Board of Appeals

[Zoning Board of Appeals Bylaws](/docs/zba_bylaws.pdf)

### Key Documents

- [Zoning Ordinance](/zoning) — available at Township Hall or by request
- [Township Zoning Map](/zoning.map.pdf)

### Related Forms

Both the Building Permit and the Zoning Permit are needed to begin a building project.

- [Zoning Permit Application](/forms/zoning_permit.pdf)
- [Zoning Permit Application for Recreational Vehicles and Temporary Storage Structures on a Vacant Lot](/forms/zoning_permit_rv.pdf)
- [Building Permit Application Form and Fees](/forms/building_permit.pdf)
- [ZBA Application for Variance Form](/forms/zoning_variance_app.pdf)
- [Ordinance Violation Report Form](/forms/zoning_complaint.pdf) — [Violation Report Form Procedures](/docs/zoning_complaint_procedure.pdf)
- [Petition for Text Amendment to Ordinance](/forms/petition_ordinance_change.pdf)
- [Parcel Division Application](/forms/parcel_division_app.pdf)
- [Special Exemption Use Permit](/forms/special_use_permit.pdf)
- [Home Occupation Permit](/forms/home_occupation_permit.pdf)

### ZBA Meeting Minutes

ONLY Approved Minutes may be posted (approval does not happen until there is another variance request).

#### Zoning Ordinance Initiative Meeting Minutes: 2015

- [Meeting Minutes 5/12/2015](/docs/zoning_ord_creation/landplan_blueprint_meeting_minutes5-12-15.pdf) — posted 7/1/2015
- [Meeting Minutes 4/27/2015](/docs/zoning_ord_creation/landplan_blueprint_meeting_minutes4-27-15.pdf) — posted 7/1/2015
- [Meeting Minutes 2/23/2015](/docs/zoning_ord_creation/landplan_blueprint_meeting_minutes2-23-15.pdf) — posted 7/1/2015

---

### Archive: 2008-2010 ZBA Minutes

These minutes are approved (approval does not happen until there is another variance request).

- [8-20-10](/archive/zoning_minutes/zba_min8-20-10.pdf)
- [6-25-10](/archive/zoning_minutes/zba_min6-25-10.pdf)
- [5-7-10](/archive/zoning_minutes/zba_min5-7-10.pdf)
- [3-12-10](/archive/zoning_minutes/zba_min3-12-10.pdf)
- [6-2-09](/archive/zoning_minutes/zba_min6-2-09.pdf)
- [7-28-08 and 7-29-08](/archive/zoning_minutes/zba_min7-28-08and7-29-08.pdf)
- [5-20-08](/archive/zoning_minutes/zba_min5-20-08.pdf)', 'Planning & Zoning', 'Commissions', NULL, false, 120, 'published', '2025-01-19T00:00:00.000Z'::timestamptz, now(), now()),
('zoning', 'Lincoln Township Zoning', 'Zoning ordinances, permits, and planning information for Lincoln Township', '## Planning Commission / Zoning Board

*[Get Answers to Frequently Asked Questions about Zoning.](/faq#zoning)*

Lincoln Township is in the process of creating a wholly new Zoning Ordinance.
Click HERE to follow this process.

### Planning Commission

- Phil Blisdell, Chair
- Jim Ostrowski, Vice Chair
- Gary Szczepanski, Secretary
- Tami McCaslin, ZBA ex Officio
- Mike Tobin, Township Board ex Officio

### Zoning Administrator

**Dick Hassberger**
- Phone: (989) 588-9841 ext. 5
- Email: [zoning@lincolntwp.com](mailto:zoning@lincolntwp.com)

### Building Inspector

- Phone: (989) 539-2761

### Key Documents

- Lincoln Township Master Plan
- Zoning Ordinance — available at Township Hall or by request. Contact Dick Hassberger at (989) 588-9841 ext. 5.
- [Zoning Map](/zoning.map.pdf)

### Meeting Minutes

- [ZBA Meeting Minutes](/zba-plancomm-minutes)
- [Planning Commission Meeting Minutes](/zba-plancomm-minutes)

### Zoning Forms

- ZBA Application for Variance Form
- Zoning Complaint Form
- Zoning Permit Application
- Parcel Division Application
- Conditional Rezoning Application — Conditional Rezoning Procedure Information
- Special Exemption Use Permit
- Home Occupation Permit
- Building Permit Application Form and Fees

**Both the Building Permit and the Zoning Permit are needed to begin a building project.**

### Soil Erosion Resources

- [Clare County Soil Erosion Information](http://www.clarecd.org/) (Clare Conservation District Website)
- [Soil Erosion and Sedimentation Control Permit Filing Schedule](http://www.clarecd.org/Soil%20Erosion/soil%20erosion%20app%2010-1-10.pdf)', 'Planning & Zoning', 'Regulations', NULL, false, 21, 'published', '2025-01-19T00:00:00.000Z'::timestamptz, now(), now())
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  body = EXCLUDED.body,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  nav_title = EXCLUDED.nav_title,
  hide_from_nav = EXCLUDED.hide_from_nav,
  display_order = EXCLUDED.display_order,
  status = EXCLUDED.status,
  last_updated = EXCLUDED.last_updated,
  published_at = EXCLUDED.published_at;

INSERT INTO public.partner_pages (partner_id, slug, title, body, tab_slug, display_order, status, created_at, published_at)
VALUES
(horn_id, 'about-the-horn', 'The Horn', '## Community Club & Center

The Horn is a nonprofit community space designed to bring people together. Housed in the historic former Lake George Grocery building, The Horn is a place to connect, host gatherings, attend events, and simply spend time in good company — a space rooted in belonging.

Open to the public daily from **10 AM – 2 PM**, and available to members **24/7**.

### Our Story

The building was purchased in 2021 and underwent extensive renovation to transform it from the old Lake George Grocery into a welcoming community space. The Horn soft launched in 2022 with a simple goal: give people a place where they belong.

The renovation preserved the character of this historic village building while creating a flexible space for socializing, events, and community connection.

### What We Offer

- **Members-Only Club** — 24/7 access to a private community space with games, Wi-Fi, kitchen, and more
- **VIP Lounge** — An adults-only space for members who want to BYOB and smoke indoors
- **Community Gathering Space** — A welcoming place to connect with neighbors and friends during public hours
- **Events & Entertainment** — Game nights, bonfire nights, potlucks, and community programming year-round with discounted member rates
- **Late-Night Safe Space** — A comfortable place to hang out when everywhere else is closed
- **Work-Friendly Environment** — Free Wi-Fi and a quiet daytime setup for remote work and projects

### Become a Member

The Horn offers individual, couple, and family memberships starting at **$40/month**, with an optional VIP add-on for **$20/month** more. Members get 24/7 key access, discounted event rates, exclusive events, and a real community.

Memberships launch **Memorial Weekend** — sign up early at **[horn.love](https://horn.love)**.

**[See Membership Details & Pricing](/membership)**

### Events

Check our [events page](/events-horn) for what''s coming up at The Horn.

### Hours & Contact

Open to the public **10 AM – 2 PM daily**. Members have 24/7 access.

For location and contact details, visit our [hours & contact page](/hours-horn).

### Part of the Community

The Horn is part of the Unicorn Gives community network, working alongside:
- [Unicorn Gives](/about-unicorn-gives)
- [The Mane](/about-the-mane)', 'about', 24, 'published', now(), now()),
(horn_id, 'events-horn', 'Events at The Horn', '## Events at The Horn

The Horn hosts a variety of community events and gatherings in the heart of Lake George. From markets and meetups to workshops and celebrations, there is always something in the works.

### Recurring Events

**Lincoln Township Gardening Club**
Every Saturday, 9:00 AM. Weekly hands-on gardening meetups with seed swaps, tips, and community plot maintenance. On the first Saturday of each month, a special class is held on topics like composting, native Michigan plants, container gardening, and seasonal planning. Free and open to all skill levels — beginners welcome. [Read the full announcement](/news/gardening-club-launches)

### Upcoming Events

Additional events will be posted here as they are scheduled. Subscribe to stay in the loop.

### Host Your Event

The Horn''s space is available for community events and private bookings. Whether you are planning a meeting, a workshop, a celebration, or something else entirely, reach out to inquire about availability and details.

### Stay Updated

The best way to hear about new events is to subscribe to our mailing list:
- **[Subscribe for event announcements](/subscribe)**

You can also follow along on social media or check back here regularly.

### More

- [Community Events Calendar](/events)
- [About The Horn](/about-the-horn)
- [News & Updates](/news)', 'events', 25, 'published', now(), now()),
(horn_id, 'hours-horn', 'The Horn — Hours & Contact', '## Hours & Access

### Public Hours

The Horn is open to everyone — no membership required — during public hours:

**10:00 AM – 2:00 PM, Daily**

Stop by to check out the space, browse artisan goods, or just hang out. Everyone is welcome.

### Member Access

Members enjoy **24/7 key access**, 365 days a year. Your place, anytime.

Free parking is available around the clock.

**[Become a Member →](/membership)**

---

## Location

The Horn is located in the historic former Lake George Grocery building in Lake George, MI.

---

## Stay in the Loop

The best way to stay up to date on hours, events, and what''s happening at The Horn:
- **Subscribe** to our mailing list at [/subscribe](/subscribe) for announcements
- Follow us on social media for the latest updates

---

## Find Us

- [About The Horn](/about-the-horn)
- [Events at The Horn](/events-horn)
- [Become a Member](/membership)', 'hours', 27, 'published', now(), now()),
(horn_id, 'membership', 'Join The Horn', '## Your Place. Anytime.

The Horn is a nonprofit community space designed to bring people together — a place rooted in belonging. Members get 24/7 access to a space where you can work during the day, unwind at night, and connect with like-minded people any time in between.

Whether you''re looking for a late-night safe hangout, a quiet space to be productive, or a crew to share a bonfire with — this is it. No cover. No closing time. Just your place.

The community you''ve been waiting for is ready to welcome you.

---

## Membership Plans

| | Individual | Couple / +1 | Family |
|---|---|---|---|
| **Monthly** | **$40/mo** | **$60/mo** | **$100/mo** |
| Members | 1 | 2 | Up to 4 |
| 24/7 Key Access | ✓ | ✓ | ✓ |
| All Member Benefits | ✓ | ✓ | ✓ |
| Discounted Event Rates | ✓ | ✓ | ✓ |
| Bring a Guest | ✓ | ✓ | ✓ |

### Add VIP — $20/mo extra

Want more? Add VIP to any membership for just **$20 extra per month**. VIP unlocks the **adults-only space** — also open 24/7 — where you can bring your own drinks and smoke indoors. A private space within the space.

> **Not a member yet?** The Horn is open to the public daily from **10 AM – 2 PM**. Stop by, see the space, and meet the community before you commit.

---

## What You Get

### 24/7 Access
This is your place — come anytime, day or night. Members get key access around the clock, 365 days a year. Work from here during the day. Hang out after midnight. It''s always open for you.

### Members-Only Cigar Lounge
A dedicated lounge space for members to relax, socialize, and enjoy. Step away from the noise and settle in.

### Free Wi-Fi & Work-Friendly Space
Need a place to get things done? The Horn has reliable Wi-Fi and a comfortable setup for remote work, studying, or creative projects. Productive days, relaxed nights — all under one roof.

### Late-Night Safe Hangout
A safe, welcoming place to be after 2 AM. No bar scene, no pressure — just good company and a comfortable space when everywhere else is closed.

### Game Nights & Entertainment
Board games, video games, TVs, and music — all available to members. Regular game nights bring the community together for some friendly competition.

### Discounted Event Rates
Members enjoy discounted rates on events at The Horn — whether you''re celebrating a birthday, hosting a gathering, or joining one of our special community events.

### Events — Indoors & Out
Bonfire nights, seasonal gatherings, potlucks, and more. Members get access to exclusive events plus priority for all public programming at The Horn.

### Bring a Guest
Members can bring a guest to share the experience. Show a friend what The Horn is all about.

### Food & Kitchen Access
Members can use the kitchen for their own food prep and customization. We also host occasional potluck nights where the community comes together over a shared table.

### Free Parking (24/7)
Dedicated parking available around the clock — no meters, no hassle, no matter what time you stop by.

### Exclusive Community
This isn''t just a membership — it''s a community. Connect with your neighbors, meet new people, and be part of something that''s genuinely ours.

---

## Why People Join

- **"This is my place."** — A space that feels like yours, not someone else''s business
- **Late-night safe space** — Somewhere to go when everything else is closed
- **Social connection** — Meet like-minded people and build real friendships
- **Escape boredom & loneliness** — There''s always something to do and someone to hang with
- **Productivity + escape** — Work during the day, chill at night
- **Be part of something** — An exclusive community built by and for people in Lake George

---

## Sign Up Early

Memberships are launching by **Memorial Weekend** — but you don''t have to wait. Sign up early at **[horn.love](https://horn.love)** to unlock your spot.

You can also visit The Horn during public hours (**10 AM – 2 PM daily**) to see the space and sign up in person.

**[Sign Up at horn.love](https://horn.love)** · **[Contact Us](/hours-horn)** · **[Events at The Horn](/events-horn)** · **[About The Horn](/about-the-horn)**', 'membership', 26, 'published', now(), now())
ON CONFLICT (partner_id, slug) DO UPDATE SET title = EXCLUDED.title, body = EXCLUDED.body;

INSERT INTO public.partner_pages (partner_id, slug, title, body, tab_slug, display_order, status, created_at, published_at)
VALUES
(mane_id, 'about-the-mane', 'The Mane', '## The Mane — Boutique Salon

The Mane is a full-service salon located at 300 Lake George St in the village of Lake George, Michigan. We offer hair, color, nail, and beauty services in a welcoming, community-focused environment.

### Our Story

Originally established in 2005 as Expressions Hair Studio, the salon was rebranded in 2021 under new ownership by Hanna Unicorn. The Mane carries forward a long tradition of quality hair care in Lake George while bringing a fresh commitment to organic, high-quality products and community connection.

### What Sets Us Apart

We use trusted, professional-grade brands including **All-Nutrient**, **Sukesha**, and **I.N.O.** — products chosen for their quality ingredients and results. Our stylists and technicians take the time to understand what each client needs, whether that is a quick trim or a complete color transformation.

### Services

We offer a full range of hair services — cuts, color, highlights, perms, styling, and waxing — along with a complete nail services menu including acrylics, gel, manicures, and pedicures. Visit our [services page](/services-mane) for the full menu and pricing.

### Now Hiring

The Mane is currently hiring licensed stylists and barbers. If you are passionate about your craft and want to be part of a community-focused salon, reach out to learn about opportunities.

### Book an Appointment

Ready to book? Visit our [appointment page](/book-appointment) to schedule your visit online or by phone.

### Hours & Contact

For hours, location, and contact details, visit our [hours & contact page](/hours-mane).

### Part of the Community

The Mane is part of the Unicorn Gives community network in Lake George, working alongside:
- [Unicorn Gives](/about-unicorn-gives)
- [The Horn](/about-the-horn)', 'about', 28, 'published', now(), now()),
(mane_id, 'book-appointment', 'Book an Appointment', '## Book an Appointment

Schedule your visit to The Mane in Lake George, MI.

### Online Booking

Book your appointment online through **Square Appointments** at any time. Select your stylist or technician, choose your service, and pick a time that works for you.

### Call to Book

Prefer to book by phone? Call us at **(989) 588-6988** during business hours and we will get you on the schedule.

### Email

You can also reach us at **hanna@unicorn.love** with questions or booking requests.

### Walk-Ins

Walk-ins are welcome based on availability. For the best chance of getting in same-day, we recommend calling ahead.

### Before Your Visit

- View our [service menu](/services-mane) to plan your visit
- Check our [hours & contact page](/hours-mane) for availability

### Cancellation Policy

We ask that you provide **24 hours notice** if you need to cancel or reschedule your appointment. This allows us to offer the time slot to other clients. Thank you for being considerate of our team''s time.', 'book', 30, 'published', now(), now()),
(mane_id, 'hours-mane', 'The Mane — Hours & Contact', '## Hours & Contact

### Location

300 Lake George St
Lake George, MI 48633

### Hours

Hours may vary. Call ahead or book online for the most up-to-date availability.

### Contact

- **Phone:** (989) 588-6988
- **Email:** hanna@unicorn.love
- **Online Booking:** Available through Square Appointments — visit our [appointment page](/book-appointment)

### Social Media

Follow us for updates, inspiration, and appointment openings:
- **Facebook:** @themane.lg
- **Instagram:** @themane.lg

### Find Us

- [About The Mane](/about-the-mane)
- [Our Services](/services-mane)
- [Book an Appointment](/book-appointment)', 'hours', 31, 'published', now(), now()),
(mane_id, 'services-mane', 'The Mane — Services', '## Our Services

The Mane offers a full range of hair and nail services at our Lake George salon. All hair services use professional-grade products from All-Nutrient, Sukesha, and I.N.O.

### Our Team

- **Hanna Unicorn** — Owner & Stylist. Licensed in 2016, MJ Murphy Beauty College.
- **Hannah "Eileen" Herd** — Nail Technician. Licensed in 2023, MJ Murphy Beauty College. Joined The Mane in 2022.
- **Katie McComber** — Stylist. Licensed in 2022, Protege Academy. Specializes in personalized color work.

---

### Hair Services

#### Cuts & Grooming
| Service | Price |
|---|---|
| Buzz Cut | $15 |
| Clipper Cut | $20 |
| Scissor Cut | $25 |
| Beard Trim | $10 |
| Bang Trim | $10 |
| Kids Cut | $15 - $20 |

#### Color
| Service | Price |
|---|---|
| Root Touch-Up | $55 |
| All-Over Color | $65+ |
| Partial Highlights | $75+ |
| Full Highlights | $95+ |
| Color Correction | $95+/hr |

#### Styling & Treatments
| Service | Price |
|---|---|
| Perm | $65+ |
| Up-Do | $45+ |
| Special Occasion Style | $55+ |
| Deep Conditioning Treatment | $15 - $25 |
| Scalp Massage | $15 |
| Gloss / Glaze | $35 - $45 |

#### Waxing
| Service | Price |
|---|---|
| Eyebrow Wax | $10 |
| Lip or Chin Wax | $10 |

---

### Nail Services

#### Acrylic Nails
| Service | Price |
|---|---|
| Full Set Acrylics | $35 |
| Acrylic Fill | $23 |
| Acrylic Overlay | $30 |

#### Gel Nails
| Service | Price |
|---|---|
| Hard Gel Full Set | $40 |
| Hard Gel Fill | $23 |
| Gel Overlay | $35 |
| Builder Gel | $49 |

#### Manicures
| Service | Price |
|---|---|
| Classic Manicure | $20 |
| Gel Manicure | $30 |
| Deluxe Manicure | $37 |

#### Pedicures
| Service | Price |
|---|---|
| Classic Pedicure | $35 |
| Gel Pedicure | $40 |
| Deluxe Pedicure | $45 |

#### Add-Ons
| Add-On | Price |
|---|---|
| Gel Polish Upgrade | $10 |
| Nail Art | from $5 |
| Gems / Decals | $1 - $3 |
| French Tips | $5 |
| Soak Off | $10 - $20 |

---

### eGift Cards

eGift Cards are available starting at $10 — a great option for birthdays, holidays, or just because. Ask in-salon or contact us for details.

### Book an Appointment

Ready to schedule? Visit our [appointment page](/book-appointment) or call (989) 588-6988.

### Contact

For questions about our services, visit our [hours & contact page](/hours-mane).', 'services', 29, 'published', now(), now())
ON CONFLICT (partner_id, slug) DO UPDATE SET title = EXCLUDED.title, body = EXCLUDED.body;



END $$;
